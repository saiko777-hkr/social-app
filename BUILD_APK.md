# 📦 بناء APK - SocialConnect

## 🔧 المتطلبات

قبل البناء، تأكد من تثبيت:
1. **Node.js** (من nodejs.org)
2. **Expo CLI**: `npm install -g expo-cli`
3. **EAS CLI**: `npm install -g eas-cli`
4. حساب على **Expo** (https://expo.dev)

---

## 🚀 خطوات البناء

### 1. تسجيل الدخول إلى Expo
```bash
eas login
```
أدخل email و password

### 2. إعداد المشروع
```bash
cd C:\Users\yassi\Desktop\socialapp\frontend
eas build:configure
```

### 3. بناء APK
```bash
eas build --platform android --profile preview
```

### 4. انتظار البناء
- سيأخذ من **15-30 دقيقة**
- سيعطيك رابط لتحميل الـ APK
- اسم الملف: `base.apk` أو مشابه

### 5. تحميل ومشاركة
- حمّل الـ APK من الرابط
- أرسله عبر WhatsApp أو أي وسيلة
- ثبّته على الهاتف

---

## ⚡ البناء المتكرر

لبناء APK جديد بعد أي تغييرات:
```bash
eas build --platform android --profile preview
```

---

## 🌐 لجعل التطبيق أونلاين

بعد نشر Backend على سيرفر (Render, DigitalOcean, إلخ):

1. عدّل `frontend/src/services/api.js`:
```javascript
const API_URL = 'https://your-server-url.com/api';
```

2. أعد بناء APK:
```bash
eas build --platform android --profile production
```

---

## 💡 ملاحظات

- البناء الأول قد يأخذ وقتاً أطول
- يمكنك مراقبة البناء على: https://expo.dev
- الـ APK يعمل على أي Android device
- لـ iOS تحتاج Mac و Xcode

---

## 🆘 مشاكل شائعة

### "EAS project not configured"
```bash
eas build:configure
```

### "Login failed"
```bash
eas logout
eas login
```

### "Build failed"
- تحقق من logs على https://expo.dev
- تأكد من أن جميع dependencies مثبتة
- جرب `eas build --platform android --profile production`

---

## 📱 بعد البناء

1. حمّل الـ APK
2. شاركه مع أهلك
3. هم يحملونه على هواتفهم
4. يستخدمون التطبيق! 🎉
