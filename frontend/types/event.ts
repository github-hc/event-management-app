export interface Event {
  id: number;
  title: string;
  description: string;
  date: string; // ISO 8601
  max_capacity: number;
  registered_count: number;
  available_spots: number;
  created_at: string;
  updated_at: string;
}

export interface EventCreate {
  title: string;
  description: string;
  date: string;
  max_capacity: number;
}

export interface EventUpdate {
  title?: string;
  description?: string;
  date?: string;
  max_capacity?: number;
}
