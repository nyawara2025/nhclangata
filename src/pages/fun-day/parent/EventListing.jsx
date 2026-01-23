import React, { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { getUpcomingEvents, getStoredUser } from "../../../utils/apiClient"

const EventListing = () => {
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = getStoredUser()
    setUser(userData)
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      setLoading(true)
      const data = await getUpcomingEvents()
      setEvents(data)
    } catch (err) {
      setError(err.message || "Failed to load events")
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
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getActivityIcons = (activityTypes) => {
    if (!activityTypes || activityTypes.length === 0) return "🎪"

    const iconMap = {
      bouncing_castle: "🏰",
      face_painting: "🎨",
      games: "🎯",
      arts_crafts: "✂️",
      magic_show: "🎭",
      clown: "🤡",
      music_dance: "💃",
      balloons: "🎈",
      food: "🍕",
      other: "🎪",
    }

    return activityTypes.slice(0, 3).map((type) => iconMap[type] || "🎪").join(" ")
  }

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
        <p style={{ color: "#64748b" }}>Loading fun events...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ margin: "0 0 8px", fontSize: "1.5rem", fontWeight: 700, color: "#1e293b" }}>
          🎪 Holiday & Weekend Fun!
        </h1>
        <p style={{ margin: 0, color: "#64748b" }}>
          Amazing activities for your children in our community
        </p>
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

      {/* Events Grid */}
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
          <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🎈</div>
          <h3 style={{ margin: "0 0 8px", fontSize: "1.1rem", color: "#1e293b" }}>
            No upcoming events
          </h3>
          <p style={{ margin: 0, color: "#64748b" }}>
            Check back soon for exciting holiday and weekend activities!
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "16px",
          }}
        >
          {events.map((event) => (
            <Link
              key={event.id}
              to={`/fun-day/events/${event.id}`}
              style={{
                display: "block",
                textDecoration: "none",
                backgroundColor: "white",
                borderRadius: "16px",
                overflow: "hidden",
                border: "1px solid #e5e7eb",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
            >
              {/* Event Image */}
              <div
                style={{
                  height: "140px",
                  backgroundColor: "#f3f4f6",
                  backgroundImage: event.image_url ? `url(${event.image_url})` : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  position: "relative",
                }}
              >
                {!event.image_url && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "3rem",
                    }}
                  >
                    {getActivityIcons(event.activity_types)}
                  </div>
                )}

                {/* Price Badge */}
                <div
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    backgroundColor: "white",
                    padding: "6px 12px",
                    borderRadius: "20px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                >
                  <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "#16a34a" }}>
                    {formatCurrency(event.price)}
                  </span>
                </div>

                {/* Status Badge */}
                {event.spots_remaining <= 5 && event.spots_remaining > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      top: "12px",
                      left: "12px",
                      backgroundColor: "#fef3c7",
                      padding: "4px 10px",
                      borderRadius: "20px",
                    }}
                  >
                    <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#d97706" }}>
                      Only {event.spots_remaining} spots left!
                    </span>
                  </div>
                )}

                {event.spots_remaining === 0 && (
                  <div
                    style={{
                      position: "absolute",
                      top: "12px",
                      left: "12px",
                      backgroundColor: "#fee2e2",
                      padding: "4px 10px",
                      borderRadius: "20px",
                    }}
                  >
                    <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#dc2626" }}>
                      Sold Out
                    </span>
                  </div>
                )}
              </div>

              {/* Event Info */}
              <div style={{ padding: "16px" }}>
                <h3
                  style={{
                    margin: "0 0 8px",
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: "#1e293b",
                    lineHeight: 1.3,
                  }}
                >
                  {event.title}
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#64748b", fontSize: "0.85rem" }}>
                    <span>📅</span>
                    <span>{formatDate(event.event_date)}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#64748b", fontSize: "0.85rem" }}>
                    <span>🕐</span>
                    <span>{event.start_time} - {event.end_time}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#64748b", fontSize: "0.85rem" }}>
                    <span>📍</span>
                    <span>{event.location}</span>
                  </div>
                </div>

                {/* Activity Icons */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "1.25rem",
                    marginBottom: "8px",
                  }}
                >
                  {getActivityIcons(event.activity_types)}
                </div>

                {/* Age Range & Bookings */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingTop: "12px",
                    borderTop: "1px solid #f3f4f6",
                  }}
                >
                  <span style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
                    Ages {event.age_group_min}-{event.age_group_max} years
                  </span>
                  <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                    {event.spots_remaining} spots available
                  </span>
                </div>

                {/* Vendor */}
                {event.vendor_name && (
                  <div
                    style={{
                      marginTop: "8px",
                      paddingTop: "8px",
                      borderTop: "1px solid #f3f4f6",
                      fontSize: "0.75rem",
                      color: "#9ca3af",
                    }}
                  >
                    By {event.vendor_name}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* My Registrations Link */}
      <div
        style={{
          marginTop: "32px",
          padding: "20px",
          backgroundColor: "#f0f9ff",
          borderRadius: "12px",
          textAlign: "center",
          border: "1px solid #bae6fd",
        }}
      >
        <p style={{ margin: "0 0 12px", color: "#0369a1", fontSize: "0.9rem" }}>
          Want to see your previous bookings?
        </p>
        <Link
          to="/fun-day/my-registrations"
          style={{
            display: "inline-block",
            padding: "10px 20px",
            backgroundColor: "#0891b2",
            color: "white",
            borderRadius: "8px",
            textDecoration: "none",
            fontSize: "0.9rem",
            fontWeight: 500,
          }}
        >
          View My Registrations
        </Link>
      </div>
    </div>
  )
}

export default EventListing
