import React, { useState } from "react";
import { FaRegEdit, FaSave, FaUser, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};

  const userProfession = localStorage.getItem("profession") || "Not Set";
  
 const [user, setUser] = useState({
  fullName: storedUser.name || storedUser.fullName || "",
  gender: storedUser.gender || "",
  age: storedUser.age || "",
  phone: storedUser.phone || "",
  email: storedUser.email || "",
  profession: userProfession,
});


  const [isEditing, setIsEditing] = useState(false);


  const profilePhoto =
  storedUser.picture ||
  storedUser.photoURL ||
  storedUser.image ||
  storedUser.photo || 
  "";


  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const updatedUser = { ...user };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    localStorage.setItem("profession", updatedUser.profession);
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("profession");
    navigate("/login", { replace: true });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">
      <div className="absolute left-0 top-0 w-1/2 h-full bg-lightgreen/40"></div>
      <div className="absolute right-0 top-0 w-1/2 h-full bg-pinkGlow/40"></div>

      <div className="relative z-10 w-full max-w-4xl bg-backg p-4 sm:p-10 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-darkblue mb-6 text-center sm:text-left">
          My Profile
        </h1>

        <div className="bg-white rounded-lg p-6 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
          {profilePhoto ? (
  <img
    src={profilePhoto}
    alt="profile"
    className="w-20 h-20 rounded-full object-cover"
  />
) : (
  <FaUser size={70} className="bg-lightgreen text-white rounded-full p-3" />
)}


            <div className="text-center sm:text-left">
              <h2 className="text-xl font-semibold">{user.fullName}</h2>
              <p className="text-gray-600 break-all">{user.email}</p>
              
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-aquaGlow text-white px-5 py-2 rounded-full flex items-center gap-2 hover:bg-lightgreen transition"
            >
              {isEditing ? "Cancel" : "Edit"} <FaRegEdit size={16} />
            </button>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-5 py-2 rounded-full hover:bg-red-600 transition"
            >
              <FaSignOutAlt size={20} />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-600 font-semibold">Full Name</p>
              <p className="font-medium">{user.fullName}</p>
            </div>

            <div>
              <p className="text-gray-600 font-semibold">Profession</p>
              <p className="font-medium">{user.profession}</p>
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
                  <option value="" disabled>Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
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
              <p className="font-medium break-all">{user.email}</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
