'use client';

import React, { useState, useMemo } from 'react';
import { 
  Navigation, 
  QrCode, 
  Compass, 
  CheckCircle2,
  Map as MapIcon,
  ScanLine
} from 'lucide-react';

type FilterType = 'all' | 'available' | 'outlets' | 'quiet';

interface StudySpot {
  id: string;
  code: string;
  name: string;
  building: string;
  shortDesc: string;
  availableSeats: number;
  totalSeats: number;
  tags: string[];
  hasOutlets: boolean;
  isQuiet: boolean;
  status: 'available' | 'full';
  coords: { x: number; y: number; w: number; h: number };
}

const SPOTS: StudySpot[] = [
  {
    id: 'stan-grad',
    code: 'M',
    name: 'Library study area',
    building: 'M - STAN GRAD CENTRE',
    shortDesc: 'Outlets • Quiet',
    availableSeats: 8,
    totalSeats: 24,
    tags: ['Power Outlets', 'Quiet Space', 'Desk Seating'],
    hasOutlets: true,
    isQuiet: true,
    status: 'available',
    coords: { x: 135, y: 115, w: 65, h: 65 }
  },
  {
    id: 'aldred',
    code: 'C',
    name: 'Aldred Centre',
    building: 'C - ALDRED CENTRE',
    shortDesc: 'No outlets • Social',
    availableSeats: 12,
    totalSeats: 30,
    tags: ['No Outlets', 'Social Area', 'Natural Light'],
    hasOutlets: false,
    isQuiet: false,
    status: 'available',
    coords: { x: 55, y: 55, w: 60, h: 45 }
  },
  {
    id: 'senator-burns',
    code: 'N',
    name: 'Senator Burns Building',
    building: 'N - SENATOR BURNS BUILDING',
    shortDesc: 'Outlets • Social',
    availableSeats: 5,
    totalSeats: 20,
    tags: ['Power Outlets', 'Social Area', 'Café Nearby'],
    hasOutlets: true,
    isQuiet: false,
    status: 'available',
    coords: { x: 55, y: 130, w: 55, h: 40 }
  },
  {
    id: 'johnson-cobbe',
    code: 'N',
    name: 'Johnson-Cobbe Energy Centre',
    building: 'N - JOHNSON-COBBE ENERGY CENTRE',
    shortDesc: 'Outlets • Social',
    availableSeats: 0,
    totalSeats: 15,
    tags: ['Power Outlets', 'Group Tables'],
    hasOutlets: true,
    isQuiet: false,
    status: 'full',
    coords: { x: 215, y: 145, w: 55, h: 55 }
  }
];

