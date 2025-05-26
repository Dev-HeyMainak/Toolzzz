"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TableProperties, UploadCloud, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// Basic CSV parser
function parseCSV(csvText: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let inQuotes = false;
  let currentField = '';

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];

    if (char === '"') {
      if (inQuotes && i + 1 < csvText.length && csvText[i + 1] === '"') {
        currentField += '"';
        i++; 
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentField);
      currentField = '';
    } else if (char === '\n' && !inQuotes) {
      currentRow.push(currentField);
      rows.push(currentRow);
      currentRow = [];
      currentField = '';
    } else if (char === '\r' && !inQuotes) {
      if (i + 1 < csvText.length && csvText[i+1] === '\n') {
        // Handled by \n
      } else {
        currentRow.push(currentField);
        rows.push(currentRow);
        currentRow = [];
        currentField = '';
      }
    }
     else {
      currentField += char;
    }
  }
  currentRow.push(currentField);
  rows.push(currentRow);
  
  return rows.filter(row => row.some(cell => cell.trim() !== ''));
}


export default function CsvToTablePage() {
  const [csvData, setCsvData] = useState<string[][] | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        toast({
          title: "Invalid File Type",
          description: "Please select a CSV (.csv) file.",
          variant: "destructive",
        });
        clearData();
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File Too Large",
          description: "CSV file size should be less than 10MB.",
          variant: "destructive",
        });
        clearData();
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const parsedData = parseCSV(text);
          if (parsedData.length === 0 || (parsedData.length === 1 && parsedData[0].length === 1 && parsedData[0][0] === '')) {
             toast({ title: "Empty CSV", description: "The CSV file appears to be empty or invalid.", variant: "destructive" });
             clearData();
             return;
          }
          setCsvData(parsedData);
          setFileName(file.name);
          toast({ title: "CSV Loaded", description: `${file.name} processed successfully.`});
        } catch (error) {
          toast({
            title: "Error Parsing CSV",
            description: "Could not parse the CSV file. Ensure it's valid.",
            variant: "destructive",
          });
          clearData();
        }
      };
      reader.onerror = () => {
         toast({ title: "Error Reading File", description: "Could not read the selected file.", variant: "destructive" });
         clearData();
      }
      reader.readAsText(file);
    } else {
      clearData();
    }
  };
  
  const clearData = () => {
    setCsvData(null);
    setFileName(null);
    const fileInput = document.getElementById('csvFile') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const headers = csvData && csvData.length > 0 ? csvData[0] : [];
  const bodyRows = csvData && csvData.length > 1 ? csvData.slice(1) : [];

  return (
    <div>
      <div className="flex items-center mb-6">
        <TableProperties className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl font-semibold text-foreground">CSV to Table Viewer</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Upload a CSV file (up to 10MB) to view its contents in a structured table format.
      </p>

      <div className="mb-6 p-6 border rounded-lg bg-muted/20">
        <Label htmlFor="csvFile" className="mb-2 block text-lg font-medium text-center cursor-pointer">
          <UploadCloud className="h-12 w-12 mx-auto text-primary mb-2" />
          Click to Upload CSV File
        </Label>
        <Input
          id="csvFile"
          type="file"
          accept=".csv,text/csv"
          onChange={handleFileChange}
          className="hidden" 
        />
        {fileName && (
            <div className="text-center mt-2">
                <p className="text-sm text-muted-foreground">Selected: <strong>{fileName}</strong></p>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="link" size="sm" onClick={clearData} className="text-xs text-destructive p-0 h-auto">
                            Clear selection
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Deselect the current file.</p></TooltipContent>
                </Tooltip>
            </div>
        )}
      </div>

      {csvData && headers.length > 0 && (
        <ScrollArea className="h-[500px] border rounded-lg shadow-sm">
          <Table>
            <TableCaption>{fileName ? `Table view of ${fileName}` : 'CSV Data Table'}</TableCaption>
            <TableHeader className="sticky top-0 bg-muted/80 backdrop-blur-sm">
              <TableRow>
                {headers.map((header, index) => (
                  <TableHead key={index} className="whitespace-nowrap">{header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {bodyRows.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <TableCell key={cellIndex} className="whitespace-nowrap">{cell}</TableCell>
                  ))}
                </TableRow>
              ))}
               {bodyRows.length === 0 && (
                <TableRow>
                    <TableCell colSpan={headers.length} className="text-center text-muted-foreground h-24">
                        No data rows found after headers. The file might contain only a header row or be empty.
                    </TableCell>
                </TableRow>
               )}
            </TableBody>
          </Table>
        </ScrollArea>
      )}
      {!csvData && !fileName && (
         <p className="text-muted-foreground text-center py-8">Upload a CSV file by clicking the area above to display its data as a table.</p>
       )}
    </div>
  );
}
