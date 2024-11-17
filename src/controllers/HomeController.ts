import { Controller } from "./Controller";
import { Question } from "../models/Question";
import { User } from "../models/User";

export class HomeController extends Controller {
    public constructor(view: HTMLElement) {
        super(view);
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
        void this.displayQuestions(questionsResult);
    }

    /**
     * functie weergeeft de vragen op de home pagina
     * de user wordt opgehaald met het idUser uit de question tabel
     */
    private async displayQuestions(questions: Question[]): Promise<void> {
        for (const question of questions) {
            const questionContainer: HTMLDivElement = document.createElement("div");
            questionContainer.classList.add("question-container");
            questionContainer.id = `question-${question.id}`;

            const title: HTMLHeadingElement = document.createElement("h2");
            title.textContent = question.title;

            const description: HTMLParagraphElement = document.createElement("p");
            description.textContent = question.description;
            description.classList.add("description");

            const extraInfo: HTMLDivElement = document.createElement("div");
            extraInfo.classList.add("extra-info-container");

            const userName: string = await User.getUser(question.idUser);

            const formattedDate: string = question.createdAt.toLocaleString("nl-NL", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });

            questionContainer.appendChild(title);
            questionContainer.appendChild(description);
            questionContainer.innerHTML += "<div class='extra-info-container'><p id='user-name'>" + userName +
            "</p><p id='created-at'>" + formattedDate + "</p></div>";
            this.view.appendChild(questionContainer);
        }
    }
}
