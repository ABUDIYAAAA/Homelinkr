import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import RootLayout from "./pages/Layout.jsx";
import SellProp from "./pages/SellProp.jsx";
import ProfileLayout from "./pages/profile/ProfileLayout.jsx";
import Profile from "./pages/profile/Profile.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropertyContextProvider } from "./context/Properties.jsx";
import MapPicker from "./components/MapPicker.jsx";
function App() {
  const queryClient = new QueryClient();
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        { index: true, element: <Home /> },
        { path: "signup", element: <Signup /> },
        { path: "login", element: <Login /> },
        { path: "sell", element: <SellProp /> },
        { path: "map", element: <MapPicker /> },
        {
          path: "profile",
          element: <ProfileLayout />,
          children: [{ index: true, element: <Profile /> }],
        },
      ],
    },
  ]);
  return (
    <QueryClientProvider client={queryClient}>
      <PropertyContextProvider>
        <RouterProvider router={router} />
      </PropertyContextProvider>
    </QueryClientProvider>
  );
}

export default App;
