import { celebrate, Joi } from 'celebrate'
import { Router } from 'express'
import DoctorsController from '../controllers/DoctorsController'

const doctorsRouter = Router()
const doctorsController = new DoctorsController()

doctorsRouter.post(
  '/',
  celebrate({
    body: {
      name: Joi.string().max(120).required(),
      crm: Joi.string().length(7).required(),
      landline: Joi.string().min(10).max(11).required(),
      phone: Joi.string().min(10).max(11).required(),
      address: Joi.object({
        zipcode: Joi.string().length(8).required(),
        state: Joi.string().length(2).required(),
        city: Joi.string().required(),
        neighborhood: Joi.string().required(),
        street: Joi.string().required(),
        number: Joi.string().required(),
        complementary: Joi.string()
      }),
      specialties: Joi.array().items(Joi.string()).required()
    }
  }),
  doctorsController.create
)
doctorsRouter.put(
  '/',
  celebrate({
    body: {
      id: Joi.string().required(),
      name: Joi.string().max(120).required(),
      crm: Joi.string().length(7).required(),
      landline: Joi.string().min(10).max(11).required(),
      phone: Joi.string().min(10).max(11).required(),
      address: Joi.object({
        zipcode: Joi.string().length(8).required(),
        state: Joi.string().length(2).required(),
        city: Joi.string().required(),
        neighborhood: Joi.string().required(),
        street: Joi.string().required(),
        number: Joi.string().required()
      }),
      specialties: Joi.array().items(Joi.string()).required()
    }
  }),
  doctorsController.update
)
doctorsRouter.delete('/:id', doctorsController.delete)
doctorsRouter.get('/', doctorsController.filter)

export default doctorsRouter
