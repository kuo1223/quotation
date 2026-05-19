import { useState, useRef, useCallback } from "react";

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const T = {
  bg: "#0f0f0f",
  surface: "#181818",
  surfaceHigh: "#222222",
  border: "#2e2e2e",
  borderLight: "#3a3a3a",
  accent: "#c8a96e",
  accentDim: "#a8893e",
  accentBg: "rgba(200,169,110,0.08)",
  red: "#e05252",
  redBg: "rgba(224,82,82,0.08)",
  green: "#52a882",
  greenBg: "rgba(82,168,130,0.08)",
  text: "#e8e2d8",
  textMuted: "#888",
  textDim: "#555",
  fontDisplay: "'Georgia', serif",
  fontBody: "'Helvetica Neue', Helvetica, Arial, sans-serif",
};

// ─── CONTRACT CLAUSES DATA ────────────────────────────────────────────────────
const CLAUSES = {
  design: [
    { id: "d1", title: "設計委託範圍", content: "乙方受甲方委託，就甲方指定之空間，提供室內設計規劃及相關設計服務。設計範圍以雙方確認之設計說明書為準。" },
    { id: "d2", title: "設計費用及付款方式", content: "設計費用依本合約所定金額計算，付款時程依付款條款執行。甲方未依期付款時，乙方得暫停設計作業。" },
    { id: "d3", title: "設計審閱期", content: "甲方收受設計圖說後，有不少於五日之審閱期。審閱期間甲方得提出書面修改意見，乙方應於合理期間內回覆。" },
    { id: "d4", title: "設計圖說確認", content: "甲方應就乙方提出之設計圖說進行書面確認，確認後之圖說為施工依據。甲方提出修改需求時，乙方得就增加之設計工作另行計費。" },
    { id: "d5", title: "智慧財產權歸屬", content: "乙方就本案所完成之設計圖說，享有著作財產權。甲方於付清設計費後，取得本設計圖說之使用授權，但不得轉讓或重製供他人使用。" },
    { id: "d6", title: "保密義務", content: "雙方就本合約履行過程中所知悉之對方業務資訊、設計內容，均負保密義務，非經對方書面同意不得洩露。" },
    { id: "d7", title: "設計變更", content: "設計確認後，甲方要求之重大變更，應以書面提出。乙方評估後，若涉及額外設計工作，得就增加部分另行報價，經甲方同意後執行。" },
    { id: "d8", title: "設計作業期程", content: "乙方應依雙方確認之設計期程表執行作業。因甲方因素（包括未及時確認、變更設計）致延誤進度者，期程得順延相應天數。" },
    { id: "d9", title: "成果物提交", content: "乙方應提交之設計成果物包括：平面配置圖、天花板圖、立面圖、水電圖、材料說明書及3D示意圖，以雙方確認之格式交付。" },
    { id: "d10", title: "設計師現場配合", content: "乙方應配合工程施作，提供必要之設計說明及現場確認服務。每月現場服務次數及配合事項依設計服務說明書規定。" },
    { id: "d11", title: "甲方配合義務", content: "甲方應提供乙方執行設計所需之相關資料（如現場丈量機會、空調設備規格等），並指定專人負責與乙方聯繫確認。" },
    { id: "d12", title: "乙方資格聲明", content: "乙方聲明已依法完成公司登記，並具備相關室內設計執行能力，若有不實，甲方得解除本合約。" },
    { id: "d13", title: "工程監督責任", content: "乙方提供設計監督服務，惟施工品質由施工廠商負責，乙方之監督義務以書面溝通及現場確認為限。" },
    { id: "d14", title: "不可抗力條款", content: "因天災、疫情、政府法令變更等不可抗力事由，致任一方無法履行本合約義務時，受影響之一方應立即通知對方，雙方協議調整期程或條件。" },
    { id: "d15", title: "合約之解除與終止", content: "甲方得隨時以書面通知終止本合約，惟應給付乙方已完成之設計工作報酬。乙方就甲方違約情事，得定期催告後解除合約。" },
    { id: "d16", title: "爭議解決", content: "本合約相關爭議，雙方應先行協商。協商不成時，以甲方住所地或主要施作地點所在地之法院為第一審管轄法院。" },
    { id: "d17", title: "其他約定", content: "本合約未盡事宜，依中華民國相關法令及室內裝修業相關規範辦理。本合約一式兩份，雙方各執一份為憑。" },
  ],
  construction: [
    { id: "c1", title: "工程承攬範圍", content: "乙方承攬甲方指定空間之室內裝修工程，工程範圍以雙方確認之工程圖說及報價明細為準，未列入者不在承攬範圍內。" },
    { id: "c2", title: "工程報價透明化", content: "乙方應就承攬工程項目，逐項列明品牌、規格、型號、單位、數量及單價，不得僅以「一式」概括計價。" },
    { id: "c3", title: "工程款付款方式", content: "工程款依本合約付款條款分期支付，乙方完成各期里程碑並經甲方確認後，始得請求當期工程款。" },
    { id: "c4", title: "強制審閱期", content: "甲方收受本合約後，享有不少於五日之審閱期，審閱期間得提出書面修改意見。" },
    { id: "c5", title: "施工期程", content: "乙方應於開工後依雙方確認之工程期程表施作。乙方如逾期完工，應按日給付工程總價千分之一計算之違約金，由甲方於工程款中扣除。" },
    { id: "c6", title: "禁止全部轉包", content: "乙方不得將本工程全部轉包予第三人。乙方如有轉包情事，甲方得立即終止本合約，並得請求損害賠償。" },
    { id: "c7", title: "材料所有權", content: "尚未安裝固著之材料所有權屬乙方，甲方依進度付款後，對應材料之所有權移轉予甲方。" },
    { id: "c8", title: "工程變更", content: "工程範圍之增減，應由雙方書面確認。乙方不得自行擴大施工範圍；甲方追加工程項目，應另行書面議定並報價。" },
    { id: "c9", title: "現場安全與清潔", content: "乙方應就施工現場做好安全防護，確保工地安全。每日施工完畢應清理現場，避免影響鄰居或公共安全。" },
    { id: "c10", title: "材料品質聲明", content: "乙方使用之材料應符合雙方約定之規格品牌，不得以劣質品替代。甲方得要求提供材料規格書或出廠證明。" },
    { id: "c11", title: "施工人員資格", content: "乙方派駐施工人員應具備相應工種之技能，現場負責人應具備室內裝修業相關資格，並配合甲方合理之施工管理要求。" },
    { id: "c12", title: "甲方進場確認", content: "甲方得在不影響施工安全之前提下進場查看工程進度，乙方應配合甲方進行各期進度確認。" },
    { id: "c13", title: "竣工驗收", content: "工程完工後，乙方應通知甲方進行驗收。甲方應於通知後七日內驗收，驗收有瑕疵者，乙方應於合理期間內修復完畢。" },
    { id: "c14", title: "保固責任", content: "工程竣工驗收後，乙方提供保固服務：基本結構部分保固一年，設備及零件部分保固六個月，保固期間因乙方施工瑕疵所生之問題，由乙方免費修繕。" },
    { id: "c15", title: "甲方配合義務", content: "甲方應依施工期程配合提供施工所需之現場條件（水電、進場通道等），並指定聯絡窗口與乙方協調。" },
    { id: "c16", title: "不可抗力條款", content: "因天災、疫情、政府命令等不可抗力因素致工程無法進行者，雙方得協議延長期程，不視為違約。" },
    { id: "c17", title: "合約解除與終止", content: "甲方若有正當理由得書面終止合約，惟應給付乙方已完成部分之工程款。乙方如有重大違約情事，甲方得定期催告後解除合約。" },
    { id: "c18", title: "稅務及規費", content: "工程款含於本合約金額內，應課徵之稅捐依法律規定辦理。因工程所生規費、申請費用，除另有約定外，由乙方負擔。" },
    { id: "c19", title: "通知方式", content: "本合約所定各種通知，應以書面方式（含電子郵件、LINE訊息截圖）為之，並確認對方收受。" },
    { id: "c20", title: "保密義務", content: "雙方就本合約履行中所知悉之對方相關資訊，負有保密義務，不得洩露予第三人。" },
    { id: "c21", title: "乙方保險", content: "乙方應投保施工期間工程綜合險及第三人責任保險，保障施工期間可能造成之損害，保險費用由乙方負擔。" },
    { id: "c22", title: "圖說與現場差異", content: "因現場既有條件與設計圖說有所差異時，乙方應即時知會甲方，共同確認解決方案後方得施作，不得自行變更。" },
    { id: "c23", title: "業者資格驗證", content: "乙方聲明已依法辦理公司或商業登記，具備承攬本工程所需之合法資格，相關執照或登記證供甲方查驗。" },
    { id: "c24", title: "尾款與交屋", content: "尾款於甲方驗收合格且無瑕疵後支付。乙方交付工程完工後，應同時移交相關材料規格書、設備說明書及保固書。" },
    { id: "c25", title: "附件效力", content: "本合約附件（含工程圖說、報價明細、材料說明書）與本合約具有同等效力，附件與本文有矛盾時，以本合約條款為準。" },
    { id: "c26", title: "合約修改程序", content: "本合約各條款之修改，需雙方書面同意後方為有效，口頭承諾不具合約效力。" },
    { id: "c27", title: "爭議解決", content: "本合約爭議雙方先行協商，協商不成時，以工程所在地法院為第一審管轄法院。" },
    { id: "c28", title: "其他約定", content: "本合約未盡事宜，依中華民國法令及相關室內裝修規範處理。本合約一式兩份，雙方各執一份。" },
  ],
  combined: [
    { id: "m1", title: "合併委託範圍", content: "甲方委託乙方就指定空間提供設計及工程一體化服務，服務範圍含設計規劃、施工執行及竣工驗收，詳如設計說明書及工程報價明細。" },
    { id: "m2", title: "費用結構", content: "本合約費用分為設計費及工程費兩部分，分別計算，付款時程依付款條款之規定，惟設計費優先於工程費請領。" },
    { id: "m3", title: "審閱期", content: "甲方收受本合約後，享有不少於五日之審閱期，審閱期間可提出書面修改意見。" },
    { id: "m4", title: "設計確認程序", content: "乙方完成設計圖說後，應書面提交甲方確認，甲方應於收到後七日內書面回覆。確認後之圖說為施工依據，甲方不得任意變更。" },
    { id: "m5", title: "工程施作依據", content: "乙方應依甲方確認之設計圖說施作，不得自行變更設計或材料。若現場有差異，應即時知會甲方後方得調整。" },
    { id: "m6", title: "禁止全部轉包", content: "乙方不得將本工程全部轉包，如有轉包情事，甲方得終止本合約並請求損害賠償。" },
    { id: "m7", title: "工程期程及違約金", content: "乙方應依雙方確認之期程表執行，如有逾期，每逾一日應給付工程總價千分之一之違約金，由甲方自工程款中扣除。" },
    { id: "m8", title: "工程變更程序", content: "設計及工程範圍之變更，均需雙方書面同意。乙方評估增加費用後，應書面報價，甲方簽認後方得增加工項。" },
    { id: "m9", title: "材料品質及所有權", content: "乙方使用材料應符合報價明細所載規格，不得自行替換。甲方依進度付款後，對應材料所有權移轉予甲方。" },
    { id: "m10", title: "智慧財產權", content: "本合約所生設計成果，乙方享有著作財產權。甲方付清設計費後，取得設計圖說之使用授權，不得授權第三人使用。" },
    { id: "m11", title: "竣工驗收及保固", content: "工程完工後由雙方驗收，乙方提供結構一年、設備零件六個月之保固，保固期間因施工瑕疵所生問題免費修繕。" },
    { id: "m12", title: "甲方配合義務", content: "甲方應指定聯絡窗口，配合提供設計所需資料及施工所需現場條件，並依期確認各設計及施工里程碑。" },
    { id: "m13", title: "不可抗力", content: "因不可抗力事由致任一方無法履行義務時，受影響方應即時書面通知，雙方協議調整期程。" },
    { id: "m14", title: "保密義務", content: "雙方就本合約執行中所知悉之相關資訊，負有保密義務。" },
    { id: "m15", title: "合約解除與終止", content: "甲方得書面終止合約，惟應給付已完成工作之相對報酬。乙方重大違約時，甲方得定期催告後解除合約。" },
    { id: "m16", title: "稅務與規費", content: "相關稅捐依法律規定辦理，因工程所生申請規費除另有約定外由乙方負擔。" },
    { id: "m17", title: "乙方資格與保險", content: "乙方應具備合法執業資格，並投保施工期間工程綜合險及第三人責任保險。" },
    { id: "m18", title: "通知方式", content: "各種通知應以書面方式為之（含電子郵件或通訊軟體截圖），並確認對方收受。" },
    { id: "m19", title: "附件效力", content: "本合約附件與本合約具同等效力，附件與本文有矛盾時以本合約為準。" },
    { id: "m20", title: "合約修改", content: "合約各條款之修改需雙方書面同意，口頭承諾不具效力。" },
    { id: "m21", title: "現場安全", content: "乙方應確保施工安全，配合社區或大樓之施工管理規定，每日施工完畢清潔現場。" },
    { id: "m22", title: "業者資格聲明", content: "乙方聲明已依法登記，具備執行本合約所需之合法資格。" },
    { id: "m23", title: "尾款及交屋", content: "尾款於驗收合格後支付，乙方應同時移交工程相關文件、設備說明書及保固書。" },
    { id: "m24", title: "爭議解決", content: "本合約爭議雙方先協商，協商不成時以工程所在地法院為第一審管轄法院。" },
    { id: "m25", title: "其他約定", content: "本合約未盡事宜，依中華民國法令及相關規範辦理。本合約一式兩份，雙方各執一份。" },
  ],
  subcontract: [
    { id: "s1", title: "分包工程範圍", content: "甲方（主承攬人）將特定工程項目分包予乙方（分包商）執行，分包範圍以附件報價明細為準，乙方應依甲方指示於指定工地施作。" },
    { id: "s2", title: "分包金額及付款", content: "分包金額依報價明細所載，甲方於乙方完成各工程節點並確認後，依付款條款支付。" },
    { id: "s3", title: "施工期程", content: "乙方應依甲方指定之施工期程施作，配合主工程之整體進度。乙方逾期致主工程延誤者，應賠償甲方相應損失。" },
    { id: "s4", title: "施工品質責任", content: "乙方應確保分包工程之品質符合設計圖說及業主要求標準，如有缺失，乙方應自行負責修繕，費用自負。" },
    { id: "s5", title: "現場安全與清潔", content: "乙方施工人員應遵守現場安全規定，並於施工完畢後清潔現場。乙方人員所生工安事故，由乙方自負責任。" },
    { id: "s6", title: "禁止再轉包", content: "乙方不得將本分包工程再行轉包，如有違反，甲方得終止分包合約並要求賠償。" },
    { id: "s7", title: "材料提供方式", content: "本合約所需材料之提供方式（甲供或乙供），依報價明細所載規定執行。乙供材料應符合業主及主工程規格要求。" },
    { id: "s8", title: "保密義務", content: "乙方就本案業主資訊、設計圖說及施工細節，負有保密義務，非經甲方書面同意不得洩露。" },
    { id: "s9", title: "驗收與保固", content: "甲方或業主驗收確認後，乙方分包工程之保固期依主合約規定執行，保固期間因乙方施工瑕疵所生問題，乙方應免費修繕。" },
    { id: "s10", title: "爭議解決及其他約定", content: "本合約爭議雙方先行協商，協商不成以工程所在地法院為管轄法院。本合約未盡事宜依相關法令辦理，一式兩份各執一份。" },
  ],
};

