import React from "react";
import { ComingSoon } from "./ComingSoon";
import "./index.css";

export const App = React.memo(function App() {
  return (
    <React.StrictMode>
      <ComingSoon />
    </React.StrictMode>
  );
});
