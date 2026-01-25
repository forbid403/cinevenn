
import React from 'react';
import { ViewMode } from '../types';

interface SkeletonCardProps {
  viewMode: ViewMode;
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({ viewMode }) => {
  if (viewMode === 'list') {
    return (
      <div className="bg-cream-100  border border-warm-gray-200 flex flex-col sm:flex-row h-auto sm:h-64 animate-pulse">
        <div className="w-full sm:w-48 h-64 sm:h-auto flex-shrink-0 bg-sepia/10" />
        <div className="flex-grow p-8 space-y-6">
          <div className="space-y-3">
            <div className="h-8 bg-sepia/20  w-3/4" />
            <div className="h-4 bg-sepia/15  w-1/3" />
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-sepia/10  w-full" />
            <div className="h-4 bg-sepia/10  w-5/6" />
          </div>
          <div className="flex gap-3 mt-auto">
            <div className="h-8 bg-gold-600/20  w-24" />
            <div className="h-8 bg-gold-600/20  w-24" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream-100  border border-warm-gray-200 overflow-hidden animate-pulse flex flex-col h-full">
      <div className="aspect-[2/3] bg-sepia/10" />
      <div className="p-6 space-y-5">
        <div className="flex justify-between items-center">
          <div className="h-6 bg-sepia/20  w-2/3" />
          <div className="h-5 bg-gold-600/20  w-10" />
        </div>
        <div className="h-3 bg-sepia/15  w-1/2" />
        <div className="space-y-2 pt-2">
          <div className="h-2.5 bg-sepia/10  w-full" />
          <div className="h-2.5 bg-sepia/10  w-4/5" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
