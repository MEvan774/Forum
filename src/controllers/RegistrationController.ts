import { Controller } from "./Controller";
import { User } from "../models/User";

export class RegisterController extends Controller {
    public constructor(view: HTMLElement) {
        super(view);
    }

    /**
     * Functie maakt van view een eventlistener en activeert de functie onClickRegister
     */
    public render(): void {
        this.view.addEventListener("click", (event: Event) => {
            event.preventDefault();
            void this.onClickRegister();
        });
    }

    /**
     * Functie valideert de input van de gebruiker
     * @param input van username email password en repeatPassword
     * @returns boolean true als de input goed is gekeurd anders false
     */
    private async validateInputs(userName: HTMLInputElement, email: HTMLInputElement, password: HTMLInputElement, repeatPassword: HTMLInputElement): Promise<boolean> {
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
        else if (password.value !== repeatPassword.value) {
            User.setErrorMessage(repeatPassword, "Both inputs must contain the same passwords.");
            valid = false;
        }
        else {
            User.clearErrorMessage(password);
        }
        return valid;
    };

    /**
     * haalt de input van de gebruiker op en geeft mee aan de validatie functie
     * krijgt boolean terug en als het true is worden de gegevens meegegeven aan de setUser functie
     * geeft naam van gebruiker en email mee aan sendEmail functie
     */
    private async onClickRegister(): Promise<void> {
        const userName: HTMLInputElement = document.querySelector("#input-username")!;
        const email: HTMLInputElement = document.querySelector("#input-email")!;
        const password: HTMLInputElement = document.querySelector("#input-password")!;
        const repeatPassword: HTMLInputElement = document.querySelector("#input-repeadPassword")!;

        const validRegistrationInput: boolean = await this.validateInputs(userName, email, password, repeatPassword);
        if (validRegistrationInput) {
            await User.setUser(userName.value, email.value, password.value);
            const idUser: number | null = await User.getIdByUser(userName.value, "userName");
            if (idUser === null) {
                console.error("User not found");
                return;
            }
            void User.sendEmail(userName.value, email.value);
            User.setCurrentlyLoggedInUser(userName.value, idUser);
            window.location.href = "/index.html";
        }
    }
}
