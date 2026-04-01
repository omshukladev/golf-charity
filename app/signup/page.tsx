'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) alert(error.message)
    else alert('Signup successful')
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800">
      
      <div className="w-[400px] p-8 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
        
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Create Account
        </h1>

        <input
          className="w-full mb-4 p-3 rounded bg-white/10 text-white border border-white/20"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full mb-6 p-3 rounded bg-white/10 text-white border border-white/20"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSignup}
          className="w-full bg-white text-black py-3 rounded-lg font-semibold hover:scale-105 transition"
        >
          Signup
        </button>

        <p className="text-gray-300 text-sm mt-4 text-center">
          Already have an account? <a href="/login" className="underline">Login</a>
        </p>
      </div>
    </div>
  )
}