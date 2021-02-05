import doctorsRouter from '@modules/doctors/infra/http/routes/doctors.routes';
import { Router } from 'express';


const routes = Router();

routes.use('/doctors', doctorsRouter);

export default routes;
