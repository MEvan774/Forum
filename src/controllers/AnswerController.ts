import { Controller } from "./Controller";
import { Answer } from "../models/Answer";
import { LoggedIn } from "../models/LoggedIn";
import { session } from "@hboictcloud/api";
import { url } from "@hboictcloud/api";

export class AnswerController extends Controller {
    public constructor(view: HTMLElement) {
        super(view);
    }

    public render(): void {
        // void this.returnQuestion();
        this.view.addEventListener("click", () => {
            this.onClickPost();
        });
    }

    private onClickPost(): void {
        try {
            const loggedIn: LoggedIn = session.get("LoggedIn") as LoggedIn;
            if (loggedIn.isLoggedIn) {
                const description: HTMLInputElement = document.querySelector("#addAnswer")!;
                // const validRegistrationInput: boolean = await this.validateInputs(userName, email, password);
                if (!description.value)
                    alert("Uw antwoord mag niet leeg zijn!");
                else {
                    const result: boolean = confirm("Weet je zeker of je deze bericht wilt sturen?"); // Displays the Yes/No dialog
                    if (result) {
                        const idQuestion: number = url.getFromQueryString("id", 0) as number;
                        void Answer.setAnswer(idQuestion, loggedIn.userId, description.value);
                        console.log("ANSWER POSTED!");
                        description.value = "";
                    }
                    else {
                        console.log("Post stopped!");
                    }
                }
            }
            else
                alert("Alleen ingelogde gebruikers mogen reageren!");
        }
        catch {
            alert("Alleen ingelogde gebruikers mogen reageren!");
        }
    }

    /*
    private async retrieveAnswers(idQuestion: number): Promise<void> {
        const questionsResult: Question[] = await Question.getAll();
        console.log(questionsResult);
        void this.displayQuestions(questionsResult);
    }

    private async PostAnswer(postedAnswer: Answer): Promise<void> {
        if(postedAnswer.description.length === 0)
            console.warn("Uw antwoord mag niet leeg zijn!");
    }
    */
}
