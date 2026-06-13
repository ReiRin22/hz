import React from 'react';

// Full Body Templates
export const FullBodyFront = () => (
  <svg viewBox="0 0 100 200" className="w-full h-full">
    {/* Head */}
    <ellipse cx="50" cy="25" rx="12" ry="15" fill="none" stroke="#333" strokeWidth="1"/>
    
    {/* Torso */}
    <rect x="35" y="40" width="30" height="50" rx="5" fill="none" stroke="#333" strokeWidth="1"/>
    
    {/* Arms */}
    <rect x="20" y="45" width="12" height="35" rx="6" fill="none" stroke="#333" strokeWidth="1"/>
    <rect x="68" y="45" width="12" height="35" rx="6" fill="none" stroke="#333" strokeWidth="1"/>
    
    {/* Legs */}
    <rect x="40" y="95" width="8" height="45" rx="4" fill="none" stroke="#333" strokeWidth="1"/>
    <rect x="52" y="95" width="8" height="45" rx="4" fill="none" stroke="#333" strokeWidth="1"/>
    
    {/* Hands */}
    <ellipse cx="26" cy="85" rx="3" ry="5" fill="none" stroke="#333" strokeWidth="1"/>
    <ellipse cx="74" cy="85" rx="3" ry="5" fill="none" stroke="#333" strokeWidth="1"/>
    
    {/* Feet */}
    <ellipse cx="44" cy="150" rx="4" ry="6" fill="none" stroke="#333" strokeWidth="1"/>
    <ellipse cx="56" cy="150" rx="4" ry="6" fill="none" stroke="#333" strokeWidth="1"/>
    
    {/* Basic organ outlines */}
    <ellipse cx="50" cy="55" rx="8" ry="6" fill="none" stroke="#666" strokeWidth="0.5" strokeDasharray="2,2"/>
    <ellipse cx="50" cy="70" rx="6" ry="8" fill="none" stroke="#666" strokeWidth="0.5" strokeDasharray="2,2"/>
  </svg>
);

export const FullBodyBack = () => (
  <svg viewBox="0 0 100 200" className="w-full h-full">
    {/* Head */}
    <ellipse cx="50" cy="25" rx="12" ry="15" fill="none" stroke="#333" strokeWidth="1"/>
    
    {/* Torso */}
    <rect x="35" y="40" width="30" height="50" rx="5" fill="none" stroke="#333" strokeWidth="1"/>
    
    {/* Arms */}
    <rect x="20" y="45" width="12" height="35" rx="6" fill="none" stroke="#333" strokeWidth="1"/>
    <rect x="68" y="45" width="12" height="35" rx="6" fill="none" stroke="#333" strokeWidth="1"/>
    
    {/* Legs */}
    <rect x="40" y="95" width="8" height="45" rx="4" fill="none" stroke="#333" strokeWidth="1"/>
    <rect x="52" y="95" width="8" height="45" rx="4" fill="none" stroke="#333" strokeWidth="1"/>
    
    {/* Spine */}
    <line x1="50" y1="40" x2="50" y2="95" stroke="#666" strokeWidth="1" strokeDasharray="3,2"/>
    <circle cx="50" cy="45" r="2" fill="none" stroke="#666" strokeWidth="0.5"/>
    <circle cx="50" cy="55" r="2" fill="none" stroke="#666" strokeWidth="0.5"/>
    <circle cx="50" cy="65" r="2" fill="none" stroke="#666" strokeWidth="0.5"/>
    <circle cx="50" cy="75" r="2" fill="none" stroke="#666" strokeWidth="0.5"/>
    <circle cx="50" cy="85" r="2" fill="none" stroke="#666" strokeWidth="0.5"/>
  </svg>
);

