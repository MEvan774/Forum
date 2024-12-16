import "../hicConfig";
import { NavController } from "../controllers/NavController";
import { FooterController } from "../controllers/FooterController";
import { EditProfileController } from "../controllers/EditProfileController";
import { DeleteProfileController } from "../controllers/DeleteProfileController";
import { StatisticsController } from "../controllers/StatisticsController";
import { url } from "@hboictcloud/api";

const navView: HTMLElement = document.querySelector(".navbar")!;
const navController: NavController = new NavController(navView);
navController.render();

const statisticsView: HTMLElement = document.querySelector(".statistics-container")!;
const statisticsController: StatisticsController = new StatisticsController(statisticsView);
statisticsController.render();

const editProfile: HTMLElement = document.querySelector(".edit-profile-container")!;
const editProfileController: EditProfileController = new EditProfileController(editProfile);
void editProfileController.render();

const deleteProfile: HTMLElement = document.querySelector(".delete-profile-container")!;
const deleteProfileController: DeleteProfileController = new DeleteProfileController(deleteProfile);
void deleteProfileController.render();

const footerView: HTMLElement = document.querySelector(".footerbar")!;
const footerController: FooterController = new FooterController(footerView);
footerController.render();

const profileButton: HTMLButtonElement = document.querySelector(".profile-button") as HTMLButtonElement;
profileButton.addEventListener("click", () => {
    url.replace("?path=profile");
    updateCorrectWindow();
});

const statisticsButton: HTMLButtonElement = document.querySelector(".statistics-button") as HTMLButtonElement;
statisticsButton.addEventListener("click", () => {
    url.replace("?path=statistics");
    updateCorrectWindow();
});

function updateCorrectWindow(): void {
    const pathWindow: string | null = url.getFromQueryString("path", null) as string | null;
    if (pathWindow === "profile") {
        statisticsView.style.display = "none";
        editProfile.style.display = "flex";
    }
    else if (pathWindow === "statistics") {
        editProfile.style.display = "none";
        statisticsView.style.display = "flex";
    }
    else {
        editProfile.style.display = "none";
        statisticsView.style.display = "none";
    }
}

updateCorrectWindow();
