import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../../../components/Navbar'
import Input from '../../../components/Input'
import Select from '../../../components/Select'
import Button from '../../../components/Button'
import { useTasks } from '../state/TaskContext'
import { useAuth } from '../../auth/state/AuthContext'
import { db } from '../../../app/firebase'
import { doc, getDoc } from 'firebase/firestore'

const defaultTask = { title: '', description: '', priority: 'medium', dueDate: '', completed: false }

export default function TaskForm() {
  const { id } = useParams()
  const nav = useNavigate()
  const { addTask, updateTask } = useTasks()
  const { user } = useAuth()
  const [task, setTask] = useState(defaultTask)
  const isEdit = useMemo(()=> Boolean(id), [id])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      if (!id) return
      setLoading(true)
      try {
        const ref = doc(db, 'users', user.uid, 'tasks', id)
        const snap = await getDoc(ref)
        if (snap.exists()) {
          const data = snap.data()
          setTask({
            ...data,
            dueDate: new Date(data.dueDate).toISOString().slice(0,10)
          })
        }
      } finally { setLoading(false) }
    }
    load()
  }, [id, user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!task.title.trim()) { setError('Title is required.'); return }
    if (!task.dueDate) { setError('Due date is required.'); return }
    const payload = {
      title: task.title.trim(),
      description: task.description.trim(),
      priority: task.priority,
      completed: Boolean(task.completed),
      dueDate: new Date(task.dueDate).getTime()
    }
    try {
      if (isEdit) await updateTask(id, payload)
      else await addTask(payload)
      nav('/')
    } catch (e2) {
      setError('Failed to save task.')
    }
  }

  return (
    <div>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold mb-4">{isEdit ? 'Edit Task' : 'New Task'}</h2>
          {loading ? <p>Loading...</p> : (
            <form onSubmit={handleSubmit}>
              {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
              <Input label="Title" value={task.title} onChange={e=>setTask(s=>({ ...s, title: e.target.value }))} required />
              <label className="block mb-3">
                <span className="block text-sm mb-1">Description</span>
                <textarea className="w-full border rounded-xl px-3 py-2 h-24"
                  value={task.description} onChange={e=>setTask(s=>({ ...s, description: e.target.value }))} />
              </label>
              <div className="grid md:grid-cols-2 gap-3">
                <Select label="Priority" value={task.priority} onChange={e=>setTask(s=>({ ...s, priority: e.target.value }))}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </Select>
                <Input label="Due Date" type="date" value={task.dueDate} onChange={e=>setTask(s=>({ ...s, dueDate: e.target.value }))} required />
              </div>
              <label className="flex items-center gap-2 mb-4">
                <input type="checkbox" checked={task.completed} onChange={e=>setTask(s=>({ ...s, completed: e.target.checked }))} />
                <span>Mark as completed</span>
              </label>
              <div className="flex gap-2">
                <Button className="bg-blue-600 text-white" type="submit">{isEdit ? 'Save Changes' : 'Create Task'}</Button>
                <Button type="button" onClick={()=>nav('/')}>Cancel</Button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  )
}
