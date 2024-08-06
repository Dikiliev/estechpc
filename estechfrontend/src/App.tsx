// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import Header from "@components/header/Header";
import Home from "@pages/home/Home";
import theme from "@styles/theme";
import "@styles/global.css";
import TestPage from "@pages/TestPage";

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/test" element={<TestPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
