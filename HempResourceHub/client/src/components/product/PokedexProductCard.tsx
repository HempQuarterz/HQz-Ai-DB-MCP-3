import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Zap, Shield, Cloud, Factory, Sprout } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UseProduct } from '@shared/schema';
import { Link } from 'wouter';

interface PokedexProductCardProps {
  product: UseProduct;
  index: number;
  className?: string;
}

const industryIcons: Record<string, React.ElementType> = {
  'Construction': Factory,
  'Agriculture': Sprout,
  'Energy': Zap,
  'Medicine': Shield,
  'Textiles': Leaf,
};

const PokedexProductCard: React.FC<PokedexProductCardProps> = ({
  product,
  index,
  className
}) => {
  const entryNumber = `#${(index + 1).toString().padStart(3, '0')}`;
  
  // Generate random stats for demo (in real app, these would come from the database)
  const stats = {
    co2: Math.floor(Math.random() * 40) + 60, // 60-100
    strength: Math.floor(Math.random() * 50) + 50, // 50-100
    eco: Math.floor(Math.random() * 30) + 70, // 70-100
  };
  
  // Determine status based on commercialization stage
  const getStatus = (stage?: string): 'growing' | 'established' | 'research' | 'speculative' => {
    switch (stage) {
      case 'Commercial':
        return 'established';
      case 'Pilot':
        return 'growing';
      case 'Research':
        return 'research';
      default:
        return 'speculative';
    }
  };
  
  const status = getStatus(product.commercializationStage);
  const Icon = industryIcons[product.industryName] || Leaf;
  
  return (
    <Link href={`/product/${product.id}`}>
      <motion.div
        whileHover={{ scale: 1.02, rotateY: 5, rotateX: -5 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "relative w-full cursor-pointer",
          "transform-gpu perspective-1000",
          className
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
      >
        {/* Holographic Background Layer */}
        <div className="absolute inset-0 holographic rounded-2xl blur-sm opacity-50" />
        
        {/* Main Card */}
        <div className="relative pokedex-border bg-gray-900/95 backdrop-blur-md rounded-2xl overflow-hidden h-full">
          {/* Scan Line Effect */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute inset-x-0 h-px bg-teal-500 animate-scan" />
          </div>
          
          {/* Header */}
          <div className="relative p-4 bg-gradient-to-r from-gray-800/50 to-gray-900/50">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-bold text-white line-clamp-1">{product.name}</h3>
              <span className="text-teal-400 font-mono text-sm animate-pulse-glow">{entryNumber}</span>
            </div>
          </div>
          
          {/* Image Section */}
          <div className="relative h-40 bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
            {product.imageUrl ? (
              <img 
                src={product.imageUrl} 
                alt={product.name}
                className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-hemp-900 to-gray-900">
                <Icon className="w-20 h-20 text-hemp-400 opacity-30 animate-float" />
              </div>
            )}
            
            {/* Status Badge */}
            <div className={cn(
              "absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm",
              `status-${status}`
            )}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </div>
            
            {/* Stats Overlay */}
            <div className="absolute bottom-0 right-0 p-3 bg-gradient-to-tl from-black/80 to-transparent">
              <div className="space-y-1 text-right">
                <StatBar label="CO2" value={stats.co2} icon={<Cloud className="w-3 h-3" />} compact />
                <StatBar label="STR" value={stats.strength} icon={<Shield className="w-3 h-3" />} compact />
                <StatBar label="ECO" value={stats.eco} icon={<Zap className="w-3 h-3" />} compact />
              </div>
            </div>
          </div>
          
          {/* Type Badges */}
          <div className="px-4 py-2 bg-gray-800/50 flex gap-2 flex-wrap">
            <TypeBadge type={product.industryName} />
            {product.plantPartName && <TypeBadge type={product.plantPartName} secondary />}
          </div>
          
          {/* Description */}
          <div className="p-4 flex-grow">
            <p className="text-xs text-gray-300 line-clamp-2">
              {product.description}
            </p>
          </div>
          
          {/* Benefits Preview */}
          {product.sustainabilityBenefits && product.sustainabilityBenefits.length > 0 && (
            <div className="px-4 pb-4">
              <div className="flex gap-1 flex-wrap">
                {product.sustainabilityBenefits.slice(0, 3).map((benefit, idx) => (
                  <span key={idx} className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">
                    {benefit.split(' ').slice(0, 2).join(' ')}...
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Bottom Glow Effect */}
          <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-teal-500 to-transparent" />
        </div>
      </motion.div>
    </Link>
  );
};

const StatBar: React.FC<{ 
  label: string; 
  value: number; 
  icon: React.ReactNode;
  compact?: boolean;
}> = ({ label, value, icon, compact = false }) => {
  const getStatColor = (value: number) => {
    if (value >= 80) return 'text-green-400';
    if (value >= 60) return 'text-yellow-400';
    if (value >= 40) return 'text-orange-400';
    return 'text-red-400';
  };
  
  return (
    <div className={cn("flex items-center gap-1", compact ? "text-xs" : "text-sm")}>
      <div className="flex items-center gap-1">
        {icon}
        <span className="text-gray-400 w-6">{label}:</span>
      </div>
      <div className="flex items-center gap-1">
        <div className={cn(
          "bg-gray-700 rounded-full overflow-hidden",
          compact ? "w-12 h-1" : "w-16 h-1.5"
        )}>
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
        <span className={cn("font-mono", getStatColor(value), compact ? "text-xs" : "text-sm")}>
          {value}
        </span>
      </div>
    </div>
  );
};

const TypeBadge: React.FC<{ type: string; secondary?: boolean }> = ({ type, secondary = false }) => {
  const typeColors: Record<string, string> = {
    'Construction': 'bg-orange-500',
    'Textiles': 'bg-purple-500',
    'Food & Beverage': 'bg-green-500',
    'Medicine': 'bg-red-500',
    'Energy': 'bg-yellow-500',
    'Plastics & Composites': 'bg-blue-500',
    'Paper & Packaging': 'bg-amber-500',
    'Automotive': 'bg-gray-500',
    'Cosmetics': 'bg-pink-500',
    'Agriculture': 'bg-emerald-500',
    // Plant parts
    'Fiber': 'bg-indigo-500',
    'Seeds': 'bg-lime-500',
    'Flowers': 'bg-fuchsia-500',
    'Roots': 'bg-brown-500',
    'Leaves': 'bg-teal-500',
  };
  
  const color = typeColors[type] || 'bg-gray-500';
  
  // Determine text color based on background - use dark text for light backgrounds
  const needsDarkText = [
    'Food & Beverage', 'Energy', 'Paper & Packaging', 'Agriculture', 
    'Seeds', 'Cosmetics'
  ].includes(type);
  const textColor = needsDarkText ? 'text-gray-900' : 'text-white';
  
  return (
    <div className={cn(
      "px-2 py-0.5 rounded-full text-xs font-medium",
      secondary ? 'opacity-80' : '',
      color,
      textColor,
      "backdrop-blur-sm bg-opacity-80",
      needsDarkText && "font-semibold" // Make dark text slightly bolder for better readability
    )}>
      {type}
    </div>
  );
};

export default PokedexProductCard;