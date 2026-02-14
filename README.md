# 🧩 Yapboz Oyunu - Sevgililer Günü Hediyesi
### Hediyeyi unutan fukara biraderler için oluşturuldu.

### Birkaç token boşa harcanarak hazırlandı ,0 emek ,0 özenle hazırlandı.

###  Normalde jumpscare koyacaktım ama banlanmayı göze alamadım.
 

<p align="center">
  <img src="readme_img/hediye.png" alt="Sevgililer Günü Hediyesi Ekran Görüntüsü" width="600">
</p>

## ✨ Özellikler

- 🎯 **3 Zorluk Seviyesi**: 3x3 (Kolay), 4x4 (Orta), 5x5 (Zor)
- 🖼️ **Özel Resimler**: Kendi fotoğraflarınızı yükleyin veya hazır resimlerden seçin
- 🤖 **Otomatik Çözme AI**: A* algoritması yapbozu otomatik çözer
- 💡 **İpucu Sistemi**: Sıkıştığınızda ipucu alın
- ⏱️ **Zamanlayıcı & Hamle Sayacı**: Performansınızı takip edin
- 📱 **Mobil Optimize**: Dokunmatik dostu, titreşim desteği ile
- 🎉 **Kutlama Efektleri**: Tamamlandığında kalpler ve konfetiler
- 🌐 **Web & Android**: Hem tarayıcıda hem native Android uygulaması olarak çalışır

##  Hızlı Başlangıç

### Ön Gereksinimler

