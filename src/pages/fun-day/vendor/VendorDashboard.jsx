import React, { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { getVendorEvents, getVendorStats, updateEventStatus, isVendorLoggedIn, getStoredVendor } from "../../../utils/apiClient"

const VendorDashboard = () => {
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [stats, setStats] = useState({ total_events: 0, total_bookings: 0, total_revenue: 0 })
  const [loading, setLoading] = useState(true)
  const [vendor, setVendor] = useState(null)

  useEffect(() => {
    // Check authentication
    if (!isVendorLoggedIn()) {
      navigate("/fun-day/vendor/login")
      return
    }

    const vendorData = getStoredVendor()
    setVendor(vendorData)
    loadData()
  }, [navigate])

  const loadData = async () => {
    try {
      setLoading(true)
      const [eventsData, statsData] = await Promise.all([
        getVendorEvents(),
        getVendorStats(),
      ])
      setEvents(Array.isArray(eventsData) ? eventsData : [])
      setStats(statsData || { total_events: 0, total_bookings: 0, total_revenue: 0 })
    } catch (err) {
      // Silently fail - show empty state instead of error
      console.warn("Failed to load dashboard data:", err.message)
      setEvents([])
      setStats({ total_events: 0, total_bookings: 0, total_revenue: 0 })
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (eventId, newStatus) => {
    try {
      await updateEventStatus(eventId, newStatus)
      // Refresh events
      loadData()
    } catch (err) {
      alert(err.message || "Failed to update event status")
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
      case "active":
        return { bg: "#dcfce7", color: "#16a34a" }
      case "paused":
        return { bg: "#fef3c7", color: "#d97706" }
      case "cancelled":
        return { bg: "#fee2e2", color: "#dc2626" }
      case "completed":
        return { bg: "#e0e7ff", color: "#4f46e5" }
      case "sold_out":
        return { bg: "#fce7f3", color: "#db2777" }
      default:
        return { bg: "#f3f4f6", color: "#6b7280" }
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
            borderTopColor: "#7c3aed",
            borderRadius: "50%",
            margin: "0 auto 16px",
            animation: "spin 1s linear infinite",
          }}
        />
        <p style={{ color: "#64748b" }}>Loading dashboard...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ margin: "0 0 8px", fontSize: "1.5rem", fontWeight: 700, color: "#1e1b4b" }}>
          Welcome back{vendor ? `, ${vendor.company_name}` : ""}! 👋
        </h1>
        <p style={{ margin: 0, color: "#64748b" }}>
          Manage your holiday and weekend fun events
        </p>
      </div>

      {/* Stats Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "20px",
            border: "1px solid #e5e7eb",
          }}
        >
          <p style={{ margin: "0 0 4px", fontSize: "0.85rem", color: "#64748b" }}>
            Total Events
          </p>
          <p style={{ margin: 0, fontSize: "1.75rem", fontWeight: 700, color: "#1e1b4b" }}>
            {stats.total_events}
          </p>
        </div>
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "20px",
            border: "1px solid #e5e7eb",
          }}
        >
          <p style={{ margin: "0 0 4px", fontSize: "0.85rem", color: "#64748b" }}>
            Total Bookings
          </p>
          <p style={{ margin: 0, fontSize: "1.75rem", fontWeight: 700, color: "#1e1b4b" }}>
            {stats.total_bookings}
          </p>
        </div>
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "20px",
            border: "1px solid #e5e7eb",
          }}
        >
          <p style={{ margin: "0 0 4px", fontSize: "0.85rem", color: "#64748b" }}>
            Revenue
          </p>
          <p style={{ margin: 0, fontSize: "1.75rem", fontWeight: 700, color: "#16a34a" }}>
            {formatCurrency(stats.total_revenue)}
          </p>
        </div>
      </div>

      {/* Create Event Button */}
      <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 600, color: "#1e293b" }}>
          Your Events
        </h2>
        <Link
          to="/fun-day/vendor/events/new"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 20px",
            backgroundColor: "#7c3aed",
            color: "white",
            borderRadius: "8px",
            textDecoration: "none",
            fontSize: "0.9rem",
            fontWeight: 500,
          }}
        >
          <span>+</span> Create Event
        </Link>
      </div>

      {/* Events List */}
      {events.length === 0 ? (
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "60px 20px",
            textAlign: "center",
            border: "1px solid #e5e7eb",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "16px" }}>📅</div>
          <h3 style={{ margin: "0 0 8px", fontSize: "1.1rem", color: "#1e293b" }}>
            No events yet
          </h3>
          <p style={{ margin: "0 0 20px", color: "#64748b" }}>
            Create your first holiday or weekend fun day event
          </p>
          <Link
            to="/fun-day/vendor/events/new"
            style={{
              display: "inline-block",
              padding: "12px 24px",
              backgroundColor: "#7c3aed",
              color: "white",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Create Your First Event
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {events.map((event) => {
            const statusColors = getStatusColor(event.status)
            return (
              <div
                key={event.id}
                style={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                  padding: "20px",
                  border: "1px solid #e5e7eb",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                      <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 600, color: "#1e293b" }}>
                        {event.title}
                      </h3>
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
                        {event.status}
                      </span>
                    </div>
                    <p style={{ margin: 0, color: "#64748b", fontSize: "0.9rem" }}>
                      {formatDate(event.event_date)} • {event.start_time} - {event.end_time}
                    </p>
                    <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: "0.9rem" }}>
                      📍 {event.location}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700, color: "#16a34a" }}>
                      {formatCurrency(event.price)}
                    </p>
                    <p style={{ margin: "4px 0 0", fontSize: "0.85rem", color: "#64748b" }}>
                      {event.current_registrations || 0} / {event.capacity_limit} booked
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div
                  style={{
                    height: "6px",
                    backgroundColor: "#e5e7eb",
                    borderRadius: "3px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${Math.min(((event.current_registrations || 0) / event.capacity_limit) * 100, 100)}%`,
                      height: "100%",
                      backgroundColor: event.current_registrations >= event.capacity_limit ? "#dc2626" : "#7c3aed",
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>

                {/* Actions */}
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    flexWrap: "wrap",
                    paddingTop: "8px",
                    borderTop: "1px solid #f3f4f6",
                  }}
                >
                  <Link
                    to={`/fun-day/vendor/events/${event.id}/bookings`}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#f3f4f6",
                      color: "#374151",
                      borderRadius: "6px",
                      textDecoration: "none",
                      fontSize: "0.85rem",
                      fontWeight: 500,
                    }}
                  >
                    View Bookings
                  </Link>

                  <select
                    value={event.status}
                    onChange={(e) => handleStatusChange(event.id, e.target.value)}
                    style={{
                      padding: "8px 12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "6px",
                      fontSize: "0.85rem",
                      cursor: "pointer",
                    }}
                  >
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default VendorDashboard
