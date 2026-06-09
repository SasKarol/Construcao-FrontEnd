import { useContext, useState, type FormEvent } from 'react';
import { AuthContext } from '../../contexts/AuthContext/AuthContext';
import styles from './styles.module.css';

type ViewMode = 'login' | 'register' | 'recover' | 'reset';

export default function Login() {
  const { login, register, forgotPassword, resetPassword } =
    useContext(AuthContext);

  const [viewMode, setViewMode] = useState<ViewMode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [feedback, setFeedback] = useState('');
  const [feedbackType, setFeedbackType] = useState<'success' | 'error'>(
    'error',
  );
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function showFeedback(message: string, type: 'success' | 'error' = 'error') {
    setFeedback(message);
    setFeedbackType(type);
  }

  function validateEmail(value: string) {
    return value.trim().includes('@');
  }

  async function handleLogin(e: FormEvent) {
    e.preventDefault();

    if (!validateEmail(email) || password.length < 6) {
      showFeedback('Informe um e-mail valido e senha com 6 caracteres.');
      return;
    }

    setIsSubmitting(true);

    try {
      await login(email.trim().toLowerCase(), password);
      showFeedback('Login realizado com sucesso.', 'success');
    } catch (error) {
      showFeedback(
        error instanceof Error ? error.message : 'Nao foi possivel entrar.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleRegister(e: FormEvent) {
    e.preventDefault();

    if (name.trim().length < 2 || !validateEmail(email) || password.length < 6) {
      showFeedback('Informe nome, e-mail valido e senha com 6 caracteres.');
      return;
    }

    setIsSubmitting(true);

    try {
      await register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });
      showFeedback('Conta criada com sucesso.', 'success');
    } catch (error) {
      showFeedback(
        error instanceof Error
          ? error.message
          : 'Nao foi possivel criar a conta.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleRecover(e: FormEvent) {
    e.preventDefault();

    if (!validateEmail(email)) {
      showFeedback('Informe um e-mail valido.');
      return;
    }

    setIsSubmitting(true);

    try {
      const resetToken = await forgotPassword(email.trim().toLowerCase());
      if (resetToken) {
        setToken(resetToken);
        setViewMode('reset');
        showFeedback(
          `Token gerado para laboratorio: ${resetToken}`,
          'success',
        );
      } else {
        showFeedback(
          'Se o e-mail existir, o token sera gerado pela API.',
          'success',
        );
      }
    } catch (error) {
      showFeedback(
        error instanceof Error
          ? error.message
          : 'Nao foi possivel recuperar a senha.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleReset(e: FormEvent) {
    e.preventDefault();

    if (!token.trim() || password.length < 6) {
      showFeedback('Informe o token e uma nova senha com 6 caracteres.');
      return;
    }

    setIsSubmitting(true);

    try {
      await resetPassword(token.trim(), password);
      setPassword('');
      setToken('');
      setViewMode('login');
      showFeedback('Senha redefinida. Entre com a nova senha.', 'success');
    } catch (error) {
      showFeedback(
        error instanceof Error
          ? error.message
          : 'Nao foi possivel redefinir a senha.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function openMode(mode: ViewMode) {
    setViewMode(mode);
    setFeedback('');
  }

  const titleByMode = {
    login: 'Pomodoro IESB',
    register: 'Criar uma conta',
    recover: 'Recuperar senha',
    reset: 'Redefinir senha',
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.cardTitle}>{titleByMode[viewMode]}</div>

        {viewMode === 'login' && (
          <form onSubmit={handleLogin} className={styles.form}>
            <EmailField email={email} setEmail={setEmail} />
            <PasswordField
              password={password}
              setPassword={setPassword}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              label='Senha'
            />

            <button
              type='submit'
              className={styles.button}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        )}

        {viewMode === 'register' && (
          <form onSubmit={handleRegister} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor='name'>Nome</label>
              <input
                id='name'
                type='text'
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder='Seu nome'
                required
              />
            </div>
            <EmailField email={email} setEmail={setEmail} />
            <PasswordField
              password={password}
              setPassword={setPassword}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              label='Senha'
            />

            <button
              type='submit'
              className={styles.button}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Criando...' : 'Criar conta'}
            </button>
          </form>
        )}

        {viewMode === 'recover' && (
          <form onSubmit={handleRecover} className={styles.form}>
            <EmailField email={email} setEmail={setEmail} />

            <button
              type='submit'
              className={styles.button}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Gerando...' : 'Gerar token'}
            </button>
          </form>
        )}

        {viewMode === 'reset' && (
          <form onSubmit={handleReset} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor='token'>Token</label>
              <input
                id='token'
                type='text'
                value={token}
                onChange={e => setToken(e.target.value)}
                placeholder='Token recebido'
                required
              />
            </div>
            <PasswordField
              password={password}
              setPassword={setPassword}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              label='Nova senha'
            />

            <button
              type='submit'
              className={styles.button}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Salvando...' : 'Redefinir senha'}
            </button>
          </form>
        )}

        {feedback && (
          <div
            className={`${styles.feedback} ${styles[feedbackType]}`}
            style={{ marginTop: '1rem' }}
          >
            {feedback}
          </div>
        )}

        <div className={styles.actions}>
          {viewMode !== 'login' && (
            <button
              type='button'
              className={styles.linkButton}
              onClick={() => openMode('login')}
            >
              Voltar para login
            </button>
          )}
          {viewMode !== 'recover' && (
            <button
              type='button'
              className={styles.linkButton}
              onClick={() => openMode('recover')}
            >
              Esqueci minha senha
            </button>
          )}
          {viewMode !== 'register' && (
            <button
              type='button'
              className={styles.linkButton}
              onClick={() => openMode('register')}
            >
              Criar uma conta
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

type EmailFieldProps = {
  email: string;
  setEmail: (value: string) => void;
};

function EmailField({ email, setEmail }: EmailFieldProps) {
  return (
    <div className={styles.inputGroup}>
      <label htmlFor='email'>E-mail</label>
      <input
        id='email'
        type='email'
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder='voce@email.com'
        required
      />
    </div>
  );
}

type PasswordFieldProps = {
  password: string;
  setPassword: (value: string) => void;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  label: string;
};

function PasswordField({
  password,
  setPassword,
  showPassword,
  setShowPassword,
  label,
}: PasswordFieldProps) {
  return (
    <div className={styles.inputGroup}>
      <label htmlFor='password'>{label}</label>

      <div className={styles.passwordWrapper}>
        <input
          id='password'
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder='Minimo 6 caracteres'
          required
        />
        <button
          type='button'
          className={styles.togglePasswordBtn}
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? 'Ocultar' : 'Revelar'}
        </button>
      </div>
    </div>
  );
}
