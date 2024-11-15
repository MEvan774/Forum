import { Controller } from "../controllers/Controller";
import { User } from "../models/User";

export class LoginController extends Controller {
    public constructor(view: HTMLElement) {
        super(view);
    }

    public render(): void {
        this.view.addEventListener("click", () => {
            void this.loginUser();
        });
    }

    private async loginUser(): Promise<void> {
        console.log("Form submitted.");
        const username: HTMLInputElement = document.querySelector("#username-email-input") as HTMLInputElement;
        const password: HTMLInputElement = document.querySelector("#password-input") as HTMLInputElement;
        const emailExists: boolean | undefined = await User.checkIfEmailExists(username.value);
        const userNameExists: boolean | undefined = await User.checkIfUsernameExists(username.value);
        if (emailExists) {
            const passwordMatches: boolean =
            await User.checkPasswordMatch(password.value, "email", username.value);
            if (passwordMatches) {
                User.clearErrorMessage(username);
                User.clearErrorMessage(password);
                User.setCurrentlyLoggedInUser(username.value);
            }
            else {
                User.setErrorMessage(username, "The username or password is incorrect!");
                User.setErrorMessage(password, "The username or password is incorrect!");
            }
        }
        else if (userNameExists) {
            const passwordMatches: boolean =
            await User.checkPasswordMatch(password.value, "name", username.value);
            if (passwordMatches) {
                User.clearErrorMessage(username);
                User.setCurrentlyLoggedInUser(username.value);
                console.log(`Logged in ${username.value}`);
            }
            else {
                User.setErrorMessage(username, "The username or password is incorrect!");
                User.setErrorMessage(password, "The username or password is incorrect!");
            }
        }
        else {
            User.setErrorMessage(username, "The username or password is incorrect!");
            User.setErrorMessage(password, "The username or password is incorrect!");
        }
    }
}
