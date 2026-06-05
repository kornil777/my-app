'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { loginUser } from '@/store/features/userSlice';
import styles from './signin.module.css';

export default function Signin() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.user);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    if (!email || !password) {
      setLocalError('Заполните все поля');
      return;
    }
    const result = await dispatch(loginUser({ email, password }));
    if (result.meta.requestStatus === 'fulfilled') {
      router.push('/music/main');
    }
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
        {(localError || error) && (
          <div className={styles.errorContainer}>
            <span>{localError || error}</span>
          </div>
        )}
        <button type="submit" className={styles.modal__btnEnter} disabled={isLoading}>
          {isLoading ? 'Вход...' : 'Войти'}
        </button>
        <Link href="/signup" className={styles.modal__btnSignup}>
          Зарегистрироваться
        </Link>
      </form>
    </div>
  );
}