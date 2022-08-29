import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsSolidGauge from 'highcharts/modules/solid-gauge';
import Drilldown from 'highcharts/modules/drilldown';
import { DataService } from '../services/data.service';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {FormGroup, FormControl} from '@angular/forms';
Drilldown(Highcharts);

@Component({
  selector: 'app-branches',
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.scss']
})
export class BranchesComponent implements OnInit {
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  prev_year_saydo_order_value: boolean = false;
  prev_year_saydo_order: boolean = true;
  cur_year_saydo_order_value: boolean = false;
  cur_year_saydo_order: boolean = true;
  order_opp_per: boolean = false;
  order_opp_graph: boolean = true;
  order_amt_per: boolean = false;
  order_amt_graph: boolean = true;
  orderByAmount: boolean = true;
  orderByOpp: boolean = false;

  @ViewChild("bu") bu: ElementRef;
  @ViewChild("geo") geo: ElementRef;
  @ViewChild("timeframe") timeframe: ElementRef;
  @ViewChild("toggleClass") toggleClass: ElementRef;
  @ViewChild("toggleProj") toggleProj: ElementRef;
  @ViewChild("toggleSale") togglesale: ElementRef;
  // @ViewChild("toggleG") toggleG: ElementRef;
  @ViewChild("toggleSeg") toggleSeg: ElementRef;  
  @ViewChild("currency") currency: ElementRef;
  @ViewChild("toggleOrder") toggleOrder: ElementRef;
  customDateFilter: any="none";
  infoModal: any="none";
  pipelineModal: any="none";
  salesModal: any="none";
  SalesInfoModal: any="none";
  timeFilter: any="Annual";
  buFilter: any="All BU";
  filter_data: string = 'YTD';
  orderOppPerValue: any;
  orderAmtPerValue: string;
  ordersBookedLastMonth: any;
  ordersBookedMonth: any;
  bidWinRate: any;
  avgOrderCycle: any;
  avgOrderSize: any;
  currentBC: any;
  pipelineClassify: any;
  branch_clicked: any = false;
  geoClassify: any;
  orderRunRate: any;
  estimatedRunRate: any;
  requiredRunRate: any;
  blur: any = '';
  chart_lost_opp: any;
  chart_line_top_accounts: any;
  chart_line: any;
  top_key_projects_actuals: any;
  base_url: any = "http://88.218.92.164/";
  // base_url: any = "http://localhost:4201/";
  sayDoOrderValue: any;
  top_key_accounts: any;
  sayDoSalesValue: any;
  actual_timeframe:any = '1H';
  classify_rank_show: boolean = false;
  classify_class_show: boolean = true;
  geo_rank_show: boolean = false;
  geo_class_show: boolean = true;
  subProjectClassify: any;
  buFilterLink: any = "";
  newCustomers: any;
  segment_rank_show: boolean = false;
  segment_class_show: boolean = true;
  normalizedavg: any;
  highestValue: any;
  classify_sales_show: boolean = false;
  classify_sales_rank_show: boolean = true;
  chart_sales: Highcharts.Chart;
  maxOrderSizeValue: any;
  minOrderSizeValue: any;
  top_key_projects_open: any;
  hide_project_actuals: boolean = false;
  hide_project_open: boolean = true;
  salesBreakdown: any;
  filterBu: any;
  filterStart_date: string;
  filterEnd_date: string;
  filterGeo: any;
  filterCurrency: any;
  filterTimeframe: any;
  order_graph_order: any;
  hide_branches_order: boolean = false;
  hide_single_branch_order: boolean = true;
  hide_branches_billing: boolean = false;
  hide_single_branch_billing: boolean = true;
  geoFilter: any = "All Branches";
  chart_growth_trend: any;

  constructor(
    private dataService : DataService
  ){ }
  

  ngOnInit() {
    this.createChartGaugeOrder('','','','','','');
    this.createChartGaugeSales('','','','','','');
    this.createOrderOppGraph('','','','','','');
    this.createOrderAmtGraph('','','','','','');
    this.getOrdersBookedLastMonth('','');
    this.getBidWinRate('','','','','','');
    this.getAvgOrderCycle('','','','','','');
    this.getAvgOrderSize('','','','','','');
    this.getOrderRunRate('','','','','','');
    this.getEstimatedRunRate('','','','','','');
    this.getRequiredRunRate('','','','','','');
    this.getTopKeyProjects('','','','','','');
    this.getTopKeyAccounts('','','','','','');
    this.getSayDoOrder('','','','','','');
    this.getSayDoSales('','','','','','');
    this.getNewCustomersAcquired('','','','','','');
    this.getLostOpportunities('','','','','','');
    this.getOrderTrend('','','','','','');
    this.createGrowthTrend('','','','','',''); 
    this.createClosedLostOpp('','','','','',''); 

  }

  ngAfterViewInit(){
    // this.order_graph_order.reflow();
    // this.chart_line.reflow();
    // this.chart_growth_trend.redraw();
  }

  openOrderInfo(){
    this.infoModal = "block";
    this.blur = "blur";
  }

  closeOrderInfo(){
    this.infoModal = "none";
    this.blur = "";
  }

  toggleProjects(){
    if(this.toggleProj.nativeElement.value == 'actual'){
      this.hide_project_actuals = false;
      this.hide_project_open = true;
    }else{
      this.hide_project_actuals = true;
      this.hide_project_open = false;
    }
  }

  toggleClassify(){
    if(this.toggleClass.nativeElement.value == 'rank'){
      this.classify_rank_show = false;
      this.classify_class_show = true;
    }else{
      this.classify_rank_show = true;
      this.classify_class_show = false;
    }
  }

  toggleSales(){
    if(this.togglesale.nativeElement.value == 'overall'){
      this.classify_sales_show = false;
      this.classify_sales_rank_show = true;
    }else{
      this.classify_sales_show = true;
      this.classify_sales_rank_show = false;
    }
  }

  // toggleGeo(){
  //   if(this.toggleG.nativeElement.value == 'rank'){
  //     this.geo_rank_show = false;
  //     this.geo_class_show = true;
  //   }else{
  //     this.geo_rank_show = true;
  //     this.geo_class_show = false;
  //   }
  // }

  toggleSegment(){
    if(this.toggleSeg.nativeElement.value == 'stages'){
      this.segment_rank_show = false;
      this.segment_class_show = true;
    }else{
      this.segment_rank_show = true;
      this.segment_class_show = false;
    }
  }

  openPipelineModal(){
    this.blur = "blur";
    this.pipelineModal = "block";
    this.geo_rank_show = false;
    this.geo_class_show = true;
    this.segment_rank_show = false;
    this.segment_class_show = true;
    this.toggleSeg.nativeElement.value = 'stages';
    // this.toggleG.nativeElement.value = 'rank'
    var classify_pipeline = {
      chart: {
        type: 'column',
      },
      title: {
          text: '' ,
          align: 'right'
      },
      accessibility: {
          announceNewData: {
              enabled: true
          }
      },
      xAxis: {
          type: 'category'
      },
      yAxis: {
          title: {
              text: ''
          },
          gridLineColor: 'transparent',
          type: 'logarithmic',
          minorTickInterval: 100,
          stackLabels: {
            enabled: true,
            style: {
                fontWeight: 'bold',
                color: ( // theme
                    Highcharts.defaultOptions.title.style &&
                    Highcharts.defaultOptions.title.style.color
                ) || 'gray'
            },
            formatter: function () {
              return this.total;
            }
        },labels:{
          enabled: false
        }
  
      },
      legend: {
          enabled: true
      },
      plotOptions: {
          series: {
              borderWidth: 0,
              dataLabels: {
                  enabled: true,
                  formatter:function() {
                    if(this.y != 0) {
                      return this.y;
                    }
                  }
              }
          },
          column: {
            stacking: 'normal',
            dataLabels: {
                enabled: true
            }
        }
      },
      colors: ['rgb(182,196,237)', 'rgb(162,197,238)', 'rgb(119,135,186)', 'rgb(117,150,208)', 'rgb(57,93,157)', 'rgb(122,148,228)', 'rgb(132,174,220)', 'rgb(143,163,213)'],
      tooltip: {
          headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
          pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y} Mn</b>'
      },
  
      series: [
          {
          name: '10%-20%',
          dataLabels: {
            enabled: true,
            formatter:function() {
              if(this.y != 0) {
                return '<span style="font-weight:normal;color:white;fill:white;">'+this.y+ '</span>';
              }
            },
            style: {
              color: 'white',
              textOutline: 'transparent'
            }
          },
          data: [{
            name: 'EE',
            y: 50,
            drilldown: ''
          }, {
            name: 'EN',
            y: 15,
            drilldown: ''
          }, {
            name: 'NN',
            y: 40,
            drilldown: ''
          }]
        },{
          name: '30%',
          dataLabels: {
            enabled: true,
            formatter:function() {
              if(this.y != 0) {
                return '<span style="font-weight:normal;color:white;fill:white;">'+this.y+ '</span>';
              }
            },
            style: {
              color: 'white',
              textOutline: 'transparent'
            }
          },
          data: [{
            name: 'EE',
            y: 367,
            drilldown: ''
          }, {
            name: 'EN',
            y: 15,
            drilldown: ''
          }, {
            name: 'NN',
            y: 16,
            drilldown: ''
          }]
        },{
          name: '50%-70%',
          dataLabels: {
            enabled: true,
            formatter:function() {
              if(this.y != 0) {
                return '<span style="font-weight:normal;color:white;fill:white;">'+this.y+ '</span>';
              }
            },
            style: {
              color: 'white',
              textOutline: 'transparent'
            }
          },
          data: [{
            name: 'EE',
            y: 451,
            drilldown: ''
          }, {
            name: 'EN',
            y: 23,
            drilldown: ''
          }, {
            name: 'NN',
            y: 10,
            drilldown: ''
          }]
        },{
          name: '90%',
          dataLabels: {
            enabled: true,
            formatter:function() {
              if(this.y != 0) {
                return '<span style="font-weight:normal;color:white;fill:white;">'+this.y+ '</span>';
              }
            },
            style: {
              color: 'white',
              textOutline: 'transparent'
            }
          },
          data: [{
            name: 'EE',
            y: 27,
            drilldown: ''
          }, {
            name: 'EN',
            y: 1,
            drilldown: ''
          }, {
            name: 'NN',
            y: 4,
            drilldown: ''
          }]
        },{
          name: '100%',
          dataLabels: {
            enabled: true,
            formatter:function() {
              if(this.y != 0) {
                return '<span style="font-weight:normal;color:white;fill:white;">'+this.y+ '</span>';
              }
            },
            style: {
              color: 'white',
              textOutline: 'transparent'
            }
          },
          data: [{
            name: 'EE',
            y: 359,
            drilldown: ''
          }, {
            name: 'EN',
            y: 209,
            drilldown: ''
          }, {
            name: 'NN',
            y: 32,
            drilldown: ''
          }]
        }
      ]
    }
    Highcharts.chart('classify-pipeline-rank', classify_pipeline as any);
    var amount_arr = [
      ['GDC', 1430],
      ['Non-GDC', 191]
    ];
    var geo_pipeline = {
      chart: {
          type: 'pie'
      },
      colors: ['rgb(70,121,167)','rgb(192, 201, 228)', 'rgb(162,197,238)', 'rgb(124,148,207)', 'rgb(48,137,202)'],
      title: {
          text: '',
          align: 'center',
          verticalAlign: 'middle',
          x: -135
      },
      accessibility: {
          announceNewData: {
              enabled: true
          },
          point: {
              valueSuffix: '%'
          }
      },
      plotOptions: {
        pie: {
          size:'100%'
        },
        series: {
            dataLabels: {
                enabled: false,
                format: '{point.y:.1f}%'
            },
            cursor: 'pointer',
        }
      },
      tooltip: {
          // headerFormat: '<span style="font-size:11px">Percentage</span><br>',
          // pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
          formatter(){
            let point = this,
            amount;
            amount_arr.forEach(d => {
              if(d[0] == point.point['name']){
                amount = d[1]
              }
            })
            return `${point.key} <br> <b>${point.series.name}: ${point.point.y}%</b> <br>Amount: ${amount}Mn`
          }
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        itemMarginTop: 10,
        itemMarginBottom: 10,
        // labelFormat: '{name} {y:.1f}%',
        labelFormatter: function () {
          let point = this,
          no_of_opp;
          amount_arr.forEach(d => {
            if(d[0] == point.name){
              no_of_opp = d[1]
            }
          })
          return `${point.name}: ${no_of_opp}(${point.y}%)`
        }
      },
      series: [
          {
              name: "Percentage",
              showInLegend: true,
              colorByPoint: true,
              innerSize: '0%',
              point: {
                events: {
                    click: function () {
                        // location.href = this.options.url;
                        window.open(this.options.url);
                    }
                }
              },
              data: [ {
                  name: 'GDC',
                  y: 88,
                  // url: this.base_url+'records?bu='+bu+'&lost_reason=Price&timeframe='+timeframe
                },
                {
                  name: 'Non-GDC',
                  y: 12,
                  // url: this.base_url+'records?bu='+bu+'&lost_reason=Lost to Competition&timeframe='+timeframe
                }
              ]
          }
      ]
    }
    Highcharts.chart('geo-pipeline-rank', geo_pipeline as any);
    var order_pipeline = {
      chart: {
          type: 'pie'
      },
      colors: ['rgb(70,121,167)','rgb(192, 201, 228)', 'rgb(162,197,238)', 'rgb(124,148,207)', 'rgb(48,137,202)'],
      title: {
          text: '1621',
          align: 'center',
          verticalAlign: 'middle',
          x: -100
      },
      accessibility: {
          announceNewData: {
              enabled: true
          },
          point: {
              valueSuffix: '%'
          }
      },
      plotOptions: {
        pie: {
          size:'100%'
        },
        series: {
            dataLabels: {
                enabled: false,
                format: '{point.y:.1f}%'
            },
            cursor: 'pointer',
        }
      },
      tooltip: {
          // headerFormat: '<span style="font-size:11px">Percentage</span><br>',
          // pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
          formatter(){
            let point = this,
            amount;
            amount_arr.forEach(d => {
              if(d[0] == point.point['name']){
                amount = d[1]
              }
            })
            return `${point.key} <br> <b>${point.series.name}: ${point.point.y}%</b> <br>Amount: ${amount}Mn`
          }
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        itemMarginTop: 10,
        itemMarginBottom: 10,
        labelFormat: '{name} {y:.1f}%',
      },
      series: [
          {
              name: "Percentage",
              showInLegend: true,
              colorByPoint: true,
              innerSize: '50%',
              point: {
                events: {
                    click: function () {
                        // location.href = this.options.url;
                        window.open(this.options.url);
                    }
                }
              },
              data: [ {
                  name: 'Closed Won',
                  y: 35,
                  // url: this.base_url+'records?bu='+bu+'&lost_reason=Price&timeframe='+timeframe
                },
                {
                  name: 'Proposal',
                  y: 22,
                  // url: this.base_url+'records?bu='+bu+'&lost_reason=Lost to Competition&timeframe='+timeframe
                },
                {
                  name: 'Demo/POC',
                  y: 18,
                  // url: this.base_url+'records?bu='+bu+'&lost_reason=Lost to Competition&timeframe='+timeframe
                },
                {
                  name: 'Contact/Proposal',
                  y: 12,
                  // url: this.base_url+'records?bu='+bu+'&lost_reason=Lost to Competition&timeframe='+timeframe
                },
                {
                  name: 'Final Negotiation',
                  y: 10,
                  // url: this.base_url+'records?bu='+bu+'&lost_reason=Lost to Competition&timeframe='+timeframe
                },
                {
                  name: 'Needs Analysis',
                  y: 1,
                  // url: this.base_url+'records?bu='+bu+'&lost_reason=Lost to Competition&timeframe='+timeframe
                },
                {
                  name: 'Order In Progress',
                  y: 2,
                  // url: this.base_url+'records?bu='+bu+'&lost_reason=Lost to Competition&timeframe='+timeframe
                }
              ]
          }
      ]
    }
    Highcharts.chart('order-pipeline-stages', order_pipeline as any);
    var order_pipeline_class = {
      chart: {
          type: 'pie'
      },
      colors: ['rgb(15, 82, 186)', 'rgb(115, 194, 251)' , 'rgb(38, 97, 156)', 'rgb(117,150,208)', 'rgb(57,93,157)', 'rgb(122,148,228)', 'rgb(132,174,220)', 'rgb(143,163,213)'],
      title: {
          text: '1621',
          align: 'center',
          verticalAlign: 'middle',
          x: -50
      },
      accessibility: {
          announceNewData: {
              enabled: true
          },
          point: {
              valueSuffix: '%'
          }
      },
      plotOptions: {
        pie: {
          size:'100%'
        },
        series: {
            dataLabels: {
                enabled: false,
                format: '{point.y:.1f}%'
            },
            cursor: 'pointer',
        }
      },
      tooltip: {
          // headerFormat: '<span style="font-size:11px">Percentage</span><br>',
          // pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
          formatter(){
            let point = this,
            amount;
            amount_arr.forEach(d => {
              if(d[0] == point.point['name']){
                amount = d[1]
              }
            })
            return `${point.key} <br> <b>${point.series.name}: ${point.point.y}%</b> <br>Amount: ${amount}Mn`
          }
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        itemMarginTop: 10,
        itemMarginBottom: 10,
        labelFormat: '{name} {y:.1f}%',
      },
      series: [
          {
              name: "Percentage",
              showInLegend: true,
              colorByPoint: true,
              innerSize: '50%',
              point: {
                events: {
                    click: function () {
                        // location.href = this.options.url;
                        window.open(this.options.url);
                    }
                }
              },
              data: [ {
                  name: 'EE',
                  y: 81,
                  // url: this.base_url+'records?bu='+bu+'&lost_reason=Price&timeframe='+timeframe
                },
                {
                  name: 'EN',
                  y: 12,
                  // url: this.base_url+'records?bu='+bu+'&lost_reason=Lost to Competition&timeframe='+timeframe
                },
                {
                  name: 'NN',
                  y: 7,
                  // url: this.base_url+'records?bu='+bu+'&lost_reason=Lost to Competition&timeframe='+timeframe
                }
              ]
          }
      ]
    }
    Highcharts.chart('order-pipeline-class', order_pipeline_class as any);

