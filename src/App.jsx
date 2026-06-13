import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Settings, 
  Plus, 
  Trash2, 
  Coffee, 
  Train, 
  ShoppingBag, 
  MoreHorizontal, 
  Users, 
  MapPin,
  X,
  RefreshCw,
  PieChart,
  Share2,
  Copy,
  Download,
  AlertCircle,
  CheckCircle2,
  Wallet
} from 'lucide-react';

// 預設匯率 (相對於港幣 HKD)
const DEFAULT_RATES = {
  HKD: 1,
  USD: 0.128,
  JPY: 19.8,
  CNY: 0.92,
};

const CURRENCIES = [
  { code: 'HKD', name: '港幣 (HKD)', symbol: 'HK$' },
  { code: 'USD', name: '美元 (USD)', symbol: 'US$' },
  { code: 'JPY', name: '日元 (JPY)', symbol: '¥' },
  { code: 'CNY', name: '人民幣 (CNY)', symbol: '¥' },
];

const CATEGORIES = [
  { id: 'dining', name: '餐飲', icon: Coffee, color: 'bg-orange-100 text-orange-600', border: 'border-orange-200' },
  { id: 'transport', name: '交通', icon: Train, color: 'bg-blue-100 text-blue-600', border: 'border-blue-200' },
  { id: 'shopping', name: '購物', icon: ShoppingBag, color: 'bg-pink-100 text-pink-600', border: 'border-pink-200' },
  { id: 'others', name: '其他雜項', icon: MoreHorizontal, color: 'bg-gray-100 text-gray-600', border: 'border-gray-200' },
];

