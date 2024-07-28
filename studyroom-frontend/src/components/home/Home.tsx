import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Upload from "./pages/UploadPage";
import UsersPage from "./pages/UsersPage";
import AboutMePage from "./pages/AboutMePage";
import FilesPage from "./pages/FilesPage";

const Home = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  const [selectedSection, setSelectedSection] = useState<string>("SharedFiles");

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
        <button
          className="w-full px-4 py-2 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition ease-in-out duration-150 mt-auto"
          onClick={handleRegister}
        >
          Register
        </button>
      </div>
      <div className="flex-1 p-4 ml-64">
        <div>
          {selectedSection === "SharedFiles" && <FilesPage />}
          {selectedSection === "Upload" && <Upload />}
          {selectedSection === "Users" && <UsersPage />}
          {selectedSection === "AboutMe" && <AboutMePage />}
        </div>
      </div>
    </div>
  );
};

export default Home;
