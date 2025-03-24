
import React from 'react';
import { HabitWithStats } from '@/lib/db-types';
import { Check, X } from 'lucide-react';

interface HabitCardProps {
  habit: HabitWithStats;
  onOpenModal: (id: string) => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ 
  habit, 
  onOpenModal 
}) => {
  return (
    <div 
      className="bg-white border border-earth-tan rounded-md p-4 shadow-sm cursor-pointer hover:shadow-md"
      onClick={() => onOpenModal(habit.id)}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold">{habit.name}</h3>
        <span className="text-xl">
          {habit.completed ? (
            <Check className="text-green-500 h-6 w-6" />
          ) : (
            <X className="text-red-500 h-6 w-6" />
          )}
        </span>
      </div>
      <div className="flex items-center mt-2 text-sm">
        <span className={`font-medium ${habit.completed ? 'text-green-600' : 'text-gray-600'}`}>
          Streak: {habit.streak}
        </span>
      </div>
    </div>
  );
};

export default HabitCard;
