import { useState } from "react";

const data: any = [
  {
    id: 1,
    firstName: "Henry",
    lastName: "Arrovin",
    email: "hen@gmail.com",
    dateOfBirth: [2003, 6, 20],
    username: "hen",
    password: "",
    roles: ["Role(id=1, name=ADMIN)"],
  },
  {
    id: 1,
    firstName: "abc",
    lastName: "abc",
    email: "abc@gmail.com",
    dateOfBirth: [2003, 6, 20],
    username: "abc",
    password: "",
    roles: ["Role(id=2, name=STUDENT)"],
  },
];

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e: any) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = data.filter((user: any) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Enter search term"
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full p-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-5"
        />
      </div>
      <ul className="flex-1 overflow-y-auto">
        {filteredUsers.map((user: any) => (
          <li key={user.id} className="mb-6">
            <div className="relative group">
              <span className="block w-48 cursor-pointer p-2 bg-gray-800 text-white rounded-lg">
                {user.username} - {user.roles[0].match(/name=([A-Z]+)/)[1]}
              </span>
              <div className="absolute left-0 p-4 bg-gray-700 text-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                <p>
                  Name: {user.firstName} {user.lastName}
                </p>
                <p>Email: {user.email}</p>
                <p>Date of Birth: {user.dateOfBirth.join("-")}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersPage;
