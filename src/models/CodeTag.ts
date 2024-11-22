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

    public static async getCodeTagByAnswerId(idAnswer: number): Promise<CodeTag> {
        try {
            const codeTag: CodeTagQueryResult[] = await api.queryDatabase(`SELECT * FROM answercodetag
                 WHERE idAnswer = ${idAnswer}`) as CodeTagQueryResult[];
            return codeTag.map((tag: CodeTagQueryResult) => new CodeTag(
                tag.idTag,
                tag.tagType,
                tag.idAnswer
            ))[0];
        }
        catch (reason) {
            console.error(reason);
            return new CodeTag(0, CODELANGUAGE.TS, 0);
        }
    }

    public static async updateCodeTag(idAnswer: number, tagType: CODELANGUAGE): Promise<void> {
        try {
            await api.queryDatabase(`
                UPDATE answercodetag SET tagType = '${tagType}' WHERE idAnswer = ${idAnswer}
                `);
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
