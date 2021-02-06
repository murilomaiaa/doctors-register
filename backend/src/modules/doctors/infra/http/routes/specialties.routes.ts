import { Router } from 'express'
import SpecialtiesController from '../controllers/SpecialtiesController'

const specialtiesRouter = Router()
const specialtiesController = new SpecialtiesController()

specialtiesRouter.get('/', specialtiesController.find)

export default specialtiesRouter
