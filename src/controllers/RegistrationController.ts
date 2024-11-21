import { Controller } from "./Controller";
import { User } from "../models/User";

export class RegisterController extends Controller {
    public constructor(view: HTMLElement) {
        super(view);
    }

    public render(): void {
        this.view.addEventListener("click", (event: Event) => {
            event.preventDefault();
            void this.onClickRegister();
        });
    }

    private async validateInputs(userName: HTMLInputElement, email: HTMLInputElement, password: HTMLInputElement): Promise<boolean> {
        let valid: boolean = true;

        if (userName.value === "") {
            User.setErrorMessage(userName, "Please enter a username.");
            valid = false;
        }
        else if (userName.value.includes("@")) {
            User.setErrorMessage(userName, "Username cannot contain '@'.");
            valid = false;
        }
        else {
            const userNameExists: boolean = await User.checkIfUsernameExists(userName.value);
            if (userNameExists) {
                User.setErrorMessage(userName, "Username is already in use.");
                valid = false;
            }
            else {
                User.clearErrorMessage(userName);
            }
        }
        if (email.value === "") {
            User.setErrorMessage(email, "Please enter an email address.");
            valid = false;
        }
        else if (!User.validEmail(email.value)) {
            User.setErrorMessage(email, "Please enter a valid email address.");
            valid = false;
        }
        else {
            const emailExists: boolean = await User.checkIfEmailExists(email.value);
            if (emailExists) {
                User.setErrorMessage(email, "Email address is already in use.");
                valid = false;
            }
            else {
                User.clearErrorMessage(email);
            }
        }
        if (password.value === "") {
            User.setErrorMessage(password, "Please enter a password.");
            valid = false;
        }
        else if (password.value.length < 8) {
            User.setErrorMessage(password, "Password must be at least 8 characters long.");
            valid = false;
        }
        else {
            User.clearErrorMessage(password);
        }
        return valid;
    };

    private async onClickRegister(): Promise<void> {
        const userName: HTMLInputElement = document.querySelector("#input-username")!;
        const email: HTMLInputElement = document.querySelector("#input-email")!;
        const password: HTMLInputElement = document.querySelector("#input-password")!;

        const validRegistrationInput: boolean = await this.validateInputs(userName, email, password);
        if (validRegistrationInput) {
            void User.setUser(userName.value, email.value, password.value);
            void User.sendEmail(userName.value, email.value);
            const idUser: number | null = await User.getIdByUser(userName.value, "userName");
            if (idUser === null) {
                console.error("User not found");
                return;
            }
            User.setCurrentlyLoggedInUser(userName.value, idUser);
            window.location.href = "/index.html";
        }
    }
}
