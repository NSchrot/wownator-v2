// TODO: Replace with real next-auth session when configured
// This is a temporary helper that mirrors the DEMO_USER_ID pattern
// used in the dashboard. When you set up next-auth, swap this
// implementation with: const session = await auth(); return session?.user?.id;

export async function getCurrentUserId(): Promise<string> {
  return "demo";
}
