import React from 'react';
import CircularProgress from './CircularProgress';

interface TimelinePhase {
  id: string;
  name: string;
  externalPercentage: number;
  internalPercentage: number;
}

interface ProjectTimelineProps {
  phases: TimelinePhase[];
}

const ProjectTimeline: React.FC<ProjectTimelineProps> = ({ phases }) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between relative">
        {/* Timeline line */}
        <div className="absolute h-1 bg-blue-300 left-0 right-0 top-1/2 transform -translate-y-1/2 z-0"></div>
        
        {/* Timeline phases */}
        {phases.map((phase, index) => (
          <div key={phase.id} className="relative z-10 flex flex-col items-center">
            {/* Circle progress */}
            <CircularProgress 
              externalPercentage={phase.externalPercentage} 
              internalPercentage={phase.internalPercentage}
              size={80}
              strokeWidth={6}
            />
            
            {/* Phase name */}
            <div className="mt-4 text-center">
              <p className="text-sm font-medium text-gray-700">{phase.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectTimeline;