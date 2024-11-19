import "../hicConfig";
import { RegisterController } from "../controllers/RegistrationController";
import { NavController } from "../controllers/NavController";

const navView: HTMLElement = document.querySelector("navbar")!;
const navController: NavController = new NavController(navView);
navController.render();

const view: HTMLElement = document.querySelector("#registration-button")!;
const controller: RegisterController = new RegisterController(view);
controller.render();
