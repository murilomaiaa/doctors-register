import { Router } from 'express'
import DoctorsController from '../controllers/DoctorsController'

const doctorsRouter = Router()
const doctorsController = new DoctorsController()

doctorsRouter.post('/', doctorsController.create)
doctorsRouter.put('/', doctorsController.update)
doctorsRouter.delete('/:id', doctorsController.delete)
doctorsRouter.get('/', doctorsController.filter)

export default doctorsRouter
