import { Controller } from "./Controller";
import { User } from "../models/User";

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
        this._currentUser = new User(0, "", "", "", new Date(), null, null, null, null, null);
    };

    private _currentUser: User;

    public async render(): Promise<void> {
        this._currentUser = await User.getUserDataById(User.getCurrentlyLoggedInUser().userId);
        console.log(this._currentUser);
        this._nameInput.value = this._currentUser.name;

        const tempDate: string = JSON.stringify(this._currentUser.yearOfBirth);
        let formattedDate: string = tempDate;
        formattedDate = tempDate.split("T")[0];
        formattedDate = formattedDate.slice(1);

        if (this._currentUser.profilePicture) {
            // let preparedImage: string = this.bufferToBase64(this._currentUser.profilePicture);
            // const urlCreator = window.URL || window.webkitURL;
            // const imageUrl: string = urlCreator.createObjectURL(this._currentUser.profilePicture);
            // const preparedImage: string = this.generateDataURI(this._currentUser.profilePicture, "image/png");
            // window.open(imageUrl, "_blank");
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

    private onUploadImageButton(): void {
        this._uploadPictureInput.click();
    }

    private onUploadImage(): void {
        console.log("UploadImage");
        // const target: HTMLInputElement = event.target as HTMLInputElement;
        this._profilePicture.src = URL.createObjectURL(this._uploadPictureInput.files[0]);
    }

    private async onClickSaveButton(): Promise<void> {
        console.log("SAVEDATA");
        // const imageBuffer: Buffer = await this.convertImageToBuffer(this._profilePicture.src);
        window.open(this._profilePicture.src, "_blank");
        await User.updateUserData(this._currentUser.id, this._nameInput.value, this._profilePicture.src, this._professionInput.value, Number(this._yearsExpertiseInput.value), new Date(this._dateBirthInput.value));
        User.setCurrentlyLoggedInUser(this._nameInput.value, this._currentUser.id);
        window.location.href = "http://localhost:3000/index.html";
    }
}
