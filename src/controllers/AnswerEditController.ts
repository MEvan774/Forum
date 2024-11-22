import { Controller } from "./Controller";
import { NavController } from "./NavController";
import { FooterController } from "./FooterController";

export class AnswerEditorController extends Controller {
    private _navController: NavController = new NavController(document.querySelector(".navbar")!);
    private _footerController: FooterController = new FooterController(document.querySelector(".footerbar")!);

    public constructor(view: HTMLElement) {
        super(view);
    };

    public render(): void {
        this._navController.render();
        this._footerController.render();
        this.test();
    };

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
