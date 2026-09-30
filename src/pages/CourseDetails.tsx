import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  BookOpen,
  Star,
  FileText,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Download,
  Share2,
} from 'lucide-react';
import { Course, Purchase } from '../types/index.ts';

interface CourseDetailsProps {
  course: Course;
  purchases: Purchase[];
  onBack: () => void;
  onEnroll: (course: Course) => void;
  onOpenLearning: (courseId: string) => void;
}

export const CourseDetails: React.FC<CourseDetailsProps> = ({
  course,
  purchases,
  onBack,
  onEnroll,
  onOpenLearning,
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    course.subjects[0]?.id || ''
  );

  const isEnrolled = purchases.some(
    (p) => p.courseId === course.courseId && p.accessStatus === 'active'
  );

  const currentSubjectLessons = course.lessons.filter(
    (l) => l.subjectId === selectedSubjectId || !l.subjectId
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Course Catalog</span>
      </button>

      {/* Main Grid: Left Curriculum, Right Sticky Buy Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-8">
          {/* Header Badges & Title */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-blue-600 text-white">
                {course.branch}
              </span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-slate-900 dark:bg-slate-800 text-white">
                {course.semester}
              </span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-500" />
                <span>{course.rating} Rating ({course.enrolledCount}+ Students)</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight font-['Plus_Jakarta_Sans']">
              {course.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {course.description}
            </p>
          </div>

          {/* Highlights */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 font-['Plus_Jakarta_Sans']">
              <Sparkles className="w-4 h-4 text-cyan-500" />
              <span>What You Will Get Inside This Batch</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 dark:text-slate-300">
              {course.highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Subjects Syllabus Tabs */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
              Subjects Included in this Semester Batch
            </h3>

            {/* Subject Selector Tabs */}
            <div className="flex flex-wrap gap-2">
              {course.subjects.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubjectId(sub.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    selectedSubjectId === sub.id
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'bg-white dark:bg-[#111A2E] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-blue-400'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{sub.name}</span>
                  <span className="text-[10px] opacity-80">({sub.code})</span>
                </button>
              ))}
            </div>

            {/* Selected Subject Details & Lessons List */}
            {course.subjects
              .filter((s) => s.id === selectedSubjectId)
              .map((sub) => (
                <div
                  key={sub.id}
                  className="bg-white dark:bg-[#111A2E] rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div>
                      <h4 className="font-bold text-base text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
                        {sub.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Course Code: {sub.code} • {sub.credits} Academic Credits • {sub.topicsCount} Key Topics
                      </p>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-cyan-300">
                      Standard Polytechnic Board Syllabus
                    </span>
                  </div>

                  {sub.description && (
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      <strong>Module Overview:</strong> {sub.description}
                    </p>
                  )}

                  {/* Lessons in this subject */}
                  <div className="space-y-3 pt-2">
                    <h5 className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Lectures & High-Yield Notes:
                    </h5>

                    {currentSubjectLessons.length === 0 ? (
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 text-xs text-slate-500 text-center">
                        Course content will be available soon as uploaded by the department head.
                      </div>
                    ) : (
                      currentSubjectLessons.map((l) => (
                        <div
                          key={l.id}
                          className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                              <PlayCircle className="w-4 h-4" />
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-xs text-slate-900 dark:text-white">
                                  {l.title}
                                </span>
                                {l.isFreePreview && (
                                  <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold px-1.5 py-0.2 rounded">
                                    Free Preview
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                Duration: {l.duration} • Includes PDF notes & formula sheet
                              </p>
                            </div>
                          </div>

                          {isEnrolled ? (
                            <button
                              onClick={() => onOpenLearning(course.courseId)}
                              className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shrink-0 cursor-pointer"
                            >
                              Watch Lecture
                            </button>
                          ) : l.isFreePreview ? (
                            <button
                              onClick={() => onEnroll(course)}
                              className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-blue-600 dark:text-cyan-400 border border-blue-500 dark:border-cyan-500 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors shrink-0 cursor-pointer"
                            >
                              Preview Lecture
                            </button>
                          ) : (
                            <span className="text-[11px] font-semibold text-slate-400 shrink-0">
                              Locked (Enrolled Only)
                            </span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Right Sticky Card */}
        <div className="lg:col-span-4 lg:sticky lg:top-24">
          <div className="bg-white dark:bg-[#111A2E] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 p-6">
            {/* Thumbnail */}
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xs">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                <span className="text-xs font-bold text-white bg-blue-600/90 px-2.5 py-1 rounded-md">
                  {course.branch} Engineering
                </span>
              </div>
            </div>

            {/* Price section */}
            <div className="space-y-2 border-b border-slate-100 dark:border-slate-800 pb-5">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
                  ₹{course.price}
                </span>
                <span className="text-base text-slate-400 line-through">
                  ₹{course.originalPrice}
                </span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 ml-auto bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                  85%+ Discount
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Single payment covers all {course.subjects.length} semester subjects until exam completion.
              </p>
            </div>

            {/* Batch Inclusions */}
            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Full recorded lectures for all {course.subjects.length} subjects</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Downloadable handwritten PDF notes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Previous 5-year board question papers with solutions</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>24/7 Doubt solving via JE AI Assistant</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500 shrink-0" />
                <span>Validity: {course.validity}</span>
              </div>
            </div>

            {/* Main Action Button */}
            {isEnrolled ? (
              <button
                onClick={() => onOpenLearning(course.courseId)}
                className="w-full py-4 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 cursor-pointer transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>You Own This Batch • Open Course</span>
              </button>
            ) : (
              <button
                onClick={() => onEnroll(course)}
                className="w-full py-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] cursor-pointer transition-all flex items-center justify-center gap-2"
              >
                <span>Buy Now (₹{course.price})</span>
              </button>
            )}

            <div className="pt-2 text-center">
              <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Secure SSL checkout • Instant access granted</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
