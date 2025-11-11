import React, { useState, useEffect } from "react";
import { FaRegEdit, FaSave, FaUser, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};
  const userProfession = localStorage.getItem("profession") || "Not Set";

  const uid = storedUser?.id;

  const addActivity = (uid, text, meta = "") => {
    const key = `user-${uid}-activity`;
    const arr = JSON.parse(localStorage.getItem(key) || "[]");
    arr.unshift({ text, meta, ts: Date.now() });
    if (arr.length > 20) arr.length = 20;
    localStorage.setItem(key, JSON.stringify(arr));
  };

  const [profileData, setProfileData] = useState({
    fullName: storedUser.name || storedUser.fullName || "",
    gender: storedUser.gender || "",
    age: storedUser.age || "",
    phone: storedUser.phone || "",
    email: storedUser.email || "",
    profession: userProfession,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  const profilePhoto =
    storedUser.picture ||
    storedUser.photoURL ||
    storedUser.image ||
    storedUser.photo ||
    "";

  const validateIndianMobile = (num) => /^[6-9]\d{9}$/.test(num);

  const resetProfileData = () => {
    setProfileData({
      fullName: storedUser.name || storedUser.fullName || "",
      gender: storedUser.gender || "",
      age: storedUser.age || "",
      phone: storedUser.phone || "",
      email: storedUser.email || "",
      profession: userProfession,
    });
    setPhoneError("");
  };

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      setProfileData({ ...profileData, phone: value });
      if (value.length === 10) {
        setPhoneError(validateIndianMobile(value) ? "" : "Enter a valid Indian mobile number (starts with 6-9)");
      } else {
        setPhoneError("");
      }
    }
  };

  const handleSave = () => {
    if (phoneError) {
      alert("Please fix input errors before saving.");
      return;
    }
    localStorage.setItem("user", JSON.stringify(profileData));
    localStorage.setItem("profession", profileData.profession);
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("profession");
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    if (uid) addActivity(uid, "Opened Profile");
  }, [uid]);

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">
      <div className="absolute left-0 top-0 w-1/2 h-full bg-darkblue"></div>
      <div className="absolute right-0 top-0 w-1/2 h-full bg-lightgreen"></div>

      <div className="relative z-10 w-full max-w-4xl bg-backg p-4 sm:p-10 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-darkblue mb-6 text-center sm:text-left">My Profile</h1>

        <div className="bg-white rounded-lg p-6 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            {profilePhoto ? (
              <img src={profilePhoto} alt="profile" className="w-20 h-20 rounded-full object-cover" />
            ) : (
              <FaUser size={70} className="bg-lightgreen text-white rounded-full p-3" />
            )}
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-semibold">{profileData.fullName}</h2>
              <p className="text-gray-600 break-all">{profileData.email}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                if (isEditing) {
                  resetProfileData();
                  setIsEditing(false);
                } else {
                  setIsEditing(true);
                }
              }}
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
              <p className="font-medium">{profileData.fullName}</p>
            </div>

            <div>
              <p className="text-gray-600 font-semibold">Profession</p>
              <p className="font-medium">{profileData.profession}</p>
            </div>

            <div>
              <p className="text-gray-600 font-semibold">Gender</p>
              {isEditing ? (
                <select
                  name="gender"
                  value={profileData.gender}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                >
                  <option value="" disabled>
                    Select Gender
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <p className="font-medium">{profileData.gender}</p>
              )}
            </div>

            <div>
              <p className="text-gray-600 font-semibold">Phone No</p>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    name="phone"
                    value={profileData.phone}
                    onChange={handlePhoneChange}
                    maxLength={10}
                    className={`border p-2 rounded w-full ${phoneError ? "border-red-500" : ""}`}
                  />
                  {phoneError && <p className="text-red-600 mt-1 text-sm">{phoneError}</p>}
                </>
              ) : (
                <p className="font-medium">{profileData.phone}</p>
              )}
            </div>

            <div>
              <p className="text-gray-600 font-semibold">Age</p>
              {isEditing ? (
                <input
                  type="number"
                  name="age"
                  value={profileData.age}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                />
              ) : (
                <p className="font-medium">{profileData.age}</p>
              )}
            </div>

            <div>
              <p className="text-gray-600 font-semibold">Email</p>
              <p className="font-medium break-all">{profileData.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
