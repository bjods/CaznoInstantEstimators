# Widget Configuration Guide for Supabase

This guide explains how to create and configure widgets in Supabase for each company using the Cazno instant estimator system.

## Table of Contents
1. [Database Structure](#database-structure)
2. [Creating a New Business](#creating-a-new-business)
3. [Creating a Widget](#creating-a-widget)
4. [Component Reference](#component-reference)
5. [Configuration Examples](#configuration-examples)

## Database Structure

### businesses table
```sql
- id: UUID (auto-generated)
- name: string (company name)
- slug: string (URL-friendly name)
- email: string
- phone: string
- settings: JSONB (theme, business info, etc.)
```

### widgets table
```sql
- id: UUID (auto-generated)
- business_id: UUID (foreign key to businesses)
- name: string (widget display name)
- embed_key: string (unique key for embedding)
- config: JSONB (step configuration)
- theme: JSONB (visual customization)
- is_active: boolean
```

## Creating a New Business

```sql
INSERT INTO businesses (name, slug, email, phone, settings)
VALUES (
  'Your Company Name',
  'your-company-slug',
  'contact@company.com',
  '555-0123',
  '{
    "theme": {
      "primaryColor": "#0066cc",
      "secondaryColor": "#f5f5f5"
    },
    "business_info": {
      "services": ["Service 1", "Service 2"],
      "service_area": "Your Service Area"
    }
  }'::jsonb
);
```

## Creating a Widget

### Basic Widget Structure
```json
{
  "steps": [
    {
      "id": "unique-step-id",
      "title": "Step Title",  // This title appears above the progress bar
      "components": [
        {
          "type": "component_type",
          "props": {
            "name": "field_name",
            "label": "Field Label",
            "required": true,
            // component-specific props
          }
        }
      ]
    }
  ],
  "priceDisplay": "instant",
  "thankYouMessage": "Thank you message here",
  "showInstantQuote": true,
  
  "pricingCalculator": {
    // Optional: Add real-time pricing to your widget
    // See Pricing Calculator section below for full documentation
  },
  
  "quoteStep": {
    // Optional: Add a dedicated quote/estimate step at the end
    // See Quote Step Configuration section below for full documentation
  },
  
  "notifications": {
    // Optional: Configure email notifications for leads
    // See Email Notifications section below for full documentation
  }
}
```

**Important**: The `title` field in each step is displayed as the main heading above the progress bar. This helps users understand what information they're providing at each stage of the form.

### SQL Insert Example
```sql
INSERT INTO widgets (
  business_id, 
  name, 
  embed_key, 
  config, 
  theme, 
  is_active
) VALUES (
  'business-uuid-here',
  'Widget Display Name',
  'unique-embed-key',
  '{ /* config JSON here */ }'::jsonb,
  '{
    "primaryColor": "#0066cc",
    "secondaryColor": "#f5f5f5",
    "fontFamily": "Inter",
    "borderRadius": "8px"
  }'::jsonb,
  true
);
```

## Component Reference

### 1. text_input
Basic text input field.
```json
{
  "type": "text_input",
  "props": {
    "name": "field_name",
    "label": "Field Label",
    "placeholder": "Enter text...",
    "required": true,
    "type": "text", // or "email", "tel"
    "helpText": "Helper text here"
  }
}
```

### 2. radio_group
Single selection from multiple options.
```json
{
  "type": "radio_group",
  "props": {
    "name": "field_name",
    "label": "Choose one option",
    "options": [
      {
        "value": "option1",
        "label": "Option 1",
        "description": "Optional description"
      }
    ],
    "required": true
  }
}
```

### 3. checkbox_group
Multiple selections from options.
```json
{
  "type": "checkbox_group",
  "props": {
    "name": "field_name",
    "label": "Select all that apply",
    "options": [
      {
        "value": "option1",
        "label": "Option 1",
        "description": "Optional description"
      }
    ],
    "required": true,
    "helpText": "Select at least one"
  }
}
```

### 4. number_input
Numeric input field.
```json
{
  "type": "number_input",
  "props": {
    "name": "field_name",
    "label": "Enter number",
    "min": 0,
    "max": 100,
    "step": 1,
    "placeholder": "0",
    "required": true
  }
}
```

### 5. linear_feet_input
Specialized number input for measurements.
```json
{
  "type": "linear_feet_input",
  "props": {
    "name": "field_name",
    "label": "Linear Feet",
    "min": 0,
    "max": 1000,
    "placeholder": "Enter feet",
    "required": true
  }
}
```

### 6. select_dropdown
Dropdown selection.
```json
{
  "type": "select_dropdown",
  "props": {
    "name": "field_name",
    "label": "Select Option",
    "placeholder": "Choose...",
    "options": [
      {
        "value": "option1",
        "label": "Option 1"
      }
    ],
    "required": true
  }
}
```

### 7. text_area
Multi-line text input.
```json
{
  "type": "text_area",
  "props": {
    "name": "field_name",
    "label": "Additional Details",
    "placeholder": "Enter details...",
    "rows": 4,
    "maxLength": 500,
    "helpText": "Maximum 500 characters"
  }
}
```

### 8. date_picker
Date selection input.
```json
{
  "type": "date_picker",
  "props": {
    "name": "field_name",
    "label": "Select Date",
    "min": "2024-01-01",
    "max": "2024-12-31",
    "required": true,
    "helpText": "Choose your preferred date"
  }
}
```

### 9. slider_input
Range slider for numeric values.
```json
{
  "type": "slider_input",
  "props": {
    "name": "field_name",
    "label": "Budget Range",
    "min": 1000,
    "max": 50000,
    "step": 500,
    "showValue": true,
    "required": true
  }
}
```

### 10. toggle_switch
Boolean on/off switch.
```json
{
  "type": "toggle_switch",
  "props": {
    "name": "field_name",
    "label": "Contact me ASAP",
    "helpText": "We'll prioritize your request"
  }
}
```

### 11. file_upload
File upload with preview.
```json
{
  "type": "file_upload",
  "props": {
    "name": "field_name",
    "label": "Upload Photos",
    "accept": "image/*",
    "maxSize": 5242880, // 5MB in bytes
    "helpText": "Upload project photos"
  }
}
```

### 12. address_autocomplete
Google Places address autocomplete.
```json
{
  "type": "address_autocomplete",
  "props": {
    "name": "field_name",
    "label": "Property Address",
    "placeholder": "Start typing address...",
    "required": true,
    "helpText": "Full property address"
  }
}
```

### 13. service_selection
Visual card-based service selection with images, titles, and descriptions.
```json
{
  "type": "service_selection",
  "props": {
    "name": "selected_services",
    "label": "What services do you need?",
    "helpText": "Select all services you're interested in",
    "multiple": true,
    "required": true,
    "options": [
      {
        "value": "concrete_driveway",
        "title": "Concrete Driveways",
        "description": "Professional concrete driveway installation and repair",
        "image": "https://example.com/images/concrete-driveway.jpg"
      },
      {
        "value": "lawn_care",
        "title": "Lawn Care Services", 
        "description": "Weekly lawn maintenance, fertilization, and weed control",
        "image": "https://example.com/images/lawn-care.jpg"
      },
      {
        "value": "snow_removal",
        "title": "Snow Removal",
        "description": "24/7 residential snow plowing and ice management"
      }
    ]
  }
}
```

**Properties:**
- `multiple`: Boolean - Allow multiple service selection (default: false)
- `options`: Array of service objects with:
  - `value`: Unique identifier for the service
  - `title`: Service name displayed on card
  - `description`: Service description text
  - `image`: Optional - URL to service image (shows placeholder if omitted)

**Notes:**
- Cards are displayed in a responsive grid (1-3 columns based on screen size)
- Selected cards show blue ring and checkmark
- Images should be high quality and relevant to the service
- If no image provided, shows placeholder with camera icon
- Cards have hover effects and smooth transitions

### 14. map_with_drawing
Interactive map for area/line drawing. Always shows satellite view with top-down perspective.

**Mode Options:**
- `linear`: Draw lines/polylines for fencing, pipelines, etc. Returns total length in feet.
- `area`: Draw polygons for lawns, patios, driveways. Returns square footage.
- `placement`: Draw rectangles for bin/dumpster placement. Returns width and height.

```json
{
  "type": "map_with_drawing",
  "props": {
    "name": "field_name",
    "label": "Mark Project Area",
    "mode": "area", // REQUIRED: "linear", "area", or "placement"
    "required": true,
    "helpText": "Click to draw on map"
  }
}
```

**Important Notes:**
- The `mode` prop is required and determines the drawing behavior
- Mode cannot be changed by users - it's fixed based on your configuration
- Always pair with an `address_autocomplete` component in a previous step for proper map centering
- Map automatically uses satellite view with no option to change

### 15. measurement_hub
Advanced measurement component that handles multiple services with different measurement methods. Automatically adapts based on selected services from previous steps.

```json
{
  "type": "measurement_hub",
  "props": {
    "name": "measurements",
    "label": "Measure Your Project Areas",
    "helpText": "We need measurements to provide an accurate estimate",
    "required": true,
    "servicesConfig": {
      "service_value": {
        "display_name": "Service Display Name",
        "icon": "🏠", // Optional emoji icon
        "requires_measurement": true, // Set to false for services that don't need measurement
        "unit": "sqft", // or "linear_ft"
        "measurement_methods": [
          {
            "type": "map_area", // or "map_linear", "manual_sqft", "manual_linear", "preset_sizes"
            "label": "Draw on Map",
            "description": "Most accurate", // Optional description
            "options": [ // Only for preset_sizes type
              {"label": "10' × 10'", "value": 100},
              {"label": "12' × 12'", "value": 144}
            ]
          }
        ]
      }
    }
  }
}
```

**Features:**
- Automatically displays tabs for each selected service
- Shows completion status for each service
- Allows multiple measurement methods per service
- Services can be marked as not requiring measurement
- Supports different units (square feet vs linear feet)
- Auto-advances to next service after measurement

**Measurement Method Types:**
- `map_area`: Draw polygons on map for area measurement (returns square footage)
- `map_linear`: Draw polylines on map for linear measurement (returns linear feet)
- `manual_sqft`: Manual input for square footage
- `manual_linear`: Manual input for linear feet
- `preset_sizes`: Pre-defined size options

**Important Notes:**
- Requires `selected_services` or similar field from previous step
- Address is automatically passed from personal info step
- Services not in `servicesConfig` will be ignored
- Set `requires_measurement: false` for services like consultations

## Configuration Examples

### Fencing Estimator
```json
{
  "steps": [
    {
      "id": "fence-type",
      "title": "Fence Type",
      "components": [
        {
          "type": "radio_group",
          "props": {
            "name": "fence_type",
            "label": "What type of fence do you need?",
            "options": [
              {
                "value": "wood_privacy",
                "label": "Wood Privacy",
                "description": "6ft cedar privacy fence"
              },
              {
                "value": "chain_link",
                "label": "Chain Link",
                "description": "Galvanized chain link"
              }
            ],
            "required": true
          }
        }
      ]
    },
    {
      "id": "measurements",
      "title": "Measurements",
      "components": [
        {
          "type": "linear_feet_input",
          "props": {
            "name": "fence_length",
            "label": "Total Linear Feet",
            "min": 10,
            "max": 1000,
            "required": true
          }
        },
        {
          "type": "number_input",
          "props": {
            "name": "gate_count",
            "label": "Number of Gates",
            "min": 0,
            "max": 10,
            "step": 1
          }
        }
      ]
    }
  ]
}
```

### Landscaping Estimator with Map
```json
{
  "steps": [
    {
      "id": "location",
      "title": "Project Location",
      "components": [
        {
          "type": "address_autocomplete",
          "props": {
            "name": "address",
            "label": "Property Address",
            "required": true
          }
        },
        {
          "type": "map_with_drawing",
          "props": {
            "name": "project_area",
            "label": "Draw Project Area",
            "mode": "area",
            "required": true,
            "helpText": "Click points to outline the lawn area"
          }
        }
      ]
    }
  ]
}
```

### Multi-Service Home Contractor Estimator
```json
{
  "steps": [
    {
      "id": "service-selection",
      "title": "Services Needed",
      "components": [
        {
          "type": "service_selection",
          "props": {
            "name": "selected_services",
            "label": "What services do you need?",
            "helpText": "Select all services you're interested in",
            "multiple": true,
            "required": true,
            "options": [
              {
                "value": "concrete_driveway",
                "title": "Concrete Driveways",
                "description": "Professional concrete driveway installation and repair",
                "image": "https://example.com/images/concrete-driveway.jpg"
              },
              {
                "value": "landscaping",
                "title": "Landscaping",
                "description": "Complete landscape design and installation services",
                "image": "https://example.com/images/landscaping.jpg"
              },
              {
                "value": "snow_removal",
                "title": "Snow Removal",
                "description": "24/7 residential snow plowing and ice management"
              }
            ]
          }
        }
      ]
    },
    {
      "id": "project-location", 
      "title": "Project Location",
      "components": [
        {
          "type": "address_autocomplete",
          "props": {
            "name": "project_address",
            "label": "Property Address",
            "required": true
          }
        }
      ]
    }
  ]
}
```

### Dumpster Rental with Placement Map
```json
{
  "steps": [
    {
      "id": "delivery-location",
      "title": "Delivery Location",
      "components": [
        {
          "type": "address_autocomplete",
          "props": {
            "name": "delivery_address",
            "label": "Delivery Address",
            "required": true
          }
        },
        {
          "type": "map_with_drawing",
          "props": {
            "name": "placement_location",
            "label": "Mark Dumpster Placement",
            "mode": "placement",
            "required": true,
            "helpText": "Click twice to place a rectangle where the dumpster should go"
          }
        }
      ]
    }
  ]
}
```

### Complete Multi-Service Estimator with MeasurementHub
```json
{
  "steps": [
    {
      "id": "service-selection",
      "title": "Select Services",
      "components": [
        {
          "type": "service_selection",
          "props": {
            "name": "selected_services",
            "label": "What services do you need?",
            "multiple": true,
            "required": true,
            "options": [
              {
                "value": "lawn_care",
                "title": "Lawn Care",
                "description": "Regular maintenance and treatment"
              },
              {
                "value": "patio",
                "title": "Patio Installation",
                "description": "Custom patio design and installation"
              },
              {
                "value": "fence",
                "title": "Fence Installation",
                "description": "Privacy and security fencing"
              },
              {
                "value": "consultation",
                "title": "Design Consultation",
                "description": "Professional landscape design advice"
              }
            ]
          }
        }
      ]
    },
    {
      "id": "measurements",
      "title": "Project Measurements",
      "components": [
        {
          "type": "measurement_hub",
          "props": {
            "name": "measurements",
            "label": "Measure Your Project Areas",
            "required": true,
            "servicesConfig": {
              "lawn_care": {
                "display_name": "Lawn",
                "icon": "🌱",
                "requires_measurement": true,
                "unit": "sqft",
                "measurement_methods": [
                  {
                    "type": "map_area",
                    "label": "Draw on Map",
                    "description": "Most accurate"
                  },
                  {
                    "type": "manual_sqft",
                    "label": "Enter Size"
                  }
                ]
              },
              "patio": {
                "display_name": "Patio",
                "icon": "🏠",
                "requires_measurement": true,
                "unit": "sqft",
                "measurement_methods": [
                  {
                    "type": "map_area",
                    "label": "Draw on Map"
                  },
                  {
                    "type": "manual_sqft",
                    "label": "Enter Size"
                  },
                  {
                    "type": "preset_sizes",
                    "label": "Common Sizes",
                    "options": [
                      {"label": "10' × 10'", "value": 100},
                      {"label": "12' × 12'", "value": 144},
                      {"label": "15' × 15'", "value": 225},
                      {"label": "20' × 20'", "value": 400}
                    ]
                  }
                ]
              },
              "fence": {
                "display_name": "Fence",
                "icon": "🚧",
                "requires_measurement": true,
                "unit": "linear_ft",
                "measurement_methods": [
                  {
                    "type": "map_linear",
                    "label": "Draw on Map",
                    "description": "Draw fence line path"
                  },
                  {
                    "type": "manual_linear",
                    "label": "Enter Linear Feet",
                    "description": "Measure perimeter"
                  }
                ]
              },
              "consultation": {
                "display_name": "Consultation",
                "icon": "💬",
                "requires_measurement": false
              }
            }
          }
        }
      ]
    }
  ]
}
```

## Best Practices

1. **Field Names**: Use snake_case for field names (e.g., `project_type`, `square_feet`)
2. **Step IDs**: Use kebab-case for step IDs (e.g., `project-details`, `contact-info`)
3. **Required Fields**: Mark essential fields as required
4. **Help Text**: Provide clear instructions for complex inputs
5. **Validation**: Use min/max values for numeric inputs
6. **Map Components**: Always pair with address input for proper centering

## Testing Your Widget

After creating a widget, test it at:
```
https://yourdomain.com/widget/[embed_key]
```

For local testing:
```
http://localhost:3000/widget/[embed_key]
```

## Quote Step Configuration

The quote step creates a dedicated final page that displays a comprehensive estimate with customizable call-to-action buttons. This step appears after all form steps and provides a professional quote presentation.

### Basic Structure

```json
{
  "steps": [...], // Your existing form steps
  
  "quoteStep": {
    "title": "Your Estimate",
    "subtitle": "Based on the information you provided",
    "showDetailedBreakdown": true,
    "ctaButtons": [
      {
        "id": "submit",
        "text": "Get This Quote",
        "type": "primary",
        "action": "submit"
      },
      {
        "id": "call",
        "text": "Call Us Now",
        "type": "secondary", 
        "action": "phone",
        "config": {
          "phoneNumber": "+1-555-123-4567"
        }
      }
    ]
  }
}
```

### Quote Step Properties

#### Core Settings

- **title**: Main heading displayed on the quote page
- **subtitle**: Optional subheading for additional context
- **showDetailedBreakdown**: Whether to show itemized pricing breakdown (requires pricingCalculator)

#### CTA Buttons Configuration

Each button in the `ctaButtons` array supports:

- **id**: Unique identifier for the button
- **text**: Button label text
- **type**: Visual style - `"primary"` (blue background) or `"secondary"` (white with blue border)
- **action**: Button behavior - see actions below
- **config**: Additional configuration based on action type

### CTA Button Actions

#### 1. Submit Action
Submits the form data and pricing to your system.

```json
{
  "id": "submit",
  "text": "Get This Quote",
  "type": "primary",
  "action": "submit"
}
```

#### 2. Phone Action
Opens the phone dialer with a pre-filled number.

```json
{
  "id": "call",
  "text": "Call Us Now",
  "type": "secondary",
  "action": "phone",
  "config": {
    "phoneNumber": "+1-555-123-4567"
  }
}
```

#### 3. Calendar Action
Opens a calendar booking system (like Calendly, Acuity, etc.)

```json
{
  "id": "schedule",
  "text": "Schedule Site Visit",  
  "type": "primary",
  "action": "calendar",
  "config": {
    "calendarUrl": "https://calendly.com/your-business/consultation",
    "newTab": true
  }
}
```

#### 4. Custom Action
Opens any custom URL for specialized workflows.

```json
{
  "id": "payment",
  "text": "Pay Deposit",
  "type": "primary", 
  "action": "custom",
  "config": {
    "customUrl": "https://your-payment-system.com/deposit",
    "newTab": false
  }
}
```

### Quote Step Features

#### Service Summary
Automatically displays:
- Selected services with labels
- Key measurements (linear feet, square feet, days, etc.)
- Additional options (gates, prep work, waste type, etc.)

#### Pricing Display  
Shows pricing based on your pricingCalculator configuration:
- **Fixed**: Exact calculated price
- **Range**: Price range with multiplier
- **Minimum**: "Starting at" format
- **Custom**: For services without pricing calculator

#### Detailed Breakdown
When `showDetailedBreakdown: true`:
- Base price calculation
- Applied modifiers with descriptions
- Minimum charge notation (if applied)
- Total with clear formatting

### Business Flow Examples

#### Bin Rental Service
```json
{
  "quoteStep": {
    "title": "Your Bin Rental Quote",
    "subtitle": "Ready to deliver to your location",
    "showDetailedBreakdown": true,
    "ctaButtons": [
      {
        "id": "schedule_delivery",
        "text": "Schedule Delivery",
        "type": "primary",
        "action": "calendar",
        "config": {
          "calendarUrl": "https://calendly.com/bin-rentals/delivery",
          "newTab": true
        }
      },
      {
        "id": "call_questions",
        "text": "Have Questions? Call Us",
        "type": "secondary",
        "action": "phone",
        "config": {
          "phoneNumber": "+1-555-BIN-RENT"
        }
      }
    ]
  }
}
```

#### Landscaping Service
```json
{
  "quoteStep": {
    "title": "Your Landscaping Estimate",
    "subtitle": "Professional design and installation services",
    "showDetailedBreakdown": false,
    "ctaButtons": [
      {
        "id": "book_consultation",
        "text": "Book Free Consultation",
        "type": "primary",
        "action": "calendar",
        "config": {
          "calendarUrl": "https://acuityscheduling.com/landscaping/consultation",
          "newTab": true
        }
      },
      {
        "id": "submit_quote",
        "text": "Request Detailed Quote",
        "type": "secondary",
        "action": "submit"
      }
    ]
  }
}
```

#### Fencing Service  
```json
{
  "quoteStep": {
    "title": "Your Fencing Quote",
    "subtitle": "Professional installation with warranty",
    "showDetailedBreakdown": true,
    "ctaButtons": [
      {
        "id": "get_quote",
        "text": "Get This Quote",
        "type": "primary", 
        "action": "submit"
      },
      {
        "id": "schedule_measurement",
        "text": "Schedule Free Measurement",
        "type": "secondary",
        "action": "calendar",
        "config": {
          "calendarUrl": "https://calendly.com/fence-company/measurement",
          "newTab": true
        }
      },
      {
        "id": "call_now",
        "text": "Call for Questions",
        "type": "secondary",
        "action": "phone", 
        "config": {
          "phoneNumber": "+1-555-FENCING"
        }
      }
    ]
  }
}
```

### Quote Step Best Practices

1. **Clear Messaging**: Use titles and subtitles that match your business tone
2. **Action Hierarchy**: Put the most important action first with `"primary"` type
3. **Multiple Options**: Offer 2-3 different ways for customers to proceed
4. **Contact Methods**: Always provide a way to ask questions (phone/email)
5. **Booking Integration**: Use calendar links for services requiring appointments
6. **Payment Flows**: Link to payment systems for services requiring deposits

### Integration Notes

- Quote step appears automatically after the last configured form step
- Works with or without pricing calculator
- Service summary adapts to single or multi-service forms
- All customer data is preserved through the quote step
- CTA actions can trigger form submission with full pricing data

## Pricing Calculator Configuration

The pricing calculator allows you to display real-time pricing estimates as users fill out your widget. It's completely configurable through JSON and supports complex pricing logic.

### Basic Structure

```json
{
  "steps": [...], // Your existing form steps
  
  "pricingCalculator": {
    "basePricing": {
      "service_field": "field_name",  // Which form field determines the service
      "prices": {
        "service_option_1": {
          "amount": 45,
          "unit": "linear_foot",
          "minCharge": 500
        },
        "service_option_2": {
          "amount": 25,
          "unit": "sqft",
          "minCharge": 300
        }
      }
    },
    
    "modifiers": [
      // Optional: Price adjustments based on form data
    ],
    
    "driveTime": {
      // Optional: Add drive time/distance-based pricing
      // See Drive Time Pricing section below
    },
    
    "display": {
      "showCalculation": true,     // Show detailed breakdown
      "format": "range",           // "fixed", "range", or "minimum"
      "rangeMultiplier": 1.2       // For range: show price to price×1.2
    }
  }
}
```

### Base Pricing Configuration

The `basePricing` section defines your core service pricing:

- **service_field**: The form field that determines which service was selected
- **prices**: Object mapping service values to pricing config
- **amount**: Price per unit
- **unit**: What unit the pricing is based on (see supported units below)
- **minCharge**: Optional minimum charge (overrides calculated price if lower)

#### Supported Units

- `linear_foot` / `linear_feet` - Maps to form fields: linearFeet, linear_feet, feet
- `sqft` / `square_feet` - Maps to form fields: sqft, square_feet, area
- `cubic_yard` - Maps to form fields: cubic_yards, yards
- `days` - Maps to form fields: days, rentalDays, duration
- `hours` - Maps to form fields: hours, duration
- `units` - Maps to form fields: quantity, count, units

### Modifiers

Modifiers allow you to adjust pricing based on additional form data. There are three types:

#### 1. Per Unit Modifiers

Multiplies a form field value by a price amount:

```json
{
  "id": "gates",
  "type": "perUnit",
  "field": "gateCount",
  "calculation": {
    "operation": "add",
    "amount": 200,
    "perUnit": true          // $200 × gateCount
  }
}
```

#### 2. Conditional Modifiers

Applies when a condition is met:

```json
{
  "id": "difficult_access",
  "type": "conditional",
  "field": "hasdifficultAccess",
  "condition": "equals",
  "value": true,
  "calculation": {
    "operation": "multiply",
    "amount": 1.25           // 25% increase
  }
}
```

#### 3. Threshold Modifiers

Applies when a field value crosses a threshold:

```json
{
  "id": "large_project_discount",
  "type": "threshold",
  "field": "linearFeet",
  "condition": "greaterThan",
  "value": 500,
  "calculation": {
    "operation": "multiply",
    "amount": 0.9            // 10% discount for projects > 500ft
  }
}
```

### Calculation Operations

- **add**: Adds the amount to current price
- **multiply**: Multiplies current price by amount (use for percentages)
- **subtract**: Subtracts the amount from current price

### Display Options

#### Format Types

- **fixed**: Shows exact calculated price
- **range**: Shows price range (price to price × rangeMultiplier)
- **minimum**: Shows "Starting at $X" format

#### Show Calculation

When `showCalculation: true`, displays:
- Base price calculation
- Each applied modifier
- Minimum charge (if applied)
- Final total

### Complete Examples

#### Fencing Estimator with Pricing

```json
{
  "steps": [
    {
      "id": "fence-type",
      "title": "Fence Type",
      "components": [
        {
          "type": "radio_group",
          "props": {
            "name": "fenceType",
            "label": "What type of fence do you need?",
            "options": [
              {
                "value": "wood_privacy",
                "label": "Wood Privacy",
                "description": "6ft cedar privacy fence"
              },
              {
                "value": "chain_link",
                "label": "Chain Link", 
                "description": "Galvanized chain link"
              }
            ],
            "required": true
          }
        }
      ]
    },
    {
      "id": "measurements",
      "title": "Measurements",
      "components": [
        {
          "type": "linear_feet_input",
          "props": {
            "name": "linearFeet",
            "label": "Total Linear Feet",
            "min": 10,
            "max": 1000,
            "required": true
          }
        },
        {
          "type": "number_input", 
          "props": {
            "name": "gateCount",
            "label": "Number of Gates",
            "min": 0,
            "max": 10,
            "step": 1
          }
        }
      ]
    }
  ],
  
  "showInstantQuote": true,
  
  "pricingCalculator": {
    "basePricing": {
      "service_field": "fenceType",
      "prices": {
        "wood_privacy": {
          "amount": 45,
          "unit": "linear_foot",
          "minCharge": 500
        },
        "chain_link": {
          "amount": 25,
          "unit": "linear_foot",
          "minCharge": 300
        }
      }
    },
    
    "modifiers": [
      {
        "id": "gates",
        "type": "perUnit",
        "field": "gateCount",
        "calculation": {
          "operation": "add",
          "amount": 200,
          "perUnit": true
        }
      },
      {
        "id": "large_project_discount",
        "type": "threshold",
        "field": "linearFeet", 
        "condition": "greaterThan",
        "value": 500,
        "calculation": {
          "operation": "multiply",
          "amount": 0.9
        }
      }
    ],
    
    "display": {
      "showCalculation": true,
      "format": "range",
      "rangeMultiplier": 1.2
    }
  }
}
```

#### Bin Rental with Time-Based Pricing

```json
{
  "pricingCalculator": {
    "basePricing": {
      "service_field": "binSize",
      "prices": {
        "10_yard": { "amount": 300, "unit": "days", "minCharge": 300 },
        "20_yard": { "amount": 400, "unit": "days", "minCharge": 400 },
        "30_yard": { "amount": 500, "unit": "days", "minCharge": 500 }
      }
    },
    "modifiers": [
      {
        "id": "extra_days",
        "type": "threshold",
        "field": "rentalDays",
        "condition": "greaterThan",
        "value": 7,
        "calculation": {
          "operation": "add",
          "amount": 25,
          "perUnit": true
        }
      },
      {
        "id": "concrete_surcharge",
        "type": "conditional",
        "field": "wasteType",
        "condition": "equals",
        "value": "concrete",
        "calculation": {
          "operation": "add",
          "amount": 150
        }
      }
    ],
    "display": {
      "showCalculation": true,
      "format": "fixed"
    }
  }
}
```

#### Landscaping with Area-Based Pricing

```json
{
  "pricingCalculator": {
    "basePricing": {
      "service_field": "serviceType",
      "prices": {
        "lawn_install": { "amount": 2.50, "unit": "sqft" },
        "mulch_delivery": { "amount": 45, "unit": "cubic_yard" }
      }
    },
    "modifiers": [
      {
        "id": "prep_work",
        "type": "conditional",
        "field": "needsPrepWork",
        "condition": "equals", 
        "value": true,
        "calculation": {
          "operation": "add",
          "amount": 0.75,
          "perUnit": true
        }
      }
    ],
    "display": {
      "showCalculation": false,
      "format": "minimum"
    }
  }
}
```

### Testing Your Pricing

1. Set up your widget with pricing configuration
2. Fill out the form to see real-time price updates
3. Check the final estimate includes pricing breakdown
4. Verify pricing data is stored in the estimates table

## Drive Time Pricing

Add automatic distance-based pricing to account for travel costs from your yard/office to the job site. The system calculates driving distance using Google Maps and applies your configured pricing rules.

### Basic Drive Time Configuration

```json
{
  "pricingCalculator": {
    "basePricing": {...},
    "modifiers": [...],
    
    "driveTime": {
      "enabled": true,
      "yardAddress": "123 Main St, Your City, State 12345",
      "addressField": "address",
      "pricing": {
        "type": "perMile",
        "rate": 2.50,
        "freeRadius": 15,
        "maxDistance": 50
      }
    }
  }
}
```

### Drive Time Properties

#### Core Settings

- **enabled**: Whether drive time pricing is active
- **yardAddress**: Your business address (yard, warehouse, office)
- **addressField**: Form field containing customer address (usually "address")
- **pricing**: Pricing configuration object

### Drive Time Pricing Types

#### 1. Per Mile Pricing

Charges a fixed rate per mile of driving distance.

```json
{
  "type": "perMile",
  "rate": 2.50,           // $2.50 per mile
  "freeRadius": 15,       // First 15 miles free
  "maxDistance": 50       // Service limit: 50 miles max
}
```

#### 2. Per Minute Pricing

Charges based on estimated driving time.

```json
{
  "type": "perMinute", 
  "rate": 1.00,          // $1.00 per minute
  "freeRadius": 10,      // ~10 miles free (varies by traffic)
  "maxDistance": 60      // Service limit: 60 miles max
}
```

#### 3. Tiered Distance Pricing

Different flat rates for distance zones.

```json
{
  "type": "tiered",
  "tiers": [
    {
      "minDistance": 0,
      "maxDistance": 15,
      "rate": 0           // Free within 15 miles
    },
    {
      "minDistance": 15,
      "maxDistance": 30,
      "rate": 50          // $50 flat rate for 15-30 miles
    },
    {
      "minDistance": 30,
      "maxDistance": 50,
      "rate": 100         // $100 flat rate for 30-50 miles
    }
  ],
  "maxDistance": 50
}
```

### Drive Time Configuration Options

#### Free Radius

Set a distance within which you don't charge for travel:

```json
{
  "type": "perMile",
  "rate": 3.00,
  "freeRadius": 20      // No charge within 20 miles
}
```

#### Maximum Distance

Limit service area to prevent unrealistic jobs:

```json
{
  "type": "perMile", 
  "rate": 2.00,
  "maxDistance": 75     // No service beyond 75 miles
}
```

#### Billable Distance Calculation

- **With Free Radius**: Only distance beyond free radius is charged
- **Without Free Radius**: Full distance from yard to job site is charged

### Business Examples

#### Local Fencing Company

```json
{
  "driveTime": {
    "enabled": true,
    "yardAddress": "456 Industrial Dr, Springfield, IL 62701",
    "addressField": "address",
    "pricing": {
      "type": "perMile",
      "rate": 3.00,
      "freeRadius": 20,
      "maxDistance": 60
    }
  }
}
```

**Result**: Free within 20 miles, then $3/mile for 21-60 miles. No service beyond 60 miles.

#### Regional Bin Rental Service

```json
{
  "driveTime": {
    "enabled": true,
    "yardAddress": "789 Depot Rd, Central City, TX 75001", 
    "addressField": "address",
    "pricing": {
      "type": "tiered",
      "tiers": [
        {"minDistance": 0, "maxDistance": 25, "rate": 0},
        {"minDistance": 25, "maxDistance": 50, "rate": 75},
        {"minDistance": 50, "maxDistance": 100, "rate": 150}
      ],
      "maxDistance": 100
    }
  }
}
```

**Result**: Free within 25 miles, $75 delivery fee for 25-50 miles, $150 for 50-100 miles.

#### Metro Landscaping Service

```json
{
  "driveTime": {
    "enabled": true,
    "yardAddress": "321 Garden Ave, Metro City, CA 90210",
    "addressField": "address", 
    "pricing": {
      "type": "perMinute",
      "rate": 1.25,
      "freeRadius": 12,
      "maxDistance": 40
    }
  }
}
```

**Result**: Free within ~12 miles, then $1.25/minute drive time for longer distances.

### Technical Implementation

#### Distance Calculation

- Uses Google Maps Distance Matrix API for accurate driving distances
- Accounts for actual roads, traffic patterns, and route optimization
- Returns both distance (miles) and duration (minutes)

#### Fallback Behavior

- Development mode uses mock distance calculations
- If Google Maps API fails, drive time cost is skipped (no error to user)
- Distance calculation happens when customer address is entered

#### Performance

- Distance calculated asynchronously on quote step
- Real-time pricing shows estimated cost without drive time
- Final quote includes accurate drive time calculation

### Drive Time Display

Drive time costs appear in pricing breakdowns as:

- **Free Delivery**: "Free delivery within 15 miles"
- **Per Mile**: "Drive time: 12.5 billable miles × $3.00/mile"
- **Per Minute**: "Drive time: 25 minutes × $1.25/minute"  
- **Tiered**: "Drive time: 25-50 mile zone - $75"
- **Out of Range**: "Service not available beyond 50 miles"

### Setup Requirements

#### Google Maps API Key

1. Get API key from [Google Cloud Console](https://console.cloud.google.com)
2. Enable Distance Matrix API
3. Add to environment: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key`

#### Address Field Configuration

Ensure your widget has an address input field:

```json
{
  "type": "address_autocomplete",
  "props": {
    "name": "address",
    "label": "Service Address",
    "required": true
  }
}
```

### Best Practices

1. **Realistic Rates**: Research actual vehicle costs (IRS rate is ~65¢/mile)
2. **Free Radius**: Set based on your typical service area
3. **Maximum Distance**: Prevent quotes for unrealistic distances
4. **Clear Communication**: Use descriptive labels in pricing breakdown
5. **Test Addresses**: Verify calculations with known distances
6. **Backup Plans**: Always handle API failures gracefully

### Pricing Best Practices

1. **Start Simple**: Begin with base pricing only, add modifiers as needed
2. **Test Thoroughly**: Try edge cases and different form combinations
3. **Clear Units**: Make sure your form fields match the pricing units
4. **Reasonable Minimums**: Set minimum charges to avoid unrealistic low prices
5. **User Experience**: Consider whether to show detailed breakdowns or simple totals
6. **A/B Testing**: The JSON configuration makes it easy to test different pricing approaches

## Email Notifications

Configure automatic email notifications when leads are submitted through your widgets. The system supports both business notifications and customer confirmations.

### Configuration Structure

```json
{
  "notifications": {
    "email": {
      "enabled": true,
      "business_emails": ["owner@company.com", "sales@company.com"],
      "send_customer_confirmation": true,
      "send_business_alert": true
    }
  }
}
```

### Configuration Options

#### `enabled` (boolean)
- Controls whether email notifications are active
- Set to `false` to disable all email notifications for this widget

#### `business_emails` (array of strings)
- List of email addresses to receive new lead alerts
- Can include multiple recipients (owner, sales team, etc.)
- Each email gets the same notification content

#### `send_customer_confirmation` (boolean)
- When `true`, sends a confirmation email to the customer
- Uses the customer's email address from the form
- Professional thank you message with quote summary

#### `send_business_alert` (boolean)
- When `true`, sends new lead notifications to business emails
- Includes all form data, pricing, and customer contact info
- Formatted for quick review and follow-up

### Email Templates
 
The system includes two professional email templates:

#### New Lead Alert (Business Notification)
- **Recipients**: Business email addresses
- **Subject**: "New Lead from {{service}} Widget - {{name}}"
- **Content**: Complete lead information including contact details, service selection, pricing, and measurements
- **Purpose**: Immediate notification to start follow-up process

#### Customer Confirmation
- **Recipients**: Customer email address from form
- **Subject**: "Thank you for your {{service}} quote request"
- **Content**: Professional confirmation with quote summary and next steps
- **Purpose**: Build trust and set expectations

### Template Variables

Both templates support dynamic variables from the form data:

- `{{name}}` - Customer's full name
- `{{email}}` - Customer's email address
- `{{phone}}` - Customer's phone number
- `{{address}}` - Property/service address
- `{{service}}` - Selected service(s)
- `{{price}}` - Calculated estimate (if pricing enabled)
- `{{measurements}}` - Any measurements (linear feet, square feet, etc.)
- `{{additionalInfo}}` - Additional options selected
- `{{timestamp}}` - When the quote was requested
- `{{widgetName}}` - Name of the widget used
- `{{businessName}}` - Your business name
- `{{businessEmail}}` - Your business email
- `{{businessPhone}}` - Your business phone

### Setup Requirements

#### 1. Resend API Key
Set up your Resend account and add the API key to your Supabase Edge Functions environment:
```bash
RESEND_API_KEY=your_resend_api_key_here
```

#### 2. Email Templates
Default templates are automatically created for each business. You can customize them in the `email_templates` table:

```sql
-- View current templates
SELECT * FROM email_templates WHERE business_id = 'your-business-id';

-- Update template content
UPDATE email_templates 
SET html_body = 'your custom HTML template'
WHERE business_id = 'your-business-id' AND template_key = 'new_lead_alert';
```

### Email Processing

Emails are processed automatically:
1. When a lead is submitted, emails are queued in the `email_queue` table
2. The system automatically triggers email processing
3. Failed emails are retried with exponential backoff (1min, 5min, 30min)
4. All email activity is logged in the `email_log` table

### Monitoring and Analytics

Track email performance through the database tables:

```sql
-- Check email queue status
SELECT status, COUNT(*) FROM email_queue GROUP BY status;

-- View recent email activity
SELECT * FROM email_log ORDER BY created_at DESC LIMIT 10;

-- Business email statistics
SELECT 
  b.name as business_name,
  COUNT(el.*) as emails_sent,
  COUNT(CASE WHEN el.status = 'sent' THEN 1 END) as successful_sends
FROM businesses b
LEFT JOIN email_log el ON b.id = el.business_id
WHERE el.created_at > NOW() - INTERVAL '30 days'
GROUP BY b.id, b.name;
```

### Example Configuration

Here's a complete widget configuration with email notifications:

```json
{
  "steps": [
    {
      "id": "service-selection",
      "title": "Select Your Service",
      "components": [
        {
          "type": "service_selection",
          "props": {
            "name": "service",
            "label": "What service do you need?",
            "options": ["fencing", "concrete", "landscaping"],
            "required": true
          }
        }
      ]
    }
  ],
  "showInstantQuote": true,
  "pricingCalculator": {
    "basePricing": {
      "service_field": "service",
      "pricing_type": "per_unit",
      "unit_field": "linearFeet",
      "unit_label": "linear foot",
      "base_prices": [
        {"service": "fencing", "price": 25.00}
      ]
    },
    "display": {
      "format": "fixed",
      "showCalculation": true
    }
  },
  "notifications": {
    "email": {
      "enabled": true,
      "business_emails": ["owner@example.com", "sales@example.com"],
      "send_customer_confirmation": true,
      "send_business_alert": true
    }
  }
}
```

### Best Practices

1. **Professional Email Addresses**: Use branded email addresses (not Gmail/Yahoo)
2. **Multiple Recipients**: Include key team members in business_emails array
3. **Timely Follow-up**: Monitor the email_queue table for any processing issues
4. **Custom Templates**: Personalize email templates to match your brand voice
5. **Testing**: Test with real email addresses before going live
6. **Monitoring**: Regularly check email logs for delivery issues