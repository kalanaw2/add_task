'use client'
import { useAddTaskMutation, useGetProfilesQuery } from '@/store/api'
import { useState } from 'react'
import type { Priority } from '@/type'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

export default function TaskForm({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [assignee, setAssignee] = useState<string>('')

  const { data: users = [] } = useGetProfilesQuery()
  const [addTask, { isLoading }] = useAddTaskMutation()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    await addTask({
      title,
      description,
      priority,
      status: 'pending',
      assignee: assignee || null
    })
    setTitle(''); setDescription('')
  }

  return (
    <>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Task</DialogTitle>
          </DialogHeader>

          <form onSubmit={submit} className="border p-3 rounded space-y-2">
           
            <Input className="border p-2 w-full" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
            <Textarea className="border p-2 w-full" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
            <div className="flex gap-2">
              <select
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                value={priority}
                onChange={e => setPriority(e.target.value as Priority)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <select
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                value={assignee}
                onChange={e => setAssignee(e.target.value)}
              >
                <option value="">Assignee…</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.full_name ?? u.id}
                  </option>
                ))}
              </select>
              <Button disabled={isLoading} className="" size="lg" variant="default">{isLoading ? 'Adding…' : 'Add'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
