import { auth, currentUser } from "@clerk/nextjs/server";

export type ServerUser = {
  id: string;
  email: string | null;
  name: string | null;
  imageUrl: string | null;
};

export async function getServerUser(): Promise<ServerUser | null> {
  const { userId } = await auth();

  if (!userId) return null;

  const user = await currentUser();
  if (!user) return null;

  const primaryEmail =
    user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)
      ?.emailAddress ?? null;

  return {
    id: user.id,
    email: primaryEmail,
    name:
      user.firstName || user.lastName
        ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
        : null,
    imageUrl: user.imageUrl,
  };
}
