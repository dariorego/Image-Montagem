import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
        Criador de Montagem de Imagens
      </h1>
      <p className="mt-2 text-lg text-gray-400 max-w-2xl mx-auto">
        Misture duas imagens com o poder da IA. Carregue suas imagens, descreva a fusão e deixe o Gemini criar uma obra-prima única.
      </p>
    </header>
  );
};

export default Header;