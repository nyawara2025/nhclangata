import React from 'react'
import { useNavigate } from 'react-router-dom'
import { getStoredUser, clearAuthData } from '../utils/apiClient'
import { isTreasurer } from '../utils/authUtils'

const Header = () => {
  const navigate = useNavigate()
  const user = getStoredUser()
  const isUserTreasurer = isTreasurer()

  const handleLogout = () => {
    clearAuthData()
    navigate('/login')
  }

  const handleTreasurerClick = () => {
    navigate('/treasurer')
  }

  return (
    <header style={{
      background: 'linear-gradient(135deg, #0891B2 0%, #0E7490 100%)',
      color: 'white',
      padding: '16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div>
        <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>
          NHC Langata
        </h1>
        <p style={{ margin: '4px 0 0', fontSize: '0.75rem', opacity: 0.9 }}>
          Residential Portal
        </p>
      </div>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {isUserTreasurer && (
          <button
            onClick={handleTreasurerClick}
            style={{
              padding: '8px 16px',
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>💰</span>
            Treasurer
          </button>
        )}
        <button
          onClick={handleLogout}
          style={{
            padding: '8px 16px',
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            cursor: 'pointer',
            fontSize: '0.875rem'
          }}
        >
          Logout
        </button>
      </div>
    </header>
  )
}

export default Header