export const FullBodySkeleton = () => (
  <svg viewBox="0 0 100 200" className="w-full h-full">
    {/* Skull */}
    <ellipse cx="50" cy="25" rx="12" ry="15" fill="none" stroke="#333" strokeWidth="1"/>
    <circle cx="45" cy="22" r="2" fill="none" stroke="#333" strokeWidth="1"/>
    <circle cx="55" cy="22" r="2" fill="none" stroke="#333" strokeWidth="1"/>
    
    {/* Rib cage */}
    <ellipse cx="50" cy="60" rx="15" ry="20" fill="none" stroke="#333" strokeWidth="1"/>
    <path d="M35 50 Q50 45 65 50" fill="none" stroke="#333" strokeWidth="0.8"/>
    <path d="M35 55 Q50 50 65 55" fill="none" stroke="#333" strokeWidth="0.8"/>
    <path d="M35 60 Q50 55 65 60" fill="none" stroke="#333" strokeWidth="0.8"/>
    <path d="M35 65 Q50 60 65 65" fill="none" stroke="#333" strokeWidth="0.8"/>
    <path d="M35 70 Q50 65 65 70" fill="none" stroke="#333" strokeWidth="0.8"/>
    
    {/* Pelvis */}
    <ellipse cx="50" cy="90" rx="12" ry="8" fill="none" stroke="#333" strokeWidth="1"/>
    
    {/* Arm bones */}
    <line x1="35" y1="45" x2="26" y2="75" stroke="#333" strokeWidth="2"/>
    <line x1="26" y1="75" x2="26" y2="85" stroke="#333" strokeWidth="2"/>
    <line x1="65" y1="45" x2="74" y2="75" stroke="#333" strokeWidth="2"/>
    <line x1="74" y1="75" x2="74" y2="85" stroke="#333" strokeWidth="2"/>
    
    {/* Leg bones */}
    <line x1="44" y1="98" x2="44" y2="130" stroke="#333" strokeWidth="2"/>
    <line x1="44" y1="130" x2="44" y2="150" stroke="#333" strokeWidth="2"/>
    <line x1="56" y1="98" x2="56" y2="130" stroke="#333" strokeWidth="2"/>
    <line x1="56" y1="130" x2="56" y2="150" stroke="#333" strokeWidth="2"/>
    
    {/* Joints */}
    <circle cx="35" r="2" cy="45" fill="#333"/>
    <circle cx="65" r="2" cy="45" fill="#333"/>
    <circle cx="44" r="2" cy="98" fill="#333"/>
    <circle cx="56" r="2" cy="98" fill="#333"/>
    <circle cx="44" r="2" cy="130" fill="#333"/>
    <circle cx="56" r="2" cy="130" fill="#333"/>
  </svg>
);

// Head Templates
export const HeadFront = () => (
  <svg viewBox="0 0 100 120" className="w-full h-full">
    {/* Head outline */}
    <ellipse cx="50" cy="60" rx="25" ry="30" fill="none" stroke="#333" strokeWidth="1.5"/>
    
    {/* Eyes */}
    <ellipse cx="40" cy="50" rx="4" ry="3" fill="none" stroke="#333" strokeWidth="1"/>
    <ellipse cx="60" cy="50" rx="4" ry="3" fill="none" stroke="#333" strokeWidth="1"/>
    
    {/* Nose */}
    <path d="M50 55 L48 65 L52 65 Z" fill="none" stroke="#333" strokeWidth="1"/>
    
    {/* Mouth */}
    <path d="M45 72 Q50 75 55 72" fill="none" stroke="#333" strokeWidth="1"/>
    
    {/* Ears */}
    <ellipse cx="25" cy="55" rx="3" ry="8" fill="none" stroke="#333" strokeWidth="1"/>
    <ellipse cx="75" cy="55" rx="3" ry="8" fill="none" stroke="#333" strokeWidth="1"/>
    
    {/* Brain outline */}
    <ellipse cx="50" cy="40" rx="20" ry="15" fill="none" stroke="#666" strokeWidth="0.8" strokeDasharray="3,2"/>
    
    {/* Neck */}
    <rect x="45" y="90" width="10" height="15" fill="none" stroke="#333" strokeWidth="1"/>
  </svg>
);

