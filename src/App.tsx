import { useState } from 'react'
import LoginScreen from './components/LoginScreen'
import HomeScreen from './components/HomeScreen'
import MapScreen from './components/MapScreen'
import MissionsScreen from './components/MissionsScreen'
import type { TabId } from './types'

type AppState = 'login' | TabId

export default function App() {
  const [currentTab, setCurrentTab] = useState<AppState>('login')

  if (currentTab === 'login') {
    return <LoginScreen onLoginSuccess={() => setCurrentTab('inicio')} />
  }

  const handleTabChange = (tab: TabId) => {
    setCurrentTab(tab)
  }

  if (currentTab === 'mapa') {
    return <MapScreen onTabChange={handleTabChange} />
  }

  if (currentTab === 'missoes') {
    return <MissionsScreen onTabChange={handleTabChange} />
  }

  // 'inicio', 'interclasse', 'bem-estar' fallback to HomeScreen with active tab indicator
  return <HomeScreen onTabChange={handleTabChange} />
}
