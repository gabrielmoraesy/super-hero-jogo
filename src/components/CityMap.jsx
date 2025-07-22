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
  onShowLocationList
}) => {
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [showTooltip, setShowTooltip] = useState(null);

  // Posições dos pontos no mapa (em porcentagem)
  const locationPositions = {
    escola: { x: 25, y: 30 },
    hospital: { x: 70, y: 25 },
    casa: { x: 50, y: 70 },
    universidade: { x: 80, y: 60 },
    policia: { x: 30, y: 55 },
    area_rural: { x: 15, y: 80 }
  };

  const handlePointClick = (location) => {
    setSelectedPoint(location);
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
      <motion.div
        className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
        style={{ 
          left: `${position.x}%`, 
          top: `${position.y}%` 
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => handlePointClick(location)}
        onMouseEnter={() => setShowTooltip(location.id)}
        onMouseLeave={() => setShowTooltip(null)}
      >
        {/* Pulso de animação para pontos não completados */}
        {!isCompleted && (
          <motion.div
            className="absolute inset-0 rounded-full border-2"
            style={{ borderColor: location.cor_tema }}
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
        <motion.div
          className={`
            w-10 h-10 rounded-full flex items-center justify-center text-white
            border-3 border-white shadow-lg relative
            ${isSelected ? 'ring-3 ring-blue-400' : ''}
          `}
          style={{ backgroundColor: location.cor_tema }}
          animate={isSelected ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.5, repeat: isSelected ? Infinity : 0 }}
        >
          <Icon className="w-5 h-5" />
          
          {/* Indicador de conclusão */}
          {isCompleted && (
            <div className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
              <CheckCircle className="w-3 h-3 text-white" />
            </div>
          )}

          {/* Estrela de destaque */}
          {isCompleted && (
            <div className="absolute -top-1.5 -left-1.5">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
            </div>
          )}
        </motion.div>

        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip === location.id && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap z-10"
            >
              <div className="font-medium">{location.nome}</div>
              {progress && (
                <div className="text-xs opacity-75">
                  {progress.questionsAnswered} perguntas respondidas
                </div>
              )}
              {/* Seta do tooltip */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-black"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-screen bg-gradient-to-br from-blue-50 via-green-50 to-purple-50 overflow-hidden"
    >
      <div className="h-full max-w-[475px] mx-auto flex flex-col p-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-4 flex-shrink-0"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-gray-800">Mapa da Cidade</h2>
            <div className="flex gap-2">
              <button
                onClick={onShowProfile}
                className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
              >
                <User className="w-4 h-4" />
              </button>
              <button
                onClick={onShowLocationList}
                className="bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 transition-colors text-xs"
              >
                Ver Lista
              </button>
            </div>
          </div>
          <p className="text-gray-600 mb-4 text-sm">Clique nos pontos do mapa para explorar as localidades</p>
        </motion.div>

        {/* Mapa */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative bg-white rounded-2xl shadow-xl overflow-hidden flex-1 min-h-0"
        >
          {/* Fundo do mapa */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-blue-100 to-purple-100">
            {/* Ilustração simplificada da cidade */}
            
            {/* Estradas */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="road" patternUnits="userSpaceOnUse" width="4" height="4">
                  <rect width="4" height="4" fill="#e5e7eb"/>
                  <rect width="2" height="4" fill="#ffffff"/>
                </pattern>
              </defs>
              
              {/* Estrada horizontal principal */}
              <rect x="0" y="45" width="100" height="8" fill="url(#road)" opacity="0.8"/>
              
              {/* Estrada vertical */}
              <rect x="25" y="0" width="6" height="100" fill="url(#road)" opacity="0.8"/>
              
              {/* Estrada diagonal */}
              <rect x="60" y="20" width="6" height="60" fill="url(#road)" opacity="0.8" transform="rotate(25 63 50)"/>
            </svg>

            {/* Áreas verdes */}
            <div className="absolute bottom-4 left-4 w-16 h-16 bg-green-300 rounded-full opacity-60"></div>
            <div className="absolute top-8 right-8 w-20 h-12 bg-green-300 rounded-lg opacity-60"></div>
            <div className="absolute bottom-8 right-16 w-12 h-12 bg-green-300 rounded-full opacity-60"></div>

            {/* Rio */}
            <div className="absolute bottom-0 left-0 w-full h-8 bg-blue-200 opacity-70" style={{
              clipPath: 'polygon(0 50%, 20% 80%, 40% 60%, 60% 90%, 80% 70%, 100% 100%, 100% 100%, 0 100%)'
            }}></div>
          </div>

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
          <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-md">
            <h4 className="text-xs font-semibold text-gray-800 mb-1">Legenda</h4>
            <div className="space-y-0.5 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Concluído</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-gray-600">Disponível</span>
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
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-[420px] mx-auto bg-white rounded-xl p-4 shadow-xl border-2 border-blue-200 max-h-64 overflow-y-auto"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: selectedPoint.cor_tema }}
                  >
                    {React.createElement(locationIcons[selectedPoint.id] || MapPin, { className: "w-6 h-6" })}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{selectedPoint.nome}</h3>
                    <p className="text-gray-600 text-sm">{selectedPoint.descricao}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPoint(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Informações detalhadas */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-blue-50 rounded-lg p-2 text-center">
                  <div className="text-lg font-bold text-blue-600">
                    {userProgress[selectedPoint.id]?.questionsAnswered || 0}
                  </div>
                  <div className="text-xs text-gray-600">Perguntas</div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-2 text-center">
                  <div className="text-lg font-bold text-green-600">
                    {userProgress[selectedPoint.id]?.score || 0}
                  </div>
                  <div className="text-xs text-gray-600">XP Ganho</div>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-2 text-center">
                  <div className="text-lg font-bold text-purple-600">
                    {completedLocations.includes(selectedPoint.id) ? (
                      <Trophy className="w-6 h-6 mx-auto" />
                    ) : (
                      <MapPin className="w-6 h-6 mx-auto" />
                    )}
                  </div>
                  <div className="text-xs text-gray-600">
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
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2.5 px-4 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <MapPin className="w-4 h-4" />
                  {completedLocations.includes(selectedPoint.id) ? 'Revisar' : 'Explorar'}
                </motion.button>
                
                <button
                  onClick={() => setSelectedPoint(null)}
                  className="px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Instruções */}
        {!selectedPoint && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-[400px] mx-4 text-center text-gray-500 text-xs"
          >
            💡 Dica: Toque nos pontos para ver mais informações
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default CityMap;
