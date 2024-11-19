import { api } from "@hboictcloud/api";
import { create } from "domain";
type QuestionQueryResult = {
    id: number;
    title: string;
    description: string;
    createdAt: Date;
    idUser: number;
    amount?: number;
    userName?: string;
};

export class Question {
    private _id: number;
    private _title: string;
    private _description: string;
    private _createdAt: Date;
    private _idUser: number;
    private _userName?: string;
    private _amount?: number;

    public constructor(id: number, title: string, description: string, createdAt: Date, idUser: number,
        userName?: string, amount?: number) {
        this._id = id;
        this._title = title;
        this._description = description;
        this._createdAt = createdAt;
        this._idUser = idUser;
        this._userName = userName;
        this._amount = amount;
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
                question.created_at AS createdAt, question.idUser, user.userName, COUNT(answer.idAnswer) 
                AS amount FROM (question INNER JOIN user ON question.idUser = user.idUser) LEFT JOIN answer 
                ON question.idQuestion = answer.idQuestion GROUP BY question.title, question.description, 
                question.created_at, user.userName`) as QuestionQueryResult[];
            console.log(questionsResult);
            for (const question of questionsResult) {
                question.createdAt = new Date(question.createdAt);
                allQuestions.push(new Question(question.id, question.title, question.description,
                    question.createdAt, question.idUser, question.userName, question.amount));
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
    public static async getQuestionById(idQuestion: number): Promise<Question> {
        const question: Question[] = [];
        try {
            const questionsResult: QuestionQueryResult[] = await
            api.queryDatabase(`SELECT idQuestion AS id, title, description, created_at AS createdAt, 
                idUser FROM question WHERE idQuestion = ${idQuestion}`) as QuestionQueryResult[];
            for (const question of questionsResult) {
                const createdAt: Date = new Date(question.createdAt);
                questionsResult.push(new Question(question.id, question.title, question.description,
                    createdAt, question.idUser));
            }
            return question[0];
        }
        catch (reason) {
            console.error(reason);
        }
        return question[0];
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
