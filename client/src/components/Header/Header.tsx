import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../../assets/logos/ClassForm_Dark.svg';
import styles from './Header.module.scss'; 

const Header = () => {
  const isLoggedIn = false; 

  return (
    <header className={styles.header}>
      
      <div className={styles.logoContainer}>
        <Link to="/">
          <img src={logoImg} alt="ClassForm Logo"/>
          <h2><span>Class</span>Form</h2>
        </Link>
      </div>

      <nav className={styles.navLinks}>
        <Link to="/dashboard">Dashboard</Link>
        {isLoggedIn ? (
          <Link to="/account">Account</Link>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>
      
    </header>
  );
};

export default Header;