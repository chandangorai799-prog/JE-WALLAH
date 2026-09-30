import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { AIAssistantWidget } from './components/AIAssistantWidget.tsx';
import { MobileBottomNav } from './components/MobileBottomNav.tsx';

import { Home } from './pages/Home.tsx';
import { ExploreCourses } from './pages/ExploreCourses.tsx';
import { CourseDetails } from './pages/CourseDetails.tsx';
import { Login } from './pages/Login.tsx';
import { Register } from './pages/Register.tsx';
import { ForgotPassword } from './pages/ForgotPassword.tsx';
import { Checkout } from './pages/Checkout.tsx';
import { PaymentSuccess } from './pages/PaymentSuccess.tsx';
import { PaymentFailed } from './pages/PaymentFailed.tsx';
import { MyLearning } from './pages/MyLearning.tsx';
import { CoursePlayer } from './pages/CoursePlayer.tsx';
import { StudentProfile } from './pages/StudentProfile.tsx';
import { AIAssistantPage } from './pages/AIAssistantPage.tsx';
import { AdminDashboard } from './pages/AdminDashboard.tsx';
import { LegalPage } from './pages/LegalPage.tsx';

import { Course, Order, Purchase, Branch, Semester } from './types/index.ts';
import { getCourses, getUserPurchases } from './firebase/services.ts';

