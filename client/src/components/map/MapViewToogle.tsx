import { MapPin, Mountain } from 'lucide-react';
import { motion } from 'framer-motion';

interface MapViewToggleProps {
  is3DMode: boolean;
  onToggle: () => void;
}

export function MapViewToggle({ is3DMode, onToggle }: MapViewToggleProps) {
  return (
    <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 backdrop-blur-xl rounded-full shadow-2xl border border-gray-700/50 p-1">
      <div className="flex items-center gap-1">
        {/* 2D Option */}
        <button
          onClick={() => !is3DMode || onToggle()}
          className={`
            relative px-4 py-2 rounded-full transition-all duration-300
            flex items-center gap-2 font-medium text-sm
            ${!is3DMode 
              ? 'text-white' 
              : 'text-gray-400 hover:text-gray-300'
            }
          `}
        >
          {!is3DMode && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-gray-900 dark rounded-full shadow-lg"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <MapPin className={`w-4 h-4 relative z-10 ${!is3DMode ? 'drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]' : ''}`} />
          <span className="hidden sm:inline relative z-10">2D</span>
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-700/50" />

        {/* 3D Option */}
        <button
          onClick={() => is3DMode || onToggle()}
          className={`
            relative px-4 py-2 rounded-full transition-all duration-300
            flex items-center gap-2 font-medium text-sm
            ${is3DMode 
              ? 'text-white' 
              : 'text-gray-400 hover:text-gray-300'
            }
          `}
        >
          {is3DMode && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-gray-900 dark rounded-full shadow-lg"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <Mountain className={`w-4 h-4 relative z-10 ${is3DMode ? 'drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]' : ''}`} />
          <span className="hidden sm:inline relative z-10">3D</span>
        </button>
      </div>
    </div>
  );
}