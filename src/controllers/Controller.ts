export abstract class Controller {
    protected view: HTMLElement;
    protected constructor(view: HTMLElement) {
        this.view = view;
    }

    protected abstract render(): void | Promise<void>;
}
