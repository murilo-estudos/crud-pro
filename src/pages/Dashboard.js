import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
// Importamos o updateDoc para permitir a edição
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  where, 
  deleteDoc, 
  doc, 
  updateDoc,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { Plus, Trash2, Pencil, X, Check } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

const Dashboard = () => {
  const [filter, setFilter] = useState('all');
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [editingId, setEditingId] = useState(null); // Guarda o ID da tarefa que estamos editando
  const { currentUser } = useAuth();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    if (!currentUser) return;
    const q = query(
      collection(db, "tasks"), 
      where("userId", "==", currentUser.uid),
      orderBy("createdAt", "desc") // As mais recentes primeiro
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({ ...doc.data(), id: doc.id });
      });
      setTasks(items);
    });
    return () => unsubscribe();
  }, [currentUser]);


  const filteredTasks = tasks.filter(t => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true; // para o caso 'all'
  });

  // CREATE ou UPDATE: Essa função agora decide se salva uma nova ou atualiza uma antiga
  async function handleSubmit(e) {
    e.preventDefault();
    if (task.trim() === '') return;

    try {
      if (editingId) {
        // Se houver um ID em edição, atualiza no banco
        await updateDoc(doc(db, "tasks", editingId), {
          text: task
        });
        setEditingId(null);
        toast.success('Tarefa atualizada!');
      } else {
        // Caso contrário, cria uma nova
        await addDoc(collection(db, "tasks"), {
          text: task,
          userId: currentUser.uid,
          createdAt: new Date(),
          completed: false
        });
        toast.success('Tarefa adicionada!');
      }
      setTask('');
    } catch (e) {
      toast.error('Erro ao processar.');
    }
  }

  // Prepara o formulário para edição
  function startEdit(t) {
    setEditingId(t.id);
    setTask(t.text); // Coloca o texto da tarefa de volta no input
  }

  // Cancela a edição
  function cancelEdit() {
    setEditingId(null);
    setTask('');
  }

