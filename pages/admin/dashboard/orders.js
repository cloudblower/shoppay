import Layout from "../../../components/admin/layout";
import CollapsibleTable from "../../../components/admin/orders/table";
import db from "../../../utils/db";
import Order from "../../../models/Order";
import User from "../../../models/User";
import { useState as UseState } from "react";
import { useSession as UseSession, signIn } from "next-auth/react";
import Router from "next/router";
export default function orders({ orders }) {
  const [data, setData] = UseState(orders);
  const { data: session } = UseSession();
  let allowedAccess = false;
  console.log(session);
  if (!session) {
    Router.push("/");
    return;
  }
  if (
    !(session.user.role === "admin") &&
    !(session.user.role === "shipper") &&
    !(session.user.role === "manager")
  ) {
    Router.push("/");
    return;
  }

  return (
    <Layout>
      <CollapsibleTable rows={data} setOrders={setData} />
    </Layout>
  );
}

export async function getServerSideProps(ctx) {
  await db.connectDb();
  const orders = await Order.find({})
    .populate({ path: "user", model: User, select: "name email image" })
    .sort({ createdAt: -1 })
    .lean();
  return {
    props: {
      orders: JSON.parse(JSON.stringify(orders)),
    },
  };
}
