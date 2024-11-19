import { Controller } from "./Controller";
import { Question } from "../models/Question";
import { User } from "../models/User";
import { Answer } from "../models/Answer";

export class QuestionController extends Controller {
    public constructor(view: HTMLElement) {
        super(view);
    }

    public render(): void {
        // void this.returnQuestion();
    }
/*
    private async returnQuestion(): Promise<void> {

    }

    private async retrieveAnswers(idQuestion: number): Promise<void> {
        const questionsResult: Question[] = await Question.getAll();
        console.log(questionsResult);
        void this.displayQuestions(questionsResult);
    }
        */
}
