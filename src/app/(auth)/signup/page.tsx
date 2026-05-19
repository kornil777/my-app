'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './signup.module.css';

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    if (!email || !password || !confirmPassword) {
      setErrors(['Заполните все поля']);
      return;
    }
    if (password !== confirmPassword) {
      setErrors(['Пароли не совпадают']);
      return;
    }
    if (password.length < 6) {
      setErrors(['Пароль должен быть не менее 6 символов']);
      return;
    }
    // TODO: подключить API регистрации
    router.push('/signin');
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
        {errors.length > 0 && (
          <div className={styles.errorContainer}>
            {errors.map((err, idx) => (
              <span key={idx}>{err}</span>
            ))}
          </div>
        )}
        <button type="submit" className={styles.modal__btnSignupEnt}>
          Зарегистрироваться
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