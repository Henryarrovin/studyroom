import Home from "./components/home/Home";
import Login from "./components/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import { useEffect } from "react";
import useUserData from "./hooks/useUserData";

const App = () => {
  const { submitUserInput } = useUserData();

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (username) {
      submitUserInput(username as string);
    }
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
