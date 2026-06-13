import { useState, useEffect } from 'react';
import { Scan, Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/shared/components/atoms/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/atoms/select';
import { Label } from '@/shared/components/atoms/label';
import { availableScanners } from '../../src/data/documentData';

// Constants
const STORAGE_KEY_SCANNER = 'scanner_device';
const STORAGE_KEY_RESOLUTION = 'scanner_resolution';
const STORAGE_KEY_COLOR_MODE = 'scanner_color_mode';
const STORAGE_KEY_DUPLEX = 'scanner_duplex';

interface ScannerSettingsProps {
  onScan: () => void;
  isScanning: boolean;
}

export function ScannerSettings({ onScan, isScanning }: ScannerSettingsProps) {
  const [selectedScanner, setSelectedScanner] = useState('Canon DR-C225');
  const [scannerResolution, setScannerResolution] = useState('300');
  const [scannerColorMode, setScannerColorMode] = useState('grayscale');
  const [scannerDuplex, setScannerDuplex] = useState(true);
  const [showScannerSettings, setShowScannerSettings] = useState(false);

  useEffect(() => {
    const savedScanner = localStorage.getItem(STORAGE_KEY_SCANNER);
    if (savedScanner && availableScanners.includes(savedScanner)) {
      setSelectedScanner(savedScanner);
    }
  }, []);

  useEffect(() => {
    const savedResolution = localStorage.getItem(STORAGE_KEY_RESOLUTION);
    if (savedResolution) {
      setScannerResolution(savedResolution);
    }
  }, []);

  useEffect(() => {
    const savedColorMode = localStorage.getItem(STORAGE_KEY_COLOR_MODE);
    if (savedColorMode) {
      setScannerColorMode(savedColorMode);
    }
  }, []);

  useEffect(() => {
    const savedDuplex = localStorage.getItem(STORAGE_KEY_DUPLEX);
    if (savedDuplex) {
      setScannerDuplex(savedDuplex === 'true');
    }
  }, []);

  const handleScannerChange = (scanner: string) => {
    setSelectedScanner(scanner);
    localStorage.setItem(STORAGE_KEY_SCANNER, scanner);
  };

  const handleResolutionChange = (resolution: string) => {
    setScannerResolution(resolution);
    localStorage.setItem(STORAGE_KEY_RESOLUTION, resolution);
  };

  const handleColorModeChange = (colorMode: string) => {
    setScannerColorMode(colorMode);
    localStorage.setItem(STORAGE_KEY_COLOR_MODE, colorMode);
  };

  const handleDuplexChange = (duplex: string) => {
    const isDuplex = duplex === 'on';
    setScannerDuplex(isDuplex);
    localStorage.setItem(STORAGE_KEY_DUPLEX, isDuplex.toString());
  };

  return (
    <div className="space-y-4">
      <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
        <div className="space-y-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowScannerSettings(!showScannerSettings)}
            className="w-full gap-2"
          >
            <Settings className="w-4 h-4" />
            スキャナー設定
            {showScannerSettings ? (
              <ChevronUp className="w-4 h-4 ml-auto" />
            ) : (
              <ChevronDown className="w-4 h-4 ml-auto" />
            )}
          </Button>

          {showScannerSettings && (
            <div className="pt-3 border-t border-gray-200 space-y-3">
              <div>
                <Label htmlFor="scanner" className="text-xs mb-1 block text-gray-600">
                  スキャナ
                </Label>
                <Select value={selectedScanner} onValueChange={handleScannerChange}>
                  <SelectTrigger id="scanner" className="bg-white border-gray-300 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableScanners.map((scanner) => (
                      <SelectItem key={scanner} value={scanner}>
                        {scanner}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="resolution" className="text-xs mb-1 block text-gray-600">
                  解像度
                </Label>
                <Select value={scannerResolution} onValueChange={handleResolutionChange}>
                  <SelectTrigger id="resolution" className="bg-white border-gray-300 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="150">150 dpi</SelectItem>
                    <SelectItem value="200">200 dpi</SelectItem>
                    <SelectItem value="300">300 dpi</SelectItem>
                    <SelectItem value="600">600 dpi</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="colormode" className="text-xs mb-1 block text-gray-600">
                  カラー
                </Label>
                <Select value={scannerColorMode} onValueChange={handleColorModeChange}>
                  <SelectTrigger id="colormode" className="bg-white border-gray-300 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bw">白黒</SelectItem>
                    <SelectItem value="grayscale">グレー</SelectItem>
                    <SelectItem value="color">カラー</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="duplex" className="text-xs mb-1 block text-gray-600">
                  両面
                </Label>
                <Select value={scannerDuplex ? 'on' : 'off'} onValueChange={handleDuplexChange}>
                  <SelectTrigger id="duplex" className="bg-white border-gray-300 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="off">OFF</SelectItem>
                    <SelectItem value="on">ON</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      </div>

      <Button
        variant="default"
        size="lg"
        onClick={onScan}
        disabled={isScanning}
        className="w-full bg-blue-600 hover:bg-blue-700 h-12"
      >
        {isScanning ? (
          <span className="animate-pulse">スキャン中...</span>
        ) : (
          <>
            <Scan className="w-5 h-5 mr-2" />
            スキャン実行
          </>
        )}
      </Button>
    </div>
  );
}
