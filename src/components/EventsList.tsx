import React from 'react';
import { Evento } from '../types/Event';
import { EventCard } from './EventCard';
import { Calendar } from 'lucide-react';

interface EventsListProps {
  eventos: Evento[];
  onEditEvent: (evento: Evento) => void;
  onDeleteEvent: (eventoId: number) => void;
}

export const EventsList: React.FC<EventsListProps> = ({ eventos, onEditEvent, onDeleteEvent }) => {
  if (eventos.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="h-16 w-16 text-pink-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhum evento cadastrado</h3>
        <p className="text-gray-500">Crie seu primeiro evento para começar!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {eventos.map((evento) => (
        <EventCard
          key={evento.id}
          evento={evento}
          onEdit={onEditEvent}
          onDelete={onDeleteEvent}
        />
      ))}
    </div>
  );
};