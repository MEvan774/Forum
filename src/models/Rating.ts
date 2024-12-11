import { api } from "@hboictcloud/api";

type QuestionRatingQueryResult = {
    id: number;
    idQuestion: number;
    idUser: number;
    rating: number;
};

export class QuestionRating {
    private _id: number;
    private _idQuestion: number;
    private _idUser: number;
    private _rating: number;

    public constructor(id: number, idQuestion: number, idUser: number, rating: number) {
        this._id = id;
        this._idQuestion = idQuestion;
        this._idUser = idUser;
        this._rating = rating;
    };

    /**
     * Retrieves all ratings of a question
     * @param idQuestion needed to find correct ratings
     * @returns all ratings of a question
     */
    public static async getRatingsByQuestionId(idQuestion: number): Promise<QuestionRating[]> {
        try {
            console.log(idQuestion);
            const ratings: QuestionRatingQueryResult[] = await api.queryDatabase(`
                SELECT idRating AS id, idQuestion, idUser, rating FROM questionrating 
                WHERE idQuestion = ${idQuestion}
                `) as QuestionRatingQueryResult[];
            return ratings.map((rating: QuestionRatingQueryResult) => new QuestionRating(
                rating.id,
                rating.idQuestion,
                rating.idUser,
                rating.rating
            ));
        }
        catch (reason) {
            console.error(reason);
            return [];
        }
    }

    /**
     * Adds a rating or updates rating depending on if the user has already rated the question
     * @param idQuestion identifies the question
     * @param idUser identifies the user
     * @param rating input from user if it is an upvote or downvote
     * @returns true or false depending on if the query was successful
     */
    public static async updateQuestionRating(idQuestion: number, idUser: number, rating: number): Promise<boolean> {
        try {
            await api.queryDatabase(`
                INSERT INTO QuestionRating (idQuestion, idUser, rating)
                VALUES (${idQuestion}, ${idUser}, ${rating})
                ON DUPLICATE KEY UPDATE rating = ${rating};
            `);
            return true;
        }
        catch (reason) {
            console.error(reason);
            return false;
        }
    }

    public get id(): number {
        return this._id;
    }

    public get idQuestion(): number {
        return this._idQuestion;
    }

    public get idUser(): number {
        return this._idUser;
    }

    public get rating(): number {
        return this._rating;
    }
}

type AnswerRatingQueryResult = {
    id: number;
    idAnswer: number;
    idUser: number;
    rating: number;
};

export class AnswerRating {
    private _id: number;
    private _idAnswer: number;
    private _idUser: number;
    private _rating: number;

    public constructor(id: number, idAnswer: number, idUser: number, rating: number) {
        this._id = id;
        this._idAnswer = idAnswer;
        this._idUser = idUser;
        this._rating = rating;
    };

    /**
     * Retrieves all ratings of an answer
     * @param idAnswer needed to find correct ratings
     * @returns all ratings of an answer
     */
    public static async getRatingsByAnswerId(idAnswer: number): Promise<AnswerRating[]> {
        try {
            const ratings: AnswerRatingQueryResult[] = await api.queryDatabase(`
                SELECT idRating as id, idAnswer, idUser, rating FROM AnswerRating
                WHERE idAnswer = ${idAnswer}
                `) as AnswerRatingQueryResult[];
            return ratings.map((rating: AnswerRatingQueryResult) => new AnswerRating(
                rating.id,
                rating.idAnswer,
                rating.idUser,
                rating.rating
            ));
        }
        catch (reason) {
            console.error(reason);
            return [];
        }
    }

    /**
     * Adds a rating or updates rating depending on if the user has already rated the answer
     * @param idAnswer identifies the answer
     * @param idUser identifies the user
     * @param rating input from user if it is an upvote or downvote
     * @returns true or false depending on if the query was successful
     */
    public static async updateAnswerRating(idAnswer: number, idUser: number, rating: number): Promise<boolean> {
        try {
            await api.queryDatabase(`
                INSERT INTO AnswerRating (idAnswer, idUser, rating)
                VALUES (${idAnswer}, ${idUser}, ${rating})
                ON DUPLICATE KEY UPDATE rating = ${rating};
            `);
            return true;
        }
        catch (reason) {
            console.error(reason);
            return false;
        }
    }

    public get id(): number {
        return this._id;
    }

    public get idAnswer(): number {
        return this._idAnswer;
    }

    public get idUser(): number {
        return this._idUser;
    }

    public get rating(): number {
        return this._rating;
    }
}
