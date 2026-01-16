import { useState, useEffect } from "react";
import axios from "axios";
import "./Profile.css";

const Profile = () => {
  const [edit, setEdit] = useState(false);
  const [activeSection, setActiveSection] = useState("details");

  const [profile, setProfile] = useState({
    name: "",
    role: "",
    location: "",
    experience: "",
    skills: "",
    photo: "",
    github: "",
    resume: null,
    document: null,
  });

  const [githubInput, setGithubInput] = useState("");

  // ===== GET userId from localStorage =====
  const userData = JSON.parse(localStorage.getItem("user"));
  const userId = userData?._id;

  // ===== LOAD PROFILE =====
  const fetchProfile = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/profile/${userId}`);

      setProfile({
        name: res.data.name || "",
        role: res.data.role || "",
        location: res.data.location || "",
        experience: res.data.experience || "",
        skills: res.data.skills || "",
        photo: res.data.photo || "",
        github: res.data.github || "",
        resume: res.data.resume || null,
        document: res.data.document || null,
      });

      setGithubInput(res.data.github || "");
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  useEffect(() => {
    if (userId) fetchProfile();
  }, [userId]);

  // ===== HANDLE INPUT CHANGE =====
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // ===== SAVE PROFILE =====
  const handleSaveProfile = async () => {
    try {
      const res = await axios.put(`http://localhost:5000/api/profile/${userId}`, {
        name: profile.name,
        role: profile.role,
        location: profile.location,
        experience: profile.experience,
        skills: profile.skills,
        github: githubInput,
      });

      setProfile({
        name: res.data.name || "",
        role: res.data.role || "",
        location: res.data.location || "",
        experience: res.data.experience || "",
        skills: res.data.skills || "",
        photo: res.data.photo || "",
        github: res.data.github || "",
        resume: res.data.resume || null,
        document: res.data.document || null,
      });

      setEdit(false);
      setActiveSection("details");
    } catch (err) {
      console.error("Error saving profile:", err);
    }
  };

  // ===== UPLOAD PHOTO =====
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("photo", file);

    try {
      const res = await axios.post(
        `http://localhost:5000/api/profile/uploadPhoto/${userId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setProfile({ ...profile, photo: res.data.photo || "" });
    } catch (err) {
      console.error("Photo upload error:", err);
    }
  };

  // ===== UPLOAD RESUME =====
  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await axios.post(
        `http://localhost:5000/api/profile/uploadResume/${userId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setProfile({ ...profile, resume: res.data || null });
      setActiveSection("details");
    } catch (err) {
      console.error("Resume upload error:", err);
    }
  };

  // ===== UPLOAD DOCUMENT =====
  const handleDocumentUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("document", file);

    try {
      const res = await axios.post(
        `http://localhost:5000/api/profile/uploadDocument/${userId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setProfile({ ...profile, document: res.data || null });
      setActiveSection("details");
    } catch (err) {
      console.error("Document upload error:", err);
    }
  };

  // ===== SAVE GITHUB =====
  const handleGithubSave = async () => {
    try {
      const res = await axios.put(`http://localhost:5000/api/profile/${userId}`, {
        ...profile,
        github: githubInput,
      });

      setProfile({
        name: res.data.name || "",
        role: res.data.role || "",
        location: res.data.location || "",
        experience: res.data.experience || "",
        skills: res.data.skills || "",
        photo: res.data.photo || "",
        github: res.data.github || "",
        resume: res.data.resume || null,
        document: res.data.document || null,
      });

      setActiveSection("details");
    } catch (err) {
      console.error("GitHub save error:", err);
    }
  };

  return (
    <div className="profile-page">
      {/* TOP CARD */}
      <div className="profile-top-card">
        <div className="profile-left">
          <div className="photo-circle">
            <img
              src={profile.photo ? `http://localhost:5000/${profile.photo}` : "https://i.pravatar.cc/150"}
              alt="profile"
            />
            {edit && <input type="file" accept="image/*" onChange={handlePhotoUpload} />}
          </div>

          <div className="profile-info">
            <h4>{profile.name || "Your Name"}</h4>
            <p>{profile.role || "Job Role"}</p>
            <span>{profile.location || "Location"}</span>
          </div>
        </div>

        <div className="profile-right">
          <h3>Profile Strength</h3>
          <span className="percent">90%</span>
          <button className="complete-btn">Improve Profile</button>
        </div>
      </div>

      {/* BODY */}
      <div className="profile-body">
        {/* SIDEBAR */}
        <div className="profile-sidebar">
          <h6>Quick Links</h6>
          <ul>
            <li onClick={() => setActiveSection("details")}>Profile</li>
            <li onClick={() => setActiveSection("resume")}>Resume</li>
            <li onClick={() => setActiveSection("github")}>GitHub</li>
            <li onClick={() => setActiveSection("document")}>Documents</li>
          </ul>
        </div>

        {/* CONTENT */}
        <div className="profile-details">
          {activeSection === "details" && (
            <div className="card-box">
              <h5>Profile Details</h5>

              <input name="name" value={profile.name} placeholder="Full Name" onChange={handleChange} disabled={!edit} />
              <input name="role" value={profile.role} placeholder="Role" onChange={handleChange} disabled={!edit} />
              <input name="location" value={profile.location} placeholder="Location" onChange={handleChange} disabled={!edit} />
              <input name="experience" value={profile.experience} placeholder="Experience" onChange={handleChange} disabled={!edit} />
              <input name="skills" value={profile.skills} placeholder="Skills" onChange={handleChange} disabled={!edit} />

              {!edit ? (
                <button className="primary-btn" onClick={() => setEdit(true)}>Edit Profile</button>
              ) : (
                <button className="save-btn" onClick={handleSaveProfile}>Save</button>
              )}
            </div>
          )}

          {activeSection === "resume" && (
            <div className="card-box">
              <h5>Upload Resume</h5>
              <p>{profile.resume?.filename || "No resume uploaded"}</p>
              <input type="file" onChange={handleResumeUpload} />
              {profile.resume && (
                <a href={`http://localhost:5000/${profile.resume.filepath}`} download className="download-btn">Download Resume</a>
              )}
            </div>
          )}

          {activeSection === "github" && (
            <div className="card-box">
              <h5>GitHub</h5>
              <input placeholder="https://github.com/username" value={githubInput} onChange={(e) => setGithubInput(e.target.value)} />
              <button className="save-btn" onClick={handleGithubSave}>Save</button>
            </div>
          )}

          {activeSection === "document" && (
            <div className="card-box">
              <h5>Upload Document</h5>
              <p>{profile.document?.filename || "No document uploaded"}</p>
              <input type="file" onChange={handleDocumentUpload} />
              {profile.document && (
                <a href={`http://localhost:5000/${profile.document.filepath}`} download className="download-btn">Download Document</a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
