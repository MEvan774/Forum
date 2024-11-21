import { Controller } from "./Controller";
import { Answer } from "../models/Answer";
import { url } from "@hboictcloud/api";

export class AnswersDisplayController extends Controller {
    public constructor(view: HTMLElement) {
        super(view);
    }

    public render(): void {
        void this.retrieveAnswers();
    }

    private async retrieveAnswers(): Promise<void> {
        const idQuestion: number | null = url.getFromQueryString("id", null) as number | null;
        if (idQuestion === null) {
            console.error("No question ID found in URL");
            return;
        }
        const answers: Answer[] = await Answer.getAllAnswersOfQuestion(idQuestion);
        console.log(answers);
    }
}
