import React from 'react';
import { Clock, TrendingUp, Plus, Trash2, ChevronUp, ChevronDown, Edit3 } from 'lucide-react';
import { ProgressPhase, getPhaseStatus, getStatusIcon, getStatusColor } from '../data/projectProgressData';
import { DualCircularProgress } from './DualCircularProgress';

interface EditableFieldProps {
  value: string;
  onSave: (value: string) => void;
  placeholder?: string;
  className?: string;
  type?: 'text' | 'number';
  min?: number;
  max?: number;
}

const EditableField: React.FC<EditableFieldProps> = ({ 
  value, 
  onSave, 
  placeholder, 
  className, 
  type = 'text',
  min,
  max
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editValue, setEditValue] = React.useState(value);

  const handleSave = () => {
    let finalValue = editValue;
    
    if (type === 'number') {
      const numValue = parseFloat(editValue);
      if (!isNaN(numValue)) {
        if (min !== undefined && numValue < min) finalValue = min.toString();
        if (max !== undefined && numValue > max) finalValue = max.toString();
      } else {
        finalValue = '0';
      }
    }
    
    onSave(finalValue);
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditValue(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <input
        type={type}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyPress}
        className={`${className} border-2 border-blue-500 rounded px-2 py-1 focus:outline-none`}
        placeholder={placeholder}
        autoFocus
        min={min}
        max={max}
      />
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className={`${className} cursor-pointer hover:bg-gray-50 rounded px-2 py-1 min-h-[2rem] flex items-center`}
    >
      {value || placeholder}
    </div>
  );
};

interface ProgressTimelineProps {
  phases: ProgressPhase[];
  onUpdatePhase: (phaseId: string, field: keyof ProgressPhase, value: any) => void;
  onAddPhase: (name?: string) => void;
  onRemovePhase: (phaseId: string) => void;
  onReorderPhases: (fromIndex: number, toIndex: number) => void;
}

export const ProgressTimeline: React.FC<ProgressTimelineProps> = ({
  phases = [],
  onUpdatePhase,
  onAddPhase,
  onRemovePhase,
  onReorderPhases
}) => {
  if (!phases || phases.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="text-blue-600" size={24} />
          <h2 className="text-xl font-bold text-gray-900">Visualização de Progresso</h2>
        </div>
        <p className="text-gray-500 text-center py-8">Nenhuma fase configurada ainda.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <TrendingUp className="text-blue-600" size={24} />
          <h2 className="text-xl font-bold text-gray-900">Visualização de Progresso</h2>
        </div>
        <button
          onClick={() => onAddPhase()}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          title="Adicionar nova fase"
        >
          <Plus size={16} />
          Adicionar Fase
        </button>
      </div>

      {/* Timeline principal */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {phases.map((phase, index) => {
            const status = getPhaseStatus(phase.previsto, phase.realizado);
            const statusColor = getStatusColor(status);
            const statusIcon = getStatusIcon(status);
            
            return (
              <div key={phase.id} className="flex flex-col items-center relative">
                {/* Linha conectora */}
                {index < phases.length - 1 && (
                  <div className="absolute top-4 left-8 w-full h-0.5 bg-gray-300 z-0" />
                )}
                
                {/* Círculo do status */}
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm z-10"
                  style={{ backgroundColor: statusColor }}
                >
                  {statusIcon}
                </div>
                
                {/* Nome da fase */}
                <div className="mt-2 text-xs text-center max-w-[100px] leading-tight">
                  {phase.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Medidores circulares - Layout horizontal espaçado como na imagem */}
      <div className="flex justify-between items-center mb-8 px-4">
        {phases.map((phase, index) => {
          const status = getPhaseStatus(phase.previsto, phase.realizado);
          
          return (
            <div key={phase.id} className="flex flex-col items-center" style={{ minWidth: '90px' }}>
              <DualCircularProgress
                previsto={phase.previsto}
                realizado={phase.realizado}
                size={85}
                label={phase.name}
                status={status}
              />
              {/* Nome da fase abaixo da circunferência */}
              <div className="mt-2 text-xs text-center max-w-[85px] leading-tight font-medium text-gray-700">
                {phase.name}
              </div>
            </div>
          );
        })}
      </div>

      {/* Painel de entrada de dados */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Clock size={20} />
          Entrada de Dados de Progresso
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {phases.map((phase, index) => (
            <div key={phase.id} className="bg-white p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-3">
                <EditableField
                  value={phase.name}
                  onSave={(value) => onUpdatePhase(phase.id, 'name', value)}
                  placeholder="Nome da fase"
                  className="font-medium text-gray-900 text-sm flex-1"
                />
                <div className="flex items-center gap-1 ml-2">
                  {/* Botões de reordenação */}
                  <button
                    onClick={() => index > 0 && onReorderPhases(index, index - 1)}
                    disabled={index === 0}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Mover para cima"
                  >
                    <ChevronUp size={14} />
                  </button>
                  <button
                    onClick={() => index < phases.length - 1 && onReorderPhases(index, index + 1)}
                    disabled={index === phases.length - 1}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Mover para baixo"
                  >
                    <ChevronDown size={14} />
                  </button>
                  {/* Botão de remoção */}
                  <button
                    onClick={() => {
                      if (confirm(`Tem certeza que deseja remover a fase "${phase.name}"?`)) {
                        onRemovePhase(phase.id);
                      }
                    }}
                    className="p-1 text-red-400 hover:text-red-600 ml-1"
                    title="Remover fase"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    % Previsto
                  </label>
                  <EditableField
                    value={phase.previsto.toString()}
                    onSave={(value) => onUpdatePhase(phase.id, 'previsto', parseInt(value) || 0)}
                    type="number"
                    min={0}
                    max={100}
                    placeholder="0"
                    className="w-full text-center font-medium"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    % Realizado
                  </label>
                  <EditableField
                    value={phase.realizado.toString()}
                    onSave={(value) => onUpdatePhase(phase.id, 'realizado', parseInt(value) || 0)}
                    type="number"
                    min={0}
                    max={100}
                    placeholder="0"
                    className="w-full text-center font-medium"
                  />
                </div>
                
                {/* Indicador visual do status */}
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getStatusColor(getPhaseStatus(phase.previsto, phase.realizado)) }}
                    />
                    <span className="text-xs text-gray-600">
                      {getPhaseStatus(phase.previsto, phase.realizado) === 'completed' && 'Concluído'}
                      {getPhaseStatus(phase.previsto, phase.realizado) === 'delayed' && 'Atrasado'}
                      {getPhaseStatus(phase.previsto, phase.realizado) === 'on_track' && 'No Prazo'}
                      {getPhaseStatus(phase.previsto, phase.realizado) === 'pending' && 'Pendente'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legenda */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-3">Legenda dos Medidores</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h5 className="font-medium text-gray-700 mb-2">Círculo Externo (Meta):</h5>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 rounded-full bg-green-700"></div>
              <span>Verde Escuro - % Previsto</span>
            </div>
          </div>
          <div>
            <h5 className="font-medium text-gray-700 mb-2">Círculo Interno (Realizado):</h5>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span>Verde Claro - On Track (= Meta)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                <span>Amarelo - Atenção (&le; 20% abaixo)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-600"></div>
                <span>Vermelho - Crítico (&gt; 20% abaixo)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-700"></div>
                <span>Verde Escuro - Acima da Meta</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTimeline;