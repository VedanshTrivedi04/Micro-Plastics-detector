import React, { useState, useEffect } from 'react';

const Particles = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const particleCount = 30;
    const newParticles = [];
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        size: Math.random() * 10 + 2,
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

export default Particles;