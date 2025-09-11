import React from 'react';
import CircularProgress from './CircularProgress';

interface ProjectPhase {
  id: string;
  name: string;
  externalPercentage: number;
  internalPercentage: number;
}

interface SubPhase {
  id: string;
  name: string;
  externalPercentage: number;
  internalPercentage: number;
}

interface ProjectProgressFlowProps {
  mainPhases: ProjectPhase[];
  subPhases: SubPhase[];
}

const ProjectProgressFlow: React.FC<ProjectProgressFlowProps> = ({ mainPhases, subPhases }) => {
  return (
    <div className="w-full py-8">
      {/* Legend */}
      <div className="flex items-center justify-end gap-6 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full border-2 border-blue-500"></div>
          <span className="text-sm text-gray-600">Previsto (Externo)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full border-2 border-green-500"></div>
          <span className="text-sm text-gray-600">Realizado (Interno)</span>
        </div>
      </div>
      
      {/* Timeline with phases */}
      <div className="relative">
        {/* Main timeline line */}
        <div className="absolute h-1 bg-blue-300 left-0 right-0 top-24 z-0"></div>
        
        <div className="flex justify-between relative z-10">
          {/* Main phases (top) */}
          {mainPhases.map((phase, index) => (
            <div key={phase.id} className="flex flex-col items-center">
              {/* Círculo de progresso posicionado acima da linha do tempo */}
              <div className="flex flex-col items-center mb-0">
                <CircularProgress 
                  externalPercentage={phase.externalPercentage} 
                  internalPercentage={phase.internalPercentage}
                  size={80}
                  strokeWidth={6}
                  externalColor="#0ea5e9" // sky-500
                  internalColor="#22c55e" // green-500
                  internalRadiusRatio={0.7}
                />
              </div>
              
              {/* Linha vertical conectando o círculo à linha do tempo */}
              <div className="h-16 w-0.5 bg-blue-300"></div>
              
              {/* Ponto de conexão na linha do tempo */}
              <div className="w-3 h-3 rounded-full bg-blue-500 -mb-1 z-10"></div>
              
              {/* Nome da fase abaixo da linha do tempo */}
              <div className="mt-4 text-center">
                <p className="text-sm font-medium text-gray-700">{phase.name}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Sub phases (bottom) - usando a mesma linha do tempo */}
        <div className="flex justify-between mt-20 relative">
          {subPhases.map((subPhase, index) => (
            <div key={subPhase.id} className="relative z-10 flex flex-col items-center">
              {/* Ponto de conexão na linha do tempo */}
              <div className="w-3 h-3 rounded-full bg-blue-500 -mb-1 z-10"></div>
              
              {/* Nome da fase abaixo da linha do tempo */}
              <div className="mt-4 text-center">
                <p className="text-xs font-medium text-gray-600">{subPhase.name}</p>
              </div>
              
              {/* Linha vertical conectando a linha do tempo ao círculo */}
              <div className="h-16 w-0.5 bg-blue-300 mt-2"></div>
              
              {/* Círculo de progresso posicionado abaixo da linha do tempo */}
              <div className="mt-0 flex flex-col items-center">
                <CircularProgress 
                  externalPercentage={subPhase.externalPercentage} 
                  internalPercentage={subPhase.internalPercentage}
                  size={60}
                  strokeWidth={4}
                  externalColor="#0ea5e9" // sky-500
                  internalColor="#22c55e" // green-500
                  internalRadiusRatio={0.7}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectProgressFlow;