import React from 'react';
import ProjectProgressFlow from './ProjectProgressFlow';
import { projectProgressData } from '../data/projectProgressData';

const ProjectProgressTest: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Progresso do Projeto</h2>
      <ProjectProgressFlow 
        mainPhases={projectProgressData.mainPhases}
        subPhases={projectProgressData.subPhases}
      />
    </div>
  );
};

export default ProjectProgressTest;