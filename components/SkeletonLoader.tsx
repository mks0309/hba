
import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const SkeletonLoader: React.FC<SkeletonProps> = ({ className = "" }) => {
  return (
    <div className={`bg-slate-200 rounded-md animate-pulse ${className}`} />
  );
};
