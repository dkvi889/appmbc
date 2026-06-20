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
  cliente: {
    email: 'sophia.laurent@mbcanada.com',
    password: 'demo1234',
    name: 'Sophia Laurent',
    roleLabel: 'Client Portal',
    roleDetail: 'Client Portal',
    avatar: 'SL'
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
   NAV CONFIG
────────────────────────────────────────────────────────── */
const NAV = {
  cliente: [
    { id:'c-home',        label:'nav_home',              icon:'home'     },
    { id:'c-myvehicle',   label:'nav_my_vehicle',        icon:'shield'   },
    { id:'c-dashboard',   label:'page_dashboard_title',  icon:'activity' },
    { id:'c-status',      label:'nav_status',            icon:'activity' },
    { id:'c-history',     label:'nav_history',           icon:'clock'    },
    { id:'c-appointment', label:'nav_appointment',       icon:'calendar' },
    { id:'c-warranty',    label:'nav_warranty',          icon:'file'     },
    { id:'c-benefits',    label:'nav_benefits',          icon:'star'     },
    { id:'c-support',     label:'nav_support',           icon:'message'  }
  ],
  corporativo: [
    { id:'corp-dashboard',     label:'nav_exec_dashboard', icon:'grid'    },
    { id:'corp-kpis',          label:'nav_national_kpis',        icon:'target'  },
    { id:'corp-analytics',     label:'nav_client_analytics',     icon:'chart'   },
    { id:'corp-segmentation',  label:'nav_segment_analysis',     icon:'pie'     }
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
  trophy:   `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><polyline points="8 17 12 21 16 17"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"/></svg>`
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
  if(s==='Active') return badge(s,'success');
  if(s==='Expiring Soon') return badge(s,'warning');
  if(s==='Expired') return badge(s,'danger');
  return badge(s,'silver');
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

function renderWeatherContextCard(client){
  const weather = getClientWeather(client);
  const alerts = buildContextualAlerts(client);
  const severity = weather.severity || 'info';
  return `
    <div class="weather-context-card weather-context-card--${severity}">
      <div class="weather-context-main">
        <div>
          <div class="weather-eyebrow">${t('weather_context_title')}</div>
          <div class="weather-location">${client.city}, ${client.province}</div>
          <div class="weather-condition">${weather.condition}</div>
        </div>
        <div class="weather-temperature">${weather.temp}°C</div>
      </div>
      <div class="weather-risk">
        <span>${t('weather_risk_label')}</span>
        <strong>${weather.risk}</strong>
      </div>
      <div class="weather-alert-list">
        ${alerts.map(alert => `
          <div class="weather-alert weather-alert--${alert.type}">
            <span class="weather-alert-dot"></span>
            <div>
              <div class="weather-alert-title">${alert.title}</div>
              <div class="weather-alert-message">${alert.message}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderVehicleHealthSummary(vehicle){
  const items = [
    { key: 'brakes', label: t('comp_brakes'), value: vehicle.components.brakes?.life },
    { key: 'tires', label: t('comp_tires'), value: vehicle.components.tires?.life },
    { key: 'suspension', label: t('comp_suspension'), value: vehicle.components.suspension?.life },
    { key: 'battery', label: t('battery_health'), value: vehicle.battery?.health }
  ].filter(item => item.value !== undefined);

  return `
    <div class="vehicle-health-summary">
      ${items.map(item => {
        const cls = healthColor(item.value);
        return `
          <div class="vehicle-health-row">
            <div class="vehicle-health-label">${item.label}</div>
            <div class="vehicle-health-track"><span class="vehicle-health-fill vehicle-health-fill--${cls}" style="width:${item.value}%"></span></div>
            <div class="vehicle-health-value">${item.value}%</div>
          </div>
        `;
      }).join('')}
    </div>
  `;
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
  const defaultPanel = { cliente:'c-myvehicle', corporativo:'corp-dashboard' };
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
    'c-home':'nav_home','c-myvehicle':'nav_my_vehicle','c-dashboard':'page_dashboard_title','c-status':'nav_status','c-history':'nav_history',
    'c-appointment':'nav_appointment','c-warranty':'nav_warranty',
    'c-benefits':'nav_benefits','c-support':'nav_support',
    'corp-dashboard':'nav_exec_dashboard','corp-kpis':'nav_national_kpis',
    'corp-analytics':'nav_client_analytics','corp-segmentation':'nav_segment_analysis'
  };
  document.getElementById('breadcrumb').textContent = t(labels[panelId] || panelId);
  closeSidebar();

  Object.values(activeCharts).forEach(c => c.destroy());
  activeCharts = {};

  const renderers = {
    'c-home': renderClienteHome, 'c-myvehicle': renderClienteMyVehicle, 'c-dashboard': renderDashboardMaintenancePanel, 'c-status': renderClienteStatus,
    'c-history': renderClienteHistory, 'c-appointment': renderClienteAppointment,
    'c-warranty': renderClienteWarranty, 'c-benefits': renderClienteBenefits,
    'c-support': renderClienteSupport,
    'corp-dashboard': renderCorpDashboard, 'corp-kpis': renderCorpKPIs,
    'corp-analytics': renderCorpAnalytics, 'corp-segmentation': renderCorpSegmentation
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
  cliente: [
    {
      type: 'remind',
      text: 'Service reminder: Annual inspection due in 5 days',
      time: '2h ago'
    },
    {
      type: 'info',
      text: 'Your lease renewal offer is ready to review',
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
   CLIENTE PORTAL — 7 PANELS
────────────────────────────────────────────────────────── */
function renderClienteHome(){
  const c = CLIENTS[0]; // Sophia Laurent
  const v = c.vehicle;
  const con = c.contract;
  const nextSvc = c.services.find(s => s.status==='Scheduled');
  const hc = healthColor(v.health);
  const daysNextRaw = daysUntil(v.nextService);
  const daysNext = daysNextRaw > 0 ? daysNextRaw + 'd' : 'Today';

  document.getElementById('main-content').innerHTML = `
  <div class="dashboard-container">
    <div class="panel-section">
      <div class="page-header">
        <div class="page-title">${t('home_greeting')}, ${c.name.split(' ')[0]}</div>
        <div class="page-sub">${t('home_sub')} · ${fmtDate(new Date().toISOString().slice(0,10))}</div>
      </div>
      ${buildSurveyBannerHTML()}
    </div>

    <div class="panel-section">
      <div class="vehicle-hero">
        <div class="vehicle-hero-top">
          <div>
            <div class="vehicle-model">${v.year} ${v.model}</div>
            <div class="vehicle-year-color">${v.color}</div>
            <div class="vehicle-vin">VIN: ${v.vin}</div>
            <div style="margin-top:10px;">${segBadge(v.segment)} ${badge(t('active_lease'),'success')}</div>
          </div>
          <div class="vehicle-silhouette"><img src="eqs.png" class="vehicle-image" alt="Vehicle" /></div>
        </div>
        <div class="vehicle-stats">
          <div class="vehicle-stat">
            <div class="vehicle-stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 12a9 9 0 1 1 18 0"/><path d="M4.5 12h5.5M14 12l2-4M16.5 8v4"/></svg>
            </div>
            <div class="vehicle-stat-val">${fmtKm(v.mileage)}</div>
            <div class="vehicle-stat-label">${t('odometer')}</div>
          </div>
          <div class="vehicle-stat">
            <div class="vehicle-stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </div>
            <div class="vehicle-stat-val">${badge(v.health+'%', hc)}</div>
            <div class="vehicle-stat-label">${t('health_score')}</div>
          </div>
          <div class="vehicle-stat">
            <div class="vehicle-stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="18" rx="3"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="M9 16l2 2 4-4"/></svg>
            </div>
            <div class="vehicle-stat-val">${daysNext}</div>
            <div class="vehicle-stat-label">${t('next_service')}</div>
          </div>
        </div>
      </div>
    </div>

  <div class="panel-section">
    <div class="grid-2">
      <div class="card">
        <div class="card-header"><span class="card-title">${t('next_appointment')}</span></div>
        <div class="card-body">
          ${nextSvc ? `
            <div class="text-sm" style="color:var(--text-100);font-weight:500;">${nextSvc.type}</div>
            <div class="text-xs text-muted mt-8">${fmtDate(nextSvc.date)}</div>
            <div class="text-xs text-muted mt-8">${nextSvc.dealer}</div>
            <button class="btn btn--secondary btn--sm mt-12" onclick="navigateTo('c-appointment')">${t('view_details')}</button>
          ` : `<div class="text-sm text-muted">${t('no_upcoming')}</div>
            <button class="btn btn--primary btn--sm mt-12" onclick="navigateTo('c-appointment')">${t('schedule_now')}</button>`}
        </div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title">${t('lease_status')}</span></div>
        <div class="card-body">
          <div class="text-xs text-muted mb-8">${t('monthly_payment')}</div>
          <div style="font-size:1.4rem;font-weight:300;color:var(--text-100);">${fmtMoney(con.monthly)}<span style="font-size:0.75rem;color:var(--text-400)">${t('mo')}</span></div>
          <div class="text-xs text-muted mt-8">${t('ends')} ${fmtDate(con.end)}</div>
          <button class="btn btn--ghost btn--sm mt-12" onclick="navigateTo('c-warranty')">${t('view_contract')}</button>
        </div>
      </div>
    </div>
  </div>

  <div class="panel-section">
    <div class="card">
      <div class="card-header"><span class="card-title">${t('battery_status')}</span></div>
      <div class="card-body--sm">
        <div class="battery-card">
          <div class="battery-top">
            <div>
              <div class="battery-label">${t('eq_battery_health')}</div>
              <div class="battery-pct">${v.battery.chargeLevel}%</div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:1.2rem;font-weight:300;color:var(--text-100);">${v.battery.range} km</div>
              <div class="text-xs" style="color:var(--eq);">${t('estimated_range')}</div>
            </div>
          </div>
          <div class="battery-bar-bg"><div class="battery-bar-fill" style="width:${v.battery.chargeLevel}%"></div></div>
          <div class="battery-stats">
            <div><div class="battery-stat-val">${v.battery.health}%</div><div class="battery-stat-label">${t('cell_health')}</div></div>
            <div><div class="battery-stat-val">${v.battery.cycles}</div><div class="battery-stat-label">${t('charge_cycles')}</div></div>
            <div><div class="battery-stat-val">~${Math.round(v.battery.range*v.battery.chargeLevel/100)} km</div><div class="battery-stat-label">${t('available_now')}</div></div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="panel-section">
    <div class="alert-box alert-box--info">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      <div class="alert-content">
        <div class="alert-title">Tire rotation recommended</div>
        <div class="alert-desc">Your tires are at 72% — rotation due within 2,000 km for optimal wear.</div>
      </div>
    </div>
  </div>`;
}

function renderClienteMyVehicle(){
  const c = CLIENTS[0];
  const v = c.vehicle;
  const achievementsHtml = (c.vehicle.achievements || []).length
    ? c.vehicle.achievements.map(a => `<span class="badge badge--success" style="margin-right:8px;">${t(a)}</span>`).join('')
    : `<span class="badge badge--ghost">${t('no_milestones')}</span>`;

  const cabinConfig = v.preheating.cabinConfig || thermalConfigDefaults.cabin;
  const batteryConfig = v.preheating.batteryConfig || thermalConfigDefaults.battery;
  const cabinActive = v.preheating.cabin === true;
  const batteryActive = v.preheating.battery === true;
  const cabinCardClass = cabinActive ? 'preheat-card--active' : 'preheat-card--inactive';
  const batteryCardClass = batteryActive ? 'preheat-card--active' : 'preheat-card--inactive';
  const cabinBtnClass = cabinActive ? 'preheat-btn--active' : '';
  const batteryBtnClass = batteryActive ? 'preheat-btn--active' : '';
  const cabinStateLabel = cabinActive ? t('thermal_state_active') : t('thermal_state_inactive');
  const batteryStateLabel = batteryActive ? t('thermal_state_active') : t('thermal_state_inactive');
  const configTarget = thermalConfigTarget;
  const configOpen = configTarget === 'cabin' || configTarget === 'battery';
  const config = configTarget === 'battery' ? batteryConfig : cabinConfig;
  const configLabel = configTarget === 'battery' ? t('preheating_battery') : t('preheating_cabin');
  const cabinStatus = cabinActive ? `${t('preheating_active')} · ${v.preheating.remaining || v.preheating.timeNeeded}m` : t('preheating_inactive');
  const batteryStatus = batteryActive ? `${t('preheating_active')} · ${v.preheating.remaining || v.preheating.timeNeeded}m` : t('preheating_inactive');
  const cabinButtonLabel = cabinActive ? t('deactivate_preheating') : t('start_preheating');
  const batteryButtonLabel = batteryActive ? t('deactivate_preheating') : t('start_preheating');
  document.getElementById('main-content').innerHTML = `
  <div class="panel-section">
    <div class="page-header">
      <div class="page-title">${t('page_myvehicle_title')} — ${t('page_myvehicle_sub')}</div>
      <div class="page-sub">${v.year} ${v.model} (${v.segment})</div>
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:8px;">${achievementsHtml}</div>
  </div>

  <div class="panel-section">
    <div class="grid-2" style="gap:16px;">
      <div class="card">
        <div class="card-header"><span class="card-title">${t('specs_title')}</span></div>
        <div class="card-body">
          <div class="stat-row">
            <span class="stat-row-key">${t('year_model')}</span>
            <span class="stat-row-val">${v.year} ${v.model}</span>
          </div>
          <div class="stat-row">
            <span class="stat-row-key">${t('vehicle_trim')}</span>
            <span class="stat-row-val">${v.trim}</span>
          </div>
          <div class="stat-row">
            <span class="stat-row-key">${t('vin')}</span>
            <span class="stat-row-val" style="font-family:monospace;font-size:0.85rem;">${v.vin}</span>
          </div>
          <div class="stat-row">
            <span class="stat-row-key">${t('license_plate')}</span>
            <span class="stat-row-val">${v.licensePlate}</span>
          </div>
          <div class="stat-row">
            <span class="stat-row-key">${t('color_exterior')}</span>
            <span class="stat-row-val">${v.color}</span>
          </div>
          <div class="stat-row">
            <span class="stat-row-key">${t('color_interior')}</span>
            <span class="stat-row-val">${v.interiorColor}</span>
          </div>
          <div class="stat-row">
            <span class="stat-row-key">${t('purchase_date')}</span>
            <span class="stat-row-val">${fmtDate(v.purchaseDate)}</span>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><span class="card-title">${t('powertrain_title')}</span></div>
        <div class="card-body">
          <div class="stat-row">
            <span class="stat-row-key">${t('vehicle_type')}</span>
            <span class="stat-row-val">${v.tipo_vehiculo.charAt(0).toUpperCase() + v.tipo_vehiculo.slice(1)}</span>
          </div>
          ${v.specs.displacement !== 'N/A' ? `<div class="stat-row">
            <span class="stat-row-key">${t('displacement')}</span>
            <span class="stat-row-val">${v.specs.displacement}</span>
          </div>` : ''}
          <div class="stat-row">
            <span class="stat-row-key">${t('power')}</span>
            <span class="stat-row-val">${v.specs.horsepower}</span>
          </div>
          <div class="stat-row">
            <span class="stat-row-key">${t('torque')}</span>
            <span class="stat-row-val">${v.specs.torque}</span>
          </div>
          <div class="stat-row">
            <span class="stat-row-key">${t('fuel_type')}</span>
            <span class="stat-row-val">${v.specs.fuelType}</span>
          </div>
          ${v.specs.fuelCapacity !== 'N/A' ? `<div class="stat-row">
            <span class="stat-row-key">${t('tank_capacity')}</span>
            <span class="stat-row-val">${v.specs.fuelCapacity}</span>
          </div>` : ''}
          ${v.specs.batteryCapacity !== 'N/A' ? `<div class="stat-row">
            <span class="stat-row-key">${t('battery_capacity')}</span>
            <span class="stat-row-val">${v.specs.batteryCapacity}</span>
          </div>` : ''}
          <div class="stat-row">
            <span class="stat-row-key">${t('transmission')}</span>
            <span class="stat-row-val">${v.specs.transmission}</span>
          </div>
          <div class="stat-row">
            <span class="stat-row-key">${t('traction')}</span>
            <span class="stat-row-val">${v.specs.traction}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="panel-section">
    <div class="card">
      <div class="card-header"><span class="card-title">${t('equipment_title')}</span></div>
      <div class="card-body">
        <ul style="list-style:none;padding:0;margin:0;">
          ${v.features.map((f, i) => `<li style="padding:8px 0;border-bottom:1px solid var(--border-md);font-size:0.9rem;color:var(--text-200);">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;display:inline;margin-right:8px;color:var(--success);vertical-align:middle;"><polyline points="20 6 9 17 4 12"/></svg>
            ${f}
          </li>`).join('')}
        </ul>
      </div>
    </div>
  </div>

  <div class="panel-section">
    <div class="card">
      <div class="card-header"><span class="card-title">${t('preheating_controls')}</span></div>
      <div class="card-body">
        <div class="preheat-grid">
          <div class="preheat-card ${cabinCardClass}">
            <div class="preheat-icon preheat-icon--cabin">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <!-- Chair/Seat icon -->
                <path d="M6 8h12v2H6z" />
                <path d="M7 10v6c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2v-6" />
                <path d="M5 18h14v2H5z" />
                <circle cx="8" cy="14" r="1.5" fill="currentColor" />
                <circle cx="16" cy="14" r="1.5" fill="currentColor" />
              </svg>
            </div>
            <div class="preheat-card-content">
              <div class="preheat-card-title">${t('preheating_cabin')}</div>
              <div class="preheat-card-desc">${t('preheating_cabin_desc') || 'Climate comfort'}</div>
              <div class="thermal-status-pill ${cabinActive ? 'thermal-status-pill--active' : 'thermal-status-pill--inactive'}">${cabinStateLabel}</div>
              <ul class="thermal-info-list">
                <li class="thermal-info-item"><span>${t('thermal_current_temperature')}</span><span>${v.preheating.cabinTemperature ?? '—'}°C</span></li>
                <li class="thermal-info-item"><span>${t('temperature_setpoint')}</span><span>${cabinConfig.target}°C</span></li>
                <li class="thermal-info-item"><span>${t('thermal_activation_temp')}</span><span>${cabinConfig.activation}°C</span></li>
                <li class="thermal-info-item"><span>${t('last_update')}</span><span>${v.preheating.lastUpdate || t('just_now')}</span></li>
              </ul>
            </div>
            <button class="preheat-btn ${cabinBtnClass}" onclick="startPreheating('cabin')" title="${cabinButtonLabel}" aria-label="${cabinButtonLabel}">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm3.5-9c.8 0 1.5-.7 1.5-1.5S16.3 8 15.5 8 14 8.7 14 9.5s.7 1.5 1.5 1.5zm-7 0c.8 0 1.5-.7 1.5-1.5S9.3 8 8.5 8 7 8.7 7 9.5 7.7 11 8.5 11z"/>
              </svg>
            </button>
          </div>

          <div class="preheat-card ${batteryCardClass}">
            <div class="preheat-icon preheat-icon--battery">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <!-- Battery icon -->
                <rect x="3" y="7" width="18" height="12" rx="2" />
                <path d="M21 8v8" />
                <path d="M7 11h10" stroke-width="2.5" stroke-dasharray="2,2" />
              </svg>
            </div>
            <div class="preheat-card-content">
              <div class="preheat-card-title">${t('preheating_battery')}</div>
              <div class="preheat-card-desc">${t('preheating_battery_desc') || 'Energy optimization'}</div>
              <div class="thermal-status-pill ${batteryActive ? 'thermal-status-pill--active' : 'thermal-status-pill--inactive'}">${batteryStateLabel}</div>
              <ul class="thermal-info-list">
                <li class="thermal-info-item"><span>${t('thermal_current_temperature')}</span><span>${v.preheating.batteryTemperature ?? '—'}°C</span></li>
                <li class="thermal-info-item"><span>${t('temperature_setpoint')}</span><span>${batteryConfig.target}°C</span></li>
                <li class="thermal-info-item"><span>${t('thermal_activation_temp')}</span><span>${batteryConfig.activation}°C</span></li>
                <li class="thermal-info-item"><span>${t('last_update')}</span><span>${v.preheating.lastUpdate || t('just_now')}</span></li>
              </ul>
            </div>
            <button class="preheat-btn ${batteryBtnClass}" onclick="startPreheating('battery')" title="${batteryButtonLabel}" aria-label="${batteryButtonLabel}">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm3.5-9c.8 0 1.5-.7 1.5-1.5S16.3 8 15.5 8 14 8.7 14 9.5s.7 1.5 1.5 1.5zm-7 0c.8 0 1.5-.7 1.5-1.5S9.3 8 8.5 8 7 8.7 7 9.5 7.7 11 8.5 11z"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="preheat-info">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          <span>${t('preheating_ready_in').replace('{minutes}', v.preheating.timeNeeded)}</span>
          <button class="thermal-inline-action" type="button" onclick="openThermalConfig('cabin')">${t('preheating_cabin')}</button>
          <button class="thermal-inline-action" type="button" onclick="openThermalConfig('battery')">${t('preheating_battery')}</button>
        </div>
        ${configOpen ? `
        <div class="thermal-config-panel">
          <div class="thermal-config-header">
            <div>
              <div class="thermal-config-title">${configLabel}</div>
              <div class="thermal-config-note">${t('thermal_config_prompt')}</div>
            </div>
            <button class="thermal-config-close" onclick="closeThermalConfig()" aria-label="${t('close')}">×</button>
          </div>
          <div class="thermal-input-grid">
            <label>${t('thermal_activation_temp')}<input id="${configTarget}-activation-temp" type="number" value="${config.activation}" /></label>
            <label>${t('temperature_setpoint')}<input id="${configTarget}-target-temp" type="number" value="${config.target}" /></label>
            <label>${t('temperature_maximum')}<input id="${configTarget}-max-temp" type="number" value="${config.max}" /></label>
            <label>${t('temperature_minimum')}<input id="${configTarget}-min-temp" type="number" value="${config.min}" /></label>
          </div>
          <div class="thermal-config-footer">
            <button class="btn btn--ghost thermal-config-btn" type="button" onclick="closeThermalConfig()">${t('close')}</button>
            <button class="btn btn--primary thermal-config-btn" type="button" onclick="saveThermalConfig('${configTarget}')">${t('thermal_apply_changes')}</button>
          </div>
        </div>
        ` : ''}
      </div>
    </div>
  </div>

  <div class="panel-section">
    <div class="grid-2" style="gap:16px;">
      <div class="card">
        <div class="card-header"><span class="card-title">${t('weather_context_title')}</span></div>
        <div class="card-body">
          ${renderWeatherContextCard(c)}
        </div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title">${t('component_health_title')}</span></div>
        <div class="card-body">
          ${renderVehicleHealthSummary(v)}
        </div>
      </div>
    </div>
  </div>

  <div class="panel-section">
    <div class="card">
      <div class="card-header"><span class="card-title">Warranty & Ownership</span></div>
      <div class="card-body">
        <div class="stat-row">
          <span class="stat-row-key">Warranty Start</span>
          <span class="stat-row-val">${fmtDate(v.warranty.start)}</span>
        </div>
        <div class="stat-row">
          <span class="stat-row-key">Warranty End</span>
          <span class="stat-row-val">${fmtDate(v.warranty.end)} (${daysUntil(v.warranty.end)} days)</span>
        </div>
        <div class="stat-row">
          <span class="stat-row-key">Mileage Limit</span>
          <span class="stat-row-val">${fmtKm(v.warranty.mileageLimit)}</span>
        </div>
        <div class="stat-row">
          <span class="stat-row-key">Current Mileage</span>
          <span class="stat-row-val">${fmtKm(v.mileage)} (${Math.round((v.mileage/v.warranty.mileageLimit)*100)}% of warranty limit)</span>
        </div>
      </div>
    </div>
  </div>`;
}

function renderClienteStatus(){
  const c = CLIENTS[0];
  const v = c.vehicle;
  const comps = v.components;
  const usage = v.usage || { monthly: 800, weekly_avg: 200 };
  const tipo = v.tipo_vehiculo || 'combustion';

  const getStatus = (comp) => {
    if(!comp) return { class: 'excellent', color: '#10B981', label: t('status_excellent') };
    let life = comp.life;
    let st = { class: 'excellent', color: '#10B981', label: t('status_excellent') };
    if(life < 45 || comp.corrosion_risk) st = { class: 'critical', color: '#EF4444', label: t('status_critical') };
    else if(life < 70) st = { class: 'attention', color: '#F59E0B', label: t('status_attention') };
    else if(life < 85) st = { class: 'good', color: '#34D399', label: t('status_good') };
    return st;
  };

  const buildCard = (id, titleKey, comp, iconSvg, extraAlert = '') => {
    if(!comp) return '';
    const st = getStatus(comp);
    let alertHtml = '';
    if(comp.corrosion_risk) alertHtml += `<div class="maint-alert-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>${t('corrosion_risk')}</div>`;
    if(id === 'tires' && comp.current_set === 'summer') alertHtml += `<div class="maint-alert-badge" style="background:rgba(245,158,11,0.15);color:#F59E0B;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2v20M2 12h20"/></svg>${t('winter_tire_req')}</div>`;
    if(extraAlert) alertHtml += extraAlert;

    return `
    <div class="maint-card" id="card-${id}" onclick="highlightZone('${id}')">
      <div class="maint-card-header">
        <div class="maint-card-title">${t(titleKey)}</div>
        <div class="maint-card-icon status-bg-${st.class} status-color-${st.class}">
          ${iconSvg}
        </div>
      </div>
      <div class="maint-card-value">${comp.life}%</div>
      <div class="maint-card-footer">
        <span class="status-color-${st.class}" style="font-weight:600;">${st.label}</span>
      </div>
      ${alertHtml ? `<div style="display:flex;flex-direction:column;gap:4px;margin-top:4px;">${alertHtml}</div>` : ''}
    </div>`;
  };

  const icOil = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`;
  const icBrake = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/></svg>`;
  const icTire = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2v20M2 12h20"/></svg>`;
  const icSusp = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M8 5h8M8 10h8M8 15h8M8 20h8"/></svg>`;
  const icEngine = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 10v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6L12 4z"/></svg>`;
  const icEv = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`;

  let cardsHtml = '';
  cardsHtml += buildCard('brakes', 'comp_brakes', comps.brakes, icBrake);
  cardsHtml += buildCard('tires', 'comp_tires', comps.tires, icTire);
  cardsHtml += buildCard('suspension', 'comp_suspension', comps.suspension, icSusp);

  if(tipo === 'combustion' || tipo === 'hibrido') {
    cardsHtml += buildCard('oil', 'comp_oil_level', comps.oil_level, icOil);
    cardsHtml += buildCard('engine', 'comp_engine', comps.combustion_engine, icEngine);
    cardsHtml += buildCard('filter', 'comp_engine_filter', comps.engine_air_filter, icEngine);
  }
  if(tipo === 'electrico' || tipo === 'hibrido') {
    cardsHtml += buildCard('motor', 'comp_electric_motor', comps.electric_motor, icEv);
    cardsHtml += buildCard('charging', 'comp_charging_system', comps.charging_system, icEv);
    if(v.battery) {
      let extAlert = '';
      if(v.battery.health < 80) extAlert = `<div class="maint-alert-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>${t('cold_battery_alert')}</div>`;
      cardsHtml += buildCard('battery', 'energy_level', { life: v.battery.health, corrosion_risk: false }, icEv, extAlert);
    }
  }

  document.getElementById('main-content').innerHTML = `
  <div class="panel-section">
    <div class="page-header">
      <div class="page-title">${t('maint_intelligent')}</div>
      <div class="page-sub">${v.year} ${v.model} (${tipo.toUpperCase()}) · ${t('page_status_sub')}: ${fmtDateTime(new Date())}</div>
    </div>
    <div class="status-hero" style="margin-top:20px;text-align:center;">
      <div class="vehicle-silhouette">
        <img src="EQS2.png" class="vehicle-image" alt="EQS Status" />
      </div>
    </div>
  </div>

  <div class="panel-section">
    <div class="maint-diagram-wrapper">
      <div class="maint-diagram">
        <svg viewBox="0 0 100 220" class="maint-car-silhouette" xmlns="http://www.w3.org/2000/svg">
          <path d="M20,40 Q50,10 80,40 L90,180 Q50,210 10,180 Z" fill="rgba(30,58,95,0.7)" stroke="#3B72C4" stroke-width="1.5"/>
          <path d="M30,70 L70,70 L75,110 L25,110 Z" fill="#1E3A5F" opacity="0.8"/>
          <path d="M35,130 L65,130 L70,160 L30,160 Z" fill="#1E3A5F" opacity="0.6"/>
        </svg>

        <div class="maint-zone zone-fl" id="zone-tires" onclick="highlightZone('tires')"><div class="zone-dot status-color-${getStatus(comps.tires).class}"></div></div>
        <div class="maint-zone zone-fr" onclick="highlightZone('tires')"><div class="zone-dot status-color-${getStatus(comps.tires).class}"></div></div>
        <div class="maint-zone zone-rl" onclick="highlightZone('tires')"><div class="zone-dot status-color-${getStatus(comps.tires).class}"></div></div>
        <div class="maint-zone zone-rr" onclick="highlightZone('tires')"><div class="zone-dot status-color-${getStatus(comps.tires).class}"></div></div>
        <div class="maint-zone zone-brakes" id="zone-brakes" onclick="highlightZone('brakes')"><div class="zone-dot status-color-${getStatus(comps.brakes).class}"></div></div>
        <div class="maint-zone zone-engine" id="zone-engine" onclick="highlightZone('engine')"><div class="zone-dot status-color-${tipo==='electrico' ? getStatus(comps.electric_motor).class : getStatus(comps.combustion_engine).class}"></div></div>
      </div>
    </div>
  </div>

  <div class="panel-section">
    <div class="maint-grid">
      ${cardsHtml}
    </div>
  </div>

  <div class="panel-section">
    <div class="usage-chart-wrap">
      <div class="usage-chart-header">
        <div>
          <div class="usage-chart-title">${t('usage_monthly')}</div>
          <div class="usage-chart-sub">${t('usage_weekly')}: ${usage.weekly_avg} ${t('usage_km')}</div>
        </div>
        <div class="usage-chart-val">${usage.monthly} ${t('usage_km')}</div>
      </div>
      <div class="usage-bar-bg"><div class="usage-bar-fill" style="width:${Math.min((usage.monthly / 2500)*100, 100)}%"></div></div>
    </div>
  </div>
  `;

  window.highlightZone = function(zoneId) {
    document.querySelectorAll('.maint-card').forEach(el => el.classList.remove('active-card'));
    document.querySelectorAll('.maint-zone').forEach(el => el.classList.remove('active'));
    
    let card = document.getElementById('card-' + zoneId);
    let zone = document.getElementById('zone-' + zoneId);
    if(card) card.classList.add('active-card');
    if(zone) zone.classList.add('active');
  };
}

function renderClienteHistory(){
  const c = CLIENTS[0];
  const svcs = [...c.services].sort((a,b) => new Date(b.date) - new Date(a.date));

  document.getElementById('main-content').innerHTML = `
  <div class="panel-section">
    <div class="page-header">
      <div class="page-title">${t('page_history_title')}</div>
      <div class="page-sub">${c.vehicle.model} · ${svcs.length} ${t('records')}</div>
    </div>
    <div style="display:flex;gap:8px;margin-top:12px;">
      <button class="btn btn--primary btn--sm" onclick="exportServiceHistoryCSV()" style="display:flex;align-items:center;gap:6px;justify-content:center;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Export as CSV
      </button>
      <button class="btn btn--ghost btn--sm" onclick="exportClientReportPDF()" style="display:flex;align-items:center;gap:6px;justify-content:center;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Export Report
      </button>
    </div>
  </div>
  <div class="panel-section">
    <div class="card">
      <div class="card-body">
        <div class="timeline">
          ${svcs.map(s => {
            const dot = s.status==='Completed' ? 'success' : s.status==='Scheduled' ? 'warning' : 'muted';
            const cost = s.cost === 0 ? 'Complimentary' : s.cost ? fmtMoney(s.cost) : 'TBD';
            return `<div class="timeline-item">
              <div class="timeline-dot timeline-dot--${dot}"></div>
              <div class="timeline-content">
                <div class="timeline-title">${s.type}</div>
                <div class="timeline-sub">${s.dealer}</div>
                <div class="timeline-sub" style="margin-top:4px;">${badge(t(s.status.toLowerCase())||s.status, dot==='success'?'success':dot==='warning'?'warning':'silver')} · ${cost}</div>
              </div>
              <div class="timeline-date">${fmtDate(s.date)}</div>
            </div>`;
          }).join('')}
        </div>
      </div>
    </div>
  </div>`;
}

function renderClienteAppointment(){
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const { year, month, selected } = calendarState;
  const firstDay = new Date(year, month-1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const today = new Date(); const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
  const unavailDays = [6,7,10,14,17,20,22,27];
  const times = ['09:00','09:30','10:00','10:30','11:00','11:30','14:00','14:30','15:00','15:30','16:00'];
  const bookedTimes = ['09:30','11:00','14:30'];

  let cells = '';
  for(let i=0;i<firstDay;i++) cells += `<div class="cal-day empty"></div>`;
  for(let d=1;d<=daysInMonth;d++){
    const dStr = `${year}-${String(month).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const isToday = dStr===todayStr, isSelected = dStr===selected;
    const isUnavail = unavailDays.includes(d) || new Date(dStr) < today;
    const cls = isSelected?'selected':isToday?'today':isUnavail?'unavail':'available';
    const onclick = isUnavail?'':'onclick="selectCalDay(\''+dStr+'\')"';
    cells += `<div class="cal-day ${cls}" ${onclick}>${d}</div>`;
  }

  document.getElementById('main-content').innerHTML = `
  <div class="panel-section">
    <div class="page-header">
      <div class="page-title">${t('page_appt_title')}</div>
      <div class="page-sub">Mercedes-Benz Montreal · ${t('page_appt_sub')}</div>
    </div>
  </div>
  <div class="panel-section">
    <div class="grid-2">
      <div class="card">
        <div class="card-header">
          <div class="cal-nav" style="width:100%">
            <button class="cal-btn" onclick="changeCalMonth(-1)"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg></button>
            <span class="cal-month">${months[month-1]} ${year}</span>
            <button class="cal-btn" onclick="changeCalMonth(1)"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg></button>
          </div>
        </div>
        <div class="card-body">
          <div class="cal-grid">
            ${['Su','Mo','Tu','We','Th','Fr','Sa'].map(d=>`<div class="cal-dow">${d}</div>`).join('')}
            ${cells}
          </div>
          ${selected ? `<div style="margin-top:12px;font-size:0.78rem;color:var(--text-300);">
            ${t('selected_date')}: <strong style="color:var(--text-100);">${fmtDate(selected)}</strong>
          </div>
          <div class="time-slots">
            ${times.map(t_str => {
              const booked = bookedTimes.includes(t_str);
              const isSelTime = t_str === calendarState.selectedTime;
              return `<div class="time-slot ${booked?'booked':isSelTime?'selected':''}" ${booked?'':'onclick="selectTime(\''+t_str+'\')"'}>${t_str}</div>`;
            }).join('')}
          </div>` : `<div style="margin-top:16px;text-align:center;font-size:0.78rem;color:var(--text-500);">${t('select_date_prompt')}</div>`}
        </div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title">${t('appt_details')}</span></div>
        <div class="card-body">
          <div class="form-group mb-12">
            <label class="form-label">${t('service_type')}</label>
            <select class="form-select">
              <option>Annual Inspection</option>
              <option>Oil & Filter Change</option>
              <option>Tire Rotation</option>
              <option>Brake Service</option>
              <option>OTA Software Update</option>
              <option>Other / Custom Request</option>
            </select>
          </div>
          <div class="form-group mb-12">
            <label class="form-label">${t('dealership')}</label>
            <select class="form-select">
              <option>Mercedes-Benz Montreal (Preferred)</option>
              <option>Mercedes-Benz Laval</option>
              <option>Mercedes-Benz Saint-Laurent</option>
            </select>
          </div>
          <div class="form-group mb-12">
            <label class="form-label">${t('notes')}</label>
            <textarea class="form-textarea" placeholder="${t('notes_ph')}"></textarea>
          </div>
          <div class="stat-row">
            <span class="stat-row-key">${t('date')}</span>
            <span class="stat-row-val">${selected ? fmtDate(selected) : t('not_selected')}</span>
          </div>
          <div class="stat-row">
            <span class="stat-row-key">${t('time')}</span>
            <span class="stat-row-val">${calendarState.selectedTime || t('not_selected')}</span>
          </div>
          <div class="stat-row">
            <span class="stat-row-key">${t('vehicle')}</span>
            <span class="stat-row-val">${CLIENTS[0].vehicle.model}</span>
          </div>
          <button class="btn btn--primary w-full mt-16" onclick="bookAppointment()" style="justify-content:center;"
            ${(!selected || !calendarState.selectedTime) ? 'disabled style="opacity:0.5;cursor:not-allowed;justify-content:center;"':''}>
            ${t('confirm_appt')}
          </button>
        </div>
      </div>
    </div>
  </div>`;
}

function selectCalDay(d){ calendarState.selected = d; calendarState.selectedTime = null; renderClienteAppointment(); }
function changeCalMonth(dir){ calendarState.month += dir; if(calendarState.month>12){calendarState.month=1;calendarState.year++;} if(calendarState.month<1){calendarState.month=12;calendarState.year--;} renderClienteAppointment(); }
function selectTime(t){ calendarState.selectedTime = t; renderClienteAppointment(); }
function bookAppointment(){
  const btn = document.querySelector('.main-content .btn--primary[onclick="bookAppointment()"]');
  const msg = document.createElement('div');
  msg.style.cssText = 'margin-top:12px;padding:10px 14px;background:var(--success-dim);border:1px solid rgba(16,185,129,0.25);border-radius:var(--radius-md);color:var(--success);font-size:0.82rem;display:flex;align-items:center;gap:8px;';
  msg.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;flex-shrink:0"><polyline points="20 6 9 17 4 12"/></svg><span>Appointment confirmed for <strong>' + fmtDate(calendarState.selected) + '</strong> at <strong>' + calendarState.selectedTime + '</strong> — Mercedes-Benz Montreal.</span>';
  if(btn) btn.parentNode.insertBefore(msg, btn.nextSibling);
  setTimeout(() => { if(msg.parentNode) msg.parentNode.removeChild(msg); }, 5000);
}

function renderClienteWarranty(){
  const c = CLIENTS[0];
  const v = c.vehicle;
  const con = c.contract;
  const warr = v.warranty;
  const leaseTotal = (new Date(con.end) - new Date(con.start)) / 86400000;
  const leaseElapsed = (new Date() - new Date(con.start)) / 86400000;
  const leasePct = Math.min(100, Math.round(leaseElapsed/leaseTotal*100));
  const warrantyTotal = (new Date(warr.end) - new Date(warr.start)) / 86400000;
  const warrantyElapsed = (new Date() - new Date(warr.start)) / 86400000;
  const warrantyPct = Math.min(100, Math.round(warrantyElapsed/warrantyTotal*100));

  document.getElementById('main-content').innerHTML = `
  <div class="panel-section">
    <div class="page-header"><div class="page-title">${t('page_warr_title')}</div><div class="page-sub">${t('page_warr_sub')}</div></div>
  </div>
  <div class="panel-section">
    <div class="card" style="margin-bottom:16px;">
      <div class="card-header"><span class="card-title">${t('lease_agreement')}</span>${contractBadge(con.status)}</div>
      <div class="card-body">
        <div class="grid-2" style="margin-bottom:20px;">
          <div><div class="text-xs text-muted mb-8">${t('monthly_payment')}</div><div style="font-size:1.6rem;font-weight:300;color:var(--text-100);">${fmtMoney(con.monthly)}<span style="font-size:0.75rem;color:var(--text-400)">${t('mo')}</span></div></div>
          <div><div class="text-xs text-muted mb-8">${t('residual_val')}</div><div style="font-size:1.6rem;font-weight:300;color:var(--text-100);">${fmtMoney(con.residual)}</div></div>
        </div>
        <div class="lease-timeline">
          <div style="margin-bottom:8px;font-size:0.72rem;color:var(--text-400);">${t('lease_progress')} · ${leasePct}%</div>
          <div class="lease-bar-bg"><div class="lease-bar-fill" style="width:${leasePct}%"></div></div>
          <div class="lease-dates">
            <span class="lease-date-label">${t('start')}: ${fmtDate(con.start)}</span>
            <span class="lease-date-label">${t('end')}: ${fmtDate(con.end)}</span>
          </div>
        </div>
        <div class="divider"></div>
        <div class="stat-row"><span class="stat-row-key">${t('contract_type')}</span><span class="stat-row-val">${con.type}</span></div>
        <div class="stat-row"><span class="stat-row-key">${t('duration')}</span><span class="stat-row-val">${con.duration} ${t('months')}</span></div>
        <div class="stat-row"><span class="stat-row-key">${t('annual_km')}</span><span class="stat-row-val">${fmtKm(con.annualKm)}</span></div>
        <div class="stat-row"><span class="stat-row-key">${t('km_used')}</span><span class="stat-row-val">${fmtKm(Math.round(v.mileage*0.62))}</span></div>
        <div class="stat-row"><span class="stat-row-key">${t('renewal_status')}</span><span class="stat-row-val">${badge(con.renewalStatus,'silver')}</span></div>
        <button class="btn btn--primary mt-16" onclick="alert('Connecting you with your advisor...')">${t('explore_renewal')}</button>
      </div>
    </div>
  </div>
  <div class="panel-section">
    <div class="card">
      <div class="card-header"><span class="card-title">${t('warranty_coverage')}</span>${badge(t('active'),'success')}</div>
      <div class="card-body">
        <div class="lease-timeline">
          <div style="margin-bottom:8px;font-size:0.72rem;color:var(--text-400);">${t('warranty_period')} · ${warrantyPct}% ${t('elapsed')}</div>
          <div class="lease-bar-bg"><div class="lease-bar-fill" style="width:${warrantyPct}%;background:linear-gradient(90deg,var(--eq),#4DB6AC)"></div></div>
          <div class="lease-dates">
            <span class="lease-date-label">${t('start')}: ${fmtDate(warr.start)}</span>
            <span class="lease-date-label">${t('end')}: ${fmtDate(warr.end)}</span>
          </div>
        </div>
        <div class="divider"></div>
        <div class="stat-row"><span class="stat-row-key">${t('type')}</span><span class="stat-row-val">${warr.type}</span></div>
        <div class="stat-row"><span class="stat-row-key">${t('mileage_limit')}</span><span class="stat-row-val">${fmtKm(warr.mileageLimit)}</span></div>
        <div class="stat-row"><span class="stat-row-key">${t('mileage_rem')}</span><span class="stat-row-val">${fmtKm(warr.mileageLimit - v.mileage)}</span></div>
        <div class="stat-row"><span class="stat-row-key">${t('expires')}</span><span class="stat-row-val">${fmtDate(warr.end)} (${daysUntil(warr.end)} ${t('days')})</span></div>
      </div>
    </div>
  </div>`;
}

function renderClienteBenefits(){
  const events = [
    { icon:'🏎️', color:'var(--amg-dim)', label:'AMG Exclusive', title:'AMG Track Experience — Mosport', desc:'An exclusive day on track with AMG performance vehicles. Instructors provided.', date:'August 14, 2026', tag:'AMG Event', tagClass:'amg' },
    { icon:'âš¡', color:'var(--eq-dim)', label:'EQ Owners', title:'EQ Charging Summit — Montreal', desc:'Join fellow EV owners for a deep-dive on charging infrastructure and range optimization.', date:'July 28, 2026', tag:'EQ Community', tagClass:'eq' },
    { icon:'🥂', color:'rgba(192,192,192,0.06)', label:'Premier Members', title:'MB Canada Gala — Toronto', desc:'Annual celebration of excellence for Mercedes-Benz Canada\'s top clients.', date:'September 19, 2026', tag:'VIP', tagClass:'silver' },
    { icon:'🛡️', color:'var(--info-dim)', label:'Service Offer', title:'Complimentary Detailing Package', desc:'Exclusive offer for lease clients: one complimentary premium interior & exterior detail.', date:'Valid until Dec 2026', tag:'Exclusive Offer', tagClass:'info' },
    { icon:'🌍', color:'rgba(30,58,95,0.2)', label:'MB Experience', title:'EQ World Tour — Vancouver', desc:'Experience the full EQ lineup in a guided tour across scenic BC routes.', date:'October 4, 2026', tag:'EQ Experience', tagClass:'suv' },
    { icon:'🏔️', color:'rgba(109,40,217,0.1)', label:'Adventure Series', title:'GLE Off-Road Challenge', desc:'Discover the limits of your GLE with expert 4×4 trails in the Rockies.', date:'October 18, 2026', tag:'SUV Event', tagClass:'sedan' }
  ];

  document.getElementById('main-content').innerHTML = `
  <div class="panel-section">
    <div class="page-header"><div class="page-title">${t('page_ben_title')}</div><div class="page-sub">${t('page_ben_sub')}</div></div>
  </div>
  <div class="panel-section">
    <div class="benefit-cards">
      ${events.map(ev => `
        <div class="benefit-card">
          <div class="benefit-card-img" style="background:${ev.color};font-size:3rem;">${ev.icon}</div>
          <div class="benefit-card-body">
            <div class="benefit-card-label" style="color:var(--text-400);">${ev.label}</div>
            <div class="benefit-card-title">${ev.title}</div>
            <div class="benefit-card-desc">${ev.desc}</div>
            <div class="benefit-card-date">📅 ${ev.date}</div>
            <div style="margin-top:10px;">${badge(ev.tag, ev.tagClass)}</div>
          </div>
        </div>`).join('')}
    </div>
  </div>`;
}

function renderClienteSupport(){
  const c = CLIENTS[0];
  document.getElementById('main-content').innerHTML = `
  <div class="panel-section">
    <div class="page-header"><div class="page-title">${t('page_sup_title')}</div><div class="page-sub">${t('page_sup_sub')} · Mercedes-Benz Montreal</div></div>
  </div>
  <div class="panel-section">
    <div class="grid-2">
      <div class="card">
        <div class="card-header"><span class="card-title">${t('contact_advisor')}</span></div>
        <div class="card-body">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
            <div class="avatar avatar--lg" style="background:var(--blue);">MT</div>
            <div><div style="font-weight:500;color:var(--text-100);">Marc Tremblay</div><div class="text-xs text-muted">Senior Service Advisor</div><div class="text-xs text-muted">Mercedes-Benz Montreal</div></div>
          </div>
          <div class="form-group mb-12">
            <label class="form-label">${t('subject')}</label>
            <select class="form-select"><option>Service Inquiry</option><option>Lease Question</option><option>Vehicle Issue</option><option>Other</option></select>
          </div>
          <div class="form-group mb-12">
            <label class="form-label">${t('message')}</label>
            <textarea class="form-textarea" placeholder="${t('message_ph')}"></textarea>
          </div>
          <button class="btn btn--primary w-full" style="justify-content:center;" onclick="alert('Message sent! Your advisor will respond within 2 hours.')">${t('send_message')}</button>
          <div style="margin-top:10px;text-align:center;"><a href="tel:+15148923000" class="btn btn--ghost btn--sm w-full" style="justify-content:center;">📞 ${t('call_dealer')}</a></div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title">${t('recent_interactions')}</span></div>
        <div class="card-body--sm">
          ${c.interactions.map(i => {
            const icons = { Email:'email', Call:'message', App:'shield', Visit:'home' };
            const cls = { Email:'email', Call:'call', App:'app', Visit:'visit' };
            const badgeType = i.status==='Resolved'?'success':i.status==='Open'?'warning':'silver';
            return `<div class="ticket-item">
              <div class="ticket-icon ticket-icon--${cls[i.type]||'email'}">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  ${i.type==='Email'?'<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>':
                    i.type==='Call'?'<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.64 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.57 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>':
                    '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>'}
                </svg>
              </div>
              <div class="ticket-content" style="flex:1">
                <div class="ticket-title">${i.subject}</div>
                <div class="ticket-meta">${i.type} · ${fmtDate(i.date)}</div>
              </div>
              ${badge(i.status, badgeType)}
            </div>`;
          }).join('')}
        </div>
      </div>
    </div>
  </div>`;
}

/* ──────────────────────────────────────────────────────────
   CORPORATE PORTAL — 6 PANELS
────────────────────────────────────────────────────────── */
function renderCorpDashboard(){
  const activity = [
    { text:'New lease renewal completed — <strong>Liam MacKenzie</strong> · ON', time:'14m ago', type:'success' },
    { text:'Maintenance alert triggered — <strong>James Kowalski</strong> · Ottawa', time:'31m ago', type:'warning' },
    { text:'<strong>Olivia Chen</strong> booked pre-lease-end inspection — BC', time:'2h ago', type:'success' },
    { text:'5 new client profiles created this week', time:'3h ago', type:'success' },
    { text:'NPS survey completed — National average: <strong>8.1</strong>', time:'4h ago', type:'success' }
  ];

  document.getElementById('main-content').innerHTML = `
  <div class="panel-section">
    <div class="page-header-row">
      <div class="page-header"><div class="page-title">Executive Dashboard</div><div class="page-sub">Mercedes-Benz Canada · National overview · Live</div></div>
      <div class="flex items-center gap-8">${badge(t('live_data'),'success')} <span class="text-xs text-muted">${t('updated_ago').replace('{when}','2m ago')}</span></div>
    </div>
  </div>
  <div class="panel-section">
    <div class="kpi-grid kpi-grid--4" style="margin-bottom:20px;">
      <div class="kpi-card kpi-card--blue">
        <div class="kpi-label">Registered Clients</div>
        <div class="kpi-value">${KPI.totalClients.toLocaleString()}</div>
        <div class="kpi-trend kpi-trend--up">↑ +${KPI.newClientsMonth} this month</div>
      </div>
      <div class="kpi-card kpi-card--success">
        <div class="kpi-label">App Adoption</div>
        <div class="kpi-value">${KPI.appAdoption.current}%</div>
        <div class="kpi-sub">Target: ${KPI.appAdoption.target}% Year 1</div>
      </div>
      <div class="kpi-card kpi-card--warning">
        <div class="kpi-label">Renewals Pending</div>
        <div class="kpi-value">${KPI.renewalsPending}</div>
        <div class="kpi-trend kpi-trend--up">↑ +28 vs last month</div>
      </div>
      <div class="kpi-card kpi-card--danger">
        <div class="kpi-label">Services Pending</div>
        <div class="kpi-value">${KPI.servicesPending}</div>
        <div class="kpi-sub">Across all dealers</div>
      </div>
    </div>
  </div>

  <div class="panel-section">
    <div class="card" style="margin-bottom:20px;">
      <div class="card-header"><span class="card-title">${t('maint_intelligent')} — ${t('fleet_overview') || 'Fleet Maintenance Overview'}</span></div>
      <div class="card-body">
        <div class="kpi-grid kpi-grid--3" style="margin-bottom:0;">
          <div class="kpi-card" style="background:rgba(245,158,11,0.05); border:1px solid rgba(245,158,11,0.2);">
            <div class="kpi-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 2v20M2 12h20"/></svg></div>
            <div class="kpi-label">${t('winter_tire_compliance') || 'Winter Tire Compliance'}</div>
            <div class="kpi-value">${KPI.fleetMaintenance.winterTireCompliance}%</div>
            <div class="kpi-sub">Quebec & BC Mandatory Zones</div>
            <div class="kpi-trend kpi-trend--up">↑ +15% this week</div>
          </div>
          <div class="kpi-card" style="background:rgba(239,68,68,0.05); border:1px solid rgba(239,68,68,0.2);">
            <div class="kpi-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="1.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>
            <div class="kpi-label">${t('critical_fleet_pct') || 'Critical Fleet %'}</div>
            <div class="kpi-value">${KPI.fleetMaintenance.criticalFleetPct}%</div>
            <div class="kpi-sub">Vehicles Health &lt; 45%</div>
            <div class="kpi-trend kpi-trend--down">↓ -1.2% this month</div>
          </div>
          <div class="kpi-card" style="background:rgba(59,114,196,0.05); border:1px solid rgba(59,114,196,0.2);">
            <div class="kpi-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#3B72C4" stroke-width="1.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
            <div class="kpi-label">${t('est_repair_costs') || 'Est. Maintenance Pipeline'}</div>
            <div class="kpi-value">${fmtMoney(KPI.fleetMaintenance.estRepairCostsCAD)} CAD</div>
            <div class="kpi-sub">Pending national repairs</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="panel-section">
    <div class="grid-2">
      <div class="card" style="grid-column:span 2;">
        <div class="card-header"><span class="card-title">National Trend — New Clients & Services</span></div>
        <div class="card-body"><div class="chart-container chart-h-260"><canvas id="chart-exec-trend"></canvas></div></div>
      </div>
    </div>
  </div>
  <div class="panel-section">
    <div class="grid-2">
      <div class="card">
        <div class="card-header"><span class="card-title">National NPS</span></div>
        <div class="card-body" style="text-align:center;">
          <div style="font-size:4rem;font-weight:200;color:var(--text-100);letter-spacing:-2px;">${KPI.npsNational}</div>
          <div class="text-xs text-muted" style="text-transform:uppercase;letter-spacing:0.8px;margin-top:4px;">National Average</div>
          <div class="kpi-trend kpi-trend--up" style="justify-content:center;margin-top:12px;">↑ +0.2 vs Q1 2026</div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title">Activity Feed</span></div>
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
    <div class="page-header"><div class="page-title">National KPIs</div><div class="page-sub">Progress toward strategic targets · 2026</div></div>
  </div>
  <div class="panel-section">
    <div class="card" style="margin-bottom:16px;">
      <div class="card-header"><span class="card-title">Strategic Targets</span>${badge('2026 Objectives','info')}</div>
      <div class="card-body">
        <div style="display:flex;flex-direction:column;gap:20px;">
          ${progressBar(KPI.profileCompleteness.current,'blue','Client Profile Completeness',KPI.profileCompleteness.target)}
          ${progressBar(KPI.leasingRetention.current,'warning','Leasing Retention Rate',KPI.leasingRetention.target)}
          ${progressBar(KPI.appAdoption.current,'eq','Mobile App Adoption',KPI.appAdoption.target)}
        </div>
        <div class="divider" style="margin:20px 0;"></div>
        <div class="kpi-grid kpi-grid--3">
          <div class="kpi-card kpi-card--blue" style="padding:14px;">
            <div class="kpi-label">Profile Completeness</div>
            <div class="kpi-value kpi-value--md">${KPI.profileCompleteness.current}%</div>
            <div class="kpi-sub">↑ from 40% baseline</div>
          </div>
          <div class="kpi-card kpi-card--warning" style="padding:14px;">
            <div class="kpi-label">Lease Retention</div>
            <div class="kpi-value kpi-value--md">${KPI.leasingRetention.current}%</div>
            <div class="kpi-sub">Target: ${KPI.leasingRetention.target}%</div>
          </div>
          <div class="kpi-card kpi-card--success" style="padding:14px;">
            <div class="kpi-label">App Adoption</div>
            <div class="kpi-value kpi-value--md">${KPI.appAdoption.current}%</div>
            <div class="kpi-sub">Target: ${KPI.appAdoption.target}% (Year 1)</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="panel-section">
    <div class="card">
      <div class="card-header"><span class="card-title">NPS by Region</span><span class="card-badge badge badge--info">National avg: ${KPI.npsNational}</span></div>
      <div class="card-body"><div class="chart-container chart-h-260"><canvas id="chart-nps-region"></canvas></div></div>
    </div>
  </div>`;
  darkChartDefaults();
  setTimeout(() => {
    mkChart('chart-nps-region',{ type:'bar', data:{ labels: regions.map(r=>r.name), datasets:[{ label:'NPS', data: regions.map(r=>r.nps), backgroundColor: regions.map(r => r.nps>=8.5?'rgba(16,185,129,0.7)':r.nps>=7.8?'rgba(59,114,196,0.7)':'rgba(245,158,11,0.7)'), borderColor: regions.map(r => r.nps>=8.5?'#10B981':r.nps>=7.8?'#3B72C4':'#F59E0B'), borderWidth:1, borderRadius:4 }] }, options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{display:false}, tooltip:{ callbacks:{ label: ctx => 'NPS: '+ctx.raw } } }, scales:{ y:{ min:6.5, max:9.5, grid:CHART_DEFAULTS.grid, ticks:CHART_DEFAULTS.ticks }, x:{ grid:{display:false}, ticks:CHART_DEFAULTS.ticks } } } });
  }, 80);
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
   PREHEATING SYSTEM — EV/Hybrid
══════════════════════════════════════════════════════════════ */
window.preheatingState = { cabin: false, battery: false, timeRemaining: 0 };
const preheatingIntervals = {};

function refreshThermalUI(){
  if (currentPanel === 'c-myvehicle') {
    renderClienteMyVehicle();
  } else if (currentPanel === 'c-dashboard') {
    renderDashboardMaintenancePanel();
  }
}

function openThermalConfig(target){
  thermalConfigTarget = target;
  refreshThermalUI();
}

function closeThermalConfig(){
  thermalConfigTarget = null;
  refreshThermalUI();
}

function saveThermalConfig(target){
  const c = CLIENTS[0];
  const key = target === 'battery' ? 'batteryConfig' : 'cabinConfig';
  const current = c.vehicle.preheating[key] || thermalConfigDefaults[target];
  const readNumber = (id, fallback) => {
    const el = document.getElementById(id);
    const value = Number(el?.value);
    return Number.isFinite(value) ? value : fallback;
  };

  c.vehicle.preheating[key] = {
    activation: readNumber(`${target}-activation-temp`, current.activation),
    target: readNumber(`${target}-target-temp`, current.target),
    max: readNumber(`${target}-max-temp`, current.max),
    min: readNumber(`${target}-min-temp`, current.min)
  };
  thermalConfigTarget = null;
  showPushNotification(t('thermal_config_saved'), {
    message: `${target === 'cabin' ? t('preheating_cabin') : t('preheating_battery')} ${t('thermal_config_saved')}`,
    type: 'success',
    icon: '?'
  });
  startPreheating(target);
}

function startPreheating(target, event) {
  const c = CLIENTS[0];
  const v = c.vehicle;
  const isEV = v.tipo_vehiculo === 'electrico' || v.tipo_vehiculo === 'hibrido';
  const btn = event?.currentTarget || null;

  if (!isEV) {
    showPushNotification(t('preheating_not_available'), {
      message: t('preheating_not_available'),
      type: 'info',
      icon: '?'
    });
    return;
  }

  if (v.preheating[target] === true) {
    clearInterval(preheatingIntervals[target]);
    delete preheatingIntervals[target];
    v.preheating[target] = false;
    v.preheating.remaining = 0;
    v.preheating.lastUpdate = t('just_now');
    window.preheatingState[target] = false;
    if (btn) btn.classList.remove('preheat-btn--active');
    showPushNotification(t('preheating_inactive'), {
      message: `${target === 'cabin' ? t('preheating_cabin') : t('preheating_battery')} ${t('preheating_inactive')}`,
      type: 'info',
      icon: '?'
    });
    refreshThermalUI();
    return;
  }

  const timeNeeded = v.preheating.timeNeeded;
  clearInterval(preheatingIntervals[target]);
  v.preheating[target] = true;
  v.preheating.remaining = timeNeeded;
  v.preheating.lastUpdate = t('just_now');
  window.preheatingState[target] = true;
  window.preheatingState.timeRemaining = timeNeeded;
  if (btn) btn.classList.add('preheat-btn--active');

  showPushNotification(t('preheating_active'), {
    message: `${target === 'cabin' ? t('preheating_cabin') : t('preheating_battery')} ${t('preheating_active')} - ${timeNeeded} s`,
    type: 'info',
    icon: '?'
  });

  const weather = getClientWeather(c);
  if (weather.temp <= -8) {
    showPushNotification(t('climate_extreme_alert'), {
      message: t('ice_conditions_message'),
      type: weather.temp <= -18 ? 'danger' : 'warning',
      icon: 'i'
    });
  }

  refreshThermalUI();

  preheatingIntervals[target] = setInterval(() => {
    v.preheating.remaining = Math.max(0, v.preheating.remaining - 1);
    window.preheatingState.timeRemaining = v.preheating.remaining;
    refreshThermalUI();

    if (v.preheating.remaining <= 0) {
      clearInterval(preheatingIntervals[target]);
      delete preheatingIntervals[target];
      v.preheating[target] = false;
      v.preheating.remaining = 0;
      v.preheating.lastUpdate = t('just_now');
      window.preheatingState[target] = false;
      showPushNotification(t('preheating_complete'), {
        message: `${target === 'cabin' ? t('preheating_cabin') : t('preheating_battery')} ${t('preheating_complete')}`,
        type: 'success',
        icon: '?'
      });
      refreshThermalUI();
    }
  }, 1000);
}
/* ══════════════════════════════════════════════════════════════
   INTELLIGENT WEATHER-BASED ALERTS — Canadian Climate Logic
══════════════════════════════════════════════════════════════ */
function generateSmartAlerts() {
  const c = CLIENTS[0];
  const v = c.vehicle;
  const alerts = [];
  const today = new Date();
  const month = today.getMonth() + 1;
  
  // Winter Tire Alert (Nov-Mar in Quebec)
  if ((month >= 11 || month <= 3) && v.components.tires.current_set === 'summer') {
    alerts.push({
      type: 'warning',
      title: 'Winter Tires Required',
      message: 'Quebec law requires winter tires. Current set is summer — schedule replacement before storm season.',
      icon: '❄️'
    });
  }
  
  // Battery Cold Weather Alert (EV/Hybrid in winter)
  if ((month >= 12 || month <= 2) && (v.tipo_vehiculo === 'electrico' || v.tipo_vehiculo === 'hibrido')) {
    const coldLoss = (1 - v.battery.coldEfficiency) * 100;
    alerts.push({
      type: 'info',
      title: 'Cold Weather Efficiency Drop',
      message: `In cold weather, expect ~${coldLoss.toFixed(0)}% range loss. Preheating is recommended before long trips.`,
      icon: '⚡❄️'
    });
  }
  
  // Salt Corrosion Alert (after winter storms)
  if ((month === 3 || month === 4) && (v.components.brakes.corrosion_risk || v.components.suspension.corrosion_risk)) {
    alerts.push({
      type: 'warning',
      title: 'Salt Road Damage Risk',
      message: 'After winter, schedule undercarriage wash to prevent salt corrosion damage.',
      icon: '🧂'
    });
  }
  
  // Component Maintenance Alert
  if (v.components.brakes.life < 60) {
    alerts.push({
      type: 'danger',
      title: 'Brake Pads Wear Alert',
      message: `Brake pads at ${v.components.brakes.life}% life. Schedule service soon.`,
      icon: '🛑'
    });
  }
  
  if (v.components.tires.life < 60) {
    alerts.push({
      type: 'danger',
      title: 'Tire Replacement Due',
      message: `Tire tread depth ${v.components.tires.treadDepth}mm. Replace before they become unsafe.`,
      icon: '🛞'
    });
  }
  
  return alerts;
}

function displaySmartAlerts() {
  const alerts = generateSmartAlerts();
  alerts.forEach(alert => {
    showPushNotification(alert.title, {
      message: alert.message,
      type: alert.type === 'danger' ? 'danger' : alert.type === 'warning' ? 'warning' : 'info',
      icon: alert.icon,
      duration: 7000
    });
  });
}

/* ══════════════════════════════════════════════════════════════
   ACHIEVEMENT/BADGE SYSTEM — Mileage Milestones
══════════════════════════════════════════════════════════════ */
function checkMilestoneAchievements() {
  const c = CLIENTS[0];
  const v = c.vehicle;
  const mileage = v.mileage;
  const thresholds = [250000, 500000, 1000000];
  
  if (!c.vehicle.achievements) c.vehicle.achievements = [];
  
  thresholds.forEach(threshold => {
    if (mileage >= threshold && !c.vehicle.achievements.includes(`badge_${threshold/1000}k`)) {
      c.vehicle.achievements.push(`badge_${threshold/1000}k`);
      showPushNotification('🏆 Milestone Reached!', {
        message: `Your vehicle has reached ${fmtKm(threshold)}! Loyalty achievement unlocked.`,
        type: 'success',
        icon: '🏆',
        duration: 10000
      });
    }
  });
  
  return c.vehicle.achievements;
}

/* ══════════════════════════════════════════════════════════════
   DARK/LIGHT THEME SYSTEM
══════════════════════════════════════════════════════════════ */
window.themeMode = 'dark';
document.documentElement.setAttribute('data-theme', 'dark');
document.documentElement.style.colorScheme = 'dark';
// Simulate incoming notifications (demo feature)
window.simulateNotifications = function(){

  setTimeout(() => showPushNotification('Service Reminder', { 
    message: 'Your next scheduled service is in 3 days',
    type: 'warning',
    icon: '🔧'
  }), 1000);
  
  setTimeout(() => showPushNotification('Battery Status Update', { 
    message: 'Your EQ battery is at optimal health (97%)',
    type: 'info',
    icon: 'âš¡'
  }), 3000);
  
  setTimeout(() => showPushNotification('Lease Renewal Offer', { 
    message: 'New financing options available for your lease renewal',
    type: 'success',
    icon: '💰'
  }), 5000);
};

/* ══════════════════════════════════════════════════════════════
   DASHBOARD WRAPPER FUNCTIONS (using dashboard.js)
══════════════════════════════════════════════════════════════ */
function renderDashboardMyVehiclePanel() {
  const clientId = currentRole === 'cliente' ? CLIENTS[0].id : null;
  if (!clientId) return;
  const html = renderMyVehiclePanel(clientId);
  document.getElementById('main-content').innerHTML = html;
  updateStaticDOM();
}

function renderDashboardMaintenancePanel() {
  const clientId = currentRole === 'cliente' ? CLIENTS[0].id : null;
  if (!clientId) return;
  const html = renderMaintenanceDashboard(clientId);
  document.getElementById('main-content').innerHTML = html;
  updateStaticDOM();
}

document.addEventListener('DOMContentLoaded', init);
