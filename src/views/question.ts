import "../hicConfig";
import { QuestionController } from "../controllers/QuestionController";
import { NavController } from "../controllers/NavController";
import { FooterController } from "../controllers/FooterController";
import { AnswersDisplayController } from "../controllers/AnswerDisplayController";
import { AnswerController } from "../controllers/AnswerController";

const navView: HTMLElement = document.querySelector(".navbar")!;
const navController: NavController = new NavController(navView);
navController.render();

const questionView: HTMLElement = document.querySelector(".question-container")!;
const questionController: QuestionController = new QuestionController(questionView);
questionController.render();

const answerDisplayView: HTMLElement = document.querySelector(".answers-container")!;
const answerDisplayController: AnswersDisplayController = new AnswersDisplayController(answerDisplayView);
answerDisplayController.render();

const answerView: HTMLElement = document.querySelector(".answers-container")!;// binds post anwer button to the onclick function
const answerController: AnswerController = new AnswerController(answerView);
answerController.render();

const footerView: HTMLElement = document.querySelector(".footerbar")!;
const footerController: FooterController = new FooterController(footerView);
footerController.render();
