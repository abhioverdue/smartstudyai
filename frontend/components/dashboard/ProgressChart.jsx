import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ProgressChart = ({ data }) => {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="week" 
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: '#64748b' }}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: '#64748b' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="quizzes_completed" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#3b82f6' }}
            name="Quizzes Completed"
          />
          <Line 
            type="monotone" 
            dataKey="average_score" 
            stroke="#10b981" 
            strokeWidth={2}
            dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#10b981' }}
            name="Average Score (%)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart;