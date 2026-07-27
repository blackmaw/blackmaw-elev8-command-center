import './App.css'
import { HeadquartersLayout } from './layouts/HeadquartersLayout'
import { ExecutiveDashboard } from './pages/ExecutiveDashboard'

function App() {
  return (
    <HeadquartersLayout>
      <ExecutiveDashboard />
    </HeadquartersLayout>
  )
}

export default App
