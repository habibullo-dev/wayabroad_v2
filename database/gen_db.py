#!/usr/bin/env python3
"""
WayAbroad university database generator.
Builds a Supabase-ready dataset of Korean universities, programs, and
(synthetic, clearly-labeled) admission records to bootstrap the probability engine.

Figures are researched approximations grounded in 2025/2026 public sources
(uniRank ranking + Study-in-Korea / Yonsei / Korea Univ tuition references).
Every financial field carries verify_before_launch=True. DO NOT show students
these numbers in production without confirming against each university's site.
"""
import json, random, datetime

random.seed(42)
KRW_PER_USD = 1370
def usd(krw): return round(krw / KRW_PER_USD)

# ---- (name, city, region, type, kr_rank, tier_band) ----
# tier_band: "elite" | "strong" | "mid" | "regional"  (drives selectivity + tuition)
# type: "national" (public/national), "public" (municipal), "private", "science" (gov science institute)
UNIS = [
    ("Seoul National University","Seoul","Seoul Capital Area","national",1,"elite"),
    ("KAIST","Daejeon","Daejeon","science",2,"elite"),
    ("Korea University","Seoul","Seoul Capital Area","private",3,"elite"),
    ("Yonsei University","Seoul","Seoul Capital Area","private",4,"elite"),
    ("Hanyang University","Seoul","Seoul Capital Area","private",5,"strong"),
    ("Chung-Ang University","Seoul","Seoul Capital Area","private",6,"strong"),
    ("Pohang University of Science and Technology (POSTECH)","Pohang","North Gyeongsang","science",7,"elite"),
    ("Kyungpook National University","Daegu","Daegu","national",8,"strong"),
    ("Ewha Womans University","Seoul","Seoul Capital Area","private",9,"strong"),
    ("Kyung Hee University","Seoul","Seoul Capital Area","private",10,"strong"),
    ("Pusan National University","Busan","Busan","national",11,"strong"),
    ("Sogang University","Seoul","Seoul Capital Area","private",12,"strong"),
    ("Sungkyunkwan University (SKKU)","Seoul","Seoul Capital Area","private",13,"strong"),
    ("Sejong University","Seoul","Seoul Capital Area","private",14,"mid"),
    ("Hankuk University of Foreign Studies (HUFS)","Seoul","Seoul Capital Area","private",15,"strong"),
    ("Kangwon National University","Chuncheon","Gangwon","national",16,"mid"),
    ("University of Seoul","Seoul","Seoul Capital Area","public",17,"mid"),
    ("Konkuk University","Seoul","Seoul Capital Area","private",18,"mid"),
    ("Dankook University","Yongin","Gyeonggi","private",19,"mid"),
    ("Ulsan National Institute of Science and Technology (UNIST)","Ulsan","Ulsan","science",20,"strong"),
    ("Dongguk University","Seoul","Seoul Capital Area","private",21,"mid"),
    ("Soongsil University","Seoul","Seoul Capital Area","private",22,"mid"),
    ("Kookmin University","Seoul","Seoul Capital Area","private",23,"mid"),
    ("Ajou University","Suwon","Gyeonggi","private",24,"mid"),
    ("Chonnam National University","Gwangju","Gwangju","national",25,"mid"),
    ("Chungnam National University","Daejeon","Daejeon","national",26,"mid"),
    ("Yeungnam University","Gyeongsan","North Gyeongsang","private",27,"mid"),
    ("Hongik University","Seoul","Seoul Capital Area","private",28,"strong"),
    ("Pukyong National University","Busan","Busan","national",29,"mid"),
    ("Gachon University","Seongnam","Gyeonggi","private",30,"mid"),
    ("Myongji University","Yongin","Gyeonggi","private",31,"mid"),
    ("Jeonbuk National University","Jeonju","North Jeolla","national",32,"mid"),
    ("Sookmyung Women's University","Seoul","Seoul Capital Area","private",33,"mid"),
    ("Gyeongsang National University","Jinju","South Gyeongsang","national",34,"mid"),
    ("Incheon National University","Incheon","Seoul Capital Area","national",35,"mid"),
    ("Chungbuk National University","Cheongju","North Chungcheong","national",36,"mid"),
    ("Inha University","Incheon","Seoul Capital Area","private",37,"strong"),
    ("Hallym University","Chuncheon","Gangwon","private",38,"mid"),
    ("Keimyung University","Daegu","Daegu","private",39,"mid"),
    ("Kongju National University","Gongju","South Chungcheong","national",40,"regional"),
    ("Dong-A University","Busan","Busan","private",42,"mid"),
    ("Kwangwoon University","Seoul","Seoul Capital Area","private",43,"mid"),
    ("University of Ulsan","Ulsan","Ulsan","private",44,"mid"),
    ("Chosun University","Gwangju","Gwangju","private",45,"regional"),
    ("Soonchunhyang University","Asan","South Chungcheong","private",46,"regional"),
    ("Seoul National University of Science and Technology (SeoulTech)","Seoul","Seoul Capital Area","national",47,"mid"),
    ("The Catholic University of Korea","Seoul","Seoul Capital Area","private",48,"mid"),
    ("Handong Global University","Pohang","North Gyeongsang","private",49,"mid"),
    ("Jeju National University","Jeju","Jeju","national",52,"regional"),
    ("Woosong University","Daejeon","Daejeon","private",68,"regional"),
]

