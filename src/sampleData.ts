import { VideoContent, ImageContent, PDFMaterial, Quiz, FAQItem } from './types';

export const SAMPLE_VIDEOS: VideoContent[] = [
  {
    id: 'vid-facebook-grant-scam',
    title_en: 'Zambia Relief Grant Scam: Spotting Link Phishing',
    title_bm: 'Ukwishiba ama Links ya Bufi: Zambia Relief Grant Scam',
    description_en: 'Zambia Relief Grant Scam: Spotting Link Phishing\nA lesson on identifying fake government grants circulated on WhatsApp. Indicators of fraud include: 1) Insecure HTTP protocol (instead of HTTPS). 2) Generic bit.ly link shorteners which hide the true destination. 3) Grammatical errors ("Zambian will Recieve"). 4) Urgency tactics demanding quick registration and sharing. Authentic government sites always use official .gov.zm domains.',
    description_bm: 'Zambia Relief Grant Scam: Spotting Link Phishing\nIcisambilisho pa kwishiba ubufi bwa ndalama isha buteko ishabipa ishamahala pa WhatsApp. Ifishibilo fya bufi: 1) Ukubomfya link ya "http" mu nshita ya "https". 2) Ama link ya bit.ly ayo bafisa ukusebana. 3) Amashiwi ayaba mu Cingeleshi nga ("Zambian will Recieve"). 4) Ukumipatikisha ukulembesha bwangu bwangu nokupelako bambi. Amawebusaiti ya buteko yonse yabomfya ".gov.zm".',
    url: 'https://youtu.be/mkPDbR8RUqc?si=FwLflxd0Ebz7jUp9',
    thumbnailUrl: 'https://img.youtube.com/vi/mkPDbR8RUqc/hqdefault.jpg',
    duration: '01:30',
    views: 194,
    downloads: 58,
    createdAt: '2026-07-08T08:00:00Z'
  },
  {
    id: 'vid-facebook-momo-safety',
    title_en: 'Mobile Money Transfer Safety: Avoiding Redirection Tricks',
    title_bm: 'Ukusunga Impiya isha Mobile Money: Ukucenjela no Bufi bwa ma SMS',
    description_en: 'Analysis of a mobile money redirect SMS scam. Fraudsters send unsolicited messages claiming their Mobile Money network is "not working" and instructing you to send money to a different number/name instead. Always call the recipient on their known, trusted number to verify before transferring, and verify the registered name in the prompt before entering your PIN',
    description_bm: 'Ukupituluka mu bufi bwa ma SMS aya Mobile Money. Bapulamafunde batuma amashiwi ayabufi ati Mobile Money yabo tayili bwino kabili balemyeba ati mutume indalama kuli namba imbi. Lyonse balileni ukutumina uo mulefwaya ukutumina indalama pafoni yakwe iya cine pakuti mushininkishe ilyo tamulatuma, kabili mumone ishina lilembelwe ilyo tamulalemba PIN yenu.',
    url: 'https://youtu.be/IrPh_z3yRyY?si=aOCALwuCsdksh3JF',
    thumbnailUrl: 'https://img.youtube.com/vi/IrPh_z3yRyY/hqdefault.jpg',
    duration: '01:15',
    views: 172,
    downloads: 46,
    createdAt: '2026-07-08T08:30:00Z'
  },
  {
    id: 'vid-shikulu-mwila-fake-gold-scam',
    title_en: 'Fake Gold SMS Scam: "Shikulu Mwila" 450g Mineral Fraud',
    title_bm: 'Ubufi bwa Golide (Gold) na Ba Shikulu Mwila: Ukwishiba ama SMS ya Bufi',
    description_en: 'Video breakdown of the infamous "Shikulu Mwila" fake gold SMS scam circulating across Zambia. Fraudsters impersonate an elderly patriarch claiming to have 450g of raw gold with a 35% discount, seeking mobile money advance fees or luring buyers into robbery traps. Learn the linguistic red flags and how to protect yourself.',
    description_bm: 'Icilolekesho ca vidio pa bufi bwa golide (gold) na ba "Shikulu Mwila" ubo bupulamafunde baletuma pa ma foni mu Zambia. Bapulamafunde balecita kwati ni shikulu umukote uwakwata golide ya 450g no kupela 35% discount pakuti balye indalama sha mobile money. Sambilileni ifishibilo fyonse ne fyo mwingacingilila indalama shenu.',
    url: 'https://youtu.be/1eEQYzV5Zn4?si=YNfUXSSzmWu3jr_v',
    thumbnailUrl: 'https://img.youtube.com/vi/1eEQYzV5Zn4/hqdefault.jpg',
    duration: '01:45',
    views: 265,
    downloads: 74,
    createdAt: '2026-09-16T10:00:00Z'
  }
];

export const SAMPLE_IMAGES: ImageContent[] = [
  {
    id: 'img-shikulu-mwila-gold-scam',
    title_en: 'Fake Gold SMS Scam: "Shikulu Mwila" 450g Mineral Fraud',
    title_bm: 'Ubufi bwa Golide (Gold) na Ba Shikulu Mwila: Ukwishiba ama SMS ya Bufi',
    category: 'SMS Phishing & Mineral Fraud',
    description_en: 'Real-world SMS scam screenshot received on a Zambian dual-SIM phone. The message reads: "09503... abengashita gld 450gms kakupamo 35% nine shikulu Mwila kwaputa call me". Fraudsters impersonate an elderly patriarch ("shikulu") claiming to have 450 grams of raw gold with a 35% commission or discount. In reality, this is an advance-fee scam and potential robbery trap.',
    description_bm: 'Ici cilangililo ca cine ica SMS ya bufi iyapokelelwe pa foni mu Zambia. Ilembo lileti: "09503... abengashita gld 450gms kakupamo 35% nine shikulu Mwila kwaputa call me". Bapulamafunde balecita kwati ni shikulu umukote uwakwata golide (gold) ama grams 450 kabili balefwaya abakushita no kubapela 35% discount. Ubu bufi bwa kulila indalama sha mobile money nangu ukwibila abantu.',
    url: '/uploads/images/gold_scam_sms.jpg',
    views: 310,
    downloads: 95,
    createdAt: '2026-09-15T08:00:00Z',
    scamAnalysis: {
      scamType_en: 'Advance-Fee Mineral Fraud & Impersonation Phishing',
      scamType_bm: 'Ubufi bwa Mabwe ya Mutengo no Kucita Kwati Ni Shikulu Umukote',
      originalText: 'abengashita gld 450gms kakupamo 35% nine shikulu Mwila kwaputa call me',
      senderInfo: 'Unsolicited SMS from unknown Zambian mobile number (+260573... / 09503...)',
      breakdown: [
        {
          term: 'abengashita gld 450gms',
          meaning_en: 'Whoever is capable of purchasing 450 grams of raw gold.',
          meaning_bm: 'Abantu abali ne ndalama sha kushita golide (gold) ama grams 450.',
          psychologicalTactic_en: 'The Bait (Greed & Curiosity): 450 grams of pure gold is worth over $30,000 USD (~K800,000+ ZMW). The mention of such high value lures victims looking for quick windfalls.',
          psychologicalTactic_bm: 'Icilenga abantu ukubepwa: Golide iyafina 450g yaba nomutengo (ukucila K800,000 ZMW). Balafwaya ukukwata indalama sha bwangu.'
        },
        {
          term: 'kakupamo 35%',
          meaning_en: 'Giving an immediate 35% discount or broker commission.',
          meaning_bm: 'Ukupela 35% discount nangu indalama sha kulipilapo umuntu uuleshitako.',
          psychologicalTactic_en: 'Too Good To Be True: Offering a massive 35% margin makes the deal seem irresistibly profitable, blinding the victim to the clear risks.',
          psychologicalTactic_bm: 'Ubufi bwa ndalama ishingi: Balemilaya indalama ishingi nga nshi pakuti mumone kwati muli abashuka.'
        },
        {
          term: 'nine shikulu Mwila',
          meaning_en: 'It is I, Grandfather / Elder Mwila.',
          meaning_bm: 'Nine Shikulu Mwila (umukote uwakwata umucinshi).',
          psychologicalTactic_en: 'Cultural Respect Exploitation: In Zambian culture, elders (Shikulu) are revered and trusted. Fraudsters pose as innocent rural grandfathers so buyers assume the elder does not know the true global market value.',
          psychologicalTactic_bm: 'Ukubomfya ishina lya mushikulu: Mu Cibemba bashikulu balapeelwa umucinshi. Bapulamafunde balecita kwati mukote wa ku mushi uushaishiba amano pakuti mutontonkanye ati mulemubepa.'
        },
        {
          term: 'kwaputa call me',
          meaning_en: 'Urgent / quick, call me immediately.',
          meaning_bm: '(bwangu bwangu), ntumineni foni nomba line.',
          psychologicalTactic_en: 'Manufactured Urgency: Forcing rapid action so the victim dials immediately before consulting friends, mining specialists, or law enforcement.',
          psychologicalTactic_bm: 'Ukupatika umuntu ukwangufyanya: Balefwaya mulande nabo bwangu pakuti mwibepusha balupwa nangu bakapokola.'
        }
      ],
      howItWorks_en: [
        'Mass SMS Broadcasting: Scammers blast thousands of phone numbers across MTN, Airtel, and Zamtel networks using automated bulk SMS software.',
        'The Remote Location Hook: When you call back, "Shikulu Mwila" claims to be in a distant mining village (e.g., Kasenseli, Mkushi, Rufunsa, or Serenje) and unable to travel without funds.',
        'Advance Fee Extortion: You are instructed to send Mobile Money (MTN MoMo / Airtel Money) for transport, bus fare, mineral assay testing, or police clearance fees before the gold is brought to you.',
        'The Disappearing Act or Ambush: Once mobile money is transferred, the phone number is permanently switched off. If a physical meeting is arranged, victims are given painted brass filings or violently robbed at gunpoint.'
      ],
      howItWorks_bm: [
        'Ukutuma ama SMS ku bantu abengi: Batumina ama foni abantu abengi nga nshi pa MTN, Airtel na Zamtel.',
        'Ukulumbula ukuti bali ukutali: Nga mwatuma foni, baleti bali ku mushi ukutali (e.g. Kasenseli, Mkushi) kabili tabakwete indalama sha motoka.',
        'Ukulomba indalama ukupitila ku Mobile Money: Balemweba ati mutume indalama sha transport nangu sha testing pa MTN MoMo nangu Airtel Money.',
        ' Ilyo mwatuma indalama, foni balashimya. Nangu nga mwaya muku kumana nabo, balaba ukumibila indalama shonse nangu ukumipela ifyela ifishili golide.'
      ],
      redFlags_en: [
        'Unsolicited message from an unknown private number claiming to trade precious minerals.',
        'Offer of huge discounts (35%) on gold—a globally liquid commodity that never needs cheap unsolicited marketing.',
        'Use of traditional titles like "Shikulu" to build false rapport and lower your defenses.',
        'High urgency ("kwaputa call me") designed to prevent second thoughts or verification.',
        'Direct requests to conduct mineral transactions outside official Ministry of Mines licensed channels.'
      ],
      redFlags_bm: [
        'SMS ukufuma kuli nambala eyo tamwishibe ilelanda pa kushitisha golide.',
        'Umutengo unono sana (35% discount) pa cinthu ica mutengo.',
        'Ukubomfya ishina lya "Shikulu" pakuti mumone kwati tebakabolala.',
        
        'Ukushitisha ukwabula ifitupa fya buteko (Ministry of Mines).'
      ],
      recommendations_en: [
        'Never Call Back or Reply: Replying or calling confirms your number is active and responsive, leading to frequent subsequent scam attacks.',
        'Never Send Upfront Mobile Money: Never transfer money via Airtel Money, MTN MoMo, or bank deposit for "transport fees", "mineral testing", or "clearance".',
        'Never Agree to Physical Meetings: Never travel to meet strangers claiming to have cheap gold or emeralds. You risk being ambushed, kidnapped, or robbed.',
        'Block the Sender Number Immediately: Add the sending phone number to your device call/SMS blocklist.',
        'Report to ZICTA: Report the fraudulent number to the Zambia Information and Communications Technology Authority (ZICTA) by dialing toll-free 7070.',
        'Report to Your Mobile Network: Alert MTN Zambia or Airtel Zambia fraud desks so the fraudster SIM card can be revoked.',
        'Educate Relatives & Community: Share this case with friends, youth, and elderly family members who might fall for rural gold mining illusions.'
      ],
      recommendations_bm: [
        'Mwilatuma foni nangu ukwasuka: Nga mwa-asuka balamona ati iyi nambala ilabomba kabili bakamba nokumitumina na fimbi.',
        'Mwilatuma indalama kubomfya Mobile Money: Mwituma indalama sha transport nangu testing kuli nambala eyo tamwishibe.',
        'Mwilaya mu kukumana nabo: Mwiya ku fifulo fyamumpanga nangu ifyo tamwaishiba, bakabolala bakamibila indalama.',
        'Blokeni (Block) iyi nambala: Blokeni nambala yabo muli foni yenu.',
        'Tumineni ba ZICTA: Tumineni ba ZICTA pa namba ya mahala 7070 ukushimika ubufi ebobalefwaya ukumibepa.',
        
        'Sambilisheni balupwa: Ebeni balupwa na banenu nokubafundako pafyo bakabolala balecita mukubepa abantu mukupitila ku mabwe ya mutengo.'
      ],
      reportingChannels_en: [
        'ZICTA Fraud Helpline: Dial toll-free 7070 (All networks in Zambia)',
        'MTN Zambia Customer Support: Dial 111 or visit the nearest service center',
        'Airtel Zambia Fraud Line: Dial 111 or report through MyAirtel App',
        'Zambia Police Service Cybercrime Unit: Contact your local central police station',
        'Ministry of Mines & Mineral Development: Verify registered mineral dealers and report illegal mineral trading'
      ],
      reportingChannels_bm: [
        'Ba ZICTA: Tumeni foni pa 7070 ',
        'MTN Zambia: Tumeni foni pa 111',
        'Airtel Zambia: Tumeni foni pa 111',
        'Bakapokola bamu Zambia (Cybercrime Unit): Kabiyeni ku Police Station iyili mupepi',
        'Ministry of Mines: Ukwishiba abakwata Amapepala sha buteko isha mabwe'
      ]
    }
  },
  {
    id: 'img-whatsapp-grant-scam',
    title_en: 'Zambia Relief Grant Scam: Spotting Link Phishing',
    title_bm: 'Ubufi bwa Zambia Relief Grant: Ukwishiba ama Links aya Bufi',
    description_en: 'A lesson on identifying fake government grants circulated on WhatsApp. Indicators of fraud include: 1) Insecure HTTP protocol (instead of HTTPS). 2) Generic bit.ly link shorteners which hide the true destination. 3) Grammatical errors ("Zambian will Recieve"). 4) Urgency tactics demanding quick registration and sharing. Authentic government sites always use official .gov.zm domains.',
    description_bm: 'Icisambilisho pa kwishiba ubufi bwa ndalama  isha buteko ishabipa ishamahala pa WhatsApp. Ifishibilo fya ubufi: 1) Ukubomfya link ya "http" mu nshila ya "https". 2) Ama link ya bit.ly ayo bafisa  ukusebana. 3) Amashiwi ayaba mu Cingeleshi nga "Recieve". Amawebusaiti ya buteko yonse yabomfya ".gov.zm".',
    url: '/uploads/images/whatsapp_grant_scam.jpg',
    views: 185,
    downloads: 62,
    createdAt: '2026-07-08T07:00:00Z'
  },
  {
    id: 'img-momo-redirect-scam',
    title_en: 'Mobile Money Transfer Safety: Avoiding Redirection Tricks',
    title_bm: 'Ukusunga Impiya isha MTN MoMo',
    description_en: 'Analysis of a mobile money redirect SMS scam. Fraudsters send unsolicited messages claiming their Mobile Money network is "not working" and instructing you to send money to a different number/name instead. Always call the recipient on their known, trusted number to verify before transferring, and verify the registered name in the prompt before entering your PIN.',
    description_bm: 'Icilangililo ca bufi ishapa MTN MoMo. Bapulamafunde batuma amashiwi ayabufi ati mufwile ukubomfya nambala imbi pantu nambala yabo ilefilwa ukubomba. Mwilatuma indalama kuli nambala ili yonse ukwabula ukubalila ukulanda nabo pafoni pa namba mwaishiba iya cine.',
    url: '/uploads/images/momo_redirect_scam.jpg',
    views: 142,
    downloads: 39,
    createdAt: '2026-07-08T07:01:00Z'
  },
  {
    id: 'img-mineral-fraud-scam',
    title_en: 'Mineral & Red Mercury Fraud: Unmasking Commodity Scams',
    title_bm: 'Ubufi bwa Emerald, Gold na Red Mercury: Ukwishiba Ubufi ebo bakabolala bengamyeba',
    description_en: 'This Bemba SMS scam targets brokers with fake deals for emeralds, gold, and mythical "Red Mercury." Fraudsters offer a tempting 40% commission to lure you into paying "assay test fees" or "clearance charges" in advance. Remember: "Red Mercury" is a fictional substance. Authentic mineral brokers do not trade via random, unsolicited SMS messages.',
    description_bm: 'Iyi ni SMS iyabufi iya muci Bemba ileti kuli abaleshitisha emerald, gold, na "Red Mercury". Baletila 40% iya kulipilako fye, esho baleti testing fees. Shibukeni: "Red Mercury" yabufi elo tapaba umuntu uliwonse awakwata Red Mercury.',
    url: '/uploads/images/mineral_fraud_scam.jpg',
    views: 120,
    downloads: 48,
    createdAt: '2026-07-08T07:02:00Z'
  },
  {
    id: 'img-momo-rules',
    title_en: 'The Golden Rules of Mobile Money Safety',
    title_bm: 'Ifunde Likalamba Ilya Kusunga Impiya sha pa Foni',
    description_en: 'An infographic summarizing the 3 key rules: 1) Keep your PIN secret, 2) Verify any caller claiming to be a customer care agent, 3) Report fraudulent numbers to ZICTA.',
    description_bm: 'Infographic ilelondola amafunde ayakalamba: 1) Sungeni PIN yenu bwino bwino, 2) Shininkisheni uulemitumina foni.',
    url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
    views: 412,
    downloads: 198,
    createdAt: '2026-06-18T14:00:00Z'
  },
  {
    id: 'img-social-media',
    title_en: 'Securing Your Facebook & WhatsApp',
    title_bm: 'Ukuicingilila ku Facebook na WhatsApp',
    description_en: 'Visual checklist to activate Two-Factor Authentication (2FA) on WhatsApp and Facebook to prevent hackers from hijacking your account and asking your friends for money.',
    description_bm: ' Two-Factor Authentication (2FA) ninshila isuma sana iya kubomfya pa WhatsApp na Facebook ukuti ifisuma filesungwa bwino, no kuicingilila kuli bakabolala.',
    url: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80',
    views: 325,
    downloads: 145,
    createdAt: '2026-06-22T16:45:00Z'
  }
];

