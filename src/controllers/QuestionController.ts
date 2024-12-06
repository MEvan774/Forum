import { Controller } from "./Controller";
import { Question } from "../models/Question";
// import { Answer } from "../models/Answer";
import { url } from "@hboictcloud/api";
import { CodeTag } from "../models/CodeTag";

export class QuestionController extends Controller {
    public constructor(view: HTMLElement) {
        super(view);
    }

    public render(): void {
        void this.retrieveQuestion();
    }

    /**
     * Functie haalt de vraag op uit de db gebasseerd op de "idQuestion" in de URL
     */
    private async retrieveQuestion(): Promise<void> {
        const idQuestion: number = url.getFromQueryString("id", 0) as number;
        console.log(`Question ID: ${idQuestion}`);
        const question: Question[] = await Question.getQuestionById(idQuestion);
        console.log(question);
        void this.displayQuestion(question);
    }

    /**
     * Displays the Question on the page with the data retrieved from the db.
     * @param question Question returned by the function above
     */
    private async displayQuestion(questions: Question[]): Promise<void> {
        for (const question of questions) {
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
            console.log("Question code:", question.code);

            this.view.appendChild(questionTitleElement);
            this.view.appendChild(questionBodyElement);
            if (question.code) {
                const questionCodeTag: CodeTag | undefined = await CodeTag.getCodeTagByQuestionId(question.id);

                if (questionCodeTag !== undefined) {
                    console.log("KANKER");
                    const preElement: HTMLPreElement = document.createElement("pre");
                    const codeElement: HTMLElement = document.createElement("code");
                    preElement.id = "answer-code";
                    codeElement.classList.add(`language-${questionCodeTag.tagType}`);
                    codeElement.innerText = question.code;
                    preElement.appendChild(codeElement);
                    this.view.appendChild(preElement);
                }
            }
            this.view.appendChild(amountOfAnswersParagraph);
            this.view.innerHTML += "<div class='extra-info-container'><p id='user-name'>" +
            question.userName +
            "</p><p id='created-at'>" + formattedDate + "</p></div>";
        }
    }
}
