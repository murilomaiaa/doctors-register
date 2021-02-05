import AppError from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";
import IDoctorsRepository from "../repositories/IDoctorsRepository";

@injectable()
export default class DeleteDoctorService {
  constructor(
    @inject('DoctorsRepository')
    private doctorsRepository: IDoctorsRepository,
  ) { }

  public async execute(id: string): Promise<void> {
    const doctor = await this.doctorsRepository.findOne(id)
    if (!doctor) throw new AppError(`User with id ${id} not found`)

    await this.doctorsRepository.delete(doctor)
  }
}
