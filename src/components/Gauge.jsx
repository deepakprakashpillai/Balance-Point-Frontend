import React from 'react';

const Gauge = ({ bmi, min = 10, max = 35, size = 170 }) => {

  const radius = size / 2 - 20; // Adjust for thickness
  const circumference = Math.PI * radius * 2; // Full circle circumference

  // Define colors for the BMI categories
  const getColor = (bmi) => {
    if (bmi < 18.5) return "#4DA6FF"; // Light blue for underweight
    if (bmi <= 24.9) return "#66BB6A"; // Green for normal
    return "#FF5733"; // Red for overweight
  };

  // Get the color based on the BMI value
  const color = getColor(bmi);

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size / 2,
        display: 'inline-block',
        textAlign: 'center',
      }}
    >
      <svg width={size} height={size / 2} viewBox={`0 0 ${size} ${size / 2}`}>
        {/* Background arc (half-circle) */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e0e0e0"
          strokeWidth="20"
        />

        {/* Full arc with color changing based on BMI category */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color} // Color based on BMI category
          strokeWidth="22"
        />

        {/* Pointer */}
        <line
          x1={size / 2}
          y1={size / 2}
          x2={size / 2 + (radius - 25) * Math.cos(((bmi - min) / (max - min)) * Math.PI - Math.PI)}
          y2={size / 2 + (radius - 25) * Math.sin(((bmi - min) / (max - min)) * Math.PI - Math.PI)}
          stroke="black"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Min and Max labels */}
        <text
          x={size / 2 - radius + 5} // Position min label more left
          y={size / 2 + 25} // Adjusted for better visibility
          fontSize="1em"
          fontWeight="bold"
          fill="black"
        >
          {min}
        </text>
        <text
          x={size / 2 + radius - 30} // Position max label more right
          y={size / 2 + 25} // Adjusted for better visibility
          fontSize="1em"
          fontWeight="bold"
          fill="black"
        >
          {max}
        </text>
      </svg>

      {/* BMI Text */}
      <div
        style={{
          position: 'absolute',
          top: '120%', // Reduced top value for closer positioning
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: color,
        }}
      >
        <p
          className={`text-4xl mt-16 font-extrabold ${
            bmi < 18.5
              ? 'text-blue-500 mb-0' // Underweight (Blue)
              : bmi <= 24.9
              ? 'text-green-500 mb-0' // Normal (Green)
              : 'text-red-500 mb-0' // Overweight (Red)
          }`}
        >
          {bmi.toFixed(1)}
        </p>
        <p className="text-sm font-light text-gray-600 mb-0">BMI</p>
        <p className="text-sm font-extrabold mt-0 text-gray-600">{bmi < 18.5
              ? 'Under-weight' // Underweight (Blue)
              : bmi <= 24.9
              ? 'Normal' // Normal (Green)
              : 'Over-weight'}</p>
      </div>
    </div>
  );
};

export default Gauge;
