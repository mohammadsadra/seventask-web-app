import { Pipe, PipeTransform } from '@angular/core';
import {UserDTO} from '../DTOs/user/UserDTO';
import {DepartmentDTO} from '../DTOs/department/DepartmentDTO';

@Pipe({
  name: 'departmentMember'
})
export class DepartmentMemberPipe implements PipeTransform {

  transform(allMembers: UserDTO[], allDepartments: DepartmentDTO[], id: string): UserDTO[] {

    if (id === 'AllDepartment') {
      return allMembers;
    } else {
      for (let i = 0; i < allDepartments.length; i++) {
        if (allDepartments[i].id.toString() === id) {
          return allDepartments[i].users;
        }
      }
    }
  }

}
