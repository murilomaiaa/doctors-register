import Specialty from "../infra/typeorm/entities/Specialty";

export default interface ISpecialtiesRepository {
  findSpecialties: (names: string[]) => Promise<Specialty[]>
}
