import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { X, BookOpen, Calendar, MapPin, Tag, Clock, ArrowRight, CheckCircle2, CheckCircle, Share2, Clipboard, User } from 'lucide-react';
import { getBlogPosts, getEvents, registerEvent } from '../api';

interface BlogEventsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'blog' | 'events';
}

export interface BlogPost {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  readTime: string;
  date: string;
  author: string;
  imageUrl: string;
  content: string;
  tags: string[];
}

export interface LongevityEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  city: string;
  description: string;
  spotsLeft: number;
  tags: string[];
  imageUrl: string;
}

const MOCK_POSTS_EN: BlogPost[] = [
  {
    id: 'b1',
    title: 'Unlocking Cellular Longevity in the Mineral Pools of Bursa',
    subtitle: 'Ancient Roman Thermals meets Modern Hydrotherapy Research on Heat Shock Proteins.',
    category: 'Thermals & Spa',
    readTime: '6 min read',
    date: 'June 02, 2026',
    author: 'Dr. Ahmet Yılmaz, Cellular Epigeneticist',
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    content: `For over two millennia, the warm sulfurous waters of Bursa have been coveted for restorative rejuvenation. Modern epigenetic research is finally unlocking why. Thermal springs in the Bursa region contain precise concentrations of dissolved sulfur, lithium, calcium bicarbonate, and silicic acid.

When submerged in warm thermal waters (38°C to 40°C), the body activates Heat Shock Protein 70 (HSP70). This chaperone protein is a vital cell protector; it assists in the correct folding of newly formed cellular enzymes and targets dysfunctional, senescent proteins for autophagy and disposal. 

Additionally, trace sulfur absorption supports mitochondrial antioxidant pathways via glutathione upregulation, helping counter system-wide oxidative stress. Integrating Bursa thermal hydrotherapy into quarterly wellness cycles mirrors modern stress-induction techniques designed to slow down biological aging.`,
    tags: ['Hydrotherapy', 'Heat Shock Proteins', 'Minerals', 'Bursa']
  },
  {
    id: 'b2',
    title: 'The Phenolic Profile of Aegean Wild Olives',
    subtitle: 'Why cold-pressed oils from Mount Ida (Kaz Dağları) activate Sirtuins.',
    category: 'Aegean Diet',
    readTime: '8 min read',
    date: 'May 28, 2026',
    author: 'Elinor Vane, Nutritional Longevity Analyst',
    imageUrl: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=800&q=80',
    content: `The Mediterranean diet has long been associated with lower cardiovascular age. However, not all olive oil is created equal. Our laboratory assays of wild olive varietals nestled in the microclimate of Mt. Ida, Turkey, reveal extraordinary densities of oleocanthal, oleuropein, and hydroxytyrosol. More than 700 mg/kg of total polyphenols are measured.

Highly bioavailable polyphenols trigger AMPK and SIRT1 pathways—the same sirtuin enzymes unlocked during caloric restriction or intermittent fasting. SIRT1 coordinates DNA repair, deacetylates histones, and triggers mitochondrial biogenesis. 

To maximize these compound concentrations for daily biological support, functional doctors recommend consuming cold-pressed wild olive oils harvested in the early green phase (September), completely uncooked, to retain fragile raw phenolic compounds.`,
    tags: ['Polyphenols', 'Aegean Diet', 'Sirtuin Activation', 'Mt. Ida']
  },
  {
    id: 'b3',
    title: 'Roman Thermal Baths, Contrast Therapy & Microvascular Autophagy',
    subtitle: 'The cardiovascular simulation hidden in Turkish Bath culture (Hammam).',
    category: 'Traditional Hammams',
    readTime: '5 min read',
    date: 'May 15, 2026',
    author: 'Dr. Selen Boz, Cardiovascular Physiologist',
    imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80',
    content: `The traditional Ottoman hammam consists of warm relaxation stones, deep steam scaling, and structural cold marble contrast flushes. This alternating thermal stress mimics intense aerobic interval workouts.

When you transition from the intense steam ambient heating (45°C) to active lymphatic scrubbing and cooling marble plunges, your microvascular system experiences profound vasodilation followed by rapid vasoconstriction. This "vascular pumping" flushes extracellular metabolic debris, stimulates lymph drainage, and induces localized cellular clearing. 

Furthermore, clinical trials demonstrate that 20 minutes of thermal sauna exposure twice a week results in significant resting heart rate optimization and endothelial elasticity expansion over a 12-week horizon.`,
    tags: ['Contrast Therapy', 'Turkish Hammam', 'Mitochondria', 'Vascular Health']
  },
  {
    id: 'b4',
    title: 'Circadian Reset Along the Lycian Coast',
    subtitle: 'Morning light, marine aerosols, and meal timing as a practical metabolic protocol.',
    category: 'Circadian Biology',
    readTime: '9 min read',
    date: 'June 06, 2026',
    author: 'Dr. Mira Collins, Chronobiology Researcher',
    imageUrl: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=900&q=85',
    content: `Circadian biology is not a wellness aesthetic; it is the timing architecture that coordinates cortisol, melatonin, insulin sensitivity, immune signaling, and mitochondrial substrate selection. The Lycian coast offers a useful natural laboratory because dawn light exposure, sea-level oxygen density, walking terrain, and evening darkness can be sequenced without artificial intervention.

The strongest protocol begins with outdoor light within 30 minutes of waking. Blue-enriched morning light suppresses residual melatonin, anchors the suprachiasmatic nucleus, and improves peripheral clock synchronization in the liver and skeletal muscle. When paired with a protein-forward breakfast and a 12-hour eating window, the intervention supports better post-prandial glucose handling.

Marine aerosols are less studied than light exposure, but coastal walks may improve respiratory comfort through humidity, salt particles, and lower particulate pollution compared with dense urban corridors. The effect should be framed conservatively: useful as environmental support, not as treatment.

The practical route model is simple: dawn walk, mineral breakfast, shaded midday recovery, early dinner, and low-light evening rituals. This makes the destination itself part of the biological intervention rather than a backdrop for generic travel.`,
    tags: ['Circadian Rhythm', 'Light Exposure', 'Metabolism', 'Lycian Coast']
  },
  {
    id: 'b5',
    title: 'Fermented Anatolian Foods and the Gut-Immune Axis',
    subtitle: 'What tarhana, kefir, pickles, and yogurt can teach us about microbial resilience.',
    category: 'Microbiome',
    readTime: '10 min read',
    date: 'June 04, 2026',
    author: 'Prof. Leyla Arslan, Nutritional Immunology',
    imageUrl: 'https://images.unsplash.com/photo-1606914501449-5a96b6ce24ca?auto=format&fit=crop&w=900&q=85',
    content: `The gut-immune axis is one of the most credible bridges between traditional food culture and modern longevity research. Fermented Anatolian foods are valuable because they combine microbial exposure, plant fiber, organic acids, peptides, and culinary regularity. The goal is not to romanticize fermentation, but to understand how repeated dietary signals may support immune tolerance.

Yogurt and kefir provide lactic acid bacteria that can transiently influence microbial ecology and epithelial barrier function. Tarhana, a fermented grain-yogurt matrix, adds cereal-derived fibers and fermentation metabolites. Vegetable pickles contribute acidic preservation and polyphenol-containing plant substrates, though sodium load must be considered.

Mechanistically, microbial metabolites such as short-chain fatty acids interact with regulatory T-cell signaling, intestinal mucus production, and inflammatory tone. These pathways matter for healthy aging because chronic low-grade inflammation is a recurring feature of cardiometabolic and neurodegenerative risk.

A good longevity route should therefore evaluate fermented foods by preparation quality, diversity, salt content, and how they are paired with legumes, greens, olive oil, and movement. The strongest intervention is a pattern, not a single superfood.`,
    tags: ['Microbiome', 'Fermentation', 'Immune Health', 'Anatolian Diet']
  },
  {
    id: 'b6',
    title: 'Mountain Retreats, Hypoxia, and Mitochondrial Flexibility',
    subtitle: 'A cautious look at altitude walks, cold nights, and metabolic adaptation.',
    category: 'Retreat & Nature',
    readTime: '8 min read',
    date: 'June 01, 2026',
    author: 'Dr. Emre Kaya, Exercise Metabolism Lab',
    imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=85',
    content: `Mountain retreats are often described with vague language, but their strongest biological argument is measurable: walking load, mild altitude exposure, cooler sleep temperature, and reduced evening light. Together, these inputs can influence mitochondrial flexibility, glucose disposal, and autonomic balance.

Mild hypoxic exposure increases ventilatory demand and may activate hypoxia-inducible factor pathways. In trained and medically screened adults, this can support erythropoietic signaling and mitochondrial enzyme adaptation. The effect is dose-dependent; more altitude is not automatically better, and cardiovascular screening matters.

Cold night air may improve sleep onset for some visitors by supporting the natural decline in core body temperature. Meanwhile, long low-intensity hikes increase fatty-acid oxidation and create a metabolic state distinct from high-intensity gym training.

The practical implication for Turkish retreat design is clear: build routes around progressive walking, quiet evenings, mineral-rich meals, and recovery blocks. Nature becomes a structured protocol when exposure, duration, and rest are intentionally designed.`,
    tags: ['Mitochondria', 'Altitude', 'Metabolic Flexibility', 'Retreats']
  },
  {
    id: 'b7',
    title: 'Pomegranate, Grape, and Fig Polyphenols in Cellular Defense',
    subtitle: 'From agricultural heritage to NRF2 signaling and vascular protection.',
    category: 'Local Producers',
    readTime: '11 min read',
    date: 'May 30, 2026',
    author: 'Dr. Nora Stein, Plant Bioactives Research Unit',
    imageUrl: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&w=900&q=85',
    content: `Türkiye's fruit heritage is unusually relevant to longevity science because pomegranate, grape, and fig cultivation intersects with polyphenol density, vascular biology, and traditional seasonal eating. The important question is not whether these foods are healthy in a general sense, but how processing and dose change their biological signal.

Pomegranate ellagitannins can be metabolized by gut microbes into urolithins, compounds associated in early research with mitochondrial quality-control pathways. Grape skins contain resveratrol and related stilbenes, though realistic dietary concentrations are modest. Figs add fiber, minerals, and phenolics, but also meaningful natural sugar.

NRF2 signaling is a central defense pathway activated by mild phytochemical stress. When activated appropriately, it upregulates endogenous antioxidant enzymes rather than simply adding external antioxidants. This distinction matters: the body adapts to signals.

The best producer route would prioritize whole fruit, low-sugar reductions, transparent harvest timing, and lab-tested polyphenol profiles. Local agriculture becomes a longevity asset when terroir is paired with evidence and restraint.`,
    tags: ['Polyphenols', 'NRF2', 'Producer Routes', 'Vascular Health']
  },
  {
    id: 'b8',
    title: 'Clinical Longevity Screening Without the Hype',
    subtitle: 'Which biomarkers belong in a responsible wellness route, and which do not.',
    category: 'Longevity Clinics',
    readTime: '12 min read',
    date: 'May 24, 2026',
    author: 'Dr. Selin Hart, Preventive Medicine Advisor',
    imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=900&q=85',
    content: `Longevity clinics are most useful when they separate risk stratification from spectacle. A responsible screening pathway should begin with validated markers: blood pressure, waist-to-height ratio, lipid fractions, ApoB where available, HbA1c, fasting glucose, inflammatory markers interpreted carefully, renal and liver function, and sleep quality.

Advanced testing can be useful, but only when it changes decisions. Epigenetic clocks, continuous glucose monitors, VO2 max testing, DEXA scans, and coronary calcium scoring have different evidence levels and should not be sold as equivalent. Clinical context matters more than novelty.

The ethical model is a stepped pathway: baseline risk, physician review, nutrition and exercise prescription, sleep intervention, then targeted advanced testing. Any supplement or treatment plan should document intended mechanism, expected benefit, contraindications, and re-measurement intervals.

For Route Longevity, the goal is not to make every traveler a patient. It is to help users identify partners who communicate evidence clearly, respect medical boundaries, and connect heritage practices with modern prevention responsibly.`,
    tags: ['Biomarkers', 'Preventive Medicine', 'Clinical Ethics', 'Screening']
  }
];

