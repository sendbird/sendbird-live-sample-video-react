import App from "./components/app";
import { useState } from 'react'
import logo from './assets/png/logo.png';
import logoB from './assets/png/logo-b.png';

import './App.scss';

function SampleApp() {
  const [appId, setAppId] = useState('')
  const [userId, setUserId] = useState('')
  const [accessToken, setAccessToken] = useState('')
  const [hasSession, setHasSession] = useState(false)

  return (
    <div className="App">
      {
        hasSession ?
          <App
            appId={appId}
            userId={userId}
            nickname={userId}
            accessToken={accessToken ? accessToken : undefined}
            signOut={() => setHasSession(false)}
          /> :
          <div className="login-panel">
            <img src={logo} className="logo" />
            <div className='login-form'>
              <div className='section'>Application ID</div>
              <input type='text' className='input'
                     placeholder='Application ID'
                     value={appId}
                     onChange={(event) => setAppId(event.target.value)} />
              <div className='section'>User ID</div>
              <input type='text' className='input'
                     placeholder='User ID'
                     value={userId}
                     onChange={(event) => setUserId(event.target.value)} />
              <div className='section'>Access token (optional)</div>
              <input type='password' className='input'
                     placeholder='Access token (optional)'
                     value={accessToken}
                     onChange={(event) => setAccessToken(event.target.value)} />
              <input type='button' className='submit' value='Sign in'
                     onClick={() => setHasSession(true)}/>
            </div>
            <img src={logoB} className="logo-horizontal" />
          </div>
      }
    </div>
  )
}

export default SampleApp
