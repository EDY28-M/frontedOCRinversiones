import React from 'react';

const TableLoader = ({ columns = [], rows = 5 }) => {
  // Default columns if none provided
  const defaultColumns = [
    'w-16', // ID
    'w-1/4', // Name
    'w-1/3', // Description
    'w-32', // Actions
  ];

  const cols = columns.length > 0 ? columns : defaultColumns;

  return (
    <div className="p-4 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="h-4 bg-gray-200 rounded w-64" />
        </div>
        <div className="flex gap-3">
           <div className="h-10 w-32 bg-gray-200 rounded" />
           <div className="h-10 w-40 bg-gray-200 rounded" />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-white border border-gray-200 shadow-sm">
        <div className="border-b border-gray-200 bg-gray-100 p-3 flex gap-4">
          {cols.map((width, index) => (
             <div key={`head-${index}`} className={`h-4 bg-gray-300 rounded ${width}`} />
          ))}
        </div>
        
        <div className="divide-y divide-gray-100">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="p-4 flex items-center gap-4">
               {cols.map((width, colIndex) => (
                 <div key={`cell-${rowIndex}-${colIndex}`} className={`h-4 bg-gray-100 rounded ${width}`} />
               ))}
            </div>
          ))}
        </div>
      </div>
      
      <p className="text-center text-sm text-slate-500 mt-4">Cargando datos...</p>
    </div>
  );
};

export default TableLoader;
