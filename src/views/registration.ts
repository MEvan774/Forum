import "../hicConfig";
import { User } from "../models/User";

const registrationButton: HTMLButtonElement = document.querySelector("#registration-button")!;

// als er op de knop wordt geklikt vraagt de functie of de inputs kloppen en geeft deze door aan de Person class
registrationButton.addEventListener("click", async event => {
    event.preventDefault();

    const userName: HTMLInputElement = document.querySelector("#input-username")!;
    const email: HTMLInputElement = document.querySelector("#input-email")!;
    const password: HTMLInputElement = document.querySelector("#input-password")!;

    const validInputs: boolean = await validateInputs(userName, email, password);
    if (validInputs) {
        const user: User = new User(userName.value, email.value, password.value);
        void user.setUser();
        void User.sendEmail(userName.value, email.value);
        User.setCurrentlyLoggedInUser(userName.value);
    }
});

// geeft error message als input niet klopt
function setErrorMessage(input: HTMLInputElement, message: string): void {
    const errorMessage: HTMLDivElement = input.parentElement as HTMLDivElement;
    const errorText: HTMLParagraphElement = errorMessage.querySelector(".form-error")!;

    errorText.innerText = message;
}

// haalt error weg input klopt
function clearErrorMessage(input: HTMLInputElement): void {
    const errorMessage: HTMLDivElement = input.parentElement as HTMLDivElement;
    const errorText: HTMLParagraphElement = errorMessage.querySelector(".form-error")!;

    errorText.innerText = "";
}

// checkt of email klopt en geeft een boolean terug
function validEmail(email: string): boolean {
    const emailRegex: RegExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email);
}

// checkt of inputs kloppen en geeft een boolean terug
async function validateInputs(userName: HTMLInputElement, email: HTMLInputElement, password: HTMLInputElement): Promise<boolean> {
    let valid: boolean = true;

    if (userName.value === "") {
        setErrorMessage(userName, "Please enter a username.");
        valid = false;
    }
    else {
        const userNameExists: boolean = await User.checkIfUsernameExists(userName.value);
        if (userNameExists) {
            setErrorMessage(userName, "Username is already in use.");
            valid = false;
        }
        else {
            clearErrorMessage(userName);
        }
    }
    if (email.value === "") {
        setErrorMessage(email, "Please enter an email address.");
        valid = false;
    }
    else if (!validEmail(email.value)) {
        setErrorMessage(email, "Please enter a valid email address.");
        valid = false;
    }
    else {
        const emailExists: boolean = await User.checkIfEmailExists(email.value);
        if (emailExists) {
            setErrorMessage(email, "Email address is already in use.");
            valid = false;
        }
        else {
            clearErrorMessage(email);
        }
    }
    if (password.value === "") {
        setErrorMessage(password, "Please enter a password.");
        valid = false;
    }
    else if (password.value.length < 8) {
        setErrorMessage(password, "Password must be at least 8 characters long.");
        valid = false;
    }
    else {
        clearErrorMessage(password);
    }
    return valid;
};
