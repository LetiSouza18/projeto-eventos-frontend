import { api } from './api';
import { AtividadeUnica } from '../types/Event';

export const atividadeUnicaService = {
  // Listar todas as atividades únicas
  listarAtividadesUnicas: async (): Promise<AtividadeUnica[]> => {
    try {
      const response = await api.get<AtividadeUnica[]>('/atividades-unicas');
      return response;
    } catch (error) {
      console.error('Erro ao listar atividades únicas:', error);
      throw new Error('Falha ao carregar atividades únicas');
    }
  },

  // Listar atividades únicas por evento
  listarAtividadesUnicasPorEvento: async (eventoId: number): Promise<AtividadeUnica[]> => {
    try {
      const response = await api.get<AtividadeUnica[]>(`/eventos/${eventoId}/atividades-unicas`);
      return response;
    } catch (error) {
      console.error('Erro ao listar atividades únicas do evento:', error);
      throw new Error('Falha ao carregar atividades únicas do evento');
    }
  },

  // Criar nova atividade única
  criarAtividadeUnica: async (atividadeUnica: Omit<AtividadeUnica, 'id'>, eventoId: number): Promise<AtividadeUnica> => {
    try {
      // Preparar dados para envio, removendo campos de exibição
      const atividadeUnicaParaEnvio = {
        horario_inicio: atividadeUnica.horario_inicio,
        horario_fim: atividadeUnica.horario_fim,
        detalhe_local: atividadeUnica.detalhe_local,
        idInstituicao: atividadeUnica.idInstituicao,
        idPublicoAlvo: atividadeUnica.idPublicoAlvo,
        idResponsavel: atividadeUnica.idResponsavel,
        temas: atividadeUnica.temas?.map(tema => tema.id) || []
      };
      
      console.log('📤 Criando atividade única:', atividadeUnicaParaEnvio);
      const response = await api.post<AtividadeUnica>(`/eventos/${eventoId}/atividades-unicas`, atividadeUnicaParaEnvio);
      return response;
    } catch (error) {
      console.error('Erro ao criar atividade única:', error);
      throw new Error('Falha ao criar atividade única');
    }
  },

  // Atualizar atividade única existente
  atualizarAtividadeUnica: async (id: number, atividadeUnica: Partial<AtividadeUnica>): Promise<AtividadeUnica> => {
    try {
      // Preparar dados para envio, removendo campos de exibição
      const atividadeUnicaParaEnvio = {
        horario_inicio: atividadeUnica.horario_inicio,
        horario_fim: atividadeUnica.horario_fim,
        detalhe_local: atividadeUnica.detalhe_local,
        idInstituicao: atividadeUnica.idInstituicao,
        idPublicoAlvo: atividadeUnica.idPublicoAlvo,
        idResponsavel: atividadeUnica.idResponsavel,
        temas: atividadeUnica.temas?.map(tema => tema.id) || []
      };
      
      console.log('📤 Atualizando atividade única:', id, atividadeUnicaParaEnvio);
      const response = await api.put<AtividadeUnica>(`/atividades-unicas/${id}`, atividadeUnicaParaEnvio);
      return response;
    } catch (error) {
      console.error('Erro ao atualizar atividade única:', error);
      throw new Error('Falha ao atualizar atividade única');
    }
  },

  // Deletar atividade única
  deletarAtividadeUnica: async (id: number): Promise<void> => {
    try {
      console.log('📤 Deletando atividade única:', id);
      await api.delete(`/atividades-unicas/${id}`);
    } catch (error) {
      console.error('Erro ao deletar atividade única:', error);
      throw new Error('Falha ao deletar atividade única');
    }
  },
};