import { SecretUserDto } from "../../dto/SecretUserDto";

export interface UserDAO {
  getUser(alias: string): Promise<SecretUserDto | null>;

  updateFollowCount(
    alias: string,
    changeFollower: boolean,
    increment: boolean
  ): Promise<void>;

  getFollowCount(alias: string): Promise<[number, number]>;

  insertUserData(
    alias: string,
    firstName: string,
    lastName: string,
    imageUrl: string,
    password: string
  ): Promise<void>;
}
