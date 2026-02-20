"use client";

import { QRCodeCanvas as QR } from 'qrcode.react';

interface QRCodeCanvasProps {
    text: string;
}

export default function QRCodeCanvas({ text }: QRCodeCanvasProps) {
    if (!text) return null;

    return (
        <QR
            value={text}
            size={300}
            level={"M"}
            includeMargin={true}
        />
    );
}
