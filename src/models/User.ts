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
    private _dateAdded?: Date;
    private _dateUpdated?: string;

    public constructor(name: string, email: string, password: string, dateAdded?: Date, dateUpdated?: string) {
        this._name = name;
        this._email = email;
        this._password = password;
        this._dateAdded = dateAdded;
        this._dateUpdated = dateUpdated;
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

    // geeft error message als input niet klopt
    public static setErrorMessage(input: HTMLInputElement, message: string): void {
        const errorMessage: HTMLDivElement = input.parentElement as HTMLDivElement;
        const errorText: HTMLParagraphElement = errorMessage.querySelector(".form-error")!;

        errorText.innerText = message;
    }

    // haalt error weg input klopt
    public static clearErrorMessage(input: HTMLInputElement): void {
        const errorMessage: HTMLDivElement = input.parentElement as HTMLDivElement;
        const errorText: HTMLParagraphElement = errorMessage.querySelector(".form-error")!;

        errorText.innerText = "";
    }

    // checkt of email klopt en geeft een boolean terug
    public static validEmail(email: string): boolean {
        const emailRegex: RegExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return emailRegex.test(email);
    }

    public static async checkIfEmailExists(emailInput: string): Promise<boolean> {
        try {
            let emailExists: boolean = false;
            const emails: string[] =
            await api.queryDatabase(`SELECT email FROM user WHERE LOWER(email) = '${emailInput.toLowerCase()}'`) as string[];
            if (emails.length > 0) {
                emailExists = true;
                console.log(emails);
            }
            return emailExists;
        }
        catch (reason) {
            console.error(reason);
            throw new Error(`Failed to check if email exists: ${reason}`);
        }
    }

    public static async checkIfUsernameExists(nameInput: string): Promise<boolean> {
        let usernameExists: boolean = false;
        try {
            const usernames: string[] =
            await api.queryDatabase(`SELECT name FROM user WHERE LOWER(name) = '${nameInput.toLowerCase()}'`) as string[];
            if (usernames.length > 0) {
                usernameExists = true;
                return usernameExists;
            }
        }
        catch (error) {
            console.error(error);
            throw new Error(`Failed to check if username exists: ${error}`);
        }
        return usernameExists;
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

    public static async checkPasswordMatch(inputPassword: string, inputType: string, nameInput: string): Promise<boolean | undefined> {
        try {
            let passwordMatch: boolean = false;
            const password: string =
            await api.queryDatabase(`SELECT password FROM user WHERE LOWER(${inputType}) = '${nameInput.toLowerCase()}'`) as string;
            if (inputPassword === password) {
                passwordMatch = true;
            }
            else {
                passwordMatch = false;
            }

            return passwordMatch;
        }
        catch (reason) {
            console.log(reason);
        }
    }
}
