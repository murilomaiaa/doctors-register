import FindAllSpecialtiesService from "@modules/doctors/services/FindAllSpecialtiesService";
import { Request, Response } from "express";
import { container } from "tsyringe";

export default class DoctorsController {
  public async find(_: Request, response: Response): Promise<Response> {

    const findSpecialties = container.resolve(FindAllSpecialtiesService)

    const specialties = await findSpecialties.execute()

    return response.json(specialties)
  }
}
