# Kullanılan Teknolojiler ve Mimariler
Frontend: React.js, React Router, Axios

Backend: Node.js, Express.js, Mongoose

Database: MongoDB (cloud-based, schema-driven)

Auth: JWT tabanlı authentication & authorization

File Upload: Multer ile kapak görseli yönetimi

Security: Helmet, CORS, dotenv, input validation

Geliştirme Ortamı: Git, VSCode, REST Client / Postman

# Teknik Özellikler ve Fonksiyonlar
Post Yönetimi
Yeni blog yazısı oluşturma (başlık, içerik, görsel, tag, isDraft)

Yazı güncelleme ve silme

Slugify edilen URL yapısı (/blog/psikolojik-dayaniklilik gibi)

Title değişiminde slug otomatik güncellenir

Etiketleme & Filtreleme
Her yazıya çoklu tag eklenebilir

/api/posts?tags=anksiyete gibi query ile filtrelenebilir

Başlık veya içerik üzerinden keyword bazlı arama desteği ($regex ile)

# Arama Sistemi
slug, title, tags, content üzerinde MongoDB text search

URL bazlı dinamik routing ile detay sayfası

# Etkileşim Modülleri
Yorum ekleme, silme, yorum sahibi kontrolü

Yazılara beğeni (like) bırakabilme, kullanıcı bazlı engelleme desteği (opsiyonel)

Admin yorumları silebilir / kullanıcılar kendi yorumlarını silebilir

# Rol & Güvenlik Kontrolü
Sadece author veya isAdmin: true olan kullanıcı güncelleme/silme yapabilir

Her kullanıcı sadece kendi içeriğini yönetebilir (JWT + Mongoose ID match)

Giriş yapmamış kullanıcılar sadece içerikleri görüntüleyebilir

# Genişletme Olanakları (Future Scope)
Admin panel (React veya Next.js tabanlı)

Blog istatistikleri (görüntülenme sayısı, yorum sayısı)

E-posta abonelik sistemi (Mailchimp entegrasyonu)

Markdown desteği ve zengin metin editörü entegrasyonu (Quill.js, Tiptap)

Planlı yazı yayınlama (future publish date)

# Proje Amacı
Bu proje, gerçek bir danışmanlık hizmeti yürüten psikoloğun içerik üretim ve paylaşım sürecini dijitalleştirmek ve aynı zamanda yazılımcı olarak RESTful API tasarımı, frontend/backend entegrasyonu, güvenli kullanıcı etkileşimi gibi alanlarda yetkinliğimi artırmak için geliştirilmiştir.

