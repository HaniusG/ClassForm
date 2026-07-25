import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import api from "../../api/client";
import type {
  CreateStudentRequest,
  Student,
  UpdateStudentRequest,
} from "../../types/student";

interface StudentsState {
  students: Student[];
  selectedStudent: Student | null;
  loading: boolean;
  error: string | null;
}

const initialState: StudentsState = {
  students: [],
  selectedStudent: null,
  loading: false,
  error: null,
};

export interface UpdateStudentPayload {
  id: string;
  data: UpdateStudentRequest;
}

export const getAllStudents = createAsyncThunk<Student[], void>(
  "students/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/students");
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Failed to get students");
    }
  },
);

export const getStudent = createAsyncThunk<Student, string>(
  "students/getOne",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/students/${id}`);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Failed to get the student");
    }
  },
);

export const createStudent = createAsyncThunk<Student, CreateStudentRequest>(
  "students/create",
  async (student, { rejectWithValue }) => {
    try {
      const response = await api.post("/students", student);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Failed to create student");
    }
  },
);

export const updateStudent = createAsyncThunk<Student, UpdateStudentPayload>(
  "students/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/students/${id}`, data);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Failed to update student");
    }
  },
);

const studentsSlice = createSlice({
  name: "students",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get all students
      .addCase(getAllStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllStudents.fulfilled, (state, action) => {
        state.students = action.payload;
        state.loading = false;
      })
      .addCase(getAllStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      //Get one student
      .addCase(getStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStudent.fulfilled, (state, action) => {
        state.selectedStudent = action.payload;
        state.loading = false;
      })
      .addCase(getStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create student
      .addCase(createStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStudent.fulfilled, (state, action) => {
        state.students.push(action.payload);
        state.loading = false;
      })
      .addCase(createStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update student
      .addCase(updateStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.students.findIndex(
          (student) => student.id === action.payload.id,
        );
        if (index !== -1) {
          state.students[index] = action.payload;
        }
        if (state.selectedStudent?.id === action.payload.id) {
          state.selectedStudent = action.payload;
        }
      })
      .addCase(updateStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default studentsSlice.reducer;
