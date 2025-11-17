import React, { useRef } from 'react';
import { TFunction, Language } from '../types';
import AssistantIcon from './icons/AssistantIcon';
import { isAIAvailable } from '../geminiService';

interface FloatingAssistantButtonProps {
    onClick: () => void;
    onLongPress: () => void;
    t: TFunction;
    language: Language;
}

const FloatingAssistantButton: React.FC<FloatingAssistantButtonProps> = ({ onClick, onLongPress, t, language }) => {
    const pressTimer = useRef<number | undefined>(undefined);
    const isLongPressTriggered = useRef(false);
    const aiAvailable = isAIAvailable();

    const handlePointerDown = () => {
        isLongPressTriggered.current = false;
        pressTimer.current = window.setTimeout(() => {
            onLongPress();
            isLongPressTriggered.current = true;
        }, 700); // 700ms for long press
    };

    const handlePointerUp = () => {
        if (pressTimer.current) {
            clearTimeout(pressTimer.current);
            pressTimer.current = undefined;
        }
    };

    const handleClick = () => {
        if (!isLongPressTriggered.current) {
            onClick();
        }
    };

    return (
        <button
            onClick={handleClick}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp} // Cancel on leave
            onContextMenu={(e) => e.preventDefault()} // Prevent context menu
            className={`w-16 h-16 bg-primary text-white rounded-2xl shadow-lg flex items-center justify-center
                       transform transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-400 dark:focus:ring-blue-800
                       opacity-90 hover:opacity-100 focus:opacity-100
                       disabled:bg-slate-400 disabled:dark:bg-slate-600 disabled:cursor-not-allowed disabled:scale-100`}
            aria-label={t('assistantFabTooltip')}
            title={aiAvailable ? t('assistantFabTooltip') : t('aiUnavailableShort')}
            disabled={!aiAvailable}
        >
            <AssistantIcon />
        </button>
    );
};

export default FloatingAssistantButton;