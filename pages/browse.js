import styles from "../styles/browse.module.scss";
import db from "../utils/db";
import Product from "../models/Product";
import Category from "../models/Category";
import Header from "../components/header";
import SubCategory from "../models/SubCategory";
import {
  filterArray,
  randomize,
  removeDuplicates,
} from "../utils/arrays_utils";
import Link from "next/link";
import ProductCard from "../components/productCard";
import CategoryFilter from "../components/browse/categoryFilter";
import SizesFilter from "../components/browse/sizesFilter";
import ColorsFilter from "../components/browse/colorsFilter";
import BrandsFilter from "../components/browse/brandsFilter";
import StylesFilter from "../components/browse/stylesFilter";
import PatternsFilter from "../components/browse/patternsFilter";
import MaterialsFilter from "../components/browse/materialsFilter";
import GenderFilter from "../components/browse/genderFilter";
import HeadingFilters from "../components/browse/headingFilters";
import { useRouter as UseRouter } from "next/router";
import { Pagination } from "@mui/material";
import { useEffect as UseEffect, useRef, useState as UseState } from "react";
import axios from "axios";
export default function Browse({
  categories,
  subCategories,
  products,
  sizes,
  colors,
  brands,
  stylesData,
  patterns,
  materials,
  paginationCount,
  country,
}) {
  const router = UseRouter();
  const filter = ({
    search,
    category,
    brand,
    style,
    size,
    color,
    pattern,
    material,
    gender,
    price,
    shipping,
    rating,
    sort,
    page,
  }) => {
    const path = router.pathname;
    const { query } = router;
    if (search) query.search = search;
    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (style) query.style = style;
    if (size) query.size = size;
    if (color) query.color = color;
    if (pattern) query.pattern = pattern;
    if (material) query.material = material;
    if (gender) query.gender = gender;
    if (price) query.price = price;
    if (shipping) query.shipping = shipping;
    if (rating) query.rating = rating;
    if (sort) query.sort = sort;
    if (page) query.page = page;
    router.push({
      pathname: path,
      query: query,
    });
  };
  const searchHandler = (search) => {
    if (search == "") {
      filter({ search: {} });
    } else {
      filter({ search });
    }
  };
  const categoryHandler = (category) => {
    filter({ category });
  };
  const brandHandler = (brand) => {
    filter({ brand });
  };
  const styleHandler = (style) => {
    filter({ style });
  };
  const sizeHandler = (size) => {
    filter({ size });
  };
  const colorHandler = (color) => {
    filter({ color });
  };
  const patternHandler = (pattern) => {
    filter({ pattern });
  };
  const materialHandler = (material) => {
    filter({ material });
  };
  const genderHandler = (gender) => {
    if (gender == "Unisex") {
      filter({ gender: {} });
    } else {
      filter({ gender });
    }
  };
  const priceHandler = (price, type) => {
    let priceQuery = router.query.price?.split("_") || "";
    let min = priceQuery[0] || "";
    let max = priceQuery[1] || "";
    let newPrice = "";
    if (type == "min") {
      newPrice = `${price}_${max}`;
    } else {
      newPrice = `${min}_${price}`;
    }
    filter({ price: newPrice });
  };
  const multiPriceHandler = (min, max) => {
    filter({ price: `${min}_${max}` });
  };
  const shippingHandler = (shipping) => {
    filter({ shipping });
  };
  const ratingHandler = (rating) => {
    filter({ rating });
  };
  const sortHandler = (sort) => {
    if (sort == "") {
      filter({ sort: {} });
    } else {
      filter({ sort });
    }
  };
  const pageHandler = (e, page) => {
    filter({ page });
  };
  //----------
  function checkChecked(queryName, value) {
    if (router.query[queryName]?.search(value) !== -1) {
      return true;
    }
    return false;
  }
  function replaceQuery(queryName, value) {
    const existedQuery = router.query[queryName];
    const valueCheck = existedQuery?.search(value);
    const _check = existedQuery?.search(`_${value}`);
    let result = "";
    if (existedQuery) {
      if (existedQuery == value) {
        result = {};
      } else {
        if (valueCheck !== -1) {
          if (_check !== -1) {
            result = existedQuery?.replace(`_${value}`, "");
          } else if (valueCheck == 0) {
            result = existedQuery?.replace(`${value}_`, "");
          } else {
            result = existedQuery?.replace(value, "");
          }
        } else {
          result = `${existedQuery}_${value}`;
        }
      }
    } else {
      result = value;
    }
    return {
      result,
      active: existedQuery && valueCheck !== -1 ? true : false,
    };
  }
  //---------------------------------
  const [scrollY, setScrollY] = UseState(0);
  const [height, setHeight] = UseState(0);
  const headerRef = useRef(null);
  const el = useRef(null);
  UseEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    setHeight(headerRef.current?.offsetHeight + el.current?.offsetHeight);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  console.log(scrollY, height);
  //---------------------------------
  return (
    <div className={styles.browse}>
      <div ref={headerRef}>
        <Header searchHandler={searchHandler} country={country} />
      </div>
      <div className={styles.browse__container}>
        <div ref={el}>
          <div className={styles.browse__path}>Home / Browse</div>
          <div className={styles.browse__tags}>
            {categories.map((c) => (
              <Link href="" key={c._id}>
                <a>{c.name}</a>
              </Link>
            ))}
          </div>
        </div>
        <div
          className={`${styles.browse__store} ${
            scrollY >= height ? styles.fixed : ""
          }`}
        >
          <div
            className={`${styles.browse__store_filters} ${styles.scrollbar}`}
          >
            <button
              className={styles.browse__clearBtn}
              onClick={() => router.push("/browse")}
            >
              Clear All ({Object.keys(router.query).length})
            </button>
            <CategoryFilter
              categories={categories}
              subCategories={subCategories}
              categoryHandler={categoryHandler}
              replaceQuery={replaceQuery}
            />
            <SizesFilter sizes={sizes} sizeHandler={sizeHandler} />
            <ColorsFilter
              colors={colors}
              colorHandler={colorHandler}
              replaceQuery={replaceQuery}
            />
            <BrandsFilter
              brands={brands}
              brandHandler={brandHandler}
              replaceQuery={replaceQuery}
            />
            <StylesFilter
              data={stylesData}
              styleHandler={styleHandler}
              replaceQuery={replaceQuery}
            />
            <PatternsFilter
              patterns={patterns}
              patternHandler={patternHandler}
              replaceQuery={replaceQuery}
            />
            <MaterialsFilter
              materials={materials}
              materialHandler={materialHandler}
              replaceQuery={replaceQuery}
            />
            <GenderFilter
              genderHandler={genderHandler}
              replaceQuery={replaceQuery}
            />
          </div>
          <div className={styles.browse__store_products_wrap}>
            <HeadingFilters
              priceHandler={priceHandler}
              multiPriceHandler={multiPriceHandler}
              shippingHandler={shippingHandler}
              ratingHandler={ratingHandler}
              replaceQuery={replaceQuery}
              sortHandler={sortHandler}
            />
            <div className={styles.browse__store_products}>
              {products.map((product) => (
                <ProductCard product={product} key={product._id} />
              ))}
            </div>
            <div className={styles.pagination}>
              <Pagination
                count={paginationCount}
                defaultPage={Number(router.query.page) || 1}
                onChange={pageHandler}
                variant="outlined"
                color="primary"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const { query } = ctx;
  //-------------------------------------------------->
  const searchQuery = query.search || "";
  const categoryQuery = query.category || "";
  const genderQuery = query.gender || "";
  const priceQuery = query.price?.split("_") || "";
  const shippingQuery = query.shipping || 0;
  const ratingQuery = query.rating || "";
  const sortQuery = query.sort || "";
  const pageSize = 50;
  const page = query.page || 1;

  //-----------
  const brandQuery = query.brand?.split("_") || "";
  const brandRegex = `^${brandQuery[0]}`;
  const brandSearchRegex = createRegex(brandQuery, brandRegex);
  //-----------
  //-----------
  const styleQuery = query.style?.split("_") || "";
  const styleRegex = `^${styleQuery[0]}`;
  const styleSearchRegex = createRegex(styleQuery, styleRegex);
  //-----------
  //-----------
  const patternQuery = query.pattern?.split("_") || "";
  const patternRegex = `^${patternQuery[0]}`;
  const patternSearchRegex = createRegex(patternQuery, patternRegex);
  //-----------
  //-----------
  const materialQuery = query.material?.split("_") || "";
  const materialRegex = `^${materialQuery[0]}`;
  const materialSearchRegex = createRegex(materialQuery, materialRegex);
  //-----------
  const sizeQuery = query.size?.split("_") || "";
  const sizeRegex = `^${sizeQuery[0]}`;
  const sizeSearchRegex = createRegex(sizeQuery, sizeRegex);
  //-----------
  const colorQuery = query.color?.split("_") || "";
  const colorRegex = `^${colorQuery[0]}`;
  const colorSearchRegex = createRegex(colorQuery, colorRegex);
  //-------------------------------------------------->
  const search =
    searchQuery && searchQuery !== ""
      ? {
          name: {
            $regex: searchQuery,
            $options: "i",
          },
        }
      : {};
  const category =
    categoryQuery && categoryQuery !== "" ? { category: categoryQuery } : {};

  const style =
    styleQuery && styleQuery !== ""
      ? {
          "details.value": {
            $regex: styleSearchRegex,
            $options: "i",
          },
        }
      : {};
  const size =
    sizeQuery && sizeQuery !== ""
      ? {
          "subProducts.sizes.size": {
            $regex: sizeSearchRegex,
            $options: "i",
          },
        }
      : {};
  const color =
    colorQuery && colorQuery !== ""
      ? {
          "subProducts.color.color": {
            $regex: colorSearchRegex,
            $options: "i",
          },
        }
      : {};
  const brand =
    brandQuery && brandQuery !== ""
      ? {
          brand: {
            $regex: brandSearchRegex,
            $options: "i",
          },
        }
      : {};
  const pattern =
    patternQuery && patternQuery !== ""
      ? {
          "details.value": {
            $regex: patternSearchRegex,
            $options: "i",
          },
        }
      : {};
  const material =
    materialQuery && materialQuery !== ""
      ? {
          "details.value": {
            $regex: materialSearchRegex,
            $options: "i",
          },
        }
      : {};
  const gender =
    genderQuery && genderQuery !== ""
      ? {
          "details.value": {
            $regex: genderQuery,
            $options: "i",
          },
        }
      : {};
  const price =
    priceQuery && priceQuery !== ""
      ? {
          "subProducts.sizes.price": {
            $gte: Number(priceQuery[0]) || 0,
            $lte: Number(priceQuery[1]) || Infinity,
          },
        }
      : {};
  const shipping =
    shippingQuery && shippingQuery == "0"
      ? {
          shipping: 0,
        }
      : {};
  const rating =
    ratingQuery && ratingQuery !== ""
      ? {
          rating: {
            $gte: Number(ratingQuery),
          },
        }
      : {};
  const sort =
    sortQuery == ""
      ? {}
      : sortQuery == "popular"
      ? { rating: -1, "subProducts.sold": -1 }
      : sortQuery == "newest"
      ? { createdAt: -1 }
      : sortQuery == "topSelling"
      ? { "subProducts.sold": -1 }
      : sortQuery == "topReviewed"
      ? { rating: -1 }
      : sortQuery == "priceHighToLow"
      ? { "subProducts.sizes.price": -1 }
      : sortQuery == "priceLowToHigh"
      ? { "subProducts.sizes.price": 1 }
      : {};
  //-------------------------------------------------->
  //-------------------------------------------------->
  function createRegex(data, styleRegex) {
    if (data.length > 1) {
      for (var i = 1; i < data.length; i++) {
        styleRegex += `|^${data[i]}`;
      }
    }
    return styleRegex;
  }
  // let data = await axios
  //   .get("https://api.ipregistry.co/?key=r208izz0q0icseks")
  //   .then((res) => {
  //     return res.data.location.country;
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  //-------------------------------------------------->
  db.connectDb();
  let productsDb = await Product.find({
    ...search,
    ...category,
    ...brand,
    ...style,
    ...size,
    ...color,
    ...pattern,
    ...material,
    ...gender,
    ...price,
    ...shipping,
    ...rating,
  })
    .skip(pageSize * (page - 1))
    .limit(pageSize)
    .sort(sort)
    .lean();
  let products =
    sortQuery && sortQuery !== "" ? productsDb : randomize(productsDb);
  let categories = await Category.find().lean();
  let subCategories = await SubCategory.find()
    .populate({
      path: "parent",
      model: Category,
    })
    .lean();
  let colors = await Product.find({ ...category }).distinct(
    "subProducts.color.color"
  );
  let brandsDb = await Product.find({ ...category }).distinct("brand");
  let sizes = await Product.find({ ...category }).distinct(
    "subProducts.sizes.size"
  );
  let details = await Product.find({ ...category }).distinct("details");
  let stylesDb = filterArray(details, "Style");
  let patternsDb = filterArray(details, "Pattern Type");
  let materialsDb = filterArray(details, "Material");
  let styles = removeDuplicates(stylesDb);
  let patterns = removeDuplicates(patternsDb);
  let materials = removeDuplicates(materialsDb);
  let brands = removeDuplicates(brandsDb);
  let totalProducts = await Product.countDocuments({
    ...search,
    ...category,
    ...brand,
    ...style,
    ...size,
    ...color,
    ...pattern,
    ...material,
    ...gender,
    ...price,
    ...shipping,
    ...rating,
  });
  return {
    props: {
      categories: JSON.parse(JSON.stringify(categories)),
      subCategories: JSON.parse(JSON.stringify(subCategories)),
      products: JSON.parse(JSON.stringify(products)),
      sizes,
      colors,
      brands,
      stylesData: styles,
      patterns,
      materials,
      paginationCount: Math.ceil(totalProducts / pageSize),
      //country: { name: data.name, flag: data.flag.emojitwo },
      country: {
        name: "Viet Nam",
        flag: "https://www.flaticon.com/download/icon/197473?icon_id=197473&author=173&team=173&keyword=Vietnam&pack=197373&style=Rounded&style_id=141&format=png&color=%23000000&colored=2&size=512&selection=1&type=standard&token=03AL8dmw86PjNTq_s-hrB8bb1tDmL2kpZbjskg75t4gddJ_QFJ1U-ZauXTUPm3MUDZlipdHASi2PT0eW0JyMxpbr-WFZcrMhDZvNv1KkOxrM3QlIdoW_EJMiSNu-swpuSRoSDReZS1ghxy55LVTLyrOBEMkqOrWAn-mBXyHQ1jc4tnG6BHoj5jcOXv0a1O9LMe3XzbPV8ghulphILDSNa_uPv-rLWqDv7zNcXQqTfVv7MH7g01JGVLYSJT9YH0ogP7yBY4enoiFsyGfNtdXotZkxIzvJoTj1-18_a-xDgG0NhZfUyX_qYjm1axO_J5eRKP1GQ57t5gEcWz7Mvfjjisc4IwBkR3REK5Mm5bX1luEIhy3-0SB2n0PoX-gERoEVZcmrbF42VgT8K4OKXAmOGCWdQ5PgleOKnhfhtW_F755JHs2C2QiyWcZ3KSyp9pukrCj5ZHciD2ZDIP0GZivHfzpNOj0xn2TgeDLRMuV3lwbT-0SiD_iq80WRTRkn59vE7rBO_g-TIoH3xjYeLghg0C_4cR4AjgAzf034n-Rjzorr6pSvBy3zCr8eoIQS6Q3sqp0nDdzceJv_kuXUgslapuxWLgX4ON79O4GkFCS6nQjyK7kec6MQO21bgYBRJQ8aPbdif78Xa721fTHvJEGC7MxujV6SJym2I0KJ0SVLW-JXu4xUbpx8SfF27NhRj_hScAhhi9a5Y6bj9g8Z4tJM8f4JjWwkcJvxV1nIfDJfU6uHWDZ2WEyRP53nTsvIT7wJ1RmJBJlIZwOlRcbktOJU3b3Y2P0Yy-YqEoKz00tJB0km96h_ktC0MWGUQuJRaR0klo52A5FDFTZGrvAr7pDUwOoXbZUX6nSWHXOavsCUVGZjNbmTBvob7gUnQwNeFziHgbjOyGyT2KokuHK1zy97dSsDbwDsXbhd91yeYtBoRgP3lItGXKIyEmuCgYOgql4Jz0X04Aj0me3931Dx5YNn6eKUivIXVXYS-pJVfhDpqQ0TUtA9MlK8YqtOmevg3vI-zV9pJ-QybM4xh_y49xk7KLbaV8IELJboJ7JmszaA09nkMN_KJ68B6waHsTerWEyP1i3RfHk-3r5CiUN7bDsF4DmIqg5hkqXVt4JgGuotk28VZRElCzOLrNISdbKMCTBRGTdpZxZvN_c6AE-8g_51v9_kU6cwEE1RJeMIhMcjqzPodhnX9LkdRsBXNAV-jW4XbwnuQg8pL0WK_VJf-12T91_3-BI_s4ICWcDmJoUphFSGy5754Ua_eQFhRdEhdrIzj64ENBjWOwEYICwCuKmiwWjSrc3dFYaoZ2fMFrgLEduS6GMaF7JWoWQIx5-dWKVci_BIshk-9ZsgHjPCgpSI3bRC6nxfvWSlX4riGmId1ftkjxJ7nd1Z3p7KAWQr8DPgqCMLDnoLeRle1m3qsaqTGm9RXu3_7BX7I7o3CKnzSlzPu3YooBrROApWQsfdXYeh_fS2Z6v3elZ2isHWsualaAXE_NsOcnw1NSgP2aoLFJXQvhDWOdBKZMT2xpjaR26tGZQiOSrF0ahkkOsIeUDJVuDwcx5tRPKGukbCCZCKZ11R8N8zVGEmPSSWL10EgLkvACstx6GxpFRtNSWrG80vOgw9IARxM9OO4jLmzQ9N9nWt1LHFKML87G-kZiS-nllqNrqKQAtR3fI2-mJIzWKmFCRToZUHrJULlq-Woqs90V-K-A8JnE5-nuAWA&search=vietnam",
      },
    },
  };
}