export const HeadSide = () => (
  <svg viewBox="0 0 100 120" className="w-full h-full">
    {/* Head profile */}
    <path d="M25 40 Q20 30 30 25 Q50 20 70 30 Q75 40 75 60 Q70 80 60 85 Q40 90 30 85 Q25 70 25 40 Z" 
          fill="none" stroke="#333" strokeWidth="1.5"/>
    
    {/* Eye */}
    <ellipse cx="60" cy="50" rx="4" ry="3" fill="none" stroke="#333" strokeWidth="1"/>
    
    {/* Nose */}
    <path d="M75 55 Q78 60 75 65" fill="none" stroke="#333" strokeWidth="1"/>
    
    {/* Mouth */}
    <path d="M70 72 Q73 74 70 76" fill="none" stroke="#333" strokeWidth="1"/>
    
    {/* Ear */}
    <ellipse cx="25" cy="55" rx="3" ry="8" fill="none" stroke="#333" strokeWidth="1"/>
    
    {/* Brain regions */}
    <ellipse cx="50" cy="40" rx="15" ry="12" fill="none" stroke="#666" strokeWidth="0.8" strokeDasharray="2,2"/>
    <path d="M40 35 Q45 30 55 35" fill="none" stroke="#666" strokeWidth="0.5"/>
    <path d="M40 40 Q50 38 60 42" fill="none" stroke="#666" strokeWidth="0.5"/>
    
    {/* Neck */}
    <rect x="45" y="85" width="10" height="20" fill="none" stroke="#333" strokeWidth="1"/>
  </svg>
);

export const Skull = () => (
  <svg viewBox="0 0 100 120" className="w-full h-full">
    {/* Skull outline */}
    <ellipse cx="50" cy="50" rx="25" ry="25" fill="none" stroke="#333" strokeWidth="1.5"/>
    
    {/* Eye sockets */}
    <ellipse cx="40" cy="45" rx="6" ry="8" fill="none" stroke="#333" strokeWidth="1"/>
    <ellipse cx="60" cy="45" rx="6" ry="8" fill="none" stroke="#333" strokeWidth="1"/>
    
    {/* Nasal cavity */}
    <path d="M50 50 L45 65 L50 70 L55 65 Z" fill="none" stroke="#333" strokeWidth="1"/>
    
    {/* Teeth/jaw */}
    <rect x="45" y="70" width="2" height="4" fill="none" stroke="#333" strokeWidth="0.5"/>
    <rect x="48" y="70" width="2" height="4" fill="none" stroke="#333" strokeWidth="0.5"/>
    <rect x="50" y="70" width="2" height="4" fill="none" stroke="#333" strokeWidth="0.5"/>
    <rect x="52" y="70" width="2" height="4" fill="none" stroke="#333" strokeWidth="0.5"/>
    <rect x="55" y="70" width="2" height="4" fill="none" stroke="#333" strokeWidth="0.5"/>
    
    {/* Skull sutures */}
    <path d="M25 35 Q50 30 75 35" fill="none" stroke="#666" strokeWidth="0.8" strokeDasharray="2,2"/>
    <path d="M50 25 Q50 40 50 50" fill="none" stroke="#666" strokeWidth="0.8" strokeDasharray="2,2"/>
    
    {/* Temporal bones */}
    <ellipse cx="25" cy="50" rx="3" ry="6" fill="none" stroke="#333" strokeWidth="1"/>
    <ellipse cx="75" cy="50" rx="3" ry="6" fill="none" stroke="#333" strokeWidth="1"/>
  </svg>
);

// Chest Templates
export const ChestFront = () => (
  <svg viewBox="0 0 100 120" className="w-full h-full">
    {/* Rib cage outline */}
    <ellipse cx="50" cy="60" rx="30" ry="35" fill="none" stroke="#333" strokeWidth="1.5"/>
    
    {/* Heart */}
    <path d="M45 50 Q40 45 35 50 Q35 55 45 65 Q55 55 55 50 Q50 45 45 50 Z" 
          fill="none" stroke="#e74c3c" strokeWidth="1.5"/>
    
    {/* Lungs */}
    <ellipse cx="35" cy="55" rx="8" ry="20" fill="none" stroke="#3498db" strokeWidth="1"/>
    <ellipse cx="65" cy="55" rx="8" ry="20" fill="none" stroke="#3498db" strokeWidth="1"/>
    
    {/* Ribs */}
    <path d="M20 40 Q50 35 80 40" fill="none" stroke="#333" strokeWidth="0.8"/>
    <path d="M20 50 Q50 45 80 50" fill="none" stroke="#333" strokeWidth="0.8"/>
    <path d="M20 60 Q50 55 80 60" fill="none" stroke="#333" strokeWidth="0.8"/>
    <path d="M20 70 Q50 65 80 70" fill="none" stroke="#333" strokeWidth="0.8"/>
    <path d="M25 80 Q50 75 75 80" fill="none" stroke="#333" strokeWidth="0.8"/>
    
    {/* Sternum */}
    <rect x="48" y="35" width="4" height="35" fill="none" stroke="#333" strokeWidth="1"/>
    
    {/* Clavicles */}
    <path d="M30 30 Q50 25 70 30" fill="none" stroke="#333" strokeWidth="1.5"/>
  </svg>
);

