# SocialConnect - Social Media App

تطبيق تواصل اجتماعي متكامل يعمل على iOS و Android

## المميزات

✅ تسجيل دخول بالرقم + كلمة مرور مخصصة
✅ لايكات + كومنتات + شات خاص
✅ إرسال رصيد في الشات
✅ ستوري مع تحديد الخصوصية (عام/أصدقاء/محدد)
✅ نظام Premium مع نجمة مميزة
✅ لوحة تحكم المدير (حظر/فك حظر/إضافة Premium)
✅ جروب عام للمستخدمين
✅ قسم دعم وتقارير واقتراحات
✅ تخصيص الاسم واليوزر نيم (قيود زمنية)
✅ لون مخصص للاسم
✅ Glass morphism design مثل iOS
✅ إيموجي iOS-style
✅ خط San Francisco (الأيفون)
✅ تصميم liquid glass و smooth

## المتطلبات

### Backend
- Node.js (v18 أو أحدث)
- PostgreSQL (v16 أو أحدث)

### Frontend
- Node.js
- Expo CLI
- Android Studio (للـ APK) أو Xcode (للـ iOS)

## التثبيت والتشغيل

### 1. إعداد قاعدة البيانات

```bash
# افتح pgAdmin وأنشئ database جديد اسمه social_app
# ثم نفذ ملف database.sql
psql -U postgres -d social_app -f backend/database.sql
```

### 2. إعداد Backend

```bash
cd backend
npm install
```

عدّل ملف `.env`:
```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=social_app
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_super_secret_jwt_key_change_this
ADMIN_PHONE=01000000000
```

شغّل السيرفر:
```bash
npm start
```

### 3. إعداد Frontend

```bash
cd frontend
npm install
```

شغّل التطبيق:
```bash
# للتطوير
npm start

# على محاكي Android
npm run android

# على محاكي iOS (Mac فقط)
npm run ios
```

## بناء APK

### 1. إعداد Expo Account
```bash
npx expo login
```

### 2. بناء APK
```bash
cd frontend
eas build --platform android --profile preview
```

سيعطيك رابط لتحميل الـ APK

### 3. بناء للإنتاج
```bash
eas build --platform android --profile production
```

## هيكل المشروع

```
social-app/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── posts.js
│   │   ├── stories.js
│   │   ├── chat.js
│   │   ├── follows.js
│   │   └── support.js
│   ├── server.js
│   ├── database.sql
│   ├── package.json
│   └── .env
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── GlassCard.js
    │   ├── screens/
    │   │   ├── auth/
    │   │   ├── feed/
    │   │   ├── chat/
    │   │   ├── stories/
    │   │   └── profile/
    │   ├── navigation/
    │   │   └── AppNavigator.js
    │   ├── services/
    │   │   └── api.js
    │   └── theme/
    │       ├── colors.js
    │       └── typography.js
    ├── App.js
    ├── app.json
    ├── eas.json
    └── package.json
```

## API Endpoints

### Auth
- POST `/api/auth/register` - تسجيل حساب جديد
- POST `/api/auth/login` - تسجيل دخول

### Users
- GET `/api/users/profile` - بروفايل المستخدم
- PUT `/api/users/profile` - تحديث البروفايل
- PUT `/api/users/change-name` - تغيير الاسم (كل 7 أيام)
- PUT `/api/users/change-username` - تغيير اليوزر نيم (كل 25 يوم)
- GET `/api/users/all` - كل المستخدمين (أدمن)
- PUT `/api/users/block/:userId` - حظر/فك حظر (أدمن)
- PUT `/api/users/premium/:userId` - إضافة/إزالة Premium (أدمن)
- GET `/api/users/search?q=` - بحث عن مستخدمين

### Posts
- POST `/api/posts` - إنشاء بوست
- GET `/api/posts` - كل البوستات
- GET `/api/posts/user/:userId` - بوستات مستخدم
- POST `/api/posts/:postId/like` - لايك/إزالة لايك
- GET `/api/posts/:postId/likes` - اللايكات
- POST `/api/posts/:postId/comment` - إضافة كومنت
- GET `/api/posts/:postId/comments` - الكومنتات
- DELETE `/api/posts/:postId` - حذف بوست

### Stories
- POST `/api/stories` - إنشاء ستوري
- GET `/api/stories` - كل الستوريز
- GET `/api/stories/user/:userId` - ستوريز مستخدم
- POST `/api/stories/:storyId/view` - مشاهدة ستوري
- GET `/api/stories/:storyId/viewers` - المشاهدين
- DELETE `/api/stories/:storyId` - حذف ستوري

### Chat
- POST `/api/chat/private` - إرسال رسالة خاصة
- GET `/api/chat/private/:userId` - رسائل خاصة
- GET `/api/chat/conversations` - المحادثات
- POST `/api/chat/group` - إرسال رسالة جروب
- GET `/api/chat/group` - رسائل الجروب

### Follows
- POST `/api/follows/:userId` - فولو/إلغاء فولو
- GET `/api/follows/:userId/followers` - الفولويرز
- GET `/api/follows/:userId/following` - المتابَعين
- GET `/api/follows/check/:userId` - التحقق من الفولو

### Support
- POST `/api/support` - إنشاء تذكرة دعم
- GET `/api/support/my` - تذاكري
- GET `/api/support/all` - كل التذاكر (أدمن)
- PUT `/api/support/:ticketId/respond` - الرد على تذكرة (أدمن)

## المدير (Admin)

رقم المدير يتم تحديده في ملف `.env` في `ADMIN_PHONE`

المدير لديه صلاحيات:
- حظر/فك حظر المستخدمين
- إضافة/إزالة Premium
- الرد على تذاكر الدعم
- مشاهدة كل التقارير

## النشر أونلاين

لجعل التطبيق أونلاين، ستحتاج إلى:

1. **Hosting للـ Backend:**
   - Render, Heroku, DigitalOcean, أو AWS
   - ربط PostgreSQL على السيرفر (Supabase, Railway, Neon)

2. **Hosting للـ Frontend:**
   - يمكن نشر الـ APK على Google Play Store
   - أو توزيعه مباشرة عبر رابط تحميل

3. **تعديل API URL:**
   في `frontend/src/services/api.js` غيّر:
   ```javascript
   const API_URL = 'http://your-server-url.com/api';
   ```

## الدعم الفني

إذا واجهت أي مشاكل:
- تأكد من تثبيت جميع المتطلبات
- تأكد من تشغيل PostgreSQL
- تأكد من صحة بيانات `.env`
- تحقق من الـ logs في الـ terminal

## الترخيص

هذا المشروع خاص بك تماماً 🎉
