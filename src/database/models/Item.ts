import { Schema, model } from "mongoose";

const itemSchema = new Schema({
  item: {
    required: true,
    type: String,
  },
  userId: {
    required: true,
    type: String,
  },
});

// eslint-disable-next-line @typescript-eslint/naming-convention
const Item = model("Item", itemSchema, "items");

export default Item;
