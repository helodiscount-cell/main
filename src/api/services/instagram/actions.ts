"use server";

import { redirect } from "next/navigation";

// Initiates Instagram OAuth by redirecting to the authorize API route
export async function instagramOAuthAction(): Promise<void> {
  redirect("/api/instagram/oauth/authorize?returnUrl=/dash");
}
