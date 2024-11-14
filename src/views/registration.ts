import "../hicConfig";
import { RegisterController } from "../controllers/RegistrationController";

function app(): void {
    const view: HTMLElement = document.querySelector("#registration-button")!;
    const controller: RegisterController = new RegisterController(view);
    controller.render();
}
app();
