import React, { useEffect, useState } from "react";
import { useAlreadyLoggedInGuard } from "../utils/useAlreadyLoggedInGuard";
import { useParams, Link } from "react-router-dom";
import { verifyEmail as verifyAccount } from "../api/auth.api";
import { Loading } from "../components/Loading";
import { User } from "../types/User";

const VerifyEmail: React.FC = () => {
  useAlreadyLoggedInGuard();

  const [loading, setLoading] = useState<boolean>(true);
  const [verifiedUser, setVerifiedUser] = useState<User | null>(null);
  let { token } = useParams();

  useEffect(() => {
    async function tryVerifyEmail() {
      try {
        const user = await verifyAccount(token);
        setVerifiedUser(user);
      } catch (e) {
        console.log("Verify error");
        console.log(e);
        setVerifiedUser(null);
      }

      setLoading(false);
    }

    tryVerifyEmail();
    // eslint-disable-next-line
  }, []);

  if (loading) {
    return <Loading />;
  }

  let renderedResult = null;

  if (verifiedUser != null) {
    renderedResult = (
      <>
        <h1>Email verified, {verifiedUser.name}!</h1>
        <p>Your email has been verified. You can now log in.</p>
        <Link to="/login">Log in</Link>
      </>
    );
  } else {
    renderedResult = (
      <>
        <h1>Error!</h1>
        <p>Your email has not been verified.</p>
        <Link to="/">Back to home</Link>
      </>
    );
  }

  return <div className="flex flex-column items-center">{renderedResult}</div>;
};

export default VerifyEmail;
