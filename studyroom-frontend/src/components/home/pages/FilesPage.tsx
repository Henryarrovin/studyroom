import React, { useState, useEffect } from "react";
import downloadIcon from "../../../assets/download.png";
import deleteIcon from "../../../assets/delete.png";
import apiClient from "../../../services/apiClient";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { selectCurrentUser } from "../../../features/userSlice";

const FilesPage = () => {
  const [expandedDirs, setExpandedDirs] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [fileSystemData, setFileSystemDataState] = useState<any>(null);

  const user = useSelector((state: RootState) => selectCurrentUser(state));

  const { roles } = user;
  const roleNames = roles
    .map((role: string) => {
      const match = role.match(/name=([A-Z]+)/);
      return match ? match[1] : null;
    })
    .filter((role: string | null) => role !== null)
    .join(", ");

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

  const handleDelete = (directory: string, fileName: string) => {
    const trimmedDirectory = directory.trim();
    const trimmedFileName = fileName.trim();

    const encodedFileName = encodeURIComponent(trimmedFileName);
    const encodedDirectory = encodeURIComponent(trimmedDirectory);

    const url = `/file/delete?directory=${encodedDirectory}&filename=${encodedFileName}`;

    if (roleNames === "ADMIN") {
      apiClient
        .delete(url)
        .then(() => {
          window.alert("File deleted successfully.");
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error deleting file:", error);
        });
    } else {
      window.alert("You do not have permission to delete files.");
    }
  };

  const handleDownload = (directory: string, fileName: string) => {
    const encodedDirectory = encodeURIComponent(directory);
    const encodedFileName = encodeURIComponent(fileName);

    const requestUrl = `/file/download?directory=${encodedDirectory}&filename=${encodedFileName}`;

    apiClient
      .get(requestUrl, { responseType: "blob" })
      .then((response) => {
        const blob = new Blob([response.data], {
          type: response.headers["content-type"] || "application/octet-stream",
        });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");

        const contentDisposition = response.headers["content-disposition"];
        const downloadFileName = contentDisposition
          ? contentDisposition
              .split("filename=")[1]
              .split(";")[0]
              .replace(/"/g, "")
          : fileName;

        link.href = url;
        link.setAttribute("download", downloadFileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Error downloading file:", error);
      });
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
            onClick={() => handleDownload(file.directory, file.filename)}
            className="p-1 hover:bg-gray-600 rounded-full"
          >
            <img src={downloadIcon} alt="Download" className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(file.directory, file.filename)}
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
        {fileSystemData &&
          Object.keys(fileSystemData).map((dirName) =>
            renderDirectory(fileSystemData[dirName], dirName)
          )}
      </div>
    </div>
  );
};

export default FilesPage;
