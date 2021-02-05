import { Router } from 'express'
import DoctorsController from '../controllers/DoctorsController'

const doctorsRouter = Router()
const doctorsController = new DoctorsController()

doctorsRouter.post('/', doctorsController.create)
doctorsRouter.put('/', doctorsController.update)

export default doctorsRouter
