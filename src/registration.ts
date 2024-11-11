const registrationButton: HTMLButtonElement = document.querySelector("#registration-button")!;

registrationButton.addEventListener("click", event => {
    event.preventDefault();

    const validInputs: boolean = validateInputs();
    if (validInputs) {
        alert("Registration successful!");
    }
});

function setErrorMessage(input: HTMLInputElement, message: string): void {
    const errorMessage: HTMLDivElement = input.parentElement as HTMLDivElement;
    const errorText: HTMLParagraphElement = errorMessage.querySelector(".form-error")!;

    errorText.innerText = message;
}

function clearErrorMessage(input: HTMLInputElement): void {
    const errorMessage: HTMLDivElement = input.parentElement as HTMLDivElement;
    const errorText: HTMLParagraphElement = errorMessage.querySelector(".form-error")!;

    errorText.innerText = "";
}

function validEmail(email: string): boolean {
    const emailRegex: RegExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    ;
    return emailRegex.test(email);
}

function validateInputs(): boolean {
    let valid: boolean = true;
    const userName: HTMLInputElement = document.querySelector("#input-username")!;
    const email: HTMLInputElement = document.querySelector("#input-email")!;
    const password: HTMLInputElement = document.querySelector("#input-password")!;

    if (userName.value === "") {
        setErrorMessage(userName, "Please enter a username.");
        valid = false;
    }
    else {
        clearErrorMessage(userName);
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
        clearErrorMessage(email);
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
