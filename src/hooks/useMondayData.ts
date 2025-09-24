import { useState, useEffect } from 'react';
import { TimelineElement, fetchMondayBoard, getMockTimelineData } from '../services/mondayService';

export const useMondayData = (boardId: string = '9397640249') => {
  const [timelineData, setTimelineData] = useState<TimelineElement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Tentar buscar dados reais do Monday.com
      const data = await fetchMondayBoard(boardId);
      setTimelineData(data);
      setLastUpdated(new Date());
      console.log('✅ Dados carregados do Monday.com:', data);
    } catch (err) {
      console.warn('⚠️ Falha ao conectar com Monday.com, usando dados mock:', err);
      // Fallback para dados mock em caso de erro
      setTimelineData(getMockTimelineData());
      setError('Usando dados de exemplo. Verifique a conexão com Monday.com.');
      setLastUpdated(new Date());
    } finally {
      setIsLoading(false);
    }
  };

  // Carregar dados na inicialização
  useEffect(() => {
    loadData();
  }, [boardId]);

  // Auto-refresh a cada 5 minutos (opcional)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isLoading) {
        console.log('🔄 Auto-refresh dos dados do Monday.com');
        loadData();
      }
    }, 5 * 60 * 1000); // 5 minutos

    return () => clearInterval(interval);
  }, [isLoading]);

  return {
    timelineData,
    isLoading,
    error,
    lastUpdated,
    refetch: loadData
  };
};