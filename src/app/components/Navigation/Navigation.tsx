import Link from 'next/link';
import Image from 'next/image';
import styles from './Navigation.module.css';

const menuItems = [
  { label: 'Главное', href: '/' },
  { label: 'Мой плейлист', href: '/playlist' },
  { label: 'Войти', href: '/signin' },
];

export default function Navigation() {
  return (
    <nav className={styles.mainNav}>
      <div className={styles.navLogo}>
        <Image
          width={250}
          height={170}
          className={styles.logoImage}
          src="/img/logo.png"
          alt="logo"
        />
      </div>
      <div className={styles.navBurger}>
        <span className={styles.burgerLine}></span>
        <span className={styles.burgerLine}></span>
        <span className={styles.burgerLine}></span>
      </div>
      <div className={styles.navMenu}>
        <ul className={styles.menuList}>
          {menuItems.map((item) => (
            <li key={item.label} className={styles.menuItem}>
              <Link href={item.href} className={styles.menuLink}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}