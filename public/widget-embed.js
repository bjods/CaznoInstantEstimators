(function() {
  'use strict';

  // Prevent double loading
  if (window.CaznoWidget) {
    return;
  }

  let messageListener = null;
  const activeWidgets = new Map();

  window.CaznoWidget = {
    initInlineWidget: function(config) {
      const { url, parentElement, resize = true, theme = {} } = config;
      
      if (!parentElement) {
        console.error('Cazno Widget: parentElement is required');
        return null;
      }

      // Extract embed key from URL
      const embedKey = url.split('/').pop();
      
      // Create iframe
      const iframe = document.createElement('iframe');
      iframe.id = 'cazno-widget-' + embedKey;
      iframe.src = `/iframe/${embedKey}`;
      iframe.style.cssText = `
        width: 100%;
        min-height: 400px;
        height: 600px;
        border: none;
        border-radius: 8px;
        background: ${theme.cardBackground || '#ffffff'};
        transition: height 0.3s ease;
      `;
      
      // Clear container and add iframe
      parentElement.innerHTML = '';
      parentElement.appendChild(iframe);

      // Setup message listener only once
      if (!messageListener && resize) {
        messageListener = function(event) {
          // Security: Only accept from same origin or Cazno domains
          if (event.origin !== window.location.origin && 
              event.origin !== 'https://cazno.app' && 
              event.origin !== 'https://www.cazno.app') {
            return;
          }

          const { type, payload } = event.data;
          if (!type || !payload) return;

          const widget = activeWidgets.get(payload.widgetId);
          if (!widget) return;

          switch(type) {
            case 'cazno:widget:ready':
              if (payload.initialHeight) {
                widget.iframe.style.height = Math.max(payload.initialHeight, 300) + 'px';
              }
              break;

            case 'cazno:widget:resize':
              if (payload.height && payload.height > 0) {
                widget.iframe.style.height = Math.max(payload.height, 300) + 'px';
              }
              break;

            case 'cazno:form:submitted':
              // Trigger custom event
              const submitEvent = new CustomEvent('cazno_form_submitted', {
                detail: payload
              });
              window.dispatchEvent(submitEvent);

              // Analytics integrations
              if (window.gtag) {
                gtag('event', 'cazno_form_submission', {
                  widget_id: payload.widgetId,
                  submission_id: payload.submissionId,
                  has_quote: payload.hasQuote
                });
              }

              if (window.fbq) {
                fbq('track', 'Lead', {
                  content_name: 'Cazno Widget Form',
                  widget_id: payload.widgetId
                });
              }
              break;
          }
        };
        
        window.addEventListener('message', messageListener);
      }

      // Track active widget
      const widgetInstance = {
        iframe: iframe,
        embedKey: embedKey,
        destroy: function() {
          activeWidgets.delete(embedKey);
          if (iframe && iframe.parentNode) {
            iframe.parentNode.removeChild(iframe);
          }
          
          // Remove listener if no active widgets
          if (activeWidgets.size === 0 && messageListener) {
            window.removeEventListener('message', messageListener);
            messageListener = null;
          }
        }
      };

      activeWidgets.set(embedKey, widgetInstance);
      return widgetInstance;
    },

    // Simple embed method (Calendly-style)
    embed: function(embedKey, containerSelector, options = {}) {
      const container = typeof containerSelector === 'string' 
        ? document.querySelector(containerSelector)
        : containerSelector;

      if (!container) {
        console.error('Cazno Widget: Container not found');
        return null;
      }

      return this.initInlineWidget({
        url: `/iframe/${embedKey}`,
        parentElement: container,
        resize: true,
        theme: options.theme || {}
      });
    }
  };

  // Auto-initialize widgets with data attributes (Typeform-style)
  function initDataWidgets() {
    const widgets = document.querySelectorAll('[data-cazno-widget]');
    widgets.forEach(function(element) {
      const embedKey = element.getAttribute('data-cazno-widget');
      const resize = element.getAttribute('data-cazno-resize') !== 'false';
      
      if (embedKey && !element.querySelector('iframe')) {
        window.CaznoWidget.initInlineWidget({
          url: `/iframe/${embedKey}`,
          parentElement: element,
          resize: resize
        });
      }
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDataWidgets);
  } else {
    initDataWidgets();
  }

})();