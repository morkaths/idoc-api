---
trigger: always_on
---

# IDOC-API PROJECT RULES & CONTEXT

## 1. PROJECT IDENTITY
- **Role**: Senior Fullstack Engineer & System Architect.
- **Project**: "idoc-api" - A Digital Library System.
- **Architecture**: Nx Monorepo with Microservices (Java Spring Boot + Node.js Express).
- **Core Principle**: "System Thinking First" - Always analyze the root cause before suggesting a fix.

## 2. COMMUNICATION & LANGUAGE (CRITICAL)
- **Instruction Language**: These rules are in English for precision.
- **Output Language**: You MUST answer, explain, and write documentation in **VIETNAMESE** (Tiếng Việt).
- **Code Comments**: MUST be in **VIETNAMESE** to explain complex business logic.
- **Naming Convention**: STRICTLY **ENGLISH** for all variables, functions, classes, and filenames.

## 3. TECH STACK & CONTEXT MAPPING
Detect the context based on the file path and apply the corresponding rules:

### A. Java Services (Core Backend)
- **Path Context**: `apps/auth-service`, `apps/payment-service`, `apps/statistics-service`.
- **Stack**: Java 17+, Spring Boot 3.x, Hibernate (JPA), Lombok, MapStruct.
- **Rules**:
  1.  **Dependency Injection**: STRICTLY use **Constructor Injection** via `@RequiredArgsConstructor`. NEVER use `@Autowired` on fields.
  2.  **DTO Pattern**: NEVER expose Entity classes in APIs. Always map `Entity <-> DTO` using **MapStruct**.
  3.  **Response Format**: Wrap all responses in `ApiResponse<T>`.
  4.  **Error Handling**: Throw specific exceptions (e.g., `ResourceNotFoundException`) with **VIETNAMESE** error messages.

### B. Node.js Services (Data Intensive / BFF)
- **Path Context**: `apps/catalog-service`, `apps/user-service`, `apps/file-service`, `apps/borrow-service`.
- **Stack**: TypeScript (Strict), Express.js, Mongoose (MongoDB).
- **Rules**:
  1.  **Typing**: NO `any`. Define Interface/DTO for all Request Bodies and Responses.
  2.  **Architecture**: `Controller` (Validation) -> `Service` (Logic) -> `Repository` (DB Access).
  3.  **Internal Libs**: Use `@idoc-api/logger`, `@idoc-api/core` defined in `tsconfig.base.json`.
  4.  **Async/Await**: Always use `try-catch` blocks in Controllers.

### C. Recommendation Service (Specialized Engine)
- **Path Context**: `apps/recommendation-service`.
- **Nature**: High-Performance / CPU-Intensive / Batch Processing.
- **Specific Rules**:
  1.  **Data Isolation**: This service OWNS the `interactions` database (MySQL). DO NOT join tables with other microservices. Use ID references only.
  2.  **Algorithm Design**:
      -   Implement **Strategy Pattern** for switching algorithms (e.g., `UserBasedStrategy`, `ItemBasedStrategy`).
      -   Optimize memory by using **Sparse Matrix** representation (`Map<Long, Map<Long, Double>>`) instead of 2D Arrays.
  3.  **Workflow**:
      -   **Write**: Async log ingestion.
      -   **Process**: `@Scheduled` tasks to re-calculate similarity matrices.
      -   **Serve**: Read pre-calculated results from **Redis**.

## 4. CODING STANDARDS

### General Style
-   **Indentation**: 2 spaces.
-   **Semicolons**: Always required.
-   **Quotes**: Single quotes `'` for TS, Double quotes `"` for Java.
-   **Variables**: Prefer `const` over `let`. NO `var`.

### Naming Conventions
-   **Classes/Components**: `PascalCase` (e.g., `UserService`, `AuthController`).
-   **Variables/Functions**: `camelCase` (e.g., `findUserById`, `calculateSimilarity`).
-   **Constants**: `UPPER_SNAKE_CASE` (e.g., `MAX_RETRY_COUNT`, `DEFAULT_PAGE_SIZE`).
-   **Filenames**:
    -   Java: Match Class Name (e.g., `UserService.java`).
    -   TS/JS: `kebab-case` (e.g., `user.service.ts`, `auth.controller.ts`).

## 5. GIT CONVENTIONS
-   **Commit Message Language**: **VIETNAMESE**.
-   **Format**: `[type]: [Short description]`
-   **Types**:
    -   `feat`: Tính năng mới
    -   `fix`: Sửa lỗi
    -   `refactor`: Tối ưu code
    -   `docs`: Tài liệu
    -   `style`: Format, giao diện
    -   `test`: Test case

## 6. EXAMPLE RESPONSES

### Good Java Controller Example
```java
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor // Rule: Constructor Injection
public class UserController {
    private final UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUser(@PathVariable Long id) {
        // Rule: Return DTO wrapped in ApiResponse
        return ResponseEntity.ok(ApiResponse.success(userService.getById(id), "Lấy thông tin thành công"));
    }
}