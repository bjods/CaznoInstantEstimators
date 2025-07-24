import { TextInput } from './inputs/TextInput'
import { RadioGroup } from './inputs/RadioGroup'
import { LinearFeetInput } from './inputs/LinearFeetInput'
import { NumberInput } from './inputs/NumberInput'
import { AddressAutocomplete } from './inputs/AddressAutocomplete'
import { MapWithDrawing } from './inputs/MapWithDrawing'
import { CheckboxGroup } from './inputs/CheckboxGroup'
import { SelectDropdown } from './inputs/SelectDropdown'
import { TextArea } from './inputs/TextArea'
import { DatePicker } from './inputs/DatePicker'
import { FileUpload } from './inputs/FileUpload'
import { ToggleSwitch } from './inputs/ToggleSwitch'
import { SliderInput } from './inputs/SliderInput'
import { AreaMeasurement } from './inputs/AreaMeasurement'
import { NameInput } from './inputs/NameInput'
import { EmailInput } from './inputs/EmailInput'
import { PhoneInput } from './inputs/PhoneInput'
import { ServiceSelection } from './inputs/ServiceSelection'
import { MeasurementHub } from './inputs/MeasurementHub'
import { ServiceDetailsHub } from './inputs/ServiceDetailsHub'
import { SchedulingInput } from './inputs/SchedulingInput'

export const ComponentMap = {
  'text_input': TextInput,
  'radio_group': RadioGroup,
  'linear_feet_input': LinearFeetInput,
  'number_input': NumberInput,
  'address_autocomplete': AddressAutocomplete,
  'map_with_drawing': MapWithDrawing,
  'checkbox_group': CheckboxGroup,
  'select_dropdown': SelectDropdown,
  'text_area': TextArea,
  'date_picker': DatePicker,
  'file_upload': FileUpload,
  'toggle_switch': ToggleSwitch,
  'slider_input': SliderInput,
  'area_measurement': AreaMeasurement,
  'name_input': NameInput,
  'email_input': EmailInput,
  'phone_input': PhoneInput,
  'service_selection': ServiceSelection,
  'measurement_hub': MeasurementHub,
  'service_details_hub': ServiceDetailsHub,
  'scheduling_input': SchedulingInput,
} as const

export type ComponentType = keyof typeof ComponentMap

// Re-export components for direct imports
export { 
  TextInput, 
  RadioGroup, 
  LinearFeetInput, 
  NumberInput, 
  AddressAutocomplete, 
  MapWithDrawing,
  CheckboxGroup,
  SelectDropdown,
  TextArea,
  DatePicker,
  FileUpload,
  ToggleSwitch,
  SliderInput,
  AreaMeasurement,
  NameInput,
  EmailInput,
  PhoneInput,
  ServiceSelection,
  MeasurementHub,
  ServiceDetailsHub,
  SchedulingInput
}