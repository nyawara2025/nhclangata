import React, { useState, useEffect } from "react"
import { useNavigate, useParams, useLocation, Link } from "react-router-dom"

const ActiveTrip = () => {
  const { routeId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const route = location.state?.route || {
    route_id: routeId,
    route_name: "Morning Route - Phase 1",
    vehicle: "KCJ 123X",
    start_time: "06:30 AM",
    student_count: 12,
    stops: [
      {
        stop_id: "S1",
        stop_name: "Main Gate",
        stop_order: 1,
        scheduled_time: "06:45 AM",
        students: [
          { student_id: "ST-001", name: "Emma Johnson", grade: "Grade 4" },
          { student_id: "ST-002", name: "Liam Smith", grade: "Grade 3" },
        ],
      },
      {
        stop_id: "S2",
        stop_name: "House 45",
        stop_order: 2,
        scheduled_time: "06:55 AM",
        students: [
          { student_id: "ST-003", name: "Olivia Brown", grade: "Grade 5" },
        ],
      },
      {
        stop_id: "S3",
        stop_name: "House 78",
        stop_order: 3,
        scheduled_time: "07:05 AM",
        students: [
          { student_id: "ST-004", name: "Noah Davis", grade: "Grade 4" },
          { student_id: "ST-005", name: "Ava Wilson", grade: "Grade 2" },
        ],
      },
    ],
  }

  const [tripStatus, setTripStatus] = useState("not_started") // not_started, in_progress, completed
  const [currentStopIndex, setCurrentStopIndex] = useState(0)
  const [studentStatus, setStudentStatus] = useState({})
  const [loading, setLoading] = useState(false)
  const [showIssueModal, setShowIssueModal] = useState(false)
  const [issueType, setIssueType] = useState("")
  const [issueNotes, setIssueNotes] = useState("")

  const currentStop = route.stops[currentStopIndex]
  const completedStops = route.stops.filter((_, index) => index < currentStopIndex)

  const handleStartTrip = () => {
    setTripStatus("in_progress")
  }

  const handleArriveAtStop = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    setLoading(false)
  }

  const handleDepartStop = () => {
    if (currentStopIndex < route.stops.length - 1) {
      setCurrentStopIndex(currentStopIndex + 1)
    } else {
      setTripStatus("completed")
    }
  }

  const toggleStudentStatus = (studentId) => {
    setStudentStatus((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === "boarded" ? "absent" : "boarded",
    }))
  }

  const handleReportIssue = async () => {
    if (!issueType) return

    setLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    setLoading(false)
    setShowIssueModal(false)
    setIssueType("")
    setIssueNotes("")
    alert("Issue reported successfully")
  }

  const boardedCount = Object.values(studentStatus).filter((s) => s === "boarded").length
  const totalStudents = currentStop?.students?.length || 0

  if (tripStatus === "completed") {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            backgroundColor: "#dcfce7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
            fontSize: "2.5rem",
          }}
        >
          ✓
        </div>
        <h2 style={{ margin: "0 0 12px", fontSize: "1.5rem", fontWeight: 700, color: "#166534" }}>
          Trip Completed!
        </h2>
        <p style={{ margin: "0 0 24px", color: "#64748b" }}>
          All stops have been completed successfully.
        </p>
        <button
          onClick={() => navigate("/transport-driver/dashboard")}
          style={{
            padding: "16px 32px",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "12px",
            fontSize: "1rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Back to Dashboard
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "20px" }}>
        <Link
          to="/transport-driver/dashboard"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            color: "#64748b",
            textDecoration: "none",
            fontSize: "0.9rem",
            marginBottom: "16px",
          }}
        >
          ← Back
        </Link>
        <h1 style={{ margin: "0 0 8px", fontSize: "1.25rem", fontWeight: 700, color: "#1e293b" }}>
          {route.route_name}
        </h1>
        <p style={{ margin: 0, color: "#64748b", fontSize: "0.9rem" }}>
          {route.vehicle} • {currentStopIndex + 1} of {route.stops.length} stops
        </p>
      </div>

      {/* Trip Progress */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "16px",
          marginBottom: "20px",
          border: "1px solid #e5e7eb",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
          <span style={{ fontSize: "0.85rem", color: "#64748b" }}>Trip Progress</span>
          <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#3b82f6" }}>
            {Math.round((currentStopIndex / route.stops.length) * 100)}%
          </span>
        </div>
        <div
          style={{
            height: "8px",
            backgroundColor: "#e5e7eb",
            borderRadius: "4px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${(currentStopIndex / route.stops.length) * 100}%`,
              backgroundColor: "#3b82f6",
              transition: "width 0.3s ease",
            }}
          />
        </div>
      </div>

      {/* Current Stop Card */}
      {tripStatus === "not_started" ? (
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "20px",
            border: "1px solid #e5e7eb",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "12px",
              backgroundColor: "#dbeafe",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              fontSize: "1.75rem",
            }}
          >
            🚌
          </div>
          <h2 style={{ margin: "0 0 8px", fontSize: "1.25rem", fontWeight: 600, color: "#1e293b" }}>
            Ready to Start?
          </h2>
          <p style={{ margin: "0 0 24px", color: "#64748b" }}>
            Route: {route.route_name}
            <br />
            Start Time: {route.start_time}
            <br />
            {route.student_count} students assigned
          </p>
          <button
            onClick={handleStartTrip}
            style={{
              width: "100%",
              padding: "16px",
              backgroundColor: "#10b981",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "1.1rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Start Trip
          </button>
        </div>
      ) : (
        <>
          {/* Current Stop Info */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "16px",
              padding: "20px",
              marginBottom: "20px",
              border: "2px solid #3b82f6",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div>
                <h3 style={{ margin: "0 0 4px", fontSize: "1.25rem", fontWeight: 700, color: "#1e293b" }}>
                  Stop {currentStop.stop_order}: {currentStop.stop_name}
                </h3>
                <p style={{ margin: 0, color: "#64748b" }}>Scheduled: {currentStop.scheduled_time}</p>
              </div>
              <button
                onClick={() => setShowIssueModal(true)}
                style={{
                  padding: "8px 12px",
                  backgroundColor: "#fef2f2",
                  color: "#dc2626",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                }}
              >
                Report Issue
              </button>
            </div>

            {/* Arrival Status */}
            <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
              <button
                onClick={handleArriveAtStop}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: "14px",
                  backgroundColor: "#3b82f6",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "1rem",
                  fontWeight: 600,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Processing..." : "Arrived at Stop"}
              </button>
            </div>

            {/* Student List */}
            {currentStop.students && currentStop.students.length > 0 && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: 600, color: "#1e293b" }}>
                    Students ({boardedCount}/{totalStudents} boarded)
                  </h4>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {currentStop.students.map((student) => (
                    <div
                      key={student.student_id}
                      onClick={() => toggleStudentStatus(student.student_id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "14px 16px",
                        backgroundColor: studentStatus[student.student_id] === "boarded" ? "#dcfce7" : "#f9fafb",
                        borderRadius: "10px",
                        cursor: "pointer",
                        border: `2px solid ${studentStatus[student.student_id] === "boarded" ? "#10b981" : "transparent"}`,
                      }}
                    >
                      <div>
                        <p style={{ margin: 0, fontWeight: 600, color: "#1e293b" }}>{student.name}</p>
                        <p style={{ margin: "2px 0 0", fontSize: "0.85rem", color: "#64748b" }}>{student.grade}</p>
                      </div>
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          backgroundColor: studentStatus[student.student_id] === "boarded" ? "#10b981" : "#d1d5db",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: "1rem",
                        }}
                      >
                        {studentStatus[student.student_id] === "boarded" ? "✓" : "○"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Depart Button */}
            <button
              onClick={handleDepartStop}
              style={{
                width: "100%",
                padding: "16px",
                marginTop: "20px",
                backgroundColor: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontSize: "1rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {currentStopIndex < route.stops.length - 1 ? "Depart Stop" : "Complete Trip"}
            </button>
          </div>

          {/* Completed Stops */}
          {completedStops.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <h4 style={{ margin: "0 0 12px", fontSize: "1rem", fontWeight: 600, color: "#1e293b" }}>
                Completed Stops
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {completedStops.map((stop) => (
                  <div
                    key={stop.stop_id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "12px 16px",
                      backgroundColor: "#f3f4f6",
                      borderRadius: "8px",
                    }}
                  >
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        backgroundColor: "#10b981",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontSize: "0.75rem",
                      }}
                    >
                      ✓
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontWeight: 500, color: "#374151" }}>{stop.stop_name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Issue Report Modal */}
      {showIssueModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "16px",
              padding: "24px",
              width: "100%",
              maxWidth: "400px",
            }}
          >
            <h3 style={{ margin: "0 0 20px", fontSize: "1.25rem", fontWeight: 600, color: "#1e293b" }}>
              Report Issue
            </h3>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: 500, color: "#374151" }}>
                Issue Type
              </label>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  fontSize: "1rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  backgroundColor: "white",
                }}
              >
                <option value="">Select issue type</option>
                <option value="traffic">Heavy Traffic</option>
                <option value="breakdown">Vehicle Breakdown</option>
                <option value="delay">Weather Delay</option>
                <option value="student">Student Issue</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: 500, color: "#374151" }}>
                Notes (optional)
              </label>
              <textarea
                value={issueNotes}
                onChange={(e) => setIssueNotes(e.target.value)}
                placeholder="Add details about the issue..."
                rows={3}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  fontSize: "1rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  resize: "vertical",
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => setShowIssueModal(false)}
                style={{
                  flex: 1,
                  padding: "14px",
                  backgroundColor: "#f3f4f6",
                  color: "#374151",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "1rem",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleReportIssue}
                disabled={!issueType || loading}
                style={{
                  flex: 1,
                  padding: "14px",
                  backgroundColor: !issueType || loading ? "#9ca3af" : "#dc2626",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "1rem",
                  fontWeight: 600,
                  cursor: !issueType || loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Reporting..." : "Report"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ActiveTrip
