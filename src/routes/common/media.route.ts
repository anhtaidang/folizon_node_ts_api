import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import commonController from '@/controllers/common';

class MediaRoute implements Routes {
  public path = '/common/media';
  public router = Router();
  public mediaController = new commonController.MediaController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/upload_image`, this.mediaController.uploadImage);
  }
}

export default MediaRoute;
