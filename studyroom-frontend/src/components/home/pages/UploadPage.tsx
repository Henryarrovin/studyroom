import { useEffect, useState } from "react";
import apiClient from "../../../services/apiClient";

const UploadPage = () => {
  const [fileSystemData, setFileSystemDataState] = useState<any>(null);
  const [selectedDirectory, setSelectedDirectory] = useState("");
  const [newDirectoryName, setNewDirectoryName] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get("/file/all-files");
        setFileSystemDataState(response.data);
      } catch (error) {
        console.error("Failed to fetch filesystem data:", error);
      }
    };

    fetchData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles([...e.target.files]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateNewDirectoryName()) return;

    const directory = selectedDirectory || newDirectoryName;
    if (!directory.trim()) {
      setError("Please select or enter a directory.");
      return;
    }

    const formData = new FormData();
    formData.append("directory", directory);

    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await apiClient.post("/file/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Files uploaded successfully:", response.data);
      setFiles([]);
      setNewDirectoryName("");
      setSelectedDirectory("");
      setError("");
      window.alert("Files uploaded successfully.");
      window.location.reload();
    } catch (error) {
      console.error("Error uploading files:", error);
      window.alert("Failed to upload files.");
      setError("Failed to upload files.");
    }
  };

  const handleDirectoryChange = (directory: string) => {
    setSelectedDirectory(directory);
    setNewDirectoryName("");
  };

  const validateNewDirectoryName = () => {
    const allDirectories = collectDirectories(fileSystemData);
    console.log(newDirectoryName);

    if (allDirectories.includes(`${newDirectoryName}`)) {
      setError("Directory name already exists ...");
      return false;
    }
    setError("");
    return true;
  };

  const collectDirectories = (obj: any, path = ""): string[] => {
    if (!obj) return [];

    let paths: string[] = [];

    Object.keys(obj).forEach((key) => {
      const newPath = path ? `${path}/${key}` : key;

      if (key === "files" && Array.isArray(obj[key])) {
      } else if (obj[key] && typeof obj[key] === "object") {
        paths.push(newPath);
        paths = paths.concat(collectDirectories(obj[key], newPath));
      }
    });

    return paths;
  };

  const directoryOptions = collectDirectories(fileSystemData).map((dir) => (
    <option value={dir} key={dir}>
      {dir}
    </option>
  ));

  const isSelectDisabled = newDirectoryName.trim() !== "";
  const isTextDisabled = selectedDirectory.trim() !== "";

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h2 className="text-xl font-bold mb-4">Upload Files</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(e);
        }}
        className="w-full max-w-md"
      >
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Select Directory
            </label>
            <select
              value={selectedDirectory}
              onChange={(e) => handleDirectoryChange(e.target.value)}
              className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
              disabled={isSelectDisabled}
              required
            >
              <option value="">Select...</option>
              {directoryOptions}
            </select>
          </div>
          <div className="w-full px-3 py-3">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Or Enter New Directory Name
            </label>
            <input
              type="text"
              value={newDirectoryName}
              onChange={(e) => setNewDirectoryName(e.target.value)}
              placeholder="Enter new directory name"
              className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
              disabled={isTextDisabled}
              required
            />
          </div>
          <div className="w-full px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Files
            </label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              required
              className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
            />
            {error && <p className="text-red-500 pt-3">{error}</p>}
          </div>
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition ease-in-out duration-150 mt-4"
        >
          Upload
        </button>
      </form>
    </div>
  );
};

export default UploadPage;
