import { Controller } from "./Controller";
import { AnswerRating } from "../models/Rating";
import { LoggedIn } from "../models/LoggedIn";
import { User } from "../models/User";
import { Answer } from "../models/Answer";

/**
 * Controller for the rating of an answer
 */
export class AnswerRatingController extends Controller {
    private _loggedInUser: LoggedIn = User.getCurrentlyLoggedInUser();
    private _Answer: Answer;
    private _upvoteButton: HTMLButtonElement = document.createElement("button");
    private _downvoteButton: HTMLButtonElement = document.createElement("button");
    private _totalRating: HTMLParagraphElement = document.createElement("p");
    public constructor(view: HTMLElement, Answer: Answer) {
        super(view);
        this._Answer = Answer;
    }

    public render(): void {
        void this.retrieveRatings();
        this.rateAnswer();
    }

    /**
     * retrieves all ratings of an answer
     * @param idAnswer id of the answer
     * gives ratings to displayRatings
     */
    private async retrieveRatings(): Promise<void> {
        const answerRatings: AnswerRating[] = await AnswerRating.getRatingsByAnswerId(this._Answer.id);
        this.displayRatings(answerRatings);
    }

    private displayRatings(answerRatings: AnswerRating[]): void {
        let totalRating: number = 0;
        // calculates total rating of the question
        for (const rating of answerRatings) {
            totalRating += rating.rating;
        }

        this._upvoteButton.innerHTML = `
        <img src="assets/img/rating-arrow.png" alt="up-rating-arrow">
        `;
        this._upvoteButton.classList.add("upvote-button");
        this._upvoteButton.id = `upvote-${this._Answer.id}`;

        this._downvoteButton.innerHTML = `
        <img src="assets/img/rating-arrow.png" alt="down-rating-arrow">
        `;
        this._downvoteButton.classList.add("downvote-button");
        this._downvoteButton.id = `downvote-${this._Answer.id}`;

        this._totalRating.textContent = `${totalRating}`;
        this._totalRating.classList.add("total-rating");

        this.checkIfUserHasRated(answerRatings, this._upvoteButton, this._downvoteButton);

        this.view.appendChild(this._upvoteButton);
        this.view.appendChild(this._totalRating);
        this.view.appendChild(this._downvoteButton);
    }

    /**
     * Checks if the user has already rated the question and disables the votebutton that
     * corresponds to the rating
     * @param questionRatings all ratings of the question
     * @param upvoteButton gets disabled if user has already rated upvote
     * @param downvoteButton gets disabled if user has already rated downvote
     */
    private checkIfUserHasRated(questionRatings: AnswerRating[], upvoteButton: HTMLButtonElement,
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

    /**
     * rates answer with upvote or downvote depending on the button clicked
     * inserts or updates the rating in the database and shows the updated total rating
     * sets correct button to disabled
     */
    private rateAnswer(): void {
        this._downvoteButton.addEventListener("click", async () => {
            let alreadyGivenRatingMultiplier: number = 1;
            if (this._downvoteButton.disabled || this._upvoteButton.disabled) {
                alreadyGivenRatingMultiplier = 2;
            }
            if (!this._downvoteButton.disabled) {
                if (this._loggedInUser.userId !== 0) {
                    await AnswerRating.updateAnswerRating(this._Answer.id, this._loggedInUser.userId, -1);
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
                if (this._loggedInUser.userId !== 0) {
                    await AnswerRating.updateAnswerRating(this._Answer.id, this._loggedInUser.userId, 1);
                    this._upvoteButton.disabled = true;
                    this._downvoteButton.disabled = false;
                    this._totalRating.textContent = `${parseInt(this._totalRating.textContent as string) + alreadyGivenRatingMultiplier}`;
                }
            }
        });
    }
}
