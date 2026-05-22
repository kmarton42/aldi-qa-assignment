import { test, expect } from '@test';
import { ApiResult } from '@api/types';
import { adminCredentials } from '@testdata/auth/users';
import { CreateTaskRequest } from '@api/task.requests';
import { createTaskRequest } from '@testdata/task/task.factory';
import {
  CreateTaskResponse,
  CreateTaskResponseSchema,
  GetTaskResponse,
  GetTaskResponseSchema,
  UpdateTaskResponse,
  UpdateTaskResponseSchema,
} from '@schemas/task/task.schemas';

test('POST /tasks creates a new task', async ({ createApiClient }) => {
  const apiClient = await createApiClient(adminCredentials);
  const payload = createTaskRequest();

  let apiResult!: ApiResult<CreateTaskResponse>;
  let taskId: number | null = null;

  try {
    await test.step('WHEN I send a POST request to /tasks with valid task data', async () => {
      apiResult = await apiClient.createTask(payload);
    });

    await test.step('THEN the API responds with status code 201', async () => {
      expect(apiResult.status).toBe(201);
    });

    await test.step('AND response body matches the CreateTaskResponseSchema schema', async () => {
      expect(JSON.stringify(apiResult.body)).toMatchSchema(CreateTaskResponseSchema);
    });

    await test.step('AND the response contains the created task ID', async () => {
      taskId = apiResult.body!.id;

      expect(taskId).toBeDefined();
      expect(typeof taskId).toBe('number');
    });

    await test.step('AND the response contains the submitted task data', async () => {
      expect(apiResult.body).toMatchObject({
        id: taskId,
        title: payload.title,
        description: payload.description,
        completed: payload.completed,
      });
    });
  } finally {
    await test.step('CLEANUP remove task if it was created', async () => {
      await cleanupTask(apiClient, taskId);
    });
  }
});

test('POST /tasks returns 400 if mandatory title is missing', async ({ createApiClient }) => {
  const apiClient = await createApiClient(adminCredentials);

  let apiResult!: ApiResult<CreateTaskResponse>;

  await test.step('WHEN I send a POST request to /tasks without mandatory title', async () => {
    const invalidPayload = {
      ...createTaskRequest(),
      title: undefined,
    } as unknown as CreateTaskRequest;

    apiResult = await apiClient.createTask(invalidPayload);
  });

  await test.step('THEN the API responds with status code 400', async () => {
    expect(apiResult.status).toBe(400);
  });

  await test.step('AND response body is undefined or empty', async () => {
    expect(apiResult.body).toBeUndefined();
  });
});

test('GET /tasks/:id returns existing task by ID', async ({ createApiClient }) => {
  const apiClient = await createApiClient(adminCredentials);
  const createPayload = createTaskRequest();

  let taskId: number | null = null;
  let createdTask!: CreateTaskResponse;
  let apiResult!: ApiResult<GetTaskResponse>;

  try {
    await test.step('GIVEN a task exists in the system', async () => {
      const createResponse = await apiClient.createTask(createPayload);

      expect(createResponse.status).toBe(201);

      createdTask = createResponse.body!;
      taskId = createdTask.id;
    });

    await test.step('WHEN I send a GET request to /tasks/:id', async () => {
      apiResult = await apiClient.getTask(taskId!);
    });

    await test.step('THEN the API responds with status code 200', async () => {
      expect(apiResult.status).toBe(200);
    });

    await test.step('AND response body matches the GetTaskResponseSchema schema', async () => {
      expect(JSON.stringify(apiResult.body)).toMatchSchema(GetTaskResponseSchema);
    });

    await test.step('AND the response body contains the requested task data', async () => {
      expect(apiResult.body).toMatchObject({
        id: taskId,
        title: createdTask.title,
        description: createdTask.description,
        completed: createdTask.completed,
      });
    });
  } finally {
    await test.step('CLEANUP remove task if it was created', async () => {
      await cleanupTask(apiClient, taskId);
    });
  }
});

test('GET /tasks/:id returns 404 for non-existing task', async ({ createApiClient }) => {
  const apiClient = await createApiClient(adminCredentials);

  let apiResult!: ApiResult<GetTaskResponse>;

  await test.step('WHEN I send a GET request to /tasks/:id with a non-existing ID', async () => {
    apiResult = await apiClient.getTask(999999999);
  });

  await test.step('THEN the API responds with status code 404', async () => {
    expect(apiResult.status).toBe(404);
  });

  await test.step('AND response body is undefined or empty', async () => {
    expect(apiResult.body).toBeUndefined();
  });
});

