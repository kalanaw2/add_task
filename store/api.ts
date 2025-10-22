'use client'
import { createApi } from '@reduxjs/toolkit/query/react'
import { supabase } from '@/lib/utils'
import type { Comment, Profile, Task } from '@/type'

export interface TaskFilters {
  status?: 'all' | Task['status']
  priority?: 'all' | Task['priority']
}

export const supabaseApi = createApi({
  reducerPath: 'supabaseApi',
  baseQuery: async () => ({ data: {} }),
  tagTypes: ['Tasks', 'Task', 'Comments', 'Profiles'],

  endpoints: (build) => ({

    // ──────────────────────────────
    // Fetch All Tasks
    // ──────────────────────────────
    getTasks: build.query<Task[], TaskFilters | void>({
      queryFn: async (filters) => {
        try {
          let q = supabase
            .from('tasks')
            .select(`
              id, title, description, priority, status, assignee, created_by, created_at,
              assignee_profile:profiles!tasks_assignee_fkey(id, full_name),
              creator_profile:profiles!tasks_created_by_fkey(id, full_name)
            `)
            .order('created_at', { ascending: false })

          if (filters?.status && filters.status !== 'all') q = q.eq('status', filters.status)
          if (filters?.priority && filters.priority !== 'all') q = q.eq('priority', filters.priority)

          const { data, error } = await q
          if (error) return { error }

          const fixed: Task[] = (data ?? []).map((t: any) => ({
            id: t.id,
            title: t.title,
            description: t.description,
            priority: t.priority,
            status: t.status,
            assignee: t.assignee,
            created_by: t.created_by,
            created_at: t.created_at,
            assignee_profile: t.assignee_profile?.[0] ?? null,
            creator_profile: t.creator_profile?.[0] ?? null
          }))

          return { data: fixed }
        } catch (e: any) {
          return { error: e }
        }
      },
      providesTags: (result) =>
        result
          ? ['Tasks', ...result.map((t) => ({ type: 'Task' as const, id: t.id }))]
          : ['Tasks']
    }),

    // ──────────────────────────────
    // Fetch Single Task
    // ──────────────────────────────
    getTask: build.query<Task, string>({
      queryFn: async (id) => {
        const { data, error } = await supabase
          .from('tasks')
          .select(`
            id, title, description, priority, status, assignee, created_by, created_at,
            assignee_profile:profiles!tasks_assignee_fkey(id, full_name),
            creator_profile:profiles!tasks_created_by_fkey(id, full_name)
          `)
          .eq('id', id)
          .single()

        if (error) return { error }

        const fixed: Task = {
          id: data.id,
          title: data.title,
          description: data.description,
          priority: data.priority,
          status: data.status,
          assignee: data.assignee,
          created_by: data.created_by,
          created_at: data.created_at,
          assignee_profile: data.assignee_profile?.[0] ?? null,
          creator_profile: data.creator_profile?.[0] ?? null
        }

        return { data: fixed }
      },
      providesTags: (task) =>
        task ? [{ type: 'Task', id: task.id }] : ['Task']
    }),

    // ──────────────────────────────
    // Create Task
    // ──────────────────────────────
    addTask: build.mutation<Task, Partial<Task>>({
      queryFn: async (payload) => {
        const { data, error } = await supabase
          .from('tasks')
          .insert({
            title: payload.title,
            description: payload.description ?? null,
            priority: payload.priority ?? 'medium',
            status: payload.status ?? 'pending',
            assignee: payload.assignee ?? null
          })
          .select(`
            id, title, description, priority, status, assignee, created_by, created_at,
            assignee_profile:profiles!tasks_assignee_fkey(id, full_name),
            creator_profile:profiles!tasks_created_by_fkey(id, full_name)
          `)
          .single()

        if (error) return { error }

        const fixed: Task = {
          id: data.id,
          title: data.title,
          description: data.description,
          priority: data.priority,
          status: data.status,
          assignee: data.assignee,
          created_by: data.created_by,
          created_at: data.created_at,
          assignee_profile: data.assignee_profile?.[0] ?? null,
          creator_profile: data.creator_profile?.[0] ?? null
        }

        return { data: fixed }
      },
      invalidatesTags: ['Tasks']
    }),

    // ──────────────────────────────
    // Update Task
    // ──────────────────────────────
    updateTask: build.mutation<Task, { id: string; updates: Partial<Task> }>({
      queryFn: async ({ id, updates }) => {
        const { data, error } = await supabase
          .from('tasks')
          .update(updates)
          .eq('id', id)
          .select(`
            id, title, description, priority, status, assignee, created_by, created_at,
            assignee_profile:profiles!tasks_assignee_fkey(id, full_name),
            creator_profile:profiles!tasks_created_by_fkey(id, full_name)
          `)
          .single()

        if (error) return { error }

        const fixed: Task = {
          id: data.id,
          title: data.title,
          description: data.description,
          priority: data.priority,
          status: data.status,
          assignee: data.assignee,
          created_by: data.created_by,
          created_at: data.created_at,
          assignee_profile: data.assignee_profile?.[0] ?? null,
          creator_profile: data.creator_profile?.[0] ?? null
        }

        return { data: fixed }
      },
      invalidatesTags: (r, e, arg) => [
        { type: 'Task', id: arg.id },
        'Tasks'
      ]
    }),

    // ──────────────────────────────
    // Fetch Comments
    // ──────────────────────────────
    getComments: build.query<Comment[], string>({
      queryFn: async (taskId) => {
        const { data, error } = await supabase
          .from('comments')
          .select(`
            id, content, author, created_at,
            author_profile:profiles!comments_author_fkey(id, full_name)
          `)
          .eq('task_id', taskId)
          .order('created_at', { ascending: true })

        if (error) return { error }

        const fixed: Comment[] = (data ?? []).map((c: any) => ({
          id: c.id,
          task_id: taskId,
          content: c.content,
          author: c.author,
          created_at: c.created_at,
          author_profile: c.author_profile ?? null
        }))

        return { data: fixed }
      },
      providesTags: (res, err, taskId) => [{ type: 'Comments', id: taskId }]
    }),

    // ──────────────────────────────
    // Add Comment
    // ──────────────────────────────
    addComment: build.mutation<Comment, { taskId: string; content: string }>({
      queryFn: async ({ taskId, content }) => {
        const { data, error } = await supabase
          .from('comments')
          .insert({ task_id: taskId, content  })
          .select(`
            id, content, author, created_at,
            author_profile:profiles!comments_author_fkey(id, full_name)
          `)
          .single()

        if (error) return { error }

        const fixed: Comment = {
          id: data.id,
          task_id: taskId,
          content: data.content,
          author: data.author,
          created_at: data.created_at,
          author_profile: data.author_profile?.[0] ?? null
        }

        return { data: fixed }
      },
      invalidatesTags: (r, e, { taskId }) => [
        { type: 'Comments', id: taskId }
      ]
    }),

    // ──────────────────────────────
    // Profiles
    // ──────────────────────────────
    getProfiles: build.query<Profile[], void>({
      queryFn: async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name')
          .order('full_name')

        if (error) return { error }

        const fixed: Profile[] = (data ?? []).map((p: any) => ({
          id: p.id,
          full_name: p.full_name
        }))

        return { data: fixed }
      },
      providesTags: ['Profiles']
    })
  })
})

// Export hooks
export const {
  useGetTasksQuery,
  useGetTaskQuery,
  useAddTaskMutation,
  useUpdateTaskMutation,
  useGetCommentsQuery,
  useAddCommentMutation,
  useGetProfilesQuery
} = supabaseApi
