// Job Step Templates for SWMS Manager
// These are pre-built templates for common construction activities

export const jobStepTemplates = {
  manual_handling: {
    name: 'Manual Handling',
    category: 'General',
    preparation: 'Assess size, shape, condition and weight of loads',
    hazards:
      'Musculoskeletal injuries, Back strain, Slips trips falls, Fatigue',
    initialRisk: '3',
    controls:
      'Train personnel in manual handling. Use team lifting techniques. Assess load before lifting. Provide mechanical aids, trolleys. Wear proper PPE and non-slip footwear. Take regular breaks.',
    residualRisk: '4',
    responsible: 'Supervisor, All Personnel',
  },
  working_at_height: {
    name: 'Working at Height',
    category: 'High Risk',
    preparation: 'Install fall protection and assess height requirements',
    hazards:
      'Falls from height, Falling objects, Ladder accidents, Scaffolding collapse',
    initialRisk: '1',
    controls:
      'Install edge protection and guardrails. Use scaffolding with platforms. Inspect harnesses daily. Maintain 3 points of contact on ladders. Barricade areas below. Use tool lanyards.',
    residualRisk: '2',
    responsible: 'Supervisor, Height Safety Officer',
  },
  excavation: {
    name: 'Excavation Works',
    category: 'Earthworks',
    preparation: 'Dial Before You Dig (1100). Locate and mark all services',
    hazards:
      'Cave-ins, Striking underground services, Falls into excavation, Asphyxiation',
    initialRisk: '1',
    controls:
      'Use service locator. Shore or slope excavation walls. Install barriers around edges. Provide safe access ladders. Keep spoil 1m from edge. Daily inspections. Competent person supervision.',
    residualRisk: '2',
    responsible: 'Site Supervisor, Excavator Operator',
  },
  electrical_work: {
    name: 'Electrical Work',
    category: 'High Risk',
    preparation: 'Verify isolation and test before commencing work',
    hazards:
      'Electric shock, Electrocution, Arc flash, Burns, Falls from height',
    initialRisk: '1',
    controls:
      'Licensed electricians only. Lockout/tagout procedures. Test before touch. Use insulated tools. Maintain clearances from live parts. RCD protection on all power tools. PPE including insulated gloves.',
    residualRisk: '2',
    responsible: 'Licensed Electrician, Supervisor',
  },
  crane_operations: {
    name: 'Crane Operations',
    category: 'Heavy Equipment',
    preparation: 'Prepare lift plan and inspect crane certification',
    hazards:
      'Load drop, Crane collapse, Contact with powerlines, Personnel struck by load',
    initialRisk: '1',
    controls:
      'Follow lift plan. Licensed operators only. Ground conditions assessed. Exclusion zones established. Tag lines used. Communication system. Regular crane inspections. Maintain clearances from powerlines.',
    residualRisk: '2',
    responsible: 'Crane Operator, Dogman, Supervisor',
  },
  formwork: {
    name: 'Formwork Installation',
    category: 'Structural',
    preparation: 'Review formwork design and inspect all components',
    hazards:
      'Formwork collapse, Falls from height, Manual handling injuries, Struck by materials',
    initialRisk: '1',
    controls:
      'Formwork designed by competent person. Follow design exactly. Install bracing as per plan. Inspect before concrete pour. Edge protection on platforms. Use mechanical aids for heavy panels.',
    residualRisk: '2',
    responsible: 'Engineer, Formwork Supervisor',
  },
  heavy_equipment: {
    name: 'Heavy Equipment Operation',
    category: 'Heavy Equipment',
    preparation: 'Inspect equipment and review operation area',
    hazards:
      'Rollovers, Collisions, Personnel struck, Noise exposure, Vibration',
    initialRisk: '1',
    controls:
      'Licensed operators. Daily pre-start inspections. Spotters when reversing. Exclusion zones. Hearing protection. Maintain safe distances. ROPS/FOPS on equipment.',
    residualRisk: '2',
    responsible: 'Equipment Operator, Traffic Controller',
  },
  demolition: {
    name: 'Demolition Work',
    category: 'High Risk',
    preparation: 'Obtain permits and review structural engineering report',
    hazards:
      'Structural collapse, Falling debris, Asbestos exposure, Noise and dust',
    initialRisk: '1',
    controls:
      'Engineered demolition plan. Asbestos survey completed. Barricades and exclusion zones. Water suppression for dust. Sequential demolition from top down. Debris chutes. Hard hats and high-vis mandatory.',
    residualRisk: '2',
    responsible: 'Demolition Supervisor, Engineer',
  },
  concrete_pouring: {
    name: 'Concrete Pouring',
    category: 'Structural',
    preparation: 'Check weather forecast and inspect formwork',
    hazards:
      'Formwork collapse, Manual handling, Chemical burns from concrete, Slips and trips',
    initialRisk: '2',
    controls:
      'Formwork inspected and approved. Trained pump operators. Chemical resistant gloves and boots. Wash concrete off skin immediately. Non-slip footwear. Barriers around pour area.',
    residualRisk: '3',
    responsible: 'Concrete Supervisor, Form Supervisor',
  },
  scaffolding: {
    name: 'Scaffolding Erection/Dismantling',
    category: 'High Risk',
    preparation: 'Review scaffold design and ensure competent scaffolder',
    hazards:
      'Falls from height, Scaffold collapse, Struck by falling materials, Manual handling',
    initialRisk: '1',
    controls:
      'Licensed scaffolder. Follow design plan. Tie to structure. Guardrails on all open edges. Tag and inspect before use. Tool lanyards. Exclusion zone below. Weather considerations.',
    residualRisk: '2',
    responsible: 'Licensed Scaffolder, Supervisor',
  },
  steel_erection: {
    name: 'Steel Erection',
    category: 'Structural',
    preparation: 'Review lift plans and inspect rigging equipment',
    hazards:
      'Falls from height, Loads dropping, Pinch points, Manual handling injuries',
    initialRisk: '1',
    controls:
      'Safe work platforms. Harnesses and lanyards. Certified riggers and dogmen. Pre-lift checks. Exclusion zones. Communication systems. Inspect bolts and connections. Weather monitoring.',
    residualRisk: '2',
    responsible: 'Steel Erector, Rigger, Crane Operator',
  },
  roofing: {
    name: 'Roofing Works',
    category: 'High Risk',
    preparation: 'Install roof edge protection and access equipment',
    hazards:
      'Falls from height, Falling through fragile roofs, Heat stress, Manual handling',
    initialRisk: '1',
    controls:
      'Edge protection or harness system. Roof ladders. Fragile roof signs. Sun protection and hydration breaks. Material hoists for supplies. Safety mesh for openings. Weather monitoring.',
    residualRisk: '2',
    responsible: 'Roofer, Supervisor',
  },
  painting: {
    name: 'Painting and Coating',
    category: 'Finishing',
    preparation: 'Review MSDS sheets and ensure adequate ventilation',
    hazards:
      'Solvent exposure, Fume inhalation, Slips on painted surfaces, Working at height',
    initialRisk: '2',
    controls:
      'Adequate ventilation or respirators. Skin protection. Eye protection. Non-slip footwear. Proper access equipment. Flammable material controls. Fire extinguisher available.',
    residualRisk: '3',
    responsible: 'Painter, Supervisor',
  },
  tiling: {
    name: 'Tiling Work',
    category: 'Finishing',
    preparation: 'Check substrate preparation and material condition',
    hazards:
      'Manual handling of materials, Cuts from tiles, Kneeling injuries, Chemical exposure from adhesives',
    initialRisk: '2',
    controls:
      'Knee pads provided. Cut-resistant gloves. Team lifting heavy boxes. Tile cutter training. Ventilation for adhesives. Eye protection when cutting. Proper substrate to reduce bending.',
    residualRisk: '3',
    responsible: 'Tiler, Supervisor',
  },
  plumbing: {
    name: 'Plumbing Installation',
    category: 'Services',
    preparation: 'Verify fixture locations and check existing services',
    hazards:
      'Confined spaces, Slips and trips, Manual handling, Back injuries, Hot water scalds',
    initialRisk: '2',
    controls:
      'Confined space procedures. Drain water before cutting pipes. Team lifting. Proper access equipment. Test water temperature. Licensed plumber. Hygiene procedures.',
    residualRisk: '3',
    responsible: 'Licensed Plumber, Supervisor',
  },
  hvac_installation: {
    name: 'HVAC Installation',
    category: 'Services',
    preparation: 'Review system design and equipment specifications',
    hazards:
      'Falls from height, Refrigerant exposure, Manual handling, Confined spaces, Electrical hazards',
    initialRisk: '2',
    controls:
      'Licensed technicians. Proper access platforms. Refrigerant handling procedures. PPE for chemicals. Confined space permits. Lockout electrical. Lifting equipment for heavy units.',
    residualRisk: '3',
    responsible: 'HVAC Technician, Supervisor',
  },
  carpentry: {
    name: 'Carpentry Work',
    category: 'General',
    preparation: 'Inspect tools and review work area for hazards',
    hazards:
      'Cuts and lacerations, Nail gun injuries, Manual handling, Noise exposure, Dust inhalation',
    initialRisk: '2',
    controls:
      'Training on power tools. Guards in place. Hearing and eye protection. Dust extraction on saws. Safe work height platforms. Sequential firing nail guns only. Sharp blade protocols.',
    residualRisk: '3',
    responsible: 'Carpenter, Supervisor',
  },
  bricklaying: {
    name: 'Bricklaying/Masonry',
    category: 'Structural',
    preparation: 'Set up ergonomic work area and scaffold access',
    hazards:
      'Manual handling injuries, Repetitive strain, Falls from scaffold, Cuts from tools',
    initialRisk: '2',
    controls:
      'Ergonomic mortar board height. Team lifting for materials. Safe scaffolding. Trowel handling training. Regular breaks. Proper PPE. Material hoist for supplies.',
    residualRisk: '3',
    responsible: 'Bricklayer, Supervisor',
  },
  flooring_installation: {
    name: 'Flooring Installation',
    category: 'Finishing',
    preparation: 'Prepare substrate and review floor plan',
    hazards:
      'Manual handling, Kneeling injuries, Chemical exposure from adhesives, Noise from cutting',
    initialRisk: '2',
    controls:
      'Knee pads and padding. Mechanical aids for lifting. Ventilation for adhesives. Hearing protection. Sharp tool safety. Team lifting heavy materials.',
    residualRisk: '3',
    responsible: 'Flooring Installer, Supervisor',
  },
  drywall_installation: {
    name: 'Drywall/Plasterboard Installation',
    category: 'General',
    preparation: 'Set up material storage and install access equipment',
    hazards:
      'Manual handling injuries, Cuts from sheets, Falls from stilts/platforms, Dust exposure',
    initialRisk: '2',
    controls:
      'Sheet lifters for ceiling. Panel carts for walls. Proper cutting tools. Trained on stilts. Dust masks for sanding. Edge protection on platforms. Team lifting.',
    residualRisk: '3',
    responsible: 'Drywall Installer, Supervisor',
  },
  insulation_installation: {
    name: 'Insulation Installation',
    category: 'General',
    preparation: 'Review MSDS and prepare protective equipment',
    hazards:
      'Skin irritation, Respiratory issues from fibers, Working in confined spaces, Heat stress in roof cavities',
    initialRisk: '2',
    controls:
      'Full body covering. Respirator or dust mask. Gloves and goggles. Ventilation. Hydration breaks. Confined space procedures. Wash exposed skin. Disposal bags for waste.',
    residualRisk: '3',
    responsible: 'Insulation Installer, Supervisor',
  },
  cladding_installation: {
    name: 'External Cladding Installation',
    category: 'General',
    preparation: 'Install edge protection and material hoisting system',
    hazards:
      'Falls from height, Manual handling, Dropped materials, Weather exposure',
    initialRisk: '2',
    controls:
      'Scaffolding with guardrails. Material hoist. Tool lanyards. Weather monitoring. Secure loose materials. PPE including safety glasses. Team lifting heavy panels.',
    residualRisk: '3',
    responsible: 'Cladding Installer, Supervisor',
  },
  window_door_installation: {
    name: 'Window & Door Installation',
    category: 'General',
    preparation: 'Check openings for square and plumb',
    hazards:
      'Manual handling heavy frames, Cuts from glass/sharp edges, Falls from height, Pinch points',
    initialRisk: '2',
    controls:
      'Team lifting. Suction lifters for glass. Cut-resistant gloves. Proper access equipment. Secure frames before releasing. Safety glass where required. Training on installation techniques.',
    residualRisk: '3',
    responsible: 'Glazier, Supervisor',
  },
  waterproofing: {
    name: 'Waterproofing',
    category: 'Finishing',
    preparation: 'Check surface preparation and review product requirements',
    hazards:
      'Chemical exposure, Fume inhalation, Slips on wet surfaces, Confined space entry',
    initialRisk: '2',
    controls:
      'Adequate ventilation. Respirator when required. Chemical resistant gloves and clothing. Non-slip footwear. Confined space procedures if required. MSDS sheets available.',
    residualRisk: '3',
    responsible: 'Waterproofer, Supervisor',
  },
  landscaping: {
    name: 'Landscaping Works',
    category: 'Site Operations',
    preparation: 'Locate underground services and inspect equipment',
    hazards:
      'Machinery operation hazards, Manual handling, Underground service strikes, Sun exposure',
    initialRisk: '2',
    controls:
      'Dial Before You Dig. Trained operators for machinery. Team lifting. Regular breaks in shade. Sun protection (hat, sunscreen, water). Equipment daily inspections.',
    residualRisk: '3',
    responsible: 'Landscaper, Supervisor',
  },
  asbestos_removal: {
    name: 'Asbestos Removal',
    category: 'High Risk',
    preparation:
      'Obtain asbestos removal license and prepare decontamination area',
    hazards: 'Asbestos exposure, Respiratory illness, Cross contamination',
    initialRisk: '1',
    controls:
      'Licensed removalist only. Class A training. Full PPE including respirators. Negative air pressure enclosure. Wet methods. Air monitoring. Waste disposal as per regulations. Medical surveillance.',
    residualRisk: '2',
    responsible: 'Licensed Asbestos Removalist',
  },
  site_establishment: {
    name: 'Site Establishment',
    category: 'Site Operations',
    preparation: 'Survey site and prepare site layout plan',
    hazards:
      'Uneven ground, Existing services, Vehicle movements, Manual handling',
    initialRisk: '2',
    controls:
      'Site survey completed. Services located. Level ground for amenities. Vehicle access routes defined. Perimeter fencing. Signage installed. Induction for all workers.',
    residualRisk: '3',
    responsible: 'Site Supervisor',
  },
};

export const companyDefaults = {
  orgName: 'A & L Builders PTY LTD',
  acnAbn: '95604167026',
  address: 'PO Box 250, Paradise Point, QLD',
  contactName: 'Alan Haley',
  contactPosition: 'Director',
  contactPhone: '0433381140',
};
