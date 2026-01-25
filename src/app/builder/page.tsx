'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Component } from './useProducts'
import { ProductsLoader } from './ProductsLoader'

interface SelectedComponents {
  cpu?: Component
  motherboard?: Component
  gpu?: Component
  ram?: Component
  storage?: Component
  psu?: Component
  case?: Component
}

export default function BuilderPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <ProductsLoader categories={['cpu', 'gpu', 'ram', 'motherboard', 'storage', 'psu', 'case']}>
        {({ products, loading, error }) => (
          <BuilderContent products={products} productsError={error} />
        )}
      </ProductsLoader>
    </Suspense>
  )
}

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-6xl mb-4"
        >
          ⚙️
        </motion.div>
        <p className="text-gray-300 text-lg">Učitavanje...</p>
      </div>
    </div>
  )
}

function BuilderContent({ products, productsError }: {
  products: Record<string, Component[]>;
  productsError: string | null;
}) {
  const [step, setStep] = useState(-1)
  const [selected, setSelected] = useState<SelectedComponents>({})
  const [isGenerating, setIsGenerating] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [budget, setBudget] = useState<number>(0)
  const [customBudget, setCustomBudget] = useState<string>('')
  const [buildMode, setBuildMode] = useState<'auto' | 'manual' | null>(null)
  const [isReplacing, setIsReplacing] = useState(false)
  const [shareLink, setShareLink] = useState<string>('')
  const searchParams = useSearchParams()

  // Učitaj konfiguraciju iz URL-a
  useEffect(() => {
    const config = searchParams.get('config')
    if (config) {
      try {
        // Browser-safe base64 decoding
        const decoded = decodeURIComponent(atob(config).split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''))
        const parsed = JSON.parse(decoded)
        
        // Postavi komponente i budžet iz URL-a
        if (parsed.selected) {
          setSelected(parsed.selected)
        }
        if (parsed.budget) {
          setBudget(parsed.budget)
        }
        
        // Ako ima sačuvane konfiguracije, prikaži je direktno
        if (parsed.selected && Object.keys(parsed.selected).length > 0 && parsed.budget) {
          setShowResult(true)
          setStep(6)
          setBuildMode('manual')
        }
      } catch (e) {
        console.error('Greška pri učitavanju konfiguracije:', e)
      }
    }
  }, [searchParams])

  const budgetPresets = [
    { name: 'Početni nivo', amount: 1000, icon: '🌱', description: 'Osnovni PC za svakodnevne potrebe' },
    { name: 'Srednji nivo', amount: 2000, icon: '⚡', description: 'Odličan za gaming i rad' },
    { name: 'Visoki nivo', amount: 3500, icon: '🚀', description: 'High-end performanse' },
    { name: 'Bez limita', amount: 999999, icon: '💎', description: 'Najbolje od najboljeg' },
  ]

  const steps = [
    { title: 'Odabrani Procesor', key: 'cpu', options: products.cpu || [], icon: '🔲' },
    { title: 'Odabrana Matična ploča', key: 'motherboard', options: products.motherboard || [], icon: '🔌' },
    { title: 'Odabrana Grafička', key: 'gpu', options: products.gpu || [], icon: '🎮' },
    { title: 'Odabrani RAM', key: 'ram', options: products.ram || [], icon: '💾' },
    { title: 'Odabrani Storage', key: 'storage', options: products.storage || [], icon: '💿' },
    { title: 'Odabrano Napajanje', key: 'psu', options: products.psu || [], icon: '🔋' },
    { title: 'Odabrano Kućište', key: 'case', options: products.case || [], icon: '📦' },
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
      // Filter only components that fit within target price (strict)
      const affordable = options.filter(opt => opt.price <= targetPrice)
      
      if (affordable.length === 0) {
        // If nothing fits in target, pick the cheapest overall
        return options.reduce((min, current) => current.price < min.price ? current : min)
      }
      
      // Among affordable ones, pick closest to target
      return affordable.reduce((best, current) => {
        const bestDiff = Math.abs(best.price - targetPrice)
        const currentDiff = Math.abs(current.price - targetPrice)
        return currentDiff < bestDiff ? current : best
      })
    }

    return {
      cpu: findBestComponent(products.cpu || [], budgets.cpu),
      motherboard: findBestComponent(products.motherboard || [], budgets.motherboard),
      gpu: findBestComponent(products.gpu || [], budgets.gpu),
      ram: findBestComponent(products.ram || [], budgets.ram),
      storage: findBestComponent(products.storage || [], budgets.storage),
      psu: findBestComponent(products.psu || [], budgets.psu),
      case: findBestComponent(products.case || [], budgets.case)
    }
  }

  const generateShareLink = () => {
    const configData = {
      selected: selected,
      budget: budget
    }
    // Browser-safe base64 encoding
    const jsonString = JSON.stringify(configData)
    const encoded = btoa(encodeURIComponent(jsonString).replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode(parseInt(p1, 16))))
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
    const link = `${baseUrl}/builder?config=${encoded}`
    setShareLink(link)
    return link
  }

  const handleShare = () => {
    const link = generateShareLink()
    if (navigator.share) {
      navigator.share({
        title: 'Moja PC Konfiguracija',
        text: 'Pogledaj moju PC build konfiguraciju!',
        url: link
      })
    } else {
      // Fallback - kopiraj u clipboard
      navigator.clipboard.writeText(link)
      alert('Link je kopiran u clipboard!')
    }
  }

  const currentStep = steps[step]

  const handleSelect = (component: Component) => {
    // Calculate what total would be with this component selected
    const currentComponent = selected[currentStep.key as keyof typeof selected]
    const currentPrice = currentComponent?.price || 0
    const newTotal = totalPrice - currentPrice + (component.price || 0)
    
    // Check budget constraint (unless unlimited budget)
    if (budget < 999999 && newTotal > budget) {
      return // Don't allow selection if it exceeds budget
    }

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

  // Calculate actual minimum needed for remaining steps with some flexibility
  const calculateMinForRemainingSteps = () => {
    let minNeeded = 0
    const remainingSteps = steps.length - step - 1
    
    // On last step (case), no buffer needed - use all remaining budget
    // On last 2 steps, minimal buffer
    // On earlier steps, small buffer
    if (remainingSteps > 2) {
      // Only apply minimal buffer for earlier steps
      for (let i = step + 1; i < steps.length - 1; i++) {
        const stepOptions = steps[i].options
        const cheapest = stepOptions.reduce((min, opt) => opt.price < min.price ? opt : min)
        minNeeded += cheapest.price * 0.5 // 50% of cheapest component
      }
    }
    // For last 2 steps, minNeeded stays 0 or minimal
    return Math.ceil(minNeeded)
  }

  let filteredOptions = selectedBrand 
    ? currentStep?.options.filter(opt => opt.brand === selectedBrand)
    : currentStep?.options

  const minNeededForRest = calculateMinForRemainingSteps()

  filteredOptions = filteredOptions?.map(opt => {
    // Get currently selected component for this step
    const currentComponent = selected[currentStep.key as keyof typeof selected]
    const currentPrice = currentComponent?.price || 0
    
    // Special handling for last step - allow up to remaining budget
    const isLastStep = step === steps.length - 1
    
    let isAffordable = false
    if (currentComponent) {
      // Replacement mode: check if (total - old price + new price) <= budget
      const totalAfterReplacement = totalPrice - currentPrice + opt.price
      isAffordable = budget >= 999999 ? true : (totalAfterReplacement <= budget)
    } else {
      // New selection mode
      if (isLastStep) {
        // On last step, allow any component up to remaining budget
        isAffordable = budget >= 999999 ? true : (opt.price <= remainingBudget)
      } else {
        // On earlier steps, check with buffer for remaining components
        const spaceLeft = budget - totalPrice - minNeededForRest
        isAffordable = budget >= 999999 ? true : (opt.price <= spaceLeft)
      }
    }
    
    return {
      ...opt,
      isAffordable
    }
  })

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
                          const stepIndex = steps.findIndex(s => s.key === key)
                          setStep(stepIndex)
                          setShowResult(false)
                          setIsReplacing(true)
                        }}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
                      >
                        🔄 Zamijeni
                      </motion.button>
                      <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href={component?.url || component?.link || 'https://www.bigbang.hr'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition inline-flex items-center gap-2"
                      >
                        🛒 Kupi na Big Bang
                      </motion.a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="space-y-6">
            {/* Gdje kupiti sekcija */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card bg-gradient-to-br from-green-900/20 via-gray-800 to-gray-950 border-2 border-green-400/50"
            >
              <h3 className="text-2xl font-bold mb-4 text-green-400">🛒 Gdje kupiti komponente u Hrvatskoj</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {[
                  { name: 'Nabava.net', url: 'https://www.nabava.net/' },
                  { name: 'ADM.hr', url: 'https://www.adm.hr/' },
                  { name: 'eKupi.hr', url: 'https://www.ekupi.hr/' },
                  { name: 'BigBang.hr', url: 'https://www.bigbang.hr/' },
                  { name: 'Instar', url: 'https://www.instar-informatika.hr/' },
                  { name: 'Svijet Medija', url: 'https://www.svijet-medija.hr/' },
                  { name: 'Amazon.de', url: 'https://www.amazon.de/' },
                ].map((shop) => (
                  <a
                    key={shop.name}
                    href={shop.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-gray-700/50 hover:bg-green-400/20 border border-green-400/30 hover:border-green-400 rounded-lg transition hover:scale-105 text-center"
                  >
                    <span className="text-sm font-semibold text-gray-300 hover:text-green-300">{shop.name}</span>
                  </a>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-4">💡 Pretraži komponente po marki i modelu na gornjim stranicama</p>
            </motion.div>

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
                  {[
                    { name: 'Nabava.net', url: 'https://www.nabava.net', icon: '🛒' },
                    { name: 'ADM.hr', url: 'https://www.adm.hr', icon: '💻' },
                    { name: 'eKupi.hr', url: 'https://www.ekupi.hr', icon: '🏪' },
                    { name: 'BigBang.hr', url: 'https://www.bigbang.hr', icon: '⚡' },
                    { name: 'Instar', url: 'https://www.instar-informatika.hr', icon: '🔧' },
                    { name: 'Svijet Medija', url: 'https://www.svijet-medija.hr', icon: '📱' },
                    { name: 'Amazon.de', url: 'https://www.amazon.de', icon: '📦' }
                  ].map((shop) => (
                    <a
                      key={shop.name}
                      href={shop.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 bg-gray-700/50 hover:bg-cyan-400/20 border border-cyan-400/30 hover:border-cyan-400 rounded-lg transition hover:scale-105"
                    >
                      {shop.icon} {shop.name}
                    </a>
                  ))}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleShare}
                className="w-full mt-6 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition"
              >
                🔗 Podijeli konfiguraciju
              </motion.button>

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
                  setShareLink('')
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

  // Component replacement screen
  if (isReplacing && step >= 0 && step < steps.length) {
    const currentStep = steps[step]
    const options = currentStep.options
    const selectedComponent = selected[currentStep.key as keyof SelectedComponents]

    return (
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mb-6 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 border-2 border-purple-400/50"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Zamjena komponente</p>
              <p className="text-3xl font-bold text-gray-100">{currentStep.title}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setIsReplacing(false)
                setShowResult(true)
              }}
              className="px-6 py-3 bg-gray-700 text-gray-100 rounded-lg font-semibold hover:bg-gray-600 transition"
            >
              ← Nazad
            </motion.button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {options?.map((option, index) => {
            // In replacement mode, calculate affordability accounting for the old component being removed
            const budgetAfterRemoval = budget - (totalPrice - (selectedComponent?.price || 0))
            const isAffordable = budget >= 999999 ? true : (budgetAfterRemoval - option.price >= 0)
            return (
              <motion.button
                key={option.id}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={isAffordable || budget >= 999999 ? { scale: 1.05, y: -5 } : {}}
                whileTap={isAffordable || budget >= 999999 ? { scale: 0.95 } : {}}
                transition={{ delay: index * 0.05 }}
                onClick={() => {
                  if (isAffordable || budget >= 999999) {
                    const newSelected = { ...selected, [currentStep.key]: option }
                    setSelected(newSelected)
                    setIsReplacing(false)
                    setShowResult(true)
                    setShareLink('') // Resetiraj share link nakon zamjene
                  }
                }}
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
                      {option.price.toLocaleString('hr-HR')} €
                    </motion.span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-100 mb-2">{option.name}</h3>
                  <p className="text-sm text-gray-400 mb-3">{option.specs}</p>
                  {option.reason && (
                    <p className="text-sm text-cyan-300 italic">{option.reason}</p>
                  )}
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>
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
