import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { BarChart3, Activity, Thermometer, Weight, Ruler, Pill } from 'lucide-react';
import { RootState } from '../store';
import { ChartType, ChartDataPoint } from '../types';

const MedicalChartsPage: React.FC = () => {
  const { records } = useSelector((state: RootState) => state.medical);
  const [selectedChart, setSelectedChart] = useState<ChartType>('temperature');

  const chartOptions = [
    { value: 'temperature', label: 'Temperature', icon: Thermometer, color: '#F59E0B' },
    { value: 'weight', label: 'Weight', icon: Weight, color: '#10B981' },
    { value: 'height', label: 'Height', icon: Ruler, color: '#3B82F6' },
    { value: 'medicines', label: 'Medicines', icon: Pill, color: '#8B5CF6' },
  ] as const;

  const chartData = useMemo(() => {
    const getChartData = (type: ChartType): ChartDataPoint[] => {
      return records
        .map((record) => {
          const date = new Date(record.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          });

          switch (type) {
            case 'temperature':
              return { date, value: record.temperature, label: `${record.temperature}°F` };
            case 'weight':
              return { date, value: record.weight, label: `${record.weight} kg` };
            case 'height':
              return { date, value: record.height, label: `${record.height} cm` };
            case 'medicines':
              return { date, value: record.medicines.length, label: `${record.medicines.length} medicines` };
            default:
              return { date, value: 0, label: '0' };
          }
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    };

    return getChartData(selectedChart);
  }, [records, selectedChart]);

  const pieChartData = useMemo(() => {
    if (selectedChart === 'medicines') {
      const medicineCount: { [key: string]: number } = {};
      records.forEach((record) => {
        record.medicines.forEach((medicine) => {
          medicineCount[medicine.name] = (medicineCount[medicine.name] || 0) + 1;
        });
      });

      return Object.entries(medicineCount)
        .map(([name, count]) => ({ name, value: count }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 8); // Show top 8 medicines
    }

    // For other metrics, create ranges
    const ranges: { [key: string]: number } = {};
    
    chartData.forEach((point) => {
      let range = '';
      if (selectedChart === 'temperature') {
        if (point.value < 98) range = 'Below Normal';
        else if (point.value <= 99) range = 'Normal';
        else range = 'Above Normal';
      } else if (selectedChart === 'weight') {
        if (point.value < 60) range = 'Light';
        else if (point.value <= 80) range = 'Normal';
        else range = 'Heavy';
      } else if (selectedChart === 'height') {
        if (point.value < 150) range = 'Short';
        else if (point.value <= 180) range = 'Average';
        else range = 'Tall';
      }
      
      ranges[range] = (ranges[range] || 0) + 1;
    });

    return Object.entries(ranges).map(([name, value]) => ({ name, value }));
  }, [chartData, selectedChart, chartOptions]);

  const COLORS = ['#10B981', '#F59E0B', '#3B82F6', '#EF4444', '#8B5CF6', '#F97316', '#84CC16', '#06B6D4'];

  const selectedOption = chartOptions.find(opt => opt.value === selectedChart);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-pink-500" />
          Medical Data Analytics
        </h1>

        {/* Chart Type Selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {chartOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                onClick={() => setSelectedChart(option.value)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  selectedChart === option.value
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-green-300 hover:bg-green-50'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <Icon className="h-6 w-6" style={{ color: option.color }} />
                  <span className="font-medium text-sm">{option.label}</span>
                </div>
              </button>
            );
          })}
        </div>

        {records.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">No medical data available</p>
            <p className="text-gray-500 text-sm mt-2">
              Charts will appear once you have medical records
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Line Chart */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5" style={{ color: selectedOption?.color }} />
                {selectedOption?.label} Trends
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#6B7280" 
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#6B7280" 
                      fontSize={12}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        fontSize: '14px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={selectedOption?.color || '#10B981'}
                      strokeWidth={3}
                      dot={{ fill: selectedOption?.color || '#10B981', r: 6 }}
                      activeDot={{ r: 8, stroke: selectedOption?.color || '#10B981', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5" style={{ color: selectedOption?.color }} />
                {selectedOption?.label} Distribution
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#6B7280" 
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#6B7280" 
                      fontSize={12}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        fontSize: '14px',
                      }}
                    />
                    <Bar 
                      dataKey="value" 
                      fill={selectedOption?.color || '#10B981'}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="bg-gray-50 rounded-xl p-6 lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5" style={{ color: selectedOption?.color }} />
                {selectedOption?.label} Categories
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        fontSize: '14px',
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalChartsPage;