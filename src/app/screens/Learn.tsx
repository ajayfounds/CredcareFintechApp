import React, { useState } from 'react';
import { Card, Badge, Button, cn } from '../components/ui/WireframeComponents';
import { BookOpen, Clock, ChevronRight, ChevronLeft, Search, PlayCircle, Bookmark, Share2, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from "sonner";

type Article = {
  id: string;
  title: string;
  category: string;
  readTime: string;
  imageColor: string;
  description: string;
  content: React.ReactNode;
};

type ViewState = 'list' | 'detail';

const ARTICLES: Article[] = [
  {
    id: '1',
    title: "How Credit Scores Actually Work",
    category: "Basics",
    readTime: "5 min",
    imageColor: "from-blue-600 to-indigo-900",
    description: "It's not magic. It's math. Learn the 4 key factors that determine your score.",
    content: (
      <div className="space-y-6 text-[17px] leading-relaxed text-gray-800">
        <p>
          Your credit score isn't just a random number assigned by a bank. It's a calculated assessment of your "creditworthiness"—essentially, how risky it is to lend you money.
        </p>
        <h3 className="text-[20px] font-bold text-black mt-6 mb-2">The Big Four Factors</h3>
        <ul className="list-disc pl-5 space-y-2 marker:text-gray-400">
          <li><strong>Payment History (35%):</strong> Did you pay on time? This is the biggest chunk. Even one missed payment can drop your score significantly.</li>
          <li><strong>Credit Utilization (30%):</strong> How much of your limit are you using? Ideally, keep this under 30%.</li>
          <li><strong>Credit Age (15%):</strong> How long have you had credit? Older accounts are better. Don't close old cards if you can help it.</li>
          <li><strong>Mix & Inquiries (20%):</strong> A healthy mix of loans (secured/unsecured) helps, while too many applications hurts.</li>
        </ul>
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 my-6">
          <p className="text-blue-800 font-medium text-[15px]">
            💡 <span className="font-bold">Pro Tip:</span> Checking your own score acts as a "soft pull" and does not hurt your score. Check as often as you like.
          </p>
        </div>
        <p>
          Understanding these weights allows you to prioritize your actions. Focusing on paying bills on time will always yield the best results.
        </p>
      </div>
    )
  },
  {
    id: '2',
    title: "The Truth About Minimum Payments",
    category: "Debt",
    readTime: "3 min",
    imageColor: "from-orange-500 to-red-700",
    description: "Why paying the minimum due keeps you in debt longer and costs you more.",
    content: (
      <div className="space-y-6 text-[17px] leading-relaxed text-gray-800">
        <p>
          Banks love it when you pay only the minimum due. Why? Because that's how they maximize their profit from interest.
        </p>
        <h3 className="text-[20px] font-bold text-black mt-6 mb-2">The Math Trap</h3>
        <p>
          If you have a ₹1,00,000 balance at 36% APR and only pay the minimum (usually 5%), it could take you over <strong>10 years</strong> to pay it off, and you'd pay double the original amount in interest alone.
        </p>
        <p>
          Paying just slightly more than the minimum—even an extra ₹500—can cut years off your repayment time.
        </p>
      </div>
    )
  },
  {
    id: '3',
    title: "Snowball vs. Avalanche Method",
    category: "Strategy",
    readTime: "6 min",
    imageColor: "from-emerald-500 to-teal-800",
    description: "Two proven mathematical strategies to eliminate debt faster.",
    content: (
      <div className="space-y-6 text-[17px] leading-relaxed text-gray-800">
        <p>
          When tackling multiple debts, you need a plan. Two strategies reign supreme:
        </p>
        <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-xl">
                <h4 className="font-bold text-lg mb-1">1. The Snowball Method ❄️</h4>
                <p>Pay off the <strong>smallest balance</strong> first, regardless of interest rate. This gives you quick wins and psychological momentum.</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
                <h4 className="font-bold text-lg mb-1">2. The Avalanche Method 🏔️</h4>
                <p>Pay off the <strong>highest interest rate</strong> first. This saves you the most money mathematically over the long run.</p>
            </div>
        </div>
        <p>
          Which is better? The one you'll actually stick to. If you need motivation, go Snowball. If you want efficiency, go Avalanche.
        </p>
      </div>
    )
  },
  {
    id: '4',
    title: "Disputing Errors on Your Report",
    category: "Action",
    readTime: "4 min",
    imageColor: "from-purple-500 to-indigo-700",
    description: "A step-by-step guide to removing incorrect marks from your CIBIL report.",
    content: (
      <div className="space-y-6 text-[17px] leading-relaxed text-gray-800">
        <p>
          Errors are more common than you think. A closed account marked as "active" or a payment marked "late" when it wasn't can drag your score down unfairly.
        </p>
        <h3 className="text-[20px] font-bold text-black mt-6 mb-2">How to Dispute</h3>
        <ol className="list-decimal pl-5 space-y-3 marker:font-bold marker:text-gray-900">
          <li><strong>Fetch your full report:</strong> Look for the specific Account ID and error details.</li>
          <li><strong>Gather proof:</strong> Bank statements or payment confirmation emails are your best friends.</li>
          <li><strong>File a dispute online:</strong> Go to the CIBIL (or Experian/Equifax) website and use their dispute resolution center.</li>
          <li><strong>Wait 30 days:</strong> They are legally required to investigate and respond.</li>
        </ol>
      </div>
    )
  }
];

export const Learn = () => {
  const [view, setView] = useState<ViewState>('list');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article);
    setView('detail');
  };

  const handleBack = () => {
    setView('list');
    setTimeout(() => setSelectedArticle(null), 300); // Clear after animation
  };

  return (
    <div className="bg-[#F2F2F7] min-h-full pb-24 relative overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        {view === 'list' ? (
          <LearnHome key="home" onArticleClick={handleArticleClick} />
        ) : (
          <ArticleDetail key="detail" article={selectedArticle!} onBack={handleBack} />
        )}
      </AnimatePresence>
    </div>
  );
};

