# API Documentation

## Base URL

```
https://api.yourdomain.com/v1
```

## Authentication

All API endpoints require authentication unless otherwise noted. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Error Responses

### Common Error Status Codes

| Status Code | Description |
|-------------|-------------|
| 400 | Bad Request - Invalid request format |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Something went wrong |

### Error Response Format

```json
{
  "error": {
    "code": "error_code",
    "message": "Human-readable error message",
    "details": {
      "field": "Specific error details"
    }
  }
}
```

## Projects

### Get All Projects

```http
GET /api/projects
```

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| status | string | No | Filter by status (active, completed, on-hold) |
| limit | number | No | Number of items per page (default: 10) |
| page | number | No | Page number (default: 1) |

#### Response

```json
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "status": "active" | "completed" | "on-hold",
      "startDate": "2023-01-01T00:00:00.000Z",
      "endDate": "2023-12-31T00:00:00.000Z",
      "managerId": "string",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

### Create Project

```http
POST /api/projects
```

#### Request Body

```json
{
  "name": "Project Name",
  "description": "Project Description",
  "status": "active",
  "startDate": "2023-01-01",
  "endDate": "2023-12-31",
  "teamMembers": ["user1", "user2"]
}
```

#### Response

```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "status": "active",
  "startDate": "2023-01-01T00:00:00.000Z",
  "endDate": "2023-12-31T00:00:00.000Z",
  "managerId": "string",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

## Authentication

### Sign In

```http
POST /api/auth/signin
```

#### Request Body

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Response

```json
{
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "image": "string"
  },
  "expires": "2023-01-01T00:00:00.000Z"
}
```

## Tasks

### Get Project Tasks

```http
GET /api/projects/:projectId/tasks
```

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| status | string | No | Filter by status |
| assignee | string | No | Filter by assignee ID |
| dueDate | string | No | Filter by due date (YYYY-MM-DD) |

#### Response

```json
{
  "data": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "status": "todo" | "in-progress" | "in-review" | "done",
      "priority": "low" | "medium" | "high",
      "dueDate": "2023-01-01T00:00:00.000Z",
      "projectId": "string",
      "assigneeId": "string",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

## Rate Limiting

- 100 requests per minute per IP address
- 1000 requests per hour per user (authenticated)

## Webhooks

### Events

- `project.created`
- `project.updated`
- `project.deleted`
- `task.created`
- `task.updated`
- `task.deleted`

### Payload Example

```json
{
  "event": "project.created",
  "data": {
    "id": "string",
    "name": "string",
    "managerId": "string"
  },
  "timestamp": "2023-01-01T00:00:00.000Z"
}
```
