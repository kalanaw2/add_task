'use client'
import TaskForm from '@/components/Task/TaskForm'
import TaskList from '@/components/Task/TaskList'
import { Button } from '@/components/ui/button'
// import { supabase } from '../../lib/supabaseClient'
import { useEffect, useState } from 'react'

export default function TasksPage() {
  const [open, setOpen] = useState<boolean>(false)


  return (
    <div className="space-y-4 w-full">
      <div className='flex justify-between gap-2'>
        <h1 className="text-2xl font-semibold">Tasks</h1>
        <Button onClick={() => setOpen(true)}>Create Task</Button>
      </div>
      <TaskList />
      <TaskForm setOpen={setOpen} open={open} />
    </div>
  )
}
