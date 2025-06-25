import { useState, useEffect } from 'react';
import { BookOpen, Clock, Trophy, Target } from 'lucide-react';
import Card from '@/components/ui/Card';
import ProgressChart from './ProgressChart';
import QuickStats from './QuickStats';
import { progressAPI } from '@/lib/api';
import { formatDuration } from '@/lib/utils';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await progressAPI.getDashboard();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <Card.Content>
                <div className="h-20 bg-secondary-200 rounded"></div>
              </Card.Content>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-12">
        <p className="text-secondary-600">No dashboard data available</p>
      </div>
    );
  }

  const stats = [
    {
      title: 'Quizzes Completed',
      value: dashboardData.total_quizzes,
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Study Time',
      value: formatDuration(dashboardData.total_study_time),
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Average Score',
      value: `${dashboardData.average_score}%`,
      icon: Trophy,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Subjects',
      value: dashboardData.subjects_studied,
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-secondary-900">
          Welcome back! 👋
        </h1>
        <p className="text-secondary-600 mt-2">
          Here's your learning progress overview
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <Card.Content>
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-secondary-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-secondary-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            </Card.Content>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold text-secondary-900">
              Weekly Progress
            </h3>
          </Card.Header>
          <Card.Content>
            <ProgressChart data={dashboardData.weekly_progress} />
          </Card.Content>
        </Card>

        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold text-secondary-900">
              Subject Progress
            </h3>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              {dashboardData.progress_by_subject.map((subject) => (
                <div key={subject.subject} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-secondary-700">
                      {subject.subject}
                    </span>
                    <span className="text-secondary-600">
                      {Math.round(subject.mastery_level * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-secondary-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${subject.mastery_level * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold text-secondary-900">
            Recent Activity
          </h3>
        </Card.Header>
        <Card.Content>
          {dashboardData.recent_activity.length > 0 ? (
            <div className="space-y-4">
              {dashboardData.recent_activity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="ml-4">
                      <p className="font-medium text-secondary-900">
                        Completed "{activity.title}"
                      </p>
                      <p className="text-sm text-secondary-600">
                        {activity.subject} • Score: {activity.score}%
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-secondary-500">
                    {new Date(activity.date).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-secondary-600 text-center py-8">
              No recent activity. Start a quiz to see your progress!
            </p>
          )}
        </Card.Content>
      </Card>
    </div>
  );
};

export default Dashboard;