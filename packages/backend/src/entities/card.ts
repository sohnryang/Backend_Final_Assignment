import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Image } from "./image";

@Entity()
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  // Label for the card.
  @Column()
  label: string;

  // Term of the card, if the card is text-based.
  @Column({ nullable: true })
  term: string | null;

  // Image of the card, if the card is image-based.
  // OneToOne relations are nullable by default.
  @OneToOne(() => Image, { onDelete: "CASCADE" })
  image: Image | null;
}
