import { getSession } from "@/lib/auth/session";
import { getUserByUserId } from "@/services/user-service";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/profile/ProfileForm";

export const metadata = { title: "Profile" };

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const user = await getUserByUserId(session.userId);
  if (!user) redirect("/login");

  return (
    <div className="px-5 py-10 md:px-10">
      <p className="eyebrow">Profile</p>
      <h1 className="display mt-3 text-4xl md:text-5xl">{user.name}</h1>
      <p className="mt-2 text-sm text-[var(--text-secondary)]">
        User ID {user.userId}
      </p>
      <div className="mt-10">
        <ProfileForm user={user} />
      </div>
    </div>
  );
}
