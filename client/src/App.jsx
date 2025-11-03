import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import RootLayout from "./pages/Layout.jsx";
import SellProp from "./pages/SellProp.jsx";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        { index: true, element: <Home /> },
        { path: "signup", element: <Signup /> },
        { path: "login", element: <Login /> },
        { path: "sell", element: <SellProp /> },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
