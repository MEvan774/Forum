import { api } from "@hboictcloud/api";
type QuestionQueryResult = {
    id: number;
    title: string;
    description: string;
    createdAt: Date;
    idUser: number;
};

export class Question {
    private _id: number;
    private _title: string;
    private _description: string;
    private _createdAt: Date;
    private _idUser: number;

    public constructor(id: number, title: string, description: string, createdAt: Date, idUser: number) {
        this._id = id;
        this._title = title;
        this._description = description;
        this._createdAt = createdAt;
        this._idUser = idUser;
    }

    /**
     * Haalt alle informatie van de vragen op uit de database
     * geeft een array met alle vragen terug
     */
    public static async getAll(): Promise<Question[]> {
        try {
            const allQuestions: Question[] = [];
            const questionsResult: QuestionQueryResult[] = await
            api.queryDatabase("SELECT idQuestion AS id, title, description, createdAt, idUser FROM question") as QuestionQueryResult[];
            for (const question of questionsResult) {
                question.createdAt = new Date(question.createdAt);
                allQuestions.push(new Question(question.id, question.title, question.description, question.createdAt, question.idUser));
            }
            return allQuestions;
        }
        catch (reason) {
            console.error(reason);
            return [];
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

    public get createdAt(): Date {
        return this._createdAt;
    }

    public get idUser(): number {
        return this._idUser;
    }
}
