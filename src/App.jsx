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
  Wallet,
  Globe
} from 'lucide-react';

// 預設匯率 (相對於港幣 HKD，作為內部計算基準)
const DEFAULT_RATES = {
  HKD: 1,
  USD: 0.128,
  JPY: 19.8,
  CNY: 0.92,
  TWD: 4.15,
};

const CURRENCIES = [
  { code: 'HKD', name: '港幣', symbol: 'HK$' },
  { code: 'USD', name: '美元', symbol: 'US$' },
  { code: 'JPY', name: '日圓', symbol: '¥' },
  { code: 'CNY', name: '人民幣', symbol: '¥' },
  { code: 'TWD', name: '台幣', symbol: 'NT$' },
];

const CATEGORIES = [
  { id: 'dining', name: '餐飲', icon: Coffee, color: 'bg-orange-100 text-orange-600', border: 'border-orange-200' },
  { id: 'transport', name: '交通', icon: Train, color: 'bg-blue-100 text-blue-600', border: 'border-blue-200' },
  { id: 'shopping', name: '購物', icon: ShoppingBag, color: 'bg-pink-100 text-pink-600', border: 'border-pink-200' },
  { id: 'others', name: '其他', icon: MoreHorizontal, color: 'bg-gray-100 text-gray-600', border: 'border-gray-200' },
];

const STORAGE_KEY = 'trip_splitter_data_v2';

