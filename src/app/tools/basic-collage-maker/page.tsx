
"use client";

import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { GalleryVerticalEnd, UploadCloud, Download, Trash2, ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const MAX_IMAGES = 4;
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;

interface UploadedImage {
  id: string;
  file: File;
  previewUrl: string;
  imgElement?: HTMLImageElement;
}

export default function BasicCollageMakerPage() {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    drawCollage();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadedImages]);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      if (uploadedImages.length + files.length > MAX_IMAGES) {
        toast({ title: "Limit Reached", description: `You can select up to ${MAX_IMAGES} images in total.`, variant: "destructive" });
        return;
      }
      const newImages: UploadedImage[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) {
          toast({ title: "Invalid File", description: `${file.name} is not an image.`, variant: "destructive" });
          continue;
        }
         if (file.size > 5 * 1024 * 1024) { // 5MB limit per image
          toast({ title: "File Too Large", description: `${file.name} exceeds 5MB.`, variant: "destructive" });
          continue;
        }

        const imgElement = new window.Image();
        const previewUrl = URL.createObjectURL(file);
        imgElement.src = previewUrl;
        await new Promise(resolve => imgElement.onload = resolve);

        newImages.push({
          id: `${file.name}-${Date.now()}`,
          file,
          previewUrl,
          imgElement,
        });
      }
      setUploadedImages(prev => [...prev, ...newImages]);
      event.target.value = ''; // Clear input
    }
  };

  const removeImage = (id: string) => {
    setUploadedImages(prev => prev.filter(img => img.id !== id));
  };

  const drawCollage = () => {
    const canvas = canvasRef.current;
    if (!canvas || uploadedImages.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = 'hsl(var(--muted))'; // Use theme color for background
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    const numImages = uploadedImages.length;
    if (numImages === 0) return;

    const drawImageScaled = (img: HTMLImageElement, x: number, y: number, w: number, h: number) => {
      const hRatio = w / img.width;
      const vRatio = h / img.height;
      const ratio  = Math.min(hRatio, vRatio);
      const centerShift_x = (w - img.width * ratio) / 2;
      const centerShift_y = (h - img.height * ratio) / 2;  
      ctx.drawImage(img, 0, 0, img.width, img.height,
                        x + centerShift_x, y + centerShift_y, img.width * ratio, img.height * ratio);  
    }

    // Simple layouts
    if (numImages === 1) {
      drawImageScaled(uploadedImages[0].imgElement!, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    } else if (numImages === 2) {
      const itemWidth = CANVAS_WIDTH / 2;
      drawImageScaled(uploadedImages[0].imgElement!, 0, 0, itemWidth, CANVAS_HEIGHT);
      drawImageScaled(uploadedImages[1].imgElement!, itemWidth, 0, itemWidth, CANVAS_HEIGHT);
    } else if (numImages === 3) {
      const itemWidth = CANVAS_WIDTH / 2;
      const itemHeight = CANVAS_HEIGHT / 2;
      drawImageScaled(uploadedImages[0].imgElement!, 0, 0, itemWidth, CANVAS_HEIGHT);
      drawImageScaled(uploadedImages[1].imgElement!, itemWidth, 0, itemWidth, itemHeight);
      drawImageScaled(uploadedImages[2].imgElement!, itemWidth, itemHeight, itemWidth, itemHeight);
    } else if (numImages >= 4) {
      const itemWidth = CANVAS_WIDTH / 2;
      const itemHeight = CANVAS_HEIGHT / 2;
      drawImageScaled(uploadedImages[0].imgElement!, 0, 0, itemWidth, itemHeight);
      drawImageScaled(uploadedImages[1].imgElement!, itemWidth, 0, itemWidth, itemHeight);
      drawImageScaled(uploadedImages[2].imgElement!, 0, itemHeight, itemWidth, itemHeight);
      drawImageScaled(uploadedImages[3].imgElement!, itemWidth, itemHeight, itemWidth, itemHeight);
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'collage.png';
    link.href = dataUrl;
    link.click();
    toast({title: "Downloaded!", description: "Collage saved as collage.png"});
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <GalleryVerticalEnd className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl font-semibold text-foreground">Basic Collage Maker</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Upload up to {MAX_IMAGES} images (JPG, PNG, GIF, WEBP, max 5MB each) to create a simple collage.
      </p>

      <Card className="mb-6 rounded-lg shadow-sm">
        <CardHeader>
          <CardTitle>Upload Images (Up to {MAX_IMAGES})</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="collageImageUpload" className="mb-2 block text-lg font-medium text-center cursor-pointer p-6 border-2 border-dashed rounded-lg hover:border-primary transition-colors">
            <UploadCloud className="h-12 w-12 mx-auto text-primary mb-2" />
            Click or Drag & Drop Images
          </Label>
          <Input
            id="collageImageUpload"
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
            disabled={uploadedImages.length >= MAX_IMAGES}
            aria-label="Image file input for collage"
          />
          {uploadedImages.length >= MAX_IMAGES && <p className="text-sm text-destructive text-center mt-2">Maximum {MAX_IMAGES} images reached.</p>}
        </CardContent>
      </Card>

      {uploadedImages.length > 0 && (
        <Card className="mb-6 rounded-lg shadow-sm">
          <CardHeader><CardTitle>Image Previews</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {uploadedImages.map(img => (
              <div key={img.id} className="relative group aspect-square border rounded-md overflow-hidden">
                <Image src={img.previewUrl} alt={img.file.name} layout="fill" objectFit="contain" />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => removeImage(img.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>Remove this image</p></TooltipContent>
                </Tooltip>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card className="mb-6 rounded-lg shadow-sm">
        <CardHeader><CardTitle>Collage Preview</CardTitle></CardHeader>
        <CardContent className="flex justify-center items-center bg-muted/20 p-4">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="border rounded-md shadow-inner"
            aria-label="Collage preview canvas"
          />
        </CardContent>
      </Card>
      
      <div className="flex gap-3">
        <Tooltip>
            <TooltipTrigger asChild>
                <Button onClick={handleDownload} disabled={uploadedImages.length === 0} size="lg">
                    <Download className="mr-2 h-5 w-5" /> Download Collage
                </Button>
            </TooltipTrigger>
            <TooltipContent><p>Download the generated collage as a PNG image.</p></TooltipContent>
        </Tooltip>
         {uploadedImages.length > 0 && (
           <Tooltip>
             <TooltipTrigger asChild>
                 <Button variant="outline" onClick={() => setUploadedImages([])}>
                     <XCircle className="mr-2 h-4 w-4" /> Clear All Images
                 </Button>
             </TooltipTrigger>
             <TooltipContent><p>Remove all uploaded images and clear the collage.</p></TooltipContent>
           </Tooltip>
        )}
      </div>
       {uploadedImages.length === 0 && (
         <p className="text-muted-foreground text-center mt-8">Upload some images to create your collage.</p>
       )}
    </div>
  );
}
