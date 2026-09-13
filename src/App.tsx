import { useState } from 'react'
import LoginScreen from './components/LoginScreen'
import HomeScreen from './components/HomeScreen'
import MapScreen from './components/MapScreen'
import MissionsScreen from './components/MissionsScreen'
import CronixGame from './components/CronixGame'
import MatSpeedGame from './components/MatSpeedGame'
import type { TabId } from './types'

type AppScreen = 'login' | TabId | 'cronix' | 'mat-speed'

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('login')
  // Remember which tab was active before entering a game
  const [prevTab, setPrevTab] = useState<TabId>('missoes')

  function handleTabChange(tab: TabId) {
    setScreen(tab)
  }

  function handleMissionSelect(missionId: string) {
    setPrevTab('missoes')
    if (missionId === 'historia') {
      setScreen('cronix')
    } else if (missionId === 'matematica') {
      setScreen('mat-speed')
    }
  }

  function handleGameBack() {
    setScreen(prevTab)
  }

  if (screen === 'login') {
    return <LoginScreen onLoginSuccess={() => setScreen('inicio')} />
  }

  if (screen === 'cronix') {
    return <CronixGame onBack={handleGameBack} />
  }

  if (screen === 'mat-speed') {
    return <MatSpeedGame onBack={handleGameBack} />
  }

  if (screen === 'mapa') {
    return <MapScreen onTabChange={handleTabChange} />
  }

  if (screen === 'missoes') {
    return (
      <MissionsScreen
        onTabChange={handleTabChange}
        onMissionSelect={handleMissionSelect}
      />
    )
  }

  // 'inicio', 'interclasse', 'bem-estar'
  return <HomeScreen onTabChange={handleTabChange} />
}
