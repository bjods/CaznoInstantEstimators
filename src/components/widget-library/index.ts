import { TextInput } from './inputs/TextInput'
import { RadioGroup } from './inputs/RadioGroup'
import { LinearFeetInput } from './inputs/LinearFeetInput'
import { NumberInput } from './inputs/NumberInput'

export const ComponentMap = {
  'text_input': TextInput,
  'radio_group': RadioGroup,
  'linear_feet_input': LinearFeetInput,
  'number_input': NumberInput,
} as const

export type ComponentType = keyof typeof ComponentMap