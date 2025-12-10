import { UserDto } from "tweeter-shared/src";

export interface SecretUserDto extends UserDto {
  password: string;
}
