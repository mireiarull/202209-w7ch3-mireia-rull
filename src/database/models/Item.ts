import type { InferSchemaType } from "mongoose";
import { Schema, model } from "mongoose";

const itemSchema = new Schema({
  item: {
    required: true,
    type: String,
  },
  image: {
    type: String,
    required: true,
  },
  owner: {
    required: true,
    type: Schema.Types.ObjectId,
  },
});

// eslint-disable-next-line @typescript-eslint/naming-convention
const Item = model("Item", itemSchema, "items");

export type ItemStructure = InferSchemaType<typeof itemSchema>;

export default Item;
