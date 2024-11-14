import "../hicConfig";
import { LoginController } from "../controllers/LoginController";

function renderLoginController(): void {
    const view: HTMLButtonElement = document.querySelector("login-user-button") as HTMLButtonElement;
    const controller: LoginController = new LoginController(view);
    controller.render();
}

renderLoginController();
