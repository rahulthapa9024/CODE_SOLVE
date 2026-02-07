import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaLink, FaLayerGroup, FaSearch, FaSortAmountUp, FaKey, FaProjectDiagram,
  FaRandom, FaCoins, FaFingerprint, FaRunning, FaRegCalendarAlt, FaBalanceScale, FaFont, FaSpellCheck, FaMapSigns, FaRoute, FaGlobe, FaArrowRight,
  FaCompressArrowsAlt, FaGoogle, FaAmazon, FaMicrosoft, FaApple, FaFacebook,
  FaUber, FaLinkedin, FaPaypal, FaTwitter, FaSnapchat
} from 'react-icons/fa';
import { MdLinearScale, MdOutlineQueue, MdOutlineDataArray, MdTerminal, MdArrowForward } from 'react-icons/md';
import { GoGitBranch, GoGitCommit } from 'react-icons/go';
import {
  TbCirclesRelation, TbSum, TbChartAreaLine, TbCut, TbNumbers, TbSortAscendingNumbers,
  TbNetwork, TbViewfinder, TbMinimize, TbArrowRightTail, TbMatrix, TbRecycle,
  TbChartCandle, TbBoxMultiple
} from 'react-icons/tb';
import { PiTextAaBold } from 'react-icons/pi';
import { BsTriangleHalf } from 'react-icons/bs';
import { VscChecklist } from 'react-icons/vsc';
import {
  SiAdobe, SiTiktok, SiMeta, SiGoldmansachs, SiCisco, SiQualcomm,
  SiWalmart, SiFlipkart, SiSwiggy, SiZomato, SiNetflix
} from 'react-icons/si';
import Footer from './Footer';

// Color Mapping for the Cyber Glows
const colorMap = {
  violet: '#A78BFA', emerald: '#10B981', sky: '#0EA5E9', rose: '#F43F5E',
  fuchsia: '#D946EF', amber: '#F59E0B', pink: '#EC4899', teal: '#14B8A6',
  orange: '#F97316', cyan: '#06B6D4', slate: '#64748B', lime: '#84CC16',
  red: '#EF4444', blue: '#3B82F6', purple: '#8B5CF6', indigo: '#6366F1',
  green: '#22C55E', yellow: '#EAB308', gray: '#94A3B8', zinc: '#71717A'
};

const dataStructuresData = [
  { name: 'Array', slug: 'array', icon: <MdOutlineDataArray />, description: 'Fundamental linear data structures.', color: 'violet' },
  { name: 'String', slug: 'string', icon: <FaFont />, description: 'Sequences of characters.', color: 'emerald' },
  { name: 'Linked List', slug: 'linked-list', icon: <FaLink />, description: 'Singly, Doubly, or Circular nodes.', color: 'sky' },
  { name: 'Stack', slug: 'stack', icon: <FaLayerGroup />, description: 'Last-in, first-out (LIFO) structure.', color: 'rose' },
  { name: 'Queue', slug: 'queue', icon: <MdOutlineQueue />, description: 'First-in, first-out (FIFO) variants.', color: 'fuchsia' },
  { name: 'Hash Table', slug: 'hash-table', icon: <FaKey />, description: 'Key-value pairs with fast lookups.', color: 'amber' },
  { name: 'Set / Multiset', slug: 'set', icon: <VscChecklist />, description: 'Collections of unique elements.', color: 'pink' },
  { name: 'Heap / Priority Queue', slug: 'heap', icon: <BsTriangleHalf />, description: 'Min-Heap and Max-Heap structures.', color: 'teal' },
  { name: 'Binary Tree', slug: 'binary-tree', icon: <GoGitBranch />, description: 'Hierarchical node-based data.', color: 'orange' },
  { name: 'Binary Search Tree', slug: 'bst', icon: <FaSearch />, description: 'Ordered for efficient searching.', color: 'cyan' },
  { name: 'Trie (Prefix Tree)', slug: 'trie', icon: <FaSpellCheck />, description: 'Efficient string searching.', color: 'slate' },
  { name: 'Graph', slug: 'graph', icon: <FaProjectDiagram />, description: 'Nodes and edges representation.', color: 'lime' },
  { name: 'Segment Tree', slug: 'segment-tree', icon: <TbChartAreaLine />, description: 'Range queries and updates.', color: 'red' },
  { name: 'Fenwick Tree', slug: 'fenwick-tree', icon: <TbSum />, description: 'Binary Indexed Tree (BIT).', color: 'blue' },
  { name: 'Disjoint Set Union', slug: 'dsu', icon: <TbCirclesRelation />, description: 'Union-Find for dynamic sets.', color: 'purple' },
];

