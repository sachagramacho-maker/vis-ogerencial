import React from 'react';

interface CircularProgressProps {
  externalPercentage: number; // Previsto (externo)
  internalPercentage: number; // Realizado (interno)
  size?: number;
  strokeWidth?: number;
  externalColor?: string;
  internalColor?: string;
  label?: string;
  internalRadiusRatio?: number; // Proporção do raio interno em relação ao externo
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  externalPercentage,
  internalPercentage,
  size = 100,
  strokeWidth = 8,
  externalColor = '#0ea5e9', // Tailwind sky-500
  internalColor = '#22c55e', // Tailwind green-500
  label,
  internalRadiusRatio = 0.7, // O círculo interno terá 70% do tamanho do externo por padrão
}) => {
  const radius = (size - strokeWidth) / 2;
  const internalRadius = radius * internalRadiusRatio;
  const circumference = 2 * Math.PI * radius;
  const internalCircumference = 2 * Math.PI * internalRadius;
  
  const externalStrokeDashoffset = circumference - (externalPercentage / 100) * circumference;
  const internalStrokeDashoffset = internalCircumference - (internalPercentage / 100) * internalCircumference;
  
  const center = size / 2;
  
  return (
    <div className="relative inline-flex flex-col items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Background circles */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#e5e7eb" // Tailwind gray-200
          strokeWidth={strokeWidth}
        />
        <circle
          cx={center}
          cy={center}
          r={internalRadius}
          fill="none"
          stroke="#e5e7eb" // Tailwind gray-200
          strokeWidth={strokeWidth}
        />
        
        {/* External circle - Previsto */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={externalColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={externalStrokeDashoffset}
          strokeLinecap="round"
        />
        
        {/* Internal circle - Realizado */}
        <circle
          cx={center}
          cy={center}
          r={internalRadius}
          fill="none"
          stroke={internalColor}
          strokeWidth={strokeWidth}
          strokeDasharray={internalCircumference}
          strokeDashoffset={internalStrokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      
      {/* External percentage display (outside the circle) */}
      <div className="absolute -top-8 left-0 right-0 flex justify-center">
        <div className="text-xl font-bold">{externalPercentage}%</div>
      </div>
      
      {/* Internal percentage display (inside the circle) */}
      <div className="absolute flex items-center justify-center">
        <div className="text-sm font-medium text-gray-700">{internalPercentage}%</div>
      </div>
      
      {/* Label display */}
      {label && <div className="absolute -bottom-6 left-0 right-0 text-center text-xs text-gray-500">{label}</div>}
    </div>
  );
};

export default CircularProgress;