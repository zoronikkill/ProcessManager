import React, { useState, useEffect } from 'react';
import authService from '../../services/authService';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const user = await authService.getCurrentUser();
      console.log('Текущий пользователь:', user);
      setCurrentUser(user);
    } catch (error) {
      console.error('Ошибка при получении текущего пользователя:', error);
      setError('Ошибка при получении данных текущего пользователя');
    }
  };

  const fetchUsers = async () => {
    try {
      console.log('Начинаем загрузку пользователей...');
      setLoading(true);
      setError('');
      const data = await authService.getUsers();
      console.log('Получены данные пользователей:', data);
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        console.error('Получены некорректные данные:', data);
        setError('Получены некорректные данные пользователей');
      }
    } catch (error) {
      console.error('Ошибка при загрузке пользователей:', error);
      setError(error.message || 'Ошибка при загрузке пользователей');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!currentUser) {
      setError('Ошибка: не удалось получить данные текущего пользователя');
      return;
    }

    if (userId === currentUser.id) {
      setError('Вы не можете удалить свой собственный аккаунт');
      return;
    }

    if (window.confirm('Вы уверены, что хотите удалить этого пользователя? Это действие необратимо.')) {
      try {
        await authService.deleteUser(userId);
        setUsers(users.filter(user => user.id !== userId));
      } catch (error) {
        setError('Ошибка при удалении пользователя');
        console.error('Ошибка при удалении пользователя:', error);
      }
    }
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const canDeleteUser = (userId) => {
    return currentUser && userId !== currentUser.id;
  };

  return (
    <div className="container">
      <Header />
      <div className="user-management">
        <h2>Управление пользователями</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="search-bar">
          <input
            type="text"
            placeholder="Поиск пользователей..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="loading">Загрузка...</div>
        ) : (
          <div className="users-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Имя пользователя</th>
                  <th>Email</th>
                  <th>Роль</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.is_staff && user.is_superuser ? 'Администратор' : 'Сотрудник'}</td>
                    <td>
                      {canDeleteUser(user.id) && (
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(user.id)}
                        >
                          Удалить
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default UserManagement; 