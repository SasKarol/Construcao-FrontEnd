import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import styles from './styles.module.css'; // Estilização via CSS Modules

const Login = () => {
  const { login } = useContext(AuthContext);

  // Estados locais para formulário, feedback e modo de visualização
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [viewMode, setViewMode] = useState('login'); // Pode ser: 'login', 'register', 'recover'

  // Ref para focar no input de usuário automaticamente
  const usernameRef = useRef(null);

  // Efeito para auto-focus ao carregar a tela
  useEffect(() => {
    if (viewMode === 'login' && usernameRef.current) {
      usernameRef.current.focus();
    }
  }, [viewMode]);

  // Efeito para limpar mensagens de erro após 4 segundos
  useEffect(() => {
    if (feedback.message && feedback.type === 'error') {
      const timer = setTimeout(() => setFeedback({ message: '', type: '' }), 4000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  // Manipulador do formulário
  const handleSubmit = (e) => {
    e.preventDefault(); // Previne o comportamento padrão do form
    
    setFeedback({ message: 'Validando credenciais...', type: 'info' });

    // Simula um delay de rede para exibir o feedback
    setTimeout(() => {
      const success = login(username, password);
      if (success) {
        setFeedback({ message: 'Login realizado com sucesso!', type: 'success' });
      } else {
        setFeedback({ message: 'Usuário ou senha inválidos. Tente admin / 1234', type: 'error' });
      }
    }, 1000);
  };

  // Renderização condicional para a "Tela de Cadastro" simulada
  if (viewMode === 'register') {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h2>Cadastre-se</h2>
          <p>Fluxo de cadastro ainda será implementado (simulação).</p>
          <button onClick={() => setViewMode('login')} className={styles.button}>Voltar para Login</button>
        </div>
      </div>
    );
  }

  // Renderização condicional para a "Tela de Recuperação de Senha" simulada
  if (viewMode === 'recover') {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h2>Recuperar Senha</h2>
          <p>Fluxo de recuperação de senha ainda será implementado (simulação).</p>
          <button onClick={() => setViewMode('login')} className={styles.button}>Voltar para Login</button>
        </div>
      </div>
    );
  }

  // Renderização principal: Formulário de Login
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>Entrar no Pomodoro</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          
          <div className={styles.inputGroup}>
            {/* Label vinculado via htmlFor para acessibilidade */}
            <label htmlFor="username">Usuário ou E-mail</label>
            <input
              type="text"
              id="username"
              ref={usernameRef}
              value={username}
              onChange={(e) => setUsername(e.target.value)} // Input controlado
              placeholder="Digite seu usuário"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Input controlado
              placeholder="Digite sua senha"
              required
            />
          </div>

          {/* Feedback visual condicional */}
          {feedback.message && (
            <div className={`${styles.feedback} ${styles[feedback.type]}`}>
              {feedback.message}
            </div>
          )}

          <button type="submit" className={styles.button} aria-label="Botão de Entrar">
            Entrar
          </button>
        </form>

        <div className={styles.actions}>
          <button type="button" onClick={() => setViewMode('recover')} className={styles.linkButton}>
            Esqueci minha senha
          </button>
          <button type="button" onClick={() => setViewMode('register')} className={styles.linkButton}>
            Não tem conta? Cadastre-se
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;