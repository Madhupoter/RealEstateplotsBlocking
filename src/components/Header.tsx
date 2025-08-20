import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, Shield, Building } from 'lucide-react';

export function Header() {
    const { user, logout } = useAuth();

    return (
        <header className="bg-white shadow-lg border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-3">
                            <Building className="w-8 h-8 text-blue-600" />
                            <h1 className="text-2xl font-bold text-gray-900">RealEstate Pro</h1>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-3 bg-gray-50 px-4 py-2 rounded-xl">
                            {user?.role === 'admin' ? (
                                <Shield className="w-5 h-5 text-blue-600" />
                            ) : (
                                <User className="w-5 h-5 text-green-600" />
                            )}
                            <div className="text-sm">
                                <p className="font-semibold text-gray-900">{user?.username}</p>
                                <p className="text-gray-500 capitalize">{user?.role}</p>
                            </div>
                        </div>

                        <button
                            onClick={logout}
                            className="flex items-center space-x-2 bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2 rounded-xl transition-all duration-200 font-medium"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}