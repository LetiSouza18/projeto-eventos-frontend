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

      // 1. Primeiro, criar o evento básico (sem atividades aninhadas inicialmente)
      const eventoBasicoParaEnvio = {
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

      console.log('📤 Criando evento básico:', eventoBasicoParaEnvio);
      const eventoSalvo = await api.post<Evento>('/eventos', eventoBasicoParaEnvio);
      console.log('✅ Evento criado:', eventoSalvo);

      // 2. Se houver atividades, criá-las e associá-las ao evento recém-criado
      if (evento.atividades && evento.atividades.length > 0) {
        console.log('📤 Criando atividades para o evento:', eventoSalvo.id);
        const criacaoAtividadesPromises = evento.atividades.map(ativ =>
          atividadeService.criarAtividade(ativ, eventoSalvo.id)
        );
        await Promise.all(criacaoAtividadesPromises);
        console.log('✅ Atividades criadas e associadas.');
      }

      // 3. Se houver atividades únicas, criá-las e associá-las ao evento recém-criado
      if (evento.atividadesUnicas && evento.atividadesUnicas.length > 0) {
        console.log('📤 Criando atividades únicas para o evento:', eventoSalvo.id);
        const criacaoAtividadesUnicasPromises = evento.atividadesUnicas.map(ativUnica =>
          atividadeUnicaService.criarAtividadeUnica(ativUnica, eventoSalvo.id)
        );
        await Promise.all(criacaoAtividadesUnicasPromises);
        console.log('✅ Atividades únicas criadas e associadas.');
      }

      // 4. Recarregar o evento completo para ter certeza que as atividades estão incluídas
      // ou retornar o evento salvo e assumir que o frontend irá recarregar/atualizar a lista
      // Para simplicidade e consistência, vamos retornar o eventoSalvo e o frontend fará o refresh
      return eventoSalvo;

    } catch (error) {
      console.error('❌ Erro ao criar evento completo:', error);
      throw new Error('Falha ao criar evento');
    }
  },

  // Atualizar evento existente com suas atividades
  atualizarEvento: async (id: number, evento: Partial<Evento>): Promise<Evento> => {
    try {
      console.log('📤 Iniciando atualização de evento completo:', id, evento);

      // 1. Atualizar o evento básico (campos diretos do evento)
      const eventoBasicoParaEnvio = {
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

      console.log('📤 Atualizando evento básico:', id, eventoBasicoParaEnvio);
      const eventoAtualizadoBasico = await api.put<Evento>(`/eventos/${id}`, eventoBasicoParaEnvio);
      console.log('✅ Evento básico atualizado:', eventoAtualizadoBasico);

      // 2. Gerenciar Atividades (criação, atualização e exclusão)
      const atividadesExistentes = await atividadeService.listarAtividadesPorEvento(id);
      const atividadesNovasOuAtualizadas = evento.atividades || [];

      const promisesAtividades: Promise<any>[] = [];

      // Atividades a serem criadas ou atualizadas
      for (const novaAtiv of atividadesNovasOuAtualizadas) {
        const existente = atividadesExistentes.find(a => a.id === novaAtiv.id);
        if (existente) {
          // Atualizar
          promisesAtividades.push(atividadeService.atualizarAtividade(novaAtiv.id!, novaAtiv));
          console.log(`🔄 Atividade ${novaAtiv.id} atualizada.`);
        } else {
          // Criar
          promisesAtividades.push(atividadeService.criarAtividade(novaAtiv, id));
          console.log(`➕ Nova atividade '${novaAtiv.nome}' criada.`);
        }
      }

      // Atividades a serem deletadas
      for (const existenteAtiv of atividadesExistentes) {
        const aindaExiste = atividadesNovasOuAtualizadas.some(a => a.id === existenteAtiv.id);
        if (!aindaExiste) {
          // Deletar
          promisesAtividades.push(atividadeService.deletarAtividade(existenteAtiv.id));
          console.log(`🗑️ Atividade ${existenteAtiv.id} deletada.`);
        }
      }

      // 3. Gerenciar Atividades Únicas (criação, atualização e exclusão)
      const atividadesUnicasExistentes = await atividadeUnicaService.listarAtividadesUnicasPorEvento(id);
      const atividadesUnicasNovasOuAtualizadas = evento.atividadesUnicas || [];

      const promisesAtividadesUnicas: Promise<any>[] = [];

      // Atividades Únicas a serem criadas ou atualizadas
      for (const novaAtivUnica of atividadesUnicasNovasOuAtualizadas) {
        const existente = atividadesUnicasExistentes.find(a => a.id === novaAtivUnica.id);
        if (existente) {
          // Atualizar
          promisesAtividadesUnicas.push(atividadeUnicaService.atualizarAtividadeUnica(novaAtivUnica.id!, novaAtivUnica));
          console.log(`🔄 Atividade Única ${novaAtivUnica.id} atualizada.`);
        } else {
          // Criar
          promisesAtividadesUnicas.push(atividadeUnicaService.criarAtividadeUnica(novaAtivUnica, id));
          console.log(`➕ Nova atividade única criada.`);
        }
      }

      // Atividades Únicas a serem deletadas
      for (const existenteAtivUnica of atividadesUnicasExistentes) {
        const aindaExiste = atividadesUnicasNovasOuAtualizadas.some(a => a.id === existenteAtivUnica.id);
        if (!aindaExiste) {
          // Deletar
          promisesAtividadesUnicas.push(atividadeUnicaService.deletarAtividadeUnica(existenteAtivUnica.id));
          console.log(`🗑️ Atividade Única ${existenteAtivUnica.id} deletada.`);
        }
      }

      await Promise.all([...promisesAtividades, ...promisesAtividadesUnicas]);
      console.log('✅ Operações de atividades e atividades únicas concluídas.');

      // 4. Recarregar o evento completo para ter certeza que as atividades estão incluídas
      const eventoCompletoAtualizado = await eventoService.listarEventos().then(events => events.find(e => e.id === id));
      if (!eventoCompletoAtualizado) {
        throw new Error('Evento atualizado não encontrado após operações de atividades.');
      }
      return eventoCompletoAtualizado;

    } catch (err) {
      console.error('❌ Erro ao atualizar evento completo:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar evento';
      throw new Error(errorMessage);
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
      const errorMessage = error instanceof Error ? error.message : 'Erro ao deletar evento';
      throw new Error(errorMessage);
    }
  },
};