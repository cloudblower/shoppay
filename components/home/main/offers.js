import styles from "./styles.module.scss";
import { offersAarray } from "../../../data/home";
import { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// import required modules
import { Pagination, Navigation } from "swiper";
import Link from "next/link";

export default function Offers({ offers, coupons }) {
  return (
    <div className={styles.offers}>
      <div className={styles.offers__text}>
        {coupons && (
          <p>
            use code <b>“{coupons[0].coupon}”</b> for {coupons[0].discount}% off
            all products.
          </p>
        )}
        <Link href="/browse">Shop now</Link>
      </div>
      <Swiper
        slidesPerView={3}
        spaceBetween={10}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Pagination, Navigation]}
        className="offers_swiper"
      >
        {offers?.map((offer, i) => (
          <SwiperSlide key={i}>
            <Link href={`/product/${offer.parrentProductName}?style=0`}>
              <img src={offer.images[0].url} alt="" />
            </Link>
            <span>{offer.sizes[0].price}$</span>
            <span>-{offer.discount}%</span>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
