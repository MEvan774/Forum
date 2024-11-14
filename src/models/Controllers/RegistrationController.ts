import { Controller } from "./Controller";

export class RegisterController extends Controller {
    public constructor(view: HTMLElement) {
        super(view);
    }

    public render(): void {
        this.view.addEventListener("click", () => {
            this.registerUser();
        });
    }

    private registerUser(): void {
        console.log("Form submitted.");
    }
}
