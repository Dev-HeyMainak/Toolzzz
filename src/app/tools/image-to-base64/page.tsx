"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ImageUp, Copy, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function ImageToBase64Page() {
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File Type",
          description: "Please select an image file (e.g., PNG, JPG, GIF).",
          variant: "destructive",
        });
        clearSelection();
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File Too Large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        });
        clearSelection();
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result as string);
        setPreviewUrl(reader.result as string);
        setFileName(file.name);
      };
      reader.onerror = () => {
        toast({
          title: "Error Reading File",
          description: "Could not read the selected file.",
          variant: "destructive",
        });
        clearSelection();
      }
      reader.readAsDataURL(file);
    } else {
      clearSelection();
    }
  };

  const handleCopy = async () => {
    if (!imageBase64) return;
    try {
      await navigator.clipboard.writeText(imageBase64);
      toast({ title: "Success", description: "Base64 string copied to clipboard!" });
    } catch (err) {
      toast({ title: "Error", description: "Failed to copy Base64 string.", variant: "destructive" });
    }
  };

  const clearSelection = () => {
    setImageBase64(null);
    setPreviewUrl(null);
    setFileName(null);
    const fileInput = document.getElementById('imageFile') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <ImageUp className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl font-semibold text-foreground">Image to Base64 Converter</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Upload an image (PNG, JPG, GIF, etc. up to 5MB) to convert it into a Base64 encoded string.
      </p>

      <div className="mb-6">
        <Label htmlFor="imageFile" className="mb-2 block font-medium">Select Image File</Label>
        <Input
          id="imageFile"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="text-base file:text-primary file:font-semibold hover:file:bg-primary/10 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0"
        />
      </div>

      {fileName && (
        <p className="text-sm text-muted-foreground mb-4">Selected file: <strong>{fileName}</strong></p>
      )}

      {previewUrl && (
        <div className="mb-6 p-4 border rounded-lg bg-muted/20 max-w-md mx-auto">
          <h3 className="text-lg font-medium text-foreground mb-2 text-center">Image Preview</h3>
          <div className="relative aspect-video w-full overflow-hidden rounded-md">
            <Image src={previewUrl} alt="Selected image preview" layout="fill" objectFit="contain" />
          </div>
        </div>
      )}

      {imageBase64 && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="base64Output" className="mb-1 block font-medium">Base64 Output</Label>
            <Textarea
              id="base64Output"
              value={imageBase64}
              readOnly
              className="min-h-[200px] text-sm bg-muted/50 rounded-lg shadow-sm font-mono"
              aria-label="Base64 output string"
            />
          </div>
          <div className="flex gap-3">
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button onClick={handleCopy}>
                    <Copy className="mr-2 h-4 w-4" /> Copy Base64 String
                    </Button>
                </TooltipTrigger>
                <TooltipContent><p>Copy the generated Base64 string to your clipboard.</p></TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="outline" onClick={clearSelection}>
                    <XCircle className="mr-2 h-4 w-4" /> Clear
                    </Button>
                </TooltipTrigger>
                <TooltipContent><p>Clear the selected image and Base64 output.</p></TooltipContent>
            </Tooltip>
          </div>
        </div>
      )}
       {!imageBase64 && !fileName && (
         <p className="text-muted-foreground text-center py-8">Upload an image to see its Base64 representation.</p>
       )}
    </div>
  );
}
