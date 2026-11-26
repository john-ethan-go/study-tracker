'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';

type Visit = {
  table: string;
  endsAt: number;
};

const storageKey = 'study-tracker-camera-demo';
const button = 'rounded-xl bg-[#1e462b] px-4 py-3 font-semibold text-white';

function getVisit(): Visit | null {
  const saved = localStorage.getItem(storageKey);
  if (!saved) return null;

  const visit: Visit = JSON.parse(saved);
  return visit.endsAt > Date.now() ? visit : null;
}

export default function ScanPage() {
  const video = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [table, setTable] = useState('');
  const [minutes, setMinutes] = useState('60');
  const [visit, setVisit] = useState<Visit | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    function refresh() {
      const current = getVisit();
      setVisit(current);

      if (current) {
        setCameraOn(false);
        setTable('');
      }
    }

    refresh();
    setReady(true);
    window.addEventListener('storage', refresh);
    window.addEventListener('focus', refresh);
    const timer = window.setInterval(refresh, 1000);

    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('focus', refresh);
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (!cameraOn || !video.current) return;
    let active = true;

    const scanner = new QrScanner(video.current, ({ data }) => {
      if (!active) return;

      if (data !== 'ST-T1' && data !== 'ST-T2') {
        setMessage('Unknown QR Code. Scan ST-T1 or ST-T2.');
        return;
      }

      active = false;
      setTable(data);
      setMessage('');
      setCameraOn(false);
    }, {
      preferredCamera: 'environment',
      returnDetailedScanResult: true,
    });

    scanner.start().catch(() => {
      if (!active) return;
      setCameraOn(false);
      setMessage('Camera Unavailable. Allow Camera Access and Use HTTPS on Your Phone.');
    });

    return () => {
      active = false;
      scanner.destroy();
    };
  }, [cameraOn]);

  async function checkIn() {
    const duration = Number(minutes);
    if (!table || !Number.isInteger(duration) || duration < 1 || duration > 120) {
      setMessage('Choose 1–120 Whole Minutes.');
      return;
    }

    await navigator.locks.request(storageKey, () => {
      const current = getVisit();
      if (current) {
        setVisit(current);
        setTable('');
        setMessage(`Already Checked In at ${current.table}.`);
        return;
      }

      const next = { table, endsAt: Date.now() + duration * 60_000 };
      localStorage.setItem(storageKey, JSON.stringify(next));
      setVisit(next);
      setTable('');
      setMessage('');
    });
  }

  async function checkOut() {
    await navigator.locks.request(storageKey, () => {
      const current = getVisit();
      if (current && visit &&
          current.table === visit.table && current.endsAt === visit.endsAt) {
        localStorage.removeItem(storageKey);
        setVisit(null);
        setMessage(`Checked Out of ${current.table}.`);
      } else {
        setVisit(current);
        setMessage(current ? 'Active Session Updated.' : 'Session Ended.');
      }

      setTable('');
      setCameraOn(false);
    });
  }

  return (
    <main className="min-h-screen bg-slate-50 p-5 text-slate-900">
      <div className="mx-auto grid max-w-md gap-5">
        <Link href="/" className="w-fit font-semibold text-[#1e462b]">
          ← Explore Campus
        </Link>

        <header className="grid gap-3">
          <h1 className="text-3xl font-bold tracking-tight">Table Check-In</h1>

          {ready && (
            <div role="status" className="grid justify-items-start gap-1">
              <span
                className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-lg font-extrabold leading-tight ${
                  visit
                    ? 'border-emerald-300 bg-emerald-100 text-emerald-950'
                    : 'border-amber-300 bg-amber-100 text-amber-950'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`h-2.5 w-2.5 rounded-full ${
                    visit ? 'bg-emerald-700' : 'bg-amber-600'
                  }`}
                />
                {visit ? `CHECKED IN · ${visit.table}` : 'NO ACTIVE CHECK-IN'}
              </span>

              {visit && (
                <p className="text-sm font-semibold text-slate-600">
                  End Time: {new Date(visit.endsAt).toLocaleTimeString([], {
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </p>
              )}
            </div>
          )}
        </header>

        {ready && (visit ? (
          <button className={button} onClick={checkOut}>
            Check Out
          </button>
        ) : (
          <>
            <button
              className={button}
              onClick={() => {
                setTable('');
                setMessage('');
                setCameraOn(!cameraOn);
              }}
            >
              {cameraOn ? 'Stop Camera' : 'Scan With Camera'}
            </button>

            {cameraOn && (
              <>
                <p>Scan the Table QR Code</p>
                <video
                  ref={video}
                  autoPlay
                  muted
                  playsInline
                  className="w-full rounded-xl bg-black"
                />
              </>
            )}

            {table && (
              <form
                className="grid gap-3 rounded-xl border bg-white p-4"
                onSubmit={event => {
                  event.preventDefault();
                  void checkIn();
                }}
              >
                <h2 className="text-lg font-bold">Recognized Table: {table}</h2>
                <label htmlFor="minutes">Study Time in Minutes (1–120)</label>
                <input
                  id="minutes"
                  type="number"
                  min="1"
                  max="120"
                  step="1"
                  required
                  value={minutes}
                  onChange={event => setMinutes(event.target.value)}
                  className="rounded-xl border p-3"
                />
                <button className={button}>Check In</button>
              </form>
            )}
          </>
        ))}

        <p role="status">{message}</p>
      </div>
    </main>
  );
}