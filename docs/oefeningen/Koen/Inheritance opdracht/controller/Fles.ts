import { Verpakking, MATERIAAL } from "./Verpakking";

export class Fles extends Verpakking {
    public static aantal: number = 0;
    public static readonly MATERIAL: MATERIAAL = MATERIAAL.GLAS;
    private _maxInhoudInML: number = 250;
    private _inhoudInML: number;

    public constructor(inhoudInML: number) {
        super(MATERIAAL.GLAS);
        if (inhoudInML < this._maxInhoudInML) {
            this._inhoudInML = inhoudInML;
            Fles.aantal++;
        }
        else {
            throw new Error("Inhoud kan niet groter zijn dan de max inhoud.");
        }
    };

    public static get aantalFlessen(): number {
        return Fles.aantal;
    }

    public vul(hoeveelheid: number): void {
        if (this._inhoudInML + hoeveelheid <= this._maxInhoudInML) {
            this._inhoudInML += hoeveelheid;
        }
    }

    public drink(hoeveelheid: number): void {
        if (this._inhoudInML - hoeveelheid >= 0) {
            this._inhoudInML -= hoeveelheid;
        }
    }

    public showFilledAmount(): string {
        return `De fles is voor ${this._inhoudInML} gevuld.`;
    }

    public get materiaal(): MATERIAAL {
        return super.materiaal;
    }

    public get inhoudInML(): number {
        return this._inhoudInML;
    }

    public toString(): string {
        return `Fles: ${this.materiaal}, max inhoud=${this._maxInhoudInML}ML, inhoud=${this._inhoudInML}ML`;
    }
}
