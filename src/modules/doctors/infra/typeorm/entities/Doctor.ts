import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import Address from "./Address";
import Specialty from "./Specialty";

@Entity('doctors')
export default class Doctor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', precision: 120 })
  name: string;

  @Column({ type: 'varchar', precision: 7, unique: true })
  crm: string;

  @Column({ type: 'varchar', precision: 11 })
  landline: string;

  @Column({ type: 'varchar', precision: 11 })
  phone: string;

  @OneToOne(() => Address, { eager: true })
  address: Address;

  @ManyToMany(() => Specialty, { eager: true })
  @JoinTable({
    name: 'doctor_has_specialties',
    joinColumn: {
      name: 'doctor_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'specialty_id',
      referencedColumnName: 'id',
    },
  })
  specialties: Specialty[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date
}
