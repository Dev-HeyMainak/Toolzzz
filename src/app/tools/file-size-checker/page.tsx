"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FilePieChart, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface FileInfo {
  name: string;
  size: number; // in bytes
  type: string;
  lastModified: string;
}

export default function FileSizeCheckerPage() {
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileInfo({
        name: file.name,
        size: file.size,
        type: file.type || 'N/A',
        lastModified: new Date(file.lastModified).toLocaleString(),
      });
    } else {
      setFileInfo(null);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  const handleClear = () => {
    setFileInfo(null);
    const fileInput = document.getElementById('fileInputChecker') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <FilePieChart className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl font-semibold text-foreground">File Size Checker</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Select a file from your device to check its size and other basic information.
      </p>

      <div className="mb-6">
        <Label htmlFor="fileInputChecker" className="mb-2 block font-medium">Select File</Label>
        <Input
          id="fileInputChecker"
          type="file"
          onChange={handleFileChange}
          className="text-base file:text-primary file:font-semibold hover:file:bg-primary/10 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0"
        />
      </div>

      {fileInfo && (
        <Card className="rounded-lg shadow-sm">
          <CardHeader>
            <CardTitle>{fileInfo.name}</CardTitle>
            <CardDescription>Details for the selected file.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <InfoRow label="File Name" value={fileInfo.name} />
            <InfoRow label="Size" value={formatFileSize(fileInfo.size)} />
            <InfoRow label="Size (bytes)" value={`${fileInfo.size.toLocaleString()} bytes`} />
            <InfoRow label="Type" value={fileInfo.type} />
            <InfoRow label="Last Modified" value={fileInfo.lastModified} />
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="outline" onClick={handleClear} className="mt-4">
                    <XCircle className="mr-2 h-4 w-4" /> Clear Selection
                    </Button>
                </TooltipTrigger>
                <TooltipContent><p>Clear the selected file and its details.</p></TooltipContent>
            </Tooltip>
          </CardContent>
        </Card>
      )}
      {!fileInfo && (
        <p className="text-muted-foreground text-center py-8">Select a file using the input above to see its details.</p>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center text-sm py-2 border-b border-border/50">
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-medium text-foreground text-right break-all">{value}</span>
    </div>
  );
}
