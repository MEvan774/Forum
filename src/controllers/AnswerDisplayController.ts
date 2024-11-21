import { Controller } from "./Controller";
import { Answer } from "../models/Answer";
import { User } from "../models/User";
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
        const amountOfAnswers: number = await Answer.amountOfAnswers(idQuestion);
        console.log(answers);

        void this.displayAnswers(answers, amountOfAnswers);
    }

    private async displayAnswers(answers: Answer[], amountOfAnswers: number): Promise<void> {
        const amountOfAnswersHeader: HTMLHeadingElement = document.createElement("h2");
        if (amountOfAnswers === 0) {
            amountOfAnswersHeader.innerText = "0 Antwoorden";
        }
        else if (amountOfAnswers === 1) {
            amountOfAnswersHeader.innerText = "1 Antwoord";
        }
        else {
            amountOfAnswersHeader.innerText = `${amountOfAnswers} Antwoorden`;
        }
        this.view.appendChild(amountOfAnswersHeader);
        console.log("ja");
        for (const answer of answers) {
            const answerContainer: HTMLDivElement = document.createElement("div");
            answerContainer.classList.add("answer-container");

            const nameOfAnswerer: string | null = await User.getUserById(answer.idUser);
            if (nameOfAnswerer === null) {
                console.error(`No user found with ID ${answer.idUser}`);
                return;
            }

            const descriptionElement: HTMLParagraphElement = document.createElement("p");
            descriptionElement.id = "answer-description";
            descriptionElement.innerText = answer.description;

            const formattedDate: string = answer.createdAt.toLocaleString("nl-NL", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });

            const extraAnswerInfoContainer: HTMLDivElement = document.createElement("div");
            extraAnswerInfoContainer.classList.add("detailed-answer-info");
            extraAnswerInfoContainer.innerHTML = `
                <p id="user-name">${nameOfAnswerer}</p>
                <p id="date">${formattedDate}</p>
            `;
            answerContainer.appendChild(descriptionElement);
            answerContainer.appendChild(extraAnswerInfoContainer);
            this.view.appendChild(answerContainer);
        }
    }
}
