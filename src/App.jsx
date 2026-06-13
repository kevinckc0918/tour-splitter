import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  Calculator, 
  ShoppingCart, 
  Coffee, 
  Briefcase,
  ChevronDown,
  ChevronUp,
  Camera,
  Train,
  Landmark,
  Plus,
  Trash2,
  Car,
  Users,
  Minus,
  Utensils,
  FileText,
  Image as ImageIcon,
  Info,
  Plane,
  Globe,
  Share2,
  Copy,
  Send,
  X,
  Settings
} from 'lucide-react';

const itineraryData = [
  {
    day: 1,
    title: '香港 ✈ 伊斯坦堡 (土耳其) 12/9(六)',
    highlights: ['土耳其航空直航', '夜機出發'],
    details: '是日由東瀛遊領隊陪同下，乘坐土耳其航空公司客機直航飛往伊斯坦堡。',
    icon: Plane,
    meals: '早餐：航機上 | 午餐：航機上 | 晚餐：航機上',
    hotel: '航機上'
  },
  {
    day: 2,
    title: '伊斯坦堡 → 加歷奇 13/9(日)',
    highlights: ['藍廟', '聖蘇菲亞清真寺', '杜伯奇皇宮', '1915恰納卡萊大橋'],
    details: '抵達後參觀【藍廟】及【聖蘇菲亞清真寺】。隨後前往【杜伯奇皇宮博物館】飽覽伊斯坦堡城市風光。下午乘坐旅遊車跨越現今全球最長的懸索跨海吊橋【1915恰納卡萊大橋】橫跨達達尼海峽前往加歷奇。',
    icon: Landmark,
    meals: '早餐：航機上 | 午餐：地道餐廳 | 晚餐：酒店餐廳',
    hotel: '加歷奇5星 Kolin / Grand Temizel / Ramada 或同級'
  },
  {
    day: 3,
    title: '加歷奇 → 古薩達斯 14/9(一)',
    highlights: ['特洛伊古城', '巴格門古城 (觀光吊車)'],
    details: '前往參觀世界文化遺產【特洛伊古城】。隨後乘坐觀光吊車登上【巴格門古城】參觀希臘羅馬時的衛城遺址。其後前往古薩達斯，途中參觀皮革店及特色糖果店。',
    icon: Camera,
    meals: '早餐：酒店 | 午餐：地道餐廳 | 晚餐：酒店餐廳',
    hotel: '古薩達斯5星 Richmond / Surmeli / Charisma Deluxe 或同級'
  },
  {
    day: 4,
    title: '古薩達斯 → 棉花堡 15/9(二)',
    highlights: ['以弗所古城', '無花果田', '棉花堡溫泉'],
    details: '參觀羅馬省市首都【以弗所古城】。隨後前往棉花堡（增遊艾登無花果種植田）。抵達棉花堡參觀獨特的石灰岩梯田及地下棉花堡，入住溫泉酒店享受溫泉樂。',
    icon: MapPin,
    meals: '早餐：酒店 | 午餐：地道餐廳 | 晚餐：酒店餐廳',
    hotel: '棉花堡5星溫泉酒店 Colossae / Pam / Richmond 或同級'
  },
  {
    day: 5,
    title: '棉花堡 → 康雅 16/9(三)',
    highlights: ['梅夫拉納博物館', '康雅市集'],
    details: '前往康雅，參觀創始人安息的【梅夫拉納博物館】（旋轉舞發源地），並到訪【康雅市集】體驗傳統地道文化。',
    icon: Landmark,
    meals: '早餐：酒店 | 午餐：地道餐廳 | 晚餐：酒店餐廳',
    hotel: '康雅5星 Novotel / Bayir Diamond / Crown Plaza 或同級'
  },
  {
    day: 6,
    title: '康雅 → 加柏都斯亞 (奇石林) 17/9(四)',
    highlights: ['駱駝商隊驛站', '仙境煙窗', '肚皮舞表演'],
    details: '前往參觀【駱駝商隊驛站】。抵達加柏都斯亞後，參觀【仙境煙窗】、【烏其沙城堡】、【駱駝岩】及【獵人谷】等奇特岩山地貌。晚上安排於洞穴夜總會欣賞肚皮舞表演（包地道小食及飲品一杯）。',
    icon: Camera,
    meals: '早餐：酒店 | 午餐：古驛站鄂式料理 | 晚餐：酒店餐廳',
    hotel: '加柏都斯亞5星 Crown Plaza / Double Tree by Hilton 或同級 (連住2晚)'
  },
  {
    day: 7,
    title: '加柏都斯亞 (奇石林) 18/9(五)',
    highlights: ['四驅車之旅(自費)', '地下古城', '居里默石中教堂'],
    details: '可自費參與四驅車之旅深入奇石林區。隨後參觀古時基督徒避難的【地下古城】，以及【居里默】石中教堂群。其後參觀當地著名的地氈工場。',
    icon: Car,
    meals: '早餐：酒店 | 午餐：地道烤羊 | 晚餐：酒店餐廳',
    hotel: '加柏都斯亞5星 Crown Plaza / Double Tree by Hilton 或同級'
  },
  {
    day: 8,
    title: '加柏都斯亞 ✈ 伊斯坦堡 19/9(六)',
    highlights: ['內陸機省時', '地下水道', '皮埃爾洛蒂山丘(自費)'],
    details: '乘搭內陸客機飛往伊斯坦堡，節省長途車程。抵達後參觀東羅馬帝國時期的【地下水道】。團友可自費乘坐吊車登上皮埃爾洛蒂山丘俯瞰金角灣壯麗景色。',
    icon: Plane,
    meals: '早餐：酒店/餐盒 | 午餐：地道餐廳 | 晚餐：牛扒餐',
    hotel: '伊斯坦堡5星 Hilton / Sheraton / Wyndham 或同級'
  },
  {
    day: 9,
    title: '伊斯坦堡 ✈ 香港 20/9(日)',
    highlights: ['杜瑪伯爵水晶皇宮', '大市集', '博斯普魯斯海峽遊船(自費)'],
    details: '參觀金碧輝煌的【杜瑪伯爵水晶皇宮】。隨後前往擁有五百年歷史的【大市集】自由選購手信。團友可自費參與博斯普魯斯海峽遊船。傍晚前往機場準備乘搭凌晨客機返港。',
    icon: MapPin,
    meals: '早餐：酒店 | 午餐：土耳其烤魚 | 晚餐：豐富中餐',
    hotel: '航機上'
  },
  {
    day: 10,
    title: '抵達香港 21/9(一)',
    highlights: ['平安抵港'],
    details: '航機於是日傍晚安全抵達香港國際機場，結束10天土耳其愉快旅程。',
    icon: Plane,
    meals: '早餐：航機上 | 午餐：航機上 | 晚餐：自理',
    hotel: '溫暖的家'
  }
];

