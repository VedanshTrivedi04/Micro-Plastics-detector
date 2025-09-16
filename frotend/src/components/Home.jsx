import React, { useState, useEffect } from 'react';
// Make sure to import the new CSS for this component
import'./home.css';

// A small component to generate the animated particles for the research section
const ResearchParticles = () => {
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        const newParticles = Array.from({ length: 12 }).map((_, i) => ({
            id: i,
            style: {
                width: `${Math.random() * 6 + 4}px`,
                height: `${Math.random() * 6 + 4}px`,
                left: `${Math.random() * 160}px`,
                top: `${Math.random() * 80 + 20}px`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${Math.random() * 2 + 3}s`,
            },
        }));
        setParticles(newParticles);
    }, []);

    return (
        <div className="particles-animation">
            {particles.map(p => <div key={p.id} className="particle" style={p.style} />)}
        </div>
    );
};


const Home = () => {
    // State machine for the application flow
    const [appState, setAppState] = useState('idle'); // idle | countdown | analyzing | results
    const [countdown, setCountdown] = useState(20);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [downloadStatus, setDownloadStatus] = useState('idle'); // idle | downloading | downloaded

    // Effect to handle the countdown timer
    useEffect(() => {
        if (appState !== 'countdown') return;

        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setAppState('analyzing'); // Trigger analysis after countdown
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer); // Cleanup interval
    }, [appState]);

    // Effect to handle the analysis simulation
    useEffect(() => {
        if (appState !== 'analyzing') return;

        const analysisTimer = setTimeout(() => {
            // Generate random results for the report
            const particleCount = Math.floor(Math.random() * 300) + 50;
            const avgSize = (Math.random() * 10 + 1).toFixed(1);
            const contaminationLevels = ['Low', 'Moderate', 'High'];
            const polymers = ['Polyethylene', 'Polypropylene', 'Polystyrene', 'PVC'];
            const riskLevels = ['Low', 'Medium', 'High'];
            const riskLevel = riskLevels[Math.floor(Math.random() * riskLevels.length)];

            setAnalysisResult({
                particleCount: `${particleCount} particles/L`,
                avgSize: `${avgSize} μm`,
                contaminationLevel: contaminationLevels[Math.floor(Math.random() * contaminationLevels.length)],
                polymerType: polymers[Math.floor(Math.random() * polymers.length)],
                riskLevel: riskLevel,
            });
            setAppState('results');
        }, 3000); // Simulate 3 seconds of analysis

        return () => clearTimeout(analysisTimer);
    }, [appState]);

    const handleStartResearch = () => {
        setAppState('countdown');
        setCountdown(20);
        setAnalysisResult(null);
    };

    const handleDownload = () => {
        setDownloadStatus('downloading');
        setTimeout(() => {
            setDownloadStatus('downloaded');
            setTimeout(() => setDownloadStatus('idle'), 2000);
        }, 1500);
    };

    return (
        <div className="dashboard-container">
            <header>
                <div className="logo">
                    <i className="fas fa-microscope"></i>
                    <h1>Microplastic<span>Detector</span></h1>
                </div>
                <nav>
                    <ul>
                        <li><a href="#">Home</a></li>
                        <li><a href="#">Dashboard</a></li>
                        <li><a href="#">Analysis</a></li>
                        <li><a href="#">Reports</a></li>
                    </ul>
                </nav>
            </header>
            
            <div className="page-title">
                <h2>Microplastic Analysis Report</h2>
                <p>Start the research process to generate detailed analysis reports with contamination levels</p>
            </div>

            <div className="analysis-section">
                <div className="camera-box">
                    <h3><i className="fas fa-camera"></i> Capture Sample</h3>
                    <div className="camera-area">
                        {appState === 'idle' && (
                            <>
                                <i className="fas fa-flask"></i>
                                <p>Click the button below to start the research process</p>
                                <button className="btn-start-research" onClick={handleStartResearch}>Start Research</button>
                            </>
                        )}
                        {appState === 'countdown' && (
                            <div className="countdown">
                                Research in progress... {countdown} seconds remaining
                            </div>
                        )}
                        {(appState === 'analyzing' || appState === 'results') && (
                             <div className="image-preview">
                                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23333'/%3E%3Ccircle cx='200' cy='150' r='80' fill='%238a2be2'/%3E%3Ccircle cx='200' cy='150' r='50' fill='%239370db'/%3E%3Ccircle cx='200' cy='150' r='20' fill='%23fff'/%3E%3Ctext x='200' y='280' font-family='Arial' font-size='14' fill='white' text-anchor='middle'%3EMicroplastic Sample%3C/text%3E%3C/svg%3E" alt="Captured Sample" />
                                <div className="countdown">
                                    {appState === 'analyzing' ? 'Sample captured! Generating report...' : 'Analysis complete!'}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="report-box">
                    <h3><i className="fas fa-file-alt"></i> Analysis Report</h3>
                    <p>Detailed analysis of your water sample</p>
                    
                    <div className="report-content">
                        <div className="report-header">
                            <div className="report-id">Report ID: <span>MPA-2025-1082</span></div>
                            <div className="report-date">September 16, 2025</div>
                        </div>
                        
                        <div className="result-item">
                            <span className="result-label">Microplastic Count:</span>
                            <span className="result-value">{appState === 'analyzing' ? 'Analyzing...' : analysisResult?.particleCount || '-'}</span>
                        </div>
                        <div className="result-item">
                            <span className="result-label">Average Size:</span>
                            <span className="result-value">{appState === 'analyzing' ? 'Analyzing...' : analysisResult?.avgSize || '-'}</span>
                        </div>
                        <div className="result-item">
                            <span className="result-label">Contamination Level:</span>
                            <span className="result-value">{appState === 'analyzing' ? 'Analyzing...' : analysisResult?.contaminationLevel || '-'}</span>
                        </div>
                        <div className="result-item">
                            <span className="result-label">Dominant Polymer:</span>
                            <span className="result-value">{appState === 'analyzing' ? 'Analyzing...' : analysisResult?.polymerType || '-'}</span>
                        </div>
                        <div className="result-item">
                            <span className="result-label">Risk Assessment:</span>
                            <span className="result-value">
                                {appState === 'analyzing' ? 'Analyzing...' : analysisResult?.riskLevel || '-'}
                                {analysisResult?.riskLevel && (
                                    <span className={`risk-indicator risk-${analysisResult.riskLevel.toLowerCase()}`}>{analysisResult.riskLevel}</span>
                                )}
                            </span>
                        </div>
                        
                        <div className="chart-container">
                            <div className="chart-bar bar-1"></div>
                            <div className="chart-bar bar-2"></div>
                            <div className="chart-bar bar-3"></div>
                            <div className="chart-bar bar-4"></div>
                            <div className="chart-labels">
                                <span>PP</span><span>PE</span><span>PS</span><span>PVC</span>
                            </div>
                        </div>
                    </div>
                    
                    {appState === 'results' && (
                        <div className="action-buttons">
                            <button 
                                className="btn-download"
                                onClick={handleDownload}
                                disabled={downloadStatus !== 'idle'}
                                style={{ background: downloadStatus === 'downloaded' ? 'linear-gradient(to right, #28a745, #20c997)' : '' }}
                            >
                                {downloadStatus === 'idle' && <><i className="fas fa-download"></i> Download Report</>}
                                {downloadStatus === 'downloading' && <><i className="fas fa-spinner fa-spin"></i> Generating...</>}
                                {downloadStatus === 'downloaded' && <><i className="fas fa-check"></i> Complete!</>}
                            </button>
                            <button className="btn-share"><i className="fas fa-share-alt"></i> Share Results</button>
                        </div>
                    )}
                </div>
            </div>

            <div className="research-animation">
                <h3><i className="fas fa-flask"></i> Research in Progress</h3>
                <div className="animation-container">
                    <ResearchParticles />
                    <div className="microscope"><i className="fas fa-microscope"></i></div>
                </div>
                <p className="research-text">Simulating particle analysis and generating detailed report...</p>
            </div>
            
            <footer>
                <p>© 2025 Microplastic Detector. All rights reserved. Advancing environmental protection through innovation.</p>
            </footer>
        </div>
    );
};

export default Home;