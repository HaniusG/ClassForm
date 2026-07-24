import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../../assets/logos/ClassForm_Dark.svg';
import styles from './Header.module.scss';
import { useAppSelector } from '../../store/hooks';

const Header = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const defaultAvatar = `https://ui-avatars.com/api/?name=${user?.username || 'User'}&background=4ade80&color=10151f`;

  console.log(user);
  

  return (
    <header className={styles.header}>

      <div className={styles.logoContainer}>
        <Link to="/">
          <img src={logoImg} alt="ClassForm Logo" />
          <h2><span>Class</span>Form</h2>
        </Link>
      </div>

      <nav className={styles.navLinks}>
        <Link to="/dashboard">Dashboard</Link>
        
        {isAuthenticated ? (
          <div className={styles.userMenu}>
            <Link to="/account" className={styles.accountLink}>
              <img 
                // Using your actual database field: profile_image_url
                src={user?.profile_image_url || defaultAvatar} 
                alt="Profile" 
                className={styles.avatar}
              />
              {/* Using your actual database field: username */}
              <span className={styles.username}>{user?.username}</span>
            </Link>
          </div>
        ) : (
          <Link to="/login" className={styles.loginBtn}>Login</Link>
        )}
      </nav>

    </header>
  );
};

export default Header;