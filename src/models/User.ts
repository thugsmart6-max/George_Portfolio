import mongoose, { Schema, models, model, type InferSchemaType } from "mongoose";

const UserSchema = new Schema(
  {
    userId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    mobile: { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    age: { type: Number, required: true, min: 13, max: 120 },
    profession: { type: String, required: true, trim: true },
    profileImage: { type: String },
    kycStatus: {
      type: String,
      enum: ["not_started", "pending", "verified", "rejected"],
      default: "not_started",
    },
    subscriptionStatus: {
      type: String,
      enum: ["free", "pro", "enterprise"],
      default: "free",
    },
    onboardingCompleted: { type: Boolean, default: false },
    resetTokenHash: { type: String, select: false },
    resetTokenExpires: { type: Date, select: false },
  },
  { timestamps: true }
);

export type UserDocument = InferSchemaType<typeof UserSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const User = models.User || model("User", UserSchema);
