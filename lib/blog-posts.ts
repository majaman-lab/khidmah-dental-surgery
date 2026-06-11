export type BlogCategory =
  | "Root Canal"
  | "Scaling"
  | "Cosmetic Dentistry"
  | "Braces"
  | "Dental Tips";

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  publishedAt: string;
  readTime: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  sections: Array<{
    heading: string;
    body: string;
  }>;
};

export const blogCategories: BlogCategory[] = [
  "Root Canal",
  "Scaling",
  "Cosmetic Dentistry",
  "Braces",
  "Dental Tips",
];

export const blogPosts: BlogPost[] = [
  {
    slug: "when-do-you-need-root-canal-treatment",
    title: "When Do You Need Root Canal Treatment?",
    excerpt:
      "Common signs that a painful or infected tooth may need root canal treatment and why early consultation matters.",
    category: "Root Canal",
    publishedAt: "2026-06-11",
    readTime: "4 min read",
    metaTitle: "When Do You Need Root Canal Treatment? | Khidmah Dental Surgery",
    metaDescription:
      "Learn common signs that may require root canal treatment from Khidmah Dental Surgery, Beanibazar.",
    intro:
      "Root canal treatment can help save a natural tooth when the inner pulp becomes infected or inflamed. A timely consultation helps reduce pain and avoid further complications.",
    sections: [
      {
        heading: "Warning signs to notice",
        body: "Lingering tooth pain, sensitivity to hot or cold, swelling, gum tenderness, or pain while chewing can indicate a deeper tooth problem. These symptoms should be checked by a dentist before they worsen.",
      },
      {
        heading: "Why early care helps",
        body: "Early diagnosis gives the doctor more options to preserve natural tooth structure. Waiting too long may increase infection risk or make treatment more complex.",
      },
      {
        heading: "What happens at consultation",
        body: "Dr. Md. Iqbal Hossain examines the tooth, discusses symptoms, and explains whether root canal treatment or another option is suitable.",
      },
    ],
  },
  {
    slug: "scaling-polishing-for-healthier-gums",
    title: "Scaling & Polishing for Healthier Gums",
    excerpt:
      "How professional cleaning supports gum health, reduces tartar, and keeps your smile feeling fresh.",
    category: "Scaling",
    publishedAt: "2026-06-11",
    readTime: "3 min read",
    metaTitle: "Scaling & Polishing for Healthier Gums | Khidmah Dental Surgery",
    metaDescription:
      "Understand how scaling and polishing help gum health, tartar control, and fresher breath in Beanibazar.",
    intro:
      "Scaling and polishing removes tartar and surface deposits that daily brushing cannot fully clear. It is one of the simplest ways to support long-term gum health.",
    sections: [
      {
        heading: "What scaling removes",
        body: "Scaling removes hardened plaque, known as tartar, from tooth surfaces and around the gumline. This helps reduce irritation and supports cleaner gums.",
      },
      {
        heading: "What polishing does",
        body: "Polishing smooths tooth surfaces and can reduce some external stains. It leaves the mouth feeling cleaner and fresher.",
      },
      {
        heading: "How often should you visit",
        body: "Many patients benefit from routine cleaning every six months, but the right schedule depends on your gum condition and tartar buildup.",
      },
    ],
  },
  {
    slug: "cosmetic-filling-for-front-teeth",
    title: "Cosmetic Filling for Front Teeth",
    excerpt:
      "A simple guide to tooth-colored fillings for chips, small gaps, decay, and visible smile-area repair.",
    category: "Cosmetic Dentistry",
    publishedAt: "2026-06-11",
    readTime: "4 min read",
    metaTitle: "Cosmetic Filling for Front Teeth | Khidmah Dental Surgery",
    metaDescription:
      "Learn how cosmetic tooth-colored filling can repair chips, decay, and smile-area concerns at Khidmah Dental Surgery.",
    intro:
      "Cosmetic fillings are designed to restore tooth structure while blending with your natural tooth shade. They are often used in visible smile areas.",
    sections: [
      {
        heading: "When cosmetic filling helps",
        body: "Small chips, cavities, worn edges, and minor visible defects can often be improved with tooth-colored filling material after a clinical check.",
      },
      {
        heading: "Appearance and shade",
        body: "The dentist selects a shade that aims to match the surrounding tooth color so the restoration looks natural in everyday conversation.",
      },
      {
        heading: "Care after treatment",
        body: "Good brushing, avoiding hard biting on the restored edge, and routine dental review can help maintain the filling.",
      },
    ],
  },
  {
    slug: "braces-consultation-what-to-expect",
    title: "Braces Consultation: What to Expect",
    excerpt:
      "What happens during a braces consultation for crowding, spacing, bite concerns, and smile planning.",
    category: "Braces",
    publishedAt: "2026-06-11",
    readTime: "4 min read",
    metaTitle: "Braces Consultation: What to Expect | Khidmah Dental Surgery",
    metaDescription:
      "Understand what to expect during a braces consultation in Beanibazar at Khidmah Dental Surgery.",
    intro:
      "A braces consultation helps identify whether alignment, spacing, crowding, or bite concerns need orthodontic planning.",
    sections: [
      {
        heading: "The first assessment",
        body: "The dentist checks tooth position, bite relationship, spacing, crowding, and your main smile concerns.",
      },
      {
        heading: "Treatment planning",
        body: "Depending on the case, further records or specialist planning may be recommended before beginning orthodontic treatment.",
      },
      {
        heading: "Adults can ask too",
        body: "Braces and alignment consultations are not only for children. Adults can also discuss smile and bite improvement options.",
      },
    ],
  },
  {
    slug: "daily-dental-tips-for-families",
    title: "Daily Dental Tips for Families",
    excerpt:
      "Practical home-care habits for healthier teeth, fresher breath, and fewer urgent dental visits.",
    category: "Dental Tips",
    publishedAt: "2026-06-11",
    readTime: "3 min read",
    metaTitle: "Daily Dental Tips for Families | Khidmah Dental Surgery",
    metaDescription:
      "Simple daily dental care tips from Khidmah Dental Surgery for families in Beanibazar and Sylhet.",
    intro:
      "Good dental habits at home can prevent many common problems. Small daily steps often make the biggest long-term difference.",
    sections: [
      {
        heading: "Brush with attention",
        body: "Brush twice daily for around two minutes, especially before sleeping. Focus on the gumline and back teeth, not only the front smile area.",
      },
      {
        heading: "Control sweet snacks",
        body: "Frequent sugary snacks and drinks increase cavity risk. Try to keep sweets with meals rather than many times throughout the day.",
      },
      {
        heading: "Do not ignore pain",
        body: "Dental pain usually has a cause. Early consultation can make treatment simpler and more comfortable.",
      },
    ],
  },
];

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
