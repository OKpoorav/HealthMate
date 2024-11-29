import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = 'YOUR_GEMINI_API_KEY'; // Replace with your actual API key
const genAI = new GoogleGenerativeAI("AIzaSyCvr680JIIi69GsPVTbxahRH7c1xANdjjc");
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

document.addEventListener('DOMContentLoaded', () => {
    const chatInput = document.querySelector('.chat-input input');
    const enterButton = document.querySelector('.chat-input .enter-input');
    const chatBox = document.querySelector('.chat .chat-box');

    if (!chatInput || !enterButton || !chatBox) {
        console.error('Chat elements not found');
        return;
    }

    async function generateResponse(userMessage) {
        try {
            const parts = [
              { text: "input: Paracetamol" },
              {
              text: "output: ### **Paracetamol Overview**  \n- **Type:** Analgesic & Antipyretic  \n- **Uses:** Relieves mild to moderate pain (headache, toothache, muscle pain), reduces fever.  \n- **Forms:** Tablets, capsules, liquids, suppositories.\n\n---\n\n### **Benefits**  \n- Effective pain relief and fever reduction.  \n- Gentler on the stomach than NSAIDs.  \n- Safe for most age groups when used correctly.  \n- Affordable and easily available.\n\n---\n\n### **Side Effects**  \n- **Common (Rare):** Nausea, rash, itching.  \n- **Serious (Overdose):** Liver damage, jaundice, abdominal pain, kidney issues.  \n- **Allergic Reactions:** Swelling, difficulty breathing (rare).\n\n---\n\n### **How to Use**  \n- **Adults:** 500-1000 mg every 4-6 hours, max 4000 mg/day.  \n- **Children:** Dose based on weight/age (follow medical advice).  \n- Take with or without food; avoid alcohol.\n\n---\n\n### **Precautions**  \n- **Consult Doctor If:** Liver/kidney disease, chronic alcohol use, pregnancy, or breastfeeding.  \n- **Avoid:** Combining with other Paracetamol-containing medicines.  \n- **Monitor:** Symptoms like dark urine, yellow skin, or fatigue.\n\n---\n\n### **Substitutes**  \n- **NSAIDs:** Ibuprofen, aspirin, naproxen.  \n- **Others:** Acetaminophen/codeine combinations, herbal alternatives (turmeric, willow bark).",
              },
              { text: "input: Pudin Hara" },
              {
              text: "output: ### **Pudin Hara Overview**  \n- **Type:** Herbal Ayurvedic remedy.  \n- **Uses:** Provides relief from indigestion, gas, acidity, and stomach discomfort.  \n- **Forms:** Liquid drops, capsules, tablets.\n\n---\n\n### **Benefits**  \n- Eases bloating, gas, and stomach cramps.  \n- Soothes acidity and heartburn.  \n- Promotes digestion and provides a cooling effect on the stomach.  \n- Natural, safe, and fast-acting remedy for digestive issues.\n\n---\n\n### **Side Effects**  \n- **Common (Rare):** Mild irritation or a cooling sensation in the throat.  \n- **Rare:** Allergic reactions like rash or itching.  \n- Generally well-tolerated when used as directed.\n\n---\n\n### **How to Use**  \n- **Liquid:** 5-10 drops in water, 2-3 times a day after meals.  \n- **Capsules/Tablets:** 1-2 capsules/tablets after meals as needed.  \n- Can be taken with water for faster relief.\n\n---\n\n### **Precautions**  \n- **Consult Doctor If:** Pregnant, breastfeeding, or if you have chronic gastrointestinal conditions.  \n- **Avoid:** Overuse, which may cause stomach upset.  \n- **Monitor:** For any allergic reactions like skin rash or itching.\n\n---\n\n### **Substitutes**  \n- **Herbal Alternatives:** Ajwain (carom seeds), fennel seeds, ginger tea, mint tea.  \n- **Medicinal Alternatives:** Antacids (e.g., Digene, Gelusil), simethicone for gas relief.",
              },
              { text: "input: Azithromycin" },
              {
              text: "output: ### **Azithromycin Overview**  \n- **Type:** Antibiotic (Macrolide class).  \n- **Uses:** Treats bacterial infections such as respiratory infections, skin infections, ear infections, and sexually transmitted diseases.  \n- **Forms:** Tablets, capsules, oral suspension, and injections.\n\n---\n\n### **Benefits**  \n- Effective against a wide range of bacterial infections.  \n- Convenient dosing with once-daily administration.  \n- Shorter treatment duration compared to other antibiotics (usually 3-5 days).  \n- Well-tolerated by most patients.\n\n---\n\n### **Side Effects**  \n- **Common:** Nausea, vomiting, diarrhea, stomach pain.  \n- **Rare:** Allergic reactions (rash, itching, swelling), liver issues (jaundice, dark urine), irregular heartbeat.  \n- **Serious:** Severe diarrhea (Clostridium difficile infection), hearing issues (in high doses).\n\n---\n\n### **How to Use**  \n- **Dosage:** As prescribed by a doctor, often 500 mg on the first day, then 250 mg once daily for 2-4 days.  \n- **Take with/without food:** Preferably with food to reduce stomach upset.  \n- Complete the full course, even if symptoms improve early.\n\n---\n\n### **Precautions**  \n- **Consult Doctor If:** You have liver or kidney problems, heart conditions, or are pregnant/breastfeeding.  \n- **Avoid:** Combining with antacids containing aluminum or magnesium, as they reduce absorption.  \n- **Monitor:** Symptoms like severe diarrhea or unusual fatigue during treatment.\n\n---\n\n### **Substitutes**  \n- **Other Antibiotics:** Amoxicillin, Clarithromycin, Doxycycline, Levofloxacin (based on infection type).  \n- **Herbal Support (for minor issues):** Garlic, echinacea, or turmeric (not a replacement for antibiotics).",
              },
              { text: "input: I-pill" },
              {
              text: "output: ### **I-Pill Overview**  \n- **Type:** Emergency contraceptive pill.  \n- **Uses:** Prevents pregnancy after unprotected sex or contraceptive failure (e.g., broken condom).  \n- **Active Ingredient:** Levonorgestrel (1.5 mg).  \n- **Timing:** Effective within 72 hours of intercourse, best within 24 hours.\n\n---\n\n### **Benefits**  \n- **Primary Use:** Reduces the risk of unintended pregnancy by up to 95% if taken within 24 hours.  \n- **Convenient:** Single-dose, easy to take.  \n- **Accessible:** Available over the counter without a prescription.\n\n---\n\n### **Side Effects**  \n- **Common:** Nausea, vomiting, fatigue, dizziness, breast tenderness, headaches.  \n- **Menstrual Changes:** Early or delayed periods, heavier or lighter bleeding.  \n- **Serious (Rare):** Severe abdominal pain (possible ectopic pregnancy), allergic reactions (rash, itching, swelling).\n\n---\n\n### **How to Use**  \n- **Dosage:** Take one pill as soon as possible after unprotected sex.  \n- **If Vomiting Occurs:** Within 2 hours, consult a doctor as another dose may be needed.  \n- Resume regular contraceptive methods after use.\n\n---\n\n### **Precautions**  \n- **Not for Regular Use:** Intended for emergencies, not a substitute for routine contraception.  \n- **Consult Doctor If:** You have a history of blood clots, liver issues, or are already pregnant.  \n- **Avoid:** Using it frequently, as it may disrupt menstrual cycles and reduce effectiveness.\n\n---\n\n### **Substitutes**  \n- **Other Emergency Pills:** Unwanted 72, NorLevo, Plan B.  \n- **Copper IUD:** Can be inserted within 5 days as emergency contraception.  \n- **Routine Methods:** Oral contraceptive pills, condoms, intrauterine devices (IUDs).",
              },
              { text: "input: Sotret 20mg" },
              {
              text: "output: ### **Sotret 20 mg Overview**  \n- **Type:** Oral retinoid (Isotretinoin).  \n- **Uses:** Treats severe acne (nodular or cystic) that hasn’t responded to other treatments.  \n- **Forms:** Capsules.  \n\n---\n\n### **Benefits**  \n- **Highly Effective:** Reduces severe acne by shrinking sebaceous glands and decreasing oil production.  \n- **Long-Term Relief:** Can lead to prolonged acne remission after the treatment course.  \n- **Reduces Scarring:** Minimizes the risk of future scarring by controlling severe outbreaks.\n\n---\n\n### **Side Effects**  \n- **Common:** Dry skin, lips, eyes, and nose; peeling skin; nosebleeds; joint pain.  \n- **Serious (Rare):** Depression, mood changes, vision problems, severe stomach pain, liver issues, or high cholesterol.  \n- **Teratogenic:** Causes severe birth defects if taken during pregnancy.\n\n---\n\n### **How to Use**  \n- **Dosage:** Typically 20 mg once or twice daily with meals, as prescribed by a dermatologist.  \n- **Duration:** Treatment lasts 4-6 months, depending on the severity of acne.  \n- **Follow-Up:** Regular blood tests to monitor liver function and lipid levels.\n\n---\n\n### **Precautions**  \n- **Pregnancy:** Strictly avoid—requires mandatory pregnancy tests before, during, and after treatment.  \n- **Avoid:** Vitamin A supplements, alcohol, and prolonged sun exposure.  \n- **Monitor:** Mental health for mood changes, as isotretinoin has been linked to depression.\n\n---\n\n### **Substitutes**  \n- **Milder Acne Treatments:** Benzoyl peroxide, salicylic acid, antibiotics (doxycycline, minocycline).  \n- **Other Retinoids:** Tretinoin (topical), Adapalene (topical).  \n- **Alternative Oral Medications:** Hormonal treatments for women, such as combined oral contraceptives or spironolactone.",
              },
              { text: "input: Lime Vitamin C Chewable Tablet" },
              {
              text: "output: ### **Lime Vitamin C Chewable Tablet Overview**  \n- **Type:** Dietary supplement.  \n- **Uses:** Supports immune function, promotes healthy skin, and aids in collagen synthesis.  \n- **Active Ingredient:** Ascorbic acid (Vitamin C).  \n- **Form:** Chewable tablets, often with a lime flavor for easy consumption.\n\n---\n\n### **Benefits**  \n- **Boosts Immunity:** Helps the body fight infections and reduces the duration of common colds.  \n- **Antioxidant:** Protects cells from oxidative damage caused by free radicals.  \n- **Skin Health:** Enhances collagen production, improving skin elasticity and wound healing.  \n- **Iron Absorption:** Improves absorption of non-heme iron from plant-based foods.\n\n---\n\n### **Side Effects**  \n- **Common:** Mild stomach upset, diarrhea, or nausea, especially if taken in high doses.  \n- **Rare:** Kidney stones (in excessive long-term use), allergic reactions (rash, itching).  \n- **Tolerability:** Generally safe and well-tolerated at recommended doses.\n\n---\n\n### **How to Use**  \n- **Dosage:** Typically 500 mg to 1000 mg daily or as directed by a healthcare provider.  \n- **Method:** Chew thoroughly before swallowing. Can be taken with or without food.  \n- **Hydration:** Drink plenty of water to prevent stomach irritation or kidney issues.\n\n---\n\n### **Precautions**  \n- **Consult Doctor If:** You have kidney problems, are pregnant, breastfeeding, or are on other medications.  \n- **Avoid Excessive Use:** Taking more than the recommended dose may lead to gastrointestinal discomfort or kidney stones.  \n- **Monitor:** For any signs of an allergic reaction or persistent stomach discomfort.\n\n---\n\n### **Substitutes**  \n- **Other Vitamin C Supplements:** Tablets, capsules, effervescent powders, or gummies.  \n- **Natural Sources:** Citrus fruits (oranges, lemons), strawberries, kiwi, bell peppers, and broccoli.  \n- **Multivitamins:** Formulations containing Vitamin C along with other essential nutrients.",
              },
              { text: "input: Revital H" },
              {
              text: "output: ### **Revital H Overview**  \n- **Type:** Multivitamin and multimineral supplement.  \n- **Uses:** Boosts energy levels, enhances immunity, and supports overall well-being.  \n- **Composition:** A blend of vitamins (A, C, D, E, B-complex), minerals (iron, calcium, zinc), and ginseng.  \n- **Form:** Capsules and tablets.\n\n---\n\n### **Benefits**  \n- **Energy Boost:** Ginseng and B-complex vitamins help reduce fatigue and enhance stamina.  \n- **Immune Support:** Vitamins C and E act as antioxidants, strengthening immune defenses.  \n- **Bone & Muscle Health:** Calcium, vitamin D, and magnesium promote strong bones and muscles.  \n- **Cognitive Function:** Ginseng supports mental alertness and concentration.\n\n---\n\n### **Side Effects**  \n- **Common:** Mild nausea, upset stomach, or headache.  \n- **Rare:** Allergic reactions (rash, itching, swelling), dizziness.  \n- **Excessive Use:** Can lead to hypervitaminosis or mineral imbalance.\n\n---\n\n### **How to Use**  \n- **Dosage:** Typically one tablet daily with a meal or as directed by a healthcare provider.  \n- **Method:** Swallow whole with water, preferably in the morning for an energy boost throughout the day.  \n- **Consistency:** Regular use is recommended for best results.\n\n---\n\n### **Precautions**  \n- **Consult Doctor If:** You have any chronic conditions, are pregnant, breastfeeding, or taking other medications.  \n- **Avoid:** Overdosing, as it may cause side effects like gastrointestinal discomfort or toxicity.  \n- **Monitor:** For any unusual symptoms like prolonged fatigue or digestive issues.\n\n---\n\n### **Substitutes**  \n- **Other Multivitamins:** Supradyn, Centrum, HealthKart Multivitamin.  \n- **Natural Alternatives:** Balanced diet rich in fruits, vegetables, whole grains, and lean proteins.  \n- **Herbal Energy Boosters:** Ashwagandha, spirulina, or green tea extracts.",
              },
              { text: "input: Vitxan" },
              {
              text: "output: ### Vitxan Tablet\n\n**Overview:**\nVitxan is a multivitamin and antioxidant supplement designed to boost overall health and immunity. It contains a blend of essential vitamins, minerals, and antioxidants like astaxanthin, DHA, EPA, grape seed extract, resveratrol, selenium, vitamin C, vitamin E, and zinc.\n\n**Benefits:**\n- **Immunity Boost:** Supports immune function with vitamins C, E, selenium, and zinc.\n- **Antioxidant Protection:** Astaxanthin, resveratrol, and grape seed extract help neutralize free radicals, reducing oxidative stress.\n- **Heart Health:** Omega-3 fatty acids (DHA, EPA) support cardiovascular function.\n- **Skin and Eye Health:** Antioxidants protect skin and improve vision health.\n\n**Side Effects:**\n- Generally well-tolerated, but excessive use may cause gastrointestinal issues, headaches, or allergic reactions. Always follow the recommended dosage.\n\n**Usage:**\n- Take one tablet daily or as directed by a healthcare professional. Do not exceed the prescribed dosage.\n\n**Precautions:**\n- Avoid if allergic to any ingredients.\n- Not recommended for pregnant or breastfeeding women unless prescribed.\n- Consult a doctor before use if you have underlying health conditions.\n\n**Substitutes:**\n- Other multivitamin supplements with similar compositions include Limcee, Revital H, and Becosules.",
              },
              { text: "input: Montair-LC" },
              {
              text: "output: **Montair-LC** is a combination medication that contains **Montelukast** (a leukotriene receptor antagonist) and **Levocetirizine** (an antihistamine), which is commonly prescribed for managing allergic rhinitis, asthma, and other allergic conditions.\n\n### **Benefits**:\n1. **Montelukast**: Helps reduce inflammation in the airways and prevents bronchoconstriction, improving breathing in asthma patients and alleviating symptoms of allergic rhinitis.\n2. **Levocetirizine**: Relieves symptoms like sneezing, runny nose, and itching by blocking histamine receptors, reducing allergy-related inflammation.\n\n### **Side Effects**:\n- **Common**: Drowsiness, fatigue, headache, dry mouth, and nausea.\n- **Serious (Rare)**: Allergic reactions (rash, swelling), dizziness, or mood changes.\n- **Long-term Use**: Some patients may experience side effects like sleep disturbances or mild gastrointestinal issues.\n\n### **How to Use**:\n- **Dosage**: Typically, 1 tablet per day, as prescribed by your doctor. It can be taken with or without food.\n- **Administration**: Swallow the tablet whole with water. Avoid crushing or chewing the tablet.\n\n### **Precautions**:\n- **Caution for People with Liver/Kidney Issues**: Dosage adjustments may be necessary for individuals with compromised liver or kidney function.\n- **Pregnancy/Breastfeeding**: Consult your doctor before using during pregnancy or breastfeeding.\n- **Mental Alertness**: Levocetirizine can cause drowsiness, so avoid engaging in activities that require full mental alertness (e.g., driving).\n\n### **Substitutes**:\n- **Montelukast alone**: Singulair, Montemac.\n- **Levocetirizine alone**: Xyzal, Levocet.\n  \nAlways consult a healthcare provider for a tailored treatment plan.",
              },
              { text: "input: Novoret Neo Softgel" },
              {
              text: "output: **Novoret Neo Softgel** is a health supplement that helps manage eye-related conditions, particularly those associated with aging, such as cataracts, age-related macular degeneration (AMD), and diabetic retinopathy. It contains a blend of antioxidants and essential minerals, including astaxanthin, lutein, zeaxanthin, tocotrienol, resveratrol, copper, and zinc, all known for their protective effects on the eyes.\n\n### Benefits:\n- **Cataract Prevention**: Helps in reducing the risk of cataracts.\n- **Macular Degeneration**: Useful in managing age-related macular degeneration.\n- **Eye Health**: Supports overall eye health, including conditions like dry eyes, glaucoma, and retinitis pigmentosa.\n- **Antioxidant Properties**: Protects retinal cells from oxidative stress and light-induced damage, thus maintaining visual function.\n\n### Side Effects:\n- Novoret Neo is generally safe when taken as directed. However, if you experience unusual side effects such as allergic reactions, discontinue use and consult a doctor.\n\n### How to Use:\n- **Dosage**: Typically, one softgel per day or as prescribed by a physician.\n- **Administration**: Swallow the softgel whole with water; do not chew or crush.\n\n### Precautions:\n- **Allergies**: Avoid if allergic to any ingredients.\n- **Medical Conditions**: Inform your doctor if you have any eye conditions or are on other medications.\n- **Pregnancy & Breastfeeding**: Consult a healthcare provider before use.\n\n### Substitutes:\n- **MacuHealth**: Another supplement designed for eye health.\n- **Ocuvite**: Contains lutein and zeaxanthin for macular health.",
              },
              { text: "input: What can you do for me?" },
              {
              text: "output: I can provide you with all the information regarding a medication",
              },
              { text: "input: What can you do for me?" },
              { text: "output: I can help you understand about medicines." },
              { text: "input: Whats your name?" },
              { text: "output: Health Buddy" },
              { text: "input: Whats your name?" },
              { text: "output: I am Health Buddy" },
              { text: "input: Whats your name?" },
              { text: "output: My name is Health Buddy" },
              { text: "input: Whats your name?" },
              { text: "output: You can call me Health Buddy" },
                {text: `input: ${userMessage}`},
                {text: "output: "}
            ];

            const result = await model.generateContent({
                contents: [{ role: "user", parts }],
                generationConfig,
            });

            return result.response.text();
        } catch (error) {
            console.error('Error:', error);
            return `An error occurred: ${error.message}`;
        }
    }

    function addMessageToChatBox(message, type) {
        const messageElement = document.createElement('p');
        messageElement.classList.add(type);
        messageElement.textContent = message;
        chatBox.appendChild(messageElement);
        // Scroll to bottom of chat box
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    enterButton.addEventListener('click', async () => {
        const userMessage = chatInput.value.trim();
        
        if (!userMessage) {
            return;
        }

        // Add user message to chat box
        addMessageToChatBox(userMessage, 'user-message');
        
        // Clear input
        chatInput.value = '';

        // Show loading indicator
        addMessageToChatBox('Generating response...', 'bot-message');

        // Generate and add AI response
        const botResponse = await generateResponse(userMessage);
        
        // Remove loading indicator and add actual response
        chatBox.removeChild(chatBox.lastChild);
        addMessageToChatBox(botResponse, 'bot-message');
    });

    // Optional: Add enter key support
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            enterButton.click();
        }
    });
});