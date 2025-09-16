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
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('success');
    setTimeout(() => {
      setFormStatus('idle');
    }, 2000);

    const userData = { username, password };
    console.log('userdata==>', userData);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/v1/token/', userData);
      console.log(response.data);
      localStorage.setItem('accesstoken', response.data.access);
      localStorage.setItem('refreshtoken', response.data.refresh);
      navigate('/home');
    } catch (error) {
      console.error('invalid credential', error);
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
            disabled={formStatus === 'success'}
          >
            {formStatus === 'success' ? (
              <><i className="fas fa-check"></i> SUCCESS!</>
            ) : (
              'LOGIN'
            )}
          </button>
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
