
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { X } from 'lucide-react';
import { Habit, HabitCategory } from '@/lib/db-types';

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddHabit: (habit: Omit<Habit, 'id' | 'created_at' | 'user_id'>) => void;
  isLoading: boolean;
}

const categories: HabitCategory[] = [
  'Health', 
  'Productivity', 
  'Mindfulness', 
  'Fitness', 
  'Learning', 
  'Creativity', 
  'Finance', 
  'Social', 
  'Other'
];

const AddHabitModal: React.FC<AddHabitModalProps> = ({ 
  isOpen, 
  onClose, 
  onAddHabit,
  isLoading
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<HabitCategory>('Health');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onAddHabit({
      name,
      description,
      category,
      frequency: 'Daily', // Always set to Daily
    });
    
    // Reset form
    setName('');
    setDescription('');
    setCategory('Health');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold">Add New Habit</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="name" className="mb-1 block">Habit Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="E.g., Morning meditation"
            />
          </div>
          
          <div className="mb-4">
            <Label htmlFor="description" className="mb-1 block">Description (Optional)</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="E.g., Meditate for 10 minutes after waking up"
            />
          </div>
          
          <div className="mb-6">
            <Label htmlFor="category" className="mb-1 block">Category</Label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as HabitCategory)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-forest-green hover:bg-forest-dark text-white"
              disabled={isLoading}
            >
              {isLoading ? 'Adding...' : 'Add Habit'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHabitModal;
