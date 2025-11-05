import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function GoogleCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get("token");
    const name = params.get("name");
    const email = params.get("email");
    const photo = params.get("photo");

    
    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("name", name);
      localStorage.setItem("email", email);
      localStorage.setItem("photo", photo);
      navigate("/landing");
    }
  }, []);

  return <div>Loading...</div>;
}

