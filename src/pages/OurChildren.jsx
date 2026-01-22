import React from "react"
import { useNavigate } from "react-router-dom"

const OurChildren = () => {
  const navigate = useNavigate()

  // Define the children activity options
  const activityOptions = [
    {
      id: "sports",
      title: "Sports / Football",
      description: "View and manage children's sports activities and football events",
      icon: "⚽",
      color: "#DCFCE7",
      textColor: "#16A34A",
      route: "/our-children/sports"
    },
    {
      id: "holiday",
      title: "Holiday / Weekend Fun Day",
      description: "Plan and participate in holiday and weekend fun activities for children",
      icon: "🎉",
      color: "#FEF3C7",
      textColor: "#D97706",
      route: "/our-children/holiday"
    },
    {
      id: "transport",
      title: "School Transport",
      description: "Manage school transportation arrangements for children",
      icon: "🚌",
      color: "#DBEAFE",
      textColor: "#2563EB",
      route: "/our-children/transport"
    }
  ]

  return (
    <div style={{ padding: "16px" }}>
      {/* Header Section */}
      <section style={{ marginBottom: "24px" }}>
        <h1 style={{ margin: "0 0 8px", fontSize: "1.5rem", color: "#1e293b" }}>
          Our Children 👶
        </h1>
        <p style={{ margin: 0, color: "#64748b", fontSize: "0.9rem" }}>
          Manage and track your children's activities and services within the community
        </p>
      </section>

      {/* Activity Options Grid */}
      <section>
        <h2 style={{ margin: "0 0 16px", fontSize: "1rem", color: "#1e293b" }}>
          Activity Categories
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {activityOptions.map((option) => (
            <button
              key={option.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                padding: "16px",
                background: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                cursor: "pointer",
                textAlign: "left",
                transition: "transform 0.2s, box-shadow 0.2s"
              }}
              onClick={() => navigate(option.route)}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)"
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)"
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.boxShadow = "none"
              }}
            >
              <div style={{ 
                width: "56px", 
                height: "56px", 
                borderRadius: "12px", 
                background: option.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.75rem",
                flexShrink: 0
              }}>
                {option.icon}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ 
                  margin: "0 0 4px", 
                  fontSize: "1rem", 
                  color: option.textColor,
                  fontWeight: 600 
                }}>
                  {option.title}
                </h3>
                <p style={{ 
                  margin: 0, 
                  color: "#64748b", 
                  fontSize: "0.85rem",
                  lineHeight: "1.4"
                }}>
                  {option.description}
                </p>
              </div>
              <div style={{ 
                width: "32px", 
                height: "32px", 
                borderRadius: "50%", 
                background: "#f1f5f9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#94a3b8"
              }}>
                →
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Info Card */}
      <section style={{ marginTop: "24px" }}>
        <div style={{ 
          padding: "16px", 
          background: "#F0F9FF", 
          borderRadius: "12px",
          border: "1px solid #BAE6FD"
        }}>
          <h3 style={{ 
            margin: "0 0 8px", 
            fontSize: "0.9rem", 
            color: "#0369A1",
            fontWeight: 600 
          }}>
            Parent Portal
          </h3>
          <p style={{ 
            margin: 0, 
            color: "#0C4A6E", 
            fontSize: "0.85rem",
            lineHeight: "1.5"
          }}>
            Use this portal to stay connected with your children's activities within the NHC Langata community. 
            You can view upcoming events, manage transport arrangements, and sign up for activities.
          </p>
        </div>
      </section>
    </div>
  )
}

export default OurChildren
