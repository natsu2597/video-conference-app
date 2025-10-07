import '../styles/auth.css'
import { SignInButton } from '@clerk/clerk-react'

const AuthPage = () => {
  return (
    <div className='auth-container'>
      <div className="auth-left">
        <div className="auth-hero">
          <div className="brand-container">
            <img src="/logo.png" alt="logo" className="brand-logo" />
            <span className='brand-name'>Hiver</span>
          </div>
          <h1 className="hero-title">Work & Fun ✯</h1>
          <p className="hero-subtitle">
            Connect with your team, collaborate, and get things done with Hiver.
            Experience the power of teamwork and productivity like never before.
          </p>
          <div className="features-list">
            <div className="feature-item">
              <span className='feature-icon'>💬</span>
              <span>Real-time messaging</span>
            </div>
            <div className="feature-item">
              <span className='feature-icon'>🎦</span>
              <span>Video Calls conferences and meetings</span>
            </div>
            <div className="feature-item">
              <span className='feature-icon'>🛡️</span>
              <span>Have secure interraction</span>
            </div>
          </div>
          <SignInButton mode="modal">
            <button className='cta-button'>
              Get started with Hiver
              <span>🚀</span>
            </button>
          </SignInButton>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-image-container">
            <img src="/landing.png" alt="auth" className="auth-image" />
            <div className="image-overlay"></div>
        </div>
      </div>
    </div>
  )
}

export default AuthPage