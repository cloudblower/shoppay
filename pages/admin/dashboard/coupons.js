import Layout from "../../../components/admin/layout";
import db from "../../../utils/db";
import Coupon from "../../../models/Coupon";
import { useState as UseState } from "react";
import Create from "../../../components/admin/coupons/Create";
import List from "../../../components/admin/coupons/List";
import { useSession as UseSession, signIn } from "next-auth/react";
import Router from "next/router";
export default function coupons({ coupons }) {
  const [data, setData] = UseState(coupons);
  const { data: session } = UseSession();
  if (!session) {
    Router.push("/");
    return;
  }
  if (!(session.user.role === "admin") && !(session.user.role === "manager")) {
    Router.push("/");
    return;
  }
  return (
    <Layout>
      <div>
        <Create setCoupons={setData} />
        <List coupons={data} setCoupons={setData} />
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  db.connectDb();
  const coupons = await Coupon.find({}).sort({ updatedAt: -1 }).lean();
  return {
    props: {
      coupons: JSON.parse(JSON.stringify(coupons)),
    },
  };
}
