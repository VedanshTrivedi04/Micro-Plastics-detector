import { useState, useEffect } from 'react';
import { FaGoogle } from "react-icons/fa";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import'./login.css';

const Particles = () => {
  const [particles, setParticles] = useState([]);
  useEffect(() => {
    const particleCount = 20;
    const newParticles = [];
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        size: Math.random() * 8 + 2,
        left: `${Math.random() * 100}vw`,
        top: `${Math.random() * 100}vh`,
        animationDelay: `${Math.random() * 15}s`,
        animationDuration: `${Math.random() * 10 + 15}s`,
      });
    }
    setParticles(newParticles);
  }, []);

  return (
    <div className="particles">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: p.left,
            top: p.top,
            animationDelay: p.animationDelay,
            animationDuration: p.animationDuration,
          }}
        />
      ))}
    </div>
  );
};

const Login = () => {
  const [username, setusername] = useState('');
  const [password, setpassword] = useState('');
  const [formStatus, setFormStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('loading');
    setErrorMessage('');

    const BASE_URL = 'http://127.0.0.1:8000';
    const TOKEN_URL = `${BASE_URL}/api/v1/token/`;

    try {
      // Try with username first (Django default), then fallback to email
      const tryPayloads = [
        { username, password },
        { email: username, password },
      ];

      let tokens = null;
      let lastErr;
      for (const payload of tryPayloads) {
        try {
          const res = await axios.post(TOKEN_URL, payload, {
            headers: { 'Content-Type': 'application/json' },
          });
          tokens = res.data;
          break;
        } catch (err) {
          lastErr = err;
          // continue to next payload on 401/400
          if (!err.response || (err.response.status !== 400 && err.response.status !== 401)) {
            throw err; // unknown error -> break out
          }
        }
      }

      if (!tokens) {
        throw lastErr || new Error('Authentication failed');
      }

      localStorage.setItem('accesstoken', tokens.access);
      localStorage.setItem('refreshtoken', tokens.refresh);
      setFormStatus('success');
      navigate('/home');
    } catch (error) {
      console.error('Login error', error);
      const msg = error?.response?.data?.detail || 'Invalid credentials';
      setErrorMessage(msg);
      setFormStatus('idle');
    }
  };

  return (
    <>
      <Particles />
      <div className="login-container floating">
        <h2>Welcome Back</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Username"
              required
              value={username}
              onChange={(e) => setusername(e.target.value)}
            />
            <i className="fas fa-user"></i>
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setpassword(e.target.value)}
            />
            <i className="fas fa-lock"></i>
          </div>
          <div className="remember-forgot">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <a href="#">Forgot password?</a>
          </div>
          <button
            type="submit"
            className="btn"
            style={{
              background: formStatus === 'success' ? 'rgba(40, 167, 69, 0.3)' : ''
            }}
            disabled={formStatus === 'success' || formStatus === 'loading'}
          >
            {formStatus === 'loading' ? (
              <><i className="fas fa-spinner fa-spin"></i> Signing in...</>
            ) : formStatus === 'success' ? (
              <><i className="fas fa-check"></i> SUCCESS!</>
            ) : (
              'LOGIN'
            )}
          </button>
          {errorMessage && (
            <div style={{ marginTop: 10, color: '#ff6b6b', fontWeight: 600 }}>{errorMessage}</div>
          )}
          <div className="social-icons">
            <a href="#"><FaGoogle /></a>
          </div>
          <div className="signup-link">
            <p>Don't have an account? <Link to='/register'>Sign Up</Link></p>
          </div>
          <div className="copyright">
            <p>© 2025 Login Form. All rights reserved.</p>
          </div>
        </form>
      </div>
      
    </>
  );
};

export default Login;
