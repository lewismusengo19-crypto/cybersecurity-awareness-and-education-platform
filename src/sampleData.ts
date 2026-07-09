import { VideoContent, ImageContent, PDFMaterial, Quiz, FAQItem } from './types';

export const SAMPLE_VIDEOS: VideoContent[] = [
  {
    id: 'vid-whatsapp-scam-lewis',
    title_en: 'Spotting Malicious Links: Zambia Relief Fund Scam',
    title_bm: 'Ukwishiba ama Links ya Bufi: Zambia Relief Fund Scam',
    description_en: 'Demonstration by Lewis Musengo on how to analyze a suspicious WhatsApp forward claiming to offer K10,000 government grants. Learn how to identify malicious "http" URLs.',
    description_bm: 'Icilondolozo kuli Lewis Musengo pa fyo mwingasanga link ya bufi pa WhatsApp ilepanga K10,000 ukufuma ku buteko. Sambilileni ukwishiba ama link ya bufi aya "http".',
    url: '/uploads/videos/whatsapp_scam_lewis.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=600&q=80',
    duration: '04:09',
    views: 125,
    downloads: 45,
    createdAt: '2026-07-07T11:53:00Z'
  },
  {
    id: 'vid-momo-sec',
    title_en: 'Protecting Your Mobile Money (MoMo) Wallet',
    title_bm: 'Ukuicingilila Kuli Ifya Kufumya Imparian ya pa Foni (MoMo)',
    description_en: 'Learn how to secure your MTN and Airtel Mobile Money wallets from common social engineering scams in Zambia. Never share your 4-digit PIN with anyone, even those claiming to be agents.',
    description_bm: 'Sambilileni ifyo mwingasunga imparian ya pa foni yenu (MTN na Airtel) ukuti mwilasenda kuli bampulamafunde aba bufi. Mwilaeba umuntu uuli onse inshila yenu iya kufisa (PIN), nangu fye abaicefya ukuti bamebenshi.',
    url: '/uploads/videos/momo_safety.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1563013544-824ae1d704d3?auto=format&fit=crop&w=600&q=80',
    duration: '03:45',
    views: 342,
    downloads: 124,
    createdAt: '2026-06-15T10:00:00Z'
  },
  {
    id: 'vid-phishing-intro',
    title_en: 'Recognizing Phishing Attacks',
    title_bm: 'Ukwishiba Amalyashi ya Bufi ya pa Intaneti (Phishing)',
    description_en: 'A comprehensive guide on identifying suspicious links, email scams, and WhatsApp messages that try to steal your personal credentials or Facebook accounts.',
    description_bm: 'Inshila yawama iya kwishibilamo amalyashi ya bufi, amashiku ya bufi, na mauthenga ya WhatsApp aya fwaya ukwiba ifya muli foni yenu nangu Facebook.',
    url: '/uploads/videos/phishing_intro.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
    duration: '05:12',
    views: 215,
    downloads: 87,
    createdAt: '2026-06-20T11:30:00Z'
  },
  {
    id: 'vid-password-strength',
    title_en: 'Creating Unbreakable Passwords',
    title_bm: 'Ukupanga Ishiwi lya Kufisa Ilya Kosa Icine Cine',
    description_en: 'Ditch simple passwords like "12345" or your birthday. Discover the passphrase method to create highly secure, memorable passwords for all your online profiles.',
    description_bm: 'Lekeni ukubomfya amashiwi ya kwingilila ayafyuka nga "12345" nangu ubushiku mwafyalilwe. Sambilileni inshila isuma iya kupangilamo ishiwi lya kukosa sana.',
    url: '/uploads/videos/passwords.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=600&q=80',
    duration: '04:20',
    views: 189,
    downloads: 54,
    createdAt: '2026-06-25T09:15:00Z'
  }
];

