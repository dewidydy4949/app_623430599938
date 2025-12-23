import React, { ReactNode } from 'react';
import styles from './PageTransition.module.css';

interface PageTransitionProps {
  children: ReactNode;
  type?: 'fade' | 'slide-up' | 'slide-down' | 'scale' | 'immersive';
}

const PageTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  type = 'fade' 
}) => {
  const getTransitionClass = () => {
    switch (type) {
      case 'slide-up':
        return styles.slideUp;
      case 'slide-down':
        return styles.slideDown;
      case 'scale':
        return styles.scale;
      case 'immersive':
        return styles.immersive;
      default:
        return styles.fade;
    }
  };

  return (
    <div className={`${styles.pageTransition} ${getTransitionClass()}`}>
      {children}
    </div>
  );
};

export default PageTransition;