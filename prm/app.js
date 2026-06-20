/* ═══════════════════════════════════════════════════════════
   Mercedes-Benz Canada — CRM/PRM Platform
   app.js · Complete Application Logic
   © 2026 Mercedes-Benz Canada
═══════════════════════════════════════════════════════════ */

'use strict';

/* ──────────────────────────────────────────────────────────
   DEMO ACCOUNTS
────────────────────────────────────────────────────────── */
const DEMO_ACCOUNTS = {
  concesionario: {
    email: 'marc.tremblay@mbcanada.com',
    password: 'demo1234',
    name: 'Marc Tremblay',
    roleLabel: 'Dealer Staff — MB Montreal',
    roleDetail: 'Dealer Network',
    avatar: 'MT'
  },
  corporativo: {
    email: 'olivia.bennett@mbcanada.com',
    password: 'demo1234',
    name: 'Olivia Bennett',
    roleLabel: 'Corporate Executive',
    roleDetail: 'MB Canada Corporate',
    avatar: 'OB'
  }
};

/* ──────────────────────────────────────────────────────────
   STATE
────────────────────────────────────────────────────────── */
let currentRole    = null;
let currentPanel   = null;
let selectedRole   = null;
let activeCharts   = {};
let calendarState  = { year: 2026, month: 6, selected: null, selectedTime: null };
let notifPanelOpen = false;
let notifRead      = false;
let thermalConfigTarget = null;
const thermalConfigDefaults = {
  cabin: { activation: -10, target: 18, max: 5, min: -20 },
  battery: { activation: -15, target: -10, max: 35, min: -30 }
};

/* ──────────────────────────────────────────────────────────
   MOCK DATA
────────────────────────────────────────────────────────── */
const CLIENTS = [
  {
    id:'CLT001', name:'Sophia Laurent', email:'sophia.laurent@mbcanada.com',
    phone:'+1 (514) 892-3451', province:'Quebec', city:'Montreal', avatar:'SL',
    joinDate:'2022-03-15', nps:9, preferredDealer:'DLR-QC-01',
    vehicle:{
      vin:'WDB2022EQS001CA', licensePlate:'MBC-001', model:'EQS 580 4MATIC', trim:'Premium Plus', segment:'EQ', year:2024,
      tipo_vehiculo: 'electrico',
      color:'Obsidian Black Metallic', interiorColor:'Nappa Leather Black w/ Beige Stitching',
      mileage:18420, purchaseDate:'2024-01-10',
      specs:{
        displacement: 'N/A',
        horsepower: '516 HP',
        torque: '630 Nm',
        fuelType: 'Electric',
        fuelCapacity: 'N/A',
        batteryCapacity: '107.8 kWh',
        electricPower: '516 HP / 382 kW',
        officialRange: '453 km (CLTC)',
        transmission: 'Single-speed automatic',
        traction: 'AWD'
      },
      features:[
        'AIRMATIC air suspension with adaptive damping',
        'Autonomous Emergency Braking (AEB)',
        'Adaptive Cruise Control (ACC)',
        'Lane Keeping Assist',
        'Blind Spot Monitor',
        'MBUX Hyperscreen (56" curved display)',
        'Panoramic sunroof',
        'Premium sound system (Burmester)',
        'Wireless smartphone integration'
      ],
      usage: { monthly: 850, weekly_avg: 210 },
      nextService:'2026-07-15', lastService:'2025-12-10', health:94,
      warranty:{ type:'New Vehicle Limited Warranty', start:'2024-01-10', end:'2028-01-10', mileageLimit:80000 },
      battery:{ health:97, range:488, chargeLevel:82, cycles:124, coldEfficiency:0.88, estimatedRange:430 },
      components:{ 
        brakes: { life: 85, corrosion_risk: false, state:'4mm remaining', waterContent:0.15 },
        tires: { life: 72, current_set: 'summer', season_ready: false, treadDepth:6.2, pressureFront:225, pressureRear:225, unit:'psi' },
        suspension: { life: 90, corrosion_risk: false },
        hvac: { life: 95 },
        fluids: { life: 88 },
        electric_motor: { life: 98 },
        charging_system: { life: 100 },
        cabin_air_filter: { life: 85 }
      },
      preheating: {
        cabin: false,
        battery: false,
        timeNeeded: 8,
        cabinConfig: { activation: -10, target: 18, max: 5, min: -20 },
        batteryConfig: { activation: -15, target: -10, max: 35, min: -30 },
        cabinTemperature: -4,
        batteryTemperature: -18,
        lastUpdate: '2 min ago'
      },
      achievements:[ ]
    },
    contract:{ type:'Lease', start:'2024-01-10', end:'2027-01-10', duration:36,
      monthly:1285, residual:52000, annualKm:24000, status:'Active', renewalStatus:'Not Started' },
    services:[
      { id:'SVC001', date:'2025-12-10', type:'Annual Inspection', dealer:'Mercedes-Benz Montreal', status:'Completed', cost:385 },
      { id:'SVC002', date:'2025-06-15', type:'OTA Update & Tire Rotation', dealer:'Mercedes-Benz Montreal', status:'Completed', cost:120 },
      { id:'SVC003', date:'2024-11-08', type:'Brake Fluid Service', dealer:'Mercedes-Benz Laval', status:'Completed', cost:195 },
      { id:'SVC004', date:'2026-07-15', type:'Annual Inspection', dealer:'Mercedes-Benz Montreal', status:'Scheduled', cost:null }
    ],
    interactions:[
      { date:'2026-05-20', type:'Email', subject:'Lease renewal inquiry', status:'Resolved' },
      { date:'2026-04-10', type:'Call',  subject:'EQS charging optimization', status:'Resolved' },
      { date:'2026-02-28', type:'App',   subject:'Service appointment booking', status:'Resolved' }
    ]
  },
  {
    id:'CLT002', name:'Liam MacKenzie', email:'liam.mackenzie@mbcanada.com',
    phone:'+1 (416) 773-9210', province:'Ontario', city:'Toronto', avatar:'LM',
    joinDate:'2021-09-05', nps:10, preferredDealer:'DLR-ON-01',
    vehicle:{
      vin:'WDB2021AMG002CA', model:'AMG GT 63 S E Performance', segment:'AMG', year:2023,
      tipo_vehiculo: 'hibrido',
      color:'Selenite Grey Magno', mileage:31840,
      usage: { monthly: 1200, weekly_avg: 300 },
      nextService:'2026-08-20', lastService:'2026-01-18', health:91,
      warranty:{ type:'New Vehicle Limited Warranty', start:'2023-06-20', end:'2027-06-20', mileageLimit:80000 },
      battery:{ health: 95, range: 12, chargeLevel: 100, cycles: 300 },
      components:{ 
        brakes: { life: 68, corrosion_risk: true },
        tires: { life: 55, current_set: 'summer', season_ready: false },
        suspension: { life: 80, corrosion_risk: true },
        hvac: { life: 92 },
        fluids: { life: 85 },
        oil_level: { life: 70, state: 'Good' },
        oil_filter: { life: 65 },
        engine_air_filter: { life: 80 },
        combustion_engine: { life: 90 },
        electric_motor: { life: 95 },
        charging_system: { life: 98 },
        cabin_air_filter: { life: 75 }
      }
    },
    contract:{ type:'Finance', start:'2023-06-20', end:'2028-06-20', duration:60,
      monthly:2340, residual:null, annualKm:null, status:'Active', renewalStatus:'N/A' },
    services:[
      { id:'SVC010', date:'2026-01-18', type:'Performance Tune & Oil Change', dealer:'Mercedes-Benz Toronto Downtown', status:'Completed', cost:680 },
      { id:'SVC011', date:'2025-08-05', type:'Brake Pad Replacement', dealer:'Mercedes-Benz Toronto Downtown', status:'Completed', cost:1240 },
      { id:'SVC012', date:'2025-02-14', type:'Annual Inspection', dealer:'Mercedes-Benz Markham', status:'Completed', cost:385 },
      { id:'SVC013', date:'2026-08-20', type:'Mid-Year Service', dealer:'Mercedes-Benz Toronto Downtown', status:'Scheduled', cost:null },
      { id:'SVC014', date:'2024-11-12', type:'Transmission Fluid Service', dealer:'Mercedes-Benz Etobicoke', status:'Completed', cost:420 },
      { id:'SVC015', date:'2024-05-20', type:'Suspension Alignment', dealer:'Mercedes-Benz Toronto Downtown', status:'Completed', cost:280 }
    ],
    interactions:[
      { date:'2026-05-30', type:'Call',  subject:'AMG Track Day registration', status:'Resolved' },
      { date:'2026-03-15', type:'Email', subject:'Extended warranty inquiry',  status:'Resolved' },
      { date:'2026-02-18', type:'App',   subject:'Track day confirmation', status:'Resolved' },
      { date:'2026-01-25', type:'Call',  subject:'Performance upgrade inquiry', status:'Resolved' }
    ]
  },
  {
    id:'CLT003', name:'Olivia Chen', email:'olivia.chen@mbcanada.com',
    phone:'+1 (604) 512-8843', province:'British Columbia', city:'Vancouver', avatar:'OC',
    joinDate:'2023-02-28', nps:8, preferredDealer:'DLR-BC-01',
    vehicle:{
      vin:'WDB2022SUV003CA', model:'GLE 450 4MATIC', segment:'SUV', year:2023,
      tipo_vehiculo: 'combustion',
      color:'Polar White', mileage:44120,
      usage: { monthly: 1500, weekly_avg: 375 },
      nextService:'2026-06-30', lastService:'2025-10-22', health:78,
      warranty:{ type:'New Vehicle Limited Warranty', start:'2023-03-05', end:'2026-03-05', mileageLimit:80000 },
      battery:null,
      components:{ 
        brakes: { life: 71, corrosion_risk: false },
        tires: { life: 48, current_set: 'summer', season_ready: false },
        suspension: { life: 74, corrosion_risk: false },
        hvac: { life: 88 },
        fluids: { life: 79 },
        oil_level: { life: 50, state: 'Attention' },
        oil_filter: { life: 45 },
        engine_air_filter: { life: 60 },
        combustion_engine: { life: 85 }
      }
    },
    contract:{ type:'Lease', start:'2023-03-05', end:'2026-03-05', duration:36,
      monthly:1050, residual:38500, annualKm:20000, status:'Expiring Soon', renewalStatus:'In Progress' },
    services:[
      { id:'SVC020', date:'2025-10-22', type:'Oil Change & Inspection', dealer:'Mercedes-Benz Vancouver', status:'Completed', cost:340 },
      { id:'SVC021', date:'2025-04-10', type:'Tire Replacement (Winter→Summer)', dealer:'Mercedes-Benz Richmond', status:'Completed', cost:890 },
      { id:'SVC022', date:'2024-09-15', type:'Transmission Service', dealer:'Mercedes-Benz Vancouver', status:'Completed', cost:560 },
      { id:'SVC023', date:'2026-06-30', type:'Pre-Lease End Inspection', dealer:'Mercedes-Benz Vancouver', status:'Scheduled', cost:null },
      { id:'SVC024', date:'2024-12-05', type:'Brake Fluid & Filter Service', dealer:'Mercedes-Benz Burnaby', status:'Completed', cost:245 },
      { id:'SVC025', date:'2024-06-18', type:'Suspension & Alignment Check', dealer:'Mercedes-Benz Vancouver', status:'Completed', cost:185 }
    ],
    interactions:[
      { date:'2026-06-01', type:'Email', subject:'Lease-end process — GLE', status:'Open' },
      { date:'2026-05-15', type:'Call',  subject:'GLE 53 AMG availability',   status:'Resolved' },
      { date:'2026-04-22', type:'Visit', subject:'In-dealership consultation', status:'Resolved' },
      { date:'2026-03-10', type:'Email', subject:'Renewal financing options', status:'Resolved' },
      { date:'2026-02-01', type:'App',   subject:'Service appointment booking', status:'Resolved' }
    ]
  },
  {
    id:'CLT004', name:'Noah Tremblay', email:'noah.tremblay@mbcanada.com',
    phone:'+1 (418) 334-9002', province:'Quebec', city:'Quebec City', avatar:'NT',
    joinDate:'2022-07-12', nps:7, preferredDealer:'DLR-QC-02',
    vehicle:{
      vin:'WDB2021SDN004CA', model:'C 300 4MATIC', segment:'Sedan', year:2022,
      tipo_vehiculo: 'combustion',
      color:'Iridium Silver Metallic', mileage:67350,
      usage: { monthly: 2100, weekly_avg: 525 },
      nextService:'2026-07-01', lastService:'2025-11-30', health:72,
      warranty:{ type:'New Vehicle Limited Warranty', start:'2022-08-01', end:'2026-08-01', mileageLimit:80000 },
      battery:null,
      components:{ 
        brakes: { life: 60, corrosion_risk: true },
        tires: { life: 35, current_set: 'winter', season_ready: false },
        suspension: { life: 68, corrosion_risk: true },
        hvac: { life: 80 },
        fluids: { life: 65 },
        oil_level: { life: 80, state: 'Good' },
        oil_filter: { life: 75 },
        engine_air_filter: { life: 50 },
        combustion_engine: { life: 78 }
      }
    },
    contract:{ type:'Lease', start:'2022-08-01', end:'2026-08-01', duration:48,
      monthly:790, residual:22000, annualKm:20000, status:'Expiring Soon', renewalStatus:'In Progress' },
    services:[
      { id:'SVC030', date:'2025-11-30', type:'Oil & Filter Change', dealer:'Mercedes-Benz Quebec City', status:'Completed', cost:280 },
      { id:'SVC031', date:'2025-05-18', type:'Brake Inspection & Rotor Service', dealer:'Mercedes-Benz Quebec City', status:'Completed', cost:870 },
      { id:'SVC032', date:'2024-10-10', type:'Annual Inspection', dealer:'Mercedes-Benz Sainte-Foy', status:'Completed', cost:385 },
      { id:'SVC033', date:'2024-07-22', type:'Tire Rotation & Balance', dealer:'Mercedes-Benz Quebec City', status:'Completed', cost:165 },
      { id:'SVC034', date:'2024-03-15', type:'Battery Test & Charging System', dealer:'Mercedes-Benz Gatineau', status:'Completed', cost:95 }
    ],
    interactions:[
      { date:'2026-05-28', type:'Call',  subject:'Lease renewal — C 300', status:'Open' },
      { date:'2026-04-30', type:'Email', subject:'Service reminder',        status:'Resolved' },
      { date:'2026-03-20', type:'Call',  subject:'End-of-lease inspection', status:'Resolved' },
      { date:'2026-02-14', type:'Email', subject:'Renewal incentive inquiry', status:'Resolved' }
    ]
  },
  {
    id:'CLT005', name:'Emma Wilson', email:'emma.wilson@mbcanada.com',
    phone:'+1 (403) 621-7734', province:'Alberta', city:'Calgary', avatar:'EW',
    joinDate:'2023-11-20', nps:9, preferredDealer:'DLR-AB-01',
    vehicle:{
      vin:'WDB2023EQS005CA', model:'EQS 450+', segment:'EQ', year:2024,
      tipo_vehiculo: 'electrico',
      color:'High-Tech Silver Metallic', mileage:12800,
      usage: { monthly: 950, weekly_avg: 230 },
      nextService:'2026-09-01', lastService:'2025-12-15', health:96,
      warranty:{ type:'New Vehicle Limited Warranty', start:'2023-12-01', end:'2027-12-01', mileageLimit:80000 },
      battery:{ health:99, range:654, chargeLevel:91, cycles:62 },
      components:{ 
        brakes: { life: 92, corrosion_risk: false },
        tires: { life: 88, current_set: 'summer', season_ready: false },
        suspension: { life: 96, corrosion_risk: false },
        hvac: { life: 97 },
        fluids: { life: 95 },
        electric_motor: { life: 99 },
        charging_system: { life: 99 },
        cabin_air_filter: { life: 94 }
      }
    },
    contract:{ type:'Lease', start:'2023-12-01', end:'2026-12-01', duration:36,
      monthly:1420, residual:65000, annualKm:20000, status:'Active', renewalStatus:'Not Started' },
    services:[
      { id:'SVC040', date:'2025-12-15', type:'Annual EV Inspection', dealer:'Mercedes-Benz Calgary', status:'Completed', cost:320 },
      { id:'SVC041', date:'2025-06-20', type:'OTA Software Update',   dealer:'Mercedes-Benz Calgary', status:'Completed', cost:0 },
      { id:'SVC042', date:'2026-09-01', type:'Annual Inspection',      dealer:'Mercedes-Benz Calgary', status:'Scheduled', cost:null },
      { id:'SVC043', date:'2025-03-10', type:'Battery Health Diagnostic', dealer:'Mercedes-Benz Edmonton', status:'Completed', cost:150 },
      { id:'SVC044', date:'2024-11-25', type:'Cabin Air Filter Replacement', dealer:'Mercedes-Benz Calgary', status:'Completed', cost:85 }
    ],
    interactions:[
      { date:'2026-05-10', type:'App',   subject:'Charging network inquiry', status:'Resolved' },
      { date:'2026-03-01', type:'Email', subject:'EV incentive update',       status:'Resolved' },
      { date:'2026-02-15', type:'Call',  subject:'Range optimization tips', status:'Resolved' },
      { date:'2026-01-20', type:'App',   subject:'OTA update notification', status:'Resolved' }
    ]
  },
  {
    id:'CLT006', name:'James Kowalski', email:'james.kowalski@mbcanada.com',
    phone:'+1 (613) 481-2200', province:'Ontario', city:'Ottawa', avatar:'JK',
    joinDate:'2020-05-18', nps:8, preferredDealer:'DLR-ON-02',
    vehicle:{
      vin:'WDB2020SUV006CA', model:'GLS 580 4MATIC', segment:'SUV', year:2021,
      tipo_vehiculo: 'combustion',
      color:'Graphite Grey Metallic', mileage:89200,
      usage: { monthly: 1600, weekly_avg: 400 },
      nextService:'2026-07-10', lastService:'2026-01-05', health:68,
      warranty:{ type:'MB Extended (MB-Preferred)', start:'2024-05-18', end:'2027-05-18', mileageLimit:120000 },
      battery:null,
      components:{ 
        brakes: { life: 58, corrosion_risk: true },
        tires: { life: 42, current_set: 'summer', season_ready: false },
        suspension: { life: 62, corrosion_risk: true },
        hvac: { life: 75 },
        fluids: { life: 60 },
        oil_level: { life: 40, state: 'Attention' },
        oil_filter: { life: 30 },
        engine_air_filter: { life: 55 },
        combustion_engine: { life: 70 }
      }
    },
    contract:{ type:'Finance', start:'2021-05-18', end:'2027-05-18', duration:72,
      monthly:1680, residual:null, annualKm:null, status:'Active', renewalStatus:'N/A' },
    services:[
      { id:'SVC050', date:'2026-01-05', type:'Major Service (90K)', dealer:'Mercedes-Benz Ottawa', status:'Completed', cost:1240 },
      { id:'SVC051', date:'2025-07-12', type:'Oil Change & Tire Rotation', dealer:'Mercedes-Benz Ottawa', status:'Completed', cost:340 },
      { id:'SVC052', date:'2024-12-20', type:'Brake & Suspension Inspection', dealer:'Mercedes-Benz Kanata', status:'Completed', cost:520 },
      { id:'SVC053', date:'2024-08-30', type:'Air Suspension Service', dealer:'Mercedes-Benz Ottawa', status:'Completed', cost:695 },
      { id:'SVC054', date:'2024-04-18', type:'Transmission Fluid Service', dealer:'Mercedes-Benz Kanata', status:'Completed', cost:380 }
    ],
    interactions:[
      { date:'2026-04-15', type:'Call',  subject:'Service inquiry — GLS', status:'Resolved' },
      { date:'2026-01-08', type:'Visit', subject:'Post-service follow-up',  status:'Resolved' },
      { date:'2025-12-22', type:'Email', subject:'Extended warranty upgrade', status:'Resolved' },
      { date:'2025-11-10', type:'Call',  subject:'Off-road capability inquiry', status:'Resolved' }
    ]
  },
  {
    id:'CLT007', name:'Ava Dubois', email:'ava.dubois@mbcanada.com',
    phone:'+1 (514) 302-7781', province:'Quebec', city:'Montreal', avatar:'AD',
    joinDate:'2024-04-08', nps:8, preferredDealer:'DLR-QC-01',
    vehicle:{
      vin:'WDB2023SDN007CA', model:'A 250 4MATIC', segment:'Sedan', year:2024,
      tipo_vehiculo: 'combustion',
      color:'Brilliant Blue Metallic', mileage:8910,
      usage: { monthly: 750, weekly_avg: 180 },
      nextService:'2026-10-08', lastService:'2025-10-08', health:98,
      warranty:{ type:'New Vehicle Limited Warranty', start:'2024-04-10', end:'2028-04-10', mileageLimit:80000 },
      battery:null,
      components:{ 
        brakes: { life: 96, corrosion_risk: false },
        tires: { life: 91, current_set: 'summer', season_ready: false },
        suspension: { life: 97, corrosion_risk: false },
        hvac: { life: 98 },
        fluids: { life: 95 },
        oil_level: { life: 95, state: 'Good' },
        oil_filter: { life: 94 },
        engine_air_filter: { life: 98 },
        combustion_engine: { life: 99 }
      }
    },
    contract:{ type:'Lease', start:'2024-04-10', end:'2027-04-10', duration:36,
      monthly:695, residual:18500, annualKm:20000, status:'Active', renewalStatus:'Not Started' },
    services:[
      { id:'SVC060', date:'2025-10-08', type:'Annual Inspection', dealer:'Mercedes-Benz Montreal', status:'Completed', cost:385 },
      { id:'SVC061', date:'2026-10-08', type:'Annual Inspection', dealer:'Mercedes-Benz Montreal', status:'Scheduled', cost:null },
      { id:'SVC062', date:'2025-05-15', type:'Oil & Filter Change', dealer:'Mercedes-Benz Montreal', status:'Completed', cost:245 },
      { id:'SVC063', date:'2024-11-28', type:'Tire Balance & Rotation', dealer:'Mercedes-Benz Saint-Laurent', status:'Completed', cost:180 }
    ],
    interactions:[
      { date:'2026-05-22', type:'Email', subject:'MB me connect setup', status:'Resolved' },
      { date:'2026-04-18', type:'App',   subject:'Service appointment booking', status:'Resolved' },
      { date:'2026-03-05', type:'Email', subject:'Premium detailing offer', status:'Resolved' }
    ]
  },
  {
    id:'CLT008', name:'Ethan Park', email:'ethan.park@mbcanada.com',
    phone:'+1 (416) 889-5566', province:'Ontario', city:'Toronto', avatar:'EP',
    joinDate:'2022-11-30', nps:9, preferredDealer:'DLR-ON-01',
    vehicle:{
      vin:'WDB2022AMG008CA', model:'AMG C 63 S E Performance', segment:'AMG', year:2023,
      tipo_vehiculo: 'hibrido',
      color:'Patagonia Red Metallic', mileage:29500,
      usage: { monthly: 1100, weekly_avg: 275 },
      nextService:'2026-08-15', lastService:'2026-02-10', health:88,
      warranty:{ type:'New Vehicle Limited Warranty', start:'2022-12-05', end:'2026-12-05', mileageLimit:80000 },
      battery: { health: 90, range: 10, chargeLevel: 80, cycles: 450 },
      components:{ 
        brakes: { life: 72, corrosion_risk: false },
        tires: { life: 61, current_set: 'summer', season_ready: false },
        suspension: { life: 82, corrosion_risk: false },
        hvac: { life: 90 },
        fluids: { life: 88 },
        oil_level: { life: 85, state: 'Good' },
        oil_filter: { life: 80 },
        engine_air_filter: { life: 88 },
        combustion_engine: { life: 92 },
        electric_motor: { life: 96 },
        charging_system: { life: 97 },
        cabin_air_filter: { life: 85 }
      }
    },
    contract:{ type:'Finance', start:'2022-12-05', end:'2026-12-05', duration:48,
      monthly:1890, residual:null, annualKm:null, status:'Active', renewalStatus:'N/A' },
    services:[
      { id:'SVC070', date:'2026-02-10', type:'AMG Performance Service', dealer:'Mercedes-Benz Toronto Downtown', status:'Completed', cost:850 },
      { id:'SVC071', date:'2025-09-22', type:'Oil Change & Brake Inspection', dealer:'Mercedes-Benz Etobicoke', status:'Completed', cost:540 },
      { id:'SVC072', date:'2025-01-08', type:'Annual Inspection', dealer:'Mercedes-Benz Toronto Downtown', status:'Completed', cost:385 },
      { id:'SVC073', date:'2024-10-15', type:'Carbon Cleaning Service', dealer:'Mercedes-Benz Toronto Downtown', status:'Completed', cost:720 },
      { id:'SVC074', date:'2024-06-20', type:'Performance Suspension Upgrade', dealer:'Mercedes-Benz Etobicoke', status:'Completed', cost:1850 }
    ],
    interactions:[
      { date:'2026-06-02', type:'Call',  subject:'AMG Track Day — Mosport', status:'Open' },
      { date:'2026-04-18', type:'Email', subject:'Warranty extension inquiry', status:'Resolved' },
      { date:'2026-03-30', type:'Call',  subject:'Performance tune consultation', status:'Resolved' },
      { date:'2026-02-14', type:'App',   subject:'AMG exclusive event invitation', status:'Resolved' }
    ]
  }
];

