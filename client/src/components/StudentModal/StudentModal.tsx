import React, { useEffect, useState } from 'react';
import type { Student, CreateStudentRequest } from '../../types/student';
import Tag from '../Tag/Tag';
import styles from './StudentModal.module.scss';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  onSave: (data: CreateStudentRequest) => Promise<void> | void;
  loading: boolean;
}

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

const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  onClose,
  student,
  onSave,
  loading,
}) => {
  const [formData, setFormData] = useState<CreateStudentRequest>(defaultFormData);
  const [newInterestInput, setNewInterestInput] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (student) {
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
      } else {
        setFormData(defaultFormData);
      }
      setNewInterestInput('');
    }
  }, [student, isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddInterest = () => {
    const trimmed = newInterestInput.trim();
    if (trimmed && !formData.tags.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, trimmed],
      }));
      setNewInterestInput('');
    }
  };

  const handleRemoveInterest = (interestToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== interestToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>{student ? 'Edit Student' : 'Add New Student'}</h3>
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
            <div className={styles.interestInputRow}>
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
                <Tag
                  key={index}
                  label={tag}
                  onRemove={() => handleRemoveInterest(tag)}
                />
              ))}
            </div>
          </div>

          <div className={styles.modalActions}>
            <button type="button" className={styles.btnSecondary} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.btnPrimary} disabled={loading}>
              {loading ? 'Saving...' : 'Save Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentModal;
