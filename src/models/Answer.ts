import { api } from "@hboictcloud/api";

type AnswersAmountQueryResult = {
    id: number;
    amount: number;
    description: string;
    createdAt: Date;
    idQuestion: number;
    idUser: number;
};

export class Answer {
    private _id: number;
    private _amount: number;
    private _description: string;
    private _createdAt: Date;
    private _idQuestion: number;
    private _idUser: number;

    public constructor(id: number, amount: number, description: string, createdAt: Date, idQuestion: number, idUser: number) {
        this._id = id;
        this._amount = amount;
        this._description = description;
        this._createdAt = createdAt;
        this._idQuestion = idQuestion;
        this._idUser = idUser;
    };

    public static async setAnswer(idQuestion: number, idUser: number, description: string): Promise<void> {
        try {
            await api.queryDatabase(`INSERT INTO answer (idQuestion, idUser, description) VALUES ('${idQuestion}', '${idUser}', '${description}')`);
        }
        catch (reason) {
            console.error(reason);
        }
    }

    public static async removeAnswer(removingAnswerID: number): Promise<void> {
        await api.queryDatabase(`DELETE FROM answer WHERE userName = '${removingAnswerID}'`);
    }

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

    public static async getAllAnswersOfQuestion(questionId: number): Promise<Answer[]> {
        try {
            const allQuestions: Answer[] = [];
            const answerResults: AnswersAmountQueryResult[] = await
            api.queryDatabase(`SELECT * FROM answer WHERE idQuestion = '${questionId}'`) as AnswersAmountQueryResult[];
            console.log(answerResults);
            return allQuestions;
        }
        catch (reason) {
            console.error(reason);
            return [];
        }
    }

    public static async getAnswerUserId(nameInput: string): Promise<number> {
        try {
            const answer: AnswersAmountQueryResult[] = await api.queryDatabase(`SELECT userName FROM user WHERE idUser = '${nameInput}'`) as AnswersAmountQueryResult[];
            console.log(`ANSWERS: '${answer}'`);
            return answer[0].idUser;
        }
        catch (reason) {
            console.error(reason);
            return 0;
        }
    }

    public get amount(): number {
        return this._amount;
    }

    public get id(): number {
        return this._id;
    }

    public get description(): string {
        return this._description;
    }

    public get createdAt(): Date {
        return this._createdAt;
    }

    public get idQuestion(): number {
        return this._idQuestion;
    }

    public get idUser(): number {
        return this._idUser;
    }
}
