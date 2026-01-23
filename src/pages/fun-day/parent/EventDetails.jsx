import React, { useState, useEffect } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import { getEventDetails, bookEvent, getStoredUser, getStoredResidentId } from "../../../utils/apiClient"

const EventDetails = () => {
  const navigate = useNavigate()
  const { id: eventId } = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingForm, setBookingForm] = useState({
    child_name: "",
    child_age: "",
    child_gender: "",
    number_of_children: 1,
    special_requests: "",
  })
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = getStoredUser()
    setUser(userData)
    loadEvent()
  }, [eventId])

  const loadEvent = async () => {
    try {
      setLoading(true)
      const data = await getEventDetails(eventId)
      setEvent(data)
    } catch (err) {
      setError(err.message || "Failed to load event details")
    } finally {
      setLoading(false)
    }
  }

  const handleBookingChange = (e) => {
    const { name, value } = e.target
    setBookingForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleBookingSubmit = async (e) => {
    e.preventDefault()
    setBookingLoading(true)
    setError("")

    try {
      await bookEvent(eventId, bookingForm)
      setBookingSuccess(true)
    } catch (err) {
      setError(err.message || "Failed to book event. Please try again.")
    } finally {
      setBookingLoading(false)
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getActivityIcons = (activityTypes) => {
    if (!activityTypes || activityTypes.length === 0) return ["🎪"]

    const iconMap = {
      bouncing_castle: { icon: "🏰", name: "Bouncing Castle" },
      face_painting: { icon: "🎨", name: "Face Painting" },
      games: { icon: "🎯", name: "Games" },
      arts_crafts: { icon: "✂️", name: "Arts & Crafts" },
      magic_show: { icon: "🎭", name: "Magic Show" },
      clown: { icon: "🤡", name: "Clown" },
      music_dance: { icon: "💃", name: "Music & Dance" },
      balloons: { icon: "🎈", name: "Balloon Art" },
      food: { icon: "🍕", name: "Food & Snacks" },
      other: { icon: "🎪", name: "Other" },
    }

    return activityTypes.map((type) => iconMap[type] || { icon: "🎪", name: "Other" })
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
        <p style={{ color: "#64748b" }}>Loading event details...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (error && !event) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <div style={{ fontSize: "3rem", marginBottom: "16px" }}>😕</div>
        <h3 style={{ margin: "0 0 8px", color: "#dc2626" }}>Event not found</h3>
        <p style={{ margin: "0 0 20px", color: "#64748b" }}>{error}</p>
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
          Back to Events
        </Link>
      </div>
    )
  }

  if (bookingSuccess) {
    return (
      <div style={{ textAlign: "center", padding: "40px 20px" }}>
        <div style={{ fontSize: "4rem", marginBottom: "16px" }}>🎉</div>
        <h2 style={{ margin: "0 0 8px", fontSize: "1.5rem", fontWeight: 700, color: "#16a34a" }}>
          Booking Successful!
        </h2>
        <p style={{ margin: "0 0 24px", color: "#64748b" }}>
          Your child has been registered for {event.title}. Please complete the payment using the instructions below.
        </p>

        <div
          style={{
            backgroundColor: "#f0f9ff",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "24px",
            textAlign: "left",
          }}
        >
          <h4 style={{ margin: "0 0 12px", color: "#0369a1" }}>Payment Instructions</h4>
          <p style={{ margin: "0 0 8px", whiteSpace: "pre-wrap" }}>
            {event.payment_instructions || "Pay via M-Pesa to the vendor's number."}
          </p>
          {event.vendor_phone && (
            <p style={{ margin: "8px 0 0", fontWeight: 600 }}>
              M-Pesa: {event.vendor_phone}
            </p>
          )}
        </div>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <Link
            to="/fun-day/my-registrations"
            style={{
              padding: "12px 24px",
              backgroundColor: "#0891b2",
              color: "white",
              borderRadius: "8px",
              textDecoration: "none",
            }}
          >
            View My Registrations
          </Link>
          <Link
            to="/fun-day/events"
            style={{
              padding: "12px 24px",
              backgroundColor: "#f3f4f6",
              color: "#374151",
              borderRadius: "8px",
              textDecoration: "none",
            }}
          >
            Browse More Events
          </Link>
        </div>
      </div>
    )
  }

  const activityIcons = getActivityIcons(event?.activity_types)

  return (
    <div>
      {/* Back Link */}
      <Link
        to="/fun-day/events"
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
        ← Back to Events
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

      {/* Event Header */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          overflow: "hidden",
          border: "1px solid #e5e7eb",
          marginBottom: "20px",
        }}
      >
        {/* Image */}
        <div
          style={{
            height: "200px",
            backgroundColor: "#f3f4f6",
            backgroundImage: event?.image_url ? `url(${event.image_url})` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
          }}
        >
          {!event?.image_url && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "4rem",
              }}
            >
              {activityIcons.map((a, i) => (
                <span key={i} style={{ margin: "0 4px" }}>{a.icon}</span>
              ))}
            </div>
          )}

          {/* Price Badge */}
          <div
            style={{
              position: "absolute",
              bottom: "12px",
              right: "12px",
              backgroundColor: "white",
              padding: "8px 16px",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <span style={{ fontSize: "1.25rem", fontWeight: 700, color: "#16a34a" }}>
              {formatCurrency(event?.price)}
            </span>
            <span style={{ fontSize: "0.8rem", color: "#64748b" }}> per child</span>
          </div>
        </div>

        {/* Event Info */}
        <div style={{ padding: "20px" }}>
          <h1 style={{ margin: "0 0 12px", fontSize: "1.5rem", fontWeight: 700, color: "#1e293b" }}>
            {event?.title}
          </h1>

          {/* Activity Tags */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
            {activityIcons.map((a, i) => (
              <span
                key={i}
                style={{
                  padding: "4px 12px",
                  backgroundColor: "#f3f4f6",
                  borderRadius: "20px",
                  fontSize: "0.85rem",
                  color: "#374151",
                }}
              >
                {a.icon} {a.name}
              </span>
            ))}
          </div>

          {/* Date, Time, Location */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#374151" }}>
              <span style={{ fontSize: "1.25rem" }}>📅</span>
              <span>{formatDate(event?.event_date)}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#374151" }}>
              <span style={{ fontSize: "1.25rem" }}>🕐</span>
              <span>{event?.start_time} - {event?.end_time}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#374151" }}>
              <span style={{ fontSize: "1.25rem" }}>📍</span>
              <span>{event?.location}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#374151" }}>
              <span style={{ fontSize: "1.25rem" }}>👶</span>
              <span>Ages {event?.age_group_min}-{event?.age_group_max} years</span>
            </div>
          </div>

          {/* Description */}
          {event?.description && (
            <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #e5e7eb" }}>
              <h3 style={{ margin: "0 0 8px", fontSize: "1rem", fontWeight: 600, color: "#1e293b" }}>
                About This Event
              </h3>
              <p style={{ margin: 0, color: "#64748b", lineHeight: 1.6 }}>{event.description}</p>
            </div>
          )}

          {/* What to Bring */}
          {event?.what_to_bring && (
            <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #e5e7eb" }}>
              <h3 style={{ margin: "0 0 8px", fontSize: "1rem", fontWeight: 600, color: "#1e293b" }}>
                What to Bring
              </h3>
              <p style={{ margin: 0, color: "#64748b" }}>{event.what_to_bring}</p>
            </div>
          )}

          {/* Weather Note */}
          {event?.weather_note && (
            <div
              style={{
                marginTop: "16px",
                padding: "12px",
                backgroundColor: "#fef3c7",
                borderRadius: "8px",
              }}
            >
              <p style={{ margin: 0, color: "#92400e", fontSize: "0.9rem" }}>
                ☁️ {event.weather_note}
              </p>
            </div>
          )}

          {/* Vendor Info */}
          {event?.vendor_name && (
            <div
              style={{
                marginTop: "16px",
                paddingTop: "16px",
                borderTop: "1px solid #e5e7eb",
                display: "flex",
                alignItems: "center",
                gap: "12px",
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
                🎪
              </div>
              <div>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>Organized by</p>
                <p style={{ margin: 0, fontWeight: 600, color: "#374151" }}>{event.vendor_name}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Booking Form */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "24px",
          border: "1px solid #e5e7eb",
        }}
      >
        <h2 style={{ margin: "0 0 20px", fontSize: "1.25rem", fontWeight: 700, color: "#1e293b" }}>
          Book Your Child's Spot
        </h2>

        <form onSubmit={handleBookingSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "0.875rem", fontWeight: 500, color: "#374151" }}>
              Child's Name *
            </label>
            <input
              type="text"
              name="child_name"
              value={bookingForm.child_name}
              onChange={handleBookingChange}
              placeholder="Enter your child's name"
              required
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "0.95rem",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "0.875rem", fontWeight: 500, color: "#374151" }}>
                Age (years) *
              </label>
              <input
                type="number"
                name="child_age"
                value={bookingForm.child_age}
                onChange={handleBookingChange}
                placeholder="5"
                min={event?.age_group_min || 0}
                max={event?.age_group_max || 18}
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "0.95rem",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "0.875rem", fontWeight: 500, color: "#374151" }}>
                Number of Children
              </label>
              <select
                name="number_of_children"
                value={bookingForm.number_of_children}
                onChange={handleBookingChange}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "0.95rem",
                  boxSizing: "border-box",
                }}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? "child" : "children"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "0.875rem", fontWeight: 500, color: "#374151" }}>
              Special Requests (Optional)
            </label>
            <textarea
              name="special_requests"
              value={bookingForm.special_requests}
              onChange={handleBookingChange}
              placeholder="Any allergies, dietary requirements, or special needs?"
              rows={2}
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "0.95rem",
                boxSizing: "border-box",
                resize: "vertical",
              }}
            />
          </div>

          {/* Payment Info */}
          <div
            style={{
              backgroundColor: "#f0f9ff",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "20px",
            }}
          >
            <h4 style={{ margin: "0 0 12px", fontSize: "0.9rem", fontWeight: 600, color: "#0369a1" }}>
              💳 Payment Information
            </h4>
            <p style={{ margin: "0 0 8px", fontSize: "0.9rem", color: "#0c4a6e", whiteSpace: "pre-wrap" }}>
              {event?.payment_instructions || "Pay via M-Pesa to the vendor's number provided after booking."}
            </p>
            {event?.vendor_phone && (
              <p style={{ margin: "8px 0 0", fontWeight: 600, color: "#0369a1" }}>
                M-Pesa: {event.vendor_phone}
              </p>
            )}
          </div>

          {/* Total */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px",
              backgroundColor: "#f9fafb",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            <span style={{ fontSize: "1rem", fontWeight: 500, color: "#374151" }}>Total</span>
            <span style={{ fontSize: "1.5rem", fontWeight: 700, color: "#16a34a" }}>
              {formatCurrency(event?.price * bookingForm.number_of_children)}
            </span>
          </div>

          <button
            type="submit"
            disabled={bookingLoading}
            style={{
              width: "100%",
              padding: "14px",
              backgroundColor: bookingLoading ? "#9ca3af" : "#0891b2",
              border: "none",
              borderRadius: "8px",
              color: "white",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: bookingLoading ? "not-allowed" : "pointer",
            }}
          >
            {bookingLoading ? "Processing..." : "Book Now"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default EventDetails