export default function App() {
  const [tripName, setTripName] = useState('日本關西五日遊');
  const [tripDays, setTripDays] = useState(5);
  const [peopleCount, setPeopleCount] = useState(4);
  const [splitCount, setSplitCount] = useState(4); 
  const [viewMode, setViewMode] = useState('total'); 
  const [expenses, setExpenses] = useState([]); 
  const [baseCurrency, setBaseCurrency] = useState('JPY'); 
  const [targetCurrency, setTargetCurrency] = useState('HKD');
  const [exchangeRates, setExchangeRates] = useState(DEFAULT_RATES);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState('dining');
  const [importText, setImportText] = useState('');
  const [syncMessage, setSyncMessage] = useState({ type: '', text: '' });

  const convertCurrency = (amount, fromCode, toCode) => {
    if (fromCode === toCode) return amount;
    const amountInHKD = amount / exchangeRates[fromCode];
    return amountInHKD * exchangeRates[toCode];
  };

  useEffect(() => {
    const loadData = () => {
      try {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          setTripName(parsedData.tripName || '未命名行程');
          setTripDays(parsedData.tripDays || 1);
          setPeopleCount(parsedData.peopleCount || 4);
          setSplitCount(parsedData.splitCount || 2);
          setViewMode(parsedData.viewMode || 'total');
          setBaseCurrency(parsedData.baseCurrency || 'HKD');
          setTargetCurrency(parsedData.targetCurrency || 'HKD');
          setExchangeRates(prev => ({ ...prev, ...parsedData.exchangeRates }));
          
          if (Array.isArray(parsedData.expenses)) {
            setExpenses(parsedData.expenses);
          }
        }
      } catch (error) {
        console.error("讀取儲存資料失敗:", error);
      } finally {
        setIsDataLoaded(true);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (isDataLoaded) {
      const dataToSave = {
        tripName, tripDays, peopleCount, splitCount, viewMode, 
        expenses, baseCurrency, targetCurrency, exchangeRates
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    }
  }, [isDataLoaded, tripName, tripDays, peopleCount, splitCount, viewMode, expenses, baseCurrency, targetCurrency, exchangeRates]);

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
      originalAmount: parseFloat(amount),
      originalCurrency: baseCurrency,
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

  const totalExpenseInBase = useMemo(() => {
    return expenses.reduce((sum, item) => {
      const convertedAmount = convertCurrency(item.originalAmount, item.originalCurrency, baseCurrency);
      return sum + convertedAmount;
    }, 0);
  }, [expenses, baseCurrency, exchangeRates]);

  const averageExpenseInBase = useMemo(() => {
    return splitCount > 0 ? (totalExpenseInBase / splitCount) : 0;
  }, [totalExpenseInBase, splitCount]);

  const displayTotal = viewMode === 'total' ? totalExpenseInBase : (tripDays > 0 ? totalExpenseInBase / tripDays : 0);
  const displayAverage = viewMode === 'total' ? averageExpenseInBase : (tripDays > 0 ? averageExpenseInBase / tripDays : 0);

  const generateExportCode = () => {
    const payload = {
      version: '2.0',
      tripName, tripDays, peopleCount, splitCount, 
      baseCurrency, exchangeRates, expenses
    };
    return btoa(encodeURIComponent(JSON.stringify(payload)));
  };

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
  
  const handleResetTrip = () => {
    if (window.confirm('確定要清除所有帳單並開啟新行程嗎？此動作無法復原。')) {
        setTripName('新行程');
        setTripDays(1);
        setPeopleCount(4);
        setSplitCount(4);
        setExpenses([]);
        setIsSettingsOpen(false);
    }
  };

  const currentSymbol = CURRENCIES.find(c => c.code === baseCurrency)?.symbol || '$';
  const targetSymbol = CURRENCIES.find(c => c.code === targetCurrency)?.symbol || '$';

  if (!isDataLoaded) return <div className="min-h-screen bg-slate-50 flex justify-center items-center">載入中...</div>;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-20">
      <header className="bg-teal-600 text-white p-4 shadow-md sticky top-0 z-10">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="bg-teal-500 p-1.5 rounded-lg shadow-inner">
              <Wallet size={22} className="text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-wide">旅遊夾錢</h1>
          </div>
          <div className="flex items-center gap-1">
            <div className="relative mr-1 bg-teal-700/50 rounded-full flex items-center px-2 py-1">
              <Globe size={16} className="text-teal-200 mr-1" />
              <select 
                value={baseCurrency}
                onChange={(e) => setBaseCurrency(e.target.value)}
                className="bg-transparent text-white font-semibold text-sm border-none focus:ring-0 cursor-pointer appearance-none pr-1 outline-none"
              >
                {CURRENCIES.map(c => (
                  <option key={c.code} value={c.code} className="text-slate-800">{c.code}</option>
                ))}
              </select>
            </div>
            <button onClick={() => setIsShareOpen(true)} className="p-2 hover:bg-teal-700 rounded-full transition">
              <Share2 size={20} />
            </button>
            <button onClick={() => setIsSettingsOpen(true)} className="p-2 hover:bg-teal-700 rounded-full transition">
              <Settings size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6">
        <section className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
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
                <input type="number" min="1" value={tripDays} onChange={(e) => setTripDays(Math.max(1, parseInt(e.target.value) || 1))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none text-center" />
                <span className="absolute right-2 top-2.5 text-slate-400 text-sm">天</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">總人數</label>
              <div className="relative">
                <input type="number" min="1" value={peopleCount} onChange={(e) => setPeopleCount(Math.max(1, parseInt(e.target.value) || 1))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none text-center" />
                <span className="absolute right-2 top-2.5 text-slate-400 text-sm">人</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">分攤份數</label>
              <div className="relative">
                <input type="number" min="1" value={splitCount} onChange={(e) => setSplitCount(Math.max(1, parseInt(e.target.value) || 1))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none text-center" />
                <span className="absolute right-2 top-2.5 text-slate-400 text-sm">份</span>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-br from-teal-500 to-teal-700 rounded-2xl p-6 shadow-lg text-white relative">
          <div className="flex bg-teal-800/50 rounded-lg p-1 mb-5 w-max">
            <button onClick={() => setViewMode('total')} className={`px-4 py-1.5 rounded-md text-sm transition-colors ${viewMode === 'total' ? 'bg-white text-teal-700 font-bold shadow-sm' : 'text-teal-100 hover:text-white'}`}>總計支出</button>
            <button onClick={() => setViewMode('daily')} className={`px-4 py-1.5 rounded-md text-sm transition-colors ${viewMode === 'daily' ? 'bg-white text-teal-700 font-bold shadow-sm' : 'text-teal-100 hover:text-white'}`}>每日平均</button>
          </div>

          <div className="flex justify-between items-start mb-4">
            <div className="flex-1 overflow-hidden">
              <p className="text-teal-100 text-sm mb-1 truncate">{viewMode === 'total' ? `總支出 (${baseCurrency})` : `每日總計 (${baseCurrency})`}</p>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight truncate">
                <span className="text-xl mr-1">{currentSymbol}</span>
                {displayTotal.toLocaleString('zh-HK', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
              </h1>
            </div>
            <div className="text-right flex-1 overflow-hidden pl-2">
              <p className="text-teal-100 text-sm mb-1 truncate">{viewMode === 'total' ? '每份總平均' : '每份每日平均'}</p>
              <h2 className="text-2xl font-bold truncate">
                <span className="text-lg mr-1">{currentSymbol}</span>
                {displayAverage.toLocaleString('zh-HK', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
              </h2>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-teal-400/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RefreshCw size={16} className="text-teal-200" />
              <span className="text-sm text-teal-100">外幣換算</span>
              <select value={targetCurrency} onChange={(e) => setTargetCurrency(e.target.value)} className="bg-teal-800/50 text-white text-sm border-none rounded-lg px-2 py-1 focus:ring-0 cursor-pointer w-20">
                {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
              </select>
            </div>
            {targetCurrency !== baseCurrency && (
              <div className="font-semibold text-lg truncate pl-2 max-w-[50%]">
                {targetSymbol} {convertCurrency(displayTotal, baseCurrency, targetCurrency).toLocaleString('zh-HK', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
              </div>
            )}
          </div>
        </section>

        <section className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h2 className="text-slate-700 font-semibold mb-4 flex items-center gap-2">
            <Plus size={20} className="text-teal-600"/>
            新增支出 ({baseCurrency})
          </h2>
          <form onSubmit={handleAddExpense} className="space-y-4">
            <div className="flex gap-2">
              {CATEGORIES.map(cat => {
                const Icon = cat.icon;
                const isSelected = category === cat.id;
                return (
                  <button key={cat.id} type="button" onClick={() => setCategory(cat.id)} className={`flex-1 flex flex-col items-center justify-center py-3 rounded-xl border transition-all ${isSelected ? `${cat.color} ${cat.border} ring-2 ring-offset-1 ring-${cat.color.split('-')[1]}-400` : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'}`}>
                    <Icon size={24} className="mb-1" />
                    <span className="text-xs font-medium">{cat.name}</span>
                  </button>
                );
              })}
            </div>
            
            <div className="space-y-3">
              <div className="relative flex items-center">
                {/* 獨立定位符號區域，確保不會隨數字長度移動 */}
                <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-14 bg-slate-100 border-r border-slate-200 rounded-l-xl z-10">
                  <span className="text-slate-500 font-bold text-lg">{currentSymbol}</span>
                </div>
                <input
                  type="number"
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="輸入金額..."
                  // 將左邊的 padding 加大 (pl-16)，空出符號的位置
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-16 pr-4 py-4 focus:ring-2 focus:ring-teal-500 focus:outline-none text-slate-800 text-xl font-bold tracking-wider"
                  required
                />
              </div>
              <div>
                <input
                  type="text"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="輸入項目描述 (選填)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:outline-none text-slate-700"
                />
              </div>
            </div>
            
            <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-4 rounded-xl transition-colors shadow-sm flex justify-center items-center gap-2 text-lg">
              <Plus size={22} />
              加入帳單
            </button>
          </form>
        </section>

        <section>
          <div className="flex justify-between items-end mb-3 px-1">
            <h2 className="text-slate-700 font-semibold flex items-center gap-2">
              <PieChart size={20} className="text-teal-600"/>
              支出明細
            </h2>
            <span className="text-xs text-slate-400">目前顯示單位: {baseCurrency}</span>
          </div>
          
          {expenses.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-100 border-dashed">
              <p className="text-slate-400">目前還沒有任何支出記錄喔！</p>
            </div>
          ) : (
            <div className="space-y-3">
              {expenses.map(item => {
                const catInfo = CATEGORIES.find(c => c.id === item.category) || CATEGORIES[3];
                const Icon = catInfo.icon;
                const displayAmount = convertCurrency(item.originalAmount, item.originalCurrency, baseCurrency);
                
                return (
                  <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between group">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className={`p-3 rounded-full shrink-0 ${catInfo.color}`}>
                        <Icon size={20} />
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-semibold text-slate-700 truncate">{item.desc}</p>
                        <div className="flex items-center gap-1">
                           <span className="text-xs text-slate-400">{catInfo.name}</span>
                           {item.originalCurrency !== baseCurrency && (
                             <span className="text-[10px] text-slate-400 bg-slate-100 px-1 rounded">
                               (原: {item.originalAmount} {item.originalCurrency})
                             </span>
                           )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 pl-2 shrink-0">
                      <span className="font-bold text-slate-700 text-lg">
                        {currentSymbol} {displayAmount.toLocaleString('zh-HK', { maximumFractionDigits: 2 })}
                      </span>
                      <button onClick={() => handleDelete(item.id)} className="text-slate-300 hover:text-red-500 p-1 transition-colors">
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

      {isShareOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full sm:w-[400px] rounded-t-2xl sm:rounded-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto slide-in-from-bottom-full sm:slide-in-from-bottom-0">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Share2 size={24} className="text-teal-600"/> 分享與匯入
              </h2>
              <button onClick={() => setIsShareOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full p-1"><X size={20} /></button>
            </div>
            {syncMessage.text && (
              <div className={`p-3 rounded-xl mb-4 flex items-start gap-2 ${syncMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {syncMessage.type === 'success' ? <CheckCircle2 size={20} className="shrink-0 mt-0.5" /> : <AlertCircle size={20} className="shrink-0 mt-0.5" />}
                <p className="text-sm">{syncMessage.text}</p>
              </div>
            )}
            <div className="space-y-6">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <h3 className="font-semibold text-slate-700 mb-2 flex items-center gap-2"><Download size={18} className="text-slate-500" /> 匯出給旅伴</h3>
                <p className="text-xs text-slate-500 mb-3">複製下方的代碼並傳給朋友，他們貼上即可載入目前的帳單。</p>
                <div className="relative">
                  <textarea readOnly value={generateExportCode()} className="w-full bg-slate-200/50 text-slate-400 text-xs rounded-lg p-3 h-16 resize-none focus:outline-none break-all" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50/90 pointer-events-none rounded-lg" />
                </div>
                <button onClick={copyToClipboard} className="w-full mt-2 bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 rounded-lg transition-colors flex justify-center items-center gap-2 text-sm">
                  <Copy size={16} /> 複製行程代碼
                </button>
              </div>
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink-0 mx-4 text-slate-400 text-xs">或</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <h3 className="font-semibold text-slate-700 mb-2 flex items-center gap-2"><Download size={18} className="text-slate-500 rotate-180" /> 從旅伴匯入</h3>
                <p className="text-xs text-slate-500 mb-3 text-red-500/80">注意：匯入將會覆蓋您目前的帳單與設定！</p>
                <textarea value={importText} onChange={(e) => setImportText(e.target.value)} placeholder="在此貼上朋友傳給您的行程代碼..." className="w-full bg-white border border-slate-200 text-slate-700 text-sm rounded-lg p-3 h-24 resize-none focus:ring-2 focus:ring-teal-500 focus:outline-none mb-2" />
                <button onClick={handleImport} className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-2.5 rounded-lg transition-colors text-sm">
                  覆蓋並匯入資料
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isSettingsOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full sm:w-[400px] rounded-t-2xl sm:rounded-2xl p-6 shadow-xl slide-in-from-bottom-full sm:slide-in-from-bottom-0 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">匯率與進階設定</h2>
              <button onClick={() => setIsSettingsOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full p-1"><X size={20} /></button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <RefreshCw size={16} className="text-teal-600"/>
                  匯率設定 <span className="text-xs text-slate-400 font-normal">(相對於港幣 HKD)</span>
                </label>
                <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                  系統會在內部自動換算。若匯率浮動較大，您可以手動修改這裡的數字。例如：如果 1 港幣 = 19.8 日圓，請在 JPY 填寫 19.8。
                </p>
                <div className="space-y-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {Object.entries(exchangeRates).map(([currency, rate]) => {
                    if (currency === 'HKD') return null;
                    return (
                      <div key={currency} className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-600 w-16">{currency}</span>
                        <input 
                          type="number"
                          step="any"
                          value={rate}
                          onChange={(e) => {
                            const newRate = parseFloat(e.target.value) || 0;
                            setExchangeRates(prev => ({ ...prev, [currency]: newRate }));
                          }}
                          className="w-24 text-right bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                        />
                      </div>
                    )
                  })}
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-100">
                <button onClick={handleResetTrip} className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-medium py-3 rounded-xl transition-colors border border-red-200 flex justify-center items-center gap-2 text-sm">
                  <Trash2 size={18} /> 清除資料並開啟新行程
                </button>
              </div>
            </div>

            <button onClick={() => setIsSettingsOpen(false)} className="w-full bg-slate-800 text-white font-semibold py-3 rounded-xl mt-6 hover:bg-slate-700 transition">
              完成
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
