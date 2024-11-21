import "../hicConfig";
import { QuestionController } from "../controllers/QuestionController";
import { NavController } from "../controllers/NavController";
import { FooterController } from "../controllers/FooterController";

const navView: HTMLElement = document.querySelector(".navbar")!;
const navController: NavController = new NavController(navView);
navController.render();

const questionView: HTMLElement = document.querySelector(".question-detail-container")!;
const questionController: QuestionController = new QuestionController(questionView);
questionController.render();

const footerView: HTMLElement = document.querySelector(".footerbar")!;
const footerController: FooterController = new FooterController(footerView);
footerController.render();
