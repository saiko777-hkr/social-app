# 🚀 دليل النشر أونلاين - SocialConnect

## الخيار 1: نشر حقيقي (مجاني) - Render + Supabase

### الخطوة 1: إعداد قاعدة البيانات على Supabase

1. اذهب إلى https://supabase.com
2. سجّل حساب جديد (مجاني)
3. أنشئ project جديد
4. انتظر حتى يجهز (1-2 دقيقة)
5. من Settings → Database:
   - انسخ **Connection string**
   - شكلها: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

6. من SQL Editor:
   - انسخ محتوى `backend/database.sql`
   - الصقه واضغط Run

### الخطوة 2: نشر Backend على Render

1. اذهب إلى https://render.com
2. سجّل حساب (مجاني)
3. اضغط **New +** → **Web Service**
4. Connect GitHub الخاص بك
5. ارفع كود Backend على GitHub:
   ```bash
   cd social-app
   git init
   git add .
   git commit -m "Initial commit"
   # ارفع على GitHub ثم اختره في Render
   ```

6. في Render:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Environment Variables:**
     ```
     PORT=5000
     DB_HOST=db.[PROJECT-REF].supabase.co
     DB_PORT=5432
     DB_NAME=postgres
     DB_USER=postgres
     DB_PASSWORD=[من Supabase]
     JWT_SECRET=ضع_نص_طويل_عشوائي
     ADMIN_PHONE=رقمك
     ```

7. اضغط **Create Web Service**
8. انتظر 5-10 دقائق
9. سيعطيك رابط مثل: `https://your-app.onrender.com`

### الخطوة 3: تحديث Frontend

افتح `frontend/src/services/api.js` وغيّر:
```javascript
const API_URL = 'https://your-app.onrender.com/api';
```

### الخطوة 4: بناء APK

```bash
cd social-app/frontend
npm install
eas build --platform android --profile preview
```

### الخطوة 5: مشاركة الـ APK

1. بعد انتهاء البناء، ستحصل على رابط تحميل
2. شارك الرابط مع أهلك
3. حمّلوه على هواتفهم
4. سجّلوا دخول وتكلموا! 🎉

---

## الخيار 2: تجربة سريعة بـ ngrok (مؤقت)

### ما هو ngrok؟
يحول localhost إلى رابط أونلاين مؤقت - مثالي للتجربة

### الخطوات:

#### 1. نصّب ngrok
```bash
# على Windows (باستخدام Chocolatey)
choco install ngrok

# أو حمل من https://ngrok.com/download
```

#### 2. شغّل Backend محلياً
```bash
cd social-app/backend
npm install
# عدّل .env أولاً
npm start
```

#### 3. شغّل ngrok
```bash
ngrok http 5000
```

ستحصل على رابط مثل: `https://abc123.ngrok.io`

#### 4. عدّل Frontend
```javascript
// frontend/src/services/api.js
const API_URL = 'https://abc123.ngrok.io/api';
```

#### 5. شغّل Frontend
```bash
cd social-app/frontend
npm install
npm start
```

#### 6. استخدم Expo Go
- حمّل Expo Go على هاتفك
- امسح QR Code
- جرب التطبيق

---

## نصائح مهمة

### للتجربة السريعة:
- ✅ استخدم ngrok (أسهل)
- ✅ شغّل Backend على جهازك
- ✅ استخدم Expo Go مباشرة (بدون APK)
- ❌ لا يصلح للاستخدام طويل الأمد

### للاستخدام الدائم:
- ✅ استخدم Render + Supabase
- ✅ ابني APK وشاركه
- ✅ يعمل 24/7 مجاناً
- ✅ أهلك يحملون التطبيق ويتكلمون

---

## المشاكل الشائعة

### المشكلة: "ngrok is not recognized"
**الحل:** أضف ngrok إلى PATH أو استخدم المسار الكامل

### المشكلة: Render يفشل في البناء
**الحل:**
- تأكد من package.json صحيح
- تأكد من Environment Variables
- تحقق من Logs في Render

### المشكلة: Supabase اتصال فاشل
**الحل:**
- تأكد من Connection string صحيح
- تأكد من تشغيل قاعدة البيانات
- تحقق من IP whitelist

### المشكلة: Socket.io لا يعمل
**الحل:**
- تأكد من أن Backend يشتغل
- تأكد من أن ngrok أو Render يعمل
- تحقق من CORS settings

---

## التكلفة

### Render:
- **مجاني:** 750 ساعة/شهر (كافي للتطوير)
- **مدفوع:** $7/شهر إذا احتجت أكثر

### Supabase:
- **مجاني:** 500MB database (كافي للبداية)
- **مدفوع:** يبدأ من $25/شهر

### Expo:
- **مجاني:** التطوير
- **مدفوع:** البناء المتكرر (لكن البناء الأول مجاني)

---

## الخلاصة

### أريد تجربة الآن (5 دقائق):
→ استخدم ngrok + Expo Go

### أريد نشر حقيقي (30 دقيقة):
→ استخدم Render + Supabase + APK

### أنا مستخدم جديد:
→ ابدأ بـ ngrok للتجربة
→ ثم انتقل لـ Render للنشر الحقيقي
