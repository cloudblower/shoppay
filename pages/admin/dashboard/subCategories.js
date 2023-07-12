import Layout from "../../../components/admin/layout";
import db from "../../../utils/db";
import Category from "../../../models/Category";
import SubCategory from "../../../models/SubCategory";
import { useState as UseState } from "react";
import Create from "../../../components/admin/subCategories/Create";
import List from "../../../components/admin/subCategories/List";
import { useSession as UseSession, signIn } from "next-auth/react";
import Router from "next/router";
export default function subCategories({ categories, subCategories }) {
  const [data, setData] = UseState(subCategories);
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
        <Create setSubCategories={setData} categories={categories} />
        <List
          categories={categories}
          subCategories={data}
          setSubCategories={setData}
        />
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  db.connectDb();
  const categories = await Category.find({}).sort({ updatedAt: -1 }).lean();
  const subCategories = await SubCategory.find({})
    .populate({ path: "parent", model: Category })
    .sort({ updatedAt: -1 })
    .lean();
  return {
    props: {
      categories: JSON.parse(JSON.stringify(categories)),
      subCategories: JSON.parse(JSON.stringify(subCategories)),
    },
  };
}
