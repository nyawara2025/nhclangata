import React, { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"

const DriverDashboard = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [routes, setRoutes] = useState([])
  const [driverName, setDriverName] = useState("")
  const [activeTab, setActiveTab] = useState("upcoming")

  useEffect(() => {
    // Check authentication
    const driverId = localStorage.getItem("driver_id")
    if (!driverId) {
      navigate("/transport-driver/login")
      return
    }

    // Load driver info and routes
    loadRoutes()
  }, [navigate])

  const loadRoutes = async () => {
    try {
      setLoading(true)
      // Simulated data - replace with actual API call
      const mockRoutes = [
        {
          route_id: "RT-001",
          route_name: "Morning Route - Phase 1",
          vehicle: "KCJ 123X",
          start_time: "06:30 AM",
          student_count: 12,
          status: "upcoming",
          date: new Date().toISOString().split("T")[0],
          stops: [
            { stop_id: "S1", stop_name: "Main Gate", stop_order: 1 },
            { stop_id: "S2", stop_name: "House 45", stop_order: 2 },
            { stop_id: "S3", stop_name: "House 78", stop_order: 3 },
          ],
        },
        {
          route_id: "RT-002",
          route_name: "Afternoon Route - Phase 1",
          vehicle: "KCJ 123X",
          start_time: "03:00 PM",
          student_count: 10,
          status: "completed",
          date: new Date().toISOString().split("T")[0],
          stops: [],
        },
      ]
      setRoutes(mockRoutes)
      setDriverName("John Kamau")
    } catch (err) {
      console.error("Failed to load routes:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("driver_id")
    localStorage.removeItem("driver_token")
    navigate("/transport-driver/login")
  }

  const startTrip = (route) => {
    navigate(`/transport-driver/trip/${route.route_id}`, {
      state: { route },
    })
  }

  const filteredRoutes = routes.filter((route) => route.status === activeTab)

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <div
          style={{
            width: "48px",
            height: "48px",
            border: "4px solid #e5e7eb",
            borderTopColor: "#3b82f6",
            borderRadius: "50%",
            margin: "0 auto 16px",
            animation: "spin 1s linear infinite",
          }}
        />
        <p style={{ color: "#64748b" }}>Loading your routes...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <div>
          <h1 style={{ margin: "0 0 4px", fontSize: "1.5rem", fontWeight: 700, color: "#1e293b" }}>
            🚌 My Routes
          </h1>
          <p style={{ margin: 0, color: "#64748b" }}>Welcome, {driverName}</p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: "10px 16px",
            backgroundColor: "#f3f4f6",
            color: "#374151",
            border: "none",
            borderRadius: "8px",
            fontSize: "0.9rem",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      {/* Date Display */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "16px",
          marginBottom: "20px",
          border: "1px solid #e5e7eb",
        }}
      >
        <p style={{ margin: 0, fontSize: "0.9rem", color: "#64748b" }}>Today</p>
        <p style={{ margin: "4px 0 0", fontSize: "1.1rem", fontWeight: 600, color: "#1e293b" }}>
          {new Date().toLocaleDateString("en-KE", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "20px",
        }}
      >
        {["upcoming", "in_progress", "completed"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1,
              padding: "12px",
              backgroundColor: activeTab === tab ? "#3b82f6" : "#f3f4f6",
              color: activeTab === tab ? "white" : "#6b7280",
              border: "none",
              borderRadius: "8px",
              fontSize: "0.9rem",
              fontWeight: 500,
              cursor: "pointer",
              textTransform: "capitalize",
            }}
          >
            {tab.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Routes List */}
      {filteredRoutes.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "40px 20px",
            backgroundColor: "white",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
          }}
        >
          <p style={{ fontSize: "3rem", marginBottom: "12px" }}>📋</p>
          <p style={{ margin: 0, color: "#64748b" }}>No {activeTab.replace("_", " ")} routes</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {filteredRoutes.map((route) => (
            <div
              key={route.route_id}
              style={{
                backgroundColor: "white",
                borderRadius: "16px",
                padding: "20px",
                border: "1px solid #e5e7eb",
              }}
            >
              {/* Route Header */}
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                <div>
                  <h3 style={{ margin: "0 0 4px", fontSize: "1.1rem", fontWeight: 600, color: "#1e293b" }}>
                    {route.route_name}
                  </h3>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>
                    Vehicle: {route.vehicle}
                  </p>
                </div>
                <div
                  style={{
                    padding: "6px 12px",
                    backgroundColor: route.status === "completed" ? "#dcfce7" : "#dbeafe",
                    color: route.status === "completed" ? "#166534" : "#1e40af",
                    borderRadius: "20px",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    textTransform: "capitalize",
                  }}
                >
                  {route.status.replace("_", " ")}
                </div>
              </div>

              {/* Route Details */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                  marginBottom: "16px",
                  padding: "12px",
                  backgroundColor: "#f9fafb",
                  borderRadius: "8px",
                }}
              >
                <div>
                  <p style={{ margin: 0, fontSize: "0.75rem", color: "#9ca3af" }}>Start Time</p>
                  <p style={{ margin: "2px 0 0", fontSize: "1rem", fontWeight: 600, color: "#374151" }}>
                    {route.start_time}
                  </p>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: "0.75rem", color: "#9ca3af" }}>Students</p>
                  <p style={{ margin: "2px 0 0", fontSize: "1rem", fontWeight: 600, color: "#374151" }}>
                    {route.student_count}
                  </p>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: "0.75rem", color: "#9ca3af" }}>Stops</p>
                  <p style={{ margin: "2px 0 0", fontSize: "1rem", fontWeight: 600, color: "#374151" }}>
                    {route.stops.length}
                  </p>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: "0.75rem", color: "#9ca3af" }}>Date</p>
                  <p style={{ margin: "2px 0 0", fontSize: "1rem", fontWeight: 600, color: "#374151" }}>
                    {route.date}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              {route.status === "upcoming" && (
                <button
                  onClick={() => startTrip(route)}
                  style={{
                    width: "100%",
                    padding: "14px",
                    backgroundColor: "#3b82f6",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "1rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Start Trip
                </button>
              )}
              {route.status === "in_progress" && (
                <button
                  onClick={() => startTrip(route)}
                  style={{
                    width: "100%",
                    padding: "14px",
                    backgroundColor: "#10b981",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "1rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Continue Trip
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DriverDashboard
