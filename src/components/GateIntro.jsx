import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInvite } from "../context/InviteContext";
import GoldParticles from "./GoldParticles";
import { Lotus, TempleLamp } from "./Ornaments";
import { wedding } from "../utils/weddingData";

/* ---------------------------------------------------------------- doors */

function DoorPanel({ side, open }) {
  const isLeft = side === "left";

  return (
    <motion.div
      className="absolute top-0 z-20 h-full w-1/2 overflow-hidden"
      style={{
        [isLeft ? "left" : "right"]: 0,
        transformOrigin: isLeft ? "left center" : "right center",
        transformStyle: "preserve-3d",
      }}
      initial={{ rotateY: 0 }}
      animate={{ rotateY: open ? (isLeft ? -135 : 135) : 0 }}
      transition={{ duration: 1.8, ease: [0.65, 0, 0.25, 1], delay: 0.15 }}
    >
      <div className="relative h-full w-full overflow-hidden bg-[#1B0508]">
        {/* Door carved teak wood image */}
        <img
          src={isLeft ? "/door-left.png" : "/door-right.png"}
          alt={isLeft ? "Left temple door with Lord Shiva" : "Right temple door with Goddess Parvati"}
          className={`h-full w-full select-none pointer-events-none object-contain ${
            isLeft ? "object-right" : "object-left"
          }`}
          draggable="false"
        />

        {/* Ambient shadow gradient along meeting seam */}
        <div
          className={`absolute inset-y-0 w-12 pointer-events-none ${
            isLeft
              ? "right-0 bg-gradient-to-l from-black/60 to-transparent"
              : "left-0 bg-gradient-to-r from-black/60 to-transparent"
          }`}
        />

        {/* Outer edge frame shadow */}
        <div
          className={`absolute inset-y-0 w-8 pointer-events-none ${
            isLeft
              ? "left-0 bg-gradient-to-r from-black/50 to-transparent"
              : "right-0 bg-gradient-to-l from-black/50 to-transparent"
          }`}
        />

        {/* Subtle wood sheen gradient */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-amber-400/5 via-transparent to-black/30" />
      </div>

      {/* outward face shading as the door swings into 3D space */}
      <motion.div
        className="pointer-events-none absolute inset-0 bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: open ? 0.38 : 0 }}
        transition={{ duration: 1.8, delay: 0.15 }}
      />
    </motion.div>
  );
}

function TempleGopuram({ side, opening }) {
  return (
    <motion.svg
      aria-hidden="true"
      viewBox="0 0 220 520"
      className={`pointer-events-none absolute bottom-0 z-10 h-[72vh] max-h-[620px] w-[min(18vw,210px)] ${
        side === "left" ? "left-0 sm:left-[2vw]" : "right-0 sm:right-[2vw]"
      }`}
      preserveAspectRatio="xMidYMax meet"
      initial={{ opacity: 0 }}
      animate={{ opacity: opening ? 0 : 0.95 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      <defs>
        <linearGradient id={`gopuram-${side}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#F0DAA0" />
          <stop offset="0.48" stopColor="#A9862A" />
          <stop offset="1" stopColor="#D4AF37" />
        </linearGradient>
      </defs>
      <path d="M18 510h184v-30h-18V144h-16V96h-18V58h-18V25h-44v33H70v38H52v48H36v336H18z" fill="#0C0304" fillOpacity=".96" stroke={`url(#gopuram-${side})`} strokeWidth="4" />
      <path d="M34 150h152v326H34z" fill="url(#gopuram-${side})" fillOpacity=".08" stroke="#D4AF37" strokeOpacity=".6" strokeWidth="2" />
      {[170, 220, 270, 320, 370, 420, 470].map((y, i) => {
        const inset = i < 2 ? i * 13 : 26;
        const left = 40 + inset;
        const width = 140 - inset * 2;
        return <g key={y}>
          <path d={`M${left} ${y}h${width}l12 12H${left - 12}z`} fill="#6E0E14" stroke={`url(#gopuram-${side})`} strokeWidth="3" />
          <path d={`M${left + 8} ${y + 19}h${width - 16}`} fill="none" stroke="#D4AF37" strokeOpacity=".7" strokeWidth="2" />
          <path d={`M${left + 14} ${y + 25}q${width / 2 - 14} 23 ${width - 28} 0`} fill="none" stroke="#A9862A" strokeWidth="2" />
          <circle cx="110" cy={y + 34} r="9" fill="#D4AF37" stroke="#FCF4DC" strokeWidth="2" />
          <circle cx="110" cy={y + 34} r="3" fill="#FCF4DC" />
        </g>;
      })}
      <path d="M75 58h70M87 25h46M110 5v20M28 480h164M43 144h134M44 160h132" fill="none" stroke={`url(#gopuram-${side})`} strokeWidth="5" />
      <path d="M82 478v-48q28-44 56 0v48z" fill="#0C0304" stroke={`url(#gopuram-${side})`} strokeWidth="4" />
      <path d="M96 468v-33q14-21 28 0v33z" fill="#6E0E14" stroke="#D4AF37" strokeWidth="2" />
      <path d="M106 55q4-16 8 0l-4 10zM91 95q19-20 38 0M70 140q40-28 80 0" fill="#D4AF37" stroke="#FCF4DC" strokeWidth="2" />
      <path d="M110 145v330M48 160v300M172 160v300" fill="none" stroke="#A9862A" strokeOpacity=".38" strokeWidth="2" />
    </motion.svg>
  );
}

/* ---------------------------------------------------------------- couple reveal */

function CoupleReveal({ opening, onEnter }) {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-between px-4 py-4 text-center overflow-hidden sm:px-6 sm:py-5">
      {/* Top greeting */}
      <motion.div
        className="relative z-10 flex flex-col items-center mt-2 sm:mt-4"
        initial={{ opacity: 0, y: -20 }}
        animate={opening ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.9, delay: 0.25, ease: "easeOut" }}
      >
        <Lotus className="mb-2 text-gold/80" size={24} />
        <p className="font-vibes text-2xl sm:text-4xl md:text-5xl text-gold-light drop-shadow">
          You are cordially invited
        </p>
      </motion.div>

      {/* Center Couple Photo */}
      <motion.div
        className="relative z-10 my-auto flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.84, y: 15 }}
        animate={opening ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.84, y: 15 }}
        transition={{ duration: 1.1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="relative flex items-center justify-center">
          <img
            src="/main-couple.png"
            alt={`${wedding.groom.name} & ${wedding.bride.name}`}
            className="max-h-[44vh] sm:max-h-[48vh] md:max-h-[48vh] w-auto max-w-[85vw] object-contain select-none"
            draggable="false"
          />
        </div>
      </motion.div>

      {/* Bottom info + Enter Invitation button */}
      <motion.div
        className="relative z-10 flex flex-col items-center mb-2 sm:mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={opening ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.9, delay: 0.35, ease: "easeOut" }}
      >
        <h1 className="max-w-[min(90vw,48rem)] text-balance font-cinzel text-base font-semibold tracking-[0.08em] text-foil uppercase drop-shadow-md sm:text-3xl sm:tracking-[0.12em] md:text-4xl">
          {wedding.groom.name} &amp; {wedding.bride.name}
        </h1>
        <p className="mt-1 max-w-[min(90vw,48rem)] text-center font-cormorant text-[10px] tracking-[0.16em] text-ivory/80 uppercase sm:text-sm sm:tracking-[0.28em] md:text-base">
          {wedding.dateRange} &bull; {wedding.cities}
        </p>

        {/* Enter Invitation button */}
        <motion.button
          onClick={onEnter}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          className="group mt-3 sm:mt-4 inline-flex items-center gap-2 rounded-full border border-gold/60 bg-maroon-dark/90 px-6 py-2.5 font-cinzel text-[10px] sm:text-xs tracking-[0.3em] text-gold-light uppercase shadow-[0_0_24px_rgba(212,175,55,0.35)] backdrop-blur-sm transition-all duration-300 hover:border-gold hover:bg-maroon-deep cursor-pointer"
        >
          <span>Enter Invitation</span>
          <span className="text-gold text-xs transition-transform group-hover:translate-y-0.5">&darr;</span>
        </motion.button>
      </motion.div>
    </div>
  );
}

/* ---------------------------------------------------------------- gate intro */

export default function GateIntro() {
  const { gatesOpen, setGatesOpen, toggleMusic, musicOn } = useInvite();
  const [opening, setOpening] = useState(false);
  const timerRef = useRef(null);

  const handleOpen = () => {
    if (opening) return;
    setOpening(true);

    if (!musicOn && toggleMusic) {
      toggleMusic();
    }

    // Auto-advance after 4.5 seconds so user can enjoy the couple photo reveal
    timerRef.current = setTimeout(() => {
      setGatesOpen(true);
    }, 4500);
  };

  const handleEnterImmediately = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setGatesOpen(true);
  };

  return (
    <AnimatePresence>
      {!gatesOpen && (
        <motion.div
          className="fixed inset-0 z-50 overflow-hidden bg-royal"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          style={{ perspective: "2200px" }}
        >
          {/* Couple photo and invitation greeting revealed behind the doors */}
          <CoupleReveal opening={opening} onEnter={handleEnterImmediately} />

          {/* Floating gold dust */}
          <GoldParticles count={18} />

          {/* Temple carved doors */}
          <div
            className="absolute inset-0 z-20 cursor-pointer"
            onClick={!opening ? handleOpen : undefined}
          >
            {/* A soft arched portal frames the doors without competing with the carvings. */}
            <motion.div
              className="pointer-events-none absolute bottom-0 left-1/2 z-10 h-[94vh] w-[min(100vw,115vh)] -translate-x-1/2"
              animate={{ opacity: opening ? 0 : 1 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              style={{
                borderRadius: "48% 48% 0 0 / 15% 15% 0 0",
                border: "1px solid rgba(212,175,55,0.38)",
                background: "linear-gradient(180deg, rgba(212,175,55,0.08), rgba(10,2,4,0.22))",
                boxShadow: "0 0 48px rgba(212,175,55,0.12), inset 0 0 38px rgba(0,0,0,0.28)",
              }}
            />
            <TempleGopuram side="left" opening={opening} />
            <TempleGopuram side="right" opening={opening} />
            <div className="absolute inset-y-0 left-1/2 w-[min(100vw,105vh)] -translate-x-1/2">
              <DoorPanel side="left" open={opening} />
              <DoorPanel side="right" open={opening} />
            </div>

            {/* Glowing gold seam line down the center when closed */}
            {!opening && (
              <div
                className="absolute inset-y-0 left-1/2 z-25 -translate-x-1/2 w-[2px] pointer-events-none"
                style={{
                  background:
                    "linear-gradient(180deg, transparent, rgba(212,175,55,0.5) 15%, rgba(240,218,160,0.9) 50%, rgba(212,175,55,0.5) 85%, transparent)",
                  boxShadow: "0 0 12px rgba(212,175,55,0.7)",
                }}
              />
            )}
          </div>

          {/* Opening control button */}
          <AnimatePresence>
            {!opening && (
              <motion.div
                className="absolute left-1/2 top-1/2 z-40 -translate-x-1/2 -translate-y-1/2"
                exit={{ scale: 0.7, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeIn" }}
              >
                <motion.button
                  onClick={handleOpen}
                  aria-label="Open the invitation"
                  className="group relative flex flex-col items-center justify-center rounded-full border-2 border-gold/70 bg-maroon-dark/95 px-7 py-3 font-cinzel text-xs tracking-[0.34em] text-gold-light uppercase shadow-[0_0_35px_rgba(212,175,55,0.45),inset_0_1px_2px_rgba(255,235,180,0.35)] backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-gold hover:bg-maroon-deep sm:px-9 sm:py-3.5 sm:text-sm cursor-pointer"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  <span className="absolute inset-0 -z-10 rounded-full border border-gold/50 animate-ping opacity-35" />
                  <span>Tap to open</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Lamps flanking the threshold */}
          <motion.div animate={{ opacity: opening ? 0 : 0.9 }} transition={{ duration: 0.45 }} className="pointer-events-none absolute bottom-0 left-4 z-30 hidden sm:left-10 md:block">
            <TempleLamp size={54} />
          </motion.div>
          <motion.div animate={{ opacity: opening ? 0 : 0.9 }} transition={{ duration: 0.45 }} className="pointer-events-none absolute bottom-0 right-4 z-30 hidden sm:right-10 md:block">
            <TempleLamp size={54} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
