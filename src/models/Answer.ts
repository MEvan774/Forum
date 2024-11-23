import { api } from "@hboictcloud/api";

type AnswersAmountQueryResult = {
    idAnswer: number;
    description: string;
    code: string;
    createdAt: string;
    updatedAt: string | null;
    idQuestion: number;
    idUser: number;
};

export class Answer {
    private _id: number;
    private _description: string;
    private _code: string;
    private _createdAt: string;
    private _updatedAt: string | null;
    private _idQuestion: number;
    private _idUser: number;

    public constructor(id: number, description: string, code: string, createdAt: string, updatedAt: string | null, idQuestion: number, idUser: number) {
        this._id = id;
        this._description = description;
        this._code = code;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
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
        location.reload();
    }

    public static async removeAnswerById(id: number): Promise<void> {
        await api.queryDatabase(`DELETE FROM answer WHERE idAnswer = ${id}`);
    }

    /**
     * Haalt de hoeveelheid antwoorden op van een vraag
     */
    public static async amountOfAnswers(questionId: number): Promise<number> {
        try {
            const amountOfAnswers: { amount: number }[] = await api.queryDatabase(`SELECT COUNT(idAnswer) 
            AS amount FROM answer WHERE idQuestion = ${questionId}`) as { amount: number }[];
            return amountOfAnswers[0].amount;
        }
        catch (reason) {
            console.error(reason);
            return 0;
        }
    }

    public static async getAllAnswersOfQuestion(questionId: number): Promise<Answer[]> {
        try {
            const answerResults: AnswersAmountQueryResult[] = await
            api.queryDatabase(`SELECT idAnswer, description, code, createdAt, updatedAt, idQuestion, idUser
                 FROM answer WHERE idQuestion = '${questionId}'
                ORDER BY createdAt DESC;
            `) as AnswersAmountQueryResult[];
            return answerResults.map((answer: AnswersAmountQueryResult) => new Answer(
                answer.idAnswer,
                answer.description,
                answer.code,
                answer.createdAt,
                answer.updatedAt,
                answer.idQuestion,
                answer.idUser
            ));
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

    public static async getAnswerById(id: number): Promise<Answer | null> {
        try {
            const answerResults: AnswersAmountQueryResult[] = await api.queryDatabase(`
                SELECT idAnswer, description, code, createdAt, updatedAt, idQuestion, idUser
                FROM answer WHERE idAnswer = ${id}
                `) as AnswersAmountQueryResult[];
            return answerResults.map((answer: AnswersAmountQueryResult) => new Answer(
                answer.idAnswer,
                answer.description,
                answer.code,
                answer.createdAt,
                answer.updatedAt,
                answer.idQuestion,
                answer.idUser
            ))[0];
        }
        catch (reason) {
            console.error(reason);
            return null;
        }
    }

    public static async updateAnswer(id: number, description: string, code: string): Promise<void> {
        try {
            await api.queryDatabase(`
                UPDATE answer SET description = '${description}', code = '${code}' WHERE idAnswer = ${id} 
                `);
        }
        catch (reason) {
            console.error(reason);
        }
    }

    public get id(): number {
        return this._id;
    }

    public get description(): string {
        return this._description;
    }

    public get code(): string {
        return this._code;
    }

    public get createdAt(): string {
        return this._createdAt;
    }

    public get updatedAt(): string | null {
        return this._updatedAt;
    }

    public get idQuestion(): number {
        return this._idQuestion;
    }

    public get idUser(): number {
        return this._idUser;
    }
}