// DELETE: Remover tarefa com confirmação bonita
function handleDelete(id) {
    toast((t) => (
      <span style={{ color: 'var(--text-color)', textAlign: 'center', display: 'block' }}>
        Deseja realmente excluir?
        <div style={{ marginTop: '10px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button
            onClick={async () => {
              try {
                await deleteDoc(doc(db, "tasks", id));
                toast.dismiss(t.id);
                toast.success('Tarefa removida!');
              } catch (e) {
                toast.error('Erro ao deletar.');
              }
            }}
            style={{ 
              background: '#28a745', 
              color: '#fff', 
              border: 'none', 
              padding: '6px 15px', 
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Sim
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            style={{ 
              background: '#ff4d4d',
              color: '#fff', 
              border: 'none', 
              padding: '6px 15px', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancelar
          </button>
        </div>
      </span>
    ), {
      duration: 6000, 
      position: 'top-center',
      // Estilo do container da mensagem
      style: {
        background: 'var(--card-bg)',
        border: '1px solid rgba(128, 128, 128, 0.2)',
        padding: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
      },
    });
  }

  // TOGGLE: Marcar como concluída ou pendente
  async function toggleComplete(t) {
    try {
      await updateDoc(doc(db, "tasks", t.id), {
        completed: !t.completed // Inverte o valor atual
      });
    } catch (e) {
      toast.error('Erro ao atualizar status.');
    }
  }

  const filterStyle = (isActive, color) => ({
    padding: '8px 16px',
    borderRadius: '20px',
    backgroundColor: isActive ? color : 'var(--card-bg)',
    color: isActive ? 'white' : 'var(--text-color)',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: isActive ? 'bold' : 'normal',
    transition: '0.3s',
    border: isActive ? 'none' : '1px solid rgba(128, 128, 128, 0.2)'
  });

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
                <Toaster 
        position="top-center" 
        reverseOrder={false} 
        toastOptions={{
          // Estilo global para todas as notificações (incluindo a de delete)
          style: {
            background: 'var(--card-bg)',
            color: 'var(--text-color)',
            border: '1px solid rgba(128, 128, 128, 0.2)',
            borderRadius: '8px',
            padding: '12px 24px',
          },
          // Ajuste fino nos ícones para não sumirem no fundo escuro
          success: {
            iconTheme: {
              primary: '#28a745',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ff4d4d',
              secondary: '#fff',
            },
          },
        }}
      />
      <h1 style={{ textAlign: 'center', color: 'var(--text-color)' }}>Minhas Tarefas</h1>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        <input 
          style={{ 
            flex: 1, 
            padding: '12px', 
            borderRadius: '8px', 
            border: editingId ? '2px solid #ff9800' : '1px solid #ccc',
            backgroundColor: 'var(--card-bg)', // Adicione isso
            color: 'var(--text-color)',        // Adicione isso
            outline: 'none'
          }}
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder={editingId ? "Editando tarefa..." : "O que precisa ser feito?"}
        />
        
        <button type="submit" style={{ 
          padding: '10px 20px', 
          backgroundColor: editingId ? '#1efa29' : '#007bff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '8px', 
          cursor: 'pointer' 
        }}>
          {editingId ? <Check size={20} /> : <Plus size={20} />}
        </button>

        {editingId && (
          <button type="button" onClick={cancelEdit} style={{ padding: '10px', backgroundColor: '#fc5757', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        )}
      </form>

              <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '10px', 
          marginBottom: '20px' 
        }}>
          <button 
            onClick={() => setFilter('all')}
            style={filterStyle(filter === 'all', '#666')}
          >
            Todas ({tasks.length})
          </button>
          <button 
            onClick={() => setFilter('pending')}
            style={filterStyle(filter === 'pending', '#ff9800')}
          >
            Pendentes ({tasks.filter(t => !t.completed).length})
          </button>
          <button 
            onClick={() => setFilter('completed')}
            style={filterStyle(filter === 'completed', '#28a745')}
          >
            Concluídas ({tasks.filter(t => t.completed).length})
          </button>
        </div>

        <ul style={{ listStyle: 'none', padding: 0 }}>
          {filteredTasks.length === 0 ? (
            <div style={{ 
                textAlign: 'center', 
                padding: '40px', 
                color: 'var(--text-color)', 
                backgroundColor: 'var(--card-bg)',
                borderRadius: '12px',
                border: '2px dashed var(--text-color)', 
                opacity: 0.6, 
                marginTop: '20px'
              }}>
              <p style={{ fontSize: '18px', fontWeight: '500' }}>
                {filter === 'all' && "Você ainda não tem nenhuma tarefa. Que tal começar agora? 🚀"}
                {filter === 'pending' && "Tudo limpo! Você não tem tarefas pendentes. ✅"}
                {filter === 'completed' && "Nenhuma tarefa concluída ainda. Vamos produzir! 💪"}
              </p>
            </div>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, marginTop: '20px' }}>
              {filteredTasks.map((t) => (
                <li key={t.id} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: '15px', 
                  backgroundColor: editingId === t.id ? (isDarkMode ? '#3a2a00' : '#fff3e0') : 'var(--card-bg)',
                  borderRadius: '8px',
                  marginBottom: '10px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  alignItems: 'center',
                  opacity: t.completed ? 0.6 : 1,
                  transition: '0.3s'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', flex: 1, cursor: 'pointer' }} onClick={() => toggleComplete(t)}>
                    <div style={{ marginRight: '15px', color: t.completed ? '#28a745' : '#ccc' }}>
                      {t.completed ? <Check size={24} strokeWidth={3} /> : <div style={{ width: 20, height: 20, border: '2px solid #ccc', borderRadius: '4px' }} />}
                    </div>

                    <span style={{ 
                      fontSize: '16px',
                      color: 'var(--text-color)',
                      textDecoration: t.completed ? 'line-through' : 'none',
                      wordBreak: 'break-word',
                      marginRight: '10px'
                    }}>
                      {t.text}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {!t.completed && (
                      <button onClick={() => startEdit(t)} style={{ color: '#007bff', border: 'none', background: 'none', cursor: 'pointer' }}>
                        <Pencil size={18} />
                      </button>
                    )}
                    <button onClick={() => handleDelete(t.id)} style={{ color: '#ff4d4d', border: 'none', background: 'none', cursor: 'pointer' }}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </ul>
    </div>
  );
};

export default Dashboard;