// ─── MOCK QUOTATIONS ─────────────────────────────────────────────────────────
const MOCK_QUOTATIONS = [
  { id: "q001", name: "永和案 #2024-089", total: 1580000, date: "2024-12-10" },
  { id: "q002", name: "信義計畫案 #2025-003", total: 2340000, date: "2025-01-22" },
  { id: "q003", name: "天母住宅翻修 #2025-011", total: 890000, date: "2025-02-05" },
  { id: "q004", name: "辦公室設計 #2025-028", total: 3120000, date: "2025-03-18" },
];

// ─── INITIAL CONTRACTS ────────────────────────────────────────────────────────
const INITIAL_CONTRACTS = [
  {
    id: "CT-2025-001",
    type: "design",
    title: "信義路四段住宅空間設計委託",
    client: "陳建宏",
    amount: 480000,
    status: "active",
    createdAt: "2025-01-15",
    updatedAt: "2025-03-22",
    quotationId: null,
    isConfidential: false,
    confidentialPwd: "",
    payments: [
      { id: "p1", name: "簽約款", ratio: 30, amount: 144000 },
      { id: "p2", name: "設計確認款", ratio: 40, amount: 192000 },
      { id: "p3", name: "尾款", ratio: 30, amount: 144000 },
    ],
    selectedClauses: CLAUSES.design.map(c => c.id),
    history: [{ date: "2025-01-15", action: "合約建立" }, { date: "2025-03-22", action: "更新付款條件" }],
  },
  {
    id: "CT-2025-002",
    type: "combined",
    title: "南港展覽館辦公室設計統包",
    client: "創誠科技股份有限公司",
    amount: 3200000,
    status: "draft",
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
    quotationId: null,
    isConfidential: true,
    confidentialPwd: "1234",
    payments: [
      { id: "p1", name: "簽約款", ratio: 20, amount: 640000 },
      { id: "p2", name: "設計完成款", ratio: 20, amount: 640000 },
      { id: "p3", name: "開工款", ratio: 20, amount: 640000 },
      { id: "p4", name: "工程中期款", ratio: 25, amount: 800000 },
      { id: "p5", name: "尾款", ratio: 15, amount: 480000 },
    ],
    selectedClauses: CLAUSES.combined.map(c => c.id),
    history: [{ date: "2025-04-01", action: "合約建立" }],
  },
];

