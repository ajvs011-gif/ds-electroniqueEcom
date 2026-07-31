import { BlogPost, Category, Product, Testimonial } from "@/types";

export const categories: Category[] = [
  { id: "1", name: "Arduino", slug: "arduino", icon: "Cpu" },
  { id: "2", name: "ESP32", slug: "esp32", icon: "Wifi" },
  { id: "3", name: "Capteurs", slug: "capteurs", icon: "RadioTower" },
  { id: "4", name: "Robotique", slug: "robotique", icon: "Bot" },
  { id: "5", name: "Outillage", slug: "outillage", icon: "Wrench" },
  { id: "6", name: "Alimentation", slug: "alimentation", icon: "BatteryFull" },
  { id: "7", name: "Modules RF", slug: "modules-rf", icon: "SatelliteDish" },
  { id: "8", name: "Afficheurs", slug: "afficheurs", icon: "MonitorSmartphone" },
  { id: "9", name: "Connecteurs", slug: "connecteurs", icon: "Plug" },
];

export const products: Product[] = [
  {
    id: "p1", slug: "esp32-devkit-v1", imageUrl: "https://placehold.co/600x600/0057B8/FFFFFF?font=poppins&text=ESP32+DevKit", name: "ESP32 DevKit v1 WROOM-32",
    priceFcfa: 18000, oldPriceFcfa: 25000, badge: "-28%", rating: 5, stock: "en_stock",
    icon: "Cpu", categorySlug: "esp32",
    shortDescription: "Microcontrôleur WiFi + Bluetooth double cœur, idéal pour l'IoT.",
    description: "Le module ESP32 DevKit v1 embarque un double cœur Xtensa, le WiFi et le Bluetooth Low Energy. Parfait pour des projets IoT, domotique ou robotique connectée. Programmable via Arduino IDE, PlatformIO ou MicroPython.",
    specs: [
      { label: "Microcontrôleur", value: "ESP32-WROOM-32" },
      { label: "Connectivité", value: "WiFi 802.11 b/g/n, Bluetooth 4.2" },
      { label: "GPIO", value: "30 broches" },
      { label: "Alimentation", value: "5V via micro-USB" },
    ],
  },
  {
    id: "p2", slug: "arduino-uno-r3", imageUrl: "https://placehold.co/600x600/0057B8/FFFFFF?font=poppins&text=Arduino+Uno+R3", name: "Arduino Uno R3 (compatible)",
    priceFcfa: 12500, rating: 5, stock: "en_stock",
    icon: "Cpu", categorySlug: "arduino",
    shortDescription: "La carte de référence pour débuter en électronique et robotique.",
    description: "L'Arduino Uno R3 est la carte la plus utilisée pour l'apprentissage de l'électronique programmable. Basée sur l'ATmega328P, elle dispose de 14 broches numériques et 6 entrées analogiques.",
    specs: [
      { label: "Microcontrôleur", value: "ATmega328P" },
      { label: "Tension de fonctionnement", value: "5V" },
      { label: "Broches E/S numériques", value: "14 (dont 6 PWM)" },
      { label: "Mémoire flash", value: "32 Ko" },
    ],
  },
  {
    id: "p3", slug: "capteur-hc-sr04", imageUrl: "https://placehold.co/600x600/0057B8/FFFFFF?font=poppins&text=HC-SR04", name: "Capteur ultrason HC-SR04",
    priceFcfa: 3500, oldPriceFcfa: 4500, badge: "PROMO", rating: 4, stock: "en_stock",
    icon: "RadioTower", categorySlug: "capteurs",
    shortDescription: "Mesure de distance sans contact de 2cm à 4m.",
    description: "Le HC-SR04 permet de mesurer une distance par écho ultrasonique, idéal pour l'évitement d'obstacles en robotique ou les projets de détection de présence.",
    specs: [
      { label: "Portée", value: "2 cm à 400 cm" },
      { label: "Précision", value: "±3 mm" },
      { label: "Alimentation", value: "5V DC" },
      { label: "Interface", value: "Trigger / Echo" },
    ],
  },
  {
    id: "p4", slug: "kit-robotique-4wd", imageUrl: "https://placehold.co/600x600/0057B8/FFFFFF?font=poppins&text=Kit+Robotique+4WD", name: "Kit robotique 4 roues motrices",
    priceFcfa: 32000, oldPriceFcfa: 42000, badge: "-24%", rating: 5, stock: "stock_limite",
    icon: "Bot", categorySlug: "robotique",
    shortDescription: "Châssis 4WD complet avec moteurs et roues pour vos robots.",
    description: "Kit complet pour construire un robot mobile à 4 roues motrices : châssis, 4 moteurs à courant continu, roues et visserie. Compatible Arduino et ESP32.",
    specs: [
      { label: "Moteurs", value: "4x DC 3-6V" },
      { label: "Matériau châssis", value: "Acrylique" },
      { label: "Charge max", value: "1 kg" },
      { label: "Dimensions", value: "21 x 15 cm" },
    ],
  },
  {
    id: "p5", slug: "module-bluetooth-hc05", imageUrl: "https://placehold.co/600x600/0057B8/FFFFFF?font=poppins&text=HC-05+Bluetooth", name: "Module Bluetooth HC-05",
    priceFcfa: 6000, rating: 4, stock: "en_stock",
    icon: "SatelliteDish", categorySlug: "modules-rf",
    shortDescription: "Communication sans fil Bluetooth pour Arduino.",
    description: "Le HC-05 permet d'ajouter une communication série Bluetooth à vos projets Arduino : contrôle à distance depuis un smartphone, transfert de données, etc.",
    specs: [
      { label: "Portée", value: "~10 m" },
      { label: "Interface", value: "UART" },
      { label: "Alimentation", value: "3.3V - 5V" },
      { label: "Modes", value: "Maître / Esclave" },
    ],
  },
  {
    id: "p6", slug: "ecran-oled-096", imageUrl: "https://placehold.co/600x600/0057B8/FFFFFF?font=poppins&text=OLED+0.96in", name: "Écran OLED 0.96\" I2C",
    priceFcfa: 5200, badge: "NOUVEAU", rating: 5, stock: "en_stock",
    icon: "MonitorSmartphone", categorySlug: "afficheurs",
    shortDescription: "Petit écran OLED monochrome, parfait pour l'affichage de données.",
    description: "Écran OLED 128x64 pixels, communication I2C, idéal pour afficher des mesures de capteurs, un menu ou une interface simple sur vos projets embarqués.",
    specs: [
      { label: "Résolution", value: "128 x 64 px" },
      { label: "Interface", value: "I2C" },
      { label: "Alimentation", value: "3.3V - 5V" },
      { label: "Couleur", value: "Blanc monochrome" },
    ],
  },
  {
    id: "p7", slug: "alimentation-12v5a", imageUrl: "https://placehold.co/600x600/0057B8/FFFFFF?font=poppins&text=Alim+12V+5A", name: "Alimentation 12V 5A",
    priceFcfa: 9800, rating: 4, stock: "en_stock",
    icon: "BatteryFull", categorySlug: "alimentation",
    shortDescription: "Bloc d'alimentation stabilisé pour vos montages électroniques.",
    description: "Alimentation à découpage 12V 5A, protection court-circuit et surtension, idéale pour les kits robotiques, bandes LED et projets nécessitant du courant.",
    specs: [
      { label: "Tension de sortie", value: "12V DC" },
      { label: "Courant max", value: "5A / 60W" },
      { label: "Entrée", value: "100-240V AC" },
      { label: "Protections", value: "Court-circuit, surtension" },
    ],
  },
  {
    id: "p8", slug: "kit-tournevis-precision", imageUrl: "https://placehold.co/600x600/0057B8/FFFFFF?font=poppins&text=Kit+Tournevis", name: "Kit tournevis de précision",
    priceFcfa: 7200, oldPriceFcfa: 9000, badge: "-20%", rating: 5, stock: "en_stock",
    icon: "Wrench", categorySlug: "outillage",
    shortDescription: "Set de 32 embouts pour l'électronique et la réparation.",
    description: "Kit de tournevis de précision avec 32 embouts interchangeables, indispensable pour le montage de cartes électroniques, la réparation de smartphones et l'assemblage de kits.",
    specs: [
      { label: "Nombre d'embouts", value: "32" },
      { label: "Matériau", value: "Acier S2 trempé" },
      { label: "Poignée", value: "Aluminium anti-dérapant" },
      { label: "Étui inclus", value: "Oui" },
    ],
  },
  {
    id: "n1", slug: "raspberry-pi-pico-w", imageUrl: "https://placehold.co/600x600/0057B8/FFFFFF?font=poppins&text=Pi+Pico+W", name: "Raspberry Pi Pico W",
    priceFcfa: 8500, badge: "NOUVEAU", rating: 5, stock: "en_stock",
    icon: "Cpu", categorySlug: "esp32",
    shortDescription: "Microcontrôleur RP2040 avec WiFi intégré.",
    description: "Le Raspberry Pi Pico W embarque le RP2040 double cœur avec connectivité WiFi, programmable en MicroPython ou C/C++. Excellent pour des projets IoT compacts et économes en énergie.",
    specs: [
      { label: "Microcontrôleur", value: "RP2040" },
      { label: "Connectivité", value: "WiFi 802.11n" },
      { label: "GPIO", value: "26 broches" },
      { label: "Mémoire", value: "264 Ko SRAM" },
    ],
  },
  {
    id: "n2", slug: "module-rfid-rc522", imageUrl: "https://placehold.co/600x600/0057B8/FFFFFF?font=poppins&text=RFID+RC522", name: "Module RFID RC522",
    priceFcfa: 4200, badge: "NOUVEAU", rating: 4, stock: "en_stock",
    icon: "SatelliteDish", categorySlug: "modules-rf",
    shortDescription: "Lecteur/écriture de cartes RFID 13.56MHz.",
    description: "Module RC522 pour lire et écrire des tags RFID/NFC 13.56MHz. Utilisé pour les systèmes de contrôle d'accès, badges et projets d'identification.",
    specs: [
      { label: "Fréquence", value: "13.56 MHz" },
      { label: "Interface", value: "SPI" },
      { label: "Portée de lecture", value: "~3 cm" },
      { label: "Alimentation", value: "3.3V" },
    ],
  },
  {
    id: "n3", slug: "capteur-dht22", imageUrl: "https://placehold.co/600x600/0057B8/FFFFFF?font=poppins&text=DHT22", name: "Capteur DHT22 Température & Humidité",
    priceFcfa: 4800, badge: "NOUVEAU", rating: 5, stock: "en_stock",
    icon: "RadioTower", categorySlug: "capteurs",
    shortDescription: "Mesure précise de la température et de l'humidité.",
    description: "Le DHT22 offre une mesure fiable de température (-40 à 80°C) et d'humidité relative (0-100%), avec une meilleure précision que le DHT11. Idéal pour la domotique et les stations météo.",
    specs: [
      { label: "Plage température", value: "-40°C à 80°C (±0.5°C)" },
      { label: "Plage humidité", value: "0-100% (±2%)" },
      { label: "Interface", value: "Signal numérique 1 fil" },
      { label: "Alimentation", value: "3.3V - 6V" },
    ],
  },
  {
    id: "n4", slug: "connecteurs-dupont-120", imageUrl: "https://placehold.co/600x600/0057B8/FFFFFF?font=poppins&text=Dupont+120pcs", name: "Connecteurs Dupont (kit 120pcs)",
    priceFcfa: 3000, badge: "NOUVEAU", rating: 4, stock: "en_stock",
    icon: "Plug", categorySlug: "connecteurs",
    shortDescription: "Fils de câblage mâle-mâle, mâle-femelle, femelle-femelle.",
    description: "Kit de 120 câbles Dupont de 20cm, essentiel pour tous vos prototypages sur breadboard avec Arduino, ESP32 ou Raspberry Pi.",
    specs: [
      { label: "Quantité", value: "120 câbles" },
      { label: "Longueur", value: "20 cm" },
      { label: "Types", value: "M-M, M-F, F-F (40 chacun)" },
      { label: "Pas", value: "2.54 mm" },
    ],
  },
];

