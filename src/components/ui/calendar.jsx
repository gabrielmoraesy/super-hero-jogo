
import React from "react";
import CalendarLib from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { cn } from "@/lib/utils";

function Calendar({ className, value, onChange, ...props }) {
  return (
    <div className={cn("p-3 bg-white rounded-lg shadow", className)}>
      <CalendarLib
        value={value}
        onChange={onChange}
        className="w-full border-0"
        calendarType="ISO 8601"
        {...props}
      />
    </div>
  );
}

export { Calendar };
