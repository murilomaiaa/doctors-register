import { inject, injectable } from "tsyringe";
import Specialty from "../infra/typeorm/entities/Specialty";
import ISpecialtiesRepository from "../repositories/ISpecialtiesRepository";

@injectable()
export default class FindAllSpecialtiesService {
  constructor(
    @inject('SpecialtiesRepository')
    private specialtiesRepository: ISpecialtiesRepository
  ) { }

  public async execute(): Promise<Specialty[]> {
    return this.specialtiesRepository.findAll()
  }
}
