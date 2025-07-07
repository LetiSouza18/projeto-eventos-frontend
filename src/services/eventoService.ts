import { api } from './api';
import { Evento, Atividade, AtividadeUnica } from '../types/Event';
import { atividadeService } from './atividadeService';
import { atividadeUnicaService } from './atividadeUnicaService';

export const eventoService = {
  // Listar todos os eventos
  listarEventos: async (): Promise<Evento[]> => {
    try {
      const response = await api.get<Evento[]>('/eventos');
      return response;
    } catch (error) {
      console.error('Erro ao listar eventos:', error);
      throw new Error('Falha ao carregar eventos');
    }
  },

  // Criar novo evento com atividades
  criarEvento: async (evento: Omit<Evento, 'id'>): Promise<Evento> => {
    try {
      console.log('📤 Iniciando criação de evento completo:', evento);
      
      // 1. Primeiro, criar o evento básico (sem atividades)
      const eventoBasico = {
        titulo: evento.titulo,
        data_inicio: evento.data_inicio,
        data_fim: evento.data_fim,
        descricao: evento.descricao,
        valor: evento.valor,
        modalidade: evento.modalidade,
        link_inscricao: evento.link_inscricao,
        imagem_url: evento.imagem_url,
        data_limite_inscricoes: evento.data_limite_inscricoes
      };
      
      console.log('📤 Criando evento básico:', eventoBasico);
      const eventoSalvo = await api.post<Evento>('/eventos', eventoBasico);
      console.log('✅ Evento básico criado:', eventoSalvo);
      
      // 2. Salvar atividades múltiplas se existirem
      let atividadesSalvas: Atividade[] = [];
      if (evento.atividades && evento.atividades.length > 0) {
        console.log('📤 Salvando atividades múltiplas:', evento.atividades);
        
        for (const atividade of evento.atividades) {
          const atividadeParaSalvar = {
            ...atividade,
            // Remover campos que não devem ser enviados
            id: undefined,
            tipo: undefined,
            instituicao: undefined,
            publicoAlvo: undefined,
            responsavel: undefined
          };
          
          const atividadeSalva = await atividadeService.criarAtividade(atividadeParaSalvar, eventoSalvo.id);
          atividadesSalvas.push(atividadeSalva);
        }
        
        console.log('✅ Atividades múltiplas salvas:', atividadesSalvas);
      }
      
      // 3. Salvar atividades únicas se existirem
      let atividadesUnicasSalvas: AtividadeUnica[] = [];
      if (evento.atividadesUnicas && evento.atividadesUnicas.length > 0) {
        console.log('📤 Salvando atividades únicas:', evento.atividadesUnicas);
        
        for (const atividadeUnica of evento.atividadesUnicas) {
          const atividadeUnicaParaSalvar = {
            ...atividadeUnica,
            // Remover campos que não devem ser enviados
            id: undefined,
            instituicao: undefined,
            publicoAlvo: undefined,
            responsavel: undefined
          };
          
          const atividadeUnicaSalva = await atividadeUnicaService.criarAtividadeUnica(atividadeUnicaParaSalvar, eventoSalvo.id);
          atividadesUnicasSalvas.push(atividadeUnicaSalva);
        }
        
        console.log('✅ Atividades únicas salvas:', atividadesUnicasSalvas);
      }
      
      // 4. Retornar evento completo com atividades
      const eventoCompleto = {
        ...eventoSalvo,
        atividades: atividadesSalvas,
        atividadesUnicas: atividadesUnicasSalvas
      };
      
      console.log('✅ Evento completo criado:', eventoCompleto);
      return eventoCompleto;
      
    } catch (error) {
      console.error('❌ Erro ao criar evento:', error);
      throw new Error('Falha ao criar evento');
    }
  },

  // Atualizar evento existente com atividades
  atualizarEvento: async (id: number, evento: Partial<Evento>): Promise<Evento> => {
    try {
      console.log('📤 Iniciando atualização de evento completo:', id, evento);
      
      // 1. Atualizar dados básicos do evento
      const eventoBasico = {
        titulo: evento.titulo,
        data_inicio: evento.data_inicio,
        data_fim: evento.data_fim,
        descricao: evento.descricao,
        valor: evento.valor,
        modalidade: evento.modalidade,
        link_inscricao: evento.link_inscricao,
        imagem_url: evento.imagem_url,
        data_limite_inscricoes: evento.data_limite_inscricoes
      };
      
      console.log('📤 Atualizando evento básico:', eventoBasico);
      const eventoAtualizado = await api.put<Evento>(`/eventos/${id}`, eventoBasico);
      console.log('✅ Evento básico atualizado:', eventoAtualizado);
      
      // 2. Gerenciar atividades múltiplas
      let atividadesFinais: Atividade[] = [];
      if (evento.atividades !== undefined) {
        console.log('📤 Gerenciando atividades múltiplas...');
        
        // Buscar atividades existentes do evento
        try {
          const atividadesExistentes = await atividadeService.listarAtividadesPorEvento(id);
          
          // Deletar atividades que não estão mais na lista
          for (const atividadeExistente of atividadesExistentes) {
            const aindaExiste = evento.atividades.some(a => a.id === atividadeExistente.id);
            if (!aindaExiste) {
              await atividadeService.deletarAtividade(atividadeExistente.id);
              console.log('🗑️ Atividade removida:', atividadeExistente.id);
            }
          }
          
          // Criar ou atualizar atividades
          for (const atividade of evento.atividades) {
            const atividadeParaSalvar = {
              ...atividade,
              // Remover campos que não devem ser enviados
              tipo: undefined,
              instituicao: undefined,
              publicoAlvo: undefined,
              responsavel: undefined
            };
            
            if (atividade.id && atividadesExistentes.some(a => a.id === atividade.id)) {
              // Atualizar atividade existente
              const atividadeAtualizada = await atividadeService.atualizarAtividade(atividade.id, atividadeParaSalvar);
              atividadesFinais.push(atividadeAtualizada);
              console.log('✅ Atividade atualizada:', atividadeAtualizada);
            } else {
              // Criar nova atividade
              const { id: _, ...atividadeSemId } = atividadeParaSalvar;
              const novaAtividade = await atividadeService.criarAtividade(atividadeSemId, id);
              atividadesFinais.push(novaAtividade);
              console.log('✅ Nova atividade criada:', novaAtividade);
            }
          }
        } catch (error) {
          console.warn('⚠️ Erro ao gerenciar atividades múltiplas:', error);
          // Se não conseguir buscar atividades existentes, apenas criar as novas
          for (const atividade of evento.atividades) {
            const atividadeParaSalvar = {
              ...atividade,
              id: undefined,
              tipo: undefined,
              instituicao: undefined,
              publicoAlvo: undefined,
              responsavel: undefined
            };
            
            const novaAtividade = await atividadeService.criarAtividade(atividadeParaSalvar, id);
            atividadesFinais.push(novaAtividade);
          }
        }
      }
      
      // 3. Gerenciar atividades únicas
      let atividadesUnicasFinais: AtividadeUnica[] = [];
      if (evento.atividadesUnicas !== undefined) {
        console.log('📤 Gerenciando atividades únicas...');
        
        // Buscar atividades únicas existentes do evento
        try {
          const atividadesUnicasExistentes = await atividadeUnicaService.listarAtividadesUnicasPorEvento(id);
          
          // Deletar atividades únicas que não estão mais na lista
          for (const atividadeUnicaExistente of atividadesUnicasExistentes) {
            const aindaExiste = evento.atividadesUnicas.some(a => a.id === atividadeUnicaExistente.id);
            if (!aindaExiste) {
              await atividadeUnicaService.deletarAtividadeUnica(atividadeUnicaExistente.id);
              console.log('🗑️ Atividade única removida:', atividadeUnicaExistente.id);
            }
          }
          
          // Criar ou atualizar atividades únicas
          for (const atividadeUnica of evento.atividadesUnicas) {
            const atividadeUnicaParaSalvar = {
              ...atividadeUnica,
              // Remover campos que não devem ser enviados
              instituicao: undefined,
              publicoAlvo: undefined,
              responsavel: undefined
            };
            
            if (atividadeUnica.id && atividadesUnicasExistentes.some(a => a.id === atividadeUnica.id)) {
              // Atualizar atividade única existente
              const atividadeUnicaAtualizada = await atividadeUnicaService.atualizarAtividadeUnica(atividadeUnica.id, atividadeUnicaParaSalvar);
              atividadesUnicasFinais.push(atividadeUnicaAtualizada);
              console.log('✅ Atividade única atualizada:', atividadeUnicaAtualizada);
            } else {
              // Criar nova atividade única
              const { id: _, ...atividadeUnicaSemId } = atividadeUnicaParaSalvar;
              const novaAtividadeUnica = await atividadeUnicaService.criarAtividadeUnica(atividadeUnicaSemId, id);
              atividadesUnicasFinais.push(novaAtividadeUnica);
              console.log('✅ Nova atividade única criada:', novaAtividadeUnica);
            }
          }
        } catch (error) {
          console.warn('⚠️ Erro ao gerenciar atividades únicas:', error);
          // Se não conseguir buscar atividades únicas existentes, apenas criar as novas
          for (const atividadeUnica of evento.atividadesUnicas) {
            const atividadeUnicaParaSalvar = {
              ...atividadeUnica,
              id: undefined,
              instituicao: undefined,
              publicoAlvo: undefined,
              responsavel: undefined
            };
            
            const novaAtividadeUnica = await atividadeUnicaService.criarAtividadeUnica(atividadeUnicaParaSalvar, id);
            atividadesUnicasFinais.push(novaAtividadeUnica);
          }
        }
      }
      
      // 4. Retornar evento completo atualizado
      const eventoCompleto = {
        ...eventoAtualizado,
        atividades: atividadesFinais,
        atividadesUnicas: atividadesUnicasFinais
      };
      
      console.log('✅ Evento completo atualizado:', eventoCompleto);
      return eventoCompleto;
      
    } catch (error) {
      console.error('❌ Erro ao atualizar evento:', error);
      throw new Error('Falha ao atualizar evento');
    }
  },

  // Deletar evento
  deletarEvento: async (id: number): Promise<void> => {
    try {
      console.log('📤 Deletando evento e suas atividades:', id);
      
      // 1. Deletar atividades múltiplas associadas
      try {
        const atividades = await atividadeService.listarAtividadesPorEvento(id);
        for (const atividade of atividades) {
          await atividadeService.deletarAtividade(atividade.id);
          console.log('🗑️ Atividade deletada:', atividade.id);
        }
      } catch (error) {
        console.warn('⚠️ Erro ao deletar atividades múltiplas:', error);
      }
      
      // 2. Deletar atividades únicas associadas
      try {
        const atividadesUnicas = await atividadeUnicaService.listarAtividadesUnicasPorEvento(id);
        for (const atividadeUnica of atividadesUnicas) {
          await atividadeUnicaService.deletarAtividadeUnica(atividadeUnica.id);
          console.log('🗑️ Atividade única deletada:', atividadeUnica.id);
        }
      } catch (error) {
        console.warn('⚠️ Erro ao deletar atividades únicas:', error);
      }
      
      // 3. Deletar o evento
      await api.delete(`/eventos/${id}`);
      console.log('✅ Evento deletado:', id);
      
    } catch (error) {
      console.error('❌ Erro ao deletar evento:', error);
      throw new Error('Falha ao deletar evento');
    }
  },
};