from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import os
import cv2
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing import image
import google.generativeai as genai

# ─────────────────────────────────────────────
# Flask app
# ─────────────────────────────────────────────
app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

MODEL_PATH = r"01_classification\models\leaf_model_classes.keras"
model = tf.keras.models.load_model(MODEL_PATH)

# ─────────────────────────────────────────────
# CLASS_NAMES — sorted alphabetically (62 classes)
# Matches: np.array(sorted([item.name for item in data_dir.glob("*")]))
# ─────────────────────────────────────────────
CLASS_NAMES = [
    'Apple___Apple_scab',
    'Apple___Black_rot',
    'Apple___Cedar_apple_rust',
    'Apple___healthy',
    'Blueberry___healthy',
    'Cherry_(including_sour)___Powdery_mildew',
    'Cherry_(including_sour)___healthy',
    'Corn_(maize)___Common_rust_',
    'Corn_(maize)___Northern_Leaf_Blight',
    'Corn_(maize)___healthy',
    'Cotton___Bacterial_blight',
    'Cotton___Cotton_leaf_curl_virus',
    'Cotton___Fusarium_wilt',
    'Cotton___healthy',
    'Grape___Black_rot',
    'Grape___Esca_(Black_Measles)',
    'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
    'Grape___healthy',
    'Orange___Haunglongbing_(Citrus_greening)',
    'Peach___Bacterial_spot',
    'Peach___healthy',
    'Pepper,_bell___Bacterial_spot',
    'Pepper,_bell___healthy',
    'Potato___Early_blight',
    'Potato___Late_blight',
    'Potato___healthy',
    'Raspberry___healthy',
    'RedRust sugarcane',
    'Rice___Bacterial_leaf_blight',
    'Rice___Brown_spot',
    'Rice___Leaf_blast',
    'Rice___Leaf_scald',
    'Rice___Sheath_blight',
    'Rice___healthy',
    'Soybean___healthy',
    'Squash___Powdery_mildew',
    'Strawberry___Leaf_scorch',
    'Strawberry___healthy',
    'Sugarcane___Mosaic',
    'Sugarcane___Red_rot',
    'Sugarcane___Rust',
    'Sugarcane___Yellow_leaf_disease',
    'Sugarcane___healthy',
    'Tomato___Bacterial_spot',
    'Tomato___Early_blight',
    'Tomato___Late_blight',
    'Tomato___Leaf_Mold',
    'Tomato___Septoria_leaf_spot',
    'Tomato___Spider_mites Two-spotted_spider_mite',
    'Tomato___Target_Spot',
    'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
    'Tomato___Tomato_mosaic_virus',
    'Tomato___healthy',
    'Wheat___Mite',
    'Wheat___Powdery_mildew',
    'Wheat___Scrab',
    'Wheat___Septoria_leaf_blight',
    'Wheat___Stem_fly',
    'Wheat___Stripe_rust',
    'Wheat___Yellow_rust',
    'Wheat___aphid',
    'Wheat___healthy',
]

