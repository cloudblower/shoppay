import styles from "../../styles/product.module.scss";
import db from "../../utils/db";
import Product from "../../models/Product";
import Category from "../../models/Category";
import SubCategory from "../../models/SubCategory";
import User from "../../models/User";
import Head from "next/head";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { produceWithPatches } from "immer";
import MainSwiper from "../../components/productPage/mainSwiper";
import { useState as UseState } from "react";
import Infos from "../../components/productPage/infos";
import Reviews from "../../components/productPage/reviews";
import ProductsSwiper from "../../components/productsSwiper";
export default function product({ product, related }) {
  const [activeImg, setActiveImg] = UseState("");
  const country = {
    name: "Viet Nam",
    flag: "https://www.flaticon.com/download/icon/197473?icon_id=197473&author=173&team=173&keyword=Vietnam&pack=197373&style=Rounded&style_id=141&format=png&color=%23000000&colored=2&size=512&selection=1&type=standard&token=03AL8dmw86PjNTq_s-hrB8bb1tDmL2kpZbjskg75t4gddJ_QFJ1U-ZauXTUPm3MUDZlipdHASi2PT0eW0JyMxpbr-WFZcrMhDZvNv1KkOxrM3QlIdoW_EJMiSNu-swpuSRoSDReZS1ghxy55LVTLyrOBEMkqOrWAn-mBXyHQ1jc4tnG6BHoj5jcOXv0a1O9LMe3XzbPV8ghulphILDSNa_uPv-rLWqDv7zNcXQqTfVv7MH7g01JGVLYSJT9YH0ogP7yBY4enoiFsyGfNtdXotZkxIzvJoTj1-18_a-xDgG0NhZfUyX_qYjm1axO_J5eRKP1GQ57t5gEcWz7Mvfjjisc4IwBkR3REK5Mm5bX1luEIhy3-0SB2n0PoX-gERoEVZcmrbF42VgT8K4OKXAmOGCWdQ5PgleOKnhfhtW_F755JHs2C2QiyWcZ3KSyp9pukrCj5ZHciD2ZDIP0GZivHfzpNOj0xn2TgeDLRMuV3lwbT-0SiD_iq80WRTRkn59vE7rBO_g-TIoH3xjYeLghg0C_4cR4AjgAzf034n-Rjzorr6pSvBy3zCr8eoIQS6Q3sqp0nDdzceJv_kuXUgslapuxWLgX4ON79O4GkFCS6nQjyK7kec6MQO21bgYBRJQ8aPbdif78Xa721fTHvJEGC7MxujV6SJym2I0KJ0SVLW-JXu4xUbpx8SfF27NhRj_hScAhhi9a5Y6bj9g8Z4tJM8f4JjWwkcJvxV1nIfDJfU6uHWDZ2WEyRP53nTsvIT7wJ1RmJBJlIZwOlRcbktOJU3b3Y2P0Yy-YqEoKz00tJB0km96h_ktC0MWGUQuJRaR0klo52A5FDFTZGrvAr7pDUwOoXbZUX6nSWHXOavsCUVGZjNbmTBvob7gUnQwNeFziHgbjOyGyT2KokuHK1zy97dSsDbwDsXbhd91yeYtBoRgP3lItGXKIyEmuCgYOgql4Jz0X04Aj0me3931Dx5YNn6eKUivIXVXYS-pJVfhDpqQ0TUtA9MlK8YqtOmevg3vI-zV9pJ-QybM4xh_y49xk7KLbaV8IELJboJ7JmszaA09nkMN_KJ68B6waHsTerWEyP1i3RfHk-3r5CiUN7bDsF4DmIqg5hkqXVt4JgGuotk28VZRElCzOLrNISdbKMCTBRGTdpZxZvN_c6AE-8g_51v9_kU6cwEE1RJeMIhMcjqzPodhnX9LkdRsBXNAV-jW4XbwnuQg8pL0WK_VJf-12T91_3-BI_s4ICWcDmJoUphFSGy5754Ua_eQFhRdEhdrIzj64ENBjWOwEYICwCuKmiwWjSrc3dFYaoZ2fMFrgLEduS6GMaF7JWoWQIx5-dWKVci_BIshk-9ZsgHjPCgpSI3bRC6nxfvWSlX4riGmId1ftkjxJ7nd1Z3p7KAWQr8DPgqCMLDnoLeRle1m3qsaqTGm9RXu3_7BX7I7o3CKnzSlzPu3YooBrROApWQsfdXYeh_fS2Z6v3elZ2isHWsualaAXE_NsOcnw1NSgP2aoLFJXQvhDWOdBKZMT2xpjaR26tGZQiOSrF0ahkkOsIeUDJVuDwcx5tRPKGukbCCZCKZ11R8N8zVGEmPSSWL10EgLkvACstx6GxpFRtNSWrG80vOgw9IARxM9OO4jLmzQ9N9nWt1LHFKML87G-kZiS-nllqNrqKQAtR3fI2-mJIzWKmFCRToZUHrJULlq-Woqs90V-K-A8JnE5-nuAWA&search=vietnam",
  };
  return (
    <>
      <Head>
        <title>{product.name}</title>
      </Head>
      <Header country={country} />
      <div className={styles.product}>
        <div className={styles.product__container}>
          <div className={styles.path}>
            Home / {product.category.name}
            {product.subCategories.map((sub) => (
              <span key={sub._id}>/{sub.name}</span>
            ))}
          </div>
          <div className={styles.product__main}>
            <MainSwiper images={product.images} activeImg={activeImg} />
            <Infos product={product} setActiveImg={setActiveImg} />
          </div>
          <Reviews product={product} />

          <ProductsSwiper products={related} />
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const { query } = context;
  const slug = query.slug;
  const style = query.style;
  const size = query.size || 0;
  db.connectDb();
  //------------
  let product = await Product.findOne({ slug })
    .populate({ path: "category", model: Category })
    .populate({ path: "subCategories", model: SubCategory })
    .populate({ path: "reviews.reviewBy", model: User })
    .lean();
  let subProduct = product.subProducts[style];
  let prices = subProduct.sizes
    .map((s) => {
      return s.price;
    })
    .sort((a, b) => {
      return a - b;
    });
  let newProduct = {
    ...product,
    style,
    images: subProduct.images,
    sizes: subProduct.sizes,
    discount: subProduct.discount,
    sku: subProduct.sku,
    colors: product.subProducts.map((p) => {
      return p.color;
    }),
    priceRange: subProduct.discount
      ? `From ${(prices[0] - prices[0] / subProduct.discount).toFixed(2)} to ${(
          prices[prices.length - 1] -
          prices[prices.length - 1] / subProduct.discount
        ).toFixed(2)}$`
      : `From ${prices[0]} to ${prices[prices.length - 1]}$`,
    price:
      subProduct.discount > 0
        ? (
            subProduct.sizes[size].price -
            subProduct.sizes[size].price / subProduct.discount
          ).toFixed(2)
        : subProduct.sizes[size].price,
    priceBefore: subProduct.sizes[size].price,
    quantity: subProduct.sizes[size].qty,
    ratings: [
      {
        percentage: calculatePercentage("5"),
      },
      {
        percentage: calculatePercentage("4"),
      },
      {
        percentage: calculatePercentage("3"),
      },
      {
        percentage: calculatePercentage("2"),
      },
      {
        percentage: calculatePercentage("1"),
      },
    ],
    reviews: product.reviews.reverse(),
    allSizes: product.subProducts
      .map((p) => {
        return p.sizes;
      })
      .flat()
      .sort((a, b) => {
        return a.size - b.size;
      })
      .filter(
        (element, index, array) =>
          array.findIndex((el2) => el2.size === element.size) === index
      ),
  };
  const related = await Product.find({ category: product.category._id }).lean();
  //------------
  function calculatePercentage(num) {
    return (
      (product.reviews.reduce((a, review) => {
        return (
          a +
          (review.rating == Number(num) || review.rating == Number(num) + 0.5)
        );
      }, 0) *
        100) /
      product.reviews.length
    ).toFixed(1);
  }
  db.disconnectDb();
  return {
    props: {
      product: JSON.parse(JSON.stringify(newProduct)),
      related: JSON.parse(JSON.stringify(related)),
    },
  };
}
