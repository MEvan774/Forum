import { Controller } from "./Controller";
import { Answer } from "../models/Answer";
import { User } from "../models/User";
import { url } from "@hboictcloud/api";
import { LoggedIn } from "../models/LoggedIn";

export class AnswersDisplayController extends Controller {
    public constructor(view: HTMLElement) {
        super(view);
    }

    public render(): void {
        void this.retrieveAnswers();
    }

    /**
     * Haalt antwoorden op van een vraag met het id van question
     * roept displayAnswers aan om antwoorden op de pagina te zetten
     */
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

    /**
     * functie zet antwoorden op pagina en voor het geval de gebruiker
     * die is ingelogd het antwoord heeft gegeven, maakt het bewerk en verwijder knoppen
     * @param answers Array van antwoorden
     * @param amountOfAnswers Hoeveelheid antwoorden
     */
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

        const loggedInUser: LoggedIn = User.getCurrentlyLoggedInUser();

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

            let AnswerButtons: HTMLDivElement = document.createElement("div");
            if (loggedInUser.userName === nameOfAnswerer) {
                AnswerButtons = this.setAnswerEditorButtons(answer.id);
            }

            answerContainer.appendChild(descriptionElement);
            answerContainer.appendChild(AnswerButtons);
            answerContainer.appendChild(extraAnswerInfoContainer);
            this.view.appendChild(answerContainer);
        }
    }

    /**
     * maakt bewerk en verwijder knoppen voor antwoorden
     * @param id ID van het antwoord dat bewerkt of verwijderd kan worden
     * @returns HTMLDivElement met knoppen om antwoorden te bewerken of te verwijderen
     */
    private setAnswerEditorButtons(id: number): HTMLDivElement {
        const answerButtonsDiv: HTMLDivElement = document.createElement("div");
        answerButtonsDiv.classList.add("answer-buttons");

        const editAnswerButton: HTMLButtonElement = document.createElement("button");
        editAnswerButton.id = "edit-answer-button";
        editAnswerButton.innerText = "Bewerken";

        editAnswerButton.addEventListener("click", () => {
            window.location.href = `/edit-answer.html?id=${id}`;
        });

        const deleteAnswerButton: HTMLButtonElement = document.createElement("button");
        deleteAnswerButton.id = "delete-answer-button";
        deleteAnswerButton.innerText = "Verwijderen";

        deleteAnswerButton.addEventListener("click", async () => {
            const confirmation: boolean = confirm("Weet je zeker dat je dit antwoord wilt verwijderen?");
            if (confirmation) {
                await Answer.removeAnswerById(id);
                url.redirect("");
            }
        });

        answerButtonsDiv.appendChild(editAnswerButton);
        answerButtonsDiv.appendChild(deleteAnswerButton);

        return answerButtonsDiv;
    }
}
