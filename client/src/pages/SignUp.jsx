import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { app } from "../firebase";
import { FcGoogle } from "react-icons/fc";

export default function OAuth() {
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      // Sign in with Google popup
      const result = await signInWithPopup(auth, provider);

      // Get user info
      const userData = {
        name: result.user.displayName,
        email: result.user.email,
        photo: result.user.photoURL,
      };

      // ✅ Automatically detect environment (local or deployed)
      const API_BASE_URL =
        import.meta.env.MODE === "development"
          ? "http://localhost:3000"
          : "https://reat-estate-backend.vercel.app";

      // Send user data to backend
      const res = await fetch(`${API_BASE_URL}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      // Parse response safely
      if (!res.ok) {
        console.error("Google auth failed with status:", res.status);
        throw new Error(`Request failed: ${res.status}`);
      }

      const data = await res.json();

      if (data.success === false) {
        console.error("Google login backend error:", data.message);
        return;
      }

      // Redirect to homepage
      navigate("/");
    } catch (error) {
      console.error("Google sign-in error:", error);
      alert("Could not sign in with Google. Please try again.");
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      className="bg-red-600 text-white p-3 rounded-lg uppercase hover:opacity-95 flex items-center justify-center gap-2"
    >
      <FcGoogle className="text-2xl bg-white rounded-full" />
      Continue with Google
    </button>
  );
}
