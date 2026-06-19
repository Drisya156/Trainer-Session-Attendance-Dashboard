import React, { useEffect, useMemo, useState } from "react";

const studentsByBatch = {
  "Batch-A": [
    { id: "101", name: "Amit" },
    { id: "102", name: "Bhavna" },
    { id: "103", name: "Chirag" },
  ],
  "Batch-B": [
    { id: "201", name: "Divya" },
    { id: "202", name: "Esha" },
  ],
};

const getToday = () => new Date().toISOString().split("T")[0];

export default function App() {
  const [batch, setBatch] = useState("Batch-A");
  const [date, setDate] = useState(getToday());
  const [attendance, setAttendance] = useState({});

  const students = useMemo(() => studentsByBatch[batch] || [], [batch]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(`att_${batch}_${date}`)) || {};
    const defaultAttendance = students.reduce((acc, student) => {
      acc[student.id] = saved[student.id] || "Present";
      return acc;
    }, {});
    setAttendance(defaultAttendance);
  }, [batch, date, students]);

  const percentage = useMemo(() => {
    if (!students.length) return 0;
    const presentCount = students.filter((s) => attendance[s.id] === "Present").length;
    return Math.round((presentCount / students.length) * 100);
  }, [attendance, students]);

  const handleStatusChange = (id, value) => {
    setAttendance((prev) => ({ ...prev, [id]: value }));
  };

  const saveAttendance = () => {
    localStorage.setItem(`att_${batch}_${date}`, JSON.stringify(attendance));
    alert("Attendance saved successfully!");
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", margin: 30, background: "#f4f6f9", color: "#333", minHeight: "100vh" }}>
      <div style={{ background: "white", padding: 20, borderRadius: 8, boxShadow: "0 2px 4px rgba(0,0,0,0.1)", maxWidth: 600, margin: "auto" }}>
        <h2>Trainer Attendance Dashboard</h2>

        <div style={{ display: "flex", gap: 15, marginBottom: 20 }}>
          <select
            value={batch}
            onChange={(e) => setBatch(e.target.value)}
            style={{ padding: 8, border: "1px solid #ccc", borderRadius: 4, flex: 1 }}
          >
            <option value="Batch-A">BCA Batch A</option>
            <option value="Batch-B">BCA Batch B</option>
          </select>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{ padding: 8, border: "1px solid #ccc", borderRadius: 4, flex: 1 }}
          />
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 15 }}>
          <thead>
            <tr>
              <th style={{ padding: 10, borderBottom: "1px solid #eee", textAlign: "left", background: "#f8f9fa" }}>Roll No</th>
              <th style={{ padding: 10, borderBottom: "1px solid #eee", textAlign: "left", background: "#f8f9fa" }}>Name</th>
              <th style={{ padding: 10, borderBottom: "1px solid #eee", textAlign: "left", background: "#f8f9fa" }}>Attendance</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td style={{ padding: 10, borderBottom: "1px solid #eee" }}>{student.id}</td>
                <td style={{ padding: 10, borderBottom: "1px solid #eee" }}>{student.name}</td>
                <td style={{ padding: 10, borderBottom: "1px solid #eee" }}>
                  <select
                    value={attendance[student.id] || "Present"}
                    onChange={(e) => handleStatusChange(student.id, e.target.value)}
                    style={{ padding: 8, border: "1px solid #ccc", borderRadius: 4, width: "100%" }}
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ fontWeight: "bold", color: "#0066cc", marginTop: 15, textAlign: "right" }}>Attendance: {percentage}%</div>
        <button
          onClick={saveAttendance}
          style={{ background: "#28a745", color: "white", border: "none", padding: "10px 15px", borderRadius: 4, cursor: "pointer", width: "100%", marginTop: 15 }}
        >
          Save Attendance
        </button>
      </div>
    </div>
  );
}
