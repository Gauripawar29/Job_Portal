import { useNavigate } from "react-router-dom";
import { UserSearch } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import "./StudentDashboard.css";

const StudentDashboard = () => {
  const navigate = useNavigate();

  const userData = JSON.parse(localStorage.getItem("user"));
  const userId = userData?._id;

  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  const [showApplyPopup, setShowApplyPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplicationsPage, setShowApplicationsPage] = useState(false);

  const resumeName = profile?.resume?.filename || "Not uploaded";

  // ===== LOAD DATA =====
  const fetchData = async () => {
    try {
      if (!userId) return;

      // PROFILE
      const profileRes = await axios.get(`http://localhost:5000/api/profile/${userId}`);
      setProfile(profileRes.data || {});

      // JOBS
      const jobsRes = await axios.get("http://localhost:5000/api/jobs");
      setJobs(Array.isArray(jobsRes.data) ? jobsRes.data : []);

      // APPLICATIONS
      const appsRes = await axios.get(`http://localhost:5000/api/applications/${userId}`);
      setApplications(Array.isArray(appsRes.data) ? appsRes.data : []);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  // ===== APPLY =====

  const hasAlreadyApplied = (jobId) => {
    return applications.some((app) => app.jobId === jobId);
  };

  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setShowApplyPopup(true);
  };

  const confirmApply = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/applications", {
        jobId: selectedJob?._id,
        studentId: userId,
      });

      if (res.data) {
        setApplications([...applications, res.data]);
        setShowApplyPopup(false);
        setShowSuccessPopup(true);
      }
    } catch (err) {
      console.error("Apply error:", err);
    }
  };

  // ===== LOGOUT =====
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg bg-body-tertiary w-100">
        <div className="container-fluid">
          <span className="navbar-brand fw-bold text-primary d-flex align-items-center gap-2">
            <UserSearch size={24} />
            JobDekho
          </span>

          <div className="d-flex gap-2">
            <button className="btn btn-primary" onClick={() => navigate("/profile")}>
              My Profile
            </button>
            <button className="btn btn-outline-primary" onClick={() => setShowApplicationsPage(true)}>
              My Applications
            </button>
            <button className="btn btn-outline-danger" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* APPLICATIONS PAGE */}
      {showApplicationsPage ? (
        <div className="applications-page">
          <h3>My Applications</h3>

          {applications.length === 0 ? (
            <p>No applications yet</p>
          ) : (
            applications.map((app, index) => (
              <div key={index} className="application-card">
                <h5>{app.jobTitle}</h5>
                <p>{app.company} · {app.location}</p>
                <small>Applied: {new Date(app.createdAt).toLocaleString()}</small>
              </div>
            ))
          )}

          <button className="btn btn-secondary mt-3" onClick={() => setShowApplicationsPage(false)}>
            Back
          </button>
        </div>
      ) : (
        <div className="dashboard-container">
          {/* PROFILE */}
          <div className="profile-sidebar">
            <img
              src={profile?.photo ? `http://localhost:5000/${profile.photo}` : "https://i.pravatar.cc/150"}
              className="profile-img"
              alt="profile"
            />
            <h5>{profile?.name || "Your Name"}</h5>
            <strong>{profile?.role || "Not set"}</strong>
          </div>

          {/* JOBS */}
          <div className="job-feed">
            <h5>Recommended Jobs</h5>

            {jobs.length === 0 ? (
              <p>No jobs available</p>
            ) : (
              jobs.map((job) => (
                <div key={job._id} className="job-card">
                  <h6>{job.title}</h6>
                  <p>{job.company} · {job.location}</p>
                  <p className="small text-muted">{job.description}</p>

                  <button
                    className="btn btn-sm btn-primary"
                    disabled={hasAlreadyApplied(job._id)}
                    onClick={() => handleApplyClick(job)}
                  >
                    {hasAlreadyApplied(job._id) ? "Applied" : "Apply"}
                  </button>

                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* APPLY POPUP */}
      {showApplyPopup && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h5>Confirm Application</h5>
            <p><strong>Name:</strong> {profile?.name}</p>
            <p><strong>Resume:</strong> {resumeName}</p>

            <button className="btn btn-success" onClick={confirmApply}>
              Confirm
            </button>
            <button className="btn btn-secondary" onClick={() => setShowApplyPopup(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* SUCCESS POPUP */}
      {showSuccessPopup && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h5>✅ Applied Successfully</h5>
            <button className="btn btn-primary" onClick={() => setShowSuccessPopup(false)}>
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentDashboard;