export const SAMPLE_IMAGES: ImageContent[] = [
  {
    id: 'img-whatsapp-grant-scam',
    title_en: 'Zambia Relief Grant Scam: Spotting Link Phishing',
    title_bm: 'Ubufi bwa Zambia Relief Grant: Ukwishiba Links sha Bufi',
    description_en: 'A lesson on identifying fake government grants circulated on WhatsApp. Indicators of fraud include: 1) Insecure HTTP protocol (instead of HTTPS). 2) Generic bit.ly link shorteners which hide the true destination. 3) Grammatical errors ("Zambian will Recieve"). 4) Urgency tactics demanding quick registration and sharing. Authentic government sites always use official .gov.zm domains.',
    description_bm: 'Icisambilisho pa kwishiba ubufi bwa ndalama sha mwalala isha ubuteko ishabipa ishamila pa WhatsApp. Ifishibilo fya ubufi: 1) Ukubomfya link ya "http" mu nshila ya "https". 2) Ama link ya bit.ly ayo bafisa kuli kusebana. 3) Amashiwi ayaipa mu Cingeleshi nga "Recieve". 4) Ubuthenga ubulemupata bwangu bwangu no kwebapo bamebenshi. Amawebusaiti ya buteko lyonse yabomfya ".gov.zm".',
    url: '/uploads/images/whatsapp_grant_scam.jpg',
    views: 185,
    downloads: 62,
    createdAt: '2026-07-08T07:00:00Z'
  },
  {
    id: 'img-momo-redirect-scam',
    title_en: 'Mobile Money Transfer Safety: Avoiding Redirection Tricks',
    title_bm: 'Ukusunga Imparian ya MoMo: Ukusenguka Ukutuma Imparian mu Kushala',
    description_en: 'Analysis of a mobile money redirect SMS scam. Fraudsters send unsolicited messages claiming their Mobile Money network is "not working" and instructing you to send money to a different number/name instead. Always call the recipient on their known, trusted number to verify before transferring, and verify the registered name in the prompt before entering your PIN.',
    description_bm: 'Icilondolozo ca mauthenga ya bufi aya MoMo. Bampulamafunde batuma ubuthenga ati mufwile ukubomfya namba imbi pantu namba yabo ilefilwa ukubomba. Mwilasenda ndalama kuli namba iili yonse ukwabula ukubalila ukulanda nabo pafoni pa namba mwaishiba iya cine. Mukulanda nabo balisuminisha ishina mu foni ninshi mushilasha PIN yenu.',
    url: '/uploads/images/momo_redirect_scam.jpg',
    views: 142,
    downloads: 39,
    createdAt: '2026-07-08T07:01:00Z'
  },
  {
    id: 'img-mineral-fraud-scam',
    title_en: 'Mineral & Red Mercury Fraud: Unmasking Commodity Scams',
    title_bm: 'Ubufi bwa Emerald, Gold na Red Mercury: Ukwishiba Amalonda ya Bufi',
    description_en: 'This Bemba SMS scam targets brokers with fake deals for emeralds, gold, and mythical "Red Mercury." Fraudsters offer a tempting 40% commission to lure you into paying "assay test fees" or "clearance charges" in advance. Remember: "Red Mercury" is a fictional substance. Authentic mineral brokers do not trade via random, unsolicited SMS messages.',
    description_bm: 'Ubu bufi bwa mauthenga ya Bemba bufwaya abakopanyi ba malonda ya fye aya emeralds, gold, na "Red Mercury". Balelaya 40% iya kulipilako fye kukuwamya, pakuti bamulyatilileko ndalama sha advance ukulipila testing fees. Shibukeni: "Red Mercury" mufilwe ukuti taba kwata, kabili taba malonda ba mulingo batumina abantu SMS shafilwa pa Intaneti.',
    url: '/uploads/images/mineral_fraud_scam.jpg',
    views: 120,
    downloads: 48,
    createdAt: '2026-07-08T07:02:00Z'
  },
  {
    id: 'img-momo-rules',
    title_en: 'The Golden Rules of Mobile Money Safety',
    title_bm: 'Ifunde Likalamba Ilya Kusunga Imparian ya pa Foni',
    description_en: 'An infographic summarizing the 3 key rules: 1) Keep your PIN secret, 2) Verify any caller claiming to be a customer care agent, 3) Report fraudulent numbers to ZICTA.',
    description_bm: 'Infographic ilelondola ifunde fitatu ifikalamba: 1) Sungeni PIN yenu mukati, 2) Shininkisheni uulelila foni, 3) Landeni kuli ZICTA nga mwasanga imparian ya bufi.',
    url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
    views: 412,
    downloads: 198,
    createdAt: '2026-06-18T14:00:00Z'
  },
  {
    id: 'img-social-media',
    title_en: 'Securing Your Facebook & WhatsApp',
    title_bm: 'Ukuicingilila muli Facebook na WhatsApp',
    description_en: 'Visual checklist to activate Two-Factor Authentication (2FA) on WhatsApp and Facebook to prevent hackers from hijacking your account and asking your friends for money.',
    description_bm: 'Inshila isuma iya kubomfya Two-Factor Authentication (2FA) pa WhatsApp na Facebook ukuti ifisuma filesungwa bwino, no kuicingilila kuli bashipula.',
    url: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80',
    views: 325,
    downloads: 145,
    createdAt: '2026-06-22T16:45:00Z'
  }
];

export const SAMPLE_PDFS: PDFMaterial[] = [
  {
    id: 'pdf-guide-beginners',
    title_en: 'Zambian Cybersecurity Guide for Beginners',
    title_bm: 'Icitabo ca Kwambika pa Ukuicingilila mu Zambia',
    description_en: 'An easy-to-read PDF handbook detailing common online threats in Zambia, local cyber laws managed by ZICTA, and quick security checkups for personal devices.',
    description_bm: 'Icitabo icanguka ukubelenga icilanda pa fya kofya pa Intaneti mu Zambia, amafunde ya cybereconomy aya ZICTA, na fya kuwamya foni na kompyuta yenu.',
    url: '/uploads/documents/zambian_cybersecurity_guide.pdf',
    downloads: 75,
    createdAt: '2026-06-28T08:00:00Z'
  },
  {
    id: 'pdf-momo-guide',
    title_en: 'Mobile Money Scam Prevention Manual',
    title_bm: 'Icitabo ca Kucingilila Amalyashi ya Bufi ya MoMo',
    description_en: 'A detailed manual co-developed with local experts to help families detect social engineering schemes, fake MTN/Airtel cash messages, and identity theft tricks.',
    description_bm: 'Icitabo icilondola inshila isuma iya kwishibilamo ubufi bwa ndalama sha MoMo na fyakulanda ifya bufi kuli ba MTN na Airtel.',
    url: '/uploads/documents/momo_prevention_manual.pdf',
    downloads: 112,
    createdAt: '2026-07-01T12:00:00Z'
  }
];

export const SAMPLE_QUIZZES: Quiz[] = [
  {
    id: 'quiz-momo',
    title_en: 'Mobile Money Safety Quiz',
    title_bm: 'Icayako ca Imparian ya pa Foni (MoMo)',
    description_en: 'Test your ability to spot mobile money scams, fraudulent calls, and secure your wallet.',
    description_bm: 'Eseni amano yenu pa kwishiba ubufi bwa ndalama sha MoMo na fyakulanda ifya bufi.',
    createdAt: '2026-06-20T10:00:00Z',
    questions: [
      {
        id: 'q1',
        question_en: 'An Airtel or MTN customer representative calls asking for your Mobile Money PIN to fix a network issue. What should you do?',
        question_bm: 'Umuntu uuti abomfya Airtel nangu MTN alemulila foni no kumwipusha PIN yenu iya MoMo ati awamye foni. Kuti mwacitapo shani?',
        options_en: [
          'Give them the PIN since they work for the network provider.',
          'Never give your PIN. Hang up immediately and report the number.',
          'Give them a temporary PIN and change it later.',
          'Ask them to send an SMS verification code instead.'
        ],
        options_bm: [
          'Mubape PIN pantu balebomba mu kampani ya foni.',
          'Mwilaeba umuntu PIN yenu. Shasheni foni bwangu no kulemba foni yabo.',
          'Mubapeko PIN ya kanyense, e lyo mukayafungula mukule.',
          'Balepusheni ukutuma SMS iya kwasuka pakubala.'
        ],
        correctAnswerIndex: 1
      },
      {
        id: 'q2',
        question_en: 'You receive an SMS saying you have won K5,000 on MTN/Airtel promo, but you must first send K200 for "processing fee". Is this real?',
        question_bm: 'Mwapokelela foni nangu SMS ati mwatasha K5,000 muli MTN/Airtel promo, lelo mufwile ukutuma K200 iya "processing". Bushe ca cine?',
        options_en: [
          'Yes, promotions often require small processing fees.',
          'No, it is a scam. Legitimate promotions never ask you to send money to claim prizes.',
          'Yes, if the SMS looks professional and has MTN/Airtel in it.',
          'Maybe, I should send K100 to negotiate the processing fee.'
        ],
        options_bm: [
          'Ee, amapromo yalafwaya kashito ka kwingilila.',
          'Ioo, mufilwe ukwishiba ati bufi. Amapromo ya cine tayaipusha ndalama sha kutuma.',
          'Ee, nga ca kuti SMS ilemoneka iyawama sana na lebelo.',
          'Apo limbi, kuti natumako K100 tubepushe fye.'
        ],
        correctAnswerIndex: 1
      }
    ]
  },
  {
    id: 'quiz-phishing',
    title_en: 'Phishing and Link Security Quiz',
    title_bm: 'Icayako ca Amalyashi ya Bufi na Links sha pa Intaneti',
    description_en: 'Can you tell the difference between a real login page and a scam attempt?',
    description_bm: 'Bushe kuti mwaishiba ubupusano buli pa login page ya cine na bufi bwa fyakubepa?',
    createdAt: '2026-06-24T14:30:00Z',
    questions: [
      {
        id: 'pq1',
        question_en: 'A WhatsApp message claims you can get free internet bundles if you click on "www.zambia-free-bundles.com" and share with 10 groups. Is this safe?',
        question_bm: 'Umuthenga wa WhatsApp uletila kuti mwapokelela bundles sha fye nga mwatinya "www.zambia-free-bundles.com" no kulembela amabumba 10. Bushe nacisuma?',
        options_en: [
          'Yes, free bundles promotions are common.',
          'No, this is phishing or clickbait designed to hack your phone or steal data.',
          'Yes, because my friends sent it to me.',
          'No, but sharing with only 5 groups makes it safe.'
        ],
        options_bm: [
          'Ee, amapromo ya bundles sha fye yalicindama sana.',
          'Ioo, ubu bufi (phishing) ubwapangwa ukwiba ifya muli foni nangu amafoni yenu.',
          'Ee, pantu abanandi bali ntumina.',
          'Ioo, lelo ukutumako amabumba fye yasano (5) kuti casuma.'
        ],
        correctAnswerIndex: 1
      }
    ]
  },
  {
    id: 'quiz-image-scams',
    title_en: 'Social Media & SMS Fraud Quiz',
    title_bm: 'Icayako ca Bufi bwa pa WhatsApp na SMS',
    description_en: 'Test your knowledge on specific WhatsApp and SMS scams circulating in Zambia, including fake grants, MoMo redirections, and mineral frauds.',
    description_bm: 'Eseni amano yenu pa kwishiba ubufi bwa ndalama sha ubuteko, MoMo na malonda ya bufi aya fye.',
    createdAt: '2026-07-08T07:20:00Z',
    questions: [
      {
        id: 'imgq1',
        question_en: 'You see a forwarded WhatsApp message offering a K10,000 "Government of Zambia Support Grant" with a bit.ly link starting with http://. Why is this suspicious?',
        question_bm: 'Mwapokelela ubuthenga bwa WhatsApp ubulelaya K10,000 "Zambia Support Grant" ubukwete bit.ly link iyatampa na http://. Cinshi ubu buthenga bulolela ubwafya?',
        options_en: [
          'It is safe because it is forwarded inside a trusted family group.',
          'It uses an insecure HTTP link, a bit.ly link shortener to hide the real site, contains typos, and authentic government sites must end with .gov.zm.',
          'It is safe because the government uses bit.ly links to save money.',
          'It is safe because it mentions "More than 3 million Zambians will receive it".'
        ],
        options_bm: [
          'Nacisuma pantu bacituminako mwi bumba lya lupwa mwaishiba.',
          'Ilebomfya link ya "http" ishabamo kacingilila, ishiwi lya bit.ly ifisambililo fya ubufi, kabili amawebusaiti ya cine aya buteko lyonse yapwa na ".gov.zm".',
          'Nacisuma pantu ubuteko bulabomfya bit.ly ukusunga ndalama.',
          'Nacisuma pantu balemba ati "abena Zambia abengi bakapokelela ndalama".'
        ],
        correctAnswerIndex: 1
      },
      {
        id: 'imgq2',
        question_en: 'An SMS from an unknown sender says "use this number to send that money... my number is not working in mobile MONEY". What is the correct response?',
        question_bm: 'SMS yafuma kuli namba mushishe iletila: "tumeni ndalama kuli iyi namba... namba yandi tailebomba bwino muli MoMo". Kuti mwacitapo shani?',
        options_en: [
          'Send the money immediately to the new number before they get upset.',
          'Ignore the message. Call the intended recipient on their known, trusted number to verify first. Fraudsters use this "redirect trick" to intercept transfers.',
          'Send half of the money to the new number and half to the old number.',
          'Text the new number back asking for their Mobile Money PIN to verify them.'
        ],
        options_bm: [
          'Tumeni ndalama bwangu kuli iyi namba iupya umushilafiitwa.',
          'Sengukeni ubu buthenga. Balileni ukulanda no mwine pa namba yakwe mwaishiba iya cine ukuti mushininkishe. Bampulamafunde babomfya ubu bufi ukwiba.',
          'Tumeni icaka ca ndalama kuli namba iyupya e lyo icaka kuli namba ya kale.',
          'Tumineni uyo muntu SMS ukumwipusha PIN yakwe iya MoMo ukuti mumwishibe.'
        ],
        correctAnswerIndex: 1
      },
      {
        id: 'imgq3',
        question_en: 'You receive a Bemba SMS about "emeralds, gold, and red mercury" claiming you can earn a 40% commission if you help with some advance logistics. What is the catch?',
        question_bm: 'Mwapokelela SMS ya Cibemba ilelanda pa "emeralds, gold, na red mercury" no kulaya 40% commission nga mwasungako ndalama sha advance. Bushe ubufi buli kwi?',
        options_en: [
          'There is no catch; mining brokers in Zambia commonly trade via unsolicited text messages.',
          'It is a commodity scam. "Red Mercury" is a fictional substance, and they want you to pay advance fees (assay tests, clearance) then they disappear.',
          'The only catch is that you must have a valid mineral trading license from ZICTA.',
          'The deals are real but the red mercury is just synthetic instead of natural.'
        ],
        options_bm: [
          'Takwaba ubufi; abashitisha amabwe mu Zambia batuma fye amashwi pa foni.',
          'Ubu bufi bwa fye ubwapa malonda. "Red Mercury" taba kwata (substance ya kufinya fye), kabili balefwaya fye mupayile ndalama sha advance elyo balobe.',
          'Ubufi fye buli mukuti mufwile ukukwata laisenzi ya malonda ukufuma ku ZICTA.',
          'Amalonda ya cine lelo red mercury bayipangila fye ku mashina.'
        ],
        correctAnswerIndex: 1
      }
    ]
  }
];

export const SAMPLE_FAQS: FAQItem[] = [
  {
    question_en: 'What is phishing?',
    question_bm: 'Bushe Phishing cinshi?',
    answer_en: 'Phishing is a cyber attack where scammers pretend to be trustworthy organizations (like banks, mobile operators, or government bodies) through emails, SMS, or WhatsApp messages to trick you into revealing sensitive info like passwords, credit card numbers, or PINs.',
    answer_bm: 'Phishing mufilwe ukwishiba ukuti bampulamafunde balecita ifyakubepa ukupitila mu mauthenga ya foni, WhatsApp nangu email, baleicefya ukuti bakampani she bank, MTN/Airtel nangu ubuteko, pakuti bamubepushe ifisuma nga PIN, passwords nangu ndalama.'
  },
  {
    question_en: 'How do I protect my Airtel or MTN Mobile Money account?',
    question_bm: 'Kuti nacingilila shani ndalama shandi isha Airtel nangu MTN Mobile Money?',
    answer_en: '1) Never share your PIN with anyone. 2) Set a strong PIN that is not easy to guess (avoid birthdays or repeating numbers). 3) Always verify cash-in SMS messages manually. 4) Report scam attempts to ZICTA (dial 709) or your operator.',
    answer_bm: '1) Mwilaeba umuntu uuli onse PIN yenu. 2) Bomfyeni PIN yakosa (mwilabomfya ubushiku mwafyalilwe). 3) Shininkisheni SMS ya ndalama umupitile muli foni yenu. 4) Landeni kuli ZICTA (tumeni foni kuli 709) nangu bamebenshi.'
  },
  {
    question_en: 'What is Two-Factor Authentication (2FA)?',
    question_bm: 'Two-Factor Authentication (2FA) cinshi?',
    answer_en: 'Two-Factor Authentication is an extra layer of security. It requires you to enter a code sent to your SMS, or an app, in addition to your password, when logging in. This prevents hackers from entering your account even if they know your password.',
    answer_bm: 'Uku nshila ya bupili iya kacingilila ifya muli foni. Ifwaya ukuti mutenye code iyamutuminwa muli foni nangu SMS panshe ya password yenu. Cilaicingilila kuli bashipula ukwingila mukati nangu bameshibe password yenu.'
  }
];
