import { useState } from 'react'
import InputCard from './components/InputCard'
import InvestmentPortfolio from './components/InvestmentPortfolio'
import Insights from './components/Insights'
import './App.css'

function App() {
  const [form, setForm] = useState({
    networth: '',
    income: '',
    expenses: ''
  })
  
  const [investments, setInvestments] = useState([])
  const [apiResult, setApiResult] = useState(null)

  const handleFormSubmit = () => {
    // This will trigger the API call in Insights component
    console.log('Form submitted:', { form, investments })
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-center px-2 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,1.5fr] gap-6 w-full min-h-0 px-4 md:px-10 lg:px-16 xl:px-24 h-full">
          {/* Left Column - Input Components */}
          <div className="flex flex-col space-y-3 h-full min-h-0 overflow-auto">
            <div className="flex-shrink-0">
              <InputCard 
                form={form} 
                setForm={setForm} 
                onSubmit={handleFormSubmit}
              />
            </div>
            <div className="flex-1 min-h-0">
              <InvestmentPortfolio 
                investments={investments}
                setInvestments={setInvestments}
              />
            </div>
          </div>
          {/* Right Column - Insights */}
          <div className="h-full flex flex-col min-h-0 overflow-auto">
            <div className="h-full flex flex-col">
              <Insights 
                form={form}
                investments={investments}
                apiResult={apiResult}
                setApiResult={setApiResult}
                onSubmit={handleFormSubmit}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
