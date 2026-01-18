'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

interface Component {
  id: string
  name: string
  brand: string
  price: number
  specs: string
  link: string
  reason?: string
  isAffordable?: boolean
}

interface SelectedComponents {
  cpu?: Component
  motherboard?: Component
  gpu?: Component
  ram?: Component
  storage?: Component
  psu?: Component
  case?: Component
}

// Komponente sa detaljnim opisima
const cpuOptions: Component[] = [
  { id: '1', name: 'Ryzen 5 5600', brand: 'AMD', price: 139, specs: '6C/12T, 4.4GHz', link: 'https://www.links.hr/hr/racunala-komponente/procesori-cpu', reason: 'Idealan za početni gaming - najbolji odnos cijene i performansi' },
  { id: '2', name: 'Ryzen 7 7800X3D', brand: 'AMD', price: 439, specs: '8C/16T, 5.0GHz + 3D V-Cache', link: 'https://www.links.hr/hr/racunala-komponente/procesori-cpu', reason: 'Najbolji gaming procesor na tržištu - nenadmašne performanse u igrama' },
  { id: '3', name: 'Ryzen 9 7950X', brand: 'AMD', price: 613, specs: '16C/32T, 5.7GHz', link: 'https://www.links.hr/hr/racunala-komponente/procesori-cpu', reason: 'Top performanse za gaming I kreativni rad' },
  { id: '4', name: 'Core i5-13400F', brand: 'Intel', price: 199, specs: '10C/16T, 4.6GHz', link: 'https://www.nabava.net/', reason: 'Odlična mid-range opcija sa jakim performansama' },
  { id: '5', name: 'Core i7-14700K', brand: 'Intel', price: 426, specs: '20C/28T, 5.6GHz', link: 'https://www.nabava.net/', reason: 'High-end gaming i multitasking powerhouse' },
  { id: '6', name: 'Core i9-14900K', brand: 'Intel', price: 666, specs: '24C/32T, 6.0GHz', link: 'https://www.adm.hr/', reason: 'Ekstremne performanse za profesionalce' },
]

const motherboardOptions: Component[] = [
  { id: '1', name: 'B450 AORUS M', brand: 'Gigabyte', price: 79, specs: 'AMD AM4, DDR4', link: 'https://www.links.hr/hr/racunala-komponente/maticne-ploce', reason: 'Budžet opcija sa osnovnim funkcijama' },
  { id: '2', name: 'B550 GAMING PLUS', brand: 'MSI', price: 119, specs: 'AMD AM4, DDR4, PCIe 4.0', link: 'https://www.links.hr/hr/racunala-komponente/maticne-ploce', reason: 'Odličan balans funkcija za gaming' },
  { id: '3', name: 'B650 AORUS ELITE', brand: 'Gigabyte', price: 199, specs: 'AMD AM5, DDR5, PCIe 5.0', link: 'https://www.adm.hr/', reason: 'Moderna platforma sa podrškom za DDR5' },
  { id: '4', name: 'X670E AORUS MASTER', brand: 'Gigabyte', price: 399, specs: 'AMD AM5, DDR5, Premium', link: 'https://www.adm.hr/', reason: 'Top funkcije i maksimalna proširivost' },
  { id: '5', name: 'B760 GAMING X', brand: 'Gigabyte', price: 159, specs: 'Intel LGA1700, DDR5', link: 'https://www.nabava.net/', reason: 'Solidna mid-range opcija za Intel' },
  { id: '6', name: 'Z790 AORUS MASTER', brand: 'Gigabyte', price: 449, specs: 'Intel LGA1700, Premium', link: 'https://www.nabava.net/', reason: 'Premium funkcije i overclocking potencijal' },
]

