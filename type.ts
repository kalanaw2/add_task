export type UUID = string

export interface Profile {
  id: UUID
  full_name: string | null
}

export type Priority = 'low' | 'medium' | 'high'
export type Status = 'pending' | 'in_progress' | 'completed'

export interface Task {
  id: UUID
  title: string
  description: string | null
  priority: Priority
  status: Status
  assignee: UUID | null
  created_by: UUID
  created_at: string
  assignee_profile?: Profile | null
  creator_profile?: Profile | null
}

export interface Comment {
  id: UUID
  task_id?: UUID
  content: string
  author: UUID
  created_at: string
  author_profile?: Profile | null
}