export const popularProducts = products.filter((p) =>
  ["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8"].includes(p.id)
);
export const newArrivals = products.filter((p) => p.badge === "NOUVEAU");

export const testimonials: Testimonial[] = [
  { id: "t1", name: "Kouadio S.", role: "Étudiant en robotique — Abidjan", quote: "Commande reçue en 24h, tout était bien emballé. Les modules ESP32 fonctionnent parfaitement pour mon projet de fin d'études." },
  { id: "t2", name: "Aïcha D.", role: "Ingénieure électronique — Bouaké", quote: "Enfin un fournisseur fiable en Côte d'Ivoire. Prix corrects et large choix de capteurs, je recommande." },
  { id: "t3", name: "Yao B.", role: "Maker & formateur — Yamoussoukro", quote: "J'utilise DS-ELECTRONIQUE pour approvisionner mes ateliers Arduino. Service client très réactif." },
];

export const blogPosts: BlogPost[] = [
  { id: "b1", slug: "debuter-esp32", tag: "Tutoriel", title: "Débuter avec l'ESP32 : guide complet pour makers", excerpt: "Lire l'article complet et découvrir toutes les étapes en détail." },
  { id: "b2", slug: "quel-arduino-choisir", tag: "Guide d'achat", title: "Quel Arduino choisir pour votre premier projet ?", excerpt: "Lire l'article complet et découvrir toutes les étapes en détail." },
  { id: "b3", slug: "robot-suiveur-de-ligne", tag: "Robotique", title: "Construire un robot suiveur de ligne pas à pas", excerpt: "Lire l'article complet et découvrir toutes les étapes en détail." },
];
