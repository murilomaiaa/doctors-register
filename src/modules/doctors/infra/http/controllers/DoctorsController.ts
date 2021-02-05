import CreateAddressService from "@modules/doctors/services/CreateAddressService";
import CreateDoctorService from "@modules/doctors/services/CreateDoctorService";
import DeleteDoctorService from "@modules/doctors/services/DeleteDoctorService";
import FilterDoctorsService from "@modules/doctors/services/FilterDoctorsService";
import UpdateDoctorService from "@modules/doctors/services/UpdateDoctorService";
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
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id, name, crm, landline, phone, address, specialties } = request.body;

    const createAddress = container.resolve(CreateAddressService)

    const createdAddress = await createAddress.execute(address)

    const updateDoctor = container.resolve(UpdateDoctorService)

    const doctor = await updateDoctor.execute({
      id,
      address: createdAddress,
      crm,
      landline,
      name,
      phone,
      specialties
    })

    return response.json(doctor)
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params

    const deleteDoctor = container.resolve(DeleteDoctorService)

    await deleteDoctor.execute(id)

    return response.status(204).json()
  }

  public async filter(request: Request, response: Response): Promise<Response> {
    const {
      crm,
      id,
      landline,
      name,
      phone,
      specialties,
      zipcode,
      state,
      city,
      neighborhood,
      street,
      number,
      complementary
    } = request.query

    let _specialties: string[] | undefined;
    if (specialties) {
      _specialties = String(specialties)
        .split(',')

    } else {
      _specialties = undefined
    }
    console.log({ _specialties, specialties })

    let address = {
      zipcode: zipcode ? String(zipcode) : undefined,
      state: state ? String(state) : undefined,
      city: city ? String(city) : undefined,
      neighborhood: neighborhood ? String(neighborhood) : undefined,
      street: street ? String(street) : undefined,
      number: number ? String(number) : undefined,
      complementary: complementary ? String(complementary) : undefined
    }

    const filterDoctors = container.resolve(FilterDoctorsService)

    const doctors = await filterDoctors.execute({
      crm: crm ? String(crm) : undefined,
      id: id ? String(id) : undefined,
      landline: landline ? String(landline) : undefined,
      name: name ? String(name) : undefined,
      phone: phone ? String(phone) : undefined,
      specialties: _specialties,
      address
    })

    return response.json(doctors)
  }
}
