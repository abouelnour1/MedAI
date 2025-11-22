
import React, { useState, useMemo } from 'react';
import { Cosmetic, TFunction, Language } from '../types';
import SearchableDropdown from './SearchableDropdown';
import CosmeticCard from './CosmeticCard';

interface CosmeticsViewProps {
  cosmetics: Cosmetic[];
  t: TFunction;
  language: Language;
  onSelectCosmetic: (cosmetic: Cosmetic) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedBrand: string;
  setSelectedBrand: (brand: string) => void;
}

const CosmeticsView: React.FC<CosmeticsViewProps> = ({ 
    cosmetics, 
    t, 
    language, 
    onSelectCosmetic,
    searchTerm,
    setSearchTerm,
    selectedBrand,
    setSelectedBrand
}) => {

  const uniqueBrands = useMemo(() => {
    const brands = new Set(cosmetics.map(c => c.BrandName));
    return Array.from(brands).sort();
  }, [cosmetics]);

  const filteredCosmetics = useMemo(() => {
    let results = cosmetics;

    if (selectedBrand) {
      results = results.filter(c => c.BrandName === selectedBrand);
    }

    // Logic Update: Only trigger if effective length (excluding %) is >= 3
    const effectiveLength = searchTerm.replace(/%/g, '').trim().length;

    if (effectiveLength >= 3) {
      const lowerSearchTerm = searchTerm.toLowerCase().trim();
      
      const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const parts = lowerSearchTerm.split('%').map(escapeRegExp);
      // If no wildcard, force start-of-string match
      const prefix = lowerSearchTerm.includes('%') ? '' : '^';
      const pattern = prefix + parts.join('.*');
      
      let searchRegex: RegExp;
      try {
          searchRegex = new RegExp(pattern, 'i');
      } catch (e) {
          searchRegex = new RegExp(escapeRegExp(lowerSearchTerm), 'i');
      }

      results = results.filter(c => {
        return searchRegex.test(c.SpecificName) || searchRegex.test(c.SpecificNameAr);
      });
    }
    
    return results;
  }, [cosmetics, selectedBrand, searchTerm]);
  
  const showResults = selectedBrand || searchTerm.replace(/%/g, '').trim().length >= 3;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-white dark:bg-dark-card p-4 rounded-xl shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
            {t('brandName')}
          </label>
          <SearchableDropdown
            ariaLabel={t('brandName')}
            options={uniqueBrands}
            value={selectedBrand}
            onChange={(value) => setSelectedBrand(Array.isArray(value) ? '' : value)}
            placeholder={t('allBrands')}
            t={t}
          />
        </div>
        <div>
          <label htmlFor="cosmetic-search" className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
            {t('productName')}
          </label>
          <input
            id="cosmetic-search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('searchCosmeticsPlaceholder')}
            className="w-full h-[42px] px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border-2 border-transparent focus:border-primary rounded-xl outline-none transition-colors"
          />
        </div>
      </div>

      {showResults ? (
        filteredCosmetics.length > 0 ? (
          <div className="space-y-3">
            {filteredCosmetics.map(cosmetic => (
              <CosmeticCard 
                key={cosmetic.id} 
                cosmetic={cosmetic} 
                t={t} 
                language={language}
                onClick={() => onSelectCosmetic(cosmetic)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 px-4 bg-light-card dark:bg-dark-card rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-light-text-secondary dark:text-dark-text-secondary">{t('noResultsTitle')}</h3>
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-1">{t('noResultsSubtitle')}</p>
          </div>
        )
      ) : null}
    </div>
  );
};

export default CosmeticsView;
