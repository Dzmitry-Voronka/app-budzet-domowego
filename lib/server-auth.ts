import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";

export async function getServerUserId(): Promise<string> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) redirect("/login");
  try {
    const payload = verifyToken(token);
    return payload.userId as string;
  } catch {
    redirect("/login");
  }
}
