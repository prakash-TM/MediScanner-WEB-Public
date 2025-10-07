import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { MedicalRecord, ApiResponse } from "../types";
import { apiClient } from "../services/api";

interface MedicalState {
  records: MedicalRecord[];
  loading: boolean;
  error: string | null;
  uploadLoading: boolean;
}

const initialState: MedicalState = {
  records: [],
  loading: false,
  error: null,
  uploadLoading: false,
};

export const fetchMedicalData = createAsyncThunk(
  "medical/fetchMedicalData",
  async (params: { skip?: number; limit?: number; page?: number } = {}) => {
    const { skip = 0, limit = 10 } = params;
    const response = await apiClient.get<ApiResponse<MedicalRecord[]>>(
      `/medicine/usersMedicalData?skip=${skip}&limit=${limit}`
    );
    return response.data.data;
  }
);

export const uploadMedicalPrescription = createAsyncThunk(
  "medical/uploadMedicalPrescription",
  async (payload: {
    prescriptionUrls: string[];
    fileDetails: Array<{ url: string; fileId: string; name: string }>;
  }) => {
    const response = await apiClient.post<ApiResponse<{ message: string }>>(
      "/medicine/uploadMedicalPrescription",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  }
);

const medicalSlice = createSlice({
  name: "medical",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMedicalData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchMedicalData.fulfilled,
        (state, action: PayloadAction<MedicalRecord[]>) => {
          state.loading = false;
          state.records = action.payload;
        }
      )
      .addCase(fetchMedicalData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch medical data";
      })
      .addCase(uploadMedicalPrescription.pending, (state) => {
        state.uploadLoading = true;
        state.error = null;
      })
      .addCase(uploadMedicalPrescription.fulfilled, (state) => {
        state.uploadLoading = false;
      })
      .addCase(uploadMedicalPrescription.rejected, (state, action) => {
        state.uploadLoading = false;
        state.error = action.error.message || "Failed to upload prescription";
      });
  },
});

export const { clearError } = medicalSlice.actions;
export default medicalSlice.reducer;
