import { api } from "@hboictcloud/api";
import { session } from "@hboictcloud/api";
import { LoggedIn } from "./LoggedIn";

export type UserQueryResult = {
    idUser: number;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date | null;
};

export type PasswordQueryResult = {
    password: string;
};

export type Username = {
    userName: string;
};

export class User {
    private _id: number;
    private _name: string;
    private _email: string;
    private _password: string;
    private _dateAdded: Date;
    private _dateUpdated: Date | null;

    public constructor(id: number, name: string, email: string, password: string, dateAdded: Date, dateUpdated: Date | null) {
        this._id = id;
        this._name = name;
        this._email = email;
        this._password = password;
        this._dateAdded = dateAdded;
        this._dateUpdated = dateUpdated;
    }

    public static setCurrentlyLoggedInUser(userName: string, id: number): void {
        session.set("LoggedIn", ({ isLoggedIn: true, userName: userName, userId: id } as LoggedIn));
    }

    public static async setUser(userName: string, email: string, password: string): Promise<void> {
        try {
            await api.queryDatabase(`INSERT INTO user (userName, email, password) VALUES ('${userName}', '${email}', '${password}')`);
        }
        catch (reason) {
            console.error(reason);
        }
    }

    public static async removePerson(removingPerson: string): Promise<void> {
        await api.queryDatabase(`DELETE FROM user WHERE userName = '${removingPerson}'`);
    }

    public static async getAll(): Promise<User[]> {
        const users: User[] = [];
        try {
            let persons: UserQueryResult[] = await api.queryDatabase(`
                SELECT idUser, name, email, password, createdAt, updatedAt FROM user
                `) as UserQueryResult[];
            persons = persons.map((person: UserQueryResult) => ({
                idUser: person.idUser,
                name: person.name,
                email: person.email,
                password: person.password,
                createdAt: new Date(person.createdAt),
                updatedAt: person.updatedAt ? new Date(person.updatedAt) : null,
            }));

            const users: User[] = persons.map((person: UserQueryResult) => new User(person.idUser,
                person.name,
                person.email,
                person.password,
                person.createdAt,
                person.updatedAt
            ));
            return users;
        }
        catch (reason) {
            console.error(reason);
        }
        return users;
    }

    public static async getIdByUser(input: string, inputType: string): Promise<number | null> {
        console.log(input);
        console.log(inputType);
        try {
            const id: { idUser: number }[] = await api.queryDatabase(`SELECT idUser FROM user WHERE ${inputType} =
                 '${input}'`) as { idUser: number }[];
            return id[0].idUser;
        }
        catch (reason) {
            console.error(reason);
        }
        return null;
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
            await api.queryDatabase(`SELECT userName FROM user WHERE LOWER(userName) = '${nameInput.toLowerCase()}'`) as string[];
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

    public static async checkPasswordMatch(inputPassword: string, inputType: string, nameInput: string): Promise<boolean> {
        let passwordMatch: boolean = false;

        try {
            const passwordResult: PasswordQueryResult[] =
            await api.queryDatabase(`SELECT password FROM user WHERE LOWER(${inputType}) = '${nameInput.toLowerCase()}'`) as PasswordQueryResult[];

            for (const password of passwordResult) {
                if (inputPassword === password.password) {
                    passwordMatch = true;
                }
                else {
                    passwordMatch = false;
                }

                return passwordMatch;
            }
        }
        catch (reason) {
            console.log(reason);
        }
        return passwordMatch;
    }

    public get name(): string {
        return this._name;
    }

    public get id(): number {
        return this._id;
    }

    public get email(): string {
        return this._email;
    }

    public get password(): string {
        return this._password;
    }

    public get createdAt(): Date {
        return this._dateAdded;
    }

    public get updatedAt(): Date | null {
        return this._dateUpdated;
    }
}
