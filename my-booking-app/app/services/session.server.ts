import { createCookieSessionStorage, redirect } from "react-router";
import type { Worker } from "~/utils/Worker";

/**
 * Creates a cookie-based session storage.
 * @see https://reactrouter.com/en/dev/utils/create-cookie-session-storage
 */
export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    secrets: ["s3cret"],
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  },
});

const WORKER_SESSION_KEY = "workerId";

export const { commitSession, destroySession } = sessionStorage;

const getWorkerSession = async (request: Request) => {
  return await sessionStorage.getSession(request.headers.get("Cookie"));
};
export async function getUserId(request: Request): Promise<Worker["personId"] | undefined> {
  const session = await getWorkerSession(request);
  const userId = session.get(WORKER_SESSION_KEY);
  return userId;
}

export async function createSession({
  request,
  workerId,
  remember = true,
  redirectUrl,
}: {
  request: Request;
  workerId: number;
  remember: boolean;
  redirectUrl?: string;
}) {
  const session = await getWorkerSession(request);
  session.set(WORKER_SESSION_KEY, workerId);

  return redirect(redirectUrl || "/booking", {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: remember
          ? 60 * 60 * 24 * 7 // 7 days
          : undefined,
      }),
    },
  });
}
