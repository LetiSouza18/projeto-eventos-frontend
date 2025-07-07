import React from 'react';
import { MapPin, Users, Calendar, Edit2, Trash2, Clock, DollarSign, Link, Image, User, Building, Target } from 'lucide-react';
import { Evento } from '../types/Event';

interface EventCardProps {
  evento: Evento;
  onEdit: (evento: Evento) => void;
  onDelete: (eventoId: number) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ evento, onEdit, onDelete }) => {
  const formatDate = (date?: Date | string) => {
    if (!date) return 'Data não definida';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateRange = () => {
    if (!evento.data_inicio) return 'Data não definida';
    if (!evento.data_fim || evento.data_inicio === evento.data_fim) {
      return formatDate(evento.data_inicio);
    }
    return `${formatDate(evento.data_inicio)} até ${formatDate(evento.data_fim)}`;
  };

  const hasMultipleActivities = evento.atividades && evento.atividades.length > 0;
  const hasUniqueActivity = evento.atividadesUnicas && evento.atividadesUnicas.length > 0;

  return (
    <div className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden ${
      hasMultipleActivities 
        ? 'border-l-4 border-pink-500' 
        : hasUniqueActivity
        ? 'border-l-4 border-pink-300'
        : 'border-l-4 border-gray-300'
    }`}>
      {evento.imagem_url && (
        <div className="h-48 bg-gradient-to-r from-pink-100 to-pink-200 flex items-center justify-center">
          <Image className="h-12 w-12 text-pink-400" />
          <span className="ml-2 text-pink-600 text-sm">Imagem do evento</span>
        </div>
      )}
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{evento.titulo}</h3>
            {evento.descricao && (
              <p className="text-gray-600 mb-3">{evento.descricao}</p>
            )}
          </div>
          
          <div className="flex space-x-2 ml-4">
            <button
              onClick={() => onEdit(evento)}
              className="p-2 text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(evento.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2 text-pink-500" />
            <span className="text-sm">{formatDateRange()}</span>
          </div>
          
          {evento.modalidade && (
            <div className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-2 text-pink-500" />
              <span className="text-sm">{evento.modalidade}</span>
            </div>
          )}
          
          {evento.valor && (
            <div className="flex items-center text-gray-600">
              <DollarSign className="h-4 w-4 mr-2 text-pink-500" />
              <span className="text-sm">{evento.valor}</span>
            </div>
          )}

          {evento.data_limite_inscricoes && (
            <div className="flex items-center text-gray-600">
              <Users className="h-4 w-4 mr-2 text-pink-500" />
              <span className="text-sm">Inscrições até: {formatDate(evento.data_limite_inscricoes)}</span>
            </div>
          )}
        </div>

        {evento.link_inscricao && (
          <div className="mb-4">
            <a
              href={evento.link_inscricao}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-pink-600 hover:text-pink-700 text-sm"
            >
              <Link className="h-4 w-4" />
              <span>Link de inscrição</span>
            </a>
          </div>
        )}

        {hasMultipleActivities && (
          <div className="mt-4 p-4 bg-gradient-to-r from-pink-50 to-pink-100 rounded-lg">
            <h4 className="font-semibold text-pink-800 mb-3 flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Atividades ({evento.atividades!.length})
            </h4>
            <div className="space-y-3">
              {evento.atividades!.slice(0, 3).map((atividade) => (
                <div key={atividade.id} className="bg-white p-3 rounded-lg shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-gray-700 font-medium">{atividade.nome}</span>
                    {atividade.horario_inicio && atividade.horario_fim && (
                      <span className="text-pink-600 text-sm">{atividade.horario_inicio} - {atividade.horario_fim}</span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-500">
                    {atividade.detalhe_local && (
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{atividade.detalhe_local}</span>
                      </div>
                    )}
                    {atividade.tipo && (
                      <div className="flex items-center">
                        <Target className="h-3 w-3 mr-1" />
                        <span>{atividade.tipo.nome}</span>
                      </div>
                    )}
                    {atividade.responsavel && (
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        <span>{atividade.responsavel.nome}</span>
                      </div>
                    )}
                    {atividade.instituicao && (
                      <div className="flex items-center">
                        <Building className="h-3 w-3 mr-1" />
                        <span>{atividade.instituicao.nome}</span>
                      </div>
                    )}
                  </div>

                  {atividade.temas && atividade.temas.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {atividade.temas.slice(0, 3).map(tema => (
                        <span key={tema.id} className="inline-block bg-pink-100 text-pink-700 text-xs px-2 py-1 rounded">
                          {tema.nome}
                        </span>
                      ))}
                      {atividade.temas.length > 3 && (
                        <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                          +{atividade.temas.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {evento.atividades!.length > 3 && (
                <div className="text-sm text-pink-600 font-medium text-center">
                  +{evento.atividades!.length - 3} mais atividades
                </div>
              )}
            </div>
          </div>
        )}

        {hasUniqueActivity && (
          <div className="mt-4 p-4 bg-gradient-to-r from-pink-50 to-pink-100 rounded-lg">
            <h4 className="font-semibold text-pink-800 mb-3 flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Atividade Única
            </h4>
            {evento.atividadesUnicas!.map((atividade) => (
              <div key={atividade.id} className="bg-white p-3 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  {atividade.detalhe_local && (
                    <div className="flex items-center text-gray-700">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{atividade.detalhe_local}</span>
                    </div>
                  )}
                  {atividade.horario_inicio && atividade.horario_fim && (
                    <span className="text-pink-600">{atividade.horario_inicio} - {atividade.horario_fim}</span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-500">
                  {atividade.responsavel && (
                    <div className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      <span>{atividade.responsavel.nome}</span>
                    </div>
                  )}
                  {atividade.instituicao && (
                    <div className="flex items-center">
                      <Building className="h-3 w-3 mr-1" />
                      <span>{atividade.instituicao.nome}</span>
                    </div>
                  )}
                  {atividade.publicoAlvo && (
                    <div className="flex items-center">
                      <Target className="h-3 w-3 mr-1" />
                      <span>{atividade.publicoAlvo.descricao}</span>
                    </div>
                  )}
                </div>

                {atividade.temas && atividade.temas.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {atividade.temas.map(tema => (
                      <span key={tema.id} className="inline-block bg-pink-100 text-pink-700 text-xs px-2 py-1 rounded">
                        {tema.nome}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};