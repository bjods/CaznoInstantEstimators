# 🚀 Vercel Test Widgets - Ready for Live Testing

**Vercel URL**: https://cazno-instant-estimators.vercel.app/

## ✅ **Test Widgets Configured for Vercel**

All test widgets now include `cazno-instant-estimators.vercel.app` in their allowed domains and are ready for live testing on your Vercel deployment.

### **1. Premium Fence Estimator** (High Security)
- **URL**: https://cazno-instant-estimators.vercel.app/widget/fence-premium-v2
- **Embed Key**: `fence-premium-v2`
- **Security**: High security with HTTPS required
- **Domains**: `testfence.com`, `www.testfence.com`, `*.staging.testfence.com`, `cazno-instant-estimators.vercel.app`
- **Rate Limit**: 500 requests/hour, 5 embeds max per domain

### **2. Multi-Service Estimator** (Development Friendly)
- **URL**: https://cazno-instant-estimators.vercel.app/widget/multi-service-dev
- **Embed Key**: `multi-service-dev`
- **Security**: Development-friendly with HTTP allowed
- **Domains**: `localhost`, `*.vercel.app`, `*.netlify.app`, `dev.testbusiness.com`, `cazno-instant-estimators.vercel.app`
- **Rate Limit**: 10,000 requests/hour, 100 embeds max per domain

### **3. Hardscaping Quote Tool** (Multi-Client)
- **URL**: https://cazno-instant-estimators.vercel.app/widget/hardscape-quotes
- **Embed Key**: `hardscape-quotes`
- **Security**: Production security for agencies
- **Domains**: `client1.com`, `*.client1.com`, `client2.org`, `www.client2.org`, `agency-demos.com`, `*.agency-demos.com`, `cazno-instant-estimators.vercel.app`
- **Rate Limit**: 2,000 requests/hour, 20 embeds max per domain

### **4. Vercel Demo Widget** (New - Specifically for Vercel)
- **URL**: https://cazno-instant-estimators.vercel.app/widget/vercel-demo-widget
- **Embed Key**: `vercel-demo-widget`
- **Security**: Vercel-optimized configuration
- **Domains**: `cazno-instant-estimators.vercel.app`, `*.vercel.app`
- **Rate Limit**: 1,000 requests/hour, 10 embeds max per domain
- **Features**: 2-step form (Service Selection → Contact Info)

### **5. Basic Contact Form** (Unsecured - For Comparison)
- **URL**: https://cazno-instant-estimators.vercel.app/widget/basic-contact-unsecured
- **Embed Key**: `basic-contact-unsecured`
- **Security**: Disabled (allows any domain)
- **Domains**: None (NULL - accepts all domains)
- **Rate Limit**: 1,000 requests/hour, 100 embeds max per domain

## 🎛️ **Dashboard Testing**

**Settings URL**: https://cazno-instant-estimators.vercel.app/dashboard/settings

### **What You Can Test:**
1. **Security Status Indicators**: See green "Secured" vs yellow "Unsecured" badges
2. **Domain Management**: Add/remove allowed domains with real-time validation
3. **Security Toggles**: Enable/disable domain validation
4. **Advanced Controls**: Configure HTTPS requirements, rate limits, embed limits
5. **Form Validation**: Test invalid domain formats (should show errors)
6. **Live Updates**: Changes save immediately and update the UI

### **Test Scenarios:**
1. **Add New Domain**: Try adding `example.com` to any widget
2. **Remove Domain**: Remove a domain and see it disappear from the list
3. **Toggle Security**: Disable security and see status change to "Unsecured"
4. **Invalid Domains**: Try adding invalid formats like `not-a-domain` (should show error)
5. **Wildcard Domains**: Add `*.example.com` to test wildcard support

## 🔒 **Security Features Active**

### **Domain Validation** ✅
- Only allowed domains can embed widgets
- Wildcard domain support (*.example.com)
- Real-time domain usage tracking

### **Rate Limiting** ✅
- IP-based: 100 requests/minute (generous for normal users)
- Domain-based: Per-widget configurable limits
- Automatic blocking of excessive requests

### **Input Validation** ✅
- Zod schema validation on all API endpoints
- Protection against malicious input
- Detailed error logging

### **Security Headers** ✅
- Content Security Policy (CSP) active
- XSS protection headers
- Frame protection (dashboard vs widgets)

### **Security Monitoring** ✅
- All configuration changes logged
- Domain usage tracking
- Security event monitoring

## 🧪 **How to Test**

### **1. Test Widget Loading**
```bash
# These should all work on Vercel:
curl https://cazno-instant-estimators.vercel.app/widget/vercel-demo-widget
curl https://cazno-instant-estimators.vercel.app/widget/fence-premium-v2
curl https://cazno-instant-estimators.vercel.app/widget/multi-service-dev
```

### **2. Test Dashboard Interface**
1. Go to: https://cazno-instant-estimators.vercel.app/dashboard/settings
2. Click "Edit Security" on any widget
3. Add/remove domains and save changes
4. Verify changes persist after page refresh

### **3. Test Security API**
```bash
# Test security API endpoint
curl -X PUT https://cazno-instant-estimators.vercel.app/api/widgets/abcd1234-5678-9012-3456-789012345678/security \
  -H "Content-Type: application/json" \
  -d '{
    "allowed_domains": ["newdomain.com", "*.newdomain.com"],
    "security_enabled": true,
    "embed_restrictions": {
      "require_https": true,
      "max_embeds_per_domain": 15,
      "rate_limit_per_hour": 1500
    }
  }'
```

## 📊 **Expected Results**

- **Widgets load successfully** on cazno-instant-estimators.vercel.app
- **Dashboard shows all 5 test widgets** with correct security status
- **Domain management works** (add/remove domains)
- **Security toggles function** correctly
- **API endpoints respond** with proper validation
- **Security events are logged** in the database

## 🎉 **Ready for Production Testing**

The complete widget security system is now deployed to Vercel and ready for live testing. You can:

1. **Test widget functionality** on your live Vercel deployment
2. **Configure security settings** through the dashboard
3. **Monitor security events** through the database
4. **Verify rate limiting** and domain validation work correctly
5. **Test different security configurations** with the example widgets

All code changes have been pushed to GitHub and should automatically deploy to Vercel!