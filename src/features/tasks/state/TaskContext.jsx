import { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import { db } from '../../../app/firebase'
import { collection, addDoc, deleteDoc, updateDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore'
import { useAuth } from '../../auth/state/AuthContext'

const TaskContext = createContext()

function reducer(state, action) {
  switch (action.type) {
    case 'SET_TASKS': return action.payload
    default: return state
  }
}

export function TaskProvider({ children }) {
  const [tasks, dispatch] = useReducer(reducer, [])
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return
    const col = collection(db, 'users', user.uid, 'tasks')
    const q = query(col, orderBy('dueDate', 'asc'))
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      dispatch({ type: 'SET_TASKS', payload: data })
    })
    return () => unsub()
  }, [user])

  const addTask = useCallback(async (task) => {
    const col = collection(db, 'users', user.uid, 'tasks')
    await addDoc(col, task)
  }, [user])

  const updateTask = useCallback(async (id, updates) => {
    const ref = doc(db, 'users', user.uid, 'tasks', id)
    await updateDoc(ref, updates)
  }, [user])

  const deleteTask = useCallback(async (id) => {
    const ref = doc(db, 'users', user.uid, 'tasks', id)
    await deleteDoc(ref)
  }, [user])

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  )
}

export const useTasks = () => useContext(TaskContext)
