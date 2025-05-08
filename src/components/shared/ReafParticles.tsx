import React from 'react';

const ReafParticles: React.FC = () => {
  return (
    <div className="leaf">
      <ul>
        {Array.from({ length: 9 }).map((_, index) => (
          <li key={index}></li>
        ))}
      </ul>
    </div>
  );
};

export default ReafParticles;
