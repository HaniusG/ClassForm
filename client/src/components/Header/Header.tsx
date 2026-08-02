import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoImg from '../../assets/logos/ClassForm_Dark.svg';
import styles from './Header.module.scss';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';

const Header = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const defaultAvatar = `https://ui-avatars.com/api/?name=${user?.username || 'User'}&background=4ade80&color=10151f`;

  console.log(user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className={styles.header}>

      <div className={styles.logoContainer}>
        <Link to="/">
          <img src={logoImg} alt="ClassForm Logo" />
          <h2><span>Class</span>Form</h2>
        </Link>
      </div>

      <nav className={styles.navLinks}>
        {/* Commented out dashboard link because it's always there on the dashboard itself */}
        {/* <Link to="/dashboard">Dashboard</Link> */}
        
        {isAuthenticated ? (
          <div className={styles.userMenu}>
            <div className={styles.accountLinkWrapper}>
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
              
              <div className={styles.dropdown}>
                <button onClick={handleLogout} className={styles.logoutBtn}>
                  Logout
                </button>
              </div>
            </div>
          </div>
        ) : (
          <Link to="/login" className={styles.loginBtn}>Login</Link>
        )}
      </nav>

    </header>
  );
};

export default Header;