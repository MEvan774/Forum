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

        const ratingStatus: string = this.checkIfUserHasRated(answerRatings, this._upvoteButton, this._downvoteButton);

        const upvoteButtonContainer: HTMLDivElement = document.createElement("div");
        upvoteButtonContainer.classList.add("upvote-button-container");
        upvoteButtonContainer.appendChild(this._upvoteButton);
        this.view.appendChild(upvoteButtonContainer);

        this.view.appendChild(this._totalRating);

        const downvoteButtonContainer: HTMLDivElement = document.createElement("div");
        downvoteButtonContainer.classList.add("downvote-button-container");
        downvoteButtonContainer.appendChild(this._downvoteButton);
        this.view.appendChild(downvoteButtonContainer);

        this.loadSpeechBubbles(ratingStatus);
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
        downvoteButton: HTMLButtonElement): string {
        const ratingStatus: string = "none";
        for (const rating of questionRatings) {
            if (rating.idUser === this._loggedInUser.userId) {
                if (rating.rating === 1) {
                    upvoteButton.id = "voted-button";
                    return "upvoted";
                }
                else {
                    downvoteButton.id = "voted-button";
                    return "downvoted";
                }
            }
        }
        return ratingStatus;
    }

    /**
     * rates answer with upvote or downvote depending on the button clicked
     * inserts if user hasnt rated yet, updates if user has already rated and user clicks the other button
     * and deletes if user has already rated and clicks the same button
     */
    private rateAnswer(upvoteStatusContainer: HTMLDivElement, downvoteStatusContainer: HTMLDivElement): void {
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
                    this.updateRatingStatus("downvoted", upvoteStatusContainer, downvoteStatusContainer);
                }
                else {
                    await AnswerRating.deleteAnswerRating(this._Answer.id, this._loggedInUser.userId);
                    this._downvoteButton.id = "";
                    this._totalRating.textContent = `${parseInt(this._totalRating.textContent as string) + 1}`;
                    this.updateRatingStatus("none", upvoteStatusContainer, downvoteStatusContainer);
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
                    this.updateRatingStatus("upvoted", upvoteStatusContainer, downvoteStatusContainer);
                }
                else {
                    await AnswerRating.deleteAnswerRating(this._Answer.id, this._loggedInUser.userId);
                    this._upvoteButton.id = "";
                    this._totalRating.textContent = `${parseInt(this._totalRating.textContent as string) - 1}`;
                    this.updateRatingStatus("none", upvoteStatusContainer, downvoteStatusContainer);
                }
            }
        });
    }

    /**
     * function loads the speech bubbles for both the upvote and downvote button
     * @param ratingStatus given rating if user has already rated the answer
     */
    private loadSpeechBubbles(ratingStatus: string): void {
        const loadSpeechBubbleUpvoteContainer: HTMLDivElement = document.createElement("div");
        loadSpeechBubbleUpvoteContainer.classList.add("speech-bubble-container");
        const speechText: HTMLDivElement = document.createElement("p");
        speechText.textContent = "Geef een upvote aan dit antwoord";
        const upvoteStatusContainer: HTMLDivElement = document.createElement("div");

        const loadSpeechBubbleDownvoteContainer: HTMLDivElement = document.createElement("div");
        loadSpeechBubbleDownvoteContainer.classList.add("speech-bubble-container");
        const speechTextDownvote: HTMLDivElement = document.createElement("p");
        speechTextDownvote.textContent = "Geef een downvote aan dit antwoord";
        const downvoteStatusContainer: HTMLDivElement = document.createElement("div");

        this._upvoteButton.insertAdjacentElement("afterend", loadSpeechBubbleUpvoteContainer);
        loadSpeechBubbleUpvoteContainer.appendChild(speechText);
        loadSpeechBubbleUpvoteContainer.appendChild(upvoteStatusContainer);

        this._downvoteButton.insertAdjacentElement("afterend", loadSpeechBubbleDownvoteContainer);
        loadSpeechBubbleDownvoteContainer.appendChild(speechTextDownvote);
        loadSpeechBubbleDownvoteContainer.appendChild(downvoteStatusContainer);

        this.updateRatingStatus(ratingStatus, upvoteStatusContainer, downvoteStatusContainer);
        this.showSpeechBubble(loadSpeechBubbleUpvoteContainer, loadSpeechBubbleDownvoteContainer);
        this.rateAnswer(upvoteStatusContainer, downvoteStatusContainer);
    }

    /**
     * shows the speech bubble if the user hovers over the upvote or downvote button
     * @param loadSpeechBubbleUpvoteContainer used to show the speech bubble for the upvote button
     * @param loadSpeechBubbleDownvoteContainer used to show the speech bubble for the downvote button
     */
    private showSpeechBubble(loadSpeechBubbleUpvoteContainer: HTMLDivElement,
        loadSpeechBubbleDownvoteContainer: HTMLDivElement): void {
        this._upvoteButton.addEventListener("mouseover", () => {
            this.fadeInSpeechBubble(loadSpeechBubbleUpvoteContainer);
        });

        this._upvoteButton.addEventListener("mouseout", () => {
            loadSpeechBubbleUpvoteContainer.style.display = "none";
        });

        this._downvoteButton.addEventListener("mouseover", () => {
            this.fadeInSpeechBubble(loadSpeechBubbleDownvoteContainer);
        });

        this._downvoteButton.addEventListener("mouseout", () => {
            loadSpeechBubbleDownvoteContainer.style.display = "none";
        });
    }

    private fadeInSpeechBubble(speechBubbleContainer: HTMLDivElement): void {
        speechBubbleContainer.style.display = "flex";
        speechBubbleContainer.style.animation = "fadeIn 0.5s";
    }

    /**
     * updates the status of the rating per button
     * @param ratingStatus given rating of the user
     * @param upvoteStatusContainer container for the status of the upvote
     * @param downvoteStatusContainer container for the status of the downvote
     */
    private updateRatingStatus(ratingStatus: string, upvoteStatusContainer: HTMLDivElement, downvoteStatusContainer: HTMLDivElement): void {
        if (ratingStatus === "upvoted") {
            upvoteStatusContainer.innerHTML = "<p>status: <span style='color: green;'>geselecteerd</span></p>";
            downvoteStatusContainer.innerHTML = "<p>status: <span>niet geselecteerd</span></p>";
        }
        else if (ratingStatus === "downvoted") {
            upvoteStatusContainer.innerHTML = "<p>status: <span>niet geselecteerd</span></p>";
            downvoteStatusContainer.innerHTML = "<p>status: <span style='color: green;'>geselecteerd</span></p>";
        }
        else if (ratingStatus === "none") {
            upvoteStatusContainer.innerHTML = "<p>status: <span>niet geselecteerd</span></p>";
            downvoteStatusContainer.innerHTML = "<p>status: <span>niet geselecteerd</span></p>";
        }
    }
}
