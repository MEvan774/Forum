import { api } from "@hboictcloud/api";

type QuestionQueryResult = {
    id: number;
    title: string;
    description: string;
    code: string;
    createdAt: Date;
    idUser: number;
    amount?: number;
    userName?: string;
};

export class Question {
    private _id: number;
    private _title: string;
    private _description: string;
    private _code: string;
    private _createdAt: Date;
    private _idUser: number;
    private _userName?: string;
    private _amount?: number;

    public constructor(id: number, title: string, description: string, code: string, createdAt: Date, idUser: number,
        userName?: string, amount?: number) {
        this._id = id;
        this._title = title;
        this._description = description;
        this._code = code;
        this._code = code;
        this._createdAt = createdAt;
        this._idUser = idUser;
        this._userName = userName;
        this._amount = amount;
    }

    /**
     * Sets answer data in the Answer object
     */

    public static async setQuestion(title: string, description: string, idUser: number, code: string
    ): Promise<void> {
        try {
            await api.queryDatabase(`INSERT INTO question (
                    title,
                    description,
                    idUser,
                    code) 
                    VALUES ('${title}', '${description}', '${idUser}', '${code}')`);
        }
        catch (reason) {
            console.error(reason);
        }
    }

    /**
     * Get the last uploaded answer's ID
     * @returns The last answer ID
     */
    public static async getLastQuestionId(): Promise<number> {
        try {
            const result: { idQuestion: number }[] = await api.queryDatabase(`SELECT idQuestion FROM question 
            ORDER BY idQuestion DESC LIMIT 1`) as { idQuestion: number }[];
            return result.length > 0 ? result[0].idQuestion : 0;
        }
        catch (error) {
            console.error("Error fetching last answer ID:", error);
            return 0;
        }
    }

    /**
     * Haalt alle informatie van de vragen op uit de database
     * @returns Promise met een array van Question objecten
     */
    public static async getAll(): Promise<Question[]> {
        try {
            const allQuestions: Question[] = [];
            const questionsResult: QuestionQueryResult[] = await
            api.queryDatabase(`SELECT question.idQuestion AS id, question.title, question.description, 
                question.code, question.createdAt, question.idUser, user.userName, COUNT(answer.idAnswer) 
                question.code, question.createdAt, question.idUser, user.userName, COUNT(answer.idAnswer) 
                AS amount FROM (question INNER JOIN user ON question.idUser = user.idUser) LEFT JOIN answer 
                ON question.idQuestion = answer.idQuestion GROUP BY question.title, question.description,  
                question.code, question.createdAt, user.userName
                ORDER BY question.createdAt DESC;
                `) as QuestionQueryResult[];
            console.log(questionsResult);
            for (const question of questionsResult) {
                question.createdAt = new Date(question.createdAt);
                allQuestions.push(new Question(question.id, question.title, question.description,
                    question.code, question.createdAt, question.idUser, question.userName, question.amount));
            }
            return allQuestions;
        }
        catch (reason) {
            console.error(reason);
            return [];
        }
    }

    /**
     * Haalt een vraag op uit de database gebasseerd op zijn ID
     * @param idQuestion ID van de vraag
     * @returns Het opgehaald vraag object
     */
    public static async getQuestionById(idQuestion: number): Promise<Question | null> {
        try {
            const questionsResult: QuestionQueryResult[] = await
            api.queryDatabase(`SELECT question.idQuestion AS id, question.title, question.description, 
                question.code, question.createdAt, question.idUser, user.userName, COUNT(answer.idAnswer) 
                AS amount FROM (question INNER JOIN user ON question.idUser = user.idUser) LEFT JOIN answer 
                ON question.idQuestion = answer.idQuestion GROUP BY question.title, question.description, 
                question.code, question.createdAt, user.userName HAVING question.idQuestion = 
                ${idQuestion}`) as QuestionQueryResult[];
            console.log(questionsResult);
            return questionsResult.map((question: QuestionQueryResult) => new Question(
                question.id,
                question.title,
                question.description,
                question.code,
                question.createdAt,
                question.idUser,
                question.userName,
                question.amount
            ))[0];
        }
        catch (reason) {
            console.error(reason);
            return null;
        }
    }

    public get id(): number {
        return this._id;
    }

    public get title(): string {
        return this._title;
    }

    public get description(): string {
        return this._description;
    }

    public get code(): string {
        return this._code;
    }

    public get createdAt(): Date {
        return this._createdAt;
    }

    public get idUser(): number {
        return this._idUser;
    }

    public get userName(): string {
        return this._userName ?? "";
    }

    public get amount(): number {
        return this._amount ?? 0;
    }
}
