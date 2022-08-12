import { EnumResult } from '@/constants/enumCommon';
import { RequestBodyType } from '@/interfaces/common.interface';
import MediaService from '@/services/media.service';
import { NextFunction, Response } from 'express';
import { sendApiResponseData, sendError } from '../utils';

class MediaController {
  private mediaService = new MediaService();
  public uploadImage = async (req: RequestBodyType<any>, res: Response, next: NextFunction) => {
    try {
      const { imageContent, folderType } = req.body;
      const responseResult = await this.mediaService.uploadImage({ imageContent, folderType });
      return sendApiResponseData(res, EnumResult.SUCCESS, { data: responseResult });
    } catch (e) {
      sendError(res, next)(e);
      throw e;
    }
  };
}

export default MediaController;
