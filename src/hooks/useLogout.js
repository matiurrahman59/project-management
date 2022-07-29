import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { useAuthContext } from './useAuthContext';
import { doc, updateDoc } from 'firebase/firestore';

export const useLogout = () => {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch, user } = useAuthContext();

  const logout = async () => {
    setError(null);
    setIsPending(true);

    try {
      // update user online activity
      const { uid } = user;
      const userDocRef = doc(db, 'users', uid);
      await updateDoc(userDocRef, {
        online: false,
      });

      //  signOutUser();
      await signOut(auth);

      // dispatch logout action
      dispatch({ type: 'LOGOUT' });

      // update state
      setIsPending(false);
      setError(null);
    } catch (err) {
      console.log(err.message);
      setError(err.message);
      setIsPending(false);
    }
  };

  return { logout, error, isPending };
};
