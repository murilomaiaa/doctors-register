import Specialty from "@modules/doctors/infra/typeorm/entities/Specialty";
import ISpecialtiesRepository from "../ISpecialtiesRepository";

export default class FakeSpecialtiesRepository implements ISpecialtiesRepository {
  private specialties: Specialty[] = [
    { id: '1', name: "ALERGOLOGIA", createdAt: new Date(), updatedAt: new Date() },
    { id: '2', name: "ANGIOLOGIA", createdAt: new Date(), updatedAt: new Date() },
    { id: '3', name: "BUCO MAXILO", createdAt: new Date(), updatedAt: new Date() },
    { id: '4', name: "CARDIOLOGIA CLÍNICA", createdAt: new Date(), updatedAt: new Date() },
    { id: '5', name: "CARDIOLOGIA INFANTIL", createdAt: new Date(), updatedAt: new Date() },
    { id: '6', name: "CIRURGIA CABEÇA E PESCOÇO", createdAt: new Date(), updatedAt: new Date() },
    { id: '7', name: "CIRURGIA CARDÍACA", createdAt: new Date(), updatedAt: new Date() },
    { id: '8', name: "CIRURGIA DE TÓRAX", createdAt: new Date(), updatedAt: new Date() },
  ]

  public async findSpecialties(names: string[]): Promise<Specialty[]> {
    return this.specialties.filter(specialty => names.includes(specialty.name))
  }

  public async findAll(): Promise<Specialty[]> {
    return this.specialties
  }
}
