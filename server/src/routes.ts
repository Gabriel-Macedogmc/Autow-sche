import express from 'express'
import multer from 'multer'

import PointsController from './controllers/PointsController';
import WashController from './controllers/WashController'

import uploads from './config/upload'

//instancia as classes do Controller
const pointsController = new PointsController();
const washController = new WashController();

const router = express.Router();
const upload = multer(uploads)

router.post('/points', upload.single('image'), pointsController.create)
router.get('/points', pointsController.index)
router.get('/points/:id', pointsController.show)
router.get('/wash', washController.index)

export default router;