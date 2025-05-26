
"use client";

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

interface ColorValues {
  hex: string;
  rgb: string;
  hsl: string;
}

export default function ColorPickerPage() {
  const [selectedColor, setSelectedColor] = useState<string>('#6495ED'); // Default to primary color
  const [colorValues, setColorValues] = useState<ColorValues | null>(null);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  useEffect(() => {
    if (isClient) {
      updateColorValues(selectedColor);
    }
  }, [selectedColor, isClient]);

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedColor(event.target.value);
  };

  const updateColorValues = (hex: string) => {
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    setColorValues({
      hex: hex.toUpperCase(),
      rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
    });
  };

  const hexToRgb = (hex: string) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  const handleCopy = async (textToCopy: string, type: string) => {
    if (!textToCopy) return;
    try {
      await navigator.clipboard.writeText(textToCopy);
      toast({ title: "Copied!", description: `${type} value copied to clipboard.` });
    } catch (err) {
      toast({ title: "Error", description: `Failed to copy ${type} value.`, variant: "destructive" });
    }
  };

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-64">
        <Palette className="h-12 w-12 text-primary animate-pulse" />
        <p className="ml-4 text-xl text-muted-foreground">Loading Color Picker...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <Palette className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl font-semibold text-foreground">Color Picker Tool</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Select a color using the picker or input a HEX value. View its HEX, RGB, and HSL representations.
      </p>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <Card className="rounded-lg shadow-sm">
          <CardHeader>
            <CardTitle>Select Color</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            <div 
              className="w-48 h-48 rounded-lg border-4 border-border shadow-inner"
              style={{ backgroundColor: selectedColor }}
              aria-label={`Color preview: ${selectedColor}`}
            />
            <div className="w-full max-w-xs">
              <Label htmlFor="colorPickerInput" className="block text-sm font-medium text-muted-foreground mb-1 text-center">Color Picker</Label>
              <Input
                id="colorPickerInput"
                type="color"
                value={selectedColor}
                onChange={handleColorChange}
                className="w-full h-12 p-1 cursor-pointer"
                aria-label="HTML color picker input"
              />
            </div>
            <div className="w-full max-w-xs">
                <Label htmlFor="hexInput" className="block text-sm font-medium text-muted-foreground mb-1 text-center">HEX Value</Label>
                <Input
                    id="hexInput"
                    type="text"
                    value={selectedColor}
                    onChange={handleColorChange}
                    className="w-full text-center font-mono"
                    aria-label="HEX color input"
                />
            </div>
          </CardContent>
        </Card>

        {colorValues && (
          <Card className="rounded-lg shadow-sm">
            <CardHeader>
              <CardTitle>Color Values</CardTitle>
              <CardDescription>Copy the color codes below.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ColorValueDisplay label="HEX" value={colorValues.hex} onCopy={() => handleCopy(colorValues.hex, "HEX")} />
              <ColorValueDisplay label="RGB" value={colorValues.rgb} onCopy={() => handleCopy(colorValues.rgb, "RGB")} />
              <ColorValueDisplay label="HSL" value={colorValues.hsl} onCopy={() => handleCopy(colorValues.hsl, "HSL")} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

interface ColorValueDisplayProps {
  label: string;
  value: string;
  onCopy: () => void;
}

function ColorValueDisplay({ label, value, onCopy }: ColorValueDisplayProps) {
  return (
    <div>
      <Label className="text-sm text-muted-foreground">{label}</Label>
      <div className="flex items-center gap-2 mt-1">
        <Input
          type="text"
          value={value}
          readOnly
          className="text-base bg-muted/30 font-mono flex-grow"
          aria-label={`${label} color value: ${value}`}
        />
        <Button variant="outline" size="icon" onClick={onCopy} aria-label={`Copy ${label} value`}>
          <Copy className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
