import { closeDatabase, initDatabase } from '../../src/utils/database';
import { userService } from '../../src/services/user.service';
import { initApolloTestClient } from '../utils/apollo-test-client';
import { projectService } from '../../src/services/project.service';
import {
  PROJECT_BY_ID_QUERY,
  PROJECTS_QUERY,
  CREATE_PROJECT_MUTATION,
  DEL_PROJECT_MUTATION,
  EDIT_PROJECT_MUTATION,
} from './project.api.test.gql';
import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';

describe('Test project api', () => {
  const authorIds = [];

  beforeAll(async () => {
    initDatabase();
  });

  afterAll(async (done) => {
    // Closing the DB connection allows Jest to exit successfully.
    await closeDatabase();
    done();
  });

  test('Test createProject mutation success', async () => {
    const user = await userService.findByEmail('user@mail.com');

    const title = 'Test project';
    const description = 'Test description';

    const { mutate } = await initApolloTestClient({
      authUser: user,
    });

    const { data } = await mutate({
      mutation: CREATE_PROJECT_MUTATION,
      variables: {
        title,
        description,
      },
    });

    expect(data.createProject).toBeTruthy();
    expect(data.createProject.creator.id).toBe('' + user.id);
    expect(data.createProject.title).toBe(title);
    expect(data.createProject.description).toBe(description);
  });

  test('Test editProject mutation fail, id not found', async () => {
    const user = await userService.findByEmail('user@mail.com');

    const title = 'Test project';
    const description = 'Test description';
    const project = await projectService.createProject(user.id, {
      title,
      description,
    });
    const { id } = project;
    const newTitle = 'New title';
    const newDescription = 'New description';
    await projectService.deleteProject(id);

    const { mutate } = await initApolloTestClient({
      authUser: user,
    });
    const { data, errors } = await mutate({
      mutation: EDIT_PROJECT_MUTATION,
      variables: {
        id,
        title: newTitle,
        description: newDescription,
      },
    });
    expect(data.relq).not.toBeTruthy();
    expect(errors).not.toBeTruthy();
  });

  test('Test editProject mutation success', async () => {
    const user = await userService.findByEmail('user@mail.com');

    const title = 'Test project';
    const description = 'Test description';
    const project = await projectService.createProject(user.id, {
      title,
      description,
    });
    const { id } = project;
    const newTitle = 'Test project new';
    const newDescription = 'Test description new';

    const { mutate } = await initApolloTestClient({
      authUser: user,
    });

    const { data } = await mutate({
      mutation: EDIT_PROJECT_MUTATION,
      variables: {
        id,
        title: newTitle,
        description: newDescription,
      },
    });
    expect(data.editProject).toBeTruthy();
    expect(data.editProject.title).toBe(newTitle);
    expect(data.editProject.description).toBe(newDescription);
  });

  test('Test deleteProject mutation fail, id not found', async () => {
    const user = await userService.findByEmail('user@mail.com');

    const title = 'Test project';
    const description = 'Test description';
    const project = await projectService.createProject(user.id, {
      title,
      description,
    });
    const { id } = project;
    await projectService.deleteProject(id);

    const { mutate } = await initApolloTestClient({
      authUser: user,
    });
    const { data, errors } = await mutate({
      mutation: DEL_PROJECT_MUTATION,
      variables: {
        id,
      },
    });
    expect(data.deleteProject).not.toBeTruthy();
    expect(errors).not.toBeTruthy();
  });

  test('Test deleteProject mutation success', async () => {
    const user = await userService.findByEmail('user@mail.com');

    const title = 'Test project';
    const description = 'Test description';
    const project = await projectService.createProject(user.id, {
      title,
      description,
    });
    const { id } = project;

    const { mutate } = await initApolloTestClient({
      authUser: user,
    });
    const { data } = await mutate({
      mutation: DEL_PROJECT_MUTATION,
      variables: {
        id,
      },
    });
    expect(data.deleteProject).toBeTruthy();
    expect(data.deleteProject.title).toBe(title);
    expect(data.deleteProject.description).toBe(description);
  });

  test('Test projectById query fail, id not found', async () => {
    const user = await userService.findByEmail('user@mail.com');

    const title = 'Test project 5';
    const description = 'Test description 5';
    const project = await projectService.createProject(user.id, {
      title,
      description,
    });
    const { id } = project;
    await projectService.deleteProject(id);

    const { query } = await initApolloTestClient({
      authUser: user,
    });
    const { data, errors } = await query({
      query: PROJECT_BY_ID_QUERY,
      variables: {
        id,
      },
    });
    expect(data.projectById).not.toBeTruthy();
    expect(errors).not.toBeTruthy();
  });

  test('Test projectById query success', async () => {
    const user = await userService.findByEmail('user@mail.com');

    const title = 'Test project';
    const description = 'Test description';
    const project = await projectService.createProject(user.id, {
      title,
      description,
    });
    const { id } = project;

    const { query } = await initApolloTestClient({
      authUser: user,
    });
    const { data } = await query({
      query: PROJECT_BY_ID_QUERY,
      variables: {
        id,
      },
    });
    expect(data.projectById).toBeTruthy();
    expect(data.projectById.title).toBe(title);
    expect(data.projectById.description).toBe(description);
  });

  test('Test projects query fail, limit exceeded', async () => {
    const user = await userService.findByEmail('user@mail.com');

    const title = 'Test project';
    const description = 'Test description';
    await projectService.createProject(user.id, {
      title,
      description,
    });

    const { query } = await initApolloTestClient({
      authUser: user,
    });
    const { data, errors } = await query({
      query: PROJECTS_QUERY,
      variables: {
        first: 101,
        offset: 1,
      },
    });
    expect(data).not.toBeTruthy();
    expect(errors.length).toBeTruthy();
    expect(errors[0].extensions.code).toBe('BAD_USER_INPUT');
  });

  test('Test projects query success', async () => {
    const user = await userService.findByEmail('user@mail.com');

    const title = 'Test project';
    const description = 'Test description';
    await projectService.createProject(user.id, {
      title,
      description,
    });

    const { query } = await initApolloTestClient({
      authUser: user,
    });
    const { data } = await query({
      query: PROJECTS_QUERY,
    });
    expect(data.projects).toBeTruthy();
    expect(Array.isArray(data.projects)).toBeTruthy();
  });
});
