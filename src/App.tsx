import React, { useState } from 'react';
import { Calendar, Users, Target, Link2, Building, DollarSign, Settings, Save, Edit3, AlertCircle, CheckCircle, AlertTriangle, Trash2 } from 'lucide-react';
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
import { DualCircularProgress } from './components/DualCircularProgress';

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
    <div className="min-h-screen bg-white p-6 max-w-[210mm] mx-auto" style={{ fontFamily: 'Arial, sans-serif', fontSize: '14px' }}>
      {/* Cabeçalho Principal */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-gray-700">OPR - Projetos</h1>
          <div className="text-gray-600">JULHO 2025</div>
        </div>
        
        {/* Seção Informacional - Três Colunas */}
        <div className="grid grid-cols-3 gap-6 mb-5">
          {/* Coluna 1 - EQUIPE */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <Users className="text-blue-600" size={20} />
              <h2 className="text-lg font-bold text-gray-800">EQUIPE</h2>
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600">Projetista:</span>
                <div className="font-semibold text-gray-800">{projectData.equipe.projetista}</div>
              </div>
              <div>
                <span className="text-gray-600">Orçamentista:</span>
                <div className="font-semibold text-gray-800">{projectData.equipe.orcamentista}</div>
              </div>
              <div>
                <span className="text-gray-600">Eng. Fiscal:</span>
                <div className="font-semibold text-gray-800">{projectData.equipe.engenheiro_fiscal}</div>
              </div>
              <div>
                <span className="text-gray-600">PMO:</span>
                <div className="font-semibold text-gray-800">{projectData.equipe.pmo}</div>
              </div>
            </div>
          </div>

          {/* Coluna 2 - INFORMAÇÕES */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <Target className="text-blue-600" size={20} />
              <h2 className="text-lg font-bold text-gray-800">INFORMAÇÕES</h2>
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600">Entidade:</span>
                <div className="font-semibold text-blue-600">{projectData.organizacao.entidade}</div>
              </div>
              <div>
                <span className="text-gray-600">Unidade:</span>
                <div className="font-semibold text-blue-600">{projectData.organizacao.unidade}</div>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>
                <div className="font-semibold text-gray-800">{projectData.informacoes.status}</div>
              </div>
              <div>
                <span className="text-gray-600">Fase:</span>
                <div className="font-semibold text-gray-800">{projectData.informacoes.fase_atual}</div>
              </div>
            </div>
          </div>

          {/* Coluna 3 - DETALHES DA ORGANIZAÇÃO */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <Building className="text-blue-600" size={20} />
              <h2 className="text-lg font-bold text-gray-800">DETALHES DA ORGANIZAÇÃO</h2>
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600">Entidade:</span>
                <div className="font-semibold text-blue-600">{projectData.organizacao.entidade}</div>
              </div>
              <div>
                <span className="text-gray-600">Unidade:</span>
                <div className="font-semibold text-blue-600">{projectData.organizacao.unidade}</div>
              </div>
              <div>
                <span className="text-gray-600">Investimento:</span>
                <div className="font-semibold text-blue-600">{formatCurrency(projectData.organizacao.investimento_total)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Links Rápidos */}
        <div className="bg-purple-50 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Link2 className="text-purple-600" size={20} />
            <h3 className="font-bold text-gray-800">LINKS RÁPIDOS</h3>
          </div>
          <div className="flex gap-6">
            <a href={projectData.links.monday_url} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm">
              <span>🔗</span>
              <span>Monday</span>
            </a>
            <a href={projectData.links.dash_url} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm">
              <span>📊</span>
              <span>Dashboard</span>
            </a>
          </div>
        </div>
      </div>

      {/* Legenda */}
      <div className="flex justify-end items-center gap-6 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full border-2 border-blue-500"></div>
          <span className="text-sm text-gray-600">Previsto (Externo)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full border-2 border-green-500"></div>
          <span className="text-sm text-gray-600">Realizado (Interno)</span>
        </div>
      </div>

      {/* Timeline de Progresso */}
      <div className="mb-6">
        {/* Timeline completa com 12 fases */}
        <div className="relative">
          {/* Medidores circulares superiores - 6 fases */}
          <div className="flex justify-between items-center mb-3">
            {projectData.progress_phases.slice(0, 6).map((phase, index) => (
              <div key={phase.id} className="flex flex-col items-center relative">
                {/* Percentual previsto acima */}
                <div className="text-sm font-bold text-gray-700 mb-1">{phase.previsto}%</div>
                
                {/* Seta vermelha indicando atividade atual (fase 2 - Contratação de Recursos) */}
                {index === 1 && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                    <div className="text-red-600 text-2xl">↓</div>
                  </div>
                )}
                
                <DualCircularProgress
                  previsto={phase.previsto}
                  realizado={phase.realizado}
                  size={60}
                  showPercentage={true}
                  showOnlyInternal={true}
                />
                <div className="text-xs text-center mt-1 max-w-[60px] leading-tight">
                  {phase.name}
                </div>
              </div>
            ))}
          </div>

          {/* Linha do tempo horizontal */}
          <div className="relative my-4">
            <div className="absolute h-1 bg-blue-400 left-0 right-0 top-1/2 transform -translate-y-1/2"></div>
            <div className="flex justify-between relative">
              {Array.from({ length: 12 }).map((_, index) => (
                <div key={index} className="w-3 h-3 rounded-full bg-blue-600 z-10 relative"></div>
              ))}
            </div>
            
            {/* Setas nas extremidades */}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4">
              <div className="text-blue-600 text-xl">←</div>
            </div>
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4">
              <div className="text-blue-600 text-xl">→</div>
            </div>
          </div>

          {/* Medidores circulares inferiores - 6 fases restantes */}
          <div className="flex justify-between items-center">
            {projectData.progress_phases.slice(6).map((phase, index) => (
              <div key={phase.id} className="flex flex-col items-center relative">
                <div className="text-xs text-center mb-1 max-w-[60px] leading-tight">
                  {phase.name}
                </div>
                
                {/* Seta azul indicando próxima atividade (fase 7 - Anteprojeto) */}
                {index === 1 && (
                  <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
                    <div className="text-blue-600 text-2xl">↑</div>
                  </div>
                )}
                
                <DualCircularProgress
                  previsto={phase.previsto}
                  realizado={phase.realizado}
                  size={60}
                  showPercentage={true}
                  showOnlyInternal={true}
                />
                <div className="text-sm font-bold text-gray-700 mt-1">{phase.previsto}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Seção Financeira */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-6">
          <DollarSign className="text-green-600" size={24} />
          <h2 className="text-xl font-bold text-gray-800">Análise Financeira</h2>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          {/* Estimativas */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Estimativas</h3>
            <div className="space-y-4">
              {/* Estimativa Preliminar */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Estimativa Preliminar</div>
                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold text-gray-800">
                    {formatCurrency(projectData.financial_estimates.estimativa_preliminar)}
                  </div>
                  <div className="flex items-center text-green-600">
                    <span className="text-lg mr-1">▲</span>
                    <span className="text-sm font-medium">100.0%</span>
                  </div>
                </div>
              </div>

              {/* Estimativa Inicial */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Estimativa Inicial</div>
                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold text-gray-800">R$ 0,00</div>
                  <div className="flex items-center text-red-600">
                    <span className="text-lg mr-1">▼</span>
                    <span className="text-sm font-medium">0.0%</span>
                  </div>
                </div>
              </div>

              {/* Estimativa Preliminar 02 */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Estimativa Preliminar 02</div>
                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold text-gray-800">R$ 0,00</div>
                  <div className="flex items-center text-red-600">
                    <span className="text-lg mr-1">▼</span>
                    <span className="text-sm font-medium">0.0%</span>
                  </div>
                </div>
              </div>

              {/* Estimativa Final */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-sm text-blue-600 mb-1 font-medium">Estimativa Final</div>
                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold text-blue-800">R$ 0,00</div>
                  <div className="flex items-center text-red-600">
                    <span className="text-lg mr-1">▼</span>
                    <span className="text-sm font-medium">0.0%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Orçamentos */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Orçamentos</h3>
            <div className="space-y-4">
              {/* Orçamento 1ª Fase */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Orçamento 1ª Fase</div>
                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold text-gray-800">R$ 0,00</div>
                  <div className="flex items-center text-red-600">
                    <span className="text-lg mr-1">▼</span>
                    <span className="text-sm font-medium">0.0%</span>
                  </div>
                </div>
              </div>

              {/* Orçamento 2ª Fase */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Orçamento 2ª Fase</div>
                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold text-gray-800">R$ 0,00</div>
                  <div className="flex items-center text-red-600">
                    <span className="text-lg mr-1">▼</span>
                    <span className="text-sm font-medium">0.0%</span>
                  </div>
                </div>
              </div>

              {/* Orçamento Analítico Total */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-sm text-blue-600 mb-1 font-medium">Orçamento Analítico Total</div>
                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold text-blue-800">R$ 0,00</div>
                  <div className="flex items-center text-red-600">
                    <span className="text-lg mr-1">▼</span>
                    <span className="text-sm font-medium">0.0%</span>
                  </div>
                </div>
              </div>

              {/* Margem de Erro */}
              <div className="mt-6 p-6 bg-green-50 rounded-lg border border-green-200">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <CheckCircle className="text-green-600" size={20} />
                    <div className="text-sm font-semibold text-gray-700">
                      MARGEM DE ERRO DA ESTIMATIVA FINAL
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-green-600 mb-2">0.00%</div>
                  <div className="text-xs text-gray-600 mb-1">
                    Diferença entre Estimativa Final e Orçamento Analítico Total
                  </div>
                  <div className="text-xs text-green-600 font-medium">
                    Excelente precisão
                  </div>
                  <div className="text-xs text-gray-400 mt-2">miro</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seção Cronograma e Riscos */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Cronograma */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4">GANTT TRIMESTRAL</h3>
          
          {/* Cabeçalho dos meses */}
          <div className="grid grid-cols-3 gap-0 mb-3">
            <div className="border border-gray-400 p-3 text-center bg-white">
              <span className="font-bold text-lg text-gray-800">Set.25</span>
            </div>
            <div className="border border-gray-400 p-3 text-center bg-white">
              <span className="font-bold text-lg text-gray-800">Out.25</span>
            </div>
            <div className="border border-gray-400 p-3 text-center bg-white">
              <span className="font-bold text-lg text-gray-800">Nov.25</span>
            </div>
          </div>
          
          {/* Área do cronograma */}
          <div className="relative bg-white p-4 border border-gray-300 min-h-[140px]">
            {/* Linha do tempo principal */}
            <div className="absolute left-0 right-0 top-6 h-1 bg-gray-800"></div>
            
            {/* Losangos nas extremidades */}
            <div className="absolute left-0 top-4 w-4 h-4 bg-gray-800 transform rotate-45"></div>
            <div className="absolute right-0 top-4 w-4 h-4 bg-gray-800 transform rotate-45"></div>
            
            {/* Atividades */}
            <div className="relative pt-8">
              {/* Estudo Viabilidade */}
              <div className="absolute left-2 top-2">
                <div className="bg-purple-300 px-4 py-2 rounded-full shadow-md">
                  <span className="font-bold text-gray-800 text-sm">Estudo Viabilidade</span>
                </div>
              </div>
              
              {/* Estimativa Orçamentária 02 */}
              <div className="absolute left-4 top-14">
                <div className="bg-green-200 px-4 py-2 rounded-full shadow-md">
                  <span className="font-bold text-gray-800 text-sm">Estimativa Orçamentária 02</span>
                </div>
              </div>
              
              {/* TAE01 Marco */}
              <div className="absolute right-8 bottom-2">
                <div className="bg-red-200 px-3 py-1 rounded shadow-md">
                  <span className="font-bold text-gray-800 text-sm">TAE01</span>
                </div>
                {/* Linha vertical do marco */}
                <div className="absolute left-1/2 top-0 w-0.5 h-6 bg-gray-400 transform -translate-x-1/2 -translate-y-6"></div>
              </div>
            </div>
            
            {/* Marca d'água miro */}
            <div className="absolute bottom-1 right-2 text-gray-300 text-xs">
              miro
            </div>
          </div>
        </div>

        {/* Riscos */}
        <div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="text-orange-500" size={20} />
                <h3 className="font-semibold text-gray-800">Gerenciamento de Riscos</h3>
              </div>
              <button className="flex items-center gap-1 px-3 py-1 bg-orange-500 text-white rounded text-sm hover:bg-orange-600 transition-colors">
                <span className="text-lg">+</span>
                <span>Adicionar Risco</span>
              </button>
            </div>
            
            {/* Card do Risco */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span className="text-red-600 font-medium text-sm">Ativo</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar size={14} />
                  <span>11/09/2025</span>
                  <Edit3 size={14} className="text-gray-400 hover:text-gray-600 cursor-pointer" />
                  <Trash2 size={14} className="text-red-400 hover:text-red-600 cursor-pointer" />
                </div>
              </div>
              
              <div className="mb-3">
                <div className="font-medium text-gray-800 mb-2">Complementares não contratados</div>
                <div className="text-sm text-gray-600 leading-relaxed">
                  Atraso nas fases devido à solicitação de mudanças de layout e definição de terreno.
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Status:</span>
                <select className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                  <option value="active">Ativo</option>
                  <option value="mitigated">Mitigado</option>
                  <option value="closed">Fechado</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logo FIEB no canto inferior direito */}
      <div className="flex justify-end mt-4">
        <div className="text-blue-600 font-bold text-sm">FIEB</div>
      </div>
    </div>
  );
}

export default App;