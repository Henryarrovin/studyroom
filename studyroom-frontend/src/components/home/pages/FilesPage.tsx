import { useState } from "react";
import downloadIcon from "../../../assets/download.png";
import deleteIcon from "../../../assets/delete.png";

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

const FilesPage = () => {
  const [expandedDirs, setExpandedDirs] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [searchTerm, setSearchTerm] = useState("");

  const toggleDirectory = (dir: string) => {
    setExpandedDirs((prevState) => ({
      ...prevState,
      [dir]: !prevState[dir],
    }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filterFiles = (files: any[]) => {
    return files.filter((file) =>
      file.filename.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleDelete = (fileId: number) => {
    // Implement delete functionality here
    console.log(`Delete file with ID: ${fileId}`);
  };

  const handleDownload = (fileId: number) => {
    // Implement download functionality here
    console.log(`Download file with ID: ${fileId}`);
  };

  const renderFiles = (files: any[]) => {
    const filteredFiles = filterFiles(files);
    return filteredFiles.map((file) => (
      <li
        key={file.id}
        className="ml-4 flex items-center justify-between p-2 hover:bg-gray-700 text-white rounded-lg group"
      >
        📄 {file.filename}
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => handleDownload(file.filename)}
            className="p-1 hover:bg-gray-600 rounded-full"
          >
            <img src={downloadIcon} alt="Download" className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(file.filename)}
            className="p-1 hover:bg-gray-600 rounded-full"
          >
            <img src={deleteIcon} alt="Delete" className="w-4 h-4" />
          </button>
        </div>
      </li>
    ));
  };

  const renderDirectory = (dir: any, dirName: string) => {
    const isExpanded = expandedDirs[dirName];
    return (
      <div key={dirName}>
        <div
          className="cursor-pointer p-2 hover:bg-gray-700 text-white"
          onClick={() => toggleDirectory(dirName)}
        >
          📁 {dirName} {isExpanded ? "-" : "+"}
        </div>
        {isExpanded && (
          <ul className="ml-4">
            {Object.keys(dir).map((subDirName) =>
              dir[subDirName].files
                ? renderDirectory(dir[subDirName], `${dirName}/${subDirName}`)
                : renderFiles(dir[subDirName])
            )}
          </ul>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Enter search term"
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full p-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>
      <div>
        {Object.keys(directories).map((dirName) =>
          renderDirectory(directories[dirName], dirName)
        )}
      </div>
    </div>
  );
};

export default FilesPage;
