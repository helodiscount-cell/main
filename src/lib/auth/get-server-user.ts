import { auth, currentUser } from "@clerk/nextjs/server";

export type ServerUser = {
  imageUrl: string | null;
  fullName: string | null;
  emailAddresses: string | null;
};

export async function getServerUser(): Promise<ServerUser | null> {
  const { userId } = await auth();

  if (!userId) return null;

  const user = await currentUser();

  if (!user) return null;

  return {
    imageUrl: user?.imageUrl,
    fullName: user?.fullName,
    emailAddresses: user?.emailAddresses[0]?.emailAddress,
  };
}
