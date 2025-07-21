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
      "title": "Step Title",
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
  "showInstantQuote": true
}
```

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