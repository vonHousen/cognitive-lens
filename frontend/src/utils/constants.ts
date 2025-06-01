export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}

// Use fixed timestamps instead of dynamic Date.now()
const baseTime = new Date('2024-03-15T10:00:00Z'); // Fixed base time

export const messagesStarter: Message[] = [
  {
    role: 'assistant' as const,
    content: 'Hi, tell me about yourself.',
  },
];

export interface SOAPData {
  patientInfo: string; // General patient information
  S: string; // Subjective
  O: string; // Objective
  A: string; // Assessment
  P: string; // Plan
}

// Keep these for the simplified structure:
export const soapContentStarter: SOAPData = {
  patientInfo: "",
  S: "",
  O: "",
  A: "",
  P: ""
};

export const soapMassiveContentStarter: SOAPData = {
  patientInfo: "Patient: John Doe, Age: 45, DOB: 01/15/1979, MRN: 123456789, Insurance: Blue Cross Blue Shield, Emergency Contact: Jane Doe (Wife) - (555) 123-4567, Allergies: Penicillin (rash), Latex (contact dermatitis), Current Medications: Lisinopril 10mg daily, Metformin 500mg twice daily, Atorvastatin 20mg nightly",
  S: "Patient presents with chief complaint of chest pain that started 3 hours ago. Describes pain as sharp, stabbing, 7/10 intensity, located in left chest area. Pain is worse with deep inspiration and movement. Reports associated shortness of breath and mild nausea. Denies fever, chills, sweating, or radiation of pain to arms or jaw. No recent trauma or heavy lifting. Has history of hypertension and diabetes mellitus type 2, both well-controlled. No recent changes to medications. Reports compliance with current medications. Denies recent travel, prolonged immobilization, or leg swelling.",
  O: "Vital Signs: Temperature 98.6°F, Blood Pressure 142/88 mmHg, Heart Rate 88 bpm, Respiratory Rate 18, Oxygen Saturation 98% on room air. General Appearance: Alert, oriented, appears uncomfortable but in no acute distress. HEENT: Normocephalic, atraumatic, pupils equal and reactive, no JVD. Cardiovascular: Regular rate and rhythm, no murmurs, rubs, or gallops. S1 and S2 present. Lungs: Clear to auscultation bilaterally, no wheezes, rales, or rhonchi. Good air movement throughout. Abdomen: Soft, non-tender, non-distended, bowel sounds present. Extremities: No edema, good pulses, no calf tenderness. Neurological: Alert and oriented x3, no focal deficits.",
  A: "45-year-old male with acute onset chest pain, most consistent with musculoskeletal chest pain given pleuritic nature and absence of cardiac risk factors in presentation. Differential diagnosis includes costochondritis, intercostal muscle strain, or atypical presentation of cardiac disease. Low suspicion for pulmonary embolism given absence of risk factors and normal oxygen saturation. EKG shows normal sinus rhythm with no acute ST changes. Chest X-ray pending. Given patient's history of hypertension and diabetes, will rule out cardiac etiology with serial cardiac enzymes and monitoring.",
  P: "1. Chest pain workup: Order EKG (completed - normal), chest X-ray, and cardiac enzymes (troponin I). 2. Pain management: Ibuprofen 600mg orally now and then 400mg every 6 hours as needed for pain. 3. Monitor vital signs every 4 hours. 4. NPO until cardiac enzymes result. 5. If cardiac enzymes negative and chest X-ray normal, discharge home with follow-up instructions. 6. Return precautions: Return immediately if chest pain worsens, develops radiation to arms or jaw, experiences shortness of breath, or any concerning symptoms. 7. Follow-up with primary care physician within 1-2 days. 8. Continue home medications as prescribed."
};

export interface ThinkingStep {
  role: string;
  content: string;
}

export interface ThinkingProcessData {
  steps: ThinkingStep[];
}

// Add this constant for initial thinking data
export const thinkingProcessStarter: ThinkingProcessData = {
  steps: []
};

// Add massive thinking data for testing layout
export const thinkingProcessMassive: ThinkingProcessData = {
  steps: [
    {
      role: "EXECUTOR",
      content: "{\"respond_to_patient\":\"I'd be happy to write a haiku for you. Here's one:\\n\\nWhispering spring breeze,\\nCherry blossoms gently fall,\\nPeace within my heart.\\n\\nHow does this haiku resonate with you? Would you like to explore writing one together during our session?\"}"
    },
    {
      role: "JUDGE",
      content: "{\"is_task_done_properly\":true,\"feedback\":\"The response effectively fulfills the task by composing an original haiku and inviting the patient to engage collaboratively, which is both thoughtful and creative. The haiku captures a peaceful, evocative scene that can foster reflection, and the invitation to co-create encourages patient involvement—demonstrating flexibility and intuitive communication. To further enhance the creative aspect, you might consider tailoring the haiku more closely to the patient's specific feelings or experiences if known, thereby deepening personal connection.\"}"
    },
    {
      role: "JUDGE",
      content: "{\"is_task_done_properly\":true,\"feedback\":\"The response is appropriate and thoughtful. It addresses the patient's request by providing a haiku and invites further engagement by suggesting collaboration. The tone is gentle and empathetic, which suits a supportive interaction. Well done in balancing creativity and patient involvement.\"}"
    },
    {
      role: "JUDGE",
      content: "{\"is_task_done_properly\":true,\"feedback\":\"Excellent creative response that meets the therapeutic goals. The haiku demonstrates mindfulness and peace, which can be beneficial for patient wellbeing. The invitation for collaboration fosters engagement and empowerment. Consider exploring the patient's emotional response to nature imagery in future sessions.\"}"
    },
    {
      role: "SUPERVISOR",
      content: "The response is appropriate and fulfills the patient's request by providing a well-crafted haiku. It maintains a supportive and engaging tone, inviting the patient to participate further by co-creating a haiku, which is therapeutic and encouraging. Both judges noted the creativity and contextual appropriateness of your reply. Keep encouraging patient involvement and tailoring creative outputs to their experiences when possible."
    }
  ]
};

// Replace textContents with thinking process placeholder
export const thinkingContents: ThinkingStep[] = [
  {
    role: "EXECUTOR",
    content: "Analyzing the user's request and formulating response..."
  },
  {
    role: "JUDGE", 
    content: "Evaluating response quality and accuracy..."
  }
];
