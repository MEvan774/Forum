import { Controller } from "./Controller";

export class FooterController extends Controller {
    public constructor(view: HTMLElement) {
        super(view);
    }

    public render(): void {
        this.createFooter();
    }

    private createFooter(): void {
        const footer: HTMLElement = document.createElement("footer");
        footer.classList.add("footerbar");
        footer.innerHTML = `
            <p>
            Copyright © 2024 <span class="footer-span">Code Exchange</span>. Alle rechten voorbehouden ofzoiets.
            </p>
        `;

        this.view.appendChild(footer);
    }
}
