import { ProjectData } from '../data/projectProgressData';

export interface ValidationError {
  field: string;
  message: string;
  section?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Validação de email (caso seja necessário no futuro)
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validação de URL
export const isValidUrl = (url: string): boolean => {
  if (!url || url.trim() === '') return true; // URLs vazias são válidas (opcionais)
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Validação de valor monetário
export const isValidCurrency = (value: number): boolean => {
  return !isNaN(value) && value >= 0;
};

// Validação de número de fases
export const isValidPhaseNumber = (phases: number): boolean => {
  return Number.isInteger(phases) && phases > 0 && phases <= 10;
};

// Validação de nome (não pode estar vazio)
export const isValidName = (name: string): boolean => {
  return name && name.trim().length > 0;
};

// Validação de período de referência
export const isValidPeriod = (period: string): boolean => {
  return period && period.trim().length > 0;
};

// Validação completa dos dados do projeto
export const validateProjectData = (data: ProjectData): ValidationResult => {
  const errors: ValidationError[] = [];

  // Validação do título
  if (!isValidName(data.titulo)) {
    errors.push({
      field: 'titulo',
      message: 'Título do projeto é obrigatório'
    });
  }

  // Validação do período de referência
  if (!isValidPeriod(data.periodo_referencia)) {
    errors.push({
      field: 'periodo_referencia',
      message: 'Período de referência é obrigatório'
    });
  }

  // Validação da equipe
  if (!isValidName(data.equipe.projetista)) {
    errors.push({
      field: 'projetista',
      section: 'equipe',
      message: 'Nome do projetista é obrigatório'
    });
  }

  if (!isValidName(data.equipe.orcamentista)) {
    errors.push({
      field: 'orcamentista',
      section: 'equipe',
      message: 'Nome do orçamentista é obrigatório'
    });
  }

  if (!isValidName(data.equipe.engenheiro_fiscal)) {
    errors.push({
      field: 'engenheiro_fiscal',
      section: 'equipe',
      message: 'Nome do engenheiro fiscal é obrigatório'
    });
  }

  if (!isValidName(data.equipe.pmo)) {
    errors.push({
      field: 'pmo',
      section: 'equipe',
      message: 'Nome do PMO é obrigatório'
    });
  }

  // Validação das informações
  if (!isValidPhaseNumber(data.informacoes.numero_fases)) {
    errors.push({
      field: 'numero_fases',
      section: 'informacoes',
      message: 'Número de fases deve ser um número inteiro entre 1 e 10'
    });
  }

  if (!isValidName(data.informacoes.fase_atual)) {
    errors.push({
      field: 'fase_atual',
      section: 'informacoes',
      message: 'Fase atual do projeto é obrigatória'
    });
  }

  if (!isValidName(data.informacoes.status)) {
    errors.push({
      field: 'status',
      section: 'informacoes',
      message: 'Status do projeto é obrigatório'
    });
  }

  // Validação da organização
  if (!isValidName(data.organizacao.entidade)) {
    errors.push({
      field: 'entidade',
      section: 'organizacao',
      message: 'Entidade é obrigatória'
    });
  }

  if (!isValidName(data.organizacao.unidade)) {
    errors.push({
      field: 'unidade',
      section: 'organizacao',
      message: 'Unidade é obrigatória'
    });
  }

  if (!isValidCurrency(data.organizacao.investimento_total)) {
    errors.push({
      field: 'investimento_total',
      section: 'organizacao',
      message: 'Investimento total deve ser um valor monetário válido'
    });
  }

  // Validação dos links (opcionais, mas se preenchidos devem ser válidos)
  if (data.links.monday_url && !isValidUrl(data.links.monday_url)) {
    errors.push({
      field: 'monday_url',
      section: 'links',
      message: 'URL do Monday deve ser uma URL válida'
    });
  }

  if (data.links.dash_url && !isValidUrl(data.links.dash_url)) {
    errors.push({
      field: 'dash_url',
      section: 'links',
      message: 'URL do Dashboard deve ser uma URL válida'
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validação de campo específico
export const validateField = (
  section: keyof ProjectData | null,
  field: string,
  value: any
): ValidationError | null => {
  // Validações específicas por campo
  switch (field) {
    case 'titulo':
    case 'periodo_referencia':
      return !isValidName(value) ? {
        field,
        message: `${field === 'titulo' ? 'Título' : 'Período de referência'} é obrigatório`
      } : null;

    case 'projetista':
    case 'orcamentista':
    case 'engenheiro_fiscal':
    case 'pmo':
      return !isValidName(value) ? {
        field,
        section: section as string,
        message: 'Este campo é obrigatório'
      } : null;

    case 'numero_fases':
      return !isValidPhaseNumber(value) ? {
        field,
        section: section as string,
        message: 'Deve ser um número entre 1 e 10'
      } : null;

    case 'fase_atual':
    case 'status':
    case 'entidade':
    case 'unidade':
      return !isValidName(value) ? {
        field,
        section: section as string,
        message: 'Este campo é obrigatório'
      } : null;

    case 'investimento_total':
      return !isValidCurrency(value) ? {
        field,
        section: section as string,
        message: 'Deve ser um valor monetário válido'
      } : null;

    case 'monday_url':
    case 'dash_url':
      return value && !isValidUrl(value) ? {
        field,
        section: section as string,
        message: 'Deve ser uma URL válida'
      } : null;

    default:
      return null;
  }
};

// Função para formatar mensagens de erro para exibição
export const formatValidationErrors = (errors: ValidationError[]): string[] => {
  return errors.map(error => {
    const sectionName = error.section ? getSectionDisplayName(error.section) : '';
    const fieldName = getFieldDisplayName(error.field);
    return sectionName ? `${sectionName} - ${fieldName}: ${error.message}` : `${fieldName}: ${error.message}`;
  });
};

// Nomes de exibição para seções
const getSectionDisplayName = (section: string): string => {
  const sectionNames: { [key: string]: string } = {
    equipe: 'Equipe',
    informacoes: 'Informações',
    organizacao: 'Organização',
    links: 'Links'
  };
  return sectionNames[section] || section;
};

// Nomes de exibição para campos
const getFieldDisplayName = (field: string): string => {
  const fieldNames: { [key: string]: string } = {
    titulo: 'Título',
    periodo_referencia: 'Período de Referência',
    projetista: 'Projetista',
    orcamentista: 'Orçamentista',
    engenheiro_fiscal: 'Engenheiro Fiscal',
    pmo: 'PMO',
    numero_fases: 'Número de Fases',
    fase_atual: 'Fase Atual',
    status: 'Status',
    entidade: 'Entidade',
    unidade: 'Unidade',
    investimento_total: 'Investimento Total',
    monday_url: 'Link Monday',
    dash_url: 'Link Dashboard'
  };
  return fieldNames[field] || field;
};