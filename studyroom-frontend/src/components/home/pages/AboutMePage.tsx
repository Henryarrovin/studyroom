import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../features/userSlice";
import { RootState } from "../../../store";

const AboutMePage = () => {
  const user = useSelector((state: RootState) => selectCurrentUser(state));

  const { firstName, lastName, email, dateOfBirth, username, roles } = user;

  const roleNames = roles
    .map((role: string) => {
      const match = role.match(/name=([A-Z]+)/);
      return match ? match[1] : null;
    })
    .filter((role: string | null) => role !== null)
    .join(", ");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-4">About Me</h1>
        <p className="mb-2">
          <span className="font-semibold">Name:</span> {firstName} {lastName}
        </p>
        <p className="mb-2">
          <span className="font-semibold">Email:</span> {email}
        </p>
        <p className="mb-2">
          <span className="font-semibold">Username:</span> {username}
        </p>
        <p className="mb-2">
          <span className="font-semibold">Date of Birth:</span>{" "}
          {dateOfBirth.join("-")}
        </p>
        <p className="mb-2">
          <span className="font-semibold">Roles:</span> {roleNames}
        </p>
      </div>
    </div>
  );
};

export default AboutMePage;
