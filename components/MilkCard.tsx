
import React from 'react';
import { MilkProduct, TFunction } from '../types';
import BabyBottleIcon from './icons/BabyBottleIcon';
import CameraIcon from './icons/CameraIcon';

interface MilkCardProps {
  product: MilkProduct;
  t: TFunction;
  onClick: () => void;
}

const MilkCard: React.FC<MilkCardProps> = ({ product, t, onClick }) => {
  const isStandard = product.type === 'Standard';

  // Determine styling based on type
  const cardBorderColor = isStandard ? 'border-blue-100 dark:border-blue-900' : 'border-purple-100 dark:border-purple-900';
  const badgeBg = isStandard ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' : 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200';

  const handleImageSearch = (e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent card click
      const query = `${product.name} ${product.stage ? `Stage ${product.stage}` : ''} ${product.specialType || ''} milk formula`;
      const url = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`;
      window.open(url, '_blank');
  };

  return (
    <div 
        onClick={onClick}
        className={`relative bg-white dark:bg-dark-card rounded-xl shadow-sm border ${cardBorderColor} overflow-hidden transition-all duration-200 hover:shadow-md active:scale-[0.99] cursor-pointer group`}
    >
      {/* Header Section */}
      <div className="p-4 pb-2 flex justify-between items-start">
        <div className="flex items-start gap-3 flex-grow">
            {/* Type Icon / Stage Number */}
            <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${badgeBg} shadow-inner`}>
                {isStandard ? (
                    <span className="text-2xl font-black">{product.stage}</span>
                ) : (
                    <div className="w-6 h-6"><BabyBottleIcon /></div>
                )}
            </div>

            <div className="flex-grow">
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">
                        {product.name}
                    </h3>
                    
                    {/* Image Search Button inside Card */}
                    <button
                        onClick={handleImageSearch}
                        className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-blue-600 hover:bg-blue-100 transition-colors ml-2"
                        title="بحث صورة في جوجل"
                    >
                        <div className="w-5 h-5"><CameraIcon /></div>
                    </button>
                </div>

                {/* Subtitle: Age or Type */}
                <div className="flex flex-wrap gap-2 mt-1">
                    {!isStandard && product.specialType && (
                        <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-purple-50 text-purple-600 border border-purple-100">
                            {product.specialType}
                        </span>
                    )}
                    <span className="inline-block text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {isStandard ? product.ageRange : product.indication}
                    </span>
                </div>
            </div>
        </div>
      </div>

      <div className="px-4 py-2 space-y-3">
        {/* Separator */}
        <div className="h-px w-full bg-slate-50 dark:bg-slate-800"></div>

        {/* Features Section */}
        <div>
            <h4 className="text-[10px] font-bold uppercase text-slate-400 mb-1 flex items-center gap-1">
                <div className={`w-1.5 h-1.5 rounded-full ${isStandard ? 'bg-blue-400' : 'bg-purple-400'}`}></div>
                {isStandard ? t('keyFeatures') : t('composition')}
            </h4>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-2">
                {product.features}
            </p>
        </div>

        {/* Differences Box */}
        <div className={`p-3 rounded-lg ${isStandard ? 'bg-blue-50/50 dark:bg-blue-900/10' : 'bg-purple-50/50 dark:bg-purple-900/10'}`}>
            <h4 className={`text-[10px] font-bold uppercase mb-1 ${isStandard ? 'text-blue-600 dark:text-blue-400' : 'text-purple-600 dark:text-purple-400'}`}>
                {t('keyDifferences')}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                {product.differences}
            </p>
        </div>
      </div>
    </div>
  );
};

export default MilkCard;
