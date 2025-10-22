'use client'
import { useParams } from 'next/navigation'
import { useGetTaskQuery, useUpdateTaskMutation, useGetCommentsQuery, useAddCommentMutation } from '@/store/api'
import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TaskDetails() {
  const { id } = useParams<{ id: string }>()
  const { data: task, isLoading } = useGetTaskQuery(id)
  const { data: comments = [] } = useGetCommentsQuery(id)
  const [updateTask] = useUpdateTaskMutation()
  const [addComment] = useAddCommentMutation()
  const [text, setText] = useState('')


  if (isLoading || !task) return <p>Loading…</p>
  console.log(comments)
  return (
    <div className="w-full  mx-auto space-y-6">
      {/* --- Task Info Card --- */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{task.title}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {task.description && (
            <p className="text-sm text-muted-foreground">{task.description}</p>
          )}

          <div className="flex flex-wrap gap-2">
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${task.priority === "high"
                  ? "bg-red-100 text-red-700"
                  : task.priority === "medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
            >
              {task.priority}
            </span>

            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${task.status === "completed"
                  ? "bg-green-100 text-green-700"
                  : task.status === "in_progress"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700"
                }`}
            >
              {task.status}
            </span>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                updateTask({ id, updates: { status: "in_progress" } })
              }
            >
              Start
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                updateTask({ id, updates: { status: "completed" } })
              }
            >
              Complete
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* --- Comments Section --- */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Comments</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-3">
            {comments.map((c) => (
              <div
                key={c.id}
                className="rounded-lg border p-3 bg-muted/30 text-sm"
              >
                <div className="text-xs text-muted-foreground mb-1">
                  {c.author_profile?.full_name ?? "Anonymous"}
                </div>
                <div>{c.content}</div>
              </div>
            ))}

            {comments.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No comments yet.
              </p>
            )}
          </div>

          {/* Comment input */}
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!text.trim()) return;
              await addComment({ taskId: id, content: text.trim() });
              setText("");
            }}
            className="flex gap-2"
          >
            <input
              className="flex-1 rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Add a comment…"
            />
            <Button type="submit" variant="default" size="sm">
              Send
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
