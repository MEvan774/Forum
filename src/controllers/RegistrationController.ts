import { Controller } from "./Controller";
import { User } from "../models/User";

export class RegisterController extends Controller {
    public constructor(view: HTMLElement) {
        super(view);
    }

    public render(): void {
        this.view.addEventListener("click", (event: Event) => {
            event.preventDefault();
            this.onClickRegister();
        });
    }

    private onClickRegister(): void {
        void User.registrateUser();
    }
}
