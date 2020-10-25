import express from 'express'

import PointsController from './controllers/PointsController';
import WashController from './controllers/WashController';

//instancia as classes do Controller
const pointsController = new PointsController();
const washController = new WashController();

const router = express.Router();

router.post('/points', pointsController.create)
router.get('/points/:id', pointsController.show)
router.get('/wash', washController.index)

export default router;