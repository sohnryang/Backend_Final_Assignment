import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Card } from "./card";

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  // Image name for referencing in the bucket.
  // Filenames are base58-encoded SHA256 sum of files.
  @Column({ length: 50 })
  name: string;

  // Bidirectional reference to Card.
  @OneToOne(() => Card, (card) => card.image)
  @JoinColumn()
  card!: Card | null;
}
