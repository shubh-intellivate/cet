import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../services/data.service';
declare let $: any;

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.scss']
})
export class RecordsComponent implements OnInit {
  console = console;
  Object = Object;
  type: any;
  rank: any;
  bu: any;
  geo: any;
  start_date: any;
  end_date: any;
  currency: any;
  table_data:any;
  table_headers:any = [];
  apiType: any;
  timeframe: any;
  account: any;
  lost_reason: any;
  highestValue: any;
  tableTitle: string;
  month: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private dataService : DataService
  ) { 
    this.activatedRoute.queryParams.subscribe(params => {
      this.bu = params.bu;
      this.geo = params.geo;
      this.start_date = params.start_date;
      this.end_date = params.end_date;
      this.currency = params.currency;
      this.type = params.type;
      this.rank = params.rank;
      this.apiType = params.api_type;
      this.timeframe = params.timeframe;
      this.account = params.account;
      this.lost_reason = params.lost_reason;
      this.highestValue = params.highestValue;
      this.month = params.month;
    })
  }

  ngOnInit(): void {
    setTimeout(()=>{                        
      $('#datatable').DataTable(
        {
          "lengthMenu": [[10, 15, -1], [10, 15, "All"]]
        }
      );
    }, 3000);
    if(this.account && this.account !=''){
      this.tableTitle = '';
      let data =  {
        "bu": this.bu == "undefined" ? '' : this.bu,
        "timeframe": this.timeframe == "undefined" ? '' : this.timeframe,
        "account": this.account == "undefined" ? '' : this.account
      }
      this.dataService.getTopAccountProjects(data).subscribe(res=>{
        console.log(res);
        if(res.result.status == "true"){
          this.table_data = res.result.data
          this.table_data.every(element => {
            for (let key in element) {
              this.table_headers.push(key)
            }
            return false;
          });
        }
      })
    }else if(this.lost_reason && this.lost_reason !=''){
      this.tableTitle = '';
      let data =  {
        "bu": this.bu == "undefined" ? '' : this.bu,
        "timeframe": this.timeframe == "undefined" ? '' : this.timeframe,
        "lost_reason": this.lost_reason == "undefined" ? '' : this.lost_reason
      }
      this.dataService.getLostReason(data).subscribe(res=>{
        console.log(res);
        if(res.result.status == "true"){
          this.table_data = res.result.data
          this.table_data.every(element => {
            for (let key in element) {
              this.table_headers.push(key)
            }
            return false;
          });
        }
      })
    }else if(this.month && this.month !=''){
      this.tableTitle = '';
      let data =  {
        "bu": this.bu == "undefined" ? '' : this.bu,
        "timeframe": this.timeframe == "undefined" ? '' : this.timeframe,
        "rank": this.rank == "undefined" ? '' : this.rank,
        "month": this.month == "undefined" ? '' : this.month
      }
      this.dataService.getOrderTrendRows(data).subscribe(res=>{
        console.log(res);
        if(res.result.status == "true"){
          this.table_data = res.result.data
          this.table_data.every(element => {
            for (let key in element) {
              this.table_headers.push(key)
            }
            return false;
          });
        }
      })
    }else{
      this.tableTitle = '';
      let data =  {
        "bu": this.bu == "undefined" ? '' : this.bu,
        "start_date": this.start_date == "undefined" ? '' : this.start_date,
        "end_date": this.end_date == "undefined" ? '' : this.end_date,
        "geo": this.geo == "undefined" ? '' : this.geo,
        "currency": this.currency == "undefined" ? '' : this.currency,
        "type": this.type == "undefined" ? '' : this.type,
        "rank": this.rank == "undefined" ? '' : this.rank,
        "api_type": this.apiType == "undefined" ? '' : this.apiType,
        "timeframe": this.timeframe == "undefined" ? '' : this.timeframe,
        "highestValue": this.highestValue == "undefined" ? '' : this.highestValue
      }
      if(this.highestValue && this.highestValue != 0){
        this.tableTitle = 'Outliers';
      }
      this.dataService.getOrderRecords(data).subscribe(res=>{
        if(res.result.status == "true"){
          this.table_data = res.result.data
          this.table_data.every(element => {
            for (let key in element) {
              this.table_headers.push(key)
            }
            return false;
          });
        }
      })
    }
  }

}
