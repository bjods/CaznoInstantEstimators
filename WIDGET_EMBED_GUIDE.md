# Cazno Widget Embed Guide

This guide explains how to embed Cazno widgets on your website with auto-resizing functionality and analytics integration.

## Quick Start

The easiest way to embed a Cazno widget is with our JavaScript library that provides automatic height adjustment and form submission tracking.

### Method 1: Simple Embed (Recommended)

```html
<!-- Include Cazno Widget Script -->
<script src="https://cazno.app/widget-embed.js"></script>

<!-- Widget Container -->
<div id="cazno-widget"></div>

<!-- Initialize Widget -->
<script>
CaznoWidget.embed('YOUR_EMBED_KEY', 'cazno-widget');
</script>
```

### Method 2: Advanced Embed with Options

```html
<!-- Include Cazno Widget Script -->
<script src="https://cazno.app/widget-embed.js"></script>

<!-- Widget Container -->
<div id="my-estimator"></div>

<!-- Initialize Widget with Custom Options -->
<script>
const widget = CaznoWidget.init('YOUR_EMBED_KEY', {
  target: '#my-estimator',
  theme: {
    cardBackground: '#ffffff' // Optional: customize background
  }
});
</script>
```

## Features

### ✅ Auto-Resizing
- **No scroll bars**: Widget automatically adjusts height based on content
- **Responsive**: Works on all screen sizes
- **Smooth transitions**: Height changes are animated

### ✅ Analytics Integration
- **Google Analytics**: Automatic event tracking for form submissions
- **Facebook Pixel**: Lead tracking integration
- **Custom Events**: Listen for `caznoFormSubmitted` events

### ✅ Security
- **Origin validation**: Only accepts messages from trusted Cazno domains
- **Rate limiting**: Prevents message spam
- **Iframe isolation**: Complete CSS/JS separation from your site

## Analytics Integration

### Google Analytics 4

The widget automatically sends events to Google Analytics if `gtag` is available:

```javascript
// Automatically tracked events:
gtag('event', 'cazno_form_submission', {
  widget_id: 'your-embed-key',
  submission_id: 'unique-submission-id',
  has_quote: true/false
});
```

### Facebook Pixel

The widget automatically sends lead events to Facebook Pixel if `fbq` is available:

```javascript
// Automatically tracked events:
fbq('track', 'Lead', {
  content_name: 'Cazno Widget Form',
  widget_id: 'your-embed-key'
});
```

### Custom Event Handling

Listen for form submissions in your own code:

```javascript
window.addEventListener('caznoFormSubmitted', function(event) {
  const { widgetId, submissionId, hasQuote, success } = event.detail;
  
  // Your custom tracking code here
  console.log('Form submitted!', event.detail);
  
  // Example: Send to your analytics
  analytics.track('Lead Generated', {
    source: 'Cazno Widget',
    widget_id: widgetId,
    has_quote: hasQuote
  });
});
```

## Styling Options

### Container Styling

Style the container div to match your site:

```css
#cazno-widget {
  max-width: 800px;
  margin: 0 auto;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}
```

### Theme Options

Pass theme options when initializing:

```javascript
CaznoWidget.init('YOUR_EMBED_KEY', {
  target: '#my-widget',
  theme: {
    cardBackground: '#ffffff',  // Widget background color
    borderRadius: '8px'         // Widget border radius
  }
});
```

## Advanced Configuration

### Multiple Widgets

You can embed multiple widgets on the same page:

```html
<div id="widget-1"></div>
<div id="widget-2"></div>

<script>
CaznoWidget.embed('EMBED_KEY_1', 'widget-1');
CaznoWidget.embed('EMBED_KEY_2', 'widget-2');
</script>
```

### Dynamic Loading

Load widgets dynamically with JavaScript:

```javascript
function loadWidget(embedKey, containerId) {
  return CaznoWidget.embed(embedKey, containerId);
}

// Load widget when needed
document.getElementById('load-widget-btn').addEventListener('click', function() {
  loadWidget('YOUR_EMBED_KEY', 'widget-container');
});
```

### Widget Removal

Remove widgets programmatically:

```javascript
const widget = CaznoWidget.embed('YOUR_EMBED_KEY', 'widget-container');

// Later, remove the widget
widget.destroy();
```

## Troubleshooting

### Widget Not Loading
- Check that your embed key is correct
- Ensure the widget-embed.js script loads before initialization
- Check browser console for errors

### Not Auto-Resizing
- Make sure you're using the JavaScript embed method (not plain iframe)
- Check that PostMessage is working in browser console
- Verify the widget-embed.js script is the latest version

### Analytics Not Working
- Ensure Google Analytics or Facebook Pixel is loaded before the widget
- Check that the tracking scripts are initialized properly
- Verify events in your analytics dashboard

## Migration from Basic Iframe

If you're currently using a basic iframe embed:

### Old Method (Basic Iframe)
```html
<iframe src="https://cazno.app/iframe/YOUR_EMBED_KEY" 
        width="100%" 
        height="600" 
        frameborder="0">
</iframe>
```

### New Method (Auto-Resizing)
```html
<script src="https://cazno.app/widget-embed.js"></script>
<div id="cazno-widget"></div>
<script>
CaznoWidget.embed('YOUR_EMBED_KEY', 'cazno-widget');
</script>
```

**Benefits of upgrading:**
- ✅ No scroll bars - perfect height every time
- ✅ Better mobile experience  
- ✅ Automatic analytics tracking
- ✅ Form submission notifications
- ✅ Better user experience

## Support

If you need help with widget embedding:
- Check the browser console for error messages
- Verify your embed key is active
- Contact support with your embed key and website URL

---

**Need your embed key?** Find it in your [Cazno Dashboard](https://cazno.app/dashboard/widgets) → Settings → Embed Code.