import type { Tag } from "./tag";

export interface Student {
  id: string;
  teacher_id: string;

  first_name: string;
  last_name: string;
  nationality: string | null;
  phone_number: string | null;
  email: string | null;
  date_of_birth: string | null;
  level: string | null;
  description: string | null;
  notes: string | null;
  profile_image_url: string | null;
  created_at: string;

  tags: Tag[];
}

export interface CreateStudentRequest {
  first_name: string;
  last_name: string;

  nationality?: string | null;
  phone_number?: string | null;
  email?: string | null;
  date_of_birth?: string | null;
  level?: string | null;
  description?: string | null;
  notes?: string | null;

  tags: string[];
}

export interface UpdateStudentRequest {
  first_name?: string | null;
  last_name?: string | null;

  nationality?: string | null;
  phone_number?: string | null;
  email?: string | null;
  date_of_birth?: string | null;
  level?: string | null;
  description?: string | null;
  notes?: string | null;

  tags?: string[] | null;
}