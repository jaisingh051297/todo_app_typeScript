import React, { useState, useContext } from 'react';
import {Navigate } from 'react-router-dom';
import { AuthContext, User } from '../../context/AuthContext';
import usersData from '../../data/users.json' ;
import '../Login/login.css';


const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { state, dispatch } = useContext(AuthContext);
  const user = state.user;
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const authenticatedUser = usersData.users.find(
      (user: User) => user.username === username && user.password === password
    );
    if (authenticatedUser) {
      dispatch({ type: 'LOGIN', payload: authenticatedUser });
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div style={{display:"flex",alignItems:'center',justifyContent:'center'}}>
    <div className='Login__details'>
      <h1>Login</h1>
      {error && <p style={{color:'red',fontSize:'20px'}}>{error}</p>}
      <form style={{display:'flex',flexDirection:'column', alignItems:'center', justifyContent:'center'}} onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            id="username"
            value={username}
            className='input1'
            placeholder='Username'
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <input
            type="password"
            id="password"
            value={password}
            className='input1'
            placeholder='Password'
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className='loginButton'>Login</button>

      </form>
      <p> Use the following to Login</p>
      <p>
        [ Username: Jai, Password: Jai123 ]
      </p>
    </div>
    </div>
  );
};

export default Login;
