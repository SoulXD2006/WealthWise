import { useState, useEffect, useCallback } from "react";
import {
  Newspaper, RefreshCw, ExternalLink, Clock, TrendingUp,
  TrendingDown, Minus, Search, Bookmark, BookmarkCheck,
  ChevronRight, AlertCircle, Wifi, WifiOff, Filter, X
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  source: string;
  author: string;
  publishedAt: string;
  category: string;
  sentiment: "bullish" | "bearish" | "neutral";
  tickers: string[];
  imageUrl?: string;
}

// ---------------------------------------------------------------------------
// Mock data — mirrors what NewsAPI / Marketaux returns
// ---------------------------------------------------------------------------
const MOCK_ARTICLES: Article[] = [
  {
    id: "1",
    title: "Federal Reserve Signals Potential Rate Cuts as Inflation Eases Toward 2% Target",
    description: "Fed officials indicated they may begin cutting interest rates later this year after recent data showed inflation continuing its downward trend, boosting market sentiment across equities.",
    content: "Federal Reserve officials signaled growing confidence that inflation is on a sustainable path toward their 2% target, opening the door to potential interest rate cuts in the coming months. Fed Chair Jerome Powell noted in recent remarks that the central bank is watching economic data closely before making any moves. Markets reacted positively to the news, with the S&P 500 rising 1.2% on the day. Bond yields fell as investors priced in a higher probability of rate cuts before year-end. Economists widely expect the Fed to hold rates steady at its next meeting while leaving the door open for future adjustments. The labor market remains robust, with unemployment hovering near historic lows, giving policymakers room to navigate carefully.",
    url: "#",
    source: "Reuters",
    author: "Howard Schneider",
    publishedAt: "2026-06-09T10:30:00Z",
    category: "macro",
    sentiment: "bullish",
    tickers: ["SPY", "QQQ", "TLT"],
  },
  {
    id: "2",
    title: "NVIDIA Surpasses $4 Trillion Market Cap Milestone on AI Chip Demand",
    description: "NVIDIA's stock climbed to new all-time highs after the company reported quarterly revenue that once again exceeded Wall Street estimates, driven by insatiable demand for its H100 and Blackwell GPU series.",
    content: "NVIDIA Corporation crossed the $4 trillion market capitalization threshold for the first time, cementing its position as the world's most valuable company. The chipmaker reported quarterly revenue of $36 billion, a 122% year-over-year increase, fueled by data center customers rushing to secure its latest-generation AI accelerators. CEO Jensen Huang cited an 'extraordinary' demand environment with no signs of slowing. Hyperscalers including Microsoft, Google, and Amazon continue to invest heavily in AI infrastructure. Analysts from Goldman Sachs raised their price target to $1,800, while Morgan Stanley maintained an Overweight rating. The stock has more than tripled over the past 18 months.",
    url: "#",
    source: "Bloomberg",
    author: "Ian King",
    publishedAt: "2026-06-09T09:15:00Z",
    category: "earnings",
    sentiment: "bullish",
    tickers: ["NVDA", "AMD", "INTC"],
  },
  {
    id: "3",
    title: "Bitcoin Consolidates Near $98,000 Ahead of Key Halving Anniversary",
    description: "Crypto markets remain in a tight range as analysts debate whether Bitcoin's next leg up is dependent on further ETF inflows or a macro catalyst from the Fed.",
    content: "Bitcoin traded in a narrow band between $96,000 and $100,000 as investors took stock of the cryptocurrency's massive gains over the past year. Spot Bitcoin ETFs have seen steady inflows, with BlackRock's iShares Bitcoin Trust recording $500 million in net new assets last week alone. On-chain metrics suggest long-term holders remain committed while short-term traders take profits. Some analysts warn of a potential consolidation phase before a breakout above $110,000, while others see the current pullback as a healthy reset. Ethereum and Solana similarly traded sideways, with DeFi total value locked rising modestly to $180 billion. Regulatory clarity in the US has improved crypto's institutional appeal.",
    url: "#",
    source: "CoinDesk",
    author: "Omkar Godbole",
    publishedAt: "2026-06-09T08:45:00Z",
    category: "crypto",
    sentiment: "neutral",
    tickers: ["BTC", "ETH", "SOL"],
  },
  {
    id: "4",
    title: "Apple Set to Unveil AI-Powered iPhone 18 with On-Device Neural Processing",
    description: "Leaked supply chain data and analyst reports suggest Apple's next flagship will feature a dedicated neural chip capable of running large language models entirely on-device.",
    content: "Apple is expected to announce the iPhone 18 lineup at its annual September event, featuring a significant leap in on-device artificial intelligence capabilities. According to supply chain sources, the A20 chip will include a dedicated neural processing unit with 60% more performance than its predecessor. The company has been investing heavily in Apple Intelligence features, aiming to run complex LLM tasks without sending data to the cloud. Analysts estimate the new models could command a $50-100 premium over the iPhone 17, supporting Apple's average selling price. The company recently signed partnerships with several AI labs to expand its model catalog. Apple shares rose 0.8% on the reports.",
    url: "#",
    source: "The Information",
    author: "Wayne Ma",
    publishedAt: "2026-06-09T07:20:00Z",
    category: "tech",
    sentiment: "bullish",
    tickers: ["AAPL", "QCOM", "TSM"],
  },
  {
    id: "5",
    title: "China's Economy Shows Signs of Deflation Risk Despite Stimulus Measures",
    description: "Consumer prices in China fell for the third consecutive month, raising concerns about a prolonged deflationary spiral that could dampen global growth.",
    content: "China's National Bureau of Statistics reported that the consumer price index fell 0.2% year-on-year in May, the third straight monthly decline. Producer prices also dropped 2.5%, suggesting weak domestic demand and oversupply in key manufacturing sectors. The government has rolled out a package of stimulus measures, including property market support and infrastructure spending, but analysts say the impact has been limited. Some economists draw comparisons to Japan's lost decade, warning that structural issues including high youth unemployment and a property overhang are difficult to resolve quickly. The yuan weakened slightly against the dollar on the data, while Chinese equities pared earlier gains. Global commodity markets felt the pressure, with copper and iron ore prices falling.",
    url: "#",
    source: "Financial Times",
    author: "Sun Yu",
    publishedAt: "2026-06-08T18:00:00Z",
    category: "macro",
    sentiment: "bearish",
    tickers: ["FXI", "MCHI", "EWH"],
  },
  {
    id: "6",
    title: "Tesla Deliveries Beat Estimates as Cybertruck Ramp Exceeds Expectations",
    description: "Tesla reported Q2 deliveries of 510,000 vehicles, ahead of the 490,000 consensus, as the Cybertruck production line ran at full capacity for the first time.",
    content: "Tesla Inc. delivered 510,000 vehicles in the second quarter of 2026, surpassing Wall Street's consensus estimate of 490,000. The outperformance was driven by a strong contribution from the Cybertruck, which reached full production capacity at Tesla's Austin Gigafactory. CEO Elon Musk credited improved supply chain efficiencies and a refreshed Model Y design with boosting demand in North America and Europe. Energy storage deployments also hit a record 10 GWh for the quarter. The company maintained its full-year delivery guidance and reiterated plans to begin production of a more affordable $25,000 model in late 2026. Tesla shares jumped 5.2% in after-hours trading following the announcement.",
    url: "#",
    source: "CNBC",
    author: "Lora Kolodny",
    publishedAt: "2026-06-08T16:30:00Z",
    category: "earnings",
    sentiment: "bullish",
    tickers: ["TSLA", "RIVN", "GM"],
  },
  {
    id: "7",
    title: "Oil Slips Below $70 as OPEC+ Signals Production Increase Plans",
    description: "Crude oil prices fell sharply after OPEC+ members indicated they may accelerate the unwinding of voluntary production cuts, adding to concerns about oversupply.",
    content: "Brent crude oil prices fell below $70 per barrel for the first time in two months after reports that several OPEC+ members are pushing to increase output faster than previously agreed. Saudi Arabia and Russia reportedly see an opportunity to regain market share lost to US shale producers over the past year. The move comes despite sluggish demand from China and a buildup in US crude inventories. Energy stocks broadly sold off on the news, with the XLE ETF falling 2.3%. Airlines and transportation companies rallied as lower fuel costs improve their profit margins. Analysts at Bank of America warned that oil could test the $65 level if OPEC+ confirms the production increase at next month's meeting.",
    url: "#",
    source: "Wall Street Journal",
    author: "Joe Wallace",
    publishedAt: "2026-06-08T14:00:00Z",
    category: "commodities",
    sentiment: "bearish",
    tickers: ["XLE", "XOM", "CVX"],
  },
  {
    id: "8",
    title: "Microsoft Azure Revenue Growth Reaccelerates on AI Services Demand",
    description: "Microsoft reported Azure cloud revenue growth of 33% in its latest quarter, up from 29% the prior quarter, as AI-powered services attracted new enterprise customers.",
    content: "Microsoft Corporation's Azure cloud division posted revenue growth of 33% year-over-year in the fiscal third quarter, beating expectations of 30% growth and marking a reacceleration from the prior quarter's 29% pace. The company attributed the outperformance to strong uptake of AI-powered services, including Azure OpenAI Service and Microsoft 365 Copilot. CFO Amy Hood noted that AI contributed approximately 7 percentage points to Azure growth. Microsoft's total revenue rose 18% to $72 billion, while net income climbed 25%. The company raised its full-year guidance and announced a $75 billion expansion of its data center infrastructure. Shares rose 4% in after-hours trading.",
    url: "#",
    source: "Bloomberg",
    author: "Dina Bass",
    publishedAt: "2026-06-07T20:00:00Z",
    category: "earnings",
    sentiment: "bullish",
    tickers: ["MSFT", "AMZN", "GOOGL"],
  },
  {
    id: "9",
    title: "Gold Hits New Record Above $3,200 as Dollar Weakens on Fed Outlook",
    description: "Safe-haven demand and a weaker US dollar pushed gold prices to a new all-time high, with some analysts projecting further gains if rate cuts materialize.",
    content: "Gold futures climbed above $3,200 per troy ounce for the first time, as investors flocked to safe-haven assets amid a softening US dollar and growing expectations of Federal Reserve rate cuts. The metal has gained 22% year-to-date, supported by central bank buying, geopolitical uncertainty, and retail investor demand through gold ETFs. SPDR Gold Shares, the world's largest gold-backed ETF, saw its largest weekly inflow since 2020. Analysts at Citigroup issued a bullish note projecting gold at $3,500 within 12 months. Silver and platinum also advanced on the day, with silver breaching $35 per ounce. Mining stocks broadly rallied, led by Barrick Gold and Newmont.",
    url: "#",
    source: "Reuters",
    author: "Peter Hobson",
    publishedAt: "2026-06-07T12:00:00Z",
    category: "commodities",
    sentiment: "bullish",
    tickers: ["GLD", "GDX", "GOLD"],
  },
  {
    id: "10",
    title: "SEC Approves New AI Disclosure Rules for Public Companies",
    description: "The Securities and Exchange Commission voted 3-2 to require public companies to disclose how artificial intelligence tools are used in financial decision-making processes.",
    content: "The US Securities and Exchange Commission approved new rules requiring publicly traded companies to disclose the use of artificial intelligence in material business processes, including financial analysis, trading, and risk management. The rules, which take effect in 2027, mandate quarterly reporting on AI governance frameworks and any material risks posed by AI systems. Companies must also disclose if AI tools are used in preparing financial statements. The decision drew praise from investor advocacy groups who argued greater transparency is needed, while some business groups warned of compliance costs. Several large financial institutions have already begun preparing disclosure frameworks in anticipation of the rules. The vote was split along partisan lines at 3-2.",
    url: "#",
    source: "Reuters",
    author: "Michelle Price",
    publishedAt: "2026-06-06T17:30:00Z",
    category: "regulation",
    sentiment: "neutral",
    tickers: ["XLF", "GS", "JPM"],
  },
];

