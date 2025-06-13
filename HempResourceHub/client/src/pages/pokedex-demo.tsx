import React from 'react';
import PokedexCard from '@/components/product/PokedexCard';
import { motion } from 'framer-motion';

const sampleProducts = [
  {
    id: 42,
    name: "Hemp Concrete",
    description: "Stronger than traditional concrete while being carbon negative. Revolutionary building material that actually absorbs CO2 over time.",
    imageUrl: "/api/placeholder/400/300",
    type: {
      primary: "Construction",
      secondary: "Energy"
    },
    stats: {
      co2: 92,
      strength: 95,
      eco: 98
    },
    status: "established" as const
  },
  {
    id: 7,
    name: "Hemp Bioplastic",
    description: "100% biodegradable plastic alternative made from hemp fibers. Decomposes in 3-6 months.",
    imageUrl: "/api/placeholder/400/300",
    type: {
      primary: "Plastics",
      secondary: "Automotive"
    },
    stats: {
      co2: 88,
      strength: 72,
      eco: 96
    },
    status: "growing" as const
  },
  {
    id: 124,
    name: "Hemp Battery",
    description: "Supercapacitor technology using hemp-derived carbon nanosheets. 8x more powerful than lithium.",
    imageUrl: "/api/placeholder/400/300",
    type: {
      primary: "Energy",
      secondary: "Automotive"
    },
    stats: {
      co2: 85,
      strength: 91,
      eco: 94
    },
    status: "research" as const
  },
  {
    id: 89,
    name: "Hemp Textiles",
    description: "Durable, antimicrobial fabric that gets softer with each wash. 3x stronger than cotton.",
    imageUrl: "/api/placeholder/400/300",
    type: {
      primary: "Textiles",
      secondary: "Fashion"
    },
    stats: {
      co2: 78,
      strength: 86,
      eco: 91
    },
    status: "established" as const
  },
  {
    id: 156,
    name: "Hemp Graphene",
    description: "Cost-effective graphene alternative for next-gen electronics and energy storage.",
    imageUrl: "/api/placeholder/400/300",
    type: {
      primary: "Energy",
      secondary: "Electronics"
    },
    stats: {
      co2: 81,
      strength: 98,
      eco: 87
    },
    status: "speculative" as const
  },
  {
    id: 23,
    name: "Hemp Medicine",
    description: "Pharmaceutical-grade CBD extracts for pain management and neurological conditions.",
    imageUrl: "/api/placeholder/400/300",
    type: {
      primary: "Medicine",
      secondary: "Cosmetics"
    },
    stats: {
      co2: 65,
      strength: 0,
      eco: 89
    },
    status: "established" as const
  }
];

const PokedexDemo = () => {
  return (
    <div className="min-h-screen bg-gray-950 py-12">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-teal-400 via-purple-400 to-teal-400 bg-clip-text text-transparent">
              HempDex Collection
            </span>
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Explore the complete catalog of hemp-based innovations. Each entry represents a breakthrough
            in sustainable technology.
          </p>
          
          {/* Discovery Counter */}
          <div className="mt-8 inline-flex items-center gap-4 px-6 py-3 bg-gray-900/50 rounded-full border border-teal-500/30">
            <div className="text-sm text-gray-400">Discovered</div>
            <div className="text-2xl font-bold text-teal-400">6/149</div>
            <div className="text-sm text-gray-400">Products</div>
          </div>
        </motion.div>
      </div>
      
      {/* Grid of Pokedex Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sampleProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.4, 
                delay: index * 0.1,
                ease: "easeOut"
              }}
            >
              <PokedexCard
                {...product}
                onClick={() => console.log(`Clicked on ${product.name}`)}
              />
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Filter Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16"
      >
        <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl p-6 border border-gray-800">
          <h2 className="text-xl font-bold text-white mb-4">Filter by Type</h2>
          <div className="flex flex-wrap gap-2">
            {Object.keys(typeColors).map((type) => (
              <button
                key={type}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all
                  bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white
                  hover:shadow-lg hover:shadow-teal-500/20`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Type colors for reference (imported from PokedexCard)
const typeColors = {
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

export default PokedexDemo;