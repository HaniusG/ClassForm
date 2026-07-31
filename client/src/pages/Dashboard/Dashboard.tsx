import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Dashboard.module.scss';
import Header from '../../components/Header/Header';
import Container from '../../components/Container/Container';
import StudentTableRow from '../../components/StudentTableRow/StudentTableRow';
import StudentModal from '../../components/StudentModal/StudentModal';
import LessonPlanModal from '../../components/LessonPlanModal/LessonPlanModal';

import {
  getAllStudents,
  createStudent,
  updateStudent,
  deleteStudent
} from '../../store/slices/studentsSlice';
import type { Student, CreateStudentRequest } from '../../types/student';

const Dashboard = () => {
  const dispatch = useDispatch<any>();

  const { students, loading, error } = useSelector((state: any) => state.students);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  useEffect(() => {
    dispatch(getAllStudents());
  }, [dispatch]);

  const openCreateModal = () => {
    setEditingStudent(null);
    setIsModalOpen(true);
  };

  const openEditModal = (student: Student) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
  };

  const handleSaveStudent = async (formData: CreateStudentRequest) => {
    if (editingStudent) {
      await dispatch(updateStudent({ id: editingStudent.id, data: formData }));
    } else {
      await dispatch(createStudent(formData));
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      dispatch(deleteStudent(id));
    }
  };

  return (
    <Container>
      <Header />

      <div className={styles.dashboardWrapper}>
        <div className={styles.topBar}>
          <h2>Students Dashboard</h2>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button 
              className={styles.btnSecondary} 
              onClick={() => setIsAiModalOpen(true)}
            >
              ✨ AI Lesson Plan
            </button>
            <button className={styles.btnPrimary} onClick={openCreateModal}>
              + Add Student
            </button>
          </div>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <div className={styles.tableContainer}>
          {loading && students.length === 0 ? (
            <p className={styles.loadingText}>Loading students...</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Level</th>
                  <th>Phone</th>
                  <th className={styles.actionsColumn}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.length > 0 ? (
                  students.map((student: Student) => (
                    <StudentTableRow
                      key={student.id}
                      student={student}
                      onEdit={openEditModal}
                      onDelete={handleDelete}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className={styles.emptyState}>
                      No students found. Add one to get started!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <StudentModal
        isOpen={isModalOpen}
        onClose={closeModal}
        student={editingStudent}
        onSave={handleSaveStudent}
        loading={loading}
      />

      <LessonPlanModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        students={students}
      />
    </Container>
  );
};

export default Dashboard;