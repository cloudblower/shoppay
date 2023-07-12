import Image from "next/image";
import styles from "../styles/Home.module.scss";
import Header from "../components/header";
import Footer from "../components/footer";
import axios from "axios";
import { useSession as UseSession, signIn, signOut } from "next-auth/react";
import Main from "../components/home/main";
import FlashDeals from "../components/home/flashDeals";
import Category from "../components/home/category";
import db from "../utils/db";
import {
  gamingSwiper,
  homeImprovSwiper,
  women_accessories,
  women_dresses,
  women_shoes,
  women_swiper,
} from "../data/home";
import { useMediaQuery as UseMediaQuery } from "react-responsive";
import ProductsSwiper from "../components/productsSwiper";
import Product from "../models/Product";
import Coupon from "../models/Coupon";
import categoryModel from "../models/Category";
import ProductCard from "../components/productCard";
import Router from "next/router";
import Link from "next/link";
export default function home({
  country,
  products,
  categories,
  offers,
  coupons,
}) {
  const { data: session } = UseSession();
  const isMedium = UseMediaQuery({ query: "(max-width:850px)" });
  const isMobile = UseMediaQuery({ query: "(max-width:550px)" });
  if (session?.user.role == "admin" || session?.user.role == "manager") {
    Router.push("/admin/dashboard");
    return (
      <>
        {!isMedium && <div></div>}
        {isMobile && <div></div>}
      </>
    );
  } else if (session?.user.role == "shipper") {
    Router.push("/admin/dashboard/orders");
    return (
      <>
        {!isMedium && <div></div>}
        {isMobile && <div></div>}
      </>
    );
  }
  return (
    <>
      <div className={styles.searchBar}>
        <Header country={country} />
      </div>

      <div className={styles.home}>
        <div className={styles.container}>
          <Main categories={categories} offers={offers} coupons={coupons} />
          {/* <FlashDeals /> */}
          <div className={styles.home__category}>
            <Category
              header="Dresses"
              products={products}
              background="#5a31f4"
            />
            {!isMedium && (
              <Category
                header="Shoes"
                products={products}
                background="#3c811f"
              />
            )}
            {isMobile && (
              <Category
                header="Shoes"
                products={products}
                background="#3c811f"
              />
            )}
            <Category
              header="Accessories"
              products={products}
              background="#000"
            />
          </div>
          <ProductsSwiper
            products={[...products].sort((a, b) => b.rating - a.rating)}
            // products={women_swiper}
          />
          <div className={styles.products}>
            {products.slice(0, 20).map((product) => (
              <ProductCard product={product} key={product._id} />
            ))}
          </div>
        </div>
      </div>
      <Footer country={country} />
    </>
  );
}
export async function getServerSideProps() {
  db.connectDb();
  let products = await Product.find()
    .populate({ path: "category", model: categoryModel })
    .sort({ createdAt: -1 })
    .lean();
  let categories = await categoryModel.find().sort({ createdAt: 1 }).lean();
  const offers = products
    .flatMap((product) => {
      return { ...product.subProducts[0], parrentProductName: product.slug };
    })
    .filter((subProduct) => subProduct.discount !== 0);
  let coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
  // let subProducts = [];
  // products.forEach((product) => {
  //   product.subProducts.forEach((subProduct) => {
  //     subProducts.push(subProduct);
  //   });
  // });

  // const offers = subProducts.filter((subProduct) => subProduct.discount !== 0);

  // let data = await axios
  //   .get("https://api.ipregistry.co/?key=r208izz0q0icseks")
  //   .then((res) => {
  //     return res.data.location.country;
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  return {
    props: {
      coupons: JSON.parse(JSON.stringify(coupons)),
      offers: JSON.parse(JSON.stringify(offers)),
      products: JSON.parse(JSON.stringify(products)),
      categories: JSON.parse(JSON.stringify(categories)),
      //country: { name: data.name, flag: data.flag.emojitwo },
      country: {
        name: "Viet Nam",
        flag: "https://www.flaticon.com/download/icon/197473?icon_id=197473&author=173&team=173&keyword=Vietnam&pack=197373&style=Rounded&style_id=141&format=png&color=%23000000&colored=2&size=512&selection=1&type=standard&token=03AL8dmw86PjNTq_s-hrB8bb1tDmL2kpZbjskg75t4gddJ_QFJ1U-ZauXTUPm3MUDZlipdHASi2PT0eW0JyMxpbr-WFZcrMhDZvNv1KkOxrM3QlIdoW_EJMiSNu-swpuSRoSDReZS1ghxy55LVTLyrOBEMkqOrWAn-mBXyHQ1jc4tnG6BHoj5jcOXv0a1O9LMe3XzbPV8ghulphILDSNa_uPv-rLWqDv7zNcXQqTfVv7MH7g01JGVLYSJT9YH0ogP7yBY4enoiFsyGfNtdXotZkxIzvJoTj1-18_a-xDgG0NhZfUyX_qYjm1axO_J5eRKP1GQ57t5gEcWz7Mvfjjisc4IwBkR3REK5Mm5bX1luEIhy3-0SB2n0PoX-gERoEVZcmrbF42VgT8K4OKXAmOGCWdQ5PgleOKnhfhtW_F755JHs2C2QiyWcZ3KSyp9pukrCj5ZHciD2ZDIP0GZivHfzpNOj0xn2TgeDLRMuV3lwbT-0SiD_iq80WRTRkn59vE7rBO_g-TIoH3xjYeLghg0C_4cR4AjgAzf034n-Rjzorr6pSvBy3zCr8eoIQS6Q3sqp0nDdzceJv_kuXUgslapuxWLgX4ON79O4GkFCS6nQjyK7kec6MQO21bgYBRJQ8aPbdif78Xa721fTHvJEGC7MxujV6SJym2I0KJ0SVLW-JXu4xUbpx8SfF27NhRj_hScAhhi9a5Y6bj9g8Z4tJM8f4JjWwkcJvxV1nIfDJfU6uHWDZ2WEyRP53nTsvIT7wJ1RmJBJlIZwOlRcbktOJU3b3Y2P0Yy-YqEoKz00tJB0km96h_ktC0MWGUQuJRaR0klo52A5FDFTZGrvAr7pDUwOoXbZUX6nSWHXOavsCUVGZjNbmTBvob7gUnQwNeFziHgbjOyGyT2KokuHK1zy97dSsDbwDsXbhd91yeYtBoRgP3lItGXKIyEmuCgYOgql4Jz0X04Aj0me3931Dx5YNn6eKUivIXVXYS-pJVfhDpqQ0TUtA9MlK8YqtOmevg3vI-zV9pJ-QybM4xh_y49xk7KLbaV8IELJboJ7JmszaA09nkMN_KJ68B6waHsTerWEyP1i3RfHk-3r5CiUN7bDsF4DmIqg5hkqXVt4JgGuotk28VZRElCzOLrNISdbKMCTBRGTdpZxZvN_c6AE-8g_51v9_kU6cwEE1RJeMIhMcjqzPodhnX9LkdRsBXNAV-jW4XbwnuQg8pL0WK_VJf-12T91_3-BI_s4ICWcDmJoUphFSGy5754Ua_eQFhRdEhdrIzj64ENBjWOwEYICwCuKmiwWjSrc3dFYaoZ2fMFrgLEduS6GMaF7JWoWQIx5-dWKVci_BIshk-9ZsgHjPCgpSI3bRC6nxfvWSlX4riGmId1ftkjxJ7nd1Z3p7KAWQr8DPgqCMLDnoLeRle1m3qsaqTGm9RXu3_7BX7I7o3CKnzSlzPu3YooBrROApWQsfdXYeh_fS2Z6v3elZ2isHWsualaAXE_NsOcnw1NSgP2aoLFJXQvhDWOdBKZMT2xpjaR26tGZQiOSrF0ahkkOsIeUDJVuDwcx5tRPKGukbCCZCKZ11R8N8zVGEmPSSWL10EgLkvACstx6GxpFRtNSWrG80vOgw9IARxM9OO4jLmzQ9N9nWt1LHFKML87G-kZiS-nllqNrqKQAtR3fI2-mJIzWKmFCRToZUHrJULlq-Woqs90V-K-A8JnE5-nuAWA&search=vietnam",
      },
    },
  };
}
/*
            <ProductsSwiper
            products={gamingSwiper}
            header="For Gamers"
            bg="#2f82ff"
          />
          <ProductsSwiper
            products={homeImprovSwiper}
            header="House Improvements"
            bg="#5a31f4"
          />
            */
