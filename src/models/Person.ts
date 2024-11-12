import { api } from "@hboictcloud/api";

export type PersonQueryResult = {
    idUser: number;
    name: string;
    email: string;
    password: string;
};

export class Person {
    private _name: string;
    private _email: string;
    private _password: string;

    public constructor(name: string, email: string, password: string) {
        this._name = name;
        this._email = email;
        this._password = password;
    }

    public async setPerson(): Promise<void> {
        await api.queryDatabase(`INSERT INTO user (name, email, password) VALUES ('${this._name}', '${this._email}', '${this._password}')`);
    }

    public static async removePerson(removingPerson: string): Promise<void> {
        await api.queryDatabase(`DELETE FROM user WHERE name = '${removingPerson}'`);
    }

    public static async getAll(): Promise<Person[]> {
        const persons: Person[] = [];
        try {
            const result: PersonQueryResult[] = await api.queryDatabase("SELECT idUser, name, email, password FROM user") as PersonQueryResult[];
            for (const row of result) {
                persons.push(new Person(row.name, row.email, row.password));
            }
        }
        catch (reason) {
            console.error(reason);
        }
        return persons;
    }
}
