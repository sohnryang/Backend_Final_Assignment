import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
 */
@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  // Image name for referencing in the bucket.
  @Column()
  name: string;
}