// ─── UTILITIES ────────────────────────────────────────────────────────────────
const fmt = (n) => `NT$ ${Number(n).toLocaleString()}`;
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("zh-TW") : "";
let pidCounter = 100;
const newPid = () => `p${pidCounter++}`;

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function ContractSystem() {
  const [contracts, setContracts] = useState(INITIAL_CONTRACTS);
  const [view, setView] = useState("list"); // list | detail | edit | preview
  const [selectedId, setSelectedId] = useState(null);
  const [editData, setEditData] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [newStep, setNewStep] = useState(1);
  const [newData, setNewData] = useState({ type: "design", title: "", client: "", amount: "", quotationId: null });
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdError, setPwdError] = useState("");
  const [unlockedIds, setUnlockedIds] = useState({});
  const [previewAttachments, setPreviewAttachments] = useState({ quotation: null, schedule: null });
  const printRef = useRef();

  const selected = contracts.find(c => c.id === selectedId);

  // ─── NAVIGATE ──────────────────────────────────────────────────────────────
  const openDetail = (contract) => {
    if (contract.isConfidential && !unlockedIds[contract.id]) {
      setSelectedId(contract.id);
      setView("unlock");
    } else {
      setSelectedId(contract.id);
      setView("detail");
    }
  };

  const openEdit = (contract) => {
    const c = contract || selected;
    setEditData(JSON.parse(JSON.stringify(c)));
    setSelectedId(c.id);
    setView("edit");
  };

  const openPreview = () => setView("preview");

  // ─── UNLOCK ───────────────────────────────────────────────────────────────
  const handleUnlock = () => {
    if (confirmPwd === selected.confidentialPwd) {
      setUnlockedIds(u => ({ ...u, [selected.id]: true }));
      setView("detail");
      setConfirmPwd("");
      setPwdError("");
    } else {
      setPwdError("密碼錯誤，請再試一次");
    }
  };

  // ─── SAVE EDIT ────────────────────────────────────────────────────────────
  const saveEdit = () => {
    setContracts(cs => cs.map(c => c.id === editData.id
      ? { ...editData, updatedAt: new Date().toISOString().slice(0, 10), history: [...(editData.history || []), { date: new Date().toISOString().slice(0, 10), action: "編輯更新" }] }
      : c
    ));
    setSelectedId(editData.id);
    setView("detail");
  };

  // ─── EDIT HELPERS ─────────────────────────────────────────────────────────
  const setEd = (field, val) => setEditData(d => ({ ...d, [field]: val }));

  const handleTypeChange = (type) => {
    const clauses = CLAUSES[type] || [];
    setEd("type", type);
    setEditData(d => ({ ...d, type, selectedClauses: clauses.map(c => c.id) }));
  };

  const handleQuotationChange = (qid) => {
    const q = MOCK_QUOTATIONS.find(x => x.id === qid);
    setEditData(d => ({ ...d, quotationId: qid, amount: q ? q.total : d.amount }));
  };

  const toggleClause = (cid) => {
    setEditData(d => ({
      ...d,
      selectedClauses: d.selectedClauses.includes(cid)
        ? d.selectedClauses.filter(x => x !== cid)
        : [...d.selectedClauses, cid]
    }));
  };

  const addPayment = () => {
    setEditData(d => ({
      ...d,
      payments: [...d.payments, { id: newPid(), name: "新增期款", ratio: 0, amount: 0 }]
    }));
  };

  const removePayment = (pid) => {
    setEditData(d => ({ ...d, payments: d.payments.filter(p => p.id !== pid) }));
  };

  const updatePayment = (pid, field, val) => {
    setEditData(d => {
      const payments = d.payments.map(p => {
        if (p.id !== pid) return p;
        const updated = { ...p, [field]: val };
        if (field === "ratio") updated.amount = Math.round((d.amount || 0) * val / 100);
        return updated;
      });
      return { ...d, payments };
    });
  };

  // ─── NEW CONTRACT ─────────────────────────────────────────────────────────
  const createContract = () => {
    const clauses = CLAUSES[newData.type] || [];
    const q = MOCK_QUOTATIONS.find(x => x.id === newData.quotationId);
    const amount = q ? q.total : Number(newData.amount) || 0;
    const id = `CT-${new Date().getFullYear()}-${String(contracts.length + 1).padStart(3, "0")}`;
    const now = new Date().toISOString().slice(0, 10);
    const newC = {
      id, type: newData.type, title: newData.title, client: newData.client,
      amount, status: "draft", createdAt: now, updatedAt: now,
      quotationId: newData.quotationId, isConfidential: false, confidentialPwd: "",
      payments: [
        { id: newPid(), name: "簽約款", ratio: 30, amount: Math.round(amount * 0.3) },
        { id: newPid(), name: "尾款", ratio: 70, amount: Math.round(amount * 0.7) },
      ],
      selectedClauses: clauses.map(c => c.id),
      history: [{ date: now, action: "合約建立" }],
    };
    setContracts(cs => [newC, ...cs]);
    setShowNew(false);
    setNewStep(1);
    setNewData({ type: "design", title: "", client: "", amount: "", quotationId: null });
  };

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: T.fontBody }}>
      {view === "list" && <ListView contracts={contracts} onOpen={openDetail} onEdit={openEdit} onNew={() => setShowNew(true)} />}
      {view === "detail" && selected && (
        <DetailView contract={selected} onBack={() => setView("list")} onEdit={() => openEdit(selected)} onPreview={openPreview} />
      )}
      {view === "edit" && editData && (
        <EditView
          data={editData} quotations={MOCK_QUOTATIONS} clauses={CLAUSES}
          onBack={() => setView(selected ? "detail" : "list")}
          onSave={saveEdit} setEd={setEd}
          onTypeChange={handleTypeChange} onQuotationChange={handleQuotationChange}
          onToggleClause={toggleClause} onAddPayment={addPayment}
          onRemovePayment={removePayment} onUpdatePayment={updatePayment}
        />
      )}
      {view === "preview" && selected && (
        <PreviewView
          contract={selected} attachments={previewAttachments}
          onSetAttachments={setPreviewAttachments}
          onBack={() => setView("detail")} onEdit={() => openEdit(selected)}
          printRef={printRef}
        />
      )}
      {view === "unlock" && selected && (
        <UnlockView
          contract={selected} pwd={confirmPwd} error={pwdError}
          onChange={setConfirmPwd} onUnlock={handleUnlock}
          onBack={() => setView("list")}
        />
      )}
      {showNew && (
        <NewModal
          step={newStep} data={newData} quotations={MOCK_QUOTATIONS}
          onStepChange={setNewStep}
          onChange={(f, v) => setNewData(d => ({ ...d, [f]: v }))}
          onQuotationChange={(qid) => {
            const q = MOCK_QUOTATIONS.find(x => x.id === qid);
            setNewData(d => ({ ...d, quotationId: qid, amount: q ? q.total : d.amount }));
          }}
          onClose={() => { setShowNew(false); setNewStep(1); }}
          onCreate={createContract}
        />
      )}
    </div>
  );
}

