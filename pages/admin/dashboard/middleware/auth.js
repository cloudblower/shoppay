import { useSession as UseSession, signIn } from "next-auth/react";

export default function auth(req, res, next) {
  const { data: session } = UseSession();
  if (!session) {
    Router.push("/");
    return;
  }
  if (!(session.user.role === "admin") && !(session.user.role === "manager")) {
    Router.push("/");
    return;
  }
  next();
}
