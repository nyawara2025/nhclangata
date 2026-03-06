import React, { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth() 
  
  // State for the flow
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState(1) // 1: Enter Phone, 2: Enter OTP
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const from = location.state?.from?.pathname || '/'

  // Step 1: Request OTP from n8n
  const handleSendOtp = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('https://n8n.tenear.com/webhook/nhc-request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      })

      if (!response.ok) throw new Error('Failed to send OTP. Please try again.')
      
      setStep(2)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Verify OTP via n8n and login
  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('https://n8n.tenear.com/webhook/nhc-verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp_code: otp })
      })

      const data = await response.json()
      console.log('N8N Response Data:', data) // <--- Add this temporarily


      // NEW LOGIC: Check if data is an array and has the first resident item
      if (Array.isArray(data) && data.length > 0) {
        const residentData = data[0] // Get Eric's data from the array
      
        // Pass the resident object to your AuthContext login
        await login(residentData) 
        navigate(from, { replace: true })
      } else {
        // If n8n returns an empty array or error object
        throw new Error(data.message || 'Invalid OTP code or user not found.')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      background: 'linear-gradient(135deg, #0891B2 0%, #0E7490 100%)'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '32px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            background: 'linear-gradient(135deg, #0891B2 0%, #0E7490 100%)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: '2rem'
          }}>
            🏠
          </div>
          <h1 style={{ margin: '0 0 8px', fontSize: '1.5rem', color: '#1e293b' }}>
            NHC Langata
          </h1>
          <p style={{ margin: 0, color: '#64748b' }}>
            {step === 1 ? 'Resident Login' : 'Verify OTP'}
          </p>
        </div>

        <form onSubmit={step === 1 ? handleSendOtp : handleVerifyOtp}>
          {error && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '16px',
              color: '#dc2626',
              fontSize: '0.875rem'
            }}>
              {error}
            </div>
          )}

          {step === 1 ? (
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#374151'
              }}>
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+2547XXXXXXXX"
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          ) : (
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#374151'
              }}>
                Enter 6-Digit Code
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="XXXXXX"
                maxLength="6"
                required
                autoFocus
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1.25rem',
                  textAlign: 'center',
                  letterSpacing: '4px',
                  boxSizing: 'border-box'
                }}
              />
              <button 
                type="button" 
                onClick={() => setStep(1)} 
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#0891B2',
                  marginTop: '12px',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                ← Use a different number
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #0891B2 0%, #0E7490 100%)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              marginTop: step === 2 ? '12px' : '0'
            }}
          >
            {loading ? 'Processing...' : step === 1 ? 'Get OTP' : 'Verify & Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <p style={{ margin: '0 0 8px', color: '#64748b', fontSize: '0.875rem' }}>
            Are you a vendor?
          </p>
          <Link 
            to="/fun-day/vendor/login"
            style={{
              color: '#0891B2',
              fontSize: '0.875rem',
              fontWeight: 500,
              textDecoration: 'none'
            }}
          >
            Access Vendor Portal →
          </Link>
        </div>

        {/* Commenting out the Driver Login section temporarily
        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e5e7eb', textAlign: 'center' }}>
          <p style={{ margin: '0 0 8px', color: '#64748b', fontSize: '0.875rem' }}>
            Are you a transport driver?
          </p>
          <Link 
            to="/transport-driver/login"
            style={{
              color: '#059669',
              fontSize: '0.875rem',
              fontWeight: 500,
              textDecoration: 'none'
            }}
          >
            Driver Login →
          </Link>
        </div>
        */}
      </div>

      <p style={{
        marginTop: '24px',
        color: 'rgba(255,255,255,0.8)',
        fontSize: '0.875rem',
        textAlign: 'center'
      }}>
        NHC Langata Residential Complex<br />
        Residents portal
      </p>
    </div>
  )
}

export default Login
