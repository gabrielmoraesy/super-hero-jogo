/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Home,
  Building2,
  GraduationCap,
  Shield,
  Stethoscope,
  Tractor,
  CheckCircle,
  Star,
  Trophy,
  User,
  X
} from 'lucide-react';
import cityMapImg from '@/assets/city.png'; 

// Mapeamento de ícones para localidades
const locationIcons = {
  escola: GraduationCap,
  hospital: Stethoscope,
  casa: Home,
  universidade: Building2,
  policia: Shield,
  area_rural: Tractor
};

const CityMap = ({ 
  locations, 
  onLocationSelect, 
  completedLocations = [], 
  userProgress = {},
  userStats,
  onShowProfile,
  onShowLocationList,
  evolutionImages,
  currentStage,
  stageInfo,
  evolutionProgress,
  gameData
}) => {
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [showTooltip, setShowTooltip] = useState(null);

  // Posições dos pontos no mapa (em porcentagem, base city.png 800x1300)
  const locationPositions = {
    escola: { left: '40.4%', top: '82.4%' },
    hospital: { left: '84.2%', top: '47.8%' },
    casa: { left: '32.2%', top: '17.5%' },
    universidade: { left: '24.7%', top: '48.5%' },
    policia: { left: '78%', top: '90.8%' },
    area_rural: { left: '69.4%', top: '62.2%' }
  };

  const handlePointClick = (location) => {
    // Se já está selecionado, fecha e reabre para forçar o painel
    if (selectedPoint && selectedPoint.id === location.id) {
      setSelectedPoint(null);
      setTimeout(() => setSelectedPoint(location), 10);
    } else {
      setSelectedPoint(location);
    }
  };

  const handleConfirmSelection = () => {
    if (selectedPoint) {
      onLocationSelect(selectedPoint);
    }
  };

  const MapPoint = ({ location, position }) => {
    const Icon = locationIcons[location.id] || MapPin;
    const isCompleted = completedLocations.includes(location.id);
    const progress = userProgress[location.id];
    const isSelected = selectedPoint?.id === location.id;

    return (
      <div
        className="absolute cursor-pointer"
        style={{
          left: position.left,
          top: position.top,
          transform: 'translate(-50%, -100%)',
          zIndex: 2
        }}
        onClick={() => handlePointClick(location)}
        onMouseEnter={() => setShowTooltip(location.id)}
        onMouseLeave={() => setShowTooltip(null)}
      >
        {/* Pulso de animação para pontos não completados */}
        {!isCompleted && (
          <motion.div
            className="absolute inset-0 rounded-full border-2"
            style={{ borderColor: location.cor_tema, pointerEvents: 'none' }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.7, 0, 0.7]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}

        {/* Ponto principal */}
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-white border-2 shadow-xl relative ${isSelected ? 'ring-2 ring-blue-400' : ''}`}
          style={{ background: location.cor_tema || '#181818', borderColor: isCompleted ? '#0A84FF' : '#242424', transition: 'box-shadow 0.2s', filter: 'none', opacity: 1 }}
        >
          <Icon className="w-6 h-6" style={{ color: isCompleted ? '#0A84FF' : '#B0B0B0', filter: 'none', opacity: 1 }} />
          {isCompleted && (
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: '#0A84FF' }}>
              <CheckCircle className="w-3 h-3" style={{ color: '#FFFFFF' }} />
            </div>
          )}
        </div>

        {/* Tooltip */}
        {showTooltip === location.id && (
          <div
            className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap z-10"
            style={{ pointerEvents: 'none' }}
          >
            <div className="font-medium">{location.nome}</div>
            {progress && (
              <div className="text-xs opacity-75">
                {progress.questionsAnswered} perguntas respondidas
              </div>
            )}
            {/* Seta do tooltip */}
            <div
              className="absolute top-full left-1/2 transform -translate-x-1/2"
              style={{
                width: 0,
                height: 0,
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderTop: '8px solid #000',
              }}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="overflow-hidden"
      style={{ background: '#0D0D0D', minHeight: '100dvh', height: '100dvh' }}
    >
      <div className="h-full max-w-[475px] mx-auto flex flex-col p-4 relative" style={{ color: '#FFFFFF' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-4 flex-shrink-0"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold" style={{ color: '#FFFFFF' }}>Mapa da Cidade</h2>
            <div className="flex gap-2">
              <button
                onClick={onShowLocationList}
                className="px-3 py-2 rounded-lg border text-xs font-bold shadow-lg"
                style={{ background: '#242424', color: '#FFFFFF', border: '1px solid #383838' }}
                onMouseOver={e => e.currentTarget.style.background = '#383838'}
                onMouseOut={e => e.currentTarget.style.background = '#242424'}
              >
                Ver Lista
              </button>
              <button
                onClick={onShowProfile}
                className="p-2 rounded-full border shadow-lg"
                style={{ background: '#0A84FF', color: '#FFFFFF', border: '1px solid #242424' }}
                onMouseOver={e => e.currentTarget.style.background = '#0066CC'}
                onMouseOut={e => e.currentTarget.style.background = '#0A84FF'}
              >
                <User className="w-4 h-4" style={{ color: '#FFFFFF' }} />
              </button>
            </div>
          </div>
          <p className="text-sm" style={{ color: '#B0B0B0' }}>Clique nos pontos do mapa para explorar as localidades</p>
        </motion.div>

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
        

        {/* Mapa */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative rounded-2xl shadow-xl overflow-hidden flex-1 min-h-0 border mt-3"
          style={{ background: '#181818', border: '1px solid #242424' }}
        >
          {/* Imagem do mapa da cidade */}
          <img src={cityMapImg} alt="Mapa da Cidade" className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none" style={{ zIndex: 1 }} draggable={false} />

          {/* Pontos das localidades */}
          {locations.map((location) => {
            const position = locationPositions[location.id];
            if (!position) return null;
            return (
              <MapPoint
                key={location.id}
                location={location}
                position={position}
              />
            );
          })}

          {/* Legenda */}
          <div className="absolute bottom-2 left-2 rounded-lg p-2 shadow-md border"
            style={{ background: '#242424', border: '1px solid #383838', color: '#FFFFFF' }}
          >
            <h4 className="text-xs font-semibold mb-1" style={{ color: '#B0B0B0' }}>Legenda</h4>
            <div className="space-y-0.5 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#0A84FF' }}></div>
                <span style={{ color: '#B0B0B0' }}>Concluído</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: '#66B2FF' }}></div>
                <span style={{ color: '#B0B0B0' }}>Disponível</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Painel de informações da localidade selecionada */}
        <AnimatePresence>
          {selectedPoint && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-6 left-1/2 transform -translate-x-1/2 mx-auto rounded-xl shadow-xl border-2 max-h-64 overflow-y-auto"
              style={{
                background: '#181818',
                border: '1px solid #242424',
                color: '#FFFFFF',
                zIndex: 50,
                width: '95vw',
                maxWidth: '420px',
                padding: window.innerWidth <= 400 ? '0.75rem' : '1rem'
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: selectedPoint.cor_tema || '#242424', color: '#FFFFFF' }}
                  >
                    {React.createElement(locationIcons[selectedPoint.id] || MapPin, { className: "w-6 h-6", style: { color: '#FFFFFF' } })}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold" style={{ color: '#FFFFFF' }}>{selectedPoint.nome}</h3>
                    <p className="text-sm" style={{ color: '#B0B0B0' }}>{selectedPoint.descricao}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPoint(null)}
                  className="transition-colors"
                  style={{ color: '#B0B0B0' }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Informações detalhadas */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="rounded-lg p-2 text-center border" style={{ background: '#242424', border: '1px solid #383838', color: '#66B2FF' }}>
                  <div className="text-lg font-bold" style={{ color: '#0A84FF' }}>
                    {userProgress[selectedPoint.id]?.questionsAnswered || 0}
                  </div>
                  <div className="text-xs" style={{ color: '#B0B0B0' }}>Perguntas</div>
                </div>
                <div className="rounded-lg p-2 text-center border" style={{ background: '#242424', border: '1px solid #383838', color: '#00FFB2' }}>
                  <div className="text-lg font-bold" style={{ color: '#00FFB2' }}>
                    {userProgress[selectedPoint.id]?.score || 0}
                  </div>
                  <div className="text-xs" style={{ color: '#B0B0B0' }}>XP Ganho</div>
                </div>
                <div className="rounded-lg p-2 text-center border" style={{ background: '#242424', border: '1px solid #383838', color: '#FFD700' }}>
                  <div className="text-lg font-bold" style={{ color: '#FFD700' }}>
                    {completedLocations.includes(selectedPoint.id) ? (
                      <Trophy className="w-6 h-6 mx-auto" style={{ color: '#FFD700' }} />
                    ) : (
                      <MapPin className="w-6 h-6 mx-auto" style={{ color: '#B0B0B0' }} />
                    )}
                  </div>
                  <div className="text-xs" style={{ color: '#B0B0B0' }}>
                    {completedLocations.includes(selectedPoint.id) ? 'Concluído' : 'Pendente'}
                  </div>
                </div>
              </div>

              {/* Botão de ação */}
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleConfirmSelection}
                  className="flex-1 rounded-lg font-semibold flex items-center justify-center gap-2 text-sm border"
                  style={{ background: '#0A84FF', color: '#FFFFFF', border: '1px solid #242424' }}
                  onMouseOver={e => e.currentTarget.style.background = '#0066CC'}
                  onMouseOut={e => e.currentTarget.style.background = '#0A84FF'}
                >
                  <MapPin className="w-4 h-4" style={{ color: '#FFFFFF' }} />
                  {completedLocations.includes(selectedPoint.id) ? 'Revisar' : 'Explorar'}
                </motion.button>
                <button
                  onClick={() => setSelectedPoint(null)}
                  className="px-4 py-2.5 border-2 rounded-lg text-sm"
                  style={{ border: '1px solid #383838', color: '#B0B0B0', background: '#181818' }}
                  onMouseOver={e => e.currentTarget.style.background = '#242424'}
                  onMouseOut={e => e.currentTarget.style.background = '#181818'}
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default CityMap;
