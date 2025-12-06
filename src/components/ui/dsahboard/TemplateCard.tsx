import React from "react";
import toast from "react-hot-toast";

interface TemplateCardProps {
  label: string;
  description: string;
  name: string;
  onTry: (template: string, description: string) => void;
  available: boolean;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  label,
  description,
  onTry,
  name,
  available,
}) => {
  return (
    <div
      className="relative group bg-white/90 backdrop-blur-xl border border-white/40 rounded-xl sm:rounded-2xl
      shadow-[0_6px_16px_rgba(17,25,40,0.08)] hover:shadow-[0_12px_30px_rgba(80,63,205,0.18)]
      overflow-hidden transition-all duration-500 hover:-translate-y-2 cursor-pointer
      w-full flex flex-col"
    >
      {/* Futuristic glow layer */}
      <div className="absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ring-2 ring-offset-2 ring-indigo-400/50" />
      {/* Video Preview */}
      <div className="relative w-full h-24 sm:h-40 overflow-hidden rounded-t-xl sm:rounded-t-2xl">
        <img
          alt={`${name} preview`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          src={`${label}`}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="absolute bottom-1 sm:bottom-2 left-1 sm:left-2 text-[8px] sm:text-[10px] font-semibold tracking-wider uppercase px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-sm">
          Preview
        </div>
      </div>

      <div className="relative p-2 sm:p-4 z-10 flex flex-col justify-between h-[100px] sm:h-[150px]">
        <div>
          <h3 className="text-gray-900 font-semibold text-[11px] sm:text-base tracking-tight mb-0.5 sm:mb-1 group-hover:text-indigo-600 transition-colors duration-300 line-clamp-1 sm:line-clamp-none">
            {name}
          </h3>
          <p className="text-gray-500 text-[10px] sm:text-sm leading-snug line-clamp-2">
            {description}
          </p>
        </div>

        {/* Hover-Only Button */}
        <button
          disabled={!available}
          onClick={() => {
            if (available) {
              onTry(name, description);
            } else {
              toast.success("This template is currently unavailable");
            }
          }}
          className={`mt-1.5 sm:mt-3 opacity-100 sm:opacity-0 sm:translate-y-3 sm:group-hover:opacity-100 sm:group-hover:translate-y-0
  transition-all duration-500 ease-out relative inline-flex items-center justify-center w-full py-1.5 sm:py-2
  font-semibold text-[10px] sm:text-sm rounded-full overflow-hidden
  focus:outline-none active:scale-[0.97]
  ${
    available
      ? `text-white bg-gradient-to-r from-fuchsia-500 via-indigo-500 to-sky-500
       shadow-[0_4px_15px_rgba(99,102,241,0.3)]
       before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/30 before:to-transparent before:opacity-0 sm:group-hover:before:opacity-40
       hover:shadow-[0_0_25px_rgba(99,102,241,0.45)]`
      : `text-gray-500 bg-gray-200 border-2 border-dashed border-gray-300
       cursor-not-allowed opacity-60
       shadow-none`
  }`}
        >
          <span className="relative z-10 flex items-center gap-1.5">
            {available ? (
              "Try this template"
            ) : (
              <>
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                Unavailable
              </>
            )}
          </span>
        </button>
      </div>

      <div className="absolute inset-0 rounded-xl sm:rounded-2xl pointer-events-none border border-white/20" />
    </div>
  );
};
