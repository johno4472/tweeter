import { User } from "tweeter-shared/src";
import { AuthDAO } from "../interface/AuthDAO";
import { DAOFactory } from "../interface/DAOFactory";
import { DynamoAuthDAO } from "./DynamoAuthDAO";
import { DynamoFeedDao } from "./DynamoFeedDAO";
import { DynamoFollowDAO } from "./DynamoFollowDAO";
import { DynamoStoryDAO } from "./DynamoStoryDAO";
import { FeedDAO } from "../interface/FeedDAO";
import { FollowDAO } from "../interface/FollowDAO";
import { ImageDAO } from "../interface/ImageDAO";
import { S3ImageDAO } from "../S3ImageDAO";
import { StoryDAO } from "../interface/StoryDAO";
import { UserDAO } from "../interface/UserDAO";
import { DynamoUserDAO } from "./DynamoUserDAO";

export class DynamoDAOFactory implements DAOFactory {
  private authDAO: AuthDAO = new DynamoAuthDAO();
  private storyDAO: StoryDAO = new DynamoStoryDAO();
  private feedDAO: FeedDAO = new DynamoFeedDao();
  private followDAO: FollowDAO = new DynamoFollowDAO();
  private imageDAO: ImageDAO = new S3ImageDAO();
  private userDAO: UserDAO = new DynamoUserDAO();

  public getAuthDao(): AuthDAO {
    return this.authDAO;
  }
  public getStoryDAO(): StoryDAO {
    return this.storyDAO;
  }
  public getFeedDAO(): FeedDAO {
    return this.feedDAO;
  }
  public getFollowDAO(): FollowDAO {
    return this.followDAO;
  }
  public getImageDAO(): ImageDAO {
    return this.imageDAO;
  }
  public getUserDAO(): UserDAO {
    return this.userDAO;
  }
}
