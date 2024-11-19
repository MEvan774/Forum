import { Controller } from "./Controller";
import { Question } from "../models/Question";
import { Answer } from "../models/Answer";

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
        console.log(question);
        this.displayQuestion(question);
    }

    private displayQuestion(question: Question): void {
        const questionDetail: Question = question;

        const questionContainer: HTMLDivElement = document.createElement("div");
        questionContainer.classList.add(".question-detail-container");

        const questionTitleElement: HTMLHeadingElement = document.createElement("h2");
        questionTitleElement.classList.add(".question-title");
        questionTitleElement.textContent = questionDetail.title;

        const questionBodyElement: HTMLParagraphElement = document.createElement("p");
        questionBodyElement.classList.add(".question-body");
        questionBodyElement.textContent = questionDetail.description;

        const amountOfAnswersParagraph: HTMLParagraphElement = document.createElement("p");
        amountOfAnswersParagraph.textContent = `Antwoorden: ${questionDetail.amount}`;
        if (questionDetail.amount > 0) {
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
        questionContainer.innerHTML += "<div class='extra-info-container'><p id='user-name'>" + questionDetail.userName +
        "</p><p id='created-at'>" + formattedDate + "</p></div>";
    }
}
