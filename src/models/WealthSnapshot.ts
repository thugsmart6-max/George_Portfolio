import mongoose, { Schema, models, model, type InferSchemaType } from "mongoose";

const WealthSnapshotSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    netWorth: { type: Number, required: true },
    totalAssets: { type: Number, required: true },
    totalLiabilities: { type: Number, required: true },
    monthlyIncome: { type: Number, required: true },
    monthlyExpenses: { type: Number, required: true },
    savingsRate: { type: Number, required: true },
    debtRatio: { type: Number, required: true },
    emergencyFundMonths: { type: Number, required: true },
    wealthScore: { type: Number, required: true },
    capturedAt: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
);

WealthSnapshotSchema.index({ userId: 1, capturedAt: -1 });

export type WealthSnapshotDocument = InferSchemaType<
  typeof WealthSnapshotSchema
> & {
  _id: mongoose.Types.ObjectId;
};

export const WealthSnapshot =
  models.WealthSnapshot || model("WealthSnapshot", WealthSnapshotSchema);
