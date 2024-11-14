import { api } from "@hboictcloud/api";
import { session } from "@hboictcloud/api";
import { LoggedIn } from "./LoggedIn";

export type UserQueryResult = {
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: string | null;
};

export class User {
    private _name: string;
    private _email: string;
    private _password: string;

    public constructor(name: string, email: string, password: string) {
        this._name = name;
        this._email = email;
        this._password = password;
    }

    public static setCurrentlyLoggedInUser(userName: string): void {
        session.set("LoggedIn", ({ isLoggedIn: true, userName: userName } as LoggedIn));
    }

    public async setUser(): Promise<void> {
        try {
            await api.queryDatabase(`INSERT INTO user (name, email, password) VALUES ('${this._name}', '${this._email}', '${this._password}')`);
        }
        catch (reason) {
            console.error(reason);
        }
    }

    public static async removePerson(removingPerson: string): Promise<void> {
        await api.queryDatabase(`DELETE FROM user WHERE name = '${removingPerson}'`);
    }

    public static async getAll(): Promise<UserQueryResult[]> {
        let persons: UserQueryResult[] = [];
        try {
            persons = await api.queryDatabase("SELECT name, email, password, created_at, updated_at FROM user") as UserQueryResult[];
            persons = persons.map((person: UserQueryResult) => ({
                name: person.name,
                email: person.email,
                password: person.password,
                createdAt: new Date(person.createdAt),
                updatedAt: person.updatedAt,
            }));
        }
        catch (reason) {
            console.error(reason);
        }
        return persons;
    }

    /*
    * kijkt of email al bestaat in de database
    * kan gebruikt worden bij zowel de regristratie als de inlog
    **/
    public static async checkIfEmailExists(emailInput: string): Promise<boolean> {
        try {
            let emailExists: boolean = false;
            const emails: string[] =
            await api.queryDatabase(`SELECT email FROM user WHERE LOWER(email) = '${emailInput.toLowerCase()}'`) as string[];
            if (emails.length > 0) {
                emailExists = true;
            }
            return emailExists;
        }
        catch (reason) {
            console.error(reason);
            throw new Error(`Failed to check if email exists: ${reason}`);
        }
    }

    /*
    * kijkt of gebruikersnaam al bestaat in de database
    * kan gebruikt worden bij zowel de regristratie als de inlog
    **/
    public static async checkIfUsernameExists(nameInput: string): Promise<boolean> {
        try {
            let usernameExists: boolean = false;
            const usernames: string[] =
            await api.queryDatabase(`SELECT name FROM user WHERE LOWER(name) = '${nameInput.toLowerCase()}'`) as string[];
            if (usernames.length > 0) {
                usernameExists = true;
            }
            return usernameExists;
        }
        catch (error) {
            console.error(error);
            throw new Error(`Failed to check if username exists: ${error}`);
        }
    }

    /*
    * registreet de gebruiker als de inputs kloppen
    * wordt geroepen vanuit de registratie controller zodra registreer knop wordt ingedrukt
    **/
    public static async registrateUser(): Promise<void> {
        const userName: HTMLInputElement = document.querySelector("#input-username")!;
        const email: HTMLInputElement = document.querySelector("#input-email")!;
        const password: HTMLInputElement = document.querySelector("#input-password")!;

        const validInputs: boolean = await validateInputs(userName, email, password);
        if (validInputs) {
            const user: User = new User(userName.value, email.value, password.value);
            void user.setUser();
            void User.sendEmail(userName.value, email.value);
            User.setCurrentlyLoggedInUser(userName.value);
            window.location.href = "/index.html";
        }

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
            else if (userName.value.includes("@")) {
                setErrorMessage(userName, "Username cannot contain '@'.");
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
    }

    public static async sendEmail(inputName: string, email: string): Promise<void> {
        try {
            const result: string = await api.sendEmail({
                from: {
                    name: "HBO-ICT.Cloud",
                    address: "you@hbo-ict.cloud",
                },
                to: [
                    {
                        name: inputName,
                        address: email,
                    },
                ],
                subject: "Je account is geregristreerd op Code Exchange!",
                html: `<h1>Hallo ${inputName}!</h1><hr><p>Je kan nu gebruik maken van Code Exchange</p>`,
            });
            console.log(result);
        }
        catch (reason) {
            console.log(reason);
        }
    }
}
