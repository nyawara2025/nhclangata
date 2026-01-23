import React, { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { getMyRegistrations, getStoredUser, getStoredResidentId } from "../../../utils/apiClient"

const ParentBookings = () => {
  const navigate = useNavigate()
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState("upcoming")

  useEffect(() => {
    const userData = getStoredUser()
    setUser(userData)
    loadRegistrations()
  }, [])

  const loadRegistrations = async () => {
    try {
      setLoading(true)
      const data = await getMyRegistrations()
      setRegistrations(data)
    } catch (err) {
      setError(err.message || "Failed to load your registrations")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-KE", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
      case "paid":
        return { bg: "#dcfce7", color: "#16a34a" }
      case "pending":
        return { bg: "#fef3c7", color: "#d97706" }
      case "cancelled":
        return { bg: "#fee2e2", color: "#dc2626" }
      case "attended":
        return { bg: "#dbeafe", color: "#2563eb" }
      default:
        return { bg: "#f3f4f6", color: "#6b7280" }
    }
  }

  const today = new Date()
  const upcomingRegistrations = registrations.filter(
    (r) => new Date(r.event_date) >= today && !["cancelled"].includes(r.booking_status)
  )
  const pastRegistrations = registrations.filter(
    (r) => new Date(r.event_date) < today || ["cancelled", "attended"].includes(r.booking_status)
  )

  const displayRegistrations = activeTab === "upcoming" ? upcomingRegistrations : pastRegistrations

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <div
          style={{
            width: "48px",
            height: "48px",
            border: "4px solid #e5e7eb",
            borderTopColor: "#0891b2",
            borderRadius: "50%",
            margin: "0 auto 16px",
            animation: "spin 1s linear infinite",
          }}
        />
        <p style={{ color: "#64748b" }}>Loading your registrations...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ margin: "0 0 8px", fontSize: "1.5rem", fontWeight: 700, color: "#1e293b" }}>
          My Registrations
        </h1>
        <p style={{ margin: 0, color: "#64748b" }}>
          Manage your children's event bookings
        </p>
      </div>

      {/* Back Link */}
      <Link
        to="/fun-day/events"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          color: "#0891b2",
          textDecoration: "none",
          fontSize: "0.9rem",
          marginBottom: "20px",
        }}
      >
        ← Browse More Events
      </Link>

      {/* Error Message */}
      {error && (
        <div
          style={{
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "8px",
            padding: "12px 16px",
            marginBottom: "20px",
            color: "#dc2626",
          }}
        >
          {error}
        </div>
      )}

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "24px",
          borderBottom: "1px solid #e5e7eb",
          paddingBottom: "12px",
        }}
      >
        <button
          onClick={() => setActiveTab("upcoming")}
          style={{
            padding: "10px 20px",
            backgroundColor: activeTab === "upcoming" ? "#0891b2" : "transparent",
            border: "none",
            borderRadius: "8px",
            color: activeTab === "upcoming" ? "white" : "#64748b",
            fontSize: "0.9rem",
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          Upcoming ({upcomingRegistrations.length})
        </button>
        <button
          onClick={() => setActiveTab("past")}
          style={{
            padding: "10px 20px",
            backgroundColor: activeTab === "past" ? "#0891b2" : "transparent",
            border: "none",
            borderRadius: "8px",
            color: activeTab === "past" ? "white" : "#64748b",
            fontSize: "0.9rem",
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          Past ({pastRegistrations.length})
        </button>
      </div>

      {/* Registrations List */}
      {displayRegistrations.length === 0 ? (
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "60px 20px",
            textAlign: "center",
            border: "1px solid #e5e7eb",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "16px" }}>
            {activeTab === "upcoming" ? "📅" : "📋"}
          </div>
          <h3 style={{ margin: "0 0 8px", fontSize: "1.1rem", color: "#1e293b" }}>
            {activeTab === "upcoming" ? "No upcoming registrations" : "No past registrations"}
          </h3>
          <p style={{ margin: "0 0 20px", color: "#64748b" }}>
            {activeTab === "upcoming"
              ? "Browse our events and book some fun activities for your children!"
              : "Your past event registrations will appear here."}
          </p>
          {activeTab === "upcoming" && (
            <Link
              to="/fun-day/events"
              style={{
                display: "inline-block",
                padding: "12px 24px",
                backgroundColor: "#0891b2",
                color: "white",
                borderRadius: "8px",
                textDecoration: "none",
              }}
            >
              Browse Events
            </Link>
          )}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {displayRegistrations.map((registration) => {
            const statusColors = getStatusColor(registration.booking_status)
            return (
              <div
                key={registration.id}
                style={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                  padding: "20px",
                  border: "1px solid #e5e7eb",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <div>
                    <h3 style={{ margin: "0 0 8px", fontSize: "1.1rem", fontWeight: 600, color: "#1e293b" }}>
                      {registration.event_title}
                    </h3>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#64748b", fontSize: "0.9rem" }}>
                      <span>📅 {formatDate(registration.event_date)}</span>
                      <span>🕐 {registration.start_time}</span>
                    </div>
                    <div style={{ marginTop: "4px", color: "#64748b", fontSize: "0.9rem" }}>
                      📍 {registration.location}
                    </div>
                  </div>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: "20px",
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      backgroundColor: statusColors.bg,
                      color: statusColors.color,
                      textTransform: "capitalize",
                    }}
                  >
                    {registration.booking_status}
                  </span>
                </div>

                {/* Child Info */}
                <div
                  style={{
                    padding: "12px",
                    backgroundColor: "#f9fafb",
                    borderRadius: "8px",
                    marginBottom: "12px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "1.5rem" }}>👶</span>
                    <div>
                      <p style={{ margin: 0, fontWeight: 600, color: "#374151" }}>{registration.child_name}</p>
                      <p style={{ margin: "2px 0 0", fontSize: "0.85rem", color: "#64748b" }}>
                        {registration.child_age} years old
                        {registration.number_of_children > 1 && ` • ${registration.number_of_children} children`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingTop: "12px",
                    borderTop: "1px solid #f3f4f6",
                  }}
                >
                  <div>
                    <p style={{ margin: "0 0 2px", fontSize: "0.8rem", color: "#9ca3af" }}>Amount Paid</p>
                    <p style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#16a34a" }}>
                      {formatCurrency(registration.event_price * registration.number_of_children)}
                    </p>
                  </div>
                  {registration.confirmation_code && (
                    <div style={{ textAlign: "right" }}>
                      <p style={{ margin: "0 0 2px", fontSize: "0.8rem", color: "#9ca3af" }}>Confirmation</p>
                      <p style={{ margin: 0, fontSize: "0.9rem", fontWeight: 600, color: "#7c3aed" }}>
                        {registration.confirmation_code}
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {activeTab === "upcoming" && registration.booking_status !== "cancelled" && (
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      marginTop: "12px",
                      paddingTop: "12px",
                      borderTop: "1px solid #f3f4f6",
                    }}
                  >
                    <button
                      style={{
                        flex: 1,
                        padding: "10px",
                        backgroundColor: "#f3f4f6",
                        border: "none",
                        borderRadius: "6px",
                        color: "#374151",
                        fontSize: "0.85rem",
                        fontWeight: 500,
                        cursor: "pointer",
                      }}
                      onClick={() => alert("Contact vendor feature coming soon!")}
                    >
                      Contact Vendor
                    </button>
                    <button
                      style={{
                        flex: 1,
                        padding: "10px",
                        backgroundColor: "#fee2e2",
                        border: "none",
                        borderRadius: "6px",
                        color: "#dc2626",
                        fontSize: "0.85rem",
                        fontWeight: 500,
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        if (confirm("Are you sure you want to cancel this registration?")) {
                          // Cancel logic here
                        }
                      }}
                    >
                      Cancel Booking
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ParentBookings
