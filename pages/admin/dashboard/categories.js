import Layout from "../../../components/admin/layout";
import db from "../../../utils/db";
import Category from "../../../models/Category";
import { useState as UseState } from "react";
import Create from "../../../components/admin/categories/Create";
import List from "../../../components/admin/categories/List";
import { useSession as UseSession, signIn } from "next-auth/react";
import Router from "next/router";
export default function categories({ categories }) {
  const [data, setData] = UseState(categories);
  console.log(data);
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
        <Create setCategories={setData} />
        <List categories={data} setCategories={setData} />
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  db.connectDb();
  const categories = await Category.find({}).sort({ updatedAt: -1 }).lean();
  return {
    props: {
      categories: JSON.parse(JSON.stringify(categories)),
    },
  };
}