const MainApp: React.FC = () => {
  const { currentUser } = useAuth();

  const [currentTab, setCurrentTab] = useState<string>('home');
  const [courses, setCourses] = useState<Course[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  // Selected course for details or checkout
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<Branch | null>(null);
  const [selectedSemesterFilter, setSelectedSemesterFilter] = useState<Semester | null>(null);

  // Active player course & lesson
  const [playerCourseId, setPlayerCourseId] = useState<string | null>(null);
  const [playerLessonId, setPlayerLessonId] = useState<string | undefined>(undefined);

  // Last successful order or failed reason
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [failureMessage, setFailureMessage] = useState<string>('');

  // Pending checkout redirect if user needed to log in first
  const [pendingCheckoutCourse, setPendingCheckoutCourse] = useState<Course | null>(null);
  const [authRedirectNotice, setAuthRedirectNotice] = useState<string | undefined>(undefined);

  // Load courses
  const fetchAllCourses = async () => {
    try {
      const data = await getCourses();
      setCourses(data);
    } catch (e) {
      console.error('Failed to load courses in App:', e);
    } finally {
      setLoadingCourses(false);
    }
  };

  useEffect(() => {
    fetchAllCourses();
  }, []);

  // Load purchases for active user
  useEffect(() => {
    async function loadPurchases() {
      if (currentUser) {
        try {
          const userPurchases = await getUserPurchases(currentUser.uid);
          setPurchases(userPurchases);
        } catch (e) {
          console.error('Failed to fetch user purchases:', e);
        }
      } else {
        setPurchases([]);
      }
    }
    loadPurchases();
  }, [currentUser]);

  // Handle course enrollment / checkout click
  const handleInitiateEnroll = (course: Course) => {
    // 1. Check if user already owns this batch
    const alreadyPurchased = purchases.some(
      (p) => p.courseId === course.courseId && p.accessStatus === 'active'
    );
    if (alreadyPurchased) {
      setPlayerCourseId(course.courseId);
      setCurrentTab('course-player');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // 2. Check if logged in
    if (!currentUser) {
      setPendingCheckoutCourse(course);
      setAuthRedirectNotice(`Please login to purchase "${course.title}". You will be redirected straight to checkout.`);
      setCurrentTab('login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // 3. Open Checkout
    setSelectedCourse(course);
    setCurrentTab('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // After successful login
  const handleLoginSuccess = () => {
    if (pendingCheckoutCourse) {
      setSelectedCourse(pendingCheckoutCourse);
      setPendingCheckoutCourse(null);
      setAuthRedirectNotice(undefined);
      setCurrentTab('checkout');
    } else {
      setCurrentTab('mylearning');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegisterSuccess = () => {
    if (pendingCheckoutCourse) {
      setSelectedCourse(pendingCheckoutCourse);
      setPendingCheckoutCourse(null);
      setCurrentTab('checkout');
    } else {
      setCurrentTab('mylearning');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open course player from anywhere
  const handleOpenLearning = (courseId: string, lessonId?: string) => {
    setPlayerCourseId(courseId);
    setPlayerLessonId(lessonId);
    setCurrentTab('course-player');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentPlayingCourse = courses.find((c) => c.courseId === playerCourseId);

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7FB] dark:bg-[#070C16] text-slate-900 dark:text-slate-100 font-['Inter'] transition-colors antialiased pb-20 md:pb-0 w-full max-w-full overflow-x-hidden">
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        {currentTab === 'home' && (
          <Home
            courses={courses}
            onNavigate={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectCourse={(course) => {
              setSelectedCourse(course);
              setCurrentTab('course-details');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectBranch={(branch) => {
              setSelectedBranchFilter(branch);
              setSelectedSemesterFilter(null);
              setCurrentTab('courses');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectSemester={(sem) => {
              setSelectedSemesterFilter(sem);
              setSelectedBranchFilter(null);
              setCurrentTab('courses');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentTab === 'courses' && (
          <ExploreCourses
            courses={courses}
            purchases={purchases}
            initialBranch={selectedBranchFilter}
            initialSemester={selectedSemesterFilter}
            onSelectCourse={(course) => {
              setSelectedCourse(course);
              setCurrentTab('course-details');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenLearning={handleOpenLearning}
          />
        )}

        {currentTab === 'course-details' && selectedCourse && (
          <CourseDetails
            course={selectedCourse}
            purchases={purchases}
            onBack={() => {
              setCurrentTab('courses');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onEnroll={handleInitiateEnroll}
            onOpenLearning={handleOpenLearning}
          />
        )}

        {currentTab === 'checkout' && selectedCourse && (
          <Checkout
            course={selectedCourse}
            onBack={() => {
              setCurrentTab('course-details');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSuccess={async (order) => {
              setCompletedOrder(order);
              // Refresh purchases
              if (currentUser) {
                const refreshed = await getUserPurchases(currentUser.uid);
                setPurchases(refreshed);
              }
              setCurrentTab('payment-success');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onFailure={(msg) => {
              setFailureMessage(msg);
              setCurrentTab('payment-failed');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentTab === 'payment-success' && completedOrder && (
          <PaymentSuccess
            order={completedOrder}
            onGoToLearning={() => {
              setCurrentTab('mylearning');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentTab === 'payment-failed' && (
          <PaymentFailed
            errorMessage={failureMessage}
            onRetry={() => {
              setCurrentTab('checkout');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onBackToCourses={() => {
              setCurrentTab('courses');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAssistant={() => {
              setCurrentTab('ai-assistant');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentTab === 'mylearning' && (
          currentUser ? (
            <MyLearning
              courses={courses}
              onOpenCoursePlayer={handleOpenLearning}
              onExploreCourses={() => {
                setCurrentTab('courses');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenAIAssistant={() => {
                setCurrentTab('ai-assistant');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenSettings={() => {
                setCurrentTab('profile');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          ) : (
            <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
              <h2 className="text-xl font-bold">Please Log In</h2>
              <p className="text-xs text-slate-500">
                You must be logged in to view your purchased batches and learning progress.
              </p>
              <button
                onClick={() => setCurrentTab('login')}
                className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
              >
                Go to Login
              </button>
            </div>
          )
        )}

        {currentTab === 'course-player' && (
          currentPlayingCourse ? (
            <CoursePlayer
              course={currentPlayingCourse}
              initialLessonId={playerLessonId}
              onBack={() => {
                setCurrentTab('mylearning');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onAskAIAssistant={(question) => {
                setCurrentTab('ai-assistant');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          ) : (
            <div className="text-center py-16">
              <p className="text-sm text-slate-500">Select a course to view lessons.</p>
              <button
                onClick={() => setCurrentTab('courses')}
                className="mt-2 text-xs font-bold text-blue-600 hover:underline"
              >
                Go to Catalog
              </button>
            </div>
          )
        )}

        {currentTab === 'profile' && <StudentProfile />}

        {currentTab === 'ai-assistant' && <AIAssistantPage />}

        {currentTab === 'admin' && (
          <AdminDashboard
            courses={courses}
            onRefreshCourses={fetchAllCourses}
          />
        )}

        {currentTab === 'login' && (
          <Login
            onSuccess={handleLoginSuccess}
            onNavigateToRegister={() => {
              setCurrentTab('register');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToForgotPassword={() => {
              setCurrentTab('forgot-password');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            redirectNotice={authRedirectNotice}
          />
        )}

        {currentTab === 'register' && (
          <Register
            onSuccess={handleRegisterSuccess}
            onNavigateToLogin={() => {
              setCurrentTab('login');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentTab === 'forgot-password' && (
          <ForgotPassword
            onBackToLogin={() => {
              setCurrentTab('login');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentTab.startsWith('legal-') && (
          <LegalPage
            pageType={
              currentTab === 'legal-about'
                ? 'about'
                : currentTab === 'legal-privacy'
                ? 'privacy'
                : currentTab === 'legal-terms'
                ? 'terms'
                : currentTab === 'legal-refund'
                ? 'refund'
                : 'contact'
            }
          />
        )}
      </main>

      <Footer
        onNavigate={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Floating 24/7 AI Assistant Widget */}
      <AIAssistantWidget />

      {/* Mobile-First Bottom Thumb Navigation */}
      <MobileBottomNav
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}
