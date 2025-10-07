export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  mobileNumber: string;
  photo?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message?: string;
}

export interface MedicalRecord {
  _id: string;
  serialNo: number;
  age: number;
  weight: number;
  height: number;
  temperature: number;
  hospitalName: string;
  doctorName: string;
  date: string;
  medicines: Medicine[];
  imagekit_url: string
  reportImages?: string[];
  createdAt:string;
  user_id:string;
}

export interface Medicine {
  id: string;
  name: string;
  quantity: number;
  timeOfIntake: "morning" | "afternoon" | "evening" | "night" | string;
  beforeOrAfterMeals: "before" | "after" | string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface CreateAccountData {
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export type ChartType = "temperature" | "weight" | "height" | "medicines";

export interface ImageKitUploadResponse {
  url: string;
  fileId: string;
  name: string;
  thumbnailUrl: string;
}