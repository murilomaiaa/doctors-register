import 'reflect-metadata';
import FakeSpecialtiesRepository from '../repositories/fakes/FakeSpecialtiesRepository';
import FindAllSpecialtiesService from './FindAllSpecialtiesService';

let fakeSpecialtiesRepository: FakeSpecialtiesRepository;
let findAllSpecialties: FindAllSpecialtiesService;

describe('FindAllSpecialties', () => {
  beforeEach(() => {
    fakeSpecialtiesRepository = new FakeSpecialtiesRepository();
    findAllSpecialties = new FindAllSpecialtiesService(fakeSpecialtiesRepository);
  });

  it('should be able to find all specialties', async () => {
    const specialties = await findAllSpecialties.execute();

    expect(specialties).toHaveLength(8);
  });
});
