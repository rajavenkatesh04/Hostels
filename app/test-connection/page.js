'use client'
import { useEffect, useState } from 'react'

export default function ApiTester() {
    const [overallStatus, setOverallStatus] = useState('Testing all API endpoints...')
    const [results, setResults] = useState([])
    const [isTesting, setIsTesting] = useState(true)

    // Sample test data for POST endpoints
    const testPostData = {
        gender: 'boys',
        yearOfStudy: '1',
        branch: 'kattankulathur_chennai',
        acType: 'ac',
        washroomType: 'attached',
        sharing: '2'
    }

    const testHostelId = '5816682e-5ce4-41ca-8f35-8d2bb6c8b53d'

    useEffect(() => {
        async function testAllEndpoints() {
            const endpoints = [
                {
                    name: 'GET /api/branches',
                    method: 'GET',
                    url: '/api/branches',
                    description: 'Fetches all available branches with hostels'
                },
                {
                    name: 'POST /api/choose',
                    method: 'POST',
                    url: '/api/choose',
                    body: testPostData,
                    description: 'Filters hostels based on criteria'
                },
                {
                    name: 'GET /api/hostel',
                    method: 'GET',
                    url: `/api/hostel?id=${testHostelId}`,
                    description: 'Gets detailed information about a specific hostel'
                },
                {
                    name: 'GET /api/hostel-info',
                    method: 'GET',
                    url: '/api/hostel-info',
                    description: 'Lists basic information about all hostels'
                },
                {
                    name: 'GET /api/map-data',
                    method: 'GET',
                    url: '/api/map-data',
                    description: 'Fetches hostel data with coordinates for map display'
                }
            ]

            const testResults = []

            for (const endpoint of endpoints) {
                try {
                    const startTime = performance.now()

                    const options = {
                        method: endpoint.method,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }

                    if (endpoint.body) {
                        options.body = JSON.stringify(endpoint.body)
                    }

                    const response = await fetch(endpoint.url, options)
                    const data = await response.json()
                    const endTime = performance.now()
                    const duration = (endTime - startTime).toFixed(2)

                    testResults.push({
                        name: endpoint.name,
                        status: response.ok ? '✅ Success' : '❌ Failed',
                        responseTime: `${duration}ms`,
                        statusCode: response.status,
                        success: data.success || false,
                        message: data.message || (response.ok ? 'OK' : 'Request failed'),
                        data: endpoint.method === 'GET' ? data : undefined,
                        description: endpoint.description
                    })
                } catch (error) {
                    testResults.push({
                        name: endpoint.name,
                        status: '❌ Error',
                        responseTime: 'N/A',
                        statusCode: 0,
                        success: false,
                        message: error.message,
                        description: endpoint.description
                    })
                }
            }

            setResults(testResults)
            setIsTesting(false)

            // Determine overall status
            const allSuccessful = testResults.every(result => result.success)
            const anyFailed = testResults.some(result => !result.success)

            if (allSuccessful) {
                setOverallStatus('✅ All API endpoints are working correctly')
            } else if (anyFailed) {
                setOverallStatus('⚠️ Some API endpoints have issues')
            } else {
                setOverallStatus('❌ Critical API failures detected')
            }
        }

        testAllEndpoints()
    }, [])

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">API Endpoint Tester</h1>

            <div className="mb-8 p-4 rounded-lg bg-blue-50 border border-blue-200">
                <h2 className="text-xl font-semibold mb-2">Overall Status</h2>
                <p className={`text-lg ${
                    overallStatus.includes('✅') ? 'text-green-600' :
                        overallStatus.includes('⚠️') ? 'text-yellow-600' : 'text-red-600'
                }`}>
                    {overallStatus}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                    Tested at: {new Date().toLocaleString()}
                </p>
            </div>

            {isTesting ? (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p>Testing API endpoints...</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {results.map((result, index) => (
                        <div key={index} className="p-4 rounded-lg border" style={{
                            borderColor: result.success ? '#d1fae5' : '#fee2e2',
                            backgroundColor: result.success ? '#ecfdf5' : '#fef2f2'
                        }}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg">{result.name}</h3>
                                    <p className="text-sm text-gray-600">{result.description}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                    {result.status}
                                </span>
                            </div>

                            <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                                <div>
                                    <p className="font-medium">Status Code</p>
                                    <p>{result.statusCode || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="font-medium">Response Time</p>
                                    <p>{result.responseTime}</p>
                                </div>
                                <div>
                                    <p className="font-medium">Success</p>
                                    <p>{result.success ? 'Yes' : 'No'}</p>
                                </div>
                            </div>

                            <div className="mt-3">
                                <p className="font-medium">Message</p>
                                <p className="text-sm">{result.message}</p>
                            </div>

                            {result.data && (
                                <div className="mt-3">
                                    <p className="font-medium">Sample Data</p>
                                    <pre className="text-xs bg-white p-2 rounded overflow-auto max-h-40">
                                        {JSON.stringify(
                                            Array.isArray(result.data) ?
                                                result.data.slice(0, 2) :
                                                result.data,
                                            null, 2
                                        )}
                                    </pre>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h2 className="text-lg font-semibold mb-2">Testing Notes</h2>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                    <li>POST endpoints are tested with sample data</li>
                    <li>For /api/hostel, ensure you have a valid hostel ID in your database</li>
                    <li>Response times may vary based on network conditions</li>
                    <li>Check your browser's console for detailed error logs</li>
                </ul>
            </div>
        </div>
    )
}