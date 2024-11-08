import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Icon3D = ({ icon, size = "text-[150px]", gradient = false }) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const iconRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const padding = window.innerWidth * 0.2;

      if (
        e.clientX >= rect.left - padding &&
        e.clientX <= rect.right + padding &&
        e.clientY >= rect.top - padding &&
        e.clientY <= rect.bottom + padding
      ) {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = (e.clientX - centerX) / (rect.width + padding);
        const deltaY = (e.clientY - centerY) / (rect.height + padding);

        // Reduced the rotation range to 45 degrees
        const rotateX = Math.max(Math.min(deltaY * -45, 45), -45);
        const rotateY = Math.max(Math.min(deltaX * 45, 45), -45);

        // Increased the smoothing factor for smoother movements
        setRotation({
          x: rotateX * (1 - Math.abs(deltaX) * 0.3),
          y: rotateY * (1 - Math.abs(deltaY) * 0.3)
        });
      } else {
        setRotation(prev => ({
          x: prev.x * 0.92,
          y: prev.y * 0.92
        }));
      }
    };

    const handleMouseLeave = () => {
      const returnToCenter = () => {
        setRotation(prev => ({
          x: prev.x * 0.92,
          y: prev.y * 0.92
        }));

        if (Math.abs(rotation.x) > 0.1 || Math.abs(rotation.y) > 0.1) {
          requestAnimationFrame(returnToCenter);
        } else {
          setRotation({ x: 0, y: 0 });
        }
      };

      returnToCenter();
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative p-12 inline-block ${size} hover:cursor-pointer`}
      style={{
        perspective: '800px', // Increased for a more subtle effect
      }}
    >
      <div
        ref={iconRef}
        className="transition-transform duration-200 ease-out" // Increased duration for smoother animations
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transformStyle: 'preserve-3d'
        }}
      >
        <FontAwesomeIcon
          icon={icon}
          className={`transform transition-all duration-200 ${gradient ? 'bg-gradient-to-r from-[#346995] to-[#4582b0] bg-clip-text text-transparent' : 'text-[#346995]'}`}
          style={{
            // More subtle shadow
            filter: `drop-shadow(${-rotation.y * 0.8}px ${-rotation.x * 0.8}px 12px rgba(0,0,0,0.25))`
          }}
        />
      </div>
    </div>
  );
};

export default Icon3D;