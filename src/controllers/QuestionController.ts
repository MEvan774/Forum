import { Controller } from "./Controller";
import { Question } from "../models/Question";
// import { Answer } from "../models/Answer";
import { url } from "@hboictcloud/api";

export class QuestionController extends Controller {
    public constructor(view: HTMLElement) {
        super(view);
    }

    public render(): void {
        console.log("Loading question...");
        void this.returnQuestion();
    }

    /**
     * Functie haalt de vraag op uit de db gebasseerd op de "idQuestion" in de URL
     */
    private async returnQuestion(): Promise<void> {
        const idQuestion: number = url.getFromQueryString("id", 0) as number;
        console.log(`Question ID: ${idQuestion.valueOf()}`);
        const question: Question[] = await Question.getQuestionById(idQuestion);
        console.log(question);
        this.displayQuestion(question);
    }

    /**
     * Displays the Question on the page with the data retrieved from the db.
     * @param question Question returned by the function above
     */
    private displayQuestion(questions: Question[]): void {
        for (const question of questions) {
            const questionContainer: HTMLDivElement = document.createElement("div");
            questionContainer.classList.add(".question-detail-container");

            const questionTitleElement: HTMLHeadingElement = document.createElement("h2");
            questionTitleElement.classList.add(".question-title");
            questionTitleElement.textContent = question.title;

            const questionBodyElement: HTMLParagraphElement = document.createElement("p");
            questionBodyElement.classList.add(".question-body");
            questionBodyElement.textContent = question.description;

            const amountOfAnswersParagraph: HTMLParagraphElement = document.createElement("p");
            amountOfAnswersParagraph.textContent = `Antwoorden: ${question.amount}`;
            if (question.amount > 0) {
                amountOfAnswersParagraph.id = "has-answer";
            }
            else {
                amountOfAnswersParagraph.id = "no-answer";
            }
            const formattedDate: string = question.createdAt.toLocaleString("nl-NL", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });

            questionContainer.appendChild(questionTitleElement);
            questionContainer.appendChild(questionBodyElement);
            questionContainer.appendChild(amountOfAnswersParagraph);
            questionContainer.innerHTML += "<div class='extra-info-container'><p id='user-name'>" + question.userName +
            "</p><p id='created-at'>" + formattedDate + "</p></div>";

            this.view.appendChild(questionContainer);
        }
    }
}
