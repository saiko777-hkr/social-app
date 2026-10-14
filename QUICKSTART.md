# 🚀 دليل التشغيل السريع - SocialConnect

## ✅ المشروع جاهز!

تم إنشاء التطبيق الكامل بنجاح! 🎉

---

## 📋 المتطلبات

قبل البدء، تأكد من تثبيت التالي:

### 1. Node.js
- تحميل من: https://nodejs.org/
- اختر LTS version
- تأكد من التثبيت: افتح Terminal واكتب `node --version`

### 2. PostgreSQL
- تحميل من: https://www.postgresql.org/download/windows/
- اختر الإصدار 16 أو 17
- **مهم جداً:** تذكر كلمة مرور postgres
- بعد التثبيت:
  - افتح pgAdmin
  - أنشئ database جديد اسمه `social_app`

### 3. Expo CLI
بعد تثبيت Node.js، افتح Terminal كـ Administrator:
```bash
npm install -g expo-cli
npm install -g eas-cli
```

---

## 🗄️ إعداد قاعدة البيانات

### الطريقة 1: باستخدام pgAdmin
1. افتح pgAdmin
2. اضغط يمين على Databases → Create → Database
3. اسم الـ Database: `social_app`
4. اضغط Save
5. افتح Query Tool على الـ database
6. انسخ محتوى `backend/database.sql`
7. الصقه واضغط Execute

### الطريقة 2: باستخدام Terminal
```bash
psql -U postgres -d social_app -f backend/database.sql
```

---

## ⚙️ إعداد Backend

### 1. الذهاب لمجلد Backend
```bash
cd social-app/backend
```

### 2. تثبيت الـ Dependencies
```bash
npm install
```

### 3. إعداد ملف .env
افتح ملف `.env` وعدّل القيم:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=social_app
DB_USER=postgres
DB_PASSWORD=your_actual_password_here
JWT_SECRET=change_this_to_a_random_long_string
ADMIN_PHONE=01000000000
```

**مهم:**
- `DB_PASSWORD`: كلمة مرور postgres التي اخترتها أثناء التثبيت
- `JWT_SECRET`: أي نص طويل وعشوائي
- `ADMIN_PHONE`: رقمك الشخصي (سيكون المدير)

### 4. تشغيل السيرفر
```bash
npm start
```

سيعرض: `Server running on port 5000`
**اترك هذا Terminal مفتوحاً**

---

## 📱 إعداد Frontend

### 1. فتح Terminal جديد
(لا تغلق Terminal الـ Backend)

### 2. الذهاب لمجلد Frontend
```bash
cd social-app/frontend
```

### 3. تثبيت الـ Dependencies
```bash
npm install
```

### 4. تشغيل التطبيق
```bash
npm start
```

سيفتح صفحة في المتصفح مع QR Code

---

## 📲 تشغيل على الهاتف

### على iPhone:
1. حمل تطبيق Expo Go من App Store
2. امسح QR Code بالكاميرا
3. سيفتح التطبيق تلقائياً

### على Android:
1. حمل تطبيق Expo Go من Google Play
2. افتح Expo Go وامسح QR Code
3. سيفتح التطبيق

---

## 🧪 اختبار التطبيق

### 1. تسجيل المدير
- استخدم رقمك من `ADMIN_PHONE` في `.env`
- اختر كلمة مرور
- سيحصل تلقائياً على صلاحيات Admin

### 2. تسجيل مستخدمين آخرين
- استخدم أرقام مختلفة
- كل مستخدم سيكون عادياً

### 3. تجربة المميزات
- ✅ إنشاء بوستات
- ✅ لايك وكومنت
- ✅ إنشاء ستوري
- ✅ شات خاص وإرسال رصيد
- ✅ جروب عام
- ✅ تغيير الاسم واللون
- ✅ الإعدادات
- ✅ الدعم والتقارير
- ✅ لوحة تحكم المدير

---

## 📦 بناء APK

### 1. تسجيل دخول Expo
```bash
cd social-app/frontend
npx expo login
```

### 2. بناء APK
```bash
eas build --platform android --profile preview
```

### 3. انتظار البناء
- سيأخذ من 10-20 دقيقة
- سيعطيك رابط لتحميل الـ APK
- شارك الرابط مع الناس

---

## 🌐 نشر أونلاين

لجعل التطبيق أونلاين، ستحتاج:

### Backend Hosting:
- **مجاني:** Render, Railway, Glitch
- **مدفوع:** DigitalOcean, AWS, Heroku

### Database Hosting:
- **مجاني:** Supabase, Neon, Railway
- **مدفوع:** AWS RDS, DigitalOcean

### بعد النشر:
1. عدّل `frontend/src/services/api.js`
2. غيّر:
```javascript
const API_URL = 'https://your-server-url.com/api';
```
3. أعِ بناء الـ APK

---

## 🛠️ حل المشاكل

### المشكلة: "npm is not recognized"
**الحل:** تأكد من تثبيت Node.js وأضفه إلى PATH

### المشكلة: "Connection refused"
**الحل:**
- تأكد أن PostgreSQL يعمل
- تأكد من صحة كلمة المرور في `.env`
- تأكد أن database اسمه `social_app`

### المشكلة: "Module not found"
**الحل:**
```bash
cd social-app/backend
npm install

