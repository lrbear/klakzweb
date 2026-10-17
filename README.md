# KLAKZWEB

KLAKZWEB, HTML + CSS + JavaScript ile hazırlanmış oyun kaynakları/topluluk arşivi başlangıç projesidir. Next.js, TypeScript, Tailwind CSS veya npm bağımlılığı kullanmaz.

## Özellikler
- İçerik arama (Ctrl+K / Cmd+K)
- Kategori filtreleri
- Açık/koyu tema ve tercihi tarayıcıda saklama
- Demo kayıt/giriş arayüzü
- İçerik ekleme formu
- Yönetim prototipi (F2 ile açılır)
- Mobil uyumlu arayüz
- GitHub ve Vercel için statik dosya yapısı

## Yerelde çalıştırma
`index.html` dosyasını tarayıcıda açabilirsin. Daha iyi bir yerel geliştirme deneyimi için VS Code'da Live Server gibi basit bir statik sunucu kullanabilirsin. Kurulum veya build komutu gerekmez.

## GitHub'a yükleme
1. ZIP'i aç.
2. Dosyaları kendi GitHub deponun kök dizinine yükle.
3. `index.html`, `styles.css`, `app.js`, `favicon.svg` ve `vercel.json` aynı kökte olmalı.

## Vercel'e dağıtım
1. Vercel hesabında **Add New → Project** seç.
2. GitHub deposunu içe aktar.
3. Framework preset olarak **Other** seçilebilir.
4. Build command ve output directory gerekmiyor; `index.html` kök dizindedir.
5. Deploy düğmesine bas.

`vercel.json` statik sitenin `index.html` dosyasını varsayılan sayfa olarak kullanmasını sağlar.

## Önemli: prototip ve gerçek servis ayrımı
Bu sürüm, arayüz ve tarayıcı içi etkileşim prototipidir. İçerikler, demo kullanıcıları ve tema tercihi `localStorage` içinde yalnızca mevcut tarayıcıda tutulur; cihazlar arasında paylaşılmaz. Demo şifreleri güvenli bir kimlik doğrulama sistemi değildir. Gerçek kullanıcı hesapları, sunucuya dosya yükleme, moderatör/admin yetkileri ve kalıcı ortak içerik için sunucu tarafı yetkilendirme ve bir backend (ör. Supabase/Firebase) bağlanmalıdır. Yönetim penceresi `F2` ile açılır; gerçek erişim kontrolü sağlamaz.

## Güvenlik notu
Herkese açık projede hassas bilgi veya API anahtarı koyma. İleride bir backend bağlarken yetkileri istemci koduna güvenerek verme.
