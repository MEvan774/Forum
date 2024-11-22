import { AnswerEditorController } from "../controllers/AnswerEditController";

const answerEditorView: HTMLElement = document.querySelector(".answer-editor-container")!;
console.log(answerEditorView);
const answerEditorController: AnswerEditorController = new AnswerEditorController(answerEditorView);
answerEditorController.render();
