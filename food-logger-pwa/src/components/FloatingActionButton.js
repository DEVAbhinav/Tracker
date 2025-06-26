import React from 'react';

const FloatingActionButton = ({ onClick, style, children }) => {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: '50%',
        background: '#1976d2',
        color: '#fff',
        border: 'none',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        fontSize: 32,
        cursor: 'pointer',
        zIndex: 1000,
        ...style
      }}
      aria-label="Floating Action Button"
    >
      {children || '+'}
    </button>
  );
};

export default FloatingActionButton;
