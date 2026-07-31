import React from 'react';
import type { Student } from '../../types/student';
import styles from './StudentTableRow.module.scss';

interface StudentTableRowProps {
  student: Student;
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
}

const StudentTableRow: React.FC<StudentTableRowProps> = ({
  student,
  onEdit,
  onDelete,
}) => {
  return (
    <tr className={styles.tableRow}>
      <td>{student.first_name}</td>
      <td>{student.last_name}</td>
      <td>{student.email || '-'}</td>
      <td>{student.level || '-'}</td>
      <td>{student.phone_number || '-'}</td>
      <td className={styles.actionsColumn}>
        <button
          className={styles.btnEdit}
          onClick={() => onEdit(student)}
          aria-label={`Edit ${student.first_name} ${student.last_name}`}
        >
          ✏️
        </button>
        <button
          className={styles.btnDelete}
          onClick={() => onDelete(student.id)}
          aria-label={`Delete ${student.first_name} ${student.last_name}`}
        >
          ❌
        </button>
      </td>
    </tr>
  );
};

export default StudentTableRow;
