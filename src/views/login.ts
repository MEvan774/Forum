import "../hicConfig";
import { LoginController } from "../controllers/LoginController";
import { NavController } from "../controllers/NavController";

const navView: HTMLElement = document.querySelector("nav")!;
const navController: NavController = new NavController(navView);
navController.render();

const view: HTMLButtonElement = document.querySelector("#login-user-button") as HTMLButtonElement;
const controller: LoginController = new LoginController(view);
controller.render();
