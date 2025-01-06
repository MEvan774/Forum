import { Controller } from "./Controller";
import { Question } from "../models/Question";
import { HomeController } from "./HomeController";
import { FilterQuestion } from "../models/FilterQuestion";

export class LoadQuestionsController extends Controller {
    private static view: HTMLElement;

    public constructor(view: HTMLElement) {
        super(view);
        LoadQuestionsController.view = view;
        this.loadingElement = document.getElementById("loading");
        this.noPagesElement = document.getElementById("no-pages");
        this.initScrollListener();
    };

    public async render(): Promise<void> {
        void this.retrieveQuestions();
        this.questionAmount = (await Question.getAll()).length;
    }

    private lastScrollPosition: number = 0;

    public questions: Question[] = [];
    private currentIndex: number = 0;
    private postsPerPage: number = 10;
    private questionAmount: number = 0;
    private isLoading: boolean = false;
    private currentFilter: FilterQuestion = FilterQuestion.ONDATE;

    public setQuestionList(questions: Question[]): void {
        this.questions = questions;
        this.currentIndex = 0;
    }

    /**
     * loads the questions depending on wich @param filter is on
     * @param filter this enum will decide which questions will be showed
     */
    public async loadQuestions(filter: FilterQuestion): Promise<void> {
        switch (filter) {
            case filter = FilterQuestion.FILTERWITHANSWER:
            {
                this.currentFilter = FilterQuestion.FILTERWITHANSWER;
                while (this.currentIndex < this.postsPerPage) {
                    HomeController.displayQuestions(await this.getNextAnswerBatchPosts());
                    console.log("index = ", this.currentIndex);
                }
                break;
            }
            case filter = FilterQuestion.ONDATE:
            {
                this.currentFilter = FilterQuestion.ONDATE;
                while (this.currentIndex < this.postsPerPage) {
                    HomeController.displayQuestions(await this.getNextDateBatchPosts());
                    console.log("index = ", this.currentIndex);
                }
                break;
            }
            case filter = FilterQuestion.ONYEAREXPERTISE:
            {
                while (this.currentIndex < this.postsPerPage) {
                    HomeController.displayQuestions(await this.getNextYearOfProfesionBatchPosts());
                    console.log("index = ", this.currentIndex);
                }
                break;
            }
        }
    }

    /**
     * Fetch the next set of posts to display.
     * @returns The next chunk of YearOfProfesion posts to display.
     */
    public async getNextYearOfProfesionBatchPosts(): Promise<Question[]> {
        const nextPosts: Question[] = await Question.getAllAndOrderByYearsOfProfession(this.postsPerPage, this.currentIndex);
        this.currentIndex += this.postsPerPage; // Update the index for the next fetch
        return nextPosts;
    }

    /**
     * Fetch the next set of posts to display.
     * @returns The next chunk of Date posts to display.
     */
    public async getNextDateBatchPosts(): Promise<Question[]> {
        const nextPosts: Question[] = await Question.getAllAndFilterByDate(this.postsPerPage, this.currentIndex, this.questionAmount);
        this.currentIndex += this.postsPerPage; // Update the index for the next fetch
        return nextPosts;
    }

    /**
     * Fetch the next set of posts to display.
     * @returns The next chunk of posts that only contains answers to display.
     */
    public async getNextAnswerBatchPosts(): Promise<Question[]> {
        const nextPosts: Question[] = await Question.getAllAndFilterByAnswer(this.postsPerPage, this.currentIndex);
        this.currentIndex += this.postsPerPage; // Update the index for the next fetch
        return nextPosts;
    }

    /**
     * Check if there are more posts to display.
     * @returns True if there are more posts to display, false otherwise.
     */
    public hasMorePosts(): boolean {
        return this.currentIndex < this.questions.length;
    }

    /**
     * Reset the loader to start from the beginning.
     */
    public reset(): void {
        this.currentIndex = 0;
    }

/**
 * handles scroll direction when the user scrolls
 * @returns the scroll direction of the scroll wheel as a "up" or "down"
 */

    private getScrollDirection(): string {
        const currentScrollPosition: number = window.scrollY;
        const direction: string = currentScrollPosition > this.lastScrollPosition ? "down" : "up";
        this.lastScrollPosition = currentScrollPosition; // Update for the next call
        return direction;
    }

    /**
     * functie vraagt aan question model om alle vragen op te halen
     */
    private async retrieveQuestions(): Promise<void> {
        const questionsResult: Question[] = await Question.getAll();
        console.log(questionsResult);
    }

    private loadingElement: HTMLElement | null;
    private noPagesElement: HTMLElement | null;

    // Initialize the scroll event listener
    private initScrollListener(): void {
        document.addEventListener("scroll", this.handleScroll.bind(this));
    }

    // Handles the scroll event when the user scolls against the bottom of the page
    private async handleScroll(): Promise<void> {
        if (!this.isLoading && this.isBottomOfPage() && this.getScrollDirection() === "down") {
            this.isLoading = true;
            let questionBatches: Question[] = [];
            switch (this.currentFilter) {
                case this.currentFilter = FilterQuestion.ONDATE:
                {
                    questionBatches = await this.getNextYearOfProfesionBatchPosts();
                    if (questionBatches.length === 0) {
                        this.showNoPagesMessage();
                        break;
                    }
                    this.showLoading();
                    HomeController.displayQuestions(questionBatches);
                    this.hideLoading();
                    break;
                }
                case this.currentFilter = FilterQuestion.ONYEAREXPERTISE:
                {
                    questionBatches = await this.getNextYearOfProfesionBatchPosts();
                    if (questionBatches.length === 0) {
                        this.showNoPagesMessage();
                        break;
                    }
                    this.showLoading();
                    HomeController.displayQuestions(questionBatches);
                    this.hideLoading();
                    break;
                }
                case this.currentFilter = FilterQuestion.FILTERWITHANSWER:
                {
                    questionBatches = await this.getNextAnswerBatchPosts();
                    if (questionBatches.length === 0) {
                        this.showNoPagesMessage();
                        break;
                    }
                    this.showLoading();
                    HomeController.displayQuestions(questionBatches);
                    this.hideLoading();
                    break;
                }
            }
        }
    }

    // Check if the user has scrolled to the bottom of the page
    private isBottomOfPage(): boolean {
        return window.innerHeight + window.scrollY >= document.body.offsetHeight;
    }

    // Shows the loading animation
    private showLoading(): void {
        if (this.loadingElement) {
            this.loadingElement.classList.add("show");
        }
    }

    // Shows the noPages animation
    private showNoPages(): void {
        if (this.noPagesElement) {
            this.noPagesElement.classList.add("show");
        }
    }

    // Shows message that says that there are no questions left
    private showNoPagesMessage(): void {
        this.showNoPages();
        setTimeout(() => {
            this.hideNoPagesLoading();
        }, 2000);
    }

    private hideNoPagesLoading(): void {
        if (this.noPagesElement) {
            this.isLoading = false;
            this.noPagesElement.classList.remove("show");
        }
    }

    // Hide the loading animation
    private hideLoading(): void {
        if (this.loadingElement) {
            setTimeout(() => {
                this.isLoading = false;
                this.loadingElement!.classList.remove("show");
            }, 1000);
        }
    }
}
