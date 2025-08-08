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
    document.getElementById('cazno-widget').height = e.data.height + 'px';
  }
  if (e.data.type === 'cazno-scroll-top') {
    document.getElementById('cazno-widget').scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  }
});
</script>
```

Replace `YOUR_EMBED_KEY` with your actual embed key from the dashboard.

The widget will automatically resize to fit its content - no scroll bars.

---

**Get your embed key:** [Dashboard](https://cazno.app/dashboard/widgets) → Widgets → Embed Code