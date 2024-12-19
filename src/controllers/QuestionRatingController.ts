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

    /**
     * checks if the user has already rated the question
     * sets the votebutton to voted that corresponds to the rating
     * @param questionRatings all ratings of the question
     * @param upvoteButton gets active if user has already rated upvote
     * @param downvoteButton gets active if user has already rated downvote
     */
    private checkIfUserHasRated(questionRatings: QuestionRating[], upvoteButton: HTMLButtonElement,
        downvoteButton: HTMLButtonElement): void {
        for (const rating of questionRatings) {
            if (rating.idUser === this._loggedInUser.userId) {
                if (rating.rating === 1) {
                    upvoteButton.id = "voted-button";
                }
                else {
                    downvoteButton.id = "voted-button";
                }
            }
        }
    }

    /**
     * rates question with upvote or downvote depending on the button clicked
     * inserts if user hasnt rated yet, updates if user has already rated and user clicks the other button
     * and deletes if user has already rated and clicks the same button
     */
    private rateQuestion(): void {
        this._downvoteButton.addEventListener("click", async () => {
            let alreadyGivenRatingMultiplier: number = 1;
            if ((this._downvoteButton.id || this._upvoteButton.id) === "voted-button") {
                alreadyGivenRatingMultiplier = 2;
            }
            if (this._loggedInUser.userId !== 0) {
                if (this._downvoteButton.id !== "voted-button") {
                    await QuestionRating.updateQuestionRating(this._idQuestion as number, this._loggedInUser.userId, -1);
                    this._upvoteButton.id = "";
                    this._downvoteButton.id = "voted-button";
                    this._totalRating.textContent = `${parseInt(this._totalRating.textContent as string) - alreadyGivenRatingMultiplier}`;
                }
                else {
                    await QuestionRating.deleteQuestionRating(this._idQuestion as number, this._loggedInUser.userId);
                    this._downvoteButton.id = "";
                    this._upvoteButton.id = "";
                    this._totalRating.textContent = `${parseInt(this._totalRating.textContent as string) + 1}`;
                }
                void this.retrieveRatings();
            }
        });

        this._upvoteButton.addEventListener("click", async () => {
            let alreadyGivenRatingMultiplier: number = 1;
            if ((this._downvoteButton.id || this._upvoteButton.id) === "voted-button") {
                alreadyGivenRatingMultiplier = 2;
            }
            if (this._loggedInUser.userId !== 0) {
                if (this._upvoteButton.id !== "voted-button") {
                    await QuestionRating.updateQuestionRating(this._idQuestion as number, this._loggedInUser.userId, 1);
                    this._upvoteButton.id = "voted-button";
                    this._downvoteButton.id = "";
                    this._totalRating.textContent = `${parseInt(this._totalRating.textContent as string) + alreadyGivenRatingMultiplier}`;
                }
                else {
                    await QuestionRating.deleteQuestionRating(this._idQuestion as number, this._loggedInUser.userId);
                    this._downvoteButton.id = "";
                    this._upvoteButton.id = "";
                    this._totalRating.textContent = `${parseInt(this._totalRating.textContent as string) - 1}`;
                }
                void this.retrieveRatings();
            }
        });
    }
}