const MOCK_POSTS_TR: BlogPost[] = [
  {
    id: 'b1',
    title: 'Bursa Mineral Havuzlarında Hücresel Uzun Ömrün Kilidini Açmak',
    subtitle: 'Antik Roma Termalleri, Sıcak Şoku Proteinleri Üzerine Modern Hidroterapi Araştırmalarıyla Buluşuyor.',
    category: 'Termal & Kaplıcalar',
    readTime: '6 dk okuma',
    date: '02 Haziran 2026',
    author: 'Dr. Ahmet Yılmaz, Hücresel Epigenetik Uzmanı',
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    content: `Bursa’nın şifalı sıcak suları, iki bin yılı aşkın süredir fiziksel yenilenme ve gençleşme için tercih edilmektedir. Modern epigenetik araştırmalar nihayet bunun nedenini hücresel boyutta açıklıyor. Bursa havzasındaki termal kaynaklar; çözünmüş kükürt, lityum, kalsiyum bikarbonat ve silisik asit mineral bileşenlerine sahiptir.

Vücut 38°C ila 40°C sıcaklıktaki termal sulara girdiğinde, "Isı Şoku Proteini 70" (HSP70) aktif hale gelir. Bu koruyucu protein, yeni sentezlenen hücresel enzimlerin katlanmasına yardımcı olur ve işlevi bozulmuş yaşlı proteinleri otofaji yoluyla tasfiye eder.

Ayrıca deri yoluyla emilen eser sülfür elementleri, hücre içi antioksidan yollarını uyararak oksidatif stres hasarlarını nötralize eder. Bursa termal banyolarını düzenli periyotlara dahil etmek, biyolojik yaşlanmayı yavaşlatmak için tasarlanmış modern hormetik stres yöntemleri arasındadır.`,
    tags: ['Hidroterapi', 'Isı Şoku Proteinleri', 'Mineraller', 'Bursa']
  },
  {
    id: 'b2',
    title: 'Ege Yabani Zeytinlerinin Polifenol Profili',
    subtitle: 'Kaz Dağları’ndaki soğuk sıkım zeytinyağları neden Sirtüin gençlik genlerini tetikler?',
    category: 'Ege Diyeti',
    readTime: '8 dk okuma',
    date: '28 Mayıs 2026',
    author: 'Elinor Vane, Beslenme ve Uzun Ömür Analisti',
    imageUrl: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=800&q=80',
    content: `Ege ve Akdeniz beslenme modelleri, düşük kardiyovasküler yaş ile doğrudan ilişkilidir. Ancak her zeytinyağı aynı biyolojik etkiyi göstermez. Kaz Dağları mikroklimalarında yetişen yabani zeytinlerin laboratuvar analizleri; oleokantal, oleuropein ve hidroksityrosol bileşiklerinin olağanüstü yoğunlukta olduğunu göstermiştir (700 mg/kg üzeri polifenol).

Yüksek oranda biyoaktif polifenoller, kalori kısıtlaması veya aralıklı oruç esnasında açığa çıkan "AMPK" ve "SIRT1" sirtüin enzim yollarını doğrudan uyarır. SIRT1 enzimi; DNA onarımını koordine eder ve mitokondriyal biyojenezi tetikler.

Bu şifalı moleküllerden en üst seviyede yararlanmak adına uzmanlar, erken hasat yeşil zeytinlerin soğuk sıkım yağlarını ısı uygulamadan ham haliyle tüketmeyi önermektedir.`,
    tags: ['Polifenoller', 'Ege Diyeti', 'Sirtüin Aktivasyonu', 'Kaz Dağları']
  },
  {
    id: 'b3',
    title: 'Roma Termal Banyoları, Kontrast Terapi ve Mikrovasküler Otofaji',
    subtitle: 'Geleneksel Türk Hamamı kültürünün kalbinde saklı kardiyovasküler simülasyon.',
    category: 'Geleneksel Hamamlar',
    readTime: '5 dk okuma',
    date: '15 Mayıs 2026',
    author: 'Dr. Selen Boz, Kardiyovasküler Fizyolog',
    imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=85',
    content: `Kurnalı Osmanlı hamam yapısı, sıcak göbek taşları, kese buharı ve kubbeden süzülen soğuk su şoklarını barındırır. Bu döngüsel termal stres, yoğun kardiyo antrenmanlarının faydalarını taklit eder.

Sıcak sauna ortamından (45°C) lifli keselenme aşamasına ve mermer kurnalarda soğuk su kontrastına geçildiğinde, kılcal damar yatağı önce genişler, ardından hızla daralır. Bu "vasküler pompalama" etkisi, hücre dışı metabolik artıkları temizler ve lenfatik drenajı uyarır.

Klinik deneyler, haftada iki kez uygulanan 20 dakikalık termal kontrast banyosunun, 12 haftalık bir süreçte dinlenme nabzını optimize ettiğini ve damar esnekliğini artırdığını göstermektedir.`,
    tags: ['Kontrast Terapi', 'Türk Hamamı', 'Mitokondri', 'Damar Sağlığı']
  },
  {
    id: 'b4',
    title: 'Likya Kıyılarında Sirkadiyen Ritim Sıfırlama',
    subtitle: 'Sabah ışığı, deniz aerosolleri ve öğün zamanlamasıyla metabolik düzen.',
    category: 'Sirkadiyen Biyoloji',
    readTime: '9 dk okuma',
    date: '06 Haziran 2026',
    author: 'Dr. Mira Collins, Kronobiyoloji Araştırmacısı',
    imageUrl: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=900&q=85',
    content: `Sirkadiyen biyoloji; kortizol, melatonin, insülin duyarlılığı, bağışıklık sinyalleri ve mitokondriyal yakıt seçimini koordine eden zamanlama sistemidir. Likya kıyıları, sabah ışığı, deniz seviyesinde oksijen, yürüyüş topografyası ve akşam karanlığıyla doğal bir protokol alanı sunar.

En güçlü uygulama, uyanıştan sonraki ilk 30 dakika içinde açık hava ışığı almaktır. Sabah ışığı, melatonin kalıntısını baskılar ve karaciğer ile kas dokusundaki periferik saatlerin senkronizasyonuna katkı sağlar.

Deniz aerosolleri ışık kadar güçlü kanıta sahip değildir; buna rağmen nem, tuz parçacıkları ve düşük partikül kirliliği solunum konforunu destekleyebilir. Bu bir tedavi değil, çevresel destek olarak değerlendirilmelidir.

Pratik rota modeli nettir: gün doğumu yürüyüşü, mineralli kahvaltı, gölgede toparlanma, erken akşam yemeği ve düşük ışıklı gece ritüeli.`,
    tags: ['Sirkadiyen Ritim', 'Işık', 'Metabolizma', 'Likya']
  },
  {
    id: 'b5',
    title: 'Fermente Anadolu Gıdaları ve Bağırsak-Bağışıklık Ekseni',
    subtitle: 'Tarhana, kefir, turşu ve yoğurt mikrobiyal dayanıklılık hakkında ne söylüyor?',
    category: 'Mikrobiyom',
    readTime: '10 dk okuma',
    date: '04 Haziran 2026',
    author: 'Prof. Leyla Arslan, Beslenme İmmünolojisi',
    imageUrl: 'https://images.unsplash.com/photo-1606914501449-5a96b6ce24ca?auto=format&fit=crop&w=900&q=85',
    content: `Bağırsak-bağışıklık ekseni, geleneksel yemek kültürü ile modern uzun ömür araştırmaları arasındaki en güçlü köprülerden biridir. Fermente Anadolu gıdaları; mikrobiyal temas, bitkisel lif, organik asit, peptit ve düzenli tüketim örüntüsünü birlikte taşır.

Yoğurt ve kefir, bağırsak bariyeri fonksiyonunu geçici olarak etkileyebilen laktik asit bakterileri sağlar. Tarhana, fermente tahıl-yoğurt matrisiyle lif ve metabolit çeşitliliği sunar. Turşular bitkisel polifenol taşır; ancak tuz yükü dikkate alınmalıdır.

Kısa zincirli yağ asitleri gibi mikrobiyal metabolitler, düzenleyici T hücreleri ve inflamatuvar ton üzerinde rol oynar. Sağlıklı yaşlanmada kronik düşük düzey inflamasyonun azaltılması bu nedenle önemlidir.

En güçlü yaklaşım tek bir süper gıda değil; çeşitlilik, düşük tuz, kaliteli üretim ve zeytinyağı, baklagil, yeşillik ve hareketle kurulan düzendir.`,
    tags: ['Mikrobiyom', 'Fermentasyon', 'Bağışıklık', 'Anadolu Diyeti']
  },
  {
    id: 'b6',
    title: 'Dağ İnzivaları, Hipoksi ve Mitokondriyal Esneklik',
    subtitle: 'Rakım yürüyüşleri, serin geceler ve metabolik adaptasyona temkinli bakış.',
    category: 'İnziva ve Doğa',
    readTime: '8 dk okuma',
    date: '01 Haziran 2026',
    author: 'Dr. Emre Kaya, Egzersiz Metabolizması Laboratuvarı',
    imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=85',
    content: `Dağ inzivalarının en güçlü biyolojik argümanı ölçülebilirdir: yürüyüş yükü, hafif rakım maruziyeti, serin uyku ortamı ve düşük akşam ışığı. Bu girdiler mitokondriyal esneklik, glukoz kullanımı ve otonom denge üzerinde etkili olabilir.

Hafif hipoksi ventilasyon ihtiyacını artırır ve hipoksi ile ilişkili adaptasyon yollarını uyarabilir. Ancak etki doz bağımlıdır; daha yüksek rakım her zaman daha iyi değildir ve kardiyovasküler tarama önemlidir.

Serin gece havası, çekirdek vücut sıcaklığının doğal düşüşünü destekleyerek uykuya geçişi kolaylaştırabilir. Uzun ve düşük yoğunluklu yürüyüşler ise yağ asidi oksidasyonunu artırır.

Doğa, maruziyet süresi, dinlenme ve beslenme bilinçli tasarlandığında gerçek bir protokole dönüşür.`,
    tags: ['Mitokondri', 'Rakım', 'Metabolik Esneklik', 'İnziva']
  },
  {
    id: 'b7',
    title: 'Nar, Üzüm ve İncir Polifenollerinde Hücresel Savunma',
    subtitle: 'Tarımsal mirastan NRF2 sinyali ve damar korumasına.',
    category: 'Yerel Üreticiler',
    readTime: '11 dk okuma',
    date: '30 Mayıs 2026',
    author: 'Dr. Nora Stein, Bitkisel Biyoaktifler Birimi',
    imageUrl: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&w=900&q=85',
    content: `Türkiye’nin meyve mirası, nar, üzüm ve incir üretimiyle polifenol yoğunluğu, damar biyolojisi ve mevsimsel beslenme arasında güçlü bir bağ kurar. Asıl soru bu gıdaların genel olarak sağlıklı olup olmadığı değil, işleme ve dozun biyolojik sinyali nasıl değiştirdiğidir.

Nar ellagitanninleri, bağırsak mikropları aracılığıyla mitokondri kalite kontrolüyle ilişkilendirilen urolitinlere dönüşebilir. Üzüm kabuğu resveratrol ve stilbenler içerir; ancak gerçekçi diyet dozları sınırlıdır. İncir lif ve mineral sağlar, fakat doğal şeker yükü de taşır.

NRF2 sinyali, hafif fitokimyasal stresle aktive olan temel savunma yoludur. Bu yol dışarıdan antioksidan eklemekten çok, vücudun kendi savunma enzimlerini artırır.

En iyi üretici rotası; bütün meyve, düşük şekerli ürün, açık hasat zamanı ve laboratuvar destekli polifenol profili sunmalıdır.`,
    tags: ['Polifenoller', 'NRF2', 'Üretici Rotaları', 'Damar Sağlığı']
  },
  {
    id: 'b8',
    title: 'Abartısız Klinik Uzun Ömür Taraması',
    subtitle: 'Sorumlu bir sağlık rotasında hangi biyobelirteçler yer almalı?',
    category: 'Uzun Ömür Klinikleri',
    readTime: '12 dk okuma',
    date: '24 Mayıs 2026',
    author: 'Dr. Selin Hart, Koruyucu Hekimlik Danışmanı',
    imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=900&q=85',
    content: `Uzun ömür klinikleri, risk sınıflandırmasını gösterişli teknolojiden ayırabildiğinde değerlidir. Sorumlu tarama; tansiyon, bel-boy oranı, lipid fraksiyonları, ApoB, HbA1c, açlık glukozu, böbrek-karaciğer fonksiyonu ve uyku kalitesi gibi doğrulanmış göstergelerle başlamalıdır.

İleri testler yalnızca kararları değiştirdiğinde anlamlıdır. Epigenetik saatler, sürekli glukoz ölçümü, VO2 max, DEXA ve koroner kalsiyum skorları aynı kanıt düzeyinde değildir.

Etik model basamaklıdır: temel risk, hekim değerlendirmesi, beslenme-egzersiz reçetesi, uyku müdahalesi ve ardından hedefli ileri testler.

Amaç her gezgini hastaya çevirmek değil; kanıtı açık anlatan, tıbbi sınırları koruyan ve miras pratiklerini modern koruyucu sağlıkla sorumlu biçimde bağlayan ortakları görünür kılmaktır.`,
    tags: ['Biyobelirteçler', 'Koruyucu Hekimlik', 'Etik', 'Tarama']
  }
];

