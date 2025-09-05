'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  VirtualList,
  LazyImage,
  LazyComponent,
  MemoizedComponent,
  PerformanceMonitor,
} from '@components';
import { usePerformance, useDebounce } from '@hooks';
import styles from './styles.module.scss';

export function PerformanceExample() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showMetrics, setShowMetrics] = useState(false);
  const [imageCount, setImageCount] = useState(10);

  const { renderCount } = usePerformance('PerformanceExample');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // 가상화된 리스트를 위한 데이터 생성
  const listData = useMemo(() => {
    return Array.from({ length: 1000 }, (_, index) => ({
      id: index,
      title: `Item ${index + 1}`,
      description: `This is the description for item ${index + 1}`,
      image: `https://picsum.photos/200/200?random=${index}`,
    }));
  }, []);

  // 검색 필터링된 데이터
  const filteredData = useMemo(() => {
    if (!debouncedSearchTerm) return listData;

    return listData.filter(
      (item) =>
        item.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        item.description
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase()),
    );
  }, [listData, debouncedSearchTerm]);

  // 가상화된 리스트 아이템 렌더링
  const renderListItem = useCallback(
    (item: (typeof listData)[0], index: number) => (
      <div className={styles.listItem}>
        <div className={styles.itemImage}>
          <LazyImage
            src={item.image}
            alt={item.title}
            width={60}
            height={60}
            threshold={0.1}
            rootMargin="50px"
          />
        </div>
        <div className={styles.itemContent}>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </div>
      </div>
    ),
    [],
  );

  // 지연 로딩 컴포넌트
  const LazyHeavyComponent = () => (
    <div className={styles.heavyComponent}>
      <h3>Heavy Component</h3>
      <p>This component was loaded lazily!</p>
      <div className={styles.heavyContent}>
        {Array.from({ length: 100 }, (_, i) => (
          <div key={i} className={styles.heavyItem}>
            Heavy item {i + 1}
          </div>
        ))}
      </div>
    </div>
  );

  // 메모이제이션된 컴포넌트
  const ExpensiveComponent = ({ data }: { data: any[] }) => {
    const processedData = useMemo(() => {
      // 복잡한 계산 시뮬레이션
      return data.map((item) => ({
        ...item,
        processed: item.title.toUpperCase(),
        hash: item.title.length * 31,
      }));
    }, [data]);

    return (
      <div className={styles.expensiveComponent}>
        <h3>Expensive Component</h3>
        <p>Processed {processedData.length} items</p>
        <div className={styles.processedData}>
          {processedData.slice(0, 5).map((item, index) => (
            <div key={index} className={styles.processedItem}>
              {item.processed} (Hash: {item.hash})
            </div>
          ))}
        </div>
      </div>
    );
  };

  const MemoizedExpensiveComponent = React.memo(ExpensiveComponent);

  return (
    <div className={styles.container}>
      <PerformanceMonitor
        componentName="PerformanceExample"
        showMetrics={showMetrics}
      />

      <header className={styles.header}>
        <h1>성능 최적화 테스트</h1>
        <div className={styles.controls}>
          <button
            className={styles.button}
            onClick={() => setShowMetrics(!showMetrics)}>
            {showMetrics ? '메트릭 숨기기' : '메트릭 보기'}
          </button>
          <div className={styles.info}>
            <p>렌더링 횟수: {renderCount}</p>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.section}>
          <h2>검색 및 필터링</h2>
          <input
            type="text"
            placeholder="아이템 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <p>검색 결과: {filteredData.length}개 아이템</p>
        </section>

        <section className={styles.section}>
          <h2>가상화된 리스트</h2>
          <div className={styles.virtualListContainer}>
            <VirtualList
              items={filteredData}
              itemHeight={80}
              containerHeight={400}
              renderItem={renderListItem}
              overscan={5}
            />
          </div>
        </section>

        <section className={styles.section}>
          <h2>지연 로딩 이미지</h2>
          <div className={styles.imageGrid}>
            {Array.from({ length: imageCount }, (_, index) => (
              <LazyImage
                key={index}
                src={`https://picsum.photos/200/200?random=${index}`}
                alt={`Lazy image ${index + 1}`}
                width={200}
                height={200}
                threshold={0.1}
                rootMargin="50px"
                delay={index * 100} // 순차적 로딩
              />
            ))}
          </div>
          <div className={styles.imageControls}>
            <button
              className={styles.button}
              onClick={() => setImageCount((prev) => Math.min(prev + 5, 50))}>
              이미지 추가 (+5)
            </button>
            <button
              className={styles.button}
              onClick={() => setImageCount((prev) => Math.max(prev - 5, 5))}>
              이미지 제거 (-5)
            </button>
          </div>
        </section>

        <section className={styles.section}>
          <h2>지연 로딩 컴포넌트</h2>
          <LazyComponent
            component={() => import('./LazyHeavyComponent')}
            threshold={0.1}
            rootMargin="100px"
            delay={500}
          />
        </section>

        <section className={styles.section}>
          <h2>메모이제이션된 컴포넌트</h2>
          <MemoizedComponent
            dependencies={[filteredData.length]}
            className={styles.memoizedContainer}>
            <MemoizedExpensiveComponent data={filteredData.slice(0, 100)} />
          </MemoizedComponent>
        </section>

        <section className={styles.section}>
          <h2>성능 팁</h2>
          <div className={styles.tips}>
            <div className={styles.tip}>
              <h3>가상화</h3>
              <p>대용량 리스트에서 DOM 노드 수를 제한하여 성능 향상</p>
            </div>
            <div className={styles.tip}>
              <h3>지연 로딩</h3>
              <p>필요한 시점에만 리소스를 로드하여 초기 로딩 시간 단축</p>
            </div>
            <div className={styles.tip}>
              <h3>메모이제이션</h3>
              <p>불필요한 재계산을 방지하여 렌더링 성능 향상</p>
            </div>
            <div className={styles.tip}>
              <h3>디바운싱</h3>
              <p>빈번한 이벤트 호출을 제한하여 성능 최적화</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
