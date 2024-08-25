import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { api_urls } from '../utils/Constance';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http: HttpClient) {} // Constructor Injection
  
  addEmployeeService(employee:any){
    return this.http.post<any>(`${api_urls.authServiceApi}/create`,employee)
  }

  getAllEmployeeList(page: number = 1, limit: number = 10){
    return this.http.get<any>(`${api_urls.authServiceApi}/employee-list?page=${page}&limit=${limit}`)
  }

  editEmployeeDetails(employee:any,id:string){
    return this.http.put<any>(`${api_urls.authServiceApi}/employee/${id}`,employee)
  }


  deleteEmployee(id:string){
    return this.http.delete<any>(`${api_urls.authServiceApi}/employee/${id}`)
  }
}
