import React, { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { getStoredUser, getStoredResidentId } from "../../utils/apiClient"

const SchoolTransport = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [transportData, setTransportData] = useState(null)
  const [activeTab, setActiveTab] = useState("morning") // "morning" or "afternoon"
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = getStoredUser()
    setUser(userData)
    loadTransportData()
  }, [])

  const loadTransportData = async () => {
    try {
      setLoading(true)
      // Simulated data - replace with actual API call
      const mockData = {
        hasAssignment: true,
        vendor: {
          company_name: "NHC Transport Services",
          driver_name: "John Kamau",
          driver_phone: "+254700000000",
          vehicle_number: "KCJ 123X",
          vehicle_type: "van",
          route_name: "Route A - Phase 1"
        },
        assignment: {
          child_name: "Emma Johnson",
          grade: "Grade 4",
          pickup_address: "House 45, Phase 1",
          dropoff_school: "Nairobi Academy",
          morning_pickup_time: "06:30 AM",
          afternoon_dropoff_time: "03:30 PM"
        },
        morningTracking: [
          {
            step: "depart_home",
            label: "Depart Home",
            scheduled_time: "06:30 AM",
            actual_time: "06:32 AM",
            status: "completed",
            gps_latitude: -1.286389,
            gps_longitude: 36.817223,
            is_manual: false
          },
          {
            step: "arrive_school",
            label: "Arrive School",
            scheduled_time: "07:15 AM",
            actual_time: "07:12 AM",
            status: "completed",
            gps_latitude: -1.2921,
            gps_longitude: 36.8219,
            is_manual: false
          },
          {
            step: "depart_school",
            label: "Depart School",
            scheduled_time: "03:00 PM",
            actual_time: null,
            status: "pending",
            gps_latitude: null,
            gps_longitude: null,
            is_manual: false
          },
          {
            step: "arrive_home",
            label: "Arrive Home",
            scheduled_time: "04:00 PM",
            actual_time: null,
            status: "pending",
            gps_latitude: null,
            gps_longitude: null,
            is_manual: false
          }
        ],
        afternoonTracking: [
          {
            step: "depart_home",
            label: "Depart Home",
            scheduled_time: "06:30 AM",
            actual_time: "06:28 AM",
            status: "completed",
            gps_latitude: -1.286389,
            gps_longitude: 36.817223,
            is_manual: false
          },
          {
            step: "arrive_school",
            label: "Arrive School",
            scheduled_time: "07:15 AM",
            actual_time: "07:10 AM",
            status: "completed",
            gps_latitude: -1.2921,
            gps_longitude: 36.8219,
            is_manual: false
          },
          {
            step: "depart_school",
            label: "Depart School",
            scheduled_time: "03:00 PM",
            actual_time: "03:05 PM",
            status: "completed",
            gps_latitude: -1.2921,
            gps_longitude: 36.8219,
            is_manual: false
          },
          {
            step: "arrive_home",
            label: "Arrive Home",
            scheduled_time: "04:00 PM",
            actual_time: null,
            status: "pending",
            gps_latitude: null,
            gps_longitude: null,
            is_manual: false
          }
        ],
        delays: [],
        lastUpdated: new Date().toISOString()
      }
      setTransportData(mockData)
    } catch (err) {
      setError(err.message || "Failed to load transport details")
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (timeStr) => {
    if (!timeStr) return "--:--"
    return timeStr
  }

  const getStepStatus = (step, trackingData) => {
    const stepIndex = ["depart_home", "arrive_school", "depart_school", "arrive_home"].indexOf(step)
    const completedCount = trackingData.filter(t => t.status === "completed").length

    if (stepIndex < completedCount) return "completed"
    if (stepIndex === completedCount) return "active"
    return "pending"
  }

  const handleCallDriver = () => {
    if (transportData?.vendor?.driver_phone) {
      window.location.href = `tel:${transportData.vendor.driver_phone}`
    }
  }

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
        <p style={{ color: "#64748b" }}>Loading transport details...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <div style={{ fontSize: "3rem", marginBottom: "16px" }}>😕</div>
        <h3 style={{ margin: "0 0 8px", color: "#dc2626" }}>Unable to load</h3>
        <p style={{ margin: "0 0 20px", color: "#64748b" }}>{error}</p>
        <button
          onClick={loadTransportData}
          style={{
            padding: "12px 24px",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Try Again
        </button>
      </div>
    )
  }

  if (!transportData?.hasAssignment) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <div style={{ fontSize: "4rem", marginBottom: "16px" }}>🚌</div>
        <h2 style={{ margin: "0 0 12px", fontSize: "1.25rem", color: "#1e293b" }}>
          No Transport Assigned
        </h2>
        <p style={{ margin: "0 0 24px", color: "#64748b", maxWidth: "300px", marginInline: "auto" }}>
          Your child doesn't have school transport assigned yet. Please contact the admin office.
        </p>
        <Link
          to="/our-children"
          style={{
            display: "inline-block",
            padding: "12px 24px",
            backgroundColor: "#3b82f6",
            color: "white",
            borderRadius: "8px",
            textDecoration: "none",
          }}
        >
          Back to Our Children
        </Link>
      </div>
    )
  }

  const currentTracking = activeTab === "morning" ? transportData.morningTracking : transportData.afternoonTracking
  const isMorning = activeTab === "morning"

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ margin: "0 0 8px", fontSize: "1.5rem", fontWeight: 700, color: "#1e293b" }}>
          🚌 School Transport
        </h1>
        <p style={{ margin: 0, color: "#64748b", fontSize: "0.9rem" }}>
          Track your child's daily school transport
        </p>
      </div>

      {/* Delay Alert */}
      {transportData.delays && transportData.delays.length > 0 && (
        <div
          style={{
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "12px",
            padding: "16px",
            marginBottom: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <span style={{ fontSize: "1.5rem" }}>⚠️</span>
            <div>
              <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 600, color: "#dc2626" }}>
                Delay Reported
              </h3>
              <p style={{ margin: "4px 0 0", fontSize: "0.85rem", color: "#991b1b" }}>
                Estimated delay: {transportData.delays[0].estimated_delay_minutes} minutes
              </p>
            </div>
          </div>
          {transportData.delays[0].delay_reason && (
            <p style={{ margin: "8px 0 0", fontSize: "0.85rem", color: "#dc2626" }}>
              Reason: {transportData.delays[0].delay_reason}
            </p>
          )}
        </div>
      )}

      {/* Vendor Card */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "20px",
          marginBottom: "20px",
          border: "1px solid #e5e7eb",
        }}
      >
        <h3 style={{ margin: "0 0 16px", fontSize: "1rem", fontWeight: 600, color: "#1e293b" }}>
          Transport Vendor
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "12px",
              backgroundColor: "#dbeafe",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.75rem",
            }}
          >
            🚌
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ margin: "0 0 4px", fontSize: "1.1rem", fontWeight: 600, color: "#1e293b" }}>
              {transportData.vendor.company_name}
            </h4>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>
              {transportData.vendor.vehicle_type} • {transportData.vendor.vehicle_number}
            </p>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px",
            backgroundColor: "#f9fafb",
            borderRadius: "8px",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "#e0e7ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.25rem",
            }}
          >
            👤
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>Driver</p>
            <p style={{ margin: 0, fontWeight: 600, color: "#374151" }}>{transportData.vendor.driver_name}</p>
          </div>
          <button
            onClick={handleCallDriver}
            style={{
              padding: "10px 16px",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "0.85rem",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            📞 Call
          </button>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingTop: "12px",
            borderTop: "1px solid #f3f4f6",
          }}
        >
          <div>
            <p style={{ margin: 0, fontSize: "0.75rem", color: "#9ca3af" }}>Route</p>
            <p style={{ margin: "2px 0 0", fontSize: "0.85rem", fontWeight: 500, color: "#374151" }}>
              {transportData.vendor.route_name}
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ margin: 0, fontSize: "0.75rem", color: "#9ca3af" }}>Student</p>
            <p style={{ margin: "2px 0 0", fontSize: "0.85rem", fontWeight: 500, color: "#374151" }}>
              {transportData.assignment.child_name}
            </p>
          </div>
        </div>
      </div>

      {/* Child Info */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "20px",
          marginBottom: "20px",
          border: "1px solid #e5e7eb",
        }}
      >
        <h3 style={{ margin: "0 0 12px", fontSize: "1rem", fontWeight: 600, color: "#1e293b" }}>
          Pickup Details
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "1.25rem" }}>📍</span>
            <div>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>Pickup Address</p>
              <p style={{ margin: "2px 0 0", fontSize: "0.95rem", color: "#374151" }}>
                {transportData.assignment.pickup_address}
              </p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "1.25rem" }}>🏫</span>
            <div>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>School</p>
              <p style={{ margin: "2px 0 0", fontSize: "0.95rem", color: "#374151" }}>
                {transportData.assignment.dropoff_school}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AM/PM Toggle */}
      <div
        style={{
          display: "flex",
          backgroundColor: "#f3f4f6",
          borderRadius: "12px",
          padding: "4px",
          marginBottom: "20px",
        }}
      >
        <button
          onClick={() => setActiveTab("morning")}
          style={{
            flex: 1,
            padding: "12px",
            backgroundColor: activeTab === "morning" ? "white" : "transparent",
            border: "none",
            borderRadius: "10px",
            color: activeTab === "morning" ? "#1e293b" : "#6b7280",
            fontSize: "0.9rem",
            fontWeight: 500,
            cursor: "pointer",
            boxShadow: activeTab === "morning" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
            transition: "all 0.2s",
          }}
        >
          🌅 Morning (To School)
        </button>
        <button
          onClick={() => setActiveTab("afternoon")}
          style={{
            flex: 1,
            padding: "12px",
            backgroundColor: activeTab === "afternoon" ? "white" : "transparent",
            border: "none",
            borderRadius: "10px",
            color: activeTab === "afternoon" ? "#1e293b" : "#6b7280",
            fontSize: "0.9rem",
            fontWeight: 500,
            cursor: "pointer",
            boxShadow: activeTab === "afternoon" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
            transition: "all 0.2s",
          }}
        >
          🌇 Afternoon (To Home)
        </button>
      </div>

      {/* Timeline Card */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "20px",
          marginBottom: "20px",
          border: "1px solid #e5e7eb",
        }}
      >
        <h3 style={{ margin: "0 0 20px", fontSize: "1rem", fontWeight: 600, color: "#1e293b" }}>
          {isMorning ? "Morning Trip" : "Afternoon Trip"} - {new Date().toLocaleDateString("en-KE", { weekday: "long", month: "short", day: "numeric" })}
        </h3>

        <div style={{ position: "relative" }}>
          {currentTracking.map((step, index) => {
            const status = getStepStatus(step.step, currentTracking)
            const isLast = index === currentTracking.length - 1

            return (
              <div key={step.step} style={{ display: "flex", gap: "16px", paddingBottom: isLast ? 0 : "24px" }}>
                {/* Timeline Line */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      backgroundColor:
                        status === "completed"
                          ? "#10b981"
                          : status === "active"
                          ? "#3b82f6"
                          : "#e5e7eb",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.25rem",
                      zIndex: 1,
                    }}
                  >
                    {status === "completed" ? "✓" : status === "active" ? "🔵" : "○"}
                  </div>
                  {!isLast && (
                    <div
                      style={{
                        width: "2px",
                        flex: 1,
                        backgroundColor: status === "completed" ? "#10b981" : "#e5e7eb",
                        marginTop: "4px",
                      }}
                    />
                  )}
                </div>

                {/* Content */}
                <div style={{ flex: 1, paddingTop: "4px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <h4
                        style={{
                          margin: "0 0 4px",
                          fontSize: "1rem",
                          fontWeight: 600,
                          color: status === "pending" ? "#9ca3af" : "#1e293b",
                        }}
                      >
                        {step.label}
                      </h4>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span
                          style={{
                            fontSize: "1.1rem",
                            fontWeight: 700,
                            color: status === "pending" ? "#9ca3af" : "#3b82f6",
                          }}
                        >
                          {formatTime(step.actual_time || step.scheduled_time)}
                        </span>
                        {step.is_manual && step.status === "completed" && (
                          <span
                            style={{
                              fontSize: "0.7rem",
                              padding: "2px 6px",
                              backgroundColor: "#fef3c7",
                              color: "#d97706",
                              borderRadius: "4px",
                            }}
                          >
                            Manual
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ margin: 0, fontSize: "0.75rem", color: "#9ca3af" }}>
                        {step.actual_time ? "Actual" : "Scheduled"}
                      </p>
                      <p style={{ margin: "2px 0 0", fontSize: "0.85rem", color: "#64748b" }}>
                        {formatTime(step.scheduled_time)}
                      </p>
                    </div>
                  </div>

                  {/* GPS Info */}
                  {step.gps_latitude && step.status === "completed" && (
                    <div
                      style={{
                        marginTop: "8px",
                        padding: "8px 12px",
                        backgroundColor: "#f0fdf4",
                        borderRadius: "8px",
                        display: "inline-block",
                      }}
                    >
                      <p style={{ margin: 0, fontSize: "0.75rem", color: "#166534" }}>
                        📍 GPS: {step.gps_latitude.toFixed(4)}, {step.gps_longitude.toFixed(4)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Back Link */}
      <Link
        to="/our-children"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          color: "#64748b",
          textDecoration: "none",
          fontSize: "0.9rem",
        }}
      >
        ← Back to Our Children
      </Link>

      {/* Last Updated */}
      <p
        style={{
          marginTop: "24px",
          textAlign: "center",
          fontSize: "0.75rem",
          color: "#9ca3af",
        }}
      >
        Last updated: {transportData.lastUpdated ? new Date(transportData.lastUpdated).toLocaleTimeString() : "--:--"}
      </p>
    </div>
  )
}

export default SchoolTransport
