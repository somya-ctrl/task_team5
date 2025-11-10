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
    const id = params.get("id"); // EXTREMELY IMPORTANT

    if (token && id) {

      // ---- clean old storage ----
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

      // ---- save new correct user ----
      localStorage.setItem("token", token);

      const userObj = {
        id: id,     // must have id
        name: name,
        email: email,
        photo: photo
      };

      localStorage.setItem("user", JSON.stringify(userObj));

      navigate("/profession");
    }
  }, []);

  return <div>Loading...</div>;
}
