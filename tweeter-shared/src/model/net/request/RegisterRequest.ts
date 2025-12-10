import { LoginRequest } from "./LoginRequest";

export interface RegisterRequest extends LoginRequest {
  firstName: string;
  lastName: string;
  userImageBytes: Uint8Array;
  imageFileExtension: string;
}
