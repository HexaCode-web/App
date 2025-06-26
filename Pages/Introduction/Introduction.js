// IntroductionScreen.js
import React, { useState } from "react";

import Greeting from "./Components/Greeting";
import SignUp from "./Components/signUp/signUp";
import Login from "./Components/Login";

const Introduction = () => {
  const [activePage, setActivePage] = useState("Greeting");

  if (activePage === "Greeting") {
    return <Greeting setActivePage={setActivePage} />;
  }
  if (activePage === "Signup") {
    return <SignUp setActivePage={setActivePage} />;
  }
  if (activePage === "Login") {
    return <Login setActivePage={setActivePage} />;
  }
};

export default Introduction;
