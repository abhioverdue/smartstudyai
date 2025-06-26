// frontend/pages/dashboard/index.js
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../../components/layout/Layout';
import ProgressChart from '../../components/dashboard/ProgressChart';
import QuickStats from '../../components/dashboard/QuickStats';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { api } from '../../lib/api';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/progress/dashboard');
      setDashboardData(response.data);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (session?.accessToken) {
      fetchDashboardData();
    }
  }, [session]);

  // Refresh data
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  // Quick action handlers
  const handleStartQuiz = () => {
    router.push('/quiz');
  };

  const handleChatWithTutor = () => {
    router.push('/tutor');
  };

  const handleExploreSubjects = () => {
    router.push('/subjects');
  };

  // Show loading state
  if (status === 'loading' || loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Show error state
  if (error) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Card className="max-w-md w-full mx-4 p-6 text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={handleRefresh} className="w-full">
              Try Again
            </Button>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard - SmartStudy AI+</title>
        <meta name="description" content="Your personalized learning dashboard with AI-powered insights" />
      </Head>

      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome back, {session?.user?.name || 'Student'}!
                </h1>
                <p className="mt-2 text-gray-600">
                  Here's your learning progress and personalized recommendations.
                </p>
              </div>
              <div className="mt-4 sm:mt-0 flex space-x-3">
                <Button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <svg
                    className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Refresh</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          {dashboardData && (
            <div className="mb-8">
              <QuickStats data={dashboardData} />
            </div>
          )}

          {/* Quick Actions */}
          <div className="mb-8">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Button
                  onClick={handleStartQuiz}
                  className="flex items-center justify-center space-x-2 p-4 h-auto"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Start New Quiz</span>
                </Button>
                
                <Button
                  onClick={handleChatWithTutor}
                  variant="outline"
                  className="flex items-center justify-center space-x-2 p-4 h-auto"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>Chat with AI Tutor</span>
                </Button>
                
                <Button
                  onClick={handleExploreSubjects}
                  variant="outline"
                  className="flex items-center justify-center space-x-2 p-4 h-auto"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span>Explore Subjects</span>
                </Button>
              </div>
            </Card>
          </div>

          {/* Main Dashboard Content */}
          {dashboardData && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Charts and Progress */}
              <div className="lg:col-span-2 space-y-8">
                <ProgressChart data={dashboardData} />
                
                {/* Progress by Subject */}
                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Progress by Subject</h2>
                  <div className="space-y-4">
                    {dashboardData.progress_by_subject.map((subject, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-900 capitalize">
                              {subject.subject}
                            </span>
                            <span className="text-sm text-gray-500">
                              {Math.round(subject.mastery_level * 100)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${subject.mastery_level * 100}%` }}
                            ></div>
                          </div>
                          <div className="mt-1 text-xs text-gray-500">
                            {subject.study_time} minutes studied
                          </div>
                        </div>
                      </div>
                    ))}
                    {dashboardData.progress_by_subject.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <p>No subject progress yet</p>
                        <p className="text-sm">Start taking quizzes to see your progress!</p>
                      </div>
                    )}
                  </div>
                </Card>
              </div>

              {/* Right Column - Recent Activity */}
              <div className="space-y-8">
                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
                  <div className="space-y-4">
                    {dashboardData.recent_activity.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            {activity.subject} • Score: {Math.round(activity.score)}%
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(activity.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    {dashboardData.recent_activity.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p>No recent activity</p>
                        <p className="text-sm">Start learning to see your activity here!</p>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Recommendations */}
                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Recommendations</h2>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h3 className="text-sm font-medium text-blue-900 mb-2">
                        📚 Practice More
                      </h3>
                      <p className="text-sm text-blue-800">
                        Try more quizzes in your weaker subjects to improve your scores.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h3 className="text-sm font-medium text-green-900 mb-2">
                        🎯 Stay Consistent
                      </h3>
                      <p className="text-sm text-green-800">
                        Keep up your daily study routine for better retention.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h3 className="text-sm font-medium text-purple-900 mb-2">
                        🤖 AI Tutor Help
                      </h3>
                      <p className="text-sm text-purple-800">
                        Ask our AI tutor for help with challenging concepts.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
}
