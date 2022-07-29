import { useEffect, useRef, useState } from 'react';
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from '../firebase/config';

export const useCollection = (collectionName, _queryInfo, _orderByInfo) => {
  const [documents, setDocuments] = useState(null);
  const [error, setError] = useState(null);

  // if we dont use use a ref ==> infinite loop in useEffect
  // _query is an array and is 'different' on every function call
  const queryInfo = useRef(_queryInfo).current;
  const orderByInfo = useRef(_orderByInfo).current;

  useEffect(() => {
    let colRef = collection(db, collectionName);

    // queries -- return specific collection depending on matching condition
    if (queryInfo) {
      colRef = query(colRef, where(...queryInfo));
    }

    // desc or asceding order
    if (orderByInfo) {
      colRef = query(colRef, orderBy(...orderByInfo));
    }

    // real time collection data
    const unSub = onSnapshot(colRef, (snapshot) => {
      let results = [];
      snapshot.docs.forEach((doc) => {
        results.push({ ...doc.data(), id: doc.id });
      });

      // update state
      setDocuments(results);
      setError(null);
    });

    // unSubscribe on unmount
    return () => unSub();
  }, [collectionName, queryInfo, orderByInfo]);

  return { documents, error };
};
