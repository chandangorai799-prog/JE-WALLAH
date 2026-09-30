import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  BookOpen,
  Star,
  Clock,
  Zap,
  Cog,
  Layers,
  Cpu,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { Branch, Course, Purchase, Semester } from '../types/index.ts';

interface ExploreCoursesProps {
  courses: Course[];
  purchases: Purchase[];
  onSelectCourse: (course: Course) => void;
  onOpenLearning: (courseId: string) => void;
  initialBranch?: Branch | null;
  initialSemester?: Semester | null;
}

export const ExploreCourses: React.FC<ExploreCoursesProps> = ({
  courses,
  purchases,
  onSelectCourse,
  onOpenLearning,
  initialBranch = null,
  initialSemester = null,
}) => {
  const [selectedBranch, setSelectedBranch] = useState<string>(initialBranch || 'All');
  const [selectedSemester, setSelectedSemester] = useState<string>(initialSemester || 'All');
  const [searchQuery, setSearchQuery] = useState('');

  const branchesList = ['All', 'Electrical', 'Mechanical', 'Metallurgy', 'Computer Science'];
  const semestersList = ['All', '1st Semester', '3rd Semester', '5th Semester'];

  const purchasedCourseIds = useMemo(() => {
    return new Set(purchases.filter((p) => p.accessStatus === 'active').map((p) => p.courseId));
  }, [purchases]);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      // Branch filter
      if (selectedBranch !== 'All' && course.branch !== selectedBranch) return false;
      // Semester filter
      if (selectedSemester !== 'All' && course.semester !== selectedSemester) return false;
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = course.title.toLowerCase().includes(query);
        const matchesBranch = course.branch.toLowerCase().includes(query);
        const matchesSem = course.semester.toLowerCase().includes(query);
        const matchesSubjects = course.subjects.some((s) => s.name.toLowerCase().includes(query));
        if (!matchesTitle && !matchesBranch && !matchesSem && !matchesSubjects) return false;
      }
      return true;
    });
  }, [courses, selectedBranch, selectedSemester, searchQuery]);

  const getBranchIcon = (branch: Branch) => {
    switch (branch) {
      case 'Electrical':
        return <Zap className="w-3.5 h-3.5 text-amber-500" />;
      case 'Mechanical':
        return <Cog className="w-3.5 h-3.5 text-blue-500" />;
      case 'Metallurgy':
        return <Layers className="w-3.5 h-3.5 text-emerald-500" />;
      case 'Computer Science':
        return <Cpu className="w-3.5 h-3.5 text-cyan-500" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header & Subtitle */}
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-cyan-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Semester-Wise Batches • Exact Prescribed Syllabus</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-['Plus_Jakarta_Sans']">
          Diploma Engineering Course Catalog
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-3xl">
          Browse all 12 comprehensive semester study batches. Pricing is per entire batch (1st Sem: ₹99, 3rd Sem: ₹299, 5th Sem: ₹249), covering all subjects, handwritten notes, video derivations, and PYQ banks.
        </p>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white dark:bg-[#111A2E] rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by batch name, subject (e.g. Maths, SOM, C Programming, Transformer)..."
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500"
          />
        </div>

        {/* Branch Filter Tabs */}
        <div>
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
            Filter by Engineering Branch:
          </label>
          <div className="flex flex-wrap gap-2">
            {branchesList.map((branch) => (
              <button
                key={branch}
                onClick={() => setSelectedBranch(branch)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedBranch === branch
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {branch}
              </button>
            ))}
          </div>
        </div>

        {/* Semester Filter Tabs */}
        <div>
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
            Filter by Semester:
          </label>
          <div className="flex flex-wrap gap-2">
            {semestersList.map((sem) => {
              const priceTag =
                sem === '1st Semester' ? ' (₹99)' : sem === '3rd Semester' ? ' (₹299)' : sem === '5th Semester' ? ' (₹249)' : '';
              return (
                <button
                  key={sem}
                  onClick={() => setSelectedSemester(sem)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedSemester === sem
                      ? 'bg-cyan-600 text-white shadow-md shadow-cyan-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {sem}
                  {priceTag && <span className="font-extrabold opacity-90">{priceTag}</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results Count Bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <span>
          Showing <strong>{filteredCourses.length}</strong> available diploma study batches
        </span>
        {(selectedBranch !== 'All' || selectedSemester !== 'All' || searchQuery) && (
          <button
            onClick={() => {
              setSelectedBranch('All');
              setSelectedSemester('All');
              setSearchQuery('');
            }}
            className="text-blue-600 dark:text-cyan-400 hover:underline font-semibold cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* 12 Course Grid */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#111A2E] rounded-2xl border border-slate-200 dark:border-slate-800 p-8 space-y-4">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Batches Found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Try adjusting your search keywords or switching filters to view all available branches.
          </p>
          <button
            onClick={() => {
              setSelectedBranch('All');
              setSelectedSemester('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredCourses.map((c) => {
            const isEnrolled = purchasedCourseIds.has(c.courseId);

            return (
              <div
                key={c.courseId}
                className="bg-white dark:bg-[#111A2E] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Thumbnail & Badges */}
                  <div className="relative aspect-video overflow-hidden bg-slate-900">
                    <img
                      src={c.thumbnail}
                      alt={c.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-600 text-white shadow-xs flex items-center gap-1">
                        {getBranchIcon(c.branch)}
                        <span>{c.branch}</span>
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-900/80 text-white backdrop-blur-xs">
                        {c.semester}
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-xs text-amber-400 text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{c.rating}</span>
                    </div>

                    {isEnrolled && (
                      <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-md flex items-center gap-1 uppercase tracking-wide">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Enrolled</span>
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-5 space-y-3.5">
                    <div>
                      <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-2 font-['Plus_Jakarta_Sans'] group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                        {c.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {c.description}
                      </p>
                    </div>

                    {/* Subjects included */}
                    <div className="space-y-1.5">
                      <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                        Subjects Included:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {c.subjects.map((sub) => (
                          <span
                            key={sub.id}
                            className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                          >
                            {sub.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Access & Duration details */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <span>Duration: {c.validity}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>Access: Full Video Lectures, PDF Notes & PYQs</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Price & Buy Button */}
                <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800 mt-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Batch Fee</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-black text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
                        ₹{c.price}
                      </span>
                      <span className="text-xs text-slate-400 line-through">
                        ₹{c.originalPrice}
                      </span>
                    </div>
                  </div>

                  {isEnrolled ? (
                    <button
                      onClick={() => onOpenLearning(c.courseId)}
                      className="px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-500/20 cursor-pointer transition-all flex items-center gap-1.5"
                    >
                      <GraduationCap className="w-4 h-4" />
                      <span>Start Learning</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onSelectCourse(c)}
                      className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/20 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Buy Now &rarr;
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
