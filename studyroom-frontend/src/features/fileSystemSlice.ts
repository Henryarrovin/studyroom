import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface File {
  id: number;
  filename: string;
  data: string;
  contentType: string;
  directory: string;
}

export interface Directory {
  path: string;
  files: number[];
}

export interface FileSystemState {
  directories: Record<string, Directory>;
  files: Record<number, File>;
}

const initialState: FileSystemState = {
  directories: {},
  files: {},
};


const fileSystemSlice = createSlice({
  name: 'fileSystem',
  initialState,
  reducers: {
    setFileSystemData: (state, action: PayloadAction<{ directories: Record<string, Directory>; files: Record<number, File> }>) => {
      const { directories, files } = action.payload;
      state.directories = directories;
      state.files = files;
    },
  },
});

export const { setFileSystemData } = fileSystemSlice.actions;

export default fileSystemSlice.reducer;

