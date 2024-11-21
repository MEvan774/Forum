import { Controller } from "./Controller";
import { Question } from "../models/Question";
import { User } from "../models/User";
import { Answer } from "../models/Answer";
import { Url } from "url";

export class QuestionController extends Controller {
    public constructor(view: HTMLElement) {
        super(view);
    }

    public render(): void {
        void this.returnQuestion();
    }

    /**
     * Functie haalt de vraag op uit de db gebasseerd op de "idQuestion" in de URL
     */
    private async returnQuestion(): Promise<void> {
        const pageUrl: string = window.location.href;
        const idQuestion: number = Number(pageUrl.substring(18));
        console.log(`Question ID: ${idQuestion.valueOf()}`);
        const question: Question = await Question.getQuestionById(idQuestion);
    }
}
