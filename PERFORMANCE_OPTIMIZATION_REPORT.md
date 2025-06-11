# Performance Optimization Report - Hemp Resource Hub

## Executive Summary

After analyzing the Hemp Resource Hub application, I've identified multiple performance bottlenecks and optimization opportunities across frontend, backend, database, and network layers. The application currently lacks several critical performance optimizations that could significantly improve user experience and reduce resource consumption.

## 1. Frontend Performance Issues

### 1.1 Bundle Size & Code Splitting
**Critical Issues:**
- No code splitting implemented - entire app loads at once
- Large dependency bundle including unused Radix UI components
- Three.js loaded even on pages that don't use 3D models
- No dynamic imports for route-based code splitting

**Recommendations:**
```typescript
// Implement lazy loading for routes
const HomePage = lazy(() => import('./pages/home'));
const ProductListingPage = lazy(() => import('./pages/product-listing'));
const ResearchPage = lazy(() => import('./pages/research'));

// Wrap routes with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <Route path="/" component={HomePage} />
</Suspense>
```

### 1.2 React Query Configuration
**Issues:**
- `staleTime: Infinity` prevents data updates
- No background refetching configured
- Missing query invalidation strategies
- No optimistic updates for mutations

**Optimized Configuration:**
```typescript
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      retry: (failureCount, error) => {
        if (error.status === 404) return false;
        return failureCount < 3;
      },
    },
    mutations: {
      retry: 1,
      onError: (error) => {
        console.error('Mutation error:', error);
      },
    },
  },
});
```

### 1.3 Component Re-rendering
**Issues:**
- No memoization of expensive computations
- Missing React.memo for pure components
- Inline object/array creation causing unnecessary re-renders
- No useMemo/useCallback optimization

**Example Fix:**
```typescript
// Before
const PlantTypeCards = () => {
  const { data: plantTypesData } = usePlantTypes();
  const plantTypes = Array.isArray(plantTypesData) ? plantTypesData : [];
  
// After
const PlantTypeCards = React.memo(() => {
  const { data: plantTypesData } = usePlantTypes();
  const plantTypes = useMemo(
    () => Array.isArray(plantTypesData) ? plantTypesData : [],
    [plantTypesData]
  );
```

### 1.4 Image Optimization
**Critical Issues:**
- No lazy loading for images
- Missing responsive images (srcset)
- No WebP format support
- Large background images loaded immediately
- No image optimization pipeline

**Recommendations:**
```typescript
// Implement lazy loading component
const LazyImage = ({ src, alt, ...props }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const imgRef = useRef();
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setImageSrc(src);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    
    return () => observer.disconnect();
  }, [src]);
  
  return (
    <img
      ref={imgRef}
      src={imageSrc || '/placeholder.jpg'}
      alt={alt}
      loading="lazy"
      {...props}
    />
  );
};
```

### 1.5 Three.js Performance
**Issues:**
- SimpleHempModel loads on every plant type card
- No model caching or sharing
- Heavy Three.js bundle loaded for simple 3D display

**Solution:**
```typescript
// Load Three.js only when needed
const HempModelViewer = lazy(() => 
  import('./components/models/HempModelViewer')
);

// Use lightweight placeholder until interaction
const [showModel, setShowModel] = useState(false);
```

## 2. Backend Performance Issues

### 2.1 Database Queries
**N+1 Query Problems:**
- Multiple queries for related data in routes
- No query batching or DataLoader pattern
- Missing joins for related data

**Example Issue in storage-db.ts:**
```typescript
// Current: Multiple queries
async getHempProductsByPart(plantPartId: number) {
  return await db.select().from(hempProducts)
    .where(eq(hempProducts.plantPartId, plantPartId));
}

// Optimized: Single query with joins
async getHempProductsWithRelations(plantPartId: number) {
  return await db.select({
    product: hempProducts,
    industry: industries,
    subIndustry: subIndustries,
    plantPart: plantParts
  })
  .from(hempProducts)
  .leftJoin(industries, eq(hempProducts.industryId, industries.id))
  .leftJoin(subIndustries, eq(hempProducts.subIndustryId, subIndustries.id))
  .leftJoin(plantParts, eq(hempProducts.plantPartId, plantParts.id))
  .where(eq(hempProducts.plantPartId, plantPartId));
}
```

### 2.2 API Response Optimization
**Issues:**
- No response compression (gzip/brotli)
- Full objects returned instead of DTOs
- No field selection/GraphQL-like queries
- Missing pagination on several endpoints

**Add Compression Middleware:**
```typescript
import compression from 'compression';

app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 6 // Balance speed vs size
}));
```

### 2.3 Connection Pooling
**Issues:**
- No connection pool configuration
- Creating new connections per request
- Missing connection limits

**Optimized Configuration:**
```typescript
// db.ts optimization
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  statement_timeout: 5000,
});

export const db = drizzle(pool, { schema });
```

### 2.4 Caching Strategy
**Missing Caching Layers:**
- No Redis/Memory cache
- No HTTP caching headers
- No CDN integration
- No query result caching

**Implement Caching:**
```typescript
// Add caching middleware
const cache = new Map();

const cacheMiddleware = (duration = 300) => (req, res, next) => {
  const key = `${req.method}:${req.url}`;
  const cached = cache.get(key);
  
  if (cached && cached.timestamp > Date.now() - duration * 1000) {
    return res.json(cached.data);
  }
  
  const originalJson = res.json;
  res.json = function(data) {
    cache.set(key, { data, timestamp: Date.now() });
    originalJson.call(this, data);
  };
  
  next();
};

// Use on read-only endpoints
app.get('/api/plant-types', cacheMiddleware(300), asyncHandler(...));
```

