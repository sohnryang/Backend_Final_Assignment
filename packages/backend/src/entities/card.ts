import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Image } from "./image";

@Entity()
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  // Label for the card.
  @Column()
  label: string;

  // Term of the card, if the card is text-based.
  @Column({ type: String, nullable: true })
  term!: string | null;

  // Image of the card, if the card is image-based.
  // OneToOne relations are nullable by default.
  @OneToOne(() => Image, { onDelete: "CASCADE" })
  @JoinColumn()
  image!: Image | null;
}