export const SAMPLE_PDFS: PDFMaterial[] = [];

export const SAMPLE_QUIZZES: Quiz[] = [
  {
    id: 'quiz-gold-sms-scam',
    title_en: 'Fake Gold & "Shikulu Mwila" SMS Scam Quiz',
    title_bm: 'Ama Quiz pa Bufi bwa Golide na "Shikulu Mwila"',
    description_en: 'Test your ability to spot mineral advance-fee fraud, decode deceptive phrases like "abengashita gld 450gms", and protect yourself from SMS scams.',
    description_bm: 'Esheni amano yenu pa kwishiba ubufi bwa golide (gold), amashiwi ya bufi aya ba "Shikulu Mwila", ne fyo mwingaicingilila ku bapulamafunde.',
    createdAt: '2026-09-16T10:00:00Z',
    questions: [
      {
        id: 'gq1',
        question_en: 'You receive an unsolicited SMS: "abengashita gld 450gms kakupamo 35% nine shikulu Mwila kwaputa call me". What is the main psychological hook behind offering 450g of gold with a 35% discount?',
        question_bm: 'Mwapokelela SMS: "abengashita gld 450gms kakupamo 35% nine shikulu Mwila kwaputa call me". Citeyo nshi icikalamba ico babomfya pakulaya golide ya 450g na 35% discount?',
        options_en: [
          'A legitimate wholesale mineral discount approved by the Ministry of Mines.',
          'Greed and curiosity: Luring victims with an unrealistic 35% discount on high-value gold (worth over K800,000 ZMW) to blind them to the danger.',
          'A youth mining empowerment grant from mobile network operators.',
          'A routine network coverage test message broadcast to all dual-SIM phones.'
        ],
        options_bm: [
          'Ukuponya umutengo wa cine cine uwa golide uwasuminishiwa no buteko.',
          'Icilenga abantu ukubepwa: Ukulaya 35% discount pa golide iya mutengo uukalamba (ukucila K800,000 ZMW).',
          'Program ya ba Airtel nangu MTN iya kwafwilisha abalelima amabwe.',
          'SMS fye iya kwesha network pa mafoni yakwata ama line yabili (dual-SIM).'
        ],
        correctAnswerIndex: 1,
        explanation_en: '450 grams of raw gold is worth over $30,000 USD (over K800,000 ZMW). Scammers promise unrealistic discounts and commissions to trigger greed, making victims overlook blatant warning signs before demanding upfront fees.',
        explanation_bm: 'Golide iyafina 450g yaba no mutengo uukalamba (ukucila K800,000 ZMW). Bapulamafunde balaya indalama ishingi pakuti mumone kwati muli abashuka, elyo mwafilwa ukumona ubufi ilyo tabalalomba indalama sha advance.'
      },
      {
        id: 'gq2',
        question_en: 'Why do the scammers sign the message as "nine shikulu Mwila" (I am Grandfather Mwila)?',
        question_bm: 'Mulandu nshi abama scammers balembela ati "nine shikulu Mwila" mu SMS?',
        options_en: [
          'Because Zambian law requires all precious mineral deals to be signed by registered elders.',
          'To exploit cultural respect for elders, making buyers believe an uneducated rural grandfather does not know the real value of gold and can be easily taken advantage of.',
          'Because "Mwila" is the official government code for authorized gold refinery agents.',
          'It is a random typo created by automated translation software.'
        ],
        options_bm: [
          'Pantu ifunde lya mu Zambia lifwaya fye abakalamba ukusaina ama deals ya mabwe.',
          'Pakuti babomfye umucinshi wa bu shikulu mu Zambia, no kulenga umuntu amone kwati mukote wa ku mushi uushaishiba umutengo wa cine kabili uwanguka ukubepa.',
          'Pantu "Mwila" lishina lya bampulamafunde abakalamba aba buteko.',
          'Cilubo fye ica mashini ya kupilibula indimi.'
        ],
        correctAnswerIndex: 1,
        explanation_en: 'In Zambian culture, grandfathers (bashikulu) command respect and trust. Fraudsters pose as naive rural elders to reverse the perceived power dynamic, making victims believe they are outsmarting the elder.',
        explanation_bm: 'Mu Zambia abantu balicindika bashikulu. Bapulamafunde babomfya ici pakuti mutontonkanye ukuti mukote uushasambilila, uushaishiba umutengo wa golide.'
      },
      {
        id: 'gq3',
        question_en: 'What does "kwaputa call me" mean, and why do scammers use this tactic?',
        question_bm: 'Bushe amashiwi yakuti "kwaputa call me" yalola mwi, kabili mulandu nshi abama scammers bayabomfesha?',
        options_en: [
          'It means "congratulations", signaling that you won an official mining competition.',
          'It means "urgent / quick, call me immediately", manufactured urgency designed to force rapid impulse action before the victim can consult experts or police.',
          'It means "do not call", instructing buyers to only respond through encrypted chat apps.',
          'It means the call will be completely free of toll charges.'
        ],
        options_bm: [
          'Cilepilibula ati "mwapokelela ishuko", elyo nafuti cilepilibula ukuwina competition.',
          'Cilepilibula ati "(bwangu bwangu), ntumineni foni nomba line", pakuti mwangufyanye ukucita ifintu ukwabula ukutontonkanyapo nangu ukwipusha bambi.',
          'Cilepilibula ati "mwilatuma foni", fyonse ficitike fye pa mashiwi ya kufisa.',
          'Cilepilibula ukuti foni ya mahala.'
        ],
        correctAnswerIndex: 1,
        explanation_en: '"Kwaputa" creates false urgency. In social engineering, manufactured urgency creates panic and haste so victims act impulsively before consulting family, mining authorities, or verifying facts.',
        explanation_bm: 'Ukupatika umuntu ukwangufyanya ("kwaputa") kulalenga mwatuma foni bwangu bwangu ukwabula ukutontonkanyapo nangu ukwipusha balupwa na bakapokola.'
      },
      {
        id: 'gq4',
        question_en: 'If a curious person dials the number to inquire about the gold, how does the scam actually take their money?',
        question_bm: 'Nga umuntu atumina "Shikulu Mwila" foni, bushe ba pulamafunde balacita shani pakuti bebe indalama?',
        options_en: [
          'The scammer meets them at Barclays/Absa bank and signs an escrow contract.',
          'The scammer claims to be stranded in a distant mining bush outpost (e.g. Kasenseli or Mkushi) and demands Mobile Money for transport, assay testing, or police clearance before switching off the phone.',
          'The scammer mails genuine gold samples to your home address via registered EMS post.',
          'The scammer registers your phone for official mineral trading royalties.'
        ],
        options_bm: [
          'Scammer alemukumanya pa banki ya Absa ukusaina amapepala ya cine.',
          'Scammer aletila ali ku mushi ukutali (nga ku Kasenseli nangu Mkushi) kabili alomba indalama sha Mobile Money (MTN MoMo/Airtel) isha motoka nangu testing, elyo ilyo mwatuma fye balashimya foni.',
          'Scammer alemutumina golide ya cine pa post office ukwabula ukulipila.',
          'Scammer alemulembesha ukukwata laisensi ya buteko iya amabwe.'
        ],
        correctAnswerIndex: 1,
        explanation_en: 'This is an advance-fee fraud (419 mineral scam). Fraudsters demand Airtel Money or MTN MoMo for "transport bus fare", "assay testing", or "clearance documents". Once sent, the phone number is permanently switched off.',
        explanation_bm: 'Ubu bufi bwa kulila indalama sha advance. Bapulamafunde balomba indalama sha Mobile Money isha motoka nangu testing fees, elyo ilyo mwatuma fye balashimya foni nangu ukumupela ifyela ifishili golide.'
      },
      {
        id: 'gq5',
        question_en: 'What is the correct and safest response if you receive this "Shikulu Mwila" fake gold SMS?',
        question_bm: 'Finshi ifyalinga ukucita nga mwapokelela iyi SMS iya bufi iya golide pa foni yenu?',
        options_en: [
          'Travel immediately alone with cash to inspect the gold in person.',
          'Do not call or reply, block the sender’s phone number, and report it to ZICTA by dialing toll-free 7070 or notifying your mobile network provider.',
          'Send K100 on Mobile Money first to test whether the recipient answers politely.',
          'Forward the SMS to 20 friends so they can help you purchase the gold.'
        ],
        options_bm: [
          'Kuya bwangu bwangu weka ne ndalama muminwe ku cifulo balumbwile pakuti musange discount.',
          'Mwituma foni nangu ukwasuka, blokeni (block) nambala, kabili lembesheni kuli ba ZICTA pa 7070 nangu kuli kampani ya foni yenu (MTN/Airtel).',
          'Balilenipo ukutuma K100 pa Mobile Money pakuti mweshe nga balalanda bwino.',
          'Ukutumina iyi SMS ku banenu abali 20 pakuti mushite bonse pamo.'
        ],
        correctAnswerIndex: 1,
        explanation_en: 'Never reply or call back; doing so confirms your phone number is active to scam syndicates. Block the number on your device and report it to ZICTA (toll-free 7070) and your network provider (dial 111) for SIM de-registration.',
        explanation_bm: 'Mwituma foni nangu ukwasuka pantu balemona kwati foni yenu ilebomba. Blokeni nambala no kulembesha kuli ZICTA (7070) nangu kampani ya foni (111) ukuti bashimye iyi SIM card.'
      }
    ]
  },
  {
    id: 'quiz-momo',
    title_en: 'Mobile Money Safety Quiz',
    title_bm: 'Ukucingilisha Impiya sha pa Foni (MoMo)',
    description_en: 'Test your ability to spot mobile money scams, fraudulent calls, and secure your wallet.',
    description_bm: 'Esheni amano yenu nga kuti mwaishiba ati ubu bufi kufuma kuma scammers.',
    createdAt: '2026-06-20T10:00:00Z',
    questions: [
      {
        id: 'q1',
        question_en: 'An Airtel or MTN customer representative calls asking for your Mobile Money PIN to fix a network issue. What should you do?',
        question_bm: 'Umuntu uleti abomba ku Airtel nangu MTN amitumina foni no kumipusha PIN yenu iya Mobile Money ati awamye foni. Kuti mwacitapo shani?',
        options_en: [
          'Give them the PIN since they work for the network provider.',
          'Never give your PIN. Hang up immediately and report the number.',
          'Give them a temporary PIN and change it later.',
          'Ask them to send an SMS verification code instead.'
        ],
        options_bm: [
          'Kubapela PIN pantu balebomba mu kampani ya foni.',
          'Mwilaeba umuntu PIN yenu. Putuleni foni bwangu no kulembesha number yacimitumina.',
          'Mubapeko PIN ya kanyense, e lyo mwacinja inshita imbi.',
          'Bepusheni ukutuma SMS iya kwasuka pakubala.'
        ],
        correctAnswerIndex: 1
      },
      {
        id: 'q2',
        question_en: 'You receive an SMS saying you have won K5,000 on MTN/Airtel promo, but you must first send K200 for "processing fee". Is this real?',
        question_bm: 'Mwapokelela SMS ati namu wina indalama K5,000 muli MTN/Airtel promo, nomba mufwile ukutuma K200 iya "processing". Bushe ca cine?',
        options_en: [
          'Yes, promotions often require small processing fees.',
          'No, it is a scam. Legitimate promotions never ask you to send money to claim prizes.',
          'Yes, if the SMS looks professional and has MTN/Airtel in it.',
          'Maybe, I should send K100 to negotiate the processing fee.'
        ],
        options_bm: [
          'Ee, amapromo yalafwaya kandalama aka kwingilila.',
          'Iyoo, mufilwe ukwishiba ati bufi. Amapromo ya cine tayepusha ndalama sha kutuma.',
          'Ee, nga ca kuti SMS ilemoneka iyawama sana .',
          'limbi, kuti natumako K100 tubepushe fye.'
        ],
        correctAnswerIndex: 1
      }
    ]
  },
  {
    id: 'quiz-phishing',
    title_en: 'Phishing and Link Security Quiz',
    title_bm: 'Amalyashi ya Bufi na ma Links sha pa Intaneti',
    description_en: 'Can you tell the difference between a real login page and a scam attempt?',
    description_bm: 'Bushe kuti mwaishiba ubupusano buli pa login page ya cine ne ya bufi ?',
    createdAt: '2026-06-24T14:30:00Z',
    questions: [
      {
        id: 'pq1',
        question_en: 'A WhatsApp message claims you can get free internet bundles if you click on "www.zambia-free-bundles.com" and share with 10 groups. Is this safe?',
        question_bm: 'Message ya pa WhatsApp iyiletila kuti mwapokelela ama bundles aya fye nga mwatininka "www.zambia-free-bundles.com" no kupelako nangula ukutumina ku bantu abali 10. Bushe filifye bwino nagula cisuma?',
        options_en: [
          'Yes, free bundles promotions are common.',
          'No, this is phishing or clickbait designed to hack your phone or steal data.',
          'Yes, because my friends sent it to me.',
          'No, but sharing with only 5 groups makes it safe.'
        ],
        options_bm: [
          'Ee, amapromo ayama bundles aya fye yalicindama sana.',
          'Iyoo, ubu bufi (phishing) ubwapangwa ukwiba ifya muli foni nangu amafoni yenu.',
          'Ee, pantu abanandi bali ntumina.',
          'Iyoo, lelo ukutumako kumabumba fye yasano (5) yalifye bwino.'
        ],
        correctAnswerIndex: 1
      }
    ]
  },
  {
    id: 'quiz-image-scams',
    title_en: 'Social Media & SMS Fraud Quiz',
    title_bm: ' Ubufi bwaba pa WhatsApp nama SMS',
    description_en: 'Test your knowledge on specific WhatsApp and SMS scams circulating in Zambia, including fake grants, MoMo redirections, and mineral frauds.',
    description_bm: 'Esheni amano yenu pa kwishiba ubufi bwa ndalama sha buteko, na MTN MoMo .',
    createdAt: '2026-07-08T07:20:00Z',
    questions: [
      {
        id: 'imgq1',
        question_en: 'You see a forwarded WhatsApp message offering a K10,000 "Government of Zambia Support Grant" with a bit.ly link starting with http://. Why is this suspicious?',
        question_bm: 'Mwapokelela message pa WhatsApp ilelaya K10,000 "Zambia Support Grant" ubukwete bit.ly link iyatampa na http://. Ushe bwafyanshi buli muli iyi message?',
        options_en: [
          'It is safe because it is forwarded inside a trusted family group.',
          'It uses an insecure HTTP link, a bit.ly link shortener to hide the real site, contains typos, and authentic government sites must end with .gov.zm.',
          'It is safe because the government uses bit.ly links to save money.',
          'It is safe because it mentions "More than 3 million Zambians will receive it".'
        ],
        options_bm: [
          'Cilifye bwino pantu bacituminako mwi bumba lya lupwa mwaishiba.',
          'Ilebomfya link ya "http" ishabamo pafya kucingilila, ishiwi lya bit.ly ifisambililo fya ubufi, kabili amawebusaiti ya cine aya buteko lyonse yapwa na ".gov.zm".',
          'Cilifye bwino pantu ubuteko bulabomfya bit.ly ukusunga ndalama.',
          'Cilifye bwino pantu balumbwile ati "abena Zambia abengi bakapokelela ndalama".'
        ],
        correctAnswerIndex: 1
      },
      {
        id: 'imgq2',
        question_en: 'An SMS from an unknown sender says "use this number to send that money... my number is not working in mobile MONEY". What is the correct response?',
        question_bm: 'SMS yafuma kuli nambala eyotamwishibe iletila: "tumeni ndalama kuli iyi namba... namba yandi tailebomba bwino ku mobile money". Kuti mwacitapo shani?',
        options_en: [
          'Send the money immediately to the new number before they get upset.',
          'Ignore the message. Call the intended recipient on their known, trusted number to verify first. Fraudsters use this "redirect trick" to intercept transfers.',
          'Send half of the money to the new number and half to the old number.',
          'Text the new number back asking for their Mobile Money PIN to verify them.'
        ],
        options_bm: [
          'Tumeni ndalama bwangu kuli iyi namba ilyo tabalafulwa.',
          'Sengukeni iyi message. Balileni ukulanda no mwine pa namba yakwe mwishiba iya cine ukuti mushininkishe. Bapulamafunde babomfya ubu bufi ukwiba.',
          'Tumeni ndalama ishinono kuli namba iyipya e lyo indalama yashalako kuli namba iya kale.',
          'Tumineni uyo muntu SMS ukumwipusha PIN yakwe iyaku mobile money ukuti mwishibe.'
        ],
        correctAnswerIndex: 1
      },
      {
        id: 'imgq3',
        question_en: 'You receive a Bemba SMS about "emeralds, gold, and red mercury" claiming you can earn a 40% commission if you help with some advance logistics. What is the catch?',
        question_bm: 'Mwapokelela SMS ya Cibemba ilelanda pali "emerald, gold, na red mercury" no kumilaya 40% commission nga mwabafwilisha. Bushe ubufi buli kwi?',
        options_en: [
          'There is no catch; mining brokers in Zambia commonly trade via unsolicited text messages.',
          'It is a commodity scam. "Red Mercury" is a fictional substance, and they want you to pay advance fees (assay tests, clearance) then they disappear.',
          'The only catch is that you must have a valid mineral trading license from ZICTA.',
          'The deals are real but the red mercury is just synthetic instead of natural.'
        ],
        options_bm: [
          'Takuli ubufi; abashitisha amabwe mu Zambia batuma fye amashwi pa foni.',
          'Ubu bufi . "Red Mercury" taba kwata, kabili balefwaya fye  indalama sha advance elyo balube.',
          'Ubufi buli mukuti mufwile ukukwata laisensi iya kushitisha amabwe ukufuma ku ZICTA.',
          'Ama deals aya red mercury yacine .'
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
    answer_bm: 'Phishing mufilwe ukwishiba ukuti bampulamafunde balecita ifyakubepa ukupitila mu ma messages ayapa foni, WhatsApp nangu email, MTN/Airtel nangu ubuteko, pakuti bamibepe ubufi ubwalalenga muba pele PIN yenu, passwords nangu ndalama.'
  },
  {
    question_en: 'How do I protect my Airtel or MTN Mobile Money account?',
    question_bm: 'Kuti nacingilila shani ndalama shandi isha Airtel nangu MTN Mobile Money?',
    answer_en: '1) Never share your PIN with anyone. 2) Set a strong PIN that is not easy to guess (avoid birthdays or repeating numbers). 3) Always verify cash-in SMS messages manually. 4) Report scam attempts to ZICTA (dial 709) or your operator.',
    answer_bm: '1) Mwilaeba umuntu uuli onse PIN yenu. 2) Bomfyeni PIN yakosa (mwilabomfya ubushiku mwafyalilwe). 3) Shininkisheni SMS ilelanda pa ndalama . 4) Tumineni ba ZICTA nokulembesha (tumeni foni kuli 709).'
  },
  {
    question_en: 'What is Two-Factor Authentication (2FA)?',
    question_bm: 'Two-Factor Authentication (2FA) cinshi?',
    answer_en: 'Two-Factor Authentication is an extra layer of security. It requires you to enter a code sent to your SMS, or an app, in addition to your password, when logging in. This prevents hackers from entering your account even if they know your password.',
    answer_bm: ' Ninshila ya bubili iya kacingilila ifya muli foni. Ifwaya ukuti mwingishe code ayo bamitumine muli foni nangu SMS pambali ya password yenu. Ilalengwa ukumicingilila kuli bakabolala ukwingila mukati nangu nabeshiba password yenu.'
  }
];
