import { useState } from 'react';
import Container from '../../components/Container/Container';
import styles from './Register.module.scss';
import logoImg from '../../assets/logos/ClassForm.svg';
import api from '../../api/client';
import axios from 'axios';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const body_reg = {
        email: email,
        password: password,
        username: username,
      };

      await api.post('/auth/register', body_reg);

      const body = new URLSearchParams();
      body.set('username', email);
      body.set('password', password);

      const res = await api.post('/auth/jwt/login', body, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      localStorage.setItem('access_token', res.data.access_token);

      window.location.href = '/dashboard';
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const detail = err.response?.data?.detail;

        if (detail === 'REGISTER_USER_ALREADY_EXISTS') {
          setError('An account with this email already exists.');
        } else if (detail === 'LOGIN_BAD_CREDENTIALS') {
          setError('Incorrect email or password.');
        } else if (detail === 'LOGIN_USER_NOT_VERIFIED') {
          setError('Please verify your email before signing in.');
        } else if (err.response?.status === 422) {
          setError('Please check your email, password, and username.');
        } else if (!err.response) {
          setError('Could not reach the server. Please try again.');
        } else {
          setError('Something went wrong. Please try again.');
        }
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <img src={logoImg} alt="ClassForm Logo" />
          <span className={styles.brandTag}>register</span>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>

          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>
              Username
            </label>
            <input
              id="username"
              type="username"
              className={styles.input}
              placeholder="Your username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              id="email"
              type="email"
              className={styles.input}
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <div className={styles.labelRow}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
            </div>
            <input
              id="password"
              type="password"
              className={styles.input}
              placeholder="••••••••"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* <div className={styles.field}>
            <div className={styles.labelRow}>
              <label htmlFor="password" className={styles.label}>
                Image
              </label>
            </div>
            <input
              id="image"
              type="image"
            />
          </div> */}

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.submit} disabled={isSubmitting}>
            <span className={styles.submitBracket}>[</span>
            {isSubmitting ? 'Signing up…' : 'Sign up'}
            <span className={styles.submitBracket}>]</span>
          </button>
        </form>

        <div className={styles.divider}>
          <span />
          <span className={styles.dividerText}>or</span>
          <span />
        </div>

        <p className={styles.footer}>
          Have an account? <a href="/login">Sign in</a>
        </p>
      </div>
    </Container>
  );
};

export default Register;
