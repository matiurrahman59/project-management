import { collection, doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../firebase/config';

export const useDocument = (collectionName, id) => {
  const [document, setDocument] = useState(null);
  const [error, setError] = useState(null);

  // realtime data for document
  useEffect(() => {
    let colRef = doc(db, collectionName, id);

    onSnapshot(
      colRef,
      (doc) => {
        if (doc.data()) {
          setDocument(doc.data(), doc.id);
          setError(null);
        } else {
          setError('no such document');
        }
      },
      (err) => {
        console.log(err.message);
        setError('failed to get document');
      }
    );
  }, [collectionName, id]);

  return { document, error };
};
