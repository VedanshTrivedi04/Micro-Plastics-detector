import React, { useState, useRef } from 'react';

const Home = () => {
    // State to manage the overall workflow of the app
    // The 'streaming' state is no longer needed
    const [appState, setAppState] = useState('idle'); // idle | captured | analyzing | results
    const [capturedImage, setCapturedImage] = useState(null);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [downloadStatus, setDownloadStatus] = useState('idle');

    // Ref for the hidden file input element
    const fileInputRef = useRef(null);

    // This function handles the file selection
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCapturedImage(reader.result);
                setAppState('captured');
            };
            reader.readAsDataURL(file);
        }
    };

    // This function is triggered when the "Upload Image" button is clicked
    const handleUploadClick = () => {
        fileInputRef.current.click();
    };
    
    // Resets the state to allow for a new upload
    const handleRetake = () => {
        setCapturedImage(null);
        setAnalysisResult(null);
        setAppState('idle');
        // Reset the file input value so the user can upload the same file again
        if(fileInputRef.current) {
            fileInputRef.current.value = null;
        }
    };

    const simulateAnalysis = () => {
        setAppState('analyzing');
        setTimeout(() => {
            // Generate random results
            const particleCount = Math.floor(Math.random() * 300) + 50;
            const avgSize = (Math.random() * 10 + 1).toFixed(1);
            const contaminationLevels = ['Low', 'Moderate', 'High', 'Severe'];
            const polymers = ['Polyethylene', 'Polypropylene', 'Polystyrene', 'PVC', 'PET'];
            
            setAnalysisResult({
                particleCount: `${particleCount} particles/L`,
                avgSize: `${avgSize} μm`,
                contaminationLevel: contaminationLevels[Math.floor(Math.random() * contaminationLevels.length)],
                polymerType: polymers[Math.floor(Math.random() * polymers.length)],
            });
            setAppState('results');
        }, 2000);
    };

    const handleDownload = () => {
        setDownloadStatus('downloading');
        setTimeout(() => {
            setDownloadStatus('downloaded');
            setTimeout(() => setDownloadStatus('idle'), 2000);
        }, 1000);
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
                        <li><a href="#">History</a></li>
                        <li><a href="#">Settings</a></li>
                    </ul>
                </nav>
            </header>
            
            <section className="hero">
                <h2>Detect Microplastics in Water Samples</h2>
                <p>Upload your captured water sample images for analysis and get detailed reports on microplastic contamination levels.</p>
            </section>

            <div className="upload-section">
                <div className="upload-box">
                    <h3><i className="fas fa-upload"></i> Upload Sample Image</h3>
                    <div className="camera-area">
                        {/* Hidden file input */}
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileChange}
                            accept="image/*"
                            style={{ display: 'none' }} 
                        />

                        {appState === 'idle' && (
                            <>
                                <i className="fas fa-cloud-upload-alt" style={{fontSize: '48px', color: '#8a2be2', marginBottom: '15px'}}></i>
                                <p>Click the button below to upload a sample image</p>
                                <button className="btn-capture" onClick={handleUploadClick}>
                                    Choose File
                                </button>
                            </>
                        )}
                        
                        {appState === 'captured' && capturedImage && (
                            <div className="image-preview" style={{ width: '100%' }}>
                                <img src={capturedImage} alt="Uploaded Sample" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px', display: 'block' }} />
                                <div className="camera-controls" style={{ display: 'flex', justifyContent: 'center' }}>
                                    <button className="btn-retake" onClick={handleRetake}>Choose New Image</button>
                                    <button className="btn-analyze" onClick={simulateAnalysis}>Analyze</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="result-box">
                    <h3><i className="fas fa-chart-line"></i> Analysis Results</h3>
                    {appState === 'idle' && <p>Results will appear here after image analysis</p>}
                    {appState === 'analyzing' && <p>Analyzing, please wait...</p>}
                    
                    {(appState === 'results' && analysisResult) && (
                        <>
                            <div className="result-content">
                                <div className="result-item">
                                    <span className="result-label">Microplastic Count:</span>
                                    <span className="result-value">{analysisResult.particleCount}</span>
                                </div>
                                <div className="result-item">
                                    <span className="result-label">Average Size:</span>
                                    <span className="result-value">{analysisResult.avgSize}</span>
                                </div>
                                <div className="result-item">
                                    <span className="result-label">Contamination Level:</span>
                                    <span className="result-value">{analysisResult.contaminationLevel}</span>
                                </div>
                                <div className="result-item">
                                    <span className="result-label">Dominant Polymer:</span>
                                    <span className="result-value">{analysisResult.polymerType}</span>
                                </div>
                            </div>
                            <button 
                                className="btn-download" 
                                onClick={handleDownload}
                                disabled={downloadStatus !== 'idle'}
                                style={{
                                    background: downloadStatus === 'downloaded' ? 'linear-gradient(to right, #28a745, #20c997)' : ''
                                }}
                            >
                                {downloadStatus === 'idle' && <><i className="fas fa-download"></i> Download PDF Report</>}
                                {downloadStatus === 'downloading' && <><i className="fas fa-spinner fa-spin"></i> Processing...</>}
                                {downloadStatus === 'downloaded' && <><i className="fas fa-check"></i> Report Downloaded!</>}
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="recent-scans">
                <h3><i className="fas fa-history"></i> Recent Scans</h3>
                <div className="scans-grid">
                     <div className="scan-item">
                        <div className="scan-image"><img src="https://placehold.co/200x150/333333/8a2be2?text=Sample+1" alt="Sample 1" /></div>
                        <div className="scan-details">
                            <div className="scan-date">2025-09-15</div>
                            <div className="scan-result">128 particles/L</div>
                        </div>
                    </div>
                     <div className="scan-item">
                        <div className="scan-image"><img src="https://placehold.co/200x150/333333/8a2be2?text=Sample+2" alt="Sample 2" /></div>
                        <div className="scan-details">
                            <div className="scan-date">2025-09-14</div>
                            <div className="scan-result">256 particles/L</div>
                        </div>
                    </div>
                     <div className="scan-item">
                        <div className="scan-image"><img src="https://placehold.co/200x150/333333/8a2be2?text=Sample+3" alt="Sample 3" /></div>
                        <div className="scan-details">
                            <div className="scan-date">2025-09-13</div>
                            <div className="scan-result">84 particles/L</div>
                        </div>
                    </div>
                     <div className="scan-item">
                        <div className="scan-image"><img src="https://placehold.co/200x150/333333/8a2be2?text=Sample+4" alt="Sample 4" /></div>
                        <div className="scan-details">
                            <div className="scan-date">2025-09-12</div>
                            <div className="scan-result">312 particles/L</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <footer>
                <p>© 2025 Microplastic Detector. All rights reserved. Advancing environmental protection through innovation.</p>
            </footer>
        </div>
    );
};

export default Home;