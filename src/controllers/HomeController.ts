import { Controller } from "./Controller";
import { Question } from "../models/Question";

export class HomeController extends Controller {
    private static view: HTMLElement;

    public constructor(view: HTMLElement) {
        super(view);
        HomeController.view = view;
    };

    public render(): void {
        void this.retrieveQuestions();
    }

    /**
     * functie vraagt aan question model om alle vragen op te halen
     */
    private async retrieveQuestions(): Promise<void> {
        const questionsResult: Question[] = await Question.getAll();
        console.log(questionsResult);
        HomeController.displayQuestions(questionsResult);
    }

    /**
     * functie weergeeft de vragen op de home pagina
     * de user wordt opgehaald uit de getUser functie van de User model met de foreign key idUser van de vraag
     * de hoeveelheid antwoorden wordt opgehaald uit de amountOfAnswers functie van de Answer model...
     * met de IdQuestion van de vraag
     */
    public static displayQuestions(questions: Question[]): void {
        for (const question of questions) {
            const questionAnchor: HTMLAnchorElement = document.createElement("a");
            questionAnchor.classList.add("question-director");
            questionAnchor.addEventListener("click", () => {
                window.location.href = `/question.html?id=${question.id}`;
            });
            const questionContainer: HTMLDivElement = document.createElement("div");
            questionContainer.classList.add("question-container");
            questionContainer.id = `question-${question.id}`;

            const title: HTMLHeadingElement = document.createElement("h2");
            title.textContent = question.title;

            const description: HTMLParagraphElement = document.createElement("p");
            description.textContent = question.description;
            description.classList.add("description");

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

            questionContainer.appendChild(title);
            questionContainer.appendChild(description);
            questionContainer.appendChild(amountOfAnswersParagraph);
            questionContainer.innerHTML += `
            <div class='extra-info-container'><p id='user-name'>${question.userName}</p>
            <p id='created-at'>${formattedDate}</p></div>
            `;
            HomeController.view.appendChild(questionAnchor);
            questionAnchor.appendChild(questionContainer);
        }
    }
}
