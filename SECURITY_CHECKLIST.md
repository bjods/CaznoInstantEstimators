# Cazno Security Hardening Checklist

**Status**: 🚨 CRITICAL VULNERABILITIES - IMMEDIATE ACTION REQUIRED  
**Security Score**: 4/10  
**Last Updated**: 2025-01-30

## 🔥 CRITICAL PRIORITY (Fix Before Production)

### 1. Widget Domain Validation & Embedding Security
- [x] **Add domain whitelist to widgets table**
  - [x] Add `allowed_domains` column to widgets table (TEXT[])
  - [x] Add security tracking tables (widget_domain_usage, security_events)
  - [x] Create domain validation functions
  - [ ] Update widget configuration interface to manage allowed domains
  - [ ] Default to business owner's domain if no domains specified
- [ ] **Implement domain validation middleware**
  - [ ] Create domain validation function for widget requests
  - [ ] Check origin header against widget's allowed domains
  - [ ] Return 403 Forbidden for unauthorized domains
- [ ] **Add iframe security headers**
  - [ ] Implement X-Frame-Options: SAMEORIGIN or DENY
  - [ ] Add Content-Security-Policy frame-ancestors directive
  - [ ] Configure CSP to allow only trusted parent domains
- [ ] **PostMessage security for iframe communication** (Phase 2 - After Core Security)
  - [ ] **Basic Implementation Only:**
    - [ ] Implement secure postMessage validation with origin checking
    - [ ] Widget height updates for iframe auto-resizing
    - [ ] Form submission event notifications
  - [ ] **Security Requirements:**
    - [ ] Validate message origin against allowed domains
    - [ ] Use structured message format with validation
    - [ ] Rate limiting for postMessage events
    - [ ] Log suspicious postMessage attempts
  - [ ] **Client Integration:**
    - [ ] Provide simple embed code with postMessage listener
    - [ ] Document supported message types (height, submission)
    - [ ] Create integration testing guide
- [ ] **Widget embed analytics & monitoring**
  - [ ] Track widget usage per domain
  - [ ] Log unauthorized embedding attempts
  - [ ] Alert on suspicious widget usage patterns

### 2. Input Validation & Sanitization
- [ ] **Install and configure validation library**
  - [ ] Install Zod for TypeScript schema validation
  - [ ] Create validation schemas for all API endpoints
  - [ ] Implement server-side validation middleware
- [ ] **Validate all API endpoints**
  - [ ] `/api/submissions/route.ts` - submission data validation
  - [ ] `/api/submissions/autosave/route.ts` - autosave data validation
  - [ ] `/api/submissions/complete/route.ts` - completion data validation
  - [ ] `/api/estimates/route.ts` - estimate data validation
  - [ ] Any other API endpoints handling user input
- [ ] **Implement data sanitization**
  - [ ] HTML/XSS sanitization for text inputs
  - [ ] SQL injection prevention (parameterized queries)
  - [ ] File upload sanitization (if applicable)
  - [ ] Email validation and normalization
  - [ ] Phone number validation and formatting
- [ ] **Add input length limits**
  - [ ] Maximum field lengths for all text inputs
  - [ ] Maximum file sizes for uploads
  - [ ] Maximum request payload sizes
- [ ] **Validate JSONB data structures**
  - [ ] Schema validation for widget configurations
  - [ ] Validation for form data stored as JSONB
  - [ ] Type checking for pricing calculator data

### 3. Rate Limiting & DDoS Protection
- [ ] **Implement global rate limiting**
  - [ ] Install rate limiting middleware (upstash/ratelimit or similar)
  - [ ] Configure Redis/Upstash for distributed rate limiting
  - [ ] Set appropriate limits per endpoint type
- [ ] **API endpoint rate limits**
  - [ ] Widget submission endpoints: 10 requests/minute per IP
  - [ ] Authentication endpoints: 5 attempts/minute per IP
  - [ ] General API endpoints: 100 requests/minute per IP
  - [ ] Dashboard endpoints: 60 requests/minute per authenticated user
