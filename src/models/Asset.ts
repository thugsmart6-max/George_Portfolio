import mongoose, { Schema, models, model, type InferSchemaType } from "mongoose";

const AssetSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: [
        "Bank Balance",
        "Mutual Funds",
        "Stocks",
        "Gold",
        "Property",
        "FD",
        "Cash",
        "Other",
      ],
      required: true,
    },
    currentValue: { type: Number, required: true, min: 0 },
    purchaseValue: { type: Number, min: 0 },
    date: { type: Date, required: true },
    notes: { type: String, trim: true, maxlength: 1000 },
  },
  { timestamps: true }
);

AssetSchema.index({ userId: 1, category: 1 });

export type AssetDocument = InferSchemaType<typeof AssetSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Asset = models.Asset || model("Asset", AssetSchema);
