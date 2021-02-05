import Specialty from "@modules/doctors/infra/typeorm/entities/Specialty";
import ISpecialtiesRepository from "@modules/doctors/repositories/ISpecialtiesRepository";
import { getRepository, In, Repository } from "typeorm";

export default class SpecialtiesRepository implements ISpecialtiesRepository {
  private ormRepository: Repository<Specialty>;

  constructor() {
    this.ormRepository = getRepository(Specialty);
  }

  public async findSpecialties(names: string[]): Promise<Specialty[]> {
    return this.ormRepository.find({ where: { name: In(names) } })
  }
}
