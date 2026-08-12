import mongoose, { Schema, models, model, type InferSchemaType } from "mongoose";

const ExpenseSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      enum: [
        "Food",
        "Rent",
        "Travel",
        "Shopping",
        "Utilities",
        "Entertainment",
        "Healthcare",
        "Education",
        "Other",
      ],
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

ExpenseSchema.index({ userId: 1, date: -1 });
ExpenseSchema.index({ userId: 1, category: 1 });

export type ExpenseDocument = InferSchemaType<typeof ExpenseSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Expense = models.Expense || model("Expense", ExpenseSchema);
