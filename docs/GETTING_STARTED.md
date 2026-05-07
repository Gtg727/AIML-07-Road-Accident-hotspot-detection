# 🎯 B2B Portal - Getting Started

## 📦 What You Have Now

Complete B2B Portal with:
- ✅ User authentication system
- ✅ Registration and login pages
- ✅ Dashboard with multiple sections
- ✅ Team management capabilities
- ✅ Secure backend API
- ✅ Database integration
- ✅ Full documentation

## ⚡ Quick Start (2 Steps)

### Step 1: Start Backend
Open PowerShell/Terminal and run:
```powershell
# Set environment variable
$env:FLASK_APP = "flaskr.py"

# Run Flask server
flask run

# Expected output:
# * Running on http://localhost:5000
# * Debug mode: on
```

### Step 2: Start Frontend
Open another PowerShell/Terminal and run:
```powershell
# Start dev server
npm run dev

# Expected output:
# ➜  Local:   http://localhost:5173/
# ➜  press h + enter to show help
```

### Step 3: Access Portal
1. Open browser: `http://localhost:5173/b2b/register`
2. Create an account OR
3. Go to: `http://localhost:5173/b2b/login`

## 📁 New Files Created

### Frontend Components
| File | Purpose |
|------|---------|
| `src/contexts/AuthContext.tsx` | Authentication state & logic |
| `src/pages/b2b/Register.tsx` | User registration page |
| `src/pages/b2b/Login.tsx` | User login page |
| `src/pages/b2b/Dashboard.tsx` | Main B2B dashboard |
| `src/pages/b2b/ForgotPassword.tsx` | Password recovery |
| `src/components/ProtectedRoute.tsx` | Route protection |

### Backend Updates
| File | Changes |
|------|---------|
| `flaskr.py` | Added auth & B2B endpoints |
| `requirements.txt` | Python dependencies |

### Documentation
| File | Content |
|------|---------|
| `B2B_PORTAL_DOCUMENTATION.md` | Complete reference |
| `B2B_PORTAL_IMPLEMENTATION_SUMMARY.md` | What was built |
| `SETUP_GUIDE.md` | Detailed setup |
| `QUICK_REFERENCE.md` | Quick lookup |
| `.env.example` | Environment template |

### Modified Files
| File | Changes |
|------|---------|
| `src/App.tsx` | Added B2B routes + AuthProvider |

## 🔑 First Account Setup

When you first run the portal:

1. **Go to Registration:** `http://localhost:5173/b2b/register`

2. **Fill Form (Example):**
   - Company Name: "Your Company Inc"
   - Company Type: "Transportation"
   - Employees: "51-200"
   - First Name: "John"
   - Last Name: "Doe"
   - Email: "john@yourcompany.com"
   - Phone: "+1 555-0000"
   - Address: "123 Business Street"
   - City: "New York"
   - State: "NY"
   - Country: "USA"
   - Postal Code: "10001"
   - Password: "SecurePass123"
   - Confirm Password: "SecurePass123"

3. **Click "Create Account"**

4. **Auto-redirects to Dashboard**

## 🎯 Key URLs

| Feature | URL |
|---------|-----|
| Main Analysis | http://localhost:5173 |
| Admin Panel | http://localhost:5173/admin |
| B2B Login | http://localhost:5173/b2b/login |
| B2B Register | http://localhost:5173/b2b/register |
| B2B Dashboard | http://localhost:5173/b2b/dashboard |
| Forgot Password | http://localhost:5173/b2b/forgot-password |

## 🧪 Test the Features

### Test 1: Registration
- [ ] Navigate to `/b2b/register`
- [ ] Fill all fields with test data
- [ ] Submit form
- [ ] Should redirect to dashboard

### Test 2: Login
- [ ] Logout from dashboard
- [ ] Go to `/b2b/login`
- [ ] Enter registered email & password
- [ ] Should redirect to dashboard

### Test 3: Dashboard Navigation
- [ ] Click "Overview" tab
- [ ] Click "Team" tab
- [ ] Click "Company" tab
- [ ] Click "Settings" tab
- [ ] All tabs should load without errors

### Test 4: Logout
- [ ] Click "Sign Out" button
- [ ] Should redirect to login page
- [ ] localStorage should be cleared

## 🔐 Default API Response

When you login, you get:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "abc123...",
    "email": "john@company.com",
    "first_name": "John",
    "last_name": "Doe",
    "company_name": "Your Company",
    "role": "user",
    "created_at": "2024-01-15T10:30:00"
  }
}
```

## 📊 Dashboard Sections Explained

### Overview Tab
- **Total Analyses:** Number of analyses performed
- **Active Alerts:** Current active security alerts
- **Active Reports:** Number of running reports
- **API Calls:** Total API usage count

### Team Tab
- Shows all team members
- Displays name, email, and role
- Initially empty for new accounts

### Company Tab
- Company information (name, type, size)
- Contact person details
- Full address
- Membership date

### Settings Tab
- API key management
- Email notification preferences
- Account security options
- Danger zone (account deletion)

## 🐛 Troubleshooting

### Backend won't start
```powershell
# Check if Flask is installed
pip list | findstr Flask

