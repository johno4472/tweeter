import { AuthDAO } from "./AuthDAO";
import { FeedDAO } from "./FeedDAO";
import { FollowDAO } from "./FollowDAO";
import { ImageDAO } from "./ImageDAO";
import { StoryDAO } from "./StoryDAO";
import { UserDAO } from "./UserDAO";

export interface DAOFactory {
  getAuthDao(): AuthDAO;
  getStoryDAO(): StoryDAO;
  getFeedDAO(): FeedDAO;
  getFollowDAO(): FollowDAO;
  getImageDAO(): ImageDAO;
  getUserDAO(): UserDAO;
}
