import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Card } from "./card";

/**
 * @openapi
 * components:
 *   schemas:
 *     Image:
 *       type: object
 *       required:
 *         - id
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         card:
 *           $ref: '#/components/schemas/Card'
 *           nullable: true
 */
@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  // Image name for referencing in the bucket.
  @Column()
  name: string;

  // Bidirectional reference to Card.
  @OneToOne(() => Card, (card) => card.image, { onDelete: "CASCADE" })
  @JoinColumn()
  card!: Card | null;
}
