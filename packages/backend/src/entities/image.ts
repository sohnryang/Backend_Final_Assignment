import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  // Image name for referencing in the bucket.
  // Filenames are base58-encoded SHA256 sum of files.
  @Column({ length: 50 })
  name: string;
}
