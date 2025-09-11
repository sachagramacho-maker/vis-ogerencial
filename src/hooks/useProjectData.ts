import { useState, useEffect } from 'react';
import { ProjectData, defaultProjectData, ProgressPhase, FinancialEstimates, FinancialBudgets, RiskItem } from '../data/projectProgressData';
import { validateField, ValidationError } from '../utils/validation';

const STORAGE_KEY = 'opr-project-data';

export const useProjectData = () => {
  const [projectData, setProjectData] = useState<ProjectData>(defaultProjectData);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, ValidationError>>({});

  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        // Converter strings de data de volta para objetos Date
        parsedData.created_at = new Date(parsedData.created_at);
        parsedData.updated_at = new Date(parsedData.updated_at);
        setProjectData(parsedData);
        setLastSaved(parsedData.updated_at);
      }
    } catch (error) {
      console.error('Erro ao carregar dados salvos:', error);
      // Se houver erro, usar dados padrão
      setProjectData(defaultProjectData);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Salvar dados no localStorage sempre que projectData mudar
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(projectData));
        setLastSaved(projectData.updated_at);
      } catch (error) {
        console.error('Erro ao salvar dados:', error);
      }
    }
  }, [projectData, isLoading]);

  const updateProjectData = (section: keyof ProjectData, field: string, value: any) => {
    setProjectData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      },
      updated_at: new Date()
    }));
  };

  const updateSimpleField = (field: keyof ProjectData, value: any) => {
    setProjectData(prev => ({
      ...prev,
      [field]: value,
      updated_at: new Date()
    }));
  };

  const updateField = (field: keyof ProjectData, value: string) => {
    // Validar o campo
    const validation = validateField(field, value);
    
    // Atualizar erros de validação
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      if (validation.isValid) {
        delete newErrors[field];
      } else {
        newErrors[field] = validation;
      }
      return newErrors;
    });

    // Atualizar dados se válido
    if (validation.isValid) {
      setProjectData(prev => ({
        ...prev,
        [field]: validation.formattedValue || value,
        updated_at: new Date()
      }));
    }
  };

  const updatePhase = (phaseId: string, field: keyof ProgressPhase, value: any) => {
    setProjectData(prev => ({
      ...prev,
      progress_phases: prev.progress_phases.map(phase => 
        phase.id === phaseId ? { ...phase, [field]: value } : phase
      ),
      updated_at: new Date()
    }));
  };

  const addPhase = (name: string = 'Nova Fase') => {
    const newPhase: ProgressPhase = {
      id: `phase-${Date.now()}`,
      name,
      previsto: 0,
      realizado: 0
    };
    
    setProjectData(prev => ({
      ...prev,
      progress_phases: [...prev.progress_phases, newPhase],
      updated_at: new Date()
    }));
  };

  const removePhase = (phaseId: string) => {
    setProjectData(prev => ({
      ...prev,
      progress_phases: prev.progress_phases.filter(phase => phase.id !== phaseId),
      updated_at: new Date()
    }));
  };

  const reorderPhases = (fromIndex: number, toIndex: number) => {
    setProjectData(prev => {
      const phases = [...prev.progress_phases];
      const [movedPhase] = phases.splice(fromIndex, 1);
      phases.splice(toIndex, 0, movedPhase);
      
      return {
        ...prev,
        progress_phases: phases,
        updated_at: new Date()
      };
    });
  };

  const updateFinancialEstimate = (field: keyof FinancialEstimates, value: number) => {
    setProjectData(prev => ({
      ...prev,
      financial_estimates: {
        ...prev.financial_estimates,
        [field]: value
      },
      updated_at: new Date()
    }));
  };

  const updateFinancialBudget = (field: keyof FinancialBudgets, value: number) => {
    setProjectData(prev => ({
      ...prev,
      financial_budgets: {
        ...prev.financial_budgets,
        [field]: value
      },
      updated_at: new Date()
    }));
  };

  const updateRisk = (riskId: string, field: keyof RiskItem, value: any) => {
    setProjectData(prev => ({
      ...prev,
      risks: prev.risks.map(risk => 
        risk.id === riskId ? { ...risk, [field]: value } : risk
      ),
      updated_at: new Date()
    }));
  };

  const addRisk = () => {
    const newRisk: RiskItem = {
      id: `risk-${Date.now()}`,
      description: '',
      status: 'ativo',
      created_at: new Date().toISOString().split('T')[0]
    };
    
    setProjectData(prev => ({
      ...prev,
      risks: [...prev.risks, newRisk],
      updated_at: new Date()
    }));
  };

  const removeRisk = (riskId: string) => {
    setProjectData(prev => ({
      ...prev,
      risks: prev.risks.filter(risk => risk.id !== riskId),
      updated_at: new Date()
    }));
  };

  const resetToDefault = () => {
    const newData = {
      ...defaultProjectData,
      id: projectData.id, // Manter o ID atual
      created_at: projectData.created_at, // Manter data de criação
      updated_at: new Date()
    };
    setProjectData(newData);
    setValidationErrors({});
  };



  return {
    projectData,
    isLoading,
    lastSaved,
    validationErrors,
    updateProjectData,
    updateSimpleField,
    updateField,
    updatePhase,
    addPhase,
    removePhase,
    reorderPhases,
    updateFinancialEstimate,
    updateFinancialBudget,
    updateRisk,
    addRisk,
    removeRisk,
    resetToDefault
  };
};