test('PUT /tasks/:id updates existing task by ID', async ({ createApiClient }) => {
  const apiClient = await createApiClient(adminCredentials);
  const createPayload = createTaskRequest();

  const updatePayload = createTaskRequest({
    title: 'Updated task title',
    description: 'Updated task description',
    completed: true,
  });

  let taskId: number | null = null;
  let apiResult!: ApiResult<UpdateTaskResponse>;

  try {
    await test.step('GIVEN a task exists in the system', async () => {
      const createResponse = await apiClient.createTask(createPayload);

      expect(createResponse.status).toBe(201);

      taskId = createResponse.body!.id;
    });

    await test.step('WHEN I send a PUT request to /tasks/:id with updated task data', async () => {
      apiResult = await apiClient.updateTask(taskId!, updatePayload);
    });

    await test.step('THEN the API responds with status code 200', async () => {
      expect(apiResult.status).toBe(200);
    });

    await test.step('AND response body matches the UpdateTaskResponseSchema schema', async () => {
      expect(JSON.stringify(apiResult.body)).toMatchSchema(UpdateTaskResponseSchema);
    });

    await test.step('AND the response body contains the updated task data', async () => {
      expect(apiResult.body).toMatchObject({
        id: taskId,
        title: updatePayload.title,
        description: updatePayload.description,
        completed: updatePayload.completed,
      });
    });
  } finally {
    await test.step('CLEANUP remove task if it was created', async () => {
      await cleanupTask(apiClient, taskId);
    });
  }
});

test('PUT /tasks/:id returns 404 for non-existing task', async ({ createApiClient }) => {
  const apiClient = await createApiClient(adminCredentials);

  let apiResult!: ApiResult<UpdateTaskResponse>;

  await test.step('WHEN I send a PUT request to /tasks/:id with a non-existing ID', async () => {
    const updatePayload = createTaskRequest({
      title: 'Updated task title',
      description: 'Updated task description',
      completed: true,
    });

    apiResult = await apiClient.updateTask(999999999, updatePayload);
  });

  await test.step('THEN the API responds with status code 404', async () => {
    expect(apiResult.status).toBe(404);
  });

  await test.step('AND response body is undefined or empty', async () => {
    expect(apiResult.body).toBeUndefined();
  });
});

test('DELETE /tasks/:id deletes existing task by ID', async ({ createApiClient }) => {
  const apiClient = await createApiClient(adminCredentials);
  const createPayload = createTaskRequest();

  let taskId: number | null = null;
  let deleteResult!: ApiResult<unknown>;
  let getResult!: ApiResult<GetTaskResponse>;

  try {
    await test.step('GIVEN a task exists in the system', async () => {
      const createResponse = await apiClient.createTask(createPayload);

      expect(createResponse.status).toBe(201);

      taskId = createResponse.body!.id;
    });

    await test.step('WHEN I send a DELETE request to /tasks/:id', async () => {
      deleteResult = await apiClient.deleteTask(taskId!);
    });

    await test.step('THEN the API responds with status code 204', async () => {
      expect(deleteResult.status).toBe(204);
    });

    await test.step('AND the deleted task can no longer be retrieved', async () => {
      getResult = await apiClient.getTask(taskId!);

      expect(getResult.status).toBe(404);
      expect(getResult.body).toBeUndefined();

      taskId = null;
    });
  } finally {
    await test.step('CLEANUP remove task if it was created', async () => {
      await cleanupTask(apiClient, taskId);
    });
  }
});

test('DELETE /tasks/:id returns 404 for non-existing task', async ({ createApiClient }) => {
  const apiClient = await createApiClient(adminCredentials);

  let apiResult!: ApiResult<unknown>;

  await test.step('WHEN I send a DELETE request to /tasks/:id with a non-existing ID', async () => {
    apiResult = await apiClient.deleteTask(999999999);
  });

  await test.step('THEN the API responds with status code 404', async () => {
    expect(apiResult.status).toBe(404);
  });

  await test.step('AND response body is undefined or empty', async () => {
    expect(apiResult.body).toBeUndefined();
  });
});

async function cleanupTask(
  apiClient: {
    deleteTask: (taskId: number) => Promise<ApiResult<unknown>>;
  },
  taskId: number | null,
) {
  if (taskId === null) {
    return;
  }

  const deleteResponse = await apiClient.deleteTask(taskId);

  if (deleteResponse.status < 200 || deleteResponse.status >= 300) {
    const msg = `⚠️ Cleanup warning: DELETE /tasks/${taskId} returned ${deleteResponse.status}`;

    await test.info().attach('cleanup-warning', {
      body: msg,
      contentType: 'text/plain',
    });
  }
}