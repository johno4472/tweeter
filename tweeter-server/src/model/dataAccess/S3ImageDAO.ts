import { ImageDAO } from "./interface/ImageDAO";
import {
  ObjectCannedACL,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

export class S3ImageDAO implements ImageDAO {
  readonly REGION = "us-east-1";
  readonly BUCKET = "jimmy-tweeter-image";

  async putImage(fileName: string, imageArray: Uint8Array): Promise<string> {
    // let decodedImageBuffer: Buffer = Buffer.from(
    //   imageStringBase64Encoded,
    //   "base64"
    // );
    const bodyBuffer = Buffer.from(imageArray);
    const s3Params = {
      Bucket: this.BUCKET,
      Key: "image/" + fileName,
      Body: bodyBuffer,
      ContentType: "image/png",
      ACL: ObjectCannedACL.public_read,
    };
    const c = new PutObjectCommand(s3Params);
    const client = new S3Client({ region: this.REGION });
    try {
      await client.send(c);
      return `https://${this.BUCKET}.s3.${this.REGION}.amazonaws.com/image/${fileName}`;
    } catch (error) {
      throw Error("s3 put image failed with: " + error);
    }
  }
}
