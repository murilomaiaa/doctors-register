import CreateAddressService from "@modules/doctors/services/CreateAddressService";
import CreateDoctorService from "@modules/doctors/services/CreateDoctorService";
import { Request, Response } from "express";
import { container } from "tsyringe";

export default class DoctorsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, crm, landline, phone, address, specialties } = request.body;

    const createAddress = container.resolve(CreateAddressService)

    const createdAddress = await createAddress.execute(address)

    const createDoctor = container.resolve(CreateDoctorService)

    const doctor = await createDoctor.execute({
      address: createdAddress,
      crm,
      landline,
      name,
      phone,
      specialties
    })

    return response.json(doctor)

    // name: string
    // crm: string
    // landline: string
    // phone: string
    // address: Address
    // specialties: string[]

  }
}