// ---------------------------------------------------------------------------
// API config — replace with real keys
// ---------------------------------------------------------------------------
const NEWS_API_KEY = "YOUR_NEWSAPI_KEY_HERE";
// Uncomment and configure to use real data:
// const NEWSAPI_URL = `https://newsapi.org/v2/everything?q=finance+stocks&apiKey=${NEWS_API_KEY}&pageSize=20&language=en&sortBy=publishedAt`;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const CATEGORIES = ["all", "macro", "earnings", "crypto", "tech", "commodities", "regulation"] as const;
type Category = typeof CATEGORIES[number];

const CATEGORY_LABELS: Record<Category, string> = {
  all: "All News",
  macro: "Macro",
  earnings: "Earnings",
  crypto: "Crypto",
  tech: "Technology",
  commodities: "Commodities",
  regulation: "Regulation",
};

const SENTIMENT_CONFIG = {
  bullish: { icon: TrendingUp, color: "#10b981", bg: "rgba(16,185,129,0.12)", label: "Bullish" },
  bearish: { icon: TrendingDown, color: "#ef4444", bg: "rgba(239,68,68,0.12)", label: "Bearish" },
  neutral: { icon: Minus, color: "#f59e0b", bg: "rgba(245,158,11,0.12)", label: "Neutral" },
};

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 3600) return `${Math.round(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.round(diff / 3600)}h ago`;
  return `${Math.round(diff / 86400)}d ago`;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------
