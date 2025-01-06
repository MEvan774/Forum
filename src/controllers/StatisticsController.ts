import { Controller } from "./Controller";
import { AnswerRating } from "../models/Rating";
import { User } from "../models/User";
import { LoggedIn } from "../models/LoggedIn";

export class StatisticsController extends Controller {
    public constructor(view: HTMLElement) {
        super(view);
    }

    public render(): void {
        console.log("StatisticsController is rendering");
        void this.retrieveAvarageAnswerRating();
    }

    /**
     * Gets the avarage rating from the User model
     */
    private async retrieveAvarageAnswerRating(): Promise<void> {
        const LoggedInUser: LoggedIn = User.getCurrentlyLoggedInUser();
        const avarageAnswerRating: number | null = await AnswerRating.getAvarageAnswerRating(LoggedInUser.userId);
        console.log(avarageAnswerRating);
        this.displayAvarageAnswerRating(avarageAnswerRating);
    }

    /**
     * Displays the avarage rating on the page
     * @param avarageAnswerRating the avarage rating of the user
     */
    private displayAvarageAnswerRating(avarageAnswerRating: number | null): void {
        const avarageRatingParagraph: HTMLParagraphElement = document.createElement("p");
        if (avarageAnswerRating === null) {
            avarageRatingParagraph.innerHTML = "Gemiddelde antwoord waardering: <span class= no-rates>Je hebt nog geen beoordelingen</span>";
        }
        else {
            avarageRatingParagraph.innerHTML = `Gemiddelde antwoord waardering: <span>${avarageAnswerRating}</span>`;
        }
        avarageRatingParagraph.classList.add("avarage-rating");
        this.view.appendChild(avarageRatingParagraph);
    }
}
