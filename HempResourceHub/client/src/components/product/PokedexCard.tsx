import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Zap, Shield, Cloud } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PokedexCardProps {
  id: number;
  name: string;
  description: string;
  imageUrl?: string;
  type: {
    primary: string;
    secondary?: string;
  };
  stats: {
    co2: number; // CO2 reduction score (0-100)
    strength: number; // Material strength (0-100)
    eco: number; // Eco-friendliness (0-100)
  };
  status?: 'growing' | 'established' | 'research' | 'speculative';
  className?: string;
  onClick?: () => void;
}

const typeColors: Record<string, string> = {
  'Construction': 'bg-orange-500',
  'Textiles': 'bg-purple-500',
  'Food': 'bg-green-500',
  'Medicine': 'bg-red-500',
  'Energy': 'bg-yellow-500',
  'Plastics': 'bg-blue-500',
  'Paper': 'bg-amber-500',
  'Automotive': 'bg-gray-500',
  'Cosmetics': 'bg-pink-500',
  'Agriculture': 'bg-emerald-500',
};

const PokedexCard: React.FC<PokedexCardProps> = ({
  id,
  name,
  description,
  imageUrl,
  type,
  stats,
  status = 'established',
  className,
  onClick
}) => {
  const entryNumber = `#${id.toString().padStart(3, '0')}`;
  
  return (
    <motion.div
      whileHover={{ scale: 1.02, rotateY: 5, rotateX: -5 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative w-full max-w-sm cursor-pointer",
        "transform-gpu perspective-1000",
        className
      )}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Holographic Background Layer */}
      <div className="absolute inset-0 holographic rounded-2xl blur-sm opacity-50" />
      
      {/* Main Card */}
      <div className="relative pokedex-border bg-gray-900/95 backdrop-blur-md rounded-2xl overflow-hidden">
        {/* Scan Line Effect */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute inset-x-0 h-px bg-teal-500 animate-scan" />
        </div>
        
        {/* Header */}
        <div className="relative p-4 bg-gradient-to-r from-gray-800/50 to-gray-900/50">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-white">{name}</h3>
            <span className="text-teal-400 font-mono text-sm">{entryNumber}</span>
          </div>
        </div>
        
        {/* Image Section */}
        <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={name}
              className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Leaf className="w-24 h-24 text-hemp-400 opacity-20" />
            </div>
          )}
          
          {/* Status Badge */}
          <div className={cn(
            "absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-medium",
            `status-${status}`
          )}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </div>
          
          {/* Stats Overlay */}
          <div className="absolute bottom-0 right-0 p-4 bg-gradient-to-tl from-black/80 to-transparent">
            <div className="space-y-1 text-right">
              <StatBar label="CO2" value={stats.co2} icon={<Cloud className="w-3 h-3" />} />
              <StatBar label="STR" value={stats.strength} icon={<Shield className="w-3 h-3" />} />
              <StatBar label="ECO" value={stats.eco} icon={<Zap className="w-3 h-3" />} />
            </div>
          </div>
        </div>
        
        {/* Type Badges */}
        <div className="px-4 py-3 bg-gray-800/50 flex gap-2">
          <TypeBadge type={type.primary} />
          {type.secondary && <TypeBadge type={type.secondary} />}
        </div>
        
        {/* Description */}
        <div className="p-4">
          <p className="text-sm text-gray-300 line-clamp-2">
            {description}
          </p>
        </div>
        
        {/* Bottom Glow Effect */}
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-teal-500 to-transparent" />
      </div>
    </motion.div>
  );
};

const StatBar: React.FC<{ label: string; value: number; icon: React.ReactNode }> = ({ label, value, icon }) => {
  const getStatColor = (value: number) => {
    if (value >= 80) return 'text-green-400';
    if (value >= 60) return 'text-yellow-400';
    if (value >= 40) return 'text-orange-400';
    return 'text-red-400';
  };
  
  return (
    <div className="flex items-center gap-2 text-xs">
      <div className="flex items-center gap-1">
        {icon}
        <span className="text-gray-400 w-8">{label}:</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
          <motion.div 
            className={cn("h-full rounded-full", getStatColor(value))}
            style={{ 
              width: `${value}%`,
              background: `linear-gradient(90deg, currentColor, transparent)`
            }}
            initial={{ width: 0 }}
            animate={{ width: `${value}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        <span className={cn("font-mono text-xs", getStatColor(value))}>
          {value}
        </span>
      </div>
    </div>
  );
};

const TypeBadge: React.FC<{ type: string }> = ({ type }) => {
  const color = typeColors[type] || 'bg-gray-500';
  
  // Determine text color based on background - use dark text for light backgrounds
  const needsDarkText = ['Food', 'Energy', 'Paper', 'Agriculture'].includes(type);
  const textColor = needsDarkText ? 'text-gray-900' : 'text-white';
  
  return (
    <div className={cn(
      "px-3 py-1 rounded-full text-xs font-medium",
      color,
      textColor,
      "backdrop-blur-sm bg-opacity-80",
      needsDarkText && "font-semibold" // Make dark text slightly bolder for better readability
    )}>
      {type}
    </div>
  );
};

export default PokedexCard;