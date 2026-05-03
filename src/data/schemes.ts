export interface Scheme {
  id: string;
  name: { [key: string]: string };
  ministry: string;
  category: string;
  description: { [key: string]: string };
  benefit: string;
  eligibility: {
    minAge?: number;
    maxAge?: number;
    gender?: string[];
    incomeLimit?: number;
    caste?: string[];
    occupation?: string[];
    states?: string[];
  };
  link: string;
}

export const SCHEMES: Scheme[] = [
  {
    id: "pm-kisan",
    name: {
      en: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
      hi: "PM-किसान (प्रधानमंत्री किसान सम्मान निधि)",
      kn: "ಪಿಎಂ-ಕಿಸಾನ್"
    },
    ministry: "Ministry of Agriculture",
    category: "Agriculture",
    description: {
      en: "Direct income support for farmers.",
      hi: "किसानों के लिए प्रत्यक्ष आय सहायता।"
    },
    benefit: "₹6,000 per year",
    eligibility: { occupation: ["Farmer"], incomeLimit: 200000 },
    link: "https://pmkisan.gov.in/"
  },
  {
    id: "ayushman-bharat",
    name: {
      en: "Ayushman Bharat PM-JAY",
      hi: "आयुष्मान भारत PM-JAY"
    },
    ministry: "Ministry of Health",
    category: "Health",
    description: {
      en: "Free health insurance for vulnerable families.",
      hi: "कमजोर परिवारों के लिए मुफ्त स्वास्थ्य बीमा।"
    },
    benefit: "₹5 lakh health cover",
    eligibility: { incomeLimit: 120000 },
    link: "https://pmjay.gov.in/"
  },
  {
    id: "pm-awis-urban",
    name: {
      en: "PM Awas Yojana (Urban)",
      hi: "प्रधानमंत्री आवास योजना (शहरी)"
    },
    ministry: "Ministry of Housing and Urban Affairs",
    category: "Housing",
    description: {
      en: "Housing for all in urban areas.",
      hi: "शहरी क्षेत्रों में सभी के लिए आवास।"
    },
    benefit: "Interest subsidy on home loans.",
    eligibility: { incomeLimit: 600000 },
    link: "https://pmay-urban.gov.in/"
  },
  {
    id: "pmmvy",
    name: {
      en: "PMMVY (Matru Vandana Yojana)",
      hi: "प्रधानमंत्री मातृ वंदना योजना"
    },
    ministry: "Ministry of Women and Child Development",
    category: "Women",
    description: {
      en: "Maternity benefit for pregnant and lactating mothers.",
      hi: "गर्भवती और स्तनपान कराने वाली माताओं के लिए मातृत्व लाभ।"
    },
    benefit: "₹5,000 cash incentive.",
    eligibility: { gender: ["Female"] },
    link: "https://pmmvy-cas.nic.in/"
  },
  {
    id: "atal-pension",
    name: {
      en: "Atal Pension Yojana",
      hi: "अटल पेंशन योजना"
    },
    ministry: "Ministry of Finance",
    category: "Finance",
    description: {
      en: "Pension scheme for unorganized sector workers.",
      hi: "असंगठित क्षेत्र के श्रमिकों के लिए पेंशन योजना।"
    },
    benefit: "Fixed pension of ₹1000 - ₹5000.",
    eligibility: { minAge: 18, maxAge: 40 },
    link: "https://www.npscra.nsdl.co.in/scheme-details.php"
  },
  {
    id: "standup-india",
    name: {
      en: "Stand-Up India",
      hi: "स्टैंड-अप इंडिया"
    },
    ministry: "Ministry of Finance",
    category: "Finance",
    description: {
      en: "Promoting entrepreneurship among SC/ST and Women.",
      hi: "SC/ST और महिलाओं के बीच उद्यमशीलता को बढ़ावा देना।"
    },
    benefit: "Loans between ₹10 lakh and ₹1 crore.",
    eligibility: { gender: ["Female"], caste: ["SC", "ST"] },
    link: "https://www.standupmitra.in/"
  },
  {
    id: "national-scholarship",
    name: {
      en: "National Scholarship Portal",
      hi: "राष्ट्रीय छात्रवृत्ति पोर्टल"
    },
    ministry: "Ministry of Electronics and Information Technology",
    category: "Education",
    description: {
      en: "Gateway for various government scholarships.",
      hi: "विभिन्न सरकारी छात्रवृत्तियों के लिए प्रवेश द्वार।"
    },
    benefit: "Various scholarship amounts based on course.",
    eligibility: { occupation: ["Student"] },
    link: "https://scholarships.gov.in/"
  },
  {
    id: "pm-mudra",
    name: {
      en: "Pradhan Mantri MUDRA Yojana",
      hi: "प्रधानमंत्री मुद्रा योजना"
    },
    ministry: "Ministry of Finance",
    category: "Finance",
    description: {
      en: "Loans up to ₹10 lakh to non-corporate, non-farm small/micro enterprises.",
      hi: "गैर-कॉर्पोरेट, गैर-कृषि लघु/सूक्ष्म उद्यमों को ₹10 लाख तक का ऋण।"
    },
    benefit: "Collateral-free business loans.",
    eligibility: { incomeLimit: 500000 },
    link: "https://www.mudra.org.in/"
  },
  {
    id: "pm-jjby",
    name: {
      en: "PM Jeevan Jyoti Bima Yojana",
      hi: "प्रधानमंत्री जीवन ज्योति बीमा योजना"
    },
    ministry: "Ministry of Finance",
    category: "Finance",
    description: {
      en: "One year life insurance scheme renewable from year to year.",
      hi: "एक साल की जीवन बीमा योजना जो साल-दर-साल नवीकरणीय है।"
    },
    benefit: "₹2 lakh life cover for a premium of ₹436 per annum.",
    eligibility: { minAge: 18, maxAge: 50 },
    link: "https://jansuraksha.gov.in/"
  },
  {
    id: "pm-sby",
    name: {
      en: "PM Suraksha Bima Yojana",
      hi: "प्रधानमंत्री सुरक्षा बीमा योजना"
    },
    ministry: "Ministry of Finance",
    category: "Finance",
    description: {
      en: "Accident insurance scheme for people in age group 18 to 70 years.",
      hi: "18 से 70 वर्ष के आयु वर्ग के लोगों के लिए दुर्घटना बीमा योजना।"
    },
    benefit: "₹2 lakh accidental death/disability cover for ₹20 per annum.",
    eligibility: { minAge: 18, maxAge: 70 },
    link: "https://jansuraksha.gov.in/"
  },
  {
    id: "pm-svanidhi",
    name: {
      en: "PM SVANidhi",
      hi: "पीएम स्वनिधि"
    },
    ministry: "Ministry of Housing and Urban Affairs",
    category: "Finance",
    description: {
      en: "Micro-credit facility for street vendors.",
      hi: "रेहड़ी-पटरी वालों के लिए सूक्ष्म ऋण सुविधा।"
    },
    benefit: "Working capital loan up to ₹10,000.",
    eligibility: { occupation: ["Self-Employed"], incomeLimit: 150000 },
    link: "https://pmsvanidhi.mohua.gov.in/"
  },
  {
    id: "pm-ujjwalla",
    name: {
      en: "Pradhan Mantri Ujjwala Yojana",
      hi: "प्रधानमंत्री उज्ज्वला योजना"
    },
    ministry: "Ministry of Petroleum and Natural Gas",
    category: "Women",
    description: {
      en: "Free LPG connections for BPL households.",
      hi: "बीपीएल परिवारों के लिए मुफ्त एलपीजी कनेक्शन।"
    },
    benefit: "Deposit-free LPG connection.",
    eligibility: { gender: ["Female"], incomeLimit: 100000 },
    link: "https://www.pmuy.gov.in/"
  },
  {
    id: "jry",
    name: {
      en: "Jawahar Rozgar Yojana",
      hi: "जवाहर रोजगार योजना"
    },
    ministry: "Ministry of Rural Development",
    category: "Employment",
    description: {
      en: "Employment generation in rural areas through infrastructure works.",
      hi: "बुनियादी ढांचे के कार्यों के माध्यम से ग्रामीण क्षेत्रों में रोजगार सृजन।"
    },
    benefit: "Guaranteed wage employment.",
    eligibility: { occupation: ["Daily Wage Laborer"], incomeLimit: 80000 },
    link: "https://rural.nic.in/"
  },
  {
    id: "standup-india",
    name: {
      en: "Stand-Up India",
      hi: "स्टैंड-अप इंडिया"
    },
    ministry: "Ministry of Finance",
    category: "Finance",
    description: {
      en: "Promoting entrepreneurship among SC/ST and Women.",
      hi: "SC/ST और महिलाओं के बीच उद्यमशीलता को बढ़ावा देना।"
    },
    benefit: "Loans between ₹10 lakh and ₹1 crore.",
    eligibility: { gender: ["Female"], caste: ["SC", "ST"] },
    link: "https://www.standupmitra.in/"
  },
  {
    id: "poshan-abhiyaan",
    name: {
      en: "POSHAN Abhiyaan",
      hi: "पोषण अभियान"
    },
    ministry: "Ministry of Women and Child Development",
    category: "Health",
    description: {
      en: "Holistic nutrition for pregnant women and children.",
      hi: "गर्भवती महिलाओं और बच्चों के लिए समग्र पोषण।"
    },
    benefit: "Nutritional supplements and health monitoring.",
    eligibility: { gender: ["Female"] },
    link: "https://poshanabhiyaan.gov.in/"
  },
  {
    id: "pmv-vishwakarma",
    name: {
      en: "PM Vishwakarma",
      hi: "पीएम विश्वकर्मा"
    },
    ministry: "Ministry of MSME",
    category: "Employment",
    description: {
      en: "Support for artisans and craftspeople.",
      hi: "कारीगरों और शिल्पकारों के लिए सहायता।"
    },
    benefit: "Stipend of ₹500/day during training and ₹15,000 for toolkit.",
    eligibility: { occupation: ["Artisan", "Craftsman"], incomeLimit: 180000 },
    link: "https://pmvishwakarma.gov.in/"
  },
  {
    id: "mgnrega",
    name: {
      en: "MGNREGA",
      hi: "मनरेगा"
    },
    ministry: "Ministry of Rural Development",
    category: "Employment",
    description: {
      en: "Guarantee of 100 days of wage employment in a financial year.",
      hi: "एक वित्तीय वर्ष में 100 दिनों के मजदूरी रोजगार की गारंटी।"
    },
    benefit: "Guaranteed minimum wage employment.",
    eligibility: { occupation: ["Daily Wage Laborer", "Unemployed"] },
    link: "https://nrega.nic.in/"
  }
];

