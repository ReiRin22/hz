import { motion } from "framer-motion";
// import { motion } from "motion/react";
import { Check, Scan } from "lucide-react";
import { Input } from "@shared/components/atoms/input";

interface CheckItemProps {
  title: string;
  borderColor: string;
  isConfirmed: boolean;
  confirmedTime?: string;
  onScan: () => void;
  children: React.ReactNode;
  showInput?: boolean;
  inputValue?: string;
  onInputChange?: (value: string) => void;
  inputPlaceholder?: string;
  showScanWaiting?: boolean;
  visualCheck?: boolean;
  onToggle?: () => void;
}

export function CheckItem({
  title,
  borderColor,
  isConfirmed,
  confirmedTime,
  onScan,
  children,
  showInput = false,
  inputValue = "",
  onInputChange,
  inputPlaceholder = "",
  showScanWaiting = true,
  visualCheck = false,
  onToggle,
}: CheckItemProps) {
  const isChecked = isConfirmed || visualCheck;
  
  // Get current date
  const currentDate = new Date().toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  
  return (
    <div className={`relative border-4 ${borderColor} rounded-xl p-6 bg-white`}>
      {confirmedTime && (
        <div className="absolute top-2 right-2 text-sm text-muted-foreground">
          {currentDate} {confirmedTime}
        </div>
      )}
      
      <div className="flex items-start gap-6">
        {/* Confirmation Circle */}
        <div className="flex-shrink-0">
          <motion.div
            className={`w-20 h-20 rounded-full border-4 flex items-center justify-center ${
              isChecked
                ? "bg-green-500 border-green-600"
                : "bg-gray-200 border-gray-300"
            } ${onToggle ? "cursor-pointer hover:opacity-80" : ""}`}
            animate={
              isChecked
                ? {
                    scale: [1, 1.1, 1],
                    transition: { duration: 0.5 },
                  }
                : {}
            }
            onClick={onToggle}
          >
            {isChecked ? (
              <Check className="w-12 h-12 text-white" strokeWidth={4} />
            ) : (
              <div className="w-12 h-12 rounded-full border-4 border-gray-400" />
            )}
          </motion.div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <h3 className="mb-4">{title}</h3>
          <div className="space-y-3">
            {children}
            
            {showInput && onInputChange && (
              <div className="flex gap-2">
                <Input
                  type="password"
                  value={inputValue}
                  onChange={(e) => onInputChange(e.target.value)}
                  placeholder={inputPlaceholder}
                  className="flex-1"
                />
              </div>
            )}
            
            {!isConfirmed && showScanWaiting && (
              <div className="flex items-center gap-2 text-muted-foreground py-2">
                <Scan className="w-5 h-5" />
                <span className="text-sm">バーコードスキャン待ち...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}