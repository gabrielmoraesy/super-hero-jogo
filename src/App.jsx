/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  MapPin, 
  Trophy, 
  Star, 
  ArrowRight,
  ArrowLeft,
  Home,
  Building2,
  GraduationCap,
  Shield,
  Stethoscope,
  Tractor,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  Award,
  Crown,
  Lightbulb,
  Heart,
  User,
  TrendingUp,
  Target,
  Sparkles
} from 'lucide-react';
import './App.css';


// Ícone de seta para baixo para o botão de download
function ArrowDownIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 5v14M19 12l-7 7-7-7" />
    </svg>
  );
}

// Scrollbar escura global
const darkScrollbarStyle = `
  ::-webkit-scrollbar {
    width: 10px;
    background: #181818;
  }
  ::-webkit-scrollbar-thumb {
    background: #383838;
    border-radius: 8px;
    border: 2px solid #181818;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #242424;
  }
  ::-webkit-scrollbar-corner {
    background: #181818;
  }
  /* Firefox */
  html, body, .App, .h-screen, .min-h-screen, .max-h-[80vh], .overflow-y-auto {
    scrollbar-color: #383838 #181818;
    scrollbar-width: thin;
  }
`;

if (typeof document !== 'undefined' && !document.getElementById('dark-scrollbar-style')) {
  const style = document.createElement('style');
  style.id = 'dark-scrollbar-style';
  style.innerHTML = darkScrollbarStyle;
  document.head.appendChild(style);
}
import gameData from './assets/jogo_sebrae_corrigido.json';
import EvolutionDisplay from './components/EvolutionDisplay';
import CityMap from './components/CityMap';

// Importar imagens de evolução
import stage1 from './assets/evolution_stage_1.png';
import roboDialogo from './assets/evolution_stage_1_remove_background.png';
import backgroundAppImg from './assets/background-app.png';
import stage2 from './assets/evolution_stage_2.png';
import stage3 from './assets/evolution_stage_3.png';
import stage4 from './assets/evolution_stage_4.png';
import stage5 from './assets/evolution_stage_5.png';

const evolutionImages = {
  1: stage1,
  2: stage2,
  3: stage3,
  4: stage4,
  5: stage5
};

// Mapeamento de ícones para localidades
const locationIcons = {
  escola: GraduationCap,
  hospital: Stethoscope,
  casa: Home,
  universidade: Building2,
  policia: Shield,
  area_rural: Tractor
};

// Mapeamento de ícones para categorias de habilidades
const skillCategoryIcons = {
  laranja: Crown,
  amarelo: Lightbulb,
  rosa: Heart
};

// Funções de evolução
const getCurrentStage = (totalXP) => {
  let currentStage = 1;
  for (const stage of gameData.evolution_system.stages) {
    if (totalXP >= stage.xp_required) {
      currentStage = stage.id;
    } else {
      break;
    }
  }
  return currentStage;
};

const getEvolutionProgress = (totalXP) => {
  const currentStage = getCurrentStage(totalXP);
  
  if (currentStage >= 5) {
    return {
      current_stage: currentStage,
      progress_percentage: 100,
      xp_to_next: 0,
      next_stage_xp: null
    };
  }
  
  const nextStage = gameData.evolution_system.stages[currentStage];
  const currentStageXP = gameData.evolution_system.stages[currentStage - 1].xp_required;
  
  const xpInCurrentStage = totalXP - currentStageXP;
  const xpNeededForNext = nextStage.xp_required - currentStageXP;
  
  const progressPercentage = xpNeededForNext > 0 ? (xpInCurrentStage / xpNeededForNext) * 100 : 100;
  
  return {
    current_stage: currentStage,
    progress_percentage: Math.min(progressPercentage, 100),
    xp_to_next: Math.max(nextStage.xp_required - totalXP, 0),
    next_stage_xp: nextStage.xp_required
  };
};



// Importar Typewriter
import { Typewriter } from 'react-simple-typewriter';

