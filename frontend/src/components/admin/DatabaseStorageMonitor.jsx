import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/apis';
import {
  Database,
  HardDrive,
  Layers,
  FileText,
  Users,
  RefreshCw,
  Server,
  Activity,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Cpu,
  BarChart2,
} from 'lucide-react';
import { Button, Badge, Spinner, Input } from '../common/UIElements';

export const DatabaseStorageMonitor = () => {
  const [dbStats, setDbStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedSort, setSelectedSort] = useState('storage');

  useEffect(() => {
    fetchDbStats();
  }, []);

  const fetchDbStats = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const res = await adminApi.getDatabaseStats();
      if (res.data && res.data.success) {
        setDbStats(res.data);
      } else {
        setError(res.data?.message || 'Failed to retrieve database statistics.');
      }
    } catch (err) {
      console.error('Database stats error:', err);
      setError(err.response?.data?.message || 'Unable to connect to MongoDB metrics service.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="glass-panel rounded-3xl p-8 border border-slate-800 flex flex-col items-center justify-center space-y-3">
        <Spinner size="md" />
        <p className="text-xs text-slate-400 font-mono">Querying MongoDB Atlas Cluster Telemetry &amp; Storage...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel rounded-3xl p-6 border border-rose-500/30 bg-rose-950/20 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
            <AlertTriangle className="w-5 h-5" />
            <span>MongoDB Telemetry Unavailable</span>
          </div>
          <Button variant="secondary" size="xs" icon={RefreshCw} onClick={() => fetchDbStats(true)}>
            Retry
          </Button>
        </div>
        <p className="text-xs text-slate-400">{error}</p>
      </div>
    );
  }

  const collections = dbStats?.collections || [];
  const usagePercentage = dbStats?.usagePercentage || 0;
  const storageLimitBytes = dbStats?.storageLimit || 536870912;
  const totalSizeBytes = dbStats?.totalSize || 0;
  const freeSizeBytes = Math.max(0, storageLimitBytes - totalSizeBytes);
  const freeFormatted = (freeSizeBytes / (1024 * 1024)).toFixed(1) + ' MB';

  // Filter and sort collections
  const filteredCollections = collections
    .filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.displayName.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (selectedSort === 'storage') return b.storageSizeBytes - a.storageSizeBytes;
      if (selectedSort === 'documents') return b.documents - a.documents;
      if (selectedSort === 'index') return b.indexSizeBytes - a.indexSizeBytes;
      return a.name.localeCompare(b.name);
    });

  // Progress Bar color logic
  const isDanger = usagePercentage > 85;
  const isWarning = usagePercentage > 60 && usagePercentage <= 85;
  const progressBarColor = isDanger
    ? 'from-rose-500 to-red-600'
    : isWarning
    ? 'from-amber-500 to-orange-500'
    : 'from-indigo-500 via-purple-500 to-emerald-400';

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header Card */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 bg-slate-900/90 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-950/20 shrink-0">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-black text-white">MongoDB Atlas Database Usage</h3>
                <Badge variant="emerald" size="sm" className="font-mono text-[10px]">
                  Cluster Online
                </Badge>
                <span className="text-xs font-mono text-slate-400 font-semibold">
                  Database: <strong className="text-slate-200">{dbStats?.databaseName}</strong>
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time storage allocation, document volumes, and collection indexes from MongoDB Atlas
              </p>
            </div>
          </div>

          {/* Refresh Action & Last Updated */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right hidden sm:block">
              <span className="text-[10px] text-slate-500 font-mono block">LAST UPDATED</span>
              <span className="text-xs font-mono text-slate-300 font-semibold">
                {new Date(dbStats?.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>

            <Button
              variant="secondary"
              size="sm"
              icon={RefreshCw}
              loading={refreshing}
              onClick={() => fetchDbStats(true)}
              className="text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer shadow-md"
            >
              Refresh
            </Button>
          </div>
        </div>

        {/* 4 Metric Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-bold uppercase tracking-wider text-[10px]">Total Students</span>
              <Users className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-2xl font-black text-white">{dbStats?.totalStudents || 0}</p>
            <span className="text-[10px] text-slate-500 font-mono">Registered candidate accounts</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-bold uppercase tracking-wider text-[10px]">Total Documents</span>
              <FileText className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-black text-white">{dbStats?.totalDocuments?.toLocaleString() || 0}</p>
            <span className="text-[10px] text-slate-500 font-mono">Across {dbStats?.collectionsCount || 0} collections</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-bold uppercase tracking-wider text-[10px]">Storage Used</span>
              <HardDrive className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-2xl font-black text-purple-300">{dbStats?.storageSizeFormatted || '0 MB'}</p>
            <span className="text-[10px] text-slate-500 font-mono">Data: {dbStats?.dataSizeFormatted}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-bold uppercase tracking-wider text-[10px]">Total Index Size</span>
              <Layers className="w-4 h-4 text-pink-400" />
            </div>
            <p className="text-2xl font-black text-pink-300">{dbStats?.indexSizeFormatted || '0 MB'}</p>
            <span className="text-[10px] text-slate-500 font-mono">B-Tree search indexes</span>
          </div>
        </div>

        {/* Dynamic Storage Progress Bar Card */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-3 shadow-inner">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-300 font-mono">
                MongoDB Storage
              </span>
              <span className="text-xs font-bold text-white font-mono">
                {dbStats?.totalSizeFormatted} / {dbStats?.storageLimitFormatted}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`text-xs font-black font-mono px-2.5 py-0.5 rounded-full border ${
                  isDanger
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : isWarning
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}
              >
                {usagePercentage}% Used
              </span>
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                ({freeFormatted} Free)
              </span>
            </div>
          </div>

          {/* Graphical Progress Bar */}
          <div className="w-full h-4 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
            <div
              className={`h-full bg-gradient-to-r ${progressBarColor} transition-all duration-700 rounded-full shadow-lg`}
              style={{ width: `${Math.min(100, Math.max(2, usagePercentage))}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span>0 MB</span>
            <span>128 MB</span>
            <span>256 MB</span>
            <span>384 MB</span>
            <span>512 MB (Atlas Free Limit)</span>
          </div>
        </div>
      </div>

      {/* Collection-wise Detailed Statistics Table */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4 bg-slate-900/80 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Collection-Wise Storage &amp; Document Breakdown</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Detailed breakdown of data payloads, disk storage, and index allocations per collection
            </p>
          </div>

          {/* Search & Sort Controls */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-full sm:w-56">
              <Input
                placeholder="Filter collections..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                icon={Search}
              />
            </div>
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-xs rounded-xl py-2 px-3 text-white outline-none cursor-pointer"
            >
              <option value="storage">Sort by Storage Size</option>
              <option value="documents">Sort by Document Count</option>
              <option value="index">Sort by Index Size</option>
              <option value="name">Sort by Name</option>
            </select>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300 min-w-[700px]">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Collection Name</th>
                <th className="py-3 px-4 text-center">Documents</th>
                <th className="py-3 px-4 text-center">Data Size</th>
                <th className="py-3 px-4 text-center">Storage Size</th>
                <th className="py-3 px-4 text-center">Index Size</th>
                <th className="py-3 px-4 text-center">Avg Doc Size</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
              {filteredCollections.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No matching collections found.
                  </td>
                </tr>
              ) : (
                filteredCollections.map((col, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4">
                      <div className="font-bold text-white flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                        <span>{col.displayName}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 ml-4 block">{col.name}</span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-slate-200">
                      {col.documents.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-indigo-300">
                      {col.dataSizeFormatted}
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-purple-300">
                      {col.storageSizeFormatted}
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-pink-300">
                      {col.indexSizeFormatted}
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-slate-400">
                      {col.avgObjSizeFormatted}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
