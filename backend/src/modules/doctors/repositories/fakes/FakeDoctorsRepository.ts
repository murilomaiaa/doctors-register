import RepositoryFilterDoctorsDTO from "@modules/doctors/dtos/RepositoryFilterDoctorsDTO";
import RepositoryCreateDoctorDTO from "@modules/doctors/dtos/RepositoryCreateDoctorDTO";
import Doctor from "@modules/doctors/infra/typeorm/entities/Doctor";
import Specialty from "@modules/doctors/infra/typeorm/entities/Specialty";
import IDoctorsRepository from "../IDoctorsRepository";
import Address from "@modules/doctors/infra/typeorm/entities/Address";

export default class FakeDoctorsRepository implements IDoctorsRepository {
  private doctors: Doctor[] = []

  private nextId = 1;

  public async create(data: RepositoryCreateDoctorDTO): Promise<Doctor> {
    const doctor = new Doctor()

    Object.assign(doctor, {
      id: String(this.nextId),
      ...data
    })

    this.nextId++
    this.doctors.push(doctor)

    return doctor
  }

  public async save(doctor: Doctor): Promise<void> {
    const index = this.doctors.findIndex(r => r.id === doctor.id);

    this.doctors[index] = doctor;
  }

  public async findOne(id: string): Promise<Doctor | undefined> {
    return this.doctors.find(doctor => doctor.id === id && !doctor.deletedAt);
  }
  public async findByCrm(crm: string): Promise<Doctor | undefined> {
    return this.doctors.find(doctor => doctor.crm === crm);
  }

  public async findAll(): Promise<Doctor[]> {
    return this.doctors;
  }

  public async filter({
    address, crm, id, landline, name, phone, specialties
  }: RepositoryFilterDoctorsDTO): Promise<Doctor[]> {
    const simpleAttributesFilter = (doctor: Doctor) => {
      if (crm && doctor.crm !== crm) return false;
      if (id && doctor.id !== id) return false;
      if (landline && doctor.landline !== landline) return false;
      if (name && doctor.name !== name) return false;
      if (phone && doctor.phone !== phone) return false;
      return true;
    };

    const specialtiesFilter = (doctorSpecialties: Specialty[]) => {
      if (!specialties) return true;

      const specialtiesNames = doctorSpecialties.map(s => s.name);


      let foundAllSpecialties = true
      specialties.forEach(specialty => {
        if (specialtiesNames.indexOf(specialty) === -1) {
          foundAllSpecialties = false;
        }
      })

      return foundAllSpecialties;
    }

    const addressFilter = (doctorAddress: Address) => {
      if (!address) return true;

      const { zipcode, street, number, complementary, city, neighborhood, state } = address;

      if (zipcode && doctorAddress.zipcode !== zipcode) return false;
      if (street && doctorAddress.street !== street) return false;
      if (number && doctorAddress.number !== number) return false;
      if (complementary && doctorAddress.complementary !== complementary) return false;
      if (city && doctorAddress.city !== city) return false;
      if (neighborhood && doctorAddress.neighborhood !== neighborhood) return false;
      if (state && doctorAddress.state !== state) return false;
      return true;
    }

    return this.doctors.filter(
      doctor =>
        simpleAttributesFilter(doctor)
        && specialtiesFilter(doctor.specialties)
        && addressFilter(doctor.address)
    );
  }

  public async delete(doctor: Doctor): Promise<void> {
    const index = this.doctors.findIndex(r => r.id === doctor.id);

    this.doctors[index].deletedAt = new Date();
  }
}