const algorithmsData = [
  { name: 'Binary Search', slug: 'binary-search', icon: <TbCut />, description: 'Fast divide-and-conquer search.', color: 'indigo' },
  { name: 'Linear Search', slug: 'linear-search', icon: <MdLinearScale />, description: 'Simple sequential search.', color: 'indigo' },
  { name: 'Merge Sort', slug: 'merge-sort', icon: <FaSortAmountUp />, description: 'Divide and conquer sorting.', color: 'green' },
  { name: 'Quick Sort', slug: 'quick-sort', icon: <FaRandom />, description: 'Pivot-based sorting algorithm.', color: 'green' },
  { name: 'Heap Sort', slug: 'heap-sort', icon: <BsTriangleHalf />, description: 'In-place sort using a heap.', color: 'green' },
  { name: 'Counting Sort', slug: 'counting-sort', icon: <TbNumbers />, description: 'For integers in a specific range.', color: 'green' },
  { name: 'Radix Sort', slug: 'radix-sort', icon: <TbSortAscendingNumbers />, description: 'Sorts integers digit by digit.', color: 'green' },
  { name: 'DFS', slug: 'dfs', icon: <GoGitBranch />, description: 'Depth First Search traversal.', color: 'blue' },
  { name: 'BFS', slug: 'bfs', icon: <TbNetwork />, description: 'Breadth First Search traversal.', color: 'blue' },
  { name: "Dijkstra's Algorithm", slug: 'dijkstra', icon: <FaMapSigns />, description: 'Shortest path in weighted graphs.', color: 'blue' },
  { name: 'Bellman–Ford', slug: 'bellman-ford', icon: <FaRoute />, description: 'Handles negative weight edges.', color: 'blue' },
  { name: 'Floyd–Warshall', slug: 'floyd-warshall', icon: <FaGlobe />, description: 'All-pairs shortest path.', color: 'blue' },
  { name: "Kruskal's MST", slug: 'kruskal-mst', icon: <TbViewfinder />, description: 'Minimum Spanning Tree (Greedy).', color: 'blue' },
  { name: "Prim's MST", slug: 'prim-mst', icon: <TbMinimize />, description: 'Minimum Spanning Tree (Greedy).', color: 'blue' },
  { name: 'Topological Sort', slug: 'topological-sort', icon: <TbArrowRightTail />, description: 'Ordering for DAG.', color: 'blue' },
  { name: "Tarjan's Algorithm", slug: 'tarjan-scc', icon: <GoGitCommit />, description: 'Finds SCCs and bridges.', color: 'blue' },
  { name: "Kadane's Algorithm", slug: 'kadane', icon: <TbChartCandle />, description: 'Maximum subarray sum.', color: 'red' },
  { name: '0/1 Knapsack', slug: 'knapsack-dp', icon: <TbBoxMultiple />, description: 'Classic DP problem.', color: 'red' },
  { name: 'LIS', slug: 'lis-dp', icon: <TbRecycle />, description: 'Longest Increasing Subsequence.', color: 'red' },
  { name: 'Matrix Chain', slug: 'matrix-chain-dp', icon: <TbMatrix />, description: 'Optimal parenthesization.', color: 'red' },
  { name: 'Coin Change', slug: 'coin-change-dp', icon: <FaCoins />, description: 'Ways to make a sum with coins.', color: 'red' },
  { name: 'Edit Distance', slug: 'edit-distance-dp', icon: <PiTextAaBold />, description: 'String transformation cost.', color: 'red' },
  { name: 'Activity Selection', slug: 'activity-selection', icon: <FaRunning />, description: 'Maximize activities.', color: 'purple' },
  { name: 'Huffman Coding', slug: 'huffman-coding', icon: <FaCompressArrowsAlt />, description: 'Greedy compression.', color: 'purple' },
  { name: 'Job Scheduling', slug: 'job-scheduling', icon: <FaRegCalendarAlt />, description: 'Profit with deadlines.', color: 'purple' },
  { name: 'Fractional Knapsack', slug: 'fractional-knapsack', icon: <FaBalanceScale />, description: 'Greedy approach.', color: 'purple' },
  { name: 'KMP Pattern Matching', slug: 'kmp', icon: <FaSearch />, description: 'Efficient pattern matching.', color: 'yellow' },
  { name: 'Rabin–Karp', slug: 'rabin-karp', icon: <FaFingerprint />, description: 'Rolling hash search.', color: 'yellow' },
  { name: 'Z Algorithm', slug: 'z-algorithm', icon: <MdLinearScale />, description: 'Linear pattern search.', color: 'yellow' },
  { name: "Manacher's Algorithm", slug: 'manacher', icon: <FaArrowRight />, description: 'Longest palindrome.', color: 'yellow' },
];

