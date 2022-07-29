import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// firebase firestore
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { auth, storage, createUserDocumentFromAuth } from '../firebase/config';

// context
import { AuthContext } from '../context/AuthContext';

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useContext(AuthContext);

  const navigate = useNavigate();

  const signup = async (email, password, displayName, thumbnail) => {
    setError(null);
    setIsPending(true);

    try {
      // signup user
      const res = await createUserWithEmailAndPassword(auth, email, password);

      if (!res) {
        throw new Error('Could not complete signup');
      }

      // upload user thumbnail
      const uploadPath = `thumbnails/${res.user.uid}/${thumbnail.name}`;
      const storageRef = ref(storage, uploadPath);
      await uploadBytes(storageRef, thumbnail);
      const imgUrl = await getDownloadURL(ref(storage, uploadPath));

      // add displayName to user
      await updateProfile(res.user, { displayName, photoURL: imgUrl });

      // create a user document
      createUserDocumentFromAuth(res.user, imgUrl);

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

  return { signup, error, isPending };
};
