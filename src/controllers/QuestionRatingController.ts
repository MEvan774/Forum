import { Controller } from "./Controller";
import { QuestionRating } from "../models/Rating";
import { url } from "@hboictcloud/api";
import { User } from "../models/User";
import { LoggedIn } from "../models/LoggedIn";

export class QuestionRatingController extends Controller {
    private _loggedInUser: LoggedIn = User.getCurrentlyLoggedInUser();
    private _idQuestion: number | null = url.getFromQueryString("id", null) as number | null;
    private _upvoteButton: HTMLButtonElement = document.createElement("button");
    private _downvoteButton: HTMLButtonElement = document.createElement("button");
    private _totalRating: HTMLParagraphElement = document.createElement("p");
    public constructor(view: HTMLElement) {
        super(view);
    }

    public render(): void {
        void this.retrieveRatings();
        this.rateQuestion();
    }

    /**
     * retrieves all ratings of a question
     * @param idQuestion id of the question
     * gives ratings to displayRatings
     */
    private async retrieveRatings(): Promise<void> {
        if (this._idQuestion !== null) {
            const questionRatings: QuestionRating[] = await QuestionRating.getRatingsByQuestionId(this._idQuestion);
            console.log(questionRatings);
            this.displayRatings(questionRatings);
        }
    }

    /**
     * displays the total rating of a question
     * @param questionRatings ratings of the question
     */
    private displayRatings(questionRatings: QuestionRating[]): void {
        let totalRating: number = 0;
        // calculates total rating of the question
        for (const rating of questionRatings) {
            totalRating += rating.rating;
        }

        this._upvoteButton.innerHTML = `
        <img src="assets/img/rating-arrow.png" alt="up-rating-arrow">
        `;
        this._upvoteButton.classList.add("upvote-button");

        this._downvoteButton.innerHTML = `
        <img src="assets/img/rating-arrow.png" alt="down-rating-arrow">
        `;
        this._downvoteButton.classList.add("downvote-button");

        this._totalRating.textContent = `${totalRating}`;
        this._totalRating.classList.add("total-rating");

        this.checkIfUserHasRated(questionRatings, this._upvoteButton, this._downvoteButton);

        this.view.appendChild(this._upvoteButton);
        this.view.appendChild(this._totalRating);
        this.view.appendChild(this._downvoteButton);
    }

    private checkIfUserHasRated(questionRatings: QuestionRating[], upvoteButton: HTMLButtonElement,
        downvoteButton: HTMLButtonElement): void {
        for (const rating of questionRatings) {
            if (rating.idUser === this._loggedInUser.userId) {
                if (rating.rating === 1) {
                    console.log("User has rated upvote");
                    upvoteButton.disabled = true;
                }
            }
            if (rating.idUser === this._loggedInUser.userId) {
                console.log("User has rated downvote");
                if (rating.rating === -1) {
                    downvoteButton.disabled = true;
                }
            }
        }
    }

    private rateQuestion(): void {
        this._downvoteButton.addEventListener("click", async () => {
            let alreadyGivenRatingMultiplier: number = 1;
            if (this._downvoteButton.disabled || this._upvoteButton.disabled) {
                alreadyGivenRatingMultiplier = 2;
            }
            if (!this._downvoteButton.disabled) {
                if (this._idQuestion !== null && this._loggedInUser.userId !== 0) {
                    await QuestionRating.updateQuestionRating(this._idQuestion, this._loggedInUser.userId, -1);
                    this._downvoteButton.disabled = true;
                    this._upvoteButton.disabled = false;
                    this._totalRating.textContent = `${parseInt(this._totalRating.textContent as string) - alreadyGivenRatingMultiplier}`;
                }
            }
        });

        this._upvoteButton.addEventListener("click", async () => {
            let alreadyGivenRatingMultiplier: number = 1;
            if (this._downvoteButton.disabled || this._upvoteButton.disabled) {
                alreadyGivenRatingMultiplier = 2;
            }
            if (!this._upvoteButton.disabled) {
                if (this._idQuestion !== null && this._loggedInUser.userId !== 0) {
                    await QuestionRating.updateQuestionRating(this._idQuestion, this._loggedInUser.userId, 1);
                    this._upvoteButton.disabled = true;
                    this._downvoteButton.disabled = false;
                    this._totalRating.textContent = `${parseInt(this._totalRating.textContent as string) + alreadyGivenRatingMultiplier}`;
                }
            }
        });
    }
}
