'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useAddTaskMutation, useGetProfilesQuery, useGetTasksQuery } from '@/store/api'
import type { Priority, Status } from '@/type'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import type { Task } from '@/type'

export default function TaskList() {
    const [status, setStatus] = useState<'all' | Status>('all')
    const [priority, setPriority] = useState<'all' | Priority>('all')
    const { data: tasks = [], isFetching } = useGetTasksQuery({ status, priority })

    const chip = (p: Task["priority"]) =>
    p === "high"
      ? "bg-red-100 text-red-700"
      : p === "medium"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-green-100 text-green-700"

  const statusColor = (s: Task["status"]) =>
    s === "completed" ? "text-green-600" : s === "in_progress" ? "text-blue-600" : "text-gray-500"

    return (
        <>
            <div className="flex gap-3 mb-3">
                <select
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    value={status} onChange={e => setStatus(e.target.value as any)}>
                    <option value="all">All status</option>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                </select>
                <select
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    value={priority}
                    onChange={e => setPriority(e.target.value as Priority)}
                >
                    <option value="">Select priority</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
                {isFetching && <span className="text-sm opacity-70">Loading…</span>}
            </div>

            {/* <ul className="divide-y">
                {tasks.map(t => (
                    <li key={t.id} className="py-3 flex items-center gap-3">
                        <span className="text-xs border rounded px-2">{t.priority}</span>
                        <span className="text-sm">{t.title}</span>
                        <span className="ml-auto text-xs opacity-70">{t.status}</span>
                        <Link className="underline ml-3" href={`/protected/task/${t.id}`}>Open</Link>
                    </li>
                ))}
                {tasks.length === 0 && !isFetching && <p className="p-4 text-sm opacity-70">No tasks</p>}
            </ul> */}

            <div className="flex flex-col gap-3">
                {tasks.map((t) => (
                    <Card key={t.id} className="hover:shadow-md transition">
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-3">
                                <CardTitle className="text-base">{t.title}</CardTitle>
                                <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${chip(t.priority)}`}>
                                    {t.priority}
                                </span>
                            </div>
                        </CardHeader>

                        {(t.description ?? "").trim() !== "" && (
                            <CardContent className="pt-0">
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {t.description}
                                </p>
                            </CardContent>
                        )}

                        <CardFooter className="pt-0 flex items-center justify-between">
                            <span className={`text-xs ${statusColor(t.status)}`}>{t.status}</span>
                            <Link
                                href={`/protected/task/${t.id}`}
                                className="text-sm font-medium text-blue-600 hover:underline"
                            >
                                Open →
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </>
    )
}
