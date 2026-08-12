import mongoose, { Schema, models, model, type InferSchemaType } from "mongoose";

const GoalSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    targetAmount: { type: Number, required: true, min: 1 },
    currentSavings: { type: Number, required: true, min: 0, default: 0 },
    targetDate: { type: Date, required: true },
    monthlyContribution: { type: Number, required: true, min: 0, default: 0 },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    category: {
      type: String,
      enum: [
        "Home",
        "Vehicle",
        "Education",
        "Retirement",
        "Emergency",
        "Travel",
        "Wedding",
        "Other",
      ],
      required: true,
    },
  },
  { timestamps: true }
);

GoalSchema.index({ userId: 1, targetDate: 1 });

export type GoalDocument = InferSchemaType<typeof GoalSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Goal = models.Goal || model("Goal", GoalSchema);