const gpuOptions: Component[] = [
  { id: '1', name: 'RTX 3050', brand: 'NVIDIA', price: 259, specs: '8GB GDDR6', link: 'https://www.links.hr/hr/racunala-komponente/graficke-kartice', reason: 'Entry-level gaming na 1080p rezoluciji' },
  { id: '2', name: 'RX 6600', brand: 'AMD', price: 219, specs: '8GB GDDR6', link: 'https://www.nabava.net/', reason: 'Najbolja budžet opcija - odlična cijena/performanse' },
  { id: '3', name: 'RTX 4060 Ti', brand: 'NVIDIA', price: 429, specs: '8GB GDDR6X + DLSS 3', link: 'https://www.links.hr/hr/racunala-komponente/graficke-kartice', reason: 'Savršena za 1440p gaming sa najnovijim tehnologijama' },
  { id: '4', name: 'RX 7800 XT', brand: 'AMD', price: 573, specs: '16GB GDDR6', link: 'https://www.nabava.net/', reason: 'Odličan 1440p gaming sa puno VRAM-a' },
  { id: '5', name: 'RTX 4070', brand: 'NVIDIA', price: 666, specs: '12GB GDDR6X + Ray Tracing', link: 'https://www.links.hr/hr/racunala-komponente/graficke-kartice', reason: 'High-end 1440p i entry 4K gaming' },
  { id: '6', name: 'RTX 4080', brand: 'NVIDIA', price: 1333, specs: '16GB GDDR6X', link: 'https://www.adm.hr/', reason: 'Vrhunske 4K performanse' },
  { id: '7', name: 'RX 7900 XTX', brand: 'AMD', price: 1066, specs: '24GB GDDR6', link: 'https://www.links.hr/hr/racunala-komponente/graficke-kartice', reason: 'Top 4K gaming sa ogromnom količinom memorije' },
]

const ramOptions: Component[] = [
  { id: '1', name: 'Corsair Vengeance 16GB', brand: 'Corsair', price: 53, specs: 'DDR4 3200MHz', link: 'https://www.links.hr/hr/racunala-komponente/memorije-ram', reason: 'Minimum za gaming - pouzdana memorija' },
  { id: '2', name: 'Kingston Fury 16GB', brand: 'Kingston', price: 59, specs: 'DDR4 3600MHz', link: 'https://www.nabava.net/', reason: 'Brža DDR4 opcija za bolje performanse' },
  { id: '3', name: 'Corsair Vengeance 32GB', brand: 'Corsair', price: 119, specs: 'DDR5 6000MHz', link: 'https://www.links.hr/hr/racunala-komponente/memorije-ram', reason: 'Moderna DDR5 za high-end sisteme' },
  { id: '4', name: 'G.Skill Trident Z5 32GB', brand: 'G.Skill', price: 146, specs: 'DDR5 6400MHz + RGB', link: 'https://www.adm.hr/', reason: 'Premium memorija sa RGB osvetljenjem' },
  { id: '5', name: 'Kingston Fury 64GB', brand: 'Kingston', price: 239, specs: 'DDR5 6000MHz', link: 'https://www.nabava.net/', reason: 'Za kreativni rad i teške aplikacije' },
]

const storageOptions: Component[] = [
  { id: '1', name: 'Kingston NV2 500GB', brand: 'Kingston', price: 39, specs: 'NVMe Gen4, 3500MB/s', link: 'https://www.nabava.net/', reason: 'Budžet NVMe - dovoljan za OS i igre' },
  { id: '2', name: 'WD Blue SN580 1TB', brand: 'WD', price: 66, specs: 'NVMe Gen4, 4150MB/s', link: 'https://www.links.hr/hr/racunala-komponente/hard-diskovi-hdd-ssd', reason: 'Solidan mid-range SSD sa dobrim performansama' },
  { id: '3', name: 'Samsung 980 PRO 1TB', brand: 'Samsung', price: 106, specs: 'NVMe Gen4, 7000MB/s', link: 'https://www.links.hr/hr/racunala-komponente/hard-diskovi-hdd-ssd', reason: 'Premium SSD sa vrhunskim brzinama' },
  { id: '4', name: 'WD Black SN850X 2TB', brand: 'WD', price: 199, specs: 'NVMe Gen4, 7300MB/s', link: 'https://www.adm.hr/', reason: 'Top gaming SSD sa velikom količinom prostora' },
  { id: '5', name: 'Crucial P5 Plus 2TB', brand: 'Crucial', price: 173, specs: 'NVMe Gen4, 6600MB/s', link: 'https://www.nabava.net/', reason: 'Odličan balans cijene i performansi za 2TB' },
]

