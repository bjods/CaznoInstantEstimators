(function() {
  window.CaznoWidget = {
    init: function(embedKey, options) {
      const container = document.querySelector(options.target);
      if (!container) {
        console.error('Cazno Widget: Target container not found');
        return;
      }

      // Create iframe for the widget
      const iframe = document.createElement('iframe');
      iframe.src = `${window.location.origin}/widget/${embedKey}`;
      iframe.style.width = '100%';
      iframe.style.height = '500px';
      iframe.style.border = 'none';
      iframe.style.borderRadius = '8px';
      iframe.style.background = options.theme.cardBackground || '#1a2332';
      
      // Clear container and add iframe
      container.innerHTML = '';
      container.appendChild(iframe);

      // Handle iframe messages for dynamic resizing
      window.addEventListener('message', function(event) {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === 'widget-resize' && event.data.embedKey === embedKey) {
          iframe.style.height = event.data.height + 'px';
        }
      });
    }
  };
})();