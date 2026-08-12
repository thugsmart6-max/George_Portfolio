import mongoose, { Schema, models, model, type InferSchemaType } from "mongoose";

const AiRecommendationSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    why: { type: String, required: true },
    whatChanges: [{ type: String }],
    projectedImpact: { type: String, required: true },
    priority: {
      type: String,
      enum: ["high", "medium", "low"],
      default: "medium",
    },
    dismissed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

AiRecommendationSchema.index({ userId: 1, createdAt: -1 });

export type AiRecommendationDocument = InferSchemaType<
  typeof AiRecommendationSchema
> & {
  _id: mongoose.Types.ObjectId;
};

export const AiRecommendation =
  models.AiRecommendation ||
  model("AiRecommendation", AiRecommendationSchema);