export const Heart = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    {/* Heart outline */}
    <path d="M50 80 Q25 55 25 40 Q25 25 40 25 Q50 30 50 30 Q50 30 60 25 Q75 25 75 40 Q75 55 50 80 Z" 
          fill="none" stroke="#e74c3c" strokeWidth="2"/>
    
    {/* Heart chambers */}
    <path d="M35 45 Q45 40 50 50 Q55 40 65 45 Q60 60 50 65 Q40 60 35 45 Z" 
          fill="none" stroke="#c0392b" strokeWidth="1" strokeDasharray="2,2"/>
    
    {/* Aorta */}
    <path d="M50 25 Q45 15 40 10" fill="none" stroke="#e74c3c" strokeWidth="2"/>
    <path d="M50 25 Q55 15 60 10" fill="none" stroke="#e74c3c" strokeWidth="2"/>
    
    {/* Ventricles */}
    <line x1="50" y1="45" x2="50" y2="65" stroke="#c0392b" strokeWidth="1"/>
    
    {/* Valves */}
    <circle cx="45" cy="50" r="2" fill="none" stroke="#c0392b" strokeWidth="1"/>
    <circle cx="55" cy="50" r="2" fill="none" stroke="#c0392b" strokeWidth="1"/>
  </svg>
);

export const Lungs = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    {/* Left lung */}
    <ellipse cx="30" cy="50" rx="15" ry="30" fill="none" stroke="#3498db" strokeWidth="2"/>
    
    {/* Right lung */}
    <ellipse cx="70" cy="50" rx="15" ry="30" fill="none" stroke="#3498db" strokeWidth="2"/>
    
    {/* Bronchi */}
    <path d="M50 30 Q40 35 30 40" fill="none" stroke="#2980b9" strokeWidth="1.5"/>
    <path d="M50 30 Q60 35 70 40" fill="none" stroke="#2980b9" strokeWidth="1.5"/>
    
    {/* Trachea */}
    <rect x="48" y="10" width="4" height="25" fill="none" stroke="#2980b9" strokeWidth="1.5"/>
    
    {/* Lung lobes */}
    <path d="M20 40 Q30 35 40 45" fill="none" stroke="#3498db" strokeWidth="0.8" strokeDasharray="2,2"/>
    <path d="M20 60 Q30 55 40 65" fill="none" stroke="#3498db" strokeWidth="0.8" strokeDasharray="2,2"/>
    <path d="M60 40 Q70 35 80 45" fill="none" stroke="#3498db" strokeWidth="0.8" strokeDasharray="2,2"/>
    <path d="M60 50 Q70 45 80 55" fill="none" stroke="#3498db" strokeWidth="0.8" strokeDasharray="2,2"/>
    <path d="M60 65 Q70 60 80 70" fill="none" stroke="#3498db" strokeWidth="0.8" strokeDasharray="2,2"/>
  </svg>
);

