# Task 3: API Testing

## Note

The original task mentions REST-assured, but I implemented the API test suite using Playwright API testing because it better matches my current automation stack and allows the same Given/When/Then structure, fixtures, schema validation, and cleanup approach that I use in my test automation work.

Since the exact API contract is not provided, the expected status codes are based on common REST conventions.

## Implementation notes

The tests use a custom `createApiClient` fixture. This fixture creates a custom API client that wraps the lower-level Playwright API request calls and exposes domain-specific methods such as `createTask`, `getTask`, `updateTask`, and `deleteTask`.

The `toMatchSchema` assertion is a custom matcher used to validate the response body against the expected response schema.

This keeps the test cases readable and focused on business-level API behavior instead of low-level request implementation details.

## Covered endpoints

- POST /tasks - Create a new task
- GET /tasks/{id} - Retrieve a task by ID
- PUT /tasks/{id} - Update a task by ID
- DELETE /tasks/{id} - Delete a task by ID

## Expected status codes and responses

| Endpoint | Scenario | Expected status | Expected response |
|---|---|---:|---|
| POST /tasks | Valid task creation request | 201 Created | Created task object with generated ID |
| POST /tasks | Missing mandatory title | 400 Bad Request | Empty body or validation error response |
| GET /tasks/{id} | Existing task ID | 200 OK | Task object |
| GET /tasks/{id} | Non-existing task ID | 404 Not Found | Empty body or error response |
| PUT /tasks/{id} | Existing task ID with valid update data | 200 OK | Updated task object |
| PUT /tasks/{id} | Non-existing task ID | 404 Not Found | Empty body or error response |
| DELETE /tasks/{id} | Existing task ID | 204 No Content | Empty response body |
| DELETE /tasks/{id} | Non-existing task ID | 404 Not Found | Empty body or error response |

## Test implementation

The test implementation is provided in:

```text
tasks.spec.ts