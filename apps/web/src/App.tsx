import React from "react";
import { Landing } from "./Landing";
import "./index.css";

export const App = React.memo(function App() {
  return (
    <React.StrictMode>
      <Landing />
    </React.StrictMode>
  );
});
