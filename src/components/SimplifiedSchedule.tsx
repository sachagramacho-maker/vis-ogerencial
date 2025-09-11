import React, { useState } from 'react';
import { Calendar, Flag, Plus, X, Edit3, Clock, User, CheckCircle } from 'lucide-react';

interface ScheduleEvent {
  id: string;
  name: string;
  type: 'activity' | 'milestone';
  startDate?: string; // Para atividades
  endDate?: string;   // Para atividades
  date?: string;      // Para marcos
  responsible?: string;
  status: 'pending' | 'in_progress' | 'completed';
  description?: string;
}

interface ScheduleMonth {
  id: string;
  name: string;
  order: number;
}

interface SimplifiedScheduleProps {
  months: ScheduleMonth[];
  events: ScheduleEvent[];
  onUpdateMonths: (months: ScheduleMonth[]) => void;
  onUpdateEvents: (events: ScheduleEvent[]) => void;
}

interface EditableFieldProps {
  value: string;
  onSave: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const EditableField: React.FC<EditableFieldProps> = ({ 
  value, 
  onSave, 
  placeholder, 
  className 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditValue(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <input
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyPress}
        className={`${className} border-2 border-blue-500 rounded px-2 py-1 focus:outline-none`}
        placeholder={placeholder}
        autoFocus
      />
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className={`${className} cursor-pointer hover:bg-gray-50 rounded px-2 py-1 min-h-[2rem] flex items-center`}
    >
      {value || placeholder}
    </div>
  );
};

export const SimplifiedSchedule: React.FC<SimplifiedScheduleProps> = ({
  months = [],
  events = [],
  onUpdateMonths,
  onUpdateEvents
}) => {
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newEventType, setNewEventType] = useState<'activity' | 'milestone'>('activity');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-yellow-500';
      case 'pending': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const addMonth = () => {
    const newMonth: ScheduleMonth = {
      id: `month-${Date.now()}`,
      name: '',
      order: months.length
    };
    onUpdateMonths([...months, newMonth]);
  };

  const updateMonth = (monthId: string, name: string) => {
    const updatedMonths = months.map(month => 
      month.id === monthId ? { ...month, name } : month
    );
    onUpdateMonths(updatedMonths);
  };

  const removeMonth = (monthId: string) => {
    const updatedMonths = months.filter(month => month.id !== monthId);
    onUpdateMonths(updatedMonths);
  };

  const addEvent = () => {
    const newEvent: ScheduleEvent = {
      id: `event-${Date.now()}`,
      name: '',
      type: newEventType,
      status: 'pending',
      ...(newEventType === 'activity' 
        ? { startDate: '', endDate: '' }
        : { date: '' }
      )
    };
    onUpdateEvents([...events, newEvent]);
  };

  const updateEvent = (eventId: string, field: string, value: string) => {
    const updatedEvents = events.map(event => 
      event.id === eventId ? { ...event, [field]: value } : event
    );
    onUpdateEvents(updatedEvents);
  };

  const removeEvent = (eventId: string) => {
    const updatedEvents = events.filter(event => event.id !== eventId);
    onUpdateEvents(updatedEvents);
  };

