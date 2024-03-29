import React, { useEffect, useState } from "react";
import "../assets/styles/Login.css";
import LoginForm from "../components/LoginForm";
import SignUpForm from "../components/SignUpForm";

function Login(props) {
  const [showSignUpForm, setShowSignUpForm] = useState(false);

  useEffect(() => {
    // useEffect to remove the padding around the kash ops image since the padding is applied to the body  on the styles.css file and affects all other pages.
    document.body.classList.add("remove-body-padding");

    return () => {
      document.body.classList.remove("remove-body-padding");
    };
  }, []);
  return (
    <main className="kash-operations-login">
      <div className="kash_operations_home--hero-section">
        <h1 className="kash_operations_home--title">Operations Center</h1>
        <p className="home-hero--toast_message">By KASH Tech</p>
      </div>
      <div className="kash_operations_home--content-holder">
        <div className="kash_operations_home--banner-heading">
          {/* <button
            type="submit"
            value="Submit"
            className="button sign_up-button"
            onClick={() => setShowSignUpForm(!showSignUpForm)}
          >
            <p className="sign_up-button-text">
              {showSignUpForm ? "Login" : "Sign Up"}
            </p>
          </button> */}
        </div>
        {showSignUpForm ? (
          <SignUpForm showSignUp={setShowSignUpForm} />
        ) : (
          <LoginForm
            userLoggedIn={props.loggedInUserName}
            setAdmin={props.setAdmin}
          />
        )}
      </div>
    </main>
  );
}
export default Login;
