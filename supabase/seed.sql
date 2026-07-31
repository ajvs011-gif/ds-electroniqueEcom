-- =========================================================
-- Données de départ (à exécuter après schema.sql)
-- =========================================================

insert into categories (name, slug, icon) values
  ('Arduino', 'arduino', 'Cpu'),
  ('ESP32', 'esp32', 'Wifi'),
  ('Capteurs', 'capteurs', 'RadioTower'),
  ('Robotique', 'robotique', 'Bot'),
  ('Outillage', 'outillage', 'Wrench'),
  ('Alimentation', 'alimentation', 'BatteryFull'),
  ('Modules RF', 'modules-rf', 'SatelliteDish'),
  ('Afficheurs', 'afficheurs', 'MonitorSmartphone'),
  ('Connecteurs', 'connecteurs', 'Plug')
on conflict (slug) do nothing;

insert into products
  (slug, name, price_fcfa, old_price_fcfa, badge, rating, stock, icon, category_slug, short_description, description, specs)
values
  ('esp32-devkit-v1', 'ESP32 DevKit v1 WROOM-32', 18000, 25000, '-28%', 5, 'en_stock', 'Cpu', 'esp32',
   'Microcontrôleur WiFi + Bluetooth double cœur, idéal pour l''IoT.',
   'Le module ESP32 DevKit v1 embarque un double cœur Xtensa, le WiFi et le Bluetooth Low Energy. Parfait pour des projets IoT, domotique ou robotique connectée.',
   '[{"label":"Microcontrôleur","value":"ESP32-WROOM-32"},{"label":"Connectivité","value":"WiFi 802.11 b/g/n, Bluetooth 4.2"},{"label":"GPIO","value":"30 broches"},{"label":"Alimentation","value":"5V via micro-USB"}]'),
  ('arduino-uno-r3', 'Arduino Uno R3 (compatible)', 12500, null, null, 5, 'en_stock', 'Cpu', 'arduino',
   'La carte de référence pour débuter en électronique et robotique.',
   'L''Arduino Uno R3 est la carte la plus utilisée pour l''apprentissage de l''électronique programmable, basée sur l''ATmega328P.',
   '[{"label":"Microcontrôleur","value":"ATmega328P"},{"label":"Tension","value":"5V"},{"label":"Broches E/S","value":"14 (dont 6 PWM)"},{"label":"Mémoire flash","value":"32 Ko"}]'),
  ('capteur-hc-sr04', 'Capteur ultrason HC-SR04', 3500, 4500, 'PROMO', 4, 'en_stock', 'RadioTower', 'capteurs',
   'Mesure de distance sans contact de 2cm à 4m.',
   'Le HC-SR04 permet de mesurer une distance par écho ultrasonique, idéal pour l''évitement d''obstacles en robotique.',
   '[{"label":"Portée","value":"2 à 400 cm"},{"label":"Précision","value":"±3 mm"},{"label":"Alimentation","value":"5V DC"},{"label":"Interface","value":"Trigger / Echo"}]'),
  ('kit-robotique-4wd', 'Kit robotique 4 roues motrices', 32000, 42000, '-24%', 5, 'stock_limite', 'Bot', 'robotique',
   'Châssis 4WD complet avec moteurs et roues pour vos robots.',
   'Kit complet pour construire un robot mobile à 4 roues motrices, compatible Arduino et ESP32.',
   '[{"label":"Moteurs","value":"4x DC 3-6V"},{"label":"Châssis","value":"Acrylique"},{"label":"Charge max","value":"1 kg"},{"label":"Dimensions","value":"21 x 15 cm"}]'),
  ('module-bluetooth-hc05', 'Module Bluetooth HC-05', 6000, null, null, 4, 'en_stock', 'SatelliteDish', 'modules-rf',
   'Communication sans fil Bluetooth pour Arduino.',
   'Le HC-05 permet d''ajouter une communication série Bluetooth à vos projets Arduino.',
   '[{"label":"Portée","value":"~10 m"},{"label":"Interface","value":"UART"},{"label":"Alimentation","value":"3.3V - 5V"},{"label":"Modes","value":"Maître / Esclave"}]'),
  ('ecran-oled-096', 'Écran OLED 0.96" I2C', 5200, null, 'NOUVEAU', 5, 'en_stock', 'MonitorSmartphone', 'afficheurs',
   'Petit écran OLED monochrome, parfait pour l''affichage de données.',
   'Écran OLED 128x64 pixels, communication I2C, idéal pour afficher des mesures de capteurs ou un menu.',
   '[{"label":"Résolution","value":"128 x 64 px"},{"label":"Interface","value":"I2C"},{"label":"Alimentation","value":"3.3V - 5V"},{"label":"Couleur","value":"Blanc monochrome"}]'),
  ('alimentation-12v5a', 'Alimentation 12V 5A', 9800, null, null, 4, 'en_stock', 'BatteryFull', 'alimentation',
   'Bloc d''alimentation stabilisé pour vos montages électroniques.',
   'Alimentation à découpage 12V 5A avec protection court-circuit et surtension.',
   '[{"label":"Sortie","value":"12V DC"},{"label":"Courant max","value":"5A / 60W"},{"label":"Entrée","value":"100-240V AC"},{"label":"Protections","value":"Court-circuit, surtension"}]'),
  ('kit-tournevis-precision', 'Kit tournevis de précision', 7200, 9000, '-20%', 5, 'en_stock', 'Wrench', 'outillage',
   'Set de 32 embouts pour l''électronique et la réparation.',
   'Kit de tournevis de précision avec 32 embouts interchangeables, indispensable pour le montage de cartes électroniques.',
   '[{"label":"Embouts","value":"32"},{"label":"Matériau","value":"Acier S2 trempé"},{"label":"Poignée","value":"Aluminium anti-dérapant"},{"label":"Étui","value":"Inclus"}]'),
  ('raspberry-pi-pico-w', 'Raspberry Pi Pico W', 8500, null, 'NOUVEAU', 5, 'en_stock', 'Cpu', 'esp32',
   'Microcontrôleur RP2040 avec WiFi intégré.',
   'Le Raspberry Pi Pico W embarque le RP2040 double cœur avec connectivité WiFi.',
   '[{"label":"Microcontrôleur","value":"RP2040"},{"label":"Connectivité","value":"WiFi 802.11n"},{"label":"GPIO","value":"26 broches"},{"label":"Mémoire","value":"264 Ko SRAM"}]'),
  ('module-rfid-rc522', 'Module RFID RC522', 4200, null, 'NOUVEAU', 4, 'en_stock', 'SatelliteDish', 'modules-rf',
   'Lecteur/écriture de cartes RFID 13.56MHz.',
   'Module RC522 pour lire et écrire des tags RFID/NFC, utilisé pour les systèmes de contrôle d''accès.',
   '[{"label":"Fréquence","value":"13.56 MHz"},{"label":"Interface","value":"SPI"},{"label":"Portée","value":"~3 cm"},{"label":"Alimentation","value":"3.3V"}]'),
  ('capteur-dht22', 'Capteur DHT22 Température & Humidité', 4800, null, 'NOUVEAU', 5, 'en_stock', 'RadioTower', 'capteurs',
   'Mesure précise de la température et de l''humidité.',
   'Le DHT22 offre une mesure fiable de température et d''humidité relative, idéal pour la domotique.',
   '[{"label":"Température","value":"-40°C à 80°C (±0.5°C)"},{"label":"Humidité","value":"0-100% (±2%)"},{"label":"Interface","value":"1 fil"},{"label":"Alimentation","value":"3.3V - 6V"}]'),
  ('connecteurs-dupont-120', 'Connecteurs Dupont (kit 120pcs)', 3000, null, 'NOUVEAU', 4, 'en_stock', 'Plug', 'connecteurs',
   'Fils de câblage mâle-mâle, mâle-femelle, femelle-femelle.',
   'Kit de 120 câbles Dupont de 20cm, essentiel pour tous vos prototypages sur breadboard.',
   '[{"label":"Quantité","value":"120 câbles"},{"label":"Longueur","value":"20 cm"},{"label":"Types","value":"M-M, M-F, F-F"},{"label":"Pas","value":"2.54 mm"}]')
on conflict (slug) do nothing;
