'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { signUpUser } from '@/store/features/userSlice';
import styles from './signup.module.css';

export default function SignUp() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.user);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    if (!email || !password || !confirmPassword || !username) {
      setLocalError('Заполните все поля');
      return;
    }
    if (password !== confirmPassword) {
      setLocalError('Пароли не совпадают');
      return;
    }
    if (password.length < 6) {
      setLocalError('Пароль должен быть не менее 6 символов');
      return;
    }
    const result = await dispatch(signUpUser({ email, password, username }));
    if (result.meta.requestStatus === 'fulfilled') {
      router.push('/signin');
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
          className={styles.modal__input}
          type="text"
          placeholder="Имя пользователя"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className={styles.modal__input}
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
        <input
          className={styles.modal__input}
          type="password"
          placeholder="Повторите пароль"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {(localError || error) && (
          <div className={styles.errorContainer}>
            <span>{localError || error}</span>
          </div>
        )}
        <button type="submit" className={styles.modal__btnSignupEnt} disabled={isLoading}>
          {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>
        <Link
          href="/signin"
          className={styles.modal__btnSignupEnt}
          style={{ marginTop: '10px', background: 'transparent', color: '#580ea2', border: '1px solid #580ea2' }}
        >
          Уже есть аккаунт? Войти
        </Link>
      </form>
    </div>
  );
}