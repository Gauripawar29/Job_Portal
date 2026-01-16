import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState({
    title: "",
    company: "",
    description: "",
    salary: "",
    requirements: "",
  });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/jobs/${id}`);
        setJob(res.data);
      } catch (err) {
        console.error("Error fetching job:", err);
      }
    };
    fetchJob();
  }, [id]);

  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/jobs/${id}`, job);
      navigate("/employer");
    } catch (err) {
      console.error("Error updating job:", err);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center mt-5">
      <div className="card shadow-lg p-4 w-100" style={{ maxWidth: "600px" }}>
        <h3 className="text-center mb-4 fw-bold">✏️ Edit Job Details</h3>

        <div className="form-group mb-3">
          <label className="form-label fw-semibold">Job Title</label>
          <input
            className="form-control"
            name="title"
            value={job.title}
            onChange={handleChange}
            placeholder="Enter job title"
          />
        </div>

        <div className="form-group mb-3">
          <label className="form-label fw-semibold">Company Name</label>
          <input
            className="form-control"
            name="company"
            value={job.company}
            onChange={handleChange}
            placeholder="Enter company name"
          />
        </div>

        <div className="form-group mb-3">
          <label className="form-label fw-semibold">Job Description</label>
          <textarea
            className="form-control"
            rows="4"
            name="description"
            value={job.description}
            onChange={handleChange}
            placeholder="Describe the role"
          />
        </div>

        <div className="form-group mb-3">
          <label className="form-label fw-semibold">Salary</label>
          <input
            className="form-control"
            name="salary"
            value={job.salary}
            onChange={handleChange}
            placeholder="e.g. ₹5–7 LPA"
          />
        </div>

        <div className="form-group mb-4">
          <label className="form-label fw-semibold">Requirements</label>
          <textarea
            className="form-control"
            rows="3"
            name="requirements"
            value={job.requirements}
            onChange={handleChange}
            placeholder="Skills & qualifications"
          />
        </div>

        <div className="d-flex justify-content-between">
          <button
            className="btn btn-outline-secondary px-4"
            onClick={() => navigate("/employer")}
          >
            Cancel
          </button>

          <button
            className="btn btn-success px-4"
            onClick={handleUpdate}
          >
            Update Job
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditJob;