- [ ] **User-specific rate limiting**
  - [ ] Per-user limits for authenticated endpoints
  - [ ] Per-widget limits for submission endpoints
  - [ ] Implement progressive delays for repeated violations
- [ ] **Rate limit monitoring & alerts**
  - [ ] Log rate limit violations
  - [ ] Alert administrators on sustained attacks
  - [ ] Implement temporary IP blocking for severe violations

### 4. Content Security Policy & Security Headers
- [ ] **Implement comprehensive CSP**
  - [ ] Configure default-src 'self'
  - [ ] Add script-src for trusted JavaScript sources
  - [ ] Configure img-src for trusted image sources
  - [ ] Set frame-ancestors for iframe embedding control
  - [ ] Configure connect-src for API calls
- [ ] **Add essential security headers**
  - [ ] X-Frame-Options: SAMEORIGIN
  - [ ] X-Content-Type-Options: nosniff
  - [ ] X-XSS-Protection: 1; mode=block
  - [ ] Referrer-Policy: strict-origin-when-cross-origin
  - [ ] Strict-Transport-Security: max-age=31536000
- [ ] **Configure Next.js security headers**
  - [ ] Update next.config.ts with security headers
  - [ ] Test headers in development and production
  - [ ] Validate CSP doesn't break functionality
- [ ] **Security header testing**
  - [ ] Use security header analyzers (securityheaders.com)
  - [ ] Test CSP with browser dev tools
  - [ ] Verify iframe embedding still works for allowed domains

## ⚡ HIGH PRIORITY (Week 1)

### 5. CORS Configuration Hardening
- [ ] **Replace wildcard CORS origins**
  - [ ] Remove 'Access-Control-Allow-Origin': '*'
  - [ ] Implement dynamic origin validation
  - [ ] Create function to check allowed domains per widget
- [ ] **Implement secure CORS middleware**
  - [ ] Validate origin against widget's allowed domains
  - [ ] Handle preflight OPTIONS requests properly
  - [ ] Set appropriate CORS headers per endpoint
- [ ] **CORS testing & validation**
  - [ ] Test widget embedding from allowed domains
  - [ ] Verify blocked access from unauthorized domains
  - [ ] Test preflight requests work correctly

### 6. CSRF Protection
- [ ] **Implement CSRF tokens**
  - [ ] Generate CSRF tokens for form submissions
  - [ ] Validate CSRF tokens on API endpoints
  - [ ] Use secure token generation (crypto.randomBytes)
- [ ] **Add CSRF middleware**
  - [ ] Create CSRF validation middleware
  - [ ] Apply to all state-changing endpoints (POST, PUT, DELETE)
  - [ ] Exclude public widget endpoints (handle differently)
- [ ] **CSRF token management**
  - [ ] Store tokens securely (httpOnly cookies or encrypted storage)
  - [ ] Implement token rotation
  - [ ] Handle token expiration gracefully

### 7. Authentication Security Hardening
- [ ] **Password security improvements**
  - [ ] Implement password strength requirements (8+ chars, mixed case, numbers)
  - [ ] Add password strength indicator in UI
  - [ ] Prevent common/breached passwords
- [ ] **Authentication rate limiting**
  - [ ] Limit login attempts (5 per 15 minutes per IP)
  - [ ] Implement account lockout after failed attempts
  - [ ] Add progressive delays for repeated failures
- [ ] **Session security**
  - [ ] Review Supabase session configuration
  - [ ] Implement session timeout for inactive users
  - [ ] Add secure logout functionality
- [ ] **Password reset security**
  - [ ] Implement secure password reset flow
  - [ ] Rate limit password reset requests
  - [ ] Use secure tokens with expiration

### 8. API Security Enhancements
- [ ] **Request size limits**
  - [ ] Implement request body size limits (1MB default)
  - [ ] Specific limits per endpoint type
  - [ ] Handle large request rejection gracefully
- [ ] **API versioning**
  - [ ] Implement API versioning strategy
  - [ ] Version critical endpoints for backward compatibility
  - [ ] Document API version deprecation policy
