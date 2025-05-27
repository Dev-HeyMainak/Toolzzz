
"use client";

import { useState, ChangeEvent } from 'react';
import jsPDF from 'jspdf';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Printer, UploadCloud, XCircle, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ImageFile {
  id: string;
  file: File;
  previewUrl: string;
}

export default function ImageToPdfPage() {
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImageFiles: ImageFile[] = [];
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!allowedTypes.includes(file.type)) {
          toast({ title: "Invalid File Type", description: `${file.name} is not a supported image type.`, variant: "destructive" });
          continue;
        }
        if (file.size > maxSize) {
          toast({ title: "File Too Large", description: `${file.name} exceeds the 5MB size limit.`, variant: "destructive" });
          continue;
        }
        newImageFiles.push({
          id: `${file.name}-${Date.now()}`,
          file,
          previewUrl: URL.createObjectURL(file),
        });
      }
      setImageFiles(prev => [...prev, ...newImageFiles].slice(0, 20)); // Limit to 20 images
      
      // Clear the file input for next selection
      event.target.value = '';
    }
  };

  const removeImage = (id: string) => {
    setImageFiles(prev => prev.filter(imgFile => imgFile.id !== id));
  };

  const handleConvertToPdf = async () => {
    if (imageFiles.length === 0) {
      toast({ title: "No Images", description: "Please select at least one image to convert.", variant: "default" });
      return;
    }
    setIsConverting(true);
    toast({ title: "Processing...", description: "Converting images to PDF. Please wait." });

    try {
      const pdf = new jsPDF('p', 'mm', 'a4'); // Portrait, millimeters, A4
      let firstPage = true;

      for (const imgFile of imageFiles) {
        if (!firstPage) {
          pdf.addPage();
        }
        firstPage = false;

        const img = new window.Image();
        img.src = imgFile.previewUrl;

        await new Promise<void>((resolve, reject) => {
          img.onload = () => {
            const imgWidth = img.width;
            const imgHeight = img.height;
            const pageInfo = pdf.internal.pageSize;
            const pageWidth = pageInfo.getWidth();
            const pageHeight = pageInfo.getHeight();
            const margin = 10; // 10mm margin

            const usableWidth = pageWidth - 2 * margin;
            const usableHeight = pageHeight - 2 * margin;

            const aspectRatio = imgWidth / imgHeight;
            let pdfImgWidth = usableWidth;
            let pdfImgHeight = usableWidth / aspectRatio;

            if (pdfImgHeight > usableHeight) {
              pdfImgHeight = usableHeight;
              pdfImgWidth = usableHeight * aspectRatio;
            }
            
            const x = (pageWidth - pdfImgWidth) / 2;
            const y = (pageHeight - pdfImgHeight) / 2;

            pdf.addImage(imgFile.previewUrl, imgFile.file.type.split('/')[1].toUpperCase(), x, y, pdfImgWidth, pdfImgHeight);
            resolve();
          };
          img.onerror = (err) => reject(new Error(`Failed to load image: ${imgFile.file.name}`));
        });
      }
      pdf.save('images-to-pdf.pdf');
      toast({ title: "Success!", description: "PDF generated and downloaded." });
    } catch (error) {
      console.error("PDF Conversion Error: ", error);
      toast({ title: "Conversion Error", description: (error as Error).message || "Could not convert images to PDF.", variant: "destructive" });
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <Printer className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl font-semibold text-foreground">Image to PDF Converter</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Upload JPG, PNG, GIF or WEBP images (up to 5MB each, max 20 images) to combine them into a single PDF document.
      </p>

      <Card className="mb-8 rounded-lg shadow-sm">
        <CardHeader>
          <CardTitle>Upload Images</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="imageUploadPdf" className="mb-2 block text-lg font-medium text-center cursor-pointer p-6 border-2 border-dashed rounded-lg hover:border-primary transition-colors">
            <UploadCloud className="h-12 w-12 mx-auto text-primary mb-2" />
            Click or Drag & Drop to Upload Images
          </Label>
          <Input
            id="imageUploadPdf"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            onChange={handleFileChange}
            className="hidden"
            aria-label="Image file input for PDF conversion"
          />
          {imageFiles.length > 0 && (
            <p className="text-sm text-muted-foreground mt-2 text-center">{imageFiles.length} image(s) selected. Max 20.</p>
          )}
        </CardContent>
      </Card>

      {imageFiles.length > 0 && (
        <Card className="mb-8 rounded-lg shadow-sm">
          <CardHeader>
            <CardTitle>Selected Images Preview</CardTitle>
            <CardDescription>Images will be added to the PDF in this order.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {imageFiles.map(imgFile => (
              <div key={imgFile.id} className="relative group aspect-square border rounded-md overflow-hidden">
                <Image src={imgFile.previewUrl} alt={imgFile.file.name} layout="fill" objectFit="cover" />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(imgFile.id)}
                      aria-label={`Remove ${imgFile.file.name}`}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>Remove image</p></TooltipContent>
                </Tooltip>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="flex items-center gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={handleConvertToPdf} disabled={imageFiles.length === 0 || isConverting} size="lg">
              <Printer className="mr-2 h-5 w-5" />
              {isConverting ? 'Converting...' : 'Convert to PDF & Download'}
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>Combine selected images into a PDF and download it.</p></TooltipContent>
        </Tooltip>
        {imageFiles.length > 0 && (
           <Tooltip>
            <TooltipTrigger asChild>
                <Button variant="outline" onClick={() => setImageFiles([])} disabled={isConverting}>
                    <XCircle className="mr-2 h-4 w-4" /> Clear All Images
                </Button>
            </TooltipTrigger>
            <TooltipContent><p>Remove all selected images.</p></TooltipContent>
          </Tooltip>
        )}
      </div>
       {imageFiles.length === 0 && !isConverting && (
         <p className="text-muted-foreground text-center mt-8">Upload some images to get started.</p>
       )}
    </div>
  );
}