- Node.js v18+ ([İndir](https://nodejs.org/))
- Java 17 (Android build'leri için)

### Kurulum
```bash
# Depoyu klonla
git clone https://github.com/kullaniciadin/yapboz-oyunu.git
cd yapboz-oyunu

# Bağımlılıkları yükle
npm install
```

## 🌐 Web Kurulumu

### Geliştirme Sunucusu
```bash
# Development server'ı başlat
npm run dev

# Tarayıcıda http://localhost:5173 adresini aç
```

### Production Build
```bash
# Production için build yap
npm run build

# Production build'i önizle
npm run preview
```

### Web'e Deploy Et



**Seçenek 1: GitHub Pages**
```bash
npm install -D gh-pages

# package.json scripts'e ekle:
# "deploy": "npm run build && gh-pages -d dist"

npm run deploy
```

## 📱 Android Kurulumu

### Capacitor Kurulumu
```bash
# Capacitor bağımlılıklarını yükle
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/haptics

# Capacitor'ı başlat
npx cap init

# Soruları cevapla:
# ? App name: Yapboz Oyunu
# ? App Package ID: com.ismin.yapboz
# ? Web asset directory: dist

# Android platformunu ekle
npx cap add android
```

### Java Kurulumu (Android build'leri için gerekli)

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install openjdk-17-jdk
java -version
```

**macOS:**
```bash
brew install openjdk@17
echo 'export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

**Windows:**
[Adoptium](https://adoptium.net/temurin/releases/) adresinden indirin ve kurun.

### Debug APK Oluştur
```bash
# Web dosyalarını build et
npm run build

# Android ile senkronize et
npx cap sync android

# Android dizinine git
cd android

# Çalıştırma izni ver (Linux/macOS)
chmod +x gradlew

# APK oluştur
./gradlew assembleDebug

# Windows kullanıcıları:
# gradlew.bat assembleDebug

# APK konumu:
# android/app/build/outputs/apk/debug/app-debug.apk
```

### Release APK Oluştur (Google Play için)
```bash
# 1. Keystore oluştur
keytool -genkey -v -keystore my-release-key.keystore \
  -alias my-key-alias \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000

# 2. Keystore'u android/app/ klasörüne taşı
mv my-release-key.keystore android/app/

# 3. android/gradle.properties dosyasını düzenle ve ekle:
# MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
# MYAPP_RELEASE_KEY_ALIAS=my-key-alias
# MYAPP_RELEASE_STORE_PASSWORD=senin-store-şifren
# MYAPP_RELEASE_KEY_PASSWORD=senin-key-şifren

# 4. android/app/build.gradle dosyasını düzenle (dokümantasyona bak)

# 5. Release APK oluştur
npm run build
npx cap sync android
cd android
./gradlew assembleRelease
```

Release APK konumu: `android/app/build/outputs/apk/release/app-release.apk`

## 🎮 Nasıl Oynanır

1. **Zorluk Seç**: 3x3, 4x4 veya 5x5 ızgara arasından seç
2. **Resim Seç**: Hazır bir resim seç veya kendi fotoğrafını yükle
3. **Oynamaya Başla**: Boş alana komşu karelere dokunarak onları hareket ettir
4. **İpucu Kullan**: Sıkışırsan ipucu butonuna tıkla
5. **Otomatik Çöz**: AI'ın A* algoritması ile senin için çözmesine izin ver
6. **Kazan**: Yapbozu tamamla ve kutlamayı izle! 🎉

## 📦 Proje Yapısı
```
yapboz-oyunu/
├── index.html          # Ana HTML dosyası
├── style.css           # Stiller ve animasyonlar
├── main.js             # Oyun mantığı ve A* algoritması
├── package.json        # Bağımlılıklar ve scriptler
├── capacitor.config.json  # Capacitor yapılandırması
├── android/            # Android platform dosyaları
│   └── app/
│       └── build/
│           └── outputs/
│               └── apk/   # Oluşturulan APK dosyaları
└── dist/               # Production build çıktısı
```

## 🛠️ Kullanılabilir Komutlar
```bash
npm run dev              # Geliştirme sunucusunu başlat
npm run build            # Production için build yap
npm run preview          # Production build'i önizle
npm run build:android    # Android debug APK oluştur
```

## 🎨 Özelleştirme

### Uygulama Adını Değiştir

`android/app/src/main/res/values/strings.xml` dosyasını düzenle:
```xml
<string name="app_name">Senin Uygulama Adın</string>
```

### Paket ID'sini Değiştir

`capacitor.config.json` dosyasını düzenle:
```json
{
  "appId": "com.ismin.uygulamadin",
  "appName": "uygulama-adin"
}
```

Sonra çalıştır: `npx cap sync android`

### Özel İkon Ekle

1. 512x512 PNG ikon oluştur
2. Android ikonları oluşturmak için [Icon Kitchen](https://icon.kitchen/) kullan
3. İkonları `android/app/src/main/res/mipmap-*` klasörlerinde değiştir

## 🐛 Sorun Giderme

### "Java not found" hatası
```bash
# Java 17 kur (Android Kurulumu bölümüne bak)
java -version
```

### Build başarısız oluyor
```bash
cd android
./gradlew clean
./gradlew assembleDebug --stacktrace
```

### APK telefona yüklenmiyor
- Android ayarlarından "Bilinmeyen Kaynaklar"ı etkinleştir
- APK'nın imzalı olduğunu kontrol et (release build'ler için)

### Modül bulunamadı hatası
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📊 Performans

**Web Paket Boyutları (gzipped):**
- HTML: ~1.4 KB
- CSS: ~2 KB
- JavaScript: ~7 KB
- **Toplam: ~10 KB** ⚡

**Android APK Boyutları:**
- Debug: ~3-5 MB
- Release (minified): ~2-3 MB

## 🤝 Katkıda Bulunma

Katkılar memnuniyetle karşılanır! Şunları yapabilirsiniz:
- Hata bildirin
- Yeni özellikler önerin
- Pull request gönderin

## 📄 Lisans

MIT License - bunu kendi Sevgililer Günü hediyeleriniz için özgürce kullanın! 💝

## 💝 Hakkında

Sevgililer Günü için ❤️ ve birkaç harcanmış kuruş ile yapıldı.

Çünkü bazen en iyi hediyeler kendinizin yaptığı şeylerdir - tembel ve anlamsız olsalar bile! 😄

---

**Mutlu Sevgililer Günü! 🌹**

*Not: Eğer sevgilin bunu takdir etmezse, belki etmesini bileni bulmalısın? Şaka yapıyorum... ya da yapmıyor muyum? 😅*

## 🎁 Bonus İpuçları

### Sevgiline Özel Yapboz Oluşturma

1. Birlikte çekilmiş en sevdiğiniz fotoğrafı seç
2. Oyunda "Kendi Resmini Yükle" butonuna tıkla
3. Fotoğrafı seç ve 5x5 (zor) modunda oyna
4. Tamamladığınızda çıkan kalpler ve konfetilerin tadını çıkar! 💕