const psuOptions: Component[] = [
  { id: '1', name: 'Cooler Master 550W', brand: 'Cooler Master', price: 53, specs: '550W, 80+ Bronze', link: 'https://www.links.hr/hr/racunala-komponente/napajanja-za-racunala', reason: 'Budžet napajanje za osnovne sisteme' },
  { id: '2', name: 'Corsair CX650', brand: 'Corsair', price: 66, specs: '650W, 80+ Bronze', link: 'https://www.links.hr/hr/racunala-komponente/napajanja-za-racunala', reason: 'Pouzdano napajanje za mid-range gaming' },
  { id: '3', name: 'Seasonic Focus GX-750', brand: 'Seasonic', price: 106, specs: '750W, 80+ Gold', link: 'https://www.adm.hr/', reason: 'Kvalitetno napajanje sa Gold certifikatom' },
  { id: '4', name: 'Corsair RM850x', brand: 'Corsair', price: 133, specs: '850W, 80+ Gold, Modularno', link: 'https://www.links.hr/hr/racunala-komponente/napajanja-za-racunala', reason: 'Premium modularno napajanje za high-end sisteme' },
  { id: '5', name: 'Seasonic Focus GX-1000', brand: 'Seasonic', price: 173, specs: '1000W, 80+ Gold', link: 'https://www.adm.hr/', reason: 'Za najzahtjevnije konfiguracije' },
  { id: '6', name: 'be quiet! Straight Power 11', brand: 'be quiet!', price: 199, specs: '1000W, 80+ Platinum', link: 'https://www.nabava.net/', reason: 'Top tier napajanje - tiho i efikasno' },
]

const caseOptions: Component[] = [
  { id: '1', name: 'Cooler Master Q300L', brand: 'Cooler Master', price: 46, specs: 'Micro-ATX', link: 'https://www.links.hr/hr/racunala-komponente/kucista-za-racunala', reason: 'Kompaktno budžet kućište' },
  { id: '2', name: 'NZXT H510', brand: 'NZXT', price: 79, specs: 'ATX, Minimalistički dizajn', link: 'https://www.nabava.net/', reason: 'Čist dizajn i lako upravljanje kablovima' },
  { id: '3', name: 'Corsair 4000D Airflow', brand: 'Corsair', price: 106, specs: 'ATX, Odlična ventilacija', link: 'https://www.links.hr/hr/racunala-komponente/kucista-za-racunala', reason: 'Izvrsna cirkulacija zraka - hladni sistem' },
  { id: '4', name: 'NZXT H7 Flow', brand: 'NZXT', price: 133, specs: 'ATX, RGB osvetljenje', link: 'https://www.nabava.net/', reason: 'Premium izgled sa RGB detaljima' },
  { id: '5', name: 'Lian Li O11 Dynamic', brand: 'Lian Li', price: 159, specs: 'ATX, Showcase dizajn', link: 'https://www.links.hr/hr/racunala-komponente/kucista-za-racunala', reason: 'Za pokazivanje komponenti - potpuno staklo' },
  { id: '6', name: 'Fractal Torrent', brand: 'Fractal', price: 199, specs: 'ATX, Maksimalna ventilacija', link: 'https://www.adm.hr/', reason: 'Najbolja cirkulacija na tržištu' },
]

