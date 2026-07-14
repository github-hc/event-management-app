import api from "./api";
import { Registration, RegistrationRequest } from "@/types/registration";

export const registrationService = {
  async getByEvent(eventId: number): Promise<Registration[]> {
    const { data } = await api.get<Registration[]>(`/events/${eventId}/registrations`);
    return data;
  },

  async register(eventId: number, payload: RegistrationRequest): Promise<Registration> {
    const { data } = await api.post<Registration>(`/events/${eventId}/register`, payload);
    return data;
  },

  async unregister(eventId: number, payload: RegistrationRequest): Promise<void> {
    await api.delete(`/events/${eventId}/unregister`, { data: payload });
  },
};
