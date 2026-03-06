import { defineMiddleware } from "astro:middleware";
import { adminAuth } from "./lib/firebase/server";

export const onRequest = defineMiddleware(async (context, next) => {
    const { url, cookies, redirect } = context;

    // We only want to protect the /paintings route
    if (url.pathname.startsWith("/paintings")) {
        const sessionCookie = cookies.get("session")?.value;

        if (!sessionCookie) {
            // No session cookie found, redirect to login
            return redirect("/login");
        }

        try {
            // Verify the session cookie with Firebase Admin
            await adminAuth.verifySessionCookie(sessionCookie);
            // Valid session, allow request to proceed
            return next();
        } catch (error) {
            console.error("Error verifying session cookie", error);
            // Invalid/expired session cookie, clear it and redirect to login
            cookies.delete("session", { path: "/" });
            return redirect("/login");
        }
    }

    // Not a protected route, proceed normally
    return next();
});