cd ../frontend
npm install
```

### المشكلة: Expo لا يعمل
**الحل:**
```bash
npm install -g expo-cli
npm install -g eas-cli
```

---

## 📁 هيكل المشروع

```
social-app/
├── backend/           # السيرفر وقاعدة البيانات
│   ├── config/        # إعدادات قاعدة البيانات
│   ├── middleware/    # التحقق من المستخدمين
│   ├── routes/        # API endpoints
│   ├── server.js      # السيرفر الرئيسي
│   ├── database.sql   # جداول قاعدة البيانات
│   └── .env           # الإعدادات السرية
│
└── frontend/          # تطبيق الهاتف
    ├── src/
    │   ├── components/   # المكونات (GlassCard)
    │   ├── screens/      # الشاشات
    │   ├── navigation/   # التنقل
    │   ├── services/     # API calls
    │   └── theme/        # الألوان والخطوط
    ├── App.js          # نقطة البداية
    └── package.json    # الـ dependencies
```

---

## 🎨 المميزات المطبقة

✅ **نظام التوثيق:**
- تسجيل بالرقم + كلمة مرور
- JWT tokens
- صلاحيات Admin

✅ **المحتوى:**
- بوستات مع صور
- لايكات (iOS emojis)
- كومنتات
- ستوري مع privacy

✅ **التواصل:**
- شات خاص
- إرسال رصيد
- جروب عام
- Follow/Unfollow

✅ **الإعدادات:**
- تخصيص الاسم (كل 7 أيام)
- تخصيص اليوزر نيم (كل 25 يوم)
- لون مخصص للاسم
- Display Name و Bio

✅ **Premium:**
- نجمة ⭐ بجانب الاسم
- صلاحيات خاصة

✅ **المدير:**
- حظر/فك حظر
- إضافة/إزالة Premium
- الرد على تذاكر الدعم

✅ **الدعم:**
- طلب مساعدة
- اقتراحات
- تبليغ عن مستخدمين

✅ **التصميم:**
- Glass morphism
- iOS-style
- Smooth animations
- San Francisco font

---

## 💡 نصائح

1. **ابدأ بـ localhost أولاً**
   - اختبر كل شيء محلياً قبل النشر

2. **احتفظ بالـ code backup**
   - ارجع كودك على GitHub

3. **استخدم صلاحيات Admin بحذر**
   - لا تحظر أحد بدون سبب

4. **اختبر على أجهزة مختلفة**
   - iPhone و Android

5. **راقب الـ logs**
   - في Terminal إذا واجهت مشاكل

---

## 🆘 تحتاج مساعدة؟

إذا واجهت أي مشكلة:
1. اقرأ قسم "حل المشاكل" أعلاه
2. تأكد من تثبيت جميع المتطلبات
3. تحقق من logs في Terminal
4. تأكد من صحة `.env`

---

## 🎉 تهانينا!

لديك الآن تطبيق تواصل اجتماعي كامل وجاهز للعمل! 🚀

ابدأ بتشغيل Backend ثم Frontend واستمتع!
