import {Pipe, PipeTransform} from '@angular/core';
import {BaseFilterModel} from '../../DTOs/filter/BaseFilterModel';
import {PriorityFilterModel} from '../../DTOs/filter/PriorityFilterModel';

@Pipe({
  name: 'castToFilterPriorityModel',
  pure: true
})
export class CastToFilterPriorityModelPipe implements PipeTransform {

  transform(baseFilterModel: BaseFilterModel): PriorityFilterModel {
    // return new PriorityFilterModel(false, []);
    return <PriorityFilterModel>baseFilterModel;
  }

}
