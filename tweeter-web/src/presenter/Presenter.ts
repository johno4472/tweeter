export interface View {
  displayErrorMessage(value: string): void;
}

export interface MessageView extends View {
  displayInfoMessage(value: string, param: number): string;
  deleteMessage(value: string): void;
}

export abstract class Presenter<V extends View> {
  private _view: V;

  public constructor(view: V) {
    this._view = view;
  }

  protected get view() {
    return this._view;
  }

  protected async doFailureReportingOperation(
    operation: () => Promise<void>,
    operationDescription: string,
    finalOperation: () => void = () => {}
  ) {
    try {
      await operation();
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to ${operationDescription} because of exception: ${
          (error as Error).message
        }`
      );
    } finally {
      await finalOperation();
    }
  }
}
