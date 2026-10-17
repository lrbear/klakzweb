# KLAKZWEB Pro — HTML / CSS / JavaScript

Çok sayfalı, mobil uyumlu, mor/neon oyun topluluğu arayüzü. Kaynak kartları, oyun kataloğu, gelişmiş arama, favoriler, kod görüntüleyici/kopyalama, kullanıcı profili, yorum/puan, rozetler ve moderasyon paneli içerir.

## Önemli: sahte içerik yok

Projede örnek kaynak veya sahte kullanıcı oluşturulmaz. Veritabanı boşsa site açıkça boş durum gösterir. Gerçek paylaşımların diğer ziyaretçilere görünmesi için Supabase projesi bağlanmalıdır.

## Kurulum

1. `https://supabase.com` üzerinde bir proje oluştur.
2. Supabase → SQL Editor kısmında `schema.sql` dosyasının tamamını çalıştır.
3. Supabase → Project Settings → API bölümünden Project URL ve **publishable/anon** public key değerlerini al.
4. `supabase-config.js` dosyasındaki `YOUR-PROJECT` ve `YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY` değerlerini kendi değerlerinle değiştir. `service_role` anahtarını ASLA kullanma.
5. Supabase Auth → URL Configuration bölümünde yerel ve canlı site adreslerini Site URL / Redirect URLs listesine ekle. E-posta onayı ayarlarını kontrol et.
6. Dosyaları GitHub deposuna yükle ve Vercel'de o depoyu deploy et. Framework preset: **Other**; build command boş, output directory `.`.
7. Siteye kayıt ol. `handle_new_user` tetikleyicisi profilini oluşturur.
8. Yönetici olmak için `auth.users` tablosunda kendi kullanıcı UUID'ni bul ve SQL Editor'da şu komutu kendi UUID'nle çalıştır:

```sql
insert into public.user_roles(user_id, role) values ('YOUR-AUTH-USER-UUID', 'admin');
```

## Sayfalar

- `index.html` — Ana sayfa ve gerçek son yayınlar
- `explore.html` — Arama, oyun/tür filtresi ve sıralama
- `games.html` — Onaylı yayınlardan dinamik oyun kataloğu
- `upload.html` — Kaynak yükleme ve moderasyon kuyruğu
- `resource.html?id=...` — Kaynak detay, kod kopyalama, yorum ve puan
- `auth.html` — Supabase Auth ile giriş ve hesap oluşturma
- `profile.html` — Profil düzenleme, katkılar ve favoriler
- `admin.html` — Veritabanı rolüyle korunan moderasyon paneli

## Güvenlik notları

- Tarayıcıya yalnızca Supabase public/publishable/anon key konur. `service_role` anahtarı gizli kalmalıdır.
- RLS politikaları veritabanında uygulanır. Yönetici rolü yalnızca SQL Editor gibi güvenilir bir yerden atanmalıdır.
- Kullanıcı gönderileri varsayılan olarak `approved=false`; moderator onaylamadan kamuya açık listede gösterilmez.
- İçerik bağlantılarını açmadan önce güvenilirliğini kontrol edin. Bilinmeyen kodu çalıştırmayın.
- Bu ZIP'in içinde canlı Supabase projesi/anahtarları bulunmaz; gerçek veritabanı kullanıcı tarafından yapılandırılmalıdır.

## Kontrol

Statik HTML sayfaları için ek derleme veya npm paketi gerekmez. Supabase JS kütüphanesi CDN üzerinden yüklenir; çevrimdışı kullanım için uygun değildir. İlk kullanımda tarayıcı geliştirici konsolunu ve Supabase Logs ekranını kontrol edin.
