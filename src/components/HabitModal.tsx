
import React from 'react';
import { Button } from './ui/button';
import { X, Check, Trash2 } from 'lucide-react';
import { HabitWithStats } from '@/lib/db-types';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';

interface HabitModalProps {
  habit: HabitWithStats | null;
  onClose: () => void;
  onComplete: (id: string) => void;
  onIncomplete: (id: string) => void;
  onDelete: (id: string) => void;
}

const HabitModal: React.FC<HabitModalProps> = ({ 
  habit, 
  onClose, 
  onComplete,
  onIncomplete,
  onDelete
}) => {
  if (!habit) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold">{habit.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        <div className="mb-6">
          {habit.description && (
            <p className="text-gray-600 mb-4">{habit.description}</p>
          )}
          <p className="text-sm mb-2">
            <span className="font-semibold">Frequency:</span> {habit.frequency}
          </p>
          <p className="text-sm mb-2">
            <span className="font-semibold">Category:</span> {habit.category}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Current Streak:</span> {habit.streak} days
          </p>
        </div>
        
        <div className="flex flex-col space-y-2">
          {habit.completed ? (
            <Button 
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={() => onIncomplete(habit.id)}
            >
              <X size={16} className="mr-2" /> Mark as Incomplete
            </Button>
          ) : (
            <Button 
              className="bg-forest-green hover:bg-forest-dark text-white"
              onClick={() => onComplete(habit.id)}
            >
              <Check size={16} className="mr-2" /> Mark as Completed
            </Button>
          )}
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                <Trash2 size={16} className="mr-2" /> Delete Habit
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the habit "{habit.name}" and all of its completion history.
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  className="bg-red-500 hover:bg-red-600 text-white"
                  onClick={() => {
                    onDelete(habit.id);
                  }}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <Button 
            variant="outline"
            className="border-gray-300 text-gray-800"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HabitModal;