// ─── LIST VIEW ────────────────────────────────────────────────────────────────
function ListView({ contracts, onOpen, onEdit, onNew }) {
  const typeLabel = { design: "設計委託", construction: "工程承攬", combined: "設計＋工程", subcontract: "分包協力" };
  const statusLabel = { draft: "草稿", active: "進行中", completed: "完成", archived: "封存" };
  const statusColor = { draft: T.textMuted, active: T.green, completed: T.accent, archived: T.textDim };

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: 4, color: T.accent, fontFamily: T.fontDisplay, marginBottom: 6 }}>得森室內裝修設計</div>
          <h1 style={{ fontSize: 28, fontWeight: 300, fontFamily: T.fontDisplay, color: T.text, margin: 0 }}>合約管理系統</h1>
        </div>
        <button onClick={onNew} style={{ padding: "10px 22px", background: T.accent, color: "#0f0f0f", border: "none", borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: "pointer", letterSpacing: 1 }}>
          ＋ 新建合約
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {contracts.map(c => (
          <div key={c.id} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "20px 24px", display: "flex", alignItems: "center", gap: 20, cursor: "pointer", transition: "border-color .15s" }}
            onClick={() => onOpen(c)}
            onMouseEnter={e => e.currentTarget.style.borderColor = T.accent}
            onMouseLeave={e => e.currentTarget.style.borderColor = T.border}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                {c.isConfidential && <span style={{ fontSize: 10, background: T.redBg, color: T.red, border: `1px solid ${T.red}`, padding: "1px 6px", borderRadius: 4 }}>🔒 密件</span>}
                <span style={{ fontSize: 11, color: T.accent, background: T.accentBg, padding: "1px 8px", borderRadius: 4 }}>{typeLabel[c.type]}</span>
                <span style={{ fontSize: 11, color: statusColor[c.status] }}>● {statusLabel[c.status]}</span>
              </div>
              <div style={{ fontSize: 16, fontWeight: 500, color: T.text }}>{c.title}</div>
              <div style={{ fontSize: 12, color: T.textMuted, marginTop: 4 }}>{c.client}　　{c.id}　　建立：{fmtDate(c.createdAt)}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 18, fontWeight: 600, color: T.accent, fontFamily: T.fontDisplay }}>{fmt(c.amount)}</div>
              <button onClick={e => { e.stopPropagation(); onEdit(c); }} style={{ marginTop: 6, padding: "4px 12px", background: "transparent", border: `1px solid ${T.border}`, color: T.textMuted, borderRadius: 4, fontSize: 11, cursor: "pointer" }}>
                編輯
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── DETAIL VIEW ──────────────────────────────────────────────────────────────
function DetailView({ contract: c, onBack, onEdit, onPreview }) {
  const typeLabel = { design: "設計委託", construction: "工程承攬", combined: "設計＋工程合併", subcontract: "分包協力" };
  const clauses = CLAUSES[c.type] || [];
  const activeClauses = clauses.filter(cl => c.selectedClauses.includes(cl.id));

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 24px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <button onClick={onBack} style={backBtn}>← 返回列表</button>
        <div style={{ flex: 1 }} />
        <button onClick={onEdit} style={{ padding: "8px 20px", background: T.accent, color: "#0f0f0f", border: "none", borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          ✏️ 編輯
        </button>
        {c.status === "draft" && (
          <button onClick={onPreview} style={{ padding: "8px 20px", background: T.surfaceHigh, color: T.text, border: `1px solid ${T.border}`, borderRadius: 6, fontSize: 13, cursor: "pointer" }}>
            👁 預覽
          </button>
        )}
      </div>

      <div style={{ background: T.surface, borderRadius: 12, border: `1px solid ${T.border}`, overflow: "hidden" }}>
        {/* Title bar */}
        <div style={{ padding: "24px 28px", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: T.accent, background: T.accentBg, padding: "2px 10px", borderRadius: 20 }}>{typeLabel[c.type]}</span>
            {c.isConfidential && <span style={{ fontSize: 11, color: T.red, background: T.redBg, padding: "2px 10px", borderRadius: 20 }}>🔒 密件</span>}
          </div>
          <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 500, fontFamily: T.fontDisplay }}>{c.title}</h2>
          <div style={{ color: T.textMuted, fontSize: 13 }}>{c.id}　建立：{fmtDate(c.createdAt)}　最後更新：{fmtDate(c.updatedAt)}</div>
        </div>

        {/* Info */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
          {[["委託方（甲方）", c.client], ["合約金額", fmt(c.amount)], ["合約類型", typeLabel[c.type]], ["建立日期", fmtDate(c.createdAt)]].map(([k, v]) => (
            <div key={k} style={{ padding: "16px 28px", borderBottom: `1px solid ${T.border}` }}>
              <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 4 }}>{k}</div>
              <div style={{ fontSize: 15, color: T.text }}>{v}</div>
            </div>
          ))}
        </div>

        {/* Payments */}
        <div style={{ padding: "20px 28px", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 12 }}>付款條件</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {c.payments.map((p, i) => (
              <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, background: T.surfaceHigh, borderRadius: 6, padding: "10px 14px" }}>
                <span style={{ fontSize: 12, color: T.textMuted, width: 60 }}>第{i + 1}期</span>
                <span style={{ flex: 1, fontSize: 14 }}>{p.name}</span>
                <span style={{ fontSize: 13, color: T.textMuted }}>{p.ratio}%</span>
                <span style={{ fontSize: 14, color: T.accent, fontFamily: T.fontDisplay }}>{fmt(p.amount)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Clauses */}
        <div style={{ padding: "20px 28px", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 12 }}>合約條款（{activeClauses.length} 條納入）</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {activeClauses.map((cl, i) => (
              <div key={cl.id} style={{ display: "flex", gap: 12, background: T.surfaceHigh, borderRadius: 6, padding: "10px 14px" }}>
                <span style={{ fontSize: 12, color: T.accent, minWidth: 36 }}>第{i + 1}條</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{cl.title}</div>
                  <div style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.6 }}>{cl.content}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* History */}
        <div style={{ padding: "20px 28px" }}>
          <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 10 }}>修改歷程</div>
          {c.history.map((h, i) => (
            <div key={i} style={{ display: "flex", gap: 12, fontSize: 12, color: T.textMuted, marginBottom: 4 }}>
              <span>{fmtDate(h.date)}</span><span>{h.action}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── EDIT VIEW ────────────────────────────────────────────────────────────────
function EditView({ data: d, quotations, clauses, onBack, onSave, setEd, onTypeChange, onQuotationChange, onToggleClause, onAddPayment, onRemovePayment, onUpdatePayment }) {
  const typeOptions = [
    { value: "design", label: "設計委託約" },
    { value: "construction", label: "工程承攬約" },
    { value: "combined", label: "設計＋工程合併約" },
    { value: "subcontract", label: "分包協力約" },
  ];
  const currentClauses = clauses[d.type] || [];
  const totalRatio = d.payments.reduce((s, p) => s + Number(p.ratio || 0), 0);

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <button onClick={onBack} style={backBtn}>← 返回</button>
        <h2 style={{ flex: 1, margin: 0, fontSize: 18, fontWeight: 400, fontFamily: T.fontDisplay }}>編輯合約</h2>
        <button onClick={onSave} style={{ padding: "8px 24px", background: T.accent, color: "#0f0f0f", border: "none", borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          儲存
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Basic info */}
        <Section title="基本資訊">
          <Row label="合約類型">
            <select value={d.type} onChange={e => onTypeChange(e.target.value)} style={selectStyle}>
              {typeOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </Row>
          <Row label="合約名稱">
            <input value={d.title} onChange={e => setEd("title", e.target.value)} style={inputStyle} placeholder="請輸入合約名稱" />
          </Row>
          <Row label="委託方（甲方）">
            <input value={d.client} onChange={e => setEd("client", e.target.value)} style={inputStyle} placeholder="客戶姓名/公司" />
          </Row>
          <Row label="連結報價單">
            <select value={d.quotationId || ""} onChange={e => onQuotationChange(e.target.value || null)} style={selectStyle}>
              <option value="">不連結報價單</option>
              {quotations.map(q => <option key={q.id} value={q.id}>{q.name}（{fmt(q.total)}）</option>)}
            </select>
          </Row>
          <Row label="合約金額（元）">
            <input
              value={d.amount}
              onChange={e => setEd("amount", Number(e.target.value) || 0)}
              style={inputStyle} type="number" placeholder="0"
              readOnly={!!d.quotationId}
            />
            {d.quotationId && <span style={{ fontSize: 11, color: T.accent, marginLeft: 8 }}>✓ 已從報價單帶入</span>}
          </Row>
        </Section>

        {/* Payments */}
        <Section title="付款方式">
          <div style={{ marginBottom: 8, fontSize: 12, color: totalRatio !== 100 ? T.red : T.green }}>
            目前比例合計：{totalRatio}%（{totalRatio === 100 ? "✓ 正確" : "⚠ 需等於 100%"}）
          </div>
          {d.payments.map((p, i) => (
            <div key={p.id} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: T.textMuted, width: 30 }}>{i + 1}</span>
              <input value={p.name} onChange={e => onUpdatePayment(p.id, "name", e.target.value)} style={{ ...inputStyle, flex: 2, fontSize: 13 }} placeholder="期款名稱" />
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <input value={p.ratio} onChange={e => onUpdatePayment(p.id, "ratio", Number(e.target.value))} style={{ ...inputStyle, width: 60, textAlign: "center" }} type="number" min="0" max="100" />
                <span style={{ fontSize: 12, color: T.textMuted }}>%</span>
              </div>
              <span style={{ fontSize: 13, color: T.accent, minWidth: 120, textAlign: "right" }}>{fmt(p.amount)}</span>
              <button onClick={() => onRemovePayment(p.id)} style={{ background: "none", border: "none", color: T.red, cursor: "pointer", fontSize: 16, padding: "0 4px" }}>✕</button>
            </div>
          ))}
          <button onClick={onAddPayment} style={{ marginTop: 4, padding: "6px 16px", background: "none", border: `1px dashed ${T.border}`, color: T.textMuted, borderRadius: 6, fontSize: 12, cursor: "pointer" }}>
            ＋ 新增期數
          </button>
        </Section>

        {/* Confidential */}
        <Section title="密件設定">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <input type="checkbox" checked={d.isConfidential} onChange={e => setEd("isConfidential", e.target.checked)} style={{ accentColor: T.accent, width: 16, height: 16 }} />
              <span style={{ fontSize: 13 }}>設為密件（需密碼才能開啟此合約）</span>
            </label>
          </div>
          {d.isConfidential && (
            <div style={{ marginTop: 12 }}>
              <Row label="設定密碼">
                <input value={d.confidentialPwd} onChange={e => setEd("confidentialPwd", e.target.value)} style={inputStyle} type="password" placeholder="請設定合約密碼" />
              </Row>
            </div>
          )}
        </Section>

        {/* Clauses */}
        <Section title={`合約條款（${d.type === "design" ? "設計委託約" : d.type === "construction" ? "工程承攬約" : d.type === "combined" ? "設計＋工程合併約" : "分包協力約"}）`}>
          <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 12 }}>勾選納入的條款（取消勾選不影響其他條款編號連續性）</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {currentClauses.map(cl => {
              const active = d.selectedClauses.includes(cl.id);
              return (
                <label key={cl.id} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 12px", borderRadius: 6, background: active ? T.accentBg : T.surfaceHigh, border: `1px solid ${active ? T.accentDim : T.border}`, cursor: "pointer", transition: "all .15s" }}>
                  <input type="checkbox" checked={active} onChange={() => onToggleClause(cl.id)} style={{ accentColor: T.accent, marginTop: 2 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: active ? T.text : T.textMuted }}>{cl.title}</div>
                    <div style={{ fontSize: 11, color: T.textMuted, marginTop: 2, lineHeight: 1.5 }}>{cl.content.slice(0, 60)}...</div>
                  </div>
                </label>
              );
            })}
          </div>
        </Section>
      </div>
    </div>
  );
}

