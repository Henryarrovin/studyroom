const data: any = {
  id: 1,
  firstName: "Henry",
  lastName: "Arrovin",
  email: "hen@gmail.com",
  dateOfBirth: [2003, 6, 20],
  username: "hen",
  password: "",
  roles: ["Role(id=1, name=ADMIN)"],
};

const AboutMePage = () => {
  const { firstName, lastName, email, dateOfBirth, username, roles } = data;

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
          <span className="font-semibold">Roles:</span>{" "}
          {roles.map((role: any) => role.match(/name=([A-Z]+)/)[1]).join(", ")}
        </p>
      </div>
    </div>
  );
};

export default AboutMePage;
