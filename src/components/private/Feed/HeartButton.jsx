import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';

import React, { useState } from 'react';

const HeartButton = () => {
  const [isLiked, setIsLiked] = useState(false);

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  return (
    <button
      className={`transition-transform duration-300 ${isLiked ? 'text-red-500 scale-125' : 'text-gray-400 scale-100'
        }`}
      onClick={toggleLike}
    >
      <FontAwesomeIcon
        icon={isLiked ? faHeartSolid : faHeartRegular}
        size="2x"
      />
    </button>
  );
};

export default HeartButton;