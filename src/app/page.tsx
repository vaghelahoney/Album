'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';


const QRCodeCanvas = dynamic(() => import('@/components/QRCodeCanvas'), {
  ssr: false,
  loading: () => <div className="w-[300px] h-[300px] bg-gray-100 animate-pulse rounded-lg" />
});

export default function Home() {
  const [url, setUrl] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      setUrl('https://album-woad.vercel.app/gallery');
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted || !url) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
    </div>;
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">

      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl max-w-md w-full flex flex-col items-center">
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Welcome</h1>
        <p className="text-gray-500 mb-8">Scan to view our digital album</p>

        <div className="bg-white p-4 rounded-xl shadow-inner border border-gray-100 mb-8">
          <QRCodeCanvas text={url} />
        </div>

        <p className="text-sm text-gray-400 mb-6 font-mono break-all max-w-[80%]">
          {url}
        </p>


      </div>

      <footer className="mt-12 text-gray-400 text-sm">
        Digital Wedding Album
      </footer>
    </main>
  );
}
