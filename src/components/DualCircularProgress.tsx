import React from 'react';
import { getProgressColor, getStatusIcon, getStatusColor } from '../data/projectProgressData';

interface DualCircularProgressProps {
  previsto: number;
  realizado: number;
  size?: number;
  strokeWidth?: number;
  showPercentage?: boolean;
  showOnlyInternal?: boolean;
  label?: string;
  status?: string;
}

export const DualCircularProgress: React.FC<DualCircularProgressProps> = ({
  previsto,
  realizado,
  size = 70,
  strokeWidth = 4,
  showPercentage = true,
  showOnlyInternal = false,
  label,
  status
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const center = size / 2;

  // Cálculo do progresso para os círculos
  const previstoOffset = circumference - (previsto / 100) * circumference;
  const realizadoOffset = circumference - (realizado / 100) * circumference;

  // Cores
  const previstoColor = '#0891b2'; // Azul ciano para meta (externo)
  const realizadoColor = getProgressColor(previsto, realizado);
  const statusColor = status ? getStatusColor(status) : '#6b7280';
  const statusIcon = status ? getStatusIcon(status) : '';

  // Determinar se deve usar cores ativas ou inativas
  const isActive = previsto > 0 || realizado > 0;
  const finalPrevistoColor = isActive ? previstoColor : '#d1d5db';
  const finalRealizadoColor = isActive ? realizadoColor : '#d1d5db';

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Círculo de fundo */}
        <svg
          className="transform -rotate-90"
          width={size}
          height={size}
        >
          {/* Círculo de fundo externo */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#f3f4f6"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          
          {/* Círculo externo - Meta (Previsto) */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke={finalPrevistoColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={previstoOffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-in-out"
          />
          
          {/* Círculo de fundo interno */}
          <circle
            cx={center}
            cy={center}
            r={radius - strokeWidth - 3}
            stroke="#f3f4f6"
            strokeWidth={strokeWidth - 1}
            fill="transparent"
          />
          
          {/* Círculo interno - Realizado */}
          <circle
            cx={center}
            cy={center}
            r={radius - strokeWidth - 3}
            stroke={finalRealizadoColor}
            strokeWidth={strokeWidth - 1}
            fill="transparent"
            strokeDasharray={circumference - (strokeWidth + 3) * 2 * Math.PI / radius}
            strokeDashoffset={realizadoOffset * (radius - strokeWidth - 3) / radius}
            strokeLinecap="round"
            className="transition-all duration-500 ease-in-out"
          />
        </svg>
        
        {/* Conteúdo central */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {showPercentage && !showOnlyInternal && (
            <>
              <div className="text-base font-bold text-gray-900">
                {realizado}%
              </div>
              <div className="text-xs text-gray-500">
                Meta: {previsto}%
              </div>
            </>
          )}
          
          {showPercentage && showOnlyInternal && (
            <div className="text-base font-bold text-gray-700">
              {realizado}%
            </div>
          )}
          
          {/* Ícone de status */}
          {status && (
            <div 
              className="text-sm font-bold mt-1"
              style={{ color: statusColor }}
            >
              {statusIcon}
            </div>
          )}
        </div>
      </div>
      
      {/* Label */}
      {label && (
        <div className="mt-2 text-center">
          <div className="text-xs font-medium text-gray-700 max-w-[80px] leading-tight">
            {label}
          </div>
        </div>
      )}
    </div>
  );
};

export default DualCircularProgress;