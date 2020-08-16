import gql from 'graphql-tag';

export const CREATE_PROJECT_MUTATION = gql`
  mutation createProject($title: String!, $description: String!) {
    createProject(editProjectReq: { title: $title, description: $description }) {
      id
      creator {
        id
      }
      title
      description
    }
  }
`;

export const EDIT_PROJECT_MUTATION = gql`
  mutation editProject($id: ID!, $title: String!, $description: String!) {
    editProject(id: $id, editProjectReq: { title: $title, description: $description }) {
      id
      creator {
        id
      }
      title
      description
    }
  }
`;

export const DEL_PROJECT_MUTATION = gql`
  mutation deleteProject($id: ID!) {
    deleteProject(id: $id) {
      id
      title
      description
    }
  }
`;

export const PROJECT_BY_ID_QUERY = gql`
  query projectById($id: ID!) {
    projectById(id: $id) {
      id
      title
      description
    }
  }
`;

export const PROJECTS_QUERY = gql`
  query projects($first: Int = 10, $offset: Int = 1) {
    projects(first: $first, offset: $offset) {
      id
      title
      description
    }
  }
`;