- [ ] **API documentation security**
  - [ ] Remove sensitive information from API responses
  - [ ] Implement proper error handling (no stack traces)
  - [ ] Add request/response logging for security monitoring

## 🔧 MEDIUM PRIORITY (Week 2-3)

### 9. Database Security Enhancements
- [ ] **Review and audit RLS policies**
  - [ ] Verify all tables have appropriate RLS policies
  - [ ] Test RLS policies with different user scenarios
  - [ ] Document RLS policy logic and coverage
- [ ] **Database connection security**
  - [ ] Review Supabase connection string security
  - [ ] Implement connection pooling best practices
  - [ ] Add database query logging for security events
- [ ] **Sensitive data encryption**
  - [ ] Identify sensitive fields requiring encryption
  - [ ] Implement field-level encryption for PII
  - [ ] Secure encryption key management

### 10. Environment & Configuration Security
- [ ] **Environment variable security**
  - [ ] Audit all environment variables
  - [ ] Remove any committed secrets from git history
  - [ ] Implement proper secret management
- [ ] **Configuration security**
  - [ ] Review all configuration files for sensitive data
  - [ ] Implement configuration validation
  - [ ] Add security configuration templates

### 11. Error Handling & Information Disclosure
- [ ] **Secure error handling**
  - [ ] Remove stack traces from production errors
  - [ ] Implement generic error messages for users
  - [ ] Log detailed errors securely for debugging
- [ ] **Information disclosure prevention**
  - [ ] Remove debug information from production
  - [ ] Sanitize API responses
  - [ ] Remove version information from headers

### 12. File Upload Security (if applicable)
- [ ] **File upload validation**
  - [ ] Implement file type validation
  - [ ] Add file size limits
  - [ ] Scan uploads for malware
- [ ] **File storage security**
  - [ ] Secure file storage location
  - [ ] Implement access controls on uploaded files
  - [ ] Add file encryption for sensitive uploads

## 📊 MONITORING & COMPLIANCE (Week 3-4)

### 13. Security Monitoring & Logging
- [ ] **Implement security event logging**
  - [ ] Log authentication attempts (success/failure)
  - [ ] Log authorization failures
  - [ ] Log rate limit violations
  - [ ] Log suspicious activity patterns
- [ ] **Security dashboards**
  - [ ] Create security metrics dashboard
  - [ ] Monitor failed authentication attempts
  - [ ] Track API usage patterns
  - [ ] Alert on suspicious activities
- [ ] **Incident response plan**
  - [ ] Document security incident procedures
  - [ ] Create security contact list
  - [ ] Implement automated alerts for critical events

### 14. Data Privacy & Compliance
- [ ] **Data retention policies**
  - [ ] Implement data retention schedules
  - [ ] Add data purging mechanisms
  - [ ] Document data lifecycle management
- [ ] **Privacy controls**
  - [ ] Implement data export functionality
  - [ ] Add data deletion capabilities
  - [ ] Create privacy policy compliance checks
- [ ] **Data encryption in transit/rest**
  - [ ] Verify all data transmission uses TLS
  - [ ] Implement encryption for sensitive data at rest
  - [ ] Document encryption standards used

### 15. Security Testing & Validation
- [ ] **Penetration testing**
  - [ ] Conduct internal security assessment
  - [ ] Test for common OWASP Top 10 vulnerabilities
  - [ ] Validate input validation effectiveness
- [ ] **Automated security scanning**
  - [ ] Implement dependency vulnerability scanning
  - [ ] Add SAST (Static Application Security Testing)
  - [ ] Set up container security scanning
- [ ] **Security code review**
  - [ ] Review all authentication code
  - [ ] Audit all API endpoints
  - [ ] Review database access patterns

## 🚀 ADVANCED SECURITY (Future Enhancements)

### 16. Advanced Authentication
- [ ] **Multi-factor authentication (MFA)**
  - [ ] Implement TOTP-based MFA
  - [ ] Add SMS-based MFA option
  - [ ] Create MFA recovery procedures
