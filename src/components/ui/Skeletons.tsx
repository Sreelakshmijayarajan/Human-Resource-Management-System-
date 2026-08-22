import React from 'react';

export const StatusCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-card space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-200" />
          <div className="space-y-1">
            <div className="h-3 w-24 bg-slate-200 rounded" />
            <div className="h-2 w-16 bg-slate-100 rounded" />
          </div>
        </div>
        <div className="h-8 w-20 bg-slate-200 rounded-xl" />
      </div>
      <div className="h-7 w-32 bg-slate-200 rounded" />
      <div className="h-3 w-full bg-slate-100 rounded" />
    </div>
  );
};

export const ModuleCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-card space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="w-11 h-11 rounded-2xl bg-slate-200" />
        <div className="w-7 h-7 rounded-full bg-slate-100" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-28 bg-slate-200 rounded" />
        <div className="h-3 w-full bg-slate-100 rounded" />
      </div>
      <div className="pt-3 border-t border-slate-50 flex justify-between">
        <div className="h-3 w-20 bg-slate-100 rounded" />
      </div>
    </div>
  );
};

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header skeleton */}
      <div className="space-y-2 animate-pulse">
        <div className="h-8 w-64 bg-slate-200 rounded-xl" />
        <div className="h-4 w-48 bg-slate-100 rounded" />
      </div>

      {/* Quick Status Row Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCardSkeleton />
        <StatusCardSkeleton />
        <StatusCardSkeleton />
        <StatusCardSkeleton />
      </div>

      {/* Module Grid Skeleton */}
      <div className="space-y-4">
        <div className="h-6 w-36 bg-slate-200 rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <ModuleCardSkeleton />
          <ModuleCardSkeleton />
          <ModuleCardSkeleton />
          <ModuleCardSkeleton />
          <ModuleCardSkeleton />
        </div>
      </div>
    </div>
  );
};
