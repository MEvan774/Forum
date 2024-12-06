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

    /**
     * fetches the codeTag by finding the corresponding idQuestion
     * @param idQuestion id of the question, will be used to get the correct codeTag
     * @returns the codeTag of the question
     */

    public static async getCodeTagByQuestionId(idQuestion: number): Promise<CodeTag | undefined> {
        try {
            const codeTag: CodeTagQueryResult[] = await api.queryDatabase(`SELECT idTag, tagType,
                idQuestion AS idAnswer FROM questioncodetag
                WHERE idQuestion = ${idQuestion}`) as CodeTagQueryResult[];

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

    /**
     * Updates the codeTags values
     * @param idQuestion changes the idQuestion from the codeTag to the new one
     * @param tagType changes the idQuestion from the codeTag to the new one
     */

    public static async updateCodeTagQuestion(idQuestion: number, tagType: CODELANGUAGE): Promise<void> {
        try {
            await api.queryDatabase(`
                INSERT INTO questioncodetag (idQuestion, tagType) VALUES (${idQuestion}, '${tagType}')
                ON DUPLICATE KEY UPDATE tagType = '${tagType}'
                `);
        }
        catch (reason) {
            console.error(reason);
        }
    }

    /**
     * Sets the codeTag and idQuestion
     * @param tagType sets the codeLanguage of the codeTag
     * @param idQuestion sets the idQuestion of the codeTag
     */

    public static async setCodeTagQuestion(tagType: CODELANGUAGE, idQuestion: number): Promise<void> {
        try {
            await api.queryDatabase(`INSERT INTO questioncodetag (tagType, idQuestion) 
            VALUES ('${tagType}', '${idQuestion}')`);
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
