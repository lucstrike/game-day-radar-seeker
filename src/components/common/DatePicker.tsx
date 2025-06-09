
import React from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DatePickerProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  className?: string;
}

const DatePicker = ({ selectedDate, onDateChange, className = '' }: DatePickerProps) => {
  const today = new Date();
  
  const goToPreviousDay = () => {
    const previousDay = new Date(selectedDate);
    previousDay.setDate(previousDay.getDate() - 1);
    onDateChange(previousDay);
  };

  const goToNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    onDateChange(nextDay);
  };

  const goToToday = () => {
    onDateChange(today);
  };

  const isToday = selectedDate.toDateString() === today.toDateString();

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Previous Day Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={goToPreviousDay}
        className="border-sport-lime-green/30 hover:border-sport-lime-green hover:bg-sport-lime-green/10"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Calendar Popover */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="min-w-[200px] border-sport-lime-green/30 hover:border-sport-lime-green hover:bg-sport-lime-green/10 justify-start"
          >
            <Calendar className="h-4 w-4 mr-2 text-sport-lime-green" />
            <span className="font-medium">
              {format(selectedDate, "EEEE, dd 'de' MMMM", { locale: ptBR })}
            </span>
            {isToday && (
              <span className="ml-2 px-2 py-1 bg-sport-lime-green text-sport-dark-blue text-xs rounded-full font-bold">
                HOJE
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-card border-sport-lime-green/30" align="start">
          <div className="p-3">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold text-sport-ice-white">Selecionar Data</h4>
              {!isToday && (
                <Button
                  size="sm"
                  onClick={goToToday}
                  className="bg-sport-lime-green text-sport-dark-blue hover:bg-sport-lime-green/90"
                >
                  Hoje
                </Button>
              )}
            </div>
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && onDateChange(date)}
              initialFocus
              locale={ptBR}
              className="border-sport-lime-green/20"
            />
          </div>
        </PopoverContent>
      </Popover>

      {/* Next Day Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={goToNextDay}
        className="border-sport-lime-green/30 hover:border-sport-lime-green hover:bg-sport-lime-green/10"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Quick Navigation Buttons */}
      <div className="hidden md:flex space-x-1 ml-4">
        {[-1, 0, 1, 2].map((offset) => {
          const date = new Date(today);
          date.setDate(date.getDate() + offset);
          const isSelected = date.toDateString() === selectedDate.toDateString();
          
          return (
            <Button
              key={offset}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => onDateChange(date)}
              className={
                isSelected
                  ? "bg-sport-lime-green text-sport-dark-blue hover:bg-sport-lime-green/90"
                  : "border-sport-lime-green/30 hover:border-sport-lime-green hover:bg-sport-lime-green/10"
              }
            >
              {offset === -1 && "Ontem"}
              {offset === 0 && "Hoje"}
              {offset === 1 && "Amanhã"}
              {offset === 2 && format(date, "dd/MM")}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default DatePicker;
