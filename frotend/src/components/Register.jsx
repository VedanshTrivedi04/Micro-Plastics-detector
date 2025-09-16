import React, { useState, useEffect, useMemo } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';

// A dedicated component for the background particles
const Particles = () => {
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        const particleCount = 20;
        const newParticles = Array.from({ length: particleCount }).map((_, i) => ({
            id: i,
            style: {
                width: `${Math.random() * 8 + 2}px`,
                height: `${Math.random() * 8 + 2}px`,
                left: `${Math.random() * 100}vw`,
                top: `${Math.random() * 100}vh`,
                animationDelay: `${Math.random() * 15}s`,
                animationDuration: `${Math.random() * 10 + 15}s`,
            }
        }));
        setParticles(newParticles);
    }, []);

    return (
        // FIX: Changed classNameName to className
        <div className="particles">
            {particles.map(p => <div key={p.id} className="particle" style={p.style} />)}
        </div>
    );
};


// Main Register Component
const Register = () => {
    // FIX: Unified all form inputs into a single state object for consistency
    const initialFormState = {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        terms: false,
    };
    const [formData, setFormData] = useState(initialFormState);
    const [errors, setErrors] = useState({});
    const [isSuccess, setIsSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    // ADDED: Re-implemented password strength logic
    const passwordCheck = useMemo(() => {
        const password = formData.password;
        const validity = {
            length: password.length >= 8,
            number: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        };
        
        let strength = 0;
        if (validity.length) strength += 33.3;
        if (validity.number) strength += 33.3;
        if (validity.special) strength += 33.4;

        let color = '#ff4d4d'; // Red
        if (strength > 67) color = '#2eb82e'; // Green
        else if (strength > 34) color = '#ffa64d'; // Orange

        return { strength, color, validity };
    }, [formData.password]);
    
    // ADDED: A single handler for all form inputs
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleRegistration = async (e) => {
        e.preventDefault();
        
        // --- FORM VALIDATION ---
        if (formData.password !== formData.confirmPassword) {
            setErrors({ confirmPassword: 'Passwords do not match!' });
            return;
        }

        setLoading(true);
        setErrors({});

        // FIX: Removed undefined variables like frist_name and last_name
        const userdata = {
            username: formData.username,
            email: formData.email,
            password: formData.password,
        };

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/v1/register/', userdata);
            console.log('response.data==>', response.data);
            console.log('User register successful');
            setIsSuccess(true);
            setFormData(initialFormState); // Reset form on success
            
            // Hide success message after 3 seconds
            setTimeout(() => {
                setIsSuccess(false);
            }, 3000);

        } catch (error) {
            if (error.response && error.response.data) {
                setErrors(error.response.data);
                console.error('registration error', error.response.data);
            } else {
                console.error('An unexpected error occurred', error);
                setErrors({ general: 'An unexpected error occurred. Please try again.' });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Particles />
            <div className="register-container floating">
                <h2>Create Account</h2>
                
                {/* FIX: Conditionally render success message based on state */}
                {isSuccess && (
                    <div className="success-message" style={{ display: 'block' }}>
                        <i className="fas fa-check-circle"></i> Account created successfully!
                    </div>
                )}

                {/* FIX: Attached the onSubmit handler to the form */}
                <form id="registrationForm" onSubmit={handleRegistration}>
                    <div className="input-group">
                        <input type="text" name="username" placeholder="Username" required value={formData.username} onChange={handleChange} />
                        <i className="fas fa-user"></i>
                        {errors.username && <small className='text-danger'>{errors.username}</small>}
                    </div>
                    
                    <div className="input-group">
                        <input type="email" name="email" placeholder="Email Address" required value={formData.email} onChange={handleChange} />
                        <i className="fas fa-envelope"></i>
                        {errors.email && <small className='text-danger'>{errors.email}</small>}
                    </div>
                    
                    <div className="input-group">
                        <input type="password" name="password" placeholder="Password" required value={formData.password} onChange={handleChange} />
                        <i className="fas fa-lock"></i>
                        {errors.password && <small className='text-danger'>{errors.password}</small>}
                        
                        <div className="password-strength">
                            <div className="strength-meter" style={{ width: `${passwordCheck.strength}%`, background: passwordCheck.color }}></div>
                        </div>
                        
                        <div className="password-requirements">
                            <div className={`requirement ${passwordCheck.validity.length ? 'met' : ''}`}>
                                <i className="fas fa-circle"></i> At least 8 characters
                            </div>
                            <div className={`requirement ${passwordCheck.validity.number ? 'met' : ''}`}>
                                <i className="fas fa-circle"></i> Contains a number
                            </div>
                            <div className={`requirement ${passwordCheck.validity.special ? 'met' : ''}`}>
                                <i className="fas fa-circle"></i> Contains a special character
                            </div>
                        </div>
                    </div>
                    
                    <div className="input-group">
                        <input type="password" name="confirmPassword" placeholder="Confirm Password" required value={formData.confirmPassword} onChange={handleChange} />
                        <i className="fas fa-lock"></i>
                        {errors.confirmPassword && <small className='text-danger'>{errors.confirmPassword}</small>}
                    </div>
                    
                    <div className="terms">
                        <input type="checkbox" id="terms" name="terms" required checked={formData.terms} onChange={handleChange} />
                        <label htmlFor="terms">I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></label>
                    </div>
                    
                    {/* FIX: Button is now a direct child of the form */}
                    <button type="submit" className="btn" disabled={loading}>
                        {loading ? 'CREATING...' : 'CREATE ACCOUNT'}
                    </button>
                    
                    <div className="login-link">
                        <p>Already have an account? <Link to="/login">Sign In</Link></p>
                    </div>
                    
                    <div className="copyright">
                        <p>© 2025 Microplastic Sensor Tech. All rights reserved.</p>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Register;