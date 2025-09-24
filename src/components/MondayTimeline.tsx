import React from 'react';
import { RefreshCw, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { TimelineElement } from '../services/mondayService';

interface MondayTimelineProps {
  timelineData: TimelineElement[];
  isLoading: boolean;
  error: string | null;
  onRefetch: () => void;
}

// Componente de progresso circular duplo com cores Monday.com
const MondayCircularProgress: React.FC<{
  previsto: number;
  realizado: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  status?: string;
}> = ({
  previsto,
  realizado,
  size = 60,
  strokeWidth = 3,
  label,
  status
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const center = size / 2;

  // Cálculo do progresso para os círculos
  const previstoOffset = circumference - (previsto / 100) * circumference;
  const realizadoOffset = circumference - (realizado / 100) * circumference;

  // Cores específicas para Monday.com
  const previstoColor = '#00C875'; // Verde Monday.com para previsto (externo)
  const realizadoColor = '#0073EA'; // Azul Monday.com para realizado (interno)
  
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
          
          {/* Círculo externo - Previsto (VERDE) */}
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
            r={radius - strokeWidth - 2}
            stroke="#f3f4f6"
            strokeWidth={strokeWidth - 1}
            fill="transparent"
          />
          
          {/* Círculo interno - Realizado (AZUL) */}
          <circle
            cx={center}
            cy={center}
            r={radius - strokeWidth - 2}
            stroke={finalRealizadoColor}
            strokeWidth={strokeWidth - 1}
            fill="transparent"
            strokeDasharray={circumference - (strokeWidth + 2) * 2 * Math.PI / radius}
            strokeDashoffset={realizadoOffset * (radius - strokeWidth - 2) / radius}
            strokeLinecap="round"
            className="transition-all duration-500 ease-in-out"
          />
        </svg>
        
        {/* Percentual realizado no centro */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-sm font-bold text-gray-700">
            {realizado}%
          </div>
        </div>
      </div>
      
      {/* Label */}
      {label && (
        <div className="mt-2 text-center">
          <div className="text-xs font-medium text-gray-700 max-w-[70px] leading-tight">
            {label}
          </div>
        </div>
      )}
    </div>
  );
};

export const MondayTimeline: React.FC<MondayTimelineProps> = ({
  timelineData,
  isLoading,
  error,
  onRefetch
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
          <span className="text-gray-600">Carregando dados do Monday.com...</span>
        </div>
      </div>
    );
  }

  // Dividir dados em duas fileiras (6 elementos cada)
  const topRow = timelineData.slice(0, 6);
  const bottomRow = timelineData.slice(6, 12);

  // Encontrar atividade atual (primeira com status in_progress ou delayed)
  const currentActivityIndex = timelineData.findIndex(item => 
    item.status === 'in_progress' || item.status === 'delayed'
  );

  // Encontrar próxima atividade (primeira pendente após a atual)
  const nextActivityIndex = timelineData.findIndex((item, index) => 
    index > currentActivityIndex && item.status === 'pending'
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Cabeçalho com status de conexão */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {error ? (
              <WifiOff className="text-orange-500" size={20} />
            ) : (
              <Wifi className="text-green-500" size={20} />
            )}
            <h2 className="text-xl font-bold text-gray-900">Timeline do Projeto</h2>
          </div>
          <span className="text-sm text-gray-500">
            (Monday.com Board: 9397640249)
          </span>
        </div>
        
        <button
          onClick={onRefetch}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          title="Atualizar dados do Monday.com"
        >
          <RefreshCw size={16} />
          Atualizar
        </button>
      </div>

      {/* Alerta de erro/status */}
      {error && (
        <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="text-orange-500" size={16} />
          <span className="text-sm text-orange-700">{error}</span>
        </div>
      )}

      {/* Legenda */}
      <div className="flex justify-end items-center gap-6 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-500"></div>
          <span className="text-sm text-gray-600">Previsto (Externo)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-500"></div>
          <span className="text-sm text-gray-600">Realizado (Interno)</span>
        </div>
      </div>

      {/* Timeline */}
      <div className="mb-6">
        <div className="relative">
          {/* Medidores circulares superiores */}
          <div className="flex justify-between items-center mb-3">
            {topRow.map((item, index) => (
              <div key={item.id} className="flex flex-col items-center relative">
                {/* Percentual previsto acima */}
                <div className="text-sm font-bold text-gray-700 mb-1">{item.previsto}%</div>
                
                {/* Seta indicando atividade atual */}
                {index === (currentActivityIndex % 6) && currentActivityIndex < 6 && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                    <div className="text-red-600 text-xl font-bold">↓</div>
                  </div>
                )}
                
                <MondayCircularProgress
                  previsto={item.previsto}
                  realizado={item.realizado}
                  size={60}
                  label={item.name}
                  status={item.status}
                />
                <div className="text-xs text-center mt-2 max-w-[60px] leading-tight text-gray-600">
                  {item.name}
                </div>
              </div>
            ))}
          </div>

          {/* Linha do tempo horizontal */}
          <div className="relative my-4">
            <div className="absolute h-0.5 bg-blue-500 left-0 right-0 top-1/2 transform -translate-y-1/2"></div>
            <div className="flex justify-between relative">
              {Array.from({ length: 12 }).map((_, index) => (
                <div key={index} className="w-2 h-2 rounded-full bg-blue-600 z-10 relative"></div>
              ))}
            </div>
            
            {/* Setas nas extremidades */}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4">
              <div className="text-blue-600 text-lg">←</div>
            </div>
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4">
              <div className="text-blue-600 text-lg">→</div>
            </div>
          </div>

          {/* Medidores circulares inferiores */}
          <div className="flex justify-between items-center">
            {bottomRow.map((item, index) => (
              <div key={item.id} className="flex flex-col items-center relative">
                <div className="text-xs text-center mb-2 max-w-[60px] leading-tight text-gray-600">
                  {item.name}
                </div>
                
                {/* Seta indicando próxima atividade */}
                {(index + 6) === nextActivityIndex && (
                  <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
                    <div className="text-blue-600 text-xl font-bold">↑</div>
                  </div>
                )}
                
                <MondayCircularProgress
                  previsto={item.previsto}
                  realizado={item.realizado}
                  size={60}
                  label={item.name}
                  status={item.status}
                />
                <div className="text-sm font-bold text-gray-700 mt-2">{item.previsto}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Informações adicionais */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-3">Informações da Integração</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Total de Elementos:</span>
            <div className="text-lg font-bold text-blue-600">{timelineData.length}</div>
          </div>
          <div>
            <span className="font-medium text-gray-700">Concluídos:</span>
            <div className="text-lg font-bold text-green-600">
              {timelineData.filter(item => item.status === 'completed').length}
            </div>
          </div>
          <div>
            <span className="font-medium text-gray-700">Em Andamento:</span>
            <div className="text-lg font-bold text-yellow-600">
              {timelineData.filter(item => item.status === 'in_progress').length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};