const dynamicCategories = [
  { id: 'optionalTours', label: '自費項目 (每人)', icon: <Camera size={18} />, helper: '遊船 USD90 / 四驅車 USD160 等' },
  { id: 'food', label: '額外餐飲 (全單總數)', icon: <Coffee size={18} />, helper: '系統會自動按人數平攤', isShared: true, hasDate: true },
  { id: 'shopping', label: '購物及手信 (每人)', icon: <ShoppingCart size={18} />, helper: '支援輸入 TRY 或 USD' },
  { id: 'transport', label: '當地交通 (每人)', icon: <Car size={18} /> },
  { id: 'others', label: '其他雜費 (每人)', icon: <DollarSign size={18} /> },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('overview'); 
  const [expandedDay, setExpandedDay] = useState(1);
  
  // 匯率狀態
  const [rates, setRates] = useState(() => {
    const saved = localStorage.getItem('trTourRates');
    return saved ? JSON.parse(saved) : {
      USD: 7.84,
      TRY: 0.17,
      RMB: 1.15
    };
  });

  const [travelers, setTravelers] = useState(() => {
    const saved = localStorage.getItem('trTourTravelers');
    return saved !== null ? parseInt(saved, 10) : 2;
  });
  
  const [fixedExpenses, setFixedExpenses] = useState(() => {
    const saved = localStorage.getItem('trTourFixedExpenses');
    return saved ? JSON.parse(saved) : { tourFee: '18399', serviceFee: '0', insurance: '450' };
  });

  const [dynamicExpenses, setDynamicExpenses] = useState(() => {
    const saved = localStorage.getItem('trTourDynamicExpenses');
    return saved ? JSON.parse(saved) : {
      optionalTours: [
        { id: 'opt-1', desc: '博斯普魯斯海峽船河', amount: '90', currency: 'USD' },
        { id: 'opt-2', desc: '四驅車之旅(奇石林)', amount: '160', currency: 'USD' },
        { id: 'opt-3', desc: '皮埃爾洛蒂山丘', amount: '45', currency: 'USD' }
      ],
      food: [], shopping: [], transport: [], others: []
    };
  });

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [shareTarget, setShareTarget] = useState('all');
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    localStorage.setItem('trTourRates', JSON.stringify(rates));
    localStorage.setItem('trTourTravelers', travelers.toString());
    localStorage.setItem('trTourFixedExpenses', JSON.stringify(fixedExpenses));
    localStorage.setItem('trTourDynamicExpenses', JSON.stringify(dynamicExpenses));
  }, [rates, travelers, fixedExpenses, dynamicExpenses]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleFixedChange = (e) => {
    const { name, value } = e.target;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setFixedExpenses(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleRateChange = (currencyKey, value) => {
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setRates(prev => ({ ...prev, [currencyKey]: value }));
    }
  };

  const handleAddDynamic = (category) => {
    const catDef = dynamicCategories.find(c => c.id === category);
    const newItem = { id: Date.now(), desc: '', amount: '', currency: 'TRY' }; 
    if (catDef?.hasDate) newItem.day = '1';
    setDynamicExpenses(prev => ({ ...prev, [category]: [...prev[category], newItem] }));
  };

  const handleUpdateDynamic = (category, id, field, value) => {
    if (field === 'amount' && value !== '' && !/^\d*\.?\d*$/.test(value)) return; 
    setDynamicExpenses(prev => ({
      ...prev, [category]: prev[category].map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const handleRemoveDynamic = (category, id) => {
    setDynamicExpenses(prev => ({ ...prev, [category]: prev[category].filter(item => item.id !== id) }));
  };

  const adjustTravelers = (amount) => setTravelers(prev => Math.max(1, prev + amount));

  const convertToHKD = (amount, currencyCode) => {
    const num = parseFloat(amount);
    if (isNaN(num)) return 0;
    if (currencyCode === 'HKD') return num;
    const rate = parseFloat(rates[currencyCode]);
    if (isNaN(rate)) return 0;
    return num * rate;
  };

  const calculateTotals = () => {
    let perPersonFixed = 0;
    Object.values(fixedExpenses).forEach(val => {
      const num = parseFloat(val);
      if (!isNaN(num)) perPersonFixed += num;
    });

    let perPersonDynamic = 0;
    Object.entries(dynamicExpenses).forEach(([category, arr]) => {
      arr.forEach(item => {
        const hkdAmount = convertToHKD(item.amount, item.currency || 'HKD');
        if (hkdAmount > 0) {
          perPersonDynamic += category === 'food' ? (hkdAmount / travelers) : hkdAmount;
        }
      });
    });

    const totalPerPerson = perPersonFixed + perPersonDynamic;
    const totalGroup = totalPerPerson * travelers;

    return { perPerson: totalPerPerson.toFixed(2), group: totalGroup.toFixed(2) };
  };

  const totals = calculateTotals();

  const clearForm = () => {
    if (window.confirm("確定要重置數據並回復到預設值嗎？")) {
      setFixedExpenses({ tourFee: '18399', serviceFee: '0', insurance: '450' });
      setDynamicExpenses({
        optionalTours: [
          { id: Date.now().toString()+'1', desc: '博斯普魯斯海峽船河', amount: '90', currency: 'USD' },
          { id: Date.now().toString()+'2', desc: '四驅車之旅(奇石林)', amount: '160', currency: 'USD' },
          { id: Date.now().toString()+'3', desc: '皮埃爾洛蒂山丘', amount: '45', currency: 'USD' }
        ],
        food: [], shopping: [], transport: [], others: []
      });
      setRates({ USD: 7.84, TRY: 0.17, RMB: 1.15 });
      setTravelers(2);
    }
  };

  const generateShareText = () => {
    const foodItems = dynamicExpenses.food.filter(item => parseFloat(item.amount) > 0);
    if (foodItems.length === 0) return "尚未有餐飲開支紀錄。";
    
    let text = `🇹🇷 土耳其10天【季節花田約定】\n`;
    text += `👥 同行人數：${travelers}人\n`;
    text += `===================\n`;

    let grandTotalHKD = 0;

    if (shareTarget === 'all') {
      const grouped = {};
      foodItems.forEach(item => {
        const d = item.day || '1';
        if (!grouped[d]) grouped[d] = [];
        grouped[d].push(item);
      });
      const sortedDays = Object.keys(grouped).sort((a,b) => parseInt(a) - parseInt(b));
      
      sortedDays.forEach(day => {
        text += `\n📍 第 ${day} 天\n`;
        let dayTotalHKD = 0;
        grouped[day].forEach(item => {
           const hkdVal = convertToHKD(item.amount, item.currency);
           text += ` • ${item.desc || '未命名'}: ${item.amount} ${item.currency} (約HK$${hkdVal.toFixed(1)})\n`;
           dayTotalHKD += hkdVal;
        });
        text += ` 🔸 每日小計: HK$${dayTotalHKD.toFixed(1)}\n`;
        text += ` 🙋‍♂️ 每人平攤: HK$${(dayTotalHKD/travelers).toFixed(1)}\n`;
        text += `-------------------\n`;
        grandTotalHKD += dayTotalHKD;
      });

      text += `\n💰 餐飲總開支: HK$${grandTotalHKD.toFixed(1)}\n`;
      text += `🎯 每人總平攤: HK$${(grandTotalHKD/travelers).toFixed(1)}\n`;
    } else {
      const dayItems = foodItems.filter(item => (item.day || '1') === shareTarget);
      text += `\n📍 第 ${shareTarget} 天餐飲明細\n`;
      dayItems.forEach(item => {
         const hkdVal = convertToHKD(item.amount, item.currency);
         text += ` • ${item.desc || '未命名'}: ${item.amount} ${item.currency} (約HK$${hkdVal.toFixed(1)})\n`;
         grandTotalHKD += hkdVal;
      });
      text += `===================\n`;
      text += `💰 每日小計: HK$${grandTotalHKD.toFixed(1)}\n`;
      text += `🎯 每人平攤: HK$${(grandTotalHKD/travelers).toFixed(1)}\n`;
    }
    
    text += `\n(匯率換算供參考: 1TRY=HK$${rates.TRY}, 1USD=HK$${rates.USD})`;
    return text;
  };

  const copyToClipboard = () => {
    const text = generateShareText();
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToast('✅ 已複製文字！請到 WhatsApp 貼上');
    } catch (err) {
      showToast('❌ 複製失敗，請手動選取複製');
    }
    document.body.removeChild(textArea);
    setIsShareModalOpen(false);
  };

  const shareToApp = () => {
    const text = generateShareText();
    if (navigator.share) {
      navigator.share({
        title: '土耳其團餐飲開支分享',
        text: text
      }).catch(err => console.log('Share canceled', err));
      setIsShareModalOpen(false);
    } else {
      showToast('⚠️ 您的瀏覽器不支援直接發送，請點擊「複製文字」');
    }
  };

  const handleImageError = (e) => {
    e.target.style.display = 'none';
    e.target.nextElementSibling.style.display = 'flex';
  };

  const getAvailableFoodDays = () => {
    const days = new Set(dynamicExpenses.food.filter(i => parseFloat(i.amount) > 0).map(i => i.day || '1'));
    return Array.from(days).sort((a,b) => parseInt(a) - parseInt(b));
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-12" style={{ colorScheme: 'light' }}>
      
      {toastMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-5 py-3 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.2)] z-[100] animate-in fade-in slide-in-from-top-5 text-sm font-medium whitespace-nowrap flex items-center gap-2">
          {toastMsg}
        </div>
      )}

      <header className="bg-amber-600 text-white shadow-lg sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 py-4 md:py-5">
          <div className="flex flex-col">
            <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2 text-white">
              <Globe className="h-6 w-6 text-white shrink-0" />
              <span>土耳其10天【季節花田約定】</span>
            </h1>
            <p className="mt-1 text-amber-100 text-xs md:text-sm flex items-center gap-1.5">
              <span>東瀛遊 EGL Tours (團號: MDUF10)</span>
            </p>            
          </div>
        </div>
        
        <div className="flex border-t border-amber-500/50 bg-amber-700/50 overflow-x-auto custom-scrollbar">
          <button onClick={() => setActiveTab('overview')} className={`flex-1 min-w-[80px] flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 py-2.5 md:py-3.5 text-xs md:text-sm font-bold transition-colors relative ${activeTab === 'overview' ? 'text-white' : 'text-amber-200 hover:text-white hover:bg-amber-600/50'}`}>
            <Info size={18} /><span>總覽</span>
            {activeTab === 'overview' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-t-full"></div>}
          </button>
          <button onClick={() => setActiveTab('itinerary')} className={`flex-1 min-w-[80px] flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 py-2.5 md:py-3.5 text-xs md:text-sm font-bold transition-colors relative ${activeTab === 'itinerary' ? 'text-white' : 'text-amber-200 hover:text-white hover:bg-amber-600/50'}`}>
            <Calendar size={18} /><span>行程</span>
            {activeTab === 'itinerary' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-t-full"></div>}
          </button>
          <button onClick={() => setActiveTab('calculator')} className={`flex-1 min-w-[80px] flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 py-2.5 md:py-3.5 text-xs md:text-sm font-bold transition-colors relative ${activeTab === 'calculator' ? 'text-white' : 'text-amber-200 hover:text-white hover:bg-amber-600/50'}`}>
            <Calculator size={18} /><span>旅費</span>
            {activeTab === 'calculator' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-t-full"></div>}
          </button>
          <button onClick={() => setActiveTab('poster')} className={`flex-1 min-w-[80px] flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 py-2.5 md:py-3.5 text-xs md:text-sm font-bold transition-colors relative ${activeTab === 'poster' ? 'text-white' : 'text-amber-200 hover:text-white hover:bg-amber-600/50'}`}>
            <FileText size={18} /><span>海報</span>
            {activeTab === 'poster' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-t-full"></div>}
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 md:py-8">
        
        {/* Tab 0: Overview */}
        {activeTab === 'overview' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-amber-50 border-b border-amber-100 p-5 md:p-6">
                <h2 className="text-lg md:text-xl font-bold flex items-center gap-2 text-amber-900">
                  <Info className="text-amber-600" size={24} />
                  基本資訊總覽
                </h2>
              </div>
              <div className="p-5 md:p-6 space-y-6">
                
                <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                  <h3 className="text-red-700 font-bold flex items-center gap-2 mb-2">
                    <DollarSign size={18} /> 服務費全免
                  </h3>
                  <p className="text-sm text-red-600 font-medium">
                    本團為全包價旅行團，已包括稅項、機票手續費，並<span className="font-bold border-b border-red-600">免收全程領隊、導遊、司機服務費</span>！
                  </p>
                </div>

                <div className="flex gap-4">
                  <div className="bg-indigo-100/50 p-3 rounded-xl h-fit shrink-0"><Calendar className="w-6 h-6 text-indigo-600" /></div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">旅行日期</h3>
                    <p className="text-slate-800 font-medium text-lg">2026年9月12日 (星期六) 出發</p>
                    <p className="text-slate-600 text-sm">至 2026年9月21日 (星期一) 返抵</p>
                  </div>
                </div>

                <hr className="border-slate-100" />

                <div className="flex gap-4">
                  <div className="bg-blue-100/50 p-3 rounded-xl h-fit shrink-0"><Plane className="w-6 h-6 text-blue-600" /></div>
                  <div className="w-full">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">航班資料 (土耳其航空直航)</h3>
                    <div className="space-y-3">
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded">去程 (9月12日)</span>
                        </div>
                        <div className="flex justify-between items-center ml-1">
                          <div className="text-slate-800 font-medium text-sm">香港 <span className="text-slate-400 mx-1">✈</span> 伊斯坦堡</div>
                          <div className="text-sm font-bold text-slate-600">22:30 / 05:00+1</div>
                        </div>
                        <div className="text-xs text-slate-500 mt-1 ml-1">航班: TK 71 (約 11.5 小時)</div>
                      </div>

                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-slate-600 text-white text-xs font-bold px-2 py-0.5 rounded">回程 (9月20日)</span>
                        </div>
                        <div className="flex justify-between items-center ml-1">
                          <div className="text-slate-800 font-medium text-sm">伊斯坦堡 <span className="text-slate-400 mx-1">✈</span> 香港</div>
                          <div className="text-sm font-bold text-slate-600">01:30 / 17:15</div>
                        </div>
                        <div className="text-xs text-slate-500 mt-1 ml-1">航班: TK 70 (約 10.75 小時)</div>
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="border-slate-100" />

                <div className="flex gap-4">
                  <div className="bg-amber-100/50 p-3 rounded-xl h-fit shrink-0"><MapPin className="w-6 h-6 text-amber-600" /></div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">行程尊享亮點</h3>
                    <ul className="space-y-2 text-sm text-slate-700">
                      <li className="flex items-start gap-2">
                        <span className="text-amber-500 mt-0.5">✦</span>
                        <span><b>乘搭內陸機</b> (加柏都斯亞飛往伊斯坦堡)，節省十多小時車程。</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-500 mt-0.5">✦</span>
                        <span>暢遊多個 <b>世界文化遺產</b> (特洛伊古城、棉花堡、奇石林等)。</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-500 mt-0.5">✦</span>
                        <span>棉花堡入住五星級<b>溫泉酒店</b>，享受特色地熱溫泉。</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-500 mt-0.5">✦</span>
                        <span>奇石林區安排 <b>洞穴夜總會</b> 欣賞肚皮舞及民族舞表演。</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 1: Itinerary */}
        {activeTab === 'itinerary' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="space-y-3">
              {itineraryData.map((day) => {
                const isExpanded = expandedDay === day.day;
                const Icon = day.icon;
                
                return (
                  <div key={day.day} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-200">
                    <button onClick={() => setExpandedDay(isExpanded ? null : day.day)} className="w-full px-5 py-4 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors text-left">
                      <div className="flex items-center gap-4">
                        <div className="bg-amber-100 text-amber-700 w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0">D{day.day}</div>
                        <div>
                          <h3 className="font-bold text-lg text-slate-800">{day.title}</h3>
                          <p className="text-sm text-slate-500 mt-1 line-clamp-1">{day.highlights.join(' • ')}</p>
                        </div>
                      </div>
                      {isExpanded ? <ChevronUp className="text-slate-400 shrink-0" /> : <ChevronDown className="text-slate-400 shrink-0" />}
                    </button>
                    {isExpanded && (
                      <div className="px-5 pb-5 pt-2 border-t border-slate-100 bg-slate-50/50">
                        <p className="text-slate-600 leading-relaxed text-sm md:text-base mb-5">{day.details}</p>
                        <div className="flex flex-col gap-2.5">
                          <div className="flex items-start gap-2 text-sm text-orange-800 bg-orange-50 p-3 rounded-lg border border-orange-100/50">
                            <Utensils className="w-5 h-5 shrink-0 mt-0.5 text-orange-600" />
                            <div><span className="font-bold block mb-1 text-orange-900">餐飲安排：</span>{day.meals}</div>
                          </div>
                          <div className="flex items-start gap-2 text-sm text-amber-800 bg-amber-50 p-3 rounded-lg border border-amber-100/50">
                            <Briefcase className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
                            <div><span className="font-bold block mb-1 text-amber-900">住宿安排：</span>{day.hotel}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Calculator */}
        {activeTab === 'calculator' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 md:p-6 mb-24">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b pb-4">
                <h2 className="text-lg font-bold flex items-center gap-2 text-slate-700">
                  <Calculator className="text-amber-600" size={20} />
                  開支明細
                  <span className="ml-1 text-[10px] font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">自動儲存</span>
                </h2>
                
                <button 
                  onClick={() => setIsSettingsModalOpen(true)}
                  className="flex items-center gap-1.5 text-sm bg-slate-100 text-slate-700 hover:bg-amber-100 hover:text-amber-700 border border-slate-200 hover:border-amber-300 px-3 py-1.5 rounded-lg transition-colors font-bold shadow-sm"
                >
                  <Settings size={16} /> 匯率設定
                </button>
              </div>

              {/* Number of Travelers Control */}
              <div className="flex items-center justify-between bg-amber-50/70 border border-amber-100 rounded-xl p-3 mb-6">
                <div className="flex items-center gap-2 font-bold text-amber-800">
                  <Users size={18} /> 同行人數
                </div>
                <div className="flex items-center gap-1 bg-white rounded-lg border border-amber-200 p-1 shadow-sm">
                  <button onClick={() => adjustTravelers(-1)} className="p-1.5 hover:bg-amber-50 text-amber-600 rounded-md transition-colors disabled:opacity-30 disabled:hover:bg-transparent" disabled={travelers <= 1}><Minus size={16} /></button>
                  <span className="font-bold text-lg w-8 text-center text-slate-900">{travelers}</span>
                  <button onClick={() => adjustTravelers(1)} className="p-1.5 hover:bg-amber-50 text-amber-600 rounded-md transition-colors"><Plus size={16} /></button>
                </div>
              </div>

              {/* Fixed Expenses Section */}
              <div className="space-y-4 mb-6">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b pb-1">基本固定開支 (每人 / HKD)</h3>
                <FixedExpenseInput label="預估團費" name="tourFee" value={fixedExpenses.tourFee} onChange={handleFixedChange} icon={<Briefcase size={18} />} helperText="請依據實際報名費用填寫" />
                <FixedExpenseInput label="領隊/導遊服務費" name="serviceFee" value={fixedExpenses.serviceFee} onChange={handleFixedChange} icon={<DollarSign size={18} />} helperText="海報註明：免收全程領隊及導遊小費" />
                <FixedExpenseInput label="旅遊綜合保險" name="insurance" value={fixedExpenses.insurance} onChange={handleFixedChange} icon={<Briefcase size={18} />} helperText="建議出發前購買旅遊保險" />
              </div>

              {/* Dynamic Expenses Section */}
              <div className="space-y-5 pt-2">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b pb-1">浮動多項開支 (可切換不同貨幣)</h3>
                
                {dynamicCategories.map(cat => (
                  <div key={cat.id} className={`border rounded-xl p-4 ${cat.isShared ? 'bg-orange-50 border-orange-200' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <label className={`text-sm font-bold flex items-center gap-1.5 ${cat.isShared ? 'text-orange-800' : 'text-slate-700'}`}>
                          <span className={cat.isShared ? 'text-orange-600' : 'text-slate-500'}>{cat.icon}</span>
                          {cat.label}
                        </label>
                        {cat.helper && <p className={`text-xs mt-0.5 ${cat.isShared ? 'text-orange-600/80' : 'text-slate-500'}`}>{cat.helper}</p>}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {cat.id === 'food' && dynamicExpenses.food.filter(i => parseFloat(i.amount) > 0).length > 0 && (
                          <button onClick={() => setIsShareModalOpen(true)} className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-md transition-colors font-bold bg-green-100 text-green-700 hover:bg-green-200 border border-green-200">
                            <Share2 size={14} /> 分享
                          </button>
                        )}
                        <button onClick={() => handleAddDynamic(cat.id)} className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-md transition-colors font-bold border ${cat.isShared ? 'bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-200' : 'bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200'}`}>
                          <Plus size={14} /> 新增
                        </button>
                      </div>
                    </div>

                    {dynamicExpenses[cat.id].length > 0 ? (
                      <div className="mt-3">
                        {cat.hasDate ? (
                          (() => {
                            const grouped = {};
                            dynamicExpenses[cat.id].forEach(item => {
                              const d = item.day || '1';
                              if (!grouped[d]) grouped[d] = [];
                              grouped[d].push(item);
                            });
                            const sortedDays = Object.keys(grouped).sort((a,b) => parseInt(a) - parseInt(b));

                            return (
                              <div className="space-y-4">
                                {sortedDays.map(dayStr => {
                                  const dayItems = grouped[dayStr];
                                  const dayNum = parseInt(dayStr);
                                  const dailySubtotalHKD = dayItems.reduce((sum, item) => sum + convertToHKD(item.amount, item.currency), 0);

                                  return (
                                    <div key={dayStr} className="bg-white border border-orange-200 rounded-xl overflow-hidden shadow-sm">
                                      <div className="bg-orange-100/50 px-3 py-2 border-b border-orange-100 flex justify-between items-center">
                                        <div className="font-bold text-orange-900 text-sm flex items-center gap-1.5">
                                          <Calendar size={14} className="text-orange-600" /> 第{dayStr}天
                                        </div>
                                      </div>
                                      <div className="p-2 space-y-3">
                                        {dayItems.map((entry) => (
                                          <div key={entry.id} className="flex items-center gap-1.5">
                                            <select value={entry.day || '1'} onChange={(e) => handleUpdateDynamic(cat.id, entry.id, 'day', e.target.value)} className="bg-orange-50 text-orange-800 border border-orange-200 rounded-md focus:ring-amber-500 focus:border-amber-500 text-xs py-1.5 px-0.5 font-medium">
                                              {itineraryData.map(d => <option key={d.day} value={d.day}>D{d.day}</option>)}
                                            </select>
                                            <input type="text" placeholder="名稱" value={entry.desc} onChange={(e) => handleUpdateDynamic(cat.id, entry.id, 'desc', e.target.value)} className="w-[40%] bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-md shadow-sm focus:border-amber-500 focus:ring-amber-500 text-sm py-1.5 px-2" />
                                            
                                            <div className="flex w-[45%] rounded-md shadow-sm">
                                              <select value={entry.currency || 'TRY'} onChange={(e) => handleUpdateDynamic(cat.id, entry.id, 'currency', e.target.value)} className="bg-slate-100 text-slate-700 border border-r-0 border-slate-300 rounded-l-md text-xs px-1 py-1.5 font-bold focus:ring-amber-500 focus:border-amber-500 outline-none">
                                                <option value="TRY">₺</option>
                                                <option value="USD">US$</option>
                                                <option value="HKD">HK$</option>
                                                <option value="RMB">¥</option>
                                              </select>
                                              <input type="text" placeholder="總額" value={entry.amount} onChange={(e) => handleUpdateDynamic(cat.id, entry.id, 'amount', e.target.value)} className="w-full bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-r-md focus:border-amber-500 focus:ring-amber-500 text-sm py-1.5 px-2" />
                                            </div>
                                            
                                            <button onClick={() => handleRemoveDynamic(cat.id, entry.id)} className="text-red-400 hover:text-red-600 p-1 shrink-0" title="刪除"><Trash2 size={16} /></button>
                                          </div>
                                        ))}
                                      </div>
                                      {dailySubtotalHKD > 0 && (
                                        <div className="bg-orange-50/30 px-3 py-2.5 border-t border-orange-100 flex flex-col items-end">
                                          <div className="text-sm font-bold text-orange-800">小計: HK$ {dailySubtotalHKD.toFixed(1)}</div>
                                          {cat.isShared && <div className="text-[10px] font-medium text-orange-600 mt-0.5">平攤: HK$ {(dailySubtotalHKD / travelers).toFixed(1)}</div>}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })()
                        ) : (
                          <div className="space-y-3">
                            {dynamicExpenses[cat.id].map((entry, index) => (
                              <div key={entry.id} className="flex flex-col gap-1">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs text-slate-500 font-bold w-3 text-center">{index + 1}.</span>
                                  <input type="text" placeholder="名稱" value={entry.desc} onChange={(e) => handleUpdateDynamic(cat.id, entry.id, 'desc', e.target.value)} className="w-[45%] bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-md shadow-sm focus:border-amber-500 focus:ring-amber-500 text-sm py-1.5 px-2" />
                                  <div className="flex w-[45%] rounded-md shadow-sm">
                                    <select value={entry.currency || 'TRY'} onChange={(e) => handleUpdateDynamic(cat.id, entry.id, 'currency', e.target.value)} className="bg-slate-100 text-slate-700 border border-r-0 border-slate-300 rounded-l-md text-xs px-1 py-1.5 font-bold focus:ring-amber-500 focus:border-amber-500 outline-none">
                                      <option value="TRY">₺</option>
                                      <option value="USD">US$</option>
                                      <option value="HKD">HK$</option>
                                      <option value="RMB">¥</option>
                                    </select>
                                    <input type="text" placeholder="總額" value={entry.amount} onChange={(e) => handleUpdateDynamic(cat.id, entry.id, 'amount', e.target.value)} className="w-full bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-r-md focus:border-amber-500 focus:ring-amber-500 text-sm py-1.5 px-2" />
                                  </div>
                                  <button onClick={() => handleRemoveDynamic(cat.id, entry.id)} className="text-red-400 hover:text-red-600 p-1 shrink-0" title="刪除"><Trash2 size={16} /></button>
                                </div>
                                {cat.isShared && entry.amount && !isNaN(parseFloat(entry.amount)) && (
                                  <div className="text-xs text-orange-600 font-medium text-right pr-8 flex items-center justify-end gap-1">
                                    約平攤 HK$ {(convertToHKD(entry.amount, entry.currency) / travelers).toFixed(1)}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {(() => {
                          const totalSumHKD = dynamicExpenses[cat.id].reduce((sum, item) => sum + convertToHKD(item.amount, item.currency), 0);
                          if (totalSumHKD > 0) {
                            return (
                              <div className={`mt-4 pt-3 border-t ${cat.isShared ? 'border-orange-200/60' : 'border-slate-200'} flex flex-col items-end`}>
                                <div className={`text-sm font-bold ${cat.isShared ? 'text-orange-900' : 'text-slate-700'}`}>
                                  {cat.label.split(' ')[0]} 總額: HK$ {totalSumHKD.toFixed(1)}
                                </div>
                                {cat.isShared && (
                                  <div className="text-xs font-medium text-orange-700 mt-0.5">
                                    (約總平攤每人: HK$ {(totalSumHKD / travelers).toFixed(1)})
                                  </div>
                                )}
                              </div>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 text-center py-2 italic border border-dashed border-slate-300 rounded-md bg-white mt-2">
                        尚未新增任何項目
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-5 flex justify-end">
                <button 
                  onClick={clearForm}
                  className="text-sm text-slate-500 hover:text-red-600 transition-colors flex items-center gap-1 font-medium bg-slate-100 px-3 py-1.5 rounded-lg hover:bg-red-50"
                >
                  <Trash2 size={14} /> 重置並清空儲存紀錄
                </button>
              </div>

            </div>
            
            {/* Sticky Total Display at Bottom */}
            <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-[0_-4px_20px_rgba(0,0,0,0.15)] z-30">
              <div className="max-w-3xl mx-auto px-4 py-3 md:py-4 flex items-center justify-between relative overflow-hidden">
                <div className="absolute top-1/2 -translate-y-1/2 right-4 opacity-10 pointer-events-none">
                  <Calculator size={100} />
                </div>
                <div>
                  <p className="text-orange-100 text-xs md:text-sm font-medium mb-0.5">每人預計總開支 (港幣)</p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg md:text-2xl font-bold">HK$</span>
                    <span className="text-2xl md:text-4xl font-extrabold tracking-tight">
                      {totals.perPerson}
                    </span>
                  </div>
                </div>
                <div className="text-right border-l border-amber-300/40 pl-4 py-1 z-10">
                  <p className="text-orange-100 text-[10px] md:text-xs mb-0.5">{travelers} 人同行總費用</p>
                  <p className="font-bold text-sm md:text-base">
                    HK$ {totals.group}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

       {/* Tab 3: Poster */}
        {activeTab === 'poster' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 md:p-6 text-center">
              <h2 className="text-lg md:text-xl font-bold flex items-center justify-center gap-2 text-slate-700 mb-2">
                <FileText className="text-amber-600" size={24} />
                行程海報參考
              </h2>

              <div className="space-y-6 mt-6">
                {/* 圖片 1 */}
                <div className="relative w-full rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-slate-200">
                  <img src="/poster1.jpg" alt="海報 第1頁" className="w-full h-auto block" onError={handleImageError} />
                  <div className="hidden flex-col items-center justify-center w-full aspect-[1/1.4] bg-slate-100 text-slate-400 p-6">
                    <ImageIcon size={64} className="mb-4 opacity-30" />
                    <p className="font-bold text-slate-500 mb-1">找不到第一頁圖片</p>
                  </div>
                </div>
                
                {/* 圖片 2 */}
                <div className="relative w-full rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-slate-200">
                  <img src="/poster2.jpg" alt="海報 第2頁" className="w-full h-auto block" onError={handleImageError} />
                  <div className="hidden flex-col items-center justify-center w-full aspect-[1/1.4] bg-slate-100 text-slate-400 p-6">
                    <ImageIcon size={64} className="mb-4 opacity-30" />
                    <p className="font-bold text-slate-500 mb-1">找不到第二頁圖片</p>
                  </div>
                </div>

                {/* 圖片 3 */}
                <div className="relative w-full rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-slate-200">
                  <img src="/poster3.jpg" alt="海報 第3頁" className="w-full h-auto block" onError={handleImageError} />
                  <div className="hidden flex-col items-center justify-center w-full aspect-[1/1.4] bg-slate-100 text-slate-400 p-6">
                    <ImageIcon size={64} className="mb-4 opacity-30" />
                    <p className="font-bold text-slate-500 mb-1">找不到第三頁圖片</p>
                  </div>
                </div>

                {/* 圖片 4 */}
                <div className="relative w-full rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-slate-200">
                  <img src="/poster4.jpg" alt="海報 第4頁" className="w-full h-auto block" onError={handleImageError} />
                  <div className="hidden flex-col items-center justify-center w-full aspect-[1/1.4] bg-slate-100 text-slate-400 p-6">
                    <ImageIcon size={64} className="mb-4 opacity-30" />
                    <p className="font-bold text-slate-500 mb-1">找不到第四頁圖片</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Settings Modal (匯率設定面板) */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden flex flex-col">
            <div className="bg-slate-800 text-white p-4 flex justify-between items-center">
              <h3 className="font-bold flex items-center gap-2 text-lg">
                <Settings size={20} />
                匯率設定 (轉為 HKD)
              </h3>
              <button onClick={() => setIsSettingsModalOpen(false)} className="bg-white/20 hover:bg-white/30 p-1.5 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-5 flex flex-col gap-4">
              <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 mb-1">
                <p className="text-xs text-amber-800 font-medium">
                  系統會自動根據以下匯率，將您輸入的所有外幣開支統一換算成港幣 (HKD) 進行加總。
                </p>
              </div>

              {/* TRY Input */}
              <div className="flex items-center justify-between gap-4">
                <label className="font-bold text-slate-700 w-24 text-sm">1 ₺ (TRY) =</label>
                <div className="flex-1 relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 font-bold">HK$</span>
                  <input type="text" value={rates.TRY} onChange={(e) => handleRateChange('TRY', e.target.value)} className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg pl-11 pr-3 py-2 text-sm focus:ring-amber-500 focus:border-amber-500 shadow-sm" />
                </div>
              </div>

              {/* USD Input */}
              <div className="flex items-center justify-between gap-4">
                <label className="font-bold text-slate-700 w-24 text-sm">1 US$ (USD) =</label>
                <div className="flex-1 relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 font-bold">HK$</span>
                  <input type="text" value={rates.USD} onChange={(e) => handleRateChange('USD', e.target.value)} className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg pl-11 pr-3 py-2 text-sm focus:ring-amber-500 focus:border-amber-500 shadow-sm" />
                </div>
              </div>

              {/* RMB Input */}
              <div className="flex items-center justify-between gap-4">
                <label className="font-bold text-slate-700 w-24 text-sm">1 ¥ (RMB) =</label>
                <div className="flex-1 relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 font-bold">HK$</span>
                  <input type="text" value={rates.RMB} onChange={(e) => handleRateChange('RMB', e.target.value)} className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg pl-11 pr-3 py-2 text-sm focus:ring-amber-500 focus:border-amber-500 shadow-sm" />
                </div>
              </div>
              
              <button 
                onClick={() => setIsSettingsModalOpen(false)}
                className="mt-3 w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 rounded-xl transition-colors shadow-sm"
              >
                確認並儲存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
            
            <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white p-4 flex justify-between items-center">
              <h3 className="font-bold flex items-center gap-2 text-lg">
                <Share2 size={20} />
                分享餐飲開支
              </h3>
              <button 
                onClick={() => setIsShareModalOpen(false)}
                className="bg-white/20 hover:bg-white/30 p-1.5 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-5 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">選擇分享內容：</label>
                <select 
                  value={shareTarget} 
                  onChange={(e) => setShareTarget(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-lg py-2 px-3 focus:ring-green-500 focus:border-green-500 font-medium"
                >
                  <option value="all">📝 總結所有餐飲紀錄</option>
                  {getAvailableFoodDays().map(d => (
                    <option key={d} value={d}>📍 只分享 第 {d} 天明細</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">分享預覽 (自動轉港幣)：</label>
                <pre className="bg-slate-100/80 p-4 rounded-xl text-xs text-slate-700 whitespace-pre-wrap font-mono border border-slate-200 max-h-64 overflow-y-auto custom-scrollbar">
                  {generateShareText()}
                </pre>
              </div>
              
              <div className="flex gap-3 pt-2 mt-auto">
                <button 
                  onClick={copyToClipboard}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition-colors border border-slate-300"
                >
                  <Copy size={18} /> 複製文字
                </button>
                <button 
                  onClick={shareToApp}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 rounded-xl transition-colors shadow-sm shadow-green-500/30"
                >
                  <Send size={18} /> 發送至 App
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

function FixedExpenseInput({ label, name, value, onChange, icon, helperText }) {
  return (
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-1 flex justify-between">
        <span className="flex items-center gap-1.5">
          <span className="text-slate-500">{icon}</span>
          {label}
        </span>
      </label>
      <div className="relative mt-1 rounded-md shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <span className="text-slate-500 sm:text-sm font-bold">HK$</span>
        </div>
        <input
          type="text"
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          className="block w-full bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-md pl-11 pr-3 focus:border-amber-500 focus:ring-amber-500 sm:text-sm py-2 transition-colors font-medium"
          placeholder="0.00"
        />
      </div>
      {helperText && <p className="text-xs text-slate-500 mt-1 ml-1">{helperText}</p>}
    </div>
  );
}
