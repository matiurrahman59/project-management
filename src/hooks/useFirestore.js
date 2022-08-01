import { useReducer, useEffect, useState } from 'react';
import {
  addDoc,
  collection,
  doc,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';
import { createdAt, db } from '../firebase/config';

let initialState = {
  document: null,
  isPending: false,
  error: null,
  success: null,
};

const firestoreReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'IS_PENDING':
      return { isPending: true, document: null, success: false, error: null };
    case 'ADDED_DOCUMENT':
      return {
        isPending: false,
        document: payload,
        success: true,
        error: null,
      };
    case 'DELETED_DOCUMENT':
      return {
        idPending: false,
        document: null,
        success: true,
        error: null,
      };
    case 'UPDATTED_DOCUMENT':
      return {
        idPending: false,
        document: null,
        success: true,
        error: null,
      };
    case 'ERROR':
      return {
        isPending: false,
        document: null,
        success: false,
        error: payload,
      };
    default:
      return state;
  }
};

export const useFirestore = (collectionName) => {
  const [response, dispatch] = useReducer(firestoreReducer, initialState);
  const [isCancelled, setIsCancelled] = useState(false);

  // collection reference
  const colRef = collection(db, collectionName);

  // only dispatch if not cancelled
  const dispatchIfNotCancelled = (action) => {
    if (!isCancelled) {
      dispatch(action);
    }
  };

  // add a document
  const addDocument = async (doc) => {
    dispatch({ type: 'IS_PENDING' });

    try {
      const addedDocument = await addDoc(colRef, {
        ...doc,
        createdAt,
      });
      dispatchIfNotCancelled({
        type: 'ADDED_DOCUMENT',
        payload: addedDocument,
      });
    } catch (err) {
      dispatchIfNotCancelled({ type: 'ERROR', payload: err.message });
    }
  };

  // delete single document
  const deleteDocument = async (id) => {
    dispatch({ type: 'IS_PENDING' });
    const docRef = doc(db, collectionName, id);

    try {
      await deleteDoc(docRef);
      dispatchIfNotCancelled({
        type: 'DELETED_DOCUMENT',
      });
    } catch (err) {
      dispatchIfNotCancelled({ type: 'ERROR', payload: err.message });
    }
  };

  // updating a document
  const updateDocument = async (id, updates) => {
    dispatch({ type: 'IS_PENDING' });

    let docRef = doc(db, collectionName, id);
    try {
      await updateDoc(docRef, updates);

      dispatch({ type: 'UPDATTED_DOCUMENT' });
    } catch (err) {
      dispatch({ type: 'ERROR', payload: err.message });
      return null;
    }
  };

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { addDocument, deleteDocument, updateDocument, response };
};
