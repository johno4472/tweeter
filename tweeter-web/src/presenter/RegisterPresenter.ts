import { Buffer } from "buffer";
import { User, AuthToken } from "../../../tweeter-shared/src";
import { UserService } from "../model.service/UserService";
import {
  AuthenticationPresenter,
  AuthenticationView,
} from "./AuthenticationPresenter";

export interface RegisterView extends AuthenticationView {
  setImageUrl(value: string): void;
  setImageBytes(value: Uint8Array): void;
  setImageFileExtension(value: string | any): void;
}

export class RegisterPresenter extends AuthenticationPresenter<RegisterView> {
  private userService: UserService;

  constructor(view: RegisterView) {
    super(view);
    this.userService = new UserService();
  }

  public async doRegister(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageBytes: Uint8Array,
    imageFileExtension: string,
    rememberMe: boolean
  ) {
    await this.doFailureReportingOperation(
      async () => {
        await this.doSignIn(
          async () => {
            return await this.userService.register(
              firstName,
              lastName,
              alias,
              password,
              imageBytes,
              imageFileExtension
            );
          },
          (user: User) => {
            this.view.navigate(`/feed/${user.alias}`);
          },
          rememberMe
        );
      },
      "register user",
      () => {
        this.view.setIsLoading(false);
      }
    );
  }

  public handleImageFile(file: File | undefined) {
    if (file) {
      this.view.setImageUrl(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageStringBase64 = event.target?.result as string;

        // Remove unnecessary file metadata from the start of the string.
        const imageStringBase64BufferContents =
          imageStringBase64.split("base64,")[1];

        const bytes: Uint8Array = Buffer.from(
          imageStringBase64BufferContents,
          "base64"
        );

        this.view.setImageBytes(bytes);
      };
      reader.readAsDataURL(file);

      // Set image file extension (and move to a separate method)
      const fileExtension = this.getFileExtension(file);
      if (fileExtension) {
        this.view.setImageFileExtension(fileExtension);
      }
    } else {
      this.view.setImageUrl("");
      this.view.setImageBytes(new Uint8Array());
    }
  }

  public getFileExtension(file: File): string | undefined {
    return file.name.split(".").pop();
  }
}
