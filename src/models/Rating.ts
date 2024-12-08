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
     * Haalt een rating array op van een vraag
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
