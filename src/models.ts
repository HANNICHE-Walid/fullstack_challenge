import { model, Document, Schema } from "mongoose";
import mongoose from "mongoose";
//interfaces
export interface Attribute extends Document {
  name: string;
  type: string;
}
export interface AssignedAttribute extends Document {
  attribute: Attribute;
  attributeValue: string | Date | boolean;
}
export interface ProductType extends Document {
  name: string;
  attributes: Attribute[];
}
export interface Product extends Document {
  name: string;
  productType: ProductType;
  assignedAttributes: AssignedAttribute[];
}

//schemas
const attributeSchema = new Schema({
  type: {
    type: Schema.Types.String,
    required: true,
    enum: ["DATE", "BOOL", "STRING"],
  },

  name: {
    type: Schema.Types.String,
    required: true,
  },
});

const assignedAttributeSchema = new Schema({
  attribute: {
    type: Schema.Types.ObjectId,
    ref: "Attribute",
    required: true,
  },
  attributeValue: {
    type: Schema.Types.Mixed,
    required: true,
  },
});
const productTypeSchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: true,
    },
    attributes: {
      type: Schema.Types.Array,
      items: {
        type: Schema.Types.ObjectId,
        ref: "Attribute",
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

const productSchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: true,
    },
    productType: {
      type: Schema.Types.ObjectId,
      ref: "ProductType",
    },
    assignedAttributes: {
      type: Schema.Types.Array,
      items: {
        type: Schema.Types.ObjectId,
        ref: "AssignedAttribute",
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);


//models
export const AttributeModel =
  mongoose.models.Attribute ||
  model<Attribute>("Attribute", attributeSchema, "attributes");

export const AssignedAttributeModel =
  mongoose.models.AssignedAttribute ||
  model<AssignedAttribute>(
    "AssignedAttribute",
    assignedAttributeSchema,
    "assignedAttributes"
  );

export const ProductTypeModel =
  mongoose.models.ProductType ||
  model<ProductType>("ProductType", productTypeSchema, "productTypes");

export const ProductModel =
  mongoose.models.Product ||
  model<Product>("Product", productSchema, "products");
