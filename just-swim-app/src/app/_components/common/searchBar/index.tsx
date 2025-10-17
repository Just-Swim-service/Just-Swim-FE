'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getSearchSuggestions, SearchSuggestion } from '@apis';
import styles from './styles.module.scss';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  showSuggestions?: boolean;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = '검색어를 입력하세요...',
  onSearch,
  showSuggestions = true,
  className = '',
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestionsList, setShowSuggestionsList] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // 디바운스된 검색어 자동완성
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.length >= 2) {
      debounceRef.current = setTimeout(async () => {
        setIsLoading(true);
        try {
          const suggestionsData = await getSearchSuggestions(query, 5);
          setSuggestions(suggestionsData);
          setShowSuggestionsList(true);
        } catch (error) {
          console.error('검색어 자동완성 오류:', error);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestionsList(false);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  // 외부 클릭 시 자동완성 숨기기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestionsList(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestionsList || suggestions.length === 0) {
      if (e.key === 'Enter') {
        handleSearch();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < getTotalSuggestions() - 1 ? prev + 1 : prev,
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          const suggestion = getSuggestionByIndex(selectedIndex);
          if (suggestion) {
            setQuery(suggestion);
            setShowSuggestionsList(false);
            handleSearch(suggestion);
          }
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowSuggestionsList(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const getTotalSuggestions = () => {
    return suggestions.reduce(
      (total, suggestion) => total + suggestion.suggestions.length,
      0,
    );
  };

  const getSuggestionByIndex = (index: number): string | null => {
    let currentIndex = 0;
    for (const suggestion of suggestions) {
      if (index < currentIndex + suggestion.suggestions.length) {
        return suggestion.suggestions[index - currentIndex];
      }
      currentIndex += suggestion.suggestions.length;
    }
    return null;
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestionsList(false);
    handleSearch(suggestion);
  };

  const handleSearch = (searchQuery?: string) => {
    const finalQuery = searchQuery || query;
    if (finalQuery.trim()) {
      if (onSearch) {
        onSearch(finalQuery.trim());
      } else {
        router.push(
          `/community/search?q=${encodeURIComponent(finalQuery.trim())}`,
        );
      }
    }
  };

  const renderSuggestions = () => {
    if (!showSuggestionsList || suggestions.length === 0) return null;

    let currentIndex = 0;
    return (
      <div className={styles.suggestions} ref={suggestionsRef}>
        {suggestions.map((suggestion, groupIndex) => (
          <div key={groupIndex} className={styles.suggestionGroup}>
            <div className={styles.suggestionType}>
              {suggestion.type === 'tag' && '태그'}
              {suggestion.type === 'title' && '제목'}
              {suggestion.type === 'content' && '내용'}
            </div>
            {suggestion.suggestions.map((item, itemIndex) => {
              const globalIndex = currentIndex + itemIndex;
              const isSelected = selectedIndex === globalIndex;
              currentIndex++;

              return (
                <div
                  key={itemIndex}
                  className={`${styles.suggestionItem} ${isSelected ? styles.selected : ''}`}
                  onClick={() => handleSuggestionClick(item)}>
                  {item}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`${styles.searchBar} ${className}`}>
      <div className={styles.inputContainer}>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestionsList(true);
            }
          }}
          placeholder={placeholder}
          className={styles.input}
        />
        <button
          onClick={() => handleSearch()}
          className={styles.searchButton}
          disabled={!query.trim()}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        {isLoading && (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
          </div>
        )}
      </div>
      {showSuggestions && renderSuggestions()}
    </div>
  );
};

export default SearchBar;

