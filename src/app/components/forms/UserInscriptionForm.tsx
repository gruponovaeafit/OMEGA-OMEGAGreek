'use client'

import { FormEvent, useState } from "react"

export function UserInscriptionForm(): React.ReactElement {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    id_number: '',
    phone: '',
    birth_date: '',
    how_did_hear: '',
    has_availability: false,
    previous_participation: false,
    data_treatment: false,
    institutional_email: '',
    preferred_rol_1: '',
    preferred_rol_2: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  
    if (!formData.data_treatment) {
      alert('Debes aceptar el tratamiento de datos.')
      return
    }
  
    try {
      const res = await fetch('/api/UserInscriptionForm', {
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
          name: '',
          surname: '',
          institutional_email: '',
          id_number: '',
          phone: '',
          birth_date: '',
          how_did_hear: '',
          has_availability: false,
          previous_participation: false,
          preferred_rol_1: '',
          preferred_rol_2: '',
          data_treatment: false,
        })
      } else {
        alert('Hubo un error al enviar los datos.')
      }
    } catch (error) {
      console.error('Error al enviar:', error)
      alert('Error inesperado')
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-md mx-auto my-2 p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-md space-y-4 text-sm">
      <div>
        <label htmlFor="name" className="block font-medium text-gray-700 dark:text-gray-200 mb-1">
          Nombre
        </label>
        <input
          type="text"
          id="name"
          name="name"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          value={formData.name}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="surname" className="block font-medium text-gray-700 dark:text-gray-200 mb-1">
          Apellido
        </label>
        <input
          type="text"
          id="surname"
          name="surname"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          value={formData.surname}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="id_number" className="block font-medium text-gray-700 dark:text-gray-200 mb-1">
          Número de documento
        </label>
        <input
          type="text"
          id="id_number"
          name="id_number"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          value={formData.id_number}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="institutional_email" className="block font-medium text-gray-700 dark:text-gray-200 mb-1">
          Correo institucional
        </label>
        <input
          type="email"
          id="institutional_email"
          name="institutional_email"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          value={formData.institutional_email}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="phone" className="block font-medium text-gray-700 dark:text-gray-200 mb-1">
          Teléfono
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          value={formData.phone}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="birth_date" className="block font-medium text-gray-700 dark:text-gray-200 mb-1">
          Fecha de nacimiento
        </label>
        <input
          type="date"
          id="birth_date"
          name="birth_date"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          value={formData.birth_date}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="preferred_rol_1" className="block font-medium text-gray-700 dark:text-gray-200 mb-1">
          Rol preferido 1
        </label>
        <input
          type="text"
          id="preferred_rol_1"
          name="preferred_rol_1"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          value={formData.preferred_rol_1}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="preferred_rol_2" className="block font-medium text-gray-700 dark:text-gray-200 mb-1">
          Rol preferido 2
        </label>
        <input
          type="text"
          id="preferred_rol_2"
          name="preferred_rol_2"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.preferred_rol_2}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="how_did_hear" className="block font-medium text-gray-700 dark:text-gray-200 mb-1">
          ¿Cómo se enteró?
        </label>
        <input
          type="text"
          id="how_did_hear"
          name="how_did_hear"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.how_did_hear}
          onChange={handleChange}
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="has_availability"
          name="has_availability"
          className="mr-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          checked={formData.has_availability}
          onChange={handleChange}
          required
        />
        <label htmlFor="has_availability" className="text-gray-700 dark:text-gray-200">
          ¿Tiene disponibilidad?
        </label>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="previous_participation"
          name="previous_participation"
          className="mr-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          checked={formData.previous_participation}
          onChange={handleChange}
        />
        <label htmlFor="previous_participation" className="text-gray-700 dark:text-gray-200">
          ¿Ha participado anteriormente?
        </label>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="data_treatment"
          name="data_treatment"
          className="mr-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          required
          checked={formData.data_treatment}
          onChange={handleChange}
        />
        <label htmlFor="data_treatment" className="text-gray-700 dark:text-gray-200">
          Acepto el tratamiento de datos
        </label>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 dark:hover:bg-blue-500 transition"
      >
        Enviar
      </button>
    </form>
  )
}