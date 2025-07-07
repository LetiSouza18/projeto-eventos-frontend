import { api } from './api';
import { Atividade } from '../types/Event';

export const atividadeService = {
  // Listar todas as atividades
  listarAtividades: async (): Promise<Atividade[]> => {
    try {
      const response = await api.get<Atividade[]>('/atividades');
      return response;
    } catch (error) {
      console.error('Erro ao listar atividades:', error);
      throw new Error('Falha ao carregar atividades');
    }
  },

  // Listar atividades por evento
  listarAtividadesPorEvento: async (eventoId: number): Promise<Atividade[]> => {
    try {
      const response = await api.get<Atividade[]>(`/eventos/${eventoId}/atividades`);
      return response;
    } catch (error) {
      console.error('Erro ao listar atividades do evento:', error);
      throw new Error('Falha ao carregar atividades do evento');
    }
  },

  // Criar nova atividade
  criarAtividade: async (atividade: Omit<Atividade, 'id'>, eventoId: number): Promise<Atividade> => {
    try {
      // Preparar dados para envio, removendo campos de exibição
      const atividadeParaEnvio = {
        nome: atividade.nome,
        data: atividade.data,
        descricao: atividade.descricao,
        horario_inicio: atividade.horario_inicio,
        horario_fim: atividade.horario_fim,
        detalhe_local: atividade.detalhe_local,
        idTipo: atividade.idTipo,
        idInstituicao: atividade.idInstituicao,
        idPublicoAlvo: atividade.idPublicoAlvo,
        idResponsavel: atividade.idResponsavel,
        temas: atividade.temas?.map(tema => tema.id) || []
      };
      
      console.log('📤 Criando atividade:', atividadeParaEnvio);
      const response = await api.post<Atividade>(`/eventos/${eventoId}/atividades`, atividadeParaEnvio);
      return response;
    } catch (error) {
      console.error('Erro ao criar atividade:', error);
      throw new Error('Falha ao criar atividade');
    }
  },

  // Atualizar atividade existente
  atualizarAtividade: async (id: number, atividade: Partial<Atividade>): Promise<Atividade> => {
    try {
      // Preparar dados para envio, removendo campos de exibição
      const atividadeParaEnvio = {
        nome: atividade.nome,
        data: atividade.data,
        descricao: atividade.descricao,
        horario_inicio: atividade.horario_inicio,
        horario_fim: atividade.horario_fim,
        detalhe_local: atividade.detalhe_local,
        idTipo: atividade.idTipo,
        idInstituicao: atividade.idInstituicao,
        idPublicoAlvo: atividade.idPublicoAlvo,
        idResponsavel: atividade.idResponsavel,
        temas: atividade.temas?.map(tema => tema.id) || []
      };
      
      console.log('📤 Atualizando atividade:', id, atividadeParaEnvio);
      const response = await api.put<Atividade>(`/atividades/${id}`, atividadeParaEnvio);
      return response;
    } catch (error) {
      console.error('Erro ao atualizar atividade:', error);
      throw new Error('Falha ao atualizar atividade');
    }
  },

  // Deletar atividade
  deletarAtividade: async (id: number): Promise<void> => {
    try {
      console.log('📤 Deletando atividade:', id);
      await api.delete(`/atividades/${id}`);
    } catch (error) {
      console.error('Erro ao deletar atividade:', error);
      throw new Error('Falha ao deletar atividade');
    }
  },
};