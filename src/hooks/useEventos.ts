import { useState, useEffect } from 'react';
import { Evento } from '../types/Event';
import { eventoService } from '../services/eventoService';

export const useEventos = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar eventos do servidor
  const carregarEventos = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Iniciando carregamento de eventos...');
      
      const eventosData = await eventoService.listarEventos();
      console.log('✅ Eventos carregados:', eventosData);
      
      setEventos(eventosData);
    } catch (err) {
      console.error('❌ Erro ao carregar eventos:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao carregar eventos';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Criar novo evento
  const criarEvento = async (evento: Omit<Evento, 'id'>): Promise<boolean> => {
    try {
      setError(null);
      console.log('🔄 Criando novo evento:', evento);
      
      const novoEvento = await eventoService.criarEvento(evento);
      console.log('✅ Evento criado:', novoEvento);
      
      setEventos(prev => [...prev, novoEvento]);
      return true;
    } catch (err) {
      console.error('❌ Erro ao criar evento:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar evento';
      setError(errorMessage);
      return false;
    }
  };

  // Atualizar evento existente
  const atualizarEvento = async (id: number, evento: Partial<Evento>): Promise<boolean> => {
    try {
      setError(null);
      console.log('🔄 Atualizando evento:', id, evento);
      
      const eventoAtualizado = await eventoService.atualizarEvento(id, evento);
      console.log('✅ Evento atualizado:', eventoAtualizado);
      
      setEventos(prev => prev.map(e => e.id === id ? eventoAtualizado : e));
      return true;
    } catch (err) {
      console.error('❌ Erro ao atualizar evento:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar evento';
      setError(errorMessage);
      return false;
    }
  };

  // Deletar evento
  const deletarEvento = async (id: number): Promise<boolean> => {
    try {
      setError(null);
      console.log('🔄 Deletando evento:', id);
      
      await eventoService.deletarEvento(id);
      console.log('✅ Evento deletado:', id);
      
      setEventos(prev => prev.filter(e => e.id !== id));
      return true;
    } catch (err) {
      console.error('❌ Erro ao deletar evento:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar evento';
      setError(errorMessage);
      return false;
    }
  };

  // Carregar eventos na inicialização
  useEffect(() => {
    carregarEventos();
  }, []);

  return {
    eventos,
    loading,
    error,
    carregarEventos,
    criarEvento,
    atualizarEvento,
    deletarEvento,
  };
};