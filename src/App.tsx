import React, { useState } from 'react';
import { Calendar, Users, Target, Link2, Building, DollarSign, Settings, Save, Edit3, AlertCircle, CheckCircle } from 'lucide-react';
import { 
  ProjectData, 
  statusOptions, 
  faseOptions, 
  entidadeOptions, 
  unidadeOptions,
  formatCurrency,
  isValidUrl
} from './data/projectProgressData';
import { useProjectData } from './hooks/useProjectData';
import { validateField, ValidationError } from './utils/validation';
import { ProgressTimeline } from './components/ProgressTimeline';
import { FinancialAnalysisPanel } from './components/FinancialAnalysisPanel';
import { RiskManagementPanel } from './components/RiskManagementPanel';
import { SimplifiedSchedule } from './components/SimplifiedSchedule';

interface EditableFieldProps {
  value: string | number;
  onSave: (value: string) => void;
  type?: 'text' | 'number' | 'select' | 'currency';
  options?: readonly string[];
  placeholder?: string;
  className?: string;
}

const EditableField: React.FC<EditableFieldProps> = ({ 
  value, 
  onSave, 
  type = 'text', 
  options, 
  placeholder, 
  className = '' 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value.toString());

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value.toString());
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {type === 'select' && options ? (
          <select 
            value={editValue} 
            onChange={(e) => setEditValue(e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        ) : (
          <input
            type={type === 'currency' ? 'number' : type}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            placeholder={placeholder}
            className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            step={type === 'currency' ? '0.01' : undefined}
          />
        )}
        <button onClick={handleSave} className="text-green-600 hover:text-green-800">
          <Save size={16} />
        </button>
        <button onClick={handleCancel} className="text-red-600 hover:text-red-800">
          ×
        </button>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 group ${className}`}>
      <span className="text-gray-900">
        {type === 'currency' ? formatCurrency(Number(value)) : value}
      </span>
      <button 
        onClick={() => setIsEditing(true)}
        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 transition-opacity"
      >
        <Edit3 size={14} />
      </button>
    </div>
  );
};

function App() {
  const { 
    projectData, 
    isLoading,
    updateFinancialEstimate,
    updateFinancialBudget, 
    lastSaved, 
    updateProjectData, 
    updateSimpleField, 
    resetToDefault,
    updatePhase,
    addPhase,
    removePhase,
    reorderPhases,
    updateRisk,
    addRisk,
    removeRisk
  } = useProjectData();
  
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [scheduleMonths, setScheduleMonths] = useState([
    { id: 'month-1', name: 'Julho', order: 0 },
    { id: 'month-2', name: 'Agosto', order: 1 },
    { id: 'month-3', name: 'Setembro', order: 2 }
  ]);
  const [scheduleEvents, setScheduleEvents] = useState([
    {
      id: 'event-1',
      name: 'Estudo Preliminar',
      type: 'activity' as const,
      startDate: 'Julho',
      endDate: 'Agosto',
      responsible: 'Equipe Técnica',
      status: 'in_progress' as const
    },
    {
      id: 'event-2',
      name: 'TAE01',
      type: 'milestone' as const,
      date: 'Agosto',
      responsible: 'Coordenador',
      status: 'pending' as const
    }
  ]);

  const handleFieldUpdate = (section: keyof ProjectData | null, field: string, value: any) => {
    // Validar o campo antes de atualizar
    const error = validateField(section, field, value);
    
    // Remover erro anterior deste campo
    setValidationErrors(prev => 
      prev.filter(e => !(e.field === field && e.section === section))
    );
    
    // Adicionar novo erro se existir
    if (error) {
      setValidationErrors(prev => [...prev, error]);
    }
    
    // Atualizar o valor
    if (section) {
      updateProjectData(section, field, value);
    } else {
      updateSimpleField(field as keyof ProjectData, value);
    }
  };



  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados do projeto...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cabeçalho Principal - Formato da Imagem */}
      <div className="bg-white shadow-sm border-b border-gray-200 mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">OPR</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">OPR - Projetos</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  if (confirm('Tem certeza que deseja resetar todos os dados para os valores padrão?')) {
                    resetToDefault();
                    setValidationErrors([]);
                  }
                }}
                className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                title="Resetar para dados padrão"
              >
                Reset
              </button>
            </div>
          </div>
          
          {/* Layout de 3 colunas como na imagem */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Coluna 1: EQUIPE */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">🏢 EQUIPE</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Projetista:</span>
                  <div className="font-medium">{projectData.equipe.projetista || 'Não definido'}</div>
                </div>
                <div>
                  <span className="text-gray-600">Orçamentista:</span>
                  <div className="font-medium">{projectData.equipe.orcamentista || 'Não definido'}</div>
                </div>
                <div>
                  <span className="text-gray-600">Eng. Fiscal:</span>
                  <div className="font-medium">{projectData.equipe.engenheiro_fiscal || 'Não definido'}</div>
                </div>
                <div>
                  <span className="text-gray-600">PMO:</span>
                  <div className="font-medium">{projectData.equipe.pmo || 'Não definido'}</div>
                </div>
              </div>
            </div>
            
            {/* Coluna 2: INFORMAÇÕES */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">ℹ️ INFORMAÇÕES</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Entidade:</span>
                  <div className="font-medium">{projectData.organizacao.entidade || 'Não definido'}</div>
                </div>
                <div>
                  <span className="text-gray-600">Unidade:</span>
                  <div className="font-medium">{projectData.organizacao.unidade || 'Não definido'}</div>
                </div>
                <div>
                  <span className="text-gray-600">Status:</span>
                  <div className="font-medium">{projectData.informacoes.status || 'Não definido'}</div>
                </div>
                <div>
                  <span className="text-gray-600">Fase:</span>
                  <div className="font-medium">{projectData.informacoes.fase_atual || 'Não definido'}</div>
                </div>
              </div>
            </div>
            
            {/* Coluna 3: DETALHES DA ORGANIZAÇÃO */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">🏛️ DETALHES DA ORGANIZAÇÃO</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Entidade:</span>
                  <div className="font-medium">{projectData.organizacao.entidade || 'Não definido'}</div>
                </div>
                <div>
                  <span className="text-gray-600">Unidade:</span>
                  <div className="font-medium">{projectData.organizacao.unidade || 'Não definido'}</div>
                </div>
                <div>
                  <span className="text-gray-600">Investimento:</span>
                  <div className="font-medium">{formatCurrency(projectData.organizacao.investimento_total)}</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Links Rápidos */}
          <div className="mt-4 bg-blue-50 rounded-lg p-3">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">🔗 LINKS RÁPIDOS</h3>
            <div className="flex gap-4 text-sm">
              <a href={projectData.links.monday_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                <Link2 size={14} />
                Monday
              </a>
              <a href={projectData.links.dash_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                <Link2 size={14} />
                Dashboard
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      {/* Painel de Validação */}
      {validationErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="text-red-500" size={20} />
              <h3 className="text-red-800 font-semibold">Erros de Validação</h3>
            </div>
            <button
              onClick={() => setShowValidationErrors(!showValidationErrors)}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              {showValidationErrors ? 'Ocultar' : 'Mostrar'} detalhes
            </button>
          </div>
          {showValidationErrors && (
            <div className="space-y-2">
              {validationErrors.map((error, index) => (
                <div key={index} className="text-sm text-red-700 bg-red-100 p-2 rounded">
                  <strong>{error.section ? `${error.section}.${error.field}` : error.field}:</strong> {error.message}
                </div>
              ))}
            </div>
          )}
        </div>
      )}



        {/* ONE PAGE REPORT - Todas as informações em uma única página */}
         
         {/* Resumo Executivo */}
         <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
           <h2 className="text-xl font-semibold text-gray-900 mb-4">📊 Resumo Executivo</h2>
           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
             <div className="text-center p-4 bg-blue-50 rounded-lg">
               <div className="text-2xl font-bold text-blue-600">{projectData.informacoes.numero_fases}</div>
               <div className="text-sm text-gray-600">Fases Totais</div>
             </div>
             <div className="text-center p-4 bg-green-50 rounded-lg">
               <div className="text-lg font-semibold text-green-600">{projectData.informacoes.fase_atual}</div>
               <div className="text-sm text-gray-600">Fase Atual</div>
             </div>
             <div className="text-center p-4 bg-yellow-50 rounded-lg">
               <div className="text-lg font-semibold text-yellow-600">{projectData.informacoes.status}</div>
               <div className="text-sm text-gray-600">Status</div>
             </div>
             <div className="text-center p-4 bg-purple-50 rounded-lg">
               <div className="text-lg font-semibold text-purple-600">{formatCurrency(projectData.organizacao.investimento_total)}</div>
               <div className="text-sm text-gray-600">Investimento</div>
             </div>
           </div>
         </div>

         {/* Visualização de Progresso - Layout Horizontal */}
         <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
           <ProgressTimeline
             phases={projectData.progress_phases}
             onUpdatePhase={updatePhase}
             onAddPhase={addPhase}
             onRemovePhase={removePhase}
             onReorderPhases={reorderPhases}
           />
         </div>

         {/* Análise Financeira - Layout Completo */}
         <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
           <FinancialAnalysisPanel
             estimates={projectData.financial_estimates || {
               estimativa_preliminar: 0,
               estimativa_preliminar_02: 0,
               estimativa_inicial: 0,
               estimativa_final: 0
             }}
             budgets={projectData.financial_budgets || {
               orcamento_primeira_fase: 0,
               orcamento_segunda_fase: 0,
               orcamento_analitico_total: 0
             }}
             totalInvestment={projectData.organizacao?.investimento_total || 0}
             onUpdateEstimate={updateFinancialEstimate}
             onUpdateBudget={updateFinancialBudget}
           />
         </div>

         {/* Layout em Grid - 2 Colunas: Cronograma e Riscos */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
           {/* Cronograma Simplificado */}
           <SimplifiedSchedule
             months={scheduleMonths}
             events={scheduleEvents}
             onUpdateMonths={setScheduleMonths}
             onUpdateEvents={setScheduleEvents}
           />
           
           {/* Gestão de Riscos Editável */}
           <RiskManagementPanel
             risks={projectData.risks || []}
             onUpdateRisk={updateRisk}
             onAddRisk={addRisk}
             onDeleteRisk={removeRisk}
           />
         </div>


      </div>
    </div>
  );
}

export default App;