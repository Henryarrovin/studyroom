import { getAll } from './HttpService';

export interface File {
  id: number;
  filename: string;
  data: string;
  contentType: string;
  directory: string;
}

export interface Directory {
  files: File[];
  [key: string]: Directory | File[];
}

export interface FileSystemState {
  [key: string]: Directory;
}

const getAllFilesService = getAll('/file/all-files').getAll;

export { getAllFilesService };
