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
    };
};
