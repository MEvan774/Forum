import { Controller } from "./Controller";
import { NavController } from "./NavController";
import { FooterController } from "./FooterController";
import { Answer } from "../models/Answer";
import { CodeTag } from "../models/CodeTag";
import { CODELANGUAGE } from "../models/CodeLanguage";
import { url } from "@hboictcloud/api";

export class AnswerEditorController extends Controller {
    private _descriptionInput: HTMLTextAreaElement =
        document.getElementById("description") as HTMLTextAreaElement;

    private _codeInput: HTMLTextAreaElement = document.getElementById("code") as HTMLTextAreaElement;

    private _codeTagTypes: NodeListOf<HTMLInputElement> =
        document.querySelectorAll(".answer-editor-container input[type='radio']");

    private _navController: NavController = new NavController(document.querySelector(".navbar")!);
    private _footerController: FooterController = new FooterController(document.querySelector(".footerbar")!);

    public constructor(view: HTMLElement) {
        super(view);
    };

    public async render(): Promise<void> {
        this._navController.render();
        this._footerController.render();
        this.onClickReturn();
        await this.retrieveAnswers();
        this.onClickSave();
    };

    /**
     * Gaat terug naar de vraag pagina als gebruiker op de terug knop klikt
     */
    private onClickReturn(): void {
        const returnButton: HTMLButtonElement = document.querySelector(".return-button") as HTMLButtonElement;
        returnButton.addEventListener("click", () => {
            this.directToQuestion();
        });
    }

    /**
     * Slaat de input van de gebruiker op in de database
     * Haalt id van antwoord op uit de URL
     * Haalt de code tag op en update deze
     * Update de beschrijving van het antwoord
     */
    private onClickSave(): void {
        const saveButton: HTMLButtonElement = document.getElementById("save-answer") as HTMLButtonElement;
        saveButton.addEventListener("click", (event: Event) => {
            event.preventDefault();
            if (this.validateInput()) {
                const idAnswer: number | null = url.getFromQueryString("id-answer", null) as number | null;
                if (idAnswer === null) {
                    console.error("No answer ID found in URL");
                }
                else {
                    const confirmed: boolean = confirm("Weet je zeker dat je het antwoord wil opslaan?");
                    if (confirmed) {
                        this._codeTagTypes.forEach((radio: HTMLInputElement) => {
                            if (radio.checked) {
                                console.log(radio.value);
                                void CodeTag.updateCodeTag(idAnswer, radio.value as CODELANGUAGE);
                            }
                        });
                        void Answer.updateAnswer(idAnswer, this._descriptionInput.value, this._codeInput.value);
                        this.directToQuestion();
                    }
                }
            }
        });
    }

    /**
     * Stuurt gebruiker terug naar de vraag pagina
     * Haalt hiervoor id van vraag op uit de URL
     */
    private directToQuestion(): void {
        const idQuestion: number | null = url.getFromQueryString("id-question", null) as number | null;
        if (idQuestion === null) {
            console.error("No question ID found in URL");
        }
        else {
            window.location.href = `/question.html?id=${idQuestion}`;
        }
    }

    /**
     * Valideert of de input van de gebruiker correct is
     * @returns true als de input correct is, anders false
     */
    private validateInput(): boolean {
        let valid: boolean = true;
        if (this._descriptionInput.value.trim() === "") {
            alert("Voeg een beschrijving toe aan je antwoord");
            valid = false;
        }
        return valid;
    }

    /**
     * Haalt id op van antwoord uit de URL en haalt antwoorden op
     * als er code is wordt de code tag ook opgehaald
     * info van antwoord wordt doorgegeven aan displays
     */
    private async retrieveAnswers(): Promise<void> {
        const idAnswer: number | null = url.getFromQueryString("id-answer", null) as number | null;
        if (idAnswer === null) {
            console.error("No answer ID found in URL");
        }
        else {
            const answer: Answer | null = await Answer.getAnswerById(idAnswer);
            if (answer !== null) {
                this.displayDescription(answer.description);
                if (answer.code.length > 0) {
                    const codeTag: CodeTag = await CodeTag.getCodeTagByAnswerId(idAnswer);
                    this.displayCodeWithTag(answer.code, codeTag.tagType);
                }
            }
        };
    };

    /**
     * Zet de code in de textarea van de code en selecteert de juiste code tag
     * @param code Code van het antwoord
     * @param tagType Programmeertaal van de code
     */
    private displayCodeWithTag(code: string, tagType: string): void {
        this._codeInput.value = code;
        this._codeTagTypes.forEach((radio: HTMLInputElement) => {
            if (radio.value === tagType.toString()) {
                radio.checked = true;
            }
        });
    }

    /**
     * Zet de beschrijving van het antwoord in de textarea van de beschrijving
     * @param description Beschrijving van het antwoord
     */
    private displayDescription(description: string): void {
        this._descriptionInput.value = description;
    }
};