/* 55 Dealers — province distribution: ON:18, QC:12, BC:8, AB:7, MB:3, SK:2, NS:2, NB:1, NL:1, PE:1 */
const DEALERS = [
  // Ontario (18)
  { id:'DLR-ON-01', name:'Mercedes-Benz Toronto Downtown', city:'Toronto',   prov:'ON', staff:14, clients:310, nps:8.7, sync:'Real-time', renewals:22, services:142, target:150, respTime:'2.1h', lat:43.65, lon:-79.38 },
  { id:'DLR-ON-02', name:'Mercedes-Benz Ottawa',            city:'Ottawa',    prov:'ON', staff:9,  clients:198, nps:8.2, sync:'Real-time', renewals:15, services:98,  target:110, respTime:'2.8h', lat:45.42, lon:-75.69 },
  { id:'DLR-ON-03', name:'Mercedes-Benz Markham',           city:'Markham',   prov:'ON', staff:8,  clients:175, nps:8.5, sync:'Real-time', renewals:12, services:88,  target:95,  respTime:'2.4h', lat:43.85, lon:-79.27 },
  { id:'DLR-ON-04', name:'Mercedes-Benz Mississauga',       city:'Mississauga',prov:'ON',staff:10, clients:220, nps:8.9, sync:'Real-time', renewals:18, services:115, target:120, respTime:'1.9h', lat:43.59, lon:-79.65 },
  { id:'DLR-ON-05', name:'Mercedes-Benz North York',        city:'North York', prov:'ON', staff:9,  clients:190, nps:7.8, sync:'Pending',   renewals:14, services:82,  target:100, respTime:'3.5h', lat:43.77, lon:-79.41 },
  { id:'DLR-ON-06', name:'Mercedes-Benz Etobicoke',         city:'Etobicoke', prov:'ON', staff:7,  clients:155, nps:8.1, sync:'Real-time', renewals:11, services:74,  target:80,  respTime:'2.6h', lat:43.65, lon:-79.52 },
  { id:'DLR-ON-07', name:'Mercedes-Benz Oakville',          city:'Oakville',  prov:'ON', staff:8,  clients:168, nps:8.8, sync:'Real-time', renewals:13, services:91,  target:95,  respTime:'2.2h', lat:43.47, lon:-79.69 },
  { id:'DLR-ON-08', name:'Mercedes-Benz Burlington',        city:'Burlington', prov:'ON', staff:6,  clients:132, nps:8.3, sync:'Real-time', renewals:9,  services:66,  target:70,  respTime:'2.7h', lat:43.33, lon:-79.80 },
  { id:'DLR-ON-09', name:'Mercedes-Benz Hamilton',          city:'Hamilton',  prov:'ON', staff:6,  clients:128, nps:7.6, sync:'Pending',   renewals:8,  services:59,  target:75,  respTime:'3.9h', lat:43.25, lon:-79.87 },
  { id:'DLR-ON-10', name:'Mercedes-Benz London',            city:'London',    prov:'ON', staff:7,  clients:148, nps:8.0, sync:'Real-time', renewals:10, services:72,  target:80,  respTime:'2.9h', lat:42.98, lon:-81.23 },
  { id:'DLR-ON-11', name:'Mercedes-Benz Kitchener-Waterloo',city:'Kitchener', prov:'ON', staff:6,  clients:130, nps:7.9, sync:'Real-time', renewals:9,  services:61,  target:70,  respTime:'3.1h', lat:43.45, lon:-80.49 },
  { id:'DLR-ON-12', name:'Mercedes-Benz Windsor',           city:'Windsor',   prov:'ON', staff:5,  clients:98,  nps:7.5, sync:'Pending',   renewals:6,  services:44,  target:55,  respTime:'4.2h', lat:42.31, lon:-83.04 },
  { id:'DLR-ON-13', name:'Mercedes-Benz St. Catharines',    city:'St. Catharines',prov:'ON',staff:5,clients:102,nps:8.0, sync:'Real-time', renewals:7,  services:48,  target:55,  respTime:'2.8h', lat:43.16, lon:-79.25 },
  { id:'DLR-ON-14', name:'Mercedes-Benz Thornhill',         city:'Thornhill', prov:'ON', staff:7,  clients:160, nps:8.6, sync:'Real-time', renewals:12, services:80,  target:85,  respTime:'2.3h', lat:43.81, lon:-79.43 },
  { id:'DLR-ON-15', name:'Mercedes-Benz Kanata',            city:'Kanata',    prov:'ON', staff:5,  clients:110, nps:7.7, sync:'Real-time', renewals:7,  services:52,  target:60,  respTime:'3.0h', lat:45.35, lon:-75.91 },
  { id:'DLR-ON-16', name:'Mercedes-Benz Kingston',          city:'Kingston',  prov:'ON', staff:4,  clients:88,  nps:7.4, sync:'Pending',   renewals:5,  services:40,  target:50,  respTime:'4.5h', lat:44.23, lon:-76.49 },
  { id:'DLR-ON-17', name:'Mercedes-Benz Barrie',            city:'Barrie',    prov:'ON', staff:4,  clients:92,  nps:7.8, sync:'Real-time', renewals:6,  services:43,  target:50,  respTime:'3.2h', lat:44.39, lon:-79.70 },
  { id:'DLR-ON-18', name:'Mercedes-Benz Sudbury',           city:'Sudbury',   prov:'ON', staff:3,  clients:62,  nps:7.2, sync:'Pending',   renewals:3,  services:28,  target:35,  respTime:'5.1h', lat:46.49, lon:-80.99 },
  // Quebec (12)
  { id:'DLR-QC-01', name:'Mercedes-Benz Montreal',          city:'Montreal',  prov:'QC', staff:15, clients:340, nps:8.4, sync:'Real-time', renewals:25, services:158, target:165, respTime:'2.0h', lat:45.50, lon:-73.57 },
  { id:'DLR-QC-02', name:'Mercedes-Benz Quebec City',       city:'Quebec City',prov:'QC',staff:9,  clients:195, nps:7.9, sync:'Real-time', renewals:14, services:92,  target:100, respTime:'2.6h', lat:46.80, lon:-71.22 },
  { id:'DLR-QC-03', name:'Mercedes-Benz Laval',             city:'Laval',     prov:'QC', staff:8,  clients:178, nps:8.2, sync:'Real-time', renewals:13, services:85,  target:90,  respTime:'2.3h', lat:45.57, lon:-73.69 },
  { id:'DLR-QC-04', name:'Mercedes-Benz Brossard',          city:'Brossard',  prov:'QC', staff:7,  clients:155, nps:8.0, sync:'Pending',   renewals:11, services:72,  target:80,  respTime:'2.9h', lat:45.46, lon:-73.47 },
  { id:'DLR-QC-05', name:'Mercedes-Benz Sherbrooke',        city:'Sherbrooke',prov:'QC', staff:5,  clients:112, nps:7.6, sync:'Real-time', renewals:8,  services:52,  target:60,  respTime:'3.2h', lat:45.40, lon:-71.89 },
  { id:'DLR-QC-06', name:'Mercedes-Benz Gatineau',          city:'Gatineau',  prov:'QC', staff:5,  clients:108, nps:7.8, sync:'Real-time', renewals:7,  services:50,  target:58,  respTime:'3.0h', lat:45.47, lon:-75.70 },
  { id:'DLR-QC-07', name:'Mercedes-Benz Longueuil',         city:'Longueuil', prov:'QC', staff:6,  clients:132, nps:8.1, sync:'Real-time', renewals:10, services:63,  target:70,  respTime:'2.5h', lat:45.53, lon:-73.52 },
  { id:'DLR-QC-08', name:'Mercedes-Benz Sainte-Foy',        city:'Quebec City',prov:'QC',staff:5,  clients:105, nps:7.5, sync:'Pending',   renewals:7,  services:48,  target:55,  respTime:'3.4h', lat:46.76, lon:-71.33 },
  { id:'DLR-QC-09', name:'Mercedes-Benz Trois-Rivières',    city:'Trois-Rivières',prov:'QC',staff:4,clients:89, nps:7.3, sync:'Pending',   renewals:5,  services:40,  target:48,  respTime:'4.0h', lat:46.34, lon:-72.55 },
  { id:'DLR-QC-10', name:'Mercedes-Benz Saint-Laurent',     city:'Montreal',  prov:'QC', staff:6,  clients:128, nps:8.3, sync:'Real-time', renewals:9,  services:60,  target:65,  respTime:'2.2h', lat:45.51, lon:-73.68 },
  { id:'DLR-QC-11', name:'Mercedes-Benz Anjou',             city:'Montreal',  prov:'QC', staff:5,  clients:110, nps:7.9, sync:'Real-time', renewals:8,  services:52,  target:58,  respTime:'2.7h', lat:45.58, lon:-73.56 },
  { id:'DLR-QC-12', name:'Mercedes-Benz Saguenay',          city:'Saguenay',  prov:'QC', staff:3,  clients:68,  nps:7.0, sync:'Pending',   renewals:3,  services:28,  target:35,  respTime:'5.3h', lat:48.43, lon:-71.07 },
  // British Columbia (8)
  { id:'DLR-BC-01', name:'Mercedes-Benz Vancouver',         city:'Vancouver', prov:'BC', staff:13, clients:295, nps:8.9, sync:'Real-time', renewals:20, services:138, target:145, respTime:'1.8h', lat:49.28, lon:-123.12 },
  { id:'DLR-BC-02', name:'Mercedes-Benz Richmond',          city:'Richmond',  prov:'BC', staff:8,  clients:172, nps:8.6, sync:'Real-time', renewals:13, services:82,  target:88,  respTime:'2.1h', lat:49.17, lon:-123.14 },
  { id:'DLR-BC-03', name:'Mercedes-Benz North Vancouver',   city:'North Vancouver',prov:'BC',staff:7,clients:152,nps:8.4, sync:'Real-time', renewals:11, services:72,  target:78,  respTime:'2.4h', lat:49.32, lon:-123.07 },
  { id:'DLR-BC-04', name:'Mercedes-Benz Surrey',            city:'Surrey',    prov:'BC', staff:7,  clients:148, nps:8.1, sync:'Pending',   renewals:10, services:68,  target:75,  respTime:'2.9h', lat:49.11, lon:-122.85 },
  { id:'DLR-BC-05', name:'Mercedes-Benz Burnaby',           city:'Burnaby',   prov:'BC', staff:6,  clients:130, nps:8.5, sync:'Real-time', renewals:9,  services:62,  target:68,  respTime:'2.2h', lat:49.25, lon:-122.98 },
  { id:'DLR-BC-06', name:'Mercedes-Benz Victoria',          city:'Victoria',  prov:'BC', staff:7,  clients:145, nps:8.7, sync:'Real-time', renewals:10, services:68,  target:72,  respTime:'2.0h', lat:48.43, lon:-123.37 },
  { id:'DLR-BC-07', name:'Mercedes-Benz Kelowna',           city:'Kelowna',   prov:'BC', staff:5,  clients:102, nps:8.0, sync:'Real-time', renewals:7,  services:48,  target:52,  respTime:'2.6h', lat:49.89, lon:-119.49 },
  { id:'DLR-BC-08', name:'Mercedes-Benz Abbotsford',        city:'Abbotsford',prov:'BC', staff:4,  clients:88,  nps:7.7, sync:'Pending',   renewals:5,  services:40,  target:45,  respTime:'3.3h', lat:49.05, lon:-122.30 },
  // Alberta (7)
  { id:'DLR-AB-01', name:'Mercedes-Benz Calgary',           city:'Calgary',   prov:'AB', staff:11, clients:248, nps:8.5, sync:'Real-time', renewals:18, services:118, target:125, respTime:'2.0h', lat:51.04, lon:-114.07 },
  { id:'DLR-AB-02', name:'Mercedes-Benz Edmonton',          city:'Edmonton',  prov:'AB', staff:10, clients:218, nps:8.3, sync:'Real-time', renewals:15, services:104, target:110, respTime:'2.2h', lat:53.55, lon:-113.47 },
  { id:'DLR-AB-03', name:'Mercedes-Benz Calgary North',     city:'Calgary',   prov:'AB', staff:7,  clients:155, nps:8.0, sync:'Pending',   renewals:11, services:72,  target:80,  respTime:'2.8h', lat:51.16, lon:-114.02 },
  { id:'DLR-AB-04', name:'Mercedes-Benz Edmonton West',     city:'Edmonton',  prov:'AB', staff:6,  clients:132, nps:7.9, sync:'Real-time', renewals:9,  services:62,  target:68,  respTime:'2.5h', lat:53.52, lon:-113.62 },
  { id:'DLR-AB-05', name:'Mercedes-Benz Red Deer',          city:'Red Deer',  prov:'AB', staff:4,  clients:88,  nps:7.5, sync:'Real-time', renewals:5,  services:40,  target:45,  respTime:'3.2h', lat:52.27, lon:-113.81 },
  { id:'DLR-AB-06', name:'Mercedes-Benz Lethbridge',        city:'Lethbridge',prov:'AB', staff:3,  clients:72,  nps:7.3, sync:'Pending',   renewals:4,  services:32,  target:40,  respTime:'4.1h', lat:49.69, lon:-112.83 },
  { id:'DLR-AB-07', name:'Mercedes-Benz Grande Prairie',    city:'Grande Prairie',prov:'AB',staff:3,clients:58, nps:7.0, sync:'Pending',   renewals:3,  services:25,  target:30,  respTime:'5.0h', lat:55.17, lon:-118.79 },
  // Manitoba (3)
  { id:'DLR-MB-01', name:'Mercedes-Benz Winnipeg',          city:'Winnipeg',  prov:'MB', staff:8,  clients:172, nps:7.9, sync:'Real-time', renewals:12, services:80,  target:88,  respTime:'2.5h', lat:49.90, lon:-97.13 },
  { id:'DLR-MB-02', name:'Mercedes-Benz St. James',         city:'Winnipeg',  prov:'MB', staff:5,  clients:108, nps:7.6, sync:'Real-time', renewals:7,  services:50,  target:56,  respTime:'2.9h', lat:49.88, lon:-97.22 },
  { id:'DLR-MB-03', name:'Mercedes-Benz Brandon',           city:'Brandon',   prov:'MB', staff:3,  clients:58,  nps:7.1, sync:'Pending',   renewals:3,  services:25,  target:32,  respTime:'4.8h', lat:49.84, lon:-99.95 },
  // Saskatchewan (2)
  { id:'DLR-SK-01', name:'Mercedes-Benz Saskatoon',         city:'Saskatoon', prov:'SK', staff:5,  clients:108, nps:7.5, sync:'Real-time', renewals:7,  services:50,  target:56,  respTime:'3.0h', lat:52.13, lon:-106.67 },
  { id:'DLR-SK-02', name:'Mercedes-Benz Regina',            city:'Regina',    prov:'SK', staff:4,  clients:88,  nps:7.4, sync:'Pending',   renewals:5,  services:40,  target:48,  respTime:'3.8h', lat:50.45, lon:-104.62 },
  // Nova Scotia (2)
  { id:'DLR-NS-01', name:'Mercedes-Benz Halifax',           city:'Halifax',   prov:'NS', staff:6,  clients:128, nps:8.0, sync:'Real-time', renewals:9,  services:60,  target:65,  respTime:'2.4h', lat:44.65, lon:-63.60 },
  { id:'DLR-NS-02', name:'Mercedes-Benz Dartmouth',         city:'Dartmouth', prov:'NS', staff:4,  clients:85,  nps:7.7, sync:'Pending',   renewals:5,  services:38,  target:45,  respTime:'3.5h', lat:44.67, lon:-63.57 },
  // New Brunswick (1)
  { id:'DLR-NB-01', name:'Mercedes-Benz Moncton',           city:'Moncton',   prov:'NB', staff:4,  clients:88,  nps:7.4, sync:'Real-time', renewals:5,  services:40,  target:48,  respTime:'3.2h', lat:46.09, lon:-64.80 },
  // Newfoundland (1)
  { id:'DLR-NL-01', name:'Mercedes-Benz St. John\'s',       city:"St. John's",prov:'NL', staff:4,  clients:78,  nps:7.2, sync:'Pending',   renewals:4,  services:34,  target:42,  respTime:'4.0h', lat:47.56, lon:-52.71 },
  // Prince Edward Island (1)
  { id:'DLR-PE-01', name:'Mercedes-Benz Charlottetown',     city:'Charlottetown',prov:'PE',staff:2, clients:42,  nps:7.8, sync:'Real-time', renewals:2,  services:18,  target:22,  respTime:'2.8h', lat:46.24, lon:-63.13 }
];

