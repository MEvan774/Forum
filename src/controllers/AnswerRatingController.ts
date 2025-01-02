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

        const upvoteButtonContainer: HTMLDivElement = document.createElement("div");
        upvoteButtonContainer.classList.add("upvote-button-container");
        upvoteButtonContainer.appendChild(this._upvoteButton);
        this.view.appendChild(upvoteButtonContainer);

        this.view.appendChild(this._totalRating);

        const downvoteButtonContainer: HTMLDivElement = document.createElement("div");
        downvoteButtonContainer.classList.add("downvote-button-container");
        downvoteButtonContainer.appendChild(this._downvoteButton);
        this.view.appendChild(downvoteButtonContainer);

        this.loadSpeechBubbles();
    }

    /**
     * Checks if the user has already rated the answer
     * sets the votebutton to voted that
     * corresponds to the rating
     * @param answerRatings all ratings of the answer
     * @param upvoteButton gets active if user has already rated upvote
     * @param downvoteButton gets active if user has already rated downvote
     */
    private checkIfUserHasRated(questionRatings: AnswerRating[], upvoteButton: HTMLButtonElement,
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
     * rates answer with upvote or downvote depending on the button clicked
     * inserts if user hasnt rated yet, updates if user has already rated and user clicks the other button
     * and deletes if user has already rated and clicks the same button
     */
    private rateAnswer(): void {
        this._downvoteButton.addEventListener("click", async () => {
            let alreadyGivenRatingMultiplier: number = 1;
            if ((this._downvoteButton.id || this._upvoteButton.id) === "voted-button") {
                alreadyGivenRatingMultiplier = 2;
            }
            if (this._loggedInUser.userId !== 0) {
                if (this._downvoteButton.id !== "voted-button") {
                    await AnswerRating.updateAnswerRating(this._Answer.id, this._loggedInUser.userId, -1);
                    this._downvoteButton.id = "voted-button";
                    this._upvoteButton.id = "";
                    this._totalRating.textContent = `${parseInt(this._totalRating.textContent as string) - alreadyGivenRatingMultiplier}`;
                }
                else {
                    await AnswerRating.deleteAnswerRating(this._Answer.id, this._loggedInUser.userId);
                    this._downvoteButton.id = "";
                    this._totalRating.textContent = `${parseInt(this._totalRating.textContent as string) + 1}`;
                }
            }
        });

        this._upvoteButton.addEventListener("click", async () => {
            console.log("clicked");
            let alreadyGivenRatingMultiplier: number = 1;
            if ((this._downvoteButton.id || this._upvoteButton.id) === "voted-button") {
                alreadyGivenRatingMultiplier = 2;
            }
            if (this._loggedInUser.userId !== 0) {
                if (this._upvoteButton.id !== "voted-button") {
                    await AnswerRating.updateAnswerRating(this._Answer.id, this._loggedInUser.userId, 1);
                    this._upvoteButton.id = "voted-button";
                    this._downvoteButton.id = "";
                    this._totalRating.textContent = `${parseInt(this._totalRating.textContent as string) + alreadyGivenRatingMultiplier}`;
                }
                else {
                    await AnswerRating.deleteAnswerRating(this._Answer.id, this._loggedInUser.userId);
                    this._upvoteButton.id = "";
                    this._totalRating.textContent = `${parseInt(this._totalRating.textContent as string) - 1}`;
                }
            }
        });
    }

    private loadSpeechBubbles(): void {
        const loadSpeechBubbleUpvoteContainer: HTMLDivElement = document.createElement("div");
        loadSpeechBubbleUpvoteContainer.classList.add("speech-bubble-container");
        const speechText: HTMLDivElement = document.createElement("p");
        speechText.textContent = "Geef een upvote aan dit antwoord";

        const loadSpeechBubbleDownvoteContainer: HTMLDivElement = document.createElement("div");
        loadSpeechBubbleDownvoteContainer.classList.add("speech-bubble-container");
        const speechTextDownvote: HTMLDivElement = document.createElement("p");
        speechTextDownvote.textContent = "Geef een downvote aan dit antwoord";

        this._upvoteButton.insertAdjacentElement("afterend", loadSpeechBubbleUpvoteContainer);
        loadSpeechBubbleUpvoteContainer.appendChild(speechText);

        this._downvoteButton.insertAdjacentElement("afterend", loadSpeechBubbleDownvoteContainer);
        loadSpeechBubbleDownvoteContainer.appendChild(speechTextDownvote);

        this.showSpeechBubble(loadSpeechBubbleUpvoteContainer, loadSpeechBubbleDownvoteContainer);
    }

    private showSpeechBubble(loadSpeechBubbleUpvoteContainer: HTMLDivElement,
        loadSpeechBubbleDownvoteContainer: HTMLDivElement): void {
        this._upvoteButton.addEventListener("mouseover", () => {
            loadSpeechBubbleUpvoteContainer.style.display = "block";
        });

        this._upvoteButton.addEventListener("mouseout", () => {
            loadSpeechBubbleUpvoteContainer.style.display = "none";
        });

        this._downvoteButton.addEventListener("mouseover", () => {
            loadSpeechBubbleDownvoteContainer.style.display = "block";
        });

        this._downvoteButton.addEventListener("mouseout", () => {
            loadSpeechBubbleDownvoteContainer.style.display = "none";
        });
    }
}
