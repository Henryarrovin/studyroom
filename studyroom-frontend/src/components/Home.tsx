import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Home = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  return (
    <div>
      <h1>Welcome to the Home Page!</h1>
      <button
        onClick={handleLogout}
        className="mt-4 px-6 py-2 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition ease-in-out duration-150"
      >
        Log Out!
      </button>
    </div>
  );
};

export default Home;
