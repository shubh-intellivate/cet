import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of} from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }
  httpOptions = {
    headers: new HttpHeaders({
      'Referrer-Policy': 'no-referrer-when-downgrade',
      'Access-Control-Allow-Origin': 'http://88.218.92.164/',
      // 'Access-Control-Allow-Origin': 'http://45.66.159.11/',
      'Access-Control-Allow-Methods': 'GET,POST',
      'Access-Control-Allow-Credentials': 'true',
      'Authorization': 'Basic ' + btoa('shubhendru:Shubh@123')
    })
  }

  public getBuNames(): Observable<any> {
    return this.http.get(environment.API_URL+"api/x_intp_cet_and_fin/cet_common_utils/get_bu", this.httpOptions)
  }

  public getBuByBranch(postData: any): Observable<any> {
    return this.http.post(environment.API_URL+"api/x_intp_cet_and_fin/cet_common_utils/get_bu_by_branch", postData, this.httpOptions)
  }

  public getBuNamesGrouping(): Observable<any> {
    // return this.http.get(environment.API_URL+"api/x_intp_cet_and_fin/cet_common_utils/get_bu", this.httpOptions)
    return of({
      "status": true,
      "bu_names": [
          {
              group: 'All',
              items: [
                  {value: '', name: 'All BU'}
              ]
          },
          {
              group: 'GDC',
              items: [
                  {value: 'BU 1', name: 'BU 1'},
                  {value: 'BU 2', name: 'BU 2'},
                  {value: 'BU 3', name: 'BU 3'},
                  {value: 'BU 4', name: 'BU 4'}
              ]
          },
          {
              group: 'Public',
              items: [
                  {value: 'BU 5', name: 'BU 5'},
                  {value: 'BU 6', name: 'BU 6'}
              ]
          },
          {
              group: 'AIPF',
              items: [
                  {value: 'BU AIPF BU', name: 'AIPF'}
              ]
          }
      ]
    });
  }

  public getOrderOverview(postData: any): Observable<any> {
    return this.http.post(environment.API_URL+"api/x_intp_cet_and_fin/cet/order_overview", postData, this.httpOptions)
  }

  public getOrderRecords(postData: any): Observable<any> {
    return this.http.post(environment.API_URL+"api/x_intp_cet_and_fin/cet/get_rows_sales", postData, this.httpOptions)
  }

  public getTopAccountProjects(postData: any): Observable<any> {
    return this.http.post(environment.API_URL+"api/x_intp_cet_and_fin/project_and_account/get_row", postData, this.httpOptions)
  }

  public getLostReason(postData: any): Observable<any> {
    return this.http.post(environment.API_URL+"api/x_intp_cet_and_fin/lost_oppertunity/lost_oppertunity_get_row", postData, this.httpOptions)
  }

  public getSalesOverview(postData: any): Observable<any> {
    return this.http.post(environment.API_URL+"api/x_intp_cet_and_fin/cet/sales_overview", postData, this.httpOptions)
  }

  public getLostOpportunities(postData: any): Observable<any> {
    return this.http.post(environment.API_URL+"api/x_intp_cet_and_fin/lost_oppertunity/lost_percentage", postData, this.httpOptions)
  }

  public getOrderTrend(postData: any): Observable<any> {
    return this.http.post(environment.API_URL+"api/x_intp_cet_and_fin/month_rank_wise/month_rank", postData, this.httpOptions)
  }

  public getOrderTrendRows(postData: any): Observable<any> {
    return this.http.post(environment.API_URL+"api/x_intp_cet_and_fin/month_rank_wise/rank_get_row", postData, this.httpOptions)
  }

  public getSalesRecords(postData: any): Observable<any> {
    return this.http.post(environment.API_URL+"api/x_intp_cet_and_fin/cet/get_rows_sales", postData, this.httpOptions)
  }

  public getOrderConversionOpp(postData: any): Observable<any> {
    return this.http.post(environment.API_URL+"api/x_intp_cet_and_fin/orderconversion/number", postData, this.httpOptions)
  }

  public getOrderConversionAmt(postData: any): Observable<any> {
    return this.http.post(environment.API_URL+"api/x_intp_cet_and_fin/orderconversion/amount", postData, this.httpOptions)
  }

  public getOrdersBooked(postData: any): Observable<any> {
    return this.http.post(environment.API_URL+"api/x_intp_cet_and_fin/cet/order_booked_last_month", postData, this.httpOptions)
  }

  public getBidWinRate(postData: any): Observable<any> {
    return this.http.post(environment.API_URL+"api/x_intp_cet_and_fin/cet/bid_win_rate", postData, this.httpOptions)
  }

  public getAvgOrderCycle(postData: any): Observable<any> {
    return this.http.post(environment.API_URL+"api/x_intp_cet_and_fin/cet/avg_order_cycle", postData, this.httpOptions)
  }

  public getAvgOrderSize(postData: any): Observable<any> {
    return this.http.post(environment.API_URL+"api/x_intp_cet_and_fin/cet/average_order_size", postData, this.httpOptions)
  }

  public getOrderRunRate(postData: any): Observable<any> {
    return this.http.post(environment.API_URL+"api/x_intp_cet_and_fin/cet/order_run_rate", postData, this.httpOptions)
  }

  public getEstimatedRunRate(postData: any): Observable<any> {
    return this.http.post(environment.API_URL+"api/x_intp_cet_and_fin/cet/estimated_order_run_rate", postData, this.httpOptions)
  }

  public getRequiredRunRate(postData: any): Observable<any> {
    return this.http.post(environment.API_URL+"api/x_intp_cet_and_fin/cet/required_order_run_rate", postData, this.httpOptions)
  }

  public getSalesRunRate(postData: any): Observable<any> {
    return this.http.post(environment.API_URL+"api/x_intp_cet_and_fin/cet/current_sales_run_rate", postData, this.httpOptions)
  }

  public getSalesEstimatedRunRate(postData: any): Observable<any> {
    return this.http.post(environment.API_URL+"api/x_intp_cet_and_fin/cet/estimated_sales_run_rate", postData, this.httpOptions)
  }

  public getSalesRequiredRunRate(postData: any): Observable<any> {
    return this.http.post(environment.API_URL+"api/x_intp_cet_and_fin/cet/required_sales_run_rate", postData, this.httpOptions)
  }

  public getTopKeyProjects(postData: any): Observable<any> {
    return this.http.post(environment.API_URL+"api/x_intp_cet_and_fin/project_and_account/project", postData, this.httpOptions)
  }

  public getTopKeyAccounts(postData: any): Observable<any> {
    return this.http.post(environment.API_URL+"api/x_intp_cet_and_fin/project_and_account/account", postData, this.httpOptions)
  }

  public getSayDoOrder(postData: any): Observable<any> {
    return this.http.post(environment.API_URL+"api/x_intp_cet_and_fin/cet/say_do_ratio_order", postData, this.httpOptions)
  }

  public getSayDoSales(postData: any): Observable<any> {
    return this.http.post(environment.API_URL+"api/x_intp_cet_and_fin/cet/say_do_ratio_sales", postData, this.httpOptions)
  }

  public getNewCustomersAcquired(postData: any): Observable<any> {
    return this.http.post(environment.API_URL+"api/x_intp_cet_and_fin/cet/new_customer_acquired", postData, this.httpOptions)
  }

  public getSalesBreakdownRows(postData: any): Observable<any> {
    return this.http.post(environment.API_URL+"api/x_intp_cet_and_fin/cet/sales_breakdown_row", postData, this.httpOptions)
  }

  public login(username: any, password: any): Observable<any> {

    var postData = {
      "user_name": username,
      "password": password
    }

    return this.http.post(environment.API_URL+"api/intp/usergroupaccesscheckvalidation", postData, this.httpOptions)

  }

}
