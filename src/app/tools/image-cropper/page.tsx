
"use client";

import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Crop, UploadCloud, Download, XCircle, Scan } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function ImageCropperPage() {
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [originalPreviewUrl, setOriginalPreviewUrl] = useState<string | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number } | null>(null);
  
  const [cropX, setCropX] = useState<string>('0');
  const [cropY, setCropY] = useState<string>('0');
  const [cropWidth, setCropWidth] = useState<string>('');
  const [cropHeight, setCropHeight] = useState<string>('');
  
  const [croppedPreviewUrl, setCroppedPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null); // For displaying the image to give context for cropping
  const { toast } = useToast();

  useEffect(() => {
    return () => { // Cleanup preview URLs
      if (originalPreviewUrl) URL.revokeObjectURL(originalPreviewUrl);
      if (croppedPreviewUrl) URL.revokeObjectURL(croppedPreviewUrl);
    };
  }, [originalPreviewUrl, croppedPreviewUrl]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({ title: "Invalid File", description: "Please select an image file.", variant: "destructive" });
        return;
      }
       if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({ title: "File Too Large", description: "Image size should be less than 10MB.", variant: "destructive" });
        return;
      }
      setOriginalImage(file);
      const previewUrl = URL.createObjectURL(file);
      setOriginalPreviewUrl(previewUrl);
      setCroppedPreviewUrl(null);

      const img = new window.Image();
      img.onload = () => {
        setOriginalDimensions({ width: img.width, height: img.height });
        setCropWidth(img.width.toString()); // Default crop to full image
        setCropHeight(img.height.toString());
        setCropX('0');
        setCropY('0');
      };
      img.src = previewUrl;
    }
  };

  const handleCrop = async () => {
    if (!originalImage || !canvasRef.current || !originalDimensions) {
      toast({ title: "No Image", description: "Please upload an image first.", variant: "default" });
      return;
    }
    const x = parseInt(cropX, 10);
    const y = parseInt(cropY, 10);
    const width = parseInt(cropWidth, 10);
    const height = parseInt(cropHeight, 10);

    if (isNaN(x) || isNaN(y) || isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
      toast({ title: "Invalid Dimensions", description: "Please enter valid positive numbers for all crop parameters.", variant: "destructive" });
      return;
    }
    if (x < 0 || y < 0 || x + width > originalDimensions.width || y + height > originalDimensions.height) {
      toast({ title: "Crop Out of Bounds", description: "Crop area is outside the image boundaries.", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    toast({ title: "Processing...", description: "Cropping your image." });

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
     if (!ctx) {
        toast({ title: "Error", description: "Could not get canvas context.", variant: "destructive"});
        setIsProcessing(false);
        return;
    }

    const img = new window.Image();
    img.onload = () => {
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, x, y, width, height, 0, 0, width, height);
      const dataUrl = canvas.toDataURL(originalImage.type);
      setCroppedPreviewUrl(dataUrl);
      setIsProcessing(false);
      toast({ title: "Cropped!", description: "Image cropped. You can now download it." });
    };
    img.onerror = () => {
        toast({ title: "Error", description: "Could not load the image for cropping.", variant: "destructive"});
        setIsProcessing(false);
    }
    img.src = originalPreviewUrl!;
  };

  const handleDownload = () => {
    if (!croppedPreviewUrl || !originalImage) return;
    const link = document.createElement('a');
    const fileExtension = originalImage.name.split('.').pop() || 'png';
    link.download = `cropped-${originalImage.name.replace(/\.[^/.]+$/, "")}.${fileExtension}`;
    link.href = croppedPreviewUrl;
    link.click();
  };
  
  const handleClear = () => {
    setOriginalImage(null);
    setOriginalPreviewUrl(null);
    setOriginalDimensions(null);
    setCropX('0'); setCropY('0'); setCropWidth(''); setCropHeight('');
    setCroppedPreviewUrl(null);
    const fileInput = document.getElementById('cropImageUpload') as HTMLInputElement;
    if(fileInput) fileInput.value = '';
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <Crop className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl font-semibold text-foreground">Image Cropper</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Upload an image, define the crop area by coordinates and dimensions, then download the result.
      </p>

      <Card className="mb-6 rounded-lg shadow-sm">
        <CardHeader><CardTitle>Upload Image</CardTitle></CardHeader>
        <CardContent>
           <Label htmlFor="cropImageUpload" className="mb-2 block text-lg font-medium text-center cursor-pointer p-6 border-2 border-dashed rounded-lg hover:border-primary transition-colors">
            <UploadCloud className="h-12 w-12 mx-auto text-primary mb-2" />
            Click or Drag & Drop Image
          </Label>
          <Input id="cropImageUpload" type="file" accept="image/*" onChange={handleFileChange} className="hidden" aria-label="Upload image for cropping" />
        </CardContent>
      </Card>

      {originalPreviewUrl && (
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card className="rounded-lg shadow-sm">
            <CardHeader><CardTitle>Original Image</CardTitle></CardHeader>
            <CardContent className="flex justify-center items-center p-2 bg-muted/10">
              <div className="relative max-w-full max-h-[400px] overflow-auto">
                {/* Using Next/Image for optimized preview */}
                <Image ref={imageRef} src={originalPreviewUrl} alt="Original to crop" width={originalDimensions?.width || 400} height={originalDimensions?.height || 300} objectFit="contain" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-lg shadow-sm">
            <CardHeader>
              <CardTitle>Crop Parameters</CardTitle>
              <CardDescription>All values are in pixels (px).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><Label htmlFor="cropX">X (from left)</Label><Input id="cropX" type="number" value={cropX} onChange={(e) => setCropX(e.target.value)} placeholder="0" /></div>
                <div><Label htmlFor="cropY">Y (from top)</Label><Input id="cropY" type="number" value={cropY} onChange={(e) => setCropY(e.target.value)} placeholder="0" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label htmlFor="cropWidth">Width</Label><Input id="cropWidth" type="number" value={cropWidth} onChange={(e) => setCropWidth(e.target.value)} placeholder={`${originalDimensions?.width || 'auto'}`} /></div>
                <div><Label htmlFor="cropHeight">Height</Label><Input id="cropHeight" type="number" value={cropHeight} onChange={(e) => setCropHeight(e.target.value)} placeholder={`${originalDimensions?.height || 'auto'}`} /></div>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                    <Button onClick={handleCrop} disabled={isProcessing || !originalImage} className="w-full mt-2">
                        <Scan className={`mr-2 h-4 w-4 ${isProcessing ? 'animate-spin' : ''}`} />
                        {isProcessing ? 'Cropping...' : 'Apply Crop & Preview'}
                    </Button>
                </TooltipTrigger>
                <TooltipContent><p>Crop the image based on the specified parameters and show a preview.</p></TooltipContent>
              </Tooltip>
            </CardContent>
          </Card>
        </div>
      )}
      
      {croppedPreviewUrl && (
        <Card className="mb-6 rounded-lg shadow-sm">
          <CardHeader><CardTitle>Cropped Preview</CardTitle></CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <div className="border rounded-md p-2 bg-muted/20 max-w-full overflow-auto">
              <Image src={croppedPreviewUrl} alt="Cropped preview" width={parseInt(cropWidth) || 200} height={parseInt(cropHeight) || 150} objectFit="contain" />
            </div>
            <canvas ref={canvasRef} className="hidden" aria-hidden="true"></canvas> {/* Hidden canvas for processing */}
             <Tooltip>
                <TooltipTrigger asChild>
                    <Button onClick={handleDownload} size="lg">
                        <Download className="mr-2 h-5 w-5" /> Download Cropped Image
                    </Button>
                </TooltipTrigger>
                <TooltipContent><p>Save the cropped image to your device.</p></TooltipContent>
            </Tooltip>
          </CardContent>
        </Card>
      )}

       {originalImage && 
         <Tooltip>
            <TooltipTrigger asChild>
                <Button variant="outline" onClick={handleClear}>
                    <XCircle className="mr-2 h-4 w-4"/> Clear Image & Settings
                </Button>
            </TooltipTrigger>
            <TooltipContent><p>Remove the current image and reset all crop settings.</p></TooltipContent>
        </Tooltip>
       }
       {!originalImage && (
         <p className="text-muted-foreground text-center mt-8">Upload an image to start cropping.</p>
       )}
    </div>
  );
}
