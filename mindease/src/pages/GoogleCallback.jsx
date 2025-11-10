import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function GoogleCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get("token"); // access token from callback URL
    const name = params.get("name");
    const email = params.get("email");
    const photo = params.get("photo");
    const id = params.get("id"); // required user id

    if (token && id) {
      // Clear outdated localStorage keys for a fresh session
      Object.keys(localStorage).forEach((k) => {
        if (
          k.startsWith("user-null") ||
          k.startsWith("user-undefined") ||
          k.startsWith("meditation-done") ||
          k.startsWith("journal-done") ||
          k.startsWith("mood-check-done") ||
          k.startsWith("mood-history") ||
          k === "name" ||
          k === "photo"
        ) {
          localStorage.removeItem(k);
        }
      });

      // Save new user info and tokens
      localStorage.setItem("accessToken", token);

      const userObj = {
        id,
        name,
        email,
        photo,
      };
      localStorage.setItem("user", JSON.stringify(userObj));

      navigate("/profession");
    }
  }, [params, navigate]);

  return <div>Loading...</div>;
}