const KPI = {
  totalClients: 4820,
  dealersConnected: 55,
  renewalsPending: 312,
  servicesPending: 184,
  newClientsMonth: 142,
  profileCompleteness: { current:62, target:90 },
  leasingRetention: { current:58, target:70 },
  npsNational: 8.1,
  appAdoption: { current:38, target:60 },
  officialServiceRate: { current:74, target:85 },
  fleetMaintenance: {
    criticalFleetPct: 8.4,
    winterTireCompliance: 62,
    estRepairCostsCAD: 1245000
  },
  monthlyTrend: [
    { month:'Jan', clients:98,  services:210, nps:7.9 },
    { month:'Feb', clients:112, services:228, nps:8.0 },
    { month:'Mar', clients:128, services:245, nps:8.1 },
    { month:'Apr', clients:119, services:238, nps:8.0 },
    { month:'May', clients:135, services:262, nps:8.2 },
    { month:'Jun', clients:142, services:271, nps:8.1 }
  ],
  byProvince: [
    { prov:'ON', clients:1854, pct:38.5 },
    { prov:'QC', clients:1220, pct:25.3 },
    { prov:'BC', clients:820,  pct:17.0 },
    { prov:'AB', clients:580,  pct:12.0 },
    { prov:'MB', clients:192,  pct:4.0  },
    { prov:'SK', clients:82,   pct:1.7  },
    { prov:'Other', clients:72, pct:1.5 }
  ],
  bySegment: [
    { seg:'SUV',   clients:1880, pct:39.0, nps:8.2, renewalRate:64, appUse:40 },
    { seg:'Sedan', clients:1445, pct:30.0, nps:7.9, renewalRate:55, appUse:36 },
    { seg:'EQ',    clients:820,  pct:17.0, nps:8.8, renewalRate:72, appUse:58 },
    { seg:'AMG',   clients:675,  pct:14.0, nps:9.1, renewalRate:68, appUse:52 }
  ]
};

const WEATHER_BY_PROVINCE = {
  'Quebec': { temp: -11, condition: 'Light snow', risk: 'Road ice on bridges and exposed routes', severity: 'warning' },
  'Ontario': { temp: -7, condition: 'Freezing drizzle', risk: 'Black ice during morning departures', severity: 'warning' },
  'British Columbia': { temp: 4, condition: 'Coastal rain', risk: 'Wet braking surfaces and mountain snow above elevation', severity: 'info' },
  'Alberta': { temp: -18, condition: 'Dry cold', risk: 'Reduced EV range and cold-soak battery behavior', severity: 'danger' },
  'Manitoba': { temp: -21, condition: 'Blowing snow', risk: 'Whiteout pockets and deep cold starts', severity: 'danger' },
  'Saskatchewan': { temp: -19, condition: 'Wind chill advisory', risk: 'Ice risk and battery performance loss', severity: 'danger' },
  'New Brunswick': { temp: -6, condition: 'Snow showers', risk: 'Slush refreeze after sunset', severity: 'warning' },
  'Nova Scotia': { temp: -2, condition: 'Mixed precipitation', risk: 'Coastal freeze-thaw and low traction', severity: 'warning' },
  'Prince Edward Island': { temp: -5, condition: 'Snow squalls', risk: 'Rapidly changing visibility', severity: 'warning' },
  'Newfoundland and Labrador': { temp: -8, condition: 'Coastal snow', risk: 'High wind and icy exposed roads', severity: 'warning' },
  'Yukon': { temp: -26, condition: 'Extreme cold', risk: 'Severe cold start and tire pressure drop', severity: 'danger' },
  'Northwest Territories': { temp: -29, condition: 'Extreme cold', risk: 'Battery preconditioning strongly recommended', severity: 'danger' },
  'Nunavut': { temp: -31, condition: 'Arctic cold', risk: 'Severe range loss and ice risk', severity: 'danger' }
};

/* ──────────────────────────────────────────────────────────
   MOCK PRM EXPANSION DATA
   ────────────────────────────────────────────────────────── */
const DEALER_INVENTORY = [
  { vin: 'WDB2025EQS580CA01', model: 'EQS 580 4MATIC Sedan', year: 2025, color: 'Obsidian Black', status: 'In Stock', daysInLot: 22, eta: '' },
  { vin: 'WDB2026C300CA02', model: 'C 300 4MATIC Sedan', year: 2026, color: 'Polar White', status: 'In Stock', daysInLot: 15, eta: '' },
  { vin: 'WDB2026AMGGT53CA03', model: 'AMG GT 53 4-Door Coupe', year: 2026, color: 'Selenite Grey Magno', status: 'In Transit', daysInLot: 0, eta: '2026-07-05' },
  { vin: 'WDB2025GLE450CA04', model: 'GLE 450 4MATIC SUV', year: 2025, color: 'Sodalite Blue Metallic', status: 'In Stock', daysInLot: 45, eta: '' },
  { vin: 'WDB2026GLC300CA05', model: 'GLC 300 4MATIC SUV', year: 2026, color: 'Mojave Silver', status: 'On Order', daysInLot: 0, eta: '2026-08-15' },
  { vin: 'WDB2025SL63CA06', model: 'AMG SL 63 Roadster', year: 2025, color: 'Patagonia Red Metallic', status: 'Sold', daysInLot: 5, eta: '' },
  { vin: 'WDB2025EQE350CA07', model: 'EQE 350 SUV', year: 2025, color: 'Alpine Grey', status: 'In Stock', daysInLot: 30, eta: '' },
  { vin: 'WDB2026GLA250CA08', model: 'GLA 250 4MATIC', year: 2026, color: 'Digital White', status: 'In Stock', daysInLot: 8, eta: '' },
  { vin: 'WDB2025GLB250CA09', model: 'GLB 250 SUV', year: 2025, color: 'Cosmos Black', status: 'In Stock', daysInLot: 60, eta: '' },
  { vin: 'WDB2025GLS580CA10', model: 'GLS 580 4MATIC SUV', year: 2025, color: 'Emerald Green Metallic', status: 'In Transit', daysInLot: 0, eta: '2026-07-12' },
  { vin: 'WDB2026EQB300CA11', model: 'EQB 300 SUV', year: 2026, color: 'Rose Gold Metallic', status: 'On Order', daysInLot: 0, eta: '2026-09-01' },
  { vin: 'WDB2026C43CA12', model: 'AMG C 43 Sedan', year: 2026, color: 'High-Tech Silver', status: 'In Stock', daysInLot: 12, eta: '' },
  { vin: 'WDB2025SL55CA13', model: 'AMG SL 55 Roadster', year: 2025, color: 'Obsidian Black', status: 'Sold', daysInLot: 14, eta: '' },
  { vin: 'WDB2026E350CA14', model: 'E 350 Sedan', year: 2026, color: 'Nautical Blue', status: 'In Stock', daysInLot: 18, eta: '' },
  { vin: 'WDB2025G550CA15', model: 'G 550 Professional', year: 2025, color: 'Monza Grey Magno', status: 'In Stock', daysInLot: 40, eta: '' },
  { vin: 'WDB2026GT63CA16', model: 'AMG GT 63 Coupe', year: 2026, color: 'Moonlight White', status: 'In Transit', daysInLot: 0, eta: '2026-07-20' },
  { vin: 'WDB2025GLC300CA17', model: 'GLC 300 Coupe', year: 2025, color: 'Polar White', status: 'In Stock', daysInLot: 25, eta: '' },
  { vin: 'WDB2025EQS450CA18', model: 'EQS 450+ Sedan', year: 2025, color: 'Manufaktur Diamond White', status: 'In Stock', daysInLot: 35, eta: '' }
];

const DEALER_INCENTIVES = {
  dealerId: 'DLR-QC-01',
  currentTier: 'Silver Partner',
  nextTier: 'Gold Partner',
  progressPct: 85,
  ytdEarnings: 115000,
  breakdown: [
    { category: 'Lease Renewals Closed', amount: 37500, detail: '25 renewals closed ($1,500/ea)' },
    { category: 'NPS Achievement Bonus', amount: 15000, detail: 'Score of 8.4 (Target: >=8.0)' },
    { category: 'Service Volume Bonus', amount: 20000, detail: '158 services completed (95.7% of target)' },
    { category: 'Base Volume Sales Commission', amount: 42500, detail: 'Regular model volume bonus' }
  ],
  estimatedNextPayment: { amount: 23000, date: '2026-07-15', details: 'NPS & Q2 Lease renewals closure' },
  history: [
    { date: '2026-05-15', amount: 18500, category: 'NPS & renewals bonus', status: 'Completed' },
    { date: '2026-04-15', amount: 22000, category: 'Volume sales commission', status: 'Completed' },
    { date: '2026-03-15', amount: 15800, category: 'Service volume bonus', status: 'Completed' },
    { date: '2026-02-15', amount: 19200, category: 'Renewals commission', status: 'Completed' },
    { date: '2026-01-15', amount: 16500, category: 'NPS achievement', status: 'Completed' }
  ]
};

const DEALER_TRAINING = [
  { staffName: 'Marc Tremblay', role: 'Dealer Principal', courseName: 'Customer Service Standards 2026', status: 'Completed', date: '2026-01-10' },
  { staffName: 'Marc Tremblay', role: 'Dealer Principal', courseName: 'Quebec Privacy Law 25 Compliance', status: 'Completed', date: '2026-02-12' },
  { staffName: 'Jean-Pierre Cloutier', role: 'Sales Manager', courseName: 'EV Sales Certification', status: 'Completed', date: '2025-11-20' },
  { staffName: 'Jean-Pierre Cloutier', role: 'Sales Manager', courseName: 'AMG Product Specialist', status: 'Completed', date: '2025-12-05' },
  { staffName: 'Jean-Pierre Cloutier', role: 'Sales Manager', courseName: 'Quebec Privacy Law 25 Compliance', status: 'Completed', date: '2026-02-12' },
  { staffName: 'Sophie Roy', role: 'Sales Consultant', courseName: 'EV Sales Certification', status: 'Completed', date: '2025-11-21' },
  { staffName: 'Sophie Roy', role: 'Sales Consultant', courseName: 'MBUX Next Gen Technology', status: 'Completed', date: '2026-03-10' },
  { staffName: 'Sophie Roy', role: 'Sales Consultant', courseName: 'AMG Product Specialist', status: 'In Progress', date: '—' },
  { staffName: 'Luc Mercier', role: 'Service Advisor', courseName: 'Customer Service Standards 2026', status: 'Completed', date: '2026-01-15' },
  { staffName: 'Luc Mercier', role: 'Service Advisor', courseName: 'MBUX Next Gen Technology', status: 'Completed', date: '2026-03-12' },
  { staffName: 'Luc Mercier', role: 'Service Advisor', courseName: 'EV Sales Certification', status: 'Not Started', date: '—' },
  { staffName: 'Chantal Dubois', role: 'Finance Manager', courseName: 'Customer Service Standards 2026', status: 'Completed', date: '2026-01-11' },
  { staffName: 'Chantal Dubois', role: 'Finance Manager', courseName: 'Quebec Privacy Law 25 Compliance', status: 'Completed', date: '2026-02-12' },
  { staffName: 'Pierre Levesque', role: 'Lead Technician', courseName: 'EV Certified Technician', status: 'Completed', date: '2025-10-15' },
  { staffName: 'Pierre Levesque', role: 'Lead Technician', courseName: 'MBUX Next Gen Technology', status: 'Expired', date: '2025-05-10' }
];

const ANNOUNCEMENTS = [
  { id: 1, title: 'PIPEDA & Quebec Law 25 Compliance Guidelines', date: '2026-06-10', category: 'Policy', body: 'Mandatory update for all Quebec-based dealers regarding customer data encryption and consent-gathering at point of sale.', link: 'policy_law25_v2.pdf', readCount: 54, engagementRate: 98 },
  { id: 2, title: 'Summer Stars Regional Campaign Assets', date: '2026-06-05', category: 'Marketing', body: 'New dealer co-op marketing packages are now ready in the Mercedes-Benz Asset Portal, including local TV templates and radio scripts.', link: 'marketing_summer2026.zip', readCount: 42, engagementRate: 76 },
  { id: 3, title: 'EQS SUV 2027 Model Year Order Guide', date: '2026-05-28', category: 'Product', body: 'Order banks for the 2027 EQS SUV models are officially open. Review pricing matrices, optional trim adjustments, and standard package variations.', link: 'eqs_2027_ordering.pdf', readCount: 49, engagementRate: 89 },
  { id: 4, title: 'Mandatory EV Charger Maintenance Window', date: '2026-05-20', category: 'Urgent', body: 'All regional showroom chargers must undergo a firmware update on June 22. Coordinate with local operators to ensure minimal interruption.', link: 'charger_maint_guide.pdf', readCount: 55, engagementRate: 100 }
];

/* ──────────────────────────────────────────────────────────
   NAV CONFIG
────────────────────────────────────────────────────────── */
const NAV = {
  concesionario: [
    { id:'d-dashboard', label:'nav_dashboard',          icon:'grid'     },
    { id:'d-clients',   label:'nav_clients',  icon:'users'    },
    { id:'d-followup',  label:'nav_followup',icon:'activity' },
    { id:'d-renewals',  label:'nav_renewals',     icon:'refresh'  },
    { id:'d-reports',   label:'nav_reports',  icon:'chart'    },
    { id:'d-inventory', label:'nav_inventory', icon:'car' },
    { id:'d-incentives', label:'nav_incentives', icon:'dollar' },
    { id:'d-training', label:'nav_training', icon:'award' },
    { id:'d-announcements', label:'nav_announcements', icon:'megaphone' }
  ],
  corporativo: [
    { id:'corp-dashboard',     label:'nav_exec_dashboard', icon:'grid'    },
    { id:'corp-kpis',          label:'nav_national_kpis',        icon:'target'  },
    { id:'corp-map',           label:'nav_dealer_map',   icon:'map'     },
    { id:'corp-prm',           label:'nav_prm_portal',           icon:'trophy'  },
    { id:'corp-announcements', label:'nav_corp_announcements', icon:'megaphone' }
  ]
};

const NAV_ICONS = {
  home:     `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>`,
  shield:   `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  clock:    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  calendar: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  file:     `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
  star:     `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  message:  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  grid:     `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
  users:    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  activity: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
  refresh:  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>`,
  chart:    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
  target:   `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
  map:      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>`,
  pie:      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>`,
  trophy:   `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><polyline points="8 17 12 21 16 17"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"/></svg>`,
  car:      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M5 17h10M9 10h6"/></svg>`,
  dollar:   `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
  award:    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>`,
  megaphone:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M18 8a3 3 0 0 0-3-3H5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8z"/><path d="M18 8l4-2v12l-4-2"/><line x1="6" y1="11" x2="10" y2="11"/></svg>`
};

