import { Controller } from "./Controller";
import { FilterQuestion } from "../models/FilterQuestion";
import { Question } from "../models/Question";
import { HomeController } from "./HomeController";
import { User } from "../models/User";

export class QuestionFilterController extends Controller {
    public constructor(view: HTMLElement) {
        super(view);
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

    private onOpenDropDown(): void {
        document.getElementById("myDropdown")!.classList.toggle("show");
    }

    private async onApplyFilterOnAnswer(): Promise<void> {
        this._currentFilter = FilterQuestion.FILTERWITHANSWER;
        await this.reloadQuestions();
    }

    private async onApplyFilterOnDate(): Promise<void> {
        this._currentFilter = FilterQuestion.ONDATE;
        await this.reloadQuestions();
    }

    private async onApplyfilteryearExpertise(): Promise<void> {
        this._currentFilter = FilterQuestion.ONYEAREXPERTISE;
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
                const filteredQuestions: Question[] = await Question.getAllAndFilterByAnswer();
                HomeController.displayQuestions(filteredQuestions);
                this._dropDown.innerHTML = "Filter hier je vragen op: antwoord";
                break;
            }
            case this._currentFilter = FilterQuestion.ONDATE:
            {
                const filteredQuestions: Question[] = await Question.getAll();
                HomeController.displayQuestions(filteredQuestions);
                this._dropDown.innerHTML = "Filter hier je vragen op: datum";
                break;
            }
            case this._currentFilter = FilterQuestion.ONYEAREXPERTISE:
            {
                const questions: Question[] = await Question.getAll();
                const users: User[] = await User.getAll();
                const sortedUsers: User[] = users.sort((a, b) => b.yearsOfProfession! - a.yearsOfProfession!);
                const sortedQuestions: Question[] = [];

                sortedUsers.forEach(user => {
                    sortedQuestions.push(...questions.filter(q => q.idUser === user.id));
                });
                HomeController.displayQuestions(sortedQuestions);
                this._dropDown.innerHTML = "Filter hier je vragen op: expertise niveau";
                break;
            }
        }
    }
}
