import React from 'react';
import { DollarSign, TriangleAlert } from 'lucide-react';
import { FinancialEstimates, FinancialBudgets, calculateAdherence, getAdherenceColor, calculateErrorMargin, formatCurrency } from '../data/projectProgressData';

interface EditableFieldProps {
  value: string;
  onSave: (value: string) => void;
  placeholder?: string;
  className?: string;
  type?: 'text' | 'number' | 'currency';
}

const EditableField: React.FC<EditableFieldProps> = ({ value, onSave, placeholder, className, type = 'text' }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editValue, setEditValue] = React.useState(value);

  const handleSave = () => {
    onSave(editValue);
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

  const displayValue = type === 'currency' ? formatCurrency(parseFloat(value) || 0) : value;

  if (isEditing) {
    return (
      <input
        type={type === 'currency' ? 'number' : type}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyPress}
        className={`${className} border-2 border-blue-500 rounded px-2 py-1 focus:outline-none`}
        placeholder={placeholder}
        autoFocus
        step={type === 'currency' ? '0.01' : undefined}
      />
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className={`${className} cursor-pointer hover:bg-gray-50 rounded px-2 py-1 min-h-[2rem] flex items-center`}
    >
      {displayValue || placeholder}
    </div>
  );
};

interface FinancialAnalysisPanelProps {
  estimates: FinancialEstimates;
  budgets: FinancialBudgets;
  totalInvestment: number;
  onUpdateEstimate: (field: keyof FinancialEstimates, value: number) => void;
  onUpdateBudget: (field: keyof FinancialBudgets, value: number) => void;
}

