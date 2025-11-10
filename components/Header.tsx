import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
        Image Montage Creator
      </h1>
      <p className="mt-2 text-lg text-gray-400 max-w-2xl mx-auto">
        Blend two images with the power of AI. Upload your images, describe the fusion, and let Gemini create a unique masterpiece.
      </p>
    </header>
  );
};

export default Header;