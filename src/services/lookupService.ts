import { api } from './api';
import { Tema, Tipo, Instituicao, PublicoAlvo, Responsavel } from '../types/Event';

// Serviços para buscar dados de lookup (temas, tipos, etc.)
export const lookupService = {
  // Buscar todos os temas
  listarTemas: async (): Promise<Tema[]> => {
    try {
      const response = await api.get<Tema[]>('/temas');
      return response;
    } catch (error) {
      console.error('Erro ao listar temas:', error);
      throw new Error('Falha ao carregar temas');
    }
  },

  // Buscar todos os tipos
  listarTipos: async (): Promise<Tipo[]> => {
    try {
      const response = await api.get<Tipo[]>('/tipos');
      return response;
    } catch (error) {
      console.error('Erro ao listar tipos:', error);
      throw new Error('Falha ao carregar tipos');
    }
  },

  // Buscar todas as instituições
  listarInstituicoes: async (): Promise<Instituicao[]> => {
    try {
      const response = await api.get<Instituicao[]>('/instituicoes');
      return response;
    } catch (error) {
      console.error('Erro ao listar instituições:', error);
      throw new Error('Falha ao carregar instituições');
    }
  },

  // Buscar todos os públicos-alvo
  listarPublicosAlvo: async (): Promise<PublicoAlvo[]> => {
    try {
      const response = await api.get<PublicoAlvo[]>('/publicos-alvo');
      return response;
    } catch (error) {
      console.error('Erro ao listar públicos-alvo:', error);
      throw new Error('Falha ao carregar públicos-alvo');
    }
  },

  // Buscar todos os responsáveis
  listarResponsaveis: async (): Promise<Responsavel[]> => {
    try {
      const response = await api.get<Responsavel[]>('/responsaveis');
      return response;
    } catch (error) {
      console.error('Erro ao listar responsáveis:', error);
      throw new Error('Falha ao carregar responsáveis');
    }
  },
};