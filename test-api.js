// Test script to verify API connectivity
const API_URL = 'http://92.62.118.113:8000';

async function testAPI() {
  console.log('Testing API connectivity...');
  
  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch(`${API_URL}/health`);
    console.log('Health status:', healthResponse.status);
    const healthData = await healthResponse.json();
    console.log('Health data:', healthData);
    
    // Test API endpoint with sample data
    console.log('\n2. Testing API endpoint...');
    const testData = {
      networth: 100000,
      income: 5000,
      expenses: 3000,
      investments: [
        {
          elementname: "Stocks",
          elementratio: 60,
          elementperformance: 8
        },
        {
          elementname: "Bonds",
          elementratio: 40,
          elementperformance: 4
        }
      ]
    };
    
    const apiResponse = await fetch(`${API_URL}/api`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(testData)
    });
    
    console.log('API status:', apiResponse.status);
    const apiData = await apiResponse.json();
    console.log('API response:', apiData);
    
    console.log('\n✅ API test completed successfully!');
    
  } catch (error) {
    console.error('❌ API test failed:', error);
  }
}

testAPI(); 