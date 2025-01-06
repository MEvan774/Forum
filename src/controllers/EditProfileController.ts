import { Controller } from "./Controller";
import { User } from "../models/User";
import { types, utils } from "@hboictcloud/api";

export class EditProfileController extends Controller {
    private _profilePicture: HTMLImageElement =
        document.getElementById("profilePicture") as HTMLImageElement;

    private _uploadPictureButton: HTMLButtonElement =
        document.getElementById("uploadPictureButton") as HTMLButtonElement;

    private _uploadPictureInput: HTMLInputElement =
        document.getElementById("uploadPictureInput") as HTMLInputElement;

    private _nameInput: HTMLTextAreaElement =
        document.getElementById("nameInput") as HTMLTextAreaElement;

    private _dateBirthInput: HTMLInputElement =
        document.getElementById("dateBirthInput") as HTMLInputElement;

    private _professionInput: HTMLTextAreaElement =
        document.getElementById("professionInput") as HTMLTextAreaElement;

    private _yearsExpertiseInput: HTMLTextAreaElement =
        document.getElementById("yearsProfessionInput") as HTMLTextAreaElement;

    private _saveButton: HTMLButtonElement =
        document.getElementById("saveButton") as HTMLButtonElement;

    public constructor(view: HTMLElement) {
        super(view);
    };

    private _currentUser!: User;
    private _imageData!: types.DataURL;

    /**
     * Gets the current logged in User and sets the account values in the input fields
     */

    public async render(): Promise<void> {
        this._currentUser = await User.getUserDataById(User.getCurrentlyLoggedInUser().userId);
        console.log(this._currentUser);
        this._nameInput.value = this._currentUser.name;

        const tempDate: string = JSON.stringify(this._currentUser.yearOfBirth);
        let formattedDate: string = tempDate;
        formattedDate = tempDate.split("T")[0];
        formattedDate = formattedDate.slice(1);

        if (this._currentUser.profilePicture) {
            this._profilePicture.src = this._currentUser.profilePicture;
        }

        this._dateBirthInput.value = formattedDate;

        if (this._currentUser.yearsOfProfession)
            this._yearsExpertiseInput.value = JSON.stringify(this._currentUser.yearsOfProfession);
        else
            this._yearsExpertiseInput.value = "";

        if (this._currentUser.profession)
            this._professionInput.value = this._currentUser.profession;
        else
            this._professionInput.value = "";

        this._saveButton.addEventListener("click", this.onClickSaveButton.bind(this));
        this._uploadPictureButton.addEventListener("click", this.onUploadImageButton.bind(this));
        this._uploadPictureInput.addEventListener("change", this.onUploadImage.bind(this));
    }

    // activates the function: onUploadImage, that allows the user to upload profile picture
    private onUploadImageButton(): void {
        this._uploadPictureInput.click();
    }

    // gets the picture input and sets the _profilePicture image as the uploaded image
    private async onUploadImage(): Promise<void> {
        this._imageData = (await utils.getDataUrl(this._uploadPictureInput)) as types.DataURL;
        this._profilePicture.src = this._imageData.url;
    }

    // checks if some values are not filled in and saves the changes
    private async onClickSaveButton(): Promise<void> {
        let birthDateValue: Date | null = null;
        if (this._dateBirthInput.value)
            birthDateValue = new Date(this._dateBirthInput.value);

        let imageLink: string | null = null;
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (this._imageData && this._imageData.url)// checks if image variables are present
            imageLink = this._imageData.url;
        else
            if (this._currentUser.profilePicture)
                imageLink = this._currentUser.profilePicture;

        await User.updateUserData(this._currentUser.id, this._nameInput.value, imageLink,
            this._professionInput.value, Number(this._yearsExpertiseInput.value), birthDateValue);
        User.setCurrentlyLoggedInUser(this._nameInput.value, this._currentUser.id, imageLink);
        window.location.href = "http://localhost:3000/index.html";
    }
}
