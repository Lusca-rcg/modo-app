import { useState } from 'react'
import LoginScreen from './components/LoginScreen'
import HomeScreen from './components/HomeScreen'

type Page = 'login' | 'home'

export default function App() {
  const [page, setPage] = useState<Page>('login')

  return page === 'login'
    ? <LoginScreen onLoginSuccess={() => setPage('home')} />
    : <HomeScreen />
}
