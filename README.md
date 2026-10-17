# KLAKZWEB — HTML / CSS / JavaScript

## Çalıştırma
- `index.html` dosyasını tarayıcıda açabilir veya klasörü GitHub deposuna yükleyip Vercel'de statik site olarak dağıtabilirsin.
- Build komutu gerekmez. Framework, TypeScript veya Tailwind kullanılmıyor.

## Çalışan demo özellikleri
- Arama, kategori filtreleri ve favori filtresi
- Karanlık/açık tema, mobil menü ve animasyonlar
- Yerel demo kayıt/giriş, kullanıcı profili ve rozet
- İçerik paylaşma, kod editörü ve kod kopyalama
- Yorum ve 1–5 puanlama
- Bildirimler ve yerel istatistikler
- Yönetim panelinde demo içerik kaldırma

## Önemli sınırlama
Bu klasör tek başına gerçek çok kullanıcılı veritabanı veya güvenli kimlik doğrulama sağlayamaz. Demo verileri aynı tarayıcının `localStorage` alanında tutulur; farklı cihazlara eşitlenmez. Demo girişinde parolalar gerçek üretim güvenliğinde saklanmaz. Bu sürümü gerçek kullanıcı hesapları için tek başına kullanma.

## Gerçek veritabanına geçiş hazırlığı
`schema.sql`, Supabase için başlangıç tabloları ve Row Level Security (RLS) politikalarını içerir. Supabase projesi oluşturup SQL'i gözden geçirerek çalıştırmalı, Auth e-posta girişini etkinleştirmeli ve `supabase-config.js` dosyasına yalnızca proje URL'si ile public anon/publishable anahtarını koymalısın. Service-role anahtarını asla tarayıcıya koyma.

Not: Bu sürümün arayüz işlevleri yerel demo olarak çalışır; Supabase bağlantısı bu pakette henüz canlı veritabanı işlemlerine bağlanmış değildir. Gerçek veritabanı entegrasyonu ayrı bir adım gerektirir. Yönetim yetkisi mutlaka veritabanı RLS veya güvenilir sunucu tarafında doğrulanmalıdır.
