import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

const DriverLogin = () => {
  const navigate = useNavigate()
  const [driverId, setDriverId] = useState("")
  const [pin, setPin] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Simulate login - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (driverId && pin) {
        localStorage.setItem("driver_id", driverId)
        localStorage.setItem("driver_token", "mock-token-" + driverId)
        navigate("/transport-driver/dashboard")
      } else {
        setError("Please enter driver ID and PIN")
      }
    } catch (err) {
      setError("Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
      {/* Logo/Header */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "16px",
            backgroundColor: "#3b82f6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
            fontSize: "2.5rem",
          }}
        >
          🚌
        </div>
        <h1 style={{ margin: "0 0 8px", fontSize: "1.5rem", fontWeight: 700, color: "#1e293b" }}>
          Driver App
        </h1>
        <p style={{ margin: 0, color: "#64748b" }}>School Transport Management</p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: "16px" }}>
          <label
            style={{ display: "block", marginBottom: "8px", fontWeight: 500, color: "#374151" }}
          >
            Driver ID
          </label>
          <input
            type="text"
            value={driverId}
            onChange={(e) => setDriverId(e.target.value)}
            placeholder="Enter your driver ID"
            style={{
              width: "100%",
              padding: "14px 16px",
              fontSize: "1rem",
              border: "1px solid #d1d5db",
              borderRadius: "12px",
              boxSizing: "border-box",
              outline: "none",
            }}
          />
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label
            style={{ display: "block", marginBottom: "8px", fontWeight: 500, color: "#374151" }}
          >
            PIN
          </label>
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Enter your PIN"
            maxLength={4}
            style={{
              width: "100%",
              padding: "14px 16px",
              fontSize: "1rem",
              border: "1px solid #d1d5db",
              borderRadius: "12px",
              boxSizing: "border-box",
              outline: "none",
            }}
          />
        </div>

        {error && (
          <div
            style={{
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "8px",
              padding: "12px 16px",
              marginBottom: "16px",
              color: "#dc2626",
              fontSize: "0.9rem",
            }}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "16px",
            fontSize: "1rem",
            fontWeight: 600,
            color: "white",
            backgroundColor: loading ? "#9ca3af" : "#3b82f6",
            border: "none",
            borderRadius: "12px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* Footer */}
      <p
        style={{
          marginTop: "32px",
          textAlign: "center",
          fontSize: "0.85rem",
          color: "#9ca3af",
        }}
      >
        For assistance, contact the transport office
      </p>
    </div>
  )
}

export default DriverLogin
