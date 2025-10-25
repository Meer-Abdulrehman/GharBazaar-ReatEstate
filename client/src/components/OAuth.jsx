import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      const res = await fetch('https://reat-estate-backend.vercel.app/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // ✅ store JWT cookie
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          avatar: result.user.photoURL, // ✅ match backend
        }),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        console.error('Google login failed:', data.message);
        return;
      }

      dispatch(signInSuccess(data.user));
      navigate('/');
    } catch (error) {
      console.error('Could not sign in with Google:', error);
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type='button'
      className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95'
    >
      Continue with Google
    </button>
  );
}
