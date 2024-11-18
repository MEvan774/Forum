import { api } from "@hboictcloud/api";

type AnswersAmountQueryResult = {
    amount: number;
};

export class Answer {
    private _id: number;

    public constructor(id: number) {
        this._id = id;
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
