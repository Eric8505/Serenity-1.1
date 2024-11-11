import React from 'react';
import { format, isAfter, isBefore } from 'date-fns';
import { Calendar, Users, MapPin, Video, ShoppingCart } from 'lucide-react';
import { GroupHome } from '../types/notes';
import { Client } from '../types';

interface GroupAppointmentsSummaryProps {
  groupHomes: GroupHome[];
  clients: Client[];
  onJoinVirtual: (appointmentId: string) => void;
  onViewInventory?: (groupHomeId: string) => void;
}

const GroupAppointmentsSummary: React.FC<GroupAppointmentsSummaryProps> = ({
  groupHomes,
  clients,
  onJoinVirtual,
  onViewInventory,
}) => {
  const getClientAppointments = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client?.appointments || [];
  };

  const getUpcomingAppointments = (clientId: string) => {
    const appointments = getClientAppointments(clientId);
    return appointments.filter(apt => isAfter(new Date(apt.startTime), new Date()));
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {groupHomes.map(groupHome => (
        <div
          key={groupHome.id}
          className="bg-surface rounded-lg shadow-sm border border-border overflow-hidden"
        >
          <div className="px-4 py-3 bg-background border-b border-border">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-text">{groupHome.name}</h3>
                <p className="text-sm text-text-secondary">{groupHome.location}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-text-secondary">
                  {groupHome.activeClients.length} / {groupHome.capacity} clients
                </span>
              </div>
            </div>
          </div>

          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-medium text-text">Upcoming Appointments</h4>
              {onViewInventory && (
                <button
                  onClick={() => onViewInventory(groupHome.id)}
                  className="btn btn-secondary btn-sm"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  View Inventory
                </button>
              )}
            </div>

            <div className="space-y-4">
              {groupHome.activeClients.map(clientId => {
                const upcomingAppointments = getUpcomingAppointments(clientId);
                const client = clients.find(c => c.id === clientId);

                if (!client || upcomingAppointments.length === 0) return null;

                return (
                  <div key={clientId} className="space-y-2">
                    <h5 className="text-sm font-medium text-text">
                      {client.firstName} {client.lastName}
                    </h5>
                    {upcomingAppointments.map(appointment => (
                      <div
                        key={appointment.id}
                        className="bg-background rounded-lg border border-border p-3"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium text-text">
                              {appointment.title}
                            </p>
                            <p className="text-xs text-text-secondary mt-1">
                              {format(new Date(appointment.startTime), 'MMM d, h:mm a')}
                            </p>
                            {appointment.location && (
                              <div className="flex items-center mt-1">
                                <MapPin className="h-3 w-3 text-text-secondary mr-1" />
                                <p className="text-xs text-text-secondary">
                                  {appointment.location}
                                </p>
                              </div>
                            )}
                          </div>
                          {appointment.type === 'virtual' && (
                            <button
                              onClick={() => onJoinVirtual(appointment.id)}
                              className="btn btn-secondary btn-sm"
                            >
                              <Video className="h-4 w-4 mr-1" />
                              Join
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}

              {groupHome.activeClients.length === 0 && (
                <p className="text-center text-text-secondary py-4">
                  No active clients
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GroupAppointmentsSummary;