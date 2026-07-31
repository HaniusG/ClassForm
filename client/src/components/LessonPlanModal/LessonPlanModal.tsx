import React, { useState } from 'react';
import type { Student } from '../../types/student';
import { generateLessonPlan } from '../../services/aiService';
import styles from './LessonPlanModal.module.scss';
import ReactMarkdown from 'react-markdown';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
}

const LessonPlanModal: React.FC<Props> = ({ isOpen, onClose, students }) => {
  const [topic, setTopic] = useState('');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [lessonPlan, setLessonPlan] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const classTags = Array.from(
    new Set(
      students
        .flatMap((s) => s.tags || [])
        .map((tag: any) => (typeof tag === 'string' ? tag : tag.name || tag.label))
        .filter(Boolean)
    )
  );

  const classDescriptions = students
    .map((s) => s.description)
    .filter((desc): desc is string => Boolean(desc && desc.trim()));

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const plan = await generateLessonPlan(topic, details, classTags, classDescriptions);
      setLessonPlan(plan);
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>Generate AI Lesson Plan</h3>

        <div className={styles.metaInfo}>
          <p>
            <strong>Class Tags ({classTags.length}):</strong>{' '}
            {classTags.length > 0 ? classTags.join(', ') : 'No tags assigned'}
          </p>
          <p>
            <strong>Profiles Collected:</strong> {classDescriptions.length} of {students.length} students
          </p>
        </div>

        <form onSubmit={handleGenerate}>
          <div className={styles.field}>
            <label>Lesson Topic</label>
            <input
              type="text"
              required
              placeholder="e.g. Quadratic Equations, React Hooks, World War II"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label>Class Details & Constraints</label>
            <textarea
              required
              placeholder="e.g. 45-minute class, intermediate level, needs group exercise"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>

          <div className={styles.modalActions}>
            <button className={styles.btnSecondary} type="button" onClick={onClose}>Close</button>
            <button className={styles.btnPrimary} type="submit" disabled={loading}>
              {loading ? 'Generating...' : 'Generate Plan'}
            </button>
          </div>
        </form>

        {error && <div className={styles.error}>{error}</div>}

        {lessonPlan && (
          <div className={styles.resultContainer}>
            <div className={styles.resultHeader}>
              <h4>✨ Generated Lesson Plan</h4>
              <button
                type="button"
                className={styles.btnCopy}
                onClick={() => navigator.clipboard.writeText(lessonPlan)}
              >
                Copy Text
              </button>
            </div>
            {/* 2. Replace <pre> with a div wrapping ReactMarkdown */}
            <div className={styles.planOutput}>
              <ReactMarkdown>{lessonPlan}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonPlanModal;