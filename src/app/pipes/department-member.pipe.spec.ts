import { DepartmentMemberPipe } from './department-member.pipe';

describe('DepartmentMemberPipe', () => {
  it('create an instance', () => {
    const pipe = new DepartmentMemberPipe();
    expect(pipe).toBeTruthy();
  });
});
