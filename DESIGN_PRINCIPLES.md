# Design Principles

## Core Philosophy: Minimal & Functional

### 1. Less is More
- Only show what's absolutely necessary
- Remove redundant instructions and labels
- If users can figure it out, don't explain it

### 2. Clean Visual Hierarchy
- Use subtle styling over heavy borders
- Prefer light text colors for secondary information
- Keep action buttons understated until hovered

### 3. Smart Defaults
- Components should work without configuration
- Help text is optional, not required
- Error states only when truly needed

### 4. Examples

❌ **Too Much**
```jsx
<div>
  <label>Project Location *</label>
  <p>Enter your full property address</p>
  <input placeholder="123 Main St, City, State, ZIP" />
  <p>We need your address to provide accurate measurements</p>
</div>
```

✅ **Just Right**
```jsx
<div>
  <label>Property Address *</label>
  <input placeholder="Enter address..." />
</div>
```

❌ **Too Much**
```jsx
<div>
  <h4>Mode: Area Drawing</h4>
  <p>Instructions: Click points to create a polygon</p>
  <button>Clear Drawing</button>
  <div>Map here</div>
  <p>Help: Click at least 3 points to calculate area</p>
</div>
```

✅ **Just Right**
```jsx
<div>
  <button>Clear</button>
  <div>Map here</div>
  <span>Area: 1,250 sq ft</span>
</div>
```

### 5. Component Guidelines

- **Labels**: Short and clear (e.g., "Address" not "Property Address")
- **Placeholders**: Minimal hints (e.g., "Enter address..." not "123 Main St, City, State ZIP")
- **Help Text**: Only when behavior isn't obvious
- **Buttons**: Small and subtle until interaction
- **Feedback**: Show results, not process (show "1,250 sq ft" not "Area calculated: 1,250.00 square feet")