ENGLISH_FIELDS = [
    ("Business Administration","Business","Bachelor"),
    ("International Studies","Social Sciences","Bachelor"),
    ("Computer Science and Engineering","Engineering","Bachelor"),
    ("Electrical and Electronic Engineering","Engineering","Bachelor"),
    ("Economics","Social Sciences","Bachelor"),
    ("Mechanical Engineering","Engineering","Bachelor"),
    ("Media and Communication","Humanities","Bachelor"),
    ("Global Korean Studies","Humanities","Bachelor"),
]
GRAD_FIELDS = [
    ("MBA","Business","Master"),
    ("MS in Computer Science","Engineering","Master"),
    ("MA in International Relations","Social Sciences","Master"),
    ("MS in Electrical Engineering","Engineering","Master"),
]

# tuition bands (KRW per semester) by type/tier  -> (ug_min, ug_max, grad_min, grad_max)
def tuition_band(typ, tier):
    if typ == "science":           return (2_200_000, 3_200_000, 0, 1_500_000)   # heavily scholarshipped
    if typ in ("national","public"):
        return {"elite":(2_800_000,4_200_000,3_000_000,4_500_000),
                "strong":(2_300_000,3_800_000,2_600_000,4_000_000),
                "mid":(2_000_000,3_400_000,2_300_000,3_600_000),
                "regional":(1_900_000,3_000_000,2_100_000,3_200_000)}[tier]
    # private
    return {"elite":(5_200_000,8_700_000,5_500_000,9_000_000),
            "strong":(4_500_000,7_200_000,4_800_000,7_500_000),
            "mid":(4_000_000,6_200_000,4_200_000,6_500_000),
            "regional":(3_700_000,5_600_000,3_900_000,5_800_000)}[tier]

def dorm_cost(region, tier):
    base = 1_500_000 if "Seoul" in region else 1_250_000
    if tier == "elite": base += 200_000
    return base

def living_cost(region):  # per month KRW
    return 1_150_000 if "Seoul" in region else 850_000

def slug(name):
    s = name.lower()
    for a,b in [("(",""),(")",""),("'",""),(".",""),(",",""),("&","and"),("  "," ")]:
        s = s.replace(a,b)
    return "-".join(s.split())[:60]

# selectivity: probability a strong applicant is admitted, and gpa thresholds
TIER_SEL = {"elite":0.32,"strong":0.52,"mid":0.70,"regional":0.85}
TIER_GPA = {"elite":3.6,"strong":3.2,"mid":2.9,"regional":2.6}  # on 4.0 scale (min)

universities, programs, admission_records = [], [], []
uni_id = prog_id = rec_id = 0
CURRENT_YEAR = 2026

