import { Controller } from "./Controller";
import { User } from "../models/User";
import { session } from "@hboictcloud/api";

export class DeleteProfileController extends Controller {
    private _deleteProfileButton: HTMLButtonElement =
        document.getElementById("deleteProfileButton") as HTMLButtonElement;

    public constructor(view: HTMLElement) {
        super(view);
        this._currentUser = new User(0, "", "", "", new Date(), null, null, null, null, null);
    };

    private _currentUser: User;
    private _formElement: HTMLElement | undefined;
    private _overlayElement: HTMLElement | undefined;

    public async render(): Promise<void> {
        this._deleteProfileButton.addEventListener("click", this.onDeleteProfileButton.bind(this));
        this._currentUser = await User.getUserDataById(User.getCurrentlyLoggedInUser().userId);
        console.log(this._currentUser);
    }

    // Opens form for deleting account
    private onDeleteProfileButton(): void {
        this.createForm(true, false, "Weet je zeker dat je je account wilt verwijderen?");
    }

    // Creates a form with a text input field and a submit button
    private createForm(hasOptions: boolean, canReturnToHomePage: boolean, message: string): void {
        const formContainer: HTMLDivElement = this.view.parentElement as HTMLDivElement;

        // Creates form element
        this._formElement = document.createElement("form");
        this._formElement.innerHTML = message;
        this._formElement.classList.add("delete-account-container");

        const buttonContainer: HTMLDivElement = document.createElement("div");
        buttonContainer.className = "delete-options-container";
        this._formElement.appendChild(buttonContainer);

        // Creates button
        if (hasOptions) {
            const yesButton: HTMLButtonElement = document.createElement("button");

            if (canReturnToHomePage)
                yesButton.addEventListener("click", this.onReturnToHome.bind(this));
            else
                console.log("FALSE");
            yesButton.addEventListener("click", this.onDeleteUser.bind(this));

            yesButton.setAttribute("type", "button"); // Set button type explicitly
            yesButton.classList.add("button-create-question");
            yesButton.innerText = "Ja verwijder!";

            const noButton: HTMLButtonElement = document.createElement("button");
            noButton.addEventListener("click", this.onCloseForm.bind(this));
            noButton.setAttribute("type", "button"); // Set button type explicitly
            noButton.classList.add("button-create-question");
            noButton.innerText = "Nee ga terug!";
            buttonContainer.appendChild(yesButton);
            buttonContainer.appendChild(noButton);
        }
        else {
            const yesButton: HTMLButtonElement = document.createElement("button");
            if (canReturnToHomePage)
                yesButton.addEventListener("click", this.onReturnToHome.bind(this));
            else
                yesButton.addEventListener("click", this.onCloseForm.bind(this));

            yesButton.setAttribute("type", "button"); // Set button type explicitly
            yesButton.classList.add("button-create-question");
            yesButton.innerText = "Oké";

            buttonContainer.appendChild(yesButton);
        }

        if (!this._overlayElement) {
            this._overlayElement = document.createElement("div");
            this._overlayElement.className = "overlay";
            this.view.appendChild(this._overlayElement);
        }

        // Adds the form as a child to the main container
        formContainer.appendChild(this._formElement);
        this.view.appendChild(this._formElement);
    }

    private onCloseForm(): void {
        this._formElement?.remove();
        this._overlayElement?.remove();
        this._overlayElement = undefined;
    }

    private async onDeleteUser(): Promise<void> {
        this._formElement?.remove();
        await User.removeUserById(this._currentUser.id);
        this.createForm(false, true, "Account verwijderd!");
    }

    // Removes user data and logs out returns him to home screen
    private onReturnToHome(): void {
        console.log("Test");
        session.set("LoggedIn", { isLoggedIn: false, userName: "", userId: undefined });
        window.location.href = "/index.html";
    }
}
