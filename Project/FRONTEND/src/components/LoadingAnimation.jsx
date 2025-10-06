import React from 'react';
import '../styles/LoadingAnimation.css';

/**
 * LoadingAnimation component using GIF animation
 * 
 * @param {Object} props - Component props
 * @param {string} props.size - Size of the animation: 'small', 'medium', 'large' (default: 'medium')
 * @param {string} props.text - Optional text to display below the animation
 * @param {boolean} props.fullPage - Whether to display the animation as a full-page overlay
 * @returns {JSX.Element} The Loading Animation component
 */
const LoadingAnimation = ({ 
  size = 'medium', 
  text, 
  fullPage = false 
}) => {
  // Define size classes for the animation gif
  const sizeClass = size === 'small' ? 'animation-small' : 
                    size === 'large' ? 'animation-large' : 
                    'animation-medium';

  const animationContent = (
    <>
      <div className={`animation-container ${sizeClass}`}>
        <img src="/templates/loading_animation.gif" alt="Loading..." className="animation-gif" />
      </div>
      {text && <p className="loading-text">{text}</p>}
    </>
  );

  if (fullPage) {
    return (
      <div className="loading-overlay">
        <div className="loading-container">
          {animationContent}
        </div>
      </div>
    );
  }

  return <div className="loading-container">{animationContent}</div>;
};

export default LoadingAnimation; 