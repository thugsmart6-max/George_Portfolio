import mongoose, { Schema, models, model, type InferSchemaType } from "mongoose";

const LiabilitySchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: [
        "Home Loan",
        "Personal Loan",
        "Credit Card",
        "Education Loan",
        "Vehicle Loan",
        "Other",
      ],
      required: true,
    },
    outstandingAmount: { type: Number, required: true, min: 0 },
    monthlyEMI: { type: Number, min: 0 },
    interestRate: { type: Number, min: 0, max: 100 },
    dueDate: { type: Date },
  },
  { timestamps: true }
);

LiabilitySchema.index({ userId: 1, category: 1 });

export type LiabilityDocument = InferSchemaType<typeof LiabilitySchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Liability = models.Liability || model("Liability", LiabilitySchema);