const MOCK_EVENTS_EN: LongevityEvent[] = [
  {
    id: 'e1',
    title: 'Anatolian Epigenetic & Longevity Summit 2026',
    date: 'October 14-16, 2026',
    time: '09:00 AM - 06:00 PM',
    location: 'Cave Meditation Chamber, Cappadocia',
    city: 'Cappadocia',
    description: 'A global gathering of medical researchers, longevity clinicians, and holistic practitioners connecting ancient Anatolian hot therapies and volcanic nutrient soil chemistry with clinical senolytic therapy and sirtuin nutrition.',
    spotsLeft: 12,
    tags: ['Summit', 'Translational Medicine', 'Cappadocia'],
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'e2',
    title: 'Bursa Hydrothermal Epigenetics Workshop',
    date: 'November 05, 2026',
    time: '10:00 AM - 04:30 PM',
    location: 'Kırkpınar Springs, Bursa',
    city: 'Bursa',
    description: 'Learn and execute precise contrast hydrotherapy routines guided by sports medicine scientists. Learn the exact thermal heat-shock biogenesis protocol, mineral bio-absorption dynamics, and daily breathing controls.',
    spotsLeft: 8,
    tags: ['Workshop', 'Contrast Hydrotherapy', 'Bursa'],
    imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'e3',
    title: 'Aegean Polyphenol & Sirtuin Diet Week',
    date: 'September 22-28, 2026',
    time: '08:00 AM - 03:00 PM (Daily)',
    location: 'Urla Organic Olive Farms, Izmir',
    city: 'Izmir',
    description: 'A physical immersion experience: Participate in harvesting high-density, green wild olives on the cliffs of Urla. Features functional nutrition training on lipid biochemistry, sirtuin activation cooking lessons, and cellular fasting strategies.',
    spotsLeft: 15,
    tags: ['Diet week', 'Polyphenols', 'Harvesting', 'Izmir'],
    imageUrl: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'e4',
    title: 'Lycian Circadian Reset Field Lab',
    date: 'July 09-12, 2026',
    time: '06:15 AM - 09:00 PM',
    location: 'Coastal Research Villa, Kas',
    city: 'Antalya',
    description: 'A four-day protocol combining dawn light exposure, timed nutrition, coastal zone-2 walking, evening light hygiene, and sleep tracking. Participants leave with a personal circadian schedule and travel-ready sleep routine.',
    spotsLeft: 10,
    tags: ['Circadian', 'Sleep', 'Light Lab', 'Antalya'],
    imageUrl: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=800&q=85'
  },
  {
    id: 'e5',
    title: 'Anatolian Fermentation & Microbiome Clinic',
    date: 'August 18, 2026',
    time: '11:00 AM - 05:00 PM',
    location: 'Culinary Research Kitchen, Gaziantep',
    city: 'Gaziantep',
    description: 'A guided workshop on kefir, yogurt, tarhana, sourdough, and vegetable ferments. Includes microbiome fundamentals, sodium-risk moderation, fiber pairing, and tasting notes for clinically responsible food tourism.',
    spotsLeft: 18,
    tags: ['Microbiome', 'Fermentation', 'Nutrition'],
    imageUrl: 'https://images.unsplash.com/photo-1606914501449-5a96b6ce24ca?auto=format&fit=crop&w=800&q=85'
  },
  {
    id: 'e6',
    title: 'Uludag Mitochondrial Walking Retreat',
    date: 'September 04-06, 2026',
    time: '07:30 AM - 08:30 PM',
    location: 'Highland Wellness Lodge, Uludag',
    city: 'Bursa',
    description: 'Progressive low-intensity mountain walks, cold-night sleep design, breathing assessment, recovery meals, and lectures on mitochondrial flexibility. Designed for healthy adults after basic fitness screening.',
    spotsLeft: 9,
    tags: ['Mitochondria', 'Walking', 'Recovery'],
    imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=85'
  },
  {
    id: 'e7',
    title: 'Evidence-Based Clinic Screening Day',
    date: 'December 03, 2026',
    time: '09:30 AM - 02:30 PM',
    location: 'Preventive Medicine Forum, Istanbul',
    city: 'Istanbul',
    description: 'A practical seminar for travelers and providers on responsible biomarker panels, ApoB and glucose interpretation, sleep metrics, body composition, and when advanced longevity testing is useful.',
    spotsLeft: 20,
    tags: ['Clinical Screening', 'Biomarkers', 'Istanbul'],
    imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=85'
  }
];

