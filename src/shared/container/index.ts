import FakeAddressesRepository from "@modules/doctors/repositories/fakes/FakeAddressesRepository";
import FakeDoctorsRepository from "@modules/doctors/repositories/fakes/FakeDoctorsRepository";
import FakeSpecialtiesRepository from "@modules/doctors/repositories/fakes/FakeSpecialtiesRepository";
import IAddressesRepository from "@modules/doctors/repositories/IAddressesRepository";
import IDoctorsRepository from "@modules/doctors/repositories/IDoctorsRepository";
import ISpecialtiesRepository from "@modules/doctors/repositories/ISpecialtiesRepository";
import { container } from "tsyringe";

container.registerSingleton<IDoctorsRepository>(
  'DoctorsRepository',
  FakeDoctorsRepository
)

container.registerSingleton<ISpecialtiesRepository>(
  'SpecialtiesRepository',
  FakeSpecialtiesRepository,
);

container.registerSingleton<IAddressesRepository>(
  'AddressesRepository',
  FakeAddressesRepository,
);

