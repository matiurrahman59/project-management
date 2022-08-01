import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAuthContext } from '../../hooks/useAuthContext';

// custom hook
import { useSignup } from '../../hooks/useSignup';

// styles
import './Signup.css';

const SIgnup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailError, setThumbnailError] = useState(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // custom hook
  const { signup, isPending, error } = useSignup();
  const { user } = useAuthContext();

  // redirect
  useEffect(() => {
    if (user && pathname === '/signup') {
      navigate('/');
    }
  }, [user, pathname, navigate]);

  // formSubmit
  const handleSubmit = (e) => {
    e.preventDefault();
    signup(email, password, displayName, thumbnail);
  };

  // check for uploaded user img
  const handleFileChange = (e) => {
    setThumbnail(null);
    let selected = e.target.files[0];
    if (!selected) {
      setThumbnailError('Please select a file');
      return;
    }
    if (!selected.type.includes('image')) {
      setThumbnailError('Selected file must be an image');
      return;
    }
    if (selected.size > 100000) {
      setThumbnailError('Image file size must be less than 100kb');
      return;
    }
    setThumbnailError(null);
    setThumbnail(selected);
  };

  useEffect(() => {
    if (!isPending) {
      setEmail('');
      setPassword('');
      setDisplayName('');
      setThumbnail(null);
    }
  }, [isPending]);

  return (
    <form onSubmit={handleSubmit} className='auth-form'>
      <h2>sign up</h2>
      <label>
        <span>email:</span>
        <input
          required
          type='email'
          onChange={(e) => setEmail(e.target.value)}
          autoComplete='true'
          value={email}
        />
      </label>
      <label>
        <span>password:</span>
        <input
          required
          type='password'
          onChange={(e) => setPassword(e.target.value)}
          autoComplete='false'
          value={password}
        />
      </label>
      <label>
        <span>display name:</span>
        <input
          required
          type='text'
          onChange={(e) => setDisplayName(e.target.value)}
          autoComplete='true'
          value={displayName}
        />
      </label>
      <label>
        <span>Profile thumbnail:</span>
        <input required type='file' onChange={handleFileChange} />
        {thumbnailError && <div className='error'>{thumbnailError}</div>}
      </label>

      {!isPending && <button className='btn'>Sign up</button>}
      {isPending && (
        <button className='btn' disabled>
          loading
        </button>
      )}
      {error && <div className='error'>{error}</div>}
    </form>
  );
};

export default SIgnup;
