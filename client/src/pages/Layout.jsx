import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function RootLayout() {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <div className="bg-white shadow-md">
        <Navbar />
      </div>

      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}