// Abdomen Templates
export const AbdomenFront = () => (
  <svg viewBox="0 0 100 120" className="w-full h-full">
    {/* Abdomen outline */}
    <rect x="25" y="20" width="50" height="80" rx="10" fill="none" stroke="#333" strokeWidth="1.5"/>
    
    {/* Stomach */}
    <ellipse cx="40" cy="40" rx="8" ry="12" fill="none" stroke="#e67e22" strokeWidth="1.5"/>
    
    {/* Liver */}
    <ellipse cx="60" cy="35" rx="12" ry="8" fill="none" stroke="#8e44ad" strokeWidth="1.5"/>
    
    {/* Intestines */}
    <path d="M35 60 Q45 55 55 60 Q65 65 55 70 Q45 75 35 70 Q25 65 35 60" 
          fill="none" stroke="#f39c12" strokeWidth="1.5"/>
    
    {/* Kidneys */}
    <ellipse cx="35" cy="50" rx="3" ry="8" fill="none" stroke="#27ae60" strokeWidth="1"/>
    <ellipse cx="65" cy="50" rx="3" ry="8" fill="none" stroke="#27ae60" strokeWidth="1"/>
    
    {/* Bladder */}
    <ellipse cx="50" cy="85" rx="6" ry="8" fill="none" stroke="#3498db" strokeWidth="1"/>
    
    {/* Abdominal muscles */}
    <line x1="45" y1="25" x2="45" y2="95" stroke="#666" strokeWidth="0.5" strokeDasharray="2,2"/>
    <line x1="55" y1="25" x2="55" y2="95" stroke="#666" strokeWidth="0.5" strokeDasharray="2,2"/>
    <line x1="30" y1="45" x2="70" y2="45" stroke="#666" strokeWidth="0.5" strokeDasharray="2,2"/>
    <line x1="30" y1="65" x2="70" y2="65" stroke="#666" strokeWidth="0.5" strokeDasharray="2,2"/>
  </svg>
);

export const DigestiveSystem = () => (
  <svg viewBox="0 0 100 120" className="w-full h-full">
    {/* Esophagus */}
    <rect x="48" y="10" width="4" height="20" fill="none" stroke="#e67e22" strokeWidth="1.5"/>
    
    {/* Stomach */}
    <path d="M40 30 Q30 35 35 45 Q40 55 50 50 Q55 45 50 35 Q45 30 40 30 Z" 
          fill="none" stroke="#e67e22" strokeWidth="2"/>
    
    {/* Small intestine */}
    <path d="M50 55 Q60 60 65 70 Q70 80 60 85 Q50 90 40 85 Q30 80 35 70 Q40 60 50 55" 
          fill="none" stroke="#f39c12" strokeWidth="1.5"/>
    <path d="M45 65 Q55 62 60 72 Q58 78 50 75 Q42 78 40 72 Q45 62 45 65" 
          fill="none" stroke="#f39c12" strokeWidth="1"/>
    
    {/* Large intestine */}
    <path d="M25 75 Q25 65 35 65 Q70 65 75 65 Q75 75 75 85 Q75 95 65 95 Q35 95 25 95 Q25 85 25 75" 
          fill="none" stroke="#d35400" strokeWidth="1.5"/>
    
    {/* Liver */}
    <ellipse cx="65" cy="40" rx="10" ry="6" fill="none" stroke="#8e44ad" strokeWidth="1.5"/>
    
    {/* Pancreas */}
    <ellipse cx="55" cy="50" rx="8" ry="3" fill="none" stroke="#9b59b6" strokeWidth="1"/>
    
    {/* Gallbladder */}
    <ellipse cx="70" cy="48" rx="2" ry="4" fill="none" stroke="#27ae60" strokeWidth="1"/>
  </svg>
);

