import api from "./api";
import { Event, EventCreate, EventUpdate } from "@/types/event";

export const eventService = {
  async getAll(): Promise<Event[]> {
    const { data } = await api.get<Event[]>("/events");
    return data;
  },

  async getById(id: number): Promise<Event> {
    const { data } = await api.get<Event>(`/events/${id}`);
    return data;
  },

  async create(payload: EventCreate): Promise<Event> {
    const { data } = await api.post<Event>("/events", payload);
    return data;
  },

  async update(id: number, payload: EventUpdate): Promise<Event> {
    const { data } = await api.put<Event>(`/events/${id}`, payload);
    return data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/events/${id}`);
  },
};
