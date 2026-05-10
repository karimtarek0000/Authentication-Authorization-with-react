import { useAuthActions } from '@/auth/hooks/useAuth'
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function Login() {
  const { login } = useAuthActions()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [email, setEmail] = useState('karim@test.com')
  const [password, setPassword] = useState('4545454sdsd')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await login(email, password)

      const from = searchParams.get('from') || '/'
      navigate(from, { replace: true })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'حصل خطأ'
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6">
      <h1 className="text-[40px] font-bold mb-6 text-center text-chart-2">تسجيل الدخول</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="البريد الإلكتروني"
          required
          className="w-full p-2 border border-black rounded focus:border-orange-500 focus:outline-none"
        />

        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="كلمة المرور"
          required
          className="w-full p-2 border border-black rounded focus:border-orange-500 focus:outline-none"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 text-white p-2 rounded disabled:opacity-50"
        >
          {isSubmitting ? 'جاري الدخول...' : 'دخول'}
        </button>
      </form>
    </div>
  )
}
