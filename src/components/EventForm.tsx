import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, AlertCircle } from 'lucide-react';
import { Evento, Atividade, AtividadeUnica, Tema, Tipo, Instituicao, PublicoAlvo, Responsavel } from '../types/Event';
import { useLookupData } from '../hooks/useLookupData';
import { LoadingSpinner } from './LoadingSpinner';

interface EventFormProps {
  evento?: Evento;
  onSave: (evento: Evento) => void;
  onCancel: () => void;
  isOpen: boolean;
}

export const EventForm: React.FC<EventFormProps> = ({ evento, onSave, onCancel, isOpen }) => {
  const [formData, setFormData] = useState<Partial<Evento>>({
    titulo: '',
    data_inicio: undefined,
    data_fim: undefined,
    descricao: '',
    valor: '',
    modalidade: '',
    link_inscricao: '',
    imagem_url: '',
    data_limite_inscricoes: undefined,
    atividades: [],
    atividadesUnicas: []
  });

  const [eventType, setEventType] = useState<'unique-activity' | 'multi-activity'>('unique-activity');
  
  // Estado para atividade única integrada
  const [atividadeUnica, setAtividadeUnica] = useState<Partial<AtividadeUnica>>({
    horario_inicio: '',
    horario_fim: '',
    detalhe_local: '',
    idInstituicao: undefined,
    idPublicoAlvo: undefined,
    idResponsavel: undefined,
    temas: []
  });

  const [newAtividade, setNewAtividade] = useState<Partial<Atividade>>({
    nome: '',
    descricao: '',
    horario_inicio: '',
    horario_fim: '',
    detalhe_local: '',
    idTipo: undefined,
    idInstituicao: undefined,
    idPublicoAlvo: undefined,
    idResponsavel: undefined,
    temas: []
  });

  // Usar o hook para carregar dados de lookup
  const {
    temas,
    tipos,
    instituicoes,
    publicosAlvo,
    responsaveis,
    loading: lookupLoading,
    error: lookupError,
    recarregarDados
  } = useLookupData();

  useEffect(() => {
    if (evento) {
      // Converter datas string para Date objects se necessário
      const eventoProcessado = {
        ...evento,
        data_inicio: evento.data_inicio ? (typeof evento.data_inicio === 'string' ? new Date(evento.data_inicio) : evento.data_inicio) : undefined,
        data_fim: evento.data_fim ? (typeof evento.data_fim === 'string' ? new Date(evento.data_fim) : evento.data_fim) : undefined,
        data_limite_inscricoes: evento.data_limite_inscricoes ? (typeof evento.data_limite_inscricoes === 'string' ? new Date(evento.data_limite_inscricoes) : evento.data_limite_inscricoes) : undefined,
      };
      
      setFormData(eventoProcessado);
      
      // Determinar o tipo do evento baseado nas atividades
      if (evento.atividades && evento.atividades.length > 0) {
        setEventType('multi-activity');
      } else {
        setEventType('unique-activity');
        // Se tem atividade única, carregar seus dados
        if (evento.atividadesUnicas && evento.atividadesUnicas.length > 0) {
          setAtividadeUnica(evento.atividadesUnicas[0]);
        }
      }
    } else {
      setFormData({
        titulo: '',
        data_inicio: undefined,
        data_fim: undefined,
        descricao: '',
        valor: '',
        modalidade: '',
        link_inscricao: '',
        imagem_url: '',
        data_limite_inscricoes: undefined,
        atividades: [],
        atividadesUnicas: []
      });
      setEventType('unique-activity');
      setAtividadeUnica({
        horario_inicio: '',
        horario_fim: '',
        detalhe_local: '',
        idInstituicao: undefined,
        idPublicoAlvo: undefined,
        idResponsavel: undefined,
        temas: []
      });
    }
  }, [evento]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Preparar dados do evento com base no tipo selecionado
    let atividades: Atividade[] = [];
    let atividadesUnicas: AtividadeUnica[] = [];

    if (eventType === 'multi-activity') {
      atividades = formData.atividades || [];
    } else if (eventType === 'unique-activity') {
      // Se tem dados na atividade única, incluir
      if (atividadeUnica.horario_inicio || atividadeUnica.horario_fim || atividadeUnica.detalhe_local || 
          atividadeUnica.idInstituicao || atividadeUnica.idPublicoAlvo || atividadeUnica.idResponsavel ||
          (atividadeUnica.temas && atividadeUnica.temas.length > 0)) {
        
        // Buscar objetos relacionados para exibição
        const instituicao = instituicoes.find(i => i.id === atividadeUnica.idInstituicao);
        const publicoAlvo = publicosAlvo.find(p => p.id === atividadeUnica.idPublicoAlvo);
        const responsavel = responsaveis.find(r => r.id === atividadeUnica.idResponsavel);

        const atividadeUnicaCompleta: AtividadeUnica = {
          id: evento?.atividadesUnicas?.[0]?.id || Date.now(),
          horario_inicio: atividadeUnica.horario_inicio,
          horario_fim: atividadeUnica.horario_fim,
          detalhe_local: atividadeUnica.detalhe_local,
          idInstituicao: atividadeUnica.idInstituicao,
          idPublicoAlvo: atividadeUnica.idPublicoAlvo,
          idResponsavel: atividadeUnica.idResponsavel,
          temas: atividadeUnica.temas || [],
          // Objetos para exibição
          instituicao,
          publicoAlvo,
          responsavel
        };
        
        atividadesUnicas = [atividadeUnicaCompleta];
      }
    }

    const eventoData: Evento = {
      id: evento?.id || Date.now(),
      titulo: formData.titulo || '',
      data_inicio: formData.data_inicio,
      data_fim: formData.data_fim,
      descricao: formData.descricao,
      valor: formData.valor,
      modalidade: formData.modalidade,
      link_inscricao: formData.link_inscricao,
      imagem_url: formData.imagem_url,
      data_limite_inscricoes: formData.data_limite_inscricoes,
      atividades,
      atividadesUnicas
    };

    console.log('📝 Dados do evento sendo enviados:', eventoData);
    onSave(eventoData);
  };

  const addAtividade = () => {
    if (newAtividade.nome) {
      // Buscar objetos relacionados para exibição
      const tipo = tipos.find(t => t.id === newAtividade.idTipo);
      const instituicao = instituicoes.find(i => i.id === newAtividade.idInstituicao);
      const publicoAlvo = publicosAlvo.find(p => p.id === newAtividade.idPublicoAlvo);
      const responsavel = responsaveis.find(r => r.id === newAtividade.idResponsavel);

      const atividade: Atividade = {
        id: Date.now(),
        nome: newAtividade.nome,
        descricao: newAtividade.descricao,
        horario_inicio: newAtividade.horario_inicio,
        horario_fim: newAtividade.horario_fim,
        detalhe_local: newAtividade.detalhe_local,
        idTipo: newAtividade.idTipo,
        idInstituicao: newAtividade.idInstituicao,
        idPublicoAlvo: newAtividade.idPublicoAlvo,
        idResponsavel: newAtividade.idResponsavel,
        temas: newAtividade.temas || [],
        // Objetos para exibição
        tipo,
        instituicao,
        publicoAlvo,
        responsavel
      };
      
      setFormData(prev => ({
        ...prev,
        atividades: [...(prev.atividades || []), atividade]
      }));
      
      setNewAtividade({
        nome: '',
        descricao: '',
        horario_inicio: '',
        horario_fim: '',
        detalhe_local: '',
        idTipo: undefined,
        idInstituicao: undefined,
        idPublicoAlvo: undefined,
        idResponsavel: undefined,
        temas: []
      });
    }
  };

  const removeAtividade = (atividadeId: number) => {
    setFormData(prev => ({
      ...prev,
      atividades: prev.atividades?.filter(atividade => atividade.id !== atividadeId) || []
    }));
  };

  // Função para limpar atividades quando o tipo de evento muda
  const handleEventTypeChange = (newType: 'unique-activity' | 'multi-activity') => {
    setEventType(newType);
    
    // Limpar atividades baseado no novo tipo
    setFormData(prev => ({
      ...prev,
      atividades: newType === 'multi-activity' ? prev.atividades : [],
      atividadesUnicas: []
    }));

    // Limpar atividade única se mudou para múltiplas atividades
    if (newType === 'multi-activity') {
      setAtividadeUnica({
        horario_inicio: '',
        horario_fim: '',
        detalhe_local: '',
        idInstituicao: undefined,
        idPublicoAlvo: undefined,
        idResponsavel: undefined,
        temas: []
      });
    }
  };

  // Função para gerenciar temas selecionados na atividade múltipla
  const handleTemaToggleAtividade = (temaId: number) => {
    setNewAtividade(prev => {
      const currentTemas = prev.temas || [];
      const temaExists = currentTemas.some(t => t.id === temaId);
      
      if (temaExists) {
        return {
          ...prev,
          temas: currentTemas.filter(t => t.id !== temaId)
        };
      } else {
        const tema = temas.find(t => t.id === temaId);
        return {
          ...prev,
          temas: tema ? [...currentTemas, tema] : currentTemas
        };
      }
    });
  };

  // Função para gerenciar temas selecionados na atividade única
  const handleTemaToggleAtividadeUnica = (temaId: number) => {
    setAtividadeUnica(prev => {
      const currentTemas = prev.temas || [];
      const temaExists = currentTemas.some(t => t.id === temaId);
      
      if (temaExists) {
        return {
          ...prev,
          temas: currentTemas.filter(t => t.id !== temaId)
        };
      } else {
        const tema = temas.find(t => t.id === temaId);
        return {
          ...prev,
          temas: tema ? [...currentTemas, tema] : currentTemas
        };
      }
    });
  };

  if (!isOpen) return null;

  // Mostrar loading enquanto carrega dados de lookup
  if (lookupLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl p-8">
          <LoadingSpinner message="Carregando dados do formulário..." />
        </div>
      </div>
    );
  }

  // Mostrar erro se falhou ao carregar dados de lookup
  if (lookupError) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl p-8 max-w-md">
          <div className="flex items-center mb-4">
            <AlertCircle className="h-6 w-6 text-red-500 mr-3" />
            <h3 className="text-lg font-semibold text-red-800">Erro ao Carregar Dados</h3>
          </div>
          <p className="text-red-700 mb-4">{lookupError}</p>
          <div className="flex space-x-3">
            <button
              onClick={recarregarDados}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Tentar Novamente
            </button>
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {evento ? 'Editar Evento' : 'Criar Novo Evento'}
            </h2>
            <button
              onClick={onCancel}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título do Evento *
              </label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                value={formData.descricao}
                onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Início
                </label>
                <input
                  type="date"
                  value={formData.data_inicio ? new Date(formData.data_inicio).toISOString().split('T')[0] : ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    data_inicio: e.target.value ? new Date(e.target.value) : undefined 
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Fim
                </label>
                <input
                  type="date"
                  value={formData.data_fim ? new Date(formData.data_fim).toISOString().split('T')[0] : ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    data_fim: e.target.value ? new Date(e.target.value) : undefined 
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Modalidade
                </label>
                <select
                  value={formData.modalidade || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, modalidade: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                >
                  <option value="">Selecione a modalidade</option>
                  <option value="Presencial">Presencial</option>
                  <option value="Online">Online</option>
                  <option value="Híbrido">Híbrido</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor
                </label>
                <input
                  type="text"
                  value={formData.valor}
                  onChange={(e) => setFormData(prev => ({ ...prev, valor: e.target.value }))}
                  placeholder="Ex: Gratuito, R$ 50,00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link de Inscrição
                </label>
                <input
                  type="url"
                  value={formData.link_inscricao}
                  onChange={(e) => setFormData(prev => ({ ...prev, link_inscricao: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data Limite para Inscrições
                </label>
                <input
                  type="date"
                  value={formData.data_limite_inscricoes ? new Date(formData.data_limite_inscricoes).toISOString().split('T')[0] : ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    data_limite_inscricoes: e.target.value ? new Date(e.target.value) : undefined 
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL da Imagem
              </label>
              <input
                type="url"
                value={formData.imagem_url}
                onChange={(e) => setFormData(prev => ({ ...prev, imagem_url: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Evento
              </label>
              <select
                value={eventType}
                onChange={(e) => handleEventTypeChange(e.target.value as 'unique-activity' | 'multi-activity')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              >
                <option value="unique-activity">Evento (Atividade Única)</option>
                <option value="multi-activity">Evento com Múltiplas Atividades</option>
              </select>
            </div>

            {eventType === 'unique-activity' && (
              <div className="bg-pink-50 p-6 rounded-lg border border-pink-200">
                <h3 className="text-lg font-semibold text-pink-800 mb-4">Detalhes da Atividade (Opcional)</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Horário de Início
                    </label>
                    <input
                      type="time"
                      value={atividadeUnica.horario_inicio || ''}
                      onChange={(e) => setAtividadeUnica(prev => ({ ...prev, horario_inicio: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Horário de Fim
                    </label>
                    <input
                      type="time"
                      value={atividadeUnica.horario_fim || ''}
                      onChange={(e) => setAtividadeUnica(prev => ({ ...prev, horario_fim: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Local Específico
                    </label>
                    <input
                      type="text"
                      value={atividadeUnica.detalhe_local || ''}
                      onChange={(e) => setAtividadeUnica(prev => ({ ...prev, detalhe_local: e.target.value }))}
                      placeholder="Ex: Sala 101, Auditório Principal"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instituição
                    </label>
                    <select
                      value={atividadeUnica.idInstituicao || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        setAtividadeUnica(prev => ({ 
                          ...prev, 
                          idInstituicao: value ? Number(value) : undefined 
                        }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    >
                      <option value="">Selecione a instituição</option>
                      {instituicoes.map(inst => (
                        <option key={inst.id} value={inst.id}>{inst.nome}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Público-Alvo
                    </label>
                    <select
                      value={atividadeUnica.idPublicoAlvo || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        setAtividadeUnica(prev => ({ 
                          ...prev, 
                          idPublicoAlvo: value ? Number(value) : undefined 
                        }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    >
                      <option value="">Selecione o público-alvo</option>
                      {publicosAlvo.map(pub => (
                        <option key={pub.id} value={pub.id}>{pub.descricao}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Responsável
                    </label>
                    <select
                      value={atividadeUnica.idResponsavel || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        setAtividadeUnica(prev => ({ 
                          ...prev, 
                          idResponsavel: value ? Number(value) : undefined 
                        }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    >
                      <option value="">Selecione o responsável</option>
                      {responsaveis.map(resp => (
                        <option key={resp.id} value={resp.id}>{resp.nome}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Temas</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {temas.map(tema => (
                      <label key={tema.id} className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          checked={atividadeUnica.temas?.some(t => t.id === tema.id) || false}
                          onChange={() => handleTemaToggleAtividadeUnica(tema.id)}
                          className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                        />
                        <span>{tema.nome}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {eventType === 'multi-activity' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Atividades (Opcional)
                </label>
                
                <div className="space-y-4 mb-4">
                  {formData.atividades?.map((atividade) => (
                    <div key={atividade.id} className="bg-pink-50 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-800">{atividade.nome}</h4>
                        <button
                          type="button"
                          onClick={() => removeAtividade(atividade.id)}
                          className="text-red-600 hover:bg-red-100 p-1 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      {atividade.descricao && (
                        <p className="text-sm text-gray-600 mb-2">{atividade.descricao}</p>
                      )}
                      <div className="grid grid-cols-2 gap-4 text-sm text-pink-600">
                        <span>{atividade.horario_inicio} - {atividade.horario_fim}</span>
                        {atividade.detalhe_local && <span>Local: {atividade.detalhe_local}</span>}
                        {atividade.tipo && <span>Tipo: {atividade.tipo.nome}</span>}
                        {atividade.responsavel && <span>Responsável: {atividade.responsavel.nome}</span>}
                      </div>
                      {atividade.temas && atividade.temas.length > 0 && (
                        <div className="mt-2">
                          <span className="text-xs text-gray-500">Temas: </span>
                          {atividade.temas.map(tema => (
                            <span key={tema.id} className="inline-block bg-pink-200 text-pink-800 text-xs px-2 py-1 rounded mr-1">
                              {tema.nome}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-3">Adicionar Nova Atividade</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <input
                      type="text"
                      placeholder="Nome da atividade *"
                      value={newAtividade.nome}
                      onChange={(e) => setNewAtividade(prev => ({ ...prev, nome: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    />
                    <input
                      type="text"
                      placeholder="Local específico"
                      value={newAtividade.detalhe_local}
                      onChange={(e) => setNewAtividade(prev => ({ ...prev, detalhe_local: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    />
                    <input
                      type="time"
                      value={newAtividade.horario_inicio}
                      onChange={(e) => setNewAtividade(prev => ({ ...prev, horario_inicio: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    />
                    <input
                      type="time"
                      value={newAtividade.horario_fim}
                      onChange={(e) => setNewAtividade(prev => ({ ...prev, horario_fim: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <select
                      value={newAtividade.idTipo || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        setNewAtividade(prev => ({ 
                          ...prev, 
                          idTipo: value ? Number(value) : undefined 
                        }));
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    >
                      <option value="">Selecione o tipo</option>
                      {tipos.map(tipo => (
                        <option key={tipo.id} value={tipo.id}>{tipo.nome}</option>
                      ))}
                    </select>

                    <select
                      value={newAtividade.idInstituicao || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        setNewAtividade(prev => ({ 
                          ...prev, 
                          idInstituicao: value ? Number(value) : undefined 
                        }));
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    >
                      <option value="">Selecione a instituição</option>
                      {instituicoes.map(inst => (
                        <option key={inst.id} value={inst.id}>{inst.nome}</option>
                      ))}
                    </select>

                    <select
                      value={newAtividade.idPublicoAlvo || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        setNewAtividade(prev => ({ 
                          ...prev, 
                          idPublicoAlvo: value ? Number(value) : undefined 
                        }));
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    >
                      <option value="">Selecione o público-alvo</option>
                      {publicosAlvo.map(pub => (
                        <option key={pub.id} value={pub.id}>{pub.descricao}</option>
                      ))}
                    </select>

                    <select
                      value={newAtividade.idResponsavel || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        setNewAtividade(prev => ({ 
                          ...prev, 
                          idResponsavel: value ? Number(value) : undefined 
                        }));
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    >
                      <option value="">Selecione o responsável</option>
                      {responsaveis.map(resp => (
                        <option key={resp.id} value={resp.id}>{resp.nome}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Temas</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {temas.map(tema => (
                        <label key={tema.id} className="flex items-center space-x-2 text-sm">
                          <input
                            type="checkbox"
                            checked={newAtividade.temas?.some(t => t.id === tema.id) || false}
                            onChange={() => handleTemaToggleAtividade(tema.id)}
                            className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                          />
                          <span>{tema.nome}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <input
                    type="text"
                    placeholder="Descrição da atividade"
                    value={newAtividade.descricao}
                    onChange={(e) => setNewAtividade(prev => ({ ...prev, descricao: e.target.value }))}
                    className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  />
                  
                  <button
                    type="button"
                    onClick={addAtividade}
                    disabled={!newAtividade.nome}
                    className="flex items-center space-x-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Adicionar Atividade</span>
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
              >
                {evento ? 'Atualizar' : 'Criar'} Evento
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};