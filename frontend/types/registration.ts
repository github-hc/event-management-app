export interface Registration {
  id: number;
  event_id: number;
  user_email: string;
  registered_at: string;
}

export interface RegistrationRequest {
  user_email: string;
}
