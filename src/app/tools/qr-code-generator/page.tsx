"use client";

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { QrCode, Download } from 'lucide-react';
import { Label } from '@/components/ui/label';

export default function QRCodeGeneratorPage() {
  const [data, setData] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateQrCode = () => {
    if (!data.trim()) {
      setQrCodeUrl('');
      return;
    }
    setIsLoading(true);
    // Using an external API for QR code generation
    const encodedData = encodeURIComponent(data);
    const newQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedData}&format=png&qzone=1&margin=10`;
    setQrCodeUrl(newQrCodeUrl);
    // No need to setIsLoading(false) here if Image onload handles it, but for simplicity:
    // Simulate loading time for visual feedback
    setTimeout(() => setIsLoading(false), 500); 
  };

  const handleDownload = () => {
    if (!qrCodeUrl) return;
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = 'qrcode.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <QrCode className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl font-semibold text-foreground">QR Code Generator</h1>
      </div>
      <p className="text-muted-foreground mb-6">
        Enter any text or URL below to generate a QR code instantly.
      </p>
      
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <Card className="rounded-lg shadow-sm">
          <CardHeader>
            <CardTitle>Input Data</CardTitle>
            <CardDescription>Enter the text or URL you want to encode.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="qr-data-input" className="mb-2 block text-sm font-medium">Text or URL</Label>
              <Input
                id="qr-data-input"
                type="text"
                placeholder="e.g., https://example.com or Your Text"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="text-base"
              />
            </div>
            <Button onClick={generateQrCode} className="w-full" disabled={isLoading || !data.trim()}>
              {isLoading ? 'Generating...' : 'Generate QR Code'}
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-lg shadow-sm">
          <CardHeader>
            <CardTitle>Generated QR Code</CardTitle>
            <CardDescription>Your QR code will appear below.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center min-h-[300px]">
            {qrCodeUrl ? (
              <div className="relative w-[250px] h-[250px] border p-2 rounded-md bg-white">
                <Image
                  src={qrCodeUrl}
                  alt="Generated QR Code"
                  layout="fill"
                  objectFit="contain"
                  onLoad={() => setIsLoading(false)}
                  onError={() => {
                    setIsLoading(false);
                    setQrCodeUrl(''); // Clear URL on error
                    // Optionally, show an error message to the user
                  }}
                />
              </div>
            ) : (
              <div className="w-[250px] h-[250px] border border-dashed rounded-md flex items-center justify-center bg-muted/30">
                <p className="text-muted-foreground text-center">
                  {isLoading ? "Loading QR Code..." : "QR code will be displayed here."}
                </p>
              </div>
            )}
            {qrCodeUrl && (
              <Button onClick={handleDownload} variant="outline" className="mt-6 w-full max-w-xs">
                <Download className="mr-2 h-4 w-4" />
                Download PNG
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
