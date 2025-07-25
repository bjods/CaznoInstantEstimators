# 🔐 Cazno Test Credentials - Complete Setup

## 🚀 **Ready-to-Test Account**

**Email:** test@cazno.com  
**Password:** TestPassword123!

## 📊 **What's Included in Your Test Account**

### **✅ Business Profile**
- **Company:** Test Home Services Co.
- **Industry:** HVAC Services
- **Status:** Professional Plan (Active)
- **Phone:** +1-555-123-4567

### **✅ Live Widget**
- **Name:** HVAC Quote Calculator
- **Type:** Multi-step instant quote form
- **Embed Key:** `hvac-quote-calc-demo`
- **Status:** Active with 247 views and 18 submissions
- **Features:**
  - Service type selection (Repair/Installation/Maintenance)
  - Property size and type inputs
  - Instant price calculations
  - Lead capture with contact forms

### **✅ Sample Lead Data**
Your dashboard will show **5 realistic test leads**:

1. **John Smith** - Complete installation quote ($8,750)
2. **Sarah Johnson** - Complete repair quote ($275) 
3. **Mike Davis** - In-progress maintenance quote
4. **Lisa Martinez** - Complete installation quote ($11,200)
5. **Robert Wilson** - Started but abandoned

### **✅ Dashboard Features to Test**

#### **Main Dashboard:**
- **Live KPI Cards:** Widgets (1), Leads (5), Conversion Rate (60%), Revenue ($20,225)
- **Recent Activity:** See your latest leads with status indicators
- **Quick Actions:** Navigate to all dashboard sections
- **Professional UI:** Cards, gradients, and smooth animations

#### **Navigation Sections:**
- **🛠️ Widgets:** Manage your quote calculators
- **👥 Leads:** View and follow up with prospects  
- **📈 Analytics:** Track performance metrics
- **⚙️ Settings:** Business profile and preferences

### **✅ Test Scenarios**

1. **Login Flow Test:**
   - Visit your deployed site `/login`
   - Use credentials above
   - Should redirect to dashboard

2. **Dashboard Data Test:**
   - Verify KPI cards show real numbers
   - Check recent leads section populated
   - Test navigation between sections

3. **Responsive Design Test:**
   - Test on mobile/tablet/desktop
   - Verify mobile navigation works
   - Check all cards and layouts adapt

## 🔧 **Technical Details**

### **Database Setup:**
- Business ID: `123e4567-e89b-12d3-a456-426614174000`
- Widget ID: `456e7890-e89b-12d3-a456-426614174001` 
- User ID: `bd391267-388b-4364-8259-02729bfc2eba`
- 5 sample submissions with varying completion statuses
- Complete pricing rules for HVAC services

### **Authentication:**
- ✅ Supabase Auth user exists
- ✅ User profile linked to business
- ✅ Business profile complete
- ✅ Skip setup flow (goes straight to dashboard)

## 🎯 **What to Look For**

### **✅ Should Work:**
- Smooth login experience with new theme
- Dashboard loads with real data showing
- KPI cards display: 1 widget, 5 leads, 60% conversion, $20,225 revenue
- Recent leads section shows 5 test customers
- Navigation works between all sections
- Professional UI matching website theme
- Mobile responsive design
- User avatar with lime accent color

### **🔍 Areas to Test:**
- Login page design matches website theme
- Dashboard data accuracy and calculations
- Navigation responsiveness on mobile
- Back to website functionality
- Sign out flow
- Quick actions linking to proper sections

## 💡 **Next Steps After Testing**

1. **Widget Management:** You can test the widgets section (currently shows your HVAC calculator)
2. **Lead Management:** View detailed lead information and status updates
3. **Analytics:** See performance metrics and conversion tracking
4. **Settings:** Update business profile and notification preferences

## 🚨 **Important Notes**

- This is test data - feel free to experiment
- The widget has realistic HVAC pricing calculations built-in
- Lead data includes different completion statuses for testing
- All timestamps are recent for realistic dashboard feel
- Conversion rate calculation: 3 completed / 5 total = 60%
- Revenue calculation: $8,750 + $275 + $11,200 = $20,225

**Happy testing! 🎉**