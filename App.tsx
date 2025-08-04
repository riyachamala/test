import React from "react";
import "./App.css";

import Main from "./components/MainBody";
import Header from "./components/Header";
import StandardFooter from "./components/StandardFooter";

// Define the App component that renders the Header, Main, and Footer components
const App: React.FC = () => {
  return (
    <div className="App">
      <Header />
      <Main />
      <StandardFooter />
    </div>
  );
};

export default App;