// ─── PREVIEW VIEW ─────────────────────────────────────────────────────────────
function PreviewView({ contract: c, attachments, onSetAttachments, onBack, onEdit, printRef }) {
  const [showPdfModal, setShowPdfModal] = useState(false);
  const clauses = CLAUSES[c.type] || [];
  const activeClauses = clauses.filter(cl => c.selectedClauses.includes(cl.id));
  const typeLabel = { design: "設計委託約", construction: "工程承攬約", combined: "設計委託暨工程承攬合約", subcontract: "分包協力約" };
  const today = new Date().toLocaleDateString("zh-TW", { year: "numeric", month: "long", day: "numeric" });

  const handleFileUpload = (field, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onSetAttachments(a => ({ ...a, [field]: { name: file.name, url } }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ background: T.bg, minHeight: "100vh" }}>
      {/* Toolbar */}
      <div style={{ position: "sticky", top: 0, background: T.surface, borderBottom: `1px solid ${T.border}`, padding: "12px 24px", display: "flex", gap: 10, alignItems: "center", zIndex: 100 }}>
        <button onClick={onBack} style={backBtn}>← 返回詳細</button>
        <button onClick={onEdit} style={{ padding: "6px 16px", background: "none", border: `1px solid ${T.border}`, color: T.textMuted, borderRadius: 6, fontSize: 12, cursor: "pointer" }}>✏️ 編輯</button>
        <div style={{ flex: 1 }} />
        <div>
          <label style={{ fontSize: 12, color: T.textMuted, marginRight: 8 }}>附加報價單JPG：</label>
          <label style={{ padding: "5px 12px", background: T.surfaceHigh, border: `1px solid ${T.border}`, color: T.text, borderRadius: 6, fontSize: 11, cursor: "pointer" }}>
            {attachments.quotation ? `✓ ${attachments.quotation.name}` : "選擇檔案"}
            <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => handleFileUpload("quotation", e)} />
          </label>
        </div>
        <div>
          <label style={{ fontSize: 12, color: T.textMuted, marginRight: 8 }}>附加進度表JPG：</label>
          <label style={{ padding: "5px 12px", background: T.surfaceHigh, border: `1px solid ${T.border}`, color: T.text, borderRadius: 6, fontSize: 11, cursor: "pointer" }}>
            {attachments.schedule ? `✓ ${attachments.schedule.name}` : "選擇檔案"}
            <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => handleFileUpload("schedule", e)} />
          </label>
        </div>
        <button onClick={handlePrint} style={{ padding: "6px 16px", background: "none", border: `1px solid ${T.border}`, color: T.textMuted, borderRadius: 6, fontSize: 12, cursor: "pointer" }}>🖨 列印</button>
        <button onClick={() => setShowPdfModal(true)} style={{ padding: "6px 18px", background: T.accent, color: "#0f0f0f", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>📄 PDF下載</button>
      </div>

      {/* A4 Document */}
      <div style={{ display: "flex", justifyContent: "center", padding: "32px 24px" }}>
        <div id="print-area" ref={printRef} style={{
          width: 794, background: "#fff", color: "#1a1a1a",
          fontFamily: "'SimSun', 'Noto Serif TC', serif",
          boxShadow: "0 8px 48px rgba(0,0,0,0.5)",
          borderRadius: 2,
        }}>
          {/* COVER PAGE */}
          <div style={{ width: "100%", height: 1122, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderBottom: "2px solid #1a1a1a", pageBreakAfter: "always", position: "relative", padding: "60px 80px", boxSizing: "border-box" }}>
            <div style={{ position: "absolute", top: 40, left: 80, right: 80, borderBottom: "1px solid #ccc", paddingBottom: 10 }}>
              <div style={{ fontSize: 10, color: "#888", letterSpacing: 4 }}>得森室內裝修設計有限公司</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 13, color: "#888", letterSpacing: 6, marginBottom: 24 }}>室內裝修設計合約書</div>
              <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: 4, marginBottom: 8, color: "#1a1a1a" }}>{c.title}</div>
              <div style={{ fontSize: 16, color: "#555", letterSpacing: 2, marginBottom: 60 }}>{typeLabel[c.type]}</div>
              <div style={{ width: 60, height: 1, background: "#ccc", margin: "0 auto 60px" }} />
              <div style={{ fontSize: 13, color: "#555", lineHeight: 2.4 }}>
                <div>案號：{c.id}</div>
                <div>委託方：{c.client}</div>
                <div>合約金額：{fmt(c.amount)}</div>
                <div>日期：{today}</div>
              </div>
            </div>
            <div style={{ position: "absolute", bottom: 80, left: 80, right: 80, borderTop: "1px solid #ccc", paddingTop: 20, display: "flex", justifyContent: "space-between", fontSize: 11, color: "#888" }}>
              <div>得森室內裝修設計有限公司<br />台北市信義區松仁路28號</div>
              <div style={{ textAlign: "right" }}>Tel: (02) 2345-6789<br />www.desin.com.tw</div>
            </div>
          </div>

          {/* CONTRACT BODY */}
          <div style={{ padding: "60px 80px" }}>
            <div style={{ textAlign: "center", marginBottom: 40, borderBottom: "2px solid #1a1a1a", paddingBottom: 20 }}>
              <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: 4, margin: "0 0 8px" }}>{typeLabel[c.type]}</h1>
              <div style={{ fontSize: 12, color: "#555" }}>立合約書人</div>
            </div>

            {/* Parties */}
            <div style={{ marginBottom: 32, padding: "20px 24px", border: "1px solid #ddd", borderRadius: 4 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                <div>
                  <div style={{ fontSize: 12, color: "#888", marginBottom: 6 }}>甲方（委託人）</div>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>{c.client}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: "#888", marginBottom: 6 }}>乙方（承攬人）</div>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>得森室內裝修設計有限公司</div>
                  <div style={{ fontSize: 12, color: "#555", marginTop: 4 }}>代表人：郭明彰</div>
                </div>
              </div>
              <div style={{ marginTop: 16, fontSize: 13, color: "#333", lineHeight: 1.8 }}>
                茲因甲方委託乙方辦理室內裝修事宜，雙方同意訂立本合約，條款如下：
              </div>
            </div>

            {/* Clauses */}
            <div>
              {activeClauses.map((cl, i) => (
                <div key={cl.id} style={{ marginBottom: 24, pageBreakInside: "avoid" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6, color: "#1a1a1a" }}>第{i + 1}條　{cl.title}</div>
                  <div style={{ fontSize: 13, color: "#333", lineHeight: 2, textIndent: "2em", paddingLeft: 8, borderLeft: "3px solid #e8e0d0" }}>{cl.content}</div>
                </div>
              ))}
            </div>

            {/* Payments */}
            <div style={{ marginTop: 32, marginBottom: 32 }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>付款條件</div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#f5f2ee" }}>
                    <th style={thStyle}>期次</th>
                    <th style={thStyle}>名稱</th>
                    <th style={thStyle}>比例</th>
                    <th style={thStyle}>金額</th>
                  </tr>
                </thead>
                <tbody>
                  {c.payments.map((p, i) => (
                    <tr key={p.id} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={tdStyle}>第{i + 1}期</td>
                      <td style={tdStyle}>{p.name}</td>
                      <td style={{ ...tdStyle, textAlign: "center" }}>{p.ratio}%</td>
                      <td style={{ ...tdStyle, textAlign: "right", fontWeight: 600 }}>{fmt(p.amount)}</td>
                    </tr>
                  ))}
                  <tr style={{ background: "#f5f2ee" }}>
                    <td colSpan={3} style={{ ...tdStyle, fontWeight: 700 }}>合計</td>
                    <td style={{ ...tdStyle, textAlign: "right", fontWeight: 700 }}>{fmt(c.amount)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Signature */}
            <div style={{ marginTop: 48, borderTop: "1px solid #ddd", paddingTop: 32 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 20 }}>甲方（委託人）簽署</div>
                  <div style={{ fontSize: 12, color: "#555", lineHeight: 2.8 }}>
                    <div>姓名／公司名稱：{c.client}</div>
                    <div>簽章：＿＿＿＿＿＿＿＿＿</div>
                    <div>日期：＿＿年＿＿月＿＿日</div>
                    <div>地址：＿＿＿＿＿＿＿＿＿＿＿</div>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 20 }}>乙方（承攬人）簽署</div>
                  <div style={{ fontSize: 12, color: "#555", lineHeight: 2.8 }}>
                    <div>公司名稱：得森室內裝修設計有限公司</div>
                    <div>代表人：郭明彰</div>
                    <div>簽章：＿＿＿＿＿＿＿＿＿</div>
                    <div>日期：＿＿年＿＿月＿＿日</div>
                    <div>統一編號：＿＿＿＿＿＿＿＿</div>
                    <div>地址：台北市信義區松仁路28號</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Attachments */}
          {(attachments.quotation || attachments.schedule) && (
            <div style={{ borderTop: "2px solid #1a1a1a" }}>
              {attachments.quotation && (
                <div style={{ padding: "40px 80px", pageBreakBefore: "always" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, borderBottom: "1px solid #ddd", paddingBottom: 8 }}>附件一：報價單</div>
                  <img src={attachments.quotation.url} alt="報價單" style={{ width: "100%", maxHeight: 900, objectFit: "contain" }} />
                </div>
              )}
              {attachments.schedule && (
                <div style={{ padding: "40px 80px", pageBreakBefore: "always" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, borderBottom: "1px solid #ddd", paddingBottom: 8 }}>附件二：施工進度表</div>
                  <img src={attachments.schedule.url} alt="施工進度表" style={{ width: "100%", maxHeight: 900, objectFit: "contain" }} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* PDF Modal */}
      {showPdfModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
          <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: 32, width: 480 }}>
            <h3 style={{ margin: "0 0 20px", fontSize: 18, fontFamily: T.fontDisplay }}>📄 PDF 輸出</h3>
            <div style={{ background: T.surfaceHigh, borderRadius: 8, padding: 20, marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 12 }}>文件預覽摘要</div>
              <div style={{ fontSize: 13, lineHeight: 2 }}>
                <div>📋 {c.title}</div>
                <div>👤 委託方：{c.client}</div>
                <div>💰 合約金額：{fmt(c.amount)}</div>
                <div>📝 條款數：{activeClauses.length} 條</div>
                <div>💳 付款期數：{c.payments.length} 期</div>
                {attachments.quotation && <div>📎 附件：{attachments.quotation.name}</div>}
                {attachments.schedule && <div>📎 附件：{attachments.schedule.name}</div>}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setShowPdfModal(false)} style={{ padding: "8px 20px", background: "none", border: `1px solid ${T.border}`, color: T.textMuted, borderRadius: 6, cursor: "pointer" }}>取消</button>
              <button onClick={() => { setShowPdfModal(false); window.print(); }} style={{ padding: "8px 24px", background: T.accent, color: "#0f0f0f", border: "none", borderRadius: 6, fontWeight: 700, cursor: "pointer" }}>⬇ 下載 PDF</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media print {
          body > *:not(#root) { display: none; }
          #print-area { box-shadow: none !important; border-radius: 0 !important; }
          .no-print { display: none !important; }
          @page { size: A4; margin: 0; }
        }
      `}</style>
    </div>
  );
}

// ─── UNLOCK VIEW ──────────────────────────────────────────────────────────────
function UnlockView({ contract: c, pwd, error, onChange, onUnlock, onBack }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: 40, width: 360, textAlign: "center" }}>
        <div style={{ fontSize: 36, marginBottom: 16 }}>🔒</div>
        <h3 style={{ margin: "0 0 8px", fontFamily: T.fontDisplay, fontWeight: 400 }}>密件合約</h3>
        <div style={{ fontSize: 13, color: T.textMuted, marginBottom: 24 }}>{c.title}</div>
        <input
          type="password" value={pwd} onChange={e => onChange(e.target.value)}
          onKeyDown={e => e.key === "Enter" && onUnlock()}
          style={{ ...inputStyle, width: "100%", textAlign: "center", marginBottom: 8 }}
          placeholder="請輸入合約密碼"
        />
        {error && <div style={{ fontSize: 12, color: T.red, marginBottom: 8 }}>{error}</div>}
        <button onClick={onUnlock} style={{ width: "100%", padding: "10px", background: T.accent, color: "#0f0f0f", border: "none", borderRadius: 6, fontSize: 14, fontWeight: 700, cursor: "pointer", marginTop: 8 }}>
          解鎖
        </button>
        <button onClick={onBack} style={{ width: "100%", padding: "8px", background: "none", border: "none", color: T.textMuted, fontSize: 13, cursor: "pointer", marginTop: 8 }}>
          返回列表
        </button>
      </div>
    </div>
  );
}

// ─── NEW MODAL ────────────────────────────────────────────────────────────────
function NewModal({ step, data, quotations, onStepChange, onChange, onQuotationChange, onClose, onCreate }) {
  const typeOptions = [
    { value: "design", label: "設計委託約", desc: "設計師提供圖說及監造服務" },
    { value: "construction", label: "工程承攬約", desc: "施工廠商執行裝修工程" },
    { value: "combined", label: "設計＋工程合併約", desc: "一體化設計施工服務" },
    { value: "subcontract", label: "分包協力約", desc: "主承攬人分包特定工種" },
  ];

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300 }}>
      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: "32px 36px", width: 520 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
          <h3 style={{ margin: 0, fontFamily: T.fontDisplay, fontWeight: 400 }}>新建合約 {step}/2</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: T.textMuted, fontSize: 20, cursor: "pointer" }}>✕</button>
        </div>

        {step === 1 && (
          <div>
            <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 12 }}>選擇合約類型</div>
            {typeOptions.map(o => (
              <label key={o.value} style={{ display: "flex", gap: 12, padding: "12px 14px", borderRadius: 8, border: `1px solid ${data.type === o.value ? T.accent : T.border}`, marginBottom: 8, cursor: "pointer", background: data.type === o.value ? T.accentBg : "transparent" }}>
                <input type="radio" name="type" value={o.value} checked={data.type === o.value} onChange={() => onChange("type", o.value)} style={{ accentColor: T.accent }} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{o.label}</div>
                  <div style={{ fontSize: 12, color: T.textMuted }}>{o.desc}</div>
                </div>
              </label>
            ))}
          </div>
        )}

        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Row label="合約名稱">
              <input value={data.title} onChange={e => onChange("title", e.target.value)} style={inputStyle} placeholder="例：信義路住宅空間設計委託" />
            </Row>
            <Row label="委託方（甲方）">
              <input value={data.client} onChange={e => onChange("client", e.target.value)} style={inputStyle} placeholder="客戶姓名/公司名稱" />
            </Row>
            <Row label="連結報價單">
              <select value={data.quotationId || ""} onChange={e => onQuotationChange(e.target.value || null)} style={selectStyle}>
                <option value="">不連結報價單</option>
                {quotations.map(q => <option key={q.id} value={q.id}>{q.name}（{fmt(q.total)}）</option>)}
              </select>
            </Row>
            <Row label="合約金額（元）">
              <input value={data.amount} onChange={e => onChange("amount", e.target.value)} style={inputStyle} type="number" placeholder="0" readOnly={!!data.quotationId} />
              {data.quotationId && <span style={{ fontSize: 11, color: T.accent, marginLeft: 8 }}>✓ 已從報價單帶入</span>}
            </Row>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28 }}>
          <button onClick={() => step > 1 ? onStepChange(step - 1) : onClose()} style={{ padding: "8px 22px", background: "none", border: `1px solid ${T.border}`, color: T.textMuted, borderRadius: 6, cursor: "pointer" }}>
            {step > 1 ? "← 上一步" : "取消"}
          </button>
          <button onClick={() => step < 2 ? onStepChange(step + 1) : onCreate()} style={{ padding: "8px 24px", background: T.accent, color: "#0f0f0f", border: "none", borderRadius: 6, fontWeight: 700, cursor: "pointer" }}>
            {step < 2 ? "下一步 →" : "建立合約"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
function Section({ title, children }) {
  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "20px 24px" }}>
      <div style={{ fontSize: 11, color: T.accent, letterSpacing: 2, marginBottom: 14, textTransform: "uppercase" }}>{title}</div>
      {children}
    </div>
  );
}

function Row({ label, children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
      <label style={{ fontSize: 12, color: T.textMuted, minWidth: 120 }}>{label}</label>
      <div style={{ flex: 1, display: "flex", alignItems: "center" }}>{children}</div>
    </div>
  );
}

// ─── SHARED STYLES ────────────────────────────────────────────────────────────
const inputStyle = {
  background: T.surfaceHigh, border: `1px solid ${T.border}`, color: T.text,
  borderRadius: 6, padding: "8px 12px", fontSize: 13, outline: "none",
  width: "100%", boxSizing: "border-box",
};
const selectStyle = {
  ...inputStyle, cursor: "pointer",
};
const backBtn = {
  padding: "6px 14px", background: "none", border: `1px solid ${T.border}`,
  color: T.textMuted, borderRadius: 6, fontSize: 12, cursor: "pointer",
};
const thStyle = {
  padding: "8px 12px", textAlign: "left", fontSize: 12, fontWeight: 600,
  borderBottom: "1px solid #ddd", color: "#555",
};
const tdStyle = {
  padding: "8px 12px", fontSize: 13, borderBottom: "1px solid #eee",
};
