import mongoose, { Schema, models, model, type InferSchemaType } from "mongoose";

const IncomeSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      enum: ["Salary", "Business", "Rental", "Freelance", "Other"],
      required: true,
    },
    frequency: {
      type: String,
      enum: ["monthly", "yearly", "one-time", "weekly"],
      required: true,
    },
    date: { type: Date, required: true },
    description: { type: String, trim: true, maxlength: 500 },
  },
  { timestamps: true }
);

IncomeSchema.index({ userId: 1, date: -1 });
IncomeSchema.index({ userId: 1, category: 1 });

export type IncomeDocument = InferSchemaType<typeof IncomeSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Income = models.Income || model("Income", IncomeSchema);
