import { CreateJiraIssue } from '../../services/JiraConnector';

describe('JiraConnector', () => {
  it('Function CreateJiraIssue', () => {
    const datos = {
      name: 'unit-test',
      company: 'unit-company',
      subject: 'A simple unit test',
      account: 'Account unit test',
      email: 'unitTest@email.com',
      phone: 123,
      message: 'test functional from unit test'
    };
    CreateJiraIssue(datos, 123);
  });
});
