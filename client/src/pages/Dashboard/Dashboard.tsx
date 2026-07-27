import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Dashboard.module.scss';
import Header from '../../components/Header/Header';
import Container from '../../components/Container/Container';

// NOTE: Adjust paths based on your actual file structure
import {
  getAllStudents,
  createStudent,
  updateStudent,
  deleteStudent
} from '../../store/slices/studentsSlice';
import type { Student, CreateStudentRequest } from '../../types/student';

const defaultFormData: CreateStudentRequest = {
  first_name: '',
  last_name: '',
  email: '',
  phone_number: '',
  nationality: '',
  level: '',
  date_of_birth: '',
  description: '',
  tags: [],
};

const Dashboard = () => {
  const dispatch = useDispatch<any>();

  const { students, loading, error } = useSelector((state: any) => state.students);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateStudentRequest>(defaultFormData);
  const [newInterestInput, setNewInterestInput] = useState('');

  useEffect(() => {
    dispatch(getAllStudents());
  }, [dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openCreateModal = () => {
    setFormData(defaultFormData);
    setEditingId(null);
    setNewInterestInput('');
    setIsModalOpen(true);
  };

  const openEditModal = (student: Student) => {

    const formattedDateOfBirth = student.date_of_birth 
      ? student.date_of_birth.split('T')[0] 
      : '';

    setFormData({
      first_name: student.first_name,
      last_name: student.last_name,
      email: student.email || '',
      phone_number: student.phone_number || '',
      nationality: student.nationality || '',
      description: student.description || '',
      level: student.level || '',
      date_of_birth: formattedDateOfBirth,

      tags: student.tags?.map((tag: any) => tag.name || tag) || [],
    });
    setEditingId(student.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await dispatch(updateStudent({ id: editingId, data: formData }));
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

  const handleAddInterest = () => {
    const trimmed = newInterestInput.trim();
    if (trimmed && !formData.tags.includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, trimmed]
      }));
      setNewInterestInput('');
    }
  };

  const handleRemoveInterest = (interestToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== interestToRemove)
    }));
  };

  return (
    <Container>
      <Header />

      <div className={styles.dashboardWrapper}>
        <div className={styles.topBar}>
          <h2>Students Dashboard</h2>
          <button className={styles.btnPrimary} onClick={openCreateModal}>
            + Add Student
          </button>
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
                    <tr key={student.id}>
                      <td>{student.first_name}</td>
                      <td>{student.last_name}</td>
                      <td>{student.email || '-'}</td>
                      <td>{student.level || '-'}</td>
                      <td>{student.phone_number || '-'}</td>
                      <td className={styles.actionsColumn}>
                        <button
                          className={styles.btnEdit}
                          onClick={() => openEditModal(student)}
                        >
                          ✏️
                        </button>
                        <button
                          className={styles.btnDelete}
                          onClick={() => handleDelete(student.id)}
                        >
                          ❌
                        </button>
                      </td>
                    </tr>
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

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>{editingId ? 'Edit Student' : 'Add New Student'}</h3>
            <form onSubmit={handleSubmit} className={styles.form}>

              <div className={styles.inputGroup}>
                <label htmlFor="first_name">First Name *</label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="last_name">Last Name *</label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleInputChange}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="phone_number">Phone Number</label>
                <input
                  type="tel"
                  id="phone_number"
                  name="phone_number"
                  value={formData.phone_number || ''}
                  onChange={handleInputChange}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="level">Level</label>
                <input
                  type="text"
                  id="level"
                  name="level"
                  value={formData.level || ''}
                  onChange={handleInputChange}
                  placeholder="e.g. Beginner, B2, Grade 10"
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="nationality">Nationality</label>
                <input
                  type="text"
                  id="nationality"
                  name="nationality"
                  value={formData.nationality || ''}
                  onChange={handleInputChange}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="date_of_birth">Date of Birth</label>
                <input
                  type="date"
                  id="date_of_birth"
                  name="date_of_birth"
                  value={formData.date_of_birth || ''}
                  onChange={handleInputChange}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="description">Notes / Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange} 
                  rows={4}
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Interests & Tags</label>

                <div className={styles.interestInputRow} style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={newInterestInput}
                    onChange={(e) => setNewInterestInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault(); 
                        handleAddInterest();
                      }
                    }}
                    placeholder="Type an interest and press Enter..."
                  />
                  <button
                    type="button"
                    onClick={handleAddInterest}
                    className={styles.btnSecondary}
                  >
                    Add
                  </button>
                </div>

                <div className={styles.tagContainer}>
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveInterest(tag)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>


              <div className={styles.modalActions}>
                <button type="button" className={styles.btnSecondary} onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className={styles.btnPrimary} disabled={loading}>
                  {loading ? 'Saving...' : 'Save Student'}
                </button>
              </div>



            </form>
          </div>
        </div>
      )}
    </Container>
  );
};

export default Dashboard;