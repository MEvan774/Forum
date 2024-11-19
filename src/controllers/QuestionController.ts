import { Controller } from "./Controller";
import { Question } from "../models/Question";
import { User } from "../models/User";
import { Answer } from "../models/Answer";

export class QuestionController extends Controller {
    public constructor(view: HTMLElement) {
        super(view);
    }

    public render(): void {
        void this.returnQuestion();
    }

    private async returnQuestion(): Promise<void> {
        
    }
}
