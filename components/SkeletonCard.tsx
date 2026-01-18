
import React from 'react';
import { ViewMode } from '../types';

interface SkeletonCardProps {
  viewMode: ViewMode;
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({ viewMode }) => {
  if (viewMode === 'list') {
    return (
      <div className="bg-slate-900/40 rounded-[2rem] border border-slate-800/60 flex flex-col sm:flex-row h-auto sm:h-64 animate-pulse">
        <div className="w-full sm:w-48 h-64 sm:h-auto flex-shrink-0 bg-slate-800/40" />
        <div className="flex-grow p-8 space-y-6">
          <div className="space-y-3">
            <div className="h-8 bg-slate-800/60 rounded-xl w-3/4" />
            <div className="h-4 bg-slate-800/40 rounded-lg w-1/3" />
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-slate-800/30 rounded-lg w-full" />
            <div className="h-4 bg-slate-800/30 rounded-lg w-5/6" />
          </div>
          <div className="flex gap-3 mt-auto">
            <div className="h-8 bg-slate-800/40 rounded-full w-24" />
            <div className="h-8 bg-slate-800/40 rounded-full w-24" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/40 rounded-[2.5rem] border border-slate-800/60 overflow-hidden animate-pulse flex flex-col h-full">
      <div className="aspect-[2/3] bg-slate-800/40" />
      <div className="p-6 space-y-5">
        <div className="flex justify-between items-center">
          <div className="h-6 bg-slate-800/60 rounded-lg w-2/3" />
          <div className="h-5 bg-slate-800/40 rounded-lg w-10" />
        </div>
        <div className="h-3 bg-slate-800/30 rounded-full w-1/2" />
        <div className="space-y-2 pt-2">
          <div className="h-2.5 bg-slate-800/20 rounded-full w-full" />
          <div className="h-2.5 bg-slate-800/20 rounded-full w-4/5" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