# ─────────────────────────────────────────────
# DISEASE RECOMMENDATIONS DATABASE — all 62 classes
# ─────────────────────────────────────────────
DISEASE_RECOMMENDATIONS = {

    # ══════════════════ APPLE ══════════════════
    "Apple___Apple_scab": {
        "severity": "moderate",
        "cause": "Fungus — Venturia inaequalis",
        "description": "Olive-brown to dark scab lesions on leaves and fruit surface. Common in humid spring conditions.",
        "immediate_steps": [
            "Remove and destroy all fallen leaves and infected fruit immediately.",
            "Prune affected branches to improve air circulation.",
            "Avoid overhead irrigation — switch to drip irrigation."
        ],
        "treatment": {
            "Contact fungicide": "Mancozeb 75% WP @ 2.5 g/L or Captan 50% WP @ 3 g/L. Spray every 10–14 days.",
            "Systemic fungicide": "Myclobutanil 10% WP @ 1 g/L for curative action after infection.",
        },
        "prevention": [
            "Plant scab-resistant apple varieties (e.g., Enterprise, Liberty).",
            "Apply protective fungicides before spring rains.",
            "Maintain orchard sanitation — remove leaf litter after harvest."
        ],
        "organic_remedy": "Neem oil (5 mL/L) or sulfur 80% WP (3 g/L) spray weekly as preventive. Bordeaux mixture (0.5%) before bud break.",
        "yield_impact": "Up to 70% fruit loss in wet seasons if untreated."
    },

    "Apple___Black_rot": {
        "severity": "high",
        "cause": "Fungus — Botryosphaeria obtusa",
        "description": "Circular brown lesions with black fruiting bodies (pycnidia) on fruit and leaves. Mummified black fruit remain on tree.",
        "immediate_steps": [
            "Remove all mummified fruit from trees and ground immediately.",
            "Prune dead wood and cankers at least 15 cm below visible infection.",
            "Sterilize pruning tools with 70% alcohol between cuts."
        ],
        "treatment": {
            "Contact fungicide": "Captan 50% WP @ 3 g/L. Spray every 10–14 days.",
            "Systemic fungicide": "Thiophanate-methyl 70% WP @ 1 g/L or Trifloxystrobin + Tebuconazole for severe infections.",
        },
        "prevention": [
            "Eliminate fire blight cankers — they serve as infection reservoirs.",
            "Ensure good drainage and avoid waterlogged soil.",
            "Apply dormant copper sprays before bud break each spring."
        ],
        "organic_remedy": "Copper Bordeaux mixture (1%) as a protective spray before flowering season.",
        "yield_impact": "Significant fruit rot — act within 48 hours of first symptoms."
    },

    "Apple___Cedar_apple_rust": {
        "severity": "moderate",
        "cause": "Fungus — Gymnosporangium juniperi-virginianae (requires both apple and cedar/juniper host)",
        "description": "Bright orange-yellow spots on upper leaf surfaces. Requires alternate host (Eastern red cedar or juniper) nearby.",
        "immediate_steps": [
            "Remove nearby juniper or cedar trees if feasible — they are the alternate host.",
            "Rake and destroy fallen infected leaves.",
            "Apply fungicide at early pink bud stage before infection."
        ],
        "treatment": {
            "Systemic fungicide": "Myclobutanil 10% WP @ 1 g/L or Propiconazole 25% EC @ 0.8 mL/L.",
            "Timing": "Spray from pink bud to 3–4 weeks after petal fall for best control.",
        },
        "prevention": [
            "Plant rust-resistant apple varieties.",
            "Avoid planting apples near Eastern red cedar or juniper trees.",
            "Apply fungicides preventively during wet spring weather."
        ],
        "organic_remedy": "Sulfur dust (2 g/L) applied before infection periods. Remove orange galls from nearby junipers in winter.",
        "yield_impact": "Reduces photosynthesis and fruit quality. Rarely kills the tree if managed early."
    },

    "Apple___healthy": {
        "severity": "none",
        "cause": "No disease detected",
        "description": "Your apple plant appears healthy. Maintain current practices.",
        "immediate_steps": [
            "Continue regular scouting every 7–10 days.",
            "Ensure balanced NPK fertilization.",
            "Monitor for early signs of scab, rust, or black rot."
        ],
        "treatment": {
            "Status": "No treatment needed.",
            "Preventive": "Apply dormant oil spray before bud break as general preventive."
        },
        "prevention": [
            "Maintain proper pruning for air circulation.",
            "Practice orchard sanitation — remove fallen leaves and fruit.",
            "Use drip irrigation to keep foliage dry."
        ],
        "organic_remedy": "Neem oil spray monthly as a general preventive against pests and fungi.",
        "yield_impact": "Healthy plant — optimal yield expected."
    },

    # ══════════════════ BLUEBERRY ══════════════════
    "Blueberry___healthy": {
        "severity": "none",
        "cause": "No disease detected",
        "description": "Blueberry plant is healthy. No action required.",
        "immediate_steps": [
            "Maintain soil pH between 4.5–5.5 for optimal blueberry nutrition.",
            "Mulch with pine bark to retain moisture and maintain acidity.",
            "Scout weekly for mummyberry and leaf diseases."
        ],
        "treatment": {
            "Status": "No treatment needed.",
            "Preventive": "Copper hydroxide spray before bud swell as a preventive."
        },
        "prevention": [
            "Avoid high-nitrogen fertilizers that promote disease susceptibility.",
            "Ensure good drainage to prevent root rot.",
            "Net plants during fruiting season to prevent bird damage."
        ],
        "organic_remedy": "Compost tea foliar spray to boost plant immunity.",
        "yield_impact": "Healthy plant — optimal yield expected."
    },

    # ══════════════════ CHERRY ══════════════════
    "Cherry_(including_sour)___Powdery_mildew": {
        "severity": "moderate",
        "cause": "Fungus — Podosphaera clandestina",
        "description": "White powdery coating on leaves, new shoots, and sometimes fruit. Thrives in warm dry days with cool humid nights.",
        "immediate_steps": [
            "Remove heavily infected shoots and leaves immediately.",
            "Reduce nitrogen fertilization — excess N promotes rapid soft growth susceptible to mildew.",
            "Improve air circulation by pruning crowded branches."
        ],
        "treatment": {
            "Contact fungicide": "Sulfur 80% WP @ 2.5 g/L. Spray every 7–10 days.",
            "Systemic fungicide": "Myclobutanil 10% WP @ 1 g/L or Trifloxystrobin 25% WG @ 0.5 g/L for curative control.",
        },
        "prevention": [
            "Plant resistant cherry varieties.",
            "Avoid dense planting — ensure 4–5 m spacing.",
            "Apply preventive fungicide at first bud break."
        ],
        "organic_remedy": "Baking soda solution (5 g/L water + 2 mL neem oil). Spray every 7 days on all leaf surfaces.",
        "yield_impact": "Reduces fruit size and quality. Treat early to prevent significant crop loss."
    },

    "Cherry_(including_sour)___healthy": {
        "severity": "none",
        "cause": "No disease detected",
        "description": "Cherry plant is healthy. Maintain current practices.",
        "immediate_steps": [
            "Continue regular monitoring for powdery mildew and brown rot.",
            "Ensure adequate potassium for fruit quality.",
            "Remove dead wood during dormant season."
        ],
        "treatment": {
            "Status": "No treatment needed.",
            "Preventive": "Copper spray after harvest to prevent bacterial canker."
        },
        "prevention": [
            "Prune only during dry weather.",
            "Avoid wounding bark during cultivation.",
            "Use bird netting to prevent fruit damage."
        ],
        "organic_remedy": "Neem oil spray monthly as a preventive measure.",
        "yield_impact": "Healthy plant — optimal yield expected."
    },

    # ══════════════════ CORN/MAIZE ══════════════════
    "Corn_(maize)___Common_rust_": {
        "severity": "moderate",
        "cause": "Fungus — Puccinia sorghi",
        "description": "Circular to elongated brick-red pustules on both leaf surfaces. Thrives during cool, moist weather.",
        "immediate_steps": [
            "Scout from V8 growth stage onward, especially during cool wet weather.",
            "Apply fungicide if more than 50% of plants show pustules before tasseling.",
            "Avoid working in fields when plants are wet."
        ],
        "treatment": {
            "Contact fungicide": "Mancozeb 75% WP @ 2.5 g/L. Spray every 10–14 days.",
            "Systemic fungicide": "Propiconazole 25% EC @ 0.5 mL/L. 2–3 sprays at 10-day intervals.",
        },
        "prevention": [
            "Plant rust-resistant hybrid varieties — check seed company resistance ratings.",
            "Early planting avoids peak rust season.",
            "Avoid excessive nitrogen application."
        ],
        "organic_remedy": "Neem-based fungicide (5 mL/L) as a suppressive spray in early stages.",
        "yield_impact": "Yield loss of 10–40% depending on severity and growth stage at infection."
    },

    "Corn_(maize)___Northern_Leaf_Blight": {
        "severity": "high",
        "cause": "Fungus — Exserohilum turcicum",
        "description": "Long cigar-shaped gray-green to tan lesions 2.5–15 cm long, running parallel to leaf veins.",
        "immediate_steps": [
            "Apply fungicide immediately — most effective before tasseling.",
            "Remove and destroy heavily diseased lower leaves.",
            "Ensure balanced fertilization — avoid excess nitrogen."
        ],
        "treatment": {
            "Systemic fungicide": "Propiconazole 25% EC @ 0.5 mL/L or Tebuconazole 25.9% EC @ 0.75 mL/L.",
            "Combination": "Azoxystrobin + Propiconazole for severe or widespread infections.",
        },
        "prevention": [
            "Plant resistant hybrids with Ht1, Ht2, or HtN resistance genes.",
            "Rotate with soybeans or wheat to reduce inoculum in soil.",
            "Incorporate crop residue through deep tillage."
        ],
        "organic_remedy": "Bacillus subtilis-based biopesticide (e.g., Serenade) as a preventive foliar spray.",
        "yield_impact": "Up to 50% yield reduction if infection occurs before tasseling."
    },

    "Corn_(maize)___healthy": {
        "severity": "none",
        "cause": "No disease detected",
        "description": "Maize plant is healthy. No action required.",
        "immediate_steps": [
            "Monitor weekly for gray leaf spot, rust, and stem borer damage.",
            "Maintain adequate soil moisture especially during silking.",
            "Top-dress with urea at knee-height stage for optimal growth."
        ],
        "treatment": {
            "Status": "No treatment needed.",
            "Preventive": "Seed treatment with fungicide + insecticide before sowing."
        },
        "prevention": [
            "Use certified disease-resistant hybrid seeds.",
            "Practice 2-year crop rotation.",
            "Maintain recommended plant population per variety guidelines."
        ],
        "organic_remedy": "Spray Pseudomonas fluorescens (10 g/L) as a soil drench for root health.",
        "yield_impact": "Healthy plant — optimal yield expected."
    },

    # ══════════════════ COTTON ══════════════════
    "Cotton___Bacterial_blight": {
        "severity": "high",
        "cause": "Bacterium — Xanthomonas citri pv. malvacearum",
        "description": "Angular water-soaked lesions on leaves turning brown, dark streaks on stems, boll rot in severe cases.",
        "immediate_steps": [
            "Remove and destroy severely infected plant parts.",
            "Avoid overhead irrigation and working in fields when plants are wet.",
            "Apply copper bactericide immediately."
        ],
        "treatment": {
            "Copper bactericide": "Copper oxychloride 50% WP @ 3 g/L or Copper hydroxide @ 2.5 g/L.",
            "Antibiotic": "Streptomycin sulfate 90% SP @ 0.1 g/L for severe infections — check state regulations.",
        },
        "prevention": [
            "Use certified disease-free, acid-delinted seeds.",
            "Plant resistant cotton varieties.",
            "Practice 2–3 year crop rotation with non-host crops."
        ],
        "organic_remedy": "Bordeaux mixture (0.5–1%) spray every 10 days. Neem cake @ 250 kg/ha incorporated into soil.",
        "yield_impact": "Can cause 30–70% yield loss in susceptible varieties during humid seasons."
    },

    "Cotton___Cotton_leaf_curl_virus": {
        "severity": "critical",
        "cause": "Virus — Cotton Leaf Curl Virus (CLCuV), spread by whitefly Bemisia tabaci",
        "description": "Upward curling of leaves, thickened veins, leaf enation (small leaf-like outgrowths on underside), stunted plant.",
        "immediate_steps": [
            "⚠️ No chemical cure for viral infection — focus entirely on whitefly vector control.",
            "Remove and destroy severely infected plants immediately.",
            "Apply systemic insecticide against whitefly within 24 hours.",
            "Install yellow sticky traps to monitor and reduce whitefly population."
        ],
        "treatment": {
            "Whitefly control": "Imidacloprid 17.8% SL @ 0.5 mL/L or Thiamethoxam 25% WG @ 0.5 g/L.",
            "Alternate insecticide": "Spiromesifen 22.9% SC @ 0.75 mL/L. Rotate products to prevent resistance.",
        },
        "prevention": [
            "Plant CLCuV-resistant cotton varieties (CLCV-tolerant lines).",
            "Use 40-mesh insect-proof netting in nurseries.",
            "Install reflective silver mulch to repel whitefly adults.",
            "Avoid late sowing — early sowing reduces peak whitefly populations."
        ],
        "organic_remedy": "Neem oil (5 mL/L) spray every 5 days. Yellow sticky traps at 10–15 per acre.",
        "yield_impact": "Complete crop failure possible if infection occurs in early vegetative stage."
    },

    "Cotton___Fusarium_wilt": {
        "severity": "high",
        "cause": "Fungus — Fusarium oxysporum f.sp. vasinfectum",
        "description": "Yellowing of lower leaves, brown vascular discoloration in stem cross-section, sudden wilting and plant death.",
        "immediate_steps": [
            "Remove and destroy wilted plants — do NOT compost them.",
            "Avoid waterlogging — improve field drainage immediately.",
            "Do not replant cotton in the same field for at least 3 years."
        ],
        "treatment": {
            "Soil treatment": "Carbendazim 50% WP soil drench @ 2 g/L around root zone.",
            "Seed treatment": "Thiram 75% WS @ 3 g/kg seed + Carbendazim 50% WP @ 2 g/kg seed before next season.",
        },
        "prevention": [
            "Plant Fusarium-wilt-resistant cotton varieties.",
            "Practice 3–4 year rotation with non-host crops (wheat, sorghum).",
            "Improve soil drainage and avoid compaction."
        ],
        "organic_remedy": "Trichoderma viride @ 5 g/kg seed treatment. Soil application of Trichoderma @ 2.5 kg/ha with FYM.",
        "yield_impact": "25–50% yield loss in affected patches. Disease persists in soil for years."
    },

    "Cotton___healthy": {
        "severity": "none",
        "cause": "No disease detected",
        "description": "Cotton plant is healthy. Continue current management practices.",
        "immediate_steps": [
            "Monitor weekly for whitefly, bollworm, and CLCuV symptoms.",
            "Maintain balanced NPK nutrition especially potassium.",
            "Scout for sucking pests during early vegetative stage."
        ],
        "treatment": {
            "Status": "No treatment needed.",
            "Preventive": "Seed treatment with Imidacloprid 70% WS @ 7 g/kg to protect against early sucking pests."
        },
        "prevention": [
            "Plant certified disease-free seeds.",
            "Use drip irrigation to reduce humidity around plants.",
            "Install pheromone traps for bollworm monitoring."
        ],
        "organic_remedy": "Spray neem oil (5 mL/L) monthly. Encourage natural predators (ladybirds, lacewings).",
        "yield_impact": "Healthy plant — optimal lint and seed yield expected."
    },

    # ══════════════════ GRAPE ══════════════════
    "Grape___Black_rot": {
        "severity": "high",
        "cause": "Fungus — Guignardia bidwellii",
        "description": "Brown circular spots on leaves, shriveled black mummified berries (raisins that stay on vine). Spreads rapidly in wet weather.",
        "immediate_steps": [
            "Remove all mummified berries from vines and ground immediately.",
            "Apply fungicide within 24 hours of first symptoms.",
            "Prune to improve canopy airflow."
        ],
        "treatment": {
            "Contact fungicide": "Mancozeb 75% WP @ 2.5 g/L. Critical spray windows: budbreak, pre-bloom, post-bloom.",
            "Systemic fungicide": "Myclobutanil 10% WP @ 1 g/L for curative control.",
        },
        "prevention": [
            "Remove and destroy all mummy berries before bud break.",
            "Train vines to vertical shoot position for better airflow.",
            "Apply copper-based sprays during dormancy."
        ],
        "organic_remedy": "Bordeaux mixture (1%) spray every 10–14 days during the growing season.",
        "yield_impact": "Can destroy 80–100% of berry crop if uncontrolled in a wet season."
    },

    "Grape___Esca_(Black_Measles)": {
        "severity": "high",
        "cause": "Fungal complex — Phaeomoniella chlamydospora, Phaeoacremonium spp., Fomitiporia mediterranea",
        "description": "Tiger-stripe yellowing on leaves, internal wood brown discoloration, apoplexy (sudden vine collapse) in severe cases.",
        "immediate_steps": [
            "Protect pruning wounds immediately with fungicidal wound sealant.",
            "Remove and destroy vines showing apoplexy (sudden collapse).",
            "Sterilize pruning tools with 10% bleach solution between vines."
        ],
        "treatment": {
            "Wound protection": "Thiophanate-methyl 70% WP paste applied immediately to fresh pruning wounds.",
            "Note": "No fully curative chemical treatment exists — wound prevention is the only effective strategy.",
        },
        "prevention": [
            "Prune during dry weather — never prune in rain.",
            "Apply wound sealant (Bordeaux paste) immediately after every cut.",
            "Delay pruning until late winter to shorten the infection window."
        ],
        "organic_remedy": "Trichoderma harzianum paste applied to pruning wounds. Biological control is most effective for this disease.",
        "yield_impact": "Chronic disease — gradually kills established vines over 3–10 years."
    },

    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)": {
        "severity": "moderate",
        "cause": "Fungus — Pseudocercospora vitis (syn. Isariopsis clavispora)",
        "description": "Irregular dark brown spots with yellow margins starting on older basal leaves, progressing upward.",
        "immediate_steps": [
            "Remove and destroy infected lower leaves.",
            "Improve airflow through canopy pruning.",
            "Begin fungicide program immediately."
        ],
        "treatment": {
            "Contact fungicide": "Mancozeb 75% WP @ 2.5 g/L or Carbendazim 50% WP @ 1 g/L. Spray every 10–14 days.",
            "Systemic fungicide": "Hexaconazole 5% SC @ 2 mL/L for curative action.",
        },
        "prevention": [
            "Avoid overhead irrigation.",
            "Maintain proper vine training and open canopy management.",
            "Apply preventive copper sprays during dormancy."
        ],
        "organic_remedy": "Neem oil (5 mL/L) spray every 7–10 days as a suppressive measure.",
        "yield_impact": "Severe defoliation reduces photosynthesis and weakens vine for next season."
    },

    "Grape___healthy": {
        "severity": "none",
        "cause": "No disease detected",
        "description": "Grapevine appears healthy. Continue current management.",
        "immediate_steps": [
            "Scout weekly for downy mildew, powdery mildew, and black rot.",
            "Ensure proper trellis and canopy management.",
            "Apply balanced fertilization as per growth stage."
        ],
        "treatment": {
            "Status": "No treatment needed.",
            "Preventive": "Dormant copper spray before bud break."
        },
        "prevention": [
            "Maintain open canopy for air circulation.",
            "Protect all pruning wounds immediately.",
            "Use certified disease-free planting material."
        ],
        "organic_remedy": "Compost application around vine base to improve soil microbial health.",
        "yield_impact": "Healthy vine — optimal berry yield expected."
    },

    # ══════════════════ ORANGE ══════════════════
    "Orange___Haunglongbing_(Citrus_greening)": {
        "severity": "critical",
        "cause": "Bacterium — Candidatus Liberibacter asiaticus, spread by Asian Citrus Psyllid (Diaphorina citri)",
        "description": "Blotchy yellow mottling (asymmetric yellowing) on leaves, lopsided bitter fruit, green colour at harvest, stunted growth.",
        "immediate_steps": [
            "⚠️ There is NO cure — infected trees must be removed and destroyed to prevent spread.",
            "Control Asian citrus psyllid with insecticide immediately to stop further transmission.",
            "Report to local agricultural department — HLB is a regulated disease in India."
        ],
        "treatment": {
            "Psyllid control": "Imidacloprid 17.8% SL @ 0.5 mL/L or Thiamethoxam 25% WG @ 0.5 g/L as foliar spray.",
            "Soil drench": "Imidacloprid 200 SL @ 5 mL/tree as soil drench for systemic psyllid control.",
        },
        "prevention": [
            "Use certified HLB-free nursery planting material only.",
            "Install yellow sticky traps to monitor psyllid population.",
            "Maintain a psyllid-free buffer zone (500 m) around healthy orchards."
        ],
        "organic_remedy": "Neem oil (5 mL/L) + kaolin clay spray to repel psyllid adults. Not curative.",
        "yield_impact": "Infected trees decline over 3–7 years. Remove immediately to protect healthy trees."
    },

    # ══════════════════ PEACH ══════════════════
    "Peach___Bacterial_spot": {
        "severity": "moderate",
        "cause": "Bacterium — Xanthomonas arboricola pv. pruni",
        "description": "Water-soaked lesions turning brown-purple on leaves, fruit surface cracking and gumming.",
        "immediate_steps": [
            "Remove and destroy fallen infected leaves.",
            "Switch from overhead to drip or furrow irrigation immediately.",
            "Apply copper bactericide within 24 hours."
        ],
        "treatment": {
            "Copper bactericide": "Copper hydroxide 53.8% DF @ 2.5 g/L or Copper oxychloride 50% WP @ 3 g/L.",
            "Antibiotic (severe)": "Streptomycin sulfate (agricultural grade) @ 0.1 g/L — check local regulations.",
        },
        "prevention": [
            "Plant resistant or tolerant peach varieties.",
            "Prune during dry weather and seal all wounds.",
            "Maintain proper tree nutrition — stressed trees are significantly more susceptible."
        ],
        "organic_remedy": "Bordeaux mixture (0.5–1%) as a protective spray before rainy periods.",
        "yield_impact": "Fruit cracking causes 20–50% unmarketable fruit in severe, wet years."
    },

    "Peach___healthy": {
        "severity": "none",
        "cause": "No disease detected",
        "description": "Peach plant is healthy. Maintain current practices.",
        "immediate_steps": [
            "Monitor for bacterial spot and brown rot weekly.",
            "Thin fruit after set to improve size and reduce disease pressure.",
            "Ensure adequate calcium and boron nutrition for fruit quality."
        ],
        "treatment": {
            "Status": "No treatment needed.",
            "Preventive": "Dormant copper spray before bud swell."
        },
        "prevention": [
            "Prune only during dry, warm conditions.",
            "Apply balanced fertilizer — avoid excessive nitrogen.",
            "Use bird netting to prevent fruit injury (entry point for disease)."
        ],
        "organic_remedy": "Compost mulch around tree base to maintain soil moisture and health.",
        "yield_impact": "Healthy plant — optimal yield expected."
    },

    # ══════════════════ PEPPER ══════════════════
    "Pepper,_bell___Bacterial_spot": {
        "severity": "moderate",
        "cause": "Bacterium — Xanthomonas euvesicatoria",
        "description": "Small water-soaked spots becoming brown with yellow halo on leaves and fruit.",
        "immediate_steps": [
            "Remove and destroy infected plant debris.",
            "Avoid working in field when plants are wet.",
            "Apply copper bactericide immediately."
        ],
        "treatment": {
            "Copper bactericide": "Copper oxychloride 50% WP @ 3 g/L + Mancozeb 75% WP @ 2 g/L (copper-mancozeb mix).",
            "Frequency": "Spray every 7–10 days during warm, wet weather.",
        },
        "prevention": [
            "Use certified disease-free seeds — treat with hot water at 52°C for 30 min.",
            "Rotate peppers with non-solanaceous crops for 2–3 years.",
            "Avoid overhead irrigation — use drip."
        ],
        "organic_remedy": "Spray Pseudomonas fluorescens (10 g/L). Incorporate neem cake @ 250 kg/ha into soil.",
        "yield_impact": "Fruit lesions make produce unmarketable — 20–60% loss in wet seasons."
    },

    "Pepper,_bell___healthy": {
        "severity": "none",
        "cause": "No disease detected",
        "description": "Bell pepper plant is healthy. No action required.",
        "immediate_steps": [
            "Monitor weekly for bacterial spot and anthracnose.",
            "Stake plants to prevent stem damage.",
            "Maintain soil calcium levels to prevent blossom-end rot."
        ],
        "treatment": {
            "Status": "No treatment needed.",
            "Preventive": "Seed treatment with Thiram @ 3 g/kg before sowing."
        },
        "prevention": [
            "Use drip irrigation to keep foliage dry.",
            "Practice crop rotation every 2 years.",
            "Apply balanced fertilization with adequate phosphorus."
        ],
        "organic_remedy": "Neem oil spray (5 mL/L) monthly as preventive measure.",
        "yield_impact": "Healthy plant — optimal yield expected."
    },

    # ══════════════════ POTATO ══════════════════
    "Potato___Early_blight": {
        "severity": "moderate",
        "cause": "Fungus — Alternaria solani",
        "description": "Dark brown concentric ring (target-board pattern) spots starting on older lower leaves.",
        "immediate_steps": [
            "Remove and destroy lower infected leaves immediately.",
            "Apply fungicide at first sign of symptoms.",
            "Avoid overhead irrigation in the evening."
        ],
        "treatment": {
            "Contact fungicide": "Mancozeb 75% WP @ 2.5 g/L or Chlorothalonil 75% WP @ 2 g/L.",
            "Systemic fungicide": "Azoxystrobin 23% SC @ 1 mL/L for curative control.",
        },
        "prevention": [
            "Use certified seed tubers and resistant varieties.",
            "Ensure adequate potassium — deficiency increases susceptibility.",
            "Practice 3-year crop rotation."
        ],
        "organic_remedy": "Neem oil (5 mL/L) + baking soda (5 g/L) spray every 7 days.",
        "yield_impact": "Early defoliation reduces tuber size — 20–30% yield loss if severe."
    },

    "Potato___Late_blight": {
        "severity": "critical",
        "cause": "Oomycete — Phytophthora infestans",
        "description": "Water-soaked dark lesions with white sporulation on leaf undersides. Rapidly destroys entire crop.",
        "immediate_steps": [
            "⚠️ Emergency — Act within 24 hours. Disease can destroy an entire field in 3–5 days.",
            "Apply systemic fungicide immediately — do not wait.",
            "Remove and bag heavily infected plant parts. Do NOT compost.",
            "Temporarily stop irrigation to slow spore spread."
        ],
        "treatment": {
            "Systemic fungicide": "Metalaxyl-M 4% + Mancozeb 64% WP @ 2.5 g/L (e.g., Ridomil Gold) — most effective.",
            "Alternates": "Dimethomorph 50% WP @ 1.5 g/L or Cymoxanil 8% + Mancozeb 64% WP @ 3 g/L.",
            "Frequency": "Spray every 5–7 days during active infection."
        },
        "prevention": [
            "Plant resistant varieties (e.g., Kufri Jyoti in India).",
            "Avoid planting in poorly drained, humid low-lying areas.",
            "Apply prophylactic Mancozeb sprays before monsoon season."
        ],
        "organic_remedy": "Copper Bordeaux mixture (1%) as a preventive only. Not effective once active infection is established.",
        "yield_impact": "Can destroy 100% of crop within 7–10 days. Treated as a crop emergency."
    },

    "Potato___healthy": {
        "severity": "none",
        "cause": "No disease detected",
        "description": "Potato plant is healthy. No action required.",
        "immediate_steps": [
            "Scout twice weekly — especially watch for late blight during cool, wet weather.",
            "Earth up ridges to protect developing tubers from light and infection.",
            "Ensure adequate potassium fertilization for tuber development."
        ],
        "treatment": {
            "Status": "No treatment needed.",
            "Preventive": "Prophylactic Mancozeb spray before monsoon season."
        },
        "prevention": [
            "Use certified disease-free seed tubers.",
            "Practice 3–4 year rotation with non-solanaceous crops.",
            "Ensure good field drainage."
        ],
        "organic_remedy": "Trichoderma viride seed treatment to protect against soil-borne pathogens.",
        "yield_impact": "Healthy plant — optimal tuber yield expected."
    },

    # ══════════════════ RASPBERRY ══════════════════
    "Raspberry___healthy": {
        "severity": "none",
        "cause": "No disease detected",
        "description": "Raspberry plant is healthy. Continue current practices.",
        "immediate_steps": [
            "Scout weekly for cane blight and spur blight.",
            "Remove old fruiting canes immediately after harvest.",
            "Ensure adequate potassium and calcium nutrition."
        ],
        "treatment": {
            "Status": "No treatment needed.",
            "Preventive": "Lime sulfur spray during dormancy."
        },
        "prevention": [
            "Train canes on a trellis for good airflow.",
            "Remove and destroy old canes immediately after harvest.",
            "Avoid wounding canes during management."
        ],
        "organic_remedy": "Neem oil spray (5 mL/L) monthly as preventive pest/disease management.",
        "yield_impact": "Healthy plant — optimal berry yield expected."
    },

    # ══════════════════ SUGARCANE ══════════════════
    "RedRust sugarcane": {
        "severity": "moderate",
        "cause": "Fungus — Puccinia melanocephala (Red Rust of Sugarcane)",
        "description": "Small elongated reddish-brown pustules on both leaf surfaces, surrounded by yellow halo.",
        "immediate_steps": [
            "Scout all ratoon and plant crop fields immediately.",
            "Remove and destroy heavily infected leaves.",
            "Apply fungicide at first sign."
        ],
        "treatment": {
            "Systemic fungicide": "Propiconazole 25% EC @ 0.5 mL/L or Tebuconazole 25.9% EC @ 0.75 mL/L.",
            "Frequency": "2–3 sprays at 15-day intervals during infection period.",
        },
        "prevention": [
            "Plant rust-resistant sugarcane varieties (Co 86032, CoC 671 in India).",
            "Avoid ratoon crops in severely affected fields.",
            "Ensure balanced potassium nutrition — K deficiency increases susceptibility."
        ],
        "organic_remedy": "Sulfur 80% WP (2 g/L) spray. Neem oil (5 mL/L) as suppressive measure in early stages.",
        "yield_impact": "Can reduce photosynthesis and sugar content — 10–30% cane yield loss in severe infections."
    },

    "Sugarcane___Mosaic": {
        "severity": "high",
        "cause": "Virus — Sugarcane Mosaic Virus (SCMV), spread by aphid vectors",
        "description": "Yellow-green mosaic streaking on leaves (alternating pale and dark green stripes), stunted growth.",
        "immediate_steps": [
            "⚠️ No chemical cure for viral infection.",
            "Remove and destroy infected stools/plants immediately.",
            "Control aphid vectors with insecticide immediately.",
            "Install yellow sticky traps to monitor aphid population."
        ],
        "treatment": {
            "Aphid control": "Imidacloprid 17.8% SL @ 0.5 mL/L or Thiamethoxam 25% WG @ 0.5 g/L.",
            "Alternate": "Lambda-cyhalothrin 5% EC @ 1 mL/L for quick knockdown of aphids.",
        },
        "prevention": [
            "Use virus-free certified seed sets from disease-tested parent material.",
            "Plant SCMV-resistant/tolerant varieties.",
            "Hot water treat setts at 50°C for 2 hours before planting.",
            "Rogue out (remove) infected plants as soon as detected."
        ],
        "organic_remedy": "Neem oil (5 mL/L) spray every 7 days to repel aphid vectors.",
        "yield_impact": "10–30% cane yield loss. Higher losses in ratoon crops and early-season infection."
    },

    "Sugarcane___Red_rot": {
        "severity": "critical",
        "cause": "Fungus — Colletotrichum falcatum",
        "description": "Red discoloration of internal cane tissues with white patches. Sour/vinegar smell, external yellowing of leaves.",
        "immediate_steps": [
            "⚠️ Highly destructive — remove and destroy infected clumps immediately.",
            "Do NOT use infected cane as seed sets.",
            "Drench soil with fungicide around affected areas.",
            "Burn crop residue — do not leave in field."
        ],
        "treatment": {
            "Seed sett treatment": "Carbendazim 50% WP @ 1 g/L soak seed setts for 5 minutes before planting.",
            "Foliar spray": "Copper oxychloride 50% WP @ 3 g/L as protective spray.",
        },
        "prevention": [
            "Plant red rot-resistant varieties (CoJ 64, CoS 767 in India).",
            "Use disease-free seed setts — hot water treatment at 50°C for 2 hours.",
            "Improve field drainage — waterlogging promotes disease.",
            "Avoid ratoon cropping in affected fields."
        ],
        "organic_remedy": "Trichoderma viride (5 g/kg) seed sett treatment. Biocontrol is most effective preventively.",
        "yield_impact": "Entire clumps die — 20–80% stand loss in severe outbreaks. Major cause of sugarcane crop failure in India."
    },

    "Sugarcane___Rust": {
        "severity": "moderate",
        "cause": "Fungus — Puccinia melanocephala / Puccinia kuehnii (Orange Rust)",
        "description": "Orange to brown elongated pustules on leaves, yellow halo around pustules, premature drying of leaves.",
        "immediate_steps": [
            "Apply fungicide at first sign of pustule formation.",
            "Remove severely infected older leaves.",
            "Avoid overhead irrigation to reduce leaf wetness."
        ],
        "treatment": {
            "Systemic fungicide": "Propiconazole 25% EC @ 0.5 mL/L or Hexaconazole 5% SC @ 2 mL/L.",
            "Frequency": "2–3 sprays at 15-day intervals.",
        },
        "prevention": [
            "Plant rust-tolerant sugarcane varieties.",
            "Balance potassium fertilization — K improves rust resistance.",
            "Monitor ratoon crops more frequently — more susceptible than plant crops."
        ],
        "organic_remedy": "Sulfur 80% WP (2 g/L) spray as preventive. Neem oil (5 mL/L) as early-stage suppressive.",
        "yield_impact": "5–20% sugar content and cane weight reduction in susceptible varieties."
    },

    "Sugarcane___Yellow_leaf_disease": {
        "severity": "high",
        "cause": "Virus — Sugarcane Yellow Leaf Virus (ScYLV), spread by aphid Melanaphis sacchari",
        "description": "Yellowing of midrib on upper leaf surface, progressing to entire leaf yellowing from tip, leaf necrosis.",
        "immediate_steps": [
            "⚠️ No chemical cure — remove and destroy infected plants.",
            "Control aphid vectors immediately with systemic insecticide.",
            "Install yellow sticky traps across the field."
        ],
        "treatment": {
            "Aphid control": "Imidacloprid 17.8% SL @ 0.5 mL/L as foliar spray or soil drench.",
            "Alternate": "Thiamethoxam 25% WG @ 0.5 g/L. Rotate insecticides every 2 sprays.",
        },
        "prevention": [
            "Use certified virus-tested seed setts.",
            "Hot water treat setts at 50°C for 2 hours before planting.",
            "Plant Yellow Leaf Virus-resistant varieties.",
            "Rogue out infected plants early."
        ],
        "organic_remedy": "Neem oil (5 mL/L) spray every 5–7 days to suppress aphid vectors.",
        "yield_impact": "15–40% cane yield reduction and significant sugar content loss in affected plants."
    },

    "Sugarcane___healthy": {
        "severity": "none",
        "cause": "No disease detected",
        "description": "Sugarcane plant is healthy. Continue current management.",
        "immediate_steps": [
            "Monitor weekly for red rot, smut, and aphid infestation.",
            "Ensure adequate potassium and phosphorus for stalk development.",
            "De-trash lower dry leaves to improve aeration."
        ],
        "treatment": {
            "Status": "No treatment needed.",
            "Preventive": "Seed sett treatment with Carbendazim + Thiram before planting."
        },
        "prevention": [
            "Use certified disease-free seed setts.",
            "Practice crop rotation every 3–4 years.",
            "Maintain proper drainage and avoid waterlogging."
        ],
        "organic_remedy": "Trichoderma viride (5 g/kg) seed sett treatment. Compost @ 10 t/ha at planting.",
        "yield_impact": "Healthy plant — optimal cane yield and sucrose content expected."
    },

    # ══════════════════ RICE ══════════════════
    "Rice___Bacterial_leaf_blight": {
        "severity": "high",
        "cause": "Bacterium — Xanthomonas oryzae pv. oryzae",
        "description": "Water-soaked to yellow stripes along leaf margins starting at tips, progressing to entire leaf blight. Milky bacterial exudate.",
        "immediate_steps": [
            "Drain flooded fields if possible — reduces disease spread.",
            "Avoid high nitrogen application during active infection.",
            "Apply copper bactericide immediately."
        ],
        "treatment": {
            "Copper bactericide": "Copper oxychloride 50% WP @ 3 g/L. Spray 2–3 times at 10-day intervals.",
            "Antibiotic": "Streptomycin + Tetracycline combination (Plantomycin) @ 0.1 g/L for severe cases.",
        },
        "prevention": [
            "Plant BLB-resistant rice varieties (IR64, Pusa Basmati 1 in India).",
            "Avoid excess nitrogen — split nitrogen application.",
            "Use disease-free certified seed."
        ],
        "organic_remedy": "Pseudomonas fluorescens (10 g/L) spray. Avoid excessive N fertilization.",
        "yield_impact": "20–50% yield loss in susceptible varieties. Kresek phase (seedling blight) can cause 100% loss in nurseries."
    },

    "Rice___Brown_spot": {
        "severity": "moderate",
        "cause": "Fungus — Bipolaris oryzae (syn. Helminthosporium oryzae)",
        "description": "Oval to circular brown spots with yellow halo on leaves and grains. Associated with nutrient-deficient soils.",
        "immediate_steps": [
            "Apply potassium and manganese fertilizer — deficiency promotes brown spot.",
            "Remove and destroy heavily infected leaves.",
            "Apply fungicide spray."
        ],
        "treatment": {
            "Contact fungicide": "Mancozeb 75% WP @ 2.5 g/L or Iprobenfos (Kitazin) 48% EC @ 1.5 mL/L.",
            "Systemic fungicide": "Propiconazole 25% EC @ 0.5 mL/L for curative action.",
        },
        "prevention": [
            "Ensure balanced soil nutrition especially potassium and silicon.",
            "Use certified disease-free seed — treat with Carbendazim 2 g/kg.",
            "Avoid water stress during critical growth stages."
        ],
        "organic_remedy": "Spray Pseudomonas fluorescens (10 g/L). Apply silica (rice husk ash) to soil for silicon supplementation.",
        "yield_impact": "Grain discolouration reduces market value. 5–20% yield loss in severe outbreaks."
    },

    "Rice___Leaf_blast": {
        "severity": "critical",
        "cause": "Fungus — Magnaporthe oryzae",
        "description": "Diamond-shaped gray-green lesions with brown borders on leaves; neck blast causes white panicles (white ear/deadheart).",
        "immediate_steps": [
            "⚠️ Apply fungicide immediately — Leaf Blast can progress to Neck Blast which causes total grain loss.",
            "Drain field slightly to reduce humidity around plants.",
            "Avoid applying nitrogen during active blast infection."
        ],
        "treatment": {
            "Systemic fungicide": "Tricyclazole 75% WP @ 0.6 g/L (most effective for blast). Spray at first sign.",
            "Alternate": "Isoprothiolane 40% EC @ 1.5 mL/L or Azoxystrobin 23% SC @ 1 mL/L.",
            "Frequency": "2–3 sprays at 10-day intervals. Critical spray at panicle initiation.",
        },
        "prevention": [
            "Plant blast-resistant varieties (Pusa 1460, IR64 in India).",
            "Split nitrogen application — avoid heavy single doses.",
            "Maintain proper water management — avoid alternate wetting/drying in blast-prone areas."
        ],
        "organic_remedy": "Silicon application (rice husk ash or silicate fertilizers) significantly reduces blast susceptibility.",
        "yield_impact": "100% loss in severely affected panicles (Neck Blast). Leaf blast alone causes 10–30% yield reduction."
    },

    "Rice___Leaf_scald": {
        "severity": "moderate",
        "cause": "Fungus — Microdochium oryzae (syn. Helminthosporium sigmoideum)",
        "description": "Zonate (banded) brown lesions with wavy margins starting at leaf tips, giving a scalded appearance.",
        "immediate_steps": [
            "Remove and destroy infected crop debris.",
            "Avoid excessive nitrogen application during active infection.",
            "Apply fungicide immediately."
        ],
        "treatment": {
            "Contact fungicide": "Mancozeb 75% WP @ 2.5 g/L or Chlorothalonil 75% WP @ 2 g/L.",
            "Systemic fungicide": "Propiconazole 25% EC @ 0.5 mL/L for better penetration.",
        },
        "prevention": [
            "Use certified disease-free seed — treat with Carbendazim 2 g/kg.",
            "Avoid dense planting — maintain recommended spacing.",
            "Balanced fertilization — avoid excess nitrogen."
        ],
        "organic_remedy": "Pseudomonas fluorescens (10 g/L) foliar spray. Trichoderma viride soil application.",
        "yield_impact": "10–25% yield loss in severely affected fields."
    },

    "Rice___Sheath_blight": {
        "severity": "high",
        "cause": "Fungus — Rhizoctonia solani",
        "description": "Oval to irregular greenish-gray lesions on leaf sheath with brown margin, progressing to upper leaves. White sclerotia on infected tissue.",
        "immediate_steps": [
            "Apply fungicide immediately at first sign of sheath lesions.",
            "Reduce plant density if crop is over-tillered.",
            "Drain excess water — disease spreads in flooded conditions."
        ],
        "treatment": {
            "Systemic fungicide": "Hexaconazole 5% SC @ 2 mL/L or Propiconazole 25% EC @ 0.5 mL/L.",
            "Contact fungicide": "Validamycin 3% L @ 2.5 mL/L (specifically effective for sheath blight).",
            "Frequency": "2–3 sprays at 10-day intervals starting at tillering stage.",
        },
        "prevention": [
            "Plant resistant or moderately resistant rice varieties.",
            "Reduce plant density — avoid too-close spacing.",
            "Avoid excessive nitrogen especially late in the season."
        ],
        "organic_remedy": "Trichoderma viride (5 g/L) soil drench. Pseudomonas fluorescens foliar spray (10 g/L).",
        "yield_impact": "10–50% yield loss depending on severity. Major cause of rice yield loss in India."
    },

    "Rice___healthy": {
        "severity": "none",
        "cause": "No disease detected",
        "description": "Rice plant is healthy. No action required.",
        "immediate_steps": [
            "Scout twice weekly for blast, bacterial blight, and sheath blight.",
            "Monitor water levels — maintain 5 cm standing water during tillering.",
            "Apply top-dress nitrogen at tillering stage for maximum yield."
        ],
        "treatment": {
            "Status": "No treatment needed.",
            "Preventive": "Seed treatment with Carbendazim 50% WP @ 2 g/kg before sowing."
        },
        "prevention": [
            "Use certified disease-free seed.",
            "Practice crop rotation with non-cereal crops (pulses, vegetables).",
            "Maintain proper water management throughout the crop cycle."
        ],
        "organic_remedy": "Pseudomonas fluorescens seed treatment (10 g/kg) to protect against soil-borne pathogens.",
        "yield_impact": "Healthy plant — optimal grain yield expected."
    },

    # ══════════════════ SOYBEAN ══════════════════
    "Soybean___healthy": {
        "severity": "none",
        "cause": "No disease detected",
        "description": "Soybean plant is healthy. No action required.",
        "immediate_steps": [
            "Monitor for sudden death syndrome and frogeye leaf spot.",
            "Ensure adequate Rhizobium nodulation for nitrogen fixation.",
            "Scout for pod borer during pod fill stage."
        ],
        "treatment": {
            "Status": "No treatment needed.",
            "Preventive": "Seed treatment with fungicide + Rhizobium culture before sowing."
        },
        "prevention": [
            "Rotate with corn or wheat every 2 years.",
            "Use certified, high-vigor seed.",
            "Avoid soil compaction — promotes root diseases."
        ],
        "organic_remedy": "Bradyrhizobium japonicum seed inoculation for nitrogen fixation. Compost @ 5 t/ha at sowing.",
        "yield_impact": "Healthy plant — optimal pod yield expected."
    },

    # ══════════════════ SQUASH ══════════════════
    "Squash___Powdery_mildew": {
        "severity": "moderate",
        "cause": "Fungus — Podosphaera xanthii / Erysiphe cichoracearum",
        "description": "White powdery coating starting on older leaves, spreading to entire plant. Does not require leaf wetness.",
        "immediate_steps": [
            "Remove and destroy heavily infected leaves — do not compost.",
            "Improve air circulation by removing crowded/overlapping vines.",
            "Apply fungicide immediately."
        ],
        "treatment": {
            "Contact fungicide": "Sulfur 80% WP @ 2.5 g/L. Spray every 7–10 days.",
            "Systemic fungicide": "Myclobutanil 10% WP @ 1 g/L or Tebuconazole 25.9% EC @ 0.75 mL/L for curative action.",
        },
        "prevention": [
            "Plant resistant squash/pumpkin varieties.",
            "Avoid overhead irrigation.",
            "Maintain adequate spacing (1.5–2 m between plants) for airflow."
        ],
        "organic_remedy": "Baking soda (5 g/L) + neem oil (5 mL/L) spray every 5–7 days. Very effective for light infections.",
        "yield_impact": "Premature leaf death reduces fruit size by 20–40%."
    },

    # ══════════════════ STRAWBERRY ══════════════════
    "Strawberry___Leaf_scorch": {
        "severity": "moderate",
        "cause": "Fungus — Diplocarpon earlianum",
        "description": "Irregular dark purple to brown spots with reddish-purple borders on leaves. Leaves appear scorched.",
        "immediate_steps": [
            "Remove and destroy infected leaves and old plant debris.",
            "Switch from overhead to drip irrigation immediately.",
            "Apply fungicide immediately."
        ],
        "treatment": {
            "Contact fungicide": "Captan 50% WP @ 3 g/L or Myclobutanil 10% WP @ 1 g/L.",
            "Frequency": "Spray every 7–10 days during wet periods.",
        },
        "prevention": [
            "Plant resistant varieties (Chandler, Albion, Seascape).",
            "Renovate beds after harvest — remove all old foliage.",
            "Use raised beds with drip irrigation."
        ],
        "organic_remedy": "Neem oil (5 mL/L) spray weekly. Remove infected leaves promptly.",
        "yield_impact": "Defoliation reduces plant vigor and significantly reduces next season's yield."
    },

    "Strawberry___healthy": {
        "severity": "none",
        "cause": "No disease detected",
        "description": "Strawberry plant is healthy. Continue current practices.",
        "immediate_steps": [
            "Scout weekly for gray mold (Botrytis) and leaf scorch.",
            "Remove runners unless needed for propagation.",
            "Apply potassium-rich fertilizer during fruit development."
        ],
        "treatment": {
            "Status": "No treatment needed.",
            "Preventive": "Pre-bloom Captan spray to prevent gray mold."
        },
        "prevention": [
            "Use certified virus-free transplants.",
            "Mulch with straw to keep fruit off soil.",
            "Renovate beds every 2–3 years."
        ],
        "organic_remedy": "Trichoderma harzianum root drench to prevent root rot.",
        "yield_impact": "Healthy plant — optimal berry yield expected."
    },

    # ══════════════════ TOMATO ══════════════════
    "Tomato___Bacterial_spot": {
        "severity": "moderate",
        "cause": "Bacterium — Xanthomonas vesicatoria",
        "description": "Small dark water-soaked spots with yellow halo on leaves, stems and fruit.",
        "immediate_steps": [
            "Remove and destroy infected plant material.",
            "Do not work in field when plants are wet.",
            "Apply copper bactericide immediately."
        ],
        "treatment": {
            "Copper bactericide": "Copper oxychloride 50% WP @ 3 g/L + Mancozeb 75% WP @ 2 g/L.",
            "Frequency": "Spray every 7–10 days during warm, wet weather.",
        },
        "prevention": [
            "Use certified disease-free seeds — hot water treat at 52°C for 25 min.",
            "Rotate tomatoes with non-solanaceous crops for 2 years.",
            "Use drip irrigation to keep foliage dry."
        ],
        "organic_remedy": "Spray Pseudomonas fluorescens (10 g/L). Neem cake @ 250 kg/ha in soil.",
        "yield_impact": "Fruit lesions cause 30–50% unmarketable produce in humid seasons."
    },

    "Tomato___Early_blight": {
        "severity": "moderate",
        "cause": "Fungus — Alternaria solani",
        "description": "Concentric ring spots (target-board pattern) on older leaves, stem collar rot.",
        "immediate_steps": [
            "Remove infected lower leaves and destroy them.",
            "Apply fungicide spray immediately.",
            "Increase plant spacing if crowded."
        ],
        "treatment": {
            "Contact fungicide": "Mancozeb 75% WP @ 2.5 g/L or Chlorothalonil 75% WP @ 2 g/L.",
            "Systemic fungicide": "Hexaconazole 5% SC @ 2 mL/L for curative control.",
        },
        "prevention": [
            "Use early blight-resistant varieties.",
            "Avoid overhead irrigation.",
            "Apply balanced fertilization — stressed plants more susceptible."
        ],
        "organic_remedy": "Neem oil (5 mL/L) + copper soap spray every 7 days.",
        "yield_impact": "20–50% defoliation reduces fruit size and quality."
    },

    "Tomato___Late_blight": {
        "severity": "critical",
        "cause": "Oomycete — Phytophthora infestans",
        "description": "Large water-soaked brown lesions with white mold on leaf undersides. Spreads to entire field in days.",
        "immediate_steps": [
            "⚠️ Emergency — Act within 24 hours. Disease spreads to the entire field in 3–5 days.",
            "Apply systemic fungicide immediately.",
            "Remove and bag heavily infected plant parts — do NOT compost.",
            "Alert neighboring farms — spores travel by wind."
        ],
        "treatment": {
            "Systemic fungicide": "Metalaxyl-M 4% + Mancozeb 64% WP @ 2.5 g/L (Ridomil Gold) — most effective.",
            "Alternates": "Dimethomorph 50% WP @ 1.5 g/L or Cymoxanil 8% + Mancozeb 64% WP @ 3 g/L.",
            "Frequency": "Spray every 5 days during active infection.",
        },
        "prevention": [
            "Plant resistant varieties (Arka Rakshak in India).",
            "Apply prophylactic Mancozeb spray before monsoon.",
            "Avoid dense planting — maintain adequate airflow."
        ],
        "organic_remedy": "Bordeaux mixture (1%) as a preventive only. Not effective on active infection.",
        "yield_impact": "Can destroy 100% of fruit within 7–10 days. Treat as a crop emergency."
    },

    "Tomato___Leaf_Mold": {
        "severity": "moderate",
        "cause": "Fungus — Passalora fulva (syn. Cladosporium fulvum)",
        "description": "Yellow patches on upper leaf surface, olive-green/brown velvety mold on underside. Common in protected cultivation.",
        "immediate_steps": [
            "Improve greenhouse/polyhouse ventilation immediately.",
            "Reduce humidity — avoid evening irrigation.",
            "Remove heavily infected leaves."
        ],
        "treatment": {
            "Contact fungicide": "Chlorothalonil 75% WP @ 2 g/L or Mancozeb 75% WP @ 2.5 g/L.",
            "Systemic fungicide": "Difenoconazole 25% EC @ 0.5 mL/L for curative control.",
        },
        "prevention": [
            "Maintain relative humidity below 85% in protected structures.",
            "Plant resistant varieties — most modern hybrids have Cf resistance genes.",
            "Space plants adequately for airflow."
        ],
        "organic_remedy": "Sulfur 80% WP @ 2 g/L spray. Copper-based fungicides as preventive.",
        "yield_impact": "20–30% yield loss in protected cultivation if unmanaged."
    },

    "Tomato___Septoria_leaf_spot": {
        "severity": "moderate",
        "cause": "Fungus — Septoria lycopersici",
        "description": "Small circular spots with gray-white centers and dark brown borders, starting on lower leaves.",
        "immediate_steps": [
            "Remove infected lower leaves immediately.",
            "Apply fungicide at first sign.",
            "Avoid working in field when plants are wet."
        ],
        "treatment": {
            "Contact fungicide": "Mancozeb 75% WP @ 2.5 g/L or Chlorothalonil 75% WP @ 2 g/L.",
            "Frequency": "Spray every 7–10 days.",
        },
        "prevention": [
            "Use disease-free seed from certified sources.",
            "Practice 2–3 year rotation — pathogen survives on soil debris.",
            "Mulch to prevent soil splash onto lower leaves."
        ],
        "organic_remedy": "Copper soap (copper octanoate) spray @ 2 mL/L every 7 days.",
        "yield_impact": "Severe defoliation — 30–50% yield loss in wet seasons."
    },

    "Tomato___Spider_mites Two-spotted_spider_mite": {
        "severity": "moderate",
        "cause": "Pest — Tetranychus urticae (two-spotted spider mite — not a fungus/bacterium)",
        "description": "Fine stippling/bronzing on leaves, webbing on undersides. Thrives in hot, dry, dusty conditions.",
        "immediate_steps": [
            "Spray the undersides of leaves with a strong water jet to dislodge mites.",
            "Apply acaricide/miticide immediately — standard insecticides are mostly ineffective.",
            "Avoid broad-spectrum insecticides that kill natural predatory mites."
        ],
        "treatment": {
            "Acaricide": "Abamectin 1.9% EC @ 0.5 mL/L or Spiromesifen 22.9% SC @ 0.75 mL/L.",
            "Alternate": "Propargite 57% EC @ 2 mL/L. Rotate products every application to prevent resistance.",
        },
        "prevention": [
            "Maintain adequate irrigation — drought-stressed plants are highly susceptible.",
            "Conserve predatory mites (Phytoseiidae family).",
            "Monitor with sticky traps."
        ],
        "organic_remedy": "Neem oil (5 mL/L) + soap solution spray on leaf undersides every 3–5 days. Release Phytoseiulus persimilis (predatory mite).",
        "yield_impact": "Severe infestations cause premature leaf drop — 30–60% yield reduction."
    },

    "Tomato___Target_Spot": {
        "severity": "moderate",
        "cause": "Fungus — Corynespora cassiicola",
        "description": "Brown circular spots with concentric rings and yellow halo, affecting leaves, stems, and fruit.",
        "immediate_steps": [
            "Remove and destroy infected leaves.",
            "Improve air circulation through pruning.",
            "Apply fungicide within 24 hours."
        ],
        "treatment": {
            "Systemic fungicide": "Azoxystrobin 23% SC @ 1 mL/L or Boscalid + Pyraclostrobin (Pristine) @ 0.5 g/L.",
            "Alternate": "Fluxapyroxad + Pyraclostrobin combination for resistant strains.",
        },
        "prevention": [
            "Avoid dense planting — maintain 45–60 cm row spacing.",
            "Avoid evening irrigation.",
            "Use mulch to prevent soil splash."
        ],
        "organic_remedy": "Trichoderma viride (5 g/L) foliar spray + copper-based preventive spray.",
        "yield_impact": "20–40% fruit loss if infection spreads to fruit surface."
    },

    "Tomato___Tomato_Yellow_Leaf_Curl_Virus": {
        "severity": "critical",
        "cause": "Virus — Tomato Yellow Leaf Curl Virus (TYLCV), spread by whitefly Bemisia tabaci",
        "description": "Upward leaf curling, yellowing of leaf margins, stunted growth. No fruit set in severe cases.",
        "immediate_steps": [
            "⚠️ No chemical cures viral infection. Focus on whitefly vector control.",
            "Remove and destroy severely infected plants immediately.",
            "Apply systemic insecticide against whitefly immediately.",
            "Install yellow sticky traps across the field."
        ],
        "treatment": {
            "Whitefly control": "Imidacloprid 17.8% SL @ 0.5 mL/L or Thiamethoxam 25% WG @ 0.5 g/L.",
            "Alternate insecticide": "Spirotetramat 11.01% + Imidacloprid 11.01% SC. Rotate to prevent resistance.",
        },
        "prevention": [
            "Plant TYLCV-resistant tomato varieties (Arka Samrat, Naveen in India).",
            "Use 40-mesh insect-proof netting in nurseries.",
            "Install reflective silver mulch to repel whitefly.",
            "Plant marigold border rows as a trap crop."
        ],
        "organic_remedy": "Neem oil (5 mL/L) spray every 5 days to repel whitefly. Yellow sticky traps.",
        "yield_impact": "Complete crop failure possible if infection occurs before flowering stage."
    },

    "Tomato___Tomato_mosaic_virus": {
        "severity": "high",
        "cause": "Virus — Tomato Mosaic Virus (ToMV), spread by mechanical contact and infected seed",
        "description": "Mosaic pattern of light and dark green on leaves, leaf distortion, stunted fruit with uneven ripening.",
        "immediate_steps": [
            "⚠️ No cure — remove and destroy infected plants immediately.",
            "Disinfect all tools and hands with 10% bleach or 70% alcohol after touching infected plants.",
            "Never smoke near tomato plants — tobacco is a reservoir for ToMV.",
            "Control aphid and thrips vectors."
        ],
        "treatment": {
            "Vector control": "Imidacloprid 17.8% SL @ 0.5 mL/L or Lambda-cyhalothrin 5% EC @ 1 mL/L.",
            "Note": "No curative chemical treatment exists for the virus.",
        },
        "prevention": [
            "Use certified virus-tested seed.",
            "Plant ToMV-resistant varieties (resistance gene Tm-2²).",
            "Dip seeds in 10% trisodium phosphate (TSP) solution for 15 min before sowing.",
            "Minimize plant wounding during transplanting."
        ],
        "organic_remedy": "Reflective mulch to repel vector insects. Spray Trichoderma-based products to maintain plant immunity.",
        "yield_impact": "20–60% yield loss. Early infection is most damaging — can cause near-total crop failure."
    },

    "Tomato___healthy": {
        "severity": "none",
        "cause": "No disease detected",
        "description": "Tomato plant is healthy. No action required.",
        "immediate_steps": [
            "Scout twice weekly — tomato is susceptible to many diseases.",
            "Monitor for early blight starting at lower leaves.",
            "Ensure adequate calcium to prevent blossom-end rot."
        ],
        "treatment": {
            "Status": "No treatment needed.",
            "Preventive": "Prophylactic Mancozeb spray before monsoon season."
        },
        "prevention": [
            "Use drip irrigation to keep foliage dry.",
            "Stake and prune suckers for good airflow.",
            "Rotate with non-solanaceous crops every 2 years."
        ],
        "organic_remedy": "Spray Pseudomonas fluorescens (10 g/L) monthly as a systemic resistance inducer.",
        "yield_impact": "Healthy plant — optimal fruit yield expected."
    },

    # ══════════════════ WHEAT ══════════════════
    "Wheat___Mite": {
        "severity": "moderate",
        "cause": "Pest — Aceria tosichella (Wheat Curl Mite) / Penthaleus major (Blue Oat Mite)",
        "description": "Leaf curling, yellowing/silvering of leaves, stunted tillers. Wheat curl mite also vectors Wheat Streak Mosaic Virus.",
        "immediate_steps": [
            "Apply acaricide/miticide spray immediately — standard insecticides are less effective.",
            "Scout field edges first — mite infestations spread inward from borders.",
            "Avoid volunteer wheat near fields — a key mite reservoir."
        ],
        "treatment": {
            "Acaricide": "Spiromesifen 22.9% SC @ 0.75 mL/L or Dicofol 18.5% EC @ 2.5 mL/L.",
            "Systemic": "Abamectin 1.9% EC @ 0.5 mL/L for systemic control.",
        },
        "prevention": [
            "Destroy volunteer wheat and grassy weeds before sowing.",
            "Plant mite-tolerant wheat varieties where available.",
            "Delayed sowing reduces early mite infestation."
        ],
        "organic_remedy": "Neem oil (5 mL/L) + soap solution spray on undersides. Release predatory mites as biocontrol.",
        "yield_impact": "10–30% yield loss in heavily infested crops. Higher losses if WSMV is transmitted."
    },

    "Wheat___Powdery_mildew": {
        "severity": "moderate",
        "cause": "Fungus — Blumeria graminis f.sp. tritici",
        "description": "White powdery colonies on upper leaf surfaces and sheaths. Infected tissue turns yellow then brown.",
        "immediate_steps": [
            "Apply fungicide at first sign — disease spreads rapidly in cool, humid conditions.",
            "Remove heavily infected tillers.",
            "Reduce nitrogen application temporarily."
        ],
        "treatment": {
            "Systemic fungicide": "Propiconazole 25% EC @ 0.5 mL/L or Tebuconazole 25.9% EC @ 0.75 mL/L.",
            "Contact fungicide": "Sulfur 80% WP @ 2.5 g/L. Spray every 10–14 days.",
        },
        "prevention": [
            "Plant resistant wheat varieties.",
            "Avoid late sowing — increased mildew risk in winter wheat.",
            "Avoid excessive nitrogen — promotes lush growth susceptible to mildew."
        ],
        "organic_remedy": "Baking soda (5 g/L) + neem oil (5 mL/L) spray. Sulfur dust as preventive.",
        "yield_impact": "5–20% yield loss in susceptible varieties. Earlier infection causes greater loss."
    },

    "Wheat___Scrab": {
        "severity": "high",
        "cause": "Fungus — Fusarium graminearum (Fusarium Head Blight / Scab)",
        "description": "Bleached spikelets (Fusarium Head Blight) with pink/orange fungal growth. Grain shriveling and mycotoxin contamination.",
        "immediate_steps": [
            "Apply fungicide at early flowering stage — the critical infection window.",
            "Do NOT use infected grain for seed or animal feed due to mycotoxin risk.",
            "Harvest early to reduce grain contamination."
        ],
        "treatment": {
            "Systemic fungicide": "Tebuconazole 25.9% EC @ 0.75 mL/L or Metconazole 9% EC @ 1 mL/L.",
            "Timing": "Spray at 25–50% anthesis (flowering) for best protection — timing is critical.",
        },
        "prevention": [
            "Plant scab-resistant wheat varieties.",
            "Avoid corn-wheat rotation — corn residue is primary inoculum source.",
            "Till crop residue to reduce Fusarium inoculum."
        ],
        "organic_remedy": "Bacillus subtilis-based biocontrol (Serenade) applied at flowering. Trichoderma seed treatment.",
        "yield_impact": "20–50% yield loss. Mycotoxin contamination (DON) can make entire harvest unsaleable."
    },

    "Wheat___Septoria_leaf_blight": {
        "severity": "moderate",
        "cause": "Fungus — Zymoseptoria tritici (Septoria tritici blotch) / Parastagonospora nodorum",
        "description": "Tan to brown blotches with yellow borders starting on lower leaves, with black pycnidia (tiny dots) inside lesions.",
        "immediate_steps": [
            "Apply fungicide immediately — disease progresses up the canopy from lower leaves.",
            "Remove heavily infected lower leaves.",
            "Avoid overhead irrigation."
        ],
        "treatment": {
            "Systemic fungicide": "Propiconazole 25% EC @ 0.5 mL/L or Tebuconazole + Trifloxystrobin combination.",
            "Frequency": "2–3 sprays at 14-day intervals from flag leaf emergence.",
        },
        "prevention": [
            "Plant resistant wheat varieties.",
            "Practice crop rotation — reduces inoculum from infected residue.",
            "Avoid excessive plant density."
        ],
        "organic_remedy": "Copper-based fungicide (Bordeaux 0.5%) as a preventive. Compost improves plant vigour.",
        "yield_impact": "10–40% yield loss in susceptible varieties during wet seasons."
    },

    "Wheat___Stem_fly": {
        "severity": "moderate",
        "cause": "Pest — Atherigona tritici (Wheat Stem Fly / Shoot Fly)",
        "description": "Dead heart symptom — central shoot dies while outer leaves remain green. Maggot visible inside stem base.",
        "immediate_steps": [
            "Remove and destroy dead heart tillers immediately to reduce larval population.",
            "Apply systemic insecticide immediately.",
            "Scout field edges where infestation typically begins."
        ],
        "treatment": {
            "Systemic insecticide": "Chlorpyrifos 20% EC @ 2.5 mL/L or Quinalphos 25% EC @ 2 mL/L.",
            "Seed treatment": "Imidacloprid 70% WS @ 5 g/kg seed for seedling protection.",
        },
        "prevention": [
            "Sow wheat early to avoid peak stem fly population.",
            "Avoid volunteer wheat around fields.",
            "Use recommended seed rate — thick crop reduces fly impact."
        ],
        "organic_remedy": "Neem oil (5 mL/L) spray at seedling stage. Neem seed kernel extract (5% NSKE) as repellent.",
        "yield_impact": "10–25% tiller loss in early infestations. Severe early attacks cause significant yield reduction."
    },

    "Wheat___Stripe_rust": {
        "severity": "high",
        "cause": "Fungus — Puccinia striiformis f.sp. tritici",
        "description": "Yellow-orange pustules in stripes along leaf veins (hence 'stripe rust'). Thrives in cool, moist conditions (10–15°C).",
        "immediate_steps": [
            "Apply fungicide immediately — stripe rust spreads very rapidly in cool weather.",
            "Scout upwind areas first — spores travel long distances by wind.",
            "Alert neighboring farms to monitor their fields."
        ],
        "treatment": {
            "Systemic fungicide": "Propiconazole 25% EC @ 0.5 mL/L or Tebuconazole 25.9% EC @ 0.75 mL/L.",
            "Triazole mix": "Tebuconazole + Trifloxystrobin provides both curative and protective activity.",
            "Frequency": "2 sprays at 14-day intervals.",
        },
        "prevention": [
            "Plant stripe rust-resistant varieties (HD 2967 resistance breakdown — use HD 3086 or DBW 187 in India).",
            "Avoid late sowing — cool late season conditions favour stripe rust.",
            "Monitor from jointing stage onward."
        ],
        "organic_remedy": "Sulfur 80% WP (2 g/L) as a preventive. Copper-based sprays slow early infection.",
        "yield_impact": "40–70% yield loss in severe epidemics on susceptible varieties. Major wheat threat in North India."
    },

    "Wheat___Yellow_rust": {
        "severity": "high",
        "cause": "Fungus — Puccinia striiformis (same pathogen as stripe rust, regional naming difference)",
        "description": "Bright yellow powdery stripes of pustules along leaf veins. Spores are yellow-orange. Thrives in cool weather.",
        "immediate_steps": [
            "Apply fungicide immediately — Yellow Rust is the same as Stripe Rust and spreads very fast.",
            "Scout all surrounding fields immediately after detection.",
            "Avoid moving machinery from infected to healthy fields."
        ],
        "treatment": {
            "Systemic fungicide": "Propiconazole 25% EC @ 0.5 mL/L or Tebuconazole 25.9% EC @ 0.75 mL/L.",
            "Frequency": "2 sprays at 14-day intervals starting at first sign.",
        },
        "prevention": [
            "Plant Yellow/Stripe Rust-resistant wheat varieties.",
            "Early sowing reduces exposure to peak rust season.",
            "Apply balanced nutrition — excess nitrogen increases susceptibility."
        ],
        "organic_remedy": "Sulfur 80% WP (2 g/L) spray. Bordeaux mixture (0.5%) as preventive before cool, wet weather.",
        "yield_impact": "30–70% yield loss possible in susceptible varieties. Treat as a crop emergency in winter wheat."
    },

    "Wheat___aphid": {
        "severity": "moderate",
        "cause": "Pest — Schizaphis graminum (Greenbug) / Sitobion avenae (English Grain Aphid)",
        "description": "Dense colonies of small soft-bodied insects on leaves and ear. Yellowing of leaves, stunted ears, honeydew deposits leading to sooty mold.",
        "immediate_steps": [
            "Apply systemic insecticide immediately if >10 aphids/tiller are present.",
            "Check for natural enemies (ladybirds, parasitic wasps) before spraying — may control naturally.",
            "Aphids also vector Barley Yellow Dwarf Virus — early control is critical."
        ],
        "treatment": {
            "Systemic insecticide": "Imidacloprid 17.8% SL @ 0.5 mL/L or Thiamethoxam 25% WG @ 0.3 g/L.",
            "Contact insecticide": "Lambda-cyhalothrin 5% EC @ 1 mL/L or Chlorpyrifos 20% EC @ 2 mL/L.",
        },
        "prevention": [
            "Destroy volunteer wheat and grassy weeds.",
            "Avoid excessive nitrogen — promotes lush growth that attracts aphids.",
            "Preserve natural enemies by using selective insecticides."
        ],
        "organic_remedy": "Neem oil (5 mL/L) spray. Soap solution (10 g/L) dislodges and kills soft-bodied aphids. Encourage natural predators.",
        "yield_impact": "5–20% direct yield loss. BYDV transmission can cause 30–50% additional loss."
    },

    "Wheat___healthy": {
        "severity": "none",
        "cause": "No disease detected",
        "description": "Wheat plant is healthy. No action required.",
        "immediate_steps": [
            "Scout weekly for stripe rust, powdery mildew and aphids.",
            "Maintain adequate irrigation especially at crown root initiation and grain fill.",
            "Apply top-dress nitrogen at first node stage for yield."
        ],
        "treatment": {
            "Status": "No treatment needed.",
            "Preventive": "Seed treatment with Carboxin + Thiram (Vitavax) @ 2 g/kg before sowing."
        },
        "prevention": [
            "Use certified disease-resistant wheat varieties.",
            "Practice 2-year rotation with non-cereal crops.",
            "Maintain recommended sowing date to avoid peak disease pressure."
        ],
        "organic_remedy": "Trichoderma viride (5 g/kg) seed treatment. Pseudomonas fluorescens soil drench.",
        "yield_impact": "Healthy plant — optimal grain yield expected."
    },
}

