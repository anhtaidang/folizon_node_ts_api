import fs from 'fs';
import config from 'config';
import mime, { extension as getExtension } from 'mime';
import uuidv4 from 'uuid/v4';
import AWS from 'aws-sdk';
import { genMediaPathByFolderType, getFieldEnumConfig, getFileNameFromUrl, validateImageBase64 } from '@/utils/util';
import { EnumFolderType } from '@/constants/enum';
import { S3MediaConfig } from '@/interfaces/db.interface';

const Bucket = 'images-molis-art-test';

const { endpoint }: S3MediaConfig = config.get('s3Media');
AWS.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: 'hn',
  endpoint: endpoint,
  apiVersions: {
    s3: '2006-03-01',
  },
  logger: process.stdout,
});
class MediaService {
  private s3 = new AWS.S3();
  public uploadToFTPS3 = async (filename, pathFile, key, contentType) => {
    // const s3 = new AWS.S3();
    const uploadParams: any = {
      Bucket,
    };
    const fileStream = fs.createReadStream(pathFile);
    fileStream.on('error', err => {
      console.log('File Error', err);
    });
    uploadParams.Body = fileStream;
    uploadParams.Key = `media/${key}/${filename}`;
    uploadParams.ContentType = contentType;
    uploadParams.ACL = 'public-read';
    await this.s3.upload(uploadParams, (err, data) => {
      if (err) {
        console.log('Error', err);
      }
      if (data) {
        console.log('Upload Success', data.Location);
      }
    });
  };
  public uploadImage = async ({ imageContent, folderType, prefix = 'image', subPrefix = '' }) => {
    if (validateImageBase64(imageContent)) {
      let result = null;
      const matches = imageContent.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches.length === 3) {
        const extension = getExtension(matches[1]);
        const fileName = `${prefix}-${subPrefix}-${uuidv4()}.${extension}`;
        try {
          const base64 = imageContent.replace(/^data:([A-Za-z-+\/]+);base64,/, '');
          const pathFolder = genMediaPathByFolderType(folderType);
          if (!fs.existsSync(pathFolder)) {
            fs.mkdirSync(pathFolder, { recursive: true });
          }

          const pathFile = `${pathFolder}/${fileName}`;
          fs.writeFileSync(pathFile, base64, {
            flags: 'w',
            encoding: 'base64',
            mode: 0o666,
          } as any);

          await this.uploadToFTPS3(
            fileName,
            pathFile,
            getFieldEnumConfig({ value: folderType, fieldName: 'foldername', enumConfig: EnumFolderType }),
            `image/${extension}`,
          );

          fs.unlinkSync(pathFile);

          result = {
            imageName: fileName,
            // imageUrl: req ? genUrlMediaByFolderType(req, folderType, fileName) : fileName,
          };
        } catch (e) {
          console.log(e);
        }
      }
      return result;
    }
    return getFileNameFromUrl(imageContent);
  };
  public deleteFileInFTPS3 = (key, filename) => {
    // const s3 = new AWS.S3();
    const params = {
      Bucket,
      Key: `media/${key}/${filename}`,
    };
    this.s3.deleteObject(params, err => {
      if (err) console.log(err, err.stack);
    });
  };
}

export default MediaService;
