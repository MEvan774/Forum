import "../hicConfig";
import { HomeController } from "../controllers/HomeController";
import { NavController } from "../controllers/NavController";
import { FooterController } from "../controllers/FooterController";
import { QuestionCreateController } from "../controllers/QuestionCreateController";
import { QuestionFilterController } from "../controllers/QuestionFilterController";

const navView: HTMLElement = document.querySelector(".navbar")!;
const navController: NavController = new NavController(navView);
navController.render();

const homeView: HTMLElement = document.querySelector(".questions-container")!;
const homeController: HomeController = new HomeController(homeView);
homeController.render();

const footerView: HTMLElement = document.querySelector(".footerbar")!;
const footerController: FooterController = new FooterController(footerView);
footerController.render();

const questionCreateView: HTMLElement = document.querySelector(".button-create-form")!;
const questionCreateController: QuestionCreateController = new QuestionCreateController(questionCreateView);
questionCreateController.render();

const questionFilterView: HTMLElement = document.querySelector("questions-container")!;
const questionFilterController: QuestionFilterController = new QuestionFilterController(questionFilterView);
questionFilterController.render();
