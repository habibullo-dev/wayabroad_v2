/**
 * Curated, editorial per-university info (description, QS world ranking, admission
 * requirements), keyed by slug. Hand-collected in the v1 wayabroad project, so it is
 * INDICATIVE and may be dated — the UI labels it as guidance to verify with the
 * university, not as live fact. 21 universities covered.
 */
export interface UniversityInfo {
  description: string;
  /** QS world ranking — a number or a band like "611–620"; null if unknown. */
  qsRank: string | null;
  requirements: string[];
}

const UNIVERSITY_INFO: Record<string, UniversityInfo> = {
  "ajou-university": {
    description:
      "Ajou University is a leading research institution in South Korea, known for its strong emphasis on engineering, technology, and internationalization. Situated in Suwon, Ajou offers a diverse range of programs and research opportunities, preparing students for global leadership roles.",
    qsRank: "631–640",
    requirements: ["IELTS 5.5 or TOPIK 3.0"],
  },
  "chonnam-national-university": {
    description:
      "Chonnam National University (CNU) is a distinguished research institution located in Gwangju, South Korea, known for its commitment to academic excellence and social responsibility. With a focus on interdisciplinary collaboration and community engagement, CNU offers a wide range of programs addressing societal challenges and contributing to regional development.",
    qsRank: "851–900",
    requirements: ["IELTS 5.5 or TOPIK 3.0"],
  },
  "chung-ang-university": {
    description:
      "Chung Ang University is one of South Korea's top universities, renowned for its academic excellence and vibrant campus culture. With campuses in Seoul and Anseong, Chung Ang offers a wide range of programs across disciplines, emphasizing creativity, innovation, and global perspectives.",
    qsRank: "494",
    requirements: [
      "IELTS 5.5 or TOPIK 4.0 (No Korean - Korean course 6 months)",
    ],
  },
  "chungnam-national-university": {
    description:
      "Chungnam National University (CNU) is a leading research university located in Daejeon, South Korea, renowned for its academic excellence and innovative research initiatives. With a strong emphasis on science, engineering, and technology, CNU fosters a culture of creativity and collaboration, producing top-tier graduates and contributing to advancements in various fields.",
    qsRank: "851–900",
    requirements: ["IELTS 5.5 or TOPIK 3.0"],
  },
  "ewha-womans-university": {
    description:
      "Ewha Womans University is a prestigious women's university in Seoul, known for its long history of empowering women through education. Ewha offers a wide range of programs across disciplines, fostering a supportive environment for female students to excel academically and professionally.",
    qsRank: "498",
    requirements: ["IELTS 6.0", "TOPIK is not required for Korean track"],
  },
  "hankuk-university-of-foreign-studies-hufs": {
    description:
      "Hankuk Foreign Studies University (HFSU) is a specialized institution in Seoul, renowned for its focus on foreign languages and international studies. HFSU offers comprehensive language programs and a vibrant international community, preparing students for successful careers in global contexts.",
    qsRank: "575",
    requirements: ["IELTS 5.5 or TOPIK 3.0"],
  },
  "hanyang-university": {
    description:
      "Hanyang University is a leading research university in South Korea, renowned for its strong emphasis on engineering, technology, and entrepreneurship. With campuses in Seoul and Ansan, Hanyang offers a dynamic learning environment and diverse opportunities for academic and extracurricular engagement.",
    qsRank: "164",
    requirements: ["IELTS 6.0 or TOPIK 4.0", "Interview"],
  },
  "inha-university": {
    description:
      "Inha University is a prestigious research institution located in Incheon, South Korea, renowned for its excellence in engineering, technology, and maritime studies. With a strong focus on practical education and industry collaboration, Inha offers a diverse range of programs preparing students for successful careers in various fields.",
    qsRank: "691–700",
    requirements: ["IELTS 5.5 or TOPIK 3.0"],
  },
  "jeonbuk-national-university": {
    description:
      "Jeonbuk National University (JNU) is a leading research university located in Jeonju, South Korea, known for its comprehensive academic programs and strong research infrastructure. JNU fosters innovation and creativity, offering a wide range of undergraduate and graduate programs across disciplines, contributing to regional development and global knowledge exchange.",
    qsRank: "721–730",
    requirements: ["IELTS 5.5 or TOPIK 3.0"],
  },
  kaist: {
    description:
      "KAIST (Korea Advanced Institute of Science and Technology) is a leading research university globally recognized for its excellence in science, engineering, and technology. Located in Daejeon, KAIST fosters innovation and entrepreneurship, producing top-tier graduates and contributing significantly to advancements in science and technology.",
    qsRank: "56",
    requirements: [
      "IELTS 6.5  and SAT (nor required",
      "but recommended)",
      "Honors and Awards",
      "Recommendation letter",
    ],
  },
  "konkuk-university": {
    description:
      "Konkuk University is a prominent institution in Seoul, South Korea, known for its dynamic academic programs and vibrant campus life. With a strong emphasis on innovation and entrepreneurship, Konkuk offers diverse opportunities for students to engage in research, internships, and international exchange, preparing them for success in the global marketplace.",
    qsRank: "801–850",
    requirements: ["TOPIK 3.0"],
  },
  "korea-university": {
    description:
      "Korea University is a prestigious institution known for its comprehensive academic offerings and vibrant campus life. Located in Seoul, it emphasizes research, innovation, and global engagement, providing students with a dynamic learning environment and numerous opportunities for personal and professional growth.",
    qsRank: "79",
    requirements: ["IELTS 6.0 or TOPIK 3.0"],
  },
  "kyung-hee-university": {
    description:
      "Kyung Hee University is a prestigious institution known for its commitment to holistic education and global citizenship. With campuses in Seoul, Suwon, and Gwangneung, Kyung Hee offers a wide range of programs emphasizing creativity, humanism, and social responsibility.",
    qsRank: "332",
    requirements: ["IELTS 6.0 or TOPIK 3.0 and Interview"],
  },
  "kyungpook-national-university": {
    description:
      "Kyungpook National University (KNU) is one of South Korea's leading research universities, known for its strong emphasis on science, engineering, and medicine. With campuses in Daegu and Sangju, KNU offers a diverse range of programs and research opportunities, contributing to advancements in various fields.",
    qsRank: "520",
    requirements: ["IELTS 5.5 or TOPIK 3.0"],
  },
  "pusan-national-university": {
    description:
      "Pusan National University (PNU) is a prominent research university located in Busan, known for its academic excellence and contributions to regional development. PNU offers a wide range of programs across disciplines, fostering innovation and collaboration to address societal challenges.",
    qsRank: "611–620",
    requirements: ["IELTS 5.5 or TOPIK 3"],
  },
  "sejong-university": {
    description:
      "Sejong University is a comprehensive institution located in Seoul, known for its strong academic programs and commitment to practical education. Sejong University offers a diverse range of undergraduate and graduate programs, preparing students for successful careers in various fields.",
    qsRank: "436",
    requirements: [
      "IELTS 5.5 or TOPIK 2.0 (Creative Studies",
      "Arts and Physical Education majors)",
      "TOPIK 4.0 (Korean Language and Literature,Media and Communication",
      "Business Administration)",
      "TOPIK 3.0 (Other majors)",
    ],
  },
  "seoul-national-university": {
    description:
      "Seoul National University (SNU) is one of South Korea's most prestigious universities, known for its rigorous academic programs and cutting-edge research. Situated in the heart of Seoul, SNU boasts a strong faculty and diverse student body, offering programs across various disciplines.",
    qsRank: "41",
    requirements: [
      "Recommendation Letter(600 words)",
      "TOPIK 3.0 or IELTS 6.0",
      "SAT(Optional)",
      "Extra Curricular activities",
    ],
  },
  "sungkyunkwan-university-skku": {
    description:
      "Sungkyunkwan University (SKKU) is one of South Korea's oldest and most prestigious universities, known for its rich history and academic excellence. With campuses in Seoul and Suwon, SKKU offers a wide range of programs spanning various fields, fostering a tradition of scholarship and leadership.",
    qsRank: "145",
    requirements: ["IELTS 6.0 or TOPIK/Korean test"],
  },
  "ulsan-national-institute-of-science-and-technology-unist": {
    description:
      "UNIST (Ulsan National Institute of Science and Technology) is a dynamic research university located in Ulsan, known for its innovative approach to education and interdisciplinary research. UNIST focuses on science and technology, aiming to address global challenges and produce leaders in various fields.",
    qsRank: "266",
    requirements: [
      "IELTS or TOPIK (The minimum score is not specified by the admission)",
    ],
  },
  "university-of-seoul": {
    description:
      "University of Seoul (UOS) is a prestigious institution located in the heart of Seoul, South Korea, known for its comprehensive academic programs and commitment to social justice and sustainability. With a diverse student body and strong faculty, UOS offers a wide range of programs across disciplines, preparing students to become global citizens and leaders in their respective fields.",
    qsRank: "951–1000",
    requirements: ["TOPIK 3.0"],
  },
  "yonsei-university": {
    description:
      "Yonsei University, Underwood International College, is a renowned institution with a strong focus on international education and global perspectives. Situated in Seoul, it offers a wide range of undergraduate and graduate programs taught in English, attracting students from around the world to its vibrant campus.",
    qsRank: "76",
    requirements: [
      "IELTS 6.5 and SAT(Optional) and Extra Curricular activies",
      "Interview",
    ],
  },
};

export function getUniversityInfo(slug: string): UniversityInfo | null {
  return UNIVERSITY_INFO[slug] ?? null;
}
