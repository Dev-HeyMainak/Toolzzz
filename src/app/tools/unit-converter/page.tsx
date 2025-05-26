
"use client";

import { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Scale as ScaleIcon, ArrowRightLeft } from 'lucide-react'; // Renamed Scale to ScaleIcon
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

type UnitCategory = 'length' | 'weight' | 'temperature';

interface Unit {
  symbol: string;
  name: string;
  category: UnitCategory;
  toBase: (value: number) => number; // Converts to a base unit (e.g., meters, kilograms, Celsius)
  fromBase: (value: number) => number; // Converts from a base unit
}

const units: Unit[] = [
  // Length (Base: Meter)
  { symbol: 'm', name: 'Meter', category: 'length', toBase: v => v, fromBase: v => v },
  { symbol: 'km', name: 'Kilometer', category: 'length', toBase: v => v * 1000, fromBase: v => v / 1000 },
  { symbol: 'cm', name: 'Centimeter', category: 'length', toBase: v => v / 100, fromBase: v => v * 100 },
  { symbol: 'mm', name: 'Millimeter', category: 'length', toBase: v => v / 1000, fromBase: v => v * 1000 },
  { symbol: 'in', name: 'Inch', category: 'length', toBase: v => v * 0.0254, fromBase: v => v / 0.0254 },
  { symbol: 'ft', name: 'Foot', category: 'length', toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
  { symbol: 'yd', name: 'Yard', category: 'length', toBase: v => v * 0.9144, fromBase: v => v / 0.9144 },
  { symbol: 'mi', name: 'Mile', category: 'length', toBase: v => v * 1609.34, fromBase: v => v / 1609.34 },
  // Weight (Base: Kilogram)
  { symbol: 'kg', name: 'Kilogram', category: 'weight', toBase: v => v, fromBase: v => v },
  { symbol: 'g', name: 'Gram', category: 'weight', toBase: v => v / 1000, fromBase: v => v * 1000 },
  { symbol: 'mg', name: 'Milligram', category: 'weight', toBase: v => v / 1000000, fromBase: v => v * 1000000 },
  { symbol: 'lb', name: 'Pound', category: 'weight', toBase: v => v * 0.453592, fromBase: v => v / 0.453592 },
  { symbol: 'oz', name: 'Ounce', category: 'weight', toBase: v => v * 0.0283495, fromBase: v => v / 0.0283495 },
  // Temperature (Base: Celsius)
  { symbol: '°C', name: 'Celsius', category: 'temperature', toBase: v => v, fromBase: v => v },
  { symbol: '°F', name: 'Fahrenheit', category: 'temperature', toBase: v => (v - 32) * 5/9, fromBase: v => (v * 9/5) + 32 },
  { symbol: 'K', name: 'Kelvin', category: 'temperature', toBase: v => v - 273.15, fromBase: v => v + 273.15 },
];

export default function UnitConverterPage() {
  const [inputValue, setInputValue] = useState<string>('1');
  const [fromUnitSymbol, setFromUnitSymbol] = useState<string>('m');
  const [toUnitSymbol, setToUnitSymbol] = useState<string>('ft');
  const [selectedCategory, setSelectedCategory] = useState<UnitCategory>('length');
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const availableCategories = useMemo(() => Array.from(new Set(units.map(u => u.category))), []);
  
  const filteredUnits = useMemo(() => units.filter(u => u.category === selectedCategory), [selectedCategory]);

  useEffect(() => { // Reset units if category changes and current units are not in new category
    if (isClient) {
        const currentFromUnit = units.find(u => u.symbol === fromUnitSymbol);
        const currentToUnit = units.find(u => u.symbol === toUnitSymbol);

        if (!currentFromUnit || currentFromUnit.category !== selectedCategory) {
            setFromUnitSymbol(filteredUnits[0]?.symbol || '');
        }
        if (!currentToUnit || currentToUnit.category !== selectedCategory) {
            setToUnitSymbol(filteredUnits[1]?.symbol || filteredUnits[0]?.symbol || '');
        }
    }
  }, [selectedCategory, filteredUnits, fromUnitSymbol, toUnitSymbol, isClient]);


  const outputValue = useMemo(() => {
    const value = parseFloat(inputValue);
    if (isNaN(value) || !fromUnitSymbol || !toUnitSymbol) return '';

    const fromUnit = units.find(u => u.symbol === fromUnitSymbol && u.category === selectedCategory);
    const toUnit = units.find(u => u.symbol === toUnitSymbol && u.category === selectedCategory);

    if (!fromUnit || !toUnit) return '';

    const baseValue = fromUnit.toBase(value);
    const result = toUnit.fromBase(baseValue);
    
    // Format result to a reasonable number of decimal places
    if (Math.abs(result) < 0.00001 && result !== 0) return result.toExponential(4);
    if (Math.abs(result) > 1000000) return result.toExponential(4);
    return parseFloat(result.toFixed(5)).toString();

  }, [inputValue, fromUnitSymbol, toUnitSymbol, selectedCategory]);

  const handleSwapUnits = () => {
    const tempFrom = fromUnitSymbol;
    setFromUnitSymbol(toUnitSymbol);
    setToUnitSymbol(tempFrom);
  };

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-64">
        <ScaleIcon className="h-12 w-12 text-primary animate-pulse" />
        <p className="ml-4 text-xl text-muted-foreground">Loading Unit Converter...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <ScaleIcon className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl font-semibold text-foreground">Unit Converter</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Convert between various units of measurement like length, weight, and temperature.
      </p>

      <Card className="max-w-2xl mx-auto rounded-lg shadow-sm">
        <CardHeader>
          <CardTitle>Converter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="categorySelect" className="mb-1 block">Category</Label>
            <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as UnitCategory)}>
              <SelectTrigger id="categorySelect" className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {availableCategories.map(cat => (
                  <SelectItem key={cat} value={cat} className="capitalize">{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex flex-col sm:flex-row items-end gap-4">
            <div className="flex-1 w-full">
              <Label htmlFor="inputValue" className="mb-1 block">Value</Label>
              <Input
                id="inputValue"
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter value"
                className="text-lg h-12"
              />
            </div>
            <div className="flex-1 w-full">
              <Label htmlFor="fromUnit" className="mb-1 block">From</Label>
              <Select value={fromUnitSymbol} onValueChange={setFromUnitSymbol}>
                <SelectTrigger id="fromUnit" className="w-full h-12">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {filteredUnits.map(unit => (
                    <SelectItem key={unit.symbol} value={unit.symbol}>{unit.name} ({unit.symbol})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" size="icon" onClick={handleSwapUnits} className="h-12 w-12 flex-shrink-0 sm:mb-0" aria-label="Swap units">
              <ArrowRightLeft className="h-5 w-5" />
            </Button>

            <div className="flex-1 w-full">
              <Label htmlFor="toUnit" className="mb-1 block">To</Label>
              <Select value={toUnitSymbol} onValueChange={setToUnitSymbol}>
                <SelectTrigger id="toUnit" className="w-full h-12">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {filteredUnits.map(unit => (
                    <SelectItem key={unit.symbol} value={unit.symbol}>{unit.name} ({unit.symbol})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {outputValue && (
            <div className="pt-4">
              <Label className="block text-sm font-medium text-muted-foreground">Result</Label>
              <p className="text-3xl font-bold text-primary mt-1 break-all">{outputValue}</p>
              {inputValue && fromUnitSymbol && toUnitSymbol && units.find(u=>u.symbol === fromUnitSymbol) && units.find(u=>u.symbol === toUnitSymbol) && (
                <p className="text-sm text-muted-foreground">
                  {inputValue} {units.find(u=>u.symbol === fromUnitSymbol)?.name} = {outputValue} {units.find(u=>u.symbol === toUnitSymbol)?.name}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
