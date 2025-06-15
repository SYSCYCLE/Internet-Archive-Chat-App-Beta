import React, { useState } from 'react';

export default function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [message, setMessage] = useState('');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setUploadStatus('');
    setMessage('');
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Lütfen önce bir dosya seçin.');
      return;
    }

    setUploadStatus('Yükleniyor...');
    setMessage('');

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('http://localhost:3001/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setUploadStatus('Başarılı!');
        setMessage(`Dosya başarıyla yüklendi: ${data.url}`);
        setSelectedFile(null);
      } else {
        const errorData = await response.json();
        setUploadStatus('Başarısız!');
        setMessage(`Yükleme hatası: ${errorData.message || 'Bilinmeyen bir hata oluştu.'}`);
      }
    } catch (error) {
      console.error('Dosya yükleme sırasında hata oluştu:', error);
      setUploadStatus('Başarısız!');
      setMessage(`Ağ hatası veya sunucuya bağlanılamadı: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Internet Archive'a Dosya Yükle
        </h1>

        <div className="mb-6">
          <label
            htmlFor="file-upload"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Dosya Seçin:
          </label>
          <input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {selectedFile && (
            <p className="mt-2 text-sm text-gray-600">
              Seçilen dosya: <span className="font-semibold">{selectedFile.name}</span>
            </p>
          )}
        </div>

        <button
          onClick={handleUpload}
          disabled={!selectedFile || uploadStatus === 'Yükleniyor...'}
          className={`w-full py-3 px-4 rounded-xl text-white font-semibold shadow-md transition duration-300 ease-in-out
            ${!selectedFile || uploadStatus === 'Yükleniyor...'
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            }`}
        >
          {uploadStatus === 'Yükleniyor...' ? 'Yükleniyor...' : 'Dosyayı Yükle'}
        </button>

        {uploadStatus && (
          <p
            className={`mt-4 text-center font-medium ${
              uploadStatus === 'Başarılı!' ? 'text-green-600' :
              uploadStatus === 'Başarısız!' ? 'text-red-600' : 'text-blue-600'
            }`}
          >
            Durum: {uploadStatus}
          </p>
        )}

        {message && (
          <p className="mt-2 text-center text-sm text-gray-700">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
