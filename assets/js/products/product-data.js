// products-data.js
const products = [
  {
    id: "1",
    name: "Copper Electrical Wire",
    category: "Electrical Wire",
    description: "High-quality copper electrical wire suitable for industrial and residential applications.",
    features: [
      "100% pure copper conductor",
      "High conductivity",
      "Flexible insulation",
      "Durable and fire-resistant"
    ],
    images: [
      "assets/img/products/1.jpg",
      "assets/img/products/2.jpg",
      "assets/img/products/3.jpg"
    ],
    specifications: [
      { property: "Conductor", value: "Pure Copper" },
      { property: "Insulation", value: "PVC" },
      { property: "Voltage Rating", value: "600/1100V" }
    ],
    applications: [
      { property: "Use Case", value: "Residential wiring" },
      { property: "Industry", value: "Commercial buildings" }
    ],
    standards: [
      { property: "IS Standard", value: "IS 694" },
      { property: "IEC Standard", value: "IEC 60227" }
    ],
    faqs: [
      { q: "Is this wire flame resistant?", a: "Yes, it is fire-resistant and complies with IS standards." },
      { q: "Can it be used outdoors?", a: "Yes, when routed in protective conduit." }
    ]
  },
  {
    id: "2",
    name: "Aluminum Power Cable",
    category: "Power Cable",
    description: "Lightweight and cost-effective aluminum power cable for energy transmission and distribution.",
    features: [
      "Aluminum conductor with high tensile strength",
      "Corrosion-resistant coating",
      "UV resistant insulation",
      "Easy installation"
    ],
    images: [
      "assets/img/products/5.jpg",
      "assets/img/products/6.jpg"
    ],
    specifications: [
      { property: "Conductor", value: "Aluminium" },
      { property: "Insulation", value: "XLPE" },
      { property: "Voltage Rating", value: "Up to 33kV" }
    ],
    applications: [
      { property: "Use Case", value: "Energy distribution" },
      { property: "Industry", value: "Power plants, utilities" }
    ],
    standards: [
      { property: "IS Standard", value: "IS 1554" },
      { property: "IEC Standard", value: "IEC 60502" }
    ],
    faqs: [
      { q: "Is aluminum safe for wiring?", a: "Yes, it’s widely used for power distribution due to its cost efficiency." },
      { q: "What are its advantages over copper?", a: "It’s lighter and cheaper, but requires larger cross-sectional area." }
    ]
  },
  {
    id: "wire-003",
    name: "Flexible Control Wire",
    category: "Control Wire",
    description: "Flexible control wires ideal for machinery and automation systems.",
    features: [
      "Multi-stranded copper conductor",
      "Heat and oil resistant insulation",
      "Excellent bending performance",
      "Complies with IS/IEC standards"
    ],
    images: [
      "assets/img/products/7.jpg",
      "assets/img/products/8.jpg",
      "assets/img/products/9.jpg"
    ],
    specifications: [
      { property: "Conductor", value: "Stranded Copper" },
      { property: "Insulation", value: "PVC/XLPE" }
    ],
    applications: [
      { property: "Use Case", value: "Automation systems" },
      { property: "Industry", value: "Machinery and robotics" }
    ],
    standards: [
      { property: "IS Standard", value: "IS 694" },
      { property: "IEC Standard", value: "IEC 60245" }
    ],
    faqs: [
      { q: "Is this wire flexible?", a: "Yes, it is designed for high flexibility in moving machinery." }
    ]
  },
  {
    id: "wire-004",
    name: "Industrial Coaxial Cable",
    category: "Coaxial Cable",
    description: "Premium coaxial cables for high-frequency industrial and communication applications.",
    features: [
      "Low signal loss",
      "High-frequency performance",
      "Shielded to reduce interference",
      "Durable PVC jacket"
    ],
    images: [
      "assets/img/products/10.jpg",
      "assets/img/products/11.jpg"
    ],
    specifications: [
      { property: "Impedance", value: "50/75 Ohm" },
      { property: "Shielding", value: "Braided Copper" }
    ],
    applications: [
      { property: "Use Case", value: "Signal transmission" },
      { property: "Industry", value: "Telecom and broadcast" }
    ],
    standards: [
      { property: "IEC Standard", value: "IEC 61196" }
    ],
    faqs: [
      { q: "What is the max frequency supported?", a: "Up to 3 GHz depending on model." }
    ]
  },
  {
    id: "wire-005",
    name: "Armored Power Cable",
    category: "Power Cable",
    description: "Robust armored power cables for underground and outdoor installations.",
    features: [
      "Galvanized steel armor",
      "Fire and water resistant insulation",
      "Suitable for harsh environments",
      "High mechanical strength"
    ],
    images: [
      "assets/img/products/14.jpg",
      "assets/img/products/15.jpg",
      "assets/img/products/16.jpg"
    ],
    specifications: [
      { property: "Conductor", value: "Copper / Aluminium" },
      { property: "Armour", value: "Galvanized Steel Strip" }
    ],
    applications: [
      { property: "Use Case", value: "Underground wiring" },
      { property: "Industry", value: "Heavy industries, utilities" }
    ],
    standards: [
      { property: "IS Standard", value: "IS 1554" }
    ],
    faqs: [
      { q: "Can it be buried directly?", a: "Yes, it is designed for direct burial and harsh conditions." }
    ]
  },
  {
    id: "wire-006",
    name: "Instrumentation Cable",
    category: "Instrumentation",
    description: "Accurate and reliable instrumentation cables for signal and control transmission.",
    features: [
      "Twisted pair design",
      "Shielded for noise reduction",
      "High flexibility",
      "Complies with international standards"
    ],
    images: [
      "assets/img/products/17.jpg",
      "assets/img/products/18.jpg"
    ],
    specifications: [
      { property: "Pairs", value: "2C to 24C" },
      { property: "Shield", value: "Aluminium Mylar Tape" }
    ],
    applications: [
      { property: "Use Case", value: "Signal transmission" },
      { property: "Industry", value: "Automation and process control" }
    ],
    standards: [
      { property: "IEC Standard", value: "IEC 60502-1" }
    ],
    faqs: [
      { q: "Is it suitable for noisy environments?", a: "Yes, the shielding reduces EMI and ensures signal integrity." }
    ]
  }
];