# If not installed
pip install -r requirements.txt

# Check if port 5000 is in use
netstat -ano | findstr :5000

# Run on different port
flask run --port 5001
```

### Frontend won't start
```powershell
# Check if npm is installed
npm --version

# Install dependencies
npm install

# Check if port 5173 is in use
netstat -ano | findstr :5173

# Run on different port
npm run dev -- --port 3000
```

### Cannot login after registration
1. Check browser console for errors (F12)
2. Check Flask server logs for errors
3. Verify tokens are being stored in localStorage
4. Clear cache and try again

### Database issues
```powershell
# Reset database
del b2b_portal.db

# Or backup first
copy b2b_portal.db b2b_portal.db.backup

# Restart Flask to reinitialize
flask run
```

## 📚 Documentation Locations

1. **Start Here:**
   - `QUICK_REFERENCE.md` - One-page overview

2. **Detailed Instructions:**
   - `SETUP_GUIDE.md` - Step-by-step setup

3. **Complete Reference:**
   - `B2B_PORTAL_DOCUMENTATION.md` - Full API docs

4. **Implementation Details:**
   - `B2B_PORTAL_IMPLEMENTATION_SUMMARY.md` - What was built

## 🔗 File Dependencies

```
App.tsx
├── AuthContext.tsx (Authentication)
├── ProtectedRoute.tsx (Route protection)
└── Pages:
    ├── b2b/Login.tsx
    ├── b2b/Register.tsx
    ├── b2b/Dashboard.tsx
    └── b2b/ForgotPassword.tsx

Backend:
flaskr.py
└── sqlite3 (b2b_portal.db)
```

## 🚀 Next Steps

1. **Run the portal**
   - Follow Quick Start section above

2. **Test all features**
   - Complete the test checklist

3. **Review documentation**
   - Read QUICK_REFERENCE.md first

4. **Customize for your needs**
   - Modify colors, text, features
   - Add more endpoints
   - Extend database schema

5. **Deploy**
   - Follow SETUP_GUIDE.md deployment section

## 💡 Tips & Tricks

### Development
```powershell
# Use 2 terminals
# Terminal 1: npm run dev
# Terminal 2: flask run

# Both servers automatically reload on code changes
```

### Testing
```powershell
# Test API without frontend
curl -X POST http://localhost:5000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{"email":"test@test.com","password":"test123456","first_name":"Test","last_name":"User","company_name":"Test Inc"}'
```

### Debugging
```powershell
# Frontend: Press F12 for DevTools
# Network tab shows API calls
# Console tab shows JavaScript errors

# Backend: Flask logs show everything
# Add print() statements for debugging
```

## 🎨 Customization Ideas

1. **Change Colors:**
   - Edit tailwind.config.ts
   - Modify className colors in components

2. **Add Logo:**
   - Replace Building2 icon in Header
   - Add company logo to login/register

3. **Customize Dashboard:**
   - Add more KPI cards
   - Include charts and graphs
   - Add more team features

4. **Extend Backend:**
   - Add email notifications
   - Implement 2FA
   - Add advanced analytics

## ✨ Features You Can Use Immediately

- ✅ User registration
- ✅ User login/logout
- ✅ Profile viewing
- ✅ Settings management
- ✅ Team member viewing
- ✅ API key management (placeholder)
- ✅ Account deletion option (placeholder)

## 🔒 Security Checklist

Before deploying:
- [ ] Change SECRET_KEY in production
- [ ] Set FLASK_ENV to production
- [ ] Enable HTTPS
- [ ] Set up rate limiting
- [ ] Configure CORS for specific domains
- [ ] Implement email verification
- [ ] Add logging and monitoring
- [ ] Regular database backups

## 📞 Quick Support

| Issue | Check |
|-------|-------|
| Port in use | Change port in command |
| Cannot connect to API | Verify Flask is running |
| Page not loading | Check browser console |
| Database error | Delete db file and restart |
| Token invalid | Clear localStorage and login |

## 🎯 Success Indicators

You'll know it's working when:
- ✅ Both servers start without errors
- ✅ Can navigate to login page
- ✅ Can register a new account
- ✅ Dashboard loads after login
- ✅ Can see user info in dashboard
- ✅ Can logout and redirect works

## 📈 What's Next?

After getting comfortable with the portal:
1. Customize the look and feel
2. Add additional features
3. Integrate with your existing systems
4. Set up automated testing
5. Deploy to production

---

**You're all set! Start with the Quick Start section above.** 🚀
