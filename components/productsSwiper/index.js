import styles from "./styles.module.scss";
import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Navigation } from "swiper";
export default function ProductsSwiper({ header, products, bg }) {
  return (
    <div className={styles.wrapper}>
      {header && (
        <div
          className={styles.header}
          style={{ background: `${bg ? bg : ""}` }}
        >
          {header}
        </div>
      )}
      <Swiper
        slidesPerView={1}
        spaceBetween={10}
        navigation={true}
        modules={[Navigation]}
        className="products__swiper"
        breakpoints={{
          450: {
            slidesPerView: 2,
          },
          630: {
            slidesPerView: 3,
          },
          920: {
            slidesPerView: 4,
          },
          1232: {
            slidesPerView: 5,
          },
          1520: {
            slidesPerView: 6,
          },
        }}
      >
        {products.map((product, i) => (
          <SwiperSlide key={i}>
            <a
              href={`/product/${product.slug}?style=0`}
              target="_blank"
              rel="noreferrer"
            >
              <div className={styles.product}>
                <div className={styles.product__img}>
                  <img src={product.subProducts[0].images[0].url} alt="" />
                  {/* <img src={product.image} alt="" /> */}
                </div>
                <div className={styles.product__infos}>
                  <h1>
                    {product.name.length > 30
                      ? `${product.name.slice(0, 30)}...`
                      : product.name}
                  </h1>
                  {product.subProducts[0].sizes[0].price && (
                    <span>USD{product.subProducts[0].sizes[0].price}$</span>
                  )}
                  {/* {product.price && <span>USD{product.price}$</span>} */}
                </div>
              </div>
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
