import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/components/atoms/dialog";
import { Button } from "@/shared/components/atoms/button";
import { Input } from "@/shared/components/atoms/input";
import { Label } from "@/shared/components/atoms/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/atoms/card";
import { Badge } from "@/shared/components/atoms/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/atoms/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/atoms/select";
import { Separator } from "@/shared/components/atoms/separator";
import { ScrollArea } from "@/shared/components/atoms/scroll-area";
import { Slider } from "@/shared/components/atoms/slider";
import { Switch } from "@/shared/components/atoms/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/components/atoms/tooltip";
import { 
  Monitor,
  Image as ImageIcon,
  ZoomIn,
  ZoomOut,
  Move,
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  Maximize,
  Minimize,
  Settings,
  Ruler,
  CircleDot,
  Square,
  Download,
  Printer,
  Share,
  Eye,
  EyeOff,
  Grid3X3,
  MousePointer,
  Hand,
  Search,
  FileText,
  Calendar,
  Clock,
  User,
  Building2,
  Activity,
  Layers,
  Compare,
  Filter,
  Sun,
  Moon,
  Contrast,
  Sliders,
  Info,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  MoreHorizontal,
  X,
  Stethoscope,
  Zap,
  Target,
  ChevronLeft,
  ChevronRight,
  Save,
  Copy,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";

interface DICOMImage {
  id: string;
  studyId: string;
  seriesId: string;
  instanceNumber: number;
  patientId: string;
  patientName: string;
  modality: "CT" | "MRI" | "XR" | "US" | "CR" | "DX" | "MG" | "PT" | "NM";
  studyDate: string;
  studyTime: string;
  studyDescription: string;
  seriesDescription: string;
  bodyPart: string;
  imageUrl: string; // 実際のシステムではDICOM URLまたはbase64データ
  thumbnailUrl: string;
  windowWidth: number;
  windowCenter: number;
  rows: number;
  columns: number;
  pixelSpacing: [number, number];
  sliceThickness: number;
  acquisitionDate: string;
  institutionName: string;
  manufacturerName: string;
  technician?: string;
  reportStatus: "未読" | "読影中" | "完了" | "追加依頼";
  urgency: "通常" | "急" | "至急";
  findings?: string;
}

interface Study {
  id: string;
  patientId: string;
  studyDate: string;
  studyTime: string;
  studyDescription: string;
  modalities: string[];
  series: Series[];
  accessionNumber: string;
  referringPhysician: string;
  readingPhysician?: string;
  reportStatus: "未読" | "読影中" | "完了" | "追加依頼";
  urgency: "通常" | "急" | "至急";
}

interface Series {
  id: string;
  studyId: string;
  modality: string;
  seriesDescription: string;
  seriesNumber: number;
  imageCount: number;
  images: DICOMImage[];
}

interface ViewerSettings {
  windowWidth: number;
  windowCenter: number;
  zoom: number;
  panX: number;
  panY: number;
  rotation: number;
  flipHorizontal: boolean;
  flipVertical: boolean;
  invert: boolean;
  annotations: boolean;
  grid: boolean;
  measurements: boolean;
}

interface Measurement {
  id: string;
  type: "line" | "circle" | "rectangle" | "angle";
  points: { x: number; y: number }[];
  value: number;
  unit: string;
  label: string;
  createdAt: string;
  createdBy: string;
}

interface ImageViewerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
  studies?: Study[];
  selectedStudyId?: string;
  selectedImageId?: string;
}

// モダリティ設定
const modalityConfig = {
  CT: { 
    name: "CTスキャン", 
    icon: "🧠", 
    color: "bg-blue-100 text-blue-800 border-blue-200",
    defaultWindow: { width: 400, center: 40 }
  },
  MRI: { 
    name: "MRI", 
    icon: "🧲", 
    color: "bg-purple-100 text-purple-800 border-purple-200",
    defaultWindow: { width: 500, center: 250 }
  },
  XR: { 
    name: "X線", 
    icon: "🦴", 
    color: "bg-gray-100 text-gray-800 border-gray-200",
    defaultWindow: { width: 2000, center: 1000 }
  },
  US: { 
    name: "超音波", 
    icon: "〰️", 
    color: "bg-teal-100 text-teal-800 border-teal-200",
    defaultWindow: { width: 256, center: 128 }
  },
  CR: { 
    name: "CR", 
    icon: "📷", 
    color: "bg-green-100 text-green-800 border-green-200",
    defaultWindow: { width: 2000, center: 1000 }
  },
  DX: { 
    name: "DX", 
    icon: "📸", 
    color: "bg-indigo-100 text-indigo-800 border-indigo-200",
    defaultWindow: { width: 2000, center: 1000 }
  },
  MG: { 
    name: "マンモグラフィ", 
    icon: "🎯", 
    color: "bg-pink-100 text-pink-800 border-pink-200",
    defaultWindow: { width: 2000, center: 1000 }
  },
  PT: { 
    name: "PET", 
    icon: "☢️", 
    color: "bg-orange-100 text-orange-800 border-orange-200",
    defaultWindow: { width: 1000, center: 500 }
  },
  NM: { 
    name: "核医学", 
    icon: "⚛️", 
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    defaultWindow: { width: 256, center: 128 }
  },
};

