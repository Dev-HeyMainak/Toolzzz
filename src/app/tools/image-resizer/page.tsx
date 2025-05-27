
"use client";

import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Maximize, UploadCloud, Download, XCircle, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function ImageResizerPage() {
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [originalPreviewUrl, setOriginalPreviewUrl] = useState<string | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number } | null>(null);
  
  const [targetWidth, setTargetWidth] = useState<string>('');
  const [targetHeight, setTargetHeight] = useState<string>('');
  const [keepAspectRatio, setKeepAspectRatio] = useState(true);
  
  const [resizedPreviewUrl, setResizedPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    return () => { // Cleanup preview URLs
      if (originalPreviewUrl) URL.revokeObjectURL(originalPreviewUrl);
      if (resizedPreviewUrl) URL.revokeObjectURL(resizedPreviewUrl);
    };
  }, [originalPreviewUrl, resizedPreviewUrl]);

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
      setResizedPreviewUrl(null); // Clear previous resized preview

      const img = new window.Image();
      img.onload = () => {
        setOriginalDimensions({ width: img.width, height: img.height });
        setTargetWidth(img.width.toString());
        setTargetHeight(img.height.toString());
      };
      img.src = previewUrl;
    }
  };

  const handleDimensionChange = (value: string, type: 'width' | 'height') => {
    const numValue = parseInt(value, 10);
    if (type === 'width') {
      setTargetWidth(value);
      if (keepAspectRatio && originalDimensions && numValue > 0) {
        const aspectRatio = originalDimensions.height / originalDimensions.width;
        setTargetHeight(Math.round(numValue * aspectRatio).toString());
      }
    } else {
      setTargetHeight(value);
      if (keepAspectRatio && originalDimensions && numValue > 0) {
        const aspectRatio = originalDimensions.width / originalDimensions.height;
        setTargetWidth(Math.round(numValue * aspectRatio).toString());
      }
    }
  };

  const handleResize = async () => {
    if (!originalImage || !canvasRef.current) {
      toast({ title: "No Image", description: "Please upload an image first.", variant: "default" });
      return;
    }
    const width = parseInt(targetWidth, 10);
    const height = parseInt(targetHeight, 10);

    if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
      toast({ title: "Invalid Dimensions", description: "Please enter valid positive numbers for width and height.", variant: "destructive" });
      return;
    }
    if (width > 8000 || height > 8000) { // Arbitrary large limit
        toast({ title: "Dimensions Too Large", description: "Target dimensions are too large (max 8000px).", variant: "destructive" });
        return;
    }

    setIsProcessing(true);
    toast({ title: "Processing...", description: "Resizing your image." });

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
      ctx.drawImage(img, 0, 0, width, height);
      const dataUrl = canvas.toDataURL(originalImage.type);
      setResizedPreviewUrl(dataUrl);
      setIsProcessing(false);
      toast({ title: "Resized!", description: "Image resized. You can now download it." });
    };
    img.onerror = () => {
        toast({ title: "Error", description: "Could not load the image for resizing.", variant: "destructive"});
        setIsProcessing(false);
    }
    img.src = originalPreviewUrl!;
  };

  const handleDownload = () => {
    if (!resizedPreviewUrl || !originalImage) return;
    const link = document.createElement('a');
    link.download = `resized-${originalImage.name}`;
    link.href = resizedPreviewUrl;
    link.click();
  };
  
  const handleClear = () => {
    setOriginalImage(null);
    setOriginalPreviewUrl(null);
    setOriginalDimensions(null);
    setTargetWidth('');
    setTargetHeight('');
    setResizedPreviewUrl(null);
    const fileInput = document.getElementById('resizeImageUpload') as HTMLInputElement;
    if(fileInput) fileInput.value = '';
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <Maximize className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl font-semibold text-foreground">Image Resizer</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Upload an image, specify new dimensions, and download the resized version.
      </p>

      <Card className="mb-6 rounded-lg shadow-sm">
        <CardHeader>
          <CardTitle>Upload Image</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="resizeImageUpload" className="mb-2 block text-lg font-medium text-center cursor-pointer p-6 border-2 border-dashed rounded-lg hover:border-primary transition-colors">
            <UploadCloud className="h-12 w-12 mx-auto text-primary mb-2" />
            Click or Drag & Drop Image
          </Label>
          <Input id="resizeImageUpload" type="file" accept="image/*" onChange={handleFileChange} className="hidden" aria-label="Upload image for resizing"/>
           {originalImage && (
            <div className="mt-3 text-sm text-muted-foreground">
                Selected: <strong>{originalImage.name}</strong> ({originalDimensions?.width}x{originalDimensions?.height}px)
            </div>
           )}
        </CardContent>
      </Card>

      {originalImage && (
        <Card className="mb-6 rounded-lg shadow-sm">
          <CardHeader>
            <CardTitle>Resize Options</CardTitle>
            <CardDescription>Specify the new dimensions for your image.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="targetWidth">Target Width (px)</Label>
                <Input id="targetWidth" type="number" value={targetWidth} onChange={(e) => handleDimensionChange(e.target.value, 'width')} placeholder="e.g., 800" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="targetHeight">Target Height (px)</Label>
                <Input id="targetHeight" type="number" value={targetHeight} onChange={(e) => handleDimensionChange(e.target.value, 'height')} placeholder="e.g., 600" className="mt-1" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="aspectRatio" checked={keepAspectRatio} onCheckedChange={(checked) => setKeepAspectRatio(Boolean(checked))} />
              <Label htmlFor="aspectRatio" className="cursor-pointer">Keep aspect ratio</Label>
            </div>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button onClick={handleResize} disabled={isProcessing || !originalImage}>
                        <RotateCcw className={`mr-2 h-4 w-4 ${isProcessing ? 'animate-spin' : ''}`} />
                        {isProcessing ? 'Resizing...' : 'Apply Resize'}
                    </Button>
                </TooltipTrigger>
                <TooltipContent><p>Apply the new dimensions and generate a preview.</p></TooltipContent>
            </Tooltip>
          </CardContent>
        </Card>
      )}

      {resizedPreviewUrl && (
        <Card className="mb-6 rounded-lg shadow-sm">
          <CardHeader>
            <CardTitle>Resized Preview</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <div className="max-w-full overflow-auto border rounded-md p-2 bg-muted/20">
              <Image src={resizedPreviewUrl} alt="Resized preview" width={parseInt(targetWidth) || 300} height={parseInt(targetHeight) || 200} objectFit="contain" />
            </div>
             <canvas ref={canvasRef} className="hidden" aria-hidden="true"></canvas> {/* Hidden canvas for processing */}
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button onClick={handleDownload} size="lg">
                        <Download className="mr-2 h-5 w-5" /> Download Resized Image
                    </Button>
                </TooltipTrigger>
                <TooltipContent><p>Save the resized image to your device.</p></TooltipContent>
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
            <TooltipContent><p>Clear the current image and reset dimensions.</p></TooltipContent>
        </Tooltip>
       }
        {!originalImage && (
         <p className="text-muted-foreground text-center mt-8">Upload an image to start resizing.</p>
       )}
    </div>
  );
}

