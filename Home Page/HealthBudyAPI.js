import { GoogleGenerativeAI } from "@google/generative-ai";

class ContextAwareChatApp {
    constructor(apiKey) {
        this.API_KEY = apiKey;
        this.genAI = new GoogleGenerativeAI(this.API_KEY);
        this.model = this.genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
        });

        this.generationConfig = {
            temperature: 0.7,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 8192,
            responseMimeType: "text/plain",
        };

        // Store conversation history
        this.conversationHistory = [];
        this.maxHistoryLength = 10; // Limit history to prevent context overflow

        this.chatInput = null;
        this.enterButton = null;
        this.chatBox = null;

        this.initializeDOM();
        this.bindEvents();
    }

    initializeDOM() {
        this.chatInput = document.querySelector('.chat-input input');
        this.enterButton = document.querySelector('.chat-input .enter-input');
        this.chatBox = document.querySelector('.chat .chat-box');

        if (!this.chatInput || !this.enterButton || !this.chatBox) {
            throw new Error('Essential chat elements are missing from the DOM');
        }
    }

    bindEvents() {
        this.enterButton.addEventListener('click', () => this.handleSendMessage());
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSendMessage();
            }
        });
    }

    async handleSendMessage() {
        const userMessage = this.chatInput.value.trim();
        
        if (!userMessage) {
            return;
        }

        try {
            // Add user message to chat and history
            this.addMessageToChatBox(userMessage, 'user-message');
            this.addToConversationHistory('user', userMessage);

            // Clear input
            this.chatInput.value = '';

            // Show loading indicator
            this.addMessageToChatBox('Generating response...', 'bot-message loading');

            // Generate response
            const botResponse = await this.generateResponse(userMessage);

            // Remove loading indicator and add actual response
            this.removePreviousMessage();
            this.addMessageToChatBox(botResponse, 'bot-message');
            this.addToConversationHistory('model', botResponse);
        } catch (error) {
            this.removePreviousMessage();
            this.addMessageToChatBox(`Error: ${error.message}`, 'error-message');
            console.error('Chat error:', error);
        }
    }

    async generateResponse(userMessage) {
        try {
            // Prepare parts with conversation context
            const parts = this.buildContextualParts(userMessage);

            const result = await this.model.generateContent({
                contents: [{ role: "user", parts }],
                generationConfig: this.generationConfig,
            });

            return this.formatResponse(result.response.text());
        } catch (error) {
            throw new Error(`Failed to generate response: ${error.message}`);
        }
    }

    buildContextualParts(userMessage) {
        // Build parts with conversation history and current message
        const parts = [
          {text: "input: Paracetamol"},
              {text: "input: What can you do for me?"},
              {text: "output: I can provide you with all the information regarding a medication."},
              {text: "input: What can you do for me?"},
              {text: "output: I can help you understand about medicines."},
              {text: "input: Whats your name?"},
              {text: "output: Health Buddy"},
              {text: "input: Whats your name?"},
              {text: "output: I am Health Buddy"},
              {text: "input: Whats your name?"},
              {text: "output: My name is Health Buddy"},
              {text: "input: Whats your name?"},
              {text: "output: You can call me Health Buddy"},
{text:"input:Suggest medication for migraine"},
{text:"output:Over-the-counter options include ibuprofen, acetaminophen, or aspirin. For severe cases, try triptans like sumatriptan or rizatriptan."},

{text:"input:Best treatment for high blood pressure?"},
{text:"output:Lifestyle changes such as reduced salt intake and exercise. Medications include ACE inhibitors, beta-blockers, and diuretics."},

{text:"input:What to take for seasonal allergies?"},
{text:"output:Antihistamines like loratadine or cetirizine. Nasal corticosteroids and decongestants can also help."},

{text:"input:Recommend something for a dry cough"},
{text:"output:Try a cough suppressant like dextromethorphan. Stay hydrated and use lozenges for throat soothing."},

{text:"input:How to treat bacterial sinusitis?"},
{text:"output:Antibiotics like amoxicillin are often prescribed. Decongestants and nasal irrigation can provide relief."},

{text:"input:Medication for anxiety?"},
{text:"output:Benzodiazepines for short-term relief; SSRIs like sertraline or fluoxetine for long-term management."},

{text:"input:Suggest pain relief for arthritis"},
{text:"output:Over-the-counter NSAIDs like ibuprofen or naproxen. For severe cases, consider DMARDs or biologics."},

{text:"input:Best option for acid reflux?"},
{text:"output:Antacids for quick relief, H2 blockers like ranitidine, or PPIs such as omeprazole for long-term control."},

{text:"input:Treatment for insomnia?"},
{text:"output:Melatonin or antihistamines like diphenhydramine for short-term use. Cognitive behavioral therapy is preferred long-term."},

{text:"input:Medication for ADHD?"},
{text:"output:Stimulants like methylphenidate or amphetamines. Non-stimulants such as atomoxetine are alternatives."},

{text:"input:Suggest medication for diabetes management"},
{text:"output:Metformin is a first-line option. For advanced cases, consider insulin or GLP-1 receptor agonists."},

{text:"input:Treatment for asthma attacks?"},
{text:"output:Short-acting beta-agonists like albuterol for immediate relief. Inhaled corticosteroids for long-term management."},

{text:"input:Recommend something for constipation"},
{text:"output:Fiber supplements or stool softeners like docusate. Osmotic laxatives such as polyethylene glycol can also help."},

{text:"input:How to manage chronic pain?"},
{text:"output:Consider NSAIDs, acetaminophen, or opioids for severe cases. Physical therapy and cognitive behavioral therapy are beneficial."},

{text:"input:Best medication for depression?"},
{text:"output:SSRIs such as sertraline, fluoxetine, or SNRIs like venlafaxine. Bupropion is also an option."},

{text:"input:How to treat a urinary tract infection?"},
{text:"output:Antibiotics like nitrofurantoin, trimethoprim-sulfamethoxazole, or ciprofloxacin depending on severity."},

{text:"input:What to use for muscle spasms?"},
{text:"output:Muscle relaxants such as cyclobenzaprine or methocarbamol. NSAIDs can also help reduce pain."},

{text:"input:Medication for nausea?"},
{text:"output:Antiemetics like ondansetron or metoclopramide. Ginger or peppermint can provide natural relief."},

{text:"input:How to manage cholesterol?"},
{text:"output:Statins like atorvastatin or simvastatin are common. Lifestyle changes including diet and exercise are critical."},

{text:"input:Best option for skin infections?"},
{text:"output:Topical antibiotics like mupirocin or oral antibiotics such as cephalexin depending on severity."},

{text:"input:What to give for an allergic reaction?"},
{text:"output:Antihistamines like diphenhydramine for mild reactions. Epinephrine injection for severe anaphylaxis."},

{text:"input:Suggest treatment for psoriasis"},
{text:"output:Topical corticosteroids, vitamin D analogs, or biologics for severe cases like adalimumab."},

{text:"input:How to handle opioid withdrawal?"},
{text:"output:Methadone or buprenorphine for detox. Clonidine can help with withdrawal symptoms."},

{text:"input:Medication for erectile dysfunction?"},
{text:"output:Phosphodiesterase inhibitors like sildenafil or tadalafil."},

{text:"input:What to take for joint inflammation?"},
{text:"output:NSAIDs such as ibuprofen or naproxen. Corticosteroid injections can be effective for severe cases."},

{text:"input:How to treat a sore throat?"},
{text:"output:Saltwater gargle, lozenges, and pain relievers like acetaminophen. Antibiotics if it's bacterial."},

{text:"input:Best medication for a fungal infection?"},
{text:"output:Topical antifungals like clotrimazole or oral options such as fluconazole for systemic infections."},

{text:"input:What to use for diarrhea?"},
{text:"output:Loperamide for symptom relief. Stay hydrated with oral rehydration solutions."},

{text:"input:Treatment for bipolar disorder?"},
{text:"output:Mood stabilizers like lithium or anticonvulsants such as valproate. Antipsychotics for acute manic episodes."},

{text:"input:Best medication for epilepsy?"},
{text:"output:Anticonvulsants like valproic acid, carbamazepine, or newer options like levetiracetam."},

{text:"input:How to manage GERD?"},
{text:"output:Proton pump inhibitors such as omeprazole or H2 receptor blockers like famotidine."},

{text:"input:Medication for schizophrenia?"},
{text:"output:Antipsychotics like risperidone, olanzapine, or aripiprazole are commonly used."},

{text:"input:Suggest medication for Parkinson’s disease"},
{text:"output:Levodopa with carbidopa is a primary treatment. Dopamine agonists like pramipexole are alternatives."},

{text:"input:How to relieve toothache?"},
{text:"output:Over-the-counter pain relievers like ibuprofen. Topical anesthetics containing benzocaine for temporary relief."},

{text:"input:Best treatment for anemia?"},
{text:"output:Iron supplements for iron-deficiency anemia. Vitamin B12 injections for pernicious anemia."},

{text:"input:How to treat a yeast infection?"},
{text:"output:Antifungal medications like fluconazole or topical agents such as clotrimazole."},

{text:"input:Medication for a fever?"},
{text:"output:Antipyretics like acetaminophen or ibuprofen to reduce fever."},

{text:"input:Best option for COPD?"},
{text:"output:Bronchodilators such as albuterol or tiotropium. Inhaled corticosteroids for frequent exacerbations."},

{text:"input:How to treat a skin rash?"},
{text:"output:Topical corticosteroids or antihistamines for itching. Antifungal creams if it’s a fungal infection."},

{text:"input:Recommend something for quitting smoking"},
{text:"output:Nicotine replacement therapy (NRT), bupropion, or varenicline."},

{text:"input:Best medication for the flu?"},
{text:"output:Antivirals like oseltamivir for early treatment. Supportive care includes rest and hydration."},

{text:"input:What to take for a migraine with aura?"},
{text:"output:Triptans such as sumatriptan or ergotamine-based medications."},

{text:"input:How to manage menopause symptoms?"},
{text:"output:Hormone replacement therapy (HRT), SSRIs for mood, and calcium for bone health."},

{text:"input:Best treatment for eczema?"},
{text:"output:Topical corticosteroids, emollients, and antihistamines for itching relief."},

{text:"input:How to manage hypothyroidism?"},
{text:"output:Levothyroxine is the standard treatment."},

{text:"input:Suggest medication for gout?"},
{text:"output:NSAIDs like indomethacin, corticosteroids, or colchicine for acute flare-ups."},

{text:"input:Treatment for allergic rhinitis?"},
{text:"output:Antihistamines, intranasal corticosteroids, and decongestants."},

{text:"input:How to manage chronic fatigue?"},
{text:"output:Focus on lifestyle modifications, sleep hygiene, and graded exercise therapy. Medications like SSRIs may help."},

{text:"input:Best medication for osteoporosis?"},
{text:"output:Bisphosphonates like alendronate or denosumab. Calcium and vitamin D supplements are essential."},

{text:"input:How to treat an ear infection?"},
{text:"output:Amoxicillin for bacterial infections. Analgesics for pain relief."},

{text:"input:Recommend treatment for scabies"},
{text:"output:Topical permethrin or oral ivermectin for severe cases."},
{text:"input:Tell me about paracetamol"},
{text:"output:Paracetamol is a pain reliever and fever reducer commonly used for headaches, muscle aches, and fever."},

{text:"input:Give side effects of ibuprofen"},
{text:"output:Common side effects include stomach pain, nausea, and heartburn. Long-term use may increase the risk of ulcers."},

{text:"input:What is amoxicillin used for?"},
{text:"output:Amoxicillin is used to treat bacterial infections like sinusitis, bronchitis, and urinary tract infections."},

{text:"input:Tell me about metformin"},
{text:"output:Metformin is an oral medication used to manage type 2 diabetes by reducing blood sugar production in the liver."},

{text:"input:Side effects of aspirin"},
{text:"output:Side effects include stomach irritation, bleeding, and increased risk of ulcers. It may also cause allergic reactions."},

{text:"input:What is atorvastatin used for?"},
{text:"output:Atorvastatin is used to lower cholesterol levels and reduce the risk of heart disease and stroke."},

{text:"input:Tell me about prednisone"},
{text:"output:Prednisone is a corticosteroid used to treat inflammation, allergies, and autoimmune conditions like arthritis."},

{text:"input:Give side effects of tramadol"},
{text:"output:Common side effects include dizziness, nausea, and constipation. It may also cause drowsiness and dependency."},

{text:"input:What is omeprazole used for?"},
{text:"output:Omeprazole is used to treat GERD, stomach ulcers, and acid reflux by reducing stomach acid production."},

{text:"input:Tell me about furosemide"},
{text:"output:Furosemide is a diuretic used to treat fluid retention (edema) and high blood pressure by promoting urine output."},

{text:"input:Side effects of metoprolol"},
{text:"output:Side effects include dizziness, fatigue, and slow heart rate. It may also cause shortness of breath."},

{text:"input:What is clopidogrel used for?"},
{text:"output:Clopidogrel is an antiplatelet medication used to prevent blood clots in patients with heart disease or stroke."},

{text:"input:Tell me about albuterol"},
{text:"output:Albuterol is a bronchodilator used to relieve symptoms of asthma, bronchitis, and other breathing disorders."},

{text:"input:Side effects of lisinopril"},
{text:"output:Side effects include dry cough, dizziness, and high potassium levels. Rarely, it may cause angioedema."},

{text:"input:What is gabapentin used for?"},
{text:"output:Gabapentin is used to treat nerve pain, seizures, and sometimes prescribed for anxiety or migraine prevention."},

{text:"input:Tell me about warfarin"},
{text:"output:Warfarin is an anticoagulant used to prevent blood clots in conditions like deep vein thrombosis or atrial fibrillation."},

{text:"input:Give side effects of sertraline"},
{text:"output:Common side effects include nausea, insomnia, and dizziness. It may also cause sexual dysfunction."},

{text:"input:What is levothyroxine used for?"},
{text:"output:Levothyroxine is used to treat hypothyroidism by replacing the hormone thyroxine."},

{text:"input:Tell me about insulin"},
{text:"output:Insulin is used to manage blood sugar levels in patients with type 1 or type 2 diabetes."},

{text:"input:Side effects of hydrochlorothiazide"},
{text:"output:Side effects include dizziness, frequent urination, and electrolyte imbalance, particularly low potassium."},

{text:"input:What is duloxetine used for?"},
{text:"output:Duloxetine is used to treat depression, anxiety, and chronic pain conditions such as fibromyalgia."},

{text:"input:Tell me about loratadine"},
{text:"output:Loratadine is an antihistamine used to relieve allergy symptoms like runny nose, sneezing, and itching."},

{text:"input:Side effects of atenolol"},
{text:"output:Side effects include fatigue, dizziness, and slow heart rate. It may also cause cold extremities."},

{text:"input:What is montelukast used for?"},
{text:"output:Montelukast is used to manage asthma and prevent allergy-related breathing difficulties."},

{text:"input:Tell me about clindamycin"},
{text:"output:Clindamycin is an antibiotic used for bacterial infections like skin infections, bone infections, and dental infections."},

{text:"input:Side effects of naproxen"},
{text:"output:Common side effects include stomach pain, heartburn, and nausea. Long-term use may cause ulcers."},

{text:"input:What is propranolol used for?"},
{text:"output:Propranolol is used to treat high blood pressure, anxiety, migraines, and tremors."},

{text:"input:Tell me about cetirizine"},
{text:"output:Cetirizine is an antihistamine used to relieve allergy symptoms like hay fever and chronic hives."},

{text:"input:Side effects of escitalopram"},
{text:"output:Side effects include nausea, drowsiness, and sexual dysfunction. It may also cause dizziness."},

{text:"input:What is spironolactone used for?"},
{text:"output:Spironolactone is a diuretic used to treat fluid retention, high blood pressure, and hormonal acne."},

{text:"input:Tell me about fluconazole"},
{text:"output:Fluconazole is an antifungal medication used to treat yeast infections, including candidiasis."},

{text:"input:Side effects of simvastatin"},
{text:"output:Side effects include muscle pain, digestive issues, and elevated liver enzymes. Rarely, it may cause rhabdomyolysis."},

{text:"input:What is bupropion used for?"},
{text:"output:Bupropion is used for depression, seasonal affective disorder, and smoking cessation."},

{text:"input:Tell me about diphenhydramine"},
{text:"output:Diphenhydramine is an antihistamine used to treat allergies, insomnia, and motion sickness."},

{text:"input:Side effects of ciprofloxacin"},
{text:"output:Common side effects include nausea, diarrhea, and dizziness. Rarely, it can cause tendon rupture."},

{text:"input:What is ramipril used for?"},
{text:"output:Ramipril is used to treat high blood pressure, heart failure, and to prevent cardiovascular events."},

{text:"input:Tell me about zolpidem"},
{text:"output:Zolpidem is a sedative used to treat insomnia by helping people fall asleep faster."},

{text:"input:Side effects of allopurinol"},
{text:"output:Side effects include skin rash, nausea, and drowsiness. It may also cause liver enzyme elevation."},

{text:"input:What is lamotrigine used for?"},
{text:"output:Lamotrigine is used to treat epilepsy and bipolar disorder by stabilizing mood and preventing seizures."},

{text:"input:Tell me about nortriptyline"},
{text:"output:Nortriptyline is a tricyclic antidepressant used for depression and nerve pain management."},

{text:"input:Side effects of tamsulosin"},
{text:"output:Common side effects include dizziness, headache, and nasal congestion. It may also cause ejaculation issues."},

{text:"input:What is methotrexate used for?"},
{text:"output:Methotrexate is used to treat autoimmune conditions like rheumatoid arthritis and psoriasis."},

{text:"input:Tell me about venlafaxine"},
{text:"output:Venlafaxine is an SNRI antidepressant used for depression, anxiety, and panic disorder."},

{text:"input:Side effects of valproic acid"},
{text:"output:Side effects include weight gain, tremor, and drowsiness. It may also cause liver toxicity."}


                
        ];

        // Add previous conversation context
        this.conversationHistory.forEach(entry => {
            parts.push({
                text: `${entry.role}: ${entry.message}`
            });
        });

        // Add current user message
        parts.push({
            text: `user: ${userMessage}`
        });

        // Add instruction to maintain context
        parts.push({
            text: "Respond based on the entire conversation history above."
        });

        return parts;
    }

    addToConversationHistory(role, message) {
        // Add new message to history
        this.conversationHistory.push({ role, message });

        // Trim history to max length
        if (this.conversationHistory.length > this.maxHistoryLength) {
            this.conversationHistory.shift();
        }
    }

    formatResponse(response) {
        // Optional: Add any response formatting or cleaning
        return response.trim();
    }

    addMessageToChatBox(message, type) {
        const messageElement = document.createElement('p');
        messageElement.classList.add(...type.split(' '));
        messageElement.textContent = message;
        this.chatBox.appendChild(messageElement);
        
        // Scroll to bottom of chat box
        this.chatBox.scrollTop = this.chatBox.scrollHeight;
    }

    removePreviousMessage() {
        const lastMessage = this.chatBox.lastElementChild;
        if (lastMessage && (lastMessage.classList.contains('loading') || lastMessage.classList.contains('bot-message'))) {
            this.chatBox.removeChild(lastMessage);
        }
    }

    // Static method to initialize the app
    static initialize(apiKey) {
        try {
            return new ContextAwareChatApp(apiKey);
        } catch (error) {
            console.error('Failed to initialize chat app:', error);
        }
    }
}

// Usage
document.addEventListener('DOMContentLoaded', () => {
    // Replace with your actual API key
    const API_KEY = 'AIzaSyCvr680JIIi69GsPVTbxahRH7c1xANdjjc';
    
    // Initialize the chat app
    ContextAwareChatApp.initialize(API_KEY);
});