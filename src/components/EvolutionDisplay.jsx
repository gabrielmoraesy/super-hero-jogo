import React from 'react';
import { Zap, TrendingUp, Star, Award } from 'lucide-react';

// Importar imagens de evolução
import stage1 from '../assets/evolution_stage_1.png';
import stage2 from '../assets/evolution_stage_2.png';
import stage3 from '../assets/evolution_stage_3.png';
import stage4 from '../assets/evolution_stage_4.png';
import stage5 from '../assets/evolution_stage_5.png';

const evolutionImages = {
  1: stage1,
  2: stage2,
  3: stage3,
  4: stage4,
  5: stage5
};

const EvolutionDisplay = ({ userStats, evolutionSystem, compact = false }) => {
  // Calcular estágio atual e progresso
  const getCurrentStage = (totalXP) => {
    let currentStage = 1;
    for (const stage of evolutionSystem.stages) {
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
    
    const nextStage = evolutionSystem.stages[currentStage]; // currentStage é 1-indexed, array é 0-indexed
    const currentStageXP = evolutionSystem.stages[currentStage - 1].xp_required;
    
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

  const currentStage = getCurrentStage(userStats.totalXP);
  const progress = getEvolutionProgress(userStats.totalXP);
  const stageInfo = evolutionSystem.stages[currentStage - 1];
  const nextStageInfo = currentStage < 5 ? evolutionSystem.stages[currentStage] : null;

  if (compact) {
    return (
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-200">
            <img 
              src={evolutionImages[currentStage]} 
              alt={stageInfo.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">{stageInfo.name}</span>
              <span className="text-xs text-gray-500">Nível {userStats.level}</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress.progress_percentage}%` }}
              />
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{userStats.totalXP} XP</span>
              {nextStageInfo && (
                <span>{progress.xp_to_next} XP para {nextStageInfo.name}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-lg"
    >
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <TrendingUp className="w-6 h-6 text-blue-500" />
        Evolução do Personagem
      </h3>

      {/* Imagem do estágio atual */}
      <div className="text-center mb-6">
        <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-blue-200 shadow-lg mb-4">
          <img 
            src={evolutionImages[currentStage]} 
            alt={stageInfo.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        <h4 className="text-lg font-bold text-gray-800">{stageInfo.name}</h4>
        <p className="text-sm text-gray-600 mb-2">{stageInfo.description}</p>
        
        <div className="flex items-center justify-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-blue-600">
            <Star className="w-4 h-4" />
            <span>{userStats.totalXP} XP</span>
          </div>
          <div className="flex items-center gap-1 text-purple-600">
            <Award className="w-4 h-4" />
            <span>Nível {userStats.level}</span>
          </div>
        </div>
      </div>

      {/* Progresso para próximo estágio */}
      {nextStageInfo && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Progresso para {nextStageInfo.name}
            </span>
            <span className="text-sm text-gray-500">
              {progress.progress_percentage.toFixed(1)}%
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress.progress_percentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full"
            />
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{userStats.totalXP} / {nextStageInfo.xp_required} XP</span>
            <span>{progress.xp_to_next} XP restantes</span>
          </div>
        </div>
      )}

      {/* Características do estágio atual */}
      <div className="mb-6">
        <h5 className="text-sm font-semibold text-gray-700 mb-3">Características Atuais</h5>
        <div className="space-y-2">
          {stageInfo.characteristics.map((characteristic, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span>{characteristic}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Habilidades do estágio atual */}
      <div className="mb-6">
        <h5 className="text-sm font-semibold text-gray-700 mb-3">Habilidades Desbloqueadas</h5>
        <div className="space-y-2">
          {stageInfo.abilities.map((ability, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
              <Zap className="w-3 h-3 text-yellow-500" />
              <span>{ability}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bônus do estágio atual */}
      {currentStage > 1 && evolutionSystem.evolution_bonuses[`stage_${currentStage}`] && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4">
          <h5 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500" />
            Bônus Ativo
          </h5>
          <p className="text-sm text-gray-600">
            {evolutionSystem.evolution_bonuses[`stage_${currentStage}`].description}
          </p>
        </div>
      )}

      {/* Timeline de evolução */}
      <div className="mt-6">
        <h5 className="text-sm font-semibold text-gray-700 mb-3">Timeline de Evolução</h5>
        <div className="space-y-2">
          {evolutionSystem.stages.map((stage) => {
            const isCompleted = currentStage > stage.id;
            const isCurrent = currentStage === stage.id;
            
            return (
              <div key={stage.id} className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  isCompleted ? 'bg-green-500' : 
                  isCurrent ? 'bg-blue-500' : 'bg-gray-300'
                }`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${
                      isCompleted || isCurrent ? 'font-medium text-gray-800' : 'text-gray-500'
                    }`}>
                      {stage.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {stage.xp_required} XP
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default EvolutionDisplay;

