import React, { useState } from 'react';
import { AlertTriangle, Plus, Edit3, Trash2, Calendar, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { RiskItem } from '../data/projectProgressData';

interface RiskManagementPanelProps {
  risks: RiskItem[];
  onUpdateRisk: (riskId: string, field: keyof RiskItem, value: any) => void;
  onAddRisk: (risk: Omit<RiskItem, 'id'>) => void;
  onDeleteRisk: (riskId: string) => void;
}

export const RiskManagementPanel: React.FC<RiskManagementPanelProps> = ({
  risks = [],
  onUpdateRisk,
  onAddRisk,
  onDeleteRisk
}) => {
  const [isAddingRisk, setIsAddingRisk] = useState(false);
  const [newRiskDescription, setNewRiskDescription] = useState('');
  const [editingRisk, setEditingRisk] = useState<string | null>(null);
  const [editDescription, setEditDescription] = useState('');

  const getStatusIcon = (status: RiskItem['status']) => {
    switch (status) {
      case 'active':
        return <AlertCircle className="text-red-500" size={16} />;
      case 'mitigated':
        return <CheckCircle className="text-yellow-500" size={16} />;
      case 'closed':
        return <XCircle className="text-green-500" size={16} />;
      default:
        return <AlertCircle className="text-gray-500" size={16} />;
    }
  };

  const getStatusColor = (status: RiskItem['status']) => {
    switch (status) {
      case 'active':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'mitigated':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'closed':
        return 'bg-green-50 border-green-200 text-green-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getStatusLabel = (status: RiskItem['status']) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'mitigated':
        return 'Mitigado';
      case 'closed':
        return 'Fechado';
      default:
        return 'Desconhecido';
    }
  };

  const handleAddRisk = () => {
    if (newRiskDescription.trim()) {
      onAddRisk({
        description: newRiskDescription.trim(),
        date_registered: new Date(),
        status: 'active'
      });
      setNewRiskDescription('');
      setIsAddingRisk(false);
    }
  };

  const handleEditRisk = (riskId: string) => {
    const risk = risks.find(r => r.id === riskId);
    if (risk) {
      setEditingRisk(riskId);
      setEditDescription(risk.description);
    }
  };

  const handleSaveEdit = () => {
    if (editingRisk && editDescription.trim()) {
      onUpdateRisk(editingRisk, 'description', editDescription.trim());
      setEditingRisk(null);
      setEditDescription('');
    }
  };

  const handleCancelEdit = () => {
    setEditingRisk(null);
    setEditDescription('');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <AlertTriangle className="text-orange-600" size={24} />
          <h2 className="text-xl font-bold text-gray-900">Gerenciamento de Riscos</h2>
        </div>
        <button
          onClick={() => setIsAddingRisk(true)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          <Plus size={16} />
          Adicionar Risco
        </button>
      </div>

      {/* Formulário para adicionar novo risco */}
      {isAddingRisk && (
        <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Novo Risco</h3>
          <textarea
            value={newRiskDescription}
            onChange={(e) => setNewRiskDescription(e.target.value)}
            placeholder="Descreva o risco identificado..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
            rows={4}
            autoFocus
          />
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleAddRisk}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Salvar
            </button>
            <button
              onClick={() => {
                setIsAddingRisk(false);
                setNewRiskDescription('');
              }}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Lista de riscos */}
      <div className="space-y-4 mb-6">
        {(!risks || risks.length === 0) ? (
          <div className="text-center py-8 text-gray-500">
            <AlertTriangle size={48} className="mx-auto mb-4 text-gray-300" />
            <p>Nenhum risco identificado ainda.</p>
            <p className="text-sm">Clique em "Adicionar Risco" para começar.</p>
          </div>
        ) : (
          risks.map((risk) => (
            <div
              key={risk.id}
              className={`p-4 rounded-lg border ${getStatusColor(risk.status)}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getStatusIcon(risk.status)}
                  <span className="font-medium">
                    {getStatusLabel(risk.status)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Calendar size={14} />
                    {new Date(risk.date_registered).toLocaleDateString('pt-BR')}
                  </div>
                  <button
                    onClick={() => handleEditRisk(risk.id)}
                    className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                    title="Editar risco"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => onDeleteRisk(risk.id)}
                    className="p-1 text-red-500 hover:text-red-700 transition-colors"
                    title="Excluir risco"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Descrição do risco */}
              {editingRisk === risk.id ? (
                <div>
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none mb-3"
                    rows={4}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveEdit}
                      className="px-3 py-1 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors text-sm"
                    >
                      Salvar
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors text-sm"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="whitespace-pre-wrap text-gray-700 mb-3">
                  {risk.description}
                </div>
              )}

              {/* Seletor de status */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Status:</label>
                <select
                  value={risk.status}
                  onChange={(e) => onUpdateRisk(risk.id, 'status', e.target.value as RiskItem['status'])}
                  className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="active">Ativo</option>
                  <option value="mitigated">Mitigado</option>
                  <option value="closed">Fechado</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RiskManagementPanel;