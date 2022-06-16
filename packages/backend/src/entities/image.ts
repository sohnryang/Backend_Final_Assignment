import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Card } from "./card";

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  // Image name for referencing in the bucket.
  // Filenames are base58-encoded SHA256 sum of files.
  @Column({ length: 50 })
  name: string;

  // Card matched to the image.
  @OneToOne(() => Card, (card) => card.image, { onDelete: "CASCADE" })
  card: Card;
}
