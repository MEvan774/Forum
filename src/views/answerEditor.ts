import "../hicConfig";
import { AnswerEditorController } from "../controllers/AnswerEditController";

const answerEditorView: HTMLElement = document.querySelector(".answer-editor-container")!;
const answerEditorController: AnswerEditorController = new AnswerEditorController(answerEditorView);
void answerEditorController.render();
