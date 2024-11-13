import "../hicConfig";
import { User, UserQueryResult } from "../models/User";

async function configureApi(): Promise<void> {
    try {
        const removingPerson: string = "JohnDoe";
        await User.removePerson(removingPerson);
        const user: User = new User("JohnDoe", "hallo@gmail.com", "1234");
        await user.setUser();
        const users: UserQueryResult[] = await User.getAll();
        console.log(users);
        JSON.stringify(users);
        users.forEach((user: UserQueryResult) => {
            console.log(user);
        });
    }
    catch (reason) {
        console.error(reason);
    }
}

void configureApi();
