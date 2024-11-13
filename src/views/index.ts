import "../hicConfig";
import { session } from "@hboictcloud/api";
import { LoggedIn } from "../models/LoggedIn";

/**
 * kijkt of er een gebruiker is ingelogd
 * leest uit session of het waar is
 * als het waar is wordt de logout button toegevoegd
 * als het niet waar is worden de login en registratie buttons toegevoegd
 */
function checkIfUserLoggedIn(): void {
    const navigationContainer: HTMLDivElement = document.querySelector(".nav-links")!;

    try {
        const loggedIn: LoggedIn = session.get("LoggedIn") as LoggedIn;
        if (loggedIn.isLoggedIn) {
            console.log(`User ${loggedIn.userName} is logged in.`);
            addLogoutButton(navigationContainer);
        }
        else {
            console.log("No user is logged in.");
            addLoginAndRegisterButtons(navigationContainer);
        }
    }
    catch {
        addLoginAndRegisterButtons(navigationContainer);
    }
}

/**
 * voegt de logout button toe aan de navigatie
 * als de logout button wordt geklikt wordt er een confirmatie scherm getoond
 * als de gebruiker op de confirmatie knop klikt wordt de gebruiker uitgelogd
 */
function addLogoutButton(navigationContainer: HTMLDivElement): void {
    const logoutButton: HTMLAnchorElement = document.createElement("a");
    logoutButton.textContent = "Log uit";
    logoutButton.addEventListener("click", () => {
        document.body.classList.add("show-logout", "show-overlay");
        const confirmButton: HTMLButtonElement = document.getElementById("logout") as HTMLButtonElement;
        confirmButton.addEventListener("click", () => {
            session.remove("LoggedIn");
            window.location.href = "/index.html";
        });

        const cancelLogoutButton: HTMLButtonElement = document.querySelector(".cancel-logout-button") as HTMLButtonElement;
        cancelLogoutButton.addEventListener("click", () => {
            document.body.classList.remove("show-logout", "show-overlay");
        });
    });
    navigationContainer.appendChild(logoutButton);
}

/**
 * voegt de login en registratie buttons toe aan de navigatie
 */
function addLoginAndRegisterButtons(navigationContainer: HTMLDivElement): void {
    const loginButton: HTMLAnchorElement = document.createElement("a");
    loginButton.href = "/login.html";
    loginButton.textContent = "Log in";

    const registerButton: HTMLAnchorElement = document.createElement("a");
    registerButton.href = "/registration.html";
    registerButton.textContent = "Registreren";

    navigationContainer.appendChild(loginButton);
    navigationContainer.appendChild(registerButton);
}

session.set("LoggedIn", { isLoggedIn: true, userName: "Koen" });
checkIfUserLoggedIn();
