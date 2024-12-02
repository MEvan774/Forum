import { api } from "@hboictcloud/api";
import { CODELANGUAGE } from "./CodeLanguage";

type CodeTagQueryResult = {
    idTag: number;
    tagType: CODELANGUAGE;
    idAnswer: number;
};

export class CodeTag {
    private _idTag: number;
    private _tagType: CODELANGUAGE;
    private _idAnswer: number;

    public constructor(idTag: number, tagType: CODELANGUAGE, idAnswer: number) {
        this._idTag = idTag;
        this._tagType = tagType;
        this._idAnswer = idAnswer;
    };

    /**
     * Haalt de code tag op van een antwoord als de tag bestaat
     * anders geeft null terug
     * @param idAnswer meegegeven id van het antwoord
     * @returns geeft een codetag object terug of null
     */
    public static async getCodeTagByAnswerId(idAnswer: number): Promise<CodeTag | undefined> {
        try {
            const codeTag: CodeTagQueryResult[] = await api.queryDatabase(`SELECT * FROM answercodetag
                 WHERE idAnswer = ${idAnswer}`) as CodeTagQueryResult[];

            if (codeTag.length === 0) {
                return undefined;
            }
            return new CodeTag(
                codeTag[0].idTag,
                codeTag[0].tagType,
                codeTag[0].idAnswer
            );
        }
        catch (reason) {
            console.error(reason);
            return undefined;
        }
    }

    public static async updateCodeTag(idAnswer: number, tagType: CODELANGUAGE): Promise<void> {
        try {
            await api.queryDatabase(`
                INSERT INTO answercodetag (idAnswer, tagType) VALUES (${idAnswer}, '${tagType}')
                ON DUPLICATE KEY UPDATE tagType = '${tagType}'
                `);
        }
        catch (reason) {
            console.error(reason);
        }
    }

    public static async setCodeTag(tagType: CODELANGUAGE, idAnswer: number): Promise<void> {
        try {
            await api.queryDatabase(`INSERT INTO answercodetag (tagType, idAnswer) 
            VALUES ('${tagType}', '${idAnswer}')`);
        }
        catch (reason) {
            console.error(reason);
        }
    }

    public get idTag(): number {
        return this._idTag;
    }

    public get tagType(): CODELANGUAGE {
        return this._tagType;
    }

    public get idAnswer(): number {
        return this._idAnswer;
    }
}
