import React, { useState, useEffect, useRef } from 'react';
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
    // New: backend interaction state
    const [latestImageUrl, setLatestImageUrl] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const API_BASE = 'http://127.0.0.1:8000';
    const UPLOAD_ENDPOINT = `${API_BASE}/api/v1/upload/`;
    const IMAGES_ENDPOINT = `${API_BASE}/api/v1/images/`;

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

    // Effect to handle the analysis simulation (fake data)
    useEffect(() => {
        if (appState !== 'analyzing') return;

        const analysisTimer = setTimeout(() => {
            // Deterministic-looking fake values
            const now = new Date();
            const seed = now.getMinutes();
            const particleCount = 180 + (seed % 120); // 180-299
            const avgSize = (3.2 + (seed % 8) * 0.2).toFixed(1); // ~3.2-4.8
            const contaminationLevels = ['Low', 'Moderate', 'High'];
            const polymers = ['Polyethylene', 'Polypropylene', 'Polystyrene', 'PVC'];
            const riskLevels = ['Low', 'Medium', 'High'];
            const riskLevel = riskLevels[(seed % riskLevels.length)];

            // Create a fake polymer distribution that sums to 100
            const base = [40, 25, 20, 15];
            const rotateBy = seed % 4;
            const rotated = base.map((_, i) => base[(i + rotateBy) % base.length]);
            const total = rotated.reduce((a, b) => a + b, 0);
            const distribution = {
                PP: Math.round((rotated[0] / total) * 100),
                PE: Math.round((rotated[1] / total) * 100),
                PS: Math.round((rotated[2] / total) * 100),
                PVC: Math.max(0, 100 - (
                    Math.round((rotated[0] / total) * 100) +
                    Math.round((rotated[1] / total) * 100) +
                    Math.round((rotated[2] / total) * 100)
                )), // ensure total ~100
            };

            setAnalysisResult({
                particleCount: `${particleCount} particles/L`,
                avgSize: `${avgSize} μm`,
                contaminationLevel: contaminationLevels[(seed % contaminationLevels.length)],
                polymerType: polymers[(seed % polymers.length)],
                riskLevel: riskLevel,
                distribution,
            });
            setAppState('results');
        }, 3000); // Simulate 3 seconds of analysis

        return () => clearTimeout(analysisTimer);
    }, [appState]);

    const getLatestImageFromResponse = (data) => {
        if (!data) return null;
        // data may be an array or an object with results
        const items = Array.isArray(data) ? data : (data.results || data.images || []);
        if (!items || items.length === 0) return null;
        const latest = items[0];
        // try common keys
        return (
            latest.image_url ||
            latest.image ||
            latest.url ||
            latest.file ||
            null
        );
    };

    const fetchLatestImage = async () => {
        try {
            const response = await fetch(IMAGES_ENDPOINT, { credentials: 'include' });
            if (!response.ok) throw new Error(`Images fetch failed: ${response.status}`);
            const data = await response.json();
            const url = getLatestImageFromResponse(data);
            if (url) setLatestImageUrl(url.startsWith('http') ? url : `${API_BASE}${url}`);
            return !!url;
        } catch (err) {
            setErrorMessage(err.message);
            return false;
        }
    };

    const pollForImage = async (timeoutMs = 20000, intervalMs = 1500) => {
        const start = Date.now();
        while (Date.now() - start < timeoutMs) {
            const found = await fetchLatestImage();
            if (found) return true;
            await new Promise(r => setTimeout(r, intervalMs));
        }
        return false;
    };

    const handleStartResearch = async () => {
        setAppState('countdown');
        setCountdown(20);
        setAnalysisResult(null);
        setLatestImageUrl(null);
        setErrorMessage('');
        setIsUploading(true);

        // Kick off backend capture/upload on the server/RPi
        try {
            const response = await fetch(UPLOAD_ENDPOINT, {
                method: 'POST',
                headers: { 'Accept': 'application/json' },
                credentials: 'include',
            });
            if (!response.ok) throw new Error(`Upload failed: ${response.status}`);
        } catch (err) {
            setErrorMessage(err.message);
        } finally {
            setIsUploading(false);
        }

        // Start polling for the new image while countdown runs
        pollForImage();
    };

    const reportRef = useRef(null);

    const handleDownload = async () => {
        setDownloadStatus('downloading');
        try {
            const { jsPDF } = await import('jspdf');

            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            // Colors
            const primary = [138, 43, 226]; // #8a2be2
            const textDark = [33, 37, 41];
            const muted = [108, 117, 125];

            // Header
            pdf.setFillColor(245, 245, 248);
            pdf.rect(0, 0, pageWidth, 30, 'F');
            pdf.setTextColor(primary[0], primary[1], primary[2]);
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(18);
            pdf.text('Microplastic Analysis Report', 15, 20);

            // Meta
            pdf.setTextColor(muted[0], muted[1], muted[2]);
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(10);
            const createdAt = new Date().toLocaleString();
            pdf.text(`Generated: ${createdAt}`, 15, 28);

            // Divider
            pdf.setDrawColor(230, 230, 235);
            pdf.line(15, 35, pageWidth - 15, 35);

            let y = 45;

            // Optional sample image (left block)
            if (latestImageUrl) {
                try {
                    // Load image as data URL
                    const blob = await fetch(latestImageUrl, { mode: 'cors' }).then(r => r.blob());
                    const reader = await new Promise((resolve, reject) => {
                        const fr = new FileReader();
                        fr.onerror = reject;
                        fr.onload = () => resolve(fr.result);
                        fr.readAsDataURL(blob);
                    });

                    const imgX = 15;
                    const imgY = y;
                    const imgW = 80;
                    const imgH = 60;
                    pdf.setDrawColor(235, 235, 240);
                    pdf.rect(imgX - 1, imgY - 1, imgW + 2, imgH + 2);
                    pdf.addImage(reader, 'JPEG', imgX, imgY, imgW, imgH, undefined, 'FAST');
                } catch (_) {
                    // ignore image errors, continue with report
                }
            }

            // Analysis fields (right block)
            const rightX = latestImageUrl ? 105 : 15;
            const label = (t, yy) => {
                pdf.setFontSize(10);
                pdf.setTextColor(muted[0], muted[1], muted[2]);
                pdf.text(t, rightX, yy);
            };
            const value = (t, yy) => {
                pdf.setFontSize(12);
                pdf.setTextColor(primary[0], primary[1], primary[2]);
                pdf.setFont('helvetica', 'bold');
                pdf.text(t, rightX, yy);
                pdf.setFont('helvetica', 'normal');
            };

            const rows = [
                ['Microplastic Count', analysisResult?.particleCount || '-'],
                ['Average Size', analysisResult?.avgSize || '-'],
                ['Contamination Level', analysisResult?.contaminationLevel || '-'],
                ['Dominant Polymer', analysisResult?.polymerType || '-'],
                ['Risk Assessment', analysisResult?.riskLevel || '-']
            ];

            let ry = y;
            for (const [k, v] of rows) {
                label(k, ry);
                value(v, ry + 6);
                ry += 16;
            }

            // Simple bar chart (polymers) at bottom
            const chartTop = Math.max(y + 65, ry + 6);
            const chartLeft = 15;
            const chartWidth = pageWidth - 30;
            const chartHeight = 50;
            pdf.setDrawColor(235, 235, 240);
            pdf.rect(chartLeft, chartTop, chartWidth, chartHeight);

            const dist = analysisResult?.distribution || { PP: 30, PE: 20, PS: 35, PVC: 15 };
            const bars = [
                { label: 'PP', h: Math.round((dist.PP || 0) * 0.45) },
                { label: 'PE', h: Math.round((dist.PE || 0) * 0.45) },
                { label: 'PS', h: Math.round((dist.PS || 0) * 0.45) },
                { label: 'PVC', h: Math.round((dist.PVC || 0) * 0.45) }
            ];
            const gap = 12;
            const barW = (chartWidth - gap * (bars.length + 1)) / bars.length;
            let bx = chartLeft + gap;
            for (const b of bars) {
                const bh = b.h;
                const by = chartTop + chartHeight - bh - 8;
                pdf.setFillColor(230, 220, 245);
                pdf.rect(bx, by, barW, bh, 'F');
                pdf.setTextColor(muted[0], muted[1], muted[2]);
                pdf.setFontSize(9);
                pdf.text(b.label, bx + barW / 2, chartTop + chartHeight - 2, { align: 'center' });
                bx += barW + gap;
            }

            // Footer
            pdf.setFontSize(9);
            pdf.setTextColor(muted[0], muted[1], muted[2]);
            pdf.text('© 2025 Microplastic Detector', 15, pageHeight - 10);

            const fileName = `Microplastic_Report_${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.pdf`;
            pdf.save(fileName);

            setDownloadStatus('downloaded');
            setTimeout(() => setDownloadStatus('idle'), 1500);
        } catch (err) {
            setErrorMessage(err.message || 'Failed to generate PDF');
            setDownloadStatus('idle');
        }
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
                        {appState === 'idle' && latestImageUrl && (
                            <div className="image-preview" style={{ marginTop: '12px' }}>
                                <img src={latestImageUrl} alt="Latest Sample" />
                            </div>
                        )}
                        {(appState === 'analyzing' || appState === 'results') && (
                             <div className="image-preview">
                                {latestImageUrl ? (
                                    <img src={latestImageUrl} alt="Captured Sample" />
                                ) : (
                                    <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23333'/%3E%3Ccircle cx='200' cy='150' r='80' fill='%238a2be2'/%3E%3Ccircle cx='200' cy='150' r='50' fill='%239370db'/%3E%3Ccircle cx='200' cy='150' r='20' fill='%23fff'/%3E%3Ctext x='200' y='280' font-family='Arial' font-size='14' fill='white' text-anchor='middle'%3EWaiting for image...%3C/text%3E%3C/svg%3E" alt="Waiting for sample" />
                                )}
                                <div className="countdown">
                                    {isUploading ? 'Requesting capture...' : appState === 'analyzing' ? 'Sample captured! Generating report...' : 'Analysis complete!'}
                                </div>
                                {errorMessage && (
                                    <div style={{ marginTop: '8px', color: '#dc3545', fontWeight: 600 }}>{errorMessage}</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="report-box" ref={reportRef}>
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
                            {/* Dynamic heights based on analysisResult.distribution (values in %) */}
                            <div
                                className="chart-bar bar-1"
                                style={{ height: `${Math.min(95, Math.max(5, (analysisResult?.distribution?.PP || 0)))}%` }}
                                title={`PP: ${analysisResult?.distribution?.PP || 0}%`}
                            ></div>
                            <div
                                className="chart-bar bar-2"
                                style={{ height: `${Math.min(95, Math.max(5, (analysisResult?.distribution?.PE || 0)))}%` }}
                                title={`PE: ${analysisResult?.distribution?.PE || 0}%`}
                            ></div>
                            <div
                                className="chart-bar bar-3"
                                style={{ height: `${Math.min(95, Math.max(5, (analysisResult?.distribution?.PS || 0)))}%` }}
                                title={`PS: ${analysisResult?.distribution?.PS || 0}%`}
                            ></div>
                            <div
                                className="chart-bar bar-4"
                                style={{ height: `${Math.min(95, Math.max(5, (analysisResult?.distribution?.PVC || 0)))}%` }}
                                title={`PVC: ${analysisResult?.distribution?.PVC || 0}%`}
                            ></div>
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