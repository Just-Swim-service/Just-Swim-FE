'use client';

import { useState, useEffect, useRef } from 'react';
import { searchTags, getPopularTags, type Tag } from '@apis';
import styles from './styles.module.scss';

interface TagInputProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  maxTags?: number;
}

export function TagInput({
  selectedTags,
  onTagsChange,
  maxTags = 5,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<Tag[]>([]);
  const [popularTags, setPopularTags] = useState<Tag[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 인기 태그 불러오기
    const fetchPopularTags = async () => {
      try {
        const tags = await getPopularTags(10);
        setPopularTags(tags);
      } catch (error) {
        // 인기 태그 조회 실패 시 빈 배열 유지
      }
    };

    fetchPopularTags();
  }, []);

  useEffect(() => {
    // 태그 자동완성 검색
    const searchTagsDebounced = async () => {
      if (inputValue.trim().length > 0) {
        try {
          const tags = await searchTags(inputValue);
          setSuggestions(tags);
          setShowSuggestions(true);
        } catch (error) {
          // 태그 검색 실패 시 빈 배열 설정
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const timeoutId = setTimeout(searchTagsDebounced, 300);
    return () => clearTimeout(timeoutId);
  }, [inputValue]);

  useEffect(() => {
    // 외부 클릭 감지
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAddTag = (tagName: string) => {
    const normalizedTag = tagName.trim().toLowerCase();
    if (
      normalizedTag &&
      !selectedTags.includes(normalizedTag) &&
      selectedTags.length < maxTags
    ) {
      onTagsChange([...selectedTags, normalizedTag]);
      setInputValue('');
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onTagsChange(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputValue.trim()) {
        handleAddTag(inputValue);
      }
    } else if (e.key === 'Backspace' && !inputValue && selectedTags.length > 0) {
      // 입력값이 없을 때 백스페이스를 누르면 마지막 태그 삭제
      handleRemoveTag(selectedTags[selectedTags.length - 1]);
    }
  };

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.tagInputWrapper}>
        <div className={styles.selectedTags}>
          {selectedTags.map((tag) => (
            <div key={tag} className={styles.tag}>
              <span>#{tag}</span>
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className={styles.removeButton}>
                ×
              </button>
            </div>
          ))}
        </div>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (inputValue.trim().length > 0 || popularTags.length > 0) {
              setShowSuggestions(true);
            }
          }}
          placeholder={
            selectedTags.length === 0
              ? '태그를 입력하세요 (예: 자유형, 평영)'
              : ''
          }
          className={styles.input}
          disabled={selectedTags.length >= maxTags}
        />
      </div>

      {selectedTags.length >= maxTags && (
        <p className={styles.maxTagsWarning}>
          최대 {maxTags}개까지 추가 가능합니다
        </p>
      )}

      {showSuggestions && (
        <div className={styles.suggestionsContainer}>
          {suggestions.length > 0 ? (
            <>
              <div className={styles.suggestionsHeader}>검색 결과</div>
              <div className={styles.suggestionsList}>
                {suggestions.map((tag) => (
                  <button
                    key={tag.tagId}
                    type="button"
                    onClick={() => handleAddTag(tag.tagName)}
                    className={styles.suggestionItem}
                    disabled={selectedTags.includes(tag.tagName)}>
                    <span className={styles.tagName}>#{tag.tagName}</span>
                    <span className={styles.usageCount}>
                      {tag.usageCount}회 사용
                    </span>
                  </button>
                ))}
              </div>
            </>
          ) : inputValue.trim().length === 0 && popularTags.length > 0 ? (
            <>
              <div className={styles.suggestionsHeader}>인기 태그</div>
              <div className={styles.suggestionsList}>
                {popularTags
                  .filter((tag) => !selectedTags.includes(tag.tagName))
                  .slice(0, 8)
                  .map((tag) => (
                    <button
                      key={tag.tagId}
                      type="button"
                      onClick={() => handleAddTag(tag.tagName)}
                      className={styles.suggestionItem}>
                      <span className={styles.tagName}>#{tag.tagName}</span>
                      <span className={styles.usageCount}>
                        {tag.usageCount}회 사용
                      </span>
                    </button>
                  ))}
              </div>
            </>
          ) : inputValue.trim().length > 0 ? (
            <div className={styles.noResults}>
              <p>검색 결과가 없습니다</p>
              <button
                type="button"
                onClick={() => handleAddTag(inputValue)}
                className={styles.createNewTag}>
                &quot;{inputValue}&quot; 태그 추가
              </button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
