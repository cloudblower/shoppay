import { getSession } from "next-auth/react";
import { useState as UseState } from "react";
import Layout from "../../components/profile/layout";
import User from "../../models/User";
import Payment from "../../components/checkout/payment";
import styles from "../../styles/profile.module.scss";
import axios from "axios";
import { useRouter as UseRouter } from "next/router";
export default function payment({ user, tab, defaultPaymentMethod }) {
  const router = UseRouter();
  const [dbPM, setDbPM] = UseState(defaultPaymentMethod);
  const [paymentMethod, setPaymentMethod] = UseState(defaultPaymentMethod);
  const [error, setError] = UseState("");
  const handlePM = async () => {
    try {
      const { data } = await axios.put("/api/user/changePM", {
        paymentMethod,
      });
      setError("");
      setDbPM(data.paymentMethod);
      window.location.reload(false);
    } catch (error) {
      setError(error.response.data.message);
    }
  };
  return (
    <Layout session={user.user} tab={tab}>
      <div className={styles.header}>
        <h1>MY PAYMENT METHODS</h1>
      </div>
      <Payment
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        profile
      />
      <button
        disabled={!paymentMethod || paymentMethod == dbPM}
        className={`${styles.button} ${
          !paymentMethod || paymentMethod == dbPM ? styles.disabled : ""
        }`}
        onClick={() => handlePM()}
      >
        Save
      </button>
      {error && <span className={styles.error}>{error}</span>}
    </Layout>
  );
}

export async function getServerSideProps(ctx) {
  const { query, req } = ctx;
  const session = await getSession({ req });
  const tab = query.tab || 0;
  //-----------------
  const user = await User.findById(session.user.id).select(
    "defaultPaymentMethod"
  );
  return {
    props: {
      user: session,
      tab,
      defaultPaymentMethod: user.defaultPaymentMethod,
    },
  };
}