const companiesData = [
  { name: 'Google', slug: 'google', icon: <FaGoogle />, description: 'Interview problems from Google.', color: 'blue' },
  { name: 'Amazon', slug: 'amazon', icon: <FaAmazon />, description: 'Interview problems from Amazon.', color: 'orange' },
  { name: 'Microsoft', slug: 'microsoft', icon: <FaMicrosoft />, description: 'From interviews at Microsoft.', color: 'cyan' },
  { name: 'Apple', slug: 'apple', icon: <FaApple />, description: 'Top questions from Apple.', color: 'zinc' },
  { name: 'Facebook', slug: 'facebook', icon: <FaFacebook />, description: 'Selected at Meta/Facebook.', color: 'sky' },
  { name: 'Meta', slug: 'meta', icon: <SiMeta />, description: 'Meta Platforms interviews.', color: 'indigo' },
  { name: 'Uber', slug: 'uber', icon: <FaUber />, description: 'Typical Uber interview DSA.', color: 'gray' },
  { name: 'Adobe', slug: 'adobe', icon: <SiAdobe />, description: 'Adobe coding interviews.', color: 'red' },
  { name: 'LinkedIn', slug: 'linkedin', icon: <FaLinkedin />, description: 'Asked in LinkedIn interviews.', color: 'blue' },
  { name: 'TikTok', slug: 'tiktok', icon: <SiTiktok />, description: 'Questions at ByteDance/TikTok.', color: 'fuchsia' },
  { name: 'Paypal', slug: 'paypal', icon: <FaPaypal />, description: 'Tested in Paypal interviews.', color: 'blue' },
  { name: 'Snapchat', slug: 'snapchat', icon: <FaSnapchat />, description: 'DSA at Snap.', color: 'yellow' },
  { name: 'Netflix', slug: 'netflix', icon: <SiNetflix />, description: 'Netflix coding round.', color: 'red' },
  { name: 'Twitter', slug: 'twitter', icon: <FaTwitter />, description: 'Asked at Twitter/X.', color: 'sky' },
  { name: 'Goldman Sachs', slug: 'goldman-sachs', icon: <SiGoldmansachs />, description: 'Goldman Sachs interview.', color: 'amber' },
  { name: 'Cisco', slug: 'cisco', icon: <SiCisco />, description: 'Asked at Cisco.', color: 'cyan' },
  { name: 'Qualcomm', slug: 'qualcomm', icon: <SiQualcomm />, description: 'Qualcomm technical rounds.', color: 'violet' },
  { name: 'Walmart', slug: 'walmart', icon: <SiWalmart />, description: 'Walmart Global Tech.', color: 'blue' },
  { name: 'Flipkart', slug: 'flipkart', icon: <SiFlipkart />, description: 'Flipkart interviews.', color: 'yellow' },
  { name: 'Swiggy', slug: 'swiggy', icon: <SiSwiggy />, description: 'Interviewed at Swiggy.', color: 'orange' },
  { name: 'Zomato', slug: 'zomato', icon: <SiZomato />, description: 'Zomato placement prep.', color: 'red' },
];

