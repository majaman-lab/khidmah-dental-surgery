export type ServicePage = {
  slug: string;
  title: string;
  shortTitle: string;
  metaTitle: string;
  metaDescription: string;
  overview: string;
  benefits: string[];
  steps: string[];
  faqs: Array<{
    question: string;
    answer: string;
  }>;
};

export const servicePages: ServicePage[] = [
  {
    slug: "root-canal-treatment",
    title: "Root Canal Treatment in Beanibazar",
    shortTitle: "Root Canal Treatment",
    metaTitle: "Root Canal Treatment in Beanibazar | Khidmah Dental Surgery",
    metaDescription:
      "Root canal treatment by Dr. Md. Iqbal Hossain at Khidmah Dental Surgery, Beanibazar. Save painful or infected teeth with personal dental care.",
    overview:
      "Root canal treatment is used when the inner part of a tooth becomes infected or inflamed. At Khidmah Dental Surgery, Dr. Md. Iqbal Hossain focuses on relieving pain, preserving the natural tooth when possible, and explaining each step before treatment begins.",
    benefits: [
      "Helps save the natural tooth",
      "Relieves tooth pain from infection",
      "Prevents infection from spreading",
      "Restores chewing comfort",
      "Supports long-term oral health",
    ],
    steps: [
      "Clinical consultation and tooth assessment",
      "X-ray or diagnostic review if needed",
      "Cleaning the infected canal area",
      "Sealing the treated tooth",
      "Restoration planning for strength and protection",
    ],
    faqs: [
      {
        question: "When do I need root canal treatment?",
        answer:
          "You may need root canal treatment if a tooth has deep decay, lingering pain, swelling, or infection. A consultation is needed to confirm the right treatment.",
      },
      {
        question: "Is root canal treatment painful?",
        answer:
          "The goal is to reduce pain caused by infection. The doctor will explain comfort steps before starting treatment.",
      },
      {
        question: "Can the tooth be saved?",
        answer:
          "Many infected teeth can be saved with proper root canal treatment and restoration, but the final decision depends on the tooth condition.",
      },
    ],
  },
  {
    slug: "scaling-polishing",
    title: "Scaling & Polishing in Beanibazar",
    shortTitle: "Scaling & Polishing",
    metaTitle: "Scaling & Polishing in Beanibazar | Khidmah Dental Surgery",
    metaDescription:
      "Professional scaling and polishing at Khidmah Dental Surgery, Beanibazar. Gentle cleaning for gum health, stains, and fresher breath.",
    overview:
      "Scaling and polishing removes plaque, tartar, and surface stains that regular brushing cannot fully clean. It is a preventive treatment that supports gum health and keeps your smile feeling fresh.",
    benefits: [
      "Removes tartar buildup",
      "Supports healthier gums",
      "Helps reduce bad breath",
      "Improves surface stains",
      "Keeps routine dental care on track",
    ],
    steps: [
      "Gum and tooth condition check",
      "Tartar removal from tooth surfaces",
      "Cleaning around gumline areas",
      "Polishing visible tooth surfaces",
      "Home-care advice for maintenance",
    ],
    faqs: [
      {
        question: "How often should I do scaling?",
        answer:
          "Many patients benefit from routine scaling every six months, but the ideal timing depends on gum condition and tartar buildup.",
      },
      {
        question: "Does scaling damage teeth?",
        answer:
          "Professional scaling is designed to clean deposits from teeth. The doctor can explain the process before treatment.",
      },
      {
        question: "Will polishing whiten my teeth?",
        answer:
          "Polishing can remove some surface stains, but it is different from whitening treatment.",
      },
    ],
  },
  {
    slug: "cosmetic-filling",
    title: "Cosmetic Filling in Beanibazar",
    shortTitle: "Cosmetic Filling",
    metaTitle: "Cosmetic Filling in Beanibazar | Khidmah Dental Surgery",
    metaDescription:
      "Cosmetic tooth-colored filling by Dr. Md. Iqbal Hossain in Beanibazar for cavities, chips, and visible smile-area restoration.",
    overview:
      "Cosmetic filling restores damaged or decayed tooth structure with tooth-colored material. It is commonly used for cavities, chipped edges, small gaps, and visible areas where appearance matters.",
    benefits: [
      "Tooth-colored appearance",
      "Repairs cavities and chips",
      "Preserves healthy tooth structure",
      "Improves smile confidence",
      "Can often be completed efficiently",
    ],
    steps: [
      "Tooth assessment and shade planning",
      "Cleaning the affected area",
      "Placing tooth-colored filling material",
      "Shaping for bite and appearance",
      "Polishing the final restoration",
    ],
    faqs: [
      {
        question: "Is cosmetic filling visible?",
        answer:
          "The material is selected to blend with the natural tooth shade as closely as possible.",
      },
      {
        question: "How long does a filling last?",
        answer:
          "Longevity depends on tooth condition, bite pressure, oral hygiene, and regular checkups.",
      },
      {
        question: "Can cosmetic filling fix a chipped tooth?",
        answer:
          "Small chips can often be repaired with cosmetic filling after the doctor checks the tooth.",
      },
    ],
  },
  {
    slug: "crown-bridge",
    title: "Crown & Bridge in Beanibazar",
    shortTitle: "Crown & Bridge",
    metaTitle: "Crown & Bridge in Beanibazar | Khidmah Dental Surgery",
    metaDescription:
      "Crown and bridge consultation at Khidmah Dental Surgery, Beanibazar for damaged, weak, or missing teeth.",
    overview:
      "Crowns and bridges help restore strength, function, and appearance when teeth are damaged, weakened, or missing. Dr. Md. Iqbal Hossain provides practical guidance based on tooth condition and patient needs.",
    benefits: [
      "Restores chewing function",
      "Protects weak or treated teeth",
      "Improves tooth appearance",
      "Helps replace missing teeth",
      "Supports a more complete smile",
    ],
    steps: [
      "Consultation and oral assessment",
      "Treatment option explanation",
      "Tooth preparation or impression planning",
      "Trial, fit, and bite evaluation",
      "Final placement and care guidance",
    ],
    faqs: [
      {
        question: "When is a crown needed?",
        answer:
          "A crown may be recommended for a weak, cracked, heavily filled, or root canal treated tooth.",
      },
      {
        question: "What is a bridge used for?",
        answer:
          "A bridge can replace one or more missing teeth by using support from neighboring teeth.",
      },
      {
        question: "Will it look natural?",
        answer:
          "The doctor will discuss shade, shape, and material options based on your case.",
      },
    ],
  },
  {
    slug: "braces-consultation",
    title: "Braces Consultation in Beanibazar",
    shortTitle: "Braces Consultation",
    metaTitle: "Braces Consultation in Beanibazar | Khidmah Dental Surgery",
    metaDescription:
      "Braces consultation in Beanibazar for alignment, bite, spacing, and smile planning at Khidmah Dental Surgery.",
    overview:
      "A braces consultation helps evaluate tooth alignment, bite relationship, spacing, crowding, and smile goals. The consultation focuses on whether orthodontic care is suitable and what next steps may be needed.",
    benefits: [
      "Checks alignment and bite concerns",
      "Helps plan long-term smile improvement",
      "Explains suitable treatment options",
      "Identifies spacing or crowding issues",
      "Supports informed decision-making",
    ],
    steps: [
      "Smile and bite assessment",
      "Discussion of alignment concerns",
      "Clinical examination",
      "Treatment option guidance",
      "Referral or planning if advanced care is needed",
    ],
    faqs: [
      {
        question: "Who should consider braces consultation?",
        answer:
          "Patients with crowding, spacing, crooked teeth, or bite concerns can book a consultation.",
      },
      {
        question: "Is consultation enough to start braces?",
        answer:
          "The consultation is the first step. Further records or specialist planning may be needed depending on the case.",
      },
      {
        question: "Can adults ask about braces?",
        answer:
          "Yes. Adults can consult about alignment and smile improvement options.",
      },
    ],
  },
  {
    slug: "smile-enhancement",
    title: "Smile Enhancement in Beanibazar",
    shortTitle: "Smile Enhancement",
    metaTitle: "Smile Enhancement in Beanibazar | Khidmah Dental Surgery",
    metaDescription:
      "Smile enhancement consultation by Dr. Md. Iqbal Hossain in Beanibazar for cosmetic filling, cleaning, restoration, and smile confidence.",
    overview:
      "Smile enhancement begins with understanding your concerns and dental condition. It may include cleaning, cosmetic filling, restorative guidance, or other treatment planning to improve smile confidence while protecting oral health.",
    benefits: [
      "Improves smile confidence",
      "Personalized to your dental condition",
      "Can combine multiple simple treatments",
      "Focuses on healthy aesthetics",
      "Clear explanation before treatment",
    ],
    steps: [
      "Smile concern discussion",
      "Tooth and gum assessment",
      "Treatment option planning",
      "Prioritizing health and appearance",
      "Appointment scheduling for selected care",
    ],
    faqs: [
      {
        question: "What does smile enhancement include?",
        answer:
          "It may include cleaning, cosmetic filling, restoration, or planning depending on your smile goals and oral condition.",
      },
      {
        question: "Do I need multiple visits?",
        answer:
          "Some improvements may be completed quickly, while others need staged appointments.",
      },
      {
        question: "Will the doctor explain options first?",
        answer:
          "Yes. Treatment options and priorities are explained before care begins.",
      },
    ],
  },
];

export function getServicePage(slug: string) {
  return servicePages.find((service) => service.slug === slug);
}
