import { Controller } from "../controllers/Controller";
import { User } from "../models/User";

/**
 * Represents the controller object for login function
 */
export class LoginController extends Controller {
    public constructor(view: HTMLElement) {
        super(view);
    }

    public render(): void {
        this.view.addEventListener("click", () => {
            void this.loginUser();
        });
    }

    /**
     * Compares input values from user with values in the db and logs them in if they match.
     * Displays an error if either the email/username doesn't exist, or the password doesn't match.
     */

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
                const userId: number | null = await User.getIdByUser(username.value, "email");
                if (userId === null) {
                    console.error("User ID not found.");
                    return;
                }
                User.setCurrentlyLoggedInUser(username.value, userId);
            }
            else {
                User.setErrorMessage(username, "The username or password is incorrect!");
                User.setErrorMessage(password, "The username or password is incorrect!");
            }
        }
        else if (userNameExists) {
            const passwordMatches: boolean =
            await User.checkPasswordMatch(password.value, "userName", username.value);
            if (passwordMatches) {
                console.log("Password matches.");

                User.clearErrorMessage(username);
                const userId: number | null = await User.getIdByUser(username.value, "userName");
                if (userId === null) {
                    console.error("User ID not found.");
                    return;
                }
                User.setCurrentlyLoggedInUser(username.value, userId);
                console.log(`Logged in ${username.value}`);
                window.location.href = "/index.html";
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
