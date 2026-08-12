import { connectDB } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { User } from "@/models";
import type { RegisterInput } from "@/validators/auth";
import type { UserProfile } from "@/types";
import { createHash, randomBytes } from "crypto";

async function nextUserId(): Promise<string> {
  const latest = await User.findOne().sort({ createdAt: -1 }).lean();
  if (!latest?.userId) return "U1001";
  const num = parseInt(String(latest.userId).replace(/\D/g, ""), 10);
  const next = Number.isFinite(num) ? num + 1 : 1001;
  return `U${next}`;
}

export function toUserProfile(user: {
  _id: { toString(): string };
  userId: string;
  name: string;
  email: string;
  mobile: string;
  age: number;
  profession: string;
  profileImage?: string;
  kycStatus: UserProfile["kycStatus"];
  subscriptionStatus: UserProfile["subscriptionStatus"];
  onboardingCompleted?: boolean;
  createdAt: Date;
  updatedAt: Date;
}): UserProfile {
  return {
    id: user._id.toString(),
    userId: user.userId,
    name: user.name,
    email: user.email,
    mobile: user.mobile,
    age: user.age,
    profession: user.profession,
    profileImage: user.profileImage,
    kycStatus: user.kycStatus,
    subscriptionStatus: user.subscriptionStatus,
    onboardingCompleted: Boolean(user.onboardingCompleted),
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

export async function registerUser(input: RegisterInput) {
  await connectDB();
  const existing = await User.findOne({ email: input.email.toLowerCase() });
  if (existing) {
    throw new Error("EMAIL_EXISTS");
  }

  const userId = await nextUserId();
  const passwordHash = await hashPassword(input.password);

  const user = await User.create({
    userId,
    name: input.name,
    email: input.email.toLowerCase(),
    mobile: input.mobile,
    passwordHash,
    age: input.age,
    profession: input.profession,
  });

  return toUserProfile(user);
}

export async function authenticateUser(email: string, password: string) {
  await connectDB();
  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+passwordHash"
  );
  if (!user) return null;
  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return null;
  return toUserProfile(user);
}

export async function getUserByUserId(userId: string) {
  await connectDB();
  const user = await User.findOne({ userId });
  return user ? toUserProfile(user) : null;
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<{
    name: string;
    mobile: string;
    age: number;
    profession: string;
    profileImage: string;
    onboardingCompleted: boolean;
  }>
) {
  await connectDB();
  const user = await User.findOneAndUpdate({ userId }, updates, {
    new: true,
  });
  return user ? toUserProfile(user) : null;
}

export async function createPasswordResetToken(email: string) {
  await connectDB();
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return null;

  const token = randomBytes(32).toString("hex");
  const resetTokenHash = createHash("sha256").update(token).digest("hex");
  user.resetTokenHash = resetTokenHash;
  user.resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000);
  await user.save();
  return token;
}

export async function resetPasswordWithToken(
  token: string,
  password: string
): Promise<boolean> {
  await connectDB();
  const resetTokenHash = createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    resetTokenHash,
    resetTokenExpires: { $gt: new Date() },
  }).select("+resetTokenHash +resetTokenExpires +passwordHash");

  if (!user) return false;
  user.passwordHash = await hashPassword(password);
  user.resetTokenHash = undefined;
  user.resetTokenExpires = undefined;
  await user.save();
  return true;
}
