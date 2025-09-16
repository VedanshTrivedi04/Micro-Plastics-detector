import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom'; // Import Link for navigation

// A smaller component for the animated cards
const AnimatedCard = ({ children, className }) => {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    return (
        <div
            ref={ref}
            className={className}
            style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.5s ease, transform 0.5s ease',
            }}
        >
            {children}
        </div>
    );
};


const Dashboard = () => {
    const [particleCount, setParticleCount] = useState(328);

    // Effect for simulating live data updates
    useEffect(() => {
        const interval = setInterval(() => {
            setParticleCount(prevCount => {
                const newCount = prevCount + Math.floor(Math.random() * 5) - 2;
                return Math.max(300, newCount); // Keep it above 300
            });
        }, 3000);

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    // This handler is no longer needed for the Link, but kept here in case you want to use it elsewhere.
    const handleGetStarted = (e) => {
        const button = e.currentTarget;
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
            alert('Starting microplastic sensor setup wizard...');
        }, 200);
    };

    return (
        <div className="dashboard-container">
            <header>
                <div className="logo">
                    <i className="fas fa-microscope"></i>
                    <h1>Microplastic<span>Sensor</span>Tech</h1>
                </div>
                <nav>
                    <ul>
                        <li><a href="#">Dashboard</a></li>
                        <li><a href="#">Sensor Data</a></li>
                        <li><a href="#">Analytics</a></li>
                        <li><a href="#">Settings</a></li>
                    </ul>
                </nav>
            </header>

            <main>
                <section className="hero">
                    <h2>Advanced Microplastic Detection</h2>
                    <p>Monitor and analyze microplastic particles in real-time with our cutting-edge sensor technology. Get started with your detection journey today.</p>
                    
                    {/* FIX: Replaced <button> with <Link> */}
                    <Link to='/login' className="btn-get-started">
                        Get Started
                    </Link>
                </section>

                <div className="dashboard-content">
                    <div className="sensor-data">
                        <h3><i className="fas fa-wave-square"></i> Real-time Sensor Data</h3>
                        <div className="data-cards">
                            <AnimatedCard className="data-card">
                                <i className="fas fa-water"></i>
                                <h4>{particleCount}</h4>
                                <p>Particles/Liter</p>
                            </AnimatedCard>
                            <AnimatedCard className="data-card">
                                <i className="fas fa-shapes"></i>
                                <h4>5μm</h4>
                                <p>Avg. Size</p>
                            </AnimatedCard>
                            <AnimatedCard className="data-card">
                                <i className="fas fa-thermometer-half"></i>
                                <h4>22°C</h4>
                                <p>Water Temp</p>
                            </AnimatedCard>
                            <AnimatedCard className="data-card">
                                <i className="fas fa-barcode"></i>
                                <h4>PP/PE</h4>
                                <p>Primary Type</p>
                            </AnimatedCard>
                        </div>
                    </div>

                    <div className="analysis">
                        <h3><i className="fas fa-chart-bar"></i> Concentration Analysis</h3>
                        <p>Microplastic concentration levels across samples</p>
                        <div className="analysis-graph">
                            <div className="graph-bar bar-1" style={{ height: '70%' }}></div>
                            <div className="graph-bar bar-2" style={{ height: '40%' }}></div>
                            <div className="graph-bar bar-3" style={{ height: '85%' }}></div>
                            <div className="graph-bar bar-4" style={{ height: '60%' }}></div>
                        </div>
                    </div>
                </div>

                <div className="features">
                    <AnimatedCard className="feature-card">
                        <i className="fas fa-bolt"></i>
                        <h3>High Sensitivity</h3>
                        <p>Detection of microplastic particles as small as 1μm with 99% accuracy using advanced optical technology.</p>
                    </AnimatedCard>
                    <AnimatedCard className="feature-card">
                        <i className="fas fa-microchip"></i>
                        <h3>AI-Powered Analysis</h3>
                        <p>Machine learning algorithms classify plastic types and sizes in real-time with continuous improvement.</p>
                    </AnimatedCard>
                    <AnimatedCard className="feature-card">
                        <i className="fas fa-satellite-dish"></i>
                        <h3>Remote Monitoring</h3>
                        <p>Cloud-connected sensors provide continuous monitoring data accessible from anywhere in the world.</p>
                    </AnimatedCard>
                </div>

                <div className="status">
                    <h3><i className="fas fa-tasks"></i> System Status</h3>
                    <p>Sensor calibration and data collection progress</p>
                    <div className="progress-container">
                        <div className="progress-bar"></div>
                    </div>
                    <p>75% complete - All systems operational</p>
                </div>
            </main>
            
            <footer>
                <p>© 2025 Microplastic Sensor Technology. All rights reserved. Advancing environmental protection through innovation.</p>
            </footer>
        </div>
    );
};

export default Dashboard;