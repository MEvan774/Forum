import { Controller } from "./Controller";
import { session } from "@hboictcloud/api";
import { LoggedIn } from "../models/LoggedIn";

export class NavController extends Controller {
    public constructor(view: HTMLElement) {
        super(view);
    }

    public render(): void {
        this.createNavigationLogo();
        this.createNavigationLinks();
        this.checkIfLoggedIn();
        this.createNavigationLine();
    }

    /**
     * maakt logo aan in navigatie
     */
    private createNavigationLogo(): void {
        const navLogoContainer: HTMLDivElement = document.createElement("div");
        navLogoContainer.classList.add("logo");
        navLogoContainer.innerHTML = `
        <h1>Code Exchange</h1>
        <img src="./assets/img/code-exchange-logo.png" alt="Code Exchange Logo">
        `;
        this.view.appendChild(navLogoContainer);

        navLogoContainer.addEventListener("click", () => {
            window.location.href = "index.html";
        });
    }

    /**
     * maakt de navigatie links aan
     */
    private createNavigationLinks(): void {
        const navigationLinksContainer: HTMLDivElement = document.createElement("div");
        navigationLinksContainer.classList.add("nav-links");

        const homeLink: HTMLAnchorElement = document.createElement("a");
        homeLink.href = "/index.html";
        homeLink.classList.add("page-link");
        homeLink.innerText = "Home";

        this.view.appendChild(navigationLinksContainer);
        navigationLinksContainer.appendChild(homeLink);
    }

    /**
     * kijkt of er een gebruiker is ingelogd
     * leest uit session of het waar is
     * als het waar is wordt de logout button toegevoegd
     * als het niet waar is worden de login en registratie buttons toegevoegd
     */
    private checkIfLoggedIn(): void {
        try {
            const loggedIn: LoggedIn = session.get("LoggedIn") as LoggedIn;
            if (loggedIn.isLoggedIn) {
                this.addLoggedInUserDisplay();
                this.addLogoutButton(this.view);
            }
            else {
                this.addLoginAndRegisterButtons(this.view);
            }
        }
        catch {
            this.addLoginAndRegisterButtons(this.view);
        }
    }

    /**
     * voegt de logout button toe aan de navigatie
     * als de logout button wordt geklikt wordt er een confirmatie scherm getoond
     * als de gebruiker op de confirmatie knop klikt wordt de gebruiker uitgelogd
     */
    private addLogoutButton(navigationContainer: HTMLElement): void {
        this.addConfirmLogout();
        const logoutButton: HTMLAnchorElement = document.createElement("a");
        logoutButton.textContent = "Log uit";
        logoutButton.classList.add("normal-link");
        logoutButton.addEventListener("click", () => {
            document.body.classList.add("show-logout", "show-overlay");
            const confirmButton: HTMLButtonElement = document.getElementById("logout") as HTMLButtonElement;
            confirmButton.addEventListener("click", () => {
                session.set("LoggedIn", { isLoggedIn: false, userName: "", userId: undefined, userImage: null });
                window.location.href = "/index.html";
            });

            const cancelLogoutButton: HTMLButtonElement = document.querySelector(".cancel-logout-button") as HTMLButtonElement;
            cancelLogoutButton.addEventListener("click", () => {
                document.body.classList.remove("show-logout", "show-overlay");
            });
        });
        navigationContainer.children[1].appendChild(logoutButton);
        this.addActivePage();
    }

    private addConfirmLogout(): void {
        const addOverlay: HTMLDivElement = document.createElement("div");
        addOverlay.id = "overlay";
        document.body.appendChild(addOverlay);

        const addConfirmLogoutContainer: HTMLElement = document.createElement("section");
        addConfirmLogoutContainer.id = "logout-container";
        addConfirmLogoutContainer.innerHTML = `
        <button class="cancel-logout-button">&times;</button>
        <h2>Weet je zeker dat je wil uitloggen?</h2>
        <button id="logout">Uitloggen</button>
        `;
        document.body.appendChild(addConfirmLogoutContainer);
    }

    private addLoggedInUserDisplay(): void {
        const navigationLinksContainer: HTMLDivElement = document.querySelector(".nav-links")!;
        const userProfileLink: HTMLAnchorElement = document.createElement("a");
        userProfileLink.href = "/edit-profile.html?path=profile";
        userProfileLink.classList.add("user-profile-link");

        const loggedInObject: LoggedIn = session.get("LoggedIn") as LoggedIn;

        let userProfileImage: string = "./assets/img/default-profile-picture.png";
        if (loggedInObject.userImage) {
            userProfileImage = loggedInObject.userImage;
        }
        userProfileLink.innerHTML = `
        <p>${loggedInObject.userName}</p>
        <img src="${userProfileImage}" alt="user-profile-picture">`;

        navigationLinksContainer.appendChild(userProfileLink);
    }

    /**
     * voegt de login en registratie buttons toe aan de navigatie
     */
    private addLoginAndRegisterButtons(navigationContainer: HTMLElement): void {
        const loginButton: HTMLAnchorElement = document.createElement("a");
        loginButton.href = "/login.html";
        loginButton.classList.add("normal-link");
        loginButton.textContent = "Log in";

        const registerButton: HTMLAnchorElement = document.createElement("a");
        registerButton.href = "/registration.html";
        registerButton.classList.add("normal-link");
        registerButton.textContent = "Registreren";

        navigationContainer.children[1].appendChild(loginButton);
        navigationContainer.children[1].appendChild(registerButton);
        this.addActivePage();
    }

    private addActivePage(): void {
        const currentUrl: string = window.location.pathname;

        const navLinks: NodeListOf<HTMLAnchorElement> = document.querySelectorAll(".nav-links a");
        navLinks.forEach((link: HTMLAnchorElement) => {
            if (link.href.includes(currentUrl)) {
                link.classList.add("active");
            }
        });
    }

    private createNavigationLine(): void {
        const navigationLine: HTMLHRElement = document.createElement("hr");
        navigationLine.classList.add("gradient-line");
        this.view.parentElement?.insertBefore(navigationLine, this.view.nextSibling);
    }
}
