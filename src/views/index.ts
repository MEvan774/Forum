import "../hicConfig";
import { Person, PersonQueryResult } from "../models/Person";

async function configureApi(): Promise<void> {
    try {
        const removingPerson: string = "JohnDoe";
        await Person.removePerson(removingPerson);
        const person: Person = new Person("JohnDoe", "hallo@gmail.com", "1234");
        await person.setPerson();
        const persons: PersonQueryResult[] = await Person.getAll();
        console.log(persons);
        JSON.stringify(persons);
        persons.forEach((person: PersonQueryResult) => {
            console.log(person);
        });
    }
    catch (reason) {
        console.error(reason);
    }
}

void configureApi();