export default function Builder() {
  const [step, setStep] = useState(-1)
  const [selected, setSelected] = useState<SelectedComponents>({})
  const [isGenerating, setIsGenerating] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [budget, setBudget] = useState<number>(0)
  const [customBudget, setCustomBudget] = useState<string>('')
  const [buildMode, setBuildMode] = useState<'auto' | 'manual' | null>(null)

  const budgetPresets = [
    { name: 'Početni nivo', amount: 1000, icon: '🌱', description: 'Osnovni PC za svakodnevne potrebe' },
    { name: 'Srednji nivo', amount: 2000, icon: '⚡', description: 'Odličan za gaming i rad' },
    { name: 'Visoki nivo', amount: 3500, icon: '🚀', description: 'High-end performanse' },
    { name: 'Bez limita', amount: 999999, icon: '💎', description: 'Najbolje od najboljeg' },
  ]

  const steps = [
    { title: 'Odabrani Procesor', key: 'cpu', options: cpuOptions, icon: '🔲' },
    { title: 'Odabrana Matična ploča', key: 'motherboard', options: motherboardOptions, icon: '🔌' },
    { title: 'Odabrana Grafička', key: 'gpu', options: gpuOptions, icon: '🎮' },
    { title: 'Odabrani RAM', key: 'ram', options: ramOptions, icon: '💾' },
    { title: 'Odabrani Storage', key: 'storage', options: storageOptions, icon: '💿' },
    { title: 'Odabrano Napajanje', key: 'psu', options: psuOptions, icon: '🔋' },
    { title: 'Odabrano Kućište', key: 'case', options: caseOptions, icon: '📦' },
  ]

  // Funkcija za automatski odabir najboljih komponenti po budžetu
  const autoBuildPC = (targetBudget: number) => {
    const percentages = {
      cpu: 0.20,
      motherboard: 0.10,
      gpu: 0.35,
      ram: 0.10,
      storage: 0.08,
      psu: 0.09,
      case: 0.08
    }

    const budgets = {
      cpu: targetBudget * percentages.cpu,
      motherboard: targetBudget * percentages.motherboard,
      gpu: targetBudget * percentages.gpu,
      ram: targetBudget * percentages.ram,
      storage: targetBudget * percentages.storage,
      psu: targetBudget * percentages.psu,
      case: targetBudget * percentages.case
    }

    const findBestComponent = (options: Component[], targetPrice: number) => {
      return options.reduce((best, current) => {
        const bestDiff = Math.abs(best.price - targetPrice)
        const currentDiff = Math.abs(current.price - targetPrice)
        return currentDiff < bestDiff && current.price <= targetPrice * 1.2 ? current : best
      })
    }

    return {
      cpu: findBestComponent(cpuOptions, budgets.cpu),
      motherboard: findBestComponent(motherboardOptions, budgets.motherboard),
      gpu: findBestComponent(gpuOptions, budgets.gpu),
      ram: findBestComponent(ramOptions, budgets.ram),
      storage: findBestComponent(storageOptions, budgets.storage),
      psu: findBestComponent(psuOptions, budgets.psu),
      case: findBestComponent(caseOptions, budgets.case)
    }
  }

  const currentStep = steps[step]

  const handleSelect = (component: Component) => {
    const newSelected = { ...selected, [currentStep.key]: component }
    setSelected(newSelected)

    if (step < steps.length - 1) {
      setTimeout(() => setStep(step + 1), 300)
    } else {
      setIsGenerating(true)
      setTimeout(() => {
        setIsGenerating(false)
        setShowResult(true)
      }, 3000)
    }
  }

  const handleAutoBuild = () => {
    setIsGenerating(true)
    setBuildMode('auto')
    setTimeout(() => {
      const autoSelected = autoBuildPC(budget)
      setSelected(autoSelected)
      setIsGenerating(false)
      setShowResult(true)
    }, 3500)
  }

  const totalPrice = Object.values(selected).reduce((sum, component) => sum + (component?.price || 0), 0)
  const remainingBudget = budget - totalPrice

  const brands = currentStep?.options.reduce((acc, opt) => {
    if (!acc.includes(opt.brand)) acc.push(opt.brand)
    return acc
  }, [] as string[])

  const [selectedBrand, setSelectedBrand] = useState<string | null>(null)

  let filteredOptions = selectedBrand 
    ? currentStep?.options.filter(opt => opt.brand === selectedBrand)
    : currentStep?.options

  filteredOptions = filteredOptions?.map(opt => ({
    ...opt,
    isAffordable: opt.price <= remainingBudget
  }))

  if (isGenerating) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-[80vh] flex items-center justify-center"
      >
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-32 h-32 border-8 border-cyan-400 border-t-transparent rounded-full mx-auto mb-8"
          />
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold text-gray-100 mb-4"
          >
            {buildMode === 'auto' ? 'Sastavljam savršen PC za tebe...' : 'Generiranje konfiguracije...'}
          </motion.h2>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-xl text-gray-300 mb-2">Analiziram komponente i kompatibilnost</p>
            <p className="text-gray-400">Tražim najbolje cijene u Hrvatskoj</p>
          </motion.div>
        </div>
      </motion.div>
    )
  }

  // Budget selection screen
  if (budget === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-6xl font-bold text-gray-100 mb-4">
            💰 Odaberi svoj budžet
          </h1>
          <p className="text-2xl text-gray-300">
            Koliko možeš odvojiti za svoj novi PC?
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {budgetPresets.map((preset, index) => (
            <motion.button
              key={preset.name}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
              whileTap={{ scale: 0.95 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => {
                setBudget(preset.amount)
                setTimeout(() => setBuildMode(null), 100)
              }}
              className="card hover:scale-105 transform transition-all cursor-pointer border-2 border-transparent hover:border-cyan-400 text-left relative overflow-hidden"
            >
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-gray-500/10"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-3">
                  <motion.span 
                    className="text-5xl"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    {preset.icon}
                  </motion.span>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{preset.name}</h3>
                    <p className="text-gray-700 text-sm">{preset.description}</p>
                  </div>
                </div>
                <p className="text-4xl font-bold text-cyan-500">
                  {preset.amount === 999999 ? '∞' : `${preset.amount.toLocaleString('hr-HR')} €`}
                </p>
              </div>
            </motion.button>
          ))}
        </div>

        <motion.div 
          className="card bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 border-2 border-cyan-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-2xl font-bold text-gray-100 mb-4 flex items-center gap-2">
            <span>✏️</span> Ili unesi vlastiti budžet
          </h3>
          <div className="flex gap-4">
            <input
              type="number"
              value={customBudget}
              onChange={(e) => setCustomBudget(e.target.value)}
              placeholder="npr. 1500"
              className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-600 bg-gray-900 text-gray-100 focus:border-cyan-400 focus:outline-none text-lg placeholder:text-gray-500"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const amount = parseInt(customBudget)
                if (amount && amount > 0) {
                  setBudget(amount)
                  setCustomBudget('')
                }
              }}
              disabled={!customBudget || parseInt(customBudget) <= 0}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Nastavi →
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    )
  }

  // Build mode selection screen
  if (budget > 0 && !buildMode) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-5xl mx-auto"
      >
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-6xl font-bold text-gray-100 mb-4">
            🎯 Kako želiš sastaviti PC?
          </h1>
          <p className="text-2xl text-gray-300">
            Tvoj budžet: <span className="font-bold text-cyan-400">{budget.toLocaleString('hr-HR')} €</span>
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.button
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.03, rotate: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleAutoBuild}
            className="card text-left relative overflow-hidden group border-2 border-transparent hover:border-cyan-400 bg-gray-800"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-gray-600/10 group-hover:from-cyan-400/20 group-hover:to-gray-600/20 transition-all" />
            <div className="relative z-10">
              <motion.div 
                className="text-7xl mb-6"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🤖
              </motion.div>
              <h3 className="text-3xl font-bold text-gray-100 mb-3">
                Automatski sastavi
              </h3>
              <p className="text-lg text-gray-300 mb-6">
                Neka naš AI odabere najbolje komponente za tvoj budžet. Analiziramo hiljade konfiguracija da pronađemo savršen balans performansi i cijene.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-cyan-400">
                  <span>✓</span>
                  <span>Optimizovano za gaming</span>
                </div>
                <div className="flex items-center gap-2 text-cyan-400">
                  <span>✓</span>
                  <span>Provjerena kompatibilnost</span>
                </div>
                <div className="flex items-center gap-2 text-cyan-400">
                  <span>✓</span>
                  <span>Brzo i jednostavno</span>
                </div>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.03, rotate: 1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              setBuildMode('manual')
              setStep(0)
            }}
            className="card text-left relative overflow-hidden group border-2 border-transparent hover:border-cyan-400 bg-gray-800"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gray-600/10 to-cyan-400/10 group-hover:from-gray-600/20 group-hover:to-cyan-400/20 transition-all" />
            <div className="relative z-10">
              <motion.div 
                className="text-7xl mb-6"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🎨
              </motion.div>
              <h3 className="text-3xl font-bold text-gray-100 mb-3">
                Odaberi sam
              </h3>
              <p className="text-lg text-gray-300 mb-6">
                Imaš specifične zahtjeve? Odaberi svaku komponentu sam i napravi PC potpuno po svojoj mjeri. Dobićeš detaljna objašnjenja za svaki izbor.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-cyan-400">
                  <span>✓</span>
                  <span>Puna kontrola</span>
                </div>
                <div className="flex items-center gap-2 text-cyan-400">
                  <span>✓</span>
                  <span>Detaljna objašnjenja</span>
                </div>
                <div className="flex items-center gap-2 text-cyan-400">
                  <span>✓</span>
                  <span>Personalizovano iskustvo</span>
                </div>
              </div>
            </div>
          </motion.button>
        </div>

        <motion.div 
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <button
            onClick={() => {
              setBudget(0)
              setCustomBudget('')
              setStep(-1)
            }}
            className="text-gray-400 hover:text-cyan-400 font-medium"
          >
            ← Promijeni budžet
          </button>
        </motion.div>
      </motion.div>
    )
  }

  if (showResult) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.8, bounce: 0.5 }}
          >
            <h1 className="text-6xl font-bold text-gray-100 mb-4">
              🎉 Vaša PC konfiguracija je spremna!
            </h1>
          </motion.div>
          <motion.p 
            className="text-2xl text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Evo pregleda vaših odabranih komponenti i gdje ih možete kupiti u Hrvatskoj
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {Object.entries(selected).map(([key, component], index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="card relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-gray-600" />
                <div className="pl-4">
                  <p className="text-sm text-gray-400 mb-1">
                    {steps.find(s => s.key === key)?.title}
                  </p>
                  <h3 className="text-2xl font-bold text-gray-100 mb-1">
                    {component?.brand} {component?.name}
                  </h3>
                  <p className="text-sm text-gray-400 mb-2">{component?.specs}</p>
                  {component?.reason && (
                    <motion.div 
                      className="bg-cyan-400/10 border border-cyan-400/30 p-3 rounded-lg mb-3"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                    >
                      <p className="text-sm text-cyan-400 font-medium">
                        💡 Zašto ova komponenta?
                      </p>
                      <p className="text-sm text-gray-300 mt-1">{component.reason}</p>
                    </motion.div>
                  )}
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <p className="text-3xl font-bold text-cyan-400">
                      {component?.price.toLocaleString('hr-HR')} €
                    </p>
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setStep(steps.findIndex(s => s.key === key))
                        }}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
                      >
                        🔄 Zamijeni
                      </motion.button>
                      <a 
                        href={component?.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-cyan-400 text-gray-900 rounded-lg font-semibold hover:bg-cyan-400 transition hover:scale-105 active:scale-95 inline-block"
                      >
                        Pogledaj ponudu →
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="card bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 border-2 border-cyan-400/50 text-white sticky top-24"
            >
              <h3 className="text-3xl font-bold mb-4">Ukupna cijena</h3>
              <motion.p 
                className="text-6xl font-bold mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.7 }}
              >
                {totalPrice.toLocaleString('hr-HR')} €
              </motion.p>
              
              {budget < 999999 && (
                <motion.div 
                  className="mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  <div className="flex justify-between text-sm mb-2">
                    <span>Budžet:</span>
                    <span className="font-bold">{budget.toLocaleString('hr-HR')} €</span>
                  </div>
                  <div className={`flex justify-between text-sm mb-2 ${remainingBudget >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                    <span>Preostalo:</span>
                    <span className="font-bold">{remainingBudget.toLocaleString('hr-HR')} €</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                    <motion.div 
                      className={`h-full rounded-full ${
                        remainingBudget >= 0 ? 'bg-gradient-to-r from-cyan-400 to-cyan-500' : 'bg-gradient-to-r from-red-400 to-red-600'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((totalPrice / budget) * 100, 100)}%` }}
                      transition={{ duration: 1, delay: 1 }}
                    />
                  </div>
                  {remainingBudget < 0 && (
                    <p className="text-red-300 text-sm mt-2">⚠️ Prešao si budžet!</p>
                  )}
                  {remainingBudget >= 0 && (
                    <p className="text-cyan-300 text-sm mt-2">✓ Unutar budžeta!</p>
                  )}
                </motion.div>
              )}
              
              <div className="border-t border-white/20 pt-6">
                <h4 className="font-bold mb-3 text-lg">Gdje kupiti u Hrvatskoj:</h4>
                <div className="space-y-2">
                  {['Links.hr', 'Nabava.net', 'ADM.hr', 'eKupi.hr'].map((shop, idx) => (
                    <a
                      key={shop}
                      href={`https://www.${shop.toLowerCase()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 bg-gray-700/50 hover:bg-cyan-400/20 border border-cyan-400/30 hover:border-cyan-400 rounded-lg transition hover:scale-105"
                    >
                      {['🔗', '🛒', '💻', '🏪'][idx]} {shop}
                    </a>
                  ))}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setStep(-1)
                  setSelected({})
                  setShowResult(false)
                  setBudget(0)
                  setCustomBudget('')
                  setBuildMode(null)
                }}
                className="w-full mt-6 py-3 bg-cyan-400 text-gray-900 rounded-lg font-bold hover:bg-cyan-400 transition"
              >
                Nova konfiguracija
              </motion.button>

              <Link 
                href="/"
                className="block text-center mt-4 text-gray-400 hover:text-cyan-400 transition"
              >
                ← Nazad na početnu
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    )
  }

  // Manual selection
  return (
    <div className="max-w-6xl mx-auto">
      {budget < 999999 && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mb-6 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 border-2 border-cyan-400/50"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Tvoj budžet</p>
              <p className="text-3xl font-bold text-gray-100">{budget.toLocaleString('hr-HR')} €</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400 mb-1">Preostalo</p>
              <p className={`text-3xl font-bold ${remainingBudget >= 0 ? 'text-cyan-400' : 'text-red-400'}`}>
                {remainingBudget.toLocaleString('hr-HR')} €
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400 mb-1">Potrošeno</p>
              <p className="text-3xl font-bold text-cyan-400">{totalPrice.toLocaleString('hr-HR')} €</p>
            </div>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4 mt-4 overflow-hidden">
            <motion.div 
              className={`h-full rounded-full ${
                remainingBudget >= 0 ? 'bg-gradient-to-r from-cyan-400 via-cyan-400 to-cyan-500' : 'bg-gradient-to-r from-red-500 to-red-700'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((totalPrice / budget) * 100, 100)}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>
      )}

      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {steps.map((s, i) => (
            <motion.div 
              key={i} 
              className={`flex-1 text-center ${i <= step ? 'text-cyan-400' : 'text-gray-600'}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <motion.div 
                className="text-3xl mb-1"
                animate={i === step ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.5 }}
              >
                {s.icon}
              </motion.div>
              <div className="text-xs font-medium hidden md:block">{s.title.split(' ')[1]}</div>
            </motion.div>
          ))}
        </div>
        <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
            className="h-full bg-gradient-to-r from-cyan-400 via-cyan-400 to-cyan-500"
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <motion.h2 
            className="text-5xl font-bold text-gray-100 mb-2 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {currentStep?.title}
          </motion.h2>
          <p className="text-xl text-gray-300 text-center mb-8">
            Korak {step + 1} od {steps.length}
          </p>

          <div className="flex gap-2 justify-center mb-6 flex-wrap">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedBrand(null)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                !selectedBrand 
                  ? 'bg-blue-900 text-white' 
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              Sve
            </motion.button>
            {brands?.map(brand => (
              <motion.button
                key={brand}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedBrand(brand)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  selectedBrand === brand 
                      ? 'bg-cyan-400 text-gray-900' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {brand}
              </motion.button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOptions?.map((option, index) => {
              const isAffordable = option.isAffordable
              return (
                <motion.button
                  key={option.id}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  whileHover={isAffordable || budget >= 999999 ? { scale: 1.05, y: -5 } : {}}
                  whileTap={isAffordable || budget >= 999999 ? { scale: 0.95 } : {}}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleSelect(option)}
                  disabled={!isAffordable && budget < 999999}
                  className={`card text-left transform transition-all cursor-pointer border-2 relative overflow-hidden ${
                    !isAffordable && budget < 999999
                      ? 'opacity-50 border-red-400 cursor-not-allowed'
                      : 'border-transparent hover:border-cyan-400 hover:shadow-2xl'
                  }`}
                >
                  {!isAffordable && budget < 999999 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-bold z-10">
                      Izvan budžeta
                    </div>
                  )}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-gray-600/5"
                    whileHover={{ opacity: 1 }}
                    initial={{ opacity: 0 }}
                  />
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-sm font-semibold text-cyan-400 bg-cyan-400/20 border border-cyan-400/30 px-3 py-1 rounded-full">
                        {option.brand}
                      </span>
                      <motion.span 
                        className={`text-2xl font-bold ${!isAffordable && budget < 999999 ? 'text-red-400' : 'text-cyan-400'}`}
                        whileHover={{ scale: 1.1 }}
                      >
                        {option.price} €
                      </motion.span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-100 mb-2">
                      {option.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-3">{option.specs}</p>
                    {option.reason && (
                      <div className="bg-gray-700/50 border border-cyan-400/20 p-3 rounded-lg text-xs text-gray-300">
                        <p className="font-semibold mb-1 text-cyan-400">💡 Prednost:</p>
                        <p>{option.reason}</p>
                      </div>
                    )}
                    {isAffordable && budget < 999999 && (
                      <p className="text-cyan-400 text-xs mt-3 font-semibold flex items-center gap-1">
                        <span>✓</span> Unutar budžeta
                      </p>
                    )}
                  </div>
                </motion.button>
              )
            })}
          </div>

          {step > 0 && (
            <div className="text-center mt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStep(step - 1)}
                className="text-gray-400 hover:text-cyan-400 font-medium px-6 py-2 rounded-lg hover:bg-gray-800 transition"
              >
                ← Nazad
              </motion.button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