export default function ResponsiveStudyTracker() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedId, setSelectedId] = useState<string>('stan-grad');
  const [activeTab, setActiveTab] = useState<'explore' | 'directions' | 'checkin'>('explore');
  const [checkedIn, setCheckedIn] = useState(false);

  const filteredSpots = useMemo(() => {
    return SPOTS.filter((spot) => {
      if (filter === 'available') return spot.availableSeats > 0;
      if (filter === 'outlets') return spot.hasOutlets;
      if (filter === 'quiet') return spot.isQuiet;
      return true;
    });
  }, [filter]);

  const activeSpot = useMemo(() => {
    return SPOTS.find((s) => s.id === selectedId) || SPOTS[0];
  }, [selectedId]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans pb-20 md:pb-0">
      {/* TOP HEADER (Adapts from compact mobile bar to wide desktop header) */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-[#1e462b] flex items-center justify-center text-white font-bold text-lg tracking-tight">
              st
            </div>
            <div>
              <h1 className="font-bold text-base leading-none text-slate-900">study tracker.</h1>
              <p className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase mt-0.5">
                SAIT • MAIN CAMPUS
              </p>
            </div>
          </div>

          {/* Desktop Navigation Pills (Hidden on Mobile) */}
          <nav className="hidden md:flex items-center space-x-2 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('explore')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'explore' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Explore Campus
            </button>
            <button
              onClick={() => setActiveTab('directions')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'directions' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Directions
            </button>
            <button
              onClick={() => setCheckedIn(!checkedIn)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 ${
                checkedIn ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>{checkedIn ? 'Checked In' : 'QR Check-in'}</span>
            </button>
          </nav>
        </div>
      </header>

      {/* MAIN RESPONSIVE CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Hero Title & Filter Chips */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-6 gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              A little space to focus
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-0.5">
              Find your study spot.
            </h2>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0">
            {(['all', 'available', 'outlets', 'quiet'] as FilterType[]).map((item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition ${
                  filter === item
                    ? 'bg-[#1e462b] text-white border-[#1e462b]'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                {item === 'all' && 'All Spaces'}
                {item === 'available' && 'Available'}
                {item === 'outlets' && 'Outlets'}
                {item === 'quiet' && 'Quiet'}
              </button>
            ))}
          </div>
        </div>

        {/* RESPONSIVE GRID: 1 column on Mobile, 12-column split on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT / TOP COLUMN (7 cols on Desktop): Interactive Map + Selected Card */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Interactive Campus Map */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm">
              <svg viewBox="0 0 320 230" className="w-full h-auto max-h-[340px] mx-auto">
                {/* Campus Pathways */}
                <path
                  d="M30,115 L290,115 M128,20 L128,210 M205,40 L205,200"
                  stroke="#94a3b8"
                  strokeWidth="4"
                  strokeLinecap="round"
                  opacity="0.4"
                />
                <circle cx="128" cy="115" r="7" fill="#ffffff" stroke="#94a3b8" strokeWidth="3" />

                {/* Inactive Campus Blocks for Context */}
                <rect x="220" y="45" width="40" height="50" rx="4" fill="#e2e8f0" />
                <rect x="145" y="190" width="45" height="30" rx="4" fill="#e2e8f0" />

                {/* Interactive Study Buildings */}
                {SPOTS.map((spot) => {
                  const isSelected = spot.id === selectedId;
                  return (
                    <g
                      key={spot.id}
                      onClick={() => setSelectedId(spot.id)}
                      className="cursor-pointer transition-opacity hover:opacity-90"
                    >
                      <rect
                        x={spot.coords.x}
                        y={spot.coords.y}
                        width={spot.coords.w}
                        height={spot.coords.h}
                        rx="6"
                        fill={isSelected ? '#1e462b' : '#2d5a3c'}
                        stroke={isSelected ? '#86efac' : 'transparent'}
                        strokeWidth={isSelected ? '3' : '0'}
                      />
                      <text
                        x={spot.coords.x + spot.coords.w / 2}
                        y={spot.coords.y + spot.coords.h / 2}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="#ffffff"
                        className="text-[11px] font-bold pointer-events-none"
                      >
                        {spot.code}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Active Spot Detail Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {activeSpot.building}
                </span>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    activeSpot.status === 'full'
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {activeSpot.status === 'full' ? 'FULL' : `${activeSpot.availableSeats} available`}
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-1">{activeSpot.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {activeSpot.availableSeats} of {activeSpot.totalSeats} seats free • simulated
              </p>

              {/* Amenity Tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                {activeSpot.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full border border-slate-200 text-xs font-medium text-slate-600 bg-slate-50"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
                <button className="w-full py-2.5 px-4 rounded-xl bg-[#1e462b] hover:bg-[#163520] text-white text-xs font-semibold flex items-center justify-center space-x-2 transition">
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Get Directions</span>
                </button>
                <button
                  onClick={() => setCheckedIn(!checkedIn)}
                  className={`w-full py-2.5 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-2 transition ${
                    checkedIn
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  {checkedIn ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <QrCode className="w-3.5 h-3.5" />}
                  <span>{checkedIn ? 'Checked In' : 'QR check-in'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT / BOTTOM COLUMN (5 cols on Desktop): "On the map" Directory List */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-slate-900">On the map</h3>
              <span className="text-xs font-medium text-slate-500">{filteredSpots.length} spaces</span>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredSpots.map((spot) => {
                const isSelected = spot.id === selectedId;
                return (
                  <button
                    key={spot.id}
                    onClick={() => setSelectedId(spot.id)}
                    className={`w-full py-3.5 px-2 flex items-center justify-between text-left transition rounded-xl ${
                      isSelected ? 'bg-emerald-50/70' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs ${
                          isSelected
                            ? 'bg-[#1e462b] text-white'
                            : 'bg-emerald-100/80 text-emerald-900'
                        }`}
                      >
                        {spot.code}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{spot.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{spot.shortDesc}</p>
                      </div>
                    </div>

                    <span
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                        spot.status === 'full'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {spot.status === 'full' ? 'FULL' : `${spot.availableSeats} available`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </main>

      {/* MOBILE BOTTOM TAB BAR (Visible on iPhone, hidden on Desktop `md:hidden`) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 h-16 px-6 flex items-center justify-around z-40">
        <button
          onClick={() => setActiveTab('explore')}
          className="flex flex-col items-center space-y-1"
        >
          <div className={`w-10 h-1.5 rounded-full ${activeTab === 'explore' ? 'bg-emerald-300' : 'bg-slate-200'}`} />
          <span className={`text-[11px] font-semibold ${activeTab === 'explore' ? 'text-slate-900' : 'text-slate-400'}`}>
            Explore
          </span>
        </button>

        <button
          onClick={() => setActiveTab('directions')}
          className="flex flex-col items-center space-y-1"
        >
          <div className={`w-10 h-1.5 rounded-full ${activeTab === 'directions' ? 'bg-emerald-300' : 'bg-slate-200'}`} />
          <span className={`text-[11px] font-semibold ${activeTab === 'directions' ? 'text-slate-900' : 'text-slate-400'}`}>
            Directions
          </span>
        </button>

        <button
          onClick={() => window.location.assign('/scan')}
          className="flex flex-col items-center space-y-1"
        >
          <div className={`w-10 h-1.5 rounded-full ${activeTab === 'checkin' ? 'bg-emerald-300' : 'bg-slate-200'}`} />
          <span className={`text-[11px] font-semibold ${activeTab === 'checkin' ? 'text-slate-900' : 'text-slate-400'}`}>
            Check-in
          </span>
        </button>
      </nav>
    </div>
  );
}