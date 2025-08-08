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
      iframe.id = 'cazno-widget-' + embedKey;
      iframe.src = `${window.location.origin}/widget/${embedKey}`;
      iframe.style.width = '100%';
      iframe.style.minHeight = '400px';
      iframe.style.height = '600px'; // Initial height
      iframe.style.border = 'none';
      iframe.style.borderRadius = '8px';
      iframe.style.background = (options && options.theme && options.theme.cardBackground) || '#ffffff';
      iframe.style.overflow = 'hidden';
      
      // Clear container and add iframe
      container.innerHTML = '';
      container.appendChild(iframe);

      // Handle iframe messages for dynamic resizing and events
      window.addEventListener('message', function(event) {
        // Security: Only accept messages from Cazno domain
        if (event.origin !== window.location.origin && 
            event.origin !== 'https://cazno.app' && 
            event.origin !== 'https://www.cazno.app') {
          return;
        }

        const { type, payload } = event.data;
        if (!type || !payload || payload.widgetId !== embedKey) return;

        switch(type) {
          case 'cazno:widget:ready':
            console.log('Cazno widget ready', payload);
            if (payload.initialHeight) {
              iframe.style.height = payload.initialHeight + 'px';
            }
            break;

          case 'cazno:widget:resize':
            // Auto-resize iframe to fit content
            if (payload.height && payload.height > 0) {
              iframe.style.height = Math.max(payload.height, 300) + 'px';
            }
            break;

          case 'cazno:form:submitted':
            // Track successful submission
            console.log('Form submitted!', payload);
            
            // Trigger custom event for parent page to listen to
            const submitEvent = new CustomEvent('caznoFormSubmitted', {
              detail: {
                widgetId: payload.widgetId,
                submissionId: payload.submissionId,
                hasQuote: payload.hasQuote,
                success: payload.success
              }
            });
            window.dispatchEvent(submitEvent);

            // Google Analytics integration
            if (window.gtag) {
              gtag('event', 'cazno_form_submission', {
                widget_id: payload.widgetId,
                submission_id: payload.submissionId,
                has_quote: payload.hasQuote
              });
            }

            // Facebook Pixel integration
            if (window.fbq) {
              fbq('track', 'Lead', {
                content_name: 'Cazno Widget Form',
                widget_id: payload.widgetId
              });
            }
            break;

          default:
            console.log('Unknown Cazno message type:', type);
        }
      });

      return {
        iframe: iframe,
        embedKey: embedKey,
        destroy: function() {
          if (iframe && iframe.parentNode) {
            iframe.parentNode.removeChild(iframe);
          }
        }
      };
    }
  };

  // Simple initialization for basic HTML embeds
  window.CaznoWidget.embed = function(embedKey, containerId, options) {
    return window.CaznoWidget.init(embedKey, {
      target: containerId ? '#' + containerId : '.cazno-widget',
      theme: options || {}
    });
  };
})();