export const Liver = () => (
  <svg viewBox="0 0 100 80" className="w-full h-full">
    {/* Liver main body */}
    <path d="M15 30 Q10 20 20 15 Q40 10 60 15 Q80 20 85 30 Q90 40 85 50 Q80 60 70 65 Q50 70 30 65 Q20 60 15 50 Q10 40 15 30 Z" 
          fill="none" stroke="#8e44ad" strokeWidth="2"/>
    
    {/* Liver lobes */}
    <path d="M20 25 Q40 20 60 30 Q70 35 65 45 Q60 50 40 45 Q20 40 20 25" 
          fill="none" stroke="#9b59b6" strokeWidth="1" strokeDasharray="3,2"/>
    <path d="M60 30 Q75 35 80 45 Q85 50 75 55 Q65 60 60 50 Q55 40 60 30" 
          fill="none" stroke="#9b59b6" strokeWidth="1" strokeDasharray="3,2"/>
    
    {/* Hepatic vessels */}
    <path d="M50 15 Q50 25 45 35" fill="none" stroke="#e74c3c" strokeWidth="1"/>
    <path d="M50 15 Q50 25 55 35" fill="none" stroke="#3498db" strokeWidth="1"/>
    
    {/* Gallbladder */}
    <ellipse cx="70" cy="50" rx="3" ry="6" fill="none" stroke="#27ae60" strokeWidth="1.5"/>
    
    {/* Hepatic ducts */}
    <path d="M65 45 Q60 50 50 55" fill="none" stroke="#f39c12" strokeWidth="0.8"/>
  </svg>
);

// Limbs Templates
export const ArmBones = () => (
  <svg viewBox="0 0 60 150" className="w-full h-full">
    {/* Humerus */}
    <rect x="25" y="20" width="10" height="50" rx="5" fill="none" stroke="#333" strokeWidth="2"/>
    
    {/* Shoulder joint */}
    <circle cx="30" cy="15" r="8" fill="none" stroke="#333" strokeWidth="1.5"/>
    
    {/* Elbow joint */}
    <circle cx="30" cy="75" r="5" fill="none" stroke="#333" strokeWidth="1"/>
    
    {/* Radius */}
    <rect x="20" y="80" width="8" height="40" rx="4" fill="none" stroke="#333" strokeWidth="1.5"/>
    
    {/* Ulna */}
    <rect x="32" y="80" width="8" height="45" rx="4" fill="none" stroke="#333" strokeWidth="1.5"/>
    
    {/* Wrist */}
    <rect x="22" y="125" width="16" height="8" rx="2" fill="none" stroke="#333" strokeWidth="1"/>
    
    {/* Hand bones */}
    <rect x="25" y="135" width="3" height="10" fill="none" stroke="#333" strokeWidth="0.8"/>
    <rect x="29" y="135" width="3" height="12" fill="none" stroke="#333" strokeWidth="0.8"/>
    <rect x="33" y="135" width="3" height="11" fill="none" stroke="#333" strokeWidth="0.8"/>
    <rect x="37" y="135" width="3" height="9" fill="none" stroke="#333" strokeWidth="0.8"/>
    
    {/* Thumb */}
    <rect x="18" y="138" width="3" height="8" fill="none" stroke="#333" strokeWidth="0.8"/>
  </svg>
);

export const LegMuscles = () => (
  <svg viewBox="0 0 60 150" className="w-full h-full">
    {/* Thigh muscles */}
    <ellipse cx="30" cy="40" rx="12" ry="25" fill="none" stroke="#e74c3c" strokeWidth="1.5"/>
    
    {/* Quadriceps */}
    <rect x="25" y="20" width="10" height="35" rx="5" fill="none" stroke="#c0392b" strokeWidth="1" strokeDasharray="2,2"/>
    
    {/* Hamstrings */}
    <rect x="20" y="25" width="8" height="30" rx="4" fill="none" stroke="#c0392b" strokeWidth="1" strokeDasharray="2,2"/>
    <rect x="32" y="25" width="8" height="30" rx="4" fill="none" stroke="#c0392b" strokeWidth="1" strokeDasharray="2,2"/>
    
    {/* Knee */}
    <circle cx="30" cy="70" r="6" fill="none" stroke="#333" strokeWidth="1.5"/>
    
    {/* Calf muscles */}
    <ellipse cx="30" cy="100" rx="8" ry="20" fill="none" stroke="#e67e22" strokeWidth="1.5"/>
    
    {/* Gastrocnemius */}
    <ellipse cx="26" cy="95" rx="4" ry="15" fill="none" stroke="#d35400" strokeWidth="1" strokeDasharray="2,2"/>
    <ellipse cx="34" cy="95" rx="4" ry="15" fill="none" stroke="#d35400" strokeWidth="1" strokeDasharray="2,2"/>
    
    {/* Soleus */}
    <ellipse cx="30" cy="110" rx="6" ry="10" fill="none" stroke="#d35400" strokeWidth="1" strokeDasharray="2,2"/>
    
    {/* Achilles tendon */}
    <rect x="28" y="125" width="4" height="15" fill="none" stroke="#8e44ad" strokeWidth="1.5"/>
    
    {/* Foot */}
    <ellipse cx="30" cy="145" rx="8" ry="5" fill="none" stroke="#333" strokeWidth="1"/>
  </svg>
);

