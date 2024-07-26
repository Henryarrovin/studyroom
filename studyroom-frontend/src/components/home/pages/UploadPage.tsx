import { useState } from "react";

const directories: any = {
  text: {
    new: {
      files: [
        { id: 7, filename: "Hello world.txt", directory: "/text/new" },
        { id: 9, filename: "Hello world (1).txt", directory: "/text/new" },
        { id: 10, filename: "Hello world (2).txt", directory: "/text/new" },
      ],
    },
    new2: {
      files: [{ id: 11, filename: "Hello world.txt", directory: "/text/new2" }],
    },
    files: [
      { id: 5, filename: "Hello world.txt", directory: "/text" },
      { id: 6, filename: "Hello world (1).txt", directory: "/text" },
    ],
  },
  javascript: {
    files: [
      { id: 4, filename: "index.js", directory: "/javascript" },
      { id: 8, filename: "Hello world.txt", directory: "/javascript" },
    ],
  },
  text1: {
    new: {
      files: [
        { id: 7, filename: "Hello world.txt", directory: "/text/new" },
        { id: 9, filename: "Hello world (1).txt", directory: "/text/new" },
        { id: 10, filename: "Hello world (2).txt", directory: "/text/new" },
      ],
    },
    new2: {
      files: [{ id: 11, filename: "Hello world.txt", directory: "/text/new2" }],
    },
    files: [
      { id: 5, filename: "Hello world.txt", directory: "/text" },
      { id: 6, filename: "Hello world (1).txt", directory: "/text" },
    ],
  },
  javascript1: {
    files: [
      { id: 4, filename: "index.js", directory: "/javascript" },
      { id: 8, filename: "Hello world.txt", directory: "/javascript" },
    ],
  },
};

const UploadPage = () => {
  const [selectedDirectory, setSelectedDirectory] = useState("");
  const [newDirectoryName, setNewDirectoryName] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles([...e.target.files]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    validateNewDirectoryName();
    console.log(files);
  };

  const handleDirectoryChange = (directory: string) => {
    setSelectedDirectory(directory);
  };

  const validateNewDirectoryName = () => {
    const allDirectories = collectDirectories(directories);
    console.log(newDirectoryName);

    if (allDirectories.includes(`${newDirectoryName}`)) {
      setError("Directory name already exists ...");
      return false;
    }
    setError("");
    return true;
  };

  const collectDirectories = (obj: any, path = ""): string[] => {
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

  const directoryOptions = collectDirectories(directories).map((dir) => (
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
              placeholder="Start with / to create a new directory"
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
