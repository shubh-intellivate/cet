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
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
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
  @ViewChild("fiscal_year") fiscal_year: ElementRef;
  @ViewChild("toggleClass") toggleClass: ElementRef;
  @ViewChild("toggleProj") toggleProj: ElementRef;
  @ViewChild("toggleG") toggleG: ElementRef;
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
  geoClassify: any;
  orderRunRate: any;
  estimatedRunRate: any;
  requiredRunRate: any;
  blur: any = '';
  chart_lost_opp: any;
  chart_line_top_accounts: any;
  chart_line: any;
  top_key_projects_actuals: any;
  // base_url: any = "http://88.218.92.164/";
  base_url: any = "http://localhost:4200/";
  // base_url: any = "http://45.66.159.11/";
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
  chart_sales: Highcharts.Chart;
  maxOrderSizeValue: any;
  minOrderSizeValue: any;
  top_key_projects_open: any;
  hide_project_actuals: boolean = false;
  hide_project_open: boolean = true;
  salesBreakdown: any;
  fRankModal: any="none";
  filterBu: any;
  filterStart_date: string;
  filterEnd_date: string;
  filterGeo: any;
  filterCurrency: any;
  filterTimeframe: any;
  fRankOpen: any;
  fRankTogo: any;
  bu_names: any;
  bu_group_names: any;
  bu_names_branch: any;
  geoFilter: any = "India";
  selectedBuValue: any = "All BU";

  constructor(
    private dataService : DataService
  ){ }
  

  ngOnInit() {
    this.getBuNames();
    this.getBuByBranch();
    this.getBuNamesGrouping();
    this.createChartGaugeOrder('','','','','','','');
    this.createChartGaugeSales('','','','','','','');
    this.createOrderOppGraph('','','','','','','');
    this.createOrderAmtGraph('','','','','','','');
    this.getOrdersBookedLastMonth('','','');
    this.getBidWinRate('','','','','','','');
    this.getAvgOrderCycle('','','','','','','');
    this.getAvgOrderSize('','','','','','','');
    this.getOrderRunRate('','','','','','','');
    this.getEstimatedRunRate('','','','','','','');
    this.getRequiredRunRate('','','','','','','');
    this.getTopKeyProjects('','','','','','','');
    this.getTopKeyAccounts('','','','','','','2022');
    this.getSayDoOrder('','','','','','','');
    this.getSayDoSales('','','','','','','');
    this.getNewCustomersAcquired('','','','','','','');
    this.getLostOpportunities('','','','','','','');
    this.getOrderTrend('','','','','','','2022');
  }

  ngAfterViewInit(){
    // this.chart_lost_opp.reflow();
    // this.chart_line.reflow();
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

  toggleGeo(){
    if(this.toggleG.nativeElement.value == 'rank'){
      this.geo_rank_show = false;
      this.geo_class_show = true;
    }else{
      this.geo_rank_show = true;
      this.geo_class_show = false;
    }
  }

  toggleSegment(){
    if(this.toggleSeg.nativeElement.value == 'rank'){
      this.segment_rank_show = false;
      this.segment_class_show = true;
    }else{
      this.segment_rank_show = true;
      this.segment_class_show = false;
    }
  }

  openFRankModal(){
    this.blur = "blur";
    this.fRankModal = "block";    
    var f_rank = {
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
          enabled: false
      },
      plotOptions: {
          series: {
              borderWidth: 0,
              dataLabels: {
                  enabled: true,
                  formatter:function() {
                    // if(this.y != 0) {
                      return this.y;
                    // }
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
          name: 'F',
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
          data: [{
            name: 'Open',
            y: parseInt(this.fRankOpen),
            url: this.base_url+'records?bu='+this.filterBu+'&geo='+this.filterGeo+'&start_date='+this.filterStart_date+'&end_date='+this.filterEnd_date+'&currency='+this.filterCurrency+'&type=open&rank=F&timeframe='+this.filterTimeframe
          },{
            name: 'To Go',
            y: parseInt(this.fRankTogo),
            url: this.base_url+'records?bu='+this.filterBu+'&geo='+this.filterGeo+'&start_date='+this.filterStart_date+'&end_date='+this.filterEnd_date+'&currency='+this.filterCurrency+'&type=toGo&rank=F&timeframe='+this.filterTimeframe
          }]
        }
      ]
    }
    Highcharts.chart('f-rank', f_rank as any);
  }

  closeFRankModal(){
    this.blur = "";
    this.fRankModal = "none";

  }

  openPipelineModal(){
    this.blur = "blur";
    this.pipelineModal = "block";
    this.geo_rank_show = false;
    this.geo_class_show = true;
    this.segment_rank_show = false;
    this.segment_class_show = true;
    this.toggleSeg.nativeElement.value = 'rank';
    this.toggleG.nativeElement.value = 'rank'
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
          enabled: false
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
          data: [{
            name: 'EE',
            y: parseInt(this.pipelineClassify.EE.E),
            drilldown: ''
          }, {
            name: 'EN',
            y: parseInt(this.pipelineClassify.EN.E),
            drilldown: ''
          }, {
            name: 'NN',
            y: parseInt(this.pipelineClassify.NN.E),
            drilldown: ''
          }]
        },{
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
          data: [{
            name: 'EE',
            y: parseInt(this.pipelineClassify.EE.D),
            drilldown: ''
          }, {
            name: 'EN',
            y: parseInt(this.pipelineClassify.EN.D),
            drilldown: ''
          }, {
            name: 'NN',
            y: parseInt(this.pipelineClassify.NN.D),
            drilldown: ''
          }]
        },{
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
          data: [{
            name: 'EE',
            y: parseInt(this.pipelineClassify.EE.C),
            drilldown: ''
          }, {
            name: 'EN',
            y: parseInt(this.pipelineClassify.EN.C),
            drilldown: ''
          }, {
            name: 'NN',
            y: parseInt(this.pipelineClassify.NN.C),
            drilldown: ''
          }]
        },{
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
          data: [{
            name: 'EE',
            y: parseInt(this.pipelineClassify.EE.B),
            drilldown: ''
          }, {
            name: 'EN',
            y: parseInt(this.pipelineClassify.EN.B),
            drilldown: ''
          }, {
            name: 'NN',
            y: parseInt(this.pipelineClassify.NN.B),
            drilldown: ''
          }]
        },{
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
          data: [{
            name: 'EE',
            y: parseInt(this.pipelineClassify.EE.A),
            drilldown: ''
          }, {
            name: 'EN',
            y: parseInt(this.pipelineClassify.EN.A),
            drilldown: ''
          }, {
            name: 'NN',
            y: parseInt(this.pipelineClassify.NN.A),
            drilldown: ''
          }]
        },{
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
          data: [{
            name: 'EE',
            y: parseInt(this.pipelineClassify.EE.S),
            drilldown: ''
          }, {
            name: 'EN',
            y: parseInt(this.pipelineClassify.EN.S),
            drilldown: ''
          }, {
            name: 'NN',
            y: parseInt(this.pipelineClassify.NN.S),
            drilldown: ''
          }]
        },{
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
          data: [{
            name: 'EE',
            y: parseInt(this.pipelineClassify.EE.Act),
            drilldown: ''
          }, {
            name: 'EN',
            y: parseInt(this.pipelineClassify.EN.Act),
            drilldown: ''
          }, {
            name: 'NN',
            y: parseInt(this.pipelineClassify.NN.Act),
            drilldown: ''
          }]
        }
      ]
    }
    Highcharts.chart('classify-pipeline-rank', classify_pipeline as any);
    var classify_pipeline_class = {
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
          enabled: false
      },
      plotOptions: {
          series: {
              borderWidth: 0,
              pointWidth: 50,
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
          name: 'EE',
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
          data: [{
            name: 'Act',
            y: parseInt(this.pipelineClassify.Act.EE),
            drilldown: ''
          },{
            name: 'A',
            y: parseInt(this.pipelineClassify.A.EE),
            drilldown: ''
          },{
            name: 'S',
            y: parseInt(this.pipelineClassify.S.EE),
            drilldown: ''
          },{
            name: 'B',
            y: parseInt(this.pipelineClassify.B.EE),
            drilldown: ''
          },{
            name: 'C',
            y: parseInt(this.pipelineClassify.C.EE),
            drilldown: ''
          },{
            name: 'D',
            y: parseInt(this.pipelineClassify.D.EE),
            drilldown: ''
          },{
            name: 'E',
            y: parseInt(this.pipelineClassify.E.EE),
            drilldown: ''
          },{
            name: 'F',
            y: parseInt(this.pipelineClassify.F.EE),
            drilldown: ''
          }]
        },{
          name: 'EN',
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
          data: [{
            name: 'Act',
            y: parseInt(this.pipelineClassify.Act.EN),
            drilldown: ''
          },{
            name: 'A',
            y: parseInt(this.pipelineClassify.A.EN),
            drilldown: ''
          },{
            name: 'S',
            y: parseInt(this.pipelineClassify.S.EN),
            drilldown: ''
          },{
            name: 'B',
            y: parseInt(this.pipelineClassify.B.EN),
            drilldown: ''
          },{
            name: 'C',
            y: parseInt(this.pipelineClassify.C.EN),
            drilldown: ''
          },{
            name: 'D',
            y: parseInt(this.pipelineClassify.D.EN),
            drilldown: ''
          },{
            name: 'E',
            y: parseInt(this.pipelineClassify.E.EN),
            drilldown: ''
          },{
            name: 'F',
            y: parseInt(this.pipelineClassify.F.EN),
            drilldown: ''
          }]
        },{
          name: 'NN',
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
          data: [{
            name: 'Act',
            y: parseInt(this.pipelineClassify.Act.NN),
            drilldown: ''
          },{
            name: 'A',
            y: parseInt(this.pipelineClassify.A.NN),
            drilldown: ''
          },{
            name: 'S',
            y: parseInt(this.pipelineClassify.S.NN),
            drilldown: ''
          },{
            name: 'B',
            y: parseInt(this.pipelineClassify.B.NN),
            drilldown: ''
          },{
            name: 'C',
            y: parseInt(this.pipelineClassify.C.NN),
            drilldown: ''
          },{
            name: 'D',
            y: parseInt(this.pipelineClassify.D.NN),
            drilldown: ''
          },{
            name: 'E',
            y: parseInt(this.pipelineClassify.E.NN),
            drilldown: ''
          },{
            name: 'F',
            y: parseInt(this.pipelineClassify.F.NN),
            drilldown: ''
          }]
        },
      ]
    }
    Highcharts.chart('classify-pipeline-class', classify_pipeline_class as any);
    var geo_pipeline = {
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
          enabled: false
      },
      plotOptions: {
          series: {
              borderWidth: 0,
              pointWidth: 50,
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
          data: [{
            name: 'India',
            y: parseInt(this.geoClassify.india.E),
            drilldown: ''
          }, {
            name: 'Japan',
            y: parseInt(this.geoClassify.japan.E),
            drilldown: ''
          }, {
            name: 'USA',
            y: parseInt(this.geoClassify.usa.E),
            drilldown: ''
          }, {
            name: 'APAC',
            y: parseInt(this.geoClassify.apac.E),
            drilldown: ''
          },{
            name: 'EMEA',
            y: parseInt(this.geoClassify.emea.E),
            drilldown: ''
          },
        ]
        },  {
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
          data: [{
            name: 'India',
            y: parseInt(this.geoClassify.india.D),
            drilldown: ''
          }, {
            name: 'Japan',
            y: parseInt(this.geoClassify.japan.D),
            drilldown: ''
          }, {
            name: 'USA',
            y: parseInt(this.geoClassify.usa.D),
            drilldown: ''
          }, {
            name: 'APAC',
            y: parseInt(this.geoClassify.apac.D),
            drilldown: ''
          },{
            name: 'EMEA',
            y: parseInt(this.geoClassify.emea.D),
            drilldown: ''
          },
        ]
        },  {
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
          data: [{
            name: 'India',
            y: parseInt(this.geoClassify.india.C),
            drilldown: ''
          }, {
            name: 'Japan',
            y: parseInt(this.geoClassify.japan.C),
            drilldown: ''
          }, {
            name: 'USA',
            y: parseInt(this.geoClassify.usa.C),
            drilldown: ''
          }, {
            name: 'APAC',
            y: parseInt(this.geoClassify.apac.C),
            drilldown: ''
          },{
            name: 'EMEA',
            y: parseInt(this.geoClassify.emea.C),
            drilldown: ''
          },
        ]
        },  {
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
          data: [{
            name: 'India',
            y: parseInt(this.geoClassify.india.B),
            drilldown: ''
          }, {
            name: 'Japan',
            y: parseInt(this.geoClassify.japan.B),
            drilldown: ''
          }, {
            name: 'USA',
            y: parseInt(this.geoClassify.usa.B),
            drilldown: ''
          }, {
            name: 'APAC',
            y: parseInt(this.geoClassify.apac.B),
            drilldown: ''
          }, {
            name: 'EMEA',
            y: parseInt(this.geoClassify.emea.B),
            drilldown: ''
          },
        ]
        },    {
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
          data: [{
            name: 'India',
            y: parseInt(this.geoClassify.india.A),
            drilldown: ''
          }, {
            name: 'Japan',
            y: parseInt(this.geoClassify.japan.A),
            drilldown: ''
          }, {
            name: 'USA',
            y: parseInt(this.geoClassify.usa.A),
            drilldown: ''
          }, {
            name: 'APAC',
            y: parseInt(this.geoClassify.apac.A),
            drilldown: ''
          },{
            name: 'EMEA',
            y: parseInt(this.geoClassify.emea.A),
            drilldown: ''
          },
        ]
        },{
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
          data: [{
            name: 'India',
            y: parseInt(this.geoClassify.india.S),
            drilldown: ''
          }, {
            name: 'Japan',
            y: parseInt(this.geoClassify.japan.S),
            drilldown: ''
          }, {
            name: 'USA',
            y: parseInt(this.geoClassify.usa.S),
            drilldown: ''
          }, {
            name: 'APAC',
            y: parseInt(this.geoClassify.apac.S),
            drilldown: ''
          }, {
            name: 'EMEA',
            y: parseInt(this.geoClassify.emea.S),
            drilldown: ''
          },
        ]
        },  {
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
          data: [{
            name: 'India',
            y: parseInt(this.geoClassify.india.Act),
            drilldown: ''
          }, {
            name: 'Japan',
            y: parseInt(this.geoClassify.japan.Act),
            drilldown: ''
          }, {
            name: 'USA',
            y: parseInt(this.geoClassify.usa.Act),
            drilldown: ''
          }, {
            name: 'APAC',
            y: parseInt(this.geoClassify.apac.Act),
            drilldown: ''
          }, {
            name: 'EMEA',
            y: parseInt(this.geoClassify.emea.Act),
            drilldown: ''
          },
        ]
        },
      ]
    }
    Highcharts.chart('geo-pipeline-rank', geo_pipeline as any);
    var geo_pipeline_class = {
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
          enabled: false
      },
      plotOptions: {
          series: {
              borderWidth: 0,
              pointWidth: 50,
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
      colors: ['rgb(15, 82, 186)', 'rgb(115, 194, 251)' , 'rgb(38, 97, 156)', 'rgb(117,150,208)', 'rgb(57,93,157)', 'rgb(122,148,228)', 'rgb(132,174,220)', 'rgb(143,163,213)'],
      tooltip: {
          headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
          pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y} Mn</b>'
      },
  
      series: [
          {
          name: 'EE',
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
          data: [{
            name: 'India',
            y: parseInt(this.geoClassify.india.EE),
            drilldown: ''
          }, {
            name: 'Japan',
            y: parseInt(this.geoClassify.japan.EE),
            drilldown: ''
          }, {
            name: 'USA',
            y: parseInt(this.geoClassify.usa.EE),
            drilldown: ''
          }, {
            name: 'APAC',
            y: parseInt(this.geoClassify.apac.EE),
            drilldown: ''
          },{
            name: 'EMEA',
            y: parseInt(this.geoClassify.emea.EE),
            drilldown: ''
          },
        ]
        },{
          name: 'EN',
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
          data: [{
            name: 'India',
            y: parseInt(this.geoClassify.india.EN),
            drilldown: ''
          }, {
            name: 'Japan',
            y: parseInt(this.geoClassify.japan.EN),
            drilldown: ''
          }, {
            name: 'USA',
            y: parseInt(this.geoClassify.usa.EN),
            drilldown: ''
          }, {
            name: 'APAC',
            y: parseInt(this.geoClassify.apac.EN),
            drilldown: ''
          },{
            name: 'EMEA',
            y: parseInt(this.geoClassify.emea.EN),
            drilldown: ''
          },
        ]
        },{
          name: 'NN',
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
          data: [{
            name: 'India',
            y: parseInt(this.geoClassify.india.NN),
            drilldown: ''
          }, {
            name: 'Japan',
            y: parseInt(this.geoClassify.japan.NN),
            drilldown: ''
          }, {
            name: 'USA',
            y: parseInt(this.geoClassify.usa.NN),
            drilldown: ''
          }, {
            name: 'APAC',
            y: parseInt(this.geoClassify.apac.NN),
            drilldown: ''
          },{
            name: 'EMEA',
            y: parseInt(this.geoClassify.emea.NN),
            drilldown: ''
          },
        ]
        },
      ]
    }
    Highcharts.chart('geo-pipeline-class', geo_pipeline_class as any);
    var subproject_pipeline = {
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
          enabled: false
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
          data: [{
            name: this.subProjectClassify.project1.name,
            y: parseInt(this.subProjectClassify.project1.E),
            drilldown: ''
          },{
            name: this.subProjectClassify.project2.name,
            y: parseInt(this.subProjectClassify.project2.E),
            drilldown: ''
          },{
            name: this.subProjectClassify.project3.name,
            y: parseInt(this.subProjectClassify.project3.E),
            drilldown: ''
          },{
            name: this.subProjectClassify.project4.name,
            y: parseInt(this.subProjectClassify.project4.E),
            drilldown: ''
          },{
            name: this.subProjectClassify.project5.name,
            y: parseInt(this.subProjectClassify.project5.E),
            drilldown: ''
          }]
        },{
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
          data: [{
            name: this.subProjectClassify.project1.name,
            y: parseInt(this.subProjectClassify.project1.D),
            drilldown: ''
          },{
            name: this.subProjectClassify.project2.name,
            y: parseInt(this.subProjectClassify.project2.D),
            drilldown: ''
          },{
            name: this.subProjectClassify.project3.name,
            y: parseInt(this.subProjectClassify.project3.D),
            drilldown: ''
          },{
            name: this.subProjectClassify.project4.name,
            y: parseInt(this.subProjectClassify.project4.D),
            drilldown: ''
          },{
            name: this.subProjectClassify.project5.name,
            y: parseInt(this.subProjectClassify.project5.D),
            drilldown: ''
          }]
        },{
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
          data: [{
            name: this.subProjectClassify.project1.name,
            y: parseInt(this.subProjectClassify.project1.C),
            drilldown: ''
          },{
            name: this.subProjectClassify.project2.name,
            y: parseInt(this.subProjectClassify.project2.C),
            drilldown: ''
          },{
            name: this.subProjectClassify.project3.name,
            y: parseInt(this.subProjectClassify.project3.C),
            drilldown: ''
          },{
            name: this.subProjectClassify.project4.name,
            y: parseInt(this.subProjectClassify.project4.C),
            drilldown: ''
          },{
            name: this.subProjectClassify.project5.name,
            y: parseInt(this.subProjectClassify.project5.C),
            drilldown: ''
          }]
        },{
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
          data: [{
            name: this.subProjectClassify.project1.name,
            y: parseInt(this.subProjectClassify.project1.B),
            drilldown: ''
          },{
            name: this.subProjectClassify.project2.name,
            y: parseInt(this.subProjectClassify.project2.B),
            drilldown: ''
          },{
            name: this.subProjectClassify.project3.name,
            y: parseInt(this.subProjectClassify.project3.B),
            drilldown: ''
          },{
            name: this.subProjectClassify.project4.name,
            y: parseInt(this.subProjectClassify.project4.B),
            drilldown: ''
          },{
            name: this.subProjectClassify.project5.name,
            y: parseInt(this.subProjectClassify.project5.B),
            drilldown: ''
          }]
        },{
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
          data: [{
            name: this.subProjectClassify.project1.name,
            y: parseInt(this.subProjectClassify.project1.A),
            drilldown: ''
          },{
            name: this.subProjectClassify.project2.name,
            y: parseInt(this.subProjectClassify.project2.A),
            drilldown: ''
          },{
            name: this.subProjectClassify.project3.name,
            y: parseInt(this.subProjectClassify.project3.A),
            drilldown: ''
          },{
            name: this.subProjectClassify.project4.name,
            y: parseInt(this.subProjectClassify.project4.A),
            drilldown: ''
          },{
            name: this.subProjectClassify.project5.name,
            y: parseInt(this.subProjectClassify.project5.A),
            drilldown: ''
          }]
        },{
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
          data: [{
            name: this.subProjectClassify.project1.name,
            y: parseInt(this.subProjectClassify.project1.S),
            drilldown: ''
          },{
            name: this.subProjectClassify.project2.name,
            y: parseInt(this.subProjectClassify.project2.S),
            drilldown: ''
          },{
            name: this.subProjectClassify.project3.name,
            y: parseInt(this.subProjectClassify.project3.S),
            drilldown: ''
          },{
            name: this.subProjectClassify.project4.name,
            y: parseInt(this.subProjectClassify.project4.S),
            drilldown: ''
          },{
            name: this.subProjectClassify.project5.name,
            y: parseInt(this.subProjectClassify.project5.S),
            drilldown: ''
          }]
        },{
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
          data: [{
            name: this.subProjectClassify.project1.name,
            y: parseInt(this.subProjectClassify.project1.Act),
            drilldown: ''
          },{
            name: this.subProjectClassify.project2.name,
            y: parseInt(this.subProjectClassify.project2.Act),
            drilldown: ''
          },{
            name: this.subProjectClassify.project3.name,
            y: parseInt(this.subProjectClassify.project3.Act),
            drilldown: ''
          },{
            name: this.subProjectClassify.project4.name,
            y: parseInt(this.subProjectClassify.project4.Act),
            drilldown: ''
          },{
            name: this.subProjectClassify.project5.name,
            y: parseInt(this.subProjectClassify.project5.Act),
            drilldown: ''
          }]
        }
      ]
    }
    Highcharts.chart('subproject-pipeline-rank', subproject_pipeline as any);
    var subproject_pipeline_class = {
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
          enabled: false
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
      colors: ['rgb(15, 82, 186)', 'rgb(115, 194, 251)' , 'rgb(38, 97, 156)', 'rgb(117,150,208)', 'rgb(57,93,157)', 'rgb(122,148,228)', 'rgb(132,174,220)', 'rgb(143,163,213)'],
      tooltip: {
          headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
          pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y} Mn</b>'
      },
  
      series: [
          {
          name: 'EE',
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
          data: [{
            name: this.subProjectClassify.project1.name,
            y: parseInt(this.subProjectClassify.project1.EE),
            drilldown: ''
          },{
            name: this.subProjectClassify.project2.name,
            y: parseInt(this.subProjectClassify.project2.EE),
            drilldown: ''
          },{
            name: this.subProjectClassify.project3.name,
            y: parseInt(this.subProjectClassify.project3.EE),
            drilldown: ''
          },{
            name: this.subProjectClassify.project4.name,
            y: parseInt(this.subProjectClassify.project4.EE),
            drilldown: ''
          },{
            name: this.subProjectClassify.project5.name,
            y: parseInt(this.subProjectClassify.project5.EE),
            drilldown: ''
          }]
        },{
          name: 'EN',
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
          data: [{
            name: this.subProjectClassify.project1.name,
            y: parseInt(this.subProjectClassify.project1.EN),
            drilldown: ''
          },{
            name: this.subProjectClassify.project2.name,
            y: parseInt(this.subProjectClassify.project2.EN),
            drilldown: ''
          },{
            name: this.subProjectClassify.project3.name,
            y: parseInt(this.subProjectClassify.project3.EN),
            drilldown: ''
          },{
            name: this.subProjectClassify.project4.name,
            y: parseInt(this.subProjectClassify.project4.EN),
            drilldown: ''
          },{
            name: this.subProjectClassify.project5.name,
            y: parseInt(this.subProjectClassify.project5.EN),
            drilldown: ''
          }]
        },{
          name: 'NN',
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
          data: [{
            name: this.subProjectClassify.project1.name,
            y: parseInt(this.subProjectClassify.project1.NN),
            drilldown: ''
          },{
            name: this.subProjectClassify.project2.name,
            y: parseInt(this.subProjectClassify.project2.NN),
            drilldown: ''
          },{
            name: this.subProjectClassify.project3.name,
            y: parseInt(this.subProjectClassify.project3.NN),
            drilldown: ''
          },{
            name: this.subProjectClassify.project4.name,
            y: parseInt(this.subProjectClassify.project4.NN),
            drilldown: ''
          },{
            name: this.subProjectClassify.project5.name,
            y: parseInt(this.subProjectClassify.project5.NN),
            drilldown: ''
          }]
        }
      ]
    }
    Highcharts.chart('subproject-pipeline-class', subproject_pipeline_class as any);
  }

  openSalesModal(){
    this.blur = "blur";
    this.salesModal = "block";
    var amount_arr = [
      ['New', this.salesBreakdown.New.value],
      ['Backlog', this.salesBreakdown.Backlog.value]
    ];
    this.chart_sales = Highcharts.chart('classify-sales', {
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
                  name: 'New',
                  y: parseInt(this.salesBreakdown.New.percentage)
                },
                {
                  name: 'Backlog',
                  y: parseInt(this.salesBreakdown.Backlog.percentage)
                }
              ]
          }
      ]
    } as any);
    
    this.chart_sales = Highcharts.chart('new-sales-trend', {
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
          categories: ["Q1", "Q2", "Q3", "Q4"]
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
            name: "Q1",
            y: parseInt(this.salesBreakdown.New.Q1.E)
          },{
            name: "Q2",
            y: parseInt(this.salesBreakdown.New.Q2.E)
          },{
            name: "Q3",
            y: parseInt(this.salesBreakdown.New.Q3.E)
          },{
            name: "Q4",
            y: parseInt(this.salesBreakdown.New.Q4.E)
          }]
        },
        {
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
            name: "Q1",
            y: parseInt(this.salesBreakdown.New.Q1.D)
          },{
            name: "Q2",
            y: parseInt(this.salesBreakdown.New.Q2.D)
          },{
            name: "Q3",
            y: parseInt(this.salesBreakdown.New.Q3.D)
          },{
            name: "Q4",
            y: parseInt(this.salesBreakdown.New.Q4.D)
          }]
        },
        {
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
            name: "Q1",
            y: parseInt(this.salesBreakdown.New.Q1.C)
          },{
            name: "Q2",
            y: parseInt(this.salesBreakdown.New.Q2.C)
          },{
            name: "Q3",
            y: parseInt(this.salesBreakdown.New.Q3.C)
          },{
            name: "Q4",
            y: parseInt(this.salesBreakdown.New.Q4.C)
          }]
        },
        {
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
            name: "Q1",
            y: parseInt(this.salesBreakdown.New.Q1.B)
          },{
            name: "Q2",
            y: parseInt(this.salesBreakdown.New.Q2.B)
          },{
            name: "Q3",
            y: parseInt(this.salesBreakdown.New.Q3.B)
          },{
            name: "Q4",
            y: parseInt(this.salesBreakdown.New.Q4.B)
          }]
        },
        {
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
            name: "Q1",
            y: parseInt(this.salesBreakdown.New.Q1.A)
          },{
            name: "Q2",
            y: parseInt(this.salesBreakdown.New.Q2.A)
          },{
            name: "Q3",
            y: parseInt(this.salesBreakdown.New.Q3.A)
          },{
            name: "Q4",
            y: parseInt(this.salesBreakdown.New.Q4.A)
          }]
        },
        {
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
            name: "Q1",
            y: parseInt(this.salesBreakdown.New.Q1.Act)
          },{
            name: "Q2",
            y: parseInt(this.salesBreakdown.New.Q2.Act)
          },{
            name: "Q3",
            y: parseInt(this.salesBreakdown.New.Q3.Act)
          },{
            name: "Q4",
            y: parseInt(this.salesBreakdown.New.Q4.Act)
          }]
        },
      ],
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
    this.chart_sales = Highcharts.chart('backlog-sales-trend', {
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
          categories: ["Q1", "Q2", "Q3", "Q4"]
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
            name: "Q1",
            y: parseInt(this.salesBreakdown.Backlog.Q1.E)
          },{
            name: "Q2",
            y: parseInt(this.salesBreakdown.Backlog.Q2.E)
          },{
            name: "Q3",
            y: parseInt(this.salesBreakdown.Backlog.Q3.E)
          },{
            name: "Q4",
            y: parseInt(this.salesBreakdown.Backlog.Q4.E)
          }]
        },
        {
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
            name: "Q1",
            y: parseInt(this.salesBreakdown.Backlog.Q1.D)
          },{
            name: "Q2",
            y: parseInt(this.salesBreakdown.Backlog.Q2.D)
          },{
            name: "Q3",
            y: parseInt(this.salesBreakdown.Backlog.Q3.D)
          },{
            name: "Q4",
            y: parseInt(this.salesBreakdown.Backlog.Q4.D)
          }]
        },
        {
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
            name: "Q1",
            y: parseInt(this.salesBreakdown.Backlog.Q1.C)
          },{
            name: "Q2",
            y: parseInt(this.salesBreakdown.Backlog.Q2.C)
          },{
            name: "Q3",
            y: parseInt(this.salesBreakdown.Backlog.Q3.C)
          },{
            name: "Q4",
            y: parseInt(this.salesBreakdown.Backlog.Q4.C)
          }]
        },
        {
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
            name: "Q1",
            y: parseInt(this.salesBreakdown.Backlog.Q1.B)
          },{
            name: "Q2",
            y: parseInt(this.salesBreakdown.Backlog.Q2.B)
          },{
            name: "Q3",
            y: parseInt(this.salesBreakdown.Backlog.Q3.B)
          },{
            name: "Q4",
            y: parseInt(this.salesBreakdown.Backlog.Q4.B)
          }]
        },
        {
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
            name: "Q1",
            y: parseInt(this.salesBreakdown.Backlog.Q1.A)
          },{
            name: "Q2",
            y: parseInt(this.salesBreakdown.Backlog.Q2.A)
          },{
            name: "Q3",
            y: parseInt(this.salesBreakdown.Backlog.Q3.A)
          },{
            name: "Q4",
            y: parseInt(this.salesBreakdown.Backlog.Q4.A)
          }]
        },
        {
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
            name: "Q1",
            y: parseInt(this.salesBreakdown.Backlog.Q1.Act)
          },{
            name: "Q2",
            y: parseInt(this.salesBreakdown.Backlog.Q2.Act)
          },{
            name: "Q3",
            y: parseInt(this.salesBreakdown.Backlog.Q3.Act)
          },{
            name: "Q4",
            y: parseInt(this.salesBreakdown.Backlog.Q4.Act)
          }]
        },
      ],
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

  selectBu(buName){
    console.log(buName)
    this.bu.nativeElement.value = buName;
    this.selectedBuValue = buName;
    this.globalFilter();
  }

  globalFilter(){
    var bu = this.bu.nativeElement.value;
    var geo = this.geo.nativeElement.value;
    var timeframe = this.timeframe.nativeElement.value;
    var fiscal_year = this.fiscal_year.nativeElement.value;
    var currency = this.currency.nativeElement.value;
    var start_date = ''
    var end_date = ''
    var timeframeFilter = ''
    this.buFilterLink = bu;


    if(bu == ''){
      this.buFilter = 'All BU'
    }else{
      this.buFilter = bu
    }

    if(geo == ''){
      this.geoFilter = 'All Branches';
    }else{
      this.geoFilter = geo;
    }

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

    this.createChartGaugeOrder(bu, start_date, end_date, geo, currency, timeframe, fiscal_year);
    this.createChartGaugeSales(bu, start_date, end_date, geo, currency, timeframe, fiscal_year);
    this.createOrderOppGraph(bu, start_date, end_date, geo, currency, timeframe, fiscal_year);
    this.createOrderAmtGraph(bu, start_date, end_date, geo, currency, timeframe, fiscal_year);
    this.getOrdersBookedLastMonth(bu, geo, fiscal_year);
    this.getBidWinRate(bu, start_date, end_date, geo, currency, timeframe, fiscal_year);
    this.getAvgOrderCycle(bu, start_date, end_date, geo, currency, timeframe, fiscal_year);
    this.getAvgOrderSize(bu, start_date, end_date, geo, currency, timeframe, fiscal_year);
    this.getOrderRunRate(bu, start_date, end_date, geo, currency, timeframe, fiscal_year);
    this.getEstimatedRunRate(bu, start_date, end_date, geo, currency, timeframe, fiscal_year);
    this.getRequiredRunRate(bu, start_date, end_date, geo, currency, timeframe, fiscal_year);
    this.getTopKeyProjects(bu, start_date, end_date, geo, currency, timeframe, fiscal_year);
    this.getTopKeyAccounts(bu, start_date, end_date, geo, currency, timeframe, fiscal_year);
    this.getSayDoOrder(bu, start_date, end_date, geo, currency, timeframe, fiscal_year);
    this.getSayDoSales(bu, start_date, end_date, geo, currency, timeframe, fiscal_year);
    this.getNewCustomersAcquired(bu, start_date, end_date, geo, currency, timeframe, fiscal_year);
    this.getLostOpportunities(bu, start_date, end_date, geo, currency, timeframe, fiscal_year);
    this.getOrderTrend(bu, start_date, end_date, geo, currency, timeframe, fiscal_year);
    this.showOrderOppPercentage();
    this.showOrderAmtPercentage();
    this.showPrevYearSaydoValue();
    this.showCurYearSaydoValue();
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

  getBuNames(){
    this.dataService.getBuNames().subscribe(
      res => {
        this.bu_names = res.result.bu_names;
      });
  }

  getBuByBranch(){
    let data = {
      "branch":"India"
    }
    this.dataService.getBuByBranch(data).subscribe(
      res => {
        this.bu_names_branch = res.result.bu_names;
      });
  }

  getBuNamesGrouping(){
    this.dataService.getBuNamesGrouping().subscribe(
      res => {
        this.bu_group_names = res.bu_names;
      });
  }

  getSayDoOrder(bu, start_date, end_date, geo, currency, timeframe, fiscal_year){
    let data = {
      "bu":bu,
      "start_date":start_date,
      "end_date":end_date,
      "geo":geo,
      "currency":currency,
      "fiscal_year": fiscal_year,
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

  getSayDoSales(bu, start_date, end_date, geo, currency, timeframe, fiscal_year){
    let data = {
      "bu":bu,
      "start_date":start_date,
      "end_date":end_date,
      "geo":geo,
      "currency":currency,
      "fiscal_year": fiscal_year, 
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

  getTopKeyProjects(bu, start_date, end_date, geo, currency, timeframe, fiscal_year){
    let data = {
      "bu":bu,
      "start_date":start_date,
      "end_date":end_date,
      "geo":geo,
      "currency":currency,
      "fiscal_year": fiscal_year,
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

  getTopKeyAccounts(bu, start_date, end_date, geo, currency, timeframe, fiscal_year){
    let data = {
      "bu":bu,
      "start_date":start_date,
      "end_date":end_date,
      "geo":geo,
      "currency":currency,
      "fiscal_year": fiscal_year,
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

  getOrdersBookedLastMonth(bu, geo, fiscal_year){
    let data = {
      "bu":bu,
      "geo":geo,
      "fiscal_year": fiscal_year
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

  getNewCustomersAcquired(bu, start_date, end_date, geo, currency, timeframe, fiscal_year){
    let data = {
      "bu":bu,
      "start_date":start_date,
      "end_date":end_date,
      "geo":geo,
      "currency":currency,
      "fiscal_year": fiscal_year,
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

  getBidWinRate(bu, start_date, end_date, geo, currency, timeframe, fiscal_year){
    let data = {
      "bu":bu,
      "start_date":start_date,
      "end_date":end_date,
      "geo":geo,
      "currency":currency,
      "fiscal_year": fiscal_year,
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

  getAvgOrderCycle(bu, start_date, end_date, geo, currency, timeframe, fiscal_year){
    let data = {
      "bu":bu,
      "start_date":start_date,
      "end_date":end_date,
      "geo":geo,
      "currency":currency,
      "fiscal_year": fiscal_year,
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

  getAvgOrderSize(bu, start_date, end_date, geo, currency, timeframe, fiscal_year){
    let data = {
      "bu":bu,
      "start_date":start_date,
      "end_date":end_date,
      "geo":geo,
      "currency":currency,
      "fiscal_year": fiscal_year,
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

  getOrderRunRate(bu, start_date, end_date, geo, currency, timeframe, fiscal_year){
    let data = {
      "bu":bu,
      "start_date":start_date,
      "end_date":end_date,
      "geo":geo,
      "currency":currency,
      "fiscal_year": fiscal_year,
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

  getEstimatedRunRate(bu, start_date, end_date, geo, currency, timeframe, fiscal_year){
    let data = {
      "bu":bu,
      "start_date":start_date,
      "end_date":end_date,
      "geo":geo,
      "currency":currency,
      "fiscal_year": fiscal_year,
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

  getRequiredRunRate(bu, start_date, end_date, geo, currency, timeframe, fiscal_year){
    let data = {
      "bu":bu,
      "start_date":start_date,
      "end_date":end_date,
      "geo":geo,
      "currency":currency,
      "fiscal_year": fiscal_year,
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

  createOrderOppGraph(bu, start_date, end_date, geo, currency, timeframe, fiscal_year){
    let data = {
        "bu":bu,
        "start_date":start_date,
        "end_date":end_date,
        "geo":geo,
        "currency":currency,
        "fiscal_year": fiscal_year,
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

  createOrderAmtGraph(bu, start_date, end_date, geo, currency, timeframe, fiscal_year){
    let data = {
      "bu":bu,
      "start_date":start_date,
      "end_date":end_date,
      "geo":geo,
      "currency":currency,
      "fiscal_year": fiscal_year,
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

  createChartGaugeOrder(bu, start_date, end_date, geo, currency, timeframe, fiscal_year): void {
    var data =  {
      "bu": bu,
      "start_date": start_date,
      "end_date": end_date,
      "geo": geo,
      "currency": currency,
      "fiscal_year": fiscal_year,
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
          this.fRankOpen = res.result.result.achieved.open.F;
          this.fRankTogo = res.result.result.achieved.toGo.F;
          const chart_order = Highcharts.chart('chart-gauge-order', {
            chart: {
              type: 'solidgauge',
            },
            title: {
              text: '<span style="font-size: 15px;">Target - '+ parseInt(res.result.result.totalTarget)+'<br>Actual - '+parseInt(res.result.result.achieved.value)+'</span>',
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
                      Highcharts.chart('chart-gauge-order', order_graph_order as any);
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


          var budget_value_sign = '-';
          var budget_per_sign = '-';
          var vs_bc_sign = '-';
          if(parseInt(res.result.result.achieved.vs_budget_value)<0){
            budget_value_sign = '+';
          }
          if(parseInt(res.result.result.achieved.vs_budget_per)<0){
            budget_per_sign = '+';
          }
          if(parseInt(res.result.result.achieved.vs_bc)<0){
            vs_bc_sign = '+';
          }
  
          var order_graph_order = {
            chart: {
              type: 'column',
              events: {
                drilldown: function(e) {
                  var chart = this;
                  chart.setTitle({ text: "" });
                  if(this.ddDupes.length > 1){
                    e.preventDefault();
                  }
                },
                drillup: function(e) {
                  var chart = this;
                  if(e.seriesOptions.name == 'Open' || e.seriesOptions.name == 'To Go') {
                    chart.setTitle({ text: '<div style="text-align: right;"><span style="color:rgb(70, 121, 167); font-size:small;">Est vs Bud ('+budget_value_sign+')'+Math.abs(res.result.result.achieved.vs_budget_value)+' ['+budget_per_sign+''+Math.abs(res.result.result.achieved.vs_budget_per)+'%]<br>Est vs '+(parseInt(res.result.result.achieved.currentbc)-1)+'BC ('+vs_bc_sign+')'+Math.abs(res.result.result.achieved.vs_bc)+' ['+vs_bc_sign+''+Math.abs(res.result.result.achieved.vs_bc_per)+'%]'+'<br/>Funnel Ratio: '+res.result.result.achieved.funnel_ratio+'X</span></div>' });
                  }else{
                    chart.setTitle({ text: "" });
                  }
                }
              }
            },
            title: {
                text: '<div style="text-align: right;"><span style="color:rgb(70, 121, 167); font-size:small;">Est vs Bud ('+budget_value_sign+')'+Math.abs(res.result.result.achieved.vs_budget_value)+' ['+budget_per_sign+''+Math.abs(res.result.result.achieved.vs_budget_per)+'%]<br>Est vs '+(parseInt(res.result.result.achieved.currentbc)-1)+'BC ('+vs_bc_sign+')'+Math.abs(res.result.result.achieved.vs_bc)+' ['+vs_bc_sign+''+Math.abs(res.result.result.achieved.vs_bc_per)+'%]'+'<br/>Funnel Ratio: '+res.result.result.achieved.funnel_ratio+'X</span></div>' ,
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
        
            series: [{
              name: 'Order',
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
                name: 'Target',
                y: parseInt(res.result.result.achieved.orderBudget),
                drilldown: ''
              }, {
                name: 'Pipeline',
                y: 0,
                drilldown: ''
              }, {
                name: 'Estimate',
                y: 0,
                drilldown: ''
              }]
            }, {
              name: 'Open',
              dataLabels: {
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
                name: 'Target',
                y: 0,
                drilldown: ''
              }, {
                name: 'Pipeline',
                y: parseInt(res.result.result.achieved.open.value),
                drilldown: 'togOrder Pipeline'
              }, {
                name: 'Estimate',
                y: 0,
                drilldown: '  '
              }]
            }, {
              name: 'Confirmed',
              dataLabels: {
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
                name: 'Target',
                y: 0,
                drilldown: ''
              }, {
                name: 'Pipeline',
                y: parseInt(res.result.result.achieved.confirmed.value),
                drilldown: 'Confirmed Pipeline'
              }, {
                name: 'Estimate',
                y: 0,
                drilldown: ''
              }]
            }, {
              name: 'To Go',
              dataLabels: {
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
                name: 'Target',
                y: 0,
                drilldown: ''
              }, {
                name: 'Pipeline',
                y: 0,
                drilldown: ''
              }, {
                name: 'Estimate',
                y: parseInt(res.result.result.achieved.toGo.value),
                drilldown: 'togOrder Estimate'
              }]
            }, {
              name: 'Actual',
              dataLabels: {
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
                name: 'Target',
                y: 0,
                drilldown: ''
              }, {
                name: 'Pipeline',
                y: 0,
                drilldown: ''
              }, {
                name: 'Estimate',
                y: parseInt(res.result.result.achieved.actual),
                drilldown: ''
              }]
            }],
            drilldown: {
              activeDataLabelStyle: {
                textDecoration: 'none'
              },
              activeAxisLabelStyle: {
                textDecoration: 'none'
              },
              series: [
                {
                  name: 'O-Pipepline',
                  type: 'pie',
                  id: 'togOrder Pipeline',
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
                  },
                  // {
                  //   name: 'F',
                  //   y: parseInt(res.result.result.achieved.open.F),
                  //   url: this.base_url+'records?bu='+bu+'&geo='+geo+'&start_date='+start_date+'&end_date='+end_date+'&currency='+currency+'&type=open&rank=F&timeframe='+timeframe
                  // }
                  ]
                }, {
                  name: 'Order Estimate',
                  type: 'pie',
                  id: 'togOrder Estimate',
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
                  data: [
                    {
                      name: 'A',
                      y: parseInt(res.result.result.achieved.toGo.A),
                      url: this.base_url+'records?bu='+bu+'&geo='+geo+'&start_date='+start_date+'&end_date='+end_date+'&currency='+currency+'&type=toGo&rank=A&timeframe='+timeframe
                    },
                    {
                      name: 'B',
                      y: parseInt(res.result.result.achieved.toGo.B),
                      url: this.base_url+'records?bu='+bu+'&geo='+geo+'&start_date='+start_date+'&end_date='+end_date+'&currency='+currency+'&type=toGo&rank=B&timeframe='+timeframe
                    },
                    {
                      name: 'C',
                      y: parseInt(res.result.result.achieved.toGo.C),
                      url: this.base_url+'records?bu='+bu+'&geo='+geo+'&start_date='+start_date+'&end_date='+end_date+'&currency='+currency+'&type=toGo&rank=C&timeframe='+timeframe
                    },
                    {
                      name: 'D',
                      y: parseInt(res.result.result.achieved.toGo.D),
                      url: this.base_url+'records?bu='+bu+'&geo='+geo+'&start_date='+start_date+'&end_date='+end_date+'&currency='+currency+'&type=toGo&rank=D&timeframe='+timeframe
                    },
                    {
                      name: 'E',
                      y: parseInt(res.result.result.achieved.toGo.E),
                      url: this.base_url+'records?bu='+bu+'&geo='+geo+'&start_date='+start_date+'&end_date='+end_date+'&currency='+currency+'&type=toGo&rank=E&timeframe='+timeframe
                    },
                    // {
                    //   name: 'F',
                    //   y: parseInt(res.result.result.achieved.toGo.F),
                    //   url: this.base_url+'records?bu='+bu+'&geo='+geo+'&start_date='+start_date+'&end_date='+end_date+'&currency='+currency+'&type=toGo&rank=F&timeframe='+timeframe
                    // }
                  ]
                },
                {
                  name: 'O-Pipepline',
                  type: 'pie',
                  id: 'Confirmed Pipeline',
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
                  data: [
                  {
                    name: 'Act',
                    y: parseInt(res.result.result.achieved.confirmed.Act),
                    url: this.base_url+'records?bu='+bu+'&geo='+geo+'&start_date='+start_date+'&end_date='+end_date+'&currency='+currency+'&type=open&rank=Act&timeframe='+timeframe
                  },
                  {
                    name: 'S',
                    y: parseInt(res.result.result.achieved.confirmed.S),
                    url: this.base_url+'records?bu='+bu+'&geo='+geo+'&start_date='+start_date+'&end_date='+end_date+'&currency='+currency+'&type=open&rank=S&timeframe='+timeframe
                  }
                  ]
                }
              ]
            }
          }
        }
      }
    );
  }

  createChartGaugeSales(bu, start_date, end_date, geo, currency, timeframe, fiscal_year){
    var data =  {
      "bu": bu,
      "start_date": start_date,
      "end_date": end_date,
      "geo": geo,
      "currency": currency,
      "fiscal_year": fiscal_year,
      "timeframe": timeframe
    }
    this.dataService.getSalesOverview(data).subscribe(
      res => {
        if(res.result.status == "true"){
          this.salesBreakdown = res.result.result.sales_overview;
          var per = parseFloat(res.result.result.percentage) 
          var actual = parseFloat(res.result.result.achieved.actual)/10000
          const chart_order = Highcharts.chart('chart-gauge-sales', {
            chart: {
              type: 'solidgauge',
            },
            title: {
              text: '<span style="font-size: 15px;">Target - '+ parseInt(res.result.result.totalTarget)+'<br>Actual - '+parseInt(res.result.result.achieved.value)+'</span>',
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
                      Highcharts.chart('chart-gauge-sales', order_graph_sales as any);
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
          var budget_value_sign = '-';
          var budget_per_sign = '-';
          var vs_bc_sign = '-';
          if(parseInt(res.result.result.achieved.vs_budget_value)<0){
            budget_value_sign = '+';
          }
          if(parseInt(res.result.result.achieved.vs_budget_per)<0){
            budget_per_sign = '+';
          }
          if(parseInt(res.result.result.achieved.vs_bc)<0){
            vs_bc_sign = '+';
          }
          var order_graph_sales = {
            chart: {
              type: 'column',
              events: {
                drilldown: function(e) {
                  var chart = this;
                  chart.setTitle({ text: "" });
                  if(this.ddDupes.length > 1){
                    e.preventDefault();
                  }
                },
                drillup: function(e) {
                  var chart = this;
                  if(e.seriesOptions.name == 'Open' || e.seriesOptions.name == 'To Go') {
                    chart.setTitle({ text: '<div style="text-align: right;"><span style="color:rgb(70, 121, 167); font-size:small;">Est vs Bud ('+budget_value_sign+')'+Math.abs(res.result.result.achieved.vs_budget_value)+' ['+budget_per_sign+''+Math.abs(res.result.result.achieved.vs_budget_per)+'%]<br>Est vs '+(parseInt(res.result.result.achieved.currentbc)-1)+'BC ('+vs_bc_sign+')'+Math.abs(res.result.result.achieved.vs_bc)+' ['+vs_bc_sign+''+Math.abs(res.result.result.achieved.vs_bc_per)+'%]'+'</span></div>' });
                  }else{
                    chart.setTitle({ text: "" });
                  }
                }
              }
            },
            title: {
                text: '<div style="text-align: right;"><span style="color:rgb(70, 121, 167); font-size:small;">Est vs Bud ('+budget_value_sign+')'+Math.abs(res.result.result.achieved.vs_budget_value)+' ['+budget_per_sign+''+Math.abs(res.result.result.achieved.vs_budget_per)+'%]<br>Est vs '+(parseInt(res.result.result.achieved.currentbc)-1)+'BC ('+vs_bc_sign+')'+Math.abs(res.result.result.achieved.vs_bc)+' ['+vs_bc_sign+''+Math.abs(res.result.result.achieved.vs_bc_per)+'%]'+'</span></div>' ,
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
                minorTickInterval: 0,
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
        
            series: [{
              name: 'Order',
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
                name: 'Target',
                y: parseInt(res.result.result.achieved.salesBudget),
                drilldown: ''
              }, {
                name: 'Pipeline',
                y: 0,
                drilldown: ''
              }, {
                name: 'Estimate',
                y: 0,
                drilldown: ''
              }]
            }, {
              name: 'Open',
              dataLabels: {
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
                name: 'Target',
                y: 0,
                drilldown: ''
              }, {
                name: 'Pipeline',
                y: parseInt(res.result.result.achieved.open.value),
                drilldown: 'togOrder Pipeline'
              }, {
                name: 'Estimate',
                y: 0,
                drilldown: '  '
              }]
            }, {
              name: 'Confirmed',
              dataLabels: {
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
                name: 'Target',
                y: 0,
                drilldown: ''
              }, {
                name: 'Pipeline',
                y: parseInt(res.result.result.achieved.confirmed.value),
                drilldown: 'Confirmed Pipeline'
              }, {
                name: 'Estimate',
                y: 0,
                drilldown: ''
              }]
            }, {
              name: 'To Go',
              dataLabels: {
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
                name: 'Target',
                y: 0,
                drilldown: ''
              }, {
                name: 'Pipeline',
                y: 0,
                drilldown: ''
              }, {
                name: 'Estimate',
                y: parseInt(res.result.result.achieved.toGo.value),
                // y: 25,
                drilldown: 'togOrder Estimate'
              }]
            }, {
              name: 'Actual',
              dataLabels: {
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
                name: 'Target',
                y: 0,
                drilldown: ''
              }, {
                name: 'Pipeline',
                y: 0,
                drilldown: ''
              }, {
                name: 'Estimate',
                y: parseInt(res.result.result.achieved.actual),
                drilldown: ''
              }]
            }],
            drilldown: {
              activeDataLabelStyle: {
                textDecoration: 'none'
              },
              activeAxisLabelStyle: {
                textDecoration: 'none'
              },
              series: [
                {
                  name: 'O-Pipepline',
                  type: 'pie',
                  id: 'togOrder Pipeline',
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
                  },
                  {
                    name: 'F',
                    y: parseInt(res.result.result.achieved.open.F),
                    url: this.base_url+'records?bu='+bu+'&geo='+geo+'&start_date='+start_date+'&end_date='+end_date+'&currency='+currency+'&type=open&rank=F&timeframe='+timeframe
                  }
                  ]
                }, {
                  name: 'Order Estimate',
                  type: 'pie',
                  id: 'togOrder Estimate',
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
                  data: [
                    {
                      name: 'A',
                      y: parseInt(res.result.result.achieved.toGo.A),
                      url: this.base_url+'records?bu='+bu+'&geo='+geo+'&start_date='+start_date+'&end_date='+end_date+'&currency='+currency+'&type=toGo&rank=A&timeframe='+timeframe
                    },
                    {
                      name: 'B',
                      y: parseInt(res.result.result.achieved.toGo.B),
                      url: this.base_url+'records?bu='+bu+'&geo='+geo+'&start_date='+start_date+'&end_date='+end_date+'&currency='+currency+'&type=toGo&rank=B&timeframe='+timeframe
                    },
                    {
                      name: 'C',
                      y: parseInt(res.result.result.achieved.toGo.C),
                      url: this.base_url+'records?bu='+bu+'&geo='+geo+'&start_date='+start_date+'&end_date='+end_date+'&currency='+currency+'&type=toGo&rank=C&timeframe='+timeframe
                    },
                    {
                      name: 'D',
                      y: parseInt(res.result.result.achieved.toGo.D),
                      url: this.base_url+'records?bu='+bu+'&geo='+geo+'&start_date='+start_date+'&end_date='+end_date+'&currency='+currency+'&type=toGo&rank=D&timeframe='+timeframe
                    },
                    {
                      name: 'E',
                      y: parseInt(res.result.result.achieved.toGo.E),
                      url: this.base_url+'records?bu='+bu+'&geo='+geo+'&start_date='+start_date+'&end_date='+end_date+'&currency='+currency+'&type=toGo&rank=E&timeframe='+timeframe
                    },
                    {
                      name: 'F',
                      y: parseInt(res.result.result.achieved.toGo.F),
                      url: this.base_url+'records?bu='+bu+'&geo='+geo+'&start_date='+start_date+'&end_date='+end_date+'&currency='+currency+'&type=toGo&rank=F&timeframe='+timeframe
                    }
                  ]
                },
                {
                  name: 'O-Pipepline',
                  type: 'pie',
                  id: 'Confirmed Pipeline',
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
                  data: [
                  {
                    name: 'Act',
                    y: parseInt(res.result.result.achieved.confirmed.Act),
                    url: this.base_url+'records?bu='+bu+'&geo='+geo+'&start_date='+start_date+'&end_date='+end_date+'&currency='+currency+'&type=open&rank=Act&timeframe='+timeframe
                  },
                  {
                    name: 'A',
                    y: parseInt(res.result.result.achieved.confirmed.A),
                    url: this.base_url+'records?bu='+bu+'&geo='+geo+'&start_date='+start_date+'&end_date='+end_date+'&currency='+currency+'&type=open&rank=S&timeframe='+timeframe
                  },
                  // {
                  //   name: 'B',
                  //   y: parseInt(res.result.result.achieved.confirmed.B),
                  //   url: this.base_url+'records?bu='+bu+'&geo='+geo+'&start_date='+start_date+'&end_date='+end_date+'&currency='+currency+'&type=open&rank=S&timeframe='+timeframe
                  // }
                  ]
                }
              ]
            }
          }

        }
      }
    );

  }

  getLostOpportunities(bu, start_date, end_date, geo, currency, timeframe, fiscal_year): void {
    var data =  {
      "bu": bu,
      "start_date": start_date,
      "end_date": end_date,
      "geo": geo,
      "currency": currency,
      "fiscal_year": fiscal_year,
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

  getOrderTrend(bu, start_date, end_date, geo, currency, timeframe, fiscal_year): void {
    var data =  {
      "bu": bu,
      "start_date": start_date,
      "end_date": end_date,
      "geo": geo,
      "currency": currency,
      "fiscal_year": fiscal_year,
      "timeframe": timeframe
    }

      this.dataService.getOrderTrend(data).subscribe(
        res => {
          var month_data = res.result.Month_data;
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
                categories: [month_data.month_1.month, month_data.month_2.month, month_data.month_3.month, month_data.month_4.month, month_data.month_5.month, month_data.month_6.month]
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
                  name: month_data.month_1.month,
                  y: parseInt(month_data.month_1.E),
                  url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month=October'
                },{
                  name: month_data.month_2.month,
                  y: parseInt(month_data.month_2.E),
                  url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month=October'
                },{
                  name: month_data.month_3.month,
                  y: parseInt(month_data.month_3.E),
                  url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month=October'
                },{
                  name: month_data.month_4.month,
                  y: parseInt(month_data.month_4.E),
                  url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month=October'
                },{
                  name: month_data.month_5.month,
                  y: parseInt(month_data.month_5.E),
                  url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month=October'
                },{
                  name: month_data.month_6.month,
                  y: parseInt(month_data.month_6.E),
                  url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month=October'
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
                    name: month_data.month_1.month,
                    y: parseInt(month_data.month_1.D),
                    url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month=October'
                  },{
                    name: month_data.month_2.month,
                    y: parseInt(month_data.month_2.D),
                    url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month=October'
                  },{
                    name: month_data.month_3.month,
                    y: parseInt(month_data.month_3.D),
                    url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month=October'
                  },{
                    name: month_data.month_4.month,
                    y: parseInt(month_data.month_4.D),
                    url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month=October'
                  },{
                    name: month_data.month_5.month,
                    y: parseInt(month_data.month_5.D),
                    url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month=October'
                  },{
                    name: month_data.month_6.month,
                    y: parseInt(month_data.month_6.D),
                    url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month=October'
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
                  name: month_data.month_1.month,
                  y: parseInt(month_data.month_1.C),
                  url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month=October'
                },{
                  name: month_data.month_2.month,
                  y: parseInt(month_data.month_2.C),
                  url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month=October'
                },{
                  name: month_data.month_3.month,
                  y: parseInt(month_data.month_3.C),
                  url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month=October'
                },{
                  name: month_data.month_4.month,
                  y: parseInt(month_data.month_4.C),
                  url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month=October'
                },{
                  name: month_data.month_5.month,
                  y: parseInt(month_data.month_5.C),
                  url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month=October'
                },{
                  name: month_data.month_6.month,
                  y: parseInt(month_data.month_6.C),
                  url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month=October'
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
                name: month_data.month_1.month,
                y: parseInt(month_data.month_1.B),
                url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month=October'
              },{
                name: month_data.month_2.month,
                y: parseInt(month_data.month_2.B),
                url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month=October'
              },{
                name: month_data.month_3.month,
                y: parseInt(month_data.month_3.B),
                url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month=October'
              },{
                name: month_data.month_4.month,
                y: parseInt(month_data.month_4.B),
                url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month=October'
              },{
                name: month_data.month_5.month,
                y: parseInt(month_data.month_5.B),
                url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month=October'
              },{
                name: month_data.month_6.month,
                y: parseInt(month_data.month_6.B),
                url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month=October'
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
              name: month_data.month_1.month,
              y: parseInt(month_data.month_1.A),
              url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month=October'
            },{
              name: month_data.month_2.month,
              y: parseInt(month_data.month_2.A),
              url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month=October'
            },{
              name: month_data.month_3.month,
              y: parseInt(month_data.month_3.A),
              url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month=October'
            },{
              name: month_data.month_4.month,
              y: parseInt(month_data.month_4.A),
              url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month=October'
            },{
              name: month_data.month_5.month,
              y: parseInt(month_data.month_5.A),
              url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month=October'
            },{
              name: month_data.month_6.month,
              y: parseInt(month_data.month_6.A),
              url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month=October'
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
            name: month_data.month_1.month,
            y: parseInt(month_data.month_1.S),
            url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month=October'
          },{
            name: month_data.month_2.month,
            y: parseInt(month_data.month_2.S),
            url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month=October'
          },{
            name: month_data.month_3.month,
            y: parseInt(month_data.month_3.S),
            url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month=October'
          },{
            name: month_data.month_4.month,
            y: parseInt(month_data.month_4.S),
            url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month=October'
          },{
            name: month_data.month_5.month,
            y: parseInt(month_data.month_5.S),
            url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month=October'
          },{
            name: month_data.month_6.month,
            y: parseInt(month_data.month_6.S),
            url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month=October'
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
          name: month_data.month_1.month,
          y: parseInt(month_data.month_1.Act),
          url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month=October'
        },{
          name: month_data.month_2.month,
          y: parseInt(month_data.month_2.Act),
          url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month=October'
        },{
          name: month_data.month_3.month,
          y: parseInt(month_data.month_3.Act),
          url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month=October'
        },{
          name: month_data.month_4.month,
          y: parseInt(month_data.month_4.Act),
          url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month=October'
        },{
          name: month_data.month_5.month,
          y: parseInt(month_data.month_5.Act),
          url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month=October'
        },{
          name: month_data.month_6.month,
          y: parseInt(month_data.month_6.Act),
          url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month=October'
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
