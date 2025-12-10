import { Toast } from "../components/toaster/Toast";

export interface ToastView {
  deleteMessage(messageId: string): void;
}

export class ToastPresenter {
  private _view: ToastView;

  constructor(view: ToastView) {
    this._view = view;
  }

  public deleteExpiredToasts(messageList: Toast[]) {
    const now = Date.now();

    for (let toast of messageList) {
      if (
        toast.expirationMillisecond > 0 &&
        toast.expirationMillisecond < now
      ) {
        this._view.deleteMessage(toast.id);
      }
    }
  }
}