export default function App() {
  // 基本設定狀態
  const [tripName, setTripName] = useState('澳門一天遊');
  const [tripDays, setTripDays] = useState(1);
  const [peopleCount, setPeopleCount] = useState(4);
  const [splitCount, setSplitCount] = useState(2); 
  
  // 檢視模式：'total' = 總數, 'daily' = 每日
  const [viewMode, setViewMode] = useState('total');

  // 記帳狀態
  const [expenses, setExpenses] = useState([]);
  
  // 匯率與貨幣狀態
  const [baseCurrency, setBaseCurrency] = useState('HKD');
  const [targetCurrency, setTargetCurrency] = useState('HKD');
  const [exchangeRates, setExchangeRates] = useState(DEFAULT_RATES);
  
  // Modal 狀態
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  // 新增記帳表單狀態
  const [amount, setAmount] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState('dining');

  // 分享/匯入狀態
  const [importText, setImportText] = useState('');
  const [syncMessage, setSyncMessage] = useState({ type: '', text: '' }); 

  // 自動同步人數與分攤份數
  useEffect(() => {
    if (peopleCount > 0 && splitCount === 0) {
      setSplitCount(peopleCount);
    }
  }, [peopleCount, splitCount]);

  // 清除提示訊息
  useEffect(() => {
    if (syncMessage.text) {
      const timer = setTimeout(() => setSyncMessage({ type: '', text: '' }), 3000);
      return () => clearTimeout(timer);
    }
  }, [syncMessage]);

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || amount <= 0) return;

    const newExpense = {
      id: Date.now().toString(),
      amount: parseFloat(amount),
      desc: desc || CATEGORIES.find(c => c.id === category)?.name || '未命名項目',
      category: category,
      timestamp: new Date().toISOString()
    };

    setExpenses([newExpense, ...expenses]);
    setAmount('');
    setDesc('');
  };

  const handleDelete = (id) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  // 基本計算
  const totalExpense = useMemo(() => {
    return expenses.reduce((sum, item) => sum + item.amount, 0);
  }, [expenses]);

  const averageExpense = useMemo(() => {
    return splitCount > 0 ? (totalExpense / splitCount) : 0;
  }, [totalExpense, splitCount]);

  const displayTotal = viewMode === 'total' ? totalExpense : (tripDays > 0 ? totalExpense / tripDays : 0);
  const displayAverage = viewMode === 'total' ? averageExpense : (tripDays > 0 ? averageExpense / tripDays : 0);

  // 匯率轉換計算
  const convertCurrency = (amount, from, to) => {
    if (from === to) return amount;
    const amountInHKD = amount / exchangeRates[from];
    return amountInHKD * exchangeRates[to];
  };

  // 產生匯出代碼
  const generateExportCode = () => {
    const payload = {
      version: '1.0',
      tripName,
      tripDays,
      peopleCount,
      splitCount,
      baseCurrency,
      exchangeRates,
      expenses
    };
    return btoa(encodeURIComponent(JSON.stringify(payload)));
  };

  // 複製代碼到剪貼簿
  const copyToClipboard = () => {
    const code = generateExportCode();
    const textArea = document.createElement("textarea");
    textArea.value = code;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      setSyncMessage({ type: 'success', text: '行程代碼已複製！請貼給您的旅伴。' });
    } catch (err) {
      setSyncMessage({ type: 'error', text: '複製失敗，請手動全選下方代碼複製。' });
    }
    document.body.removeChild(textArea);
  };

  // 匯入資料
  const handleImport = () => {
    if (!importText.trim()) {
      setSyncMessage({ type: 'error', text: '請先貼上代碼' });
      return;
    }

    try {
      const jsonString = decodeURIComponent(atob(importText.trim()));
      const data = JSON.parse(jsonString);

      if (data && data.version) {
        setTripName(data.tripName || '未命名行程');
        setTripDays(data.tripDays || 1);
        setPeopleCount(data.peopleCount || 4);
        setSplitCount(data.splitCount || 2);
        setBaseCurrency(data.baseCurrency || 'HKD');
        if (data.exchangeRates) setExchangeRates(data.exchangeRates);
        if (data.expenses && Array.isArray(data.expenses)) setExpenses(data.expenses);
        
        setImportText('');
        setSyncMessage({ type: 'success', text: '成功載入旅伴的行程資料！' });
        setTimeout(() => setIsShareOpen(false), 1500);
      } else {
        throw new Error('格式錯誤');
      }
    } catch (e) {
      setSyncMessage({ type: 'error', text: '代碼無效或已損毀，請確認是否複製完整。' });
    }
  };

  const currentSymbol = CURRENCIES.find(c => c.code === baseCurrency)?.symbol || '$';
  const targetSymbol = CURRENCIES.find(c => c.code === targetCurrency)?.symbol || '$';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-20">
      {/* 頂部導航列 - 顯示 App 名稱 */}
      <header className="bg-teal-600 text-white p-4 shadow-md sticky top-0 z-10">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="bg-teal-500 p-1.5 rounded-lg shadow-inner">
              <Wallet size={22} className="text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-wide">旅遊夾錢</h1>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setIsShareOpen(true)} className="p-2 hover:bg-teal-700 rounded-full transition">
              <Share2 size={22} />
            </button>
            <button onClick={() => setIsSettingsOpen(true)} className="p-2 hover:bg-teal-700 rounded-full transition">
              <Settings size={22} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6">
        
        {/* 基本設定卡片 */}
        <section className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          
          {/* 行程名稱輸入區 */}
          <div className="mb-5">
            <label className="block text-xs font-medium text-slate-500 mb-1.5">行程名稱</label>
            <div className="relative">
              <MapPin size={18} className="absolute left-3 top-3 text-teal-600" />
              <input
                type="text"
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 font-bold text-slate-700 focus:ring-2 focus:ring-teal-500 focus:outline-none transition-colors"
                placeholder="輸入行程名稱..."
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">天數</label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  value={tripDays}
                  onChange={(e) => setTripDays(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none text-center"
                />
                <span className="absolute right-2 top-2.5 text-slate-400 text-sm">天</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">總人數</label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  value={peopleCount}
                  onChange={(e) => setPeopleCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none text-center"
                />
                <span className="absolute right-2 top-2.5 text-slate-400 text-sm">人</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">分攤份數</label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  value={splitCount}
                  onChange={(e) => setSplitCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none text-center"
                />
                <span className="absolute right-2 top-2.5 text-slate-400 text-sm">份</span>
              </div>
            </div>
          </div>
          {peopleCount !== splitCount && (
            <p className="text-xs text-orange-600 mt-4 bg-orange-50/80 p-2.5 rounded-lg border border-orange-100 flex items-start gap-1.5">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <span>目前設定為 {peopleCount} 人同行，但總金額將會除以 {splitCount} 份計算。</span>
            </p>
          )}
        </section>

        {/* 總覽與匯率卡片 */}
        <section className="bg-gradient-to-br from-teal-500 to-teal-700 rounded-2xl p-6 shadow-lg text-white relative">
          
          <div className="flex bg-teal-800/50 rounded-lg p-1 mb-5 w-max">
            <button 
              onClick={() => setViewMode('total')} 
              className={`px-4 py-1.5 rounded-md text-sm transition-colors ${viewMode === 'total' ? 'bg-white text-teal-700 font-bold shadow-sm' : 'text-teal-100 hover:text-white'}`}
            >
              總計支出
            </button>
            <button 
              onClick={() => setViewMode('daily')} 
              className={`px-4 py-1.5 rounded-md text-sm transition-colors ${viewMode === 'daily' ? 'bg-white text-teal-700 font-bold shadow-sm' : 'text-teal-100 hover:text-white'}`}
            >
              每日平均
            </button>
          </div>

          <div className="flex justify-between items-start mb-4">
            <div className="flex-1 overflow-hidden">
              <p className="text-teal-100 text-sm mb-1 truncate">
                {viewMode === 'total' ? `總支出 (${baseCurrency})` : `每日總計 (${baseCurrency})`}
              </p>
              <h1 className="text-4xl font-bold tracking-tight truncate">
                <span className="text-2xl mr-1">{currentSymbol}</span>
                {displayTotal.toLocaleString('zh-HK', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
              </h1>
            </div>
            <div className="text-right flex-1 overflow-hidden pl-2">
              <p className="text-teal-100 text-sm mb-1 truncate">
                {viewMode === 'total' ? '每份總平均' : '每份每日平均'}
              </p>
              <h2 className="text-2xl font-bold truncate">
                <span className="text-lg mr-1">{currentSymbol}</span>
                {displayAverage.toLocaleString('zh-HK', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
              </h2>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-teal-400/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RefreshCw size={16} className="text-teal-200" />
              <span className="text-sm text-teal-100">換算</span>
              <select 
                value={targetCurrency}
                onChange={(e) => setTargetCurrency(e.target.value)}
                className="bg-teal-800/50 text-white text-sm border-none rounded-lg px-2 py-1 focus:ring-0 cursor-pointer w-20"
              >
                {CURRENCIES.map(c => (
                  <option key={c.code} value={c.code}>{c.code}</option>
                ))}
              </select>
            </div>
            {targetCurrency !== baseCurrency && (
              <div className="font-semibold text-lg truncate pl-2 max-w-[50%]">
                {targetSymbol} {convertCurrency(displayTotal, baseCurrency, targetCurrency).toLocaleString('zh-HK', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
              </div>
            )}
          </div>
        </section>

        {/* 新增記帳表單 */}
        <section className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h2 className="text-slate-700 font-semibold mb-4 flex items-center gap-2">
            <Plus size={20} className="text-teal-600"/>
            新增支出
          </h2>
          <form onSubmit={handleAddExpense} className="space-y-4">
            <div className="flex gap-2">
              {CATEGORIES.map(cat => {
                const Icon = cat.icon;
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`flex-1 flex flex-col items-center justify-center py-3 rounded-xl border transition-all ${
                      isSelected ? `${cat.color} ${cat.border} ring-2 ring-offset-1 ring-${cat.color.split('-')[1]}-400` : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    <Icon size={24} className="mb-1" />
                    <span className="text-xs font-medium">{cat.name}</span>
                  </button>
                );
              })}
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <input
                  type="text"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="項目描述 (選填)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:outline-none text-slate-700"
                />
              </div>
              <div className="col-span-1 relative">
                <input
                  type="number"
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="金額"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-3 focus:ring-2 focus:ring-teal-500 focus:outline-none text-slate-700 font-semibold"
                  required
                />
                <span className="absolute left-3 top-3 text-slate-400">{currentSymbol}</span>
              </div>
            </div>
            
            <button 
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-xl transition-colors shadow-sm flex justify-center items-center gap-2"
            >
              <Plus size={20} />
              加入帳單
            </button>
          </form>
        </section>

        {/* 支出明細列表 */}
        <section>
          <h2 className="text-slate-700 font-semibold mb-3 flex items-center gap-2 px-1">
            <PieChart size={20} className="text-teal-600"/>
            支出明細
          </h2>
          {expenses.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-100 border-dashed">
              <p className="text-slate-400">目前還沒有任何支出記錄喔！</p>
            </div>
          ) : (
            <div className="space-y-3">
              {expenses.map(item => {
                const catInfo = CATEGORIES.find(c => c.id === item.category) || CATEGORIES[3];
                const Icon = catInfo.icon;
                return (
                  <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between group">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className={`p-3 rounded-full shrink-0 ${catInfo.color}`}>
                        <Icon size={20} />
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-semibold text-slate-700 truncate">{item.desc}</p>
                        <p className="text-xs text-slate-400">{catInfo.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 pl-2 shrink-0">
                      <span className="font-bold text-slate-700">
                        {currentSymbol} {item.amount.toLocaleString('zh-HK')}
                      </span>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="text-slate-300 hover:text-red-500 p-1 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* 分享與匯入 Modal */}
      {isShareOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full sm:w-[400px] rounded-t-2xl sm:rounded-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto slide-in-from-bottom-full sm:slide-in-from-bottom-0">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Share2 size={24} className="text-teal-600"/> 分享與匯入
              </h2>
              <button onClick={() => setIsShareOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full p-1">
                <X size={20} />
              </button>
            </div>

            {/* 狀態提示 */}
            {syncMessage.text && (
              <div className={`p-3 rounded-xl mb-4 flex items-start gap-2 ${syncMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {syncMessage.type === 'success' ? <CheckCircle2 size={20} className="shrink-0 mt-0.5" /> : <AlertCircle size={20} className="shrink-0 mt-0.5" />}
                <p className="text-sm">{syncMessage.text}</p>
              </div>
            )}

            <div className="space-y-6">
              {/* 匯出區塊 */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <h3 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Download size={18} className="text-slate-500" /> 匯出給旅伴
                </h3>
                <p className="text-xs text-slate-500 mb-3">
                  複製下方的代碼並傳給朋友，他們貼上即可載入目前的帳單。
                </p>
                <div className="relative">
                  <textarea 
                    readOnly
                    value={generateExportCode()}
                    className="w-full bg-slate-200/50 text-slate-400 text-xs rounded-lg p-3 h-16 resize-none focus:outline-none break-all"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50/90 pointer-events-none rounded-lg" />
                </div>
                <button 
                  onClick={copyToClipboard}
                  className="w-full mt-2 bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 rounded-lg transition-colors flex justify-center items-center gap-2 text-sm"
                >
                  <Copy size={16} />
                  複製行程代碼
                </button>
              </div>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink-0 mx-4 text-slate-400 text-xs">或</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              {/* 匯入區塊 */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <h3 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Download size={18} className="text-slate-500 rotate-180" /> 從旅伴匯入
                </h3>
                <p className="text-xs text-slate-500 mb-3 text-red-500/80">
                  注意：匯入將會覆蓋您目前的帳單與設定！
                </p>
                <textarea 
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder="在此貼上朋友傳給您的行程代碼..."
                  className="w-full bg-white border border-slate-200 text-slate-700 text-sm rounded-lg p-3 h-24 resize-none focus:ring-2 focus:ring-teal-500 focus:outline-none mb-2"
                />
                <button 
                  onClick={handleImport}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-2.5 rounded-lg transition-colors text-sm"
                >
                  覆蓋並匯入資料
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 設定 Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full sm:w-[400px] rounded-t-2xl sm:rounded-2xl p-6 shadow-xl slide-in-from-bottom-full sm:slide-in-from-bottom-0">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">偏好設定</h2>
              <button onClick={() => setIsSettingsOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full p-1">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">記帳主要貨幣</label>
                <select 
                  value={baseCurrency}
                  onChange={(e) => setBaseCurrency(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 outline-none"
                >
                  {CURRENCIES.map(c => (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 mt-2">所有的記帳輸入都會以此貨幣為單位。</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">匯率設定 (相對於港幣 HKD)</label>
                <div className="space-y-3">
                  {Object.entries(exchangeRates).map(([currency, rate]) => {
                    if (currency === 'HKD') return null;
                    return (
                      <div key={currency} className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <span className="text-sm font-medium text-slate-600 w-16">{currency}</span>
                        <input 
                          type="number"
                          step="any"
                          value={rate}
                          onChange={(e) => {
                            const newRate = parseFloat(e.target.value) || 0;
                            setExchangeRates(prev => ({ ...prev, [currency]: newRate }));
                          }}
                          className="w-24 text-right bg-white border border-slate-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                        />
                      </div>
                    )
                  })}
                </div>
                <p className="text-xs text-slate-400 mt-3">
                  * 此處可以手動調整匯率以符合您目前的實際兌換率。
                </p>
              </div>
            </div>

            <button 
              onClick={() => setIsSettingsOpen(false)}
              className="w-full bg-slate-800 text-white font-semibold py-3 rounded-xl mt-8 hover:bg-slate-700 transition"
            >
              完成設定
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
