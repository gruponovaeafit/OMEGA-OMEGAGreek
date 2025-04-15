// components/Icon.tsx
import React from "react";

interface IconProps {
  name: "arrow" | "check" | "close" | "chevron-right";
  size?: number;
  color?: string;
  className?: string;
}

const Icon: React.FC<IconProps> = ({
  name,
  size = 20,
  color = "currentColor",
  className = "",
}) => {
  switch (name) {
    case "arrow":
      return (
        <svg
          className={className}
          width={size}
          height={size}
          fill="none"
          stroke={color}
          viewBox="0 0 24 24"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      );

    case "check":
      return (
        <svg
          className={className}
          width={size}
          height={size}
          fill="none"
          stroke={color}
          viewBox="0 0 24 24"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 13l4 4L19 7" />
        </svg>
      );

    case "close":
      return (
        <svg
          className={className}
          width={size}
          height={size}
          fill="none"
          stroke={color}
          viewBox="0 0 24 24"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      );

    case "chevron-right":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.89371 5.66971L9.98212 5.67262C10.2831 5.68977 10.5594 5.79592 10.8109 5.99106L16.6982 11.338C17.0361 11.6579 17.1958 12.0502 17.1771 12.5152C17.1396 12.979 16.934 13.3492 16.56 13.6261L9.94024 18.3213C9.74016 18.4597 9.47872 18.5356 9.15563 18.549C8.56789 18.526 8.13284 18.2625 7.85016 17.7586C7.61141 17.2569 7.62915 16.7718 7.9028 16.3036C8.09619 16.0468 8.22968 15.9049 8.30296 15.8781L13.366 12.2851L8.90378 8.22945C8.83428 8.19426 8.71912 8.03722 8.55801 7.75892C8.34251 7.26104 8.38323 6.77742 8.68044 6.30834C8.99045 5.88927 9.39497 5.6764 9.89371 5.66971ZM11.9879 0L10.8758 0.0689229C9.42114 0.21433 8.07933 0.574067 6.85006 1.14842C6.23557 1.43575 5.64928 1.77658 5.09121 2.17093C4.77044 2.30761 4.00328 3.0137 2.78913 4.28892C2.49803 4.51867 1.94664 5.37715 1.13469 6.86408C0.847656 7.47857 0.613842 8.12127 0.434119 8.79218C0.0612953 10.1546 -0.0713159 11.5886 0.0359945 13.0948C0.325354 16.1149 1.61192 18.7054 3.89568 20.8674C4.39791 21.3283 4.93243 21.7401 5.49922 22.1024L6.37399 22.609C6.97336 22.922 7.60501 23.1854 8.26923 23.3998C9.52031 23.8747 11.0561 24.0587 12.8766 23.952C15.8249 23.8092 18.4838 22.5232 20.8533 20.0941C21.7758 19.0899 22.5005 17.956 23.0275 16.6924C23.2909 16.0608 23.5053 15.3966 23.6702 14.6998C23.8438 14.1731 23.9502 13.2739 23.9898 12.0019C23.9517 10.4908 23.6989 9.0923 23.2319 7.8069C22.9984 7.1642 22.711 6.54971 22.3702 5.96343C21.4242 4.54688 20.7923 3.73085 20.4744 3.51536C19.4711 2.51176 18.3549 1.72307 17.1257 1.14842C15.5402 0.524337 14.5549 0.21433 14.1701 0.21811C13.471 0.0918972 12.7434 0.0191938 11.9879 0Z" fill="#8E8CA0"/>
        </svg>
      )

    default:
      return null;
  }
};

export default Icon;
