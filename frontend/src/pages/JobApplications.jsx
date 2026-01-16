import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./JobApplications.css";

const JobApplications = () => {
  const { id } = useParams(); // jobId
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch job
      const jobRes = await axios.get(
        `http://localhost:5000/api/jobs/${id}`
      );
      setJob(jobRes.data);

      // Fetch applications for this job
      const appsRes = await axios.get(
        `http://localhost:5000/api/applications/job/${id}`
      );
      setApplications(appsRes.data || []);
    } catch (err) {
      console.error("Error fetching job applications:", err);
      setJob(null);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (loading) return <p className="text-center mt-5">Loading...</p>;
  if (!job) return <p className="text-center mt-5">Job not found</p>;

  return (
    <div className="applications-container">
      <div className="job-header">
        <h3>{job.title}</h3>
        <span className="company">{job.company}</span>
      </div>

      <p className="total-count">
        Total Applicants: <strong>{applications.length}</strong>
      </p>

      {applications.length === 0 ? (
        <div className="empty-state">
          <p>No applications received yet</p>
        </div>
      ) : (
        applications.map((app, i) => (
          <div key={i} className="applicant-card">
            <div className="applicant-left">
              <div className="avatar">
                {app.studentName?.charAt(0) || "?"}
              </div>
              <div>
                <h6>{app.studentName || "Unknown Student"}</h6>
                <small>
                  Applied on{" "}
                  {new Date(app.createdAt).toLocaleString()}
                </small>
              </div>
            </div>

            <div className="applicant-right">
              {app.resume?.filepath ? (
                <a
                  href={`http://localhost:5000/${app.resume.filepath.replace(
                    /\\/g,
                    "/"
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="download-btn"
                  onClick={(e) => e.stopPropagation()}
                >
                  Download Resume
                </a>
              ) : (
                <span className="no-resume">No Resume</span>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default JobApplications;
