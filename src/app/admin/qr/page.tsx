"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const QRCodeCanvas = dynamic(() => import('@/components/QRCodeCanvas'), {
    ssr: false,
    loading: () => <div className="w-[300px] h-[300px] bg-gray-100 animate-pulse rounded-lg" />
});

export default function QRGenerator() {
    const [url, setUrl] = useState('');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setMounted(true);
            if (typeof window !== 'undefined') {
                setUrl(window.location.origin);
            }
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    const handlePrint = () => {
        window.print();
    };

    if (!mounted || !url) return <div className="p-8 flex items-center justify-center min-h-screen">Loading...</div>;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center max-w-md w-full print:shadow-none print:w-full print:max-w-none print:p-0">
                <h1 className="text-2xl font-bold mb-6 text-gray-800 print:hidden">Wedding Album QR</h1>

                <div className="mb-6 p-4 border-2 border-gray-100 rounded-lg print:border-none print:p-0">
                    <QRCodeCanvas text={url} />
                </div>

                <p className="text-gray-500 text-sm mb-6 text-center font-mono break-all print:text-black">
                    {url}
                </p>

                <button
                    onClick={handlePrint}
                    className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors print:hidden"
                >
                    Print QR Code
                </button>

                <div className="hidden print:block text-center mt-8">
                    <h2 className="text-3xl font-serif mb-2">Capture the Moment</h2>
                    <p className="text-gray-600">Scan to view and share photos</p>
                </div>
            </div>

            <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .bg-white, .bg-white * {
            visibility: visible;
          }
          .bg-white {
            position: absolute;
            left: 50%;
            top: 40%; /* Slightly higher to fit text below */
            transform: translate(-50%, -50%);
            box-shadow: none !important;
            width: 100% !important;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      `}</style>
        </div>
    );
}
