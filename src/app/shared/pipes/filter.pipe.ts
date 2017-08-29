import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'filter'})
export class FilterPipe implements PipeTransform {
  transform(value :any, args :any) : any[] {
    if(value && args){
      let filteredData = value;
      if(hasValueAndArgs(value, args)){
        if(isNumberOrString(args)){
          args = getLowerCaseFromNumberOrString(args);
          if(isNumberOrString(value[0])){
            filteredData = value.filter((object: string) => object.toLowerCase().indexOf(args) >= 0);
          } else {
            let keys = getObjectKeys(value[0]);
            filteredData = value.filter((object: string[]) => filterObjectWitString(object, keys, args));
          }
        } else {
          filteredData = value.filter((object: any[]) => filterObjectWithObject(object, args));
        }
      }

      return filteredData;
    } else {
      return value;
    }
  }
}

function getLowerCaseFromNumberOrString(obj: any){
  if(typeof obj === 'string'){
    return obj.toLowerCase();
  } else if(!isNaN(obj)){
    return obj.toString();
  } else {
    return JSON.stringify(obj).toLowerCase();
  }
}

function isNumberOrString(obj: any) {
  return typeof obj === 'string' || !isNaN(obj);
}

function hasValueAndArgs(value: any, args: any) {
  return value.length > 0 && isNotEmpty(args);
}

function getObjectKeys(obj: any) {
  let k: any[] = [];
  for (let key in obj) {
    k.push(key);
  }
  return k;
}

function isNotEmpty(obj: any) {
   for(var key in obj) {
      if (obj[key] && obj[key].length > 0) {
         return true;
      }
   }
   return false;
}

function filterObjectWitString(obj :any, keys :string[], term :string){
  for (let key in keys) {
    let v = obj[keys[key]];
    if(v){
      v = getLowerCaseFromNumberOrString(v);
      if(typeof v == 'string' && v.indexOf(term) >= 0){
        return true;
      }
    }
  }
  return false;
}

function filterObjectWithObject(obj :any, filter :any){
  for (let filterKey in filter) {
    let filterValue = filter[filterKey];
    if(filterValue){
      let value = obj[filterKey];
      if(value){
        filterValue = getLowerCaseFromNumberOrString(filterValue);
        value = getLowerCaseFromNumberOrString(value);
        if(typeof value == 'string' && typeof filterValue == 'string' && value.indexOf(filterValue) >= 0){
          return true;
        }
      }
    }
  }
  return false;
}
