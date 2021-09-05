import './Login.css'
import { Button } from '@material-ui/core'
import { auth, provider } from '../firebase'

export default function Login() {
  const login = () => {
    auth.signInWithRedirect(provider)
  }

  return (
    <div className='app'>
      <div className='login'>
        <div className='login__container'>
          <img src='./login-logo.png' alt='Logo' />
          <div className='login__text'>
            <h1>Sign in to Whatsapp</h1>
          </div>
          <Button onClick={login}>Sign in with Google</Button>
        </div>
      </div>
    </div>
  )
}
