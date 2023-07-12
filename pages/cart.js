import {
  useDispatch as UseDispatch,
  useSelector as UseSelector,
} from "react-redux";
import { useEffect as UseEffect, useState as UseState } from "react";
import Empty from "../components/cart/empty";
import Header from "../components/cart/header";
import Product from "../components/cart/product";
import styles from "../styles/cart.module.scss";
import { updateCart } from "../store/cartSlice";
import CartHeader from "../components/cart/cartHeader";
import Checkout from "../components/cart/checkout";
import PaymentMethods from "../components/cart/paymentMethods";
import ProductsSwiper from "../components/productsSwiper";
import { women_swiper } from "../data/home";
import { useSession as UseSession, signIn } from "next-auth/react";
import { useRouter as UseRouter } from "next/router";
import { saveCart } from "../requests/user";
import productModel from "../models/Product";
import categoryModel from "../models/Category";
import db from "../utils/db";

export default function cart({ products }) {
  const Router = UseRouter();
  const { data: session } = UseSession();
  const [selected, setSelected] = UseState([]);
  const { cart } = UseSelector((state) => ({ ...state }));
  const dispatch = UseDispatch();
  //-----------------------
  const [shippingFee, setShippingFee] = UseState(0);
  const [subtotal, setSubtotal] = UseState(0);
  const [total, setTotal] = UseState(0);
  UseEffect(() => {
    setShippingFee(
      selected.reduce((a, c) => a + Number(c.shipping), 0).toFixed(2)
    );
    setSubtotal(selected.reduce((a, c) => a + c.price * c.qty, 0).toFixed(2));
    setTotal(
      (
        selected.reduce((a, c) => a + c.price * c.qty, 0) + Number(shippingFee)
      ).toFixed(2)
    );
  }, [selected]);
  //-----------------------
  const saveCartToDbHandler = async () => {
    if (session) {
      const res = saveCart(selected);
      Router.push("/checkout");
    } else {
      signIn();
    }
  };
  return (
    <>
      <Header />
      <div className={styles.cart}>
        {cart.cartItems.length > 0 ? (
          <div className={styles.cart__container}>
            <CartHeader
              cartItems={cart.cartItems}
              selected={selected}
              setSelected={setSelected}
            />
            <div className={styles.cart__products}>
              {cart.cartItems.map((product) => (
                <Product
                  product={product}
                  key={product._uid}
                  selected={selected}
                  setSelected={setSelected}
                />
              ))}
            </div>
            <Checkout
              subtotal={subtotal}
              shippingFee={shippingFee}
              total={total}
              selected={selected}
              saveCartToDbHandler={saveCartToDbHandler}
            />
            <PaymentMethods />
          </div>
        ) : (
          <Empty />
        )}
        <ProductsSwiper products={products} />
      </div>
    </>
  );
}
export async function getServerSideProps() {
  db.connectDb();
  let products = await productModel
    .find()
    .populate({ path: "category", model: categoryModel })
    .sort({ createdAt: -1 })
    .lean();

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
    },
  };
}
