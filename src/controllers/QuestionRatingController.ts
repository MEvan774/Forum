import { Controller } from "./Controller";
import { QuestionRating } from "../models/Rating";

export class QuestionRatingController extends Controller {
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
        const questionRatings: QuestionRating[] = await QuestionRating.getRatingsByQuestionId(0);
        this.displayRatings(questionRatings);
    }

    /**
     * displays the total rating of a question
     * @param questionRatings ratings of the question
     */
    private displayRatings(questionRatings: QuestionRating[]): void {
        const ratingContainer: HTMLElement = document.createElement("div");
        ratingContainer.classList.add("rating-container");
        let totalRating: number = 0;
        // calculates total rating of the question
        for (const rating of questionRatings) {
            totalRating += rating.rating;
        }

        const upvoteButton: HTMLButtonElement = document.createElement("button");
        upvoteButton.innerHTML = `
        <img src="assets/img/rating-arrow.png" alt="up-rating-arrow">
        `;
        upvoteButton.classList.add("upvote-button");
        const downvoteButton: HTMLButtonElement = document.createElement("button");
        downvoteButton.innerHTML = `
        <img src="assets/img/rating-arrow.png" alt="down-rating-arrow">
        `;
        downvoteButton.classList.add("downvote-button");

        ratingContainer.appendChild(upvoteButton);
        ratingContainer.innerHTML += `<p>${totalRating}</p>`;
        ratingContainer.appendChild(downvoteButton);
        this.view.appendChild(ratingContainer);
    }
}
