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

        const ratingStatus: string = this.checkIfUserHasRated(questionRatings, this._upvoteButton, this._downvoteButton);

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
     * checks if the user has already rated the question
     * sets the votebutton to voted that corresponds to the rating
     * @param questionRatings all ratings of the question
     * @param upvoteButton gets active if user has already rated upvote
     * @param downvoteButton gets active if user has already rated downvote
     */
    private checkIfUserHasRated(questionRatings: QuestionRating[], upvoteButton: HTMLButtonElement,
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

    private loadSpeechBubbles(ratingStatus: string): void {
        const loadSpeechBubbleUpvoteContainer: HTMLDivElement = document.createElement("div");
        loadSpeechBubbleUpvoteContainer.classList.add("speech-bubble-container");
        const speechTextUpvote: HTMLParagraphElement = document.createElement("p");
        speechTextUpvote.textContent = "Geef een upvote aan deze vraag";
        const upvoteStatusContainer: HTMLDivElement = document.createElement("div");

        const loadSpeechBubbleDownvoteContainer: HTMLDivElement = document.createElement("div");
        loadSpeechBubbleDownvoteContainer.classList.add("speech-bubble-container");
        const speechTextDownvote: HTMLParagraphElement = document.createElement("p");
        speechTextDownvote.textContent = "Geef een downvote aan deze vraag";
        const downvoteStatusContainer: HTMLDivElement = document.createElement("div");

        this._upvoteButton.insertAdjacentElement("afterend", loadSpeechBubbleUpvoteContainer);
        loadSpeechBubbleUpvoteContainer.appendChild(speechTextUpvote);
        loadSpeechBubbleUpvoteContainer.appendChild(upvoteStatusContainer);

        this._downvoteButton.insertAdjacentElement("afterend", loadSpeechBubbleDownvoteContainer);
        loadSpeechBubbleDownvoteContainer.appendChild(speechTextDownvote);
        loadSpeechBubbleDownvoteContainer.appendChild(downvoteStatusContainer);

        this.updateRatingStatus(ratingStatus, upvoteStatusContainer, downvoteStatusContainer);
        this.showSpeechBubble(loadSpeechBubbleUpvoteContainer, loadSpeechBubbleDownvoteContainer);
        this.rateQuestion(upvoteStatusContainer, downvoteStatusContainer);
    }

    /**
     * rates question with upvote or downvote depending on the button clicked
     * inserts if user hasnt rated yet, updates if user has already rated and user clicks the other button
     * and deletes if user has already rated and clicks the same button
     */
    private rateQuestion(upvoteStatusContainer: HTMLDivElement, downvoteStatusContainer: HTMLDivElement): void {
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
                    this.updateRatingStatus("downvoted", upvoteStatusContainer, downvoteStatusContainer);
                }
                else {
                    await QuestionRating.deleteQuestionRating(this._idQuestion as number, this._loggedInUser.userId);
                    this._downvoteButton.id = "";
                    this._upvoteButton.id = "";
                    this._totalRating.textContent = `${parseInt(this._totalRating.textContent as string) + 1}`;
                    this.updateRatingStatus("none", upvoteStatusContainer, downvoteStatusContainer);
                }
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
                    this.updateRatingStatus("upvoted", upvoteStatusContainer, downvoteStatusContainer);
                }
                else {
                    await QuestionRating.deleteQuestionRating(this._idQuestion as number, this._loggedInUser.userId);
                    this._downvoteButton.id = "";
                    this._upvoteButton.id = "";
                    this._totalRating.textContent = `${parseInt(this._totalRating.textContent as string) - 1}`;
                    this.updateRatingStatus("none", upvoteStatusContainer, downvoteStatusContainer);
                }
                void this.retrieveRatings();
            }
        });
    }

    private showSpeechBubble(loadSpeechBubbleUpvoteContainer: HTMLDivElement, loadSpeechBubbleDownvoteContainer: HTMLDivElement): void {
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

    private updateRatingStatus(ratingStatus: string, upvoteStatusContainer: HTMLDivElement, downvoteStatusContainer: HTMLDivElement): void {
        if (ratingStatus === "upvoted") {
            upvoteStatusContainer.innerHTML = "<p>status: <span style='color: green;'>geselecteerd</span></p>";
            downvoteStatusContainer.innerHTML = "<p>status: <span style='color: red;'>niet geselecteerd</span></p>";
        }
        else if (ratingStatus === "downvoted") {
            upvoteStatusContainer.innerHTML = "<p>status: <span style='color: red;'>niet geselecteerd</span></p>";
            downvoteStatusContainer.innerHTML = "<p>status: <span style='color: green;'>geselecteerd</span></p>";
        }
        else if (ratingStatus === "none") {
            upvoteStatusContainer.innerHTML = "<p>status: <span style='color: red;'>niet geselecteerd</span></p>";
            downvoteStatusContainer.innerHTML = "<p>status: <span style='color: red;'>niet geselecteerd</span></p>";
        }
    }
}
