import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  PlayCircle,
  FileText,
  Download,
  Sparkles,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Volume2,
  Clock,
  Share2,
} from 'lucide-react';
import { Course, Lesson, StudentProgress } from '../types/index.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { getStudentProgress, saveStudentProgress } from '../firebase/services.ts';

interface CoursePlayerProps {
  course: Course;
  initialLessonId?: string;
  onBack: () => void;
  onAskAIAssistant: (contextQuestion: string) => void;
}

export const CoursePlayer: React.FC<CoursePlayerProps> = ({
  course,
  initialLessonId,
  onBack,
  onAskAIAssistant,
}) => {
  const { currentUser } = useAuth();

  const [activeLesson, setActiveLesson] = useState<Lesson | null>(() => {
    if (initialLessonId) {
      const found = course.lessons.find((l) => l.id === initialLessonId);
      if (found) return found;
    }
    return course.lessons[0] || null;
  });

  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'video' | 'notes' | 'resources'>('video');
  const [playbackSpeed, setPlaybackSpeed] = useState('1');

  // Load progress
  useEffect(() => {
    async function loadProg() {
      if (!currentUser) return;
      const prog = await getStudentProgress(currentUser.uid, course.courseId);
      if (prog) {
        setCompletedLessonIds(prog.completedLessons || []);
        if (!initialLessonId && prog.lastLessonId) {
          const last = course.lessons.find((l) => l.id === prog.lastLessonId);
          if (last) setActiveLesson(last);
        }
      }
    }
    loadProg();
  }, [currentUser, course.courseId]);

  const toggleLessonCompletion = async (lessonId: string) => {
    if (!currentUser) return;
    const isCompleted = completedLessonIds.includes(lessonId);
    const updated = isCompleted
      ? completedLessonIds.filter((id) => id !== lessonId)
      : [...completedLessonIds, lessonId];

    setCompletedLessonIds(updated);

    const progressObj: StudentProgress = {
      progressId: `${currentUser.uid}_${course.courseId}`,
      uid: currentUser.uid,
      courseId: course.courseId,
      completedLessons: updated,
      lastLessonId: lessonId,
      updatedAt: new Date().toISOString(),
    };

    await saveStudentProgress(progressObj);
  };

  const handleSelectLesson = async (lesson: Lesson) => {
    setActiveLesson(lesson);
    if (currentUser) {
      const progressObj: StudentProgress = {
        progressId: `${currentUser.uid}_${course.courseId}`,
        uid: currentUser.uid,
        courseId: course.courseId,
        completedLessons: completedLessonIds,
        lastLessonId: lesson.id,
        updatedAt: new Date().toISOString(),
      };
      await saveStudentProgress(progressObj);
    }
  };

  // If no lessons exist in this course batch:
  if (!course.lessons || course.lessons.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 dark:hover:text-cyan-400 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="bg-white dark:bg-[#111A2E] rounded-3xl p-10 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {course.title}
          </h2>
          <p className="text-sm font-semibold text-blue-600 dark:text-cyan-400">
            Course content will be available soon.
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            The department administrator is currently recording and uploading high-definition video lectures and chapter notes for this semester batch.
          </p>
        </div>
      </div>
    );
  }

  const isCurrentLessonDone = activeLesson ? completedLessonIds.includes(activeLesson.id) : false;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6">
      {/* Top Breadcrumb & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Learning</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {completedLessonIds.length} of {course.lessons.length} completed
          </span>
          <div className="w-28 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-cyan-400"
              style={{
                width: `${Math.round((completedLessonIds.length / course.lessons.length) * 100)}%`,
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Grid: Player Left (8 cols) + Curriculum Right (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Video Player & Notes Area */}
        <div className="lg:col-span-8 space-y-6">
          {/* Video Container */}
          <div className="relative rounded-2xl overflow-hidden bg-black aspect-video shadow-2xl border border-slate-800">
            {activeLesson?.videoUrl ? (
              <iframe
                src={`${activeLesson.videoUrl}?autoplay=0&rel=0`}
                title={activeLesson.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              /* High-tech engineering player placeholder */
              <div className="w-full h-full flex flex-col items-center justify-center text-white bg-gradient-to-br from-slate-900 via-[#0B1220] to-blue-950 p-6 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-blue-600/30 border border-cyan-400/40 text-cyan-300 flex items-center justify-center animate-pulse">
                  <PlayCircle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg">{activeLesson?.title}</h3>
                  <p className="text-xs text-cyan-300 mt-1 font-mono">
                    JE WALLAH HD STREAM • 1080p 60fps
                  </p>
                </div>
                <p className="text-xs text-slate-400 max-w-md">
                  This video lecture is fully recorded and indexed for semester exam preparation. Use the tabs below to read complete handwritten notes and formula sheets.
                </p>
              </div>
            )}
          </div>

          {/* Player Action Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="space-y-0.5">
              <h2 className="text-base font-bold text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
                {activeLesson?.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                <span>Duration: {activeLesson?.duration}</span>
                <span>•</span>
                <span>Course: {course.branch} ({course.semester})</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Playback speed selector */}
              <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mr-2">
                <span className="text-[10px] font-bold">Speed:</span>
                <select
                  value={playbackSpeed}
                  onChange={(e) => setPlaybackSpeed(e.target.value)}
                  className="bg-slate-100 dark:bg-slate-800 rounded px-1.5 py-0.5 text-xs font-semibold text-slate-800 dark:text-slate-200"
                >
                  <option value="1">1.0x</option>
                  <option value="1.25">1.25x</option>
                  <option value="1.5">1.5x</option>
                  <option value="2">2.0x</option>
                </select>
              </div>

              {/* Mark Completed Button */}
              {activeLesson && (
                <button
                  onClick={() => toggleLessonCompletion(activeLesson.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isCurrentLessonDone
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-500'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isCurrentLessonDone ? 'Completed' : 'Mark as Completed'}</span>
                </button>
              )}

              {/* Ask JE AI About This Lecture */}
              <button
                onClick={() =>
                  onAskAIAssistant(
                    `Explain key exam points and numerical formulas for this lecture: "${activeLesson?.title}" in simple Hinglish.`
                  )
                }
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-100 cursor-pointer transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
                <span>Ask AI About Lecture</span>
              </button>
            </div>
          </div>

          {/* Notes & Resources Tabs */}
          <div className="bg-white dark:bg-[#111A2E] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex border-b border-slate-100 dark:border-slate-800 gap-4 text-xs font-bold">
              <button
                onClick={() => setActiveTab('video')}
                className={`pb-3 border-b-2 cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'video'
                    ? 'border-blue-600 text-blue-600 dark:border-cyan-400 dark:text-cyan-400'
                    : 'border-transparent text-slate-500'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Lecture Notes & Formulae</span>
              </button>
              <button
                onClick={() => setActiveTab('resources')}
                className={`pb-3 border-b-2 cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'resources'
                    ? 'border-blue-600 text-blue-600 dark:border-cyan-400 dark:text-cyan-400'
                    : 'border-transparent text-slate-500'
                }`}
              >
                <Download className="w-4 h-4" />
                <span>Downloadable PDFs & PYQs ({activeLesson?.resources?.length || 0})</span>
              </button>
            </div>

            {activeTab === 'video' && (
              <div className="space-y-3 pt-2 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                {activeLesson?.notesTitle && (
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {activeLesson.notesTitle}
                  </h4>
                )}
                {activeLesson?.notesContent ? (
                  <div className="whitespace-pre-wrap font-sans p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
                    {activeLesson.notesContent}
                  </div>
                ) : (
                  <p className="text-slate-400 italic">
                    Full handwritten lecture notes and derivations are included in the downloadable PDFs below.
                  </p>
                )}
              </div>
            )}

            {activeTab === 'resources' && (
              <div className="space-y-3 pt-2">
                {(!activeLesson?.resources || activeLesson.resources.length === 0) ? (
                  <p className="text-xs text-slate-400 italic">
                    All study notes are compiled in the batch main handbook.
                  </p>
                ) : (
                  activeLesson.resources.map((res, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">
                            {res.title}
                          </p>
                          <p className="text-[10px] text-slate-400 uppercase font-semibold">
                            Format: {res.type.toUpperCase()} • High-Resolution Vector PDF
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => alert(`Downloading ${res.title}... Verified PDF document.`)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Curriculum Column (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-[#111A2E] rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
                Course Curriculum
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {course.subjects.length} Subjects • {course.lessons.length} Lectures
              </p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-cyan-400">
              {course.semester}
            </span>
          </div>

          {/* Lessons list */}
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {course.lessons.map((lesson, idx) => {
              const isActive = activeLesson?.id === lesson.id;
              const isDone = completedLessonIds.includes(lesson.id);

              return (
                <div
                  key={lesson.id}
                  onClick={() => handleSelectLesson(lesson)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                    isActive
                      ? 'border-blue-600 dark:border-cyan-500 bg-blue-50/60 dark:bg-blue-950/40 ring-1 ring-blue-500/20'
                      : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLessonCompletion(lesson.id);
                    }}
                    className="mt-0.5 shrink-0 cursor-pointer text-slate-400 hover:text-emerald-500"
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600"></div>
                    )}
                  </button>

                  <div className="flex-1 space-y-1">
                    <p
                      className={`text-xs font-bold leading-tight ${
                        isActive
                          ? 'text-blue-600 dark:text-cyan-400'
                          : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {lesson.title}
                    </p>
                    <p className="text-[10px] text-slate-400 flex items-center gap-2">
                      <span>{lesson.duration}</span>
                      {lesson.isFreePreview && (
                        <span className="text-emerald-600 font-bold">Preview</span>
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
