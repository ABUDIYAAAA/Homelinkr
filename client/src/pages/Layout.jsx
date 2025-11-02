import { Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <div className="bg-white text-black min-h-screen">
      <Outlet />
    </div>
  );
}