# ─────────────────────────────────────────────
# Leaf detector
# ─────────────────────────────────────────────
def contains_leaf(img_rgb):
    hsv = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2HSV)
    lower = np.array([25, 40, 40])
    upper = np.array([95, 255, 255])
    mask = cv2.inRange(hsv, lower, upper)
    green_ratio = np.sum(mask > 0) / mask.size
    return green_ratio > 0.05

# ─────────────────────────────────────────────
# Prediction endpoint
# ─────────────────────────────────────────────
@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files["image"]
    img_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(img_path)

    from PIL import Image
    img_pil = Image.open(img_path).convert("RGB")
    img_np = np.array(img_pil)

    if not contains_leaf(img_np):
        return jsonify({
            "disease": "No leaf detected",
            "confidence": 0,
            "recommendation": None
        })

    img = tf.keras.preprocessing.image.load_img(img_path, target_size=(128, 128))
    img_array = tf.keras.preprocessing.image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)

    preds = model.predict(img_array)[0]
    pred_index = int(np.argmax(preds))
    confidence = float(preds[pred_index] * 100)
    disease = CLASS_NAMES[pred_index]

    if confidence < 60:
        return jsonify({
            "disease": "Uncertain — Upload clearer leaf image",
            "confidence": round(confidence, 2),
            "recommendation": None
        })

    recommendation = DISEASE_RECOMMENDATIONS.get(disease, None)

    return jsonify({
        "disease": disease,
        "confidence": round(confidence, 2),
        "recommendation": recommendation
    })


