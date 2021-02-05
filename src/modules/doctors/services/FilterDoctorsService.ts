import { inject, injectable } from "tsyringe";
import FilterDoctorsDTO from "../dtos/FilterDoctorsDTO";
import Doctor from "../infra/typeorm/entities/Doctor";
import IDoctorsRepository from "../repositories/IDoctorsRepository";

@injectable()
export default class FilterDoctorsService {
  constructor(
    @inject('DoctorsRepository')
    private doctorsRepository: IDoctorsRepository,
  ) { }

  public async execute(data?: FilterDoctorsDTO): Promise<Doctor[]> {
    if (!data) {
      return this.doctorsRepository.findAll();
    }

    return this.doctorsRepository.filter({ ...data });
  }
}