// Telas de diálogo do robô com efeito de digitação
const RoboDialogScreens = ({ onFinish }) => {
  const [step, setStep] = useState(0);
  const dialogos = [
    {
      titulo: 'Olá!',
      fala: [
        'A cidade está destruída e preciso da sua ajuda. Responda as perguntas e me ajude nessa missão!'
      ]
    },
    {
      titulo: 'Juntos podemos reconstruir tudo!',
      fala: [
        'Cada resposta certa me deixa mais forte. Vamos nessa missão?'
      ]
    }
  ];


  // Para reiniciar o Typewriter ao mudar de step
  const [typewriterKey, setTypewriterKey] = useState(0);

  useEffect(() => {
    setTypewriterKey(prev => prev + 1);
  }, [step]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="overflow-hidden relative"
      style={{ background: '#0D0D0D', minHeight: '100dvh', height: '100dvh' }}
    >
      <img 
        src={backgroundAppImg}
        alt="Fundo App" 
        className="absolute inset-0 w-full h-full object-cover z-0 select-none pointer-events-none" 
        style={{ filter: 'blur(1px)' }}
        draggable={false}
      />
      <div className="absolute inset-0 z-10" style={{ background: 'rgba(13,13,13,0.7)' }} />
      <div className="h-full max-w-[600px] mx-auto flex flex-col items-center justify-center p-6 relative z-20" style={{ color: '#FFFFFF' }}>
        <div className="flex flex-col items-center mb-10 w-full">
          <div className="flex flex-col-reverse justify-center gap-6 w-full max-w-lg mx-auto">
            <img src={roboDialogo} alt="Robô" className="w-80 h-80 object-contain drop-shadow-2xl" draggable={false} style={{ minWidth: 180 }} />
            <div className="relative flex-1 flex flex-col items-center">
              <div
                className="bg-[#23272f] border border-[#0A84FF] text-white text-base rounded-2xl px-6 py-5 shadow-2xl text-left leading-snug max-w-[340px] mx-auto"
                style={{
                  boxShadow: '0 8px 32px 0 rgba(10,132,255,0.15), 0 1.5px 8px 0 #0A84FF33',
                  borderWidth: 2,
                  borderColor: '#0A84FF',
                  background: 'linear-gradient(135deg, #23272f 80%, #0A84FF22 100%)',
                  color: '#fff',
                  fontSize: '1.05rem',
                  fontWeight: 500,
                  letterSpacing: 0.1,
                  position: 'relative',
                  zIndex: 2,
                  marginBottom: 0
                }}
              >
                <span className="font-semibold text-[#0A84FF]">
                  {dialogos[step].titulo}
                </span>
                <br />
                <span>
                  <Typewriter
                    key={typewriterKey}
                    words={dialogos[step].fala}
                    loop={false}
                    cursor
                    cursorStyle="_"
                    typeSpeed={80}
                    deleteSpeed={0}
                    delaySpeed={1000}
                  />
                </span>
              </div>
              <div className="w-full flex justify-center -mt-2" style={{ zIndex: 1 }}>
                <svg width="36" height="20" viewBox="0 0 36 20">
                  <polygon points="18,20 36,0 0,0" fill="#23272f" stroke="#0A84FF" strokeWidth="2" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={() => {
            if (step < dialogos.length - 1) setStep(step + 1);
            else onFinish();
          }}
          className="px-10 py-4 rounded-full font-bold text-lg shadow-2xl flex items-center gap-3 transition-colors mt-6"
          style={{ background: '#0A84FF', color: '#FFFFFF', fontSize: '1.15rem', boxShadow: '0 4px 24px 0 #0A84FF55' }}
          onMouseOver={e => e.currentTarget.style.background = '#0066CC'}
          onMouseOut={e => e.currentTarget.style.background = '#0A84FF'}
        >
          {step < dialogos.length - 1 ? 'Continuar' : 'Começar Missão'}
          <ArrowRight className="w-6 h-6" style={{ color: '#FFFFFF' }} />
        </button>
      </div>
    </motion.div>
  );
};

