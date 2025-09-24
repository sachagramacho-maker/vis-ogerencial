// Serviço para integração com Monday.com
export interface MondayItem {
  id: string;
  name: string;
  column_values: {
    id: string;
    text: string;
    value?: string;
  }[];
}

export interface MondayBoard {
  id: string;
  name: string;
  items: MondayItem[];
}

export interface TimelineElement {
  id: string;
  name: string;
  previsto: number;
  realizado: number;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
}

// Configuração da API Monday.com
const MONDAY_API_URL = 'https://api.monday.com/v2';
const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjU2NDYzNzkwMywiYWFpIjoxMSwidWlkIjo1OTk4NTY4MywiaWFkIjoiMjAyNS0wOS0yMVQxMjo0NTozMS4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MjMwODY3MDUsInJnbiI6InVzZTEifQ.eU7JV3ubZnjLsn_Znqz5mHwslh-8P5e-D0WfgxYi7JM';

// Headers para requisições
const getHeaders = () => ({
  'Authorization': API_KEY,
  'Content-Type': 'application/json',
  'API-Version': '2023-10'
});

// Query GraphQL para buscar dados do board
const getBoardQuery = (boardId: string) => `
  query {
    boards(ids: [${boardId}]) {
      id
      name
      items {
        id
        name
        column_values {
          id
          text
          value
        }
      }
    }
  }
`;

// Função para buscar dados do Monday.com
export const fetchMondayBoard = async (boardId: string): Promise<TimelineElement[]> => {
  try {
    const response = await fetch(MONDAY_API_URL, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        query: getBoardQuery(boardId)
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      throw new Error(`Monday.com API error: ${data.errors[0].message}`);
    }

    const board = data.data.boards[0];
    if (!board) {
      throw new Error('Board not found');
    }

    return transformMondayDataToTimeline(board);
  } catch (error) {
    console.error('Erro ao buscar dados do Monday.com:', error);
    throw error;
  }
};

// Função para transformar dados do Monday.com em elementos da timeline
const transformMondayDataToTimeline = (board: MondayBoard): TimelineElement[] => {
  return board.items.map(item => {
    // Buscar colunas de percentual
    const previstoColumn = item.column_values.find(col => 
      col.id.includes('previsto') || col.text.toLowerCase().includes('previsto')
    );
    const realizadoColumn = item.column_values.find(col => 
      col.id.includes('real') || col.text.toLowerCase().includes('real')
    );

    // Extrair valores percentuais
    const previsto = extractPercentage(previstoColumn?.text || '0');
    const realizado = extractPercentage(realizadoColumn?.text || '0');

    // Determinar status baseado nos percentuais
    const status = determineStatus(previsto, realizado);

    return {
      id: item.id,
      name: item.name,
      previsto,
      realizado,
      status
    };
  });
};

// Função auxiliar para extrair percentual do texto
const extractPercentage = (text: string): number => {
  const match = text.match(/(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : 0;
};

// Função auxiliar para determinar status
const determineStatus = (previsto: number, realizado: number): TimelineElement['status'] => {
  if (realizado === 0 && previsto === 0) return 'pending';
  if (realizado >= 100) return 'completed';
  if (realizado < previsto && (previsto - realizado) > 20) return 'delayed';
  if (realizado > 0) return 'in_progress';
  return 'pending';
};

// Dados mock para desenvolvimento (remover quando integração estiver funcionando)
export const getMockTimelineData = (): TimelineElement[] => [
  { id: '1', name: 'Requisitos Iniciais', previsto: 100, realizado: 100, status: 'completed' },
  { id: '2', name: 'Contratação de Recursos', previsto: 87, realizado: 21, status: 'delayed' },
  { id: '3', name: 'Estudo de Viabilidade', previsto: 38, realizado: 0, status: 'pending' },
  { id: '4', name: 'Anteprojeto', previsto: 85, realizado: 75, status: 'in_progress' },
  { id: '5', name: 'SC - 1ª Fase', previsto: 0, realizado: 0, status: 'pending' },
  { id: '6', name: 'Projeto Pré-Executivo', previsto: 100, realizado: 100, status: 'completed' },
  { id: '7', name: 'SC - 2ª Fase', previsto: 100, realizado: 100, status: 'completed' },
  { id: '8', name: 'Projeto Legal', previsto: 100, realizado: 100, status: 'completed' },
  { id: '9', name: 'Projeto Básico', previsto: 50, realizado: 30, status: 'in_progress' },
  { id: '10', name: 'Orçamento', previsto: 100, realizado: 100, status: 'completed' },
  { id: '11', name: 'SC - 3ª Fase', previsto: 0, realizado: 0, status: 'pending' },
  { id: '12', name: 'Projeto Executivo', previsto: 0, realizado: 0, status: 'pending' }
];

// Hook personalizado para usar dados do Monday.com
export const useMondayData = (boardId: string = '9397640249') => {
  const [timelineData, setTimelineData] = React.useState<TimelineElement[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Tentar buscar dados reais do Monday.com
      const data = await fetchMondayBoard(boardId);
      setTimelineData(data);
    } catch (err) {
      console.warn('Falha ao conectar com Monday.com, usando dados mock:', err);
      // Fallback para dados mock em caso de erro
      setTimelineData(getMockTimelineData());
      setError('Usando dados de exemplo. Verifique a conexão com Monday.com.');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    loadData();
  }, [boardId]);

  return {
    timelineData,
    isLoading,
    error,
    refetch: loadData
  };
};