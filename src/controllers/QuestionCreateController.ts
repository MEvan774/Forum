import { Controller } from "./Controller";
// import { LoggedIn } from "../models/LoggedIn";
// import { session } from "@hboictcloud/api";

export class QuestionCreateController extends Controller {
    public constructor(view: HTMLElement) {
        super(view);
    }

    public render(): void {
        this.view.addEventListener("click", () => {
            this.createForm();
            const createQuestionButton: HTMLButtonElement =
            document.querySelector(".button-create-question")!;
            createQuestionButton.addEventListener("click", () => {
                this.createQuestion();
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
        formElement.classList.add(".question-form");

        // Creates input element for question description
        const inputElement: HTMLInputElement = document.createElement("input");
        inputElement.setAttribute("placeholder", "Schrijf hier je vraag!"); // Adds placeholder text
        inputElement.classList.add(".question-create-form");

        // Creates input element for question snippet
        const snippetElement: HTMLInputElement = document.createElement("input");
        // Adds placeholder text
        snippetElement.setAttribute("placeholder", "Voeg hier een snippet van je code toe!");
        snippetElement.classList.add(".question-create-form");

        // Creates button
        const createQuestionButton: HTMLButtonElement = document.createElement("button");
        createQuestionButton.classList.add(".button-create-question");
        createQuestionButton.innerText = "Submit!";

        // Adds the input and button as child elements to the form
        formElement.appendChild(inputElement);
        formElement.appendChild(snippetElement);
        formElement.appendChild(createQuestionButton);

        // Adds the form as a child to the main container
        formContainer.appendChild(formElement);
    }

    private createQuestion(): void {

    }
}
