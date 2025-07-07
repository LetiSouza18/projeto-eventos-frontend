import React, { useState } from 'react';
import { Header } from './components/Header';
import { EventsList } from './components/EventsList';
import { EventForm } from './components/EventForm';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { SuccessMessage } from './components/SuccessMessage';
import { ApiDebugPanel } from './components/ApiDebugPanel';
import { useEventos } from './hooks/useEventos';
import { Evento } from './types/Event';

function App() {
  const [activeTab, setActiveTab] = useState<'events' | 'create'>('events');
  const [editingEvento, setEditingEvento] = useState<Evento | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    eventos,
    loading,
    error,
    carregarEventos,
    criarEvento,
    atualizarEvento,
    deletarEvento,
  } = useEventos();

  const handleCreateEvent = () => {
    setEditingEvento(null);
    setIsFormOpen(true);
    setActiveTab('events');
  };

  const handleEditEvent = (evento: Evento) => {
    setEditingEvento(evento);
    setIsFormOpen(true);
  };

  const handleSaveEvent = async (evento: Evento) => {
    let success = false;
    
    try {
      if (editingEvento) {
        // Atualizar evento existente
        success = await atualizarEvento(evento.id, evento);
        if (success) {
          setSuccessMessage('Evento atualizado com sucesso!');
        }
      } else {
        // Criar novo evento
        const { id, ...eventoSemId } = evento;
        success = await criarEvento(eventoSemId);
        if (success) {
          setSuccessMessage('Evento criado com sucesso!');
        }
      }

      if (success) {
        // Fechar formulário imediatamente após sucesso
        setIsFormOpen(false);
        setEditingEvento(null);
        setActiveTab('events');
      }
    } catch (error) {
      console.error('Erro ao salvar evento:', error);
      // Não fechar o formulário em caso de erro
    }
  };

  const handleDeleteEvent = async (eventoId: number) => {
    if (window.confirm('Tem certeza que deseja excluir este evento?')) {
      const success = await deletarEvento(eventoId);
      if (success) {
        setSuccessMessage('Evento excluído com sucesso!');
      }
    }
  };

  const handleTabChange = (tab: 'events' | 'create') => {
    if (tab === 'create') {
      handleCreateEvent();
    } else {
      setActiveTab(tab);
      // Fechar formulário se estiver aberto
      if (isFormOpen) {
        setIsFormOpen(false);
        setEditingEvento(null);
      }
    }
  };

  const handleCloseSuccess = () => {
    setSuccessMessage(null);
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setEditingEvento(null);
    setActiveTab('events');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white">
      <Header activeTab={activeTab} onTabChange={handleTabChange} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Eventos de Tecnologia para Mulheres
          </h2>
          <p className="text-gray-600">
            Conectando, capacitando e celebrando mulheres na tecnologia
          </p>
        </div>

        {loading && <LoadingSpinner message="Carregando eventos..." />}
        
        {error && (
          <ErrorMessage 
            message={error} 
            onRetry={carregarEventos}
          />
        )}

        {!loading && !error && (
          <EventsList
            eventos={eventos}
            onEditEvent={handleEditEvent}
            onDeleteEvent={handleDeleteEvent}
          />
        )}

        <EventForm
          evento={editingEvento}
          onSave={handleSaveEvent}
          onCancel={handleCancelForm}
          isOpen={isFormOpen}
        />

        {successMessage && (
          <SuccessMessage
            message={successMessage}
            onClose={handleCloseSuccess}
          />
        )}

        {/* Painel de debug para desenvolvimento */}
        <ApiDebugPanel />
      </main>
    </div>
  );
}

export default App;