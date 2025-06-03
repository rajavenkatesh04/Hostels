'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestConnection() {
    const [status, setStatus] = useState('Testing connection...')

    useEffect(() => {
        async function testConnection() {
            try {
                // Simple query to test if connection works
                const { data, error } = await supabase
                    .from('hostels')
                    .select('count')
                    .limit(1)

                if (error) {
                    setStatus(`❌ Connection failed: ${error.message}`)
                } else {
                    setStatus('✅ Connection successful!')
                }
            } catch (error) {
                setStatus(`❌ Error: ${error.message}`)
            }
        }

        testConnection()
    }, [])

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">Database Connection Test</h1>
            <p className="text-lg">{status}</p>
        </div>
    )
}