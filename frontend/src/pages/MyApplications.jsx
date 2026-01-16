import { useEffect, useState } from "react";
import "./StudentDashboard.css"

const MyApplications = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const apps = JSON.parse(localStorage.getItem("applications")) || [];
    setApplications(apps);
  }, []);

  return (
    <div className="applications-page">
      <h3>My Applications</h3>

      {applications.length === 0 ? (
        <p>No applications yet</p>
      ) : (
        applications.map((app, index) => (
          <div className="application-card" key={index}>
            <div>
              <h5>{app.jobTitle}</h5>
              <p>{app.company}</p>
              <small>Applied on: {app.appliedAt}</small>
            </div>
            <span className="status">Applied</span>
          </div>
        ))
      )}
    </div>
  );
};

export default MyApplications;