/* ──────────────────────────────────────────────────────────
   UTILITY HELPERS
────────────────────────────────────────────────────────── */
function fmtDate(d){
  if(!d) return '—';
  const dt = new Date(d + 'T00:00:00');
  return dt.toLocaleDateString('en-CA', { year:'numeric', month:'short', day:'numeric' });
}
function fmtDateTime(d){
  if(!d) return '—';
  const dt = d instanceof Date ? d : new Date(d);
  const localeMap = { en: 'en-CA', es: 'es-CA', fr: 'fr-CA' };
  const loc = localeMap[currentLanguage] || 'en-CA';
  return dt.toLocaleString(loc, { year:'numeric', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' });
}
function fmtMoney(n){ return n == null ? '—' : `$${n.toLocaleString('en-CA')}`; }
function fmtKm(n){ return n.toLocaleString('en-CA') + ' km'; }
function daysUntil(d){ return Math.ceil((new Date(d) - new Date()) / 86400000); }

function healthColor(v){
  if(v >= 80) return 'success';
  if(v >= 55) return 'warning';
  return 'danger';
}
function compColor(v){
  if(v >= 70) return '#10B981';
  if(v >= 45) return '#F59E0B';
  return '#EF4444';
}
function badge(text, type){ return `<span class="badge badge--${type}">${text}</span>`; }
function segBadge(seg){
  const map = { AMG:'amg', EQ:'eq', SUV:'suv', Sedan:'sedan' };
  return badge(seg, map[seg] || 'silver');
}
function contractBadge(s){
  if(s==='Active') return badge(t(s),'success');
  if(s==='Expiring Soon') return badge(t(s),'warning');
  if(s==='Expired') return badge(t(s),'danger');
  return badge(t(s),'silver');
}
function syncBadge(s){
  if(s==='Real-time') return badge('● Real-time','success');
  if(s==='Pending')   return badge('⏳ Pending','warning');
  return badge(s,'silver');
}

function ringGauge(val, max, cls, size=80){
  const r = (size/2) - 8;
  const circ = 2 * Math.PI * r;
  const fill = (val/max) * circ;
  const id = 'ring-' + Math.random().toString(36).slice(2,7);
  return `
  <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" class="ring-svg">
    <circle class="ring-bg" cx="${size/2}" cy="${size/2}" r="${r}" />
    <circle id="${id}" class="ring-fill ring-fill--${cls}" cx="${size/2}" cy="${size/2}" r="${r}"
      stroke-dasharray="${circ}" stroke-dashoffset="${circ}"
      data-fill="${fill}" />
  </svg>`;
}
function animateRings(){
  document.querySelectorAll('[data-fill]').forEach(el => {
    setTimeout(() => { el.style.strokeDashoffset = el.dataset.fill; }, 100);
  });
}

function progressBar(pct, cls, label, target){
  const targetHtml = target ? `<span class="text-xs text-muted">Target: ${target}%</span>` : '';
  return `
  <div class="progress-wrap">
    <div class="progress-label-row">
      <span class="progress-label">${label}</span>
      <div style="display:flex;align-items:center;gap:10px;">
        ${targetHtml}
        <span class="progress-val">${pct}%</span>
      </div>
    </div>
    <div class="progress-bar-bg">
      <div class="progress-bar-fill progress-bar-fill--${cls}" style="width:${pct}%"></div>
    </div>
  </div>`;
}

function getClientWeather(client){
  return WEATHER_BY_PROVINCE[client.province] || { temp: 1, condition: 'Variable winter conditions', risk: 'Monitor road conditions before departure', severity: 'info' };
}

function buildContextualAlerts(client){
  const v = client.vehicle;
  const weather = getClientWeather(client);
  const alerts = [];
  const tires = v.components?.tires || {};
  const isElectric = v.tipo_vehiculo === 'electrico' || v.tipo_vehiculo === 'hibrido';
  const isCold = weather.temp <= -8;
  const hasIceRisk = /ice|snow|freez|squall|cold/i.test(`${weather.condition} ${weather.risk}`);

  if (tires.current_set !== 'winter' && weather.temp <= 7) {
    alerts.push({
      type: 'warning',
      title: t('weather_alert_winter_tires'),
      message: t('weather_alert_winter_tires_msg')
    });
  }

  if (weather.temp <= -18) {
    alerts.push({
      type: 'danger',
      title: t('weather_alert_extreme_temp'),
      message: t('weather_alert_extreme_temp_msg')
    });
  }

  if (isElectric && isCold) {
    const efficiency = Math.round((v.battery?.coldEfficiency || 0.86) * 100);
    alerts.push({
      type: 'info',
      title: t('weather_alert_battery'),
      message: t('weather_alert_battery_msg').replace('{efficiency}', efficiency)
    });
  }

  if (hasIceRisk) {
    alerts.push({
      type: 'warning',
      title: t('weather_alert_ice'),
      message: weather.risk
    });
  }

  if (isElectric && isCold && (!v.preheating?.cabin || !v.preheating?.battery)) {
    alerts.push({
      type: 'info',
      title: t('weather_alert_preheat'),
      message: t('weather_alert_preheat_msg')
    });
  }

  return alerts;
}

function destroyChart(id){
  if(activeCharts[id]){ activeCharts[id].destroy(); delete activeCharts[id]; }
}

function mkChart(canvasId, cfg){
  destroyChart(canvasId);
  const el = document.getElementById(canvasId);
  if(!el) return;
  activeCharts[canvasId] = new Chart(el, cfg);
}

const CHART_DEFAULTS = {
  color: (opacity=1) => `rgba(46,84,148,${opacity})`,
  grid: { color:'rgba(255,255,255,0.05)', drawBorder:false },
  ticks: { color:'#666', font:{ family:'Inter', size:11 } }
};

function darkChartDefaults(type){
  Chart.defaults.color = '#777';
  Chart.defaults.borderColor = 'rgba(255,255,255,0.06)';
  Chart.defaults.font.family = 'Inter';
}

/* ──────────────────────────────────────────────────────────
   MODALS & ACTIONS
────────────────────────────────────────────────────────── */
function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach(el => el.remove());
}

function openClientProfile(clientId) {
  const c = CLIENTS.find(x => x.id === clientId);
  if (!c) return;
  const v = c.vehicle || {};
  const tpl = `
  <div class="modal-overlay" id="client-modal" onclick="if(event.target===this) closeAllModals()">
    <div class="modal-content">
      <div class="modal-header">
        <div class="modal-title">${t('client_profile')} — ${c.name}</div>
        <button class="modal-close" onclick="closeAllModals()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="modal-body">
        <div class="stat-row"><span class="stat-row-key">Email</span><span class="stat-row-val">${c.email}</span></div>
        <div class="stat-row"><span class="stat-row-key">Phone</span><span class="stat-row-val">${c.phone || '—'}</span></div>
        <div class="stat-row"><span class="stat-row-key">Province</span><span class="stat-row-val">${c.province}</span></div>
        <div class="stat-row"><span class="stat-row-key">Vehicle</span><span class="stat-row-val">${v.year || ''} ${v.model || ''}</span></div>
        <div class="stat-row"><span class="stat-row-key">VIN</span><span class="stat-row-val">${v.vin || '—'}</span></div>
        <div class="stat-row"><span class="stat-row-key">Contract Status</span><span class="stat-row-val">${c.contract ? contractBadge(c.contract.status) : '—'}</span></div>
        <div class="stat-row"><span class="stat-row-key">Health Score</span><span class="stat-row-val">${v.health ? v.health + '%' : '—'}</span></div>
        <div class="stat-row"><span class="stat-row-key">Next Service</span><span class="stat-row-val">${fmtDate(v.nextService)}</span></div>
        ${c.interactions && c.interactions.length > 0 ? `
          <div style="margin-top:20px; font-weight:600; color:var(--text-100); margin-bottom:10px;">Interactions</div>
          <div style="font-size:0.8rem; background:var(--bg-3); padding:12px; border-radius:var(--radius-md);">
            ${c.interactions.map(i => `
              <div style="margin-bottom:8px; border-bottom:1px solid var(--border); padding-bottom:8px;">
                <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                  <strong style="color:var(--text-100);">${i.type}</strong>
                  <span style="color:var(--text-400);">${fmtDate(i.date)}</span>
                </div>
                <div>${i.subject} — ${badge(i.status, i.status==='Resolved'?'success':'warning')}</div>
              </div>`).join('')}
          </div>
        ` : ''}
      </div>
    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend', tpl);
}

function toggleDropdown(el) {
  const wrap = el.parentElement;
  const isActive = wrap.classList.contains('active');
  document.querySelectorAll('.dropdown-wrap.active').forEach(d => d.classList.remove('active'));
  if (!isActive) wrap.classList.add('active');
}
document.addEventListener('click', e => {
  if (!e.target.closest('.dropdown-wrap')) {
    document.querySelectorAll('.dropdown-wrap.active').forEach(d => d.classList.remove('active'));
  }
});

function exportClientsCSV() {
  const searchTerm  = (document.getElementById('client-search')  || {}).value || '';
  const filterSeg    = (document.getElementById('filter-seg')    || {}).value || 'all';
  const filterStatus = (document.getElementById('filter-status') || {}).value || 'all';

  const filtered = CLIENTS.filter(c => {
    const matchSearch = !searchTerm || c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) || c.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchSeg    = filterSeg    === 'all' || c.vehicle.segment    === filterSeg;
    const matchStatus = filterStatus === 'all' || c.contract.status    === filterStatus || (filterStatus === 'Finance' && c.contract.type === 'Finance');
    return matchSearch && matchSeg && matchStatus;
  });

  const header = ['Name', 'Email', 'Province', 'Model', 'Year', 'Segment', 'Contract Status', 'Health', 'Next Service'];
  const rows = filtered.map(c => [
    `"${c.name}"`, `"${c.email}"`, `"${c.province}"`, `"${c.vehicle.model}"`, 
    c.vehicle.year, `"${c.vehicle.segment}"`, `"${c.contract.status}"`, 
    `${c.vehicle.health}%`, `"${c.vehicle.nextService || ''}"`
  ]);
  
  const csvContent = [header.join(','), ...rows.map(r => r.join(','))].join('\\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'clients_export.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  if (typeof showPushNotification === 'function') {
    showPushNotification(t('success_export'), { type: 'success', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:24px;height:24px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>' });
  }
}

function logFollowUpCall(id) {
  const f = DEALER_FOLLOWUPS.find(x => x.id === id);
  if (!f) return;
  const now = new Date();
  f.lastContact = now.toISOString().split('T')[0];
  f.desc += `\n\n[${t('call_client')} logged — ${now.toLocaleString()}]`;
  f.status = 'In Progress';
  renderDealerFollowup();
  if (typeof showPushNotification === 'function') {
    showPushNotification(t('success_call'), { type: 'success', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:24px;height:24px;"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>' });
  }
}

function sendFollowUpEmail(id) {
  const f = DEALER_FOLLOWUPS.find(x => x.id === id);
  if (!f) return;
  window.location.href = `mailto:${f.client.email}?subject=${encodeURIComponent(f.subject)}`;
}

function openRenewalModal(clientId) {
  const c = CLIENTS.find(x => x.id === clientId);
  if (!c) return;
  const tpl = `
  <div class="modal-overlay" id="renewal-modal" onclick="if(event.target===this) closeAllModals()">
    <div class="modal-content">
      <div class="modal-header">
        <div class="modal-title">${t('renewal_request')} — ${c.name}</div>
        <button class="modal-close" onclick="closeAllModals()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="modal-body">
        <div class="stat-row" style="margin-bottom:16px;">
          <span class="stat-row-key">${t('current_contract')}</span>
          <span class="stat-row-val">${c.contract.type} (${fmtDate(c.contract.end)})</span>
        </div>
        <div style="margin-bottom: 12px;">
          <label style="display:block; font-size:0.8rem; color:var(--text-400); margin-bottom:6px;">${t('proposed_duration')}</label>
          <select class="form-select" id="renewal-duration">
            <option value="36"${c.contract.renewalAppointment && c.contract.renewalAppointment.duration==='36' ? ' selected' : ''}>${t('months_36')}</option>
            <option value="48"${c.contract.renewalAppointment && c.contract.renewalAppointment.duration==='48' ? ' selected' : ''}>${t('months_48')}</option>
            <option value="60"${c.contract.renewalAppointment && c.contract.renewalAppointment.duration==='60' ? ' selected' : ''}>${t('months_60')}</option>
          </select>
        </div>
        <div style="margin-bottom: 12px;">
          <label style="display:block; font-size:0.8rem; color:var(--text-400); margin-bottom:6px;">${t('target_model')}</label>
          <input type="text" class="form-select" id="renewal-model" value="${c.contract.renewalAppointment && c.contract.renewalAppointment.targetModel ? c.contract.renewalAppointment.targetModel : c.vehicle.model}" placeholder="e.g. EQS 580" />
        </div>
        <div style="margin-bottom: 12px;">
          <label style="display:block; font-size:0.8rem; color:var(--text-400); margin-bottom:6px;">${t('appointment_date')}</label>
          <input type="date" class="form-select" id="renewal-date" value="${c.contract.renewalAppointment && c.contract.renewalAppointment.date ? c.contract.renewalAppointment.date : ''}" />
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn--ghost" onclick="closeAllModals()">${t('cancel_btn')}</button>
        <button class="btn btn--primary" onclick="confirmRenewalRequest('${c.id}')">${t('confirm_renewal')}</button>
      </div>
    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend', tpl);
}

function confirmRenewalRequest(clientId) {
  const c = CLIENTS.find(x => x.id === clientId);
  if (c) {
    const durationEl = document.getElementById('renewal-duration');
    const modelEl = document.getElementById('renewal-model');
    const dateEl = document.getElementById('renewal-date');

    c.contract.renewalStatus = 'In Progress';
    c.contract.renewalAppointment = {
      duration: durationEl ? durationEl.value : null,
      targetModel: modelEl ? modelEl.value : null,
      date: dateEl ? dateEl.value : null
    };
    renderDealerRenewals();
    if (typeof showPushNotification === 'function') {
      showPushNotification(t('success_renewal'), { type: 'success', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:24px;height:24px;"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>' });
    }
  }
  closeAllModals();
}

function downloadAttachment(link) {
  if (typeof showPushNotification === 'function') {
    showPushNotification(t('downloading_file'), { type: 'info', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:24px;height:24px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>' });
  }
  const blob = new Blob(['Demo content for ' + link], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = link;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/* ──────────────────────────────────────────────────────────
   ROUTER & SHELL
────────────────────────────────────────────────────────── */
function selectRole(role){
  selectedRole = role;
  document.querySelectorAll('.role-card').forEach(c => c.classList.remove('selected'));
  const el = document.getElementById('role-' + role);
  if(el) el.classList.add('selected');

  // Autocomplete email and password with demo credentials
  const account = DEMO_ACCOUNTS[role];
  if(account) {
    const emailEl = document.getElementById('login-email');
    const passwordEl = document.getElementById('login-password');
    if(emailEl) emailEl.value = account.email;
    if(passwordEl) passwordEl.value = account.password;
  }

  // Clear any existing login error
  const errorMsgEl = document.getElementById('login-error-msg');
  if (errorMsgEl) {
    errorMsgEl.style.display = 'none';
    errorMsgEl.textContent = '';
  }
}

function handleLogin(e){
  e.preventDefault();
  
  const emailEl = document.getElementById('login-email');
  const passwordEl = document.getElementById('login-password');
  const email = emailEl ? emailEl.value.trim() : '';
  const password = passwordEl ? passwordEl.value : '';

  // Clear existing error
  const errorMsgEl = document.getElementById('login-error-msg');
  if (errorMsgEl) {
    errorMsgEl.style.display = 'none';
    errorMsgEl.textContent = '';
  }

  let roleToUse = selectedRole;
  if (!roleToUse && email) {
    roleToUse = Object.keys(DEMO_ACCOUNTS).find(role => DEMO_ACCOUNTS[role].email.toLowerCase() === email.toLowerCase());
    if (roleToUse) {
      selectRole(roleToUse);
    }
  }

  if(!roleToUse){
    showLoginError(t('login_error_select_role'));
    return;
  }

  const account = DEMO_ACCOUNTS[roleToUse];
  if(!account){
    showLoginError(t('login_error_invalid_role'));
    return;
  }

  if(email.toLowerCase() === account.email.toLowerCase() && password === account.password){
    loginAs(roleToUse);
  } else {
    showLoginError(t('login_error_invalid_creds'));
  }
}

function showLoginError(msg) {
  let errorMsgEl = document.getElementById('login-error-msg');
  if (!errorMsgEl) {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      errorMsgEl = document.createElement('div');
      errorMsgEl.id = 'login-error-msg';
      errorMsgEl.className = 'login-error-msg';
      const loginBtn = document.getElementById('login-btn');
      if (loginBtn) {
        loginBtn.parentNode.insertBefore(errorMsgEl, loginBtn.nextSibling);
      } else {
        loginForm.appendChild(errorMsgEl);
      }
    }
  }
  
  if (errorMsgEl) {
    errorMsgEl.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 16px; height: 16px; flex-shrink: 0;">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <span>${msg}</span>
    `;
    errorMsgEl.style.display = 'flex';
  }
}

function loginAs(role){
  currentRole = role;
  setupShell(role);
  document.getElementById('screen-login').classList.remove('active');
  document.getElementById('app-shell').classList.add('active');
  const defaultPanel = { concesionario:'d-dashboard', corporativo:'corp-dashboard' };
  // Reset notification state on each login
  notifRead = false;
  notifPanelOpen = false;
  resetNotifDot();
  navigateTo(defaultPanel[role]);
}

function logout(){
  currentRole = null; currentPanel = null; selectedRole = null;
  Object.values(activeCharts).forEach(c => c.destroy());
  activeCharts = {};
  // Close notif panel and reset state
  closeNotifPanel();
  notifRead = false;
  resetNotifDot();
  document.getElementById('app-shell').classList.remove('active');
  document.getElementById('screen-login').classList.add('active');
  
  // Reset login state and errors
  const errorMsgEl = document.getElementById('login-error-msg');
  if (errorMsgEl) {
    errorMsgEl.style.display = 'none';
    errorMsgEl.textContent = '';
  }
  
  // Select default role corporativo on logout
  selectRole('corporativo');
}

function setupShell(role){
  const account = DEMO_ACCOUNTS[role] || DEMO_ACCOUNTS.corporativo;

  document.getElementById('sidebar-username').textContent  = account.name;
  document.getElementById('sidebar-userrole').textContent  = account.roleLabel;
  document.getElementById('sidebar-avatar').textContent    = account.avatar;
  document.getElementById('sidebar-role-label').textContent = account.roleDetail;

  buildSidebarNav(role);
  updateDate();
}

function buildSidebarNav(role){
  const nav = document.getElementById('sidebar-nav');
  const items = NAV[role] || [];
  const badges = { 'd-renewals':3, 'corp-map':2 };
  nav.innerHTML = items.map(item => {
    const bdg = badges[item.id] ? `<span class="nav-badge">${badges[item.id]}</span>` : '';
    return `<div class="nav-item" id="nav-${item.id}" onclick="navigateTo('${item.id}')">
      ${NAV_ICONS[item.icon] || ''}
      <span>${t(item.label)}</span>
      ${bdg}
    </div>`;
  }).join('');
}

function navigateTo(panelId){
  currentPanel = panelId;
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  const navEl = document.getElementById('nav-' + panelId);
  if(navEl) navEl.classList.add('active');

  const labels = {
    'd-dashboard':'bc_op_dashboard','d-clients':'nav_clients',
    'd-followup':'nav_followup','d-renewals':'nav_renewals','d-reports':'nav_reports',
    'd-inventory':'nav_inventory','d-incentives':'nav_incentives',
    'd-training':'nav_training','d-announcements':'nav_announcements',
    'corp-dashboard':'nav_exec_dashboard','corp-kpis':'nav_national_kpis',
    'corp-map':'nav_dealer_map','corp-prm':'nav_prm_portal',
    'corp-announcements':'nav_corp_announcements'
  };
  document.getElementById('breadcrumb').textContent = t(labels[panelId] || panelId);
  closeSidebar();

  Object.values(activeCharts).forEach(c => c.destroy());
  activeCharts = {};

  const renderers = {
    'd-dashboard': renderDealerDashboard, 'd-clients': renderDealerClients,
    'd-followup': renderDealerFollowup, 'd-renewals': renderDealerRenewals,
    'd-reports': renderDealerReports,
    'd-inventory': renderDealerInventory, 'd-incentives': renderDealerIncentives,
    'd-training': renderDealerTraining, 'd-announcements': renderDealerAnnouncements,
    'corp-dashboard': renderCorpDashboard, 'corp-kpis': renderCorpKPIs,
    'corp-map': renderCorpMap, 'corp-prm': renderCorpPRM,
    'corp-announcements': renderCorpAnnouncements
  };
  if(renderers[panelId]) renderers[panelId]();
}

function toggleSidebar(){
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebar-overlay').classList.toggle('visible');
}
function closeSidebar(){
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.remove('visible');
}

function updateDate(){
  const el = document.getElementById('topbar-date');
  if(!el) return;
  const localeMap = { en: 'en-CA', es: 'es-CA', fr: 'fr-CA' };
  const loc = localeMap[currentLanguage] || 'en-CA';
  el.textContent = new Date().toLocaleDateString(loc,{weekday:'short',month:'short',day:'numeric',year:'numeric'});
}

/* ──────────────────────────────────────────────────────────
   NOTIFICATIONS
────────────────────────────────────────────────────────── */
const NOTIFICATIONS = {
  concesionario: [
    {
      type: 'alert',
      text: 'Lease renewal due tomorrow: Marc Girard',
      time: '1h ago'
    },
    {
      type: 'info',
      text: 'New client appointment booked for 09:00',
      time: '3h ago'
    },
    {
      type: 'alert',
      text: 'Vehicle health alert: client Noah Tremblay (health < 80)',
      time: 'Yesterday'
    }
  ],
  corporativo: [
    {
      type: 'alert',
      text: 'Quebec region dealer sync delayed (2 dealers pending)',
      time: '45m ago'
    },
    {
      type: 'success',
      text: 'Monthly NPS report ready for review',
      time: '2h ago'
    },
    {
      type: 'remind',
      text: '18 dealer renewals pending action',
      time: 'Yesterday'
    }
  ]
};

const NOTIF_ICONS = {
  alert: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  info:  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  remind:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  success:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`
};

function resetNotifDot(){
  const dot = document.getElementById('notif-dot');
  if(!dot) return;
  if(notifRead){
    dot.classList.add('notif-dot--read');
  } else {
    dot.classList.remove('notif-dot--read');
  }
}

function buildNotifPanel(){
  const role = currentRole;
  const items = (NOTIFICATIONS[role] || []);

  // Build survey notification for cliente role (only if not completed)
  let surveyNotifHtml = '';
  if(role === 'cliente' && !isSurveyCompleted()){
    const surveyIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>`;
    surveyNotifHtml = `
    <li class="notif-item">
      <div class="notif-icon-wrap notif-icon-wrap--survey">${surveyIcon}</div>
      <div class="notif-body">
        <div class="notif-text">${t('notif_survey_text')}</div>
        <a href="${SURVEY_LINK}" target="_blank" rel="noopener noreferrer" class="notif-survey-link">
          ${t('notif_survey_link')}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
        </a>
        <div class="notif-time">${t('just_now')}</div>
      </div>
    </li>`;
  }

  const itemsHtml = items.map(n => `
    <li class="notif-item">
      <div class="notif-icon-wrap notif-icon-wrap--${n.type}">${NOTIF_ICONS[n.type] || NOTIF_ICONS.info}</div>
      <div class="notif-body">
        <div class="notif-text">${n.text}</div>
        <div class="notif-time">${n.time}</div>
      </div>
    </li>`).join('');

  const totalCount = items.length + (surveyNotifHtml ? 1 : 0);

  return `
  <div class="notif-panel" id="notif-panel">
    <div class="notif-panel-header">
      <span class="notif-panel-title">${t('notif_title')}</span>
      <span class="notif-panel-count">${totalCount}</span>
    </div>
    <ul class="notif-list">${surveyNotifHtml}${itemsHtml}</ul>
    <div class="notif-panel-footer">
      <span class="notif-panel-footer-link" onclick="closeNotifPanel()">${t('mark_read')}</span>
    </div>
  </div>`;
}

function openNotifPanel(){
  // Mark as read — dot dims
  notifRead = true;
  resetNotifDot();
  const btn = document.getElementById('notif-btn');
  if(!btn) return;
  // Remove existing panel if any
  const existing = document.getElementById('notif-panel');
  if(existing) existing.remove();
  // Inject panel
  btn.insertAdjacentHTML('afterend', buildNotifPanel());
  notifPanelOpen = true;
}

function closeNotifPanel(){
  const panel = document.getElementById('notif-panel');
  if(panel) panel.remove();
  notifPanelOpen = false;
}

function toggleNotifPanel(){
  if(notifPanelOpen){
    closeNotifPanel();
  } else {
    openNotifPanel();
  }
}

/* ──────────────────────────────────────────────────────────
   CAR SILHOUETTES (SVG inline)
────────────────────────────────────────────────────────── */
function carSVG(seg){
  const svgs = {
    EQ: `<svg viewBox="0 0 120 55" class="car-silhouette" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="30" cy="43" rx="12" ry="7" fill="#1E3A5F" opacity="0.7"/>
      <ellipse cx="90" cy="43" rx="12" ry="7" fill="#1E3A5F" opacity="0.7"/>
      <path d="M8,38 L8,28 Q12,14 35,12 L55,10 L80,10 Q100,11 108,20 L116,28 L116,38 Z"
        fill="#2B5490" opacity="0.85" stroke="#3B72C4" stroke-width="0.5"/>
      <path d="M35,12 L45,5 L78,5 L88,12" fill="#3B72C4" opacity="0.6"/>
    </svg>`,
    AMG: `<svg viewBox="0 0 130 50" class="car-silhouette" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="30" cy="40" rx="11" ry="7" fill="#7f1d1d" opacity="0.7"/>
      <ellipse cx="95" cy="40" rx="11" ry="7" fill="#7f1d1d" opacity="0.7"/>
      <path d="M6,35 L10,22 Q20,10 45,8 L65,7 L90,7 Q108,9 118,20 L124,35 Z"
        fill="#CC0000" opacity="0.5" stroke="#EF4444" stroke-width="0.5"/>
      <path d="M42,8 L52,2 L80,2 L92,8" fill="#EF4444" opacity="0.4"/>
      <path d="M105,25 L118,23 L122,30" fill="none" stroke="#F59E0B" stroke-width="0.8" opacity="0.7"/>
    </svg>`,
    SUV: `<svg viewBox="0 0 130 55" class="car-silhouette" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="30" cy="44" rx="12" ry="8" fill="#1E3A5F" opacity="0.7"/>
      <ellipse cx="97" cy="44" rx="12" ry="8" fill="#1E3A5F" opacity="0.7"/>
      <path d="M5,38 L5,20 Q5,6 30,5 L100,5 Q120,6 125,18 L125,38 Z"
        fill="#2B5490" opacity="0.6" stroke="#3B72C4" stroke-width="0.5"/>
      <path d="M5,20 L125,18" stroke="#3B72C4" stroke-width="0.6" opacity="0.5"/>
    </svg>`,
    Sedan: `<svg viewBox="0 0 120 50" class="car-silhouette" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="28" cy="40" rx="11" ry="7" fill="#4B2D8F" opacity="0.7"/>
      <ellipse cx="90" cy="40" rx="11" ry="7" fill="#4B2D8F" opacity="0.7"/>
      <path d="M6,34 L8,24 Q15,10 38,9 L58,7 L78,7 Q98,9 108,20 L114,34 Z"
        fill="#6D28D9" opacity="0.45" stroke="#A78BFA" stroke-width="0.5"/>
      <path d="M36,9 L44,2 L72,2 L82,9" fill="#A78BFA" opacity="0.35"/>
    </svg>`
  };
  return svgs[seg] || svgs.Sedan;
}

/* ──────────────────────────────────────────────────────────
   SURVEY HELPERS
────────────────────────────────────────────────────────── */
const SURVEY_LINK = 'https://ramirezclaudiodiana-ui.github.io/Cuestionario_concesionarios/';
const SURVEY_DISMISS_KEY = 'surveyBannerDismissedAt';
const SURVEY_COMPLETED_KEY = 'surveyCompleted';
const SURVEY_COOLDOWN_DAYS = 7;

function isSurveyCompleted(){
  return localStorage.getItem(SURVEY_COMPLETED_KEY) === 'true';
}

function isSurveyBannerVisible(){
  if(isSurveyCompleted()) return false;
  const dismissed = localStorage.getItem(SURVEY_DISMISS_KEY);
  if(!dismissed) return true;
  const dismissDate = new Date(dismissed);
  const now = new Date();
  const diffDays = (now - dismissDate) / (1000 * 60 * 60 * 24);
  return diffDays >= SURVEY_COOLDOWN_DAYS;
}

function dismissSurveyBanner(){
  localStorage.setItem(SURVEY_DISMISS_KEY, new Date().toISOString());
  const banner = document.getElementById('survey-banner');
  if(banner){
    banner.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
    banner.style.opacity = '0';
    banner.style.transform = 'translateY(-8px)';
    setTimeout(() => banner.remove(), 260);
  }
}

function buildSurveyBannerHTML(){
  if(!isSurveyBannerVisible()) return '';
  return `
  <div class="survey-banner" id="survey-banner">
    <div class="survey-banner-icon">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    </div>
    <div class="survey-banner-content">
      <div class="survey-banner-text">${t('survey_banner_text')}</div>
      <a href="${SURVEY_LINK}" target="_blank" rel="noopener noreferrer" class="survey-banner-link">
        ${t('take_survey')}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="5" y1="12" x2="19" y2="12"/>
          <polyline points="12 5 19 12 12 19"/>
        </svg>
      </a>
    </div>
    <button class="survey-banner-close" onclick="dismissSurveyBanner()" aria-label="Dismiss survey banner">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"/>
        <line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
  </div>`;
}

/* ──────────────────────────────────────────────────────────
   DEALER PORTAL — 5 PANELS
────────────────────────────────────────────────────────── */
function renderDealerDashboard(){
  const myClients = CLIENTS.filter(c => c.preferredDealer==='DLR-QC-01' || c.province==='Quebec');
  const renewals = CLIENTS.filter(c => c.contract.status==='Expiring Soon');
  const alerts = CLIENTS.filter(c => c.vehicle.health < 80);
  const d = DEALERS.find(x => x.id==='DLR-QC-01');
  const todayApts = [
    { time:'09:00', client:'Sophia Laurent', type:'Annual Inspection', vehicle:'EQS 580 4MATIC', status:'confirmed' },
    { time:'10:30', client:'Ava Dubois',      type:'Tire Rotation',    vehicle:'A 250 4MATIC',  status:'confirmed' },
    { time:'14:00', client:'Noah Tremblay',   type:'Brake Service',    vehicle:'C 300 4MATIC',  status:'pending' },
    { time:'15:30', client:'Marc Girard',     type:'Annual Inspection',vehicle:'GLC 300 4MATIC',status:'confirmed' }
  ];

  document.getElementById('main-content').innerHTML = `
  <div class="panel-section">
    <div class="page-header-row">
      <div class="page-header">
        <div class="page-title">${t('op_dash_title')}</div>
        <div class="page-sub">Mercedes-Benz Montreal · ${t('today')}, ${new Date().toLocaleDateString('en-CA',{weekday:'long',month:'long',day:'numeric'})}</div>
      </div>
      <div>${syncBadge(d.sync)}</div>
    </div>
  </div>
  <div class="panel-section">
    <div class="kpi-grid kpi-grid--4">
      <div class="kpi-card kpi-card--blue">
        <div class="kpi-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#3B72C4" stroke-width="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></div>
        <div class="kpi-label">${t('assigned_clients')}</div>
        <div class="kpi-value">${d.clients}</div>
        <div class="kpi-sub">Montreal ${t('portfolio')}</div>
        <div class="kpi-trend kpi-trend--up">↑ +14 ${t('this_month')}</div>
      </div>
      <div class="kpi-card kpi-card--success">
        <div class="kpi-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="16" y1="2" x2="16" y2="6"/></svg></div>
        <div class="kpi-label">${t('todays_appts')}</div>
        <div class="kpi-value">${todayApts.length}</div>
        <div class="kpi-sub">3 ${t('confirmed')} · 1 ${t('pending')}</div>
      </div>
      <div class="kpi-card kpi-card--warning">
        <div class="kpi-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="1.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>
        <div class="kpi-label">${t('maint_alerts')}</div>
        <div class="kpi-value">${alerts.length}</div>
        <div class="kpi-sub">${t('req_attention')}</div>
      </div>
      <div class="kpi-card kpi-card--danger">
        <div class="kpi-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="1.5"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg></div>
        <div class="kpi-label">${t('renewals_due')}</div>
        <div class="kpi-value">${renewals.length}</div>
        <div class="kpi-sub">${t('action_req')}</div>
        <div class="kpi-trend kpi-trend--up">↑ ${t('urgent')}</div>
      </div>
    </div>
  </div>
  <div class="panel-section">
    <div class="grid-2">
      <div class="card">
        <div class="card-header"><span class="card-title">${t('today_schedule')}</span>${badge(todayApts.length+' '+t('apts'),'info')}</div>
        <div class="card-body--sm">
          <div class="appt-list">
            ${todayApts.map(a => `<div class="appt-item">
              <div class="appt-time">${a.time}</div>
              <div class="appt-info">
                <div class="appt-name">${a.client}</div>
                <div class="appt-type">${a.type}</div>
                <div class="appt-vehicle">${a.vehicle}</div>
              </div>
              ${badge(t(a.status), a.status==='confirmed'?'success':'warning')}
            </div>`).join('')}
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title">${t('maint_alerts')} & Inventory</span></div>
        <div class="card-body--sm">
          ${CLIENTS.filter(c=>c.vehicle.health<85 || (c.vehicle.components.tires && c.vehicle.components.tires.season_ready === false)).map(c => {
            const isTireAlert = c.vehicle.components.tires && c.vehicle.components.tires.season_ready === false;
            const isHealthAlert = c.vehicle.health < 85;
            let title = `${c.name} — ${c.vehicle.model}`;
            let desc = '';
            let alertClass = c.vehicle.health < 70 ? 'danger' : 'warning';
            let icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:15px;height:15px;"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>`;

            if(isTireAlert) {
              alertClass = 'info';
              icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:15px;height:15px;"><circle cx="12" cy="12" r="10"/><path d="M12 2v20M2 12h20"/></svg>`;
              desc = `${t('winter_tire_req') || 'Seasonal Tire Change Required'} · ${t('inventory') || 'Check Storage'}`;
            } else if(isHealthAlert) {
              let criticalComps = [];
              if(c.vehicle.components.brakes && c.vehicle.components.brakes.life < 55) criticalComps.push('Brakes');
              if(c.vehicle.components.tires && c.vehicle.components.tires.life < 55) criticalComps.push('Tires');
              if(c.vehicle.components.oil_level && c.vehicle.components.oil_level.life < 50) criticalComps.push('Oil');
              desc = `Health: ${c.vehicle.health}% · ${criticalComps.length > 0 ? criticalComps.join(', ') : t('gen_check')} alert`;
            }
            
            const usage = c.vehicle.usage || { monthly: 0, weekly_avg: 0 };
            
            return `
            <div class="alert-box alert-box--${alertClass}" style="margin-bottom:8px;">
              ${icon}
              <div class="alert-content" style="flex:1;">
                <div class="alert-title" style="font-size:0.78rem; display:flex; justify-content:space-between;">
                  <span>${title}</span>
                  <span style="font-weight:400; font-size:0.68rem; color:var(--text-400);">${usage.weekly_avg} km/wk</span>
                </div>
                <div class="alert-desc">${desc}</div>
              </div>
            </div>`;
          }).join('')}
        </div>
      </div>
    </div>
  </div>
  <div class="panel-section">
    <div class="card">
      <div class="card-header"><span class="card-title">${t('dealer_kpis')}</span></div>
      <div class="card-body">
        <div class="kpi-grid kpi-grid--4" style="margin-bottom:0;">
          <div style="text-align:center;padding:12px;"><div style="font-size:1.5rem;font-weight:300;">${d.nps}</div><div class="text-xs text-muted mt-8">${t('nps_score')}</div></div>
          <div style="text-align:center;padding:12px;"><div style="font-size:1.5rem;font-weight:300;">${d.respTime}</div><div class="text-xs text-muted mt-8">${t('avg_resp')}</div></div>
          <div style="text-align:center;padding:12px;"><div style="font-size:1.5rem;font-weight:300;">${d.services}/${d.target}</div><div class="text-xs text-muted mt-8">${t('srv_vs_target')}</div></div>
          <div style="text-align:center;padding:12px;"><div style="font-size:1.5rem;font-weight:300;">${d.renewals}</div><div class="text-xs text-muted mt-8">${t('renewals_closed')}</div></div>
        </div>
      </div>
    </div>
  </div>`;
}

function renderDealerClients(){
  function renderTable(){
    // Read current filter values directly from DOM on every call
    const searchTerm  = (document.getElementById('client-search')  || {}).value || '';
    const filterSeg    = (document.getElementById('filter-seg')    || {}).value || 'all';
    const filterStatus = (document.getElementById('filter-status') || {}).value || 'all';

    const filtered = CLIENTS.filter(c => {
      const matchSearch = !searchTerm ||
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchSeg    = filterSeg    === 'all' || c.vehicle.segment    === filterSeg;
      const matchStatus = filterStatus === 'all' || c.contract.status    === filterStatus ||
                          (filterStatus === 'Finance' && c.contract.type === 'Finance');
      return matchSearch && matchSeg && matchStatus;
    });

    const tbody = document.getElementById('client-table-body');
    if(!tbody) return;
    tbody.innerHTML = filtered.map(c => `
      <tr>
        <td><div class="flex items-center gap-8"><div class="avatar avatar--sm">${c.avatar}</div><div><div class="td-name">${c.name}</div><div class="td-muted">${c.email}</div></div></div></td>
        <td>${c.province}</td>
        <td><div>${c.vehicle.model}</div><div class="td-muted">${c.vehicle.year}</div></td>
        <td>${segBadge(c.vehicle.segment)}</td>
        <td>${contractBadge(c.contract.status)}</td>
        <td><div class="flex items-center gap-8"><span style="color:${c.vehicle.health>=80?'var(--success)':c.vehicle.health>=55?'var(--warning)':'var(--danger)'}">●</span>${c.vehicle.health}%</div></td>
        <td>${fmtDate(c.vehicle.nextService)}</td>
        <td><div class="flex gap-8">
          <button class="btn btn--ghost btn--sm" onclick="openClientProfile('${c.id}')">${t('view_btn')}</button>
          <div class="dropdown-wrap">
            <button class="btn btn--primary btn--sm" onclick="toggleDropdown(this)">${t('contact_client')}</button>
            <div class="dropdown-menu">
              <a href="mailto:${c.email}?subject=Mercedes-Benz Montreal — Seguimiento" class="dropdown-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                ${t('send_email')}
              </a>
              <a href="tel:${c.phone ? c.phone.replace(/\\D/g,'') : ''}" class="dropdown-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                ${t('call_client')}
              </a>
            </div>
          </div>
        </div></td>
      </tr>`).join('') || `<tr><td colspan="8" style="text-align:center;color:var(--text-500);padding:24px;">${t('no_clients_match')}</td></tr>`;

    const countEl = document.getElementById('client-count');
    if(countEl) countEl.textContent = filtered.length + ' ' + (filtered.length !== 1 ? t('clients_plural') : t('client_singular'));
  }

  document.getElementById('main-content').innerHTML = `
  <div class="panel-section">
    <div class="page-header-row">
      <div class="page-header"><div class="page-title">${t('client_management')}</div><div class="page-sub">${t('client_portfolio_sub')} · <span id="client-count">${CLIENTS.length} ${t('clients_plural')}</span></div></div>
      <button class="btn btn--primary" onclick="exportClientsCSV()">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        ${t('export_csv')}
      </button>
    </div>
  </div>
  <div class="panel-section">
    <div class="filter-row">
      <div class="search-bar" style="flex:1;min-width:200px;max-width:340px;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input class="search-input" id="client-search" placeholder="${t('search_clients_placeholder')}" oninput="dealerSearchUpdate()" />
      </div>
      <select class="filter-select" id="filter-seg" onchange="dealerFilterUpdate()">
        <option value="all">${t('all_segments')}</option>
        <option value="AMG">AMG</option>
        <option value="EQ">EQ</option>
        <option value="SUV">SUV</option>
        <option value="Sedan">Sedan</option>
      </select>
      <select class="filter-select" id="filter-status" onchange="dealerFilterUpdate()">
        <option value="all">${t('all_statuses')}</option>
        <option value="Active">${t('Active')}</option>
        <option value="Expiring Soon">${t('Expiring Soon')}</option>
        <option value="Finance">${t('finance_option')}</option>
      </select>
    </div>
    <div class="card">
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr><th>${t('th_client')}</th><th>${t('th_province')}</th><th>${t('th_vehicle')}</th><th>${t('th_segment')}</th><th>${t('th_lease_status')}</th><th>${t('th_health')}</th><th>${t('th_next_service')}</th><th>${t('th_actions')}</th></tr>
          </thead>
          <tbody id="client-table-body"></tbody>
        </table>
      </div>
    </div>
  </div>`;
  renderTable();
  window._dealerClientRenderTable = renderTable;
}

window.dealerSearchUpdate = function(){ window._dealerClientRenderTable && window._dealerClientRenderTable(); };
window.dealerFilterUpdate = function(){ window._dealerClientRenderTable && window._dealerClientRenderTable(); };

let DEALER_FOLLOWUPS = null;

function renderDealerFollowup(){
  if (!DEALER_FOLLOWUPS) {
    DEALER_FOLLOWUPS = [
      { id: 0, client:CLIENTS[2], priority:'High',   subject:'Lease expiry — GLE 450', desc:'Contract ends in 9 days. Client interested in GLE 53 AMG upgrade. Urgent renewal discussion needed.', lastContact:'2026-06-01', due:'2026-06-15', status:'Open' },
      { id: 1, client:CLIENTS[3], priority:'High',   subject:'Lease renewal — C 300',  desc:'48-month lease ending Aug 1. Client considering E-Class or GLC. Presentation scheduled.', lastContact:'2026-05-28', due:'2026-06-20', status:'In Progress' },
      { id: 2, client:CLIENTS[6], priority:'Medium', subject:'First annual check-in',  desc:'New lease client (2024). Satisfaction follow-up and MB me connect setup assistance.', lastContact:'2026-05-22', due:'2026-07-01', status:'Completed' },
      { id: 3, client:CLIENTS[0], priority:'Low',    subject:'EQS charging optimization', desc:'Client requested information on Quebec charging incentives and optimal charging schedule.', lastContact:'2026-04-10', due:'2026-07-15', status:'Open' }
    ];
  }
  const followups = DEALER_FOLLOWUPS;
  const pColors = { High:'danger', Medium:'warning', Low:'success' };

  document.getElementById('main-content').innerHTML = `
  <div class="panel-section">
    <div class="page-header"><div class="page-title">${t('postsale_followup_title')}</div><div class="page-sub">${t('postsale_followup_sub')}</div></div>
  </div>
  <div class="panel-section">
    <div class="kpi-grid kpi-grid--3" style="margin-bottom:20px;">
      <div class="kpi-card"><div class="kpi-label">${t('open_followups')}</div><div class="kpi-value">2</div></div>
      <div class="kpi-card"><div class="kpi-label">${t('in_progress_label')}</div><div class="kpi-value">1</div></div>
      <div class="kpi-card"><div class="kpi-label">${t('completed_this_month')}</div><div class="kpi-value">7</div></div>
    </div>
    <div style="display:flex;flex-direction:column;gap:12px;">
      ${followups.map(f => `
        <div class="followup-card">
          <div class="followup-top">
            <div>
              <div class="flex items-center gap-8" style="margin-bottom:4px;">
                <div class="avatar avatar--sm">${f.client.avatar}</div>
                <div class="followup-name">${f.client.name}</div>
                ${badge(t('priority_'+f.priority.toLowerCase()), pColors[f.priority])}
              </div>
              <div style="font-size:0.88rem;font-weight:500;color:var(--text-100);margin-bottom:4px;">${f.subject}</div>
            </div>
            ${badge(t(f.status), f.status==='Completed'?'success':f.status==='In Progress'?'info':'warning')}
          </div>
          <div class="followup-desc">${f.desc}</div>
          <div class="followup-footer">
            <div class="followup-date">${t('last_contact_due').replace('{last}', fmtDate(f.lastContact)).replace('{due}', fmtDate(f.due))}</div>
            <div class="followup-actions">
              <button class="btn btn--secondary btn--sm" onclick="logFollowUpCall(${f.id})">${t('mark_contacted')}</button>
              <button class="btn btn--primary btn--sm" onclick="sendFollowUpEmail(${f.id})">${t('send_email')}</button>
            </div>
          </div>
        </div>`).join('')}
    </div>
  </div>`;
}

function renderDealerRenewals(){
  const renewalClients = CLIENTS.filter(c => c.contract.type==='Lease').map(c => {
    const days = daysUntil(c.contract.end);
    const urgency = days < 60 ? 'danger' : days < 120 ? 'warning' : 'success';
    return {...c, days, urgency };
  }).sort((a,b) => a.days - b.days);

  document.getElementById('main-content').innerHTML = `
  <div class="panel-section">
    <div class="page-header-row">
      <div class="page-header"><div class="page-title">${t('lease_renewals_title')}</div><div class="page-sub">${t('lease_renewals_sub')}</div></div>
      <div class="flex gap-8">
        ${badge(t('urgent_count').replace('{count}','2'),'danger')} ${badge(t('soon_count').replace('{count}','2'),'warning')} ${badge(t('active_count').replace('{count}','2'),'success')}
      </div>
    </div>
  </div>
  <div class="panel-section">
    <div class="card" style="margin-bottom:16px;">
      <div class="card-header"><span class="card-title">${t('renewal_pipeline')}</span></div>
      <div class="card-body">
        ${progressBar(Math.round(renewalClients.filter(c=>c.contract.renewalStatus==='In Progress').length/renewalClients.length*100),'blue',t('renewals_in_progress'),null)}
      </div>
    </div>
    <div>
      ${renewalClients.map(c => `
        <div class="renewal-item">
          <div class="renewal-urgency" style="background:var(--${c.urgency})"></div>
          <div class="avatar avatar--sm" style="margin-right:4px;">${c.avatar}</div>
          <div class="renewal-info">
            <div class="renewal-name">${c.name}</div>
            <div class="renewal-model">${c.vehicle.year} ${c.vehicle.model} · ${c.province}</div>
            <div style="margin-top:4px;">${badge(t(c.contract.renewalStatus),'silver')} ${contractBadge(c.contract.status)}</div>
            ${c.contract.renewalAppointment && c.contract.renewalAppointment.date ? `<div style="margin-top:4px;font-size:0.78rem;color:var(--text-400);">${t('appointment_label').replace('{date}', fmtDate(c.contract.renewalAppointment.date))}</div>` : ''}
          </div>
          <div class="renewal-dates">
            <div class="renewal-end">${fmtDate(c.contract.end)}</div>
            <div class="renewal-days" style="color:var(--${c.urgency})">${c.days > 0 ? t('days_left').replace('{count}', c.days) : t('Expired')}</div>
            <div style="margin-top:6px;">
              ${c.contract.renewalStatus === 'In Progress'
                ? `<button class="btn btn--secondary btn--sm" onclick="openRenewalModal('${c.id}')">${t('edit_renewal')}</button>`
                : `<button class="btn btn--primary btn--sm" onclick="openRenewalModal('${c.id}')">${t('start_renewal')}</button>`}
            </div>
          </div>
        </div>`).join('')}
    </div>
  </div>`;
}

function renderDealerReports(){
  const d = DEALERS.find(x=>x.id==='DLR-QC-01');
  document.getElementById('main-content').innerHTML = `
  <div class="panel-section">
    <div class="page-header"><div class="page-title">${t('reports_metrics')}</div><div class="page-sub">${t('reports_sub')}</div></div>
  </div>
  <div class="panel-section">
    <div class="kpi-grid kpi-grid--4" style="margin-bottom:20px;">
      <div class="kpi-card kpi-card--blue"><div class="kpi-label">${t('nps_score')}</div><div class="kpi-value">${d.nps}</div><div class="kpi-trend kpi-trend--up">↑ +0.3 ${t('vs_q1')}</div></div>
      <div class="kpi-card kpi-card--success"><div class="kpi-label">${t('services_done')}</div><div class="kpi-value">${d.services}</div><div class="kpi-sub">${t('target_label')}: ${d.target}</div></div>
      <div class="kpi-card kpi-card--warning"><div class="kpi-label">${t('avg_response')}</div><div class="kpi-value kpi-value--md">${d.respTime}</div><div class="kpi-sub">SLA: &lt; 3.0h</div></div>
      <div class="kpi-card kpi-card--silver"><div class="kpi-label">${t('renewals_closed')}</div><div class="kpi-value">${d.renewals}</div><div class="kpi-trend kpi-trend--up">↑ +5 ${t('vs_prev')}</div></div>
    </div>
    <div class="grid-2">
      <div class="card">
        <div class="card-header"><span class="card-title">${t('nps_trend_6mo')}</span></div>
        <div class="card-body"><div class="chart-container chart-h-220"><canvas id="chart-nps-trend"></canvas></div></div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title">${t('services_completed_pending')}</span></div>
        <div class="card-body"><div class="chart-container chart-h-220"><canvas id="chart-services-pie"></canvas></div></div>
      </div>
    </div>
  </div>
  <div class="panel-section">
    <div class="card">
      <div class="card-header"><span class="card-title">${t('monthly_services')}</span></div>
      <div class="card-body"><div class="chart-container chart-h-220"><canvas id="chart-monthly-svcs"></canvas></div></div>
    </div>
  </div>`;
  darkChartDefaults();
  setTimeout(() => {
    mkChart('chart-nps-trend',{ type:'line', data:{ labels:['Jan','Feb','Mar','Apr','May','Jun'], datasets:[{ label:'NPS', data:[7.9,8.0,8.1,8.0,8.3,8.4], borderColor:'#3B72C4', backgroundColor:'rgba(59,114,196,0.1)', tension:0.4, fill:true, pointRadius:4, pointBackgroundColor:'#3B72C4' }] }, options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{display:false} }, scales:{ y:{ min:7.0, max:9.5, grid:CHART_DEFAULTS.grid, ticks:CHART_DEFAULTS.ticks }, x:{ grid:CHART_DEFAULTS.grid, ticks:CHART_DEFAULTS.ticks } } } });
    mkChart('chart-services-pie',{ type:'doughnut', data:{ labels:['Completed','Pending'], datasets:[{ data:[d.services, d.target-d.services], backgroundColor:['#10B981','#2B5490'], borderColor:'#141414', borderWidth:2 }] }, options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'bottom', labels:{ color:'#777', font:{ family:'Inter', size:11 } } } }, cutout:'68%' } });
    mkChart('chart-monthly-svcs',{ type:'bar', data:{ labels:['Jan','Feb','Mar','Apr','May','Jun'], datasets:[{ label:'Services', data:[18,24,22,28,25,31], backgroundColor:'rgba(30,58,95,0.7)', borderColor:'#3B72C4', borderWidth:1, borderRadius:4 }] }, options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{display:false} }, scales:{ y:{ grid:CHART_DEFAULTS.grid, ticks:CHART_DEFAULTS.ticks }, x:{ grid:{ display:false }, ticks:CHART_DEFAULTS.ticks } } } });
  }, 80);
}

/* ──────────────────────────────────────────────────────────
   CORPORATE PORTAL — 6 PANELS
────────────────────────────────────────────────────────── */
function renderCorpDashboard(){
  const activity = [
    { text: t('activity_sync_records').replace('{dealer}','Mercedes-Benz Vancouver').replace('{count}','28'), time: t('time_2m_ago'), type:'success' },
    { text: t('activity_renewal_completed').replace('{name}','Liam MacKenzie').replace('{prov}','ON'), time: t('time_14m_ago'), type:'success' },
    { text: t('activity_maintenance_alert').replace('{name}','James Kowalski').replace('{city}','Ottawa'), time: t('time_31m_ago'), type:'warning' },
    { text: t('activity_sync_pending').replace('{dealer}','MB Laval').replace('{count}','47'), time: t('time_1h_ago'), type:'warning' },
    { text: t('activity_inspection_booked').replace('{name}','Olivia Chen').replace('{prov}','BC'), time: t('time_2h_ago'), type:'success' },
    { text: t('activity_profiles_created').replace('{count}','5').replace('{dealer}','MB Calgary'), time: t('time_3h_ago'), type:'success' },
    { text: t('activity_nps_survey').replace('{score}','8.1'), time: t('time_4h_ago'), type:'success' }
  ];

  document.getElementById('main-content').innerHTML = `
  <div class="panel-section">
    <div class="page-header-row">
      <div class="page-header"><div class="page-title">${t('executive_dashboard')}</div><div class="page-sub">${t('national_overview_live')}</div></div>
      <div class="flex items-center gap-8">${badge(t('live_data'),'success')} <span class="text-xs text-muted">${t('updated_ago').replace('{when}',t('time_2m_ago'))}</span></div>
    </div>
  </div>
  <div class="panel-section">
    <div class="kpi-grid kpi-grid--4" style="margin-bottom:20px;">
      <div class="kpi-card kpi-card--blue">
        <div class="kpi-label">${t('registered_clients')}</div>
        <div class="kpi-value">${KPI.totalClients.toLocaleString()}</div>
        <div class="kpi-trend kpi-trend--up">↑ +${KPI.newClientsMonth} ${t('this_month')}</div>
      </div>
      <div class="kpi-card kpi-card--success">
        <div class="kpi-label">${t('dealers_connected')}</div>
        <div class="kpi-value">${KPI.dealersConnected}</div>
        <div class="kpi-sub">${DEALERS.filter(d=>d.sync==='Real-time').length} ${t('real_time_lc')} · ${DEALERS.filter(d=>d.sync==='Pending').length} ${t('pending_lc')}</div>
      </div>
      <div class="kpi-card kpi-card--warning">
        <div class="kpi-label">${t('renewals_pending')}</div>
        <div class="kpi-value">${KPI.renewalsPending}</div>
        <div class="kpi-trend kpi-trend--up">↑ +28 ${t('vs_last_month')}</div>
      </div>
      <div class="kpi-card kpi-card--danger">
        <div class="kpi-label">${t('services_pending')}</div>
        <div class="kpi-value">${KPI.servicesPending}</div>
        <div class="kpi-sub">${t('across_all_dealers')}</div>
      </div>
    </div>
  </div>

  <div class="panel-section">
    <div class="card" style="margin-bottom:20px;">
      <div class="card-header"><span class="card-title">${t('maint_intelligent')} — ${t('fleet_overview')}</span></div>
      <div class="card-body">
        <div class="kpi-grid kpi-grid--3" style="margin-bottom:0;">
          <div class="kpi-card" style="background:rgba(245,158,11,0.05); border:1px solid rgba(245,158,11,0.2);">
            <div class="kpi-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 2v20M2 12h20"/></svg></div>
            <div class="kpi-label">${t('winter_tire_compliance')}</div>
            <div class="kpi-value">${KPI.fleetMaintenance.winterTireCompliance}%</div>
            <div class="kpi-sub">${t('quebec_bc_zones')}</div>
            <div class="kpi-trend kpi-trend--up">↑ +15% ${t('this_week')}</div>
          </div>
          <div class="kpi-card" style="background:rgba(239,68,68,0.05); border:1px solid rgba(239,68,68,0.2);">
            <div class="kpi-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="1.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>
            <div class="kpi-label">${t('critical_fleet_pct')}</div>
            <div class="kpi-value">${KPI.fleetMaintenance.criticalFleetPct}%</div>
            <div class="kpi-sub">${t('vehicles_health_below')}</div>
            <div class="kpi-trend kpi-trend--down">↓ -1.2% ${t('this_month')}</div>
          </div>
          <div class="kpi-card" style="background:rgba(59,114,196,0.05); border:1px solid rgba(59,114,196,0.2);">
            <div class="kpi-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#3B72C4" stroke-width="1.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
            <div class="kpi-label">${t('est_repair_costs')}</div>
            <div class="kpi-value">${fmtMoney(KPI.fleetMaintenance.estRepairCostsCAD)} CAD</div>
            <div class="kpi-sub">${t('pending_national_repairs')}</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="panel-section">
    <div class="grid-2">
      <div class="card" style="grid-column:span 2;">
        <div class="card-header"><span class="card-title">${t('national_trend_clients_services')}</span></div>
        <div class="card-body"><div class="chart-container chart-h-260"><canvas id="chart-exec-trend"></canvas></div></div>
      </div>
    </div>
  </div>
  <div class="panel-section">
    <div class="grid-2">
      <div class="card">
        <div class="card-header"><span class="card-title">${t('national_nps')}</span></div>
        <div class="card-body" style="text-align:center;">
          <div style="font-size:4rem;font-weight:200;color:var(--text-100);letter-spacing:-2px;">${KPI.npsNational}</div>
          <div class="text-xs text-muted" style="text-transform:uppercase;letter-spacing:0.8px;margin-top:4px;">${t('national_average')}</div>
          <div class="kpi-trend kpi-trend--up" style="justify-content:center;margin-top:12px;">↑ +0.2 ${t('vs_q1_2026')}</div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title">${t('activity_feed')}</span></div>
        <div class="card-body--sm">
          <div class="activity-feed">
            ${activity.map(a => `<div class="activity-item">
              <div class="activity-dot activity-dot--${a.type}"></div>
              <div class="activity-text">${a.text}</div>
              <div class="activity-time">${a.time}</div>
            </div>`).join('')}
          </div>
        </div>
      </div>
    </div>
  </div>`;
  darkChartDefaults();
  setTimeout(() => {
    mkChart('chart-exec-trend',{ type:'line', data:{ labels: KPI.monthlyTrend.map(m=>m.month), datasets:[
      { label:'New Clients', data: KPI.monthlyTrend.map(m=>m.clients), borderColor:'#3B72C4', backgroundColor:'rgba(59,114,196,0.12)', tension:0.4, fill:true, yAxisID:'y', pointRadius:4, pointBackgroundColor:'#3B72C4' },
      { label:'Services Completed', data: KPI.monthlyTrend.map(m=>m.services), borderColor:'#10B981', backgroundColor:'rgba(16,185,129,0.08)', tension:0.4, fill:true, yAxisID:'y1', pointRadius:4, pointBackgroundColor:'#10B981' }
    ] }, options:{ responsive:true, maintainAspectRatio:false, interaction:{ mode:'index', intersect:false }, plugins:{ legend:{ position:'bottom', labels:{ color:'#777', font:{ family:'Inter', size:11 }, usePointStyle:true } } }, scales:{ y:{ position:'left', grid:CHART_DEFAULTS.grid, ticks:CHART_DEFAULTS.ticks }, y1:{ position:'right', grid:{ display:false }, ticks:CHART_DEFAULTS.ticks }, x:{ grid:CHART_DEFAULTS.grid, ticks:CHART_DEFAULTS.ticks } } } });
  }, 80);
}

function renderCorpKPIs(){
  const regions = [
    { name:'Ontario',          nps:8.3, dealers:18, clients:1854 },
    { name:'Quebec',           nps:7.9, dealers:12, clients:1220 },
    { name:'British Columbia', nps:8.6, dealers:8,  clients:820  },
    { name:'Alberta',          nps:8.1, dealers:7,  clients:580  },
    { name:'Prairies & East',  nps:7.5, dealers:10, clients:346  }
  ];

  document.getElementById('main-content').innerHTML = `
  <div class="panel-section">
    <div class="page-header"><div class="page-title">${t('national_kpis')}</div><div class="page-sub">${t('progress_strategic_targets')}</div></div>
  </div>
  <div class="panel-section">
    <div class="card" style="margin-bottom:16px;">
      <div class="card-header"><span class="card-title">${t('strategic_targets')}</span>${badge(t('objectives_2026'),'info')}</div>
      <div class="card-body">
        <div style="display:flex;flex-direction:column;gap:20px;">
          ${progressBar(KPI.profileCompleteness.current,'blue',t('client_profile_completeness'),KPI.profileCompleteness.target)}
          ${progressBar(KPI.leasingRetention.current,'warning',t('leasing_retention_rate'),KPI.leasingRetention.target)}
          ${progressBar(KPI.appAdoption.current,'eq',t('mobile_app_adoption'),KPI.appAdoption.target)}
          ${progressBar(KPI.officialServiceRate.current,'success',t('official_dealer_service_rate'),KPI.officialServiceRate.target)}
        </div>
        <div class="divider" style="margin:20px 0;"></div>
        <div class="kpi-grid kpi-grid--4">
          <div class="kpi-card kpi-card--blue" style="padding:14px;">
            <div class="kpi-label">${t('profile_completeness')}</div>
            <div class="kpi-value kpi-value--md">${KPI.profileCompleteness.current}%</div>
            <div class="kpi-sub">↑ ${t('from_40_baseline')}</div>
          </div>
          <div class="kpi-card kpi-card--warning" style="padding:14px;">
            <div class="kpi-label">${t('lease_retention')}</div>
            <div class="kpi-value kpi-value--md">${KPI.leasingRetention.current}%</div>
            <div class="kpi-sub">${t('target_label')}: ${KPI.leasingRetention.target}%</div>
          </div>
          <div class="kpi-card kpi-card--success" style="padding:14px;">
            <div class="kpi-label">${t('app_adoption')}</div>
            <div class="kpi-value kpi-value--md">${KPI.appAdoption.current}%</div>
            <div class="kpi-sub">${t('target_label')}: ${KPI.appAdoption.target}% (${t('year_1')})</div>
          </div>
          <div class="kpi-card kpi-card--silver" style="padding:14px;">
            <div class="kpi-label">${t('official_service_rate')}</div>
            <div class="kpi-value kpi-value--md">${KPI.officialServiceRate.current}%</div>
            <div class="kpi-sub">${t('target_label')}: ${KPI.officialServiceRate.target}%</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="panel-section">
    <div class="card">
      <div class="card-header"><span class="card-title">${t('nps_by_region')}</span><span class="card-badge badge badge--info">${t('national_avg')}: ${KPI.npsNational}</span></div>
      <div class="card-body"><div class="chart-container chart-h-260"><canvas id="chart-nps-region"></canvas></div></div>
    </div>
  </div>`;
  darkChartDefaults();
  setTimeout(() => {
    mkChart('chart-nps-region',{ type:'bar', data:{ labels: regions.map(r=>r.name), datasets:[{ label:'NPS', data: regions.map(r=>r.nps), backgroundColor: regions.map(r => r.nps>=8.5?'rgba(16,185,129,0.7)':r.nps>=7.8?'rgba(59,114,196,0.7)':'rgba(245,158,11,0.7)'), borderColor: regions.map(r => r.nps>=8.5?'#10B981':r.nps>=7.8?'#3B72C4':'#F59E0B'), borderWidth:1, borderRadius:4 }] }, options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{display:false}, tooltip:{ callbacks:{ label: ctx => 'NPS: '+ctx.raw } } }, scales:{ y:{ min:6.5, max:9.5, grid:CHART_DEFAULTS.grid, ticks:CHART_DEFAULTS.ticks }, x:{ grid:{display:false}, ticks:CHART_DEFAULTS.ticks } } } });
  }, 80);
}

function renderCorpMap(){
  document.getElementById('main-content').innerHTML = `
  <div class="panel-section">
    <div class="page-header-row">
      <div class="page-header"><div class="page-title">${t('dealer_network_map')}</div><div class="page-sub">${t('dealer_count_sub')}</div></div>
      <div class="flex gap-8">${badge(DEALERS.filter(d=>d.sync==='Real-time').length+' '+t('real_time_label'),'success')} ${badge(DEALERS.filter(d=>d.sync==='Pending').length+' '+t('pending_label'),'warning')}</div>
    </div>
  </div>
  <div class="panel-section">
    <div class="canada-map-wrap">
      <div class="canada-map-svg-wrap" id="canada-map-container"></div>
      <div class="map-legend">
        <div class="legend-item"><div class="legend-dot legend-dot--green"></div>${t('real_time_sync')}</div>
        <div class="legend-item"><div class="legend-dot legend-dot--yellow"></div>${t('sync_pending')}</div>
        <div class="legend-item"><div class="legend-dot" style="background:var(--text-500)"></div>${t('hover_for_details')}</div>
      </div>
    </div>
  </div>
  <div class="panel-section">
    <div class="card">
      <div class="card-header"><span class="card-title">${t('dealer_summary_by_province')}</span></div>
      <div class="table-wrap">
        <table class="data-table">
          <thead><tr><th>${t('th_province')}</th><th>${t('th_dealers')}</th><th>${t('th_clients')}</th><th>${t('th_avg_nps')}</th><th>${t('th_sync_status')}</th></tr></thead>
          <tbody>
            ${[
              { prov:'Ontario',          code:'ON', count:18, clients:1854, nps:8.2 },
              { prov:'Quebec',           code:'QC', count:12, clients:1220, nps:7.9 },
              { prov:'British Columbia', code:'BC', count:8,  clients:820,  nps:8.5 },
              { prov:'Alberta',          code:'AB', count:7,  clients:580,  nps:8.1 },
              { prov:'Manitoba',         code:'MB', count:3,  clients:192,  nps:7.5 },
              { prov:'Saskatchewan',     code:'SK', count:2,  clients:88,   nps:7.4 },
              { prov:'Nova Scotia',      code:'NS', count:2,  clients:128,  nps:7.9 },
              { prov:'New Brunswick',    code:'NB', count:1,  clients:88,   nps:7.4 },
              { prov:'Newfoundland',     code:'NL', count:1,  clients:78,   nps:7.2 },
              { prov:"Prince Edward Is.",code:'PE', count:1,  clients:42,   nps:7.8 }
            ].map(p => `<tr>
              <td class="td-name">${t('prov_'+p.code)}</td>
              <td>${p.count}</td>
              <td>${p.clients.toLocaleString()}</td>
              <td>${badge(p.nps.toFixed(1), p.nps>=8.4?'success':p.nps>=7.8?'info':'warning')}</td>
              <td>${DEALERS.filter(d=>d.prov===p.code&&d.sync==='Real-time').length}/${p.count} ${badge(t('real_time_label'),'success')}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </div>`;
  buildCanadaMap();
}

function buildCanadaMap(){
  const container = document.getElementById('canada-map-container');
  if(!container) return;
  const W=900, H=510;
  const lonMin=-141, lonMax=-52, latMin=42, latMax=70;
  function toX(lon){ return 40 + (lon-lonMin)/(lonMax-lonMin)*(W-80); }
  function toY(lat){ return 20 + (latMax-lat)/(latMax-latMin)*(H-40); }

  const provPaths = [
    { id:'NU',  d:'M350,22 L350,185 L445,165 L520,105 L600,75 L660,48 L640,22 Z',    label:'NU',  lx:490, ly:110 },
    { id:'NT',  d:'M140,32 L140,220 L348,220 L348,185 L350,22 Z',                      label:'NT',  lx:244, ly:130 },
    { id:'YT',  d:'M56,32 L56,188 L132,188 L155,148 L150,32 Z',                        label:'YT',  lx:96, ly:120 },
    { id:'BC',  d:'M56,188 L56,462 L150,462 L175,395 L168,148 L132,188 Z',             label:'BC',  lx:105, ly:360 },
    { id:'AB',  d:'M168,200 L168,462 L272,462 L272,200 Z',                              label:'AB',  lx:218, ly:370 },
    { id:'SK',  d:'M272,200 L272,462 L370,462 L370,200 Z',                              label:'SK',  lx:319, ly:370 },
    { id:'MB',  d:'M370,195 L370,462 L458,462 L475,400 L475,195 Z',                    label:'MB',  lx:415, ly:365 },
    { id:'ON',  d:'M458,190 L458,465 L525,508 L612,482 L650,422 L660,228 L608,192 Z',  label:'ON',  lx:565, ly:395 },
    { id:'QC',  d:'M608,125 L608,482 L682,448 L725,365 L750,208 L720,118 L680,82 Z',   label:'QC',  lx:672, ly:340 },
    { id:'LAB', d:'M722,120 L722,366 L790,386 L816,314 L844,216 L820,125 L782,88 Z',   label:'NL',  lx:778, ly:240 },
    { id:'NFL', d:'M844,308 L835,395 L873,416 L896,390 L892,312 Z',                     label:'',    lx:872, ly:360 },
    { id:'NB',  d:'M720,358 L720,445 L786,445 L792,382 L748,358 Z',                     label:'NB',  lx:752, ly:412 },
    { id:'NS',  d:'M785,400 L770,465 L810,480 L850,460 L845,415 L812,400 Z',            label:'NS',  lx:810, ly:444 },
    { id:'PE',  d:'M798,368 L798,388 L828,388 L826,368 Z',                              label:'PE',  lx:814, ly:380 }
  ];

  const pins = DEALERS.map(d => ({
    x: Math.round(toX(d.lon)), y: Math.round(toY(d.lat)),
    name: d.name, sync: d.sync, nps: d.nps, id: d.id
  }));

  const svgPaths = provPaths.map(p => `
    <path id="prov-${p.id}" class="province-shape" d="${p.d}" data-tooltip="${p.id}" />
    ${p.label ? `<text class="province-label" x="${p.lx}" y="${p.ly}" text-anchor="middle">${p.label}</text>` : ''}
  `).join('');

  const svgPins = pins.map(p => {
    const color = p.sync==='Real-time' ? 'green' : 'yellow';
    return `<g class="dealer-pin-group" data-dealer="${p.name}">
      <circle class="dealer-pin dealer-pin--ring dealer-pin--ring--${color}" cx="${p.x}" cy="${p.y}" r="8"/>
      <circle class="dealer-pin dealer-pin--${color}" cx="${p.x}" cy="${p.y}" r="4" data-tooltip="${p.name} · NPS ${p.nps}"/>
    </g>`;
  }).join('');

  container.innerHTML = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="width:100%">
    <defs>
      <filter id="glow"><feGaussianBlur stdDeviation="2" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <rect width="${W}" height="${H}" fill="transparent"/>
    ${svgPaths}
    ${svgPins}
  </svg>`;
}

function renderCorpAnalytics(){
  document.getElementById('main-content').innerHTML = `
  <div class="panel-section">
    <div class="page-header"><div class="page-title">Client Analytics</div><div class="page-sub">National distribution, acquisition trends & vehicle data</div></div>
  </div>
  <div class="panel-section">
    <div class="grid-2">
      <div class="card">
        <div class="card-header"><span class="card-title">Client Distribution by Province</span></div>
        <div class="card-body"><div class="chart-container chart-h-260"><canvas id="chart-province-dist"></canvas></div></div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title">New Client Acquisition (2026)</span></div>
        <div class="card-body"><div class="chart-container chart-h-260"><canvas id="chart-new-clients"></canvas></div></div>
      </div>
    </div>
  </div>
  <div class="panel-section">
    <div class="card">
      <div class="card-header"><span class="card-title">Top Models by Registration Volume</span></div>
      <div class="card-body"><div class="chart-container chart-h-220"><canvas id="chart-top-models"></canvas></div></div>
    </div>
  </div>`;
  darkChartDefaults();
  setTimeout(() => {
    mkChart('chart-province-dist',{ type:'doughnut', data:{ labels: KPI.byProvince.map(p=>p.prov), datasets:[{ data: KPI.byProvince.map(p=>p.clients), backgroundColor:['#2B5490','#1E3A5F','#10B981','#F59E0B','#6D28D9','#CC0000','#555'], borderColor:'#141414', borderWidth:2 }] }, options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'right', labels:{ color:'#777', font:{ family:'Inter', size:11 }, generateLabels: (chart) => chart.data.labels.map((l,i) => ({ text:`${l} (${KPI.byProvince[i].pct}%)`, fillStyle: chart.data.datasets[0].backgroundColor[i], strokeStyle:'transparent', index:i })) } } }, cutout:'60%' } });
    mkChart('chart-new-clients',{ type:'line', data:{ labels: KPI.monthlyTrend.map(m=>m.month), datasets:[{ label:'New Clients', data: KPI.monthlyTrend.map(m=>m.clients), borderColor:'#3B72C4', backgroundColor:'rgba(59,114,196,0.15)', tension:0.4, fill:true, pointRadius:5, pointBackgroundColor:'#3B72C4', pointBorderColor:'#141414', pointBorderWidth:2 }] }, options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{display:false} }, scales:{ y:{ grid:CHART_DEFAULTS.grid, ticks:CHART_DEFAULTS.ticks }, x:{ grid:CHART_DEFAULTS.grid, ticks:CHART_DEFAULTS.ticks } } } });
    mkChart('chart-top-models',{ type:'bar', data:{ labels:['GLE 450','C 300','EQS 580','GLS 580','AMG GT 63 S','GLC 300','E 350','EQE 350','A 250','AMG C 63 S'], datasets:[{ label:'Registrations', data:[620,580,445,410,385,360,330,295,280,245], backgroundColor:'rgba(30,58,95,0.7)', borderColor:'#3B72C4', borderWidth:1, borderRadius:4 }] }, options:{ indexAxis:'y', responsive:true, maintainAspectRatio:false, plugins:{ legend:{display:false} }, scales:{ x:{ grid:CHART_DEFAULTS.grid, ticks:CHART_DEFAULTS.ticks }, y:{ grid:{display:false}, ticks:{ color:'#777', font:{ family:'Inter', size:11 } } } } } });
  }, 80);
}

function renderCorpSegmentation(){
  const segs = KPI.bySegment;
  document.getElementById('main-content').innerHTML = `
  <div class="panel-section">
    <div class="page-header"><div class="page-title">Segment Analysis</div><div class="page-sub">AMG · EQ · SUV · Sedan — Performance & distribution</div></div>
  </div>
  <div class="panel-section">
    <div class="segment-cards">
      ${segs.map(s => {
        const cls = s.seg==='AMG'?'amg':s.seg==='EQ'?'eq':s.seg==='SUV'?'suv':'sedan';
        return `<div class="segment-card segment-card--${cls}">
          <div class="segment-card-label segment-card-label--${cls}">${s.seg}</div>
          <div class="segment-card-val">${s.clients.toLocaleString()}</div>
          <div class="segment-card-sub">${s.pct}% of portfolio</div>
          <div style="margin-top:10px;">${progressBar(s.renewalRate,'blue','Renewal Rate',null)}</div>
        </div>`;
      }).join('')}
    </div>
  </div>
  <div class="panel-section">
    <div class="grid-2">
      <div class="card">
        <div class="card-header"><span class="card-title">Portfolio Distribution</span></div>
        <div class="card-body"><div class="chart-container chart-h-260"><canvas id="chart-seg-pie"></canvas></div></div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title">NPS & App Adoption by Segment</span></div>
        <div class="card-body"><div class="chart-container chart-h-260"><canvas id="chart-seg-bar"></canvas></div></div>
      </div>
    </div>
  </div>
  <div class="panel-section">
    <div class="card">
      <div class="card-header"><span class="card-title">Segment Performance Summary</span></div>
      <div class="table-wrap">
        <table class="data-table">
          <thead><tr><th>Segment</th><th>Clients</th><th>Portfolio %</th><th>NPS</th><th>Lease Renewal Rate</th><th>App Adoption</th></tr></thead>
          <tbody>
            ${segs.map(s => `<tr>
              <td>${segBadge(s.seg)}</td>
              <td class="td-name">${s.clients.toLocaleString()}</td>
              <td>${s.pct}%</td>
              <td>${badge(s.nps.toFixed(1), s.nps>=8.8?'success':s.nps>=8.2?'info':'warning')}</td>
              <td>${progressBar(s.renewalRate,'blue','',null)}</td>
              <td>${progressBar(s.appUse,'eq','',null)}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </div>`;
  darkChartDefaults();
  setTimeout(() => {
    mkChart('chart-seg-pie',{ type:'doughnut', data:{ labels: segs.map(s=>s.seg), datasets:[{ data: segs.map(s=>s.clients), backgroundColor:['#CC0000','#00897B','#2B5490','#6D28D9'], borderColor:'#141414', borderWidth:2 }] }, options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'bottom', labels:{ color:'#777', font:{ family:'Inter', size:12 }, padding:16 } } }, cutout:'62%' } });
    mkChart('chart-seg-bar',{ type:'bar', data:{ labels: segs.map(s=>s.seg), datasets:[
      { label:'NPS (×10)', data: segs.map(s=>s.nps*10), backgroundColor:['rgba(204,0,0,0.5)','rgba(0,137,123,0.5)','rgba(43,84,144,0.5)','rgba(109,40,217,0.5)'], borderColor:['#CC0000','#00897B','#3B72C4','#7C3AED'], borderWidth:1, borderRadius:4 },
      { label:'App Adoption %', data: segs.map(s=>s.appUse), backgroundColor:['rgba(204,0,0,0.25)','rgba(0,137,123,0.25)','rgba(43,84,144,0.25)','rgba(109,40,217,0.25)'], borderColor:['#CC0000','#00897B','#3B72C4','#7C3AED'], borderWidth:1, borderRadius:4 }
    ] }, options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'bottom', labels:{ color:'#777', font:{ family:'Inter', size:11 }, usePointStyle:true } } }, scales:{ y:{ grid:CHART_DEFAULTS.grid, ticks:CHART_DEFAULTS.ticks }, x:{ grid:{display:false}, ticks:CHART_DEFAULTS.ticks } } } });
  }, 80);
}

function renderCorpPRM(){
  const ranked = [...DEALERS].sort((a,b) => (b.nps*0.4 + b.renewals*0.35 + (b.services/b.target)*25) - (a.nps*0.4 + a.renewals*0.35 + (a.services/a.target)*25)).slice(0,15);
  const incentives = { 0:'🥇 Gold Partner', 1:'🥇 Gold Partner', 2:'🥈 Silver Partner', 3:'🥈 Silver Partner', 4:'🥈 Silver Partner' };
  const incCls = { 0:'gold', 1:'gold', 2:'silver', 3:'silver', 4:'silver' };

  document.getElementById('main-content').innerHTML = `
  <div class="panel-section">
    <div class="page-header-row">
      <div class="page-header"><div class="page-title">PRM Portal</div><div class="page-sub">Dealer performance ranking & incentive programs</div></div>
      <div class="flex gap-8">${badge('Q2 2026','info')} ${badge('Refreshed Weekly','silver')}</div>
    </div>
  </div>
  <div class="panel-section">
    <div class="kpi-grid kpi-grid--3" style="margin-bottom:20px;">
      <div class="kpi-card kpi-card--blue"><div class="kpi-label">Gold Partners</div><div class="kpi-value">2</div><div class="kpi-sub">Top performing dealers</div></div>
      <div class="kpi-card kpi-card--silver"><div class="kpi-label">Silver Partners</div><div class="kpi-value">3</div><div class="kpi-sub">High performers</div></div>
      <div class="kpi-card"><div class="kpi-label">Avg Dealer NPS</div><div class="kpi-value">${(DEALERS.reduce((s,d)=>s+d.nps,0)/DEALERS.length).toFixed(1)}</div></div>
    </div>
  </div>
  <div class="panel-section">
    <div class="card" style="margin-bottom:20px;">
      <div class="card-header"><span class="card-title">Performance Ranking — Top 15 Dealers</span></div>
      <div class="table-wrap">
        <table class="data-table">
          <thead><tr><th>#</th><th>Dealer</th><th>Province</th><th>NPS</th><th>Renewals</th><th>Service Rate</th><th>Sync</th><th>Recognition</th></tr></thead>
          <tbody>
            ${ranked.map((d,i) => {
              const inc = incentives[i] || '🏅 Standard';
              const cls = incCls[i] || 'std';
              const svRate = Math.round(d.services/d.target*100);
              return `<tr>
                <td><span class="rank-num ${i<2?'gold':i<5?'silver':i<8?'bronze':''}">${i+1}</span></td>
                <td class="td-name">${d.name}</td>
                <td>${badge(d.prov,'silver')}</td>
                <td>${badge(d.nps.toFixed(1), d.nps>=8.5?'success':d.nps>=7.8?'info':'warning')}</td>
                <td>${d.renewals}</td>
                <td>${progressBar(svRate,'blue','',null)}</td>
                <td>${syncBadge(d.sync)}</td>
                <td><span class="incentive-badge incentive-badge--${cls}">${inc}</span></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </div>
  
  <div class="panel-section">
    <div class="card">
      <div class="card-header" style="display:flex; justify-content:space-between; align-items:center;">
        <span class="card-title">${t('network_compliance')}</span>
        ${badge('Target: 90%', 'info')}
      </div>
      <div class="card-body">
        <div class="kpi-grid kpi-grid--3" style="margin-bottom:20px;">
          <div class="kpi-card kpi-card--success">
            <div class="kpi-label">Network Average Score</div>
            <div class="kpi-value">84%</div>
            <div class="kpi-sub">Target: 90% compliance</div>
          </div>
          <div class="kpi-card kpi-card--blue">
            <div class="kpi-label">Top Compliant Region</div>
            <div class="kpi-value" style="font-size:1.4rem; font-weight:700;">British Columbia</div>
            <div class="kpi-sub">95% regional average</div>
          </div>
          <div class="kpi-card kpi-card--warning">
            <div class="kpi-label">Montreal Compliance (DLR-QC-01)</div>
            <div class="kpi-value">87%</div>
            <div class="kpi-sub">13/15 completed certificates</div>
          </div>
        </div>
        
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Dealer</th>
                <th>Region</th>
                <th>Staff Count</th>
                <th>Compliance Score</th>
                <th>Compliance Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="td-name">Mercedes-Benz Vancouver</td>
                <td>BC</td>
                <td>13</td>
                <td>95%</td>
                <td>${badge('Excellent', 'success')}</td>
              </tr>
              <tr>
                <td class="td-name">Mercedes-Benz Toronto Downtown</td>
                <td>ON</td>
                <td>14</td>
                <td>92%</td>
                <td>${badge('Excellent', 'success')}</td>
              </tr>
              <tr>
                <td class="td-name">Mercedes-Benz Montreal</td>
                <td>QC</td>
                <td>15</td>
                <td>87%</td>
                <td>${badge('Good', 'success')}</td>
              </tr>
              <tr>
                <td class="td-name">Mercedes-Benz Calgary</td>
                <td>AB</td>
                <td>11</td>
                <td>81%</td>
                <td>${badge('Needs Attention', 'warning')}</td>
              </tr>
              <tr>
                <td class="td-name">Mercedes-Benz Halifax</td>
                <td>NS</td>
                <td>6</td>
                <td>88%</td>
                <td>${badge('Good', 'success')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>`;
}

/* ──────────────────────────────────────────────────────────
   NEW PRM CAPABILITIES - RENDER FUNCTIONS
   ────────────────────────────────────────────────────────── */

function renderDealerInventory(){
  const inStock = DEALER_INVENTORY.filter(v => v.status === 'In Stock');
  const inTransit = DEALER_INVENTORY.filter(v => v.status === 'In Transit');
  const pendingOrders = DEALER_INVENTORY.filter(v => v.status === 'On Order' || v.status === 'In Transit');
  
  const avgDays = inStock.length > 0 
    ? Math.round(inStock.reduce((acc, v) => acc + v.daysInLot, 0) / inStock.length) 
    : 0;

  document.getElementById('main-content').innerHTML = `
  <div class="panel-section">
    <div class="page-header-row">
      <div class="page-header">
        <div class="page-title">${t('nav_inventory')}</div>
        <div class="page-sub">Mercedes-Benz Montreal · ${t('live_data')}</div>
      </div>
      <div>${badge('Q2 2026', 'info')}</div>
    </div>
  </div>
  
  <div class="panel-section">
    <div class="kpi-grid kpi-grid--3" style="margin-bottom:20px;">
      <div class="kpi-card kpi-card--blue">
        <div class="kpi-label">${t('stock_total')}</div>
        <div class="kpi-value">${inStock.length}</div>
        <div class="kpi-sub">Units on dealership lot</div>
      </div>
      <div class="kpi-card kpi-card--success">
        <div class="kpi-label">${t('stock_transit')}</div>
        <div class="kpi-value">${inTransit.length}</div>
        <div class="kpi-sub">Vehicles en route from port</div>
      </div>
      <div class="kpi-card kpi-card--warning">
        <div class="kpi-label">${t('avg_days_lot')}</div>
        <div class="kpi-value">${avgDays}</div>
        <div class="kpi-sub">Days average aging</div>
      </div>
    </div>
  </div>

  <div class="panel-section">
    <div class="card">
      <div class="card-header"><span class="card-title">Dealership Vehicle Stock</span></div>
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>${t('model_label')}</th>
              <th>${t('year_label')}</th>
              <th>${t('color_label')}</th>
              <th>${t('stock_number')}</th>
              <th>${t('status_label')}</th>
            </tr>
          </thead>
          <tbody>
            ${DEALER_INVENTORY.filter(v => v.status !== 'On Order').map(v => {
              let badgeType = 'silver';
              if (v.status === 'In Stock') badgeType = 'success';
              else if (v.status === 'In Transit') badgeType = 'info';
              else if (v.status === 'Sold') badgeType = 'silver';
              return `
              <tr>
                <td class="td-name">${v.model}</td>
                <td>${v.year}</td>
                <td>${v.color}</td>
                <td class="code-font" style="font-family:monospace; font-size:11px; letter-spacing:0.5px;">${v.vin}</td>
                <td>${badge(t(v.status), badgeType)}</td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <div class="panel-section">
    <div class="card">
      <div class="card-header"><span class="card-title">${t('factory_orders')}</span></div>
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>${t('model_label')}</th>
              <th>${t('color_label')}</th>
              <th>${t('stock_number')}</th>
              <th>${t('status_label')}</th>
              <th>${t('eta_label')}</th>
            </tr>
          </thead>
          <tbody>
            ${pendingOrders.map(v => {
              const statusType = v.status === 'In Transit' ? 'info' : 'warning';
              return `
              <tr>
                <td class="td-name">${v.model}</td>
                <td>${v.color}</td>
                <td class="code-font" style="font-family:monospace; font-size:11px;">${v.vin}</td>
                <td>${badge(t(v.status), statusType)}</td>
                <td><strong>${fmtDate(v.eta) || 'TBD'}</strong></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </div>`;
}

function renderDealerIncentives(){
  const inc = DEALER_INCENTIVES;
  document.getElementById('main-content').innerHTML = `
  <div class="panel-section">
    <div class="page-header-row">
      <div class="page-header">
        <div class="page-title">${t('nav_incentives')}</div>
        <div class="page-sub">Mercedes-Benz Montreal · Performance-Based Commission</div>
      </div>
      <div>${badge(inc.currentTier, 'success')}</div>
    </div>
  </div>

  <div class="panel-section">
    <div class="kpi-grid kpi-grid--3" style="margin-bottom:20px;">
      <div class="kpi-card kpi-card--blue">
        <div class="kpi-label">YTD Commissions Earned</div>
        <div class="kpi-value">${fmtMoney(inc.ytdEarnings)}</div>
        <div class="kpi-sub">Total payouts in 2026</div>
      </div>
      <div class="kpi-card kpi-card--success">
        <div class="kpi-label">${t('next_payout_est')}</div>
        <div class="kpi-value">${fmtMoney(inc.estimatedNextPayment.amount)}</div>
        <div class="kpi-sub">${t('due_date')}: ${fmtDate(inc.estimatedNextPayment.date)}</div>
      </div>
      <div class="kpi-card kpi-card--silver">
        <div class="kpi-label">Recognition Status</div>
        <div class="kpi-value" style="font-size:1.6rem; font-weight:700;">🥈 Silver Partner</div>
        <div class="kpi-sub">National Rank #3</div>
      </div>
    </div>
  </div>

  <div class="panel-section">
    <div class="card" style="margin-bottom:20px;">
      <div class="card-header"><span class="card-title">${t('next_tier_progress')}</span>${badge('85% Completed', 'info')}</div>
      <div class="card-body">
        ${progressBar(inc.progressPct, 'blue', 'Progress toward Gold Partner recognition (Unlock +15% commission multiplier)', 90)}
        <div style="display:flex; justify-content:space-between; margin-top:16px; font-size:0.8rem; color:var(--text-400);">
          <span>Current: <strong>Silver Partner</strong> (Multiplier 1.0x)</span>
          <span>Target: <strong>Gold Partner</strong> (Multiplier 1.15x)</span>
        </div>
      </div>
    </div>
  </div>

  <div class="grid-2">
    <div class="card">
      <div class="card-header"><span class="card-title">${t('payout_breakdown')}</span></div>
      <div class="card-body--sm">
        <div style="display:flex; flex-direction:column; gap:12px; padding:12px;">
          ${inc.breakdown.map(b => `
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border); padding-bottom:8px;">
              <div>
                <div style="font-size:0.85rem; font-weight:600; color:var(--text-100);">${b.category}</div>
                <div style="font-size:0.75rem; color:var(--text-400); margin-top:2px;">${b.detail}</div>
              </div>
              <div style="font-size:0.95rem; font-weight:700; color:var(--success);">${fmtMoney(b.amount)}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
    
    <div class="card">
      <div class="card-header"><span class="card-title">${t('payment_history')}</span></div>
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>${t('date')}</th>
              <th>Category</th>
              <th>Amount</th>
              <th>${t('status_label')}</th>
            </tr>
          </thead>
          <tbody>
            ${inc.history.map(h => `
              <tr>
                <td>${fmtDate(h.date)}</td>
                <td class="td-name">${h.category}</td>
                <td><strong>${fmtMoney(h.amount)}</strong></td>
                <td>${badge(t(h.status), 'success')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </div>`;
}

function renderDealerTraining(){
  const complianceScore = 87;
  const totalCerts = DEALER_TRAINING.length;
  const completedCerts = DEALER_TRAINING.filter(c => c.status === 'Completed').length;
  const expiredCerts = DEALER_TRAINING.filter(c => c.status === 'Expired').length;
  const inProgressCerts = DEALER_TRAINING.filter(c => c.status === 'In Progress').length;

  document.getElementById('main-content').innerHTML = `
  <div class="panel-section">
    <div class="page-header-row">
      <div class="page-header">
        <div class="page-title">${t('nav_training')}</div>
        <div class="page-sub">${t('training_sub')}</div>
      </div>
      <div style="display:flex; align-items:center; gap:16px;">
        <div style="text-align:right;">
          <div style="font-size:0.75rem; color:var(--text-400); text-transform:uppercase;">${t('compliance_score')}</div>
          <div style="font-size:1.1rem; font-weight:700; color:var(--success);">${complianceScore}%</div>
        </div>
        ${ringGauge(complianceScore, 100, 'success', 46)}
      </div>
    </div>
  </div>

  <div class="panel-section">
    <div class="kpi-grid kpi-grid--4" style="margin-bottom:20px;">
      <div class="kpi-card kpi-card--success">
        <div class="kpi-label">${t('completed_certs')}</div>
        <div class="kpi-value">${completedCerts}/${totalCerts}</div>
        <div class="kpi-sub">${t('valid_compliance_items')}</div>
      </div>
      <div class="kpi-card kpi-card--warning">
        <div class="kpi-label">${t('in_progress_label')}</div>
        <div class="kpi-value">${inProgressCerts}</div>
        <div class="kpi-sub">${t('active_training_sessions')}</div>
      </div>
      <div class="kpi-card kpi-card--danger">
        <div class="kpi-label">${t('expired_attention')}</div>
        <div class="kpi-value">${expiredCerts}</div>
        <div class="kpi-sub">${t('require_immediate_renewal')}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${t('national_average')}</div>
        <div class="kpi-value">84%</div>
        <div class="kpi-sub">${t('mb_canada_target')}</div>
      </div>
    </div>
  </div>

  <div class="panel-section">
    <div class="card">
      <div class="card-header"><span class="card-title">${t('required_certifications')}</span></div>
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>${t('staff_member')}</th>
              <th>${t('role_label')}</th>
              <th>${t('course_standard')}</th>
              <th>${t('status_label')}</th>
              <th>${t('expiry_date')}</th>
            </tr>
          </thead>
          <tbody>
            ${DEALER_TRAINING.map(c => {
              let cls = 'silver';
              if (c.status === 'Completed') cls = 'success';
              else if (c.status === 'In Progress') cls = 'warning';
              else if (c.status === 'Expired') cls = 'danger';
              return `
              <tr>
                <td class="td-name">${c.staffName}</td>
                <td>${c.role}</td>
                <td>${c.courseName}</td>
                <td>${badge(t('status_' + c.status.toLowerCase().replace(' ', '_')), cls)}</td>
                <td><strong>${c.date !== '—' ? fmtDate(c.date) : '—'}</strong></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </div>`;
  animateRings();
}

function renderDealerAnnouncements(){
  function drawAnnouncements(filterCat = 'All'){
    const filtered = filterCat === 'All' ? ANNOUNCEMENTS : ANNOUNCEMENTS.filter(a => a.category === filterCat);
    const timelineEl = document.getElementById('announcements-timeline');
    if(!timelineEl) return;
    timelineEl.innerHTML = filtered.map(a => {
      let catCls = 'silver';
      if (a.category === 'Urgent') catCls = 'danger';
      else if (a.category === 'Policy') catCls = 'warning';
      else if (a.category === 'Marketing') catCls = 'info';
      else if (a.category === 'Product') catCls = 'success';
      
      return `
      <div class="card card--glow" style="margin-bottom:16px;">
        <div class="card-header" style="display:flex; justify-content:space-between; align-items:center;">
          <div style="display:flex; align-items:center; gap:10px;">
            ${badge(a.category, catCls)}
            <span style="font-weight:600; color:var(--text-100); font-size:0.95rem;">${a.title}</span>
          </div>
          <span style="font-size:0.75rem; color:var(--text-400);">${fmtDate(a.date)}</span>
        </div>
        <div class="card-body" style="padding:16px 20px;">
          <p style="font-size:0.85rem; color:var(--text-200); line-height:1.6; margin-bottom:12px;">${a.body}</p>
          ${a.link ? `
            <div style="display:flex; align-items:center; gap:6px;">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="var(--blue-light)" stroke-width="1.8" style="width:16px; height:16px;"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
              <a href="#" onclick="downloadAttachment('${a.link}'); return false;" style="font-size:0.78rem; color:var(--blue-light); text-decoration:underline;">${a.link}</a>
            </div>
          ` : ''}
        </div>
      </div>`;
    }).join('') || `<div style="text-align:center; padding:32px; color:var(--text-400);">${t('no_announcements') || 'No announcements available.'}</div>`;
  }

  document.getElementById('main-content').innerHTML = `
  <div class="panel-section">
    <div class="page-header-row">
      <div class="page-header">
        <div class="page-title">${t('nav_announcements')}</div>
        <div class="page-sub">Mercedes-Benz Canada · Corporate Bulletin & Policy Feed</div>
      </div>
      <div>${badge('National Network', 'silver')}</div>
    </div>
  </div>

  <div class="panel-section">
    <div class="filter-row" style="margin-bottom:16px; display:flex; gap:8px;">
      <button class="btn btn--secondary btn--sm announcements-filter-btn active" onclick="filterAnnouncements('All', this)">All Bulletins</button>
      <button class="btn btn--secondary btn--sm announcements-filter-btn" onclick="filterAnnouncements('Urgent', this)">Urgent</button>
      <button class="btn btn--secondary btn--sm announcements-filter-btn" onclick="filterAnnouncements('Policy', this)">Policy</button>
      <button class="btn btn--secondary btn--sm announcements-filter-btn" onclick="filterAnnouncements('Product', this)">Product</button>
      <button class="btn btn--secondary btn--sm announcements-filter-btn" onclick="filterAnnouncements('Marketing', this)">Marketing</button>
    </div>
    <div id="announcements-timeline"></div>
  </div>`;
  
  drawAnnouncements();
  window._filterAnnouncements = drawAnnouncements;
}

window.filterAnnouncements = function(cat, btn){
  document.querySelectorAll('.announcements-filter-btn').forEach(el => el.classList.remove('active'));
  btn.classList.add('active');
  window._filterAnnouncements && window._filterAnnouncements(cat);
};

function renderCorpAnnouncements(){
  function drawCorpTimeline(){
    const listEl = document.getElementById('corp-announcements-list');
    if(!listEl) return;
    listEl.innerHTML = ANNOUNCEMENTS.map(a => {
      let catCls = 'silver';
      if (a.category === 'Urgent') catCls = 'danger';
      else if (a.category === 'Policy') catCls = 'warning';
      else if (a.category === 'Marketing') catCls = 'info';
      else if (a.category === 'Product') catCls = 'success';
      
      return `
      <div class="card" style="margin-bottom:12px;">
        <div class="card-header" style="display:flex; justify-content:space-between; align-items:center;">
          <div style="display:flex; align-items:center; gap:8px;">
            ${badge(a.category, catCls)}
            <span style="font-weight:600; font-size:0.9rem;">${a.title}</span>
          </div>
          <span style="font-size:0.75rem; color:var(--text-400);">${fmtDate(a.date)}</span>
        </div>
        <div class="card-body" style="padding:12px 16px;">
          <p style="font-size:0.82rem; color:var(--text-300); margin-bottom:8px;">${a.body}</p>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:10px; font-size:0.75rem; color:var(--text-400);">
            <span>${t('attachment_label')}: <strong style="color:var(--text-200);">${a.link || 'None'}</strong></span>
            <div style="display:flex; align-items:center; gap:10px;">
              <span>Read: <strong>${a.readCount}/55</strong> dealers</span>
              ${badge(a.engagementRate + '% Engagement', a.engagementRate >= 85 ? 'success' : 'warning')}
            </div>
          </div>
        </div>
      </div>`;
    }).join('');
  }

  document.getElementById('main-content').innerHTML = `
  <div class="panel-section">
    <div class="page-header-row">
      <div class="page-header">
        <div class="page-title">${t('nav_corp_announcements')}</div>
        <div class="page-sub">Mercedes-Benz Canada · Corporate announcement center & analytics</div>
      </div>
      <div>${badge('Corporate Hub', 'info')}</div>
    </div>
  </div>

  <div class="grid-2">
    <div class="card">
      <div class="card-header"><span class="card-title">${t('publish_new')}</span></div>
      <div class="card-body" style="padding:20px;">
        <form id="new-announcement-form" onsubmit="handlePublishAnnouncement(event)">
          <div class="form-group" style="margin-bottom:14px;">
            <label class="form-label" for="ann-title">${t('title_label')}</label>
            <input type="text" id="ann-title" class="form-input" style="padding:10px;" required placeholder="e.g. Summer campaign updates..." />
          </div>
          <div class="form-group" style="margin-bottom:14px;">
            <label class="form-label" for="ann-cat">${t('category_label')}</label>
            <select id="ann-cat" class="form-input" style="padding:10px; background:var(--bg-3);" required>
              <option value="Policy">Policy</option>
              <option value="Marketing">Marketing</option>
              <option value="Product">Product</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
          <div class="form-group" style="margin-bottom:14px;">
            <label class="form-label" for="ann-link">${t('attachment_label')}</label>
            <input type="text" id="ann-link" class="form-input" style="padding:10px;" placeholder="e.g. policy_guide.pdf (Optional)" />
          </div>
          <div class="form-group" style="margin-bottom:16px;">
            <label class="form-label" for="ann-body">${t('body_label')}</label>
            <textarea id="ann-body" class="form-input" rows="4" style="padding:10px; resize:vertical;" required placeholder="Write announcement text here..."></textarea>
          </div>
          <button type="submit" class="login-btn" style="width:100%; margin-top:8px;">
            <span>${t('publish_btn')}</span>
          </button>
        </form>
      </div>
    </div>

    <div class="card">
      <div class="card-header" style="display:flex; justify-content:space-between; align-items:center;">
        <span class="card-title">Published Bulletins</span>
        ${badge('Active bulletins', 'success')}
      </div>
      <div class="card-body--sm" id="corp-announcements-list" style="max-height:480px; overflow-y:auto; padding:12px;"></div>
    </div>
  </div>`;

  drawCorpTimeline();
  window._drawCorpTimeline = drawCorpTimeline;
}

window.handlePublishAnnouncement = function(e){
  e.preventDefault();
  const title = document.getElementById('ann-title').value.trim();
  const category = document.getElementById('ann-cat').value;
  const link = document.getElementById('ann-link').value.trim() || '';
  const body = document.getElementById('ann-body').value.trim();

  if(!title || !body) return;

  const newAnn = {
    id: ANNOUNCEMENTS.length + 1,
    title,
    date: new Date().toISOString().split('T')[0],
    category,
    body,
    link,
    readCount: 1, 
    engagementRate: 2 
  };

  ANNOUNCEMENTS.unshift(newAnn);

  // Send standard push notification
  if (typeof showPushNotification === 'function') {
    showPushNotification('Bulletin Published', {
      message: title,
      type: category === 'Urgent' ? 'danger' : category === 'Policy' ? 'warning' : 'success',
      icon: '📢'
    });
  }

  // Reload corporate bulletins view
  window._drawCorpTimeline && window._drawCorpTimeline();
  
  // Clear the form fields
  document.getElementById('new-announcement-form').reset();
};

/* ──────────────────────────────────────────────────────────
   INIT
────────────────────────────────────────────────────────── */
function init(){
  updateDate();
  darkChartDefaults();
  // Pre-select cliente for demo login and set initial language
  selectRole('cliente');
  if (typeof changeLanguage === 'function') {
    changeLanguage(currentLanguage);
  }

  // Wire up notification button
  const notifBtn = document.getElementById('notif-btn');
  if(notifBtn){
    notifBtn.addEventListener('click', function(e){
      e.stopPropagation();
      toggleNotifPanel();
    });
  }

  // Close panel when clicking outside
  document.addEventListener('click', function(e){
    if(notifPanelOpen){
      const panel = document.getElementById('notif-panel');
      const btn   = document.getElementById('notif-btn');
      if(panel && !panel.contains(e.target) && btn && !btn.contains(e.target)){
        closeNotifPanel();
      }
    }
  });

  document.documentElement.setAttribute('data-theme', 'dark');
  document.documentElement.style.colorScheme = 'dark';
}

/* ══════════════════════════════════════════════════════════════
   ADVANCED FEATURES — Push Notifications & Report Export
══════════════════════════════════════════════════════════════ */

// Push Notifications System
window.notificationQueue = [];
window.notificationSettings = {
  enabled: true,
  pushEnabled: localStorage.getItem('pushNotificationsEnabled') !== 'false',
  emailEnabled: localStorage.getItem('emailNotificationsEnabled') !== 'false',
  smsEnabled: localStorage.getItem('smsNotificationsEnabled') !== 'false'
};

function showPushNotification(title, options = {}) {
  if(!window.notificationSettings.pushEnabled) return;
  
  const notification = {
    id: Date.now(),
    title: title,
    message: options.message || '',
    type: options.type || 'info',
    icon: options.icon || '📬',
    duration: options.duration || 5000,
    timestamp: new Date()
  };
  
  window.notificationQueue.push(notification);
  
  // Desktop notification
  if('Notification' in window && Notification.permission === 'granted'){
    new Notification(title, {
      body: options.message || '',
      icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="47" fill="%23C0C0C0"/><polygon points="50,6 55.5,35.5 84,44 55.5,52 62,82 50,62 38,82 44.5,52 16,44 44.5,35.5" fill="%23080808"/></svg>',
      tag: 'mb-notification',
      requireInteraction: options.type === 'warning' || options.type === 'danger'
    });
  }
  
  // Toast notification in app
  const toast = document.createElement('div');
  toast.style.cssText = `
    position:fixed; bottom:20px; right:20px; z-index:9999;
    background:var(--bg-2); border:1px solid var(--border);
    border-radius:var(--radius-lg); padding:16px 20px;
    box-shadow:var(--shadow-lg); display:flex; align-items:center; gap:12px;
    animation:slideInUp 0.3s ease; max-width:360px;
  `;
  
  const colors = {
    success: '#10B981', warning: '#F59E0B', danger: '#EF4444', info: '#3B82F6'
  };
  const color = colors[notification.type] || colors.info;
  
  toast.innerHTML = `
    <div style="color:${color};font-size:1.4rem;flex-shrink:0;">${notification.icon}</div>
    <div style="flex:1;">
      <div style="font-weight:500;color:var(--text-100);font-size:0.9rem;">${notification.title}</div>
      <div style="color:var(--text-400);font-size:0.8rem;margin-top:2px;">${notification.message}</div>
    </div>
  `;
  
  document.body.appendChild(toast);
  setTimeout(() => { if(toast.parentNode) toast.parentNode.removeChild(toast); }, notification.duration);
}

function requestNotificationPermission(){
  if('Notification' in window && Notification.permission === 'default'){
    Notification.requestPermission();
  }
}

// Export Functions
function exportClientReportPDF(){
  const c = CLIENTS[0];
  const v = c.vehicle;
  const con = c.contract;
  
  let pdfContent = `
═══════════════════════════════════════════════════════════
  MERCEDES-BENZ CANADA — CLIENT VEHICLE REPORT
═══════════════════════════════════════════════════════════

CLIENT INFORMATION
─────────────────────────────────────────────────────────
Name:        ${c.name}
Email:       ${c.email}
Phone:       ${c.phone}
Location:    ${c.city}, ${c.province}
Member Since: ${fmtDate(c.joinDate)}
NPS Score:   ${c.nps}/10

VEHICLE DETAILS
─────────────────────────────────────────────────────────
Model:       ${v.year} ${v.model}
VIN:         ${v.vin}
Segment:     ${v.segment}
Color:       ${v.color}
Odometer:    ${fmtKm(v.mileage)}
Health Score: ${v.health}%
Next Service: ${fmtDate(v.nextService)} (${daysUntil(v.nextService)} days)
Last Service: ${fmtDate(v.lastService)}

WARRANTY STATUS
─────────────────────────────────────────────────────────
Type:           ${v.warranty.type}
Start Date:     ${fmtDate(v.warranty.start)}
End Date:       ${fmtDate(v.warranty.end)}
Mileage Limit:  ${fmtKm(v.warranty.mileageLimit)}
Mileage Used:   ${fmtKm(v.mileage)}
Mileage Remaining: ${fmtKm(v.warranty.mileageLimit - v.mileage)}

LEASING CONTRACT
─────────────────────────────────────────────────────────
Type:         ${con.type}
Duration:     ${con.duration} months (${fmtDate(con.start)} to ${fmtDate(con.end)})
Monthly Payment: ${fmtMoney(con.monthly)}
Status:       ${con.status}
${con.residual ? 'Residual Value: ' + fmtMoney(con.residual) : ''}

SERVICE HISTORY
─────────────────────────────────────────────────────────
${c.services.map((s, i) => `${i+1}. ${s.type}
   Date: ${fmtDate(s.date)} | Dealer: ${s.dealer}
   Status: ${s.status} | Cost: ${s.cost ? fmtMoney(s.cost) : 'TBD'}
`).join('\n')}

COMPONENT STATUS
─────────────────────────────────────────────────────────
${['brakes', 'tires', 'suspension', 'hvac', 'fluids'].map(comp => {
  const c = v.components[comp];
  return c ? `${comp.toUpperCase()}: ${c.life}%` : '';
}).filter(x => x).join('\n')}

REPORT GENERATED
─────────────────────────────────────────────────────────
Date: ${new Date().toLocaleString()}
Time Zone: North America/EST

═══════════════════════════════════════════════════════════
  © 2026 Mercedes-Benz Canada — Confidential
═══════════════════════════════════════════════════════════
`;
  
  downloadFile(pdfContent, 'vehicle-report-' + c.id + '.txt', 'text/plain');
  showPushNotification('Report exported', { 
    message: 'Vehicle report downloaded successfully',
    type: 'success',
    icon: '✓'
  });
}

function exportServiceHistoryCSV(){
  const c = CLIENTS[0];
  let csv = 'Service ID,Date,Type,Dealer,Status,Cost\n';
  
  c.services.forEach(s => {
    csv += `${s.id},"${s.date}","${s.type}","${s.dealer}","${s.status}","${s.cost || 'N/A'}"\n`;
  });
  
  downloadFile(csv, 'service-history-' + c.id + '.csv', 'text/csv');
  showPushNotification('Service history exported', { 
    message: `${c.services.length} service records downloaded`,
    type: 'success',
    icon: '📊'
  });
}

function downloadFile(content, filename, mimeType){
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Request desktop notifications permission on load
requestNotificationPermission();

/* ══════════════════════════════════════════════════════════════
   DARK/LIGHT THEME SYSTEM
══════════════════════════════════════════════════════════════ */
window.themeMode = 'dark';
document.documentElement.setAttribute('data-theme', 'dark');
document.documentElement.style.colorScheme = 'dark';
// Simulate incoming notifications (demo feature)
window.simulateNotifications = function(){

  setTimeout(() => showPushNotification('Renewal Due', { 
    message: 'Lease renewal due tomorrow for client Marc Girard',
    type: 'warning',
    icon: '🔧'
  }), 1000);
  
  setTimeout(() => showPushNotification('Sync Status Update', { 
    message: 'MB Laval dealer sync completed successfully',
    type: 'info',
    icon: '⚡'
  }), 3000);
  
  setTimeout(() => showPushNotification('Performance Update', { 
    message: 'Your dealership moved up the NPS ranking this month',
    type: 'success',
    icon: '💰'
  }), 5000);
};

document.addEventListener('DOMContentLoaded', init);
