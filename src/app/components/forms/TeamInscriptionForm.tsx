'use client'

import { FormEvent, useState } from "react"

export function TeamInscriptionForm(): React.ReactElement {
  const [formData, setFormData] = useState({
    team_name: '',
    leader_email: '',
    team_member1_email: '',
    team_member2_email: '',
    team_member3_email: '',
    team_member4_email: '',
    team_member5_email: '',
    team_member6_email: '',
    rol_member1: '',
    rol_member2: '',
    rol_member3: '',
    rol_member4: '',
    rol_member5: '',
    rol_member6: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setIsSubmitting(true)

    try {
      const res = await fetch('/api/forms/teamInscriptionForm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        const data = await res.json()
        alert(data.message)
        setFormData({
            team_name: '',
            leader_email: '',
            team_member1_email: '',
            team_member2_email: '',
            team_member3_email: '',
            team_member4_email: '',
            team_member5_email: '',
            team_member6_email: '',
            rol_member1: '',
            rol_member2: '',
            rol_member3: '',
            rol_member4: '',
            rol_member5: '',
            rol_member6: '',
        })
      } else {
        alert('Hubo un error al enviar los datos.')
      }
    } catch (error) {
      console.error('Error al enviar:', error)
      alert('Error inesperado')
    } finally {
      setIsSubmitting(false)
    }
  }


  return (
    <form onSubmit={onSubmit} className="max-w-md mx-auto my-2 p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-md space-y-4 text-sm">
      <div>
        <label htmlFor="team_name" className="block font-medium text-gray-700 dark:text-gray-200 mb-1">
          Nombre del team
        </label>
        <input
          type="text"
          id="team_name"
          name="team_name"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          value={formData.team_name}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="leader_email" className="block font-medium text-gray-700 dark:text-gray-200 mb-1">
          Email del líder
        </label>
        <input
          type="email"
          id="leader_email"
          name="leader_email"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          value={formData.leader_email}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="team_member1_email" className="block font-medium text-gray-700 dark:text-gray-200 mb-1">
          Email particiante 1
        </label>
        <input
          type="text"
          id="team_member1_email"
          name="team_member1_email"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          value={formData.team_member1_email}
          onChange={handleChange}
        />
      </div>

        <div>
            <label htmlFor="team_member2_email" className="block font-medium text-gray-700 dark:text-gray-200 mb-1">
            Email particiante 2
            </label>
            <input
            type="text"
            id="team_member2_email"
            name="team_member2_email"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            value={formData.team_member2_email}
            onChange={handleChange}
            />
        </div>

        <div>
            <label htmlFor="team_member3_email" className="block font-medium text-gray-700 dark:text-gray-200 mb-1">
            Email particiante 3
            </label>
            <input
            type="text"
            id="team_member3_email"
            name="team_member3_email"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            value={formData.team_member3_email}
            onChange={handleChange}
            />
        </div>

        <div>
            <label htmlFor="team_member4_email" className="block font-medium text-gray-700 dark:text-gray-200 mb-1">
            Email particiante 4
            </label>
            <input
            type="text"
            id="team_member4_email"
            name="team_member4_email"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            value={formData.team_member4_email}
            onChange={handleChange}
            />
        </div>

        <div>
            <label htmlFor="team_member5_email" className="block font-medium text-gray-700 dark:text-gray-200 mb-1">
            Email particiante 5
            </label>
            <input
            type="text"
            id="team_member5_email"
            name="team_member5_email"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.team_member5_email}
            onChange={handleChange}
            />
        </div>

        <div>
            <label htmlFor="team_member6_email" className="block font-medium text-gray-700 dark:text-gray-200 mb-1">
            Email particiante 6
            </label>
            <input
            type="text"
            id="team_member6_email"
            name="team_member6_email"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.team_member6_email}
            onChange={handleChange}
            />
        </div>

        <div>
            <label htmlFor="rol_member1" className="block font-medium text-gray-700 dark:text-gray-200 mb-1">
            Rol del participante 1
            </label>
            <input
            type="text"
            id="rol_member1"
            name="rol_member1"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            value={formData.rol_member1}
            onChange={handleChange}
            />
        </div>
        <div>
            <label htmlFor="rol_member2" className="block font-medium text-gray-700 dark:text-gray-200 mb-1">
            Rol del participante 2
            </label>
            <input
            type="text"
            id="rol_member2"
            name="rol_member2"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            value={formData.rol_member2}
            onChange={handleChange}
            />
        </div>

        <div>
            <label htmlFor="rol_member3" className="block font-medium text-gray-700 dark:text-gray-200 mb-1">
            Rol del participante 3
            </label>
            <input
            type="text"
            id="rol_member3"
            name="rol_member3"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            value={formData.rol_member3}
            onChange={handleChange}
            />
        </div>

        <div>
            <label htmlFor="rol_member4" className="block font-medium text-gray-700 dark:text-gray-200 mb-1">
            Rol del participante 4
            </label>
            <input
            type="text"
            id="rol_member4"
            name="rol_member4"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            value={formData.rol_member4}
            onChange={handleChange}
            />
        </div>

        <div>
            <label htmlFor="rol_member5" className="block font-medium text-gray-700 dark:text-gray-200 mb-1">
            Rol del participante 5
            </label>
            <input
            type="text"
            id="rol_member5"
            name="rol_member5"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            value={formData.rol_member5}
            onChange={handleChange}
            />
        </div>

        <div>
            <label htmlFor="rol_member6" className="block font-medium text-gray-700 dark:text-gray-200 mb-1">
            Rol del participante 6
            </label>
            <input
            type="text"
            id="rol_member6"
            name="rol_member6"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            value={formData.rol_member6}
            onChange={handleChange}
            />
        </div>


      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full bg-blue-600 text-white py-2 rounded-xl transition ${
          isSubmitting
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-blue-700 dark:hover:bg-blue-500'
        }`}
      >
        {isSubmitting ? 'Enviando...' : 'Enviar'}
      </button>
    </form>
  )
}