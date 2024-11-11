import { api } from "@hboictcloud/api";
import "../hicConfig";
import { PersonQueryResult } from "../models/Person";

async function configureApi(): Promise<void> {
    try {
        const result: PersonQueryResult[] =
        await api.queryDatabase("SELECT idUser, name, email, password FROM user") as PersonQueryResult[];
        console.log(result);
    }
    catch (reason) {
        console.error(reason);
    }
}

void configureApi();