  const getEventPosition = (event: ScheduleEvent) => {
    if (event.type === 'milestone' && event.date) {
      const monthIndex = months.findIndex(m => m.name.toLowerCase() === event.date?.toLowerCase());
      if (monthIndex >= 0) {
        const left = (monthIndex / Math.max(months.length - 1, 1)) * 100;
        return { left: `${left}%`, width: '8%' };
      }
    } else if (event.type === 'activity' && event.startDate && event.endDate) {
      const startIndex = months.findIndex(m => m.name.toLowerCase() === event.startDate?.toLowerCase());
      const endIndex = months.findIndex(m => m.name.toLowerCase() === event.endDate?.toLowerCase());
      
      if (startIndex >= 0 && endIndex >= 0) {
        const left = (startIndex / Math.max(months.length - 1, 1)) * 100;
        const width = ((endIndex - startIndex + 1) / months.length) * 100;
        return { left: `${left}%`, width: `${Math.max(width, 8)}%` };
      }
    }
    
    return { left: '0%', width: '8%' };
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="text-purple-600" size={24} />
        <h2 className="text-xl font-bold text-gray-900">GANTT TRIMESTRAL</h2>
      </div>

      {/* Configuração de Meses */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Meses</h3>
          <button
            onClick={addMonth}
            className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus size={16} />
            Adicionar Mês
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {months.map((month) => (
            <div key={month.id} className="flex items-center gap-3 p-4 border rounded-lg bg-white shadow-sm">
              <EditableField
                value={month.name}
                onSave={(value) => updateMonth(month.id, value)}
                placeholder="Nome do mês"
                className="flex-1 text-sm font-medium"
              />
              <button
                onClick={() => removeMonth(month.id)}
                className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Visualização do Cronograma */}
      {months.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Visualização</h3>
          <div className="border rounded-lg p-4 bg-gray-50">
            {/* Cabeçalho dos meses */}
            <div className="grid gap-2 mb-4" style={{ gridTemplateColumns: `repeat(${months.length}, 1fr)` }}>
              {months.map((month) => (
                <div key={month.id} className="text-center text-sm font-medium text-gray-700 p-2 bg-white rounded border">
                  {month.name}
                </div>
              ))}
            </div>

            {/* Eventos */}
            <div className="relative min-h-[200px] bg-white rounded border">
              {events.map((event, index) => {
                const position = getEventPosition(event);
                
                if (event.type === 'milestone') {
                  return (
                    <div
                      key={event.id}
                      className="absolute cursor-pointer transform -translate-x-1/2"
                      style={{ 
                        left: position.left, 
                        top: `${20 + (index % 3) * 60}px` 
                      }}
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className="flex flex-col items-center">
                        <div className={`${getStatusColor(event.status)} p-1 rounded flex items-center justify-center`}>
                          <Flag className="text-white" size={20} />
                        </div>
                        <span className="text-xs mt-1 text-center max-w-[80px] leading-tight">
                          {event.name}
                        </span>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={event.id}
                      className="absolute cursor-pointer rounded-lg p-2 text-white text-xs font-medium shadow-md hover:shadow-lg transition-shadow flex items-center justify-center"
                      style={{
                        left: position.left,
                        width: position.width,
                        top: `${40 + (index % 4) * 40}px`,
                        background: `linear-gradient(90deg, ${getStatusColor(event.status)}, ${getStatusColor(event.status)}dd)`,
                        minHeight: '28px'
                      }}
                      onClick={() => setSelectedEvent(event)}
                    >
                      <span className="text-center leading-tight text-white font-semibold overflow-hidden text-ellipsis whitespace-nowrap px-1">
                        {event.name || 'Atividade'}
                      </span>
                    </div>
                  );
                }
              })}
            </div>
          </div>
        </div>
      )}

      {/* Adicionar Atividades */}
      {isAddingEvent && (
        <div className="mb-6 p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
          <h3 className="text-base font-semibold text-gray-800 mb-3">Nova Atividade</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Nome da Atividade</label>
              <input
                id="activity-name"
                type="text"
                placeholder="Digite o nome da atividade"
                className="w-full px-2 py-1.5 border rounded text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Tipo</label>
              <select
                id="activity-type"
                value={newEventType}
                onChange={(e) => setNewEventType(e.target.value as 'activity' | 'milestone')}
                className="w-full px-2 py-1.5 border rounded text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                <option value="activity">Atividade</option>
                <option value="milestone">Marco</option>
              </select>
            </div>
            {newEventType === 'activity' ? (
              <>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Mês Início</label>
                  <select
                    id="start-month"
                    className="w-full px-2 py-1.5 border rounded text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="">Selecione o mês</option>
                    {months.map((month) => (
                      <option key={month.id} value={month.name}>{month.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Mês Fim</label>
                  <select
                    id="end-month"
                    className="w-full px-2 py-1.5 border rounded text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="">Selecione o mês</option>
                    {months.map((month) => (
                      <option key={month.id} value={month.name}>{month.name}</option>
                    ))}
                  </select>
                </div>
              </>
            ) : (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Mês do Marco</label>
                <select
                  id="milestone-month"
                  className="w-full px-2 py-1.5 border rounded text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
                >
                  <option value="">Selecione o mês</option>
                  {months.map((month) => (
                    <option key={month.id} value={month.name}>{month.name}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="flex items-end gap-2">
              <button
                onClick={() => {
                  const nameInput = document.getElementById('activity-name') as HTMLInputElement;
                  const typeSelect = document.getElementById('activity-type') as HTMLSelectElement;
                  
                  if (nameInput.value.trim()) {
                    let newEvent: ScheduleEvent;
                    
                    if (newEventType === 'activity') {
                      const startSelect = document.getElementById('start-month') as HTMLSelectElement;
                      const endSelect = document.getElementById('end-month') as HTMLSelectElement;
                      
                      newEvent = {
                        id: `event-${Date.now()}`,
                        name: nameInput.value.trim(),
                        type: 'activity',
                        status: 'pending',
                        startDate: startSelect.value,
                        endDate: endSelect.value
                      };
                    } else {
                      const milestoneSelect = document.getElementById('milestone-month') as HTMLSelectElement;
                      
                      newEvent = {
                        id: `event-${Date.now()}`,
                        name: nameInput.value.trim(),
                        type: 'milestone',
                        status: 'pending',
                        date: milestoneSelect.value
                      };
                    }
                    
                    onUpdateEvents([...events, newEvent]);
                    nameInput.value = '';
                    setIsAddingEvent(false);
                  }
                }}
                className="px-3 py-1.5 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors text-xs"
              >
                Salvar
              </button>
              <button
                onClick={() => setIsAddingEvent(false)}
                className="px-3 py-1.5 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-xs"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Botão Adicionar Atividades */}
      {!isAddingEvent && (
        <div className="mb-6">
          <button
            onClick={() => setIsAddingEvent(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus size={16} />
            Adicionar Atividades
          </button>
        </div>
      )}

      {/* Lista de Atividades Criadas */}
      {events.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Atividades Criadas</h3>
          <div className="space-y-2">
            {events.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(event.status)}`}></div>
                  <span className="font-medium">{event.name}</span>
                  <span className="text-sm text-gray-600">
                    {event.type === 'milestone' ? 'Marco' : 'Atividade'}
                  </span>
                </div>
                <button
                  onClick={() => removeEvent(event.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SimplifiedSchedule;