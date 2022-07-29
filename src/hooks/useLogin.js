import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// firebase firestore
import { auth, db } from '../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';

// context
import { AuthContext } from '../context/AuthContext';

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const login = async (email, password) => {
    setError(null);
    setIsPending(true);

    try {
      // signin
      const res = await signInWithEmailAndPassword(auth, email, password);
      if (!res) {
        throw new Error('Could not complete signup');
      }

      // update user online activity
      const userDocRef = doc(db, 'users', res.user.uid);
      await updateDoc(userDocRef, {
        online: true,
      });

      // dispatch login action
      dispatch({ type: 'LOGIN', payload: res.user });

      // update state
      setIsPending(false);
      setError(null);
      navigate('/');
    } catch (err) {
      console.log(err.message);
      setError(err.message);
      setIsPending(false);
    }
  };

  return { login, error, isPending };
};
