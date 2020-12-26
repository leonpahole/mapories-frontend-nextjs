import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { verifyEmail as verifyAccount } from "../../api/auth.api";
import { Loading } from "../../components/Loading";
import { UserExcerpt } from "../../types/UserExcerpt";
import { Button } from "rsuite";

const VerifyEmail: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [verifiedUser, setVerifiedUser] = useState<UserExcerpt | null>(null);
  let { token } = useParams<{ token: string }>();

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
        <h1 className="title">Email verified, {verifiedUser.name}!</h1>
        <p className="subtitle">
          Your email has been verified. You can now log in.
        </p>
        <Button
          appearance="ghost"
          className="mt-2"
          size="lg"
          componentClass={Link}
          to="/login"
        >
          Sign in
        </Button>
      </>
    );
  } else {
    renderedResult = (
      <>
        <h1 className="title">Error!</h1>
        <p className="subtitle">Your email has not been verified.</p>

        <small className="d-block mt-2">
          <Link to="/">Back to home</Link>
        </small>
      </>
    );
  }

  return (
    <div className="flex flex-column text-center align-items-center">
      {renderedResult}
    </div>
  );
};

export default VerifyEmail;
