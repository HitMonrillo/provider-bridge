import { useState } from 'react'
import CreateRequestForm from './components/CreateRequestForm'
import RequestList from './components/RequestList'

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Care Coordination Tracker</h1>
          <p className="text-gray-600 mt-2">Track provider-to-provider requests and auto-escalate unanswered messages</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <CreateRequestForm onRequestCreated={() => setRefreshKey(prev => prev + 1)} />
        <RequestList key={refreshKey} />
      </main>

      <footer className="bg-gray-100 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-gray-600 text-sm">
          <p>Demo: All outreach is mocked. Click "Check for Overdue (Demo)" to simulate the background job.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
