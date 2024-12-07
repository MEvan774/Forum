import { Controller } from "./Controller";
import { CodeTag } from "../models/CodeTag";
import { CODELANGUAGE } from "../models/CodeLanguage";
import { LoggedIn } from "../models/LoggedIn";
import { session } from "@hboictcloud/api";
import { Question } from "../models/Question";

export class QuestionCreateController extends Controller {
    private inputElement!: HTMLTextAreaElement;
    private titleElement!: HTMLTextAreaElement;
    private snippetElement!: HTMLTextAreaElement;

    public constructor(view: HTMLElement) {
        super(view);
    }

    public render(): void {
        this.view.addEventListener("click", () => {
            this.createForm();
            const createQuestionButton: HTMLButtonElement =
                document.querySelector(".button-create-question")!;
            createQuestionButton.addEventListener("click", event => {
                event.preventDefault(); // Prevents form submission and page reload
                void this.createQuestion();
            });
        });
    }

    // Creates a form with a text input field and a submit button
    private createForm(): void {
        const formContainer: HTMLDivElement = this.view.parentElement as HTMLDivElement;

        // Removes the original button
        const createFormButton: HTMLButtonElement = document.querySelector(".button-create-form")!;
        createFormButton.remove();

        // Creates form element
        const formElement: HTMLFormElement = document.createElement("form");
        formElement.classList.add("question-form");

        // Creates textarea element for question description
        this.titleElement = document.createElement("textarea");
        this.titleElement.setAttribute("placeholder", "Schrijf hier de titel van je vraag!"); // Adds placeholder text
        this.titleElement.classList.add("question-title-form");
        this.titleElement.style.resize = "vertical"; // Allow vertical resizing
        this.titleElement.style.overflowY = "auto"; // Vertical scrollbar when needed
        this.titleElement.style.overflowX = "hidden"; // Prevent horizontal scrollbar
        this.titleElement.style.whiteSpace = "pre-wrap"; // Preserve whitespace and wrap text

        // Creates textarea element for question description
        this.inputElement = document.createElement("textarea");

        // Add attributes
        this.inputElement.setAttribute("placeholder", "Schrijf hier je vraag!");
        this.inputElement.cols = 14; // Width in terms of character columns
        this.inputElement.rows = 2; // Height in terms of lines (adjust as needed)

        // Add CSS for scrollbar and wrapping
        this.inputElement.style.resize = "vertical"; // Allow vertical resizing
        this.inputElement.style.overflowY = "auto"; // Vertical scrollbar when needed
        this.inputElement.style.overflowX = "hidden"; // Prevent horizontal scrollbar
        this.inputElement.style.whiteSpace = "pre-wrap"; // Preserve whitespace and wrap text

        // Add CSS class if needed
        this.inputElement.classList.add("question-description-form");

        // Creates textarea element for question snippet
        this.snippetElement = document.createElement("textarea");
        this.snippetElement.setAttribute("placeholder", "Voeg hier een snippet van je code toe!"); // Adds placeholder text
        this.snippetElement.classList.add("question-code-form");
        this.snippetElement.cols = 14;
        this.snippetElement.rows = 20;
        this.snippetElement.style.resize = "vertical"; // Allow vertical resizing
        this.snippetElement.style.overflowY = "auto"; // Vertical scrollbar when needed
        this.snippetElement.style.overflowX = "hidden"; // Prevent horizontal scrollbar
        this.snippetElement.style.whiteSpace = "pre-wrap"; // Preserve whitespace and wrap text

        // Creates button
        const createQuestionButton: HTMLButtonElement = document.createElement("button");
        createQuestionButton.setAttribute("type", "button"); // Set button type explicitly
        createQuestionButton.classList.add("button-create-question");
        createQuestionButton.innerText = "Plaats je vraag!";

        const tagButtons: HTMLElement = document.createElement("div");
        tagButtons.innerHTML = `
                    <div class="tag-container">
                <label>
                    <input type="radio" name="language" value="JavaScript" checked>
                    JavaScript
                </label>
                <label>
                    <input type="radio" name="language" value="Python">
                    Python
                </label>
                <label>
                    <input type="radio" name="language" value="TypeScript">
                    TypeScript
                </label>
                <label>
                    <input type="radio" name="language" value="HTML">
                    HTML
                </label>
                <label>
                    <input type="radio" name="language" value="CSS">
                    CSS
                </label>
            </div>`;

        // Adds the input and button as child elements to the form
        formElement.appendChild(this.titleElement);
        formElement.appendChild(this.inputElement);
        formElement.appendChild(this.snippetElement);
        formElement.appendChild(createQuestionButton);
        formElement.appendChild(tagButtons);

        // Adds the form as a child to the main container
        formContainer.appendChild(formElement);
    }

    /**
     * Checks if question input is valid and creates a question
     * @author Milan
     */
    private async createQuestion(): Promise<void> {
        try {
            let idQuestion: number = 0;
            const loggedIn: LoggedIn = session.get("LoggedIn") as LoggedIn;
            if (loggedIn.isLoggedIn) {
                if (!this.inputElement.value) {
                    alert("Uw antwoord mag niet leeg zijn!");
                    return; // Exit the function if the description is empty
                }
                if (!this.titleElement.value) {
                    alert("Uw titel mag niet leeg zijn!");
                    return; // Exit the function if the description is empty
                }

                const result: boolean = confirm("Weet je zeker of je deze bericht wilt sturen?");
                if (result) {
                    if (this.snippetElement.value)
                        await this.postQuestion(loggedIn, this.titleElement.value,
                            this.inputElement.value, this.snippetElement.value);
                    else
                        await this.postQuestion(loggedIn, this.titleElement.value,
                            this.inputElement.value, "");

                    // gets id from the answer so it can be used to assign the code tag to the answer

                    const _codeTagTypes: NodeListOf<HTMLInputElement> =
                    document.querySelectorAll(".tag-container input[type='radio']");
                    idQuestion = await this.getQuestionId();

                    for (const radio of Array.from(_codeTagTypes)) {
                        const input: HTMLInputElement = radio;
                        if (input.checked) {
                            console.log(input.value);
                            console.log(idQuestion);
                            await CodeTag.setCodeTagQuestion(input.value as CODELANGUAGE, idQuestion);
                        }
                    }

                    console.log("ANSWER POSTED!");
                }
                else
                    console.log("Post stopped!");
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

    private async postQuestion(loggedIn: LoggedIn, title: string, description: string, code: string):
    Promise<void> {
        try {
            await Question.setQuestion(title, description, loggedIn.userId, code);
        }
        catch (reason) {
            console.log(reason);
        }
    }

    /**
    * Gets the anwser id from the last posted answer
    * @param returns answerID of the last posted answer
    */

    private async getQuestionId(): Promise<number> {
        try {
            const questionID: number = await Question.getLastQuestionId();
            return questionID;
        }
        catch (reason) {
            console.log(reason);
            return 0;
        }
    }
}
