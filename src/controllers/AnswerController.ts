import { Controller } from "./Controller";
import { Answer } from "../models/Answer";
import { LoggedIn } from "../models/LoggedIn";
import { session } from "@hboictcloud/api";
import { url } from "@hboictcloud/api";
import { CodeTag } from "../models/CodeTag";
import { CODELANGUAGE } from "../models/CodeLanguage";

export class AnswerController extends Controller {
    private _codeTagTypes: NodeListOf<HTMLInputElement> =
        document.querySelectorAll(".tag-container input[type='radio']");

    private _answerCodeInput: HTMLTextAreaElement = document.querySelector("#addCode")!;

    public constructor(view: HTMLElement) {
        super(view);
    }

    public render(): void {
        this.view.addEventListener("click", () => {
            void this.onClickPost();
        });
        AnswerController.tabEventListener(this._answerCodeInput);
    }

    /**
     * zorgt ervoor dat de tab knop functioneert in een code input vekd
     * @param codeInput de code input veld waar de tab knop in moet werken
     * @author Koen
     */
    public static tabEventListener(codeInput: HTMLTextAreaElement): void {
        codeInput.addEventListener("keydown", (e: KeyboardEvent) => {
            if (e.key === "Tab") {
                e.preventDefault();
                const textArea: HTMLTextAreaElement = e.target as HTMLTextAreaElement;
                textArea.setRangeText(
                    "\t",
                    textArea.selectionStart,
                    textArea.selectionEnd,
                    "end"
                );
            }
        });
    }

    /**
     * Functionality of the post answer button, checks if user is logged in and if any input is present in
     * the @param description and sends the answer when both values are valid. It also checks the
     * @param code value if the user has put in some code and adds code snippets if it has ipnut.
     */

    private async onClickPost(): Promise<void> {
        try {
            let idAnswer: number = 0;
            const loggedIn: LoggedIn = session.get("LoggedIn") as LoggedIn;
            if (loggedIn.isLoggedIn) {
                const description: HTMLInputElement = document.querySelector("#addAnswer")!;
                if (!description.value) {
                    alert("Uw antwoord mag niet leeg zijn!");
                    return; // Exit the function if the description is empty
                }

                const result: boolean = confirm("Weet je zeker of je deze bericht wilt sturen?");
                if (result) {
                    const code: HTMLInputElement = document.querySelector("#addCode")!;
                    if (code.value) { // Posts answer to the model and continues the code when finished
                        await this.postAnswer(loggedIn, description.value, code.value);
                    }
                    else {
                        await this.postAnswer(loggedIn, description.value, "");
                    }

                    // gets id from the answer so it can be used to assign the code tag to the answer
                    idAnswer = await this.getAnswerId();

                    for (const radio of Array.from(this._codeTagTypes)) {
                        const input: HTMLInputElement = radio;
                        if (input.checked) {
                            console.log(input.value);
                            console.log(idAnswer);
                            await CodeTag.setCodeTag(input.value as CODELANGUAGE, idAnswer);
                        }
                    }

                    console.log("ANSWER POSTED!");
                    description.value = "";
                }
                else {
                    console.log("Post stopped!");
                }
            }
            else {
                alert("Alleen ingelogde gebruikers mogen reageren!");
                return; // Exit the function for non-logged-in users
            }
        }
        catch (error) {
            console.error("Error posting answer:", error);
            alert("Er is een fout opgetreden. Probeer het opnieuw!");
            return; // Prevent reloading if an error occurred
        }

        // Reloads the page after login is succesfull
        location.reload();
    }

    /*
    * Sents the answer data to the model so it gets send to the database
    */

    private async postAnswer(loggedIn: LoggedIn, description: string, code: string): Promise<void> {
        try {
            const idQuestion: number = url.getFromQueryString("id", 0) as number;
            await Answer.setAnswer(idQuestion, loggedIn.userId, description, code);
        }
        catch (reason) {
            console.log(reason);
        }
    }

    /**
    * Gets the anwser id from the last posted answer
    * @param returns answerID of the last posted answer
    */

    private async getAnswerId(): Promise<number> {
        try {
            const answerID: number = await Answer.getLastAnswerId();
            return answerID;
        }
        catch (reason) {
            console.log(reason);
            return 0;
        }
    }
}
