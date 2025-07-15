# Component Pattern Guide

## Widget Component Pattern

Every widget component MUST follow this exact structure:

```typescript
// src/components/widget-library/[category]/[ComponentName].tsx

export interface [ComponentName]Props {
  value: any  // The current value
  onChange: (value: any) => void  // Update callback
  // Component-specific props
  label?: string
  placeholder?: string
  helpText?: string
  required?: boolean
  // Any other props specific to this component
}

export function [ComponentName]({ 
  value, 
  onChange, 
  label,
  placeholder,
  helpText,
  required,
  ...props 
}: [ComponentName]Props) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {/* Component implementation */}
      
      {helpText && (
        <p className="text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  )
}
```

## Common Component Patterns

### Text Input Pattern
```typescript
export function TextInput({ value, onChange, label, ...props }: TextInputProps) {
  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium">{label}</label>}
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        {...props}
      />
    </div>
  )
}
```

### Select/Radio Pattern
```typescript
export interface RadioGroupProps {
  value: string
  onChange: (value: string) => void
  options: Array<{ value: string; label: string; description?: string }>
  label?: string
}

export function RadioGroup({ value, onChange, options, label }: RadioGroupProps) {
  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium">{label}</label>}
      <div className="space-y-2">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-start p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
          >
            <input
              type="radio"
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              className="mt-1 mr-3"
            />
            <div>
              <div className="font-medium">{option.label}</div>
              {option.description && (
                <div className="text-sm text-gray-500">{option.description}</div>
              )}
            </div>
          </label>
        ))}
      </div>
    </div>
  )
}
```

### Number Input Pattern
```typescript
export function NumberInput({ value, onChange, min, max, step, ...props }: NumberInputProps) {
  return (
    <div className="space-y-2">
      {props.label && <label className="block text-sm font-medium">{props.label}</label>}
      <input
        type="number"
        value={value || ''}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        min={min}
        max={max}
        step={step}
        className="w-full px-3 py-2 border rounded-lg"
      />
    </div>
  )
}
```

## Dynamic Component Rendering

### Component Map Registration
```typescript
// src/components/widget-library/index.ts
import { TextInput } from './inputs/TextInput'
import { NumberInput } from './inputs/NumberInput'
import { RadioGroup } from './inputs/RadioGroup'
import { LinearFeetInput } from './inputs/LinearFeetInput'

export const ComponentMap = {
  'text_input': TextInput,
  'number_input': NumberInput,
  'radio_group': RadioGroup,
  'linear_feet_input': LinearFeetInput,
} as const

export type ComponentType = keyof typeof ComponentMap
```

### Dynamic Renderer
```typescript
// src/components/widget/DynamicComponent.tsx
import { ComponentMap } from '@/components/widget-library'

interface DynamicComponentProps {
  type: string
  props: Record<string, any>
  value: any
  onChange: (value: any) => void
}

export function DynamicComponent({ type, props, value, onChange }: DynamicComponentProps) {
  const Component = ComponentMap[type as keyof typeof ComponentMap]
  
  if (!Component) {
    console.error(`Component type "${type}" not found`)
    return null
  }
  
  return <Component {...props} value={value} onChange={onChange} />
}
```

## Form Integration Pattern

### Multi-Step Form
```typescript
export function DynamicWidget({ config }: { config: WidgetConfig }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Record<string, any>>({})
  
  const updateField = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const currentStepConfig = config.steps[currentStep]
  
  return (
    <div>
      <h2>{currentStepConfig.title}</h2>
      
      {currentStepConfig.components.map((component, idx) => (
        <DynamicComponent
          key={`${currentStep}-${idx}`}
          type={component.type}
          props={component.props}
          value={formData[component.props.name]}
          onChange={(value) => updateField(component.props.name, value)}
        />
      ))}
      
      {/* Navigation buttons */}
    </div>
  )
}
```

## Special Component Patterns

### Map Drawing Component
```typescript
export function MapDrawing({ value, onChange, mode = 'polygon' }: MapDrawingProps) {
  // Lazy load map library
  const [mapLoaded, setMapLoaded] = useState(false)
  
  useEffect(() => {
    // Load map script
    import('mapbox-gl').then(() => setMapLoaded(true))
  }, [])
  
  if (!mapLoaded) {
    return <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />
  }
  
  return <div id="map" className="h-64 rounded-lg" />
}
```

### Price Display Component
```typescript
export function PriceDisplay({ value, format = 'range' }: PriceDisplayProps) {
  if (!value) return null
  
  if (format === 'range' && value.min && value.max) {
    return (
      <div className="text-center p-6 bg-green-50 rounded-lg">
        <p className="text-sm text-gray-600">Estimated Price Range</p>
        <p className="text-3xl font-bold text-green-600">
          ${value.min.toLocaleString()} - ${value.max.toLocaleString()}
        </p>
      </div>
    )
  }
  
  return (
    <div className="text-center p-6 bg-green-50 rounded-lg">
      <p className="text-sm text-gray-600">Estimated Price</p>
      <p className="text-3xl font-bold text-green-600">
        ${value.toLocaleString()}
      </p>
    </div>
  )
}
```

## Component Configuration Examples

### Simple Input Config
```json
{
  "type": "text_input",
  "props": {
    "name": "customerName",
    "label": "Your Name",
    "placeholder": "John Smith",
    "required": true
  }
}
```

### Complex Component Config
```json
{
  "type": "radio_group",
  "props": {
    "name": "fenceType",
    "label": "Select Fence Type",
    "options": [
      {
        "value": "wood_privacy",
        "label": "Wood Privacy Fence",
        "description": "6ft tall cedar privacy fence"
      },
      {
        "value": "chain_link",
        "label": "Chain Link Fence",
        "description": "Galvanized steel, various heights"
      }
    ]
  }
}
```

## Testing Components

### Component Test Checklist
- [ ] Renders with minimal props
- [ ] Calls onChange when value changes
- [ ] Displays label and help text correctly
- [ ] Shows required indicator
- [ ] Handles empty/null values
- [ ] Keyboard accessible
- [ ] Mobile responsive

### Quick Test Pattern
```typescript
// In development, test component in isolation
export function TestComponent() {
  const [value, setValue] = useState('')
  
  return (
    <div className="p-8">
      <YourComponent
        value={value}
        onChange={setValue}
        label="Test Label"
        helpText="Test help text"
        required
      />
      <pre className="mt-4 p-2 bg-gray-100">
        Value: {JSON.stringify(value, null, 2)}
      </pre>
    </div>
  )
}
```