export const FinancialAnalysisPanel: React.FC<FinancialAnalysisPanelProps> = ({
  estimates = {
    estimativa_preliminar: 0,
    estimativa_preliminar_02: 0,
    estimativa_inicial: 0,
    estimativa_final: 0
  },
  budgets = {
    orcamento_primeira_fase: 0,
    orcamento_segunda_fase: 0,
    orcamento_analitico_total: 0
  },
  totalInvestment = 0,
  onUpdateEstimate,
  onUpdateBudget
}) => {
  const AdherenceIndicator: React.FC<{ value: number; total: number }> = ({ value, total }) => {
    const adherence = calculateAdherence(value, total);
    const isGoodAdherence = adherence >= 50;
    
    return (
      <div className="flex items-center gap-2">
        <div className={`text-lg font-bold ${
          isGoodAdherence ? 'text-green-600' : 'text-red-600'
        }`}>
          {isGoodAdherence ? '▲' : '▼'}
        </div>
        <span className={`text-sm font-medium ${
          isGoodAdherence ? 'text-green-600' : 'text-red-600'
        }`}>
          {adherence.toFixed(1)}%
        </span>
      </div>
    );
  };

  const errorMargin = calculateErrorMargin(estimates?.estimativa_final || 0, budgets?.orcamento_analitico_total || 0);
  const getErrorMarginStyle = (margin: number) => {
    if (margin <= 10) {
      return {
        textColor: 'text-green-600',
        bgColor: 'from-green-50 to-green-100',
        borderColor: 'border-green-200',
        icon: '✓'
      };
    } else if (margin <= 25) {
      return {
        textColor: 'text-yellow-600',
        bgColor: 'from-yellow-50 to-yellow-100',
        borderColor: 'border-yellow-200',
        icon: '⚠'
      };
    } else {
      return {
        textColor: 'text-red-600',
        bgColor: 'from-red-50 to-red-100',
        borderColor: 'border-red-200',
        icon: '⚠'
      };
    }
  };
  
  const errorStyle = getErrorMarginStyle(errorMargin);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <DollarSign className="text-green-600" size={24} />
        <h2 className="text-xl font-bold text-gray-900">Análise Financeira</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Estimativas */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Estimativas</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estimativa Preliminar
                </label>
                <EditableField
                  value={estimates.estimativa_preliminar.toString()}
                  onSave={(value) => onUpdateEstimate('estimativa_preliminar', parseFloat(value) || 0)}
                  type="currency"
                  placeholder="0.00"
                  className="w-full"
                />
              </div>
              <AdherenceIndicator value={estimates.estimativa_preliminar} total={totalInvestment} />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estimativa Preliminar 02
                </label>
                <EditableField
                  value={estimates.estimativa_preliminar_02.toString()}
                  onSave={(value) => onUpdateEstimate('estimativa_preliminar_02', parseFloat(value) || 0)}
                  type="currency"
                  placeholder="0.00"
                  className="w-full"
                />
              </div>
              <AdherenceIndicator value={estimates.estimativa_preliminar_02} total={totalInvestment} />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estimativa Inicial
                </label>
                <EditableField
                  value={estimates.estimativa_inicial.toString()}
                  onSave={(value) => onUpdateEstimate('estimativa_inicial', parseFloat(value) || 0)}
                  type="currency"
                  placeholder="0.00"
                  className="w-full"
                />
              </div>
              <AdherenceIndicator value={estimates.estimativa_inicial} total={totalInvestment} />
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex-1">
                <label className="block text-sm font-medium text-blue-700 mb-1">
                  Estimativa Final
                </label>
                <EditableField
                  value={estimates.estimativa_final.toString()}
                  onSave={(value) => onUpdateEstimate('estimativa_final', parseFloat(value) || 0)}
                  type="currency"
                  placeholder="0.00"
                  className="w-full"
                />
              </div>
              <AdherenceIndicator value={estimates.estimativa_final} total={totalInvestment} />
            </div>
          </div>
        </div>

        {/* Orçamentos */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Orçamentos</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Orçamento 1ª Fase
                </label>
                <EditableField
                  value={budgets.orcamento_primeira_fase.toString()}
                  onSave={(value) => onUpdateBudget('orcamento_primeira_fase', parseFloat(value) || 0)}
                  type="currency"
                  placeholder="0.00"
                  className="w-full"
                />
              </div>
              <AdherenceIndicator value={budgets.orcamento_primeira_fase} total={totalInvestment} />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Orçamento 2ª Fase
                </label>
                <EditableField
                  value={budgets.orcamento_segunda_fase.toString()}
                  onSave={(value) => onUpdateBudget('orcamento_segunda_fase', parseFloat(value) || 0)}
                  type="currency"
                  placeholder="0.00"
                  className="w-full"
                />
              </div>
              <AdherenceIndicator value={budgets.orcamento_segunda_fase} total={totalInvestment} />
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex-1">
                <label className="block text-sm font-medium text-blue-700 mb-1">
                  Orçamento Analítico Total
                </label>
                <EditableField
                  value={budgets.orcamento_analitico_total.toString()}
                  onSave={(value) => onUpdateBudget('orcamento_analitico_total', parseFloat(value) || 0)}
                  type="currency"
                  placeholder="0.00"
                  className="w-full"
                />
              </div>
              <AdherenceIndicator value={budgets.orcamento_analitico_total} total={totalInvestment} />
            </div>
          </div>
        </div>
      </div>

      {/* Card de Margem de Erro */}
      <div className={`mt-6 p-6 bg-gradient-to-r ${errorStyle.bgColor} rounded-lg border ${errorStyle.borderColor}`}>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className={`text-2xl ${errorStyle.textColor}`}>{errorStyle.icon}</span>
            <h4 className="text-lg font-semibold text-gray-800">
              MARGEM DE ERRO DA ESTIMATIVA FINAL
            </h4>
          </div>
          <div className={`text-4xl font-bold ${errorStyle.textColor} mb-2`}>
            {errorMargin.toFixed(2)}%
          </div>
          <div className="text-sm text-gray-600">
            Diferença entre Estimativa Final e Orçamento Analítico Total
          </div>
          <div className={`text-xs mt-2 ${errorStyle.textColor} font-medium`}>
            {errorMargin <= 10 ? 'Excelente precisão' : 
             errorMargin <= 25 ? 'Precisão aceitável' : 'Requer atenção'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialAnalysisPanel;