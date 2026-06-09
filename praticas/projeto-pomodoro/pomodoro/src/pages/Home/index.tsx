import { useContext, useEffect } from 'react';
import { Container } from '../../components/Container';
import { CountDown } from '../../components/CountDown';
import { MainForm } from '../../components/MainForm';
import { MainTemplate } from '../../templates/MainTemplate';
import { AuthContext } from '../../contexts/AuthContext/AuthContext';

export function Home() {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    document.title = 'Chronos Pomodoro';
  }, []);

  return (
    <MainTemplate>
      <Container>
        <p style={{ textAlign: 'center', marginBottom: '1rem' }}>
          Bem-vindo, {user?.name ?? user?.email ?? 'usuario'}.
        </p>
      </Container>

      <Container>
        <CountDown />
      </Container>

      <Container>
        <MainForm />
      </Container>
    </MainTemplate>
  );
}
