import React from 'react';
import { Venture, PlotStatus } from '../contexts/AuthContext';
import { MapPin, BarChart3, TrendingUp } from 'lucide-react';

interface VentureCardProps {
  venture: Venture;
  onClick: () => void;
}

const statusConfig = {
  'in-sale': { color: '#90EE90', label: 'In Sale' },
  'booked': { color: '#FFFF99', label: 'Booked' },
  'sold': { color: '#FF9999', label: 'Sold' },
  'reserved': { color: '#ADD8E6', label: 'Reserved' },
};

export function VentureCard({ venture, onClick }: VentureCardProps) {
  const getStatusCounts = () => {
    return Object.keys(statusConfig).reduce((counts, status) => {
      counts[status as PlotStatus] = venture.plots.filter(p => p.status === status).length;
      return counts;
    }, {} as Record<PlotStatus, number>);
  };

  const statusCounts = getStatusCounts();
  const soldPercentage = Math.round((statusCounts.sold / venture.totalPlots) * 100);

  return (
    <div 
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200 hover:border-blue-300 group"
      onClick={onClick}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
              {venture.name}
            </h3>
            <p className="text-gray-600 text-sm mb-3">{venture.description}</p>
            <div className="flex items-center text-gray-500 text-sm">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{venture.totalPlots} Total Plots</span>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center text-green-600 font-semibold">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>{soldPercentage}% Sold</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${soldPercentage}%` }}
          />
        </div>

        {/* Status Grid */}
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(statusConfig).map(([status, config]) => (
            <div key={status} className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: config.color }}
              />
              <span className="text-sm text-gray-700">
                {config.label}: <span className="font-semibold">{statusCounts[status as PlotStatus]}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 rounded-b-2xl border-t border-gray-200 group-hover:bg-blue-50 transition-colors duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-600 text-sm">
            <BarChart3 className="w-4 h-4 mr-2" />
            <span>View Layout</span>
          </div>
          <div className="text-blue-600 group-hover:text-blue-700 text-sm font-medium">
            Click to explore →
          </div>
        </div>
      </div>
    </div>
  );
}