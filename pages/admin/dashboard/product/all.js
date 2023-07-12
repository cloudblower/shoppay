import styles from "../../../../styles/products.module.scss";
import Layout from "../../../../components/admin/layout";
import db from "../../../../utils/db";
import Product from "../../../../models/Product";
import Category from "../../../../models/Category";
import ProductCard from "../../../../components/admin/products/productCard";
import { useState as UseState } from "react";
import { useSession as UseSession, signIn } from "next-auth/react";
import Router from "next/router";
export default function all({ products }) {
  //console.log(products);
  const [data, setData] = UseState(products);
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
      <div className={styles.header}>All Products</div>
      {data.map((product) => (
        <ProductCard
          product={product}
          key={product._id}
          setProducts={setData}
        />
      ))}
    </Layout>
  );
}

export async function getServerSideProps(ctx) {
  await db.connectDb();
  const products = await Product.find({})
    .populate({ path: "category", model: Category })
    .sort({ createdAt: -1 })
    .lean();
  await db.disconnectDb();
  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
    },
  };
}
