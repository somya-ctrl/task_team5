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

    const userObj = {
      fullName: name,
      email: email,
      photo: photo
    }

    localStorage.setItem("user", JSON.stringify(userObj));

    navigate("/profession");
  }
}, []);


  return <div>Loading...</div>;
}

