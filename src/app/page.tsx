import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <h1 className="text-xl">Work in progress 🚧</h1>
    </div>
  );
}
