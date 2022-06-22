/**
 * @openapi
 * components:
 *   schemas:
 *     CardsPostRequest:
 *       type: object
 *       required:
 *         - label
 *       properties:
 *         label:
 *           type: string
 *         term:
 *           type: string
 *           nullable: true
 *         imageId:
 *           type: integer
 *           nullable: true
 *       example:
 *         label: test label
 *         term: test term
 *         imageId: null
 */
export type CardsPostRequest = {
  label: string;
  term: string | null;
  imageId: number | null;
};
