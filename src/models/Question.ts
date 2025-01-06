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

    public static async getAllAndOrderByYearsOfProfession(
        limit: number,
        offset: number
    ): Promise<Question[]> {
        try {
            const countResult: { total: number }[] = await api.queryDatabase(`
                SELECT COUNT(DISTINCT question.idQuestion) AS total
                FROM question
                INNER JOIN user ON question.idUser = user.idUser;
            `) as { total: number }[];
            const totalQuestions: number = countResult[0]?.total || 0;
            const adjustedLimit: number = Math.min(limit, totalQuestions - offset);
            if (adjustedLimit <= 0) {
                return []; // No rows left to fetch
            }
            // Fetch the paginated questions ordered by yearsOfProfession
            const allQuestions: Question[] = [];
            const questionsResult: QuestionQueryResult[] = await api.queryDatabase(`
                SELECT 
                    question.idQuestion AS id, 
                    question.title, 
                    question.description, 
                    question.code, 
                    question.createdAt, 
                    question.idUser, 
                    user.userName, 
                    user.yearsOfProfession, 
                    COUNT(answer.idAnswer) AS amount 
                FROM 
                    question 
                INNER JOIN 
                    user ON question.idUser = user.idUser
                LEFT JOIN 
                    answer ON question.idQuestion = answer.idQuestion 
                GROUP BY 
                    question.idQuestion, question.title, question.description,  
                    question.code, question.createdAt, user.userName, user.yearsOfProfession
                ORDER BY 
                    user.yearsOfProfession DESC, question.createdAt DESC
                LIMIT ${adjustedLimit} OFFSET ${offset};
            `) as QuestionQueryResult[];
            // Map query results to Question objects
            for (const question of questionsResult) {
                question.createdAt = new Date(question.createdAt);
                allQuestions.push(new Question(
                    question.id,
                    question.title,
                    question.description,
                    question.code,
                    question.createdAt,
                    question.idUser,
                    question.userName,
                    question.amount
                ));
            }
            return allQuestions;
        }
        catch (reason) {
            console.error(reason);
            return [];
        }
    }

    public static async getAllAndFilterByAnswer(
        limit: number,
        offset: number
    ): Promise<Question[]> {
        try {
            // Get the total number of questions with at least one answer
            const countResult: { total: number }[] = await api.queryDatabase(`
                SELECT COUNT(DISTINCT question.idQuestion) AS total
                FROM question
                LEFT JOIN answer ON question.idQuestion = answer.idQuestion
                WHERE answer.idAnswer IS NOT NULL;
            `) as { total: number }[];
            const totalQuestionsWithAnswers: number = countResult[0]?.total || 0;
            if (totalQuestionsWithAnswers === 0) {
                return [];
            }
            const adjustedLimit: number = Math.min(limit, totalQuestionsWithAnswers - offset);
            if (adjustedLimit <= 0) {
                return []; // No rows left to fetch
            }
            const allQuestions: Question[] = [];
            const questionsResult: QuestionQueryResult[] = await api.queryDatabase(`
                SELECT 
                    question.idQuestion AS id, 
                    question.title, 
                    question.description, 
                    question.code, 
                    question.createdAt, 
                    question.idUser, 
                    user.userName, 
                    COUNT(answer.idAnswer) AS amount 
                FROM 
                    question 
                INNER JOIN 
                    user ON question.idUser = user.idUser 
                LEFT JOIN 
                    answer ON question.idQuestion = answer.idQuestion 
                WHERE 
                    answer.idAnswer IS NOT NULL
                GROUP BY 
                    question.idQuestion, question.title, question.description,  
                    question.code, question.createdAt, user.userName
                ORDER BY 
                    question.createdAt DESC
                LIMIT ${adjustedLimit} OFFSET ${offset};
            `) as QuestionQueryResult[];
            for (const question of questionsResult) {
                question.createdAt = new Date(question.createdAt);
                allQuestions.push(new Question(
                    question.id,
                    question.title,
                    question.description,
                    question.code,
                    question.createdAt,
                    question.idUser,
                    question.userName,
                    question.amount
                ));
            }
            return allQuestions;
        }
        catch (reason) {
            console.error(reason);
            return [];
        }
    }

    /**
     * gets all questions and filters them by date
     * @param limit decides how many questions are being recieved
     * @param offset decides the amount of offset in which the questions are recieved, its always on 10 since
     * it needs to load the questions every 10 batch
     * @param questionAmount the total amount of questions, its primairly used to calculate the final few
     * questions if it doesnt end at a 10, 20, 30 etc. Its to prevent getting questions that arent in the
     * database
     * @returns questions recieved by this function
     */
    public static async getAllAndFilterByDate(
        limit: number,
        offset: number,
        questionAmount: number
    ): Promise<Question[]> {
        try {
            const adjustedLimit: number = Math.min(limit, questionAmount - offset);
            if (adjustedLimit <= 0) {
                return []; // No rows left to fetch
            }
            const allQuestions: Question[] = [];
            const questionsResult: QuestionQueryResult[] = await api.queryDatabase(`
                SELECT 
                    question.idQuestion AS id, 
                    question.title, 
                    question.description, 
                    question.code, 
                    question.createdAt, 
                    question.idUser, 
                    user.userName
                FROM 
                    question
                INNER JOIN 
                    user ON question.idUser = user.idUser
                ORDER BY 
                    question.createdAt DESC -- Sort recent to old
                LIMIT ${adjustedLimit} OFFSET ${offset};
            `) as QuestionQueryResult[];
            for (const question of questionsResult) {
                question.createdAt = new Date(question.createdAt);
                allQuestions.push(new Question(
                    question.id,
                    question.title,
                    question.description,
                    question.code,
                    question.createdAt,
                    question.idUser,
                    question.userName,
                    0 // No answer count needed
                ));
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
