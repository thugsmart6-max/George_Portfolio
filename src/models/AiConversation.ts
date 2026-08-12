import mongoose, { Schema, models, model, type InferSchemaType } from "mongoose";

const MessageSchema = new Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant", "system"],
      required: true,
    },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const AiConversationSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, default: "Wealth Coach Session" },
    messages: [MessageSchema],
  },
  { timestamps: true }
);

AiConversationSchema.index({ userId: 1, updatedAt: -1 });

export type AiConversationDocument = InferSchemaType<
  typeof AiConversationSchema
> & {
  _id: mongoose.Types.ObjectId;
};

export const AiConversation =
  models.AiConversation || model("AiConversation", AiConversationSchema);
