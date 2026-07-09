import React from 'react';
import { useApp } from '../context/AppContext';
import { Shield, CheckCircle, Smartphone, Award, HelpCircle } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { language, translate } = useApp();

  return (
    <div className="space-y-12 text-left animate-fade-in" id="about-section">
      {/* Hero Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl">
        <div className="absolute right-0 bottom-0 h-48 w-48 bg-green-500/5 blur-2xl rounded-full"></div>
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full text-xs font-mono font-bold">
            <Shield className="h-4 w-4" />
            <span>{translate('ABOUT THE RESEARCH', 'IFYA LESSON RESEARCH')}</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {translate(
              'Cybersecurity Awareness and Education Platform for Zambia',
              'Ukuicingilila kwa pa fyakucita fya pa kompyuta mu Zambia'
            )}
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            {translate(
              'This bilingual platform was founded to address the high rate of social engineering and Mobile Money scams targeting mobile phone users in Zambia. Our research focuses on empowering individuals with native Bemba and English instruction to maximize retention and digital readiness.',
              'Amasambililo ya muli ubu upangi yalipangwa pakuti abantu muno Zambia baicingilile kuli bampulamafunde ba ndalama sha muli foni (MoMo). Ifisambilisho ifi fili mu Cingeleshi na muli Cibemba pakuti onse amfwe bwino no kuwasuka.'
            )}
          </p>
        </div>
      </div>

      {/* Why Cybersecurity Matters (Bilingual) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Smartphone className="h-5 w-5 text-green-500" />
            <span>{translate('Why Bilingual Education?', 'Cishinka nshi ca kwasula muli fyonse ifilimi?')}</span>
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed">
            {translate(
              'While English is Zambia\'s official language, native language instruction like Bemba fosters a deep, intuitive understanding of psychological manipulations used by social engineers. By reading and listening in native Bemba, elders and local merchants are far more likely to detect fake Airtel or MTN support agents before they reveal their PIN.',
              'Nangu fye Cingeleshi e lulimi lwa buteko mu Zambia, ukusambilila mu Cibemba kulatwala ukwishiba bwino amalyashi ya bufi aya bampulamafunde. Abakalamba na bashima masebela kuti baisunga kuli bamebenshi ba bufi aba MTN na Airtel nga ca kuti basambilila ifisambilisho muli Cibemba.'
            )}
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 shadow space-y-4">
          <h4 className="font-bold text-white text-base">{translate('Our Primary Research Goals', 'Ifyo Tulefwaya Ukufumyamo')}</h4>
          
          <ul className="space-y-3 text-xs text-slate-300">
            <li className="flex items-start space-x-2.5">
              <span className="text-green-500 font-bold mt-0.5">✔</span>
              <span>
                <strong>{translate('Bilingual Access', 'Ukusambilila muli fitatu')}:</strong>{' '}
                {translate('Provide high-quality videos and PDF lessons in English and Bemba.', 'Ukupeela amavidio na fitabo mu Cingeleshi na Cibemba.')}
              </span>
            </li>
            <li className="flex items-start space-x-2.5">
              <span className="text-green-500 font-bold mt-0.5">✔</span>
              <span>
                <strong>{translate('Interactive Quizzes', 'Quizzes shafwayako')}:</strong>{' '}
                {translate('Empower learners to evaluate their safe-habits via custom quizzes.', 'Kwasuka amepusho ya fye pakuti wishibe ifyo wasambilila.')}
              </span>
            </li>
            <li className="flex items-start space-x-2.5">
              <span className="text-green-500 font-bold mt-0.5">✔</span>
              <span>
                <strong>{translate('AI Cybersecurity Advisor', 'AI Cyber Advisor')}:</strong>{' '}
                {translate('Integrate Gemini API to offer real-time cybersecurity chatbot support.', 'Ukulanshanya na Gemini model uukwasuka amepusho ya fye ya kacingilila.')}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
