import { Verpakking, MATERIAAL } from "./Verpakking";

export class MelkPak extends Verpakking {
    public static aantal: number = 0;
    public static readonly MATERIAL: MATERIAAL = MATERIAAL.KARTON;
    private _maxInhoudLiter: number = 1;
    private _inhoudInLiter: number;

    public constructor(inhoudInLiter: number) {
        super(MATERIAAL.KARTON);
        if (inhoudInLiter < this._maxInhoudLiter) {
            this._inhoudInLiter = inhoudInLiter;
            MelkPak.aantal++;
        }
        else {
            throw new Error("Inhoud kan niet groter zijn dan de max inhoud.");
        }
    }

    public static get aantalMelkpakken(): number {
        return MelkPak.aantal;
    }

    public vul(hoeveelheid: number): void {
        if (this._inhoudInLiter + hoeveelheid <= this._maxInhoudLiter) {
            this._inhoudInLiter += hoeveelheid;
        }
    }

    public drink(hoeveelheid: number): void {
        if (this._inhoudInLiter - hoeveelheid >= 0) {
            this._inhoudInLiter -= hoeveelheid;
        }
    }

    public get materiaal(): MATERIAAL {
        return super.materiaal;
    }

    public get inhoudInLiter(): number {
        return this._inhoudInLiter;
    }

    public toString(): string {
        return `Melkpak: ${this.materiaal}, max inhoud=${this._maxInhoudLiter}L, inhoud=${this._inhoudInLiter}L`;
    }
}
