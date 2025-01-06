import { Controller } from "./Controller";
import { FilterQuestion } from "../models/FilterQuestion";
import { Question } from "../models/Question";
import { LoadQuestionsController } from "./LoadQuestionsController";

export class QuestionFilterController extends Controller {
    public _filteredQuestions: Question[] = [];
    private _loadQuestionsController: LoadQuestionsController;

    public constructor(view: HTMLElement, loadQuestionsController: LoadQuestionsController) {
        super(view);
        this._loadQuestionsController = loadQuestionsController;
    }

    private _dropDown: HTMLButtonElement =
        document.getElementById("drop-down-button") as HTMLButtonElement;

    private _filterdateButton: HTMLButtonElement =
        document.getElementById("filter-date") as HTMLButtonElement;

    private _filteryearsExpertiseButton: HTMLButtonElement =
        document.getElementById("filter-expertise") as HTMLButtonElement;

    private _filterWithAnswerButton: HTMLButtonElement =
        document.getElementById("filter-with-answer") as HTMLButtonElement;

    private _currentFilter: FilterQuestion = FilterQuestion.ONDATE;

    public render(): void {
        this._dropDown.addEventListener("click", this.onOpenDropDown.bind(this));
        this._filterWithAnswerButton.addEventListener("click", this.onApplyFilterOnAnswer.bind(this));
        this._filterdateButton.addEventListener("click", this.onApplyFilterOnDate.bind(this));
        this._filteryearsExpertiseButton.addEventListener("click", this.onApplyfilteryearExpertise.bind(this));
    }

    public async onLoadPage(): Promise<void> {
        await this.reloadQuestions();
    }

    private onOpenDropDown(): void {
        document.getElementById("myDropdown")!.classList.toggle("show");
    }

    private async onApplyFilterOnAnswer(): Promise<void> {
        this._currentFilter = FilterQuestion.FILTERWITHANSWER;
        document.getElementById("myDropdown")!.classList.toggle("show");
        await this.reloadQuestions();
    }

    private async onApplyFilterOnDate(): Promise<void> {
        this._currentFilter = FilterQuestion.ONDATE;
        document.getElementById("myDropdown")!.classList.toggle("show");
        await this.reloadQuestions();
    }

    private async onApplyfilteryearExpertise(): Promise<void> {
        this._currentFilter = FilterQuestion.ONYEAREXPERTISE;
        document.getElementById("myDropdown")!.classList.toggle("show");
        await this.reloadQuestions();
    }

    /**
     * Removes and replaces all the questions on the page with filtered questions
     */
    private async reloadQuestions(): Promise<void> {
        const elements: NodeListOf<HTMLElement> = document.querySelectorAll<HTMLElement>(".question-director");

        elements.forEach(element => {
            element.remove();
        });

        switch (this._currentFilter) {
            case this._currentFilter = FilterQuestion.FILTERWITHANSWER:
            {
                this._loadQuestionsController.setQuestionList(this._filteredQuestions);
                await this._loadQuestionsController.loadQuestions(this._currentFilter);
                this._dropDown.innerHTML = "Filter hier je vragen op: antwoord";
                break;
            }
            case this._currentFilter = FilterQuestion.ONDATE:
            {
                this._filteredQuestions = await Question.getAll();
                this._loadQuestionsController.setQuestionList(this._filteredQuestions);
                await this._loadQuestionsController.loadQuestions(this._currentFilter);
                this._dropDown.innerHTML = "Filter hier je vragen op: datum";
                break;
            }
            case this._currentFilter = FilterQuestion.ONYEAREXPERTISE:
            {
                this._filteredQuestions = await Question.getAll();
                this._loadQuestionsController.setQuestionList(this._filteredQuestions);
                await this._loadQuestionsController.loadQuestions(this._currentFilter);
                this._dropDown.innerHTML = "Filter hier je vragen op: expertise niveau";
                break;
            }
        }
    }
}
