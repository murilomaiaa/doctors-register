import doctorsRouter from '@modules/doctors/infra/http/routes/doctors.routes';
import specialtiesRouter from '@modules/doctors/infra/http/routes/specialties.routes';
import { Router } from 'express';


const routes = Router();

routes.use('/doctors', doctorsRouter);
routes.use('/specialties', specialtiesRouter)
export default routes;
