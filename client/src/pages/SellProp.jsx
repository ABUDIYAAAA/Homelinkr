import { useEffect } from "react";
import { useAuth } from "../context/Auth";
import { useNavigate } from "react-router-dom";
export default function SellProp() {
  const auth = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!auth.loading && !auth.user) {
      navigate("/login");
    }
  }, [auth.user]);
  return <h1>Hello</h1>;
}