# ─────────────────────────────────────────────
# Fertilizer recommendation data
# ─────────────────────────────────────────────
NPK_REQUIREMENTS = {
    "Wheat":      {"N": 120, "P": 60,  "K": 40},
    "Rice":       {"N": 100, "P": 50,  "K": 50},
    "Maize":      {"N": 120, "P": 60,  "K": 40},
    "Tomato":     {"N": 150, "P": 75,  "K": 75},
    "Cotton":     {"N": 100, "P": 50,  "K": 50},
    "Potato":     {"N": 120, "P": 80,  "K": 100},
    "Sugarcane":  {"N": 250, "P": 60,  "K": 120},
}

FERTILIZER_PRODUCTS = {
    "urea": {"name": "Urea (46% N)", "nutrient": "N", "percent": 0.46, "price": 6},
    "dap":  {"name": "DAP (18% N, 46% P)", "nutrient": "P", "percent": 0.46, "price": 25},
    "mop":  {"name": "MOP (60% K)", "nutrient": "K", "percent": 0.60, "price": 18}
}

UNIT_MULTIPLIER = {
    "acre": 1,
    "hectare": 2.47,
    "gunta": 0.025
}

@app.route("/api/fertilizer", methods=["POST"])
def fertilizer():
    data = request.json
    crop = data.get("crop")
    area = float(data.get("area", 1))
    unit = data.get("unit", "acre")
    stage = data.get("growth_stage", "Sowing / Basal")

    if crop not in NPK_REQUIREMENTS:
        return jsonify({"success": False, "error": "Unsupported crop"}), 400

    factor = UNIT_MULTIPLIER.get(unit, 1) * area
    base = NPK_REQUIREMENTS[crop]

    nutrients = {
        "N": round(base["N"] * factor, 1),
        "P": round(base["P"] * factor, 1),
        "K": round(base["K"] * factor, 1)
    }

    urea_qty = round(nutrients["N"] / FERTILIZER_PRODUCTS["urea"]["percent"], 1)
    dap_qty  = round(nutrients["P"] / FERTILIZER_PRODUCTS["dap"]["percent"], 1)
    mop_qty  = round(nutrients["K"] / FERTILIZER_PRODUCTS["mop"]["percent"], 1)

    cost = (
        urea_qty * FERTILIZER_PRODUCTS["urea"]["price"] +
        dap_qty  * FERTILIZER_PRODUCTS["dap"]["price"] +
        mop_qty  * FERTILIZER_PRODUCTS["mop"]["price"]
    )

    response = {
        "success": True,
        "data": {
            "nutrients_kg": nutrients,
            "products": {
                "urea": {"name": FERTILIZER_PRODUCTS["urea"]["name"], "qty_kg": urea_qty},
                "dap":  {"name": FERTILIZER_PRODUCTS["dap"]["name"],  "qty_kg": dap_qty},
                "mop":  {"name": FERTILIZER_PRODUCTS["mop"]["name"],  "qty_kg": mop_qty}
            },
            "estimated_cost_inr": round(cost),
            "next_dose_stage": "Vegetative stage" if stage == "Sowing / Basal" else "As per crop response",
            "application_tip": "Apply fertilizer after irrigation and avoid application before heavy rainfall."
        }
    }
    return jsonify(response)


# ─────────────────────────────────────────────
# Gemini AI
# ─────────────────────────────────────────────
GEN_AI_KEY = "AIzaSyBuU-tw8BjEtWKKtByLe2GdAmUT8mWm0nI"
genai.configure(api_key=GEN_AI_KEY)
model_ai = genai.GenerativeModel("gemini-flash-latest")

UPLOAD_FOLDER = 'static/uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.json
    user_message = data.get("message", "")
    try:
        prompt = (
            "You are AgroSense AI, an expert agricultural advisor. "
            "Provide concise, practical advice about crop diseases, fertilizers, "
            "irrigation, and farming in India. Keep answers under 3 sentences.\n\n"
            f"User: {user_message}"
        )
        response = model_ai.generate_content(prompt)
        return jsonify({"success": True, "reply": response.text})
    except Exception as e:
        print("Gemini error:", e)
        return jsonify({"success": False, "reply": "AI service temporarily unavailable."})


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
