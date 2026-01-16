import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./EmployerDashboard.css";

const EmployerDashboard = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const MAX_APPLICANTS = 50;

  // ✅ Load jobs from backend
  const fetchJobs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/jobs"); // GET all jobs
      setJobs(res.data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // ✅ DELETE JOB
  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/jobs/${jobId}`);
      setJobs(jobs.filter((job) => job._id !== jobId));
    } catch (err) {
      console.error("Error deleting job:", err);
      alert("Error deleting job. Check console.");
    }
  };

  // ✅ EDIT JOB
  const handleEdit = (jobId) => {
    navigate(`/edit-job/${jobId}`);
  };

  return (
    <div className="container mt-4">
      <div className="dashboard-header">
        <h3>Employer Dashboard</h3>
        <button className="btn btn-primary" onClick={() => navigate("/post-job")}>
          + Post Job
        </button>
      </div>

      {jobs.length === 0 ? (
        <p className="text-muted">No jobs posted yet</p>
      ) : (
        jobs.map((job) => (
          <div key={job._id} className="job-card">
            {/* LEFT SIDE */}
            <div className="job-info">
              <h5>{job.title}</h5>
              <p className="company">{job.company}</p>

              <div className="job-actions">
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => navigate(`/applications/${job._id}`)}
                >
                  View Applicants
                </button>

                <button
                  className="btn btn-outline-warning btn-sm"
                  onClick={() => handleEdit(job._id)}
                >
                  Edit
                </button>

                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => handleDelete(job._id)}
                >
                  Delete
                </button>
              </div>
            </div>

            {/* RIGHT SIDE - PROGRESS CIRCLE */}
            <div className="progress-wrapper">
              <div
                className="progress-circle"
                style={{
                  "--percent": Math.min(
                    ((job.applicantsCount || 0) / MAX_APPLICANTS) * 100,
                    100
                  ),
                }}
              >
                <div className="progress-inner">
                  <span>{job.applicantsCount || 0}</span>
                  <small>Applied</small>
                </div>
              </div>

            </div>

          </div>
        ))
      )}
    </div>
  );
};

export default EmployerDashboard;
