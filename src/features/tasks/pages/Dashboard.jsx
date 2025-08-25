import { useMemo, useState } from 'react'
import Navbar from '../../../components/Navbar'
import Button from '../../../components/Button'
import Select from '../../../components/Select'
import { useTasks } from '../state/TaskContext'
import { fmtDate } from '../../../utils/date'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const { tasks, updateTask, deleteTask } = useTasks()
  const [priority, setPriority] = useState('all')
  const [status, setStatus] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return tasks.filter(t => {
      const pri = priority === 'all' || t.priority === priority
      const st = status === 'all' || (status === 'completed' ? t.completed : !t.completed)
      const q = !search || t.title.toLowerCase().includes(search.toLowerCase())
      return pri && st && q
    })
  }, [tasks, priority, status, search])

  // helper for badge colors
  const badgeColor = (p) =>
    p === 'high'
      ? 'bg-red-100 text-red-700 border-red-300'
      : p === 'medium'
      ? 'bg-yellow-100 text-yellow-700 border-yellow-300'
      : 'bg-green-100 text-green-700 border-green-300'

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        
        {/* Filters */}
        <div className="grid md:grid-cols-4 gap-4 items-end bg-white p-4 rounded-2xl shadow-sm border">
          <label className="md:col-span-2">
            <span className="block text-sm font-medium mb-1">Search</span>
            <input
              className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Find by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
          <Select label="Priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="all">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Select>
          <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="incomplete">Incomplete</option>
          </Select>
        </div>

        {/* Tasks list */}
        <section className="mt-8 space-y-4">
          {filtered.length === 0 && (
            <div className="p-8 border rounded-2xl bg-white text-center text-gray-500 shadow-sm">
              No tasks match your filters.
            </div>
          )}
          {filtered.map((task) => (
            <article
              key={task.id}
              className="bg-white border rounded-2xl p-5 flex items-start justify-between gap-4 shadow-sm hover:shadow-md transition"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3
                    className={`font-semibold text-lg ${
                      task.completed ? 'line-through text-gray-400' : 'text-gray-800'
                    }`}
                  >
                    {task.title}
                  </h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border capitalize ${badgeColor(
                      task.priority
                    )}`}
                  >
                    {task.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Due: <span className="font-medium">{fmtDate(task.dueDate)}</span>
                </p>
              </div>
              
              <div className="flex gap-2 shrink-0">
                <Button
                  className={`rounded-xl px-3 ${
                    task.completed
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                  onClick={() => updateTask(task.id, { completed: !task.completed })}
                >
                  {task.completed ? 'Undo' : 'Mark Done'}
                </Button>
                
                <Link
                  to={`/tasks/${task.id}`}
                  className="px-4 py-2 rounded-xl shadow-sm border border-gray-200 hover:shadow transition grid place-items-center text-sm"
                >
                  Edit
                </Link>
                
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-3"
                  onClick={() => deleteTask(task.id)}
                >
                  Delete
                </Button>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  )
}
