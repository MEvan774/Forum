export class Answer {
    private _id: number;

    public constructor(id: number) {
        this._id = id;
    };

    public get id(): number {
        return this._id;
    }
}
