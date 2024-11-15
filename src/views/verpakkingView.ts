import { MelkPak } from "../controllers/MelkPak";
import { BierKrat } from "../controllers/BierKrat";
import { Fles } from "../controllers/Fles";

const fles1: Fles = new Fles(200);
console.log(fles1.toString());
console.log(fles1.showFilledAmount());
fles1.drink(100);
console.log(fles1.showFilledAmount());

const melkpak1: MelkPak = new MelkPak(0.5);
console.log(melkpak1.toString());

const bierKrat1: BierKrat = new BierKrat();
console.log(bierKrat1.toString());

console.log(Fles.aantalFlessen);