function SentimentBadge({ sentiment }: { sentiment: Article["sentiment"] }) {
  const cfg = SENTIMENT_CONFIG[sentiment];
  const Icon = cfg.icon;
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full"
      style={{ background: cfg.bg, color: cfg.color, fontSize: "10px", fontWeight: 600 }}
    >
      <Icon size={10} strokeWidth={2.5} />
      {cfg.label}
    </span>
  );
}

function TickerTag({ ticker }: { ticker: string }) {
  return (
    <span
      className="px-2 py-0.5 rounded"
      style={{
        background: "rgba(59,130,246,0.1)",
        color: "#60a5fa",
        fontSize: "10px",
        fontWeight: 600,
        fontFamily: "'JetBrains Mono', monospace",
        border: "1px solid rgba(59,130,246,0.15)",
      }}
    >
      {ticker}
    </span>
  );
}

function ArticleCard({
  article,
  selected,
  bookmarked,
  onClick,
  onBookmark,
}: {
  article: Article;
  selected: boolean;
  bookmarked: boolean;
  onClick: () => void;
  onBookmark: (e: React.MouseEvent) => void;
}) {
  const sentCfg = SENTIMENT_CONFIG[article.sentiment];
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 rounded-xl transition-all duration-150 group"
      style={{
        background: selected ? "rgba(59,130,246,0.08)" : "rgba(255,255,255,0.02)",
        border: selected ? "1px solid rgba(59,130,246,0.25)" : "1px solid rgba(255,255,255,0.06)",
        boxShadow: selected ? "0 0 0 1px rgba(59,130,246,0.1)" : "none",
      }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="px-2 py-0.5 rounded-md"
            style={{
              background: "rgba(255,255,255,0.06)",
              color: "#a0a8bc",
              fontSize: "10px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {article.source}
          </span>
          <SentimentBadge sentiment={article.sentiment} />
        </div>
        <button
          onClick={onBookmark}
          className="shrink-0 p-1 rounded-lg hover:bg-white/10 transition-colors"
        >
          {bookmarked
            ? <BookmarkCheck size={13} style={{ color: "#3b82f6" }} />
            : <Bookmark size={13} style={{ color: "#6b7494" }} />}
        </button>
      </div>

      {/* Title */}
      <p
        className="mb-2 leading-snug"
        style={{
          fontSize: "13px",
          fontWeight: 500,
          color: selected ? "#e8eaf0" : "#c8cfe0",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {article.title}
      </p>

      {/* Description */}
      <p
        style={{
          fontSize: "12px",
          color: "#6b7494",
          lineHeight: 1.5,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          marginBottom: "10px",
        }}
      >
        {article.description}
      </p>

      {/* Tickers */}
      <div className="flex items-center flex-wrap gap-1 mb-2">
        {article.tickers.map((t) => <TickerTag key={t} ticker={t} />)}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1" style={{ color: "#6b7494", fontSize: "11px" }}>
          <Clock size={10} />
          {timeAgo(article.publishedAt)}
        </div>
        <span
          className="flex items-center gap-1"
          style={{ fontSize: "11px", color: "#3b82f6", opacity: selected ? 1 : 0 }}
        >
          Read more <ChevronRight size={10} />
        </span>
      </div>
    </button>
  );
}

function ArticleDetail({ article, bookmarked, onBookmark }: {
  article: Article;
  bookmarked: boolean;
  onBookmark: () => void;
}) {
  const sentCfg = SENTIMENT_CONFIG[article.sentiment];
  const SentIcon = sentCfg.icon;

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Category pill */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span
          className="px-3 py-1 rounded-full"
          style={{
            background: "rgba(59,130,246,0.12)",
            color: "#3b82f6",
            fontSize: "11px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            border: "1px solid rgba(59,130,246,0.2)",
          }}
        >
          {CATEGORY_LABELS[article.category as Category] ?? article.category}
        </span>
        <SentimentBadge sentiment={article.sentiment} />
      </div>

      {/* Title */}
      <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#e8eaf0", lineHeight: 1.4, marginBottom: "12px" }}>
        {article.title}
      </h2>

      {/* Meta */}
      <div
        className="flex items-center gap-4 pb-4 mb-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", fontSize: "12px", color: "#6b7494" }}
      >
        <span style={{ color: "#a0a8bc", fontWeight: 500 }}>{article.source}</span>
        <span>by {article.author}</span>
        <span className="flex items-center gap-1">
          <Clock size={11} />
          {timeAgo(article.publishedAt)}
        </span>
        <button
          onClick={onBookmark}
          className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
          style={{ border: "1px solid rgba(255,255,255,0.08)", color: bookmarked ? "#3b82f6" : "#6b7494", fontSize: "12px" }}
        >
          {bookmarked ? <BookmarkCheck size={12} /> : <Bookmark size={12} />}
          {bookmarked ? "Saved" : "Save"}
        </button>
      </div>

      {/* Description */}
      <p style={{ fontSize: "14px", color: "#a0a8bc", lineHeight: 1.7, marginBottom: "16px", fontStyle: "italic" }}>
        {article.description}
      </p>

      {/* Content */}
      <p style={{ fontSize: "14px", color: "#c8cfe0", lineHeight: 1.8, marginBottom: "20px" }}>
        {article.content}
      </p>

      {/* Tickers section */}
      <div
        className="p-4 rounded-xl mb-4"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <p style={{ fontSize: "11px", fontWeight: 600, color: "#6b7494", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "10px" }}>
          Related Tickers
        </p>
        <div className="flex flex-wrap gap-2">
          {article.tickers.map((t) => (
            <span
              key={t}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-blue-500/20 transition-colors"
              style={{
                background: "rgba(59,130,246,0.08)",
                color: "#60a5fa",
                fontSize: "12px",
                fontWeight: 700,
                fontFamily: "'JetBrains Mono', monospace",
                border: "1px solid rgba(59,130,246,0.2)",
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Sentiment analysis panel */}
      <div
        className="p-4 rounded-xl mb-4"
        style={{ background: `${sentCfg.bg}`, border: `1px solid ${sentCfg.color}22` }}
      >
        <div className="flex items-center gap-2 mb-2">
          <SentIcon size={14} style={{ color: sentCfg.color }} />
          <p style={{ fontSize: "12px", fontWeight: 600, color: sentCfg.color }}>
            AI Sentiment: {sentCfg.label}
          </p>
        </div>
        <p style={{ fontSize: "12px", color: "#a0a8bc", lineHeight: 1.6 }}>
          {article.sentiment === "bullish"
            ? "This article contains predominantly positive signals for the mentioned assets. Key catalysts include strong earnings, growth metrics, or favorable macro conditions."
            : article.sentiment === "bearish"
            ? "This article identifies headwinds for the related markets. Consider reviewing your exposure to the mentioned sectors before making trading decisions."
            : "Mixed or neutral signals detected. No clear directional bias found. Monitor closely for follow-up news that may shift sentiment."}
        </p>
      </div>

      {/* Source link */}
      <a
        href={article.url}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-2 px-4 py-3 rounded-xl transition-colors hover:bg-white/5"
        style={{ border: "1px solid rgba(255,255,255,0.08)", color: "#3b82f6", fontSize: "13px", textDecoration: "none" }}
      >
        <ExternalLink size={13} />
        Read full article on {article.source}
      </a>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Market ticker strip
// ---------------------------------------------------------------------------
const TICKERS = [
  { sym: "S&P 500", val: "5,847.32", chg: "+0.82%" },
  { sym: "NASDAQ", val: "19,234.56", chg: "+1.14%" },
  { sym: "DOW", val: "42,891.20", chg: "+0.34%" },
  { sym: "BTC", val: "$97,430", chg: "-0.62%" },
  { sym: "Gold", val: "$3,218", chg: "+0.91%" },
  { sym: "Oil", val: "$69.48", chg: "-1.73%" },
];

function MarketStrip() {
  return (
    <div
      className="flex items-center gap-6 px-5 py-2.5 overflow-x-auto"
      style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
    >
      {TICKERS.map((t) => {
        const pos = t.chg.startsWith("+");
        const neg = t.chg.startsWith("-");
        return (
          <div key={t.sym} className="flex items-center gap-2 shrink-0">
            <span style={{ fontSize: "11px", color: "#6b7494", fontWeight: 500 }}>{t.sym}</span>
            <span style={{ fontSize: "12px", color: "#e8eaf0", fontFamily: "'JetBrains Mono', monospace", fontWeight: 500 }}>{t.val}</span>
            <span style={{ fontSize: "11px", color: pos ? "#10b981" : neg ? "#ef4444" : "#a0a8bc", fontFamily: "'JetBrains Mono', monospace" }}>
              {t.chg}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export function NewsPage() {
  const [articles, setArticles] = useState<Article[]>(MOCK_ARTICLES);
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<"mock" | "live" | "error">("mock");
  const [selectedId, setSelectedId] = useState<string>(MOCK_ARTICLES[0].id);
  const [category, setCategory] = useState<Category>("all");
  const [search, setSearch] = useState("");
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [showBookmarked, setShowBookmarked] = useState(false);

  const selectedArticle = articles.find((a) => a.id === selectedId) ?? articles[0];

  const filtered = articles.filter((a) => {
    if (showBookmarked && !bookmarks.has(a.id)) return false;
    if (category !== "all" && a.category !== category) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        a.title.toLowerCase().includes(q) ||
        a.source.toLowerCase().includes(q) ||
        a.tickers.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const refresh = useCallback(async () => {
    setLoading(true);
    // To use a real API, replace with:
    // const res = await fetch(NEWSAPI_URL);
    // const data = await res.json();
    // setArticles(data.articles.map(mapToArticle));
    // setApiStatus("live");
    await new Promise((r) => setTimeout(r, 900)); // simulate network latency
    setArticles([...MOCK_ARTICLES].sort(() => Math.random() - 0.5));
    setLoading(false);
  }, []);

  const toggleBookmark = (id: string) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const sentimentCounts = {
    bullish: articles.filter((a) => a.sentiment === "bullish").length,
    bearish: articles.filter((a) => a.sentiment === "bearish").length,
    neutral: articles.filter((a) => a.sentiment === "neutral").length,
  };

  return (
    <div className="flex flex-col h-full" style={{ background: "#0b0e14" }}>
      <MarketStrip />

      <div className="flex flex-1 min-h-0">
        {/* ── LEFT PANEL — list ───────────────────────────────── */}
        <div
          className="flex flex-col w-[420px] shrink-0 h-full overflow-hidden"
          style={{ borderRight: "1px solid rgba(255,255,255,0.06)" }}
        >
          {/* Search + controls */}
          <div className="p-4 space-y-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            {/* Search */}
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#6b7494" }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search news, tickers…"
                className="w-full pl-8 pr-4 py-2 rounded-lg outline-none"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#e8eaf0",
                  fontSize: "13px",
                }}
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X size={12} style={{ color: "#6b7494" }} />
                </button>
              )}
            </div>

            {/* Filter row */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowBookmarked(!showBookmarked)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors"
                style={{
                  background: showBookmarked ? "rgba(59,130,246,0.12)" : "rgba(255,255,255,0.04)",
                  border: showBookmarked ? "1px solid rgba(59,130,246,0.25)" : "1px solid rgba(255,255,255,0.08)",
                  color: showBookmarked ? "#3b82f6" : "#6b7494",
                  fontSize: "12px",
                  fontWeight: 500,
                }}
              >
                <Bookmark size={11} />
                Saved ({bookmarks.size})
              </button>
              <button
                onClick={refresh}
                disabled={loading}
                className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
                style={{ border: "1px solid rgba(255,255,255,0.08)", color: "#6b7494", fontSize: "12px" }}
              >
                <RefreshCw size={11} className={loading ? "animate-spin" : ""} />
                {loading ? "Refreshing…" : "Refresh"}
              </button>
            </div>

            {/* API status banner */}
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.15)" }}
            >
              <AlertCircle size={11} style={{ color: "#f59e0b", flexShrink: 0 }} />
              <p style={{ fontSize: "11px", color: "#a0a8bc", lineHeight: 1.4 }}>
                Using sample data. Add your{" "}
                <span style={{ color: "#f59e0b", fontWeight: 600 }}>NewsAPI key</span>{" "}
                in <code style={{ fontFamily: "monospace", fontSize: "10px" }}>NewsPage.tsx</code> to fetch live articles.
              </p>
            </div>
          </div>

          {/* Category tabs */}
          <div
            className="flex items-center gap-1 px-4 py-2 overflow-x-auto"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className="shrink-0 px-3 py-1 rounded-lg transition-all"
                style={{
                  background: category === cat ? "rgba(59,130,246,0.15)" : "transparent",
                  color: category === cat ? "#3b82f6" : "#6b7494",
                  fontSize: "11px",
                  fontWeight: category === cat ? 600 : 400,
                  border: category === cat ? "1px solid rgba(59,130,246,0.2)" : "1px solid transparent",
                }}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>

          {/* Sentiment summary row */}
          <div
            className="flex items-center gap-4 px-4 py-2.5"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.01)" }}
          >
            <span style={{ fontSize: "11px", color: "#6b7494" }}>{filtered.length} articles</span>
            <div className="flex items-center gap-3 ml-auto">
              <span className="flex items-center gap-1" style={{ fontSize: "11px", color: "#10b981" }}>
                <TrendingUp size={10} /> {sentimentCounts.bullish}
              </span>
              <span className="flex items-center gap-1" style={{ fontSize: "11px", color: "#ef4444" }}>
                <TrendingDown size={10} /> {sentimentCounts.bearish}
              </span>
              <span className="flex items-center gap-1" style={{ fontSize: "11px", color: "#f59e0b" }}>
                <Minus size={10} /> {sentimentCounts.neutral}
              </span>
            </div>
          </div>

          {/* Article list */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 gap-2">
                <Newspaper size={28} style={{ color: "#2a2f3e" }} />
                <p style={{ fontSize: "13px", color: "#6b7494" }}>No articles found</p>
              </div>
            ) : (
              filtered.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  selected={article.id === selectedId}
                  bookmarked={bookmarks.has(article.id)}
                  onClick={() => setSelectedId(article.id)}
                  onBookmark={(e) => { e.stopPropagation(); toggleBookmark(article.id); }}
                />
              ))
            )}
          </div>
        </div>

        {/* ── RIGHT PANEL — detail ────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-6">
          {selectedArticle ? (
            <ArticleDetail
              article={selectedArticle}
              bookmarked={bookmarks.has(selectedArticle.id)}
              onBookmark={() => toggleBookmark(selectedArticle.id)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <Newspaper size={40} style={{ color: "#2a2f3e" }} />
              <p style={{ color: "#6b7494", fontSize: "14px" }}>Select an article to read</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
