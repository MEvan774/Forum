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
        });
    }

    private createForm(): void {
        const formContainer: HTMLDivElement = this.view.parentElement as HTMLDivElement;

        const createFormButton: HTMLButtonElement = document.querySelector(".button-create-form")!;
        createFormButton.remove(); // Removes the original button

        // Adds the form and the child elements
        const formElement: HTMLFormElement = document.createElement("form");
        formElement.classList.add(".question-form");
        const labelElement: HTMLLabelElement = document.createElement("label");
        const inputElement: HTMLInputElement = document.createElement("input");
        const createQuestionButton: HTMLButtonElement = document.createElement("button");
        createQuestionButton.classList.add(".button-create-question");

        formElement.appendChild(labelElement);
        formElement.appendChild(inputElement);
        formElement.appendChild(createQuestionButton);

        formContainer.appendChild(formElement);
    }
}