const MOCK_EVENTS_TR: LongevityEvent[] = [
  {
    id: 'e1',
    title: 'Kapadokya Epigenetik ve Sağlıklı Ömür Zirvesi 2026',
    date: '14-16 Ekim 2026',
    time: '09:00 - 18:00',
    location: 'Mağara Meditasyon Salonu, Kapadokya',
    city: 'Kapadokya',
    description: 'Tıp insanları ve epigenetik klinisyenlerin katılımıyla, antik Anadolu kaplıca sıcak tıp kültürlerini volkanik tüf toprak kimyası ve hücresel sirtüin diyet modeliyle harmanlayan tescilli bilim zirvesi.',
    spotsLeft: 12,
    tags: ['Zirve', 'Epigenetik Tıp', 'Kapadokya'],
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'e2',
    title: 'Bursa Hidrotermal Epigenetik Atölyesi',
    date: '05 Kasım 2026',
    time: '10:00 - 16:30',
    location: 'Kırkpınar Termalleri, Bursa',
    city: 'Bursa',
    description: 'Spor bilimciler rehberliğinde kontrast banyo uygulamaları. Hücresel ısı şoku mitokondriyal yenilenme protokolünü teorik ve pratik olarak deneyimleyin.',
    spotsLeft: 8,
    tags: ['Atölye Çalışması', 'Kontrast Banyosu', 'Bursa'],
    imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'e3',
    title: 'Ege Polifenol ve Sirtüin Diyet Haftası',
    date: '22-28 Eylül 2026',
    time: '08:00 - 15:00 (Her Gün)',
    location: 'Urla Organik Zeytin Çiftlikleri, İzmir',
    city: 'İzmir',
    description: 'Saha deneyimi: Urla sırtlarında yeşil yabani zeytin hasatı. Lipid biyokimyası eğitimleri, sirtüin tarifli yemek atölyeleri ve kalori kısıtlama yöntemleri.',
    spotsLeft: 15,
    tags: ['Hasat Haftası', 'Polifenol', 'Hasat', 'İzmir'],
    imageUrl: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'e4',
    title: 'Likya Sirkadiyen Sıfırlama Saha Laboratuvarı',
    date: '09-12 Temmuz 2026',
    time: '06:15 - 21:00',
    location: 'Kıyı Araştırma Villası, Kaş',
    city: 'Antalya',
    description: 'Dört günlük program: gün doğumu ışığı, zamanlı beslenme, kıyı yürüyüşü, akşam ışık hijyeni ve uyku takibi. Katılımcılar kişisel sirkadiyen planla ayrılır.',
    spotsLeft: 10,
    tags: ['Sirkadiyen', 'Uyku', 'Işık', 'Antalya'],
    imageUrl: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=800&q=85'
  },
  {
    id: 'e5',
    title: 'Anadolu Fermentasyon ve Mikrobiyom Kliniği',
    date: '18 Ağustos 2026',
    time: '11:00 - 17:00',
    location: 'Mutfak Araştırma Atölyesi, Gaziantep',
    city: 'Gaziantep',
    description: 'Kefir, yoğurt, tarhana, ekşi maya ve sebze fermentleri üzerine uygulamalı atölye. Mikrobiyom temelleri, tuz dengesi, lif eşleşmesi ve sorumlu gastronomi notları içerir.',
    spotsLeft: 18,
    tags: ['Mikrobiyom', 'Fermentasyon', 'Beslenme'],
    imageUrl: 'https://images.unsplash.com/photo-1606914501449-5a96b6ce24ca?auto=format&fit=crop&w=800&q=85'
  },
  {
    id: 'e6',
    title: 'Uludağ Mitokondriyal Yürüyüş İnzivası',
    date: '04-06 Eylül 2026',
    time: '07:30 - 20:30',
    location: 'Yayla Sağlık Evi, Uludağ',
    city: 'Bursa',
    description: 'Kademeli düşük yoğunluklu dağ yürüyüşleri, serin gece uyku tasarımı, nefes değerlendirmesi, toparlanma öğünleri ve mitokondriyal esneklik dersleri.',
    spotsLeft: 9,
    tags: ['Mitokondri', 'Yürüyüş', 'Toparlanma'],
    imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=85'
  },
  {
    id: 'e7',
    title: 'Kanıta Dayalı Klinik Tarama Günü',
    date: '03 Aralık 2026',
    time: '09:30 - 14:30',
    location: 'Koruyucu Tıp Forumu, İstanbul',
    city: 'İstanbul',
    description: 'Gezginler ve işletmeler için biyobelirteç panelleri, ApoB ve glukoz yorumu, uyku metrikleri, vücut kompozisyonu ve ileri uzun ömür testlerinin doğru kullanımı.',
    spotsLeft: 20,
    tags: ['Klinik Tarama', 'Biyobelirteç', 'İstanbul'],
    imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=85'
  }
];

