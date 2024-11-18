import "../hicConfig";
import { HomeController } from "../controllers/HomeController";
import { NavController } from "../controllers/NavController";

const navView: HTMLElement = document.querySelector(".nav-links")!;
const navController: NavController = new NavController(navView);
navController.render();

const homeView: HTMLElement = document.querySelector(".questions-container")!;
const homeController: HomeController = new HomeController(homeView);
homeController.render();