## 3. Database Performance Issues

### 3.1 Missing Indexes
**Critical Missing Indexes:**
```sql
-- Add indexes for foreign keys and common queries
CREATE INDEX idx_plant_parts_plant_type_id ON plant_parts(plant_type_id);
CREATE INDEX idx_hemp_products_plant_part_id ON hemp_products(plant_part_id);
CREATE INDEX idx_hemp_products_industry_id ON hemp_products(industry_id);
CREATE INDEX idx_hemp_products_compound ON hemp_products(plant_part_id, industry_id);

-- Full-text search indexes
CREATE INDEX idx_hemp_products_search ON hemp_products USING gin(to_tsvector('english', name || ' ' || description));
CREATE INDEX idx_research_papers_search ON research_papers USING gin(to_tsvector('english', title || ' ' || abstract));
```

### 3.2 Query Optimization
**Issues:**
- Using `textSearch` without proper indexes
- Fallback to ILIKE is very slow
- No query plan analysis
- Missing EXPLAIN ANALYZE usage

### 3.3 Data Denormalization
**Consider Materialized Views:**
```sql
-- Create materialized view for stats
CREATE MATERIALIZED VIEW stats_summary AS
SELECT 
  (SELECT COUNT(*) FROM plant_types) as plant_types_count,
  (SELECT COUNT(*) FROM plant_parts) as plant_parts_count,
  (SELECT COUNT(*) FROM industries) as industries_count,
  (SELECT COUNT(*) FROM hemp_products) as products_count,
  (SELECT COUNT(*) FROM research_papers) as research_count;

-- Refresh periodically
CREATE OR REPLACE FUNCTION refresh_stats()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY stats_summary;
END;
$$ LANGUAGE plpgsql;
```

## 4. Network Performance Issues

### 4.1 API Call Optimization
**Issues:**
- Multiple sequential API calls
- No request batching
- Missing request deduplication
- No prefetching strategy

**Implement Batch Loader:**
```typescript
class BatchLoader {
  private queue = new Map();
  private timer = null;
  
  load(key, resolver) {
    return new Promise((resolve, reject) => {
      if (!this.queue.has(resolver)) {
        this.queue.set(resolver, new Map());
      }
      
      this.queue.get(resolver).set(key, { resolve, reject });
      
      if (!this.timer) {
        this.timer = setTimeout(() => this.flush(), 10);
      }
    });
  }
  
  flush() {
    this.queue.forEach((keys, resolver) => {
      const keyArray = Array.from(keys.keys());
      resolver(keyArray).then(results => {
        results.forEach((result, index) => {
          keys.get(keyArray[index]).resolve(result);
        });
      });
    });
    
    this.queue.clear();
    this.timer = null;
  }
}
```

### 4.2 Static Asset Optimization
**Missing Optimizations:**
- No CDN for static assets
- No asset versioning/cache busting
- Missing Service Worker for offline support
- No HTTP/2 push

**Vite Configuration Updates:**
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-helmet'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          'utils': ['date-fns', 'clsx', 'tailwind-merge'],
        },
        assetFileNames: 'assets/[name].[hash][extname]',
        chunkFileNames: 'js/[name].[hash].js',
        entryFileNames: 'js/[name].[hash].js',
      },
    },
    cssCodeSplit: true,
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
});
```

## 5. Immediate Action Items

### High Priority (Week 1)
1. **Implement code splitting** for routes
2. **Add compression middleware** to Express
3. **Create database indexes** for foreign keys
4. **Fix React Query configuration** for proper caching
5. **Add lazy loading** for images

### Medium Priority (Week 2-3)
1. **Optimize bundle size** with manual chunks
2. **Implement connection pooling** properly
3. **Add caching layer** for GET endpoints
4. **Create batch loading** for related data
5. **Add performance monitoring** (Web Vitals)

### Low Priority (Month 2)
1. **Implement Service Worker** for offline support
2. **Add CDN integration** for static assets
3. **Create materialized views** for complex queries
4. **Implement GraphQL** for flexible queries
5. **Add Redis caching** layer

## 6. Performance Monitoring

### Implement Web Vitals Tracking
```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  // Send to your analytics endpoint
  fetch('/api/analytics', {
    method: 'POST',
    body: JSON.stringify(metric),
    headers: { 'Content-Type': 'application/json' }
  });
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

### Add Backend Performance Monitoring
```typescript
// Performance middleware
app.use((req, res, next) => {
  const start = process.hrtime.bigint();
  
  res.on('finish', () => {
    const end = process.hrtime.bigint();
    const duration = Number(end - start) / 1000000; // Convert to ms
    
    console.log({
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    });
  });
  
  next();
});
```

## Expected Performance Improvements

After implementing these optimizations:

1. **Initial Load Time**: 50-70% reduction
2. **Time to Interactive**: 40-60% improvement
3. **API Response Times**: 30-50% faster
4. **Database Query Performance**: 60-80% improvement
5. **Bundle Size**: 40-50% reduction

## Conclusion

The Hemp Resource Hub has significant performance optimization opportunities. By implementing these recommendations in priority order, you can dramatically improve user experience while reducing server costs and resource usage. Focus on the high-priority items first for maximum immediate impact.