import React, { useState } from "react";
import { FaRegEdit, FaSave, FaUser } from "react-icons/fa";

const Profile = () => {
  
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};

  
  const fullName = storedUser.fullName || storedUser.name || "";
  const nameParts = fullName.trim().split(" ");
  const first = nameParts[0] || "";
  const last = nameParts.slice(1).join(" ") || "";

  
  const [user, setUser] = useState({
    firstName: first,
    lastName: last,
    gender: storedUser.gender || "",
    age: storedUser.age || "",
    phone: storedUser.phone || "",
    email: storedUser.email || "",
    fullName: fullName,
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const updatedUser = {
      ...user,
      fullName: `${user.firstName} ${user.lastName}`.trim(),
    };

    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setIsEditing(false);
  };

  return (
     <div className="relative min-h-screen flex items-center justify-center">
    
      <div className="absolute left-0 top-0 w-1/2 h-full bg-lightgreen/40"></div>

  
      <div className="absolute right-0 top-0 w-1/2 h-full bg-pinkGlow/40"></div>

     
      <div className="relative z-10 w-full max-w-4xl bg-backg p-10 rounded-lg shadow-xl">
        
        <h1 className="text-3xl font-bold text-darkblue mb-6">My Profile</h1>

        <div className="bg-white rounded-lg p-6 flex justify-between items-center">

          <div className="flex items-center gap-4">
            <FaUser size={70} className="bg-lightgreen text-white rounded-full p-3" />

            <div>
              <h2 className="text-xl font-semibold">{user.fullName}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-aquaGlow text-white px-5 py-2 rounded-full flex items-center gap-2 hover:bg-lightgreen transition"
          >
            {isEditing ? "Cancel" : "Edit"} <FaRegEdit size={16} />
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-darkblue">Personal Information</h2>

            {isEditing && (
              <button
                onClick={handleSave}
                className="bg-lightgreen text-white px-5 py-2 rounded-full flex items-center gap-2 hover:bg-aquaGlow transition"
              >
                Save <FaSave size={16} />
              </button>
            )}
          </div>

      <div className="grid grid-cols-2 gap-6">

  <div>
    <p className="text-gray-600 font-semibold">First Name</p>
    <p className="font-medium">{user.firstName}</p>
  </div>

  <div>
    <p className="text-gray-600 font-semibold">Last Name</p>
    <p className="font-medium">{user.lastName}</p>
  </div>

  <div>
    <p className="text-gray-600 font-semibold">Gender</p>
    {isEditing ? (
      <select
        name="gender"
        value={user.gender}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      >
        <option>Male</option>
        <option>Female</option>
        <option>Other</option>
      </select>
    ) : (
      <p className="font-medium">{user.gender}</p>
    )}
  </div>

  <div>
    <p className="text-gray-600 font-semibold">Phone No</p>
    {isEditing ? (
     <input
  type="text"
  name="phone"
  value={user.phone}
  onChange={(e) => {
    const value = e.target.value.replace(/\D/g, ""); 
    if (value.length <= 10) {
      setUser({ ...user, phone: value });
    }
  }}
  maxLength={10}
  className="border p-2 rounded w-full"
/>

    ) : (
      <p className="font-medium">{user.phone}</p>
    )}
  </div>

  <div>
    <p className="text-gray-600 font-semibold">Age</p>
    {isEditing ? (
      <input
        type="number"
        name="age"
        value={user.age}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      />
    ) : (
      <p className="font-medium">{user.age}</p>
    )}
  </div>

  <div>
    <p className="text-gray-600 font-semibold">Email</p>
    <p className="font-medium">{user.email}</p>
  </div>

</div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
