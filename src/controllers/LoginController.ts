import { Controller } from "../controllers/Controller";
import { User } from "../models/User";

export class LoginController extends Controller {
    public constructor(view: HTMLElement) {
        super(view);
    }

    public render(): void {
        this.view.addEventListener("click", () => {
            const username: HTMLInputElement = document.querySelector("#username-email-input") as HTMLInputElement;
            const password: HTMLInputElement = document.querySelector("#password-input") as HTMLInputElement;

            sessionStorage.setItem("inputUsername", username.value);
            sessionStorage.setItem("inputPassword", password.value);
            this.loginUser();
        });
    }

    private loginUser(): void {
        console.log("Form submitted.");
        

    }
}