const LearnHome = ({ onArticleClick }: { onArticleClick: (a: Article) => void }) => {
  const [filter, setFilter] = useState('All');
  const featured = ARTICLES[0];
  const others = ARTICLES.slice(1);

  return (
    <motion.div 
      initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
      className="h-full"
    >
      {/* iOS Header */}
      <div className="bg-[#F2F2F7] px-4 pt-4 pb-2 sticky top-0 z-10">
        <h1 className="text-[34px] font-bold text-black tracking-tight leading-tight">Learn</h1>
      </div>

      {/* Search Bar */}
      <div className="px-4 mb-6">
        <div className="bg-[#767680]/15 h-10 rounded-xl flex items-center px-3 gap-2">
            <Search className="text-gray-500 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search topics, guides..." 
              className="bg-transparent border-none outline-none text-[17px] placeholder:text-gray-500 w-full h-full"
            />
        </div>
      </div>

      <div className="px-4 space-y-8">
        {/* Featured Course */}
        <section>
          <div className="flex justify-between items-center px-1 mb-2">
            <h2 className="text-[20px] font-bold text-black tracking-tight">Featured</h2>
          </div>
          <div 
            className="bg-white rounded-[20px] overflow-hidden shadow-sm active:scale-[0.98] transition-transform cursor-pointer group"
            onClick={() => onArticleClick(featured)}
          >
            <div className={`h-48 bg-gradient-to-br ${featured.imageColor} flex items-center justify-center relative overflow-hidden`}>
               <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
               <BookOpen size={64} className="text-white relative z-10 opacity-90 shadow-sm" />
               {/* Decorative Circles */}
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
               <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-xl" />
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                 <Badge variant="neutral" className="bg-gray-100 text-gray-600 font-bold uppercase tracking-wider text-[10px] px-2 py-1">{featured.category}</Badge>
                 <div className="flex items-center gap-1 text-gray-400 text-xs font-semibold">
                    <Clock size={12} />
                    <span>{featured.readTime}</span>
                 </div>
              </div>
              <h3 className="text-[22px] font-bold text-gray-900 leading-tight mb-2">{featured.title}</h3>
              <p className="text-[15px] text-gray-500 leading-relaxed line-clamp-2">
                {featured.description}
              </p>
            </div>
          </div>
        </section>

        {/* Categories / Filters */}
        <section>
             <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar scroll-smooth">
                {['All', 'Basics', 'Debt', 'Strategy', 'Legal'].map((cat) => (
                    <button 
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={cn(
                            "px-5 py-2 rounded-full text-[15px] font-semibold whitespace-nowrap transition-colors",
                            filter === cat ? "bg-black text-white" : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                        )}
                    >
                        {cat}
                    </button>
                ))}
             </div>
        </section>

        {/* Latest List */}
        <section>
          <h2 className="text-[20px] font-bold text-black tracking-tight mb-3 px-1">Latest Guides</h2>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm divide-y divide-gray-100">
            {others.map((article) => (
              <div 
                key={article.id} 
                className="p-4 flex gap-4 active:bg-gray-50 cursor-pointer transition-colors group"
                onClick={() => onArticleClick(article)}
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${article.imageColor} shrink-0 flex items-center justify-center`}>
                    <span className="text-2xl">📝</span>
                </div>
                <div className="flex-1 min-w-0 py-0.5">
                  <div className="flex justify-between items-start">
                     <span className="text-[11px] font-bold uppercase text-[#007AFF] tracking-wide mb-0.5">{article.category}</span>
                     <span className="text-[12px] text-gray-400">{article.readTime}</span>
                  </div>
                  <h4 className="font-semibold text-[17px] text-gray-900 group-hover:text-[#007AFF] transition-colors leading-snug line-clamp-2">{article.title}</h4>
                </div>
                <div className="flex items-center">
                    <ChevronRight className="text-gray-300 w-5 h-5" />
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Video Section Teaser */}
        <section className="pb-8">
             <div className="bg-gray-900 rounded-2xl p-5 text-white flex items-center justify-between active:scale-[0.98] transition-transform cursor-pointer">
                <div>
                    <h3 className="font-bold text-[17px]">Video Masterclass</h3>
                    <p className="text-[13px] text-gray-400 mt-1">Coming soon</p>
                </div>
                <PlayCircle className="w-8 h-8 text-white/80" />
             </div>
        </section>
      </div>
    </motion.div>
  );
};

const ArticleDetail = ({ article, onBack }: { article: Article, onBack: () => void }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }}
            className="h-full bg-white flex flex-col"
        >
            {/* Custom Nav Bar */}
            <div className="bg-white/80 backdrop-blur-md px-2 pt-2 pb-2 sticky top-0 z-20 flex justify-between items-center border-b border-gray-100">
                <button onClick={onBack} className="p-2 text-[#007AFF] flex items-center gap-1 active:opacity-50 transition-opacity">
                    <ChevronLeft size={24} strokeWidth={2.5} />
                    <span className="text-[17px] font-medium">Back</span>
                </button>
                <div className="flex gap-2 pr-2">
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full" onClick={() => toast.success("Saved to bookmarks")}>
                        <Bookmark size={22} />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full" onClick={() => toast.success("Link copied")}>
                        <Share2 size={22} />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pb-24">
                {/* Hero Image */}
                <div className={`h-56 bg-gradient-to-br ${article.imageColor} w-full flex items-center justify-center p-8`}>
                     <BookOpen size={80} className="text-white/20" />
                </div>

                <div className="px-6 py-8">
                     <div className="flex items-center gap-3 mb-4">
                        <Badge className="bg-gray-100 text-gray-900 font-bold px-2 py-1">{article.category}</Badge>
                        <span className="text-gray-400 text-[13px] font-medium flex items-center gap-1">
                             <Clock size={12} /> {article.readTime} read
                        </span>
                     </div>
                     
                     <h1 className="text-[28px] font-bold text-black leading-tight mb-6 tracking-tight">
                         {article.title}
                     </h1>

                     <div className="prose prose-lg">
                        {article.content}
                     </div>

                     <div className="mt-12 pt-8 border-t border-gray-100">
                        <h4 className="font-bold text-gray-900 mb-4">Was this helpful?</h4>
                        <div className="flex gap-4">
                            <Button variant="secondary" className="flex-1" onClick={() => { toast.success("Thanks for the feedback!"); onBack(); }}>
                                <span className="mr-2">👍</span> Yes
                            </Button>
                             <Button variant="secondary" className="flex-1" onClick={() => { toast.success("Thanks for the feedback!"); onBack(); }}>
                                <span className="mr-2">👎</span> No
                            </Button>
                        </div>
                     </div>
                </div>
            </div>
            
            {/* Bottom Floating Bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 pb-8 flex justify-between items-center z-20">
                 <div className="text-xs text-gray-400 font-medium">
                    235 people read this today
                 </div>
                 <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white rounded-full px-6" onClick={() => { toast.success("Marked as read"); onBack(); }}>
                    <CheckCircle size={16} className="mr-2" />
                    Mark as Read
                 </Button>
            </div>
        </motion.div>
    );
};
