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
    <div className="min-h-screen bg-white p-8 max-w-[210mm] mx-auto" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Cabeçalho Principal */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-gray-700">OPR - Projetos</h1>
          <div className="text-gray-600">JULHO 2025</div>
        </div>
        
        {/* Seção Informacional - Três Colunas */}
        <div className="grid grid-cols-3 gap-8 mb-6">
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
        <div className="bg-purple-50 p-4 rounded-lg">
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
      <div className="flex justify-end items-center gap-6 mb-6">
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
      <div className="mb-8">
        {/* Medidores circulares superiores */}
        <div className="flex justify-between items-center mb-4">
          {projectData.progress_phases.slice(0, 6).map((phase, index) => (
            <div key={phase.id} className="flex flex-col items-center">
              <div className="text-lg font-bold text-gray-700 mb-1">{phase.previsto}%</div>
              <DualCircularProgress
                previsto={phase.previsto}
                realizado={phase.realizado}
                size={80}
                showPercentage={false}
              />
              <div className="text-xs text-center mt-2 max-w-[80px] leading-tight">
                {phase.name}
              </div>
            </div>
          ))}
        </div>

        {/* Linha do tempo */}
        <div className="relative my-8">
          <div className="absolute h-1 bg-blue-300 left-0 right-0 top-1/2 transform -translate-y-1/2"></div>
          <div className="flex justify-between relative">
            {projectData.progress_phases.slice(0, 6).map((phase, index) => (
              <div key={phase.id} className="w-4 h-4 rounded-full bg-blue-600 z-10 relative"></div>
            ))}
          </div>
        </div>

        {/* Medidores circulares inferiores */}
        <div className="flex justify-between items-center">
          {projectData.progress_phases.slice(6).map((phase, index) => (
            <div key={phase.id} className="flex flex-col items-center">
              <div className="text-xs text-center mb-2 max-w-[80px] leading-tight">
                {phase.name}
              </div>
              <DualCircularProgress
                previsto={phase.previsto}
                realizado={phase.realizado}
                size={80}
                showPercentage={false}
              />
              <div className="text-lg font-bold text-gray-700 mt-1">{phase.previsto}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Seção Financeira */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        {/* Estimativas */}
        <div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="font-medium">Estimativa Preliminar</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">{formatCurrency(projectData.financial_estimates.estimativa_preliminar)}</span>
                <div className="flex items-center text-red-600">
                  <span className="text-lg">▼</span>
                  <span className="text-sm font-medium">3%</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="font-medium">Estimativa Preliminar02</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">x</span>
                <div className="flex items-center text-green-600">
                  <span className="text-lg">▲</span>
                  <span className="text-sm font-medium">16%</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="font-medium">Estimativa Inicial</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">y</span>
                <div className="flex items-center text-green-600">
                  <span className="text-lg">▲</span>
                  <span className="text-sm font-medium">11%</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="font-medium">Estimativa Final</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">z</span>
                <div className="flex items-center text-green-600">
                  <span className="text-lg">▲</span>
                  <span className="text-sm font-medium">9%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Orçamentos */}
        <div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="font-medium">Orçamento 1ª Fase</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">x</span>
                <div className="flex items-center text-red-600">
                  <span className="text-lg">▼</span>
                  <span className="text-sm font-medium">3%</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="font-medium">Orçamento 2ª Fase</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">y</span>
                <div className="flex items-center text-green-600">
                  <span className="text-lg">▲</span>
                  <span className="text-sm font-medium">16%</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="font-medium">Orçamento 3ª Fase</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">z</span>
                <div className="flex items-center text-green-600">
                  <span className="text-lg">▲</span>
                  <span className="text-sm font-medium">11%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seção Cronograma e Riscos */}
      <div className="grid grid-cols-2 gap-8">
        {/* Cronograma */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-lg">Julho</span>
            <span className="font-bold text-lg">Agosto</span>
            <span className="font-bold text-lg">Setembro</span>
          </div>
          
          <div className="relative bg-gray-50 p-4 rounded">
            <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-300"></div>
            <div className="relative flex justify-between items-center">
              <div className="w-2 h-2 rounded-full bg-gray-600"></div>
              <div className="w-2 h-2 rounded-full bg-gray-600"></div>
              <div className="w-2 h-2 rounded-full bg-gray-600"></div>
            </div>
            
            <div className="mt-4">
              <div className="bg-green-500 text-white px-3 py-1 rounded text-sm inline-block">
                Estudo Preliminar
              </div>
            </div>
            
            <div className="mt-2 flex justify-center">
              <div className="bg-orange-500 text-white px-2 py-1 rounded text-xs">
                🏁 TAE01
              </div>
            </div>
          </div>
        </div>

        {/* Riscos */}
        <div>
          <div className="bg-red-100 p-4 rounded">
            <h3 className="text-center font-bold text-lg mb-4 bg-red-300 py-2 rounded">RISCOS</h3>
            
            <div className="space-y-3">
              <div>
                <div className="font-bold text-gray-700 mb-1">Complementares não contratados</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-600">
                  Atraso nas fases devido à solicitação de mudanças de layout e definição de terreno.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logo FIEB no canto inferior direito */}
      <div className="flex justify-end mt-8">
        <div className="text-blue-600 font-bold text-sm">FIEB</div>
      </div>
    </div>
  );
}

export default App;