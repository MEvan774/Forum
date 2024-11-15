import { Verpakking, MATERIAAL } from "./Verpakking";
import { Fles } from "./Fles";

export class BierKrat extends Verpakking {
    private aantalFlessen: number = 24;
    public static readonly MATERIAL: MATERIAAL = MATERIAAL.GLAS;

    public constructor() {
        super(MATERIAAL.GLAS);
        Fles.aantal += 24;
    }

    public get materiaal(): MATERIAAL {
        return super.materiaal;
    }

    public get aantalGemaakteFlessen(): number {
        return Fles.aantalFlessen;
    }

    public get aantalFlessenInKrat(): number {
        return this.aantalFlessen;
    }

    public toString(): string {
        return `Bierkrat: ${this.materiaal}, aantal flessen=${this.aantalFlessen}`;
    }
}
