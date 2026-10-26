'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  Department,
  ClassRoom,
  Subject,
  TeachingMaterial,
  Assignment,
  Submission,
  Quiz,
  QuizAttempt,
  GradeRecord,
  Announcement,
  SchoolSettings,
  LearningProgress,
  UserRole,
} from './types';
import {
  INITIAL_SCHOOL_SETTINGS,
  INITIAL_DEPARTMENTS,
  INITIAL_CLASSES,
  INITIAL_USERS,
  INITIAL_SUBJECTS,
  INITIAL_MATERIALS,
  INITIAL_ASSIGNMENTS,
  INITIAL_SUBMISSIONS,
  INITIAL_QUIZZES,
  INITIAL_QUIZ_ATTEMPTS,
  INITIAL_GRADES,
  INITIAL_ANNOUNCEMENTS,
} from './mock-data';

interface LmsContextType {
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  switchRole: (role: UserRole) => void;
  schoolSettings: SchoolSettings;
  updateSchoolSettings: (settings: Partial<SchoolSettings>) => void;
  users: UserProfile[];
  addUser: (user: Omit<UserProfile, 'id' | 'created_at'>) => void;
  updateUser: (id: string, updates: Partial<UserProfile>) => void;
  deleteUser: (id: string) => void;
  departments: Department[];
  classes: ClassRoom[];
  addClass: (cls: Omit<ClassRoom, 'id'>) => void;
  updateClass: (id: string, updates: Partial<ClassRoom>) => void;
  deleteClass: (id: string) => void;
  subjects: Subject[];
  addSubject: (sub: Omit<Subject, 'id'>) => void;
  updateSubject: (id: string, updates: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;
  materials: TeachingMaterial[];
  addMaterial: (material: Omit<TeachingMaterial, 'id' | 'created_at' | 'updated_at'>) => void;
  updateMaterial: (id: string, updates: Partial<TeachingMaterial>) => void;
  deleteMaterial: (id: string) => void;
  assignments: Assignment[];
  addAssignment: (asg: Omit<Assignment, 'id' | 'created_at'>) => void;
  updateAssignment: (id: string, updates: Partial<Assignment>) => void;
  deleteAssignment: (id: string) => void;
  submissions: Submission[];
  submitAssignment: (subm: Omit<Submission, 'id' | 'submitted_at' | 'status'>) => void;
  gradeSubmission: (id: string, score: number, feedback: string, gradedBy: string) => void;
  quizzes: Quiz[];
  addQuiz: (quiz: Omit<Quiz, 'id' | 'created_at'>) => void;
  deleteQuiz: (id: string) => void;
  quizAttempts: Record<string, any>[];
  submitQuizAttempt: (attempt: Omit<QuizAttempt, 'id' | 'completed_at'>) => number;
  grades: GradeRecord[];
  updateGrade: (id: string, updates: Partial<GradeRecord>) => void;
  announcements: Announcement[];
  addAnnouncement: (ann: Omit<Announcement, 'id' | 'created_at'>) => void;
  deleteAnnouncement: (id: string) => void;
  learningProgress: LearningProgress[];
  toggleMaterialCompleted: (materialId: string, studentId: string) => void;
  resetAllData: () => void;
}

const LmsContext = createContext<LmsContextType | null>(null);

const STORAGE_KEY = 'edusmk_lms_v1_store';

export function LmsProvider({ children }: { children: React.ReactNode }) {
  // Current user state
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USERS[0]); // default admin
  const [schoolSettings, setSchoolSettings] = useState<SchoolSettings>(INITIAL_SCHOOL_SETTINGS);
  const [users, setUsers] = useState<UserProfile[]>(INITIAL_USERS);
  const [departments, setDepartments] = useState<Department[]>(INITIAL_DEPARTMENTS);
  const [classes, setClasses] = useState<ClassRoom[]>(INITIAL_CLASSES);
  const [subjects, setSubjects] = useState<Subject[]>(INITIAL_SUBJECTS);
  const [materials, setMaterials] = useState<TeachingMaterial[]>(INITIAL_MATERIALS);
  const [assignments, setAssignments] = useState<Assignment[]>(INITIAL_ASSIGNMENTS);
  const [submissions, setSubmissions] = useState<Submission[]>(INITIAL_SUBMISSIONS);
  const [quizzes, setQuizzes] = useState<Quiz[]>(INITIAL_QUIZZES);
  const [quizAttempts, setQuizAttempts] = useState<Record<string, any>[]>(INITIAL_QUIZ_ATTEMPTS);
  const [grades, setGrades] = useState<GradeRecord[]>(INITIAL_GRADES);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [learningProgress, setLearningProgress] = useState<LearningProgress[]>([
    { id: 'lp-1', student_id: 'user-siswa-1', material_id: 'mat-01', is_completed: true, completed_at: '2026-02-12T16:00:00Z' },
  ]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.users) setUsers(parsed.users);
        if (parsed.classes) setClasses(parsed.classes);
        if (parsed.subjects) setSubjects(parsed.subjects);
        if (parsed.materials) setMaterials(parsed.materials);
        if (parsed.assignments) setAssignments(parsed.assignments);
        if (parsed.submissions) setSubmissions(parsed.submissions);
        if (parsed.quizzes) setQuizzes(parsed.quizzes);
        if (parsed.quizAttempts) setQuizAttempts(parsed.quizAttempts);
        if (parsed.grades) setGrades(parsed.grades);
        if (parsed.announcements) setAnnouncements(parsed.announcements);
        if (parsed.learningProgress) setLearningProgress(parsed.learningProgress);
        if (parsed.schoolSettings) setSchoolSettings(parsed.schoolSettings);
        if (parsed.currentUserId) {
          const user = parsed.users?.find((u: UserProfile) => u.id === parsed.currentUserId);
          if (user) setCurrentUser(user);
        }
      }
    } catch {
      // Ignore parse errors and keep defaults
    }
  }, []);

  // Save to localStorage on changes
  const saveState = (updatedState: Record<string, any>) => {
    try {
      const currentFull = {
        users,
        classes,
        subjects,
        materials,
        assignments,
        submissions,
        quizzes,
        quizAttempts,
        grades,
        announcements,
        learningProgress,
        schoolSettings,
        currentUserId: currentUser.id,
        ...updatedState,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentFull));
    } catch {
      // ignore storage quota error
    }
  };

  const switchRole = (role: UserRole) => {
    const targetUser = users.find((u) => u.role === role) || INITIAL_USERS.find((u) => u.role === role);
    if (targetUser) {
      setCurrentUser(targetUser);
      saveState({ currentUserId: targetUser.id });
    }
  };

  const updateSchoolSettings = (newSettings: Partial<SchoolSettings>) => {
    setSchoolSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      saveState({ schoolSettings: updated });
      return updated;
    });
  };

  const addUser = (userData: Omit<UserProfile, 'id' | 'created_at'>) => {
    const newUser: UserProfile = {
      ...userData,
      id: `user-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setUsers((prev) => {
      const updated = [newUser, ...prev];
      saveState({ users: updated });
      return updated;
    });
  };

  const updateUser = (id: string, updates: Partial<UserProfile>) => {
    setUsers((prev) => {
      const updated = prev.map((u) => (u.id === id ? { ...u, ...updates, updated_at: new Date().toISOString() } : u));
      saveState({ users: updated });
      if (currentUser.id === id) {
        setCurrentUser((curr) => ({ ...curr, ...updates }));
      }
      return updated;
    });
  };

  const deleteUser = (id: string) => {
    setUsers((prev) => {
      const updated = prev.filter((u) => u.id !== id);
      saveState({ users: updated });
      return updated;
    });
  };

  const addClass = (clsData: Omit<ClassRoom, 'id'>) => {
    const newClass: ClassRoom = {
      ...clsData,
      id: `class-${Date.now()}`,
    };
    setClasses((prev) => {
      const updated = [...prev, newClass];
      saveState({ classes: updated });
      return updated;
    });
  };

  const updateClass = (id: string, updates: Partial<ClassRoom>) => {
    setClasses((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, ...updates } : c));
      saveState({ classes: updated });
      return updated;
    });
  };

  const deleteClass = (id: string) => {
    setClasses((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      saveState({ classes: updated });
      return updated;
    });
  };

  const addSubject = (subData: Omit<Subject, 'id'>) => {
    const newSub: Subject = {
      ...subData,
      id: `sub-${Date.now()}`,
    };
    setSubjects((prev) => {
      const updated = [...prev, newSub];
      saveState({ subjects: updated });
      return updated;
    });
  };

  const updateSubject = (id: string, updates: Partial<Subject>) => {
    setSubjects((prev) => {
      const updated = prev.map((s) => (s.id === id ? { ...s, ...updates } : s));
      saveState({ subjects: updated });
      return updated;
    });
  };

  const deleteSubject = (id: string) => {
    setSubjects((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      saveState({ subjects: updated });
      return updated;
    });
  };

  const addMaterial = (matData: Omit<TeachingMaterial, 'id' | 'created_at' | 'updated_at'>) => {
    const newMat: TeachingMaterial = {
      ...matData,
      id: `mat-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setMaterials((prev) => {
      const updated = [newMat, ...prev];
      saveState({ materials: updated });
      return updated;
    });
  };

  const updateMaterial = (id: string, updates: Partial<TeachingMaterial>) => {
    setMaterials((prev) => {
      const updated = prev.map((m) =>
        m.id === id ? { ...m, ...updates, updated_at: new Date().toISOString() } : m
      );
      saveState({ materials: updated });
      return updated;
    });
  };

  const deleteMaterial = (id: string) => {
    setMaterials((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      saveState({ materials: updated });
      return updated;
    });
  };

  const addAssignment = (asgData: Omit<Assignment, 'id' | 'created_at'>) => {
    const newAsg: Assignment = {
      ...asgData,
      id: `asg-${Date.now()}`,
      created_at: new Date().toISOString(),
      submitted_count: 0,
      total_students: 36,
    };
    setAssignments((prev) => {
      const updated = [newAsg, ...prev];
      saveState({ assignments: updated });
      return updated;
    });
  };

  const updateAssignment = (id: string, updates: Partial<Assignment>) => {
    setAssignments((prev) => {
      const updated = prev.map((a) => (a.id === id ? { ...a, ...updates } : a));
      saveState({ assignments: updated });
      return updated;
    });
  };

  const deleteAssignment = (id: string) => {
    setAssignments((prev) => {
      const updated = prev.filter((a) => a.id !== id);
      saveState({ assignments: updated });
      return updated;
    });
  };

  const submitAssignment = (submData: Omit<Submission, 'id' | 'submitted_at' | 'status'>) => {
    const isLate = false;
    const existingIndex = submissions.findIndex(
      (s) => s.assignment_id === submData.assignment_id && s.student_id === submData.student_id
    );

    let updatedSubmissions: Submission[];
    if (existingIndex >= 0) {
      updatedSubmissions = [...submissions];
      updatedSubmissions[existingIndex] = {
        ...updatedSubmissions[existingIndex],
        ...submData,
        submitted_at: new Date().toISOString(),
        status: isLate ? 'terlambat' : 'sudah_dikumpulkan',
      };
    } else {
      const newSubm: Submission = {
        ...submData,
        id: `subm-${Date.now()}`,
        submitted_at: new Date().toISOString(),
        status: isLate ? 'terlambat' : 'sudah_dikumpulkan',
      };
      updatedSubmissions = [newSubm, ...submissions];
    }

    setSubmissions(updatedSubmissions);
    saveState({ submissions: updatedSubmissions });

    // increment submitted_count in assignment
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === submData.assignment_id
          ? { ...a, submitted_count: (a.submitted_count || 0) + 1 }
          : a
      )
    );
  };

  const gradeSubmission = (id: string, score: number, feedback: string, gradedBy: string) => {
    let studentId = '';
    let assignmentId = '';

    setSubmissions((prev) => {
      const updated = prev.map((s) => {
        if (s.id === id) {
          studentId = s.student_id;
          assignmentId = s.assignment_id;
          return {
            ...s,
            score,
            feedback,
            graded_at: new Date().toISOString(),
            graded_by: gradedBy,
            status: 'sudah_dinilai' as const,
          };
        }
        return s;
      });
      saveState({ submissions: updated });
      return updated;
    });

    // Update grade record if student exists
    if (studentId) {
      const targetUser = users.find((u) => u.id === studentId);
      if (targetUser) {
        setGrades((prev) => {
          const existing = prev.find((g) => g.student_id === studentId);
          if (existing) {
            const finalScore = Math.round((score * 0.4 + (existing.quiz_score || 80) * 0.3 + (existing.exam_score || 80) * 0.3) * 10) / 10;
            const letter = finalScore >= 88 ? 'A' : finalScore >= 78 ? 'B' : finalScore >= 70 ? 'C' : 'D';
            const updated = prev.map((g) =>
              g.student_id === studentId
                ? {
                    ...g,
                    assignment_score: score,
                    final_score: finalScore,
                    letter_grade: letter as any,
                    status_ketuntasan: finalScore >= 75 ? ('Tuntas' as const) : ('Belum Tuntas' as const),
                    updated_at: new Date().toISOString(),
                  }
                : g
            );
            saveState({ grades: updated });
            return updated;
          }
          return prev;
        });
      }
    }
  };

  const addQuiz = (quizData: Omit<Quiz, 'id' | 'created_at'>) => {
    const newQuiz: Quiz = {
      ...quizData,
      id: `quiz-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setQuizzes((prev) => {
      const updated = [newQuiz, ...prev];
      saveState({ quizzes: updated });
      return updated;
    });
  };

  const deleteQuiz = (id: string) => {
    setQuizzes((prev) => {
      const updated = prev.filter((q) => q.id !== id);
      saveState({ quizzes: updated });
      return updated;
    });
  };

  const submitQuizAttempt = (attemptData: Omit<QuizAttempt, 'id' | 'completed_at'>): number => {
    const targetQuiz = quizzes.find((q) => q.id === attemptData.quiz_id);
    let calculatedScore = 0;
    const totalPoints = targetQuiz?.questions?.reduce((sum, q) => sum + q.points, 0) || 100;

    if (targetQuiz?.questions) {
      targetQuiz.questions.forEach((q) => {
        const studentAns = attemptData.answers[q.id];
        if (studentAns && studentAns === q.correct_answer) {
          calculatedScore += q.points;
        }
      });
    }

    const finalScore = Math.round((calculatedScore / (totalPoints || 100)) * 100);
    const isPassed = finalScore >= (targetQuiz?.pass_score || 75);

    const newAttempt = {
      ...attemptData,
      id: `att-${Date.now()}`,
      completed_at: new Date().toISOString(),
      score: finalScore,
      max_score: 100,
      is_passed: isPassed,
      status: 'graded',
    };

    setQuizAttempts((prev) => {
      const updated = [newAttempt, ...prev];
      saveState({ quizAttempts: updated });
      return updated;
    });

    // Update grade record quiz score
    setGrades((prev) => {
      const updated = prev.map((g) => {
        if (g.student_id === attemptData.student_id) {
          const finalVal = Math.round((g.assignment_score * 0.4 + finalScore * 0.3 + g.exam_score * 0.3) * 10) / 10;
          return {
            ...g,
            quiz_score: finalScore,
            final_score: finalVal,
            letter_grade: (finalVal >= 88 ? 'A' : finalVal >= 78 ? 'B' : finalVal >= 70 ? 'C' : 'D') as 'A' | 'B' | 'C' | 'D' | 'E',
            status_ketuntasan: finalVal >= 75 ? ('Tuntas' as const) : ('Belum Tuntas' as const),
            updated_at: new Date().toISOString(),
          };
        }
        return g;
      });
      saveState({ grades: updated });
      return updated;
    });

    return finalScore;
  };

  const updateGrade = (id: string, updates: Partial<GradeRecord>) => {
    setGrades((prev) => {
      const updated = prev.map((g) => (g.id === id ? { ...g, ...updates, updated_at: new Date().toISOString() } : g));
      saveState({ grades: updated });
      return updated;
    });
  };

  const addAnnouncement = (annData: Omit<Announcement, 'id' | 'created_at'>) => {
    const newAnn: Announcement = {
      ...annData,
      id: `ann-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setAnnouncements((prev) => {
      const updated = [newAnn, ...prev];
      saveState({ announcements: updated });
      return updated;
    });
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => {
      const updated = prev.filter((a) => a.id !== id);
      saveState({ announcements: updated });
      return updated;
    });
  };

  const toggleMaterialCompleted = (materialId: string, studentId: string) => {
    setLearningProgress((prev) => {
      const exists = prev.find((lp) => lp.material_id === materialId && lp.student_id === studentId);
      let updated: LearningProgress[];
      if (exists) {
        updated = prev.map((lp) =>
          lp.id === exists.id
            ? { ...lp, is_completed: !lp.is_completed, completed_at: !lp.is_completed ? new Date().toISOString() : undefined }
            : lp
        );
      } else {
        updated = [
          ...prev,
          {
            id: `lp-${Date.now()}`,
            material_id: materialId,
            student_id: studentId,
            is_completed: true,
            completed_at: new Date().toISOString(),
          },
        ];
      }
      saveState({ learningProgress: updated });
      return updated;
    });
  };

  const resetAllData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSchoolSettings(INITIAL_SCHOOL_SETTINGS);
    setUsers(INITIAL_USERS);
    setClasses(INITIAL_CLASSES);
    setSubjects(INITIAL_SUBJECTS);
    setMaterials(INITIAL_MATERIALS);
    setAssignments(INITIAL_ASSIGNMENTS);
    setSubmissions(INITIAL_SUBMISSIONS);
    setQuizzes(INITIAL_QUIZZES);
    setQuizAttempts(INITIAL_QUIZ_ATTEMPTS);
    setGrades(INITIAL_GRADES);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setCurrentUser(INITIAL_USERS[0]);
  };

  return (
    <LmsContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchRole,
        schoolSettings,
        updateSchoolSettings,
        users,
        addUser,
        updateUser,
        deleteUser,
        departments,
        classes,
        addClass,
        updateClass,
        deleteClass,
        subjects,
        addSubject,
        updateSubject,
        deleteSubject,
        materials,
        addMaterial,
        updateMaterial,
        deleteMaterial,
        assignments,
        addAssignment,
        updateAssignment,
        deleteAssignment,
        submissions,
        submitAssignment,
        gradeSubmission,
        quizzes,
        addQuiz,
        deleteQuiz,
        quizAttempts,
        submitQuizAttempt,
        grades,
        updateGrade,
        announcements,
        addAnnouncement,
        deleteAnnouncement,
        learningProgress,
        toggleMaterialCompleted,
        resetAllData,
      }}
    >
      {children}
    </LmsContext.Provider>
  );
}

export function useLms() {
  const context = useContext(LmsContext);
  if (!context) {
    throw new Error('useLms must be used within an LmsProvider');
  }
  return context;
}
