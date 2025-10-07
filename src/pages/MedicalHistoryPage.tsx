import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ChevronDown, ChevronRight, Clock, Pill, Activity } from 'lucide-react'; // Calendar, User, Building,
import { RootState, AppDispatch } from '../store';
import { fetchMedicalData } from '../store/medicalSlice';
// import { MedicalRecord } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

const MedicalHistoryPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { records, loading, error } = useSelector((state: RootState) => state.medical);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  useEffect(() => {
    const skip = (page - 1) * limit;
    dispatch(fetchMedicalData({ skip, limit, page }));
  }, [dispatch, page, limit]);

  const toggleRowExpansion = (recordId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(recordId)) {
      newExpanded.delete(recordId);
    } else {
      newExpanded.add(recordId);
    }
    setExpandedRows(newExpanded);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Sort records by serialNo (ascending). If serialNo is missing, push to the end.
  const sortedRecords = [...records].sort((a, b) => {
    const sa = a.serialNo ?? Number.POSITIVE_INFINITY;
    const sb = b.serialNo ?? Number.POSITIVE_INFINITY;
    return sa - sb;
  });

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8">
        <LoadingSpinner message="Loading medical history..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="text-center text-red-600">
          <p className="text-lg font-medium">Error loading medical data</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Activity className="h-6 w-6 text-pink-500" />
          Medical History
        </h1>

        {records.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">No medical records found</p>
            <p className="text-gray-500 text-sm mt-2">
              Start by uploading your first medical prescription
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">S.No</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700 min-w-[130px]">Date</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Age</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Weight</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Height</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Temperature</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Hospital</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700 min-w-[180px]">Doctor</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Picture</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700 w-[160px]">Details</th>
                </tr>
              </thead>
              <tbody>
                {sortedRecords.map((record) => (
                  <React.Fragment key={record._id}>
                    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 text-gray-800 align-middle">{record.serialNo}</td>
                      <td className="py-4 px-4 text-gray-800 align-middle whitespace-nowrap">
                        {/* <Calendar className="h-4 w-4 text-gray-500" /> */}
                        {formatDate(record.date)}
                      </td>
                      <td className="py-4 px-4 text-gray-800 align-middle">{record.age} yrs</td>
                      <td className="py-4 px-4 text-gray-800 align-middle">{record.weight} kg</td>
                      <td className="py-4 px-4 text-gray-800 align-middle">{record.height} cm</td>
                      <td className="py-4 px-4 text-gray-800 align-middle">{record.temperature}°F</td>
                      <td className="py-4 px-4 text-gray-800 align-middle">
                        {/* <Building className="h-4 w-4 text-gray-500" /> */}
                        {record.hospitalName}
                      </td>
                      <td className="py-4 px-4 text-gray-800 align-middle whitespace-nowrap min-w-[180px]">
                        {/* <User className="h-4 w-4 text-gray-500" /> */}
                        {record.doctorName}
                      </td>
                      <td className="py-4 px-4 text-gray-800 align-middle whitespace-nowrap">
                        {record.imagekit_url ? (
                          <a
                            href={record.imagekit_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block"
                          >
                            <img
                              src={record.imagekit_url}
                              alt="Prescription"
                              className="h-10 w-12 object-cover rounded-md border"
                            />
                          </a>
                        ) : (
                          <span className="text-gray-500 italic text-sm">No image</span>
                        )}
                      </td>
                      <td className="py-4 px-4 align-middle w-[160px]">
                        <button
                          onClick={() => toggleRowExpansion(record._id)}
                          className="flex items-center gap-1 text-green-600 hover:text-green-700 font-medium"
                        >
                          {expandedRows.has(record._id) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                          {expandedRows.has(record._id) ? 'Hide' : 'Show'} Medicines
                        </button>
                      </td>
                    </tr>
                    
                    {expandedRows.has(record._id) && (
                      <tr>
                        <td colSpan={10} className="px-4 pb-6">
                          <div className="bg-green-50 rounded-lg p-4 ml-8">
                            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                              <Pill className="h-4 w-4 text-green-600" />
                              Medicine Details
                            </h4>
                            
                            {record.medicines.length > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {record.medicines.map((medicine) => (
                                  <div
                                    key={medicine.id}
                                    className="bg-white rounded-lg p-4 border border-green-200"
                                  >
                                    <h5 className="font-medium text-gray-800 mb-2">
                                      {medicine.name}
                                    </h5>
                                    <div className="space-y-1 text-sm text-gray-600">
                                      <p className="flex items-center gap-2">
                                        <span className="font-medium">Quantity:</span>
                                        {medicine.quantity}
                                      </p>
                                      <p className="flex items-center gap-2">
                                        <Clock className="h-3 w-3" />
                                        <span className="capitalize">{medicine.timeOfIntake}</span>
                                      </p>
                                      <p className="flex items-center gap-2">
                                        <span className="font-medium">Timing:</span>
                                        <span className="capitalize">
                                          {medicine.beforeOrAfterMeals} meals
                                        </span>
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-600 italic">No medicines prescribed</p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1 bg-gray-100 rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    className="px-3 py-1 bg-gray-100 rounded"
                  >
                    Next
                  </button>
                  <span className="text-sm text-gray-600">Page {page}</span>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Per page:</label>
                  <select
                    value={limit}
                    onChange={(e) => setLimit(Number(e.target.value))}
                    className="border rounded px-2 py-1"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                </div>
              </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalHistoryPage;