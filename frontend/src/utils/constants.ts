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

export const textContents: string[] = [
  "Text content from LLM",
  "Another LLM text content",
];