    var open_pipeline_stages = {
      chart: {
          type: 'pie'
      },
      colors: ['rgb(70,121,167)','rgb(192, 201, 228)', 'rgb(162,197,238)', 'rgb(124,148,207)', 'rgb(48,137,202)'],
      title: {
          text: '1021',
          align: 'center',
          verticalAlign: 'middle',
          x: -100
      },
      accessibility: {
          announceNewData: {
              enabled: true
          },
          point: {
              valueSuffix: '%'
          }
      },
      plotOptions: {
        pie: {
          size:'100%'
        },
        series: {
            dataLabels: {
                enabled: false,
                format: '{point.y:.1f}%'
            },
            cursor: 'pointer',
        }
      },
      tooltip: {
          // headerFormat: '<span style="font-size:11px">Percentage</span><br>',
          // pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
          formatter(){
            let point = this,
            amount;
            amount_arr.forEach(d => {
              if(d[0] == point.point['name']){
                amount = d[1]
              }
            })
            return `${point.key} <br> <b>${point.series.name}: ${point.point.y}%</b> <br>Amount: ${amount}Mn`
          }
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        itemMarginTop: 10,
        itemMarginBottom: 10,
        labelFormat: '{name} {y:.1f}%',
      },
      series: [
          {
              name: "Percentage",
              showInLegend: true,
              colorByPoint: true,
              innerSize: '50%',
              point: {
                events: {
                    click: function () {
                        // location.href = this.options.url;
                        window.open(this.options.url);
                    }
                }
              },
              data: [ 
              {
                name: 'Proposal',
                y: 39,
                // url: this.base_url+'records?bu='+bu+'&lost_reason=Lost to Competition&timeframe='+timeframe
              },
              {
                name: 'Demo/POC',
                y: 36,
                // url: this.base_url+'records?bu='+bu+'&lost_reason=Lost to Competition&timeframe='+timeframe
              },
              {
                name: 'Contact/Proposal',
                y: 12,
                // url: this.base_url+'records?bu='+bu+'&lost_reason=Lost to Competition&timeframe='+timeframe
              },
              {
                name: 'Final Negotiation',
                y: 10,
                // url: this.base_url+'records?bu='+bu+'&lost_reason=Lost to Competition&timeframe='+timeframe
              },
              {
                name: 'Needs Analysis',
                y: 1,
                // url: this.base_url+'records?bu='+bu+'&lost_reason=Lost to Competition&timeframe='+timeframe
              },
              {
                name: 'Order In Progress',
                y: 2,
                // url: this.base_url+'records?bu='+bu+'&lost_reason=Lost to Competition&timeframe='+timeframe
              }
            ]
          }
      ]
    }
    Highcharts.chart('open-pipeline-stages', open_pipeline_stages as any);
  }

  openSalesModal(){
    this.blur = "blur";
    this.salesModal = "block";
    var amount_arr = [
      ['New', 179],
      ['Backlog', 201]
    ];
    var billing_delivery_date = {
      chart: {
          type: 'pie'
      },
      colors: ['rgb(70,121,167)','rgb(192, 201, 228)', 'rgb(162,197,238)', 'rgb(124,148,207)', 'rgb(48,137,202)'],
      title: {
          text: '6464',
          align: 'center',
          verticalAlign: 'middle',
          x: -85
      },
      accessibility: {
          announceNewData: {
              enabled: true
          },
          point: {
              valueSuffix: '%'
          }
      },
      plotOptions: {
        pie: {
          size:'100%'
        },
        series: {
            dataLabels: {
                enabled: false,
                format: '{point.y:.1f}%'
            },
            cursor: 'pointer',
        }
      },
      tooltip: {
          // headerFormat: '<span style="font-size:11px">Percentage</span><br>',
          // pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
          formatter(){
            let point = this,
            amount;
            amount_arr.forEach(d => {
              if(d[0] == point.point['name']){
                amount = d[1]
              }
            })
            return `${point.key} <br> <b>${point.series.name}: ${point.point.y}%</b> <br>Amount: ${amount}Mn`
          }
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        itemMarginTop: 10,
        itemMarginBottom: 10,
        labelFormat: '{name} {y:.1f}%',
      },
      series: [
          {
              name: "Percentage",
              showInLegend: true,
              colorByPoint: true,
              innerSize: '50%',
              point: {
                events: {
                    click: function () {
                        // location.href = this.options.url;
                        window.open(this.options.url);
                    }
                }
              },
              data: [ {
                  name: 'Q1 FY2022',
                  y: 21,
                  // url: this.base_url+'records?bu='+bu+'&lost_reason=Price&timeframe='+timeframe
                },
                {
                  name: 'Q2 FY2022',
                  y: 26,
                  // url: this.base_url+'records?bu='+bu+'&lost_reason=Lost to Competition&timeframe='+timeframe
                },
                {
                  name: 'Q3 FY2022',
                  y: 25,
                  // url: this.base_url+'records?bu='+bu+'&lost_reason=Lost to Competition&timeframe='+timeframe
                },
                {
                  name: 'Q4 FY2022',
                  y: 28,
                  // url: this.base_url+'records?bu='+bu+'&lost_reason=Lost to Competition&timeframe='+timeframe
                }
              ]
          }
      ]
    }
    Highcharts.chart('billing-delivery-date', billing_delivery_date as any);
  }

  closePipelineModal(){
    this.pipelineModal = "none";
    this.blur = '';
  }

  closeSalesModal(){
    this.salesModal = "none";
    this.blur = '';
  }

  openSalesInfo(){
    this.SalesInfoModal = "block";
    this.blur = "blur";
  }

  closeSalesInfo(){
    this.SalesInfoModal = "none";
    this.blur = "";
  }

  closeCustomDateFiler(){
    this.customDateFilter = "none";
  }

  private getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  toggleOrderConversion(){
    var toggleOrder = this.toggleOrder.nativeElement.value;
    if(toggleOrder == 'By Amount'){
      this.orderByAmount = true;
      this.orderByOpp = false;
    }else{
      this.orderByAmount = false;
      this.orderByOpp = true;
    }
  }

  globalFilter(){
    var bu = this.bu.nativeElement.value;
    var geo = this.geo.nativeElement.value;
    var timeframe = this.timeframe.nativeElement.value;
    var currency = this.currency.nativeElement.value;
    var start_date = ''
    var end_date = ''
    var timeframeFilter = ''
    this.buFilterLink = bu;

    if(geo == 'All Branches'){
      this.hide_branches_order = false;
      this.hide_single_branch_order = true;
      this.hide_branches_billing = false;
      this.hide_single_branch_billing = true;
    }else{
      this.hide_branches_order = true;
      this.hide_single_branch_order = false;
      this.hide_branches_billing = true;
      this.hide_single_branch_billing = false;
    }

    // if(bu == ''){
    //   this.buFilter = 'All BU'
    // }else if(bu == 'BU AIPF BU'){
    //   this.buFilter = 'AIPF'
    // }else if(bu == 'BU Display Business'){
    //   this.buFilter = 'Display'
    // }else if(bu == 'BU Smart Mfg.'){
    //   this.buFilter = 'Smart Mfg'
    // }
    this.buFilter = bu;
    this.geoFilter = geo;

    if(timeframe == 'ytd'){
      start_date = "2021-04-01";
      end_date = "2022-04-28";
      this.timeFilter = 'YTD';
      timeframeFilter = ''
      timeframe = ''
    }else if(timeframe == 'last_month'){
      start_date = "2021-03-28";
      end_date = "2022-04-28";
      timeframeFilter = ''
    }else if(timeframe == 'Q1'){
      start_date = "";
      end_date = "";
      this.timeFilter = 'Q1';
      timeframeFilter = 'Q1'
      this.actual_timeframe = 'Q1'
    }else if(timeframe == 'Q2'){
      start_date = "";
      end_date = "";
      this.timeFilter = 'Q2';
      timeframeFilter = 'Q2'
      this.actual_timeframe = 'Q2'
    }else if(timeframe == 'Q3'){
      start_date = "";
      end_date = "";
      this.timeFilter = 'Q3';
      timeframeFilter = 'Q3'
      this.actual_timeframe = 'Q2'
    }else if(timeframe == 'Q4'){
      start_date = "";
      end_date = "";
      this.timeFilter = 'Q4';
      timeframeFilter = 'Q4'
      this.actual_timeframe = 'Q2'
    }else if(timeframe == '1H'){
      start_date = "";
      end_date = "";
      this.timeFilter = '1H';
      timeframeFilter = '1H'
      this.actual_timeframe = '1H'
    }else if(timeframe == '2H'){
      start_date = "";
      end_date = "";
      this.timeFilter = '2H';
      timeframeFilter = '1H'
      this.actual_timeframe = '1H'
    }else if(timeframe == 'annual'){
      start_date = "";
      end_date = "";
      timeframeFilter = ''
      this.timeFilter = 'Annual';
      timeframe = ''
      this.actual_timeframe = '1H'
    }else if(timeframe == 'ytd'){
      start_date = "";
      end_date = "";
      timeframeFilter = ''
      this.timeFilter = 'YTD';
      timeframe = ''
      this.actual_timeframe = '1H'
    }else if(timeframe == 'custom'){
      this.customDateFilter ="block";
    }
    this.filterBu = bu;
    this.filterStart_date = start_date;
    this.filterEnd_date = end_date;
    this.filterGeo = geo;
    this.filterCurrency = currency;
    this.filterTimeframe= timeframe;

    this.createChartGaugeOrder(bu, start_date, end_date, geo, currency, timeframe);
    this.createChartGaugeSales('', start_date, end_date, '', currency, timeframe);
    this.createOrderOppGraph(bu, start_date, end_date, geo, currency, timeframe);
    this.createOrderAmtGraph(bu, start_date, end_date, geo, currency, timeframe);
    this.getOrdersBookedLastMonth(bu, geo);
    this.getBidWinRate(bu, start_date, end_date, geo, currency, timeframe);
    this.getAvgOrderCycle(bu, start_date, end_date, geo, currency, timeframe);
    this.getAvgOrderSize(bu, start_date, end_date, geo, currency, timeframe);
    this.getOrderRunRate(bu, start_date, end_date, geo, currency, timeframe);
    this.getEstimatedRunRate(bu, start_date, end_date, geo, currency, timeframe);
    this.getRequiredRunRate(bu, start_date, end_date, geo, currency, timeframe);
    this.getTopKeyProjects(bu, start_date, end_date, geo, currency, timeframe);
    this.getTopKeyAccounts(bu, start_date, end_date, geo, currency, timeframe);
    this.getSayDoOrder(bu, start_date, end_date, geo, currency, timeframe);
    this.getSayDoSales(bu, start_date, end_date, geo, currency, timeframe);
    this.getNewCustomersAcquired(bu, start_date, end_date, geo, currency, timeframe);
    this.getLostOpportunities(bu, start_date, end_date, geo, currency, timeframe);
    this.getOrderTrend(bu, start_date, end_date, geo, currency, timeframe);
    this.showOrderOppPercentage();
    this.showOrderAmtPercentage();
    this.showPrevYearSaydoValue();
    this.showCurYearSaydoValue();
    this.createGrowthTrend(bu, start_date, end_date, geo, currency, timeframe);
    this.createClosedLostOpp(bu, start_date, end_date, geo, currency, timeframe);
  }

  sayDoColor(val){
    var styles: any;
    if(val >= 115 || val <= 85){
      styles = {'color' : '#FF7F7F'};
    }else if((val < 115 && val > 110) || (val > 85 && val < 90)){
      styles = {'color' : '#E5CB82'};
    }else{
      styles = {'color' : '#4AA240'};
    }
    return styles;
  }

  getSayDoOrder(bu, start_date, end_date, geo, currency, timeframe){
    let data = {
      "bu":bu,
      "start_date":start_date,
      "end_date":end_date,
      "geo":geo,
      "currency":currency,
      "fiscal_year":"",
      "timeframe":timeframe
    };

    this.dataService.getSayDoOrder(data).subscribe(
      res => {
        if(res.result.status == "true"){
          this.sayDoOrderValue = res.result.result.say_do_ratio_sales;
          var xaxis = []
          var yaxis = []
          res.result.result.drilldown.forEach(element => {
            for (let key in element) {
              xaxis.push(key)
              yaxis.push(parseInt(element[key]))
            }
          });
          const chart_line_top_accounts = Highcharts.chart('chart-prev-year-saydo-order', {
            // chart: {
            //   zoomType: 'xy'
            // },
            title: {
                text: ''
            },
            colors: ['rgb(70,121,167)','rgb(162,197,238)'],
            yAxis: {
                  title: {
                    text: ''
                },
                type: 'logarithmic',
                minorTickInterval: 100,
                gridLineColor: 'transparent',
                stackLabels: {
                  enabled: true,
                  style: {
                      fontWeight: 'bold',
                      color: ( // theme
                          Highcharts.defaultOptions.title.style &&
                          Highcharts.defaultOptions.title.style.color
                      ) || 'gray'
                  },
                  formatter: function () {
                    return this.total;
                  }
              },
              labels:{
                enabled: false
              }
            },
            xAxis: {
                categories: xaxis
            },
            plotOptions: {
                line: {
                  dataLabels: {
                    enabled: true,
                    formatter: function () {
                      return this.y+'%';
                    }
                  }
                },
                column: {
                  dataLabels: {
                      enabled: true,
                      formatter: function () {
                        return this.y+'%';
                      }
                  }
                },
                cursor: 'pointer',
                point: {
                    events: {
                        click: function () {
                            // location.href = this.options.url;
                            window.open(this.options.url);
                        }
                    }
                },
            },
            tooltip: {
              pointFormat: '<span style="color:{series.color}">{series.name}: {point.y}%</span><br/>'
            },
            series: [{
                name: 'Order',
                type: 'line',
                showInLegend: false,
                data: yaxis
            }],
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        legend: {
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom'
                        }
                    }
                }]
            }
          
          } as any);
        }
      }
    );    
  }

  getSayDoSales(bu, start_date, end_date, geo, currency, timeframe){
    let data = {
      "bu":bu,
      "start_date":start_date,
      "end_date":end_date,
      "geo":geo,
      "currency":currency,
      "fiscal_year":"",
      "timeframe":timeframe
    };

    this.dataService.getSayDoSales(data).subscribe(
      res => {
        if(res.result.status == "true"){
          this.sayDoSalesValue = res.result.result.say_do_ratio_sales;
          var xaxis = []
          var yaxis = []
          res.result.result.drilldown.forEach(element => {
            for (let key in element) {
              xaxis.push(key)
              yaxis.push(parseInt(element[key]))
            }
          });
          const chart_line_top_accounts = Highcharts.chart('chart-prev-year-saydo-sales', {
            // chart: {
            //   zoomType: 'xy'
            // },
            title: {
                text: ''
            },
            colors: ['rgb(70,121,167)','rgb(162,197,238)'],
            yAxis: {
                  title: {
                    text: ''
                },
                type: 'logarithmic',
                minorTickInterval: 100,
                gridLineColor: 'transparent',
                stackLabels: {
                  enabled: true,
                  style: {
                      fontWeight: 'bold',
                      color: ( // theme
                          Highcharts.defaultOptions.title.style &&
                          Highcharts.defaultOptions.title.style.color
                      ) || 'gray'
                  },
                  formatter: function () {
                    return this.total;
                  }
              },
              labels:{
                enabled: false
              }
            },
            xAxis: {
                categories: xaxis
            },
            plotOptions: {
                line: {
                  dataLabels: {
                    enabled: true,
                    formatter: function () {
                      return this.y+'%';
                    }
                  }
                },
                column: {
                  dataLabels: {
                      enabled: true,
                      formatter: function () {
                        return this.y+'%';
                      }
                  }
                },
                cursor: 'pointer',
                point: {
                    events: {
                        click: function () {
                            // location.href = this.options.url;
                            window.open(this.options.url);
                        }
                    }
                },
            },
            tooltip: {
              pointFormat: '<span style="color:{series.color}">{series.name}: {point.y}%</span><br/>'
            },
            series: [{
                name: 'Order',
                type: 'line',
                showInLegend: false,
                data: yaxis
            }],
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        legend: {
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom'
                        }
                    }
                }]
            }
          
          } as any);
        }
      }
    );    
  }

  getTopKeyProjects(bu, start_date, end_date, geo, currency, timeframe){
    let data = {
      "bu":bu,
      "start_date":start_date,
      "end_date":end_date,
      "geo":geo,
      "currency":currency,
      "fiscal_year":"",
      "timeframe":timeframe
    };

    this.dataService.getTopKeyProjects(data).subscribe(
      res => {
        if(res.result.status == true){
          this.top_key_projects_actuals = res.result.result.Actual;
          this.top_key_projects_open = res.result.result.Open;
        }
      }
    );    
  }

  getTopKeyAccounts(bu, start_date, end_date, geo, currency, timeframe){
    let data = {
      "bu":bu,
      "start_date":start_date,
      "end_date":end_date,
      "geo":geo,
      "currency":currency,
      "fiscal_year":"",
      "timeframe":timeframe
    };

    this.dataService.getTopKeyAccounts(data).subscribe(
      res => {
        if(res.result.status == true){
          this.top_key_accounts = res.result.result;
          var number_of_opp = [
            [this.top_key_accounts.account_1.account, this.top_key_accounts.account_1.Number_of_oppertunity],
            [this.top_key_accounts.account_2.account, this.top_key_accounts.account_2.Number_of_oppertunity],
            [this.top_key_accounts.account_3.account, this.top_key_accounts.account_3.Number_of_oppertunity],
            [this.top_key_accounts.account_4.account, this.top_key_accounts.account_4.Number_of_oppertunity],
            [this.top_key_accounts.account_5.account, this.top_key_accounts.account_5.Number_of_oppertunity]
          ];
          this.chart_line_top_accounts = Highcharts.chart('chart-top-accounts', {
            chart: {
              zoomType: 'xy'
            },
            title: {
                text: ''
            },
            colors: ['rgb(70,121,167)','rgb(162,197,238)'],
            yAxis: {
                title: {
                    text: ''
                },
                type: 'logarithmic',
                minorTickInterval: 1000,
                gridLineColor: 'transparent',
                stackLabels: {
                  enabled: true,
                  style: {
                      fontWeight: 'bold',
                      color: ( // theme
                          Highcharts.defaultOptions.title.style &&
                          Highcharts.defaultOptions.title.style.color
                      ) || 'gray'
                  },
                  formatter: function () {
                    return this.total;
                  }
              },
              labels:{
                enabled: false
              }
            },
            xAxis: {
              type: 'category'
            },
            plotOptions: {
              column: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true,
                    formatter: function () {
                      return this.total;
                    }
                }
              },
              series: {
                pointWidth: 60,
                cursor: 'pointer',
              }
            },
            tooltip: {
              formatter(){
                let point = this,
                    no_of_opp;
                number_of_opp.forEach(d => {
                  if(d[0] == point.point['name']){
                    no_of_opp = d[1]
                  }
                })
                return `${point.key} <br> <b>${point.series.name}: ${point.point.y}</b> <br># of projects: ${no_of_opp}`
              }
            },
            series: [{
                name: 'Order',
                type:'column',
                showInLegend: false,
                dataLabels: {
                  enabled: false,
                  formatter:function() {
                    if(this.y != 0) {
                      return '<span style="font-weight:normal;color:white;fill:white;">'+this.y+ '</span>';
                    }
                  },
                  style: {
                    color: 'white',
                    textOutline: 'transparent'
                  }
                },
                point: {
                  events: {
                      click: function () {
                          // location.href = this.options.url;
                          window.open(this.options.url);
                      }
                  }
                },
                // data: [parseInt(this.top_key_accounts.account_1.amount),parseInt(this.top_key_accounts.account_2.amount),parseInt(this.top_key_accounts.account_3.amount),parseInt(this.top_key_accounts.account_4.amount),parseInt(this.top_key_accounts.account_5.amount)],
                data: [
                  {
                    name: this.top_key_accounts.account_1.account,
                    y: parseInt(this.top_key_accounts.account_1.amount),
                    url: this.base_url+'records?bu='+bu+'&account='+this.top_key_accounts.account_1.account+'&timeframe='+timeframe
                  },{
                    name: this.top_key_accounts.account_2.account,
                    y: parseInt(this.top_key_accounts.account_2.amount),
                    url: this.base_url+'records?bu='+bu+'&account='+this.top_key_accounts.account_2.account+'&timeframe='+timeframe
                  },{
                    name: this.top_key_accounts.account_3.account,
                    y: parseInt(this.top_key_accounts.account_3.amount),
                    url: this.base_url+'records?bu='+bu+'&account='+this.top_key_accounts.account_3.account+'&timeframe='+timeframe
                  },{
                    name: this.top_key_accounts.account_4.account,
                    y: parseInt(this.top_key_accounts.account_4.amount),
                    url: this.base_url+'records?bu='+bu+'&account='+this.top_key_accounts.account_4.account+'&timeframe='+timeframe
                  },{
                    name: this.top_key_accounts.account_5.account,
                    y: parseInt(this.top_key_accounts.account_5.amount),
                    url: this.base_url+'records?bu='+bu+'&account='+this.top_key_accounts.account_5.account+'&timeframe='+timeframe
                  },
                ]
            }],
            // },{
            //     name: '# of Projects',
            //     type: 'spline',
            //     showInLegend: false,
            //     dataLabels: {
            //       enabled: true,
            //       formatter:function() {
            //         if(this.y != 0) {
            //           return '<span style="font-weight:normal;color:white;fill:white;">'+this.y+ '</span>';
            //         }
            //       },
            //       style: {
            //         color: 'white',
            //         textOutline: 'transparent'
            //       }
            //     },
            //     data: [parseInt(this.top_key_accounts.account_1.Number_of_oppertunity),parseInt(this.top_key_accounts.account_2.Number_of_oppertunity),parseInt(this.top_key_accounts.account_3.Number_of_oppertunity),parseInt(this.top_key_accounts.account_4.Number_of_oppertunity),parseInt(this.top_key_accounts.account_5.Number_of_oppertunity)],
            //     lineWidth: 0
            // }],
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        legend: {
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom'
                        }
                    }
                }]
            }
      
          } as any);
          this.chart_line_top_accounts.reflow();
        }
      }
    );    
  }

  getOrdersBookedLastMonth(bu, geo){
    let data = {
      "bu":bu,
      "geo":geo,
    };

    this.dataService.getOrdersBooked(data).subscribe(
      res => {
        if(res.result.status == true){
          this.ordersBookedLastMonth = res.result.result.value;
          this.ordersBookedMonth = res.result.result.month;
        }
      }
    );    
  }

  getNewCustomersAcquired(bu, start_date, end_date, geo, currency, timeframe){
    let data = {
      "bu":bu,
      "start_date":start_date,
      "end_date":end_date,
      "geo":geo,
      "currency":currency,
      "fiscal_year":"",
      "timeframe":timeframe
  };

    this.dataService.getNewCustomersAcquired(data).subscribe(
      res => {
        if(res.result.status == "true"){
          this.newCustomers = res.result.count;
        }
      }
    );    
  }

  getBidWinRate(bu, start_date, end_date, geo, currency, timeframe){
    let data = {
      "bu":bu,
      "start_date":start_date,
      "end_date":end_date,
      "geo":geo,
      "currency":currency,
      "fiscal_year":"",
      "timeframe":timeframe
  };

    this.dataService.getBidWinRate(data).subscribe(
      res => {
        if(res.result.status == "true"){
          this.bidWinRate = res.result.result.winrate + '%';
        }
      }
    );    
  }

  getAvgOrderCycle(bu, start_date, end_date, geo, currency, timeframe){
    let data = {
      "bu":bu,
      "start_date":start_date,
      "end_date":end_date,
      "geo":geo,
      "currency":currency,
      "fiscal_year":"",
      "timeframe":timeframe
  };

    this.dataService.getAvgOrderCycle(data).subscribe(
      res => {
        if(res.result.status == "true"){
          this.avgOrderCycle = res.result.result.avgordercycle;
        }
      }
    );    
  }

  getAvgOrderSize(bu, start_date, end_date, geo, currency, timeframe){
    let data = {
      "bu":bu,
      "start_date":start_date,
      "end_date":end_date,
      "geo":geo,
      "currency":currency,
      "fiscal_year":"",
      "timeframe":timeframe
  };

    this.dataService.getAvgOrderSize(data).subscribe(
      res => {
        if(res.result.status == "true"){
          this.avgOrderSize = res.result.result.avgordersize;
          this.maxOrderSizeValue = res.result.result.maxValue;
          this.minOrderSizeValue = res.result.result.minValue;
          this.highestValue = res.result.result.highestvalue;
        }
      }
    );    
  }

  getOrderRunRate(bu, start_date, end_date, geo, currency, timeframe){
    let data = {
      "bu":bu,
      "start_date":start_date,
      "end_date":end_date,
      "geo":geo,
      "currency":currency,
      "fiscal_year":"",
      "timeframe":timeframe
  };

    this.dataService.getOrderRunRate(data).subscribe(
      res => {
        if(res.result.status == "true"){
          this.orderRunRate = res.result.result.runrate;
        }
      }
    );    
  }

  getEstimatedRunRate(bu, start_date, end_date, geo, currency, timeframe){
    let data = {
      "bu":bu,
      "start_date":start_date,
      "end_date":end_date,
      "geo":geo,
      "currency":currency,
      "fiscal_year":"",
      "timeframe":timeframe
  };

    this.dataService.getEstimatedRunRate(data).subscribe(
      res => {
        if(res.result.status == "true"){
          this.estimatedRunRate = res.result.result.runrate;
        }
      }
    );    
  }

  getRequiredRunRate(bu, start_date, end_date, geo, currency, timeframe){
    let data = {
      "bu":bu,
      "start_date":start_date,
      "end_date":end_date,
      "geo":geo,
      "currency":currency,
      "fiscal_year":"",
      "timeframe":timeframe
  };

    this.dataService.getRequiredRunRate(data).subscribe(
      res => {
        if(res.result.status == "true"){
          this.requiredRunRate = res.result.result.runrate;
        }
      }
    );    
  }

  showOrderOppPercentage(){
    this.order_opp_per = false;
    this.order_opp_graph = true;
  }

  showOrderOppGraph(){
    this.order_opp_per = true;
    this.order_opp_graph = false;
    
  }

  createOrderOppGraph(bu, start_date, end_date, geo, currency, timeframe){
    let data = {
        "bu":bu,
        "start_date":start_date,
        "end_date":end_date,
        "geo":geo,
        "currency":currency,
        "fiscal_year":"",
        "timeframe":timeframe
    };
    this.dataService.getOrderConversionOpp(data).subscribe(
      res => {
        if(res.result.status == "true"){
          this.orderOppPerValue = res.result.result.percentage+'%';
          var xaxis = []
          var yaxis = []
          res.result.result.drilldown.forEach(element => {
            for (let key in element) {
              xaxis.push(key)
              yaxis.push(parseFloat(element[key]))
            }
          });
          const chart_line_top_accounts = Highcharts.chart('chart-order-opp', {
            // chart: {
            //   zoomType: 'xy'
            // },
            title: {
                text: ''
            },
            colors: ['rgb(70,121,167)'],
            yAxis: {
              title: {
                  text: ''
              },
              gridLineColor: 'transparent',
              visible: false
            },
            xAxis: {
                categories: xaxis
            },
            plotOptions: {
                line: {
                  dataLabels: {
                    enabled: true,
                    formatter: function () {
                      return this.y+'%';
                    }
                  }
                },
                column: {
                  dataLabels: {
                      enabled: true,
                      formatter: function () {
                        return this.y+'%';
                      }
                  }
                },
                cursor: 'pointer',
                point: {
                    events: {
                        click: function () {
                            // location.href = this.options.url;
                            window.open(this.options.url);
                        }
                    }
                },
            },
            tooltip: {
              pointFormat: '<span style="color:{series.color}">{series.name}: {point.y}%</span><br/>'
            },
            series: [{
              name: 'Percentage',
              type: 'line',
              showInLegend: false,
              data: yaxis
          }],
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        legend: {
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom'
                        }
                    }
                }]
            }
          
          } as any);
        }
      }
    );
  }

  showOrderAmtPercentage(){
    this.order_amt_per = false;
    this.order_amt_graph = true;
  }

  showOrderAmtGraph(){
    this.order_amt_per = true;
    this.order_amt_graph = false;
  }

  createOrderAmtGraph(bu, start_date, end_date, geo, currency, timeframe){
    let data = {
      "bu":bu,
      "start_date":start_date,
      "end_date":end_date,
      "geo":geo,
      "currency":currency,
      "fiscal_year":"",
      "timeframe":timeframe
    };
    this.dataService.getOrderConversionAmt(data).subscribe(
      res => {
        if(res.result.status == "true"){
          this.orderAmtPerValue = res.result.result.percentage+'%';
          var xaxis = []
          var yaxis = []
          res.result.result.drilldown.forEach(element => {
            for (let key in element) {
              xaxis.push(key)
              yaxis.push(parseFloat(element[key]))
            }
          });
          const chart_line_top_accounts = Highcharts.chart('chart-order-amt', {
            // chart: {
            //   zoomType: 'xy'
            // },
            title: {
                text: ''
            },
            colors: ['rgb(70,121,167)','rgb(162,197,238)'],
            yAxis: {
              title: {
                  text: ''
              },
              gridLineColor: 'transparent',
              visible: false
            },
            xAxis: {
                categories: xaxis
            },
            plotOptions: {
                line: {
                  dataLabels: {
                    enabled: true,
                    formatter: function () {
                      return this.y+'%';
                    }
                  }
                },
                column: {
                  dataLabels: {
                      enabled: true,
                      formatter: function () {
                        return this.y+'%';
                      }
                  }
                },
            },
            tooltip: {
              pointFormat: '<span style="color:{series.color}">{series.name}: {point.y}%</span><br/>'
            },
            series: [{
              name: 'Percentage',
              type: 'line',
              showInLegend: false,
              data: yaxis
          }],
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        legend: {
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom'
                        }
                    }
                }]
            }
          
          } as any);
        }
      }
    );
  }

  showPrevYearSaydoValue(){
    this.prev_year_saydo_order = true;
    this.prev_year_saydo_order_value = false;
  }

  showLastYearSaydoOrder(){
    this.prev_year_saydo_order_value = true;
    this.prev_year_saydo_order = false;
  }

  showCurYearSaydoValue(){
    this.cur_year_saydo_order = true;
    this.cur_year_saydo_order_value = false;
  }

  showCurYearSaydoOrder(){
    this.cur_year_saydo_order_value = true;
    this.cur_year_saydo_order = false;
  }

  createGrowthTrend(bu, start_date, end_date, geo, currency, timeframe): void {
    setTimeout(function () {
      this.chart_growth_trend = {
          chart: {
              type:'column'
          },
          title:{
              text:''
          },
          colors: ['rgb(70,121,167)', 'rgb(162,197,238)', 'rgb(85,121,190)', 'rgb(117,150,208)', 'rgb(143,163,213)', 'rgb(122,148,228)', 'rgb(132,174,220)', 'rgb(143,163,213)'],
          credits:{enabled:false},
          legend:{
          },
          plotOptions: {
              series: {
                  shadow:false,
                  borderWidth:0,
              }
          },
          xAxis:{
              categories: ['Amrit','Imroz','Rija', 'Ruchi', 'Tanwar'],
              lineColor:'#999',
              lineWidth:0,
              tickColor:'#666',
              tickLength:3,
              title:{
                  text:''
              }
          },
          yAxis:{
              lineColor:'#999',
              lineWidth:0,
              tickColor:'transparent',
              tickWidth:1,
              tickLength:3,
              gridLineColor: 'transparent',
              title:{
                  text:'Sum of Final Amount',
                  rotation:270,
                  margin:10,
              },
              labels:{
                enabled: false
              },
          },    
          series: [{
              name: 'April 2022',
              dataLabels: {
                rotation: 270,
                x: 0,
                y: -20,
                allowOverlap: true,
                enabled: true,
                formatter:function() {
                  if(this.y != 0) {
                    return '<span style="font-weight:normal;color:"gray">'+this.y+ '</span>';
                  }
                },
                style: {
                  color: 'grey',
                  textOutline: 'transparent'
                }
              },
              data: [622,474,520,2314,786]
          },{
              name: 'May 2022',
              dataLabels: {
                rotation: 270,
                x: 0,
                y: -20,
                allowOverlap: true,
                enabled: true,
                formatter:function() {
                  if(this.y != 0) {
                    return '<span style="font-weight:normal;">'+this.y+ '</span>';
                  }
                },
                style: {
                  color: 'grey',
                  textOutline: 'transparent'
                }
              },
              data: [590,479,502,1655,739]
          },{
              name: 'June 2022',
              dataLabels: {
                rotation: 270,
                x: 0,
                y: -20,
                allowOverlap: true,
                enabled: true,
                formatter:function() {
                  if(this.y != 0) {
                    return '<span style="font-weight:normal;">'+this.y+ '</span>';
                  }
                },
                style: {
                  color: 'grey',
                  textOutline: 'transparent'
                }
              },
              data: [522,723,671,1724,791]
          }]    
      }
      Highcharts.chart('chart-growth-trend', this.chart_growth_trend as any);
      
      this.opp_leaderboard = {
        chart: {
            type:'bar'
        },
        title:{
            text:''
        },
        colors: ['rgb(70,121,167)', 'rgb(162,197,238)', 'rgb(85,121,190)', 'rgb(117,150,208)', 'rgb(143,163,213)', 'rgb(122,148,228)', 'rgb(132,174,220)', 'rgb(143,163,213)'],
        credits:{enabled:false},
        legend:{
        },
        plotOptions: {
            series: {
                shadow:false,
                borderWidth:0,
                stacking: 'normal'
            }
        },
        xAxis:{
            categories: ['Amrit','Imroz','Rija', 'Ruchi', 'Tanwar'],
            lineColor:'#999',
            lineWidth:0,
            tickColor:'#666',
            tickLength:3,
            title:{
                text:'Opportunity Owner'
            }
        },
        yAxis:{
          lineColor:'#999',
          lineWidth:0,
          tickColor:'transparent',
          tickWidth:1,
          tickLength:3,
          gridLineColor: 'transparent',
          title:{
              text:'Sum of Final Amount'
          },
          labels:{
            enabled: false
          },
          stackLabels: {
              enabled: true,
              style: {
                  fontWeight: 'bold',
                  color: ( // theme
                      Highcharts.defaultOptions.title.style &&
                      Highcharts.defaultOptions.title.style.color
                  ) || 'gray'
              },
              formatter: function () {
                return this.total;
              }
              // formatter: function () {
              //   return '' + Highcharts.numberFormat(this.total, 2, ',', ' ');
              // }
            },
        },    
        series: [{
            name: '10-20%',
            dataLabels: {
              x: 2,
              y: 0,
              allowOverlap: true,
              enabled: true,
              formatter:function() {
                if(this.y != 0) {
                  return '<span style="font-weight:normal;">'+this.y+ '</span>';
                }
              }
            },
            data: [62,47,52,23,78]
        },{
            name: '30%',
            dataLabels: {
              x: 2,
              y: 0,
              allowOverlap: true,
              enabled: true,
              formatter:function() {
                if(this.y != 0) {
                  return '<span style="font-weight:normal;">'+this.y+ '</span>';
                }
              }
            },
            data: [59,47,50,46,73]
        },{
            name: '50-70%',
            dataLabels: {
              x: 2,
              y: 0,
              allowOverlap: true,
              enabled: true,
              formatter:function() {
                if(this.y != 0) {
                  return '<span style="font-weight:normal;">'+this.y+ '</span>';
                }
              }
            },
            data: [52,72,67,27,79]
        },{
          name: '90%',
          dataLabels: {
            x: 2,
            y: 0,
            allowOverlap: true,
            enabled: true,
            formatter:function() {
              if(this.y != 0) {
                return '<span style="font-weight:normal;">'+this.y+ '</span>';
              }
            }
          },
          data: [52,72,67,37,79]
      },{
        name: '100%',
        dataLabels: {
          x: 2,
          y: 0,
          allowOverlap: true,
          enabled: true,
          formatter:function() {
            if(this.y != 0) {
              return '<span style="font-weight:normal;">'+this.y+ '</span>';
            }
          }
        },
        data: [52,72,67,47,79]
    }]    
    }
    Highcharts.chart('opp-leaderboard', this.opp_leaderboard as any);
    }, 2000);

  }

  createClosedLostOpp(bu, start_date, end_date, geo, currency, timeframe): void {
    setTimeout(function () {
      var number_of_opp = [
        ['Lost to Competition', 270],
        ['No Budget/Lost Funding', 230],
        ['No Decision/Non-Responsive', 170],
        ['Other', 330],
      ];
      var chart_closed_lost_opp = {
        chart: {
            type: 'pie'
        },
        colors: ['rgb(70,121,167)','rgb(192, 201, 228)', 'rgb(162,197,238)', 'rgb(124,148,207)', 'rgb(48,137,202)'],
        title: {
            text: '77.40',
            align: 'center',
            verticalAlign: 'middle',
            x: 0,
            y: -25
        },
        accessibility: {
            announceNewData: {
                enabled: true
            },
            point: {
                valueSuffix: '%'
            }
        },
        plotOptions: {
          pie: {
            size:'140%'
          },
          series: {
              // dataLabels: {
              //     enabled: true,
              //     format: '{point.y:.1f}%'
              // },
              cursor: 'pointer',
          }
        },
        tooltip: {
            // headerFormat: '<span style="font-size:11px">Percentage</span><br>',
            // pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
            formatter(){
              let point = this,
                  no_of_opp;
              number_of_opp.forEach(d => {
                if(d[0] == point.point['name']){
                  no_of_opp = d[1]
                }
              })
              return `${point.key} <br> <b>${point.series.name}: ${point.point.y}%</b> <br>Amount: ${no_of_opp}Mn`
            }
        },
        legend: {
          enabled: true,
          layout: 'horizontal',
          align: 'right',
          // verticalAlign: 'middle',
          // // itemMarginTop: 10,
          // // itemMarginBottom: 10,
          labelFormatter: function () {
            let point = this,
            no_of_opp;
            number_of_opp.forEach(d => {
              if(d[0] == point.name){
                no_of_opp = d[1]
              }
            })
            return `${point.name}: ${no_of_opp}(${point.y}%)`
          }
        },
        series: [
            {
                name: "Percentage",
                showInLegend: true,
                colorByPoint: true,
                innerSize: '50%',
                point: {
                  events: {
                      click: function () {
                          // location.href = this.options.url;
                          window.open(this.options.url);
                      }
                  }
                },
                dataLabels: {
                  color:'white',
                  distance: -20,
                  formatter: function () {
                      if(this.percentage!=0)  return Math.round(this.percentage)  + '%';

                  }
                },
                data: [ 
                  {
                    name: 'Lost to Competition',
                    y: 27,
                    // url: this.base_url+'records?bu='+bu+'&lost_reason=Lost to Competition&timeframe='+timeframe
                  }, {
                    name: 'No Budget/Lost Funding',
                    y: 23,
                    // url: this.base_url+'records?bu='+bu+'&lost_reason=No Budget / Lost Funding&timeframe='+timeframe
                  },
                  {
                    name: 'No Decision/Non-Responsive',
                    y: 17,
                    // url: this.base_url+'records?bu='+bu+'&lost_reason=No Decision / Non-Responsive&timeframe='+timeframe
                  }, {
                    name: 'Other',
                    y: 33,
                    // url: this.base_url+'records?bu='+bu+'&lost_reason=Other&timeframe='+timeframe
                  }
                ]
            }
        ]
      }
      Highcharts.chart('chart-closed-lost-opp', chart_closed_lost_opp as any);  
    }, 2000);

  }


  createChartGaugeOrder(bu, start_date, end_date, geo, currency, timeframe): void {
    var data =  {
      "bu": bu,
      "start_date": start_date,
      "end_date": end_date,
      "geo": geo,
      "currency": currency,
      "timeframe": timeframe
    }
    this.dataService.getOrderOverview(data).subscribe(
      res => {
        if(res.result.status == "true"){
          var per = parseFloat(res.result.result.percentage)
          this.currentBC = res.result.result.achieved.currentbc;
          this.pipelineClassify = res.result.result.achieved.classify;
          this.geoClassify = res.result.result.achieved.geoclassify;
          this.subProjectClassify = res.result.result.achieved.subProject;
          var class_ref = this;
          const chart_order = Highcharts.chart('chart-gauge-order', {
            chart: {
              type: 'solidgauge',
            },
            title: {
              text: '<span style="font-size: 15px;">Budget - '+ parseInt(res.result.result.totalTarget)+'<br>Actual - '+parseInt(res.result.result.achieved.value)+'</span>',
            },
            credits: {
              enabled: false,
            },
            accessibility: {
              announceNewData: {
                  enabled: true
              }
            },
            pane: {
              startAngle: -90,
              endAngle: 90,
              center: ['50%', '85%'],
              size: '150%',
              background: {
                  innerRadius: '60%',
                  outerRadius: '100%',
                  shape: 'arc',
              },
            },
            yAxis: {
              min: 0,
              max: 100,
              stops: [
                [0.1, 'rgb(70,121,167)'], // green
                [0.5, 'rgb(70,121,167)'], // yellow
                [0.9, 'rgb(70,121,167)'], // red
              ],
              minorTickInterval: null,
              tickAmount: 2,
              labels: {
                y: 16,
              }
            },
            plotOptions: {
              series: {
                cursor: 'pointer',
                point: {
                  events: {
                    click: function() {
                      var chart = this.series.chart;
                      chart.destroy();
                      if(class_ref.hide_branches_order){
                        Highcharts.chart('chart-gauge-order', order_graph_order_single_branch as any);
                      }else{
                        Highcharts.chart('chart-gauge-order', order_graph_order as any);
                      }
                    }
                  }
                }
              },
              solidgauge: {
                dataLabels: {
                    borderWidth: 0,
                    useHTML: true
                }
              }
            },
            tooltip: {
              enabled: false,
            },
            series: [{
              name: null,
              data: [(Math.round(per*100))/100],
              dataLabels: {
                format: '<div style="text-align:center">' +
                        '<span style="font-size:25px">{y}%</span><br/>' +
                        '</div>'
              },
            }]
          } as any);
          var order_graph_order = {
            chart: {
              type: 'column',
              events: {
                drilldown: function(e) {
                  class_ref.branch_clicked = true;
                  var chart = this;
                  chart.setTitle({ text: '<div style="text-align: right;"><span style="color:rgb(70, 121, 167); font-size:small;">Fx Adjusted: 3,065<br>[vs May (+) 141]*</div>' });
                },
                drillup: function(e) {
                  class_ref.branch_clicked = false;
                  var chart = this;
                  chart.setTitle({ text: '<div style="text-align: right;"><span style="color:rgb(70, 121, 167); font-size:small;">Fx Adjusted: 3,065<br>[vs May (+) 141]*</div>' });
                }
              }
            },
            title: {
                text: '<div style="text-align: right;"><span style="color:rgb(70, 121, 167); font-size:small;">Fx Adjusted: 3,065<br>[vs May (+) 141]*</div>' ,
                align: 'right'
            },
            xAxis: {
                type: 'category'
            },
            yAxis: {
              title: {
                  text: ''
              },
              gridLineColor: 'transparent',
              type: 'logarithmic',
              minorTickInterval: 100,
              stackLabels: {
                enabled: true,
                style: {
                    fontWeight: 'bold',
                    color: ( // theme
                        Highcharts.defaultOptions.title.style &&
                        Highcharts.defaultOptions.title.style.color
                    ) || 'gray'
                },
                formatter: function () {
                  return this.total;
                }
                // formatter: function () {
                //   return '' + Highcharts.numberFormat(this.total, 2, ',', ' ');
                // }
              },
              labels:{
                enabled: false
              }
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                column: {
                  stacking: 'normal',
                  dataLabels: {
                      enabled: true,
                      formatter: function () {
                        return this.total;
                      }
                  }
                },
                series: {
                  pointWidth: 100
                }
            },
            colors: ['rgb(70,121,167)', 'rgb(162,197,238)', 'rgb(85,121,190)', 'rgb(117,150,208)', 'rgb(143,163,213)', 'rgb(122,148,228)', 'rgb(132,174,220)', 'rgb(143,163,213)'],
            tooltip: {
                headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                pointFormat: '<span style="color:{point.color}">Percentage</span>: <b>{point.percentage:.0f}%</b>'
            },
        
            series: [
              {
                name: 'EMEA',
                dataLabels: {
                  allowOverlap: true,
                  enabled: true,
                  formatter:function() {
                    if(this.y != 0) {
                      return '<span style="font-weight:normal;color:white;fill:white;">'+this.series.name+' '+this.y+ '</span>';
                    }
                  },
                  style: {
                    color: 'white',
                    textOutline: 'transparent'
                  }
                },
                data: [{
                  name: 'Budget',
                  y: 250,
                  drilldown: ''
                }, {
                  name: 'O-Pipeline',
                  y: 358,
                  drilldown: ''
                }]
              },{
                name: 'SBO',
                dataLabels: {
                  allowOverlap: true,
                  enabled: true,
                  formatter:function() {
                    if(this.y != 0) {
                      return '<span style="font-weight:normal;color:white;fill:white;">'+this.series.name+' '+this.y+ '</span>';
                    }
                  },
                  style: {
                    color: 'white',
                    textOutline: 'transparent'
                  }
                },
                data: [{
                  name: 'Budget',
                  y: 160,
                  drilldown: ''
                }, {
                  name: 'O-Pipeline',
                  y: 261,
                  drilldown: ''
                }]
              },{
                name: 'ABO',
                dataLabels: {
                  allowOverlap: true,
                  enabled: true,
                  formatter:function() {
                    if(this.y != 0) {
                      return '<span style="font-weight:normal;color:white;fill:white;">'+this.series.name+' '+this.y+ '</span>';
                    }
                  },
                  style: {
                    color: 'white',
                    textOutline: 'transparent'
                  }
                },
                data: [{
                  name: 'Budget',
                  y: 85,
                  drilldown: ''
                }, {
                  name: 'O-Pipeline',
                  y: 115,
                  drilldown: ''
                }]
              },{
                name: 'USBO',
                dataLabels: {
                  allowOverlap: true,
                  enabled: true,
                  formatter:function() {
                    if(this.y != 0) {
                      return '<span style="font-weight:normal;color:white;fill:white;">'+this.series.name+' '+this.y+ '</span>';
                    }
                  },
                  style: {
                    color: 'white',
                    textOutline: 'transparent'
                  }
                },
                data: [{
                  name: 'Budget',
                  y: 643,
                  drilldown: ''
                }, {
                  name: 'O-Pipeline',
                  y: 549,
                  drilldown: ''
                }]
              },{
                name: 'JBO',
                dataLabels: {
                  allowOverlap: true,
                  enabled: true,
                  formatter:function() {
                    if(this.y != 0) {
                      return '<span style="font-weight:normal;color:white;fill:white;">'+this.series.name+' '+this.y+ '</span>';
                    }
                  },
                  style: {
                    color: 'white',
                    textOutline: 'transparent'
                  }
                },
                data: [{
                  name: 'Budget',
                  y: 1801,
                  drilldown: 'branch_detail'
                }, {
                  name: 'O-Pipeline',
                  y: 1621,
                  drilldown: 'branch_detail'
                }]
              },    
            ],
            drilldown: {
              activeDataLabelStyle: {
                textDecoration: 'none'
              },
              activeAxisLabelStyle: {
                textDecoration: 'none'
              },
              series: [
                {
                  name: '',
                  type: 'column',
                  id: 'branch_detail',
                  dataLabels: {
                    enabled: true,
                    format: '<span style="font-weight:normal;color:black;fill:white;">{point.name} {point.y}</span>',
                    distance: 20,
                    style: {
                      color: 'black',
                      textOutline: 'transparent'
                    },
                  },
                  cursor: 'pointer',
                  point: {
                      events: {
                          click: function () {
                              // location.href = this.options.url;
                              window.open(this.options.url);
                          }
                      }
                  },
                  tooltip: {
                    headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                    pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.percentage: .2f} %</b><br/>'
                  },
                  size: 180,
                  borderWidth: 3,
                  borderColor: '#fff',
                  stacking: 'normal',
                  data: [
                  {
                    name: 'A',
                    y: parseInt(res.result.result.achieved.open.A),
                    url: this.base_url+'records?bu='+bu+'&geo='+geo+'&start_date='+start_date+'&end_date='+end_date+'&currency='+currency+'&type=open&rank=A&timeframe='+timeframe
                  },
                  {
                    name: 'B',
                    y: parseInt(res.result.result.achieved.open.B),
                    url: this.base_url+'records?bu='+bu+'&geo='+geo+'&start_date='+start_date+'&end_date='+end_date+'&currency='+currency+'&type=open&rank=B&timeframe='+timeframe
                  },
                  {
                    name: 'C',
                    y: parseInt(res.result.result.achieved.open.C),
                    url: this.base_url+'records?bu='+bu+'&geo='+geo+'&start_date='+start_date+'&end_date='+end_date+'&currency='+currency+'&type=open&rank=C&timeframe='+timeframe
                  },
                  {
                    name: 'D',
                    y: parseInt(res.result.result.achieved.open.D),
                    url: this.base_url+'records?bu='+bu+'&geo='+geo+'&start_date='+start_date+'&end_date='+end_date+'&currency='+currency+'&type=open&rank=D&timeframe='+timeframe
                  },
                  {
                    name: 'E',
                    y: parseInt(res.result.result.achieved.open.E),
                    url: this.base_url+'records?bu='+bu+'&geo='+geo+'&start_date='+start_date+'&end_date='+end_date+'&currency='+currency+'&type=open&rank=E&timeframe='+timeframe
                  }
                  ]
                }
              ]
            }
          }
          var order_graph_order_single_branch = {
            chart: {
              type: 'column',
              events: {
                drilldown: function(e) {
                  class_ref.branch_clicked = true;
                  var chart = this;
                  chart.setTitle({ text: '<div style="text-align: right;"><span style="color:rgb(70, 121, 167); font-size:small;">Fx Adjusted: 1,832<br>[vs May (+) 141]*</div>' });
                },
                drillup: function(e) {
                  class_ref.branch_clicked = false;
                  var chart = this;
                  chart.setTitle({ text: '<div style="text-align: right;"><span style="color:rgb(70, 121, 167); font-size:small;">Fx Adjusted: 1,832<br>[vs May (+) 141]*</div>' });
                }
              }
            },
            title: {
                text: '<div style="text-align: right;"><span style="color:rgb(70, 121, 167); font-size:small;">Fx Adjusted: 1,832<br>[vs May (+) 65]*</div>' ,
                align: 'right'
            },
            xAxis: {
                type: 'category'
            },
            yAxis: {
              title: {
                  text: ''
              },
              gridLineColor: 'transparent',
              type: 'logarithmic',
              minorTickInterval: 100,
              stackLabels: {
                enabled: true,
                style: {
                    fontWeight: 'bold',
                    color: ( // theme
                        Highcharts.defaultOptions.title.style &&
                        Highcharts.defaultOptions.title.style.color
                    ) || 'gray'
                },
                formatter: function () {
                  return this.total;
                }
                // formatter: function () {
                //   return '' + Highcharts.numberFormat(this.total, 2, ',', ' ');
                // }
              },
              labels:{
                enabled: false
              }
            },
            legend: {
                enabled: true
            },
            plotOptions: {
                column: {
                  stacking: 'normal',
                  dataLabels: {
                      enabled: true,
                      formatter: function () {
                        return this.total;
                      }
                  }
                },
                series: {
                  pointWidth: 100
                }
            },
            colors: ['rgb(70,121,167)', 'rgb(162,197,238)', 'rgb(85,121,190)', 'rgb(117,150,208)', 'rgb(143,163,213)', 'rgb(122,148,228)', 'rgb(132,174,220)', 'rgb(143,163,213)'],
            tooltip: {
                headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                pointFormat: '<span style="color:{point.color}">Percentage</span>: <b>{point.percentage:.0f}%</b>'
            },
        
            series: [
              {
                name: 'Target',
                dataLabels: {
                  allowOverlap: true,
                  enabled: true,
                  formatter:function() {
                    if(this.y != 0) {
                      return '<span style="font-weight:normal;color:white;fill:white;">'+this.y+ '</span>';
                    }
                  },
                  style: {
                    color: 'white',
                    textOutline: 'transparent'
                  }
                },
                data: [{
                  name: 'Target',
                  y: 1801,
                  drilldown: ''
                }, {
                  name: 'O-Pipeline',
                  y: 0,
                  drilldown: ''
                }]
              },
              {
                name: '10%-20%',
                dataLabels: {
                  allowOverlap: true,
                  enabled: true,
                  formatter:function() {
                    if(this.y != 0) {
                      return '<span style="font-weight:normal;color:white;fill:white;">'+this.y+ '</span>';
                    }
                  },
                  style: {
                    color: 'white',
                    textOutline: 'transparent'
                  }
                },
                data: [{
                  name: 'Target',
                  y: 0,
                  drilldown: ''
                }, {
                  name: 'O-Pipeline',
                  y: 105,
                  drilldown: ''
                }]
              },{
                name: '30%',
                dataLabels: {
                  allowOverlap: true,
                  enabled: true,
                  formatter:function() {
                    if(this.y != 0) {
                      return '<span style="font-weight:normal;color:white;fill:white;">'+this.y+ '</span>';
                    }
                  },
                  style: {
                    color: 'white',
                    textOutline: 'transparent'
                  }
                },
                data: [{
                  name: 'Target',
                  y: 0,
                  drilldown: ''
                }, {
                  name: 'O-Pipeline',
                  y: 398,
                  drilldown: ''
                }]
              },{
                name: '50%-70%',
                dataLabels: {
                  allowOverlap: true,
                  enabled: true,
                  formatter:function() {
                    if(this.y != 0) {
                      return '<span style="font-weight:normal;color:white;fill:white;">'+this.y+ '</span>';
                    }
                  },
                  style: {
                    color: 'white',
                    textOutline: 'transparent'
                  }
                },
                data: [{
                  name: 'Target',
                  y: 0,
                  drilldown: ''
                }, {
                  name: 'O-Pipeline',
                  y: 485,
                  drilldown: ''
                }]
              },{
                name: '90%',
                dataLabels: {
                  allowOverlap: true,
                  enabled: true,
                  formatter:function() {
                    if(this.y != 0) {
                      return '<span style="font-weight:normal;color:white;fill:white;">'+this.y+ '</span>';
                    }
                  },
                  style: {
                    color: 'white',
                    textOutline: 'transparent'
                  }
                },
                data: [{
                  name: 'Target',
                  y: 0,
                  drilldown: ''
                }, {
                  name: 'O-Pipeline',
                  y: 32,
                  drilldown: ''
                }]
              },{
                name: '100%',
                dataLabels: {
                  allowOverlap: true,
                  enabled: true,
                  formatter:function() {
                    if(this.y != 0) {
                      return '<span style="font-weight:normal;color:white;fill:white;">'+this.y+ '</span>';
                    }
                  },
                  style: {
                    color: 'white',
                    textOutline: 'transparent'
                  }
                },
                data: [{
                  name: 'Target',
                  y: 0,
                  drilldown: 'branch_detail'
                }, {
                  name: 'O-Pipeline',
                  y: 600,
                  drilldown: 'branch_detail'
                }]
              },    
            ],
            drilldown: {
              activeDataLabelStyle: {
                textDecoration: 'none'
              },
              activeAxisLabelStyle: {
                textDecoration: 'none'
              },
              series: [
              ]
            }
          }
        }
      }
    );
  }

  createChartGaugeSales(bu, start_date, end_date, geo, currency, timeframe){
    var data =  {
      "bu": bu,
      "start_date": start_date,
      "end_date": end_date,
      "geo": geo,
      "currency": currency,
      "timeframe": timeframe
    }
    this.dataService.getSalesOverview(data).subscribe(
      res => {
        if(res.result.status == "true"){
          this.salesBreakdown = res.result.result.sales_overview;
          var per = parseFloat(res.result.result.percentage) 
          var actual = parseFloat(res.result.result.achieved.actual)/10000;
          var class_ref = this;
          const chart_order = Highcharts.chart('chart-gauge-sales', {
            chart: {
              type: 'solidgauge',
            },
            title: {
              text: '<span style="font-size: 15px;">Budget - '+ parseInt(res.result.result.totalTarget)+'<br>Actual - '+parseInt(res.result.result.achieved.value)+'</span>',
            },
            credits: {
              enabled: false,
            },
            accessibility: {
              announceNewData: {
                  enabled: true
              }
            },
            pane: {
              startAngle: -90,
              endAngle: 90,
              center: ['50%', '85%'],
              size: '150%',
              background: {
                  innerRadius: '60%',
                  outerRadius: '100%',
                  shape: 'arc',
              },
            },
            yAxis: {
              min: 0,
              max: 100,
              stops: [
                [0.1, 'rgb(70,121,167)'], // green
                [0.5, 'rgb(70,121,167)'], // yellow
                [0.9, 'rgb(70,121,167)'], // red
              ],
              minorTickInterval: null,
              tickAmount: 2,
              labels: {
                y: 16,
              }
            },
            plotOptions: {
              series: {
                cursor: 'pointer',
                point: {
                  events: {
                    click: function() {
                      var chart = this.series.chart;
                      chart.destroy();
                      if(class_ref.hide_branches_billing){
                        Highcharts.chart('chart-gauge-sales', order_graph_billing_single_branch as any);
                      }else{
                        Highcharts.chart('chart-gauge-sales', order_graph_billing as any);
                      }
                    }
                  }
                }
              },
              solidgauge: {
                dataLabels: {
                    borderWidth: 0,
                    useHTML: true
                }
              }
            },
            tooltip: {
              enabled: false,
            },
            series: [{
              name: null,
              data: [(Math.round(per*100))/100],
              dataLabels: {
                format: '<div style="text-align:center">' +
                        '<span style="font-size:25px">{y}%</span><br/>' +
                        '</div>'
              },
            }]
          } as any);  
          var order_graph_billing = {
            chart: {
              type: 'column',
              events: {
                drilldown: function(e) {
                  class_ref.branch_clicked = true;
                  var chart = this;
                  chart.setTitle({ text: '<div style="text-align: right;"><span style="color:rgb(70, 121, 167); font-size:small;">Fx Adjusted: 3,065<br>[vs May (+) 141]*</div>' });
                },
                drillup: function(e) {
                  class_ref.branch_clicked = false;
                  var chart = this;
                  chart.setTitle({ text: '<div style="text-align: right;"><span style="color:rgb(70, 121, 167); font-size:small;">Fx Adjusted: 3,065<br>[vs May (+) 141]*</div>' });
                }
              }
            },
            title: {
                text: '<div style="text-align: right;"><span style="color:rgb(70, 121, 167); font-size:small;">Fx Adjusted: 3,065<br>[vs May (+) 141]*</div>' ,
                align: 'right'
            },
            xAxis: {
                type: 'category'
            },
            yAxis: {
              title: {
                  text: ''
              },
              gridLineColor: 'transparent',
              type: 'logarithmic',
              minorTickInterval: 100,
              stackLabels: {
                enabled: true,
                style: {
                    fontWeight: 'bold',
                    color: ( // theme
                        Highcharts.defaultOptions.title.style &&
                        Highcharts.defaultOptions.title.style.color
                    ) || 'gray'
                },
                formatter: function () {
                  return this.total;
                }
                // formatter: function () {
                //   return '' + Highcharts.numberFormat(this.total, 2, ',', ' ');
                // }
              },
              labels:{
                enabled: false
              }
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                column: {
                  stacking: 'normal',
                  dataLabels: {
                      enabled: true,
                      formatter: function () {
                        return this.total;
                      }
                  }
                },
                series: {
                  pointWidth: 100
                }
            },
            colors: ['rgb(70,121,167)', 'rgb(162,197,238)', 'rgb(85,121,190)', 'rgb(117,150,208)', 'rgb(143,163,213)', 'rgb(122,148,228)', 'rgb(132,174,220)', 'rgb(143,163,213)'],
            tooltip: {
                headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                pointFormat: '<span style="color:{point.color}">Percentage</span>: <b>{point.percentage:.0f}%</b>'
            },
        
            series: [
              {
                name: 'EMEA',
                dataLabels: {
                  allowOverlap: true,
                  enabled: true,
                  formatter:function() {
                    if(this.y != 0) {
                      return '<span style="font-weight:normal;color:white;fill:white;">'+this.series.name+' '+this.y+ '</span>';
                    }
                  },
                  style: {
                    color: 'white',
                    textOutline: 'transparent'
                  }
                },
                data: [{
                  name: 'Budget',
                  y: 250,
                  drilldown: ''
                }, {
                  name: 'O-Pipeline',
                  y: 358,
                  drilldown: ''
                }, {
                  name: 'Billing',
                  y: 128,
                  drilldown: ''
                }]
              },{
                name: 'SBO',
                dataLabels: {
                  allowOverlap: true,
                  enabled: true,
                  formatter:function() {
                    if(this.y != 0) {
                      return '<span style="font-weight:normal;color:white;fill:white;">'+this.series.name+' '+this.y+ '</span>';
                    }
                  },
                  style: {
                    color: 'white',
                    textOutline: 'transparent'
                  }
                },
                data: [{
                  name: 'Budget',
                  y: 160,
                  drilldown: ''
                }, {
                  name: 'O-Pipeline',
                  y: 261,
                  drilldown: ''
                }, {
                  name: 'Billing',
                  y: 161,
                  drilldown: ''
                }]
              },{
                name: 'ABO',
                dataLabels: {
                  allowOverlap: true,
                  enabled: true,
                  formatter:function() {
                    if(this.y != 0) {
                      return '<span style="font-weight:normal;color:white;fill:white;">'+this.series.name+' '+this.y+ '</span>';
                    }
                  },
                  style: {
                    color: 'white',
                    textOutline: 'transparent'
                  }
                },
                data: [{
                  name: 'Budget',
                  y: 85,
                  drilldown: ''
                }, {
                  name: 'O-Pipeline',
                  y: 115,
                  drilldown: ''
                }, {
                  name: 'Billing',
                  y: 95,
                  drilldown: ''
                }]
              },{
                name: 'USBO',
                dataLabels: {
                  allowOverlap: true,
                  enabled: true,
                  formatter:function() {
                    if(this.y != 0) {
                      return '<span style="font-weight:normal;color:white;fill:white;">'+this.series.name+' '+this.y+ '</span>';
                    }
                  },
                  style: {
                    color: 'white',
                    textOutline: 'transparent'
                  }
                },
                data: [{
                  name: 'Budget',
                  y: 643,
                  drilldown: ''
                }, {
                  name: 'O-Pipeline',
                  y: 549,
                  drilldown: ''
                }, {
                  name: 'Billing',
                  y: 445,
                  drilldown: ''
                }]
              },{
                name: 'JBO',
                dataLabels: {
                  allowOverlap: true,
                  enabled: true,
                  formatter:function() {
                    if(this.y != 0) {
                      return '<span style="font-weight:normal;color:white;fill:white;">'+this.series.name+' '+this.y+ '</span>';
                    }
                  },
                  style: {
                    color: 'white',
                    textOutline: 'transparent'
                  }
                },
                data: [{
                  name: 'Budget',
                  y: 1801,
                  drilldown: ''
                }, {
                  name: 'O-Pipeline',
                  y: 1621,
                  drilldown: ''
                }, {
                  name: 'Billing',
                  y: 1532,
                  drilldown: ''
                }]
              },    
            ],
            drilldown: {
              activeDataLabelStyle: {
                textDecoration: 'none'
              },
              activeAxisLabelStyle: {
                textDecoration: 'none'
              },
              series: [
                {
                  name: '',
                  type: 'column',
                  id: 'branch_detail',
                  dataLabels: {
                    enabled: true,
                    format: '<span style="font-weight:normal;color:black;fill:white;">{point.name} {point.y}</span>',
                    distance: 20,
                    style: {
                      color: 'black',
                      textOutline: 'transparent'
                    },
                  },
                  cursor: 'pointer',
                  point: {
                      events: {
                          click: function () {
                              // location.href = this.options.url;
                              window.open(this.options.url);
                          }
                      }
                  },
                  tooltip: {
                    headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                    pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.percentage: .2f} %</b><br/>'
                  },
                  size: 180,
                  borderWidth: 3,
                  borderColor: '#fff',
                  stacking: 'normal',
                  data: [
                  {
                    name: 'A',
                    y: parseInt(res.result.result.achieved.open.A),
                    url: this.base_url+'records?bu='+bu+'&geo='+geo+'&start_date='+start_date+'&end_date='+end_date+'&currency='+currency+'&type=open&rank=A&timeframe='+timeframe
                  },
                  {
                    name: 'B',
                    y: parseInt(res.result.result.achieved.open.B),
                    url: this.base_url+'records?bu='+bu+'&geo='+geo+'&start_date='+start_date+'&end_date='+end_date+'&currency='+currency+'&type=open&rank=B&timeframe='+timeframe
                  },
                  {
                    name: 'C',
                    y: parseInt(res.result.result.achieved.open.C),
                    url: this.base_url+'records?bu='+bu+'&geo='+geo+'&start_date='+start_date+'&end_date='+end_date+'&currency='+currency+'&type=open&rank=C&timeframe='+timeframe
                  },
                  {
                    name: 'D',
                    y: parseInt(res.result.result.achieved.open.D),
                    url: this.base_url+'records?bu='+bu+'&geo='+geo+'&start_date='+start_date+'&end_date='+end_date+'&currency='+currency+'&type=open&rank=D&timeframe='+timeframe
                  },
                  {
                    name: 'E',
                    y: parseInt(res.result.result.achieved.open.E),
                    url: this.base_url+'records?bu='+bu+'&geo='+geo+'&start_date='+start_date+'&end_date='+end_date+'&currency='+currency+'&type=open&rank=E&timeframe='+timeframe
                  }
                  ]
                }
              ]
            }
          }
          var order_graph_billing_single_branch = {
            chart: {
              type: 'column',
              events: {
                drilldown: function(e) {
                  class_ref.branch_clicked = true;
                  var chart = this;
                  chart.setTitle({ text: '<div style="text-align: right;"><span style="color:rgb(70, 121, 167); font-size:small;">Fx Adjusted: 1,832<br>[vs May (+) 141]*</div>' });
                },
                drillup: function(e) {
                  class_ref.branch_clicked = false;
                  var chart = this;
                  chart.setTitle({ text: '<div style="text-align: right;"><span style="color:rgb(70, 121, 167); font-size:small;">Fx Adjusted: 1,832<br>[vs May (+) 141]*</div>' });
                }
              }
            },
            title: {
                text: '<div style="text-align: right;"><span style="color:rgb(70, 121, 167); font-size:small;">Fx Adjusted: 1,832<br>[vs May (+) 65]*</div>' ,
                align: 'right'
            },
            xAxis: {
                type: 'category'
            },
            yAxis: {
              title: {
                  text: ''
              },
              gridLineColor: 'transparent',
              type: 'logarithmic',
              minorTickInterval: 100,
              stackLabels: {
                enabled: true,
                style: {
                    fontWeight: 'bold',
                    color: ( // theme
                        Highcharts.defaultOptions.title.style &&
                        Highcharts.defaultOptions.title.style.color
                    ) || 'gray'
                },
                formatter: function () {
                  return this.total;
                }
                // formatter: function () {
                //   return '' + Highcharts.numberFormat(this.total, 2, ',', ' ');
                // }
              },
              labels:{
                enabled: false
              }
            },
            legend: {
                enabled: true
            },
            plotOptions: {
                column: {
                  stacking: 'normal',
                  dataLabels: {
                      enabled: true,
                      formatter: function () {
                        return this.total;
                      }
                  }
                },
                series: {
                  pointWidth: 100
                }
            },
            colors: ['rgb(70,121,167)', 'rgb(162,197,238)', 'rgb(85,121,190)', 'rgb(117,150,208)', 'rgb(143,163,213)', 'rgb(122,148,228)', 'rgb(132,174,220)', 'rgb(143,163,213)'],
            tooltip: {
                headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                pointFormat: '<span style="color:{point.color}">Percentage</span>: <b>{point.percentage:.0f}%</b>'
            },
        
            series: [
              {
                name: 'Target',
                dataLabels: {
                  allowOverlap: true,
                  enabled: true,
                  formatter:function() {
                    if(this.y != 0) {
                      return '<span style="font-weight:normal;color:white;fill:white;">'+this.y+ '</span>';
                    }
                  },
                  style: {
                    color: 'white',
                    textOutline: 'transparent'
                  }
                },
                data: [{
                  name: 'Target',
                  y: 1801,
                  drilldown: ''
                }, {
                  name: 'O-Pipeline',
                  y: 0,
                  drilldown: ''
                }, {
                  name: 'Billing',
                  y: 0,
                  drilldown: ''
                }]
              },
              {
                name: '10%-20%',
                dataLabels: {
                  allowOverlap: true,
                  enabled: true,
                  formatter:function() {
                    if(this.y != 0) {
                      return '<span style="font-weight:normal;color:white;fill:white;">'+this.y+ '</span>';
                    }
                  },
                  style: {
                    color: 'white',
                    textOutline: 'transparent'
                  }
                },
                data: [{
                  name: 'Target',
                  y: 0,
                  drilldown: ''
                }, {
                  name: 'O-Pipeline',
                  y: 105,
                  drilldown: ''
                }, {
                  name: 'Billing',
                  y: 52,
                  drilldown: ''
                }]
              },{
                name: '30%',
                dataLabels: {
                  allowOverlap: true,
                  enabled: true,
                  formatter:function() {
                    if(this.y != 0) {
                      return '<span style="font-weight:normal;color:white;fill:white;">'+this.y+ '</span>';
                    }
                  },
                  style: {
                    color: 'white',
                    textOutline: 'transparent'
                  }
                },
                data: [{
                  name: 'Target',
                  y: 0,
                  drilldown: ''
                }, {
                  name: 'O-Pipeline',
                  y: 398,
                  drilldown: ''
                }, {
                  name: 'Billing',
                  y: 11,
                  drilldown: ''
                }]
              },{
                name: '50%-70%',
                dataLabels: {
                  allowOverlap: true,
                  enabled: true,
                  formatter:function() {
                    if(this.y != 0) {
                      return '<span style="font-weight:normal;color:white;fill:white;">'+this.y+ '</span>';
                    }
                  },
                  style: {
                    color: 'white',
                    textOutline: 'transparent'
                  }
                },
                data: [{
                  name: 'Target',
                  y: 0,
                  drilldown: ''
                }, {
                  name: 'O-Pipeline',
                  y: 485,
                  drilldown: ''
                }, {
                  name: 'Billing',
                  y: 126,
                  drilldown: ''
                }]
              },{
                name: '90%',
                dataLabels: {
                  allowOverlap: true,
                  enabled: true,
                  formatter:function() {
                    if(this.y != 0) {
                      return '<span style="font-weight:normal;color:white;fill:white;">'+this.y+ '</span>';
                    }
                  },
                  style: {
                    color: 'white',
                    textOutline: 'transparent'
                  }
                },
                data: [{
                  name: 'Target',
                  y: 0,
                  drilldown: ''
                }, {
                  name: 'O-Pipeline',
                  y: 32,
                  drilldown: ''
                }, {
                  name: 'Billing',
                  y: 18,
                  drilldown: ''
                }]
              },{
                name: '100%',
                dataLabels: {
                  allowOverlap: true,
                  enabled: true,
                  formatter:function() {
                    if(this.y != 0) {
                      return '<span style="font-weight:normal;color:white;fill:white;">'+this.y+ '</span>';
                    }
                  },
                  style: {
                    color: 'white',
                    textOutline: 'transparent'
                  }
                },
                data: [{
                  name: 'Target',
                  y: 0,
                  drilldown: ''
                }, {
                  name: 'O-Pipeline',
                  y: 600,
                  drilldown: ''
                }, {
                  name: 'Billing',
                  y: 3937,
                  drilldown: ''
                }]
              },    
            ],
            drilldown: {
              activeDataLabelStyle: {
                textDecoration: 'none'
              },
              activeAxisLabelStyle: {
                textDecoration: 'none'
              },
              series: [
              ]
            }
          }

        }
      }
    );

  }

  getLostOpportunities(bu, start_date, end_date, geo, currency, timeframe): void {
    var data =  {
      "bu": bu,
      "start_date": start_date,
      "end_date": end_date,
      "geo": geo,
      "currency": currency,
      "timeframe": timeframe
    }
    this.dataService.getLostOpportunities(data).subscribe(
      res => {
        var number_of_opp = [
          ['Price', parseInt(res.result.result['Price_sum'])],
          ['Lost to Competition', parseInt(res.result.result['Lost to Competitor_sum'])],
          ['No Budget/Lost Funding', parseInt(res.result.result['No Budget / Lost Funding_sum'])],
          ['No Decision/Non-Responsive', parseInt(res.result.result['No Decision / Non-Responsive_sum'])],
          ['Other', parseInt(res.result.result['Other_sum'])],
        ];
        this.chart_lost_opp = Highcharts.chart('chart-pie-lost-opp', {
          chart: {
              type: 'pie'
          },
          colors: ['rgb(70,121,167)','rgb(192, 201, 228)', 'rgb(162,197,238)', 'rgb(124,148,207)', 'rgb(48,137,202)'],
          title: {
              text: res.result.percentage+'%<br>'+res.result.Sum+'Mn',
              align: 'center',
              verticalAlign: 'middle',
              x: -145
          },
          accessibility: {
              announceNewData: {
                  enabled: true
              },
              point: {
                  valueSuffix: '%'
              }
          },
          plotOptions: {
            pie: {
              size:'100%'
            },
            series: {
                dataLabels: {
                    enabled: false,
                    format: '{point.y:.1f}%'
                },
                cursor: 'pointer',
            }
          },
          tooltip: {
              // headerFormat: '<span style="font-size:11px">Percentage</span><br>',
              // pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
              formatter(){
                let point = this,
                    no_of_opp;
                number_of_opp.forEach(d => {
                  if(d[0] == point.point['name']){
                    no_of_opp = d[1]
                  }
                })
                return `${point.key} <br> <b>${point.series.name}: ${point.point.y}%</b> <br>Amount: ${no_of_opp}Mn`
              }
          },
          legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            itemMarginTop: 10,
            itemMarginBottom: 10,
            labelFormatter: function () {
              let point = this,
              no_of_opp;
              number_of_opp.forEach(d => {
                if(d[0] == point.name){
                  no_of_opp = d[1]
                }
              })
              return `${point.name}: ${no_of_opp}(${point.y}%)`
            }
          },
          series: [
              {
                  name: "Percentage",
                  showInLegend: true,
                  colorByPoint: true,
                  innerSize: '50%',
                  point: {
                    events: {
                        click: function () {
                            // location.href = this.options.url;
                            window.open(this.options.url);
                        }
                    }
                  },
                  data: [ {
                      name: 'Price',
                      y: parseInt(res.result.result['Price']),
                      url: this.base_url+'records?bu='+bu+'&lost_reason=Price&timeframe='+timeframe
                    },
                    {
                      name: 'Lost to Competition',
                      y: parseInt(res.result.result['Lost to Competitor']),
                      url: this.base_url+'records?bu='+bu+'&lost_reason=Lost to Competition&timeframe='+timeframe
                    }, {
                      name: 'No Budget/Lost Funding',
                      y: parseInt(res.result.result['No Budget / Lost Funding']),
                      url: this.base_url+'records?bu='+bu+'&lost_reason=No Budget / Lost Funding&timeframe='+timeframe
                    },
                    {
                      name: 'No Decision/Non-Responsive',
                      y: parseInt(res.result.result['No Decision / Non-Responsive']),
                      url: this.base_url+'records?bu='+bu+'&lost_reason=No Decision / Non-Responsive&timeframe='+timeframe
                    }, {
                      name: 'Other',
                      y: parseInt(res.result.result['Other']),
                      url: this.base_url+'records?bu='+bu+'&lost_reason=Other&timeframe='+timeframe
                    }
                  ]
              }
          ]
        } as any);
        this.chart_lost_opp.reflow();
    });
  }

  getOrderTrend(bu, start_date, end_date, geo, currency, timeframe): void {
    var data =  {
      "bu": bu,
      "start_date": start_date,
      "end_date": end_date,
      "geo": geo,
      "currency": currency,
      "timeframe": timeframe
    }

      this.dataService.getOrderTrend(data).subscribe(
        res => {
          this.chart_line = Highcharts.chart('order-trend', {
            title: {
                text: ''
            },
            yAxis: {
                title: {
                    text: ''
                },
                labels:{
                  enabled: false
                },
                minorTickInterval: 100,
                gridLineColor: 'transparent',
                type: 'logarithmic',
                stackLabels: {
                  enabled: true,
                  style: {
                      fontWeight: 'bold',
                      color: ( // theme
                          Highcharts.defaultOptions.title.style &&
                          Highcharts.defaultOptions.title.style.color
                      ) || 'gray'
                  },
                  formatter: function () {
                    return this.total;
                  }
                  // formatter: function () {
                  //   return '' + Highcharts.numberFormat(this.total, 2, ',', ' ');
                  // }
                },
            },
            xAxis: {
                categories: ['October','November','December']
            },
            legend: {
              enabled: false
            },
            colors: ['rgb(70,121,167)','rgb(192, 201, 228)', 'rgb(162,197,238)', 'rgb(124,148,207)', 'rgb(48,137,202)'],      
            plotOptions: {
              column: {
                  stacking: 'normal',
                  dataLabels: {
                      enabled: true,
                      formatter: function () {
                        return this.total;
                      }
                  }
              },
              series: {
                pointWidth: 50,
                cursor: 'pointer',
              },
            },
            series: [
              {
                type: 'column',
                name: 'E',
                dataLabels: {
                  enabled: true,
                  formatter:function() {
                    if(this.y != 0) {
                      return '<span style="font-weight:normal;color:white;fill:white;">'+this.series.name+': '+this.y+ '</span>';
                    }
                  },
                  style: {
                    color: 'white',
                    textOutline: 'transparent'
                  }
                },
                point: {
                  events: {
                      click: function () {
                          // location.href = this.options.url;
                          window.open(this.options.url);
                      }
                  }
                },
                data: [{
                  name: 'October',
                  y: parseInt(res.result.October.E),
                  url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month=October'
                }, {
                  name: 'November',
                  y: parseInt(res.result.November.E),
                  url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month=November'
                }, {
                  name: 'December',
                  y: parseInt(res.result.December.E),
                  url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month=December'
                }]
            },{
              type: 'column',
              name: 'D',
              dataLabels: {
                enabled: true,
                formatter:function() {
                  if(this.y != 0) {
                    return '<span style="font-weight:normal;color:white;fill:white;">'+this.series.name+': '+this.y+ '</span>';
                  }
                },
                style: {
                  color: 'white',
                  textOutline: 'transparent'
                }
              },
              point: {
                events: {
                    click: function () {
                        // location.href = this.options.url;
                        window.open(this.options.url);
                    }
                }
              },
              data: [{
                name: 'October',
                y: parseInt(res.result.October.D),
                url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month=October'
              }, {
                name: 'November',
                y: parseInt(res.result.November.D),
                url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month=November'
              }, {
                name: 'December',
                y: parseInt(res.result.December.D),
                url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month=December'
              }]
            },{
              type: 'column',
              name: 'C',
              dataLabels: {
                enabled: true,
                formatter:function() {
                  if(this.y != 0) {
                    return '<span style="font-weight:normal;color:white;fill:white;">'+this.series.name+': '+this.y+ '</span>';
                  }
                },
                style: {
                  color: 'white',
                  textOutline: 'transparent'
                }
              },
              point: {
                events: {
                    click: function () {
                        // location.href = this.options.url;
                        window.open(this.options.url);
                    }
                }
              },
              data: [{
                name: 'October',
                y: parseInt(res.result.October.C),
                url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month=October'
              }, {
                name: 'November',
                y: parseInt(res.result.November.C),
                url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month=November'
              }, {
                name: 'December',
                y: parseInt(res.result.December.C),
                url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month=December'
              }]
            },{
              type: 'column',
              name: 'B',
              dataLabels: {
                enabled: true,
                formatter:function() {
                  if(this.y != 0) {
                    return '<span style="font-weight:normal;color:white;fill:white;">'+this.series.name+': '+this.y+ '</span>';
                  }
                },
                style: {
                  color: 'white',
                  textOutline: 'transparent'
                }
              },
              point: {
                events: {
                    click: function () {
                        // location.href = this.options.url;
                        window.open(this.options.url);
                    }
                }
              },
              data: [{
                name: 'October',
                y: parseInt(res.result.October.B),
                url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month=October'
              }, {
                name: 'November',
                y: parseInt(res.result.November.B),
                url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month=November'
              }, {
                name: 'December',
                y: parseInt(res.result.December.B),
                url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month=December'
              }]
            },{
              type: 'column',
              name: 'A',
              dataLabels: {
                enabled: true,
                formatter:function() {
                  if(this.y != 0) {
                    return '<span style="font-weight:normal;color:white;fill:white;">'+this.series.name+': '+this.y+ '</span>';
                  }
                },
                style: {
                  color: 'white',
                  textOutline: 'transparent'
                }
              },
              point: {
                events: {
                    click: function () {
                        // location.href = this.options.url;
                        window.open(this.options.url);
                    }
                }
              },
              data: [{
                name: 'October',
                y: parseInt(res.result.October.A),
                url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month=October'
              }, {
                name: 'November',
                y: parseInt(res.result.November.A),
                url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month=November'
              }, {
                name: 'December',
                y: parseInt(res.result.December.A),
                url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month=December'
              }]
            },{
              type: 'column',
              name: 'S',
              dataLabels: {
                enabled: true,
                formatter:function() {
                  if(this.y != 0) {
                    return '<span style="font-weight:normal;color:white;fill:white;">'+this.series.name+': '+this.y+ '</span>';
                  }
                },
                style: {
                  color: 'white',
                  textOutline: 'transparent'
                }
              },
              point: {
                events: {
                    click: function () {
                        // location.href = this.options.url;
                        window.open(this.options.url);
                    }
                }
              },
              data: [{
                name: 'October',
                y: parseInt(res.result.October.S),
                url:  this.base_url+'records?bu='+bu+'&rank=S&timeframe='+timeframe+'&month=October'
              }, {
                name: 'November',
                y: parseInt(res.result.November.S),
                url:  this.base_url+'records?bu='+bu+'&rank=S&timeframe='+timeframe+'&month=November'
              }, {
                name: 'December',
                y: parseInt(res.result.December.S),
                url:  this.base_url+'records?bu='+bu+'&rank=S&timeframe='+timeframe+'&month=December'
              }]
            },{
              type: 'column',
              name: 'Act',
              dataLabels: {
                enabled: true,
                formatter:function() {
                  if(this.y != 0) {
                    return '<span style="font-weight:normal;color:white;fill:white;">'+this.series.name+': '+this.y+ '</span>';
                  }
                },
                style: {
                  color: 'white',
                  textOutline: 'transparent'
                }
              },
              point: {
                events: {
                    click: function () {
                        // location.href = this.options.url;
                        window.open(this.options.url);
                    }
                }
              },
              data: [{
                name: 'October',
                y: parseInt(res.result.October.Act),
                url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month=October'
              }, {
                name: 'November',
                y: parseInt(res.result.November.Act),
                url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month=November'
              }, {
                name: 'December',
                y: parseInt(res.result.December.Act),
                url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month=December'
              }]
            }],
            drilldown: {
              series:[
                {
                  type: 'column',
                  name: "test",
                  id: "test",
                  colors: ['rgb(70,121,167)', 'rgb(162,197,238)', 'rgb(85,121,190)', 'rgb(117,150,208)', 'rgb(57,93,157)'],
                  plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                          enabled: true
                        }
                    }
                  },
                  data: [{
                      "name": "Q1",
                      "y": 1
                  }, {
                      "name": "Q2",
                      "y": 2
                  }, {
                      "name": "Q3",
                      "y": 3
                  }, {
                      "name": "Q4",
                      "y": 4
                  }]
                },{
                  type: 'column',
                  name: "test",
                  id: "test1",
                  colors: ['rgb(70,121,167)', 'rgb(162,197,238)', 'rgb(85,121,190)', 'rgb(117,150,208)', 'rgb(57,93,157)'],
                  plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                          enabled: true
                        }
                    }
                  },
                  data: [{
                      "name": "Q1",
                      "y": 1
                  }, {
                      "name": "Q2",
                      "y": 2
                  }, {
                      "name": "Q3",
                      "y": 3
                  }, {
                      "name": "Q4",
                      "y": 4
                  }]
                }
      
              ]
            },
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        legend: {
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom'
                        }
                    }
                }]
            }
      
          } as any);
      });
    

  }


}
