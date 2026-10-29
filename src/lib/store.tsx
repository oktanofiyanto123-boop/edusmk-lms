'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
import { isSupabaseConfigured } from './supabase/client';
import * as db from './supabase/supabase-service';

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
  changePassword: (studentId: string, newPassword: string) => void;
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
  isLoading: boolean;
  isOnline: boolean;
}

const LmsContext = createContext<LmsContextType | null>(null);

const STORAGE_KEY = 'edusmk_lms_v1_store';

export function LmsProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(false);

  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USERS[0]);
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

  // ── LOAD DATA ─────────────────────────────────────────────────────────────
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);

      if (isSupabaseConfigured()) {
        // ✅ SUPABASE MODE: Data dari database terpusat
        try {
          const [
            dbUsers,
            dbClasses,
            dbSubjects,
            dbMaterials,
            dbAssignments,
            dbSubmissions,
            dbQuizzes,
            dbAttempts,
            dbGrades,
            dbAnnouncements,
            dbProgress,
            dbSettings,
          ] = await Promise.all([
            db.fetchProfiles(),
            db.fetchClassrooms(),
            db.fetchSubjects(),
            db.fetchMaterials(),
            db.fetchAssignments(),
            db.fetchSubmissions(),
            db.fetchQuizzes(),
            db.fetchQuizAttempts(),
            db.fetchGrades(),
            db.fetchAnnouncements(),
            db.fetchLearningProgress(),
            db.fetchSchoolSettings(),
          ]);

          if (dbUsers.length > 0) {
            setUsers(dbUsers);
            const savedUserId = typeof window !== 'undefined' ? localStorage.getItem('edusmk_current_user_id') : null;
            if (savedUserId) {
              const matched = dbUsers.find((u) => u.id === savedUserId);
              if (matched) setCurrentUser(matched);
            }
          }
          if (dbClasses.length > 0) setClasses(dbClasses);
          if (dbSubjects.length > 0) setSubjects(dbSubjects);
          if (dbMaterials.length > 0) setMaterials(dbMaterials);
          if (dbAssignments.length > 0) setAssignments(dbAssignments);
          if (dbSubmissions.length > 0) setSubmissions(dbSubmissions);
          if (dbQuizzes.length > 0) setQuizzes(dbQuizzes);
          if (dbAttempts.length > 0) setQuizAttempts(dbAttempts);
          if (dbGrades.length > 0) setGrades(dbGrades);
          if (dbAnnouncements.length > 0) setAnnouncements(dbAnnouncements);
          if (dbProgress.length > 0) setLearningProgress(dbProgress);
          if (dbSettings) setSchoolSettings(dbSettings);

          setIsOnline(true);
        } catch (err) {
          console.error('Gagal memuat data dari Supabase, fallback ke localStorage:', err);
          loadFromLocalStorage();
        }
      } else {
        // ⚠️ OFFLINE MODE: Data dari localStorage (per-device)
        loadFromLocalStorage();
      }

      setIsLoading(false);
    }

    function loadFromLocalStorage() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.users && Array.isArray(parsed.users)) {
            const sanitizedUsers: UserProfile[] = parsed.users.map((u: UserProfile) => {
              if (u.role === 'siswa') {
                return { ...u, password: u.password || 'siswa123', email: undefined };
              }
              return { ...u, password: u.password || (u.role === 'admin' ? 'admin123' : 'guru123') };
            });
            setUsers(sanitizedUsers);
          }
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
        // ignore parse errors
      }
    }

    loadData();
  }, []);

  const handleSetCurrentUser = (user: UserProfile) => {
    setCurrentUser(user);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('edusmk_current_user_id', user.id);
      }
    } catch {
      // ignore
    }
  };

  // ── SAVE HELPERS ──────────────────────────────────────────────────────────
  const saveState = useCallback((updatedState: Record<string, any>) => {
    if (isOnline) return; // Supabase mode: jangan pakai localStorage
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
      // ignore storage quota
    }
  }, [isOnline, users, classes, subjects, materials, assignments, submissions, quizzes, quizAttempts, grades, announcements, learningProgress, schoolSettings, currentUser.id]);

  // ── AUTH ──────────────────────────────────────────────────────────────────
  const switchRole = (role: UserRole) => {
    const targetUser = users.find((u) => u.role === role) || INITIAL_USERS.find((u) => u.role === role);
    if (targetUser) {
      setCurrentUser(targetUser);
      if (!isOnline) saveState({ currentUserId: targetUser.id });
    }
  };

  // ── SCHOOL SETTINGS ────────────────────────────────────────────────────────
  const updateSchoolSettings = (newSettings: Partial<SchoolSettings>) => {
    setSchoolSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      if (isOnline) {
        db.upsertSchoolSettings(updated).catch(console.error);
      } else {
        saveState({ schoolSettings: updated });
      }
      return updated;
    });
  };

  // ── USERS ─────────────────────────────────────────────────────────────────
  const addUser = (userData: Omit<UserProfile, 'id' | 'created_at'>) => {
    if (isOnline) {
      db.insertProfile(userData).then((newUser) => {
        setUsers((prev) => [newUser, ...prev]);
      }).catch(console.error);
    } else {
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
    }
  };

  const updateUser = (id: string, updates: Partial<UserProfile>) => {
    setUsers((prev) => {
      const updated = prev.map((u) => (u.id === id ? { ...u, ...updates, updated_at: new Date().toISOString() } : u));
      if (isOnline) {
        db.updateProfile(id, updates).catch(console.error);
      } else {
        saveState({ users: updated });
      }
      if (currentUser.id === id) setCurrentUser((curr) => ({ ...curr, ...updates }));
      return updated;
    });
  };

  const deleteUser = (id: string) => {
    setUsers((prev) => {
      const updated = prev.filter((u) => u.id !== id);
      if (isOnline) {
        db.deleteProfile(id).catch(console.error);
      } else {
        saveState({ users: updated });
      }
      return updated;
    });
  };

  const changePassword = (studentId: string, newPassword: string) => {
    setUsers((prev) => {
      const updated = prev.map((u) =>
        u.id === studentId ? { ...u, password: newPassword, updated_at: new Date().toISOString() } : u
      );
      if (isOnline) {
        db.changeProfilePassword(studentId, newPassword).catch(console.error);
      } else {
        saveState({ users: updated });
      }
      return updated;
    });
  };

  // ── CLASSES ───────────────────────────────────────────────────────────────
  const addClass = (clsData: Omit<ClassRoom, 'id'>) => {
    if (isOnline) {
      db.insertClassroom(clsData).then((newClass) => {
        setClasses((prev) => [...prev, newClass]);
      }).catch(console.error);
    } else {
      const newClass: ClassRoom = { ...clsData, id: `class-${Date.now()}` };
      setClasses((prev) => {
        const updated = [...prev, newClass];
        saveState({ classes: updated });
        return updated;
      });
    }
  };

  const updateClass = (id: string, updates: Partial<ClassRoom>) => {
    setClasses((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, ...updates } : c));
      if (isOnline) {
        db.updateClassroom(id, updates).catch(console.error);
      } else {
        saveState({ classes: updated });
      }
      return updated;
    });
  };

  const deleteClass = (id: string) => {
    setClasses((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      if (isOnline) {
        db.deleteClassroom(id).catch(console.error);
      } else {
        saveState({ classes: updated });
      }
      return updated;
    });
  };

  // ── SUBJECTS ──────────────────────────────────────────────────────────────
  const addSubject = (subData: Omit<Subject, 'id'>) => {
    if (isOnline) {
      db.insertSubject(subData).then((newSub) => {
        setSubjects((prev) => [...prev, newSub]);
      }).catch(console.error);
    } else {
      const newSub: Subject = { ...subData, id: `sub-${Date.now()}` };
      setSubjects((prev) => {
        const updated = [...prev, newSub];
        saveState({ subjects: updated });
        return updated;
      });
    }
  };

  const updateSubject = (id: string, updates: Partial<Subject>) => {
    setSubjects((prev) => {
      const updated = prev.map((s) => (s.id === id ? { ...s, ...updates } : s));
      if (isOnline) {
        db.updateSubject(id, updates).catch(console.error);
      } else {
        saveState({ subjects: updated });
      }
      return updated;
    });
  };

  const deleteSubject = (id: string) => {
    setSubjects((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      if (isOnline) {
        db.deleteSubject(id).catch(console.error);
      } else {
        saveState({ subjects: updated });
      }
      return updated;
    });
  };

  // ── MATERIALS ─────────────────────────────────────────────────────────────
  const addMaterial = (matData: Omit<TeachingMaterial, 'id' | 'created_at' | 'updated_at'>) => {
    if (isOnline) {
      db.insertMaterial(matData).then((newMat) => {
        setMaterials((prev) => [newMat, ...prev]);
      }).catch(console.error);
    } else {
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
    }
  };

  const updateMaterial = (id: string, updates: Partial<TeachingMaterial>) => {
    setMaterials((prev) => {
      const updated = prev.map((m) => (m.id === id ? { ...m, ...updates, updated_at: new Date().toISOString() } : m));
      if (isOnline) {
        db.updateMaterial(id, updates).catch(console.error);
      } else {
        saveState({ materials: updated });
      }
      return updated;
    });
  };

  const deleteMaterial = (id: string) => {
    setMaterials((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      if (isOnline) {
        db.deleteMaterial(id).catch(console.error);
      } else {
        saveState({ materials: updated });
      }
      return updated;
    });
  };

  // ── ASSIGNMENTS ───────────────────────────────────────────────────────────
  const addAssignment = (asgData: Omit<Assignment, 'id' | 'created_at'>) => {
    if (isOnline) {
      db.insertAssignment(asgData).then((newAsg) => {
        setAssignments((prev) => [newAsg, ...prev]);
      }).catch(console.error);
    } else {
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
    }
  };

  const updateAssignment = (id: string, updates: Partial<Assignment>) => {
    setAssignments((prev) => {
      const updated = prev.map((a) => (a.id === id ? { ...a, ...updates } : a));
      if (isOnline) {
        db.updateAssignment(id, updates).catch(console.error);
      } else {
        saveState({ assignments: updated });
      }
      return updated;
    });
  };

  const deleteAssignment = (id: string) => {
    setAssignments((prev) => {
      const updated = prev.filter((a) => a.id !== id);
      if (isOnline) {
        db.deleteAssignment(id).catch(console.error);
      } else {
        saveState({ assignments: updated });
      }
      return updated;
    });
  };

  // ── SUBMISSIONS ───────────────────────────────────────────────────────────
  const submitAssignment = (submData: Omit<Submission, 'id' | 'submitted_at' | 'status'>) => {
    if (isOnline) {
      db.upsertSubmission(submData).then((newSubm) => {
        setSubmissions((prev) => {
          const existingIdx = prev.findIndex(
            (s) => s.assignment_id === submData.assignment_id && s.student_id === submData.student_id
          );
          if (existingIdx >= 0) {
            const updated = [...prev];
            updated[existingIdx] = newSubm;
            return updated;
          }
          return [newSubm, ...prev];
        });
        // increment submitted_count
        setAssignments((prev) =>
          prev.map((a) =>
            a.id === submData.assignment_id
              ? { ...a, submitted_count: (a.submitted_count || 0) + 1 }
              : a
          )
        );
      }).catch(console.error);
    } else {
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
      setAssignments((prev) =>
        prev.map((a) =>
          a.id === submData.assignment_id
            ? { ...a, submitted_count: (a.submitted_count || 0) + 1 }
            : a
        )
      );
    }
  };

  const gradeSubmission = (id: string, score: number, feedback: string, gradedBy: string) => {
    let studentId = '';
    setSubmissions((prev) => {
      const updated = prev.map((s) => {
        if (s.id === id) {
          studentId = s.student_id;
          return { ...s, score, feedback, graded_at: new Date().toISOString(), graded_by: gradedBy, status: 'sudah_dinilai' as const };
        }
        return s;
      });
      if (isOnline) {
        db.gradeSubmissionDb(id, score, feedback, gradedBy).catch(console.error);
      } else {
        saveState({ submissions: updated });
      }
      return updated;
    });

    if (studentId) {
      setGrades((prev) => {
        const existing = prev.find((g) => g.student_id === studentId);
        if (existing) {
          const finalScore = Math.round((score * 0.4 + (existing.quiz_score || 80) * 0.3 + (existing.exam_score || 80) * 0.3) * 10) / 10;
          const letter = finalScore >= 88 ? 'A' : finalScore >= 78 ? 'B' : finalScore >= 70 ? 'C' : 'D';
          const updated = prev.map((g) =>
            g.student_id === studentId
              ? { ...g, assignment_score: score, final_score: finalScore, letter_grade: letter as any, status_ketuntasan: finalScore >= 75 ? ('Tuntas' as const) : ('Belum Tuntas' as const), updated_at: new Date().toISOString() }
              : g
          );
          if (isOnline) {
            db.upsertGrade({ student_id: studentId, subject_id: existing.subject_id, assignment_score: score, final_score: finalScore }).catch(console.error);
          } else {
            saveState({ grades: updated });
          }
          return updated;
        }
        return prev;
      });
    }
  };

  // ── QUIZZES ───────────────────────────────────────────────────────────────
  const addQuiz = (quizData: Omit<Quiz, 'id' | 'created_at'>) => {
    if (isOnline) {
      db.insertQuiz(quizData).then((newQuiz) => {
        setQuizzes((prev) => [newQuiz, ...prev]);
      }).catch(console.error);
    } else {
      const newQuiz: Quiz = { ...quizData, id: `quiz-${Date.now()}`, created_at: new Date().toISOString() };
      setQuizzes((prev) => {
        const updated = [newQuiz, ...prev];
        saveState({ quizzes: updated });
        return updated;
      });
    }
  };

  const deleteQuiz = (id: string) => {
    setQuizzes((prev) => {
      const updated = prev.filter((q) => q.id !== id);
      if (isOnline) {
        db.deleteQuiz(id).catch(console.error);
      } else {
        saveState({ quizzes: updated });
      }
      return updated;
    });
  };

  // ── QUIZ ATTEMPTS ─────────────────────────────────────────────────────────
  const submitQuizAttempt = (attemptData: Omit<QuizAttempt, 'id' | 'completed_at'>): number => {
    const targetQuiz = quizzes.find((q) => q.id === attemptData.quiz_id);
    let calculatedScore = 0;
    const totalPoints = targetQuiz?.questions?.reduce((sum, q) => sum + q.points, 0) || 100;

    if (targetQuiz?.questions) {
      targetQuiz.questions.forEach((q) => {
        const studentAns = attemptData.answers[q.id];
        if (studentAns && studentAns === q.correct_answer) calculatedScore += q.points;
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
      if (isOnline) {
        db.insertQuizAttempt(newAttempt as any).catch(console.error);
      } else {
        saveState({ quizAttempts: updated });
      }
      return updated;
    });

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
      if (isOnline) {
        const gradeRecord = updated.find((g) => g.student_id === attemptData.student_id);
        if (gradeRecord) {
          db.upsertGrade({ student_id: gradeRecord.student_id, subject_id: gradeRecord.subject_id, quiz_score: finalScore, final_score: gradeRecord.final_score }).catch(console.error);
        }
      } else {
        saveState({ grades: updated });
      }
      return updated;
    });

    return finalScore;
  };

  // ── GRADES ────────────────────────────────────────────────────────────────
  const updateGrade = (id: string, updates: Partial<GradeRecord>) => {
    setGrades((prev) => {
      const updated = prev.map((g) => (g.id === id ? { ...g, ...updates, updated_at: new Date().toISOString() } : g));
      if (isOnline) {
        const grade = updated.find((g) => g.id === id);
        if (grade) db.upsertGrade({ student_id: grade.student_id, subject_id: grade.subject_id, ...updates }).catch(console.error);
      } else {
        saveState({ grades: updated });
      }
      return updated;
    });
  };

  // ── ANNOUNCEMENTS ─────────────────────────────────────────────────────────
  const addAnnouncement = (annData: Omit<Announcement, 'id' | 'created_at'>) => {
    if (isOnline) {
      db.insertAnnouncement(annData).then((newAnn) => {
        setAnnouncements((prev) => [newAnn, ...prev]);
      }).catch(console.error);
    } else {
      const newAnn: Announcement = { ...annData, id: `ann-${Date.now()}`, created_at: new Date().toISOString() };
      setAnnouncements((prev) => {
        const updated = [newAnn, ...prev];
        saveState({ announcements: updated });
        return updated;
      });
    }
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => {
      const updated = prev.filter((a) => a.id !== id);
      if (isOnline) {
        db.deleteAnnouncement(id).catch(console.error);
      } else {
        saveState({ announcements: updated });
      }
      return updated;
    });
  };

  // ── LEARNING PROGRESS ─────────────────────────────────────────────────────
  const toggleMaterialCompleted = (materialId: string, studentId: string) => {
    setLearningProgress((prev) => {
      const exists = prev.find((lp) => lp.material_id === materialId && lp.student_id === studentId);
      let updated: LearningProgress[];
      const newCompleted = exists ? !exists.is_completed : true;

      if (exists) {
        updated = prev.map((lp) =>
          lp.id === exists.id
            ? { ...lp, is_completed: newCompleted, completed_at: newCompleted ? new Date().toISOString() : undefined }
            : lp
        );
      } else {
        updated = [
          ...prev,
          { id: `lp-${Date.now()}`, material_id: materialId, student_id: studentId, is_completed: true, completed_at: new Date().toISOString() },
        ];
      }

      if (isOnline) {
        db.upsertLearningProgress(studentId, materialId, newCompleted).catch(console.error);
      } else {
        saveState({ learningProgress: updated });
      }
      return updated;
    });
  };

  // ── RESET ─────────────────────────────────────────────────────────────────
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
        setCurrentUser: handleSetCurrentUser,
        switchRole,
        schoolSettings,
        updateSchoolSettings,
        users,
        addUser,
        updateUser,
        deleteUser,
        changePassword,
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
        isLoading,
        isOnline,
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