export const LimbsFull = () => (
  <svg viewBox="0 0 120 150" className="w-full h-full">
    {/* Left Arm */}
    <rect x="10" y="20" width="8" height="35" rx="4" fill="none" stroke="#333" strokeWidth="1"/>
    <rect x="8" y="60" width="6" height="30" rx="3" fill="none" stroke="#333" strokeWidth="1"/>
    <rect x="12" y="60" width="6" height="30" rx="3" fill="none" stroke="#333" strokeWidth="1"/>
    <ellipse cx="14" cy="95" rx="4" ry="6" fill="none" stroke="#333" strokeWidth="1"/>
    
    {/* Right Arm */}
    <rect x="102" y="20" width="8" height="35" rx="4" fill="none" stroke="#333" strokeWidth="1"/>
    <rect x="100" y="60" width="6" height="30" rx="3" fill="none" stroke="#333" strokeWidth="1"/>
    <rect x="106" y="60" width="6" height="30" rx="3" fill="none" stroke="#333" strokeWidth="1"/>
    <ellipse cx="106" cy="95" rx="4" ry="6" fill="none" stroke="#333" strokeWidth="1"/>
    
    {/* Left Leg */}
    <rect x="35" y="20" width="10" height="50" rx="5" fill="none" stroke="#333" strokeWidth="1"/>
    <rect x="33" y="75" width="7" height="45" rx="3" fill="none" stroke="#333" strokeWidth="1"/>
    <rect x="41" y="75" width="7" height="45" rx="3" fill="none" stroke="#333" strokeWidth="1"/>
    <ellipse cx="40" cy="130" rx="6" ry="8" fill="none" stroke="#333" strokeWidth="1"/>
    
    {/* Right Leg */}
    <rect x="75" y="20" width="10" height="50" rx="5" fill="none" stroke="#333" strokeWidth="1"/>
    <rect x="73" y="75" width="7" height="45" rx="3" fill="none" stroke="#333" strokeWidth="1"/>
    <rect x="81" y="75" width="7" height="45" rx="3" fill="none" stroke="#333" strokeWidth="1"/>
    <ellipse cx="80" cy="130" rx="6" ry="8" fill="none" stroke="#333" strokeWidth="1"/>
    
    {/* Joints */}
    <circle cx="14" cy="60" r="3" fill="none" stroke="#666" strokeWidth="1"/>
    <circle cx="106" cy="60" r="3" fill="none" stroke="#666" strokeWidth="1"/>
    <circle cx="40" cy="75" r="4" fill="none" stroke="#666" strokeWidth="1"/>
    <circle cx="80" cy="75" r="4" fill="none" stroke="#666" strokeWidth="1"/>
    <circle cx="37" cy="120" r="3" fill="none" stroke="#666" strokeWidth="1"/>
    <circle cx="43" cy="120" r="3" fill="none" stroke="#666" strokeWidth="1"/>
    <circle cx="77" cy="120" r="3" fill="none" stroke="#666" strokeWidth="1"/>
    <circle cx="83" cy="120" r="3" fill="none" stroke="#666" strokeWidth="1"/>
  </svg>
);

// Template Component Map
export const TEMPLATE_COMPONENTS = {
  fullBody1: FullBodyFront,
  fullBody2: FullBodyBack,
  fullBody3: FullBodySkeleton,
  head1: HeadFront,
  head2: HeadSide,
  head3: Skull,
  chest1: ChestFront,
  chest2: Heart,
  chest3: Lungs,
  abdomen1: AbdomenFront,
  abdomen2: DigestiveSystem,
  abdomen3: Liver,
  limbs1: LimbsFull,
  limbs2: ArmBones,
  limbs3: LegMuscles,
};