import { Controller } from "./Controller";
import { User } from "./User";

export class EditProfileController extends Controller {
    private _profilePicture: HTMLTextAreaElement =
        document.getElementById("profilePicture") as HTMLTextAreaElement;

    private _uploadPictureButton: HTMLButtonElement =
        document.getElementById("uploadPictureButton") as HTMLButtonElement;

    private _nameInput: HTMLTextAreaElement =
        document.getElementById("nameInput") as HTMLTextAreaElement;

    private _dateBirthInput: HTMLTextAreaElement =
        document.getElementById("dateBirthInput") as HTMLTextAreaElement;

    private _expertiseInput: HTMLTextAreaElement =
        document.getElementById("expertiseInput") as HTMLTextAreaElement;

    private _saveButton: HTMLButtonElement =
        document.getElementById("saveButton") as HTMLButtonElement;

    public constructor(view: HTMLElement) {
        super(view);
    };

    public render(): void {

    };
}