- [ ] **Single Sign-On (SSO)**
  - [ ] Implement OAuth2/OIDC providers
  - [ ] Add SAML support for enterprise
  - [ ] Create SSO user provisioning

### 17. API Security Advanced Features
- [ ] **API key authentication**
  - [ ] Implement API keys for business integrations
  - [ ] Add API key rotation capabilities
  - [ ] Create API usage analytics
- [ ] **Webhook security**
  - [ ] Implement HMAC signature verification
  - [ ] Add webhook retry mechanisms
  - [ ] Create webhook security documentation

### 18. Infrastructure Security
- [ ] **Network security**
  - [ ] Implement IP whitelisting for admin access
  - [ ] Add VPN requirements for sensitive operations
  - [ ] Create network segmentation rules
- [ ] **Container security**
  - [ ] Implement container image scanning
  - [ ] Add runtime security monitoring
  - [ ] Create secure deployment pipelines

## 📋 TESTING & VALIDATION CHECKLIST

### Security Testing Requirements
- [ ] **Input validation testing**
  - [ ] Test SQL injection attempts
  - [ ] Test XSS payload injection
  - [ ] Test CSRF attack scenarios
  - [ ] Test file upload attacks
- [ ] **Authentication testing**
  - [ ] Test brute force attacks
  - [ ] Test session hijacking scenarios
  - [ ] Test privilege escalation attempts
- [ ] **Authorization testing**
  - [ ] Test horizontal privilege escalation
  - [ ] Test vertical privilege escalation
  - [ ] Test business logic bypass attempts
- [ ] **Rate limiting testing**
  - [ ] Test rate limit enforcement
  - [ ] Test rate limit bypass attempts
  - [ ] Test distributed rate limiting

### Security Validation Tools
- [ ] **Automated scanning tools**
  - [ ] OWASP ZAP security scanning
  - [ ] Burp Suite professional assessment
  - [ ] Nessus vulnerability scanning
- [ ] **Code analysis tools**
  - [ ] ESLint security plugin
  - [ ] Semgrep security rules
  - [ ] SonarQube security analysis
- [ ] **Infrastructure scanning**
  - [ ] Docker image vulnerability scanning
  - [ ] Cloud security posture assessment
  - [ ] SSL/TLS configuration testing

## 📈 SECURITY METRICS & KPIs

### Security Metrics to Track
- [ ] **Authentication metrics**
  - [ ] Failed login attempts per day
  - [ ] Account lockouts per day
  - [ ] Password reset requests per day
- [ ] **API security metrics**
  - [ ] Rate limit violations per day
  - [ ] Blocked requests per day
  - [ ] API error rates
- [ ] **Input validation metrics**
  - [ ] Malicious input attempts blocked
  - [ ] Validation failures per endpoint
  - [ ] Data sanitization effectiveness
- [ ] **General security metrics**
  - [ ] Security incidents per month
  - [ ] Vulnerability patching time
  - [ ] Security training completion rates

## 🎯 COMPLETION CRITERIA

### Critical Priority (Must Complete Before Production)
- [ ] All widget embedding security measures implemented
- [ ] Input validation on all API endpoints
- [ ] Rate limiting on all endpoints
- [ ] Security headers configured
- [ ] CORS properly restricted
- [ ] CSRF protection implemented

### Success Metrics
- [ ] Security score improved to 8+/10
- [ ] Zero critical vulnerabilities in security scan
- [ ] All authentication endpoints rate limited
- [ ] All API endpoints validated and sanitized
- [ ] Widget embedding restricted to authorized domains only
- [ ] Security monitoring dashboard operational

---

**NEXT STEPS**: Start with Critical Priority items #1-4. Each item should be completed and tested before moving to the next. Document all changes and test thoroughly in development environment before production deployment.

**ESTIMATED TIMELINE**: 
- Critical Priority: 1-2 weeks
- High Priority: 1 week  
- Medium Priority: 2 weeks
- Total: 4-5 weeks for complete security hardening

**RESOURCES NEEDED**:
- Security testing tools access
- Redis/Upstash for rate limiting
- Additional environment for security testing
- Code review from security-focused developer