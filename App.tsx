import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import Loader from './components/Loader';
import { generateImageMontage } from './services/geminiService';

const App: React.FC = () => {
  const [image1, setImage1] = useState<string | null>(null);
  const [image2, setImage2] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const canGenerate = useMemo(() => {
    return image1 && image2 && prompt.trim().length > 0 && !isLoading;
  }, [image1, image2, prompt, isLoading]);

  const handleGenerate = async () => {
    if (!canGenerate || !image1 || !image2) return;

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const result = await generateImageMontage(image1, image2, prompt);
      setGeneratedImage(`data:image/png;base64,${result}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocorreu um erro desconhecido.');
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header />

        <main className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Input Section */}
          <div className="flex flex-col gap-6 p-6 bg-gray-800/50 rounded-2xl shadow-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <ImageUploader image={image1} setImage={setImage1} id="image1" title="Imagem Original 1" />
              <ImageUploader image={image2} setImage={setImage2} id="image2" title="Imagem Original 2" />
            </div>
            
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-indigo-300 mb-2">
                Comando
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="ex: Uma pintura surreal do tema da primeira imagem no estilo do artista da segunda imagem"
                className="w-full h-28 p-3 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 resize-none placeholder-gray-500"
                disabled={isLoading}
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={!canGenerate}
              className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-105 disabled:scale-100"
            >
              {isLoading ? 'Gerando...' : 'Gerar Montagem'}
            </button>
          </div>

          {/* Output Section */}
          <div className="flex flex-col items-center justify-center p-6 bg-gray-800/50 rounded-2xl shadow-lg min-h-[400px] lg:min-h-0">
            {isLoading && <Loader />}
            
            {error && !isLoading && (
              <div className="text-center text-red-400">
                <p className="font-bold">Falha na Geração</p>
                <p className="text-sm mt-2">{error}</p>
              </div>
            )}
            
            {!isLoading && !generatedImage && !error && (
              <div className="text-center text-gray-500">
                <p className="text-lg font-medium">Sua criação aparecerá aqui</p>
                <p className="mt-2">Carregue duas imagens e forneça um comando para começar.</p>
              </div>
            )}
            
            {generatedImage && !isLoading && (
              <div className="w-full flex flex-col items-center gap-4">
                <h3 className="text-xl font-semibold text-indigo-300">Resultado</h3>
                <img 
                  src={generatedImage} 
                  alt="Montagem gerada" 
                  className="max-w-full max-h-[500px] object-contain rounded-lg shadow-2xl" 
                />
                 <a
                    href={generatedImage}
                    download="montage.png"
                    className="mt-4 inline-block py-2 px-6 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500 transition-all duration-200"
                  >
                    Baixar Imagem
                  </a>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;