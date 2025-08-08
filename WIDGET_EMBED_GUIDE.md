# Widget Embed Code

Copy and paste this code into your website where you want the estimator to appear:

```html
<iframe 
  id="cazno-widget"
  src="https://cazno.app/embed/YOUR_EMBED_KEY"
  width="100%"
  height="800"
  style="border: none;">
</iframe>

<script>
window.addEventListener('message', function(e) {
  if (e.data.type === 'cazno-resize') {
    const iframe = document.getElementById('cazno-widget');
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      // On mobile: fixed viewport height with internal scrolling
      iframe.height = window.innerHeight + 'px';
    } else {
      // On desktop: auto-resize to content
      iframe.height = e.data.height + 'px';
    }
  }
  if (e.data.type === 'cazno-scroll-top') {
    document.getElementById('cazno-widget').scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  }
});

// Set initial height based on device
window.addEventListener('load', function() {
  const iframe = document.getElementById('cazno-widget');
  const isMobile = window.innerWidth <= 768;
  
  if (isMobile) {
    iframe.height = window.innerHeight + 'px';
  }
});
</script>
```

Replace `YOUR_EMBED_KEY` with your actual embed key from the dashboard.

**Desktop**: Widget automatically resizes to fit content - no scroll bars.
**Mobile**: Widget takes full viewport height with smooth internal scrolling.

---

**Get your embed key:** [Dashboard](https://cazno.app/dashboard/widgets) → Widgets → Embed Code