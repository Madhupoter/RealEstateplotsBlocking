import React, { useState } from 'react';
import { useAuth, Plot, PlotStatus } from '../contexts/AuthContext';

interface PlotGridProps {
  ventureId: string;
  plots: Plot[];
  isAdmin: boolean;
}

const statusConfig = {
  'in-sale': { color: '#90EE90', label: 'In Sale', textColor: '#006400' },
  'booked': { color: '#FFFF99', label: 'Booked', textColor: '#8B8000' },
  'sold': { color: '#FF9999', label: 'Sold', textColor: '#8B0000' },
  'reserved': { color: '#ADD8E6', label: 'Reserved', textColor: '#000080' },
};

export function PlotGrid({ ventureId, plots, isAdmin }: PlotGridProps) {
  const { updatePlotStatus } = useAuth();
  const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null);

  const maxX = Math.max(...plots.map(p => p.x));
  const maxY = Math.max(...plots.map(p => p.y));

  const handlePlotClick = (plot: Plot) => {
    if (isAdmin) {
      setSelectedPlot(plot);
    }
  };

  const handleStatusUpdate = (plotId: string, status: PlotStatus) => {
    updatePlotStatus(ventureId, plotId, status);
    setSelectedPlot(null);
  };

  const getStatusCounts = () => {
    return Object.keys(statusConfig).reduce((counts, status) => {
      counts[status as PlotStatus] = plots.filter(p => p.status === status).length;
      return counts;
    }, {} as Record<PlotStatus, number>);
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="space-y-6">
      {/* Status Legend */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {Object.entries(statusConfig).map(([status, config]) => (
          <div key={status} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <div
                className="w-6 h-6 rounded-md shadow-sm border border-gray-300"
                style={{ backgroundColor: config.color }}
              />
              <div>
                <p className="font-semibold text-gray-900">{config.label}</p>
                <p className="text-sm text-gray-600">{statusCounts[status as PlotStatus]} plots</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Plot Grid */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div 
          className="grid gap-2 justify-center"
          style={{
            gridTemplateColumns: `repeat(${maxX + 1}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${maxY + 1}, minmax(0, 1fr))`,
          }}
        >
          {plots.map((plot) => (
            <div
              key={plot.id}
              className={`
                relative w-12 h-12 rounded-lg border-2 border-gray-300 shadow-sm
                flex items-center justify-center cursor-pointer
                transition-all duration-200 hover:scale-105 hover:shadow-md
                ${isAdmin ? 'hover:ring-2 hover:ring-blue-400' : ''}
              `}
              style={{ 
                backgroundColor: statusConfig[plot.status].color,
                gridColumn: plot.x + 1,
                gridRow: plot.y + 1,
              }}
              onClick={() => handlePlotClick(plot)}
              title={`${plot.plotNumber} - ${statusConfig[plot.status].label}`}
            >
              <span 
                className="text-xs font-bold"
                style={{ color: statusConfig[plot.status].textColor }}
              >
                {plot.plotNumber.replace('P', '')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Plot Status Modal */}
      {selectedPlot && isAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Update Plot {selectedPlot.plotNumber}
            </h3>
            <p className="text-gray-600 mb-6">
              Current Status: <span className="font-semibold">{statusConfig[selectedPlot.status].label}</span>
            </p>
            
            <div className="space-y-3">
              {Object.entries(statusConfig).map(([status, config]) => (
                <button
                  key={status}
                  onClick={() => handleStatusUpdate(selectedPlot.id, status as PlotStatus)}
                  className={`
                    w-full flex items-center space-x-3 p-3 rounded-xl border-2 transition-all duration-200
                    ${selectedPlot.status === status 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }
                  `}
                >
                  <div
                    className="w-6 h-6 rounded-md border border-gray-300"
                    style={{ backgroundColor: config.color }}
                  />
                  <span className="font-medium text-gray-900">{config.label}</span>
                </button>
              ))}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setSelectedPlot(null)}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}