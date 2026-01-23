import React, { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { createFunDayEvent, isVendorLoggedIn } from "../../../utils/apiClient"

const EVENT_TYPES = [
  { code: "bouncing_castle", name: "🏰 Bouncing Castle", color: "#fef3c7" },
  { code: "face_painting", name: "🎨 Face Painting", color: "#fce7f3" },
  { code: "games", name: "🎯 Outdoor Games", color: "#dbeafe" },
  { code: "arts_crafts", name: "✂️ Arts & Crafts", color: "#dcfce7" },
  { code: "magic_show", name: "🎭 Magic Show", color: "#fae8ff" },
  { code: "clown", name: "🤡 Clown & Comedy", color: "#fee2e2" },
  { code: "music_dance", name: "💃 Music & Dance", color: "#e0e7ff" },
  { code: "balloons", name: "🎈 Balloon Art", color: "#f0fdf4" },
  { code: "food", name: "🍕 Food & Snacks", color: "#fff7ed" },
  { code: "other", name: "🎪 Other Activities", color: "#f3f4f6" },
]

const EventForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditMode = !!id

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    event_date: "",
    start_time: "",
    end_time: "",
    location: "",
    venue_details: "",
    price: "",
    capacity_limit: "",
    age_group_min: "3",
    age_group_max: "12",
    activity_types: [],
    payment_instructions: "",
    what_to_bring: "",
    weather_note: "",
    image_url: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isVendorLoggedIn()) {
      navigate("/fun-day/vendor/login")
    }
  }, [navigate])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        activity_types: checked
          ? [...prev.activity_types, value]
          : prev.activity_types.filter((t) => t !== value),
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Validation
    if (!formData.title.trim()) {
      setError("Please enter an event title")
      setLoading(false)
      return
    }
    if (!formData.event_date) {
      setError("Please select an event date")
      setLoading(false)
      return
    }
    if (!formData.location.trim()) {
      setError("Please enter the event location")
      setLoading(false)
      return
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError("Please enter a valid price")
      setLoading(false)
      return
    }
    if (!formData.capacity_limit || parseInt(formData.capacity_limit) <= 0) {
      setError("Please enter a valid capacity limit")
      setLoading(false)
      return
    }

    try {
      await createFunDayEvent({
        title: formData.title,
        description: formData.description,
        event_date: formData.event_date,
        start_time: formData.start_time || "10:00",
        end_time: formData.end_time || "16:00",
        location: formData.location,
        venue_details: formData.venue_details,
        price: parseFloat(formData.price),
        capacity_limit: parseInt(formData.capacity_limit),
        age_group_min: parseInt(formData.age_group_min),
        age_group_max: parseInt(formData.age_group_max),
        activity_types: formData.activity_types,
        payment_instructions: formData.payment_instructions || `Pay via M-Pesa to the number provided. Enter the event date (YYMMDD) as the reference.`,
        what_to_bring: formData.what_to_bring,
        weather_note: formData.weather_note,
        image_url: formData.image_url,
        status: "active",
      })
      navigate("/fun-day/vendor/dashboard")
    } catch (err) {
      setError(err.message || "Failed to create event. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
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
        <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700, color: "#1e1b4b" }}>
          {isEditMode ? "Edit Event" : "Create New Event"}
        </h1>
        <p style={{ margin: "8px 0 0", color: "#64748b" }}>
          Fill in the details for your holiday or weekend fun day event
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

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "24px",
            border: "1px solid #e5e7eb",
            marginBottom: "20px",
          }}
        >
          <h3 style={{ margin: "0 0 16px", fontSize: "1rem", fontWeight: 600, color: "#1e293b" }}>
            Basic Information
          </h3>

          {/* Title */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "0.875rem", fontWeight: 500, color: "#374151" }}>
              Event Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Easter Holiday Fun Day"
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

          {/* Description */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "0.875rem", fontWeight: 500, color: "#374151" }}>
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the event activities and what children can expect..."
              rows={4}
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

          {/* Activity Types */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "12px", fontSize: "0.875rem", fontWeight: 500, color: "#374151" }}>
              Activity Types
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {EVENT_TYPES.map((type) => (
                <label
                  key={type.code}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 12px",
                    backgroundColor: formData.activity_types.includes(type.code) ? type.color : "#f3f4f6",
                    border: `2px solid ${formData.activity_types.includes(type.code) ? "#7c3aed" : "transparent"}`,
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    transition: "all 0.2s",
                  }}
                >
                  <input
                    type="checkbox"
                    value={type.code}
                    checked={formData.activity_types.includes(type.code)}
                    onChange={handleChange}
                    style={{ display: "none" }}
                  />
                  {type.name}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Date & Time */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "24px",
            border: "1px solid #e5e7eb",
            marginBottom: "20px",
          }}
        >
          <h3 style={{ margin: "0 0 16px", fontSize: "1rem", fontWeight: 600, color: "#1e293b" }}>
            Date & Time
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "0.875rem", fontWeight: 500, color: "#374151" }}>
                Event Date *
              </label>
              <input
                type="date"
                name="event_date"
                value={formData.event_date}
                onChange={handleChange}
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
                Start Time
              </label>
              <input
                type="time"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
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
                End Time
              </label>
              <input
                type="time"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
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
          </div>
        </div>

        {/* Location */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "24px",
            border: "1px solid #e5e7eb",
            marginBottom: "20px",
          }}
        >
          <h3 style={{ margin: "0 0 16px", fontSize: "1rem", fontWeight: 600, color: "#1e293b" }}>
            Location
          </h3>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "0.875rem", fontWeight: 500, color: "#374151" }}>
              Venue Location *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., NHC Langata Community Center"
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
              Venue Details (Optional)
            </label>
            <input
              type="text"
              name="venue_details"
              value={formData.venue_details}
              onChange={handleChange}
              placeholder="e.g., Main hall, near the playground"
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
        </div>

        {/* Pricing & Capacity */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "24px",
            border: "1px solid #e5e7eb",
            marginBottom: "20px",
          }}
        >
          <h3 style={{ margin: "0 0 16px", fontSize: "1rem", fontWeight: 600, color: "#1e293b" }}>
            Pricing & Capacity
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "16px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "0.875rem", fontWeight: 500, color: "#374151" }}>
                Price (KES) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="500"
                min="0"
                step="50"
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
                Max Children *
              </label>
              <input
                type="number"
                name="capacity_limit"
                value={formData.capacity_limit}
                onChange={handleChange}
                placeholder="50"
                min="1"
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
                Min Age (years)
              </label>
              <input
                type="number"
                name="age_group_min"
                value={formData.age_group_min}
                onChange={handleChange}
                placeholder="3"
                min="0"
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
                Max Age (years)
              </label>
              <input
                type="number"
                name="age_group_max"
                value={formData.age_group_max}
                onChange={handleChange}
                placeholder="12"
                max="18"
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
          </div>
        </div>

        {/* Additional Info */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "24px",
            border: "1px solid #e5e7eb",
            marginBottom: "20px",
          }}
        >
          <h3 style={{ margin: "0 0 16px", fontSize: "1rem", fontWeight: 600, color: "#1e293b" }}>
            Additional Information
          </h3>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "0.875rem", fontWeight: 500, color: "#374151" }}>
              Image URL (Optional)
            </label>
            <input
              type="url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="https://example.com/event-image.jpg"
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

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "0.875rem", fontWeight: 500, color: "#374151" }}>
              Payment Instructions
            </label>
            <textarea
              name="payment_instructions"
              value={formData.payment_instructions}
              onChange={handleChange}
              placeholder="How should parents pay? (e.g., M-Pesa to 0712345678)"
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

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "0.875rem", fontWeight: 500, color: "#374151" }}>
              What to Bring
            </label>
            <textarea
              name="what_to_bring"
              value={formData.what_to_bring}
              onChange={handleChange}
              placeholder="e.g., Comfortable clothes, sunscreen, water bottle"
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

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "0.875rem", fontWeight: 500, color: "#374151" }}>
              Weather Note
            </label>
            <input
              type="text"
              name="weather_note"
              value={formData.weather_note}
              onChange={handleChange}
              placeholder="e.g., Event will proceed unless it's raining heavily"
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
        </div>

        {/* Submit Button */}
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            type="button"
            onClick={() => navigate("/fun-day/vendor/dashboard")}
            style={{
              flex: 1,
              padding: "14px",
              backgroundColor: "#f3f4f6",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              color: "#374151",
              fontSize: "1rem",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{
              flex: 2,
              padding: "14px",
              backgroundColor: loading ? "#9ca3af" : "#7c3aed",
              border: "none",
              borderRadius: "8px",
              color: "white",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Creating Event..." : "Create Event"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EventForm
