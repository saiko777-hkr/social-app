# 🚀 استخدام ngrok لجعل التطبيق أونلاين

## خطوات بسيطة جداً:

### 1. حمل ngrok
اذهب إلى: https://ngrok.com/download
حمّل نسخة Windows (ZIP)
فك الضغط في مكان سهل (مثل Desktop)

### 2. شغّل ngrok
افتح Terminal واكتب:
```bash
cd C:\Users\yassi\Desktop\ngrok
ngrok http 5000
```

سيظهر رابط مثل: `https://abc123.ngrok.io`

### 3. عدّل API URL
افتح ملف: `frontend/src/services/api.js`
غيّر السطر الأول إلى:
```javascript
const API_URL = 'https://abc123.ngrok.io/api'; // استبدل برابط ngrok
```

### 4. أعد بناء APK
في Terminal جديد:
```bash
cd C:\Users\yassi\Desktop\socialapp\frontend
set EAS_NO_VCS=1
eas build --platform android --profile preview
```

### 5. حمّل APK ومشاركته
- انتظر 30 دقيقة
- حمّل APK من الرابط
- شاركه مع أهلك
- **سيعمل من أي هاتف!**

---

## ⚠️ ملاحظة مهمة:

رابط ngrok يتغير كل مرة توقف فيها ngrok وتشغّلها مرة أخرى.
لكن هذه الطريقة سريعة للتجربة الآن.

---

## 💡 للحل الدائم:

لو أردت حل دائم بدون تغيير الرابط:
- استخدم Render (يتطلب git و GitHub)
- أو استخدم ngrok مدفوع (رابط ثابت)
