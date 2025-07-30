# PostMessage Implementation Plan (Phase 2)

**Status**: 📋 **PLANNED - After Core Security Complete**  
**Scope**: Basic height updates + form submission events only  
**Timeline**: After Rate Limiting, CSP, and CSRF are implemented

## 🎯 **Implementation Goals**

### **Focused Scope - Keep It Simple**
1. **Iframe Auto-Resizing** - Widget tells parent its height
2. **Form Submission Events** - Notify parent of completions
3. **Security First** - Origin validation on all messages

### **NOT in Scope (Keep for Later)**
- Complex bi-directional communication
- Custom message types
- Message authentication/signing
- Advanced analytics events

## 📐 **Planned Message Types**

### **1. Widget Ready**
```javascript
// Sent when widget loads
{
  type: 'cazno:widget:ready',
  payload: {
    widgetId: 'uuid',
    initialHeight: 600
  }
}
```

### **2. Height Update**
```javascript
// Sent when widget height changes
{
  type: 'cazno:widget:resize',
  payload: {
    height: 750,
    widgetId: 'uuid'
  }
}
```

### **3. Form Submission**
```javascript
// Sent when form is submitted
{
  type: 'cazno:form:submitted',
  payload: {
    widgetId: 'uuid',
    success: true,
    submissionId: 'uuid',
    hasQuote: true
  }
}
```

## 🔒 **Security Implementation**

### **Origin Validation**
```typescript
// Only accept messages from widget's allowed domains
const isAllowedOrigin = (origin: string, widgetId: string) => {
  const widget = await getWidget(widgetId)
  return widget.allowed_domains.includes(origin)
}
```

### **Rate Limiting**
- Max 10 height updates per minute
- Max 5 submission events per minute
- Block origins exceeding limits

## 💻 **Client Integration Code**

### **Simple Embed Code for Clients**
```html
<!-- Cazno Widget Embed -->
<iframe 
  id="cazno-widget-[WIDGET_ID]"
  src="https://cazno.app/widget/[EMBED_KEY]"
  style="width: 100%; border: none; min-height: 400px;"
></iframe>

<script>
// Auto-resize widget iframe
window.addEventListener('message', function(event) {
  // Security: Only accept from Cazno
  if (event.origin !== 'https://cazno.app') return;
  
  const { type, payload } = event.data;
  const iframe = document.getElementById('cazno-widget-' + payload.widgetId);
  
  switch(type) {
    case 'cazno:widget:resize':
      // Auto-resize iframe to fit content
      iframe.style.height = payload.height + 'px';
      break;
      
    case 'cazno:form:submitted':
      // Track successful submission
      console.log('Form submitted!', payload);
      // Add your analytics/tracking here
      if (window.gtag) {
        gtag('event', 'cazno_form_submission', {
          widget_id: payload.widgetId,
          has_quote: payload.hasQuote
        });
      }
      break;
  }
});
</script>
```

## 📊 **Implementation Tasks**

### **Widget Side (cazno.app)**
1. **Add height observer to widget**
   ```typescript
   // Monitor widget height changes
   const resizeObserver = new ResizeObserver(() => {
     sendHeightUpdate()
   })
   resizeObserver.observe(document.body)
   ```

2. **Send submission events**
   ```typescript
   // On successful form submission
   sendToParent('cazno:form:submitted', {
     widgetId,
     success: true,
     submissionId,
     hasQuote: !!pricing
   })
   ```

3. **Use existing postMessage security module**
   - Origin validation against allowed_domains
   - Rate limiting
   - Security event logging

### **Documentation Updates**
1. **Widget Embed Guide**
   - How to add the JavaScript listener
   - Supported message types
   - Security considerations

2. **Analytics Integration**
   - Google Analytics example
   - Facebook Pixel example
   - Custom tracking examples

3. **Troubleshooting Guide**
   - Console debugging tips
   - Common iframe issues
   - Height calculation problems

## 🧪 **Testing Plan**

### **Security Testing**
- [ ] Test messages from unauthorized origins are blocked
- [ ] Test rate limiting works correctly
- [ ] Verify security events are logged

### **Functionality Testing**
- [ ] Test height updates on various screen sizes
- [ ] Test with different form configurations
- [ ] Test submission events fire correctly

### **Cross-Browser Testing**
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers

## 📈 **Success Metrics**

1. **Reduced Support Tickets** - About iframe sizing issues
2. **Better Analytics** - Clients can track conversions properly
3. **Improved UX** - No more scrollbars in iframes
4. **Security Maintained** - No unauthorized message processing

## 🚀 **Future Enhancements (Phase 3)**

Once basic implementation is successful, consider:
- Form progress events (step completion)
- Error event notifications
- Custom analytics events
- Bi-directional communication
- Parent-to-widget commands

## 📝 **Decision Log**

**Why Basic Implementation First?**
1. Solves 80% of integration issues (iframe height)
2. Provides immediate value (submission tracking)
3. Minimal complexity for clients
4. Easy to test and debug
5. Foundation for future features

**Why After Core Security?**
1. Domain validation must be rock-solid first
2. Rate limiting infrastructure needed
3. Security logging must be operational
4. Reduces initial launch complexity

---

**This plan provides a clear path for PostMessage implementation when the time is right!**