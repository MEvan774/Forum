export enum MATERIAAL {
    PLASTIC = "Plastic",
    KARTON = "Karton",
    BLIK = "Blik",
    GLAS = "Glas",
}

export abstract class Verpakking {
    private _materiaal: MATERIAAL;

    protected constructor(materiaal: MATERIAAL) {
        this._materiaal = materiaal;
    };

    protected get materiaal(): MATERIAAL {
        return this._materiaal;
    }

    protected abstract toString(): string;
}
