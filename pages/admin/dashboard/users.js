import Layout from "../../../components/admin/layout";
import db from "../../../utils/db";
import User from "../../../models/User";
import EnhancedTable from "../../../components/admin/users/table";
import { useState as UseState } from "react";
import { useSession as UseSession, signIn } from "next-auth/react";
import Router from "next/router";
export default function users({ users }) {
  //console.log(users);
  const { data: session } = UseSession();
  if (!session) {
    Router.push("/");
    return;
  }
  if (!(session.user.role === "admin")) {
    Router.push("/");
    return;
  }
  const [data, setData] = UseState(users);
  return (
    <Layout>
      <EnhancedTable rows={data} setUsers={setData} />
    </Layout>
  );
}

export async function getServerSideProps(ctx) {
  await db.connectDb();
  const users = await User.find({}).sort({ createdAt: -1 }).lean();
  return {
    props: {
      users: JSON.parse(JSON.stringify(users)),
    },
  };
}
