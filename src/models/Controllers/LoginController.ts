import { Controller } from "./Controller";

class LoginController extends Controller {
    public constructor(view: HTMLElement) {
        super(view);
    }

    public render(): void {
        this.view.addEventListener("click", () => {
            this.loginUser();
        });
    }

    private loginUser(): void {
        console.log("Form submitted.");
    }
}
