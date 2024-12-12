import "../hicConfig";
import { NavController } from "../controllers/NavController";
import { FooterController } from "../controllers/FooterController";
import { EditProfileController } from "../controllers/EditProfileController";

const navView: HTMLElement = document.querySelector(".navbar")!;
const navController: NavController = new NavController(navView);
navController.render();

const editProfile: HTMLElement = document.querySelector(".edit-profile-container")!;
const editProfileController: EditProfileController = new EditProfileController(editProfile);
void editProfileController.render();

const footerView: HTMLElement = document.querySelector(".footerbar")!;
const footerController: FooterController = new FooterController(footerView);
footerController.render();
