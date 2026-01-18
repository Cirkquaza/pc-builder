'use client'

export default function Info() {
  const componentTypes = [
    {
      name: 'Procesor (CPU)',
      description: 'Centralna procesorska jedinica - "mozak" računara koji izvršava sve instrukcije',
      icon: '🔲',
      details: [
        'Broj jezgara i threadova',
        'Takt frekvencija (GHz)',
        'Socket tip (AM5, LGA1700)',
        'TDP (potrošnja energije)'
      ]
    },
    {
      name: 'Matična ploča',
      description: 'Osnovna ploča koja povezuje sve komponente računara',
      icon: '🔌',
      details: [
        'Chipset i socket',
        'RAM slotovi i maksimalna količina',
        'PCIe slotovi za grafičku',
        'M.2 slotovi za SSD'
      ]
    },
    {
      name: 'RAM memorija',
      description: 'Radna memorija za privremeno skladištenje podataka',
      icon: '💾',
      details: [
        'Kapacitet (GB)',
        'Brzina (MHz)',
        'Tip (DDR4, DDR5)',
        'Latencija (CL)'
      ]
    },
    {
      name: 'Grafička kartica (GPU)',
      description: 'Obrada grafike i prikaz slike na monitoru',
      icon: '🎮',
      details: [
        'VRAM količina',
        'Architektura čipa',
        'Brzina takta',
        'Potrošnja energije (TDP)'
      ]
    },
    {
      name: 'Napajanje (PSU)',
      description: 'Napaja sve komponente električnom energijom',
      icon: '🔋',
      details: [
        'Snaga (W)',
        '80+ certifikacija',
        'Modularnost',
        'Konektori'
      ]
    },
    {
      name: 'Kućište',
      description: 'Fizički okvir koji drži i štiti sve komponente',
      icon: '📦',
      details: [
        'Veličina (ATX, Micro-ATX)',
        'Airflow dizajn',
        'Slotovi za ventilatore',
        'Podrška za hlađenje'
      ]
    }
  ]

  const compatibilityRules = [
    {
      title: 'CPU i Matična ploča',
      rule: 'Socket procesora mora odgovarati socketu matične ploče',
      example: 'Intel i5-14600K zahtijeva LGA1700 socket'
    },
    {
      title: 'RAM i Matična ploča',
      rule: 'Tip RAM-a mora biti kompatibilan sa matičnom pločom',
      example: 'DDR5 RAM ne funkcionira na matičnoj za DDR4'
    },
    {
      title: 'Grafička i Napajanje',
      rule: 'Napajanje mora imati dovoljno snage za GPU',
      example: 'RTX 4090 zahtijeva minimum 850W PSU'
    },
    {
      title: 'Komponente i Kućište',
      rule: 'Sve komponente moraju fizički stati u kućište',
      example: 'ATX matična ploča ne staje u Mini-ITX kućište'
    }
  ]

  return (
    <div className="space-y-16">
      {/* Header sekcija */}
      <section className="text-center">
        <h1 className="text-5xl font-bold mb-4 text-gray-100">
          Informacije o PC Builder-u
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Sve što trebate znati o komponentama računara i kompatibilnosti
        </p>
      </section>

      {/* O aplikaciji */}
      <section className="card">
        <h2 className="text-3xl font-bold mb-6 text-gray-100">
          Šta je PC Builder?
        </h2>
        <div className="prose prose-lg max-w-none text-gray-300">
          <p className="text-lg leading-relaxed mb-4">
            PC Builder je napredna web aplikacija dizajnirana da pojednostavi proces 
            odabira i sastavljanja računarskih komponenti. Bilo da ste iskusan korisnik 
            ili početnik, naša aplikacija vam omogućava da:
          </p>
          <ul className="space-y-2 text-lg">
            <li>✓ Pretražite i uporedite hiljade komponenti</li>
            <li>✓ Automatski provjerite kompatibilnost između komponenti</li>
            <li>✓ Pratite ukupnu cijenu u realnom vremenu</li>
            <li>✓ Procjenite potrošnju energije sistema</li>
            <li>✓ Spremite i dijelite svoje konfiguracije</li>
          </ul>
        </div>
      </section>

      {/* Tipovi komponenti */}
      <section>
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-100">
          Tipovi komponenti
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {componentTypes.map((component, index) => (
            <div key={index} className="card">
              <div className="text-4xl mb-4">{component.icon}</div>
              <h3 className="text-2xl font-bold mb-2 text-gray-100">
                {component.name}
              </h3>
              <p className="text-gray-300 mb-4">{component.description}</p>
              <div className="border-t border-gray-700 pt-4 mt-4">
                <p className="font-semibold text-cyan-400 mb-2">Važni parametri:</p>
                <ul className="space-y-1 text-sm text-gray-400">
                  {component.details.map((detail, idx) => (
                    <li key={idx}>• {detail}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pravila kompatibilnosti */}
      <section className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-12 border border-cyan-400/30">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-100">
          Pravila kompatibilnosti
        </h2>
        <p className="text-center text-lg text-gray-300 mb-8 max-w-3xl mx-auto">
          PC Builder automatski provjerava ova pravila da osigura da su sve 
          vaše komponente kompatibilne
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {compatibilityRules.map((rule, index) => (
            <div key={index} className="bg-gray-950 rounded-xl p-6 shadow-md border border-cyan-400/20">
              <h3 className="text-xl font-bold mb-2 text-cyan-400">
                {rule.title}
              </h3>
              <p className="text-gray-300 mb-3">{rule.rule}</p>
              <div className="bg-gray-800/50 rounded-lg p-3 border-l-4 border-cyan-400">
                <p className="text-sm text-gray-400">
                  <span className="font-semibold text-cyan-400">Primjer:</span> {rule.example}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="card">
        <h2 className="text-3xl font-bold mb-8 text-gray-100">
          Često postavljana pitanja
        </h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold mb-2 text-cyan-400">
              Da li moram biti stručnjak da koristim PC Builder?
            </h3>
            <p className="text-gray-300">
              Ne! Naša aplikacija je dizajnirana i za početnike i za iskusne korisnike. 
              Automatska provjera kompatibilnosti će vas voditi kroz proces.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2 text-cyan-400">
              Koliko košta korištenje aplikacije?
            </h3>
            <p className="text-gray-300">
              PC Builder je potpuno besplatan za korištenje. Cijene komponenti 
              prikazane u aplikaciji su informativne prirode.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2 text-cyan-400">
              Odakle dolaze podaci o komponentama?
            </h3>
            <p className="text-gray-300">
              Našu bazu podataka redovno ažuriramo sa najnovijim komponentama 
              od vodećih proizvođača i prodavaca.
            </p>
          </div>
        </div>
      </section>

      {/* Autori */}
      <section className="bg-gray-800/50 rounded-2xl p-12 border border-purple-400/30">
        <h2 className="text-3xl font-bold mb-8 text-purple-400 text-center">
          👥 O Projektu
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2 text-white">Luka Ćirković</h3>
            <p className="text-cyan-300 mb-4">GitHub: Cirkquaza</p>
            <p className="text-gray-300">Glavni developer</p>
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2 text-white">Stipe Barišić</h3>
            <p className="text-cyan-300 mb-4">GitHub: stipzard</p>
            <p className="text-gray-300">Glavni developer</p>
          </div>
        </div>
        <p className="text-center text-gray-400 mt-8 text-sm">
          PC Builder je timski projekat kreiran 2026. godine
        </p>
      </section>

      {/* CTA */}
      <section className="text-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-12 text-white border border-cyan-400/30">
        <h2 className="text-3xl font-bold mb-4">
          Spremni da započnete?
        </h2>
        <p className="text-xl mb-8 opacity-90">
          Sastavite svoj idealan računar uz našu pomoć!
        </p>
        <a href="/" className="btn-primary">
          Nazad na početnu
        </a>
      </section>
    </div>
  )
}
