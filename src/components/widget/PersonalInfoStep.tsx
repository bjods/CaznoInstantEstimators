'use client'

import { useState } from 'react'
import { NameInput } from '@/components/widget-library/inputs/NameInput'
import { EmailInput } from '@/components/widget-library/inputs/EmailInput'
import { PhoneInput } from '@/components/widget-library/inputs/PhoneInput'
import { AddressAutocomplete } from '@/components/widget-library/inputs/AddressAutocomplete'

interface PersonalInfoStepProps {
  formData: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
  }
  updateField: (field: string, value: string) => void
  onComplete: () => void
}

export function PersonalInfoStep({ formData, updateField, onComplete }: PersonalInfoStepProps) {
  const [currentFocus, setCurrentFocus] = useState<string>('firstName')

  const focusNext = (fieldName: string) => {
    setCurrentFocus(fieldName)
  }

  const isFormValid = () => {
    const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    const isValidPhone = (phone: string) => {
      const cleaned = phone.replace(/\D/g, '')
      return cleaned.length === 10 || (cleaned.length === 11 && cleaned.startsWith('1'))
    }

    return (
      formData.firstName.trim() &&
      formData.lastName.trim() &&
      isValidEmail(formData.email) &&
      isValidPhone(formData.phone) &&
      formData.address.trim()
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Let's Get Started
        </h2>
        <p className="text-lg text-gray-600">
          We'll need some basic information to provide you with an accurate estimate
        </p>
        
        {/* Debug Skip Button */}
        <div className="mt-6">
          <button
            onClick={() => {
              updateField('firstName', 'John')
              updateField('lastName', 'Doe')
              updateField('email', 'john.doe@example.com')
              updateField('phone', '(555) 123-4567')
              updateField('address', '123 Main St, Toronto, ON')
              setTimeout(() => onComplete(), 100)
            }}
            className="text-sm text-gray-500 hover:text-blue-600 underline transition-colors"
          >
            🚀 Skip for Testing (Auto-fill & Continue)
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-lg font-medium text-gray-600 text-left">Let's get started</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <NameInput
            value={formData.firstName}
            onChange={(value) => updateField('firstName', value)}
            label="First Name"
            placeholder="Enter your first name"
            required
            autoFocus={currentFocus === 'firstName'}
            onEnter={() => focusNext('lastName')}
          />
          
          <NameInput
            value={formData.lastName}
            onChange={(value) => updateField('lastName', value)}
            label="Last Name"
            placeholder="Enter your last name"
            required
            autoFocus={currentFocus === 'lastName'}
            onEnter={() => focusNext('email')}
          />
        </div>

        <EmailInput
          value={formData.email}
          onChange={(value) => updateField('email', value)}
          label="Email Address"
          placeholder="your.email@example.com"
          required
          onEnter={() => focusNext('phone')}
        />

        <PhoneInput
          value={formData.phone}
          onChange={(value) => updateField('phone', value)}
          label="Phone Number"
          placeholder="(555) 123-4567"
          required
          onEnter={() => focusNext('address')}
        />

        <AddressAutocomplete
          value={formData.address}
          onChange={(value) => updateField('address', value)}
          label="Property Address"
          placeholder="Enter the project address"
          required
          onEnter={() => {
            if (isFormValid()) {
              onComplete()
            }
          }}
        />
      </div>

      <div className="text-center pt-8">
        <button
          onClick={onComplete}
          disabled={!isFormValid()}
          className={`px-12 py-4 rounded-lg font-semibold text-lg transition-all duration-200 ${
            isFormValid()
              ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg hover:shadow-xl'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Start Your Estimate
        </button>
        <p className="mt-3 text-sm text-gray-500">
          Press Enter to move to the next field
        </p>
      </div>
    </div>
  )
}