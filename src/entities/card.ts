import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Image } from "./image";

/**
 * @openapi
 * components:
 *   schemas:
 *     Card:
 *       type: object
 *       required:
 *         - id
 *         - label
 *       properties:
 *         id:
 *           type: integer
 *         label:
 *           type: string
 *         term:
 *           type: string
 *           nullable: true
 *         image:
 *           $ref: '#/components/schemas/Image'
 *           nullable: true
 *       example:
 *         id: 42
 *         label: test label
 *         term: test term
 *         image: null
 */
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
  @OneToOne(() => Image, (image) => image.card, {
    nullable: true,
    cascade: true,
  })
  image!: Image | null;
}