// ウィンドウプリセット
const windowPresets = {
  CT: [
    { name: "Abdomen", width: 400, center: 40 },
    { name: "Brain", width: 80, center: 40 },
    { name: "Lung", width: 1500, center: -600 },
    { name: "Bone", width: 2000, center: 300 },
    { name: "Mediastinum", width: 350, center: 50 },
  ],
  MRI: [
    { name: "T1", width: 500, center: 250 },
    { name: "T2", width: 800, center: 400 },
    { name: "FLAIR", width: 600, center: 300 },
    { name: "DWI", width: 1000, center: 500 },
  ],
  XR: [
    { name: "Standard", width: 2000, center: 1000 },
    { name: "Chest", width: 1500, center: 800 },
    { name: "Bone", width: 2500, center: 1200 },
  ],
};

// サンプルデータ
const sampleStudies: Study[] = [
  {
    id: "STUDY001",
    patientId: "P123456789",
    studyDate: "2024-12-27",
    studyTime: "14:30:00",
    studyDescription: "胸部CT検査",
    modalities: ["CT"],
    accessionNumber: "ACC001",
    referringPhysician: "田中 医師",
    readingPhysician: "放射線科 山田医師",
    reportStatus: "完了",
    urgency: "通常",
    series: [
      {
        id: "SERIES001",
        studyId: "STUDY001",
        modality: "CT",
        seriesDescription: "胸部単純CT",
        seriesNumber: 1,
        imageCount: 120,
        images: Array.from({ length: 120 }, (_, i) => ({
          id: `IMG${String(i + 1).padStart(3, '0')}`,
          studyId: "STUDY001",
          seriesId: "SERIES001",
          instanceNumber: i + 1,
          patientId: "P123456789",
          patientName: "山田 太郎",
          modality: "CT" as const,
          studyDate: "2024-12-27",
          studyTime: "14:30:00",
          studyDescription: "胸部CT検査",
          seriesDescription: "胸部単純CT",
          bodyPart: "胸部",
          imageUrl: `https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=800&fit=crop&auto=format&fm=jpg&q=80&crop=center&bg=000000&blend=000000&blend-mode=multiply&blend-alpha=30`,
          thumbnailUrl: `https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=100&h=100&fit=crop&auto=format&fm=jpg&q=60&crop=center&bg=000000&blend=000000&blend-mode=multiply&blend-alpha=30`,
          windowWidth: 400,
          windowCenter: 40,
          rows: 512,
          columns: 512,
          pixelSpacing: [0.625, 0.625],
          sliceThickness: 5.0,
          acquisitionDate: "2024-12-27",
          institutionName: "市立総合病院",
          manufacturerName: "GE Healthcare",
          technician: "技師A",
          reportStatus: "完了",
          urgency: "通常",
          findings: "肺野に軽度の炎症所見を認めます。その他異常所見なし。"
        }))
      }
    ]
  },
  {
    id: "STUDY002",
    patientId: "P123456789",
    studyDate: "2024-12-25",
    studyTime: "10:15:00",
    studyDescription: "腹部MRI検査",
    modalities: ["MRI"],
    accessionNumber: "ACC002",
    referringPhysician: "田中 医師",
    reportStatus: "読影中",
    urgency: "急",
    series: [
      {
        id: "SERIES002",
        studyId: "STUDY002",
        modality: "MRI",
        seriesDescription: "T1強調画像",
        seriesNumber: 1,
        imageCount: 25,
        images: Array.from({ length: 25 }, (_, i) => ({
          id: `MRI${String(i + 1).padStart(3, '0')}`,
          studyId: "STUDY002",
          seriesId: "SERIES002",
          instanceNumber: i + 1,
          patientId: "P123456789",
          patientName: "山田 太郎",
          modality: "MRI" as const,
          studyDate: "2024-12-25",
          studyTime: "10:15:00",
          studyDescription: "腹部MRI検査",
          seriesDescription: "T1強調画像",
          bodyPart: "腹部",
          imageUrl: `https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=800&fit=crop&auto=format&fm=jpg&q=80&crop=center&bg=1a1a1a&blend=1a1a1a&blend-mode=multiply&blend-alpha=40`,
          thumbnailUrl: `https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=100&h=100&fit=crop&auto=format&fm=jpg&q=60&crop=center&bg=1a1a1a&blend=1a1a1a&blend-mode=multiply&blend-alpha=40`,
          windowWidth: 500,
          windowCenter: 250,
          rows: 256,
          columns: 256,
          pixelSpacing: [1.0, 1.0],
          sliceThickness: 6.0,
          acquisitionDate: "2024-12-25",
          institutionName: "市立総合病院",
          manufacturerName: "Siemens",
          technician: "技師B",
          reportStatus: "読影中",
          urgency: "急"
        }))
      }
    ]
  },
  {
    id: "STUDY003",
    patientId: "P123456789",
    studyDate: "2024-12-20",
    studyTime: "09:00:00",
    studyDescription: "胸部X線検査",
    modalities: ["XR"],
    accessionNumber: "ACC003",
    referringPhysician: "田中 医師",
    reportStatus: "完了",
    urgency: "通常",
    series: [
      {
        id: "SERIES003",
        studyId: "STUDY003",
        modality: "XR",
        seriesDescription: "胸部正面",
        seriesNumber: 1,
        imageCount: 1,
        images: [{
          id: "XR001",
          studyId: "STUDY003",
          seriesId: "SERIES003",
          instanceNumber: 1,
          patientId: "P123456789",
          patientName: "山田 太郎",
          modality: "XR" as const,
          studyDate: "2024-12-20",
          studyTime: "09:00:00",
          studyDescription: "胸部X線検査",
          seriesDescription: "胸部正面",
          bodyPart: "胸部",
          imageUrl: `https://images.unsplash.com/photo-1612277795421-9bc7706a4a34?w=800&h=1000&fit=crop&auto=format&fm=jpg&q=80&crop=center&bg=000000&blend=000000&blend-mode=multiply&blend-alpha=50`,
          thumbnailUrl: `https://images.unsplash.com/photo-1612277795421-9bc7706a4a34?w=100&h=125&fit=crop&auto=format&fm=jpg&q=60&crop=center&bg=000000&blend=000000&blend-mode=multiply&blend-alpha=50`,
          windowWidth: 2000,
          windowCenter: 1000,
          rows: 2048,
          columns: 1024,
          pixelSpacing: [0.175, 0.175],
          sliceThickness: 0,
          acquisitionDate: "2024-12-20",
          institutionName: "市立総合病院",
          manufacturerName: "Canon",
          technician: "技師C",
          reportStatus: "完了",
          urgency: "通常",
          findings: "心陰影正常大。肺野清明。異常所見なし。"
        }]
      }
    ]
  }
];

