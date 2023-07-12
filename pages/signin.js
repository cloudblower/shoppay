import Header from "../components/header";
import Footer from "../components/footer";
import styles from "../styles/signin.module.scss";
import { BiLeftArrowAlt } from "react-icons/bi";
import Link from "next/link";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import LoginInput from "../components/inputs/loginInput";
import { useState as UseState } from "react";
import CircledIconBtn from "../components/buttons/circledIconBtn";
import { useSession as UseSession } from "next-auth/react";
import {
  getCsrfToken,
  getProviders,
  getSession,
  signIn,
  country,
} from "next-auth/react";
import axios from "axios";
import DotLoaderSpinner from "../components/loaders/dotLoader";
import Router from "next/router";
const initialvalues = {
  login_email: "",
  login_password: "",
  name: "",
  email: "",
  password: "",
  conf_password: "",
  success: "",
  error: "",
  login_error: "",
};
export default function signin({ providers, callbackUrl, csrfToken }) {
  const [loading, setLoading] = UseState(false);
  const [user, setUser] = UseState(initialvalues);
  const {
    login_email,
    login_password,
    name,
    email,
    password,
    conf_password,
    success,
    error,
    login_error,
  } = user;
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const loginValidation = Yup.object({
    login_email: Yup.string()
      .required("Email address is required.")
      .email("Please enter a valid email address."),
    login_password: Yup.string().required("Please enter a password"),
  });
  const registerValidation = Yup.object({
    name: Yup.string()
      .required("What's your name ?")
      .min(2, "First name must be between 2 and 16 characters.")
      .max(16, "First name must be between 2 and 16 characters.")
      .matches(/^[aA-zZ]/, "Numbers and special characters are not allowed."),
    email: Yup.string()
      .required(
        "You'll need this when you log in and if you ever need to reset your password."
      )
      .email("Enter a valid email address."),
    password: Yup.string()
      .required(
        "Enter a combination of at least six numbers,letters and punctuation marks(such as ! and &)."
      )
      .min(6, "Password must be atleast 6 characters.")
      .max(36, "Password can't be more than 36 characters"),
    conf_password: Yup.string()
      .required("Confirm your password.")
      .oneOf([Yup.ref("password")], "Passwords must match."),
  });
  const signUpHandler = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post("/api/auth/signup", {
        name,
        email,
        password,
      });
      setUser({ ...user, error: "", success: data.message });
      setLoading(false);
      setTimeout(async () => {
        let options = {
          redirect: false,
          email: email,
          password: password,
        };
        const res = await signIn("credentials", options);
        Router.push("/");
      }, 2000);
    } catch (error) {
      setLoading(false);
      setUser({ ...user, success: "", error: error.response.data.message });
    }
  };
  const signInHandler = async () => {
    setLoading(true);
    let options = {
      redirect: false,
      email: login_email,
      password: login_password,
    };
    const res = await signIn("credentials", options);
    //console.log(res);
    setUser({ ...user, success: "", error: "" });
    setLoading(false);
    if (res?.error) {
      setLoading(false);
      setUser({ ...user, login_error: res?.error });
    } else {
      return Router.push(callbackUrl || "/");
    }
  };

  const country = {
    name: "Viet Nam",
    flag: "https://www.flaticon.com/download/icon/197473?icon_id=197473&author=173&team=173&keyword=Vietnam&pack=197373&style=Rounded&style_id=141&format=png&color=%23000000&colored=2&size=512&selection=1&type=standard&token=03AL8dmw86PjNTq_s-hrB8bb1tDmL2kpZbjskg75t4gddJ_QFJ1U-ZauXTUPm3MUDZlipdHASi2PT0eW0JyMxpbr-WFZcrMhDZvNv1KkOxrM3QlIdoW_EJMiSNu-swpuSRoSDReZS1ghxy55LVTLyrOBEMkqOrWAn-mBXyHQ1jc4tnG6BHoj5jcOXv0a1O9LMe3XzbPV8ghulphILDSNa_uPv-rLWqDv7zNcXQqTfVv7MH7g01JGVLYSJT9YH0ogP7yBY4enoiFsyGfNtdXotZkxIzvJoTj1-18_a-xDgG0NhZfUyX_qYjm1axO_J5eRKP1GQ57t5gEcWz7Mvfjjisc4IwBkR3REK5Mm5bX1luEIhy3-0SB2n0PoX-gERoEVZcmrbF42VgT8K4OKXAmOGCWdQ5PgleOKnhfhtW_F755JHs2C2QiyWcZ3KSyp9pukrCj5ZHciD2ZDIP0GZivHfzpNOj0xn2TgeDLRMuV3lwbT-0SiD_iq80WRTRkn59vE7rBO_g-TIoH3xjYeLghg0C_4cR4AjgAzf034n-Rjzorr6pSvBy3zCr8eoIQS6Q3sqp0nDdzceJv_kuXUgslapuxWLgX4ON79O4GkFCS6nQjyK7kec6MQO21bgYBRJQ8aPbdif78Xa721fTHvJEGC7MxujV6SJym2I0KJ0SVLW-JXu4xUbpx8SfF27NhRj_hScAhhi9a5Y6bj9g8Z4tJM8f4JjWwkcJvxV1nIfDJfU6uHWDZ2WEyRP53nTsvIT7wJ1RmJBJlIZwOlRcbktOJU3b3Y2P0Yy-YqEoKz00tJB0km96h_ktC0MWGUQuJRaR0klo52A5FDFTZGrvAr7pDUwOoXbZUX6nSWHXOavsCUVGZjNbmTBvob7gUnQwNeFziHgbjOyGyT2KokuHK1zy97dSsDbwDsXbhd91yeYtBoRgP3lItGXKIyEmuCgYOgql4Jz0X04Aj0me3931Dx5YNn6eKUivIXVXYS-pJVfhDpqQ0TUtA9MlK8YqtOmevg3vI-zV9pJ-QybM4xh_y49xk7KLbaV8IELJboJ7JmszaA09nkMN_KJ68B6waHsTerWEyP1i3RfHk-3r5CiUN7bDsF4DmIqg5hkqXVt4JgGuotk28VZRElCzOLrNISdbKMCTBRGTdpZxZvN_c6AE-8g_51v9_kU6cwEE1RJeMIhMcjqzPodhnX9LkdRsBXNAV-jW4XbwnuQg8pL0WK_VJf-12T91_3-BI_s4ICWcDmJoUphFSGy5754Ua_eQFhRdEhdrIzj64ENBjWOwEYICwCuKmiwWjSrc3dFYaoZ2fMFrgLEduS6GMaF7JWoWQIx5-dWKVci_BIshk-9ZsgHjPCgpSI3bRC6nxfvWSlX4riGmId1ftkjxJ7nd1Z3p7KAWQr8DPgqCMLDnoLeRle1m3qsaqTGm9RXu3_7BX7I7o3CKnzSlzPu3YooBrROApWQsfdXYeh_fS2Z6v3elZ2isHWsualaAXE_NsOcnw1NSgP2aoLFJXQvhDWOdBKZMT2xpjaR26tGZQiOSrF0ahkkOsIeUDJVuDwcx5tRPKGukbCCZCKZ11R8N8zVGEmPSSWL10EgLkvACstx6GxpFRtNSWrG80vOgw9IARxM9OO4jLmzQ9N9nWt1LHFKML87G-kZiS-nllqNrqKQAtR3fI2-mJIzWKmFCRToZUHrJULlq-Woqs90V-K-A8JnE5-nuAWA&search=vietnam",
  };
  return (
    <>
      {loading && <DotLoaderSpinner loading={loading} />}
      <Header country={country} />
      <div className={styles.login}>
        <div className={styles.login__container}>
          <div className={styles.login__header}>
            <div className={styles.back__svg}>
              <BiLeftArrowAlt />
            </div>
            <span>
              We'd be happy to join us ! <Link href="/">Go Store</Link>
            </span>
          </div>
          <div className={styles.login__form}>
            <h1>Sign in</h1>
            <p>
              Get access to one of the best Eshopping services in the world.
            </p>
            <Formik
              enableReinitialize
              initialValues={{
                login_email,
                login_password,
              }}
              validationSchema={loginValidation}
              onSubmit={() => {
                signInHandler();
              }}
            >
              {(form) => (
                <Form method="post" action="/api/auth/signin/email">
                  <input
                    type="hidden"
                    name="csrfToken"
                    defaultValue={csrfToken}
                  />
                  <LoginInput
                    type="text"
                    name="login_email"
                    icon="email"
                    placeholder="Email Address"
                    onChange={handleChange}
                  />
                  <LoginInput
                    type="password"
                    name="login_password"
                    icon="password"
                    placeholder="Password"
                    onChange={handleChange}
                  />
                  <CircledIconBtn type="submit" text="Sign in" />
                  {login_error && (
                    <span className={styles.error}>{login_error}</span>
                  )}
                  <div className={styles.forgot}>
                    <Link href="/auth/forgot">Forgot password ?</Link>
                  </div>
                </Form>
              )}
            </Formik>
            <div className={styles.login__socials}>
              <span className={styles.or}>Or continue with</span>
              <div className={styles.login__socials_wrap}>
                {providers.map((provider) => {
                  if (provider.name == "Credentials") {
                    return;
                  }
                  return (
                    <div key={provider.name}>
                      <button
                        className={styles.social__btn}
                        onClick={() => signIn(provider.id)}
                      >
                        <img src={`../../icons/${provider.name}.png`} alt="" />
                        Sign in with {provider.name}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.login__container}>
          <div className={styles.login__form}>
            <h1>Sign up</h1>
            <p>
              Get access to one of the best Eshopping services in the world.
            </p>
            <Formik
              enableReinitialize
              initialValues={{
                name,
                email,
                password,
                conf_password,
              }}
              validationSchema={registerValidation}
              onSubmit={() => {
                signUpHandler();
              }}
            >
              {(form) => (
                <Form>
                  <LoginInput
                    type="text"
                    name="name"
                    icon="user"
                    placeholder="Full Name"
                    onChange={handleChange}
                  />
                  <LoginInput
                    type="text"
                    name="email"
                    icon="email"
                    placeholder="Email Address"
                    onChange={handleChange}
                  />
                  <LoginInput
                    type="password"
                    name="password"
                    icon="password"
                    placeholder="Password"
                    onChange={handleChange}
                  />
                  <LoginInput
                    type="password"
                    name="conf_password"
                    icon="password"
                    placeholder="Re-Type Password"
                    onChange={handleChange}
                  />
                  <CircledIconBtn type="submit" text="Sign up" />
                </Form>
              )}
            </Formik>
            <div>
              {success && <span className={styles.success}>{success}</span>}
            </div>
            <div>{error && <span className={styles.error}>{error}</span>}</div>
          </div>
        </div>
      </div>
      <Footer country="Viet Nam" />
    </>
  );
}

export async function getServerSideProps(context) {
  const { req, query } = context;

  const session = await getSession({ req });
  let { callbackUrl } = query;
  callbackUrl = callbackUrl ? callbackUrl : "/";
  if (session) {
    return {
      redirect: {
        destination: callbackUrl,
      },
    };
  }
  const csrfToken = await getCsrfToken(context);
  const providers = Object.values(await getProviders());
  return {
    props: {
      providers,
      csrfToken,
      callbackUrl,
    },
  };
}
