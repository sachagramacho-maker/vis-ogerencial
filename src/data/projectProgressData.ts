// Estrutura de dados para o aplicativo OPR - Projetos
export interface TeamMember {
  id: string;
  name: string;
  role: 'projetista' | 'orcamentista' | 'engenheiro_fiscal' | 'pmo';
}

export interface ProjectTeam {
  projetista: string;
  orcamentista: string;
  engenheiro_fiscal: string;
  pmo: string;
}

export interface ProjectInfo {
  numero_fases: number;
  fase_atual: string;
  status: 'Em Andamento' | 'Concluído' | 'Pendente' | 'Cancelado' | 'Pausado';
}

export interface OrganizationDetails {
  entidade: string;
  unidade: string;
  investimento_total: number;
}

export interface QuickLinks {
  monday_url: string;
  dash_url: string;
}

export interface ProgressPhase {
  id: string;
  name: string;
  previsto: number;
  realizado: number;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
}

export interface FinancialEstimates {
  estimativa_preliminar: number;
  estimativa_preliminar_02: number;
  estimativa_inicial: number;
  estimativa_final: number;
}

export interface FinancialBudgets {
  orcamento_primeira_fase: number;
  orcamento_segunda_fase: number;
  orcamento_analitico_total: number;
}

export interface RiskItem {
  id: string;
  description: string;
  date_registered: Date;
  status: 'active' | 'mitigated' | 'closed';
}

export interface ProjectData {
  id: string;
  titulo: string;
  periodo_referencia: string;
  equipe: ProjectTeam;
  informacoes: ProjectInfo;
  organizacao: OrganizationDetails;
  links: QuickLinks;
  progress_phases: ProgressPhase[];
  financial_estimates: FinancialEstimates;
  financial_budgets: FinancialBudgets;
  risks: RiskItem[];
  created_at: Date;
  updated_at: Date;
}

// Dados padrão para inicialização
export const defaultProgressPhases: ProgressPhase[] = [
  { id: '1', name: 'Requisitos Iniciais', previsto: 100, realizado: 100, status: 'completed' },
  { id: '2', name: 'Contratação de Recursos', previsto: 87, realizado: 21, status: 'delayed' },
  { id: '3', name: 'Estudo de Viabilidade', previsto: 38, realizado: 0, status: 'pending' },
  { id: '4', name: 'Anteprojeto', previsto: 0, realizado: 0, status: 'pending' },
  { id: '5', name: 'SC - 1ª Fase', previsto: 0, realizado: 0, status: 'pending' },
  { id: '6', name: 'Projeto Pré-Executivo', previsto: 100, realizado: 100, status: 'completed' },
  { id: '7', name: 'SC - 2ª Fase', previsto: 0, realizado: 0, status: 'pending' }
];

export const defaultProjectData: ProjectData = {
  id: 'projeto-001',
  titulo: 'OPR - Projetos',
  periodo_referencia: 'JULHO 2025',
  equipe: {
    projetista: 'Tercílio Dantas',
    orcamentista: 'Ivan Carvalho e Amanda Pedrintta',
    engenheiro_fiscal: 'Gustavo Bastos',
    pmo: 'Sacha'
  },
  informacoes: {
    numero_fases: 2,
    fase_atual: 'Estudo Preliminar',
    status: 'Em Andamento'
  },
  organizacao: {
    entidade: 'SENAI',
    unidade: 'LEM',
    investimento_total: 27374899.90
  },
  links: {
    monday_url: 'https://monday.com',
    dash_url: 'https://dashboard.com'
  },
  progress_phases: defaultProgressPhases,
  financial_estimates: {
    estimativa_preliminar: 27374899.90,
    estimativa_preliminar_02: 0,
    estimativa_inicial: 0,
    estimativa_final: 0
  },
  financial_budgets: {
    orcamento_primeira_fase: 0,
    orcamento_segunda_fase: 0,
    orcamento_analitico_total: 0
  },
  risks: [
    {
      id: '1',
      description: 'Complementares não contratados\n\nAtraso nas fases devido à solicitação de mudanças de layout e definição de terreno.',
      date_registered: new Date(),
      status: 'active'
    }
  ],
  created_at: new Date(),
  updated_at: new Date()
};

// Opções para dropdowns
export const statusOptions = [
  'Em Andamento',
  'Concluído',
  'Pendente',
  'Cancelado',
  'Pausado'
] as const;

export const faseOptions = [
  'Estudo de Viabilidade',
  'Estudo Preliminar',
  'Projeto Legal',
  'Projeto Básico',
  'Orçamento',
  'SC - 1ª Fase',
  'Projeto Pré-Executivo',
  'SC - 2ª Fase'
] as const;

export const entidadeOptions = [
  'SENAI',
  'SESI',
  'IEL',
  'FIEB'
] as const;

export const unidadeOptions = [
  'LEM',
  'CIMATEC',
  'CETIND',
  'DENDEZEIROS',
  'FEIRA DE SANTANA'
] as const;

// Lista de membros da equipe pré-cadastrados
export const teamMembers: TeamMember[] = [
  { id: '1', name: 'Tercílio Dantas', role: 'projetista' },
  { id: '2', name: 'Ivan Carvalho', role: 'orcamentista' },
  { id: '3', name: 'Amanda Pedrintta', role: 'orcamentista' },
  { id: '4', name: 'Gustavo Bastos', role: 'engenheiro_fiscal' },
  { id: '5', name: 'Sacha', role: 'pmo' },
  { id: '6', name: 'João Silva', role: 'projetista' },
  { id: '7', name: 'Maria Santos', role: 'engenheiro_fiscal' }
];

// Função para filtrar membros por função
export const getTeamMembersByRole = (role: TeamMember['role']): TeamMember[] => {
  return teamMembers.filter(member => member.role === role);
};

// Função para formatar valor monetário
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

// Função para validar URL
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Função para calcular aderência financeira
export const calculateAdherence = (value: number, total: number): number => {
  if (total === 0) return 0;
  return (value / total) * 100;
};

// Função para determinar cor do indicador
export const getAdherenceColor = (adherence: number): 'green' | 'red' => {
  return adherence >= 50 ? 'green' : 'red';
};

// Função para calcular margem de erro
export const calculateErrorMargin = (estimated: number, actual: number): number => {
  if (actual === 0) return 0;
  return (Math.abs(estimated - actual) / actual) * 100;
};

// Função para determinar cor do progresso
export const getProgressColor = (previsto: number, realizado: number): string => {
  const diff = previsto - realizado;
  
  if (realizado > previsto) return '#16a34a'; // Verde escuro - acima da meta
  if (realizado === previsto) return '#22c55e'; // Verde claro - on track
  if (diff > 20) return '#dc2626'; // Vermelho - alerta crítico
  return '#f59e0b'; // Amarelo alaranjado - atenção
};

// Função para determinar status da fase
export const getPhaseStatus = (previsto: number, realizado: number): 'completed' | 'delayed' | 'on_track' | 'pending' => {
  if (realizado === 100) return 'completed';
  if (previsto === 0 && realizado === 0) return 'pending';
  if (realizado < previsto && (previsto - realizado) > 20) return 'delayed';
  return 'on_track';
};

// Função para obter ícone do status
export const getStatusIcon = (status: string): string => {
  switch (status) {
    case 'completed': return '✓';
    case 'delayed': return '!';
    case 'on_track': return '→';
    default: return '○';
  }
};

// Função para obter cor do status
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'completed': return '#16a34a';
    case 'delayed': return '#dc2626';
    case 'on_track': return '#f59e0b';
    default: return '#6b7280';
  }
};