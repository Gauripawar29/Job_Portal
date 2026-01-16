import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./PostJob.css";

const PostJob = () => {
  const navigate = useNavigate();

  // ✅ Get employer from correct key in localStorage
  const employer = JSON.parse(localStorage.getItem("user")); // <-- must match login storage
  const employerId = employer?._id;

  const [job, setJob] = useState({
    title: "",
    company: "",
    description: "",
    salary: "",
    requirements: "",
  });

  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!employerId) {
      alert("Employer not logged in");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/jobs", {
        ...job,
        employerId,
      });

      alert("Job posted successfully");
      navigate("/employer");
    } catch (err) {
      console.error("Job post error:", err);
      alert("Error posting job. Check console.");
    }
  };

  return (
    <div className="postjob-page">
      <div className="postjob-card">
        <h3 className="title">Post a Job</h3>
        <p className="subtitle">
          Find the right candidate by posting a detailed job
        </p>

        <div className="form-group">
          <label>Job Title</label>
          <input name="title" onChange={handleChange} value={job.title} />
        </div>

        <div className="form-group">
          <label>Company Name</label>
          <input name="company" onChange={handleChange} value={job.company} />
        </div>

        <div className="form-group">
          <label>Job Description</label>
          <textarea name="description" onChange={handleChange} value={job.description} />
        </div>

        <div className="form-group">
          <label>Salary</label>
          <input name="salary" onChange={handleChange} value={job.salary} />
        </div>

        <div className="form-group">
          <label>Requirements</label>
          <textarea name="requirements" onChange={handleChange} value={job.requirements} />
        </div>

        <button className="submit-btn" onClick={handleSubmit}>
          🚀 Publish Job
        </button>
      </div>
    </div>
  );
};

export default PostJob;
