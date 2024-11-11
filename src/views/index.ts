import "../hicConfig";
import { Person } from "../models/Person";

async function configureApi(): Promise<void> {
    try {
        const removingPerson: string = "JohnDoe";
        await Person.removePerson(removingPerson);
        const person: Person = new Person("JohnDoe", "hallo@gmail.com", "1234");
        await person.setPerson();
        const persons: Person[] = await Person.getAll();
        console.log(persons);
    }
    catch (reason) {
        console.error(reason);
    }
}

void configureApi();
