'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './signin.module.css';

export default function Signin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    if (!email || !password) {
      setErrors(['Заполните все поля']);
      return;
    }
    // TODO: подключить API авторизации
    router.push('/');
  };

  return (
    <div className={styles.modal__block}>
      <form className={styles.modal__form} onSubmit={handleSubmit}>
        <Link href="/">
          <div className={styles.modal__logo}>
            <img src="/img/logo_modal.png" alt="logo" />
          </div>
        </Link>
        <input
          className={`${styles.modal__input} ${styles.login}`}
          type="email"
          placeholder="Почта"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className={styles.modal__input}
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.length > 0 && (
          <div className={styles.errorContainer}>
            {errors.map((err, idx) => (
              <span key={idx}>{err}</span>
            ))}
          </div>
        )}
        <button type="submit" className={styles.modal__btnEnter}>
          Войти
        </button>
        <Link href="/signup" className={styles.modal__btnSignup}>
          Зарегистрироваться
        </Link>
      </form>
    </div>
  );
}