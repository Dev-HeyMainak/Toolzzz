"use client";

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';

const CircleImageCropper = () => {
  const [image, setImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCrop = () => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      const size = Math.min(img.width, img.height);
      canvas.width = size;
      canvas.height = size;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw a circle mask
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, size / 2, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.clip();

      // Draw the image
      ctx.drawImage(img, (size - img.width) / 2, (size - img.height) / 2);
    };
    img.src = image;
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'cropped-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Circle Image Cropper</h1>
      <input type="file" accept="image/*" onChange={handleImageUpload} className="mb-4" />
      {image && (
        <>
          <canvas ref={canvasRef} width={0} height={0} className="border border-gray-300 rounded-md mb-4" />
          <div className="flex gap-4">
            <Button onClick={handleCrop}>Crop to Circle</Button>
            <Button onClick={handleDownload}>Download</Button>
          </div>
        </>
      )}
    </div>
  );
};

export default CircleImageCropper;
