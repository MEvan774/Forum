import { Controller } from "./Controller";
import { NavController } from "./NavController";
import { FooterController } from "./FooterController";
import { Answer } from "../models/Answer";
import { url } from "@hboictcloud/api";

export class AnswerEditorController extends Controller {
    private _navController: NavController = new NavController(document.querySelector(".navbar")!);
    private _footerController: FooterController = new FooterController(document.querySelector(".footerbar")!);

    public constructor(view: HTMLElement) {
        super(view);
    };

    public render(): void {
        this._navController.render();
        this._footerController.render();
        void this.retrieveAnswers();
    };

    private async retrieveAnswers(): Promise<void> {
        const idAnswer: number | null = url.getFromQueryString("id", null) as number | null;
        if (idAnswer === null) {
            console.error("No answer ID found in URL");
        }
        else {
            const answer: Answer | null = await Answer.getAnswerById(idAnswer);
            if (answer !== null) {
                this.displayAnswers(answer);
            }
        };
    };

    private displayAnswers(answer: Answer): void {
        const description: HTMLTextAreaElement = document.getElementById("description") as HTMLTextAreaElement;
        description.value = answer.description;

        const code: HTMLTextAreaElement = document.getElementById("code") as HTMLTextAreaElement;
        code.value = answer.code;
    }

    public test(): void {
        const saveButton: HTMLButtonElement = document.getElementById("save-answer") as HTMLButtonElement;
        saveButton.addEventListener("click", (event: Event) => {
            event.preventDefault();

            const codeAnswer: HTMLTextAreaElement = document.getElementById("code") as HTMLTextAreaElement;

            const codeBlock: HTMLElement = document.getElementById("code-block") as HTMLElement;
            codeBlock.innerText = codeAnswer.value;
        });
    }
};
