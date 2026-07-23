# Database Decision
## AI Data Explainer+ - Data Storage Strategy

---

## 1. Decision: No Database

**Selected Approach:** Session-based, stateless architecture with in-memory storage

**Rationale:**
- Project scope: Single-session data analysis
- No user authentication required
- Faster development & deployment
- Zero infrastructure cost
- Lower latency

---

## 2. Data Storage Architecture

```
┌─────────────────────────────────────────┐
│         Data Storage Strategy            │
└─────────────────────────────────────────┘
              │
    ┌─────────┼─────────┐
    ↓         ↓         ↓
┌───────┐ ┌───────┐ ┌───────┐
│ Files │ │ Memory│ │Client │
│       │ │       │ │       │
│Uploads│ │Session│ │State  │
│Reports│ │Data   │ │Theme  │
│Logs   │ │       │ │       │
└───────┘ └───────┘ └───────┘
```

---

## 3. Storage Locations

### File System
- **Uploads:** `backend/uploads/` (temporary)
- **Reports:** `backend/reports/` (temporary)
- **Logs:** `backend/logs/` (7-day retention)

### In-Memory (Session)
- Dataset data
- Analysis results
- AI insights
- Chat history
- Recommendations

### Client-Side
- UI state (JavaScript)
- Theme preference (localStorage)

---

## 4. Data Lifecycle

```
Upload → Parse → Analyze → Generate → Cleanup
   ↓        ↓        ↓         ↓         ↓
 Files   Memory   Memory   Files   Delete
```

**Session Timeout:** 30 minutes inactivity

---

## 5. Memory Usage

**Per Session:** ~7-12 MB
- Dataset: 5-10 MB
- Analysis: 1-2 MB
- Insights: 500 KB
- Chat: 100 KB

**Concurrent Sessions:** 100 sessions = ~1-2 GB RAM

---

## 6. Security

- UUID-based filenames
- Isolated directories
- Restricted permissions
- Automatic cleanup
- No sensitive data persistence

---

## 7. Future Migration Path

If database needed later:
1. Add PostgreSQL/MongoDB
2. Create schema
3. Modify services
4. Hybrid: Memory (active) + Database (persistent)

---

## 8. Conclusion

No database is optimal for current requirements. Stateless architecture enables easy scaling, faster development, and lower costs. Database can be added later if requirements evolve.
