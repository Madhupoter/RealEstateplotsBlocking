import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { VentureCard } from './VentureCard';
import { PlotGrid } from './PlotGrid';
import { Plus, ArrowLeft, Trash2, Building2 } from 'lucide-react';

export function Dashboard() {
  const { user, ventures, addVenture, deleteVenture } = useAuth();
  const [selectedVenture, setSelectedVenture] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newVenture, setNewVenture] = useState({
    name: '',
    description: '',
    totalPlots: 50,
  });

  const isAdmin = user?.role === 'admin';
  const currentVenture = ventures.find(v => v.id === selectedVenture);

  const handleAddVenture = (e: React.FormEvent) => {
    e.preventDefault();
    const plots = Array.from({ length: newVenture.totalPlots }, (_, i) => {
      const gridSize = Math.ceil(Math.sqrt(newVenture.totalPlots));
      const row = Math.floor(i / gridSize);
      const col = i % gridSize;
      return {
        id: `plot-${Date.now()}-${i + 1}`,
        plotNumber: `P${(i + 1).toString().padStart(3, '0')}`,
        status: 'in-sale' as const,
        x: col,
        y: row,
      };
    });

    addVenture({
      ...newVenture,
      plots,
    });

    setNewVenture({ name: '', description: '', totalPlots: 50 });
    setShowAddForm(false);
  };

  if (selectedVenture && currentVenture) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Venture Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSelectedVenture(null)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back to Ventures</span>
                </button>
                <div className="h-6 w-px bg-gray-300" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{currentVenture.name}</h1>
                  <p className="text-gray-600">{currentVenture.description}</p>
                </div>
              </div>
              {isAdmin && (
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this venture?')) {
                      deleteVenture(selectedVenture);
                      setSelectedVenture(null);
                    }
                  }}
                  className="flex items-center space-x-2 bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2 rounded-xl transition-all duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Venture</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Plot Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PlotGrid 
            ventureId={selectedVenture}
            plots={currentVenture.plots} 
            isAdmin={isAdmin} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isAdmin ? 'Admin Dashboard' : 'Agent Dashboard'}
              </h1>
              <p className="text-gray-600 mt-2">
                {isAdmin 
                  ? 'Manage your real estate ventures and plot status' 
                  : 'View available plots and venture information'
                }
              </p>
            </div>
            {isAdmin && (
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5" />
                <span>Add Venture</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Ventures Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {ventures.length === 0 ? (
          <div className="text-center py-16">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Ventures Found</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first real estate venture.</p>
            {isAdmin && (
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-200"
              >
                Create Your First Venture
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ventures.map((venture) => (
              <VentureCard
                key={venture.id}
                venture={venture}
                onClick={() => setSelectedVenture(venture.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Venture Modal */}
      {showAddForm && isAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Venture</h2>
            <form onSubmit={handleAddVenture} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Venture Name
                </label>
                <input
                  type="text"
                  value={newVenture.name}
                  onChange={(e) => setNewVenture(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., Sunset Valley"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newVenture.description}
                  onChange={(e) => setNewVenture(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  rows={3}
                  placeholder="Brief description of the venture"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Total Plots
                </label>
                <input
                  type="number"
                  value={newVenture.totalPlots}
                  onChange={(e) => setNewVenture(prev => ({ ...prev, totalPlots: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  min="1"
                  max="500"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-3 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 font-semibold"
                >
                  Create Venture
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}