export function ImageViewerDialog({
  isOpen,
  onClose,
  patientId,
  patientName,
  studies = sampleStudies,
  selectedStudyId,
  selectedImageId,
}: ImageViewerDialogProps) {
  // 表示状態
  const [currentStudy, setCurrentStudy] = useState<Study | null>(null);
  const [currentSeries, setCurrentSeries] = useState<Series | null>(null);
  const [currentImage, setCurrentImage] = useState<DICOMImage | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // ビューワ設定
  const [viewerSettings, setViewerSettings] = useState<ViewerSettings>({
    windowWidth: 400,
    windowCenter: 40,
    zoom: 1,
    panX: 0,
    panY: 0,
    rotation: 0,
    flipHorizontal: false,
    flipVertical: false,
    invert: false,
    annotations: true,
    grid: false,
    measurements: true,
  });
  
  // UI状態
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(5); // FPS
  const [activeTab, setActiveTab] = useState("viewer");
  const [activeTool, setActiveTool] = useState<"pan" | "zoom" | "measure" | "pointer">("pointer");
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [showOverlays, setShowOverlays] = useState(true);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedStudyForComparison, setSelectedStudyForComparison] = useState<string | null>(null);
  
  // Refs
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 初期化
  useEffect(() => {
    if (isOpen && studies.length > 0) {
      const study = selectedStudyId 
        ? studies.find(s => s.id === selectedStudyId) || studies[0]
        : studies[0];
      
      setCurrentStudy(study);
      if (study.series.length > 0) {
        const series = study.series[0];
        setCurrentSeries(series);
        if (series.images.length > 0) {
          const image = selectedImageId 
            ? series.images.find(img => img.id === selectedImageId) || series.images[0]
            : series.images[0];
          setCurrentImage(image);
          setCurrentImageIndex(series.images.findIndex(img => img.id === image.id));
          
          // モダリティに応じたデフォルト設定
          const config = modalityConfig[image.modality];
          if (config) {
            setViewerSettings(prev => ({
              ...prev,
              windowWidth: config.defaultWindow.width,
              windowCenter: config.defaultWindow.center,
            }));
          }
        }
      }
    }
  }, [isOpen, studies, selectedStudyId, selectedImageId]);

  // 自動再生
  useEffect(() => {
    if (isPlaying && currentSeries) {
      playIntervalRef.current = setInterval(() => {
        setCurrentImageIndex(prev => {
          const nextIndex = prev + 1;
          if (nextIndex >= currentSeries.images.length) {
            setIsPlaying(false);
            return 0;
          }
          const nextImage = currentSeries.images[nextIndex];
          setCurrentImage(nextImage);
          return nextIndex;
        });
      }, 1000 / playSpeed);
    } else {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
        playIntervalRef.current = null;
      }
    }

    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    };
  }, [isPlaying, playSpeed, currentSeries]);

  // 画像操作関数
  const handleZoomIn = useCallback(() => {
    setViewerSettings(prev => ({ ...prev, zoom: Math.min(prev.zoom * 1.2, 10) }));
  }, []);

  const handleZoomOut = useCallback(() => {
    setViewerSettings(prev => ({ ...prev, zoom: Math.max(prev.zoom / 1.2, 0.1) }));
  }, []);

  const handleResetView = useCallback(() => {
    setViewerSettings(prev => ({
      ...prev,
      zoom: 1,
      panX: 0,
      panY: 0,
      rotation: 0,
      flipHorizontal: false,
      flipVertical: false,
    }));
  }, []);

  const handleRotateRight = useCallback(() => {
    setViewerSettings(prev => ({ ...prev, rotation: (prev.rotation + 90) % 360 }));
  }, []);

  const handleRotateLeft = useCallback(() => {
    setViewerSettings(prev => ({ ...prev, rotation: (prev.rotation - 90 + 360) % 360 }));
  }, []);

  const handleFlipHorizontal = useCallback(() => {
    setViewerSettings(prev => ({ ...prev, flipHorizontal: !prev.flipHorizontal }));
  }, []);

  const handleFlipVertical = useCallback(() => {
    setViewerSettings(prev => ({ ...prev, flipVertical: !prev.flipVertical }));
  }, []);

  const handleInvert = useCallback(() => {
    setViewerSettings(prev => ({ ...prev, invert: !prev.invert }));
  }, []);

  // ウィンドウレベル調整
  const handleWindowChange = useCallback((type: 'width' | 'center', value: number[]) => {
    setViewerSettings(prev => ({
      ...prev,
      [type === 'width' ? 'windowWidth' : 'windowCenter']: value[0]
    }));
  }, []);

  // ウィンドウプリセット適用
  const applyWindowPreset = useCallback((preset: { width: number; center: number }) => {
    setViewerSettings(prev => ({
      ...prev,
      windowWidth: preset.width,
      windowCenter: preset.center,
    }));
    toast.success("ウィンドウプリセットを適用しました");
  }, []);

  // 画像ナビゲーション
  const goToNextImage = useCallback(() => {
    if (currentSeries && currentImageIndex < currentSeries.images.length - 1) {
      const nextIndex = currentImageIndex + 1;
      setCurrentImageIndex(nextIndex);
      setCurrentImage(currentSeries.images[nextIndex]);
    }
  }, [currentSeries, currentImageIndex]);

  const goToPrevImage = useCallback(() => {
    if (currentSeries && currentImageIndex > 0) {
      const prevIndex = currentImageIndex - 1;
      setCurrentImageIndex(prevIndex);
      setCurrentImage(currentSeries.images[prevIndex]);
    }
  }, [currentSeries, currentImageIndex]);

  const goToImage = useCallback((index: number) => {
    if (currentSeries && index >= 0 && index < currentSeries.images.length) {
      setCurrentImageIndex(index);
      setCurrentImage(currentSeries.images[index]);
    }
  }, [currentSeries]);

  // 検査選択
  const selectStudy = useCallback((study: Study) => {
    setCurrentStudy(study);
    if (study.series.length > 0) {
      const series = study.series[0];
      setCurrentSeries(series);
      if (series.images.length > 0) {
        setCurrentImage(series.images[0]);
        setCurrentImageIndex(0);
        
        // モダリティに応じたデフォルト設定
        const config = modalityConfig[series.images[0].modality];
        if (config) {
          setViewerSettings(prev => ({
            ...prev,
            windowWidth: config.defaultWindow.width,
            windowCenter: config.defaultWindow.center,
          }));
        }
      }
    }
  }, []);

  // シリーズ選択
  const selectSeries = useCallback((series: Series) => {
    setCurrentSeries(series);
    if (series.images.length > 0) {
      setCurrentImage(series.images[0]);
      setCurrentImageIndex(0);
    }
  }, []);

  // キーボードナビゲーション
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'ArrowRight':
          e.preventDefault();
          goToNextImage();
          break;
        case 'ArrowDown':
        case 'ArrowLeft':
          e.preventDefault();
          goToPrevImage();
          break;
        case ' ':
          e.preventDefault();
          setIsPlaying(prev => !prev);
          break;
        case 'r':
          e.preventDefault();
          handleResetView();
          break;
        case '+':
        case '=':
          e.preventDefault();
          handleZoomIn();
          break;
        case '-':
          e.preventDefault();
          handleZoomOut();
          break;
        case 'i':
          e.preventDefault();
          handleInvert();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, goToNextImage, goToPrevImage, handleResetView, handleZoomIn, handleZoomOut, handleInvert]);

  // エクスポート機能
  const handleExportImage = useCallback(() => {
    if (currentImage) {
      // 実際のアプリケーションではcanvasの内容をエクスポート
      toast.success("画像をエクスポートしました");
    }
  }, [currentImage]);

  const handlePrint = useCallback(() => {
    window.print();
    toast.success("印刷ダイアログを開きました");
  }, []);

  // 測定機能（簡易実装）
  const addMeasurement = useCallback((type: Measurement['type']) => {
    const newMeasurement: Measurement = {
      id: `measure_${Date.now()}`,
      type,
      points: [], // 実際の実装では座標を記録
      value: Math.random() * 100, // サンプル値
      unit: type === 'angle' ? '°' : 'mm',
      label: `${type} 測定`,
      createdAt: new Date().toISOString(),
      createdBy: "現在のユーザー",
    };
    setMeasurements(prev => [...prev, newMeasurement]);
    toast.success(`${type}測定を追加しました`);
  }, []);

  // レポート機能
  const handleAddToReport = useCallback(() => {
    if (currentImage) {
      toast.success("所見をレポートに追加しました");
    }
  }, [currentImage]);

  // 検査一覧の表示
  const renderStudyList = () => (
    <div className="space-y-3">
      {studies.map(study => (
        <Card 
          key={study.id}
          className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
            currentStudy?.id === study.id ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950' : ''
          }`}
          onClick={() => selectStudy(study)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-semibold text-lg mb-1">{study.studyDescription}</h4>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{study.studyDate}</span>
                    <Clock className="w-4 h-4 text-muted-foreground ml-2" />
                    <span>{study.studyTime}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span>{study.referringPhysician}</span>
                    {study.readingPhysician && (
                      <>
                        <span className="text-muted-foreground">→</span>
                        <span>{study.readingPhysician}</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-muted-foreground">番号:</span>
                    <span className="font-mono text-xs">{study.accessionNumber}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end space-y-2">
                <Badge 
                  variant={study.reportStatus === "完了" ? "default" : "secondary"}
                  className={
                    study.reportStatus === "完了" ? "bg-green-500 text-white" :
                    study.reportStatus === "読影中" ? "bg-yellow-500 text-white" :
                    study.reportStatus === "追加依頼" ? "bg-orange-500 text-white" :
                    "bg-gray-500 text-white"
                  }
                >
                  {study.reportStatus}
                </Badge>
                
                {study.urgency !== "通常" && (
                  <Badge variant="destructive" className="text-xs">
                    {study.urgency}
                  </Badge>
                )}
                
                <div className="flex flex-wrap gap-1">
                  {study.modalities.map(modality => {
                    const config = modalityConfig[modality as keyof typeof modalityConfig];
                    return (
                      <Badge 
                        key={modality} 
                        variant="outline" 
                        className={`text-xs ${config?.color || 'bg-gray-100 text-gray-800 border-gray-200'}`}
                      >
                        {config?.icon} {config?.name || modality}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              シリーズ数: {study.series.length} | 
              総画像数: {study.series.reduce((sum, series) => sum + series.imageCount, 0)}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // シリーズ一覧の表示
  const renderSeriesList = () => (
    <div className="space-y-2">
      {currentStudy?.series.map(series => (
        <Card 
          key={series.id}
          className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
            currentSeries?.id === series.id ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950' : ''
          }`}
          onClick={() => selectSeries(series)}
        >
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h5 className="font-medium">{series.seriesDescription}</h5>
                <div className="text-sm text-muted-foreground">
                  シリーズ {series.seriesNumber} | {series.imageCount} 画像
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className={
                  modalityConfig[series.modality as keyof typeof modalityConfig]?.color ||
                  'bg-gray-100 text-gray-800 border-gray-200'
                }>
                  {modalityConfig[series.modality as keyof typeof modalityConfig]?.icon} {series.modality}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )) || []}
    </div>
  );

  // ビューワコントロール
  const renderViewerControls = () => (
    <div className="flex items-center justify-between p-4 border-b bg-gray-50 dark:bg-gray-800">
      {/* 左側: 基本操作 */}
      <div className="flex items-center space-x-2">
        <TooltipProvider>
          <div className="flex items-center space-x-1 border-r pr-2 mr-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={() => setActiveTool("pointer")}>
                  <MousePointer className={`w-4 h-4 ${activeTool === "pointer" ? "text-blue-600" : ""}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>ポインタ (P)</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={() => setActiveTool("pan")}>
                  <Hand className={`w-4 h-4 ${activeTool === "pan" ? "text-blue-600" : ""}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>パン (H)</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={() => setActiveTool("zoom")}>
                  <Search className={`w-4 h-4 ${activeTool === "zoom" ? "text-blue-600" : ""}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>ズーム (Z)</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={() => setActiveTool("measure")}>
                  <Ruler className={`w-4 h-4 ${activeTool === "measure" ? "text-blue-600" : ""}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>測定 (M)</TooltipContent>
            </Tooltip>
          </div>
          
          <div className="flex items-center space-x-1 border-r pr-2 mr-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={handleZoomIn}>
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>拡大 (+)</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={handleZoomOut}>
                  <ZoomOut className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>縮小 (-)</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={handleResetView}>
                  <Target className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>リセット (R)</TooltipContent>
            </Tooltip>
          </div>
          
          <div className="flex items-center space-x-1 border-r pr-2 mr-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={handleRotateLeft}>
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>左回転</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={handleRotateRight}>
                  <RotateCw className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>右回転</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={handleFlipHorizontal}>
                  <FlipHorizontal className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>水平反転</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={handleFlipVertical}>
                  <FlipVertical className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>垂直反転</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={handleInvert}>
                  <Contrast className={`w-4 h-4 ${viewerSettings.invert ? "text-blue-600" : ""}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>階調反転 (I)</TooltipContent>
            </Tooltip>
          </div>
          
          <div className="flex items-center space-x-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={() => setShowOverlays(!showOverlays)}>
                  {showOverlays ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>オーバーレイ表示</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={() => setViewerSettings(prev => ({ ...prev, grid: !prev.grid }))}>
                  <Grid3X3 className={`w-4 h-4 ${viewerSettings.grid ? "text-blue-600" : ""}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>グリッド表示</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>
      
      {/* 右側: 再生コントロール */}
      {currentSeries && currentSeries.imageCount > 1 && (
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={goToPrevImage} disabled={currentImageIndex === 0}>
                  <SkipBack className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>前の画像</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={() => setIsPlaying(!isPlaying)}>
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>再生/停止 (Space)</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={goToNextImage} disabled={currentImageIndex === currentSeries.imageCount - 1}>
                  <SkipForward className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>次の画像</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <div className="flex items-center space-x-2 ml-4">
            <span className="text-sm text-muted-foreground">
              {currentImageIndex + 1} / {currentSeries.imageCount}
            </span>
            <Slider
              value={[currentImageIndex]}
              onValueChange={(value) => goToImage(value[0])}
              max={currentSeries.imageCount - 1}
              step={1}
              className="w-32"
            />
          </div>
        </div>
      )}
    </div>
  );

  // メイン画像表示エリア
  const renderImageViewer = () => (
    <div className="flex-1 relative bg-black">
      {currentImage ? (
        <div className="w-full h-full flex items-center justify-center relative">
          <img
            ref={imageRef}
            src={currentImage.imageUrl}
            alt={currentImage.seriesDescription}
            className="max-w-none max-h-none"
            style={{
              transform: `
                scale(${viewerSettings.zoom}) 
                translate(${viewerSettings.panX}px, ${viewerSettings.panY}px) 
                rotate(${viewerSettings.rotation}deg)
                ${viewerSettings.flipHorizontal ? 'scaleX(-1)' : ''}
                ${viewerSettings.flipVertical ? 'scaleY(-1)' : ''}
              `,
              filter: viewerSettings.invert ? 'invert(1)' : 'none',
            }}
          />
          
          {/* オーバーレイ情報 */}
          {showOverlays && (
            <div className="absolute inset-0 pointer-events-none">
              {/* 左上: 患者情報 */}
              <div className="absolute top-4 left-4 text-white text-sm bg-black/50 backdrop-blur-sm rounded p-2">
                <div className="font-semibold">{currentImage.patientName}</div>
                <div>ID: {currentImage.patientId}</div>
                <div>{currentImage.studyDate} {currentImage.studyTime}</div>
              </div>
              
              {/* 右上: 検査情報 */}
              <div className="absolute top-4 right-4 text-white text-sm bg-black/50 backdrop-blur-sm rounded p-2 text-right">
                <div className="font-semibold">{currentImage.modality}</div>
                <div>{currentImage.seriesDescription}</div>
                <div>{currentImage.institutionName}</div>
              </div>
              
              {/* 左下: 画像情報 */}
              <div className="absolute bottom-4 left-4 text-white text-sm bg-black/50 backdrop-blur-sm rounded p-2">
                <div>WW: {viewerSettings.windowWidth} WC: {viewerSettings.windowCenter}</div>
                <div>Zoom: {(viewerSettings.zoom * 100).toFixed(0)}%</div>
                <div>{currentImage.rows} × {currentImage.columns}</div>
              </div>
              
              {/* 右下: スライス情報 */}
              {currentSeries && currentSeries.imageCount > 1 && (
                <div className="absolute bottom-4 right-4 text-white text-sm bg-black/50 backdrop-blur-sm rounded p-2 text-right">
                  <div>画像 {currentImageIndex + 1} / {currentSeries.imageCount}</div>
                  <div>厚さ: {currentImage.sliceThickness}mm</div>
                  <div>間隔: {currentImage.pixelSpacing.join(' × ')}mm</div>
                </div>
              )}
            </div>
          )}
          
          {/* グリッド */}
          {viewerSettings.grid && (
            <div className="absolute inset-0 pointer-events-none">
              <svg className="w-full h-full">
                <defs>
                  <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                    <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-white">
          <div className="text-center">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">画像を選択してください</p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="flex-shrink-0 px-6 py-4 border-b">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                <Monitor className="w-4 h-4 text-white" />
              </div>
              <div>
                <span>医療画像ビューワ (PACS)</span>
                <div className="text-sm font-normal text-muted-foreground">
                  {patientName} ({patientId}) - {studies.length}件の検査
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={handleExportImage} disabled={!currentImage}>
                      <Download className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>画像出力</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={handlePrint} disabled={!currentImage}>
                      <Printer className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>印刷</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={handleAddToReport} disabled={!currentImage}>
                      <FileText className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>レポートに追加</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </DialogTitle>
          <DialogDescription>
            医療画像の表示・操作・測定が可能な統合ビューワシステム。
            <kbd className="ml-2 px-2 py-1 text-xs bg-gray-100 rounded">←→</kbd> で画像切り替え、
            <kbd className="ml-1 px-2 py-1 text-xs bg-gray-100 rounded">Space</kbd> で再生、
            <kbd className="ml-1 px-2 py-1 text-xs bg-gray-100 rounded">R</kbd> でリセット
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex overflow-hidden">
          {/* 左サイドバー: 検査・シリーズ一覧 */}
          <div className="w-80 border-r bg-background overflow-hidden flex flex-col">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-3 m-2">
                <TabsTrigger value="studies" className="text-xs">検査一覧</TabsTrigger>
                <TabsTrigger value="series" className="text-xs">シリーズ</TabsTrigger>
                <TabsTrigger value="tools" className="text-xs">ツール</TabsTrigger>
              </TabsList>

              <TabsContent value="studies" className="flex-1 overflow-hidden m-0">
                <ScrollArea className="h-full p-4">
                  {renderStudyList()}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="series" className="flex-1 overflow-hidden m-0">
                <ScrollArea className="h-full p-4">
                  {currentStudy ? renderSeriesList() : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Layers className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>検査を選択してください</p>
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="tools" className="flex-1 overflow-hidden m-0">
                <ScrollArea className="h-full p-4">
                  <div className="space-y-4">
                    {/* ウィンドウレベル調整 */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">ウィンドウレベル</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label className="text-xs">幅 (Width): {viewerSettings.windowWidth}</Label>
                          <Slider
                            value={[viewerSettings.windowWidth]}
                            onValueChange={(value) => handleWindowChange('width', value)}
                            min={1}
                            max={4000}
                            step={1}
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">中心 (Center): {viewerSettings.windowCenter}</Label>
                          <Slider
                            value={[viewerSettings.windowCenter]}
                            onValueChange={(value) => handleWindowChange('center', value)}
                            min={-1000}
                            max={3000}
                            step={1}
                            className="mt-2"
                          />
                        </div>
                        
                        {/* プリセット */}
                        {currentImage && windowPresets[currentImage.modality] && (
                          <div className="space-y-2">
                            <Label className="text-xs">プリセット</Label>
                            <div className="grid grid-cols-1 gap-1">
                              {windowPresets[currentImage.modality].map((preset, index) => (
                                <Button
                                  key={index}
                                  variant="outline"
                                  size="sm"
                                  onClick={() => applyWindowPreset(preset)}
                                  className="text-xs h-8"
                                >
                                  {preset.name}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* 測定ツール */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">測定ツール</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addMeasurement('line')}
                            className="text-xs h-8"
                          >
                            <Ruler className="w-3 h-3 mr-1" />
                            長さ
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addMeasurement('circle')}
                            className="text-xs h-8"
                          >
                            <CircleDot className="w-3 h-3 mr-1" />
                            円
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addMeasurement('rectangle')}
                            className="text-xs h-8"
                          >
                            <Square className="w-3 h-3 mr-1" />
                            四角
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addMeasurement('angle')}
                            className="text-xs h-8"
                          >
                            <Target className="w-3 h-3 mr-1" />
                            角度
                          </Button>
                        </div>
                        
                        {measurements.length > 0 && (
                          <div className="mt-3">
                            <Label className="text-xs">測定結果</Label>
                            <div className="space-y-1 mt-2">
                              {measurements.slice(-3).map(measurement => (
                                <div key={measurement.id} className="text-xs p-2 bg-gray-50 dark:bg-gray-800 rounded">
                                  <div className="font-medium">{measurement.label}</div>
                                  <div className="text-muted-foreground">
                                    {measurement.value.toFixed(1)} {measurement.unit}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* 表示設定 */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">表示設定</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs">注釈表示</Label>
                          <Switch
                            checked={viewerSettings.annotations}
                            onCheckedChange={(checked) => 
                              setViewerSettings(prev => ({ ...prev, annotations: checked }))
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-xs">グリッド</Label>
                          <Switch
                            checked={viewerSettings.grid}
                            onCheckedChange={(checked) => 
                              setViewerSettings(prev => ({ ...prev, grid: checked }))
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-xs">測定値</Label>
                          <Switch
                            checked={viewerSettings.measurements}
                            onCheckedChange={(checked) => 
                              setViewerSettings(prev => ({ ...prev, measurements: checked }))
                            }
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* 再生設定 */}
                    {currentSeries && currentSeries.imageCount > 1 && (
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">再生設定</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <Label className="text-xs">再生速度: {playSpeed} FPS</Label>
                            <Slider
                              value={[playSpeed]}
                              onValueChange={(value) => setPlaySpeed(value[0])}
                              min={1}
                              max={30}
                              step={1}
                              className="mt-2"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>

          {/* メインビューワエリア */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {renderViewerControls()}
            {renderImageViewer()}
          </div>
        </div>

        {/* 画像情報パネル（フッター） */}
        {currentImage && (
          <div className="flex-shrink-0 border-t bg-muted/30 p-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-6">
                <div>
                  <span className="text-muted-foreground">検査:</span>
                  <span className="ml-1 font-medium">{currentImage.studyDescription}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">シリーズ:</span>
                  <span className="ml-1 font-medium">{currentImage.seriesDescription}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">撮影日:</span>
                  <span className="ml-1 font-medium">{currentImage.acquisitionDate}</span>
                </div>
                {currentImage.findings && (
                  <div>
                    <span className="text-muted-foreground">所見:</span>
                    <span className="ml-1 font-medium">{currentImage.findings}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className={modalityConfig[currentImage.modality]?.color}>
                  {modalityConfig[currentImage.modality]?.icon} {modalityConfig[currentImage.modality]?.name}
                </Badge>
                <Badge variant={currentImage.reportStatus === "完了" ? "default" : "secondary"}>
                  {currentImage.reportStatus}
                </Badge>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}