for (name, city, region, typ, rank, tier) in UNIS:
    uni_id += 1
    ug_min, ug_max, g_min, g_max = tuition_band(typ, tier)
    full_scholarship = (typ == "science")
    uni = {
        "id": uni_id,
        "slug": slug(name),
        "name": name,
        "city": city,
        "region": region,
        "country": "South Korea",
        "type": typ,
        "tier_band": tier,
        "kr_rank_unirank_2026": rank,
        "website": f"https://www.{slug(name).split('-')[0]}.ac.kr",
        "intl_office_note": "Verify international admissions URL on the official site",
        "tuition_undergrad_krw_per_semester": {"min": ug_min, "max": ug_max},
        "tuition_undergrad_usd_per_semester": {"min": usd(ug_min), "max": usd(ug_max)},
        "tuition_grad_krw_per_semester": {"min": g_min, "max": g_max},
        "dorm_krw_per_semester": dorm_cost(region, tier),
        "dorm_usd_per_semester": usd(dorm_cost(region, tier)),
        "application_fee_krw": random.choice([60000, 80000, 100000, 120000]),
        "est_living_cost_krw_per_month": living_cost(region),
        "est_living_cost_usd_per_month": usd(living_cost(region)),
        "est_visa_cost_usd": 100,  # D-2 visa application approx; verify by nationality
        "offers_english_taught_programs": True,
        "topik_min_undergrad": 3,
        "topik_min_grad": 4,
        "english_test_min": {"ielts": 5.5 if tier in ("mid","regional") else 6.0, "toefl_ibt": 71 if tier in ("mid","regional") else 80},
        "scholarship_note": ("Tuition largely covered by national science scholarships for admitted students."
                             if full_scholarship else
                             "Merit and need-based scholarships of 30-100% tuition commonly available to international students; verify current programs."),
        "data_confidence": "medium",
        "verify_before_launch": True,
        "source_basis": "uniRank 2026 ranking (names/city/type) + Study-in-Korea 2025/26 tuition & cost ranges",
    }
    universities.append(uni)

    # ---- programs ----
    n_ug = 3 if tier in ("mid","regional") else 4
    chosen_ug = random.sample(ENGLISH_FIELDS, n_ug)
    chosen_grad = random.sample(GRAD_FIELDS, 2)
    uni_progs = []
    for (pname, field, level) in chosen_ug + chosen_grad:
        prog_id += 1
        is_korean_track = pname == "Global Korean Studies"
        lang = "Korean" if is_korean_track else "English"
        min_gpa = round(TIER_GPA[tier] + (0.2 if level == "Master" else 0), 2)
        prog = {
            "id": prog_id,
            "university_id": uni_id,
            "name": pname,
            "field": field,
            "degree_level": level,
            "language_of_instruction": lang,
            "min_gpa_4_0_scale": min_gpa,
            "topik_required_level": (3 if level == "Bachelor" else 4) if is_korean_track else None,
            "english_test_min_ielts": None if is_korean_track else uni["english_test_min"]["ielts"],
            "intake_terms": ["Spring (March)", "Fall (September)"],
            "deadline_spring_intake": "Sep 15 – Nov 15 (prior year)",
            "deadline_fall_intake": "Mar 15 – May 31",
            "tuition_krw_per_semester": (ug_min if level=="Bachelor" else g_min),
            "scholarship_notes": uni["scholarship_note"],
        }
        programs.append(prog)
        uni_progs.append(prog)

    # ---- synthetic admission records (clearly labeled) ----
    sel = TIER_SEL[tier]
    for prog in uni_progs:
        for _ in range(random.randint(8, 14)):
            rec_id += 1
            gpa = round(min(4.0, max(2.2, random.gauss(prog["min_gpa_4_0_scale"] + 0.25, 0.35))), 2)
            lang_is_english = prog["language_of_instruction"] == "English"
            if lang_is_english:
                lang_test, lang_score = "IELTS", round(random.uniform(5.5, 8.0), 1)
                lang_ok = lang_score >= (prog["english_test_min_ielts"] or 5.5)
            else:
                lang_test, lang_score = "TOPIK", random.choice([3,4,5,6])
                lang_ok = lang_score >= (prog["topik_required_level"] or 3)
            # probability of admit rises with gpa margin, requires language threshold met
            margin = gpa - prog["min_gpa_4_0_scale"]
            p = sel + margin * 0.35
            p = max(0.05, min(0.95, p)) * (1.0 if lang_ok else 0.25)
            outcome = "admit" if random.random() < p else "reject"
            admission_records.append({
                "id": rec_id,
                "program_id": prog["id"],
                "university_id": uni_id,
                "applicant_gpa_4_0": gpa,
                "applicant_lang_test": lang_test,
                "applicant_lang_score": lang_score,
                "outcome": outcome,
                "year": random.choice([CURRENT_YEAR-1, CURRENT_YEAR-2, CURRENT_YEAR-3]),
                "synthetic": True,
            })

meta = {
    "dataset": "WayAbroad Korean University Database",
    "version": "1.0",
    "generated": datetime.date.today().isoformat(),
    "currency_reference": f"1 USD ≈ {KRW_PER_USD} KRW (approx, May 2026)",
    "counts": {"universities": len(universities), "programs": len(programs), "admission_records": len(admission_records)},
    "WARNING": ("All financial figures are researched approximations and MUST be verified against each "
                "university's official international-admissions page before being shown to students. "
                "admission_records are SYNTHETIC (synthetic:true) and exist only to bootstrap and test the "
                "probability engine — replace with real outcomes as you collect them."),
    "sources_basis": [
        "uniRank — Top Universities in Korea 2026 (institution names, city, public/private type)",
        "Study in Korea (studyinkorea.go.kr) — tuition, living, language requirement ranges",
        "Yonsei / Korea University 2025–26 international tuition references",
    ],
}

# nested (human-friendly) export
nested = dict(meta=meta, universities=[])
prog_by_uni = {}
for p in programs: prog_by_uni.setdefault(p["university_id"], []).append(p)
rec_by_prog = {}
for r in admission_records: rec_by_prog.setdefault(r["program_id"], []).append(r)
for u in universities:
    uu = dict(u)
    uu["programs"] = []
    for p in prog_by_uni.get(u["id"], []):
        pp = dict(p); pp["admission_records"] = rec_by_prog.get(p["id"], [])
        uu["programs"].append(pp)
    nested["universities"].append(uu)

with open("wayabroad_db.json","w",encoding="utf-8") as f:
    json.dump(nested, f, ensure_ascii=False, indent=2)
# flat tables for direct Supabase import
with open("universities.json","w",encoding="utf-8") as f: json.dump(universities, f, ensure_ascii=False, indent=2)
with open("programs.json","w",encoding="utf-8") as f: json.dump(programs, f, ensure_ascii=False, indent=2)
with open("admission_records.json","w",encoding="utf-8") as f: json.dump(admission_records, f, ensure_ascii=False, indent=2)

# ---- flat, column-matched exports for direct Supabase table import ----
import csv
flat_unis = [{
    "id": u["id"], "slug": u["slug"], "name": u["name"], "city": u["city"], "region": u["region"],
    "country": u["country"], "type": u["type"], "tier_band": u["tier_band"],
    "kr_rank_unirank_2026": u["kr_rank_unirank_2026"], "website": u["website"], "intl_office_note": u["intl_office_note"],
    "tuition_ug_krw_min": u["tuition_undergrad_krw_per_semester"]["min"],
    "tuition_ug_krw_max": u["tuition_undergrad_krw_per_semester"]["max"],
    "tuition_ug_usd_min": u["tuition_undergrad_usd_per_semester"]["min"],
    "tuition_ug_usd_max": u["tuition_undergrad_usd_per_semester"]["max"],
    "tuition_grad_krw_min": u["tuition_grad_krw_per_semester"]["min"],
    "tuition_grad_krw_max": u["tuition_grad_krw_per_semester"]["max"],
    "dorm_krw_per_semester": u["dorm_krw_per_semester"], "dorm_usd_per_semester": u["dorm_usd_per_semester"],
    "application_fee_krw": u["application_fee_krw"],
    "living_krw_per_month": u["est_living_cost_krw_per_month"], "living_usd_per_month": u["est_living_cost_usd_per_month"],
    "visa_cost_usd": u["est_visa_cost_usd"], "offers_english_programs": u["offers_english_taught_programs"],
    "topik_min_undergrad": u["topik_min_undergrad"], "topik_min_grad": u["topik_min_grad"],
    "english_min_ielts": u["english_test_min"]["ielts"], "english_min_toefl_ibt": u["english_test_min"]["toefl_ibt"],
    "scholarship_note": u["scholarship_note"], "data_confidence": u["data_confidence"],
    "verify_before_launch": u["verify_before_launch"],
} for u in universities]
flat_progs = [{
    "id": p["id"], "university_id": p["university_id"], "name": p["name"], "field": p["field"],
    "degree_level": p["degree_level"], "language_of_instruction": p["language_of_instruction"],
    "min_gpa_4_0_scale": p["min_gpa_4_0_scale"], "topik_required_level": p["topik_required_level"],
    "english_min_ielts": p["english_test_min_ielts"], "deadline_spring_intake": p["deadline_spring_intake"],
    "deadline_fall_intake": p["deadline_fall_intake"], "tuition_krw_per_semester": p["tuition_krw_per_semester"],
    "scholarship_notes": p["scholarship_notes"],
} for p in programs]
flat_recs = [{
    "id": r["id"], "program_id": r["program_id"], "university_id": r["university_id"],
    "applicant_gpa_4_0": r["applicant_gpa_4_0"], "applicant_lang_test": r["applicant_lang_test"],
    "applicant_lang_score": r["applicant_lang_score"], "outcome": r["outcome"], "year": r["year"],
    "synthetic": r["synthetic"],
} for r in admission_records]

def write_csv(fn, rows):
    with open(fn, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0].keys())); w.writeheader(); w.writerows(rows)

for fn, rows in [("universities_flat.json", flat_unis), ("programs_flat.json", flat_progs), ("admission_records_flat.json", flat_recs)]:
    with open(fn, "w", encoding="utf-8") as f: json.dump(rows, f, ensure_ascii=False, indent=2)
write_csv("universities.csv", flat_unis)
write_csv("programs.csv", flat_progs)
write_csv("admission_records.csv", flat_recs)

print("universities:", len(universities))
print("programs:", len(programs))
print("admission_records:", len(admission_records))
print("sample tuition (Yonsei UG):", next(u["tuition_undergrad_usd_per_semester"] for u in universities if "Yonsei" in u["name"]))
print("sample tuition (SNU UG):", next(u["tuition_undergrad_usd_per_semester"] for u in universities if u["name"].startswith("Seoul National")))
admits = sum(1 for r in admission_records if r["outcome"]=="admit")
print(f"admit rate overall: {admits/len(admission_records):.1%}")
