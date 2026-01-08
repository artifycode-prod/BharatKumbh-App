# Quick Start - Frontend-Backend Integration

## ✅ What's Been Done

1. ✅ **API Configuration** - `src/config/api.ts`
2. ✅ **API Service Layer** - All services created in `src/services/`
3. ✅ **Authentication Integration** - Updated `src/services/auth.ts` to use real API
4. ✅ **Socket.IO Service** - Real-time communication ready
5. ✅ **Documentation** - Complete integration guide created

## 🚀 Next Steps

### 1. Configure API URL

Edit `client/src/config/api.ts`:

```typescript
const API_BASE_URL = __DEV__
  ? 'http://YOUR_LOCAL_IP:5000'  // Replace with your computer's IP
  : 'https://your-production-api.com';
```

**To find your IP:**
- Windows: Run `ipconfig` → Look for "IPv4 Address"
- Mac/Linux: Run `ifconfig` → Look for "inet"

### 2. Start Backend Server

```bash
cd server
npm install  # If not done already
npm run dev
```

Verify it's running: `http://localhost:5000/api/health`

### 3. Test the Integration

1. **Start your React Native app:**
   ```bash
   cd client
   npm start
   # Then run on device/emulator
   ```

2. **Try logging in:**
   - First, register a user via API or use existing credentials
   - The Login screen will automatically use the real API
   - If API fails, it falls back to demo mode

### 4. Use API Services in Your Screens

Import and use the services:

```typescript
import { createSOS } from '../services/sosService';
import { reportItem } from '../services/lostFoundService';
// etc.
```

See `API_INTEGRATION_GUIDE.md` for detailed examples.

## 📁 New Files Created

```
client/
├── src/
│   ├── config/
│   │   └── api.ts                    # API configuration
│   ├── services/
│   │   ├── api.ts                    # Axios instance
│   │   ├── authService.ts            # Authentication API
│   │   ├── sosService.ts             # SOS API
│   │   ├── lostFoundService.ts       # Lost & Found API
│   │   ├── medicalService.ts         # Medical API
│   │   ├── volunteerService.ts       # Volunteer API
│   │   ├── adminService.ts           # Admin API
│   │   └── socketService.ts          # Socket.IO service
│   └── examples/
│       └── APIUsageExamples.tsx      # Usage examples
├── API_INTEGRATION_GUIDE.md          # Complete guide
└── QUICK_START.md                    # This file
```

## 🔧 Testing Checklist

- [ ] Backend server running on port 5000
- [ ] API_BASE_URL configured in `src/config/api.ts`
- [ ] Can access `http://YOUR_IP:5000/api/health` from device
- [ ] Login works with real credentials
- [ ] Can create SOS alerts
- [ ] Socket.IO connects (check console logs)

## 📚 Documentation

- **Complete Guide**: `API_INTEGRATION_GUIDE.md`
- **Usage Examples**: `src/examples/APIUsageExamples.tsx`
- **Backend Setup**: `server/BACKEND_SETUP_GUIDE.md`

## 🐛 Common Issues

### "Network Error"
- Check backend is running
- Verify IP address in `api.ts`
- Check firewall settings

### "401 Unauthorized"
- Token might be expired - try logging in again
- Check backend JWT_SECRET matches

### Socket.IO not connecting
- Ensure backend Socket.IO is running
- Check token is passed to `initSocket(token)`

## 💡 Tips

1. **Development**: Use your local IP for physical device testing
2. **Emulator**: Use `localhost` or `10.0.2.2` (Android)
3. **Error Handling**: Always wrap API calls in try-catch
4. **Loading States**: Show loading indicators during API calls
5. **Real-time**: Use Socket.IO for live updates

---

**Ready to go!** Start by configuring the API URL and testing the login.