export default function Home() {
  const navigate = useNavigate();
  const handleNavigate = (path) => navigate(path);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/5 blur-[120px] rounded-full" />
      </div>

      <main className="relative pt-24 pb-20">
        {/* Hero */}
        <div className="max-w-7xl mx-auto px-6 mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] mb-6">
              Master <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">DSA</span> <br />
              with CodeSolve.
            </h1>
            <p className="text-neutral-500 font-mono text-sm max-w-xl leading-relaxed">
              {`> Initializing specialized curriculum...`} <br />
              {`> Practice coding challenges across 50+ patterns and top-tier company interview sets.`}
            </p>
            <div className="mt-10">
              <button
                onClick={() => handleNavigate('/problems')}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-bold text-white flex items-center gap-2 hover:scale-105 transition-transform shadow-lg shadow-cyan-500/20"
              >
                🚀 Start Practicing
              </button>
            </div>
          </motion.div>
        </div>

        {/* Catalog Sections */}
        <div className="space-y-24 ">
          <Section title="Data Structures" subtitle="The architecture of logic" data={dataStructuresData} onNavigate={handleNavigate} />
          <Section title="Algorithms" subtitle="Optimized procedure sets" data={algorithmsData} onNavigate={handleNavigate} />
          <Section title="Companies" subtitle="Real-world technical assessments" data={companiesData} onNavigate={handleNavigate} />
        </div>
      </main>

      <Footer />
    </div>
  );
}

function Section({ title, subtitle, data, onNavigate }) {
  return (
    <section>
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">{title}</h2>
            <p className="text-neutral-500 text-xs font-mono mt-1 uppercase tracking-widest">{`// ${subtitle}`}</p>
          </div>
          <MdTerminal className="text-neutral-800 text-3xl hidden md:block" />
        </div>
      </div>

      <div className="relative px-55">
        {/* Left/Right Fades */}
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />

        <div className="flex gap-6 overflow-x-auto px-6 pb-10 scrollbar-hide no-scrollbar snap-x">
          {data.map((item) => (
            <HomeCard
              key={item.slug}
              {...item}
              onClick={() => onNavigate(`/problems/byTag/${item.slug}`)}
            />
          ))}
          <div className="min-w-[40px]" /> {/* Spacer for scroll end */}
        </div>
      </div>
    </section>
  );
}

function HomeCard({ name, icon, description, onClick, color }) {
  const glowColor = colorMap[color] || '#ffffff';

  return (
    <motion.button
      whileHover={{ y: -5 }}
      onClick={onClick}
      className="snap-start group relative flex-shrink-0 w-72 h-[220px] rounded-2xl border border-white/5 bg-neutral-900/20 hover:bg-neutral-900/40 transition-all duration-300 overflow-hidden text-left"
    >
      {/* Background Glow Aura */}
      <div 
        className="absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(circle at center, ${glowColor}10 0%, transparent 70%)` }}
      />
      
      <div className="p-6 h-full flex flex-col justify-between relative z-10">
        <div>
          {/* Icon pod */}
          <div className="w-12 h-12 rounded-xl bg-neutral-800 border border-white/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-white/10 transition-all duration-300">
             <span 
              className="text-2xl transition-all duration-500"
              style={{ color: glowColor }}
            >
              {icon}
            </span>
          </div>
          
          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
            {name}
          </h3>
          <p className="text-neutral-500 text-xs leading-relaxed line-clamp-2 font-medium">
            {description}
          </p>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-cyan-500/0 group-hover:text-cyan-500 transition-all duration-300">
          Open Arena <MdArrowForward className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      {/* Terminal Decor */}
      <div className="absolute top-2 right-3 opacity-10 group-hover:opacity-100 transition-opacity">
        <span className="font-mono text-[8px] text-neutral-600 group-hover:text-cyan-500 uppercase tracking-tighter">
          TAG_{name.replace(/\s/g, '_')}
        </span>
      </div>
    </motion.button>
  );
}