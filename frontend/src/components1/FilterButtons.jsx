// components/FilterButtons.jsx
import React from 'react';

export const FilterButton = ({ label, value, isSelected, onClick, activeColor, hoverColor, shadowColor }) => {
  const baseClasses = "px-4 py-2 text-white rounded-lg transition-all duration-200 border";
  const selectedClasses = `${activeColor} border-current shadow-lg ${shadowColor.replace('hover:', '')}`;
  const unselectedClasses = `bg-[#374151] hover:bg-[#4b5563] border-transparent ${hoverColor} ${shadowColor}`;

  return (
    <button
      className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses}`}
      onClick={() => onClick(value)}
      data-status={value}
    >
      {label}
    </button>
  );
};

export const FilterSection = ({ title, icon, iconColor, buttons, selected, onClick, activeColor, hoverColor, shadowColor }) => (
  <div className="flex flex-col gap-3">
    <div className="flex items-center gap-2">
      <i className={`bx ${icon} ${iconColor}`}></i>
      <span className="font-semibold text-white text-lg">{title}</span>
    </div>
    <div className="flex flex-wrap gap-3">
      {buttons.map(btnLabel => (
        <FilterButton 
          key={btnLabel}
          label={btnLabel}
          value={btnLabel}
          isSelected={selected === btnLabel}
          onClick={() => onClick(btnLabel)}
          activeColor={activeColor}
          hoverColor={hoverColor}
          shadowColor={shadowColor}
        />
      ))}
    </div>
  </div>
);