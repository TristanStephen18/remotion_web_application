import { useState } from "react"
import { backendPrefix } from "../../config";

export const useProfileHooks = () => {
    const [userData, setUserData] = useState<any>(null);
    const [loadingUserData, setLoadingUserData] = useState(false);
    const [userPfp, setUserPfp] = useState<string | null>(null);
    const [username, setUsername] = useState<string>("");

    const fetchProfileDetails = () => {
      setLoadingUserData(true);
      fetch(`${backendPrefix}/auth`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        credentials: "include", // ✅ ADDED: For HTTP-only cookies
      })
        .then((res) => {
          if (!res.ok) throw new Error("Unauthorized or failed fetch");
          return res.json();
        })
        .then((data) => {
          console.log("User data: ", data);
          
          
          if (data.success && data.user) {
            setUserPfp(data.user.profilePicture);
            setUsername(data.user.name);
            setUserData(data.user); 
          } else {
            console.error("Failed to fetch user:", data.error);
          }
        })
        .catch((err) => console.error("❌ Failed to fetch user details:", err))
        .finally(() => setLoadingUserData(false));
    };

  return {
    fetchProfileDetails,
    userData,
    loadingUserData,
    username,
    userPfp
  }
}