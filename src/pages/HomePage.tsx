import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { User, Phone, Calendar, Upload, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { RootState, AppDispatch } from '../store';
import { uploadMedicalPrescription } from '../store/medicalSlice';
import { validateMedicalFile, formatFileSize } from '../utils/fileValidation';
import LoadingSpinner from '../components/LoadingSpinner';
import { uploadToImageKit } from '../utils/imageKit';

const HomePage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { uploadLoading } = useSelector((state: RootState) => state.medical);
  const dispatch = useDispatch<AppDispatch>();
  
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState<string>('');
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadError('');
    setUploadSuccess(false);

    const validFiles: File[] = [];
    let hasError = false;

    for (const file of files) {
      const validation = validateMedicalFile(file);
      if (validation.isValid) {
        validFiles.push(file);
      } else {
        setUploadError(validation.error || 'Invalid file');
        hasError = true;
        break;
      }
    }

    if (!hasError) {
      setSelectedFiles(validFiles);
    }
  };

  const handleUpload = async () => {
  if (selectedFiles.length === 0) {
    setUploadError('Please select files to upload');
    return;
  }

  // setIsUploading(true);
  setUploadError('');

  try {
    // Upload all files to ImageKit
    const uploadPromises = selectedFiles.map((file) =>
      uploadToImageKit(
        file,
        '/imagekit/auth' // e.g., '/api/imagekit/auth'
      )
    );

    const imageKitResults = await Promise.all(uploadPromises);
    
    // Extract URLs from ImageKit response
    const imageUrls = imageKitResults.map((result: any) => result.url);
    
    // Send URLs to your backend
    const payload = {
      prescriptionUrls: imageUrls,
      fileDetails: imageKitResults.map((result: any) => ({
        url: result.url,
        fileId: result.fileId,
        name: result.name,
      })),
    };

    await dispatch(uploadMedicalPrescription(payload)).unwrap();
    
    setUploadSuccess(true);
    setSelectedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  } catch (error) {
    console.error('Upload error:', error);
    setUploadError('Failed to upload files. Please try again.');
  } finally {
    // setIsUploading(false);
  }
};

  const clearSelection = () => {
    setSelectedFiles([]);
    setUploadError('');
    setUploadSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-pink-100 to-green-100 rounded-xl p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600">
          Manage your medical records and track your health journey.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Profile Card */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <User className="h-5 w-5 text-pink-500" />
            Profile Information
          </h2>
          
          <div className="space-y-4">
            {user?.photo && (
              <div className="flex justify-center mb-6">
                <img
                  src={user.photo}
                  alt="Profile"
                  className="h-24 w-24 rounded-full object-cover border-4 border-green-200"
                />
              </div>
            )}
            
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <User className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium text-gray-800">{user?.name}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Age</p>
                  <p className="font-medium text-gray-800">{user?.age} years</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Mobile Number</p>
                  <p className="font-medium text-gray-800">{user?.mobileNumber}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Medical Prescriptions */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <Upload className="h-5 w-5 text-green-500" />
            Upload Medical Prescriptions
          </h2>

          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-green-400 transition-colors">
              <div className="text-center">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600 mb-2">
                  Click to select or drag & drop medical prescription images
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Supported formats: PNG, JPG, JPEG (Max 2MB each)
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".png,.jpg,.jpeg"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-md transition-colors"
                >
                  Select Files
                </button>
              </div>
            </div>

            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium text-gray-700">Selected Files:</h3>
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">{file.name}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                    <ImageIcon className="h-4 w-4 text-gray-400" />
                  </div>
                ))}
                
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={handleUpload}
                    disabled={uploadLoading}
                    className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {uploadLoading ? (
                      <LoadingSpinner size="sm" message="" />
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        Upload Files
                      </>
                    )}
                  </button>
                  <button
                    onClick={clearSelection}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}

            {uploadError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <p className="text-red-700">{uploadError}</p>
              </div>
            )}

            {uploadSuccess && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 font-medium">
                  Files uploaded successfully!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;