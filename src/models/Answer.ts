import { api } from "@hboictcloud/api";
import { describe } from "node:test";

type AnswersAmountQueryResult = {
    amount: number;
    description: string;
    createdAt: Date;
    idQuestion: number;
    idUser: number;
};

export class Answer {
    private _id: number;
    private _description: string;
    private _createdAt: Date;
    private _idQuestion: number;
    private _idUser: number;

    public constructor(id: number, description: string, createdAt: Date, idQuestion: number, idUser: number) {
        this._id = id;
        this._description = description;
        this._createdAt = createdAt;
        this._idQuestion = idQuestion;
        this._idUser = idUser;
    };

    /**
     * Haalt de hoeveelheid antwoorden op van een vraag
     */
    public static async amountOfAnswers(questionId: number): Promise<number> {
        try {
            const amountOfAnswers: AnswersAmountQueryResult[] = await api.queryDatabase(`SELECT COUNT(idAnswer) AS amount FROM answer WHERE idQuestion = ${questionId}`) as AnswersAmountQueryResult[];
            return amountOfAnswers[0].amount;
        }
        catch (reason) {
            console.error(reason);
            return 0;
        }
    }

    public get id(): number {
        return this._id;
    }
}
