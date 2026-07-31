import React from 'react';
import styles from './Tag.module.scss';

interface TagProps {
  label: string;
  onRemove?: () => void;
}

const Tag: React.FC<TagProps> = ({ label, onRemove }) => {
  return (
    <span className={styles.tag}>
      {label}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className={styles.removeBtn}
          aria-label={`Remove ${label}`}
        >
          &times;
        </button>
      )}
    </span>
  );
};

export default Tag;
