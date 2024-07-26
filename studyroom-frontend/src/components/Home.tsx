import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import deleteIcon from "../assets/delete.png";
import downloadIcon from "../assets/download.png";

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

const Home = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const [expandedDirs, setExpandedDirs] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

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
    <div className="min-h-screen flex bg-gray-900 text-white">
      <div className="w-64 bg-gray-800 p-4 flex flex-col h-full fixed">
        <h1 className="text-2xl font-bold mb-4">Home</h1>
        <div className="mb-4">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition ease-in-out duration-150"
          >
            Log Out
          </button>
        </div>
        <ul>
          <li
            className={`cursor-pointer p-2 hover:bg-gray-700 ${
              selectedSection === "SharedFiles" ? "bg-gray-700" : ""
            }`}
            onClick={() => setSelectedSection("SharedFiles")}
          >
            Shared Files
          </li>
          <li
            className={`cursor-pointer p-2 hover:bg-gray-700 ${
              selectedSection === "Upload" ? "bg-gray-700" : ""
            }`}
            onClick={() => setSelectedSection("Upload")}
          >
            Upload
          </li>
          <li
            className={`cursor-pointer p-2 hover:bg-gray-700 ${
              selectedSection === "Users" ? "bg-gray-700" : ""
            }`}
            onClick={() => setSelectedSection("Users")}
          >
            Users
          </li>
          <li
            className={`cursor-pointer p-2 hover:bg-gray-700 ${
              selectedSection === "AboutMe" ? "bg-gray-700" : ""
            }`}
            onClick={() => setSelectedSection("AboutMe")}
          >
            About me
          </li>
        </ul>
        <button className="w-full px-4 py-2 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition ease-in-out duration-150 mt-auto">
          Register
        </button>
      </div>
      <div className="flex-1 p-4 ml-64">
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
          {selectedSection === "SharedFiles" &&
            Object.keys(directories).map((dirName) =>
              renderDirectory(directories[dirName], dirName)
            )}
          {selectedSection === "Upload" && <div>Upload</div>}
          {selectedSection === "Users" && <div>Users</div>}
          {selectedSection === "AboutMe" && <div>About me</div>}
        </div>
      </div>
    </div>
  );
};

export default Home;
