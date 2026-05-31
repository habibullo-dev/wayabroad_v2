/**
 * Curated catalog of majors offered, by college, split into English-taught and
 * Korean-taught tracks. Keyed by slug; hand-collected in the v1 wayabroad project, so it
 * is a reference list (the UI labels it as such), separate from the ranked DB programs.
 * 21 universities covered.
 */
export interface MajorGroup {
  college: string;
  majors: string[];
}

export interface UniversityMajors {
  english: MajorGroup[];
  korean: MajorGroup[];
}

const UNIVERSITY_MAJORS: Record<string, UniversityMajors> = {
  "ajou-university": {
    english: [
      { college: "School of Business", majors: ["Business Administration"] },
    ],
    korean: [
      {
        college: "College of Engineering",
        majors: [
          "Mechanical Engineering",
          "Industrial Engineering",
          "Chemical Engineering",
          "Material Science and Engineering Applied Chemistry and Biological Engineering",
          "College of Engineering",
          "Environmental and Safety",
          "Engineering Civil System Engineering",
          "Transportation System Engineering",
          "Architecture Engineering Major(4-years) Architecture(5 year)",
        ],
      },
      {
        college: "College of Information Technology",
        majors: ["Electrical and Computer Engineering"],
      },
      {
        college: "College of Computing and Informatics",
        majors: [
          "Software and Computer Engineering",
          "Cyber Security",
          "Digital Media",
        ],
      },
      {
        college: "College of Natural Sciences",
        majors: ["Mathematics", "Physics", "Chemistry", "Biological Science"],
      },
      {
        college: "College of Humanities",
        majors: [
          "Korean Language and Literature",
          "English Language and Literature",
          "French Language Literature",
          "History",
          "Culture and Contents",
        ],
      },
      {
        college: "College of Social Sciences",
        majors: [
          "Economics",
          "Public Administration",
          "College of Social Sciences",
          "Psychology",
          "Sociology",
          "Political Science and Diplomacy",
        ],
      },
    ],
  },
  "chonnam-national-university": {
    english: [],
    korean: [
      {
        college: "AI Convergence",
        majors: [
          "Artificial Intelligence",
          "Intelligent Mobility Nursing: Nursing",
        ],
      },
      {
        college: "Business Administration:",
        majors: ["Business Administration", "Economics"],
      },
      {
        college: "Engineering",
        majors: [
          "School of Architecture",
          "School of Architecture (Major of Architectural Engineering)",
          "School of Architecture",
          "Major of Architecture & Urban Design",
          "School of Polymer Science Engineering",
          "School of Mechanical Engineering",
          "Department of Industrial Engineering",
          "Department of Biotechnology & Bioengineering",
          "School of Materials Science and Engineering",
          "Department of Energy and Resources Engineering",
          "Department of Electrical Engineering",
          "School of Electronic and Computer Engineering",
          "Department of Civil Engineering",
          "School of Chemical Engineering",
        ],
      },
      {
        college: "Agriculture and Life Sciences",
        majors: [
          "Department of Agricultural Economics",
          "Department of Agricultural & Biological Chemistry",
          "Division of Animal Science",
          "Department of Bioenergy Science and Technology",
          "Department of Molecular Biotechnology",
          "Department of Forest Resources",
          "Department of Food Science & Technology",
          "Department of Horticulture",
          "Department of Convergence Biosystems Engineering",
          "Department of Applied Biology",
          "Department of Applied Plant Science",
          "Department of Wood Science & Engineering",
          "Department of Landscape Architecture",
          "Department of Rural and Biosystems Engineering",
        ],
      },
      {
        college: "Social Sciences",
        majors: [
          "Department of Library and Information Science",
          "Department of Cultural Anthropology and Archaeology",
          "Media and Communication",
          "Communication",
          "Department of Sociology",
          "Department of Psychology",
          "Department of Political Science and Intemational Relations",
          "Department of Geography",
          "Department of Public Administration",
        ],
      },
      {
        college: "Human Ecology",
        majors: [
          "Department of Family Environment and Welfare",
          "Division of Food and Nutrition",
          "Department of Clothing and Textiles",
        ],
      },
      {
        college: "Arts",
        majors: [
          "Korean Traditional Music",
          "Design",
          "Fine Arts",
          "Major of Korean Painting",
          "Western Painting",
          "Sculpture",
          "Crafts Fine Arts",
          "Theory of Arts",
          "Music",
        ],
      },
      {
        college: "Humanities",
        majors: [
          "Korean Language & Literature",
          "German Language & Literature",
          "French Language & Literature",
          "History",
          "English Language & Literature",
          "Japanese Language & Literature",
          "Chinese Language & Literature",
          "Philosophy",
        ],
      },
      {
        college: "Natural Sciences",
        majors: [
          "Physics",
          "Biological Sciences and Technology",
          "Biological Science & Technology - Major of Biological Science / Major of Systems Biology",
          "Biology",
          "Mathematics",
          "Earth Systems & Environmental Science",
          "Statistics",
          "Chemistry",
        ],
      },
      {
        college: "Engineering (Yeo-su Campus)",
        majors: [
          "Department of Architecture Design",
          "Department of Mechanical Design Engineering",
          "Department of Mechanical System Engineering",
          "Department of Refrigeration & Air-conditioning Engineering",
          "Department of Mechatronics Engineering",
          "Department of Petrochemical Materials Engineering",
          "Department of Integrative Biotechnology",
          "Department of Biomedical Engineering",
          "School of Electrical and Computer Engineering",
          "School of Electrical and Computer Engineering- Major Electrical and Semiconductor Engineering",
          "School of Electrical and Computer Engineering",
          "Major in Computer Engineering",
          "Department of Electronic Communication Engineering",
          "School of Healthcare and Biomedical Engineering",
          "Department of Chemical and Biomolecular Engineering",
          "Culture & Social Sciences: Department of English Studies",
          "Department of Japanese Studies",
          "Department of Chinese Studies",
          "Division of Global Business",
          "Department of Cultural Tourism Management",
          "Department of Logistics and Transportation",
          "Division of Culture Contents",
          "Division of Culture Contents - Department of Multimedia / Electronic Commerce",
        ],
      },
      {
        college: "Fisheries & Ocean Sciences",
        majors: [
          "Department of Power System Engineering",
          "Department of Aqualife Medicine",
          "Department Smart Fisheries Resources Management",
          "Department of Aquaculture",
          "Department of Naval Architecture and Ocean Engineering",
          "Department of Maritime Police Science",
          "Department of Marine Bio food Science",
          "Department of Marine Production Management",
          "Department of Ocean Integrated Science",
        ],
      },
    ],
  },
  "chung-ang-university": {
    english: [],
    korean: [
      {
        college: "Humanities",
        majors: [
          "Korean Language & Literature",
          "English Language & Literature",
          "European Languages & Cultures",
          "Asian Languages & Cultures",
          "Philosophy",
          "History",
        ],
      },
      {
        college: "Social Sciences",
        majors: [
          "Political Science",
          "Public Administration",
          "Psychology",
          "Library & Information Science",
          "Social Welfare",
          "Media Communication",
          "Sociology",
          "Urban Planning and Real Estate",
        ],
      },
      {
        college: "Business & Economics",
        majors: [
          "Business Administration",
          "Economics",
          "Applied Statistics",
          "Advertising & Public Relations",
          "International Logistics",
        ],
      },
      {
        college: "Natural Sciences",
        majors: ["Physics", "Chemistry", "Biological Sciences", "Mathematics"],
      },
      {
        college: "Biotechnology and Natural Resources",
        majors: ["Bioresource & Bioscience", "Food Science & Technology"],
      },
      {
        college: "Engineering",
        majors: [
          "Civil & Environmental Engineering",
          "Urban Design & Studies",
          "Architecture & Building Science",
          "Chemical Engineering & New Material Science",
          "Mechanical Engineering",
        ],
      },
      {
        college: "ICT Engineering",
        majors: ["Electrical and Electronics Engineering", "Software"],
      },
      {
        college: "Arts",
        majors: [
          "Performing Arts and Media",
          "Design",
          "Korean music",
          "Global School of Arts",
        ],
      },
      { college: "Sport", majors: ["Sports Science"] },
    ],
  },
  "chungnam-national-university": {
    english: [
      { college: "International Studies", majors: ["International Studies"] },
    ],
    korean: [
      {
        college: "Humanities",
        majors: [
          "Korean Language and Literature",
          "English Language and Literature",
          "German Language and Literature",
          "French Language and Literature",
          "Chinese Language and Literature",
          "Japanese Language and Literature",
          "Sino-Korean Literature",
          "Linguistics",
          "History",
          "Korean History",
          "Archaeology",
          "Philosophy",
        ],
      },
      {
        college: "Social Sciences",
        majors: [
          "Sociology",
          "Library and Information Science",
          "Psychology",
          "Communication",
          "Social Welfare",
          "Political Science and Diplomacy",
          "Public Administration",
          "Autonomy and Urban Administration",
        ],
      },
      {
        college: "Economics and Management",
        majors: ["Business Administration", "International Trade"],
      },
      {
        college: "Natural Sciences",
        majors: [
          "Mathematics",
          "Information and Statistics",
          "Physics",
          "Astronomy and Space Science",
          "Chemistry",
          "Biochemistry",
          "Marine Environmental Sciences",
          "Geological Sciences",
        ],
      },
      {
        college: "Engineering",
        majors: [
          "Architecture(5-year program)",
          "Civil Engineering",
          "Mechanical Engineering",
          "Aerospace Engineering",
          "Materials Science and Engineering",
          "Organic Materials Engineering",
          "Chemical Engineering and Applied Chemistry",
          "Electrical Engineering",
        ],
      },
      {
        college: "Agriculture and Life Sciences",
        majors: [
          "Agricultural Economics",
          "Crop Science",
          "Horticultural Science",
          "Environmental and Forest Resources",
          "Biobased Materials",
          "Applied Biology",
          "Animal and Dairy Science",
          "Agricultural and Rural Engineering",
          "Biosystems Machinery Engineering",
          "Food Science and Technology",
          "Bio-Environmental Chemistry",
        ],
      },
      {
        college: "Human Ecology",
        majors: ["Clothing and Textiles", "Consumer Science"],
      },
      {
        college: "Bioscience and Biotechnology",
        majors: ["Biological Sciences", "Microbiology and Molecular Biology"],
      },
      {
        college: "Art, Music and Physical Education",
        majors: [
          "Dance(Korean dance)",
          "Dance(modern dance)",
          "Dance(ballet)",
          "Sport Science",
          "Fine Art",
        ],
      },
    ],
  },
  "ewha-womans-university": {
    english: [
      {
        college: "Scranton College",
        majors: ["Division of International Studies", "Global Korean Studies"],
      },
    ],
    korean: [
      {
        college: "College of Liberal Arts",
        majors: [
          "Korean Language & Literature",
          "Chinese Language & Literature",
          "French Language & Literature",
          "German Language & Literature History",
          "Philosophy Christian Studies",
          "Division of English Language & Literature",
          "Public Administration",
          "Economics",
          "Library & Information Science",
          "Sociology",
          "Social Welfare",
          "Psychology",
          "Consumer Studies",
          "Division of Communication & Media",
        ],
      },
      {
        college: "College of Social Sciences",
        majors: ["Political Science & International Relations"],
      },
      {
        college: "College of Natural Sciences",
        majors: [
          "Mathematics",
          "Statistics",
          "Physics",
          "Division of Molecular Life and Chemical Science",
        ],
      },
      {
        college: "College of Engineering",
        majors: [
          "Division of Electronic and Semiconductor Engineering",
          "Food Science and Biotechnology",
          "Chemical Engineering and Materials Science",
          "Architecture (5-year program)",
          "Architectural and Urban Systems Engineering",
          "Environmental Science and Engineering",
          "Climate and Energy Systems Engineering",
          "Mechanical and Biomedical Engineering",
        ],
      },
      {
        college: "College of Music",
        majors: [
          "Keyboard Instruments",
          "Orchestral Instruments",
          "Voice Composition",
          "Korean Music",
          "Dance",
        ],
      },
      {
        college: "College of Art & Design",
        majors: [
          "Division of Fine Arts",
          "Division of Design",
          "Division of Fiber & Fashion",
        ],
      },
      {
        college: "College of Business Administration",
        majors: ["Division of Business Administration"],
      },
      {
        college: "College of Science & Industry Convergence",
        majors: [
          "Content Convergence",
          "Fashion Industry",
          "International Office Administration",
          "Nutritional Science & Food Management",
          "Health Convergence",
          "Division of Kinesiology & Sports Studies",
        ],
      },
      {
        college: "College of Artificial Intelligence",
        majors: ["Computer Science and Engineering", "Cyber Security"],
      },
    ],
  },
  "hankuk-university-of-foreign-studies-hufs": {
    english: [
      {
        college: "College of English",
        majors: ["English Linguistics and Language Technology (ELLT)"],
      },
      {
        college: "Division of International Studies",
        majors: ["International Studies"],
      },
    ],
    korean: [
      {
        college: "College of Occidental Languages",
        majors: [
          "English Literature and Culture English for International Conferences and Communication (EICC)",
        ],
      },
      {
        college: "College of Asian Languages & Culture",
        majors: [
          "Division of French Language",
          "German",
          "Russian",
          "Spanish",
          "Italian",
          "Portuguese",
          "Dutch",
          "Scandinavian Languages",
        ],
      },
      {
        college: "College of Chinese",
        majors: [
          "Malay-Indonesian",
          "Arabic",
          "Thai",
          "Vietnamese",
          "Hindi",
          "Turkish and Azerbaijani",
          "Persian and Iranian Studies",
          "Mongolian",
        ],
      },
      {
        college: "College of Japanese",
        majors: [
          "Chinese Language",
          "Literature and Culture China Data Curation",
          "Chinese Foreign Affairs and Commerce",
        ],
      },
      {
        college: "College of Business and Economics",
        majors: [
          "Japanese Language",
          "Literature and Culture",
          "Integrated Japanese Studies",
          "Public Administration",
          "Media Communication Division",
        ],
      },
      {
        college: "College of Social Science",
        majors: ["Political Science and Diplomacy"],
      },
      { college: "College of Business", majors: ["Economics"] },
      { college: "College of Education", majors: ["Business Administration"] },
      {
        college: "College of AI Convergence:",
        majors: [
          "English Education",
          "Korean Education French Education",
          "German Education",
          "Chinese Education",
        ],
      },
      {
        college: "Division of KFL",
        majors: ["Social Science & AI", "Language & AI"],
      },
      {
        college: "College of Humanities",
        majors: [
          "Korean Education as a Foreign Language",
          "Korean Interpretation and Translation as a Foreign Language",
        ],
      },
      {
        college: "College of Central and East European Studies",
        majors: [
          "Department of Philosophy",
          "Department of History",
          "Department of Linguistics and Cognitive Science",
        ],
      },
      {
        college: "College of International and Area Studies",
        majors: [
          "Greek and Bulgarian Studies",
          "Central Asian Studies",
          "African Studies",
          "Korean Studies",
          "Polish",
          "Romanian",
          "Czech and Slovak Studies",
          "Hungarian",
          "South Slavic Studies Ukrainian Studies",
        ],
      },
      {
        college: "College of Business and Economics:.1",
        majors: ["Global Business & Technology International Finance"],
      },
      {
        college: "College of Natural Science",
        majors: [
          "Mathematics",
          "Statistics",
          "Electronic Physics",
          "Environmental Science",
          "Bioscience and Biotechnology",
          "Chemistry",
        ],
      },
      {
        college: "College of Engineering:",
        majors: [
          "Computer Engineering",
          "Information Communications Engineering",
          "Division of Semiconductor & Electronics Engineering",
          "Industrial and Management Engineering",
        ],
      },
      {
        college: "Ingenium College of Convergence Studies",
        majors: [
          "Computer Engineering",
          "Information Communications Engineering",
          "Division of Semiconductor & Electronics Engineering",
          "Industrial and Management Engineering",
          "Faculty of Convergence Studies",
        ],
      },
      {
        college: "College of Culture & Technology",
        majors: [
          "Division of Digital Contents",
          "Division of Tourism & Wellness",
          "Division of Global Sport Industry",
        ],
      },
      {
        college: "College of AI Convergence",
        majors: ["AI Data Convergence", "Finance & AI Convergence"],
      },
      {
        college: "Division of Biomedical Engineering",
        majors: ["Biomedical Engineering Studies"],
      },
      {
        college: "Global Open Major Division:",
        majors: ["Global Open Major Division:"],
      },
      { college: "Division of Climate Changes", majors: ["Climate Changes"] },
    ],
  },
  "hanyang-university": {
    english: [
      { college: "Engineering", majors: ["Data Science"] },
      { college: "Business", majors: ["Business Administration"] },
      {
        college: "International Studies",
        majors: ["Global Korean Studies", "International Studies"],
      },
    ],
    korean: [
      {
        college: "Engineering",
        majors: [
          "Architecture (5-year program)",
          "Architectural Engineering (4-year program)",
          "Civil and Environmental Engineering",
          "Urban Planning and Engineering",
          "Earth Resources and Environmental Engineering",
          "Electronic Engineering",
          "Computer Science",
          "Information Systems",
          "Electrical and Biomedical Engineering",
          "Materials Science and Engineering",
          "Chemical Engineering",
          "Bioengineering",
          "Organic and Nano Engineering",
          "Energy Engineering",
          "Mechanical Engineering",
          "Nuclear Engineering",
          "Industrial Engineering",
          "Automotive Engineering",
        ],
      },
      {
        college: "Humanities",
        majors: [
          "Korean Language & Literature",
          "Chinese Language & Literature",
          "English Language & Literature",
          "German Language & Literature",
          "History",
          "Philosophy",
          "Korean Language & Literature",
          "English Language & Literature",
        ],
      },
      {
        college: "Social Sciences",
        majors: [
          "Political Science & International Studies",
          "Sociology",
          "Media Communication",
          "Tourism",
        ],
      },
      {
        college: "Natural Sciences",
        majors: ["Mathematics", "Physics", "Chemistry", "Life Science"],
      },
      {
        college: "Policy Science",
        majors: ["Policy Studies", "Public Administration"],
      },
      { college: "Economics&Finance", majors: ["Economics & Finance"] },
      { college: "Business", majors: ["Business Administration", "Finance"] },
      {
        college: "Human Ecology",
        majors: [
          "Clothing & Textiles",
          "Food & Nutrition",
          "Interior Architecture Design",
        ],
      },
      {
        college: "Music",
        majors: [
          "Voice",
          "Composition",
          "Piano",
          "Orchestral Music",
          "Korean Traditional Music",
        ],
      },
      {
        college: "Performing Arts and Sports",
        majors: ["Sport Industry and Science", "Theater and Film", "Dance"],
      },
    ],
  },
  "inha-university": {
    english: [
      {
        college: "School of Global Convergence Studies",
        majors: [
          "International Business & Trade",
          "Integrated System Engineering",
          "Korean Language & Culture",
        ],
      },
    ],
    korean: [
      {
        college: "College of Engineering",
        majors: [
          "Mechanical Engineering",
          "Aerospace Engineering",
          "Naval Architecture & Ocean Engineering",
          "Industrial Engineering",
          "Chemical Engineering",
          "Polymer Science and Engineering",
          "Materials Science Engineering",
          "Civil Engineering",
          "Environmental Engineering",
          "Geo-informational Engineering",
          "Faculty of Architecture",
          "Energy Resources Engineering",
          "Electrical Engineering",
          "Electronic Engineering",
          "Information and Communication Engineering",
        ],
      },
      {
        college: "Department of Biological science:",
        majors: ["Biological Engineering", "Biological Sciences"],
      },
      {
        college: "College of Software and Convergence",
        majors: ["Computer Engineering"],
      },
      {
        college: "College of Natural Science",
        majors: [
          "Mathematics",
          "Statistics",
          "Physics",
          "Chemistry",
          "Ocean Sciences",
          "Food and Nutrition",
        ],
      },
      {
        college: "College of Business Administration:",
        majors: [
          "Business Administration",
          "Global Finance and Banking",
          "Asia Pacific School of Logistics",
          "International Trade",
        ],
      },
      {
        college: "College of Social Science",
        majors: [
          "Public Administration",
          "Political Science and International Relations",
          "Media Communication",
          "Economics",
          "Consumer Science",
          "Child Studies",
          "Social Welfare Studies",
        ],
      },
      {
        college: "College of Humanities:",
        majors: [
          "Korean Language and Literature",
          "History",
          "Philosophy",
          "China Studies",
          "Japanese Language and Culture",
          "English Language and Literature",
          "French Language and Culture",
          "Cultural Contents and Management",
        ],
      },
      { college: "College of Medicine", majors: ["Nursing"] },
      { college: "College of Education:", majors: ["Physical Education"] },
      {
        college: "College of Arts and Sports",
        majors: [
          "Fine Arts",
          "Design Convergence",
          "Kinesiology",
          "Theater and Film Studies",
          "Fashion Design and Textiles",
        ],
      },
    ],
  },
  "jeonbuk-national-university": {
    english: [
      {
        college: "Global Convergence College",
        majors: [
          "School of International Engineering and Science",
          "The School of International Studies",
        ],
      },
    ],
    korean: [
      { college: "University Headquarter", majors: ["Smart Farm"] },
      { college: "Global Convergence College", majors: ["Public Policy"] },
      {
        college: "Engineering",
        majors: [
          "Architectural Engineering",
          "Mechanical Engineering",
          "Mechanical Design Engineering (Mechanical Design Engineering)",
          "Mechanical Design Engineering (Nano-Bio Mechanical System Engineering)",
          "Mechanical System Engineering",
          "Urban Engineering",
          "Biomedical Engineering",
          "Industrial and Information Systems Engineering",
          "Software Engineering",
          "New Materials Engineering (Electronic materials Engineering)",
          "Quantum System Engineering",
          "Division of Convergence Technology Engineering (Major of IT Convergence Mechatronics Engineering)",
          "Division of Convergence Technology",
          "Engineering (Major of IT Applied System Engineering)",
          "Computer Science",
          "Engineering and Artificial Intelligence",
          "Division of Civil/Environmental/Mineral Resources and Energy Engineering (Mineral Resources&Energy Engineering)",
          "Division of Civil/Environmental/Mineral Resources and Energy Engineering (Civil Engineering)",
          "Division of Civil/Environmental/Mineral Resources and Energy Engineering (Environmental Engineering)",
        ],
      },
      {
        college: "Agriculture and Life Sciences:",
        majors: [
          "Division of Agricultural",
          "Economics and Food Marketing (Food Marketing)",
          "Division of Agricultural Economics and Food Marketing (Agricultural Economics)",
          "Agricultural Biology",
          "Animal Biotechnology",
          "Wood Science and Technology",
          "Forest Environment Science",
          "Food Science and Technology",
          "Horticulture",
          "Crop Agriculture and Life Science",
          "Landscape Architecture",
          "Rural Construction Engineering",
        ],
      },
      { college: "Education", majors: ["English Education"] },
      {
        college: "Social Science:",
        majors: [
          "Social Welfare",
          "Sociology",
          "Media and Communication Studies",
          "Psychology",
          "Political Science & Diplomacy",
          "Public Administration",
        ],
      },
      {
        college: "Commerce",
        majors: [
          "Business Administration",
          "Economics",
          "International Trade",
          "Accounting",
        ],
      },
      {
        college: "Human Ecology",
        majors: [
          "Child Studies",
          "Fashion Design",
          "Housing Environmental Design",
        ],
      },
      {
        college: "Arts",
        majors: [
          "Dance (Ballet/Dance Education Creator)",
          "Dance (Korea Folk Dance)",
          "Dance (Contemporary Dance/Choreography)",
          "Industrial Design (Product Design)",
          "Industrial Design (Visual-Media Design)",
          "Music(Composition)",
          "Music(Voice)",
          "Music(Piano)",
          "Music(Wind Music)",
          "Music(String)",
          "Korean Music (Korean Traditional Theory/ Composition)",
          "Korean Music (Vocal/Percussion Music)",
          "Korean Music (Wind Music)",
          "Korean Music (String Music)",
        ],
      },
      {
        college: "Humanities",
        majors: [
          "Archaeology and Cultural Anthropology",
          "Korean Language & Literature",
          "German Studies",
          "Library and Information Science",
          "Spanish & Latin american studies",
          "English Language and Literature",
          "Japanese Studies",
          "Chinese Language & Literature",
          "Philosophy",
          "French African Studies",
        ],
      },
      {
        college: "Natural Sciences:",
        majors: [
          "Science studies",
          "Physics",
          "Division of Life Sciences (Molecular Biology Major)",
          "Division of Life Sciences (Life Sciences Major)",
          "Sport Science",
          "Earth & Environmental Sciences",
        ],
      },
    ],
  },
  kaist: {
    english: [
      {
        college: "College of Natural Sciences",
        majors: [
          "Physics",
          "Mathematical Sciences",
          "Chemistry",
          "Brain and Cognitive Sciences",
        ],
      },
      {
        college: "College of Life Science & Bioengineering",
        majors: ["Biological Sciences"],
      },
      {
        college: "College of Engineering",
        majors: [
          "Mechanical Engineering",
          "Aerospace Engineering",
          "Electrical Engineering",
          "Computer Science",
          "Civil & Environmental Engineering",
          "Bio & Brain Engineering",
          "Industrial Design",
          "Industrial & Systems Engineering",
          "Chemical & Biomolecular Engineering",
          "Materials Science & Engineering",
          "Nuclear & Quantum Engineering",
        ],
      },
      {
        college: "College of Business",
        majors: ["Business and Technology Management"],
      },
    ],
    korean: [
      { college: "Departments", majors: ["Please refer to KAIST website"] },
    ],
  },
  "konkuk-university": {
    english: [],
    korean: [
      {
        college: "College of Art and Design",
        majors: [
          "Department of Industrial Design",
          "Department of Interior Design",
          "Department of Fashion Design",
          "Department of Visual Communication & Media Design",
          "Department of Media Contents",
          "Department of Formative Arts",
        ],
      },
      {
        college: "College of Humanities and Social Sciences",
        majors: [
          "Department of Business Administration",
          "Department of Economics and Trade",
          "Department of Police Science",
          "Department of Fire and Disaster Prevention",
          "Department of Library and Information Science",
          "Department of Social Welfare",
          "Department of Mass Communication",
          "Department of Children's Literature and Korean Lang. & Lit.",
          "Department of English Language and Culture",
        ],
      },
      {
        college: "College of Science and Technology",
        majors: [
          "Department of Mechatronics Engineering",
          "Department of Computer Engineering",
          "Department of Biomedical Engineering",
          "Department of Green Technology Convergence",
          "Department of Energy Materials Science & Engineering",
        ],
      },
      {
        college: "College of Biomedical and Health Science:",
        majors: [
          "Department of Medicinal Biosciences",
          "Department of Biotechnology",
          "Department of Food and Nutrition Science",
          "Department of Beauty Cosmetics",
          "Department of Sport and Health Studies",
          "Department of Golf Industry",
        ],
      },
    ],
  },
  "korea-university": {
    english: [
      {
        college: "College of International Studies",
        majors: ["International Studies", "Global Korean Studies"],
      },
    ],
    korean: [
      {
        college: "Korea University Business School",
        majors: ["Business Administration"],
      },
      {
        college: "College of Liberal Arts",
        majors: [
          "Korean Language and Literature",
          "Philosophy",
          "Korean History",
          "History",
          "Sociology",
          "Sinographic Literatures",
          "English Language and Literature",
          "German Language and Literature",
          "French Language and Literature",
          "Chinese Language and Literature",
          "Russian Language and Literature",
          "Japanese Language and Literature",
          "Spanish Language and Literature",
          "Linguistics",
        ],
      },
      {
        college: "College of Life Sciences & Biotechnology",
        majors: [
          "Life Sciences",
          "Biotechnology",
          "Food Bioscience and Technology",
          "Environmental Science and Ecological Engineering",
          "Food and Resource Economics",
        ],
      },
      {
        college: "College of Political Science and Economics",
        majors: [
          "Political Science and International Relations",
          "Economics",
          "Statistics",
          "Public Administration",
        ],
      },
      {
        college: "College of Science",
        majors: [
          "Mathematics",
          "Physics",
          "Chemistry",
          "Earth and Environmental Science",
        ],
      },
      {
        college: "College of Engineering",
        majors: [
          "Chemical & Biological Engineering",
          "Materials Science & Engineering",
          "Civil",
          "Environmental",
          "& Architectural Engineering",
          "Architecture (5 years)",
          "Mechanical Engineering",
          "Industrial Management Engineering",
          "Electrical Engineering",
          "Integrative Energy Engineering",
        ],
      },
      {
        college: "College of Education",
        majors: [
          "Education",
          "Korean Language Education",
          "English Education",
          "Geography Education",
          "History Education",
          "Home Economics Education",
          "Mathematics Education",
          "Physical Education",
        ],
      },
      {
        college: "College of Informatics",
        majors: ["Computer Science and Engineering", "Data Science"],
      },
      { college: "College of Art & Design", majors: ["Art & Design"] },
      {
        college: "College of Media & Communication",
        majors: ["Media & Communication"],
      },
      {
        college: "College of Health Science",
        majors: [
          "Biomedical Engineering",
          "Biosystems & Biomedical Science",
          "Health Environmental Science",
          "Health Policy & Management",
        ],
      },
      {
        college: "College of Interdisciplinary Studies",
        majors: ["Interdisciplinary Studies"],
      },
      { college: "College of Smart Security", majors: ["Smart Security"] },
      { college: "College of Psychology", majors: ["Psychology"] },
    ],
  },
  "kyung-hee-university": {
    english: [
      {
        college: "College of Management",
        majors: ["Department of Management"],
      },
      {
        college: "College of Hotel and Tourism Management",
        majors: ["Department of Global Hospitality & Tourism Management"],
      },
      {
        college: "College of International Studies",
        majors: [
          "Department of International Studies",
          "Department of Global Korean Studies",
        ],
      },
    ],
    korean: [
      {
        college: "College of Humanities",
        majors: [
          "Department of Korean Language and Literature",
          "Department of History",
          "Department of Philosophy",
          "Department of English Language and Linguistics",
          "Department of Applied English Interpretation and Translation",
        ],
      },
      {
        college: "College of Global Eminence",
        majors: ["Department of Global Eminence"],
      },
      {
        college: "College of Politics and Economics",
        majors: [
          "Department of Political Science",
          "Department of Public Administration",
          "Department of Sociology",
          "Department of Economics",
          "Department of International Business and Trade",
          "Department of Media",
        ],
      },
      {
        college: "College of Management",
        majors: [
          "Department of Management",
          "Department of Accounting and Taxation",
        ],
      },
      {
        college: "College of Hotel and Tourism Management",
        majors: [
          "Department of Hospitality Management",
          "Department of Culinary Arts & Food Design Management",
          "School of Tourism and Entertainment",
          "Department of Hospitality Management",
          "Department of Tourism",
        ],
      },
      {
        college: "College of Human Ecology",
        majors: [
          "Department of Child and Family Studies",
          "Department of Housing and Interior Design",
          "Department of Clothing and Textiles",
          "Department of Food and Nutrition",
        ],
      },
      {
        college: "College of Science",
        majors: [
          "Department of Mathematics",
          "Department of Physics",
          "Department of Chemistry",
          "Department of Biology",
          "Department of Geography",
          "Department of Information Display",
        ],
      },
      {
        college: "College of Engineering",
        majors: [
          "Department of Mechanical Engineering",
          "Department of Industrial & Management Engineering",
          "Department of Nuclear Engineering",
          "Department of Chemical Engineering",
          "Department of Advanced Materials Engineering for Information & Electronics",
          "Department of Civil Engineering",
          "Department of Architectural Engineering",
          "Department of Environmental Science and Engineering",
        ],
      },
      {
        college: "College of Electronics and Information",
        majors: [
          "Department of Electronic Engineering",
          "Department of Biomedical Engineering",
        ],
      },
      {
        college: "College of Software Convergence",
        majors: [
          "Department of Computer Engineering",
          "Department of Software Convergence",
          "Department of Artificial Intelligence",
        ],
      },
      {
        college: "College of Applied Science",
        majors: [
          "Department of Applied Mathematics",
          "Department of Applied Physics",
          "Department of Applied Chemistry",
          "Department of Astronomy and Space Science",
        ],
      },
      {
        college: "College of Life Sciences",
        majors: [
          "Department of Genetics and Biotechnology",
          "Department of Food Science & BIO Technology",
          "Department of Oriental Medicine Biotechnology",
          "Department of Plant & Environmental New Resources",
          "Department of Smart-Farm Science",
        ],
      },
      {
        college: "College of Foreign Language",
        majors: [
          "Department of French",
          "Department of Spanish",
          "Department of Russian",
          "Department of Chinese",
          "Department of Japanese",
          "Department of Korean",
          "Department of Global Communication",
        ],
      },
      {
        college: "College of Art and Design",
        majors: [
          "Department of Industrial Design",
          "Department of Visual Design",
          "Department of Landscape Architecture",
          "Department of Textile and Clothing Design",
          "Department of Digital Contents",
          "Department of Ceramics",
          "Department of Postmodern Music",
          "Department of Theater & Film",
        ],
      },
      {
        college: "College of Physical Education:",
        majors: [
          "Department of Physical Education",
          "Department of Sports Medicine",
          "Department of Golf Industry",
          "Department of Taekwondo",
          "Department of Coaching",
        ],
      },
    ],
  },
  "kyungpook-national-university": {
    english: [
      { college: "Departments", majors: ["International Studies Department"] },
    ],
    korean: [
      {
        college: "Humanities",
        majors: [
          "Korean Language & Literature",
          "English Language & Literature",
          "History",
          "Philosophy",
          "French Language & Literature",
          "German Language Literature",
          "Chinese Language & Literature",
          "Archaeology & Anthropology",
          "Japanese Language & Literature",
          "Korean Literature in Classical Literature Chinese",
          "Russian Language & Literature",
        ],
      },
      {
        college: "Social Sciences",
        majors: [
          "Political Science & Diplomacy",
          "Sociology",
          "Library & Information Science",
          "Geography",
          "Psychology",
          "Social Welfare",
          "Media and Communication",
        ],
      },
      {
        college: "Natural Sciences:",
        majors: [
          "Mathematics",
          "Physics",
          "Chemistry",
          "Biotechnology",
          "Earth System Science",
          "Biology",
          "Natural Sciences",
          "Statistics",
        ],
      },
      {
        college: "Economic & Business Administration",
        majors: ["Business Administration", "Economics & Trade"],
      },
      {
        college: "Engineering",
        majors: [
          "Materials Science and Metallurgical Engineering",
          "Advanced Materials",
          "Science and Engineering",
          "Mechanical Engineering",
          "Architecture(Architecture)",
          "Architecture",
          "Engineering",
          "Civil Engineering",
          "Architecture (Architectural Engineering)",
          "Applied Chemistry",
          "Chemical Engineering",
          "Polymer Science and Engineering",
          "Textile System Engineering",
          "Environmental Energy Engineering",
        ],
      },
      {
        college: "IT Engineering",
        majors: [
          "Electronics Engineering",
          "Electronics Engineering(Artificial Intelligence)",
          "Computer Science and Engineering (Platform Engineering Software & Data Science)",
          "Computer Science and Engineering (Artificial Intelligence Computing)",
          "Computer Science and Engineering (Global software convergence)",
          "Computer Science and Engineering (Global Software Convergence)",
          "Electrical Engineering",
        ],
      },
      {
        college: "Agriculture and Life Sciences",
        majors: [
          "Applied Bioscience",
          "Plant Medicine",
          "Food Science & Horticultural Sciences",
          "Biotechnology",
          "Agriculture &Life Sciences",
          "Forest Sciences and Bio-fibers and Materials Science",
          "Landscaper",
          "Agricultural Civil Engineering",
          "Smart Bio-Industrial Mechanical Engineering",
          "Food and Resource Economics",
        ],
      },
      { college: "Music and Arts", majors: ["Korean Traditional Music"] },
      { college: "Teachers College", majors: ["History Education"] },
      {
        college: "Human Ecology",
        majors: [
          "Child Studies",
          "Clothing and Textiles",
          "Human Ecology",
          "Food Science and Nutrition",
        ],
      },
      { college: "Public Administration", majors: ["Public Administration:"] },
      {
        college: "Ecology &Environmental Science",
        majors: [
          "Plant Resources",
          "Entomology",
          "Animal Science",
          "Forest Ecology and Protection",
          "Horse/Companion and wild Animal Science",
          "Animal Biotechnology",
          "Tourism",
          "Kinesiology (Sport Studies)",
        ],
      },
      {
        college: "Science &Technology",
        majors: [
          "Construction and Disaster Prevention Engineering",
          "Environmental and Safety Engineering",
          "Precision Mechanical Engineering",
          "Automotive Engineering",
          "Nano & Advanced Materials Science and Engineering",
          "Software",
          "Energy Chemical Engineering",
          "Food and Food Service Industry",
          "Textile Fashion",
          "Textile Fashion Design(Fashion Design)",
          "Design (Textile Engineering)",
          "Location-Based Information System",
          "Smart Plant Engineering",
        ],
      },
    ],
  },
  "pusan-national-university": {
    english: [
      {
        college: "College of Economics & International Trade",
        majors: ["Department of Global Studies"],
      },
    ],
    korean: [
      {
        college: "College of Humanities",
        majors: [
          "Department of Korean Language and Literature",
          "Department of Chinese Language and Literature",
          "Department of Japanese Language and Literature",
          "Department of English Language and Literature",
          "Department of French Language and Literature",
          "Department of German Language and Literature",
          "Department of Russian Language and Literature",
          "Department of Korean Literature in Chinese Characters",
          "Department of Language and Information Department of History",
          "Department of Philosophy",
          "Department of Archaeology",
        ],
      },
      {
        college: "College of Social Sciences:",
        majors: [
          "Department of Public Administration",
          "Department of Political Science and Diplomacy",
          "Department of Social Welfare",
          "Department of Sociology",
          "Department of Psychology",
          "Department of Library",
          "Archive and Information Studies",
          "Department of Media & Communication",
        ],
      },
      {
        college: "College of Economics & International Trade",
        majors: [
          "Department of Public Administration",
          "Department of Political Science and Diplomacy",
          "Department of Social Welfare",
          "Department of Sociology",
          "Department of Psychology",
          "Department of Library",
          "Archive and Information Studies",
          "Department of Media & Communication",
        ],
      },
      {
        college: "School of Business",
        majors: [
          "Department of International Trade",
          "Department of Economics",
          "Department of Tourism and Convention",
          "Department of Public Policy & Management",
        ],
      },
      {
        college: "College of Human Ecology:",
        majors: ["Department of Child Development and Family Studies"],
      },
      {
        college: "College of Natural Resources & Life Sciences",
        majors: ["Department of Food and Resource Economics"],
      },
      {
        college: "College of Natural Sciences",
        majors: [
          "Department of Mathematics",
          "Department of Statistics",
          "Department of Physics",
          "Department of Chemistry",
          "Department of Biological Sciences",
          "Department of Microbiology",
          "Department of Molecular Biology",
          "Department of Geological Sciences",
          "Department of Atmospheric Environmental Sciences",
          "Department of Oceanography",
        ],
      },
      {
        college: "College of Engineering",
        majors: [
          "School of Mechanical Engineering",
          "Department of Polymer Science and Engineering",
          "Department of Organic Material Science and Engineering",
          "School of Chemical Biomolecular and Environmental Engineering (Environmental Engineering Major",
          "Chemical and Biomolecular Engineering Major)",
          "School of Materials Science and Engineering",
          "School of Electrical and Electronics Engineering(Electrical Engineering Major)",
          "School of Electrical and Electronics Engineering(Electronics Engineering Major)",
          "School of Electrical and Electronics Engineering(Semiconductor Engineering Major)",
          "Department of Architecture(5-year program)",
          "Department of Architectural Engineering",
          "Department of Urban Planning & Engineering",
          "Department of Civil Engineering",
          "Department of Aerospace Engineering",
          "Department of Industrial Engineering",
          "Department of Naval Architecture and Ocean Engineering",
        ],
      },
      { college: "College of Nursing", majors: ["Department of Nursing"] },
      {
        college: "College of Human Ecology",
        majors: [
          "Department of Clothing and Textiles",
          "Department of Food Science and Nutrition",
          "Department of Interior & Environmental Design",
        ],
      },
      {
        college: "College of Natural Resources & Life Sciences:.1",
        majors: [
          "Department of Plant Bioscience",
          "Department of Horticultural Bioscience",
          "Department of Animal Science",
          "Department of Food Science & Technology",
          "Department of Life Science & Environmental Biochemistry",
          "Department of Biomaterial Science",
          "Department of Bio-Industrial Machinery Engineering",
          "Department of Applied Information Technology and Engineering",
          "Department of Bioenvironmental Energy",
          "Department of Landscape Architecture",
        ],
      },
      {
        college: "College of Information and BioMedical Engineering",
        majors: [
          "School of BioMedical Convergence Engineering",
          "School of Computer Science and Engineering (Computer Engineering Major",
          "Artificial Intelligence Major)",
        ],
      },
      {
        college: "College of Arts",
        majors: [
          "Department of Music (Vocal Music",
          "Composition)",
          "Department of Fine Arts (Carving & Modeling",
          "Korean Painting",
          "Western Painting)",
          "Department of Plastic Arts (Wooden Furniture Painting",
          "Ceramics",
          "Textiles & Metal)",
          "Department of Korean Music (String Vocal Wind Percussion Theory Composition)",
          "Department of Dance (Korean Dance Ballet Modern Dance)",
          "Department of Design (Visual Design, Animation Design & Technology )",
          "Department of Art Culture and Image",
        ],
      },
    ],
  },
  "sejong-university": {
    english: [
      { college: "Liberal Arts", majors: ["Division of Global Leadership"] },
      {
        college: "Social Sciences",
        majors: ["Public Administration", "Media and Communication"],
      },
      {
        college: "Business and Economics",
        majors: ["Faculty of Business Administration", "Economics"],
      },
      {
        college: "Hospitality and Tourism Management",
        majors: ["Faculty of Hospitality, Tourism and Food Service Management"],
      },
      {
        college: "College of Convergence",
        majors: ["Computer Science and Engineering"],
      },
      { college: "Education", majors: ["Fashion Design", "Music"] },
    ],
    korean: [
      {
        college: "Liberal Arts",
        majors: [
          "Korean Language and Literature",
          "International Studies",
          "History",
          "Education",
        ],
      },
      { college: "Social Sciences", majors: ["Law"] },
      {
        college: "Business and Economics",
        majors: ["Faculty of Business Administration"],
      },
      {
        college: "Hospitality and Tourism Management",
        majors: ["Faculty of Hospitality,Tourism and Food Service Management"],
      },
      {
        college: "Natural Sciences",
        majors: [
          "Mathematics and Statistics",
          "Faculty of Mathematics",
          "Physics and Astronomy",
          "Chemistry",
        ],
      },
      {
        college: "Life Sciences",
        majors: [
          "Faculty of Biological Systems",
          "Integrative Biological Sciences and Industry",
        ],
      },
      {
        college: "College of Convergence",
        majors: [
          "Electrical Engineering",
          "Semiconductor Systems Engineering",
          "Computer and Information Security",
          "Software",
          "Artificial Intelligence and Robotics",
          "Artificial Intelligence and Data Science",
          "School of Intelligent Mechatronics Engineering",
          "Creative Studies",
          "Data Science",
          "Artificial Intelligence",
        ],
      },
      {
        college: "Engineering",
        majors: [
          "Architectural Engineering",
          "Architecture",
          "Civil and Environmental Engineering",
          "Environment",
          "Energy & Geoinformatics",
          "Energy Resources and Geosystems Engineering",
          "School of Aerospace and Drone Engineering",
          "Faculty of Mechanical and Aerospace Engineering",
          "Nano Technology and Advanced Materials Engineering",
          "Quantum and Nuclear Engineering",
        ],
      },
      {
        college: "Education",
        majors: ["Painting", "Physical Education", "Dance", "Film Art"],
      },
    ],
  },
  "seoul-national-university": {
    english: [
      {
        college: "Departments",
        majors: [
          "Please refer to each department`s website to check whether they have English-taught courses. However, in order to graduate from SNU, you will be required to take some courses in Korean.",
        ],
      },
    ],
    korean: [
      {
        college: "College of Humanities",
        majors: [
          "Korean Language and Literature",
          "Chinese Language and Literature",
          "English Language and Literature",
          "French Language and Literature",
          "German Language and Literature",
          "Russian Language and Literature",
          "Hispanic Language and Literature",
          "Linguistics",
          "Asian Languages and Civilizations",
          "History",
          "Archaeology and Art History",
          "Philosophy",
          "Religious Studies",
          "Aesthetics",
        ],
      },
      {
        college: "College of Social Sciences",
        majors: [
          "Political Science and International Relations",
          "Economics",
          "Sociology",
          "Anthropology",
          "Psychology",
          "Geography",
          "Social Welfare",
          "Communication",
          "Statistics",
          "Physics & Astronomy (Physics Major)",
          "Physics & Astronomy (Astronomy Major)",
          "Chemistry",
          "Biological Sciences",
          "Earth and Environmental Sciences",
        ],
      },
      {
        college: "College of Natural Sciences",
        majors: ["Mathematical Sciences"],
      },
      { college: "College of Liberal Studies", majors: ["Liberal Studies"] },
      {
        college: "College of Medicine",
        majors: ["Nursing", "Veterinary Medicine"],
      },
      {
        college: "College of Business Administration",
        majors: ["Business Administration"],
      },
      {
        college: "College of Engineering",
        majors: [
          "Civil and Environmental Engineering",
          "Mechanical Engineering",
          "Materials Science and Engineering",
          "Electrical and Computer Engineering",
          "Computer Science and Engineering",
          "Chemical and Biological Engineering",
          "Architecture and Architectural Engineering",
          "Industrial Engineering",
          "Energy Resources Engineering",
          "Nuclear Engineering",
          "Naval Architecture and Ocean Engineering",
          "Aerospace Engineering",
        ],
      },
      {
        college: "College of Agriculture and Life Sciences",
        majors: [
          "Agricultural and Resource Economics",
          "Regional Information",
          "Crop Science and Biotechnology",
          "Horticultural Science and Biotechnology",
          "Vocational Education and Workforce Development",
          "Forest Environmental Science",
          "Environmental Materials Science",
          "Food Science and Biotechnology",
          "Animal Science and Biotechnology",
          "Applied Life Chemistry",
          "Applied Biology",
          "Landscape Architecture",
          "Rural Systems Engineering",
          "Biosystems Engineering",
          "Biomaterials Engineering",
        ],
      },
      {
        college: "College of Fine Arts",
        majors: ["Oriental Painting", "Painting", "Sculpture", "Craft Design"],
      },
      {
        college: "College of Education",
        majors: [
          "Education Korean Language Education",
          "English Language Education",
          "German Language Education",
          "French Language Education",
          "Social Studies Education",
          "History Education",
          "Geography Education",
          "Ethics Education",
          "Mathematics Education",
          "Physics Education",
          "Chemistry Education",
          "Biology Education",
          "Earth Science Education",
          "Physical Education",
        ],
      },
      {
        college: "College of Human Ecology",
        majors: [
          "Consumer and Child Studies (Consumer Science)",
          "Consumer and Child Studies (Child Development and Family Studies)",
          "Food and Nutrition",
          "Fashion and Textiles",
        ],
      },
      {
        college: "College of Music",
        majors: [
          "Vocal Music",
          "Composition",
          "Music Piano",
          "Orchestral instruments",
          "Korean Music",
        ],
      },
    ],
  },
  "sungkyunkwan-university-skku": {
    english: [{ college: "Departments", majors: ["Not available"] }],
    korean: [
      {
        college: "Humanities",
        majors: [
          "Confucian and Oriental Studies Korean Language and Literature",
          "English Language and Literature",
          "French Language and Literature",
          "Chinese Language and Literature",
          "German Language and Literature",
          "Russian Language and Literature",
          "Korean Literature in Classical Chinese",
          "History",
          "Philosophy",
          "Library and Information Science",
        ],
      },
      {
        college: "Social Sciences",
        majors: [
          "Public Administration",
          "Political Science and Diplomacy",
          "Media and Communication",
          "Sociology",
          "Social Welfare",
          "Psychology",
          "Consumer Sciences",
          "Child Psychology and Education Economics",
          "Statistics",
        ],
      },
      {
        college: "Natural Sciences",
        majors: [
          "Biological Sciences",
          "Mathematics",
          "Physics",
          "Chemistry Food Science and Biotechnology",
          "Bio-Mechatronic Engineering",
          "Integrative Biotechnology",
        ],
      },
      {
        college: "Engineering",
        majors: [
          "Chemical Engineering/Polymer Science & Engineering",
          "Advanced Materials Science and Engineering",
          "Mechanical Engineering",
          "Civil Architectural Engineering and Landscape Architecture",
          "Systems Management Engineering",
          "Nano Engineering",
        ],
      },
    ],
  },
  "ulsan-national-institute-of-science-and-technology-unist": {
    english: [
      {
        college: "College of Engineering",
        majors: [
          "Department of Mechanical Engineering",
          "Department of Urban and Environmental Engineering",
          "Department of Materials Science and Engineering",
          "School of Energy and Chemical Engineering",
          "Department of Nuclear Engineering",
        ],
      },
      {
        college: "College of Information and Biotechnology",
        majors: [
          "Department of Design",
          "Department of Biomedical Engineering",
          "Department of Industrial Engineering",
          "Department of Biological Sciences",
          "Department of Electrical Engineering",
          "Department of Computer Science and Engineering",
        ],
      },
      {
        college: "College of Natural Sciences",
        majors: [
          "Department of Physics",
          "Department of Mathematical Sciences",
          "Department of Chemistry",
        ],
      },
    ],
    korean: [
      {
        college: "College of Engineering",
        majors: [
          "Department of Mechanical Engineering",
          "Department of Earth",
          "Environment and Urban Construction Engineering",
          "Department of New Materials Engineering",
          "Department of Energy and Chemical Engineering",
          "Department of Nuclear Engineering",
          "Department of Semiconductor Engineering (Samsung Electronics Contract Department)",
        ],
      },
      {
        college: "College of Information and Bio Convergence",
        majors: [
          "Department of Design",
          "Department of Biomedical Engineering",
          "Department of Industrial Engineering",
          "Department of Life Sciences",
          "Department of Electrical and Electronic Engineering",
        ],
      },
      {
        college: "College of Natural Sciences",
        majors: [
          "Department of Physics",
          "Department of Mathematical Sciences",
          "Department of Chemistry",
        ],
      },
    ],
  },
  "university-of-seoul": {
    english: [{ college: "Departments", majors: ["Not available"] }],
    korean: [
      {
        college: "Public Affairs and Economics",
        majors: [
          "Public Administration",
          "International Relations",
          "Social Welfare",
          "Economics",
          "Science in Taxation",
        ],
      },
      {
        college: "Business Administration",
        majors: ["Business Administration:"],
      },
      {
        college: "Engineering",
        majors: [
          "Electrical and Computer Engineering",
          "Chemical Engineering",
          "Mechanical and Information Engineering",
          "New Materials Science and Engineering",
          "Civil Engineering",
          "Computer Science and Engineering",
          "Artificial Intelligence",
        ],
      },
      {
        college: "Humanities",
        majors: [
          "English Language and Literature",
          "Korean Language and Literature",
          "Korean History",
          "Philosophy",
          "Chinese Language and Culture",
        ],
      },
      {
        college: "Natural Science",
        majors: [
          "Mathematics",
          "Statistics",
          "Physics",
          "Life Sciences",
          "Environmental Horticulture",
          "Applied Chemistry",
        ],
      },
      {
        college: "Urban Science",
        majors: [
          "Architecture (five-years)",
          "Architectural Engineering",
          "Urban Planning and Design",
          "Transportation Engineering",
          "Landscape Architecture",
          "Urban Administration",
          "Urban Sociology",
          "Geoinformatics",
          "Environmental Engineering",
        ],
      },
      {
        college: "Arts and Physical Education",
        majors: [
          "Music",
          "Design",
          "Sports Science",
          "Environmental Sculpture",
        ],
      },
    ],
  },
  "yonsei-university": {
    english: [
      {
        college: "International studies",
        majors: [
          "Comparative Literature and Culture",
          "Economics",
          "International Studies",
          "Political Science and International Relations",
          "Life Science and Biotechnology",
        ],
      },
      {
        college: "Humanities, Arts, and Social Sciences",
        majors: [
          "Asian Studies",
          "Information and Interaction Design",
          "Creative Technology Management",
          "Culture and Design Management",
          "Justice and Civil Leadership",
          "Quantitative Risk Management. Science",
          "Technology",
          "and Policy",
          "Sustainable Development and Cooperation",
        ],
      },
      {
        college: "Integrated Science and Engineering",
        majors: [
          "Bio-Convergence",
          "Energy and Environmental Science and Engineering",
          "Nano Science and Engineering",
        ],
      },
    ],
    korean: [
      {
        college: "Departments",
        majors: [
          "Yonsei Underwood International College does not offer courses in Korean.",
        ],
      },
    ],
  },
};

export function getUniversityMajors(slug: string): UniversityMajors | null {
  const m = UNIVERSITY_MAJORS[slug];
  if (!m || (m.english.length === 0 && m.korean.length === 0)) return null;
  return m;
}
