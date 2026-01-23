import React, { useState, useEffect } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import { getEventBookings, isVendorLoggedIn, getStoredVendor } from "../../../utils/apiClient"

const EventBookings = () => {
  const navigate = useNavigate()
  const { id: eventId } = useParams()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [event, setEvent] = useState(null)
  const [vendor, setVendor] = useState(null)

  useEffect(() => {
    if (!isVendorLoggedIn()) {
      navigate("/fun-day/vendor/login")
      return
    }

    const vendorData = getStoredVendor()
    setVendor(vendorData)
    loadBookings()
  }, [navigate, eventId])

  const loadBookings = async () => {
    try {
      setLoading(true)
      const bookingsData = await getEventBookings(eventId)
      setBookings(bookingsData)

      // Extract event info from first booking if available
      if (bookingsData.length > 0 && bookingsData[0].event_title) {
        setEvent({
          title: bookingsData[0].event_title,
          event_date: bookingsData[0].event_date,
        })
      }
    } catch (err) {
      setError(err.message || "Failed to load bookings")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-KE", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const formatTime = (timeString) => {
    // Handle both HH:MM:SS and HH:MM formats
    const time = timeString?.split(":").slice(0, 2).join(":")
    return time || "N/A"
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
        <p style={{ color: "#64748b" }}>Loading bookings...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <button
          onClick={() => navigate("/fun-day/vendor/dashboard")}
          style={{
            background: "none",
            border: "none",
            color: "#7c3aed",
            cursor: "pointer",
            fontSize: "0.9rem",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            marginBottom: "12px",
            padding: 0,
          }}
        >
          ← Back to Dashboard
        </button>
        <h1 style={{ margin: "0 0 8px", fontSize: "1.5rem", fontWeight: 700, color: "#1e1b4b" }}>
          Event Bookings
        </h1>
        {event && (
          <p style={{ margin: 0, color: "#64748b" }}>
            {event.title} - {formatDate(event.event_date)}
          </p>
        )}
      </div>

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

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "16px",
            border: "1px solid #e5e7eb",
            textAlign: "center",
          }}
        >
          <p style={{ margin: "0 0 4px", fontSize: "0.8rem", color: "#64748b" }}>Total Bookings</p>
          <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700, color: "#1e1b4b" }}>
            {bookings.length}
          </p>
        </div>
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "16px",
            border: "1px solid #e5e7eb",
            textAlign: "center",
          }}
        >
          <p style={{ margin: "0 0 4px", fontSize: "0.8rem", color: "#64748b" }}>Children</p>
          <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700, color: "#1e1b4b" }}>
            {bookings.reduce((sum, b) => sum + (b.number_of_children || 1), 0)}
          </p>
        </div>
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "16px",
            border: "1px solid #e5e7eb",
            textAlign: "center",
          }}
        >
          <p style={{ margin: "0 0 4px", fontSize: "0.8rem", color: "#64748b" }}>Pending Payment</p>
          <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700, color: "#d97706" }}>
            {bookings.filter((b) => b.payment_status === "pending").length}
          </p>
        </div>
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "16px",
            border: "1px solid #e5e7eb",
            textAlign: "center",
          }}
        >
          <p style={{ margin: "0 0 4px", fontSize: "0.8rem", color: "#64748b" }}>Confirmed</p>
          <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700, color: "#16a34a" }}>
            {bookings.filter((b) => b.payment_status === "paid" || b.booking_status === "confirmed").length}
          </p>
        </div>
      </div>

      {/* Bookings List */}
      {bookings.length === 0 ? (
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "60px 20px",
            textAlign: "center",
            border: "1px solid #e5e7eb",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "16px" }}>📋</div>
          <h3 style={{ margin: "0 0 8px", fontSize: "1.1rem", color: "#1e293b" }}>
            No bookings yet
          </h3>
          <p style={{ margin: 0, color: "#64748b" }}>
            Parents haven't booked any spots for this event yet
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {bookings.map((booking) => (
            <div
              key={booking.id}
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "20px",
                border: "1px solid #e5e7eb",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <div>
                  <h3 style={{ margin: "0 0 4px", fontSize: "1.1rem", fontWeight: 600, color: "#1e293b" }}>
                    {booking.child_name}
                  </h3>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>
                    Age: {booking.child_age} years
                    {booking.child_gender && ` • ${booking.child_gender}`}
                    {booking.number_of_children > 1 && ` • ${booking.number_of_children} children`}
                  </p>
                </div>
                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: "20px",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    backgroundColor: booking.payment_status === "paid" ? "#dcfce7" : booking.payment_status === "failed" ? "#fee2e2" : "#fef3c7",
                    color: booking.payment_status === "paid" ? "#16a34a" : booking.payment_status === "failed" ? "#dc2626" : "#d97706",
                  }}
                >
                  {booking.payment_status === "paid" ? "Paid" : booking.payment_status === "failed" ? "Failed" : "Pending"}
                </span>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                  gap: "12px",
                  paddingTop: "12px",
                  borderTop: "1px solid #f3f4f6",
                }}
              >
                <div>
                  <p style={{ margin: "0 0 2px", fontSize: "0.75rem", color: "#9ca3af" }}>Parent Phone</p>
                  <p style={{ margin: 0, fontSize: "0.9rem", color: "#374151" }}>{booking.parent_phone}</p>
                </div>
                {booking.parent_email && (
                  <div>
                    <p style={{ margin: "0 0 2px", fontSize: "0.75rem", color: "#9ca3af" }}>Parent Email</p>
                    <p style={{ margin: 0, fontSize: "0.9rem", color: "#374151" }}>{booking.parent_email}</p>
                  </div>
                )}
                {booking.confirmation_code && (
                  <div>
                    <p style={{ margin: "0 0 2px", fontSize: "0.75rem", color: "#9ca3af" }}>Confirmation Code</p>
                    <p style={{ margin: 0, fontSize: "0.9rem", color: "#7c3aed", fontWeight: 600 }}>{booking.confirmation_code}</p>
                  </div>
                )}
                <div>
                  <p style={{ margin: "0 0 2px", fontSize: "0.75rem", color: "#9ca3af" }}>Booked On</p>
                  <p style={{ margin: 0, fontSize: "0.9rem", color: "#374151" }}>
                    {new Date(booking.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {booking.special_requests && (
                <div
                  style={{
                    marginTop: "12px",
                    padding: "12px",
                    backgroundColor: "#f9fafb",
                    borderRadius: "8px",
                  }}
                >
                  <p style={{ margin: "0 0 4px", fontSize: "0.75rem", color: "#9ca3af" }}>Special Requests</p>
                  <p style={{ margin: 0, fontSize: "0.9rem", color: "#374151" }}>{booking.special_requests}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default EventBookings