export default function BlogEventsModal({ isOpen, onClose, initialTab = 'blog' }: BlogEventsModalProps) {
  const { language, t } = useLanguage();
  const [activeSubTab, setActiveSubTab] = useState<'blog' | 'events'>(initialTab);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [bookEventId, setBookEventId] = useState<string | null>(null);
  const [bookingFormData, setBookingFormData] = useState({ name: '', email: '' });
  const [bookingSuccessId, setBookingSuccessId] = useState<string | null>(null);
  const [databasePosts, setDatabasePosts] = useState<BlogPost[] | null>(null);
  const [databaseEvents, setDatabaseEvents] = useState<LongevityEvent[] | null>(null);
  const [bookingError, setBookingError] = useState('');
  const [isBookingSubmitting, setIsBookingSubmitting] = useState(false);

  const fallbackPosts = language === 'tr' ? MOCK_POSTS_TR : MOCK_POSTS_EN;
  const fallbackEvents = language === 'tr' ? MOCK_EVENTS_TR : MOCK_EVENTS_EN;
  const posts = databasePosts?.length ? databasePosts : fallbackPosts;
  const events = databaseEvents?.length ? databaseEvents : fallbackEvents;

  // Sync state with open tab if changed from outside
  React.useEffect(() => {
    setActiveSubTab(initialTab);
    setSelectedPost(null);
    setBookEventId(null);
  }, [initialTab]);

  React.useEffect(() => {
    if (!isOpen) return;

    getBlogPosts(language)
      .then(({ posts: loadedPosts }) => setDatabasePosts(loadedPosts))
      .catch((error) => {
        console.warn('Could not load database blog posts.', error);
        setDatabasePosts(null);
      });

    getEvents(language)
      .then(({ events: loadedEvents }) => setDatabaseEvents(loadedEvents))
      .catch((error) => {
        console.warn('Could not load database events.', error);
        setDatabaseEvents(null);
      });
  }, [isOpen, language]);

  if (!isOpen) return null;

  const handleBookingSubmit = async (e: React.FormEvent, eventId: string) => {
    e.preventDefault();
    if (bookingFormData.name && bookingFormData.email) {
      setBookingError('');
      setIsBookingSubmitting(true);
      try {
        await registerEvent({
          eventId,
          name: bookingFormData.name,
          email: bookingFormData.email,
        });

      setBookingSuccessId(eventId);
      setBookEventId(null);
      setTimeout(() => {
        setBookingSuccessId(null);
        setBookingFormData({ name: '', email: '' });
      }, 7000);
      } catch (error) {
        setBookingError(error instanceof Error ? error.message : 'Registration could not be saved.');
      } finally {
        setIsBookingSubmitting(false);
      }
    }
  };

  const currentSelectedPost = selectedPost ? (posts.find(p => p.id === selectedPost.id) || selectedPost) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F2B2D]/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="bg-[#FAF7F2] w-full max-w-6xl h-[92vh] md:h-[84vh] rounded-2xl overflow-hidden border border-brand-warm-sand/50 shadow-2xl flex flex-col relative animate-in zoom-in-95 duration-200">
        
        {/* Modal Top Header Bar */}
        <div className="bg-[#0F2B2D] text-[#FAF7F2] p-6 flex flex-col md:flex-row items-baseline md:items-center justify-between gap-4 shrink-0 border-b border-brand-warm-sand/20">
          <div className="space-y-1">
            <span className="text-[10px] tracking-widest font-mono text-[#4FB8B1] uppercase font-bold">
              {language === 'tr' ? 'BİLİMSEL OKUMALAR VE ETKİNLİKLER' : 'Research & Practical Immersion'}
            </span>
            <h2 className="text-xl md:text-2xl font-extrabold tracking-tight select-none">
              {currentSelectedPost 
                ? (language === 'tr' ? 'Makale Analizi Gözlemevi' : 'Reading Research Gazette') 
                : (language === 'tr' ? 'Arkeolojik Sağlık Gazetesi' : 'Scientific Legacy Gazette')}
            </h2>
          </div>

          {/* Sub-Tabs Selector */}
          {!currentSelectedPost && (
            <div className="bg-black/20 p-1.5 rounded-2xl flex gap-1 items-center border border-white/5">
              <button
                onClick={() => { setActiveSubTab('blog'); setBookEventId(null); }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeSubTab === 'blog'
                    ? 'bg-[#C08240] text-white shadow'
                    : 'text-[#FAF7F2]/70 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{language === 'tr' ? 'Sağlıklı Ömür Blogu' : 'Longevity Blog'}</span>
              </button>
              <button
                onClick={() => { setActiveSubTab('events'); setBookEventId(null); }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeSubTab === 'events'
                    ? 'bg-[#4FB8B1] text-[#0F2B2D] shadow'
                    : 'text-[#FAF7F2]/70 hover:text-white'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{language === 'tr' ? 'Aktif Etkinlikler' : 'Upcoming Events'}</span>
              </button>
            </div>
          )}

          {/* Close button */}
          <button
            onClick={() => {
              if (currentSelectedPost) {
                setSelectedPost(null);
              } else {
                onClose();
              }
            }}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-[#FAF7F2] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Main Content Box */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          
          {/* BLOG POST DETAIL VIEW */}
          {currentSelectedPost ? (
            <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-300">
              <button
                onClick={() => setSelectedPost(null)}
                className="text-xs font-bold text-[#0E6F6D] hover:underline flex items-center gap-1.5 mb-4"
              >
                {language === 'tr' ? '← Araştırma Yazılarına Geri Dön' : '← Back to Research Articles'}
              </button>

              <div className="relative h-64 rounded-2xl overflow-hidden border border-brand-warm-sand/40">
                <img
                  src={currentSelectedPost.imageUrl}
                  alt={currentSelectedPost.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-[#C08240] text-[#FAF7F2] text-[10px] font-bold px-2.5 py-1 rounded">
                  {currentSelectedPost.category}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-4 text-xs text-brand-deep-slate/50 font-mono">
                  <span>{currentSelectedPost.date}</span>
                  <span>•</span>
                  <span>{currentSelectedPost.readTime}</span>
                  <span>•</span>
                  <span className="font-semibold text-brand-deep-slate/75">{currentSelectedPost.author}</span>
                </div>

                <h3 className="text-2xl md:text-3xl font-extrabold text-[#0F2B2D] tracking-tight leading-tight">
                  {currentSelectedPost.title}
                </h3>
              </div>

              {/* Serif Body copy */}
              <div className="text-brand-deep-slate/85 font-serif text-sm md:text-base leading-relaxed whitespace-pre-line border-t border-brand-warm-sand/30 pt-6 space-y-4">
                {currentSelectedPost.content}
              </div>

              {/* Tags and Social triggers */}
              <div className="border-t border-brand-warm-sand/30 pt-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-1.5">
                  {currentSelectedPost.tags.map(t => (
                    <span key={t} className="text-[10px] font-semibold text-brand-deep-slate/50 font-mono bg-brand-warm-sand/30 py-1 px-2 rounded">
                      #{t}
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      navigator.clipboard?.writeText?.(window.location.href);
                      alert(language === 'tr' ? 'Bağlantı kopyalandı!' : 'Copied studies article link!');
                    }}
                    className="p-2 border border-brand-warm-sand rounded-xl hover:bg-brand-warm-sand/20 text-brand-deep-slate/60 hover:text-[#0F2B2D] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{language === 'tr' ? 'Makaleyi Paylaş' : 'Share Research'}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : activeSubTab === 'blog' ? (
            
            /* BLOG LIST VIEW */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
              {posts.map(post => (
                <div
                  key={post.id}
                  className="bg-white rounded-2xl border border-brand-warm-sand/40 p-4 space-y-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="h-40 rounded-xl overflow-hidden relative">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2.5 left-2.5 bg-brand-deep-slate text-brand-soft-ivory text-[9px] font-bold py-0.5 px-2 rounded">
                        {post.category}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-brand-deep-slate/40 font-mono">
                      <span>{post.date}</span>
                      <span>{post.readTime}</span>
                    </div>

                    <h4 className="font-bold text-brand-deep-slate text-sm leading-snug line-clamp-2 hover:text-[#0E6F6D] transition-colors cursor-pointer font-sans" onClick={() => setSelectedPost(post)}>
                      {post.title}
                    </h4>

                    <p className="text-xs text-brand-deep-slate/65 line-clamp-3 leading-relaxed">
                      {post.subtitle}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedPost(post)}
                    className="pt-2 text-[11px] font-bold text-[#0E6F6D] hover:text-brand-deep-slate flex items-center gap-1 cursor-pointer"
                  >
                    <span>{language === 'tr' ? 'Makaleyi Oku' : 'Read Full Studies'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

          ) : (
            
            /* EVENTS LIST VIEW */
            <div className="space-y-6">
              <div className="bg-[#4FB8B1]/10 border border-[#4FB8B1]/20 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-0.5 max-w-lg">
                  <p className="text-xs font-bold text-[#0E6F6D] text-left">
                    {language === 'tr' ? 'Uygulamalı Yerel Gençleşme Kampları' : 'Physical Anatolian Rejuvenation Programs'}
                  </p>
                  <p className="text-[11px] text-brand-deep-slate/70 text-left">
                    {language === 'tr' 
                      ? 'Fonksiyonel tıp bilimcileri, zeytin üreticileri ve kontrast banyo uzmanlarıyla benzersiz doğa kamplarında bir araya gelin.' 
                      : 'Connect with functional medical directors, olive growers, and contrast hydrotherapists in immersive experiential settings.'}
                  </p>
                </div>
                <div className="bg-white border border-[#4FB8B1]/30 text-[#0E6F6D] font-mono text-xs font-bold px-3 py-1.5 rounded-xl shrink-0">
                  {language === 'tr' ? 'Epigenetik & Keşif' : 'Epigenetics & Immersion'} 
                </div>
              </div>

              {bookingSuccessId && (
                <div className="bg-[#7A8F6A]/10 border border-[#7A8F6A]/30 p-4 rounded-2xl flex items-center gap-3 text-xs text-brand-deep-slate animate-in slide-in-from-top-1">
                  <CheckCircle className="w-5 h-5 text-[#7A8F6A]" />
                  <div>
                    <h5 className="font-bold text-[#0F2B2D]">
                      {language === 'tr' ? 'Kaydınız Başarıyla Alındı!' : 'Registration Submitted Successfully!'}
                    </h5>
                      <p className="text-brand-deep-slate/70 mt-0.5">
                      {language === 'tr' 
                        ? 'Etkinlik bilet rezervasyon talebi onaylandı. Rezervasyon detayları ve güzergah e-posta kutunuza iletildi.' 
                        : 'We have processed your request of reservation and sent the itinerary invitation card to your email box.'}
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {events.map(ev => {
                  const isBooking = bookEventId === ev.id;
                  const canRegister = bookingSuccessId !== ev.id;
                  
                  return (
                    <div
                      key={ev.id}
                      className="bg-white rounded-2xl border border-brand-warm-sand/40 p-5 space-y-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start gap-2">
                          <span className="text-[9px] uppercase font-bold text-[#FAF7F2] bg-[#4FB8B1] px-2 py-0.5 rounded">
                            {ev.city}
                          </span>
                          <span className="text-[10px] text-[#C08240] bg-[#C08240]/5 border border-[#C08240]/20 px-2.5 py-0.5 rounded-full font-bold">
                            {ev.spotsLeft} {language === 'tr' ? 'boş koltuk kaldı' : 'seats remaining'}
                          </span>
                        </div>

                        <h4 className="font-extrabold text-brand-deep-slate text-base leading-snug tracking-tight font-sans">
                          {ev.title}
                        </h4>

                        <div className="space-y-1.5 text-xs text-brand-deep-slate/75">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-brand-deep-slate/40" />
                            <span>{ev.date}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-brand-deep-slate/40" />
                            <span>{ev.time}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-brand-deep-slate/40" />
                            <span className="font-semibold text-brand-deep-slate/80">{ev.location}</span>
                          </div>
                        </div>

                        <p className="text-xs text-brand-deep-slate/65 line-clamp-3 leading-relaxed">
                          {ev.description}
                        </p>
                      </div>

                      {/* Register form */}
                      {isBooking ? (
                        <form onSubmit={(e) => handleBookingSubmit(e, ev.id)} className="border-t border-brand-warm-sand/20 pt-4 mt-2 space-y-2">
                          <p className="text-[10px] font-semibold text-brand-deep-slate uppercase">
                            {language === 'tr' ? 'Biletimizi Güvenceye Alın' : 'Secure Invitation Seat'}
                          </p>
                          <input
                            type="text"
                            required
                            placeholder={language === 'tr' ? 'Adınız soyadınız' : "Full name"}
                            value={bookingFormData.name}
                            onChange={(e) => setBookingFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full text-xs p-2.5 bg-[#FAF7F2] border border-brand-warm-sand/60 rounded-xl focus:outline-none focus:border-[#4FB8B1]"
                          />
                          <input
                            type="email"
                            required
                            placeholder={language === 'tr' ? 'E-posta adresiniz' : "Email address"}
                            value={bookingFormData.email}
                            onChange={(e) => setBookingFormData(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full text-xs p-2.5 bg-[#FAF7F2] border border-brand-warm-sand/60 rounded-xl focus:outline-none focus:border-[#4FB8B1]"
                          />
                          {bookingError && (
                            <div className="text-[10px] font-semibold text-red-700 bg-red-50 border border-red-100 rounded-lg px-2.5 py-1.5">
                              {bookingError}
                            </div>
                          )}
                          <div className="flex gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => setBookEventId(null)}
                              disabled={isBookingSubmitting}
                              className="flex-1 py-1.5 border border-brand-warm-sand text-xs font-semibold rounded-lg hover:bg-brand-warm-sand/25 cursor-pointer"
                            >
                              {language === 'tr' ? 'İptal' : 'Cancel'}
                            </button>
                            <button
                              type="submit"
                              disabled={isBookingSubmitting}
                              className="flex-1 py-1.5 bg-[#4FB8B1] hover:bg-[#4FB8B1]/90 disabled:opacity-50 text-brand-deep-slate font-bold text-xs rounded-lg cursor-pointer"
                            >
                              {isBookingSubmitting
                                ? (language === 'tr' ? 'Kaydediliyor...' : 'Saving...')
                                : (language === 'tr' ? 'Kaydı Tamamla' : 'Complete Booking')}
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="border-t border-brand-warm-sand/20 pt-4 flex items-center justify-between">
                          <div className="flex gap-1">
                            {ev.tags.slice(0, 2).map(tag => (
                              <span key={tag} className="text-[9px] font-mono text-brand-deep-slate/40 px-1.5 py-0.5 bg-brand-warm-sand/20 rounded">
                                #{tag}
                              </span>
                            ))}
                          </div>

                          <button
                            disabled={!canRegister}
                            onClick={() => {
                              if (canRegister) {
                                setBookEventId(ev.id);
                              }
                            }}
                            className={`px-4 py-2 font-bold text-xs rounded-xl transition-all cursor-pointer select-none ${
                              bookingSuccessId === ev.id
                                ? 'bg-zinc-100 text-zinc-400 border border-zinc-200 cursor-not-allowed'
                                : 'bg-brand-deep-slate hover:bg-[#0E6F6D] text-brand-soft-ivory'
                            }`}
                          >
                            {bookingSuccessId === ev.id 
                              ? (language === 'tr' ? 'Yeriniz Ayrıldı' : 'Spot Booked') 
                              : (language === 'tr' ? 'Yer Raporla (Ücretsiz)' : 'Reserve Spot')}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-[#FAF7F2] border-t border-brand-warm-sand/30 p-4 shrink-0 flex justify-between items-center text-[10px] text-brand-deep-slate/40 font-mono">
          <span>{language === 'tr' ? 'TÜM PROGRAMLAR BİLİMSEL KONTROL İLKELERİYLE UYUMLUDUR • 2026' : 'PROGRAMS ARE CURATED AGAINST EVIDENCE-BASED REVIEW PRINCIPLES • 2026'}</span>
          <span>© {language === 'tr' ? 'UZUN ÖMÜR ROTASI GAZETESİ' : 'ROUTE LONGEVITY GAZETTE'}</span>
        </div>
      </div>
    </div>
  );
}
