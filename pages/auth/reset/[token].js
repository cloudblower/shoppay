import styles from "../../../styles/forgot.module.scss";
import Header from "../../../components/header";
import Footer from "../../../components/footer";
import { BiLeftArrowAlt } from "react-icons/bi";
import CircledIconBtn from "../../../components/buttons/circledIconBtn";
import LoginInput from "../../../components/inputs/loginInput";
import { useState as UseState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import DotLoaderSpinner from "../../../components/loaders/dotLoader";
import axios from "axios";
import { getSession, signIn } from "next-auth/react";
import jwt from "jsonwebtoken";
export default function reset({ user_id }) {
  console.log("user_id", user_id);
  const [password, setPassword] = UseState("");
  const [conf_password, setConf_password] = UseState("");
  const [error, setError] = UseState("");
  const [success, setSuccess] = UseState("");
  const [loading, setLoading] = UseState("");
  const passwordValidation = Yup.object({
    password: Yup.string()
      .required("Please enter your new password.")
      .min(6, "Password must be atleast 6 characters.")
      .max(36, "Password can't be more than 36 characters"),
    conf_password: Yup.string()
      .required("Confirm your password.")
      .oneOf([Yup.ref("password")], "Passwords must match."),
  });
  const resetHandler = async () => {
    try {
      setLoading(true);
      const { data } = await axios.put("/api/auth/reset", {
        user_id,
        password,
      });
      let options = {
        redirect: false,
        email: data.email,
        password: password,
      };
      await signIn("credentials", options);
      window.location.reload(true);
    } catch (error) {
      setLoading(false);
      setSuccess("");
      setError(error.response.data.message);
    }
  };
  return (
    <>
      {loading && <DotLoaderSpinner loading={loading} />}
      <Header country="" />
      <div className={styles.forgot}>
        <div>
          <div className={styles.forgot__header}>
            <div className={styles.back__svg}>
              <BiLeftArrowAlt />
            </div>
            {user_id && (
              <span>
                Reset your password ? <Link href="/">Login instead</Link>
              </span>
            )}
            {!user_id && (
              <span>
                Your token is not valid or expired!{" "}
                <Link href="/auth/forgot">Request another email instead</Link>
              </span>
            )}
          </div>
          {user_id && (
            <Formik
              enableReinitialize
              initialValues={{
                password,
                conf_password,
              }}
              validationSchema={passwordValidation}
              onSubmit={() => {
                resetHandler();
              }}
            >
              {(form) => (
                <Form>
                  <LoginInput
                    type="password"
                    name="password"
                    icon="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <LoginInput
                    type="password"
                    name="conf_password"
                    icon="password"
                    placeholder="Confirm Password"
                    onChange={(e) => setConf_password(e.target.value)}
                  />

                  <CircledIconBtn type="submit" text="Submit" />
                  <div style={{ marginTop: "10px" }}>
                    {error && <span className={styles.error}>{error}</span>}
                  </div>
                </Form>
              )}
            </Formik>
          )}
        </div>
      </div>
      <Footer country="" />
    </>
  );
}

export async function getServerSideProps(context) {
  const { query, req } = context;
  const session = await getSession({ req });
  if (session) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }
  const token = query.token;
  try {
    var user_id = jwt.verify(token, process.env.RESET_TOKEN_SECRET);
  } catch {}
  return {
    props: {
      user_id: user_id?.id || null,
    },
  };
}
