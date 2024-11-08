import React from 'react';

const InitialAvatar = ({ name, size = 40, fontSize = 20, backgroundColor = '#1e90ff', color = '#ffffff' }) => {
  const initial = name ? name.charAt(0).toUpperCase() : '?';

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        backgroundColor,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color,
        fontSize: `${fontSize}px`,
        fontWeight: 'bold',
      }}
    >
      {initial}
    </div>
  );
};

export default InitialAvatar;