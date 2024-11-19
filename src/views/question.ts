import "../hicConfig";
import { QuestionController } from "../controllers/QuestionController";
import { NavController } from "../controllers/NavController";

const navView: HTMLElement = document.querySelector(".navbar")!;
const navController: NavController = new NavController(navView);
navController.render();

const questionView: HTMLElement = document.querySelector(".question-detail-container") as HTMLElement;
const questionController: QuestionController = new QuestionController(questionView);
questionController.render();
