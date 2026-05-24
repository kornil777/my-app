// components/Navigation/Navigation.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { logout } from '@/store/features/userSlice';
import { useClientOnly } from '@/hooks/useClientOnly';
import styles from './Navigation.module.css';

export default function Navigation() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isClient = useClientOnly();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAppSelector((state) => state.user);
  const isAuth = !!user;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
    setIsMenuOpen(false);
  };

  // Формируем пункты меню (только на клиенте или с fallback)
  let menuItems: { label: string; href: string; action?: () => void }[] = [];
  if (isClient) {
    menuItems = [
      { label: 'Главное', href: '/music/main' },
      ...(isAuth ? [{ label: 'Мой плейлист', href: '/music/playlist' }] : []),
      { label: isAuth ? 'Выйти' : 'Войти', href: isAuth ? '#' : '/signin', action: isAuth ? handleLogout : undefined },
    ];
  } else {
    // На сервере показываем только главное и заглушку для входа
    menuItems = [
      { label: 'Главное', href: '/music/main' },
      { label: '...', href: '#' },
    ];
  }

  return (
    <nav className={styles.mainNav}>
      <div className={styles.navLogo}>
        <Image width={250} height={170} className={styles.logoImage} src="/img/logo.png" alt="logo" />
      </div>
      <div className={styles.navBurger} onClick={toggleMenu}>
        <span className={styles.burgerLine}></span>
        <span className={styles.burgerLine}></span>
        <span className={styles.burgerLine}></span>
      </div>
      {isMenuOpen && (
        <div className={styles.navMenu}>
          <ul className={styles.menuList}>
            {menuItems.map((item) => (
              <li key={item.label} className={styles.menuItem}>
                {item.action ? (
                  <button className={styles.menuLink} onClick={item.action}>
                    {item.label}
                  </button>
                ) : (
                  <Link href={item.href} className={styles.menuLink} onClick={() => setIsMenuOpen(false)}>
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}