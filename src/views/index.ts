import "../hicConfig";
import { HomeController } from "../controllers/HomeController";
import { NavController } from "../controllers/NavController";
import { FooterController } from "../controllers/FooterController";

const navView: HTMLElement = document.querySelector(".navbar")!;
const navController: NavController = new NavController(navView);
navController.render();

const homeView: HTMLElement = document.querySelector(".questions-container")!;
const homeController: HomeController = new HomeController(homeView);
homeController.render();

const footerView: HTMLElement = document.querySelector(".footerbar")!;
const footerController: FooterController = new FooterController(footerView);
footerController.render();
