import { useContext } from 'react';
import { TaskContextProvider } from './contexts/TaskContext/TaskContextProvider';
import { MessagesContainer } from './components/MessagesContainer';
import { MainRouter } from './routers/MainRouter';
import './styles/theme.css';
import './styles/global.css';

import { AuthContext } from './contexts/AuthContext/AuthContext';
import Login from './pages/Login/index'; 

export function App() {
  const { isAuthenticated, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <div className='authLoading'>Validando sessao...</div>;
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <TaskContextProvider>
      <MessagesContainer>
        <MainRouter />
      </MessagesContainer>
    </TaskContextProvider>
  );
}
