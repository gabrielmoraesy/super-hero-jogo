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
import gameData from './assets/jogo_sebrae_corrigido.json';
import EvolutionDisplay from './components/EvolutionDisplay';
import CityMap from './components/CityMap';

// Importar imagens de evolução
import stage1 from './assets/evolution_stage_1.png';
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

// Componente de tela inicial
const WelcomeScreen = ({ onStart }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 overflow-hidden"
    >
      <div className="h-full max-w-[475px] mx-auto flex flex-col items-center justify-center p-6 text-white">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
          className="text-center mb-6"
        >
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 mx-auto shadow-2xl">
            <Trophy className="w-10 h-10 text-yellow-500" />
          </div>
          <h1 className="text-3xl font-bold mb-3">Quiz Sebrae</h1>
          <h2 className="text-lg font-medium mb-2">Reconstrução da Cidade</h2>
          <p className="text-base opacity-90">Desenvolva suas habilidades empreendedoras</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mb-6"
        >
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-4">
            <h3 className="text-base font-semibold mb-3">Como Jogar</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-yellow-300" />
                <span>Escolha uma localidade para explorar</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-300" />
                <span>Responda perguntas e ganhe XP</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-300" />
                <span>Desenvolva habilidades e superpoderes</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-yellow-300" />
                <span>Evolua de robô para humano</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onStart}
          className="bg-white text-gray-800 px-6 py-3 rounded-full font-bold text-base shadow-2xl flex items-center gap-2 hover:bg-gray-100 transition-colors"
        >
          <Play className="w-5 h-5" />
          Começar Jornada
          <ArrowRight className="w-5 h-5" />
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-center text-xs opacity-75"
        >
          <p>{gameData.localidades.length} localidades • {gameData.perguntas.length} perguntas</p>
          <p>9 habilidades • 8 superpoderes • Sistema de evolução</p>
        </motion.div>
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
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50"
      >
        <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Seu Perfil</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <XCircle className="w-6 h-6" />
            </button>
          </div>

          {/* Evolução do personagem */}
          <div className="mb-6 text-center">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-200 shadow-lg mx-auto mb-4">
              <img 
                src={evolutionImages[currentStage]} 
                alt={stageInfo?.name || 'Personagem'}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">{stageInfo?.name || 'Carregando...'}</h3>
            <p className="text-sm text-gray-600 mb-2">{stageInfo?.description || ''}</p>
            
            <div className="flex items-center justify-center gap-4 text-sm mb-4">
              <div className="flex items-center gap-1 text-blue-600">
                <Star className="w-4 h-4" />
                <span>{totalXP} XP</span>
              </div>
              <div className="flex items-center gap-1 text-purple-600">
                <Award className="w-4 h-4" />
                <span>Nível {level}</span>
              </div>
            </div>

            {/* Progresso de evolução */}
            {evolutionProgress.next_stage_xp && (
              <div>
                <div className="flex items-center justify-between mb-2 text-sm">
                  <span className="text-gray-600">Próxima evolução</span>
                  <span className="text-gray-500">{evolutionProgress.progress_percentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${evolutionProgress.progress_percentage}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  {evolutionProgress.xp_to_next} XP para {currentStage < 5 ? gameData.evolution_system.stages[currentStage].name : 'Máximo'}
                </p>
              </div>
            )}
          </div>

          {/* Características atuais */}
          {stageInfo?.characteristics && (
            <div className="mb-6">
              <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <User className="w-4 h-4" />
                Características
              </h4>
              <div className="space-y-2">
                {stageInfo.characteristics.map((characteristic, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span>{characteristic}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Habilidades */}
          {gameData.habilidades?.categorias && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Habilidades
              </h3>
              
              {Object.entries(gameData.habilidades.categorias).map(([catId, categoria]) => {
                const Icon = skillCategoryIcons[catId] || User;
                return (
                  <div key={catId} className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-4 h-4" style={{ color: categoria.cor }} />
                      <span className="text-sm font-medium text-gray-700">{categoria.nome}</span>
                    </div>
                    
                    {categoria.habilidades?.map(habilidade => {
                      const skillLevel = skills?.[habilidade.id] || 0;
                      const maxLevel = habilidade.nivel_maximo;
                      
                      return (
                        <div key={habilidade.id} className="ml-6 mb-2">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-gray-600">{habilidade.nome}</span>
                            <span className="text-xs text-gray-500">{skillLevel}/{maxLevel}</span>
                          </div>
                          <div className="bg-gray-200 rounded-full h-1">
                            <div 
                              className="h-1 rounded-full transition-all duration-500"
                              style={{ 
                                backgroundColor: categoria.cor,
                                width: `${(skillLevel / maxLevel) * 100}%`
                              }}
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
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Superpoderes
              </h3>
              
              <div className="space-y-2">
                {unlockedSuperpowers.map(superpoder => (
                  <div key={superpoder.id} className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm font-medium text-gray-800">{superpoder.nome}</span>
                    </div>
                    <p className="text-xs text-gray-600">{superpoder.descricao}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bônus de evolução */}
          {currentStage > 1 && gameData.evolution_system?.evolution_bonuses?.[`stage_${currentStage}`] && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Star className="w-4 h-4 text-green-500" />
                Bônus de Evolução Ativo
              </h4>
              <p className="text-sm text-gray-600">
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
        <div className="bg-white rounded-2xl p-6 max-w-md w-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Erro no Perfil</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <XCircle className="w-6 h-6" />
            </button>
          </div>
          <p className="text-red-600">Ocorreu um erro ao carregar o perfil. Tente novamente.</p>
          <p className="text-sm text-gray-500 mt-2">Erro: {error.message}</p>
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
      className="h-screen bg-gray-50 overflow-hidden"
    >
      <div className="h-full max-w-[475px] mx-auto flex flex-col p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-4 flex-shrink-0"
        >
          {/* Header com perfil do jogador */}
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-gray-800">Escolha uma Localidade</h2>
            <div className="flex gap-2">
              <button
                onClick={onShowCityMap}
                className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors text-xs"
              >
                Voltar ao Mapa
              </button>
              <button
                onClick={onShowProfile}
                className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
              >
                <User className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <p className="text-gray-600 mb-3 text-sm">Selecione onde você quer começar sua jornada</p>
          
          {/* Status do personagem com evolução */}
          <div className="bg-white rounded-lg p-3 shadow-sm mb-3">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-200">
                <img 
                  src={evolutionImages[currentStage]} 
                  alt={stageInfo.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 text-left">
                <h3 className="text-base font-semibold text-gray-800">{stageInfo.name}</h3>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-blue-600">Nível {userStats.level}</span>
                  <span className="text-gray-500">{userStats.totalXP} XP</span>
                </div>
              </div>
            </div>
            
            {/* Progresso de evolução */}
            {evolutionProgress.next_stage_xp && (
              <div>
                <div className="flex items-center justify-between mb-1 text-sm">
                  <span className="text-gray-600">Próxima evolução</span>
                  <span className="text-gray-500">{evolutionProgress.progress_percentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${evolutionProgress.progress_percentage}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {evolutionProgress.xp_to_next} XP para {currentStage < 5 ? gameData.evolution_system.stages[currentStage].name : 'Máximo'}
                </p>
              </div>
            )}
          </div>
          
          {/* Progresso geral */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progresso Geral</span>
              <span className="text-sm text-gray-500">
                {completedLocations.length}/{gameData.localidades.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(completedLocations.length / gameData.localidades.length) * 100}%` }}
              />
            </div>
          </div>
        </motion.div>

        <div className="flex-1 overflow-y-auto space-y-3 min-h-0 py-2 pr-3">{/* Adicionado scroll e padding à direita */}
          {gameData.localidades.map((location) => {
            const Icon = locationIcons[location.id] || MapPin;
            const questionsCount = gameData.perguntas.filter(q => q.localidade === location.id).length;
            const isCompleted = completedLocations.includes(location.id);
            const locationProgress = userProgress[location.id] || { score: 0, questionsAnswered: 0 };
            
            return (
              <button
                key={location.id}
                onClick={() => onLocationSelect(location)}
                className="w-full bg-white rounded-xl p-5 shadow-lg border-2 border-transparent hover:border-blue-200 transition-all relative overflow-hidden"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white relative"
                    style={{ backgroundColor: location.cor_tema }}
                  >
                    <Icon className="w-6 h-6" />
                    {isCompleted && (
                      <div className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 text-left">
                    <h3 className="text-base font-bold text-gray-800">{location.nome}</h3>
                    <p className="text-xs text-gray-600 mb-3">{location.descricao}</p>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs">
                        <span className="bg-gray-100 px-2 py-0.5 rounded-full text-gray-700">
                          {questionsCount} perguntas
                        </span>
                      </div>
                      {locationProgress.questionsAnswered > 0 && (
                        <div className="flex items-center gap-1 text-xs">
                          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                            {locationProgress.questionsAnswered}/{questionsCount}
                          </span>
                        </div>
                      )}
                      {isCompleted && (
                        <div className="flex items-center gap-1 text-xs">
                          <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Trophy className="w-3 h-3" />
                            Concluído
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
                
                {isCompleted && (
                  <div className="absolute top-1 right-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
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
      className="h-screen bg-gray-50 overflow-hidden"
    >
      <div className="h-full max-w-[475px] mx-auto flex flex-col p-4">
        {/* Header com progresso e stats */}
        <div className="mb-4 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={onQuitQuiz}
              className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Sair
            </button>
            <span className="text-sm font-medium text-gray-600">
              {questionIndex + 1} de {totalQuestions}
            </span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span className={timeLeft <= 10 ? 'text-red-500 font-bold' : ''}>{timeLeft}s</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-blue-600">
                <Star className="w-4 h-4" />
                <span>{userStats.totalXP} XP</span>
              </div>
            </div>
          </div>
          
          {/* Barra de progresso */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((questionIndex + 1) / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        {/* Pergunta */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl p-4 shadow-lg mb-4 flex-1 overflow-y-auto"
        >
          <div className="mb-3">
            <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium mb-3">
              {question.tipo.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          
          <h3 className="text-base font-bold text-gray-800 mb-4 leading-relaxed">
            {question.texto}
          </h3>
          
          {/* Alternativas */}
          <div className="space-y-3">
            {question.alternativas.map((alternativa, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = alternativa.correta;
              
              let buttonClass = "w-full p-3 rounded-lg border-2 text-left transition-all ";
              
              if (!showResult) {
                buttonClass += isSelected 
                  ? "border-blue-500 bg-blue-50 text-blue-700" 
                  : "border-gray-200 bg-white hover:border-gray-300 text-gray-700";
              } else {
                if (isCorrect) {
                  buttonClass += "border-green-500 bg-green-50 text-green-700";
                } else if (isSelected && !isCorrect) {
                  buttonClass += "border-red-500 bg-red-50 text-red-700";
                } else {
                  buttonClass += "border-gray-200 bg-gray-50 text-gray-500";
                }
              }
              
              return (
                <motion.button
                  key={index}
                  whileHover={!showResult ? { scale: 1.01 } : {}}
                  whileTap={!showResult ? { scale: 0.99 } : {}}
                  onClick={() => !showResult && handleAnswer(index)}
                  disabled={showResult}
                  className={buttonClass}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="flex-1 text-sm">{alternativa.texto}</span>
                    {showResult && isCorrect && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                    {showResult && isSelected && !isCorrect && (
                      <XCircle className="w-4 h-4 text-red-500" />
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
              className="mt-3 p-3 rounded-lg bg-gray-50"
            >
              <div className="flex items-center gap-2 mb-2">
                {selectedAnswer !== null && question.alternativas[selectedAnswer]?.correta ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="font-medium text-green-700 text-sm">Resposta Correta!</span>
                    <div className="ml-auto flex items-center gap-1 text-blue-600">
                      <Star className="w-4 h-4" />
                      <span className="text-xs font-bold">+{calculateXP()} XP</span>
                    </div>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span className="font-medium text-red-700 text-sm">
                      {selectedAnswer === null ? 'Tempo Esgotado!' : 'Resposta Incorreta'}
                    </span>
                  </>
                )}
              </div>
              {question.alternativas.find(alt => alt.feedback) && (
                <p className="text-xs text-gray-600">
                  {question.alternativas.find(alt => alt.feedback)?.feedback}
                </p>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Navegação */}
        <div className="flex gap-3 flex-shrink-0">
          {canGoPrevious && (
            <button
              onClick={onPrevious}
              className="flex items-center gap-2 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Anterior
            </button>
          )}
          
          <div className="flex-1" />
          
          {canGoNext && (
            <button
              onClick={onNext}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm"
            >
              {questionIndex === totalQuestions - 1 ? 'Finalizar' : 'Próxima'}
              <ArrowRight className="w-4 h-4" />
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
      className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex flex-col items-center justify-center p-6 text-white"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-8"
      >
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 mx-auto shadow-2xl">
          {isExcellent ? (
            <Trophy className="w-12 h-12 text-yellow-500" />
          ) : isGood ? (
            <Award className="w-12 h-12 text-blue-500" />
          ) : (
            <Star className="w-12 h-12 text-gray-500" />
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
        className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-6 w-full max-w-sm"
      >
        <h3 className="text-lg font-semibold mb-4 text-center">Seus Resultados</h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span>XP Ganho:</span>
            <span className="font-bold text-xl">{score} XP</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span>Acertos:</span>
            <span className="font-bold">{correctAnswers}/{totalQuestions}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span>Percentual:</span>
            <span className="font-bold">{percentage}%</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span>Nível Atual:</span>
            <span className="font-bold">{userStats.level}</span>
          </div>
          
          {/* Barra de progresso */}
          <div className="w-full bg-white/30 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-1000 ${
                isExcellent ? 'bg-green-400' : isGood ? 'bg-yellow-400' : 'bg-red-400'
              }`}
              style={{ width: `${percentage}%` }}
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
          className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-6 w-full max-w-sm"
        >
          <h3 className="text-lg font-semibold mb-4 text-center flex items-center justify-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Habilidades Desenvolvidas
          </h3>
          
          <div className="space-y-2">
            {skillsGained.map((skill, index) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="bg-white/30 rounded-lg p-3 flex items-center gap-3"
              >
                <Target className="w-5 h-5 text-yellow-300" />
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
          className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-6 w-full max-w-sm"
        >
          <h3 className="text-lg font-semibold mb-4 text-center flex items-center justify-center gap-2">
            <Zap className="w-5 h-5" />
            Superpoderes Desbloqueados
          </h3>
          
          <div className="space-y-2">
            {unlockedSuperpowers.map((superpower, index) => (
              <motion.div
                key={superpower.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="bg-white/30 rounded-lg p-3 flex items-center gap-3"
              >
                <Sparkles className="w-5 h-5 text-yellow-300" />
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
          className="flex-1 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg hover:bg-white/30 transition-colors font-medium"
        >
          Tentar Novamente
        </button>
        
        <button
          onClick={onBackToLocations}
          className="flex-1 bg-white text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium"
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
    setCurrentScreen('cityMap');
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
        {currentScreen === 'welcome' && (
          <WelcomeScreen key="welcome" onStart={handleStart} />
        )}
        
        {currentScreen === 'cityMap' && (
          <CityMap 
            key="cityMap"
            locations={gameData.localidades}
            onLocationSelect={handleLocationSelect}
            completedLocations={completedLocations}
            userProgress={userProgress}
            userStats={userStats}
            onShowProfile={() => setShowProfile(true)}
            onShowLocationList={handleShowLocationList}
          />
        )}
        
        {currentScreen === 'locationSelect' && (
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
        
        {currentScreen === 'quiz' && currentQuestion && (
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
        
        {currentScreen === 'result' && selectedLocation && (
          <ResultScreen
            key="result"
            location={selectedLocation}
            score={userProgress[selectedLocation.id]?.score || 0}
            totalQuestions={questions.length}
            correctAnswers={userProgress[selectedLocation.id]?.correctAnswers || 0}
            unlockedSuperpowers={unlockedSuperpowers.slice(-1)} // Último desbloqueado
            onBackToLocations={handleBackToLocations}
            onRetry={handleRetry}
            userStats={userStats}
            skillsGained={[]} // TODO: implementar skills gained
          />
        )}
      </AnimatePresence>
      
      {/* Modal de perfil */}
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

