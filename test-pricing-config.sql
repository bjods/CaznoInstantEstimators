-- Test Pricing Calculator Configuration
-- Update the existing test widget with pricing calculator

UPDATE widgets 
SET config = '{
  "steps": [
    {
      "id": "service",
      "title": "What type of fence do you need?",
      "components": [
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
              },
              {
                "value": "vinyl",
                "label": "Vinyl Fence",
                "description": "Low maintenance, 25 year warranty"
              }
            ],
            "required": true
          }
        }
      ]
    },
    {
      "id": "measurement",
      "title": "How much fencing do you need?",
      "components": [
        {
          "type": "linear_feet_input",
          "props": {
            "name": "linearFeet",
            "label": "Total Linear Feet",
            "placeholder": "Enter the total feet",
            "helpText": "Measure around the perimeter where the fence will be installed",
            "min": 10,
            "max": 5000,
            "required": true
          }
        },
        {
          "type": "number_input",
          "props": {
            "name": "gateCount",
            "label": "Number of Gates",
            "placeholder": "0",
            "helpText": "Standard 4ft walk gates",
            "min": 0,
            "max": 10,
            "step": 1
          }
        },
        {
          "type": "toggle_switch",
          "props": {
            "name": "hasdifficultAccess",
            "label": "Difficult Access",
            "helpText": "Check if access to your property is limited (narrow gates, stairs, etc.)"
          }
        }
      ]
    },
    {
      "id": "contact",
      "title": "Get Your Instant Quote",
      "components": [
        {
          "type": "text_input",
          "props": {
            "name": "name",
            "label": "Your Name",
            "placeholder": "John Smith",
            "required": true
          }
        },
        {
          "type": "text_input",
          "props": {
            "name": "email",
            "label": "Email Address",
            "placeholder": "john@example.com",
            "type": "email",
            "required": true
          }
        },
        {
          "type": "text_input",
          "props": {
            "name": "phone",
            "label": "Phone Number",
            "placeholder": "(555) 123-4567",
            "type": "tel",
            "required": false
          }
        }
      ]
    }
  ],
  "showInstantQuote": true,
  "priceDisplay": "range",
  "thankYouMessage": "Thank you! We will contact you within 24 hours to schedule a free consultation.",
  
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
        },
        "vinyl": {
          "amount": 55,
          "unit": "linear_foot",
          "minCharge": 600
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
        "id": "difficult_access",
        "type": "conditional",
        "field": "hasdifficultAccess",
        "condition": "equals",
        "value": true,
        "calculation": {
          "operation": "multiply",
          "amount": 1.25
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
}'::jsonb
WHERE embed_key = 'test-widget-key';

-- Create a bin rental test widget
INSERT INTO widgets (business_id, name, embed_key, config)
VALUES (
  (SELECT id FROM businesses WHERE slug = 'test-fence-co'),
  'Bin Rental Widget',
  'test-bin-rental-key',
  '{
    "steps": [
      {
        "id": "bin-selection",
        "title": "Select Your Bin Size",
        "components": [
          {
            "type": "radio_group",
            "props": {
              "name": "binSize",
              "label": "What size dumpster do you need?",
              "options": [
                {
                  "value": "10_yard",
                  "label": "10 Yard Bin",
                  "description": "Good for small cleanouts, 12x8x3.5 feet"
                },
                {
                  "value": "20_yard",
                  "label": "20 Yard Bin", 
                  "description": "Most popular size, 22x8x4.5 feet"
                },
                {
                  "value": "30_yard",
                  "label": "30 Yard Bin",
                  "description": "Large projects, 22x8x6 feet"
                }
              ],
              "required": true
            }
          }
        ]
      },
      {
        "id": "rental-details",
        "title": "Rental Details",
        "components": [
          {
            "type": "number_input",
            "props": {
              "name": "rentalDays",
              "label": "Rental Duration (Days)",
              "min": 1,
              "max": 30,
              "step": 1,
              "placeholder": "7",
              "helpText": "Standard rental is 7 days",
              "required": true
            }
          },
          {
            "type": "radio_group",
            "props": {
              "name": "wasteType",
              "label": "What type of waste?",
              "options": [
                {
                  "value": "general",
                  "label": "General Debris",
                  "description": "Household items, furniture, etc."
                },
                {
                  "value": "construction",
                  "label": "Construction Debris",
                  "description": "Wood, drywall, roofing materials"
                },
                {
                  "value": "concrete",
                  "label": "Concrete/Heavy Materials",
                  "description": "Concrete, brick, stone (surcharge applies)"
                }
              ],
              "required": true
            }
          }
        ]
      }
    ],
    "showInstantQuote": true,
    "priceDisplay": "fixed",
    "thankYouMessage": "Thank you! Your bin will be delivered within 24 hours.",
    
    "pricingCalculator": {
      "basePricing": {
        "service_field": "binSize",
        "prices": {
          "10_yard": { "amount": 45, "unit": "days", "minCharge": 300 },
          "20_yard": { "amount": 55, "unit": "days", "minCharge": 400 },
          "30_yard": { "amount": 65, "unit": "days", "minCharge": 500 }
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
  }'::jsonb
);

-- Create a landscaping widget with area-based pricing
INSERT INTO widgets (business_id, name, embed_key, config)
VALUES (
  (SELECT id FROM businesses WHERE slug = 'test-fence-co'),
  'Landscaping Services Widget',
  'test-landscaping-key',
  '{
    "steps": [
      {
        "id": "service-selection",
        "title": "Select Your Services",
        "components": [
          {
            "type": "service_selection",
            "props": {
              "name": "selectedServices",
              "label": "What services do you need?",
              "multiple": true,
              "required": true,
              "options": [
                {
                  "value": "lawn_install",
                  "title": "New Lawn Installation",
                  "description": "Complete lawn installation with sod or seed"
                },
                {
                  "value": "landscaping",
                  "title": "Landscaping Design",
                  "description": "Garden beds, plants, and design services"
                },
                {
                  "value": "mulch_delivery",
                  "title": "Mulch Delivery",
                  "description": "Premium bark mulch delivered and spread"
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
                "lawn_install": {
                  "display_name": "Lawn Area",
                  "icon": "🌱",
                  "requires_measurement": true,
                  "unit": "sqft",
                  "measurement_methods": [
                    {
                      "type": "manual_sqft",
                      "label": "Enter Square Feet"
                    }
                  ]
                },
                "landscaping": {
                  "display_name": "Garden Area", 
                  "icon": "🌺",
                  "requires_measurement": true,
                  "unit": "sqft",
                  "measurement_methods": [
                    {
                      "type": "manual_sqft",
                      "label": "Enter Square Feet"
                    }
                  ]
                },
                "mulch_delivery": {
                  "display_name": "Mulch Area",
                  "icon": "🪵",
                  "requires_measurement": true,
                  "unit": "cubic_yard",
                  "measurement_methods": [
                    {
                      "type": "manual_sqft",
                      "label": "Enter Square Feet (we will convert to cubic yards)"
                    }
                  ]
                }
              }
            }
          }
        ]
      },
      {
        "id": "details",
        "title": "Additional Details",
        "components": [  
          {
            "type": "toggle_switch",
            "props": {
              "name": "needsPrepWork",
              "label": "Site Preparation Required",
              "helpText": "Check if the area needs clearing, grading, or other prep work"
            }
          }
        ]
      }
    ],
    "showInstantQuote": true,
    "priceDisplay": "minimum",
    "thankYouMessage": "Thank you! We will contact you to schedule a site visit.",
    
    "pricingCalculator": {
      "basePricing": {
        "service_field": "selectedServices",
        "prices": {
          "lawn_install": { "amount": 2.50, "unit": "sqft" },
          "landscaping": { "amount": 5.00, "unit": "sqft" },
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
  }'::jsonb
);

-- Verify the configurations were inserted
SELECT 
  name,
  embed_key,
  config->'pricingCalculator'->'basePricing'->'service_field' as service_field,
  config->'pricingCalculator'->'display'->'format' as display_format
FROM widgets 
WHERE embed_key IN ('test-widget-key', 'test-bin-rental-key', 'test-landscaping-key');