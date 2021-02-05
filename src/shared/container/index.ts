import AddressesRepository from "@modules/doctors/infra/typeorm/repositories/AddressesRepository";
import DoctorsRepository from "@modules/doctors/infra/typeorm/repositories/DoctorsRepository";
import SpecialtiesRepository from "@modules/doctors/infra/typeorm/repositories/SpecialtiesRepository";
import IAddressesRepository from "@modules/doctors/repositories/IAddressesRepository";
import IDoctorsRepository from "@modules/doctors/repositories/IDoctorsRepository";
import ISpecialtiesRepository from "@modules/doctors/repositories/ISpecialtiesRepository";
import { container } from "tsyringe";

container.registerSingleton<IDoctorsRepository>(
  'DoctorsRepository',
  DoctorsRepository
)

container.registerSingleton<ISpecialtiesRepository>(
  'SpecialtiesRepository',
  SpecialtiesRepository,
);

container.registerSingleton<IAddressesRepository>(
  'AddressesRepository',
  AddressesRepository,
);