// Componente de perfil do jogador
const PlayerProfile = ({ userStats, onClose }) => {
  try {
    const { totalXP, level, skills, unlockedSuperpowers } = userStats;
    const currentStage = getCurrentStage(totalXP);
    const evolutionProgress = getEvolutionProgress(totalXP);
    const stageInfo = gameData.evolution_system.stages[currentStage - 1];
    
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center p-6 z-50"
        style={{ background: 'rgba(13,13,13,0.95)' }}
      >
        <div className="rounded-2xl p-6 max-w-md w-full border shadow-2xl"
          style={{ background: '#181818', borderColor: '#242424', color: '#FFFFFF', maxHeight: '80vh', overflowY: 'auto', borderRadius: '1rem' }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold" style={{ color: '#FFFFFF' }}>Seu Perfil</h2>
            <button onClick={onClose} className="transition-colors" style={{ color: '#B0B0B0' }}>
              <XCircle className="w-6 h-6" />
            </button>
          </div>
          {/* Evolução do personagem */}
          <div className="mb-6 text-center">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 mx-auto mb-4 shadow-lg"
              style={{ borderColor: '#0A84FF', background: '#242424' }}
            >
              <img 
                src={evolutionImages[currentStage]} 
                alt={stageInfo?.name || 'Personagem'}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-lg font-semibold" style={{ color: '#FFFFFF' }}>{stageInfo?.name || 'Carregando...'}</h3>
            <p className="text-sm mb-2" style={{ color: '#B0B0B0' }}>{stageInfo?.description || ''}</p>
            <div className="flex items-center justify-center gap-4 text-sm mb-4">
              <div className="flex items-center gap-1" style={{ color: '#0A84FF' }}>
                <Star className="w-4 h-4" />
                <span>{totalXP} XP</span>
              </div>
              <div className="flex items-center gap-1" style={{ color: '#FFD700' }}>
                <Award className="w-4 h-4" />
                <span>Nível {level}</span>
              </div>
            </div>
            {/* Progresso de evolução */}
            {evolutionProgress.next_stage_xp && (
              <div>
                <div className="flex items-center justify-between mb-2 text-sm">
                  <span style={{ color: '#B0B0B0' }}>Próxima evolução</span>
                  <span style={{ color: '#B0B0B0' }}>{evolutionProgress.progress_percentage.toFixed(1)}%</span>
                </div>
                <div className="w-full rounded-full h-2 mb-2" style={{ background: '#383838' }}>
                  <div 
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ width: `${evolutionProgress.progress_percentage}%`, background: 'linear-gradient(90deg, #0A84FF 0%, #66B2FF 100%)' }}
                  />
                </div>
                <p className="text-xs" style={{ color: '#B0B0B0' }}>
                  {evolutionProgress.xp_to_next} XP para {currentStage < 5 ? gameData.evolution_system.stages[currentStage].name : 'Máximo'}
                </p>
              </div>
            )}
          </div>
          {/* Características atuais */}
          {stageInfo?.characteristics && (
            <div className="mb-6">
              <h4 className="text-md font-semibold mb-3 flex items-center gap-2" style={{ color: '#FFFFFF' }}>
                <User className="w-4 h-4" />
                Características
              </h4>
              <div className="space-y-2">
                {stageInfo.characteristics.map((characteristic, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm" style={{ color: '#B0B0B0' }}>
                    <div className="w-2 h-2 rounded-full" style={{ background: '#0A84FF' }} />
                    <span>{characteristic}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Habilidades */}
          {gameData.habilidades?.categorias && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: '#FFFFFF' }}>
                <TrendingUp className="w-5 h-5" style={{ color: '#FFD700' }} />
                Habilidades
              </h3>
              {Object.entries(gameData.habilidades.categorias).map(([catId, categoria]) => {
                const Icon = skillCategoryIcons[catId] || User;
                return (
                  <div key={catId} className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-4 h-4" style={{ color: categoria.cor }} />
                      <span className="text-sm font-medium" style={{ color: '#B0B0B0' }}>{categoria.nome}</span>
                    </div>
                    {categoria.habilidades?.map(habilidade => {
                      const skillLevel = skills?.[habilidade.id] || 0;
                      const maxLevel = habilidade.nivel_maximo;
                      return (
                        <div key={habilidade.id} className="ml-6 mb-2">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs" style={{ color: '#B0B0B0' }}>{habilidade.nome}</span>
                            <span className="text-xs" style={{ color: '#B0B0B0' }}>{skillLevel}/{maxLevel}</span>
                          </div>
                          <div className="rounded-full h-1" style={{ background: '#383838' }}>
                            <div 
                              className="h-1 rounded-full transition-all duration-500"
                              style={{ background: categoria.cor, width: `${(skillLevel / maxLevel) * 100}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
          {/* Superpoderes */}
          {unlockedSuperpowers?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: '#0A84FF' }}>
                <Zap className="w-5 h-5" />
                Superpoderes
              </h3>
              <div className="space-y-2">
                {unlockedSuperpowers.map(superpoder => (
                  <div key={superpoder.id} className="rounded-lg p-3 border" style={{ background: '#242424', borderColor: '#383838', color: '#FFD700' }}>
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="w-4 h-4" style={{ color: '#FFD700' }} />
                      <span className="text-sm font-medium">{superpoder.nome}</span>
                    </div>
                    <p className="text-xs" style={{ color: '#B0B0B0' }}>{superpoder.descricao}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Bônus de evolução */}
          {currentStage > 1 && gameData.evolution_system?.evolution_bonuses?.[`stage_${currentStage}`] && (
            <div className="rounded-lg p-4 border" style={{ background: '#242424', borderColor: '#383838', color: '#00FFB2' }}>
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Star className="w-4 h-4" style={{ color: '#00FFB2' }} />
                Bônus de Evolução Ativo
              </h4>
              <p className="text-sm" style={{ color: '#B0B0B0' }}>
                {gameData.evolution_system.evolution_bonuses[`stage_${currentStage}`].description}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    );
  } catch (error) {
    console.error('Erro no PlayerProfile:', error);
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50"
      >
        <div className="bg-gradient-to-br from-black via-gray-900 to-gray-800/90 rounded-2xl p-6 max-w-md w-full border border-gray-800 text-white shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Erro no Perfil</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
              <XCircle className="w-6 h-6" />
            </button>
          </div>
          <p className="text-red-400">Ocorreu um erro ao carregar o perfil. Tente novamente.</p>
          <p className="text-sm text-gray-400 mt-2">Erro: {error.message}</p>
        </div>
      </motion.div>
    );
  }
};

// Componente de seleção de localidade
const LocationSelector = ({ onLocationSelect, completedLocations = [], userProgress = {}, userStats, onShowProfile, onShowCityMap }) => {
  const currentStage = getCurrentStage(userStats.totalXP);
  const evolutionProgress = getEvolutionProgress(userStats.totalXP);
  const stageInfo = gameData.evolution_system.stages[currentStage - 1];
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="overflow-hidden"
      style={{ background: '#0D0D0D', minHeight: '100dvh', height: '100dvh' }}
    >
      <div className="h-full max-w-[475px] mx-auto flex flex-col p-4 rounded-xl shadow-xl"
        style={{ background: '#181818', color: '#FFFFFF', border: '1px solid #242424' }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-4 flex-shrink-0"
        >
          {/* Header com perfil do jogador */}
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold" style={{ color: '#FFFFFF' }}>Escolha uma Localidade</h2>
            <div className="flex gap-2">
              <button
                onClick={onShowCityMap}
                className="px-3 py-2 rounded-lg text-xs font-bold transition-colors"
                style={{ background: '#003366', color: '#FFFFFF', border: '1px solid #242424' }}
                onMouseOver={e => e.currentTarget.style.background = '#0A84FF'}
                onMouseOut={e => e.currentTarget.style.background = '#003366'}
              >
                Voltar ao Mapa
              </button>
              <button
                onClick={onShowProfile}
                className="p-2 rounded-full transition-colors"
                style={{ background: '#0A84FF', color: '#FFFFFF', border: '1px solid #242424' }}
                onMouseOver={e => e.currentTarget.style.background = '#0066CC'}
                onMouseOut={e => e.currentTarget.style.background = '#0A84FF'}
              >
                <User className="w-4 h-4" style={{ color: '#FFFFFF' }} />
              </button>
            </div>
          </div>
          <p className="mb-3 text-sm" style={{ color: '#B0B0B0' }}>Selecione onde você quer começar sua jornada</p>
          {/* Status do personagem com evolução */}
          <div className="rounded-lg p-3 shadow-sm mb-3 border" style={{ background: '#242424', borderColor: '#383838', color: '#FFFFFF' }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2" style={{ borderColor: '#66B2FF' }}>
                <img 
                  src={evolutionImages[currentStage]} 
                  alt={stageInfo.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-base font-semibold" style={{ color: '#FFFFFF' }}>{stageInfo.name}</h3>
                <div className="flex items-center gap-3 text-xs">
                  <span style={{ color: '#0A84FF' }}>Nível {userStats.level}</span>
                  <span style={{ color: '#B0B0B0' }}>{userStats.totalXP} XP</span>
                </div>
              </div>
            </div>
            {/* Progresso de evolução */}
            {evolutionProgress.next_stage_xp && (
              <div>
                <div className="flex items-center justify-between mb-1 text-sm">
                  <span style={{ color: '#B0B0B0' }}>Próxima evolução</span>
                  <span style={{ color: '#B0B0B0' }}>{evolutionProgress.progress_percentage.toFixed(1)}%</span>
                </div>
                <div className="w-full rounded-full h-2" style={{ background: '#383838' }}>
                  <div 
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ width: `${evolutionProgress.progress_percentage}%`, background: 'linear-gradient(90deg, #0A84FF 0%, #66B2FF 100%)' }}
                  />
                </div>
                <p className="text-xs mt-1" style={{ color: '#B0B0B0' }}>
                  {evolutionProgress.xp_to_next} XP para {currentStage < 5 ? gameData.evolution_system.stages[currentStage].name : 'Máximo'}
                </p>
              </div>
            )}
          </div>
          {/* Progresso geral */}
          <div className="rounded-lg p-4 shadow-sm border" style={{ background: '#242424', borderColor: '#383838', color: '#FFFFFF' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium" style={{ color: '#B0B0B0' }}>Progresso Geral</span>
              <span className="text-sm" style={{ color: '#B0B0B0' }}>
                {completedLocations.length}/{gameData.localidades.length}
              </span>
            </div>
            <div className="w-full rounded-full h-2" style={{ background: '#383838' }}>
              <div 
                className="h-2 rounded-full transition-all duration-500"
                style={{ width: `${(completedLocations.length / gameData.localidades.length) * 100}%`, background: '#0A84FF' }}
              />
            </div>
          </div>
        </motion.div>
        <div className="flex-1 overflow-y-auto space-y-3 min-h-0 py-2 pr-3">
          {gameData.localidades.map((location) => {
            const Icon = locationIcons[location.id] || MapPin;
            const questionsCount = gameData.perguntas.filter(q => q.localidade === location.id).length;
            const isCompleted = completedLocations.includes(location.id);
            const locationProgress = userProgress[location.id] || { score: 0, questionsAnswered: 0 };
            return (
              <button
                key={location.id}
                onClick={() => onLocationSelect(location)}
                className="w-full rounded-xl p-5 shadow-lg border-2 transition-all relative overflow-hidden"
                style={{ background: '#242424', borderColor: isCompleted ? '#0A84FF' : '#383838', color: '#FFFFFF' }}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center relative"
                    style={{ background: location.cor_tema || '#181818', border: '2px solid #242424' }}
                  >
                    <Icon className="w-6 h-6" style={{ color: '#FFFFFF' }} />
                    {isCompleted && (
                      <div className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: '#0A84FF' }}>
                        <CheckCircle className="w-3 h-3" style={{ color: '#FFFFFF' }} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-base font-bold" style={{ color: '#FFFFFF' }}>{location.nome}</h3>
                    <p className="text-xs mb-3" style={{ color: '#B0B0B0' }}>{location.descricao}</p>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs">
                        <span className="px-2 py-0.5 rounded-full border" style={{ background: '#181818', color: '#B0B0B0', borderColor: '#383838' }}>
                          {questionsCount} perguntas
                        </span>
                      </div>
                      {locationProgress.questionsAnswered > 0 && (
                        <div className="flex items-center gap-1 text-xs">
                          <span className="px-2 py-0.5 rounded-full border" style={{ background: '#003366', color: '#66B2FF', borderColor: '#0A84FF' }}>
                            {locationProgress.questionsAnswered}/{questionsCount}
                          </span>
                        </div>
                      )}
                      {isCompleted && (
                        <div className="flex items-center gap-1 text-xs">
                          <span className="px-2 py-0.5 rounded-full flex items-center gap-1 border" style={{ background: '#0A84FF', color: '#FFFFFF', borderColor: '#0A84FF' }}>
                            <Trophy className="w-3 h-3" style={{ color: '#FFFFFF' }} />
                            Concluído
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5" style={{ color: '#B0B0B0' }} />
                </div>
                {isCompleted && (
                  <div className="absolute top-1 right-1">
                    <Star className="w-4 h-4" style={{ color: '#0A84FF' }} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

// Componente de pergunta do quiz (atualizado com sistema de XP)
const QuizQuestion = ({ 
  question, 
  questionIndex, 
  totalQuestions, 
  onAnswer, 
  selectedAnswer, 
  showResult,
  onNext,
  onPrevious,
  canGoNext,
  canGoPrevious,
  userStats,
  onQuitQuiz
}) => {
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    if (!showResult && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      onAnswer(null, 0); // Resposta em branco por timeout
    }
  }, [timeLeft, showResult, onAnswer]);

  useEffect(() => {
    setTimeLeft(30); // Reset timer para nova pergunta
  }, [questionIndex]);

  const handleAnswer = (answerIndex) => {
    const responseTime = 30 - timeLeft;
    onAnswer(answerIndex, responseTime);
  };

  // Calcular XP ganho
  const calculateXP = () => {
    if (selectedAnswer === null || !question.alternativas[selectedAnswer]?.correta) return 0;
    
    const baseXP = gameData.xp_sistema.base_xp[question.tipo] || 20;
    const timeMultiplier = timeLeft >= 25 ? 1.5 : timeLeft >= 20 ? 1.3 : timeLeft >= 15 ? 1.1 : 1.0;
    const difficultyMultiplier = gameData.xp_sistema.multiplicadores.dificuldade_localidade[question.localidade] || 1.0;
    
    return Math.round(baseXP * timeMultiplier * difficultyMultiplier);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="overflow-hidden"
      style={{ background: '#0D0D0D', minHeight: '100dvh', height: '100dvh' }}
    >
      <div className="h-full max-w-[475px] mx-auto flex flex-col p-4">
        {/* Header com progresso e stats */}
        <div className="mb-4 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={onQuitQuiz}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-colors"
              style={{ background: '#383838', color: '#FFFFFF', border: '1px solid #242424' }}
              onMouseOver={e => e.currentTarget.style.background = '#242424'}
              onMouseOut={e => e.currentTarget.style.background = '#383838'}
            >
              <ArrowLeft className="w-4 h-4" style={{ color: '#FFFFFF' }} />
              Sair
            </button>
            <span className="text-sm font-medium" style={{ color: '#B0B0B0' }}>
              {questionIndex + 1} de {totalQuestions}
            </span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-sm" style={{ color: '#B0B0B0' }}>
                <Clock className="w-4 h-4" style={{ color: timeLeft <= 10 ? '#FF3B30' : '#B0B0B0' }} />
                <span style={{ color: timeLeft <= 10 ? '#FF3B30' : '#B0B0B0', fontWeight: timeLeft <= 10 ? 'bold' : 'normal' }}>{timeLeft}s</span>
              </div>
              <div className="flex items-center gap-1 text-sm" style={{ color: '#0A84FF' }}>
                <Star className="w-4 h-4" style={{ color: '#0A84FF' }} />
                <span>{userStats.totalXP} XP</span>
              </div>
            </div>
          </div>
          {/* Barra de progresso */}
          <div className="w-full rounded-full h-2" style={{ background: '#383838' }}>
            <div 
              className="h-2 rounded-full transition-all duration-300"
              style={{ width: `${((questionIndex + 1) / totalQuestions) * 100}%`, background: 'linear-gradient(90deg, #0A84FF 0%, #66B2FF 100%)' }}
            />
          </div>
        </div>
        {/* Pergunta */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-xl p-4 shadow-lg mb-4 flex-1 overflow-y-auto border"
          style={{ background: '#181818', borderColor: '#242424', color: '#FFFFFF' }}
        >
          <div className="mb-3">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 border"
              style={{ background: '#003366', color: '#66B2FF', borderColor: '#0A84FF' }}
            >
              {question.tipo.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          <h3 className="text-base font-bold mb-4 leading-relaxed" style={{ color: '#FFFFFF' }}>
            {question.texto}
          </h3>
          {/* Alternativas */}
          <div className="space-y-3">
            {question.alternativas.map((alternativa, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = alternativa.correta;
              let style = {
                border: '2px solid #242424',
                background: '#181818',
                color: '#B0B0B0',
                textAlign: 'left',
                transition: 'all 0.2s',
              };
              if (!showResult) {
                if (isSelected) {
                  style = { ...style, border: '2px solid #0A84FF', background: '#003366', color: '#66B2FF' };
                }
              } else {
                if (isCorrect) {
                  style = { ...style, border: '2px solid #00C851', background: '#1C1C1C', color: '#00FFB2' };
                } else if (isSelected && !isCorrect) {
                  style = { ...style, border: '2px solid #FF3B30', background: '#383838', color: '#FF3B30' };
                } else {
                  style = { ...style, border: '2px solid #242424', background: '#181818', color: '#B0B0B0' };
                }
              }
              return (
                <motion.button
                  key={index}
                  whileHover={!showResult ? { scale: 1.01 } : {}}
                  whileTap={!showResult ? { scale: 0.99 } : {}}
                  onClick={() => !showResult && handleAnswer(index)}
                  disabled={showResult}
                  className="w-full p-3 rounded-lg"
                  style={style}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold"
                      style={{ background: '#242424', color: '#FFFFFF', borderColor: '#0A84FF' }}
                    >
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="flex-1 text-sm">{alternativa.texto}</span>
                    {showResult && isCorrect && (
                      <CheckCircle className="w-4 h-4" style={{ color: '#00FFB2' }} />
                    )}
                    {showResult && isSelected && !isCorrect && (
                      <XCircle className="w-4 h-4" style={{ color: '#FF3B30' }} />
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
          {/* Feedback da resposta */}
          {showResult && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 p-3 rounded-lg border"
              style={{ background: '#242424', borderColor: '#383838', color: '#B0B0B0' }}
            >
              <div className="flex items-center gap-2 mb-2">
                {selectedAnswer !== null && question.alternativas[selectedAnswer]?.correta ? (
                  <>
                    <CheckCircle className="w-4 h-4" style={{ color: '#00FFB2' }} />
                    <span className="font-medium text-sm" style={{ color: '#00FFB2' }}>Resposta Correta!</span>
                    <div className="ml-auto flex items-center gap-1" style={{ color: '#0A84FF' }}>
                      <Star className="w-4 h-4" style={{ color: '#0A84FF' }} />
                      <span className="text-xs font-bold">+{calculateXP()} XP</span>
                    </div>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4" style={{ color: '#FF3B30' }} />
                    <span className="font-medium text-sm" style={{ color: '#FF3B30' }}>
                      {selectedAnswer === null ? 'Tempo Esgotado!' : 'Resposta Incorreta'}
                    </span>
                  </>
                )}
              </div>
              {question.alternativas.find(alt => alt.feedback) && (
                <p className="text-xs" style={{ color: '#B0B0B0' }}>
                  {question.alternativas.find(alt => alt.feedback)?.feedback}
                </p>
              )}
            </motion.div>
          )}
        </motion.div>
        {/* Navegação */}
        <div className="flex gap-3 flex-shrink-0 mt-2">
          {canGoPrevious && (
            <button
              onClick={onPrevious}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-colors"
              style={{ background: '#383838', color: '#FFFFFF', border: '1px solid #242424' }}
              onMouseOver={e => e.currentTarget.style.background = '#242424'}
              onMouseOut={e => e.currentTarget.style.background = '#383838'}
            >
              <ArrowLeft className="w-4 h-4" style={{ color: '#FFFFFF' }} />
              Anterior
            </button>
          )}
          <div className="flex-1" />
          {canGoNext && (
            <button
              onClick={onNext}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors"
              style={{ background: '#0A84FF', color: '#FFFFFF', border: '1px solid #242424' }}
              onMouseOver={e => e.currentTarget.style.background = '#0066CC'}
              onMouseOut={e => e.currentTarget.style.background = '#0A84FF'}
            >
              {questionIndex === totalQuestions - 1 ? 'Finalizar' : 'Próxima'}
              <ArrowRight className="w-5 h-5" style={{ color: '#FFFFFF' }} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Componente de resultados (atualizado com habilidades)
const ResultScreen = ({ 
  location, 
  score, 
  totalQuestions, 
  correctAnswers, 
  unlockedSuperpowers, 
  onBackToLocations,
  onRetry,
  userStats,
  skillsGained
}) => {
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  const isExcellent = percentage >= 80;
  const isGood = percentage >= 60;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ background: '#0D0D0D', color: '#FFFFFF' }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-8"
      >
        <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6 mx-auto shadow-2xl border-2"
          style={{ background: '#181818', borderColor: '#242424' }}
        >
          {isExcellent ? (
            <Trophy className="w-12 h-12" style={{ color: '#FFD700' }} />
          ) : isGood ? (
            <Award className="w-12 h-12" style={{ color: '#0A84FF' }} />
          ) : (
            <Star className="w-12 h-12" style={{ color: '#B0B0B0' }} />
          )}
        </div>
        <h1 className="text-3xl font-bold mb-2">
          {isExcellent ? 'Excelente!' : isGood ? 'Muito Bem!' : 'Continue Tentando!'}
        </h1>
        <h2 className="text-xl mb-4">{location.nome} Concluída</h2>
      </motion.div>
      {/* Estatísticas */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl p-6 mb-6 w-full max-w-sm border shadow-lg"
        style={{ background: '#181818', borderColor: '#242424', color: '#FFFFFF' }}
      >
        <h3 className="text-lg font-semibold mb-4 text-center">Seus Resultados</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span style={{ color: '#B0B0B0' }}>XP Ganho:</span>
            <span className="font-bold text-xl" style={{ color: '#0A84FF' }}>{score} XP</span>
          </div>
          <div className="flex justify-between items-center">
            <span style={{ color: '#B0B0B0' }}>Acertos:</span>
            <span className="font-bold" style={{ color: '#FFFFFF' }}>{correctAnswers}/{totalQuestions}</span>
          </div>
          <div className="flex justify-between items-center">
            <span style={{ color: '#B0B0B0' }}>Percentual:</span>
            <span className="font-bold" style={{ color: '#FFFFFF' }}>{percentage}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span style={{ color: '#B0B0B0' }}>Nível Atual:</span>
            <span className="font-bold" style={{ color: '#0A84FF' }}>{userStats.level}</span>
          </div>
          {/* Barra de progresso */}
          <div className="w-full rounded-full h-3" style={{ background: '#383838' }}>
            <div 
              className="h-3 rounded-full transition-all duration-1000"
              style={{ width: `${percentage}%`, background: isExcellent ? '#00FFB2' : isGood ? '#FFD700' : '#FF3B30' }}
            />
          </div>
        </div>
      </motion.div>
      {/* Habilidades desenvolvidas */}
      {skillsGained && skillsGained.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="rounded-2xl p-6 mb-6 w-full max-w-sm border shadow-lg"
          style={{ background: '#181818', borderColor: '#242424', color: '#FFFFFF' }}
        >
          <h3 className="text-lg font-semibold mb-4 text-center flex items-center justify-center gap-2">
            <TrendingUp className="w-5 h-5" style={{ color: '#FFD700' }} />
            Habilidades Desenvolvidas
          </h3>
          <div className="space-y-2">
            {skillsGained.map((skill, index) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="rounded-lg p-3 flex items-center gap-3"
                style={{ background: '#242424', color: '#FFFFFF' }}
              >
                <Target className="w-5 h-5" style={{ color: '#FFD700' }} />
                <div>
                  <div className="font-medium">{skill.nome}</div>
                  <div className="text-sm opacity-90">+{skill.xpGained} XP</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
      {/* Superpoderes desbloqueados */}
      {unlockedSuperpowers.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="rounded-2xl p-6 mb-6 w-full max-w-sm border shadow-lg"
          style={{ background: '#181818', borderColor: '#242424', color: '#FFFFFF' }}
        >
          <h3 className="text-lg font-semibold mb-4 text-center flex items-center justify-center gap-2">
            <Zap className="w-5 h-5" style={{ color: '#0A84FF' }} />
            Superpoderes Desbloqueados
          </h3>
          <div className="space-y-2">
            {unlockedSuperpowers.map((superpower, index) => (
              <motion.div
                key={superpower.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="rounded-lg p-3 flex items-center gap-3"
                style={{ background: '#242424', color: '#FFFFFF' }}
              >
                <Sparkles className="w-5 h-5" style={{ color: '#FFD700' }} />
                <div>
                  <div className="font-medium">{superpower.nome}</div>
                  <div className="text-sm opacity-90">{superpower.descricao}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
      {/* Botões de ação */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex gap-4 w-full max-w-sm"
      >
        <button
          onClick={onRetry}
          className="flex-1 px-6 py-3 rounded-lg font-medium transition-colors"
          style={{ background: '#242424', color: '#FFFFFF', border: '1px solid #383838' }}
          onMouseOver={e => e.currentTarget.style.background = '#383838'}
          onMouseOut={e => e.currentTarget.style.background = '#242424'}
        >
          Tentar Novamente
        </button>
        <button
          onClick={onBackToLocations}
          className="flex-1 px-6 py-3 rounded-lg font-medium border transition-colors"
          style={{ background: '#0A84FF', color: '#FFFFFF', border: '1px solid #242424' }}
          onMouseOver={e => e.currentTarget.style.background = '#0066CC'}
          onMouseOut={e => e.currentTarget.style.background = '#0A84FF'}
        >
          Outras Localidades
        </button>
      </motion.div>
    </motion.div>
  );
};

// Componente principal da aplicação
function App() {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [showRoboDialog, setShowRoboDialog] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [completedLocations, setCompletedLocations] = useState([]);
  const [userProgress, setUserProgress] = useState({});
  const [unlockedSuperpowers, setUnlockedSuperpowers] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  
  // Sistema de stats do usuário
  const [userStats, setUserStats] = useState({
    totalXP: 0,
    level: 1,
    skills: {},
    characterEvolution: 0
  });

  // Carregar progresso do localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('quiz-sebrae-progress');
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      setCompletedLocations(progress.completedLocations || []);
      setUserProgress(progress.userProgress || {});
      setUnlockedSuperpowers(progress.unlockedSuperpowers || []);
      setUserStats(progress.userStats || { totalXP: 0, level: 1, skills: {}, characterEvolution: 0 });
    }
  }, []);

  // Salvar progresso no localStorage
  const saveProgress = (newCompletedLocations, newUserProgress, newUnlockedSuperpowers, newUserStats) => {
    const progress = {
      completedLocations: newCompletedLocations,
      userProgress: newUserProgress,
      unlockedSuperpowers: newUnlockedSuperpowers,
      userStats: newUserStats
    };
    localStorage.setItem('quiz-sebrae-progress', JSON.stringify(progress));
  };

  const handleStart = () => {
    setShowRoboDialog(true);
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setShowResult(false);
    setSelectedAnswer(null);
    setCurrentScreen('quiz');
  };

  const handleAnswer = (answerIndex, responseTime) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = { answerIndex, responseTime };
    setUserAnswers(newAnswers);
  };

  const handleNext = () => {
    const questions = gameData.perguntas.filter(q => q.localidade === selectedLocation.id);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowResult(false);
      setSelectedAnswer(null);
    } else {
      // Finalizar quiz
      finishQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      const prevAnswer = userAnswers[currentQuestionIndex - 1];
      setSelectedAnswer(prevAnswer ? prevAnswer.answerIndex : null);
      setShowResult(prevAnswer !== undefined);
    }
  };

  const finishQuiz = () => {
    const questions = gameData.perguntas.filter(q => q.localidade === selectedLocation.id);
    let totalXPGained = 0;
    let correctAnswers = 0;
    
    // Calcular XP e habilidades
    userAnswers.forEach((answer, index) => {
      if (answer && answer.answerIndex !== null && questions[index]?.alternativas[answer.answerIndex]?.correta) {
        correctAnswers++;
        
        // Calcular XP
        const baseXP = gameData.xp_sistema.base_xp[questions[index].tipo] || 20;
        const timeLeft = 30 - (answer.responseTime || 30);
        const timeMultiplier = timeLeft >= 25 ? 1.5 : timeLeft >= 20 ? 1.3 : timeLeft >= 15 ? 1.1 : 1.0;
        const difficultyMultiplier = gameData.xp_sistema.multiplicadores.dificuldade_localidade[selectedLocation.id] || 1.0;
        
        const xpGained = Math.round(baseXP * timeMultiplier * difficultyMultiplier);
        totalXPGained += xpGained;
      }
    });

    // Atualizar stats do usuário
    const newUserStats = {
      ...userStats,
      totalXP: userStats.totalXP + totalXPGained,
      level: Math.floor((userStats.totalXP + totalXPGained) / 1000) + 1
    };

    // Atualizar progresso
    const newUserProgress = {
      ...userProgress,
      [selectedLocation.id]: {
        score: totalXPGained,
        questionsAnswered: questions.length,
        correctAnswers,
        percentage: (correctAnswers / questions.length) * 100,
        completed: true
      }
    };

    let newCompletedLocations = [...completedLocations];
    if (!completedLocations.includes(selectedLocation.id)) {
      newCompletedLocations.push(selectedLocation.id);
    }

    // Verificar superpoderes desbloqueados
    let newUnlockedSuperpowers = [...unlockedSuperpowers];
    const percentage = (correctAnswers / questions.length) * 100;
    if (percentage >= 70) {
      const availableSuperpowers = gameData.superpoderes.filter(
        sp => !unlockedSuperpowers.find(unlocked => unlocked.id === sp.id)
      );
      if (availableSuperpowers.length > 0) {
        newUnlockedSuperpowers.push(availableSuperpowers[0]);
      }
    }

    setUserStats(newUserStats);
    setUserProgress(newUserProgress);
    setCompletedLocations(newCompletedLocations);
    setUnlockedSuperpowers(newUnlockedSuperpowers);
    
    saveProgress(newCompletedLocations, newUserProgress, newUnlockedSuperpowers, newUserStats);
    
    setCurrentScreen('result');
  };

  const handleBackToLocations = () => {
    setCurrentScreen('cityMap');
    setSelectedLocation(null);
  };

  const handleShowLocationList = () => {
    setCurrentScreen('locationSelect');
  };

  const handleShowCityMap = () => {
    setCurrentScreen('cityMap');
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setShowResult(false);
    setSelectedAnswer(null);
    setCurrentScreen('quiz');
  };

  const handleQuitQuiz = () => {
    // Zerar progresso e voltar ao mapa
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setShowResult(false);
    setSelectedAnswer(null);
    setSelectedLocation(null);
    setCurrentScreen('cityMap');
  };

  const questions = selectedLocation ? 
    gameData.perguntas.filter(q => q.localidade === selectedLocation.id) : [];
  
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="App overflow-hidden">
      <AnimatePresence mode="wait">
        {currentScreen === 'welcome' && !showRoboDialog && (
          <div key="welcome">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="overflow-hidden relative"
              style={{ background: '#0D0D0D', minHeight: '100dvh', height: '100dvh' }}
            >
              <img 
                src={backgroundAppImg}
                alt="Fundo App" 
                className="absolute inset-0 w-full h-full object-cover z-0 select-none pointer-events-none" 
                style={{ filter: 'blur(1px)' }}
                draggable={false}
              />
              <div className="absolute inset-0 z-10" style={{ background: 'rgba(13,13,13,0.7)' }} />
              <div className="h-full max-w-[540px] mx-auto flex flex-col items-center justify-center p-6 relative z-20" style={{ color: '#FFFFFF' }}>
                <div className="flex flex-col items-center mb-8 w-full">
                  <img src={roboDialogo} alt="Robô" className="w-40 h-40 object-contain drop-shadow-2xl mb-4" draggable={false} />
                  <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center tracking-tight">SUPER HERO</h1>
                  <h2 className="text-lg md:text-xl font-semibold mb-4 text-center">Bem-vindo à Jornada Épica de Flyp!</h2>
                  <p className="text-base md:text-lg opacity-90 text-center mb-4 max-w-xl mx-auto">
                    Prepare-se para ajudar Flyp a reconstruir a cidade e se tornar um verdadeiro empreendedor!<br/>
                    <br/>
                    <span className="font-semibold text-[#0A84FF]">Como funciona o jogo?</span><br/>
                    Você vai responder perguntas, ganhar XP e evoluir seu personagem. A cada fase, Flyp aprende e se desenvolve:
                  </p>
                  <ul className="text-sm opacity-90 text-left mb-4 max-w-xl mx-auto list-disc pl-6">
                    <li><b>Fase 1: O Despertar Empreendedor</b> – Fundamentos do empreendedorismo, habilidades técnicas e primeiros passos na liderança.</li>
                    <li><b>Fase 2: A Evolução Liderança</b> – Liderança, gestão de equipes, comunicação, networking e pensamento estratégico.</li>
                    <li><b>Fase 3: O Empreendedor Completo</b> – Visão empreendedora, inovação, criatividade e impacto social positivo.</li>
                  </ul>
                  <button
                    onClick={handleStart}
                    className="px-7 py-3 rounded-full font-bold text-base shadow-2xl flex items-center gap-2 transition-colors justify-center mt-2"
                    style={{ background: '#0A84FF', color: '#FFFFFF' }}
                    onMouseOver={e => e.currentTarget.style.background = '#0066CC'}
                    onMouseOut={e => e.currentTarget.style.background = '#0A84FF'}
                  >
                    <Play className="w-5 h-5" style={{ color: '#FFFFFF' }} />
                    Começar Jornada
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}



        {showRoboDialog && (
          <RoboDialogScreens key="robo-dialog" onFinish={() => { setShowRoboDialog(false); setCurrentScreen('cityMap'); }} />
        )}
        {currentScreen === 'cityMap' && !showRoboDialog && (
          <CityMap 
            key="cityMap"
            locations={gameData.localidades}
            onLocationSelect={handleLocationSelect}
            completedLocations={completedLocations}
            userProgress={userProgress}
            userStats={userStats}
            onShowProfile={() => setShowProfile(true)}
            onShowLocationList={handleShowLocationList}
            evolutionImages={evolutionImages}
            currentStage={getCurrentStage(userStats.totalXP)}
            stageInfo={gameData.evolution_system.stages[getCurrentStage(userStats.totalXP) - 1]}
            evolutionProgress={getEvolutionProgress(userStats.totalXP)}
            gameData={gameData}
          />
        )}
        {currentScreen === 'locationSelect' && !showRoboDialog && (
          <LocationSelector 
            key="locationSelect" 
            onLocationSelect={handleLocationSelect}
            completedLocations={completedLocations}
            userProgress={userProgress}
            userStats={userStats}
            onShowProfile={() => setShowProfile(true)}
            onShowCityMap={handleShowCityMap}
          />
        )}
        {currentScreen === 'quiz' && currentQuestion && !showRoboDialog && (
          <QuizQuestion
            key={`quiz-${currentQuestionIndex}`}
            question={currentQuestion}
            questionIndex={currentQuestionIndex}
            totalQuestions={questions.length}
            onAnswer={handleAnswer}
            selectedAnswer={selectedAnswer}
            showResult={showResult}
            onNext={handleNext}
            onPrevious={handlePrevious}
            canGoNext={showResult}
            canGoPrevious={currentQuestionIndex > 0}
            userStats={userStats}
            onQuitQuiz={handleQuitQuiz}
          />
        )}
        {currentScreen === 'result' && selectedLocation && !showRoboDialog && (
          <ResultScreen
            key="result"
            location={selectedLocation}
            score={userProgress[selectedLocation.id]?.score || 0}
            totalQuestions={questions.length}
            correctAnswers={userProgress[selectedLocation.id]?.correctAnswers || 0}
            unlockedSuperpowers={unlockedSuperpowers.slice(-1)}
            onBackToLocations={handleBackToLocations}
            onRetry={handleRetry}
            userStats={userStats}
            skillsGained={[]}
          />
        )}
      </AnimatePresence>
      {showProfile && (
        <PlayerProfile 
          userStats={userStats}
          onClose={() => setShowProfile(false)}
        />
      )}
    </div>
  );
}

export default App;

