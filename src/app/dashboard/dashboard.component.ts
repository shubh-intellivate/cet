import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsSolidGauge from 'highcharts/modules/solid-gauge';
import Drilldown from 'highcharts/modules/drilldown';
import { DataService } from '../services/data.service';
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
  @ViewChild("toggleTrend") toggleTrend: ElementRef;
  @ViewChild("toggleLost") toggleLost: ElementRef;
  @ViewChild("toggleSeg") toggleSeg: ElementRef;  
  @ViewChild("currency") currency: ElementRef;
  @ViewChild("toggleOrder") toggleOrder: ElementRef;
  customDateFilter: any="none";
  infoModal: any="none";
  pipelineModal: any="none";
  leadsModal: any="none";
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
  base_url: any = "http://88.218.92.164/cet";
  // base_url: any = "http://localhost:4200/";
  // base_url: any = "http://45.66.159.11/cet/";
  sayDoOrderValue: any;
  top_key_accounts: any;
  sayDoSalesValue: any;
  actual_timeframe:any = '';
  classify_rank_show: boolean = false;
  classify_class_show: boolean = true;
  geo_rank_show: boolean = false;
  geo_class_show: boolean = true;
  subProjectClassify: any;
  buFilterLink: any = "";
  newCustomers: any;
  segment_rank_show: boolean = false;
  segment_class_show: boolean = true;
  typeofcust_rank_show: boolean = false;
  typeofcust_class_show: boolean = true;
  normalizedavg: any;
  highestValue: any;
  chart_sales: Highcharts.Chart;
  maxOrderSizeValue: any;
  minOrderSizeValue: any;
  top_key_projects_open: any;
  hide_project_actuals: boolean = false;
  hide_project_open: boolean = true;
  hide_project_open_bc: boolean = true;
  salesBreakdown: any;
  fRankModal: any="none";
  filterBu: any = '';
  filterStart_date: string = '';
  filterEnd_date: string = '';
  filterGeo: any = '';
  filterCurrency: any = '';
  filterTimeframe: any = '';
  fRankOpen: any;
  fRankTogo: any;
  bu_names: any;
  bu_group_names: any;
  bu_names_branch: any;
  geoFilter: any = "India";
  selectedBuValue: any = "All BU";
  filterFiscal_year: any = '2022';
  hideOrderTrendAmt: boolean = false;
  hideOrderTrendOpp: boolean = true;
  top_key_projects_open_bc: any;
  hideLostAmt: boolean = false;
  hideLostOpp: boolean = true;
  chart_lost_opp_number: Highcharts.Chart;
  salesRunRate: any;
  salesEstimatedRunRate: any;
  salesRequiredRunRate: any;
  group_names: string;
  user_groups: Array<String> = [];
  access_bu_du: string;
  typeOfCustomer: any;
  rankAging: any;

  constructor(
    private dataService : DataService
  ){ }
  

  ngOnInit() {
    this.group_names = localStorage.getItem('groups');
    this.access_bu_du = localStorage.getItem('access_bu_du');
    var groupArr = this.group_names.split(' , ');
    groupArr.forEach(element => {
      var temp = element.split(' - ');
      if(temp.length > 1 && temp[0] == 'CET'){
        this.user_groups.push(temp[1])
      }
    });
    if(this.access_bu_du == 'All'){
      this.filterBu = '';
      this.selectedBuValue = 'All BU';
      this.buFilter = "All BU";
    }else{
      this.filterBu = this.access_bu_du;
      this.selectedBuValue = this.access_bu_du;
      this.buFilter = this.access_bu_du;
    }
    this.getBuNames();
    this.getBuByBranch();
    this.getBuNamesGrouping();
    this.createChartGaugeOrder('','','','','','','2022');
    this.createChartGaugeSales('','','','','','','2022');
    this.createOrderOppGraph('','','','','','','2022');
    this.createOrderAmtGraph('','','','','','','2022');
    this.getOrdersBookedLastMonth('','','2022');
    this.getBidWinRate('','','','','','','2022');
    this.getAvgOrderCycle('','','','','','','2022');
    this.getAvgOrderSize('','','','','','','2022');
    this.getOrderRunRate('','','','','','','2022');
    this.getEstimatedRunRate('','','','','','','2022');
    this.getRequiredRunRate('','','','','','','2022');
    this.getSalesRunRate('','','','','','','2022');
    this.getSalesEstimatedRunRate('','','','','','','2022');
    this.getSalesRequiredRunRate('','','','','','','2022');
    this.getTopKeyProjects('','','','','','','2022');
    this.getTopKeyAccounts('','','','','','','2022');
    this.getSayDoOrder('','','','','','','2022');
    this.getSayDoSales('','','','','','','2022');
    this.getNewCustomersAcquired('','','','','','','2022');
    this.getLostOpportunities('','','','','','','2022');
    this.getOrderTrend('','','','','','','2022');
  }

  ngAfterViewInit(){
    this.chart_sales.redraw();
    this.chart_sales.reflow();
  }

  showTab(evt, cityName, title) {
    // this.sgaCategoryTitle = title;
    const tabs = Array.from(
      document.getElementsByClassName('tabs') as HTMLCollectionOf<HTMLElement>,
    );
    const tablinks = Array.from(
      document.getElementsByClassName("tablink") as HTMLCollectionOf<HTMLElement>,
    );
    tabs.forEach(tab => {
      tab.style.display = 'none';
    });
    tablinks.forEach(tablink => {
      tablink.className = tablink.className.replace(" w3-grey", "");
    });
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " w3-grey";
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
      this.hide_project_open_bc = true;
    }else if(this.toggleProj.nativeElement.value == 'open'){
      this.hide_project_actuals = true;
      this.hide_project_open = false;
      this.hide_project_open_bc = true;
    }else{
      this.hide_project_actuals = true;
      this.hide_project_open = true;
      this.hide_project_open_bc = false;
    }
  }

  toggleOrderTrend(){
    if(this.toggleTrend.nativeElement.value == 'amount'){
      this.hideOrderTrendAmt = false;
      this.hideOrderTrendOpp = true;
    }else{
      this.hideOrderTrendAmt = true;
      this.hideOrderTrendOpp = false;
    }
  }

  toggleLostOpp(){
    if(this.toggleLost.nativeElement.value == 'amount'){
      this.hideLostAmt = false;
      this.hideLostOpp = true;
    }else{
      this.hideLostAmt = true;
      this.hideLostOpp = false;
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
        },
        cursor: 'pointer',
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
          cursor: 'pointer',
          data: [{
            name: 'Open',
            y: parseInt(this.fRankOpen),
            url: this.base_url+'records?bu='+this.filterBu+'&geo='+this.filterGeo+'&type=open&rank=F&timeframe='+this.filterTimeframe+'&fiscal_year='+this.filterFiscal_year+'&api_type=order_overview'
          },
          // {
          //   name: 'To Go',
          //   y: parseInt(this.fRankTogo),
          //   url: this.base_url+'records?bu='+this.filterBu+'&geo='+this.filterGeo+'&type=toGo&rank=F&timeframe='+this.filterTimeframe+'&fiscal_year='+this.filterFiscal_year+'&api_type=order_overview'
          // }
        ]
        }
      ]
    }
    Highcharts.chart('f-rank', f_rank as any);
  }

  closeFRankModal(){
    this.blur = "";
    this.fRankModal = "none";

  }

  openLeadsModal(){
    this.blur = "blur";
    this.leadsModal = "block";
    var data =  {
      "bu": this.filterBu,
      "start_date": this.filterStart_date,
      "end_date": this.filterEnd_date,
      "geo": this.filterGeo,
      "currency": this.filterCurrency,
      "fiscal_year": this.filterFiscal_year,
      "timeframe": this.filterTimeframe
    }
    this.dataService.getLeadsOverview(data).subscribe(
      res => {
        console.log(res)
        var amount_arr = [
          ['BU', parseInt(res.result.result.bu_count)],
          ['Marketing', parseInt(res.result.result.mark_count)],
          ['New-BU', parseInt(res.result.result.bu_status.New)],
          ['Discussing-BU', parseInt(res.result.result.bu_status.Discussing)],
          ['Qualified-BU', parseInt(res.result.result.bu_status.Qualified)],
          ['Interested-BU', parseInt(res.result.result.bu_status.Interested)],
          ['Unqualified-BU', parseInt(res.result.result.bu_status.Unqualified)],
          ['Nurturing-BU', parseInt(res.result.result.bu_status.Nurturing)],
          ['Contacted-BU', parseInt(res.result.result.bu_status.Contacted)],
          ['NA MQL-BU', parseInt(res.result.result.bu_status["NA MQL"])],
          ['New-Marketing', parseInt(res.result.result.mark_status.New)],
          ['Discussing-Marketing', parseInt(res.result.result.mark_status.Discussing)],
          ['Qualified-Marketing', parseInt(res.result.result.mark_status.Qualified)],
          ['Interested-Marketing', parseInt(res.result.result.mark_status.Interested)],
          ['Unqualified-Marketing', parseInt(res.result.result.mark_status.Unqualified)],
          ['Nurturing-Marketing', parseInt(res.result.result.mark_status.Nurturing)],
          ['Contacted-Marketing', parseInt(res.result.result.mark_status.Contacted)],
          ['NA MQL-Marketing', parseInt(res.result.result.mark_status["NA MQL"])],
        ];
        this.chart_sales = Highcharts.chart('leads-analysis', {
          chart: {
              type: 'pie'
          },
          colors: ['rgb(70,121,167)', 'rgb(162,197,238)', 'rgb(85,121,190)', 'rgb(81,200,244)', 'rgb(127,127,127)', 'rgb(122,148,228)', 'rgb(132,174,220)', 'rgb(143,163,213)'],
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
                return `${point.key} <br> <b>${point.series.name}: ${point.point.y}%</b> <br>Count: ${amount}`
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
                      name: 'BU',
                      y: parseInt(res.result.result.bu_per),
                      drilldown: 'bu'
                    },{
                      name: 'Marketing',
                      y: parseInt(res.result.result.mark_per),
                      drilldown: 'marketing'
                    },
                  ]
              }
          ],
          drilldown: {
            series: [
                {
                  name: 'BU',
                  id: 'bu',
                  showInLegend: true,
                  cursor: 'pointer',
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
                      name: 'New-BU',
                      y: parseInt(res.result.result.bu_status.New_per),
                      url: this.base_url+'records?bu='+this.filterBu+'&geo='+this.filterGeo+'&timeframe='+this.filterTimeframe+'&fiscal_year='+this.filterFiscal_year+'&api_type=leads_overview&lead_generated_by=BU&lead_status=New'
                    },
                    {
                      name: 'Discussing-BU',
                      y: parseInt(res.result.result.bu_status.Discussing_per),
                      url: this.base_url+'records?bu='+this.filterBu+'&geo='+this.filterGeo+'&timeframe='+this.filterTimeframe+'&fiscal_year='+this.filterFiscal_year+'&api_type=leads_overview&lead_generated_by=BU&lead_status=Discussing'
                    },
                    {
                      name: 'Qualified-BU',
                      y: parseInt(res.result.result.bu_status.Qualified_per),
                      url: this.base_url+'records?bu='+this.filterBu+'&geo='+this.filterGeo+'&timeframe='+this.filterTimeframe+'&fiscal_year='+this.filterFiscal_year+'&api_type=leads_overview&lead_generated_by=BU&lead_status=Qualified'
                    },
                    {
                      name: 'Interested-BU',
                      y: parseInt(res.result.result.bu_status.Interested_per),
                      url: this.base_url+'records?bu='+this.filterBu+'&geo='+this.filterGeo+'&timeframe='+this.filterTimeframe+'&fiscal_year='+this.filterFiscal_year+'&api_type=leads_overview&lead_generated_by=BU&lead_status=Interested'
                    },
                    {
                      name: 'Unqualified-BU',
                      y: parseInt(res.result.result.bu_status.Unqualified_per),
                      url: this.base_url+'records?bu='+this.filterBu+'&geo='+this.filterGeo+'&timeframe='+this.filterTimeframe+'&fiscal_year='+this.filterFiscal_year+'&api_type=leads_overview&lead_generated_by=BU&lead_status=Unqualified'
                    },
                    {
                      name: 'Nurturing-BU',
                      y: parseInt(res.result.result.bu_status.Nurturing_per),
                      url: this.base_url+'records?bu='+this.filterBu+'&geo='+this.filterGeo+'&timeframe='+this.filterTimeframe+'&fiscal_year='+this.filterFiscal_year+'&api_type=leads_overview&lead_generated_by=BU&lead_status=Nurturing'
                    },
                    {
                      name: 'Contacted-BU',
                      y: parseInt(res.result.result.bu_status.Contacted_per),
                      url: this.base_url+'records?bu='+this.filterBu+'&geo='+this.filterGeo+'&timeframe='+this.filterTimeframe+'&fiscal_year='+this.filterFiscal_year+'&api_type=leads_overview&lead_generated_by=BU&lead_status=Contacted'
                    },
                    {
                      name: 'NA MQL-BU',
                      y: parseInt(res.result.result.bu_status["NAMQL_per"]),
                      url: this.base_url+'records?bu='+this.filterBu+'&geo='+this.filterGeo+'&timeframe='+this.filterTimeframe+'&fiscal_year='+this.filterFiscal_year+'&api_type=leads_overview&lead_generated_by=BU&lead_status=NA MQL'
                    },
                  ]
                },
                {
                  name: 'Marketing',
                  id: 'marketing',
                  showInLegend: true,
                  cursor: 'pointer',
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
                      name: 'New-Marketing',
                      y: parseInt(res.result.result.mark_status.New_per),
                      url: this.base_url+'records?bu='+this.filterBu+'&geo='+this.filterGeo+'&timeframe='+this.filterTimeframe+'&fiscal_year='+this.filterFiscal_year+'&api_type=leads_overview&lead_generated_by=Marketing&lead_status=New'
                    },
                    {
                      name: 'Discussing-Marketing',
                      y: parseInt(res.result.result.mark_status.Discussing_per),
                      url: this.base_url+'records?bu='+this.filterBu+'&geo='+this.filterGeo+'&timeframe='+this.filterTimeframe+'&fiscal_year='+this.filterFiscal_year+'&api_type=leads_overview&lead_generated_by=Marketing&lead_status=Discussing'
                    },
                    {
                      name: 'Qualified-Marketing',
                      y: parseInt(res.result.result.mark_status.Qualified_per),
                      url: this.base_url+'records?bu='+this.filterBu+'&geo='+this.filterGeo+'&timeframe='+this.filterTimeframe+'&fiscal_year='+this.filterFiscal_year+'&api_type=leads_overview&lead_generated_by=Marketing&lead_status=Qualified'
                    },
                    {
                      name: 'Interested-Marketing',
                      y: parseInt(res.result.result.mark_status.Interested_per),
                      url: this.base_url+'records?bu='+this.filterBu+'&geo='+this.filterGeo+'&timeframe='+this.filterTimeframe+'&fiscal_year='+this.filterFiscal_year+'&api_type=leads_overview&lead_generated_by=Marketing&lead_status=Interested'
                    },
                    {
                      name: 'Unqualified-Marketing',
                      y: parseInt(res.result.result.mark_status.Unqualified_per),
                      url: this.base_url+'records?bu='+this.filterBu+'&geo='+this.filterGeo+'&timeframe='+this.filterTimeframe+'&fiscal_year='+this.filterFiscal_year+'&api_type=leads_overview&lead_generated_by=Marketing&lead_status=Unqualified'
                    },
                    {
                      name: 'Nurturing-Marketing',
                      y: parseInt(res.result.result.mark_status.Nurturing_per),
                      url: this.base_url+'records?bu='+this.filterBu+'&geo='+this.filterGeo+'&timeframe='+this.filterTimeframe+'&fiscal_year='+this.filterFiscal_year+'&api_type=leads_overview&lead_generated_by=Marketing&lead_status=Nurturing'
                    },
                    {
                      name: 'Contacted-Marketing',
                      y: parseInt(res.result.result.mark_status.Contacted_per),
                      url: this.base_url+'records?bu='+this.filterBu+'&geo='+this.filterGeo+'&timeframe='+this.filterTimeframe+'&fiscal_year='+this.filterFiscal_year+'&api_type=leads_overview&lead_generated_by=Marketing&lead_status=Contacted'
                    },
                    {
                      name: 'NA MQL-Marketing',
                      y: parseInt(res.result.result.mark_status["NAMQL_per"]),
                      url: this.base_url+'records?bu='+this.filterBu+'&geo='+this.filterGeo+'&timeframe='+this.filterTimeframe+'&fiscal_year='+this.filterFiscal_year+'&api_type=leads_overview&lead_generated_by=Marketing&lead_status=NA MQL'
                    },
                  ]
                },
            ]
          }  
        } as any);
      }
    );
  }

  openPipelineModal(){
    this.blur = "blur";
    this.pipelineModal = "block";
    this.geo_rank_show = false;
    this.geo_class_show = true;
    this.segment_rank_show = false;
    this.segment_class_show = true;
    this.typeofcust_rank_show = false;
    this.typeofcust_class_show = true;
    this.toggleSeg.nativeElement.value = 'rank';
    this.toggleG.nativeElement.value = 'rank'
    var bu = this.filterBu;
    var geo = this.filterGeo;
    var currency = this.filterCurrency;
    var fiscal_year = this.filterFiscal_year;
    var timeframe = this.filterTimeframe;
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
              cursor: 'pointer',
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
      colors: ['rgb(162,197,238)', 'rgb(119,135,186)', 'rgb(117,150,208)', 'rgb(57,93,157)', 'rgb(122,148,228)', 'rgb(132,174,220)', 'rgb(127,127,127)'],
      tooltip: {
          headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
          pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y} Mn</b>'
      },
  
      series: [
        // {
        //   name: 'F',
        //   dataLabels: {
        //     enabled: true,
        //     formatter:function() {
        //       if(this.y != 0) {
        //         return '<span style="font-weight:normal;color:white;fill:white;">'+this.series.name+': '+this.y+ '</span>';
        //       }
        //     },
        //     style: {
        //       color: 'white',
        //       textOutline: 'transparent'
        //     }
        //   },
        //   point: {
        //     events: {
        //         click: function () {
        //             // location.href = this.options.url;
        //             window.open(this.options.url);
        //         }
        //     }
        //   },
        //   data: [{
        //     name: 'EE',
        //     y: parseInt(this.pipelineClassify.EE.F),
        //     url:  this.base_url+'records?bu='+bu+'&rank=F&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&classify=ee&type=classify&api_type=order_overview'
        //   }, {
        //     name: 'EN',
        //     y: parseInt(this.pipelineClassify.EN.F),
        //     url:  this.base_url+'records?bu='+bu+'&rank=F&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&classify=en&type=classify&api_type=order_overview'
        //   }, {
        //     name: 'NN',
        //     y: parseInt(this.pipelineClassify.NN.F),
        //     url:  this.base_url+'records?bu='+bu+'&rank=F&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&classify=nn&type=classify&api_type=order_overview'
        //   }]
        // },
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
          point: {
            events: {
                click: function () {
                    // location.href = this.options.url;
                    window.open(this.options.url);
                }
            }
          },
          data: [{
            name: 'EE',
            y: parseInt(this.pipelineClassify.EE.E),
            url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&classify=ee&type=classify&api_type=order_overview'
          }, {
            name: 'EN',
            y: parseInt(this.pipelineClassify.EN.E),
            url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&classify=en&type=classify&api_type=order_overview'
          }, {
            name: 'NN',
            y: parseInt(this.pipelineClassify.NN.E),
            url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&classify=nn&type=classify&api_type=order_overview'
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
          point: {
            events: {
                click: function () {
                    // location.href = this.options.url;
                    window.open(this.options.url);
                }
            }
          },
          data: [{
            name: 'EE',
            y: parseInt(this.pipelineClassify.EE.D),
            url:  this.base_url+'records?bu='+bu+'&rank=D&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&classify=ee&type=classify&api_type=order_overview'
          }, {
            name: 'EN',
            y: parseInt(this.pipelineClassify.EN.D),
            url:  this.base_url+'records?bu='+bu+'&rank=D&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&classify=en&type=classify&api_type=order_overview'
          }, {
            name: 'NN',
            y: parseInt(this.pipelineClassify.NN.D),
            url:  this.base_url+'records?bu='+bu+'&rank=D&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&classify=nn&type=classify&api_type=order_overview'
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
          point: {
            events: {
                click: function () {
                    // location.href = this.options.url;
                    window.open(this.options.url);
                }
            }
          },
          data: [{
            name: 'EE',
            y: parseInt(this.pipelineClassify.EE.C),
            url:  this.base_url+'records?bu='+bu+'&rank=C&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&classify=ee&type=classify&api_type=order_overview'
          }, {
            name: 'EN',
            y: parseInt(this.pipelineClassify.EN.C),
            url:  this.base_url+'records?bu='+bu+'&rank=C&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&classify=en&type=classify&api_type=order_overview'
          }, {
            name: 'NN',
            y: parseInt(this.pipelineClassify.NN.C),
            url:  this.base_url+'records?bu='+bu+'&rank=C&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&classify=nn&type=classify&api_type=order_overview'
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
          point: {
            events: {
                click: function () {
                    // location.href = this.options.url;
                    window.open(this.options.url);
                }
            }
          },
          data: [{
            name: 'EE',
            y: parseInt(this.pipelineClassify.EE.B),
            url:  this.base_url+'records?bu='+bu+'&rank=B&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&classify=ee&type=classify&api_type=order_overview'
          }, {
            name: 'EN',
            y: parseInt(this.pipelineClassify.EN.B),
            url:  this.base_url+'records?bu='+bu+'&rank=B&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&classify=en&type=classify&api_type=order_overview'
          }, {
            name: 'NN',
            y: parseInt(this.pipelineClassify.NN.B),
            url:  this.base_url+'records?bu='+bu+'&rank=B&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&classify=nn&type=classify&api_type=order_overview'
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
          point: {
            events: {
                click: function () {
                    // location.href = this.options.url;
                    window.open(this.options.url);
                }
            }
          },
          data: [{
            name: 'EE',
            y: parseInt(this.pipelineClassify.EE.A),
            url:  this.base_url+'records?bu='+bu+'&rank=A&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&classify=ee&type=classify&api_type=order_overview'
          }, {
            name: 'EN',
            y: parseInt(this.pipelineClassify.EN.A),
            url:  this.base_url+'records?bu='+bu+'&rank=A&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&classify=en&type=classify&api_type=order_overview'
          }, {
            name: 'NN',
            y: parseInt(this.pipelineClassify.NN.A),
            url:  this.base_url+'records?bu='+bu+'&rank=A&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&classify=nn&type=classify&api_type=order_overview'
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
          point: {
            events: {
                click: function () {
                    // location.href = this.options.url;
                    window.open(this.options.url);
                }
            }
          },
          data: [{
            name: 'EE',
            y: parseInt(this.pipelineClassify.EE.S),
            url:  this.base_url+'records?bu='+bu+'&rank=S&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&classify=ee&type=classify&api_type=order_overview'
          }, {
            name: 'EN',
            y: parseInt(this.pipelineClassify.EN.S),
            url:  this.base_url+'records?bu='+bu+'&rank=S&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&classify=en&type=classify&api_type=order_overview'
          }, {
            name: 'NN',
            y: parseInt(this.pipelineClassify.NN.S),
            url:  this.base_url+'records?bu='+bu+'&rank=S&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&classify=nn&type=classify&api_type=order_overview'
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
          point: {
            events: {
                click: function () {
                    // location.href = this.options.url;
                    window.open(this.options.url);
                }
            }
          },
          data: [{
            name: 'EE',
            y: parseInt(this.pipelineClassify.EE.Act),
            url:  this.base_url+'records?bu='+bu+'&rank=Act&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&classify=ee&type=classify&api_type=order_overview'
          }, {
            name: 'EN',
            y: parseInt(this.pipelineClassify.EN.Act),
            url:  this.base_url+'records?bu='+bu+'&rank=Act&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&classify=en&type=classify&api_type=order_overview'
          }, {
            name: 'NN',
            y: parseInt(this.pipelineClassify.NN.Act),
            url:  this.base_url+'records?bu='+bu+'&rank=Act&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&classify=nn&type=classify&api_type=order_overview'
          }]
        }
      ]
    }
    Highcharts.chart('classify-pipeline-rank', classify_pipeline as any);
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
              cursor: 'pointer',
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
      colors: ['rgb(162,197,238)', 'rgb(119,135,186)', 'rgb(117,150,208)', 'rgb(57,93,157)', 'rgb(122,148,228)', 'rgb(132,174,220)', 'rgb(127,127,127)'],
      tooltip: {
          headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
          pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y} Mn</b>'
      },
  
      series: [
      //   {
      //   name: 'F',
      //   dataLabels: {
      //     enabled: true,
      //     formatter:function() {
      //       if(this.y != 0) {
      //         return '<span style="font-weight:normal;color:white;fill:white;">'+this.series.name+': '+this.y+ '</span>';
      //       }
      //     },
      //     style: {
      //       color: 'white',
      //       textOutline: 'transparent'
      //     }
      //   },
      //   point: {
      //     events: {
      //         click: function () {
      //             // location.href = this.options.url;
      //             window.open(this.options.url);
      //         }
      //     }
      //   },
      //   data: [{
      //     name: 'India',
      //     y: parseInt(this.geoClassify.india.F),
      //     url:  this.base_url+'records?bu='+bu+'&rank=F&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&country=india&type=geo&api_type=order_overview'
      //   }, {
      //     name: 'Japan',
      //     y: parseInt(this.geoClassify.japan.F),
      //     url:  this.base_url+'records?bu='+bu+'&rank=F&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&country=japan&type=geo&api_type=order_overview'
      //   }, {
      //     name: 'USA',
      //     y: parseInt(this.geoClassify.usa.F),
      //     url:  this.base_url+'records?bu='+bu+'&rank=F&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&country=usa&type=geo&api_type=order_overview'
      //   }, {
      //     name: 'APAC',
      //     y: parseInt(this.geoClassify.apac.F),
      //     url:  this.base_url+'records?bu='+bu+'&rank=F&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&country=apac&type=geo&api_type=order_overview'
      //   },{
      //     name: 'EMEA',
      //     y: parseInt(this.geoClassify.emea.F),
      //     url:  this.base_url+'records?bu='+bu+'&rank=F&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&country=emea&type=geo&api_type=order_overview'
      //   },
      // ]
      // },
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
          point: {
            events: {
                click: function () {
                    // location.href = this.options.url;
                    window.open(this.options.url);
                }
            }
          },
          data: [{
            name: 'India',
            y: parseInt(this.geoClassify.india.E),
            url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&country=india&type=geo&api_type=order_overview'
          }, {
            name: 'Japan',
            y: parseInt(this.geoClassify.japan.E),
            url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&country=japan&type=geo&api_type=order_overview'
          }, {
            name: 'USA',
            y: parseInt(this.geoClassify.usa.E),
            url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&country=usa&type=geo&api_type=order_overview'
          }, {
            name: 'APAC',
            y: parseInt(this.geoClassify.apac.E),
            url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&country=apac&type=geo&api_type=order_overview'
          },{
            name: 'EMEA',
            y: parseInt(this.geoClassify.emea.E),
            url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&country=emea&type=geo&api_type=order_overview'
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
          point: {
            events: {
                click: function () {
                    // location.href = this.options.url;
                    window.open(this.options.url);
                }
            }
          },
          data: [{
            name: 'India',
            y: parseInt(this.geoClassify.india.D),
            url:  this.base_url+'records?bu='+bu+'&rank=D&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&country=india&type=geo&api_type=order_overview'
          }, {
            name: 'Japan',
            y: parseInt(this.geoClassify.japan.D),
            url:  this.base_url+'records?bu='+bu+'&rank=D&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&country=japan&type=geo&api_type=order_overview'
          }, {
            name: 'USA',
            y: parseInt(this.geoClassify.usa.D),
            url:  this.base_url+'records?bu='+bu+'&rank=D&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&country=usa&type=geo&api_type=order_overview'
          }, {
            name: 'APAC',
            y: parseInt(this.geoClassify.apac.D),
            url:  this.base_url+'records?bu='+bu+'&rank=D&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&country=apac&type=geo&api_type=order_overview'
          },{
            name: 'EMEA',
            y: parseInt(this.geoClassify.emea.D),
            url:  this.base_url+'records?bu='+bu+'&rank=D&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&country=emea&type=geo&api_type=order_overview'
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
          point: {
            events: {
                click: function () {
                    // location.href = this.options.url;
                    window.open(this.options.url);
                }
            }
          },
          data: [{
            name: 'India',
            y: parseInt(this.geoClassify.india.C),
            url:  this.base_url+'records?bu='+bu+'&rank=C&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&country=india&type=geo&api_type=order_overview'
          }, {
            name: 'Japan',
            y: parseInt(this.geoClassify.japan.C),
            url:  this.base_url+'records?bu='+bu+'&rank=C&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&country=japan&type=geo&api_type=order_overview'
          }, {
            name: 'USA',
            y: parseInt(this.geoClassify.usa.C),
            url:  this.base_url+'records?bu='+bu+'&rank=C&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&country=usa&type=geo&api_type=order_overview'
          }, {
            name: 'APAC',
            y: parseInt(this.geoClassify.apac.C),
            url:  this.base_url+'records?bu='+bu+'&rank=C&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&country=apac&type=geo&api_type=order_overview'
          },{
            name: 'EMEA',
            y: parseInt(this.geoClassify.emea.C),
            url:  this.base_url+'records?bu='+bu+'&rank=C&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&country=emea&type=geo&api_type=order_overview'
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
          point: {
            events: {
                click: function () {
                    // location.href = this.options.url;
                    window.open(this.options.url);
                }
            }
          },
          data: [{
            name: 'India',
            y: parseInt(this.geoClassify.india.B),
            url:  this.base_url+'records?bu='+bu+'&rank=B&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&country=india&type=geo&api_type=order_overview'
          }, {
            name: 'Japan',
            y: parseInt(this.geoClassify.japan.B),
            url:  this.base_url+'records?bu='+bu+'&rank=B&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&country=japan&type=geo&api_type=order_overview'
          }, {
            name: 'USA',
            y: parseInt(this.geoClassify.usa.B),
            url:  this.base_url+'records?bu='+bu+'&rank=B&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&country=usa&type=geo&api_type=order_overview'
          }, {
            name: 'APAC',
            y: parseInt(this.geoClassify.apac.B),
            url:  this.base_url+'records?bu='+bu+'&rank=B&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&country=apac&type=geo&api_type=order_overview'
          },{
            name: 'EMEA',
            y: parseInt(this.geoClassify.emea.B),
            url:  this.base_url+'records?bu='+bu+'&rank=B&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&country=emea&type=geo&api_type=order_overview'
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
          point: {
            events: {
                click: function () {
                    // location.href = this.options.url;
                    window.open(this.options.url);
                }
            }
          },
          data: [{
            name: 'India',
            y: parseInt(this.geoClassify.india.A),
            url:  this.base_url+'records?bu='+bu+'&rank=A&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&country=india&type=geo&api_type=order_overview'
          }, {
            name: 'Japan',
            y: parseInt(this.geoClassify.japan.A),
            url:  this.base_url+'records?bu='+bu+'&rank=A&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&country=japan&type=geo&api_type=order_overview'
          }, {
            name: 'USA',
            y: parseInt(this.geoClassify.usa.A),
            url:  this.base_url+'records?bu='+bu+'&rank=A&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&country=usa&type=geo&api_type=order_overview'
          }, {
            name: 'APAC',
            y: parseInt(this.geoClassify.apac.A),
            url:  this.base_url+'records?bu='+bu+'&rank=A&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&country=apac&type=geo&api_type=order_overview'
          },{
            name: 'EMEA',
            y: parseInt(this.geoClassify.emea.A),
            url:  this.base_url+'records?bu='+bu+'&rank=A&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&country=emea&type=geo&api_type=order_overview'
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
          point: {
            events: {
                click: function () {
                    // location.href = this.options.url;
                    window.open(this.options.url);
                }
            }
          },
          data: [{
            name: 'India',
            y: parseInt(this.geoClassify.india.S),
            url:  this.base_url+'records?bu='+bu+'&rank=S&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&country=india&type=geo&api_type=order_overview'
          }, {
            name: 'Japan',
            y: parseInt(this.geoClassify.japan.S),
            url:  this.base_url+'records?bu='+bu+'&rank=S&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&country=japan&type=geo&api_type=order_overview'
          }, {
            name: 'USA',
            y: parseInt(this.geoClassify.usa.S),
            url:  this.base_url+'records?bu='+bu+'&rank=S&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&country=usa&type=geo&api_type=order_overview'
          }, {
            name: 'APAC',
            y: parseInt(this.geoClassify.apac.S),
            url:  this.base_url+'records?bu='+bu+'&rank=S&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&country=apac&type=geo&api_type=order_overview'
          },{
            name: 'EMEA',
            y: parseInt(this.geoClassify.emea.S),
            url:  this.base_url+'records?bu='+bu+'&rank=S&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&country=emea&type=geo&api_type=order_overview'
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
          point: {
            events: {
                click: function () {
                    // location.href = this.options.url;
                    window.open(this.options.url);
                }
            }
          },
          data: [{
            name: 'India',
            y: parseInt(this.geoClassify.india.Act),
            url:  this.base_url+'records?bu='+bu+'&rank=Act&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&country=india&type=geo&api_type=order_overview'
          }, {
            name: 'Japan',
            y: parseInt(this.geoClassify.japan.Act),
            url:  this.base_url+'records?bu='+bu+'&rank=Act&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&country=japan&type=geo&api_type=order_overview'
          }, {
            name: 'USA',
            y: parseInt(this.geoClassify.usa.Act),
            url:  this.base_url+'records?bu='+bu+'&rank=Act&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&country=usa&type=geo&api_type=order_overview'
          }, {
            name: 'APAC',
            y: parseInt(this.geoClassify.apac.Act),
            url:  this.base_url+'records?bu='+bu+'&rank=Act&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&country=apac&type=geo&api_type=order_overview'
          },{
            name: 'EMEA',
            y: parseInt(this.geoClassify.emea.Act),
            url:  this.base_url+'records?bu='+bu+'&rank=Act&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&country=emea&type=geo&api_type=order_overview'
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
              cursor: 'pointer',
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
          point: {
            events: {
                click: function () {
                    // location.href = this.options.url;
                    window.open(this.options.url);
                }
            }
          },
          data: [{
            name: 'India',
            y: parseInt(this.geoClassify.india.EE),
            url:  this.base_url+'records?bu='+bu+'&rank=&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&country=india&type=geo_classify&api_type=order_overview&classify=ee'
          }, {
            name: 'Japan',
            y: parseInt(this.geoClassify.japan.EE),
            url:  this.base_url+'records?bu='+bu+'&rank=&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&country=japan&type=geo_classify&api_type=order_overview&classify=ee'
          }, {
            name: 'USA',
            y: parseInt(this.geoClassify.usa.EE),
            url:  this.base_url+'records?bu='+bu+'&rank=&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&country=usa&type=geo_classify&api_type=order_overview&classify=ee'
          }, {
            name: 'APAC',
            y: parseInt(this.geoClassify.apac.EE),
            url:  this.base_url+'records?bu='+bu+'&rank=&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&country=apac&type=geo_classify&api_type=order_overview&classify=ee'
          },{
            name: 'EMEA',
            y: parseInt(this.geoClassify.emea.EE),
            url:  this.base_url+'records?bu='+bu+'&rank=&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&country=emea&type=geo_classify&api_type=order_overview&classify=ee'
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
          point: {
            events: {
                click: function () {
                    // location.href = this.options.url;
                    window.open(this.options.url);
                }
            }
          },
          data: [{
            name: 'India',
            y: parseInt(this.geoClassify.india.EN),
            url:  this.base_url+'records?bu='+bu+'&rank=&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&country=india&type=geo_classify&api_type=order_overview&classify=en'
          }, {
            name: 'Japan',
            y: parseInt(this.geoClassify.japan.EN),
            url:  this.base_url+'records?bu='+bu+'&rank=&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&country=japan&type=geo_classify&api_type=order_overview&classify=en'
          }, {
            name: 'USA',
            y: parseInt(this.geoClassify.usa.EN),
            url:  this.base_url+'records?bu='+bu+'&rank=&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&country=usa&type=geo_classify&api_type=order_overview&classify=en'
          }, {
            name: 'APAC',
            y: parseInt(this.geoClassify.apac.EN),
            url:  this.base_url+'records?bu='+bu+'&rank=&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&country=apac&type=geo_classify&api_type=order_overview&classify=en'
          },{
            name: 'EMEA',
            y: parseInt(this.geoClassify.emea.EN),
            url:  this.base_url+'records?bu='+bu+'&rank=&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&country=emea&type=geo_classify&api_type=order_overview&classify=en'
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
          point: {
            events: {
                click: function () {
                    // location.href = this.options.url;
                    window.open(this.options.url);
                }
            }
          },
          data: [{
            name: 'India',
            y: parseInt(this.geoClassify.india.NN),
            url:  this.base_url+'records?bu='+bu+'&rank=&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&country=india&type=geo_classify&api_type=order_overview&classify=nn'
          }, {
            name: 'Japan',
            y: parseInt(this.geoClassify.japan.NN),
            url:  this.base_url+'records?bu='+bu+'&rank=&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&country=japan&type=geo_classify&api_type=order_overview&classify=nn'
          }, {
            name: 'USA',
            y: parseInt(this.geoClassify.usa.NN),
            url:  this.base_url+'records?bu='+bu+'&rank=&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&country=usa&type=geo_classify&api_type=order_overview&classify=nn'
          }, {
            name: 'APAC',
            y: parseInt(this.geoClassify.apac.NN),
            url:  this.base_url+'records?bu='+bu+'&rank=&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&country=apac&type=geo_classify&api_type=order_overview&classify=nn'
          },{
            name: 'EMEA',
            y: parseInt(this.geoClassify.emea.NN),
            url:  this.base_url+'records?bu='+bu+'&rank=&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&country=emea&type=geo_classify&api_type=order_overview&classify=nn'
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
              cursor: 'pointer',
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
      colors: ['rgb(162,197,238)', 'rgb(119,135,186)', 'rgb(117,150,208)', 'rgb(57,93,157)', 'rgb(122,148,228)', 'rgb(132,174,220)', 'rgb(127,127,127)'],
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
          point: {
            events: {
                click: function () {
                    // location.href = this.options.url;
                    window.open(this.options.url);
                }
            }
          },
          data: [{
            name: this.subProjectClassify.project1.name,
            y: parseInt(this.subProjectClassify.project1.E),
            url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&type=segment&api_type=order_overview&segment='+this.subProjectClassify.project1.name
          },{
            name: this.subProjectClassify.project2.name,
            y: parseInt(this.subProjectClassify.project2.E),
            url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&type=segment&api_type=order_overview&segment='+this.subProjectClassify.project2.name
          },{
            name: this.subProjectClassify.project3.name,
            y: parseInt(this.subProjectClassify.project3.E),
            url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&type=segment&api_type=order_overview&segment='+this.subProjectClassify.project3.name
          },{
            name: this.subProjectClassify.project4.name,
            y: parseInt(this.subProjectClassify.project4.E),
            url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&type=segment&api_type=order_overview&segment='+this.subProjectClassify.project4.name
          },{
            name: this.subProjectClassify.project5.name,
            y: parseInt(this.subProjectClassify.project5.E),
            url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&type=segment&api_type=order_overview&segment='+this.subProjectClassify.project5.name
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
          point: {
            events: {
                click: function () {
                    // location.href = this.options.url;
                    window.open(this.options.url);
                }
            }
          },
          data: [{
            name: this.subProjectClassify.project1.name,
            y: parseInt(this.subProjectClassify.project1.D),
            url:  this.base_url+'records?bu='+bu+'&rank=D&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&type=segment&api_type=order_overview&segment='+this.subProjectClassify.project1.name
          },{
            name: this.subProjectClassify.project2.name,
            y: parseInt(this.subProjectClassify.project2.D),
            url:  this.base_url+'records?bu='+bu+'&rank=D&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&type=segment&api_type=order_overview&segment='+this.subProjectClassify.project2.name
          },{
            name: this.subProjectClassify.project3.name,
            y: parseInt(this.subProjectClassify.project3.D),
            url:  this.base_url+'records?bu='+bu+'&rank=D&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&type=segment&api_type=order_overview&segment='+this.subProjectClassify.project3.name
          },{
            name: this.subProjectClassify.project4.name,
            y: parseInt(this.subProjectClassify.project4.D),
            url:  this.base_url+'records?bu='+bu+'&rank=D&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&type=segment&api_type=order_overview&segment='+this.subProjectClassify.project4.name
          },{
            name: this.subProjectClassify.project5.name,
            y: parseInt(this.subProjectClassify.project5.D),
            url:  this.base_url+'records?bu='+bu+'&rank=D&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&type=segment&api_type=order_overview&segment='+this.subProjectClassify.project5.name
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
          point: {
            events: {
                click: function () {
                    // location.href = this.options.url;
                    window.open(this.options.url);
                }
            }
          },
          data: [{
            name: this.subProjectClassify.project1.name,
            y: parseInt(this.subProjectClassify.project1.C),
            url:  this.base_url+'records?bu='+bu+'&rank=C&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&type=segment&api_type=order_overview&segment='+this.subProjectClassify.project1.name
          },{
            name: this.subProjectClassify.project2.name,
            y: parseInt(this.subProjectClassify.project2.C),
            url:  this.base_url+'records?bu='+bu+'&rank=C&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&type=segment&api_type=order_overview&segment='+this.subProjectClassify.project2.name
          },{
            name: this.subProjectClassify.project3.name,
            y: parseInt(this.subProjectClassify.project3.C),
            url:  this.base_url+'records?bu='+bu+'&rank=C&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&type=segment&api_type=order_overview&segment='+this.subProjectClassify.project3.name
          },{
            name: this.subProjectClassify.project4.name,
            y: parseInt(this.subProjectClassify.project4.C),
            url:  this.base_url+'records?bu='+bu+'&rank=C&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&type=segment&api_type=order_overview&segment='+this.subProjectClassify.project4.name
          },{
            name: this.subProjectClassify.project5.name,
            y: parseInt(this.subProjectClassify.project5.C),
            url:  this.base_url+'records?bu='+bu+'&rank=C&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&type=segment&api_type=order_overview&segment='+this.subProjectClassify.project5.name
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
          point: {
            events: {
                click: function () {
                    // location.href = this.options.url;
                    window.open(this.options.url);
                }
            }
          },
          data: [{
            name: this.subProjectClassify.project1.name,
            y: parseInt(this.subProjectClassify.project1.B),
            url:  this.base_url+'records?bu='+bu+'&rank=B&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&type=segment&api_type=order_overview&segment='+this.subProjectClassify.project1.name
          },{
            name: this.subProjectClassify.project2.name,
            y: parseInt(this.subProjectClassify.project2.B),
            url:  this.base_url+'records?bu='+bu+'&rank=B&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&type=segment&api_type=order_overview&segment='+this.subProjectClassify.project2.name
          },{
            name: this.subProjectClassify.project3.name,
            y: parseInt(this.subProjectClassify.project3.B),
            url:  this.base_url+'records?bu='+bu+'&rank=B&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&type=segment&api_type=order_overview&segment='+this.subProjectClassify.project3.name
          },{
            name: this.subProjectClassify.project4.name,
            y: parseInt(this.subProjectClassify.project4.B),
            url:  this.base_url+'records?bu='+bu+'&rank=B&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&type=segment&api_type=order_overview&segment='+this.subProjectClassify.project4.name
          },{
            name: this.subProjectClassify.project5.name,
            y: parseInt(this.subProjectClassify.project5.B),
            url:  this.base_url+'records?bu='+bu+'&rank=B&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&type=segment&api_type=order_overview&segment='+this.subProjectClassify.project5.name
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
          point: {
            events: {
                click: function () {
                    // location.href = this.options.url;
                    window.open(this.options.url);
                }
            }
          },
          data: [{
            name: this.subProjectClassify.project1.name,
            y: parseInt(this.subProjectClassify.project1.A),
            url:  this.base_url+'records?bu='+bu+'&rank=A&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&type=segment&api_type=order_overview&segment='+this.subProjectClassify.project1.name
          },{
            name: this.subProjectClassify.project2.name,
            y: parseInt(this.subProjectClassify.project2.A),
            url:  this.base_url+'records?bu='+bu+'&rank=A&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&type=segment&api_type=order_overview&segment='+this.subProjectClassify.project2.name
          },{
            name: this.subProjectClassify.project3.name,
            y: parseInt(this.subProjectClassify.project3.A),
            url:  this.base_url+'records?bu='+bu+'&rank=A&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&type=segment&api_type=order_overview&segment='+this.subProjectClassify.project3.name
          },{
            name: this.subProjectClassify.project4.name,
            y: parseInt(this.subProjectClassify.project4.A),
            url:  this.base_url+'records?bu='+bu+'&rank=A&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&type=segment&api_type=order_overview&segment='+this.subProjectClassify.project4.name
          },{
            name: this.subProjectClassify.project5.name,
            y: parseInt(this.subProjectClassify.project5.A),
            url:  this.base_url+'records?bu='+bu+'&rank=A&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&type=segment&api_type=order_overview&segment='+this.subProjectClassify.project5.name
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
          point: {
            events: {
                click: function () {
                    // location.href = this.options.url;
                    window.open(this.options.url);
                }
            }
          },
          data: [{
            name: this.subProjectClassify.project1.name,
            y: parseInt(this.subProjectClassify.project1.S),
            url:  this.base_url+'records?bu='+bu+'&rank=S&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&type=segment&api_type=order_overview&segment='+this.subProjectClassify.project1.name
          },{
            name: this.subProjectClassify.project2.name,
            y: parseInt(this.subProjectClassify.project2.S),
            url:  this.base_url+'records?bu='+bu+'&rank=S&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&type=segment&api_type=order_overview&segment='+this.subProjectClassify.project2.name
          },{
            name: this.subProjectClassify.project3.name,
            y: parseInt(this.subProjectClassify.project3.S),
            url:  this.base_url+'records?bu='+bu+'&rank=S&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&type=segment&api_type=order_overview&segment='+this.subProjectClassify.project3.name
          },{
            name: this.subProjectClassify.project4.name,
            y: parseInt(this.subProjectClassify.project4.S),
            url:  this.base_url+'records?bu='+bu+'&rank=S&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&type=segment&api_type=order_overview&segment='+this.subProjectClassify.project4.name
          },{
            name: this.subProjectClassify.project5.name,
            y: parseInt(this.subProjectClassify.project5.S),
            url:  this.base_url+'records?bu='+bu+'&rank=S&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&type=segment&api_type=order_overview&segment='+this.subProjectClassify.project5.name
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
          point: {
            events: {
                click: function () {
                    // location.href = this.options.url;
                    window.open(this.options.url);
                }
            }
          },
          data: [{
            name: this.subProjectClassify.project1.name,
            y: parseInt(this.subProjectClassify.project1.Act),
            url:  this.base_url+'records?bu='+bu+'&rank=Act&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&type=segment&api_type=order_overview&segment='+this.subProjectClassify.project1.name
          },{
            name: this.subProjectClassify.project2.name,
            y: parseInt(this.subProjectClassify.project2.Act),
            url:  this.base_url+'records?bu='+bu+'&rank=Act&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&type=segment&api_type=order_overview&segment='+this.subProjectClassify.project2.name
          },{
            name: this.subProjectClassify.project3.name,
            y: parseInt(this.subProjectClassify.project3.Act),
            url:  this.base_url+'records?bu='+bu+'&rank=Act&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&type=segment&api_type=order_overview&segment='+this.subProjectClassify.project3.name
          },{
            name: this.subProjectClassify.project4.name,
            y: parseInt(this.subProjectClassify.project4.Act),
            url:  this.base_url+'records?bu='+bu+'&rank=Act&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&type=segment&api_type=order_overview&segment='+this.subProjectClassify.project4.name
          },{
            name: this.subProjectClassify.project5.name,
            y: parseInt(this.subProjectClassify.project5.Act),
            url:  this.base_url+'records?bu='+bu+'&rank=Act&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&type=segment&api_type=order_overview&segment='+this.subProjectClassify.project5.name
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
              cursor: 'pointer',
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
          point: {
            events: {
                click: function () {
                    // location.href = this.options.url;
                    window.open(this.options.url);
                }
            }
          },
          data: [{
            name: this.subProjectClassify.project1.name,
            y: parseInt(this.subProjectClassify.project1.EE),
            url:  this.base_url+'records?bu='+bu+'&rank=&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&type=segment_classify&api_type=order_overview&segment='+this.subProjectClassify.project1.name+'&classify=ee'
          },{
            name: this.subProjectClassify.project2.name,
            y: parseInt(this.subProjectClassify.project2.EE),
            url:  this.base_url+'records?bu='+bu+'&rank=&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&type=segment_classify&api_type=order_overview&segment='+this.subProjectClassify.project2.name+'&classify=ee'
          },{
            name: this.subProjectClassify.project3.name,
            y: parseInt(this.subProjectClassify.project3.EE),
            url:  this.base_url+'records?bu='+bu+'&rank=&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&type=segment_classify&api_type=order_overview&segment='+this.subProjectClassify.project3.name+'&classify=ee'
          },{
            name: this.subProjectClassify.project4.name,
            y: parseInt(this.subProjectClassify.project4.EE),
            url:  this.base_url+'records?bu='+bu+'&rank=&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&type=segment_classify&api_type=order_overview&segment='+this.subProjectClassify.project4.name+'&classify=ee'
          },{
            name: this.subProjectClassify.project5.name,
            y: parseInt(this.subProjectClassify.project5.EE),
            url:  this.base_url+'records?bu='+bu+'&rank=&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&type=segment_classify&api_type=order_overview&segment='+this.subProjectClassify.project5.name+'&classify=ee'
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
          point: {
            events: {
                click: function () {
                    // location.href = this.options.url;
                    window.open(this.options.url);
                }
            }
          },
          data: [{
            name: this.subProjectClassify.project1.name,
            y: parseInt(this.subProjectClassify.project1.EN),
            url:  this.base_url+'records?bu='+bu+'&rank=&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&type=segment_classify&api_type=order_overview&segment='+this.subProjectClassify.project1.name+'&classify=en'
          },{
            name: this.subProjectClassify.project2.name,
            y: parseInt(this.subProjectClassify.project2.EN),
            url:  this.base_url+'records?bu='+bu+'&rank=&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&type=segment_classify&api_type=order_overview&segment='+this.subProjectClassify.project2.name+'&classify=en'
          },{
            name: this.subProjectClassify.project3.name,
            y: parseInt(this.subProjectClassify.project3.EN),
            url:  this.base_url+'records?bu='+bu+'&rank=&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&type=segment_classify&api_type=order_overview&segment='+this.subProjectClassify.project3.name+'&classify=en'
          },{
            name: this.subProjectClassify.project4.name,
            y: parseInt(this.subProjectClassify.project4.EN),
            url:  this.base_url+'records?bu='+bu+'&rank=&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&type=segment_classify&api_type=order_overview&segment='+this.subProjectClassify.project4.name+'&classify=en'
          },{
            name: this.subProjectClassify.project5.name,
            y: parseInt(this.subProjectClassify.project5.EN),
            url:  this.base_url+'records?bu='+bu+'&rank=&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&type=segment_classify&api_type=order_overview&segment='+this.subProjectClassify.project5.name+'&classify=en'
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
          point: {
            events: {
                click: function () {
                    // location.href = this.options.url;
                    window.open(this.options.url);
                }
            }
          },
          data: [{
            name: this.subProjectClassify.project1.name,
            y: parseInt(this.subProjectClassify.project1.NN),
            url:  this.base_url+'records?bu='+bu+'&rank=&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&type=segment_classify&api_type=order_overview&segment='+this.subProjectClassify.project1.name+'&classify=nn'
          },{
            name: this.subProjectClassify.project2.name,
            y: parseInt(this.subProjectClassify.project2.NN),
            url:  this.base_url+'records?bu='+bu+'&rank=&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&type=segment_classify&api_type=order_overview&segment='+this.subProjectClassify.project2.name+'&classify=nn'
          },{
            name: this.subProjectClassify.project3.name,
            y: parseInt(this.subProjectClassify.project3.NN),
            url:  this.base_url+'records?bu='+bu+'&rank=&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&type=segment_classify&api_type=order_overview&segment='+this.subProjectClassify.project3.name+'&classify=nn'
          },{
            name: this.subProjectClassify.project4.name,
            y: parseInt(this.subProjectClassify.project4.NN),
            url:  this.base_url+'records?bu='+bu+'&rank=&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&type=segment_classify&api_type=order_overview&segment='+this.subProjectClassify.project4.name+'&classify=nn'
          },{
            name: this.subProjectClassify.project5.name,
            y: parseInt(this.subProjectClassify.project5.NN),
            url:  this.base_url+'records?bu='+bu+'&rank=&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&type=segment_classify&api_type=order_overview&segment='+this.subProjectClassify.project5.name+'&classify=nn'
          }]
        }
      ]
    }
    Highcharts.chart('subproject-pipeline-class', subproject_pipeline_class as any);
 
    var typeofcust_class = {
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
              cursor: 'pointer',
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
      colors: ['rgb(162,197,238)', 'rgb(119,135,186)', 'rgb(117,150,208)', 'rgb(57,93,157)', 'rgb(122,148,228)', 'rgb(132,174,220)', 'rgb(127,127,127)'],
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
          point: {
            events: {
                click: function () {
                    // location.href = this.options.url;
                    window.open(this.options.url);
                }
            }
          },
          data: [{
            name: 'Government',
            y: parseInt(this.typeOfCustomer.goverment.E),
            url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=type_of_customer&type_of_cust=government'
          },{
            name: 'Enterprise',
            y: parseInt(this.typeOfCustomer.enterprise.E),
            url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=type_of_customer&type_of_cust=enterprise'
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
          point: {
            events: {
                click: function () {
                    // location.href = this.options.url;
                    window.open(this.options.url);
                }
            }
          },
          data: [{
            name: 'Government',
            y: parseInt(this.typeOfCustomer.goverment.D),
            url:  this.base_url+'records?bu='+bu+'&rank=D&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=type_of_customer&type_of_cust=government'
          },{
            name: 'Enterprise',
            y: parseInt(this.typeOfCustomer.enterprise.D),
            url:  this.base_url+'records?bu='+bu+'&rank=D&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=type_of_customer&type_of_cust=enterprise'
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
          point: {
            events: {
                click: function () {
                    // location.href = this.options.url;
                    window.open(this.options.url);
                }
            }
          },
          data: [{
            name: 'Government',
            y: parseInt(this.typeOfCustomer.goverment.C),
            url:  this.base_url+'records?bu='+bu+'&rank=C&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=type_of_customer&type_of_cust=government'
          },{
            name: 'Enterprise',
            y: parseInt(this.typeOfCustomer.enterprise.C),
            url:  this.base_url+'records?bu='+bu+'&rank=C&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=type_of_customer&type_of_cust=enterprise'
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
          point: {
            events: {
                click: function () {
                    // location.href = this.options.url;
                    window.open(this.options.url);
                }
            }
          },
          data: [{
            name: 'Government',
            y: parseInt(this.typeOfCustomer.goverment.B),
            url:  this.base_url+'records?bu='+bu+'&rank=B&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=type_of_customer&type_of_cust=government'
          },{
            name: 'Enterprise',
            y: parseInt(this.typeOfCustomer.enterprise.B),
            url:  this.base_url+'records?bu='+bu+'&rank=B&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=type_of_customer&type_of_cust=enterprise'
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
          point: {
            events: {
                click: function () {
                    // location.href = this.options.url;
                    window.open(this.options.url);
                }
            }
          },
          data: [{
            name: 'Government',
            y: parseInt(this.typeOfCustomer.goverment.A),
            url:  this.base_url+'records?bu='+bu+'&rank=A&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=type_of_customer&type_of_cust=government'
          },{
            name: 'Enterprise',
            y: parseInt(this.typeOfCustomer.enterprise.A),
            url:  this.base_url+'records?bu='+bu+'&rank=A&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=type_of_customer&type_of_cust=enterprise'
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
          point: {
            events: {
                click: function () {
                    // location.href = this.options.url;
                    window.open(this.options.url);
                }
            }
          },
          data: [{
            name: 'Government',
            y: parseInt(this.typeOfCustomer.goverment.S),
            url:  this.base_url+'records?bu='+bu+'&rank=S&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=type_of_customer&type_of_cust=government'
          },{
            name: 'Enterprise',
            y: parseInt(this.typeOfCustomer.enterprise.S),
            url:  this.base_url+'records?bu='+bu+'&rank=S&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=type_of_customer&type_of_cust=enterprise'
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
          point: {
            events: {
                click: function () {
                    // location.href = this.options.url;
                    window.open(this.options.url);
                }
            }
          },
          data: [{
            name: 'Government',
            y: parseInt(this.typeOfCustomer.goverment.Act),
            url:  this.base_url+'records?bu='+bu+'&rank=Act&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=type_of_customer&type_of_cust=government'
          },{
            name: 'Enterprise',
            y: parseInt(this.typeOfCustomer.enterprise.Act),
            url:  this.base_url+'records?bu='+bu+'&rank=Act&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=type_of_customer&type_of_cust=enterprise'
          }]
        }
      ]
    };
    Highcharts.chart('type-of-customer-rank', typeofcust_class as any);

    var aging = {
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
              cursor: 'pointer',
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
      colors: ['rgb(162,197,238)', 'rgb(119,135,186)', 'rgb(117,150,208)', 'rgb(57,93,157)', 'rgb(122,148,228)', 'rgb(132,174,220)', 'rgb(127,127,127)'],
      tooltip: {
          headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
          pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b>'
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
          point: {
            events: {
                click: function () {
                    // location.href = this.options.url;
                    window.open(this.options.url);
                }
            }
          },
          data: [{
            name: '>150 Days',
            y: parseInt(this.rankAging["151greater"].E),
            url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=ageing&start_range=150&end_range=0'
          },{
            name: '91-150 Days',
            y: parseInt(this.rankAging["91to150"].E),
            url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=ageing&start_range=120&end_range=150'
          },{
            name: '61-90 Days',
            y: parseInt(this.rankAging["61to90"].E),
            url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=ageing&start_range=90&end_range=120'
          },{
            name: '31-60 Days',
            y: parseInt(this.rankAging["31to60"].E),
            url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=ageing&start_range=60&end_range=90'
          },{
            name: '0-30 Days',
            y: parseInt(this.rankAging["0to30"].E),
            url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=ageing&start_range=0&end_range=30'
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
          point: {
            events: {
                click: function () {
                    // location.href = this.options.url;
                    window.open(this.options.url);
                }
            }
          },
          data: [{
            name: '>150 Days',
            y: parseInt(this.rankAging["151greater"].D),
            url:  this.base_url+'records?bu='+bu+'&rank=D&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=ageing&start_range=150&end_range=0'
          },{
            name: '91-150 Days',
            y: parseInt(this.rankAging["91to150"].D),
            url:  this.base_url+'records?bu='+bu+'&rank=D&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=ageing&start_range=120&end_range=150'
          },{
            name: '61-90 Days',
            y: parseInt(this.rankAging["61to90"].D),
            url:  this.base_url+'records?bu='+bu+'&rank=D&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=ageing&start_range=90&end_range=120'
          },{
            name: '31-60 Days',
            y: parseInt(this.rankAging["31to60"].D),
            url:  this.base_url+'records?bu='+bu+'&rank=D&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=ageing&start_range=60&end_range=90'
          },{
            name: '0-30 Days',
            y: parseInt(this.rankAging["0to30"].D),
            url:  this.base_url+'records?bu='+bu+'&rank=D&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=ageing&start_range=0&end_range=30'
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
          point: {
            events: {
                click: function () {
                    // location.href = this.options.url;
                    window.open(this.options.url);
                }
            }
          },
          data: [{
            name: '>150 Days',
            y: parseInt(this.rankAging["151greater"].C),
            url:  this.base_url+'records?bu='+bu+'&rank=C&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=ageing&start_range=150&end_range=0'
          },{
            name: '91-150 Days',
            y: parseInt(this.rankAging["91to150"].C),
            url:  this.base_url+'records?bu='+bu+'&rank=C&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=ageing&start_range=120&end_range=150'
          },{
            name: '61-90 Days',
            y: parseInt(this.rankAging["61to90"].C),
            url:  this.base_url+'records?bu='+bu+'&rank=C&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=ageing&start_range=90&end_range=120'
          },{
            name: '31-60 Days',
            y: parseInt(this.rankAging["31to60"].C),
            url:  this.base_url+'records?bu='+bu+'&rank=C&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=ageing&start_range=60&end_range=90'
          },{
            name: '0-30 Days',
            y: parseInt(this.rankAging["0to30"].C),
            url:  this.base_url+'records?bu='+bu+'&rank=C&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=ageing&start_range=0&end_range=30'
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
          point: {
            events: {
                click: function () {
                    // location.href = this.options.url;
                    window.open(this.options.url);
                }
            }
          },
          data: [{
            name: '>150 Days',
            y: parseInt(this.rankAging["151greater"].B),
            url:  this.base_url+'records?bu='+bu+'&rank=B&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=ageing&start_range=150&end_range=0'
          },{
            name: '91-150 Days',
            y: parseInt(this.rankAging["91to150"].B),
            url:  this.base_url+'records?bu='+bu+'&rank=B&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=ageing&start_range=120&end_range=150'
          },{
            name: '61-90 Days',
            y: parseInt(this.rankAging["61to90"].B),
            url:  this.base_url+'records?bu='+bu+'&rank=B&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=ageing&start_range=90&end_range=120'
          },{
            name: '31-60 Days',
            y: parseInt(this.rankAging["31to60"].B),
            url:  this.base_url+'records?bu='+bu+'&rank=B&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=ageing&start_range=60&end_range=90'
          },{
            name: '0-30 Days',
            y: parseInt(this.rankAging["0to30"].B),
            url:  this.base_url+'records?bu='+bu+'&rank=B&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=ageing&start_range=0&end_range=30'
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
          point: {
            events: {
                click: function () {
                    // location.href = this.options.url;
                    window.open(this.options.url);
                }
            }
          },
          data: [{
            name: '>150 Days',
            y: parseInt(this.rankAging["151greater"].A),
            url:  this.base_url+'records?bu='+bu+'&rank=A&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=ageing&start_range=150&end_range=0'
          },{
            name: '91-150 Days',
            y: parseInt(this.rankAging["91to150"].A),
            url:  this.base_url+'records?bu='+bu+'&rank=A&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=ageing&start_range=120&end_range=150'
          },{
            name: '61-90 Days',
            y: parseInt(this.rankAging["61to90"].A),
            url:  this.base_url+'records?bu='+bu+'&rank=A&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=ageing&start_range=90&end_range=120'
          },{
            name: '31-60 Days',
            y: parseInt(this.rankAging["31to60"].A),
            url:  this.base_url+'records?bu='+bu+'&rank=A&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=ageing&start_range=60&end_range=90'
          },{
            name: '0-30 Days',
            y: parseInt(this.rankAging["0to30"].A),
            url:  this.base_url+'records?bu='+bu+'&rank=A&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=ageing&start_range=0&end_range=30'
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
          point: {
            events: {
                click: function () {
                    // location.href = this.options.url;
                    window.open(this.options.url);
                }
            }
          },
          data: [{
            name: '>150 Days',
            y: parseInt(this.rankAging["151greater"].S),
            url:  this.base_url+'records?bu='+bu+'&rank=S&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=ageing&start_range=150&end_range=0'
          },{
            name: '91-150 Days',
            y: parseInt(this.rankAging["91to150"].S),
            url:  this.base_url+'records?bu='+bu+'&rank=S&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=ageing&start_range=120&end_range=150'
          },{
            name: '61-90 Days',
            y: parseInt(this.rankAging["61to90"].S),
            url:  this.base_url+'records?bu='+bu+'&rank=S&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=ageing&start_range=90&end_range=120'
          },{
            name: '31-60 Days',
            y: parseInt(this.rankAging["31to60"].S),
            url:  this.base_url+'records?bu='+bu+'&rank=S&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=ageing&start_range=60&end_range=90'
          },{
            name: '0-30 Days',
            y: parseInt(this.rankAging["0to30"].S),
            url:  this.base_url+'records?bu='+bu+'&rank=S&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=ageing&start_range=0&end_range=30'
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
          point: {
            events: {
                click: function () {
                    // location.href = this.options.url;
                    window.open(this.options.url);
                }
            }
          },
          data: [{
            name: '>150 Days',
            y: parseInt(this.rankAging["151greater"].Act),
            url:  this.base_url+'records?bu='+bu+'&rank=Act&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=ageing&start_range=150&end_range=0'
          },{
            name: '91-150 Days',
            y: parseInt(this.rankAging["91to150"].Act),
            url:  this.base_url+'records?bu='+bu+'&rank=Act&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=ageing&start_range=120&end_range=150'
          },{
            name: '61-90 Days',
            y: parseInt(this.rankAging["61to90"].Act),
            url:  this.base_url+'records?bu='+bu+'&rank=Act&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=ageing&start_range=90&end_range=120'
          },{
            name: '31-60 Days',
            y: parseInt(this.rankAging["31to60"].Act),
            url:  this.base_url+'records?bu='+bu+'&rank=Act&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=ageing&start_range=60&end_range=90'
          },{
            name: '0-30 Days',
            y: parseInt(this.rankAging["0to30"].Act),
            url:  this.base_url+'records?bu='+bu+'&rank=Act&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=ageing&start_range=0&end_range=30'
          }]
        }
      ]
    }
    Highcharts.chart('aging', aging as any);
  }

  openSalesModal(){
    this.blur = "blur";
    this.salesModal = "block";
    var bu = this.filterBu;
    var geo = this.filterGeo;
    var currency = this.filterCurrency;
    var fiscal_year = this.filterFiscal_year;
    var timeframe = this.filterTimeframe;
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
                  y: parseInt(this.salesBreakdown.New.percentage),
                  url: this.base_url+'records?bu='+bu+'&rank=&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&estimatesale=New Order&time='
                },
                {
                  name: 'Backlog',
                  y: parseInt(this.salesBreakdown.Backlog.percentage),
                  url: this.base_url+'records?bu='+bu+'&rank=&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&estimatesale=Backlog&time='
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
      colors: ['rgb(162,197,238)', 'rgb(119,135,186)', 'rgb(117,150,208)', 'rgb(57,93,157)', 'rgb(122,148,228)', 'rgb(127,127,127)'],      
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
            y: parseInt(this.salesBreakdown.New.Q1.E),
            url: this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&estimatesale=New Order&time=Q1'
          },{
            name: "Q2",
            y: parseInt(this.salesBreakdown.New.Q2.E),
            url: this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&estimatesale=New Order&time=Q2'
          },{
            name: "Q3",
            y: parseInt(this.salesBreakdown.New.Q3.E),
            url: this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&estimatesale=New Order&time=Q3'
          },{
            name: "Q4",
            y: parseInt(this.salesBreakdown.New.Q4.E),
            url: this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&estimatesale=New Order&time=Q4'
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
            y: parseInt(this.salesBreakdown.New.Q1.D),
            url: this.base_url+'records?bu='+bu+'&rank=D&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&estimatesale=New Order&time=Q1'
          },{
            name: "Q2",
            y: parseInt(this.salesBreakdown.New.Q2.D),
            url: this.base_url+'records?bu='+bu+'&rank=D&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&estimatesale=New Order&time=Q2'
          },{
            name: "Q3",
            y: parseInt(this.salesBreakdown.New.Q3.D),
            url: this.base_url+'records?bu='+bu+'&rank=D&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&estimatesale=New Order&time=Q3'
          },{
            name: "Q4",
            y: parseInt(this.salesBreakdown.New.Q4.D),
            url: this.base_url+'records?bu='+bu+'&rank=D&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&estimatesale=New Order&time=Q4'
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
            y: parseInt(this.salesBreakdown.New.Q1.C),
            url: this.base_url+'records?bu='+bu+'&rank=C&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&estimatesale=New Order&time=Q1'
          },{
            name: "Q2",
            y: parseInt(this.salesBreakdown.New.Q2.C),
            url: this.base_url+'records?bu='+bu+'&rank=C&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&estimatesale=New Order&time=Q2'
          },{
            name: "Q3",
            y: parseInt(this.salesBreakdown.New.Q3.C),
            url: this.base_url+'records?bu='+bu+'&rank=C&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&estimatesale=New Order&time=Q3'
          },{
            name: "Q4",
            y: parseInt(this.salesBreakdown.New.Q4.C),
            url: this.base_url+'records?bu='+bu+'&rank=C&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&estimatesale=New Order&time=Q4'
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
            y: parseInt(this.salesBreakdown.New.Q1.B),
            url: this.base_url+'records?bu='+bu+'&rank=B&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&estimatesale=New Order&time=Q1'
          },{
            name: "Q2",
            y: parseInt(this.salesBreakdown.New.Q2.B),
            url: this.base_url+'records?bu='+bu+'&rank=B&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&estimatesale=New Order&time=Q2'
          },{
            name: "Q3",
            y: parseInt(this.salesBreakdown.New.Q3.B),
            url: this.base_url+'records?bu='+bu+'&rank=B&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&estimatesale=New Order&time=Q3'
          },{
            name: "Q4",
            y: parseInt(this.salesBreakdown.New.Q4.B),
            url: this.base_url+'records?bu='+bu+'&rank=B&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&estimatesale=New Order&time=Q4'
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
            y: parseInt(this.salesBreakdown.New.Q1.A),
            url: this.base_url+'records?bu='+bu+'&rank=A&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&estimatesale=New Order&time=Q1'
          },{
            name: "Q2",
            y: parseInt(this.salesBreakdown.New.Q2.A),
            url: this.base_url+'records?bu='+bu+'&rank=A&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&estimatesale=New Order&time=Q2'
          },{
            name: "Q3",
            y: parseInt(this.salesBreakdown.New.Q3.A),
            url: this.base_url+'records?bu='+bu+'&rank=A&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&estimatesale=New Order&time=Q3'
          },{
            name: "Q4",
            y: parseInt(this.salesBreakdown.New.Q4.A),
            url: this.base_url+'records?bu='+bu+'&rank=A&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&estimatesale=New Order&time=Q4'
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
            y: parseInt(this.salesBreakdown.New.Q1.Act),
            url: this.base_url+'records?bu='+bu+'&rank=Act&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&estimatesale=New Order&time=Q1'
          },{
            name: "Q2",
            y: parseInt(this.salesBreakdown.New.Q2.Act),
            url: this.base_url+'records?bu='+bu+'&rank=Act&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&estimatesale=New Order&time=Q2'
          },{
            name: "Q3",
            y: parseInt(this.salesBreakdown.New.Q3.Act),
            url: this.base_url+'records?bu='+bu+'&rank=Act&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&estimatesale=New Order&time=Q3'
          },{
            name: "Q4",
            y: parseInt(this.salesBreakdown.New.Q4.Act),
            url: this.base_url+'records?bu='+bu+'&rank=Act&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&estimatesale=New Order&time=Q4'
          }]
        },
      ],
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
      colors: ['rgb(162,197,238)', 'rgb(119,135,186)', 'rgb(117,150,208)', 'rgb(57,93,157)', 'rgb(122,148,228)', 'rgb(127,127,127)'],      
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
            y: parseInt(this.salesBreakdown.Backlog.Q1.E),
            url: this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&estimatesale=Backlog&time=Q1'
          },{
            name: "Q2",
            y: parseInt(this.salesBreakdown.Backlog.Q2.E),
            url: this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&estimatesale=Backlog&time=Q2'
          },{
            name: "Q3",
            y: parseInt(this.salesBreakdown.Backlog.Q3.E),
            url: this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&estimatesale=Backlog&time=Q3'
          },{
            name: "Q4",
            y: parseInt(this.salesBreakdown.Backlog.Q4.E),
            url: this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&estimatesale=Backlog&time=Q4'
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
            y: parseInt(this.salesBreakdown.Backlog.Q1.D),
            url: this.base_url+'records?bu='+bu+'&rank=D&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&estimatesale=Backlog&time=Q1'
          },{
            name: "Q2",
            y: parseInt(this.salesBreakdown.Backlog.Q2.D),
            url: this.base_url+'records?bu='+bu+'&rank=D&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&estimatesale=Backlog&time=Q2'
          },{
            name: "Q3",
            y: parseInt(this.salesBreakdown.Backlog.Q3.D),
            url: this.base_url+'records?bu='+bu+'&rank=D&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&estimatesale=Backlog&time=Q3'
          },{
            name: "Q4",
            y: parseInt(this.salesBreakdown.Backlog.Q4.D),
            url: this.base_url+'records?bu='+bu+'&rank=D&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&estimatesale=Backlog&time=Q4'
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
            y: parseInt(this.salesBreakdown.Backlog.Q1.C),
            url: this.base_url+'records?bu='+bu+'&rank=C&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&estimatesale=Backlog&time=Q1'
          },{
            name: "Q2",
            y: parseInt(this.salesBreakdown.Backlog.Q2.C),
            url: this.base_url+'records?bu='+bu+'&rank=C&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&estimatesale=Backlog&time=Q2'
          },{
            name: "Q3",
            y: parseInt(this.salesBreakdown.Backlog.Q3.C),
            url: this.base_url+'records?bu='+bu+'&rank=C&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&estimatesale=Backlog&time=Q3'
          },{
            name: "Q4",
            y: parseInt(this.salesBreakdown.Backlog.Q4.C),
            url: this.base_url+'records?bu='+bu+'&rank=C&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&estimatesale=Backlog&time=Q4'
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
            y: parseInt(this.salesBreakdown.Backlog.Q1.B),
            url: this.base_url+'records?bu='+bu+'&rank=B&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&estimatesale=Backlog&time=Q1'
          },{
            name: "Q2",
            y: parseInt(this.salesBreakdown.Backlog.Q2.B),
            url: this.base_url+'records?bu='+bu+'&rank=B&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&estimatesale=Backlog&time=Q2'
          },{
            name: "Q3",
            y: parseInt(this.salesBreakdown.Backlog.Q3.B),
            url: this.base_url+'records?bu='+bu+'&rank=B&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&estimatesale=Backlog&time=Q3'
          },{
            name: "Q4",
            y: parseInt(this.salesBreakdown.Backlog.Q4.B),
            url: this.base_url+'records?bu='+bu+'&rank=B&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&estimatesale=Backlog&time=Q4'
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
            y: parseInt(this.salesBreakdown.Backlog.Q1.A),
            url: this.base_url+'records?bu='+bu+'&rank=A&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&estimatesale=Backlog&time=Q1'
          },{
            name: "Q2",
            y: parseInt(this.salesBreakdown.Backlog.Q2.A),
            url: this.base_url+'records?bu='+bu+'&rank=A&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&estimatesale=Backlog&time=Q2'
          },{
            name: "Q3",
            y: parseInt(this.salesBreakdown.Backlog.Q3.A),
            url: this.base_url+'records?bu='+bu+'&rank=A&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&estimatesale=Backlog&time=Q3'
          },{
            name: "Q4",
            y: parseInt(this.salesBreakdown.Backlog.Q4.A),
            url: this.base_url+'records?bu='+bu+'&rank=A&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&estimatesale=Backlog&time=Q4'
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
            y: parseInt(this.salesBreakdown.Backlog.Q1.Act),
            url: this.base_url+'records?bu='+bu+'&rank=Act&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&estimatesale=Backlog&time=Q1'
          },{
            name: "Q2",
            y: parseInt(this.salesBreakdown.Backlog.Q2.Act),
            url: this.base_url+'records?bu='+bu+'&rank=Act&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&estimatesale=Backlog&time=Q2'
          },{
            name: "Q3",
            y: parseInt(this.salesBreakdown.Backlog.Q3.Act),
            url: this.base_url+'records?bu='+bu+'&rank=Act&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&estimatesale=Backlog&time=Q3'
          },{
            name: "Q4",
            y: parseInt(this.salesBreakdown.Backlog.Q4.Act),
            url: this.base_url+'records?bu='+bu+'&rank=Act&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&estimatesale=Backlog&time=Q4'
          }]
        },
      ],
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

  closeLeadsModal(){
    this.leadsModal = "none";
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
    if(buName == ''){
      this.selectedBuValue = 'All BU';
    }else{
      this.selectedBuValue = buName;
    }
    this.bu.nativeElement.value = buName;
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

    if(timeframe == 'YTD'){
      start_date = "";
      end_date = "";
      this.timeFilter = 'YTD';
      timeframeFilter = ''
      timeframe = 'YTD'
    }else if(timeframe == 'Q1'){
      start_date = "";
      end_date = "";
      this.timeFilter = 'Q1';
      timeframeFilter = 'Q1'
    }else if(timeframe == 'Q2'){
      start_date = "";
      end_date = "";
      this.timeFilter = 'Q2';
      timeframeFilter = 'Q2'
    }else if(timeframe == 'Q3'){
      start_date = "";
      end_date = "";
      this.timeFilter = 'Q3';
      timeframeFilter = 'Q3'
    }else if(timeframe == 'Q4'){
      start_date = "";
      end_date = "";
      this.timeFilter = 'Q4';
      timeframeFilter = 'Q4'
    }else if(timeframe == '1H'){
      start_date = "";
      end_date = "";
      this.timeFilter = '1H';
      timeframeFilter = '1H'
    }else if(timeframe == '2H'){
      start_date = "";
      end_date = "";
      this.timeFilter = '2H';
      timeframeFilter = '1H'
    }else if(timeframe == 'annual'){
      start_date = "";
      end_date = "";
      timeframeFilter = ''
      this.timeFilter = 'Annual';
      timeframe = ''
    }else if(timeframe == 'ytd'){
      start_date = "";
      end_date = "";
      timeframeFilter = ''
      this.timeFilter = 'YTD';
      timeframe = ''
    }
    this.filterBu = bu;
    this.filterStart_date = start_date;
    this.filterEnd_date = end_date;
    this.filterGeo = geo;
    this.filterCurrency = currency;
    this.filterTimeframe= timeframe;
    this.filterFiscal_year= fiscal_year;

    this.createChartGaugeOrder(this.filterBu, this.filterStart_date, this.filterEnd_date, this.filterGeo, this.filterCurrency, this.filterTimeframe, this.filterFiscal_year);
    this.createChartGaugeSales(this.filterBu, this.filterStart_date, this.filterEnd_date, this.filterGeo, this.filterCurrency, this.filterTimeframe, this.filterFiscal_year);
    this.createOrderOppGraph(this.filterBu, this.filterStart_date, this.filterEnd_date, this.filterGeo, this.filterCurrency, this.filterTimeframe, this.filterFiscal_year);
    this.createOrderAmtGraph(this.filterBu, this.filterStart_date, this.filterEnd_date, this.filterGeo, this.filterCurrency, this.filterTimeframe, this.filterFiscal_year);
    this.getOrdersBookedLastMonth(this.filterBu, this.filterGeo, this.filterFiscal_year);
    this.getBidWinRate(this.filterBu, this.filterStart_date, this.filterEnd_date, this.filterGeo, this.filterCurrency, this.filterTimeframe, this.filterFiscal_year);
    this.getAvgOrderCycle(this.filterBu, this.filterStart_date, this.filterEnd_date, this.filterGeo, this.filterCurrency, this.filterTimeframe, this.filterFiscal_year);
    this.getAvgOrderSize(this.filterBu, this.filterStart_date, this.filterEnd_date, this.filterGeo, this.filterCurrency, this.filterTimeframe, this.filterFiscal_year);
    this.getOrderRunRate(this.filterBu, this.filterStart_date, this.filterEnd_date, this.filterGeo, this.filterCurrency, this.filterTimeframe, this.filterFiscal_year);
    this.getEstimatedRunRate(this.filterBu, this.filterStart_date, this.filterEnd_date, this.filterGeo, this.filterCurrency, this.filterTimeframe, this.filterFiscal_year);
    this.getRequiredRunRate(this.filterBu, this.filterStart_date, this.filterEnd_date, this.filterGeo, this.filterCurrency, this.filterTimeframe, this.filterFiscal_year);
    this.getSalesRunRate(this.filterBu, this.filterStart_date, this.filterEnd_date, this.filterGeo, this.filterCurrency, this.filterTimeframe, this.filterFiscal_year);
    this.getSalesEstimatedRunRate(this.filterBu, this.filterStart_date, this.filterEnd_date, this.filterGeo, this.filterCurrency, this.filterTimeframe, this.filterFiscal_year);
    this.getSalesRequiredRunRate(this.filterBu, this.filterStart_date, this.filterEnd_date, this.filterGeo, this.filterCurrency, this.filterTimeframe, this.filterFiscal_year);
    this.getTopKeyProjects(this.filterBu, this.filterStart_date, this.filterEnd_date, this.filterGeo, this.filterCurrency, this.filterTimeframe, this.filterFiscal_year);
    this.getTopKeyAccounts(this.filterBu, this.filterStart_date, this.filterEnd_date, this.filterGeo, this.filterCurrency, this.filterTimeframe, this.filterFiscal_year);
    this.getSayDoOrder(this.filterBu, this.filterStart_date, this.filterEnd_date, this.filterGeo, this.filterCurrency, this.filterTimeframe, this.filterFiscal_year);
    this.getSayDoSales(this.filterBu, this.filterStart_date, this.filterEnd_date, this.filterGeo, this.filterCurrency, this.filterTimeframe, this.filterFiscal_year);
    this.getNewCustomersAcquired(this.filterBu, this.filterStart_date, this.filterEnd_date, this.filterGeo, this.filterCurrency, this.filterTimeframe, this.filterFiscal_year);
    this.getLostOpportunities(this.filterBu, this.filterStart_date, this.filterEnd_date, this.filterGeo, this.filterCurrency, this.filterTimeframe, this.filterFiscal_year);
    this.getOrderTrend(this.filterBu, this.filterStart_date, this.filterEnd_date, this.filterGeo, this.filterCurrency, this.filterTimeframe, this.filterFiscal_year);
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
    var data =  {
      "bu": this.filterBu,
      "start_date": this.filterStart_date,
      "end_date": this.filterEnd_date,
      "geo": this.filterGeo,
      "currency": this.filterCurrency,
      "fiscal_year": this.filterFiscal_year,
      "timeframe": this.filterTimeframe
    }
    bu = this.filterBu;
    start_date = this.filterStart_date;
    end_date = this.filterEnd_date;
    geo = this.filterGeo;
    currency = this.filterCurrency;
    fiscal_year = this.filterFiscal_year;
    timeframe = this.filterTimeframe;

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
    var data =  {
      "bu": this.filterBu,
      "start_date": this.filterStart_date,
      "end_date": this.filterEnd_date,
      "geo": this.filterGeo,
      "currency": this.filterCurrency,
      "fiscal_year": this.filterFiscal_year,
      "timeframe": this.filterTimeframe
    }
    bu = this.filterBu;
    start_date = this.filterStart_date;
    end_date = this.filterEnd_date;
    geo = this.filterGeo;
    currency = this.filterCurrency;
    fiscal_year = this.filterFiscal_year;
    timeframe = this.filterTimeframe;

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
    var data =  {
      "bu": this.filterBu,
      "start_date": this.filterStart_date,
      "end_date": this.filterEnd_date,
      "geo": this.filterGeo,
      "currency": this.filterCurrency,
      "fiscal_year": this.filterFiscal_year,
      "timeframe": this.filterTimeframe
    }
    bu = this.filterBu;
    start_date = this.filterStart_date;
    end_date = this.filterEnd_date;
    geo = this.filterGeo;
    currency = this.filterCurrency;
    fiscal_year = this.filterFiscal_year;
    timeframe = this.filterTimeframe;

    this.dataService.getTopKeyProjects(data).subscribe(
      res => {
        if(res.result.status == true){
          this.top_key_projects_actuals = res.result.result.Actual;
          this.top_key_projects_open = res.result.result.Open;
          this.top_key_projects_open_bc = res.result.result.open_from_bc;
        }
      }
    );    
  }

  getTopKeyAccounts(bu, start_date, end_date, geo, currency, timeframe, fiscal_year){
    var data =  {
      "bu": this.filterBu,
      "start_date": this.filterStart_date,
      "end_date": this.filterEnd_date,
      "geo": this.filterGeo,
      "currency": this.filterCurrency,
      "fiscal_year": this.filterFiscal_year,
      "timeframe": this.filterTimeframe
    }
    bu = this.filterBu;
    start_date = this.filterStart_date;
    end_date = this.filterEnd_date;
    geo = this.filterGeo;
    currency = this.filterCurrency;
    fiscal_year = this.filterFiscal_year;
    timeframe = this.filterTimeframe;

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
                    url: this.base_url+'records?bu='+bu+'&account='+this.top_key_accounts.account_1.account+'&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&geo='+geo
                  },{
                    name: this.top_key_accounts.account_2.account,
                    y: parseInt(this.top_key_accounts.account_2.amount),
                    url: this.base_url+'records?bu='+bu+'&account='+this.top_key_accounts.account_2.account+'&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&geo='+geo
                  },{
                    name: this.top_key_accounts.account_3.account,
                    y: parseInt(this.top_key_accounts.account_3.amount),
                    url: this.base_url+'records?bu='+bu+'&account='+this.top_key_accounts.account_3.account+'&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&geo='+geo
                  },{
                    name: this.top_key_accounts.account_4.account,
                    y: parseInt(this.top_key_accounts.account_4.amount),
                    url: this.base_url+'records?bu='+bu+'&account='+this.top_key_accounts.account_4.account+'&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&geo='+geo
                  },{
                    name: this.top_key_accounts.account_5.account,
                    y: parseInt(this.top_key_accounts.account_5.amount),
                    url: this.base_url+'records?bu='+bu+'&account='+this.top_key_accounts.account_5.account+'&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&geo='+geo
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
    var data =  {
      "bu": this.filterBu,
      "start_date": this.filterStart_date,
      "end_date": this.filterEnd_date,
      "geo": this.filterGeo,
      "currency": this.filterCurrency,
      "fiscal_year": this.filterFiscal_year,
      "timeframe": this.filterTimeframe
    }
    bu = this.filterBu;
    geo = this.filterGeo;
    fiscal_year = this.filterFiscal_year;

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
    var data =  {
      "bu": this.filterBu,
      "start_date": this.filterStart_date,
      "end_date": this.filterEnd_date,
      "geo": this.filterGeo,
      "currency": this.filterCurrency,
      "fiscal_year": this.filterFiscal_year,
      "timeframe": this.filterTimeframe
    }
    bu = this.filterBu;
    start_date = this.filterStart_date;
    end_date = this.filterEnd_date;
    geo = this.filterGeo;
    currency = this.filterCurrency;
    fiscal_year = this.filterFiscal_year;
    timeframe = this.filterTimeframe;

    this.dataService.getNewCustomersAcquired(data).subscribe(
      res => {
        if(res.result.status == "true"){
          this.newCustomers = res.result.count;
        }
      }
    );    
  }

  getBidWinRate(bu, start_date, end_date, geo, currency, timeframe, fiscal_year){
    var data =  {
      "bu": this.filterBu,
      "start_date": this.filterStart_date,
      "end_date": this.filterEnd_date,
      "geo": this.filterGeo,
      "currency": this.filterCurrency,
      "fiscal_year": this.filterFiscal_year,
      "timeframe": this.filterTimeframe
    }
    bu = this.filterBu;
    start_date = this.filterStart_date;
    end_date = this.filterEnd_date;
    geo = this.filterGeo;
    currency = this.filterCurrency;
    fiscal_year = this.filterFiscal_year;
    timeframe = this.filterTimeframe;

    this.dataService.getBidWinRate(data).subscribe(
      res => {
        if(res.result.status == "true"){
          this.bidWinRate = res.result.result.winrate;
        }
      }
    );    
  }

  getAvgOrderCycle(bu, start_date, end_date, geo, currency, timeframe, fiscal_year){
    var data =  {
      "bu": this.filterBu,
      "start_date": this.filterStart_date,
      "end_date": this.filterEnd_date,
      "geo": this.filterGeo,
      "currency": this.filterCurrency,
      "fiscal_year": this.filterFiscal_year,
      "timeframe": this.filterTimeframe
    }
    bu = this.filterBu;
    start_date = this.filterStart_date;
    end_date = this.filterEnd_date;
    geo = this.filterGeo;
    currency = this.filterCurrency;
    fiscal_year = this.filterFiscal_year;
    timeframe = this.filterTimeframe;

    this.dataService.getAvgOrderCycle(data).subscribe(
      res => {
        if(res.result.status == "true"){
          this.avgOrderCycle = res.result.result.avgordercycle;
        }
      }
    );    
  }

  getAvgOrderSize(bu, start_date, end_date, geo, currency, timeframe, fiscal_year){
    var data =  {
      "bu": this.filterBu,
      "start_date": this.filterStart_date,
      "end_date": this.filterEnd_date,
      "geo": this.filterGeo,
      "currency": this.filterCurrency,
      "fiscal_year": this.filterFiscal_year,
      "timeframe": this.filterTimeframe
    }
    bu = this.filterBu;
    start_date = this.filterStart_date;
    end_date = this.filterEnd_date;
    geo = this.filterGeo;
    currency = this.filterCurrency;
    fiscal_year = this.filterFiscal_year;
    timeframe = this.filterTimeframe;

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
    var data =  {
      "bu": this.filterBu,
      "start_date": this.filterStart_date,
      "end_date": this.filterEnd_date,
      "geo": this.filterGeo,
      "currency": this.filterCurrency,
      "fiscal_year": this.filterFiscal_year,
      "timeframe": this.filterTimeframe
    }
    bu = this.filterBu;
    start_date = this.filterStart_date;
    end_date = this.filterEnd_date;
    geo = this.filterGeo;
    currency = this.filterCurrency;
    fiscal_year = this.filterFiscal_year;
    timeframe = this.filterTimeframe;

    this.dataService.getOrderRunRate(data).subscribe(
      res => {
        if(res.result.status == "true"){
          this.orderRunRate = res.result.result.runrate;
        }
      }
    );    
  }

  getEstimatedRunRate(bu, start_date, end_date, geo, currency, timeframe, fiscal_year){
    var data =  {
      "bu": this.filterBu,
      "start_date": this.filterStart_date,
      "end_date": this.filterEnd_date,
      "geo": this.filterGeo,
      "currency": this.filterCurrency,
      "fiscal_year": this.filterFiscal_year,
      "timeframe": this.filterTimeframe
    }
    bu = this.filterBu;
    start_date = this.filterStart_date;
    end_date = this.filterEnd_date;
    geo = this.filterGeo;
    currency = this.filterCurrency;
    fiscal_year = this.filterFiscal_year;
    timeframe = this.filterTimeframe;

    this.dataService.getEstimatedRunRate(data).subscribe(
      res => {
        if(res.result.status == "true"){
          this.estimatedRunRate = res.result.result.runrate;
        }
      }
    );    
  }

  getRequiredRunRate(bu, start_date, end_date, geo, currency, timeframe, fiscal_year){
    var data =  {
      "bu": this.filterBu,
      "start_date": this.filterStart_date,
      "end_date": this.filterEnd_date,
      "geo": this.filterGeo,
      "currency": this.filterCurrency,
      "fiscal_year": this.filterFiscal_year,
      "timeframe": this.filterTimeframe
    }
    bu = this.filterBu;
    start_date = this.filterStart_date;
    end_date = this.filterEnd_date;
    geo = this.filterGeo;
    currency = this.filterCurrency;
    fiscal_year = this.filterFiscal_year;
    timeframe = this.filterTimeframe;

    this.dataService.getRequiredRunRate(data).subscribe(
      res => {
        if(res.result.status == "true"){
          this.requiredRunRate = res.result.result.runrate;
        }
      }
    );    
  }

  getSalesRunRate(bu, start_date, end_date, geo, currency, timeframe, fiscal_year){
    var data =  {
      "bu": this.filterBu,
      "start_date": this.filterStart_date,
      "end_date": this.filterEnd_date,
      "geo": this.filterGeo,
      "currency": this.filterCurrency,
      "fiscal_year": this.filterFiscal_year,
      "timeframe": this.filterTimeframe
    }
    bu = this.filterBu;
    start_date = this.filterStart_date;
    end_date = this.filterEnd_date;
    geo = this.filterGeo;
    currency = this.filterCurrency;
    fiscal_year = this.filterFiscal_year;
    timeframe = this.filterTimeframe;

    this.dataService.getSalesRunRate(data).subscribe(
      res => {
        if(res.result.status == "true"){
          this.salesRunRate = res.result.result.runrate;
        }
      }
    );    
  }

  getSalesEstimatedRunRate(bu, start_date, end_date, geo, currency, timeframe, fiscal_year){
    var data =  {
      "bu": this.filterBu,
      "start_date": this.filterStart_date,
      "end_date": this.filterEnd_date,
      "geo": this.filterGeo,
      "currency": this.filterCurrency,
      "fiscal_year": this.filterFiscal_year,
      "timeframe": this.filterTimeframe
    }
    bu = this.filterBu;
    start_date = this.filterStart_date;
    end_date = this.filterEnd_date;
    geo = this.filterGeo;
    currency = this.filterCurrency;
    fiscal_year = this.filterFiscal_year;
    timeframe = this.filterTimeframe;

    this.dataService.getSalesEstimatedRunRate(data).subscribe(
      res => {
        if(res.result.status == "true"){
          this.salesEstimatedRunRate = res.result.result.runrate;
        }
      }
    );    
  }

  getSalesRequiredRunRate(bu, start_date, end_date, geo, currency, timeframe, fiscal_year){
    var data =  {
      "bu": this.filterBu,
      "start_date": this.filterStart_date,
      "end_date": this.filterEnd_date,
      "geo": this.filterGeo,
      "currency": this.filterCurrency,
      "fiscal_year": this.filterFiscal_year,
      "timeframe": this.filterTimeframe
    }
    bu = this.filterBu;
    start_date = this.filterStart_date;
    end_date = this.filterEnd_date;
    geo = this.filterGeo;
    currency = this.filterCurrency;
    fiscal_year = this.filterFiscal_year;
    timeframe = this.filterTimeframe;

    this.dataService.getSalesRequiredRunRate(data).subscribe(
      res => {
        if(res.result.status == "true"){
          this.salesRequiredRunRate = res.result.result.runrate;
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
    var data =  {
      "bu": this.filterBu,
      "start_date": this.filterStart_date,
      "end_date": this.filterEnd_date,
      "geo": this.filterGeo,
      "currency": this.filterCurrency,
      "fiscal_year": this.filterFiscal_year,
      "timeframe": this.filterTimeframe
    }
    bu = this.filterBu;
    start_date = this.filterStart_date;
    end_date = this.filterEnd_date;
    geo = this.filterGeo;
    currency = this.filterCurrency;
    fiscal_year = this.filterFiscal_year;
    timeframe = this.filterTimeframe;
    this.dataService.getOrderConversionOpp(data).subscribe(
      res => {
          if(res.result.status == "true"){if(res.result.result.percentage == "-"){
            this.orderOppPerValue = res.result.result.percentage;
          }else{
            this.orderOppPerValue = res.result.result.percentage+'%';
          }
          // this.actual_timeframe = res.result.result.actual_time_frame;
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
    var data =  {
      "bu": this.filterBu,
      "start_date": this.filterStart_date,
      "end_date": this.filterEnd_date,
      "geo": this.filterGeo,
      "currency": this.filterCurrency,
      "fiscal_year": this.filterFiscal_year,
      "timeframe": this.filterTimeframe
    }
    bu = this.filterBu;
    start_date = this.filterStart_date;
    end_date = this.filterEnd_date;
    geo = this.filterGeo;
    currency = this.filterCurrency;
    fiscal_year = this.filterFiscal_year;
    timeframe = this.filterTimeframe;
    this.dataService.getOrderConversionAmt(data).subscribe(
      res => {
        if(res.result.status == "true"){
          if(res.result.result.percentage == "-"){
            this.orderAmtPerValue = res.result.result.percentage;
          }else{
            this.orderAmtPerValue = res.result.result.percentage+'%';
          }
          this.actual_timeframe = res.result.result.actual_time_frame;
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
      "bu": this.filterBu,
      "start_date": this.filterStart_date,
      "end_date": this.filterEnd_date,
      "geo": this.filterGeo,
      "currency": this.filterCurrency,
      "fiscal_year": this.filterFiscal_year,
      "timeframe": this.filterTimeframe
    }
    bu = this.filterBu;
    start_date = this.filterStart_date;
    end_date = this.filterEnd_date;
    geo = this.filterGeo;
    currency = this.filterCurrency;
    fiscal_year = this.filterFiscal_year;
    timeframe = this.filterTimeframe;
    this.dataService.getOrderOverview(data).subscribe(
      res => {
        if(res.result.status == "true"){
          var per = parseFloat(res.result.result.percentage)
          this.currentBC = res.result.result.achieved.currentbc;
          this.pipelineClassify = res.result.result.achieved.classify;
          this.geoClassify = res.result.result.achieved.geoclassify;
          this.subProjectClassify = res.result.result.achieved.subProject;
          this.typeOfCustomer = res.result.result.achieved.typeofcustomer;
          this.rankAging = res.result.result.achieved.rankaging;
          this.fRankOpen = res.result.result.achieved.open.F;
          this.fRankTogo = res.result.result.achieved.toGo.F;
          const chart_order = Highcharts.chart('chart-gauge-order', {
            chart: {
              type: 'solidgauge',
            },
            title: {
              text: '<span style="font-size: 15px;">Target - '+ parseInt(res.result.result.totalTarget)+'<br>Act - '+parseInt(res.result.result.achieved.value)+'</span>',
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
              center: ['50%', '99%'],
              size: '195%',
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
                  if(e.seriesOptions.name == 'Open' || e.seriesOptions.name == 'To Go' || e.seriesOptions.name == 'Confirmed') {
                    chart.setTitle({ text: '<div style="text-align: right;"><span style="color:rgb(70, 121, 167); font-size:small;">Est vs Tar '+res.result.result.achieved.vs_budget_value+' ['+res.result.result.achieved.vs_budget_per+'%]<br>Est vs '+(parseInt(res.result.result.achieved.currentbc)-1)+'BC '+res.result.result.achieved.vs_bc+' ['+res.result.result.achieved.vs_bc_per+'%]'+'<br/>Funnel Ratio: '+res.result.result.achieved.funnel_ratio+'X</span></div>' });
                  }else{
                    chart.setTitle({ text: "" });
                  }
                }
              }
            },
            title: {
                text: '<div style="text-align: right;"><span style="color:rgb(70, 121, 167); font-size:small;">Est vs Tar '+res.result.result.achieved.vs_budget_value+' ['+res.result.result.achieved.vs_budget_per+'%]<br>Est vs '+(parseInt(res.result.result.achieved.currentbc)-1)+'BC '+res.result.result.achieved.vs_bc+' ['+res.result.result.achieved.vs_bc_per+'%]'+'<br/>Funnel Ratio: '+res.result.result.achieved.funnel_ratio+'X</span></div>' ,
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
            colors: ['rgb(70,121,167)', 'rgb(162,197,238)', 'rgb(85,121,190)', 'rgb(81,200,244)', 'rgb(127,127,127)', 'rgb(122,148,228)', 'rgb(132,174,220)', 'rgb(143,163,213)'],
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
              name: 'Act',
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
                drilldown: 'actual estimate'
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
                    formatter: function() {
                      if (this.y > 0) {
                        return this.point.name + ' ' +this.point.y
                      }
                    },
                    // format: '<span style="font-weight:normal;color:black;fill:white;">{point.name} {point.y}</span>',
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
                    url: this.base_url+'records?bu='+bu+'&geo='+geo+'&currency='+currency+'&type=open&rank=A&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=order_overview'
                  },
                  {
                    name: 'B',
                    y: parseInt(res.result.result.achieved.open.B),
                    url: this.base_url+'records?bu='+bu+'&geo='+geo+'&currency='+currency+'&type=open&rank=B&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=order_overview'
                  },
                  {
                    name: 'C',
                    y: parseInt(res.result.result.achieved.open.C),
                    url: this.base_url+'records?bu='+bu+'&geo='+geo+'&currency='+currency+'&type=open&rank=C&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=order_overview'
                  },
                  {
                    name: 'D',
                    y: parseInt(res.result.result.achieved.open.D),
                    url: this.base_url+'records?bu='+bu+'&geo='+geo+'&currency='+currency+'&type=open&rank=D&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=order_overview'
                  },
                  {
                    name: 'E',
                    y: parseInt(res.result.result.achieved.open.E),
                    url: this.base_url+'records?bu='+bu+'&geo='+geo+'&currency='+currency+'&type=open&rank=E&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=order_overview'
                  },
                  {
                    name: 'S',
                    y: parseInt(res.result.result.achieved.confirmed.S),
                    url: this.base_url+'records?bu='+bu+'&geo='+geo+'&currency='+currency+'&type=open&rank=S&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=order_overview'
                  }
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
                    formatter: function() {
                      if (this.y > 0) {
                        return this.point.name + ' ' +this.point.y
                      }
                    },
                    // format: '<span style="font-weight:normal;color:black;fill:white;">{point.name} {point.y}</span>',
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
                      url: this.base_url+'records?bu='+bu+'&geo='+geo+'&currency='+currency+'&type=toGo&rank=A&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=order_overview'
                    },
                    {
                      name: 'B',
                      y: parseInt(res.result.result.achieved.toGo.B),
                      url: this.base_url+'records?bu='+bu+'&geo='+geo+'&currency='+currency+'&type=toGo&rank=B&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=order_overview'
                    },
                    {
                      name: 'C',
                      y: parseInt(res.result.result.achieved.toGo.C),
                      url: this.base_url+'records?bu='+bu+'&geo='+geo+'&currency='+currency+'&type=toGo&rank=C&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=order_overview'
                    },
                    {
                      name: 'D',
                      y: parseInt(res.result.result.achieved.toGo.D),
                      url: this.base_url+'records?bu='+bu+'&geo='+geo+'&currency='+currency+'&type=toGo&rank=D&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=order_overview'
                    },
                    {
                      name: 'E',
                      y: parseInt(res.result.result.achieved.toGo.E),
                      url: this.base_url+'records?bu='+bu+'&geo='+geo+'&currency='+currency+'&type=toGo&rank=E&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=order_overview'
                    },
                    {
                      name: 'S',
                      y: parseInt(res.result.result.achieved.toGo.S),
                      url: this.base_url+'records?bu='+bu+'&geo='+geo+'&currency='+currency+'&type=toGo&rank=S&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=order_overview'
                    }
                  ]
                },
                {
                  name: 'O-Pipepline',
                  type: 'pie',
                  id: 'Confirmed Pipeline',
                  dataLabels: {
                    enabled: true,
                    formatter: function() {
                      if (this.y > 0) {
                        return this.point.name + ' ' +this.point.y
                      }
                    },
                    // format: '<span style="font-weight:normal;color:black;fill:white;">{point.name} {point.y}</span>',
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
                    name: 'Act(Current Month)',
                    y: parseInt(res.result.result.achieved.confirmed.Act),
                    url: this.base_url+'records?bu='+bu+'&geo='+geo+'&currency='+currency+'&type=open&rank=act&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=order_overview&current_month=true'
                  },
                  {
                    name: 'YTD Act',
                    y: parseInt(res.result.result.achieved.confirmed.Act_BC),
                    url: this.base_url+'records?bu='+bu+'&geo='+geo+'&currency='+currency+'&type=toGo&rank=act&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=order_overview'
                  }
                  ]
                },
                {
                  name: 'A-Estimate',
                  type: 'pie',
                  id: 'actual estimate',
                  dataLabels: {
                    enabled: true,
                    formatter: function() {
                      if (this.y > 0) {
                        return this.point.name + ' ' +this.point.y
                      }
                    },
                    // format: '<span style="font-weight:normal;color:black;fill:white;">{point.name} {point.y}</span>',
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
                    y: parseInt(res.result.result.achieved.confirmed.Act_BC),
                    url: this.base_url+'records?bu='+bu+'&geo='+geo+'&currency='+currency+'&type=toGo&rank=act&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=order_overview'
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
      "bu": this.filterBu,
      "start_date": this.filterStart_date,
      "end_date": this.filterEnd_date,
      "geo": this.filterGeo,
      "currency": this.filterCurrency,
      "fiscal_year": this.filterFiscal_year,
      "timeframe": this.filterTimeframe
    }
    bu = this.filterBu;
    start_date = this.filterStart_date;
    end_date = this.filterEnd_date;
    geo = this.filterGeo;
    currency = this.filterCurrency;
    fiscal_year = this.filterFiscal_year;
    timeframe = this.filterTimeframe;
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
              text: '<span style="font-size: 15px;">Target - '+ parseInt(res.result.result.totalTarget)+'<br>Act - '+parseInt(res.result.result.achieved.value)+'</span>',
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
              center: ['50%', '99%'],
              size: '195%',
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
                  if(e.seriesOptions.name == 'Open' || e.seriesOptions.name == 'To Go' || e.seriesOptions.name == 'Confirmed') {
                    chart.setTitle({ text: '<div style="text-align: right;"><span style="color:rgb(70, 121, 167); font-size:small;">Est vs Tar '+res.result.result.achieved.vs_budget_value+' ['+res.result.result.achieved.vs_budget_per+'%]<br>Est vs '+(parseInt(res.result.result.achieved.currentbc)-1)+'BC '+res.result.result.achieved.vs_bc+' ['+res.result.result.achieved.vs_bc_per+'%]</span></div>' });
                  }else{
                    chart.setTitle({ text: "" });
                  }
                }
              }
            },
            title: {
                text: '<div style="text-align: right;"><span style="color:rgb(70, 121, 167); font-size:small;">Est vs Tar '+res.result.result.achieved.vs_budget_value+' ['+res.result.result.achieved.vs_budget_per+'%]<br>Est vs '+(parseInt(res.result.result.achieved.currentbc)-1)+'BC '+res.result.result.achieved.vs_bc+' ['+res.result.result.achieved.vs_bc_per+'%]</span></div>' ,
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
            colors: ['rgb(70,121,167)', 'rgb(162,197,238)', 'rgb(85,121,190)', 'rgb(81,200,244)', 'rgb(127,127,127)', 'rgb(122,148,228)', 'rgb(132,174,220)', 'rgb(143,163,213)'],
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
              // }, {
              //   name: 'Pipeline',
              //   y: 0,
              //   drilldown: ''
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
              // }, {
              //   name: 'Pipeline',
              //   y: parseInt(res.result.result.achieved.open.value),
              //   drilldown: 'togOrder Pipeline'
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
              // }, {
              //   name: 'Pipeline',
              //   y: parseInt(res.result.result.achieved.confirmed.value),
              //   drilldown: 'Confirmed Pipeline'
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
              // }, {
              //   name: 'Pipeline',
              //   y: 0,
              //   drilldown: ''
              }, {
                name: 'Estimate',
                y: parseInt(res.result.result.achieved.toGo.value),
                // y: 25,
                drilldown: 'togOrder Estimate'
              }]
            }, {
              name: 'Act',
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
              // }, {
              //   name: 'Pipeline',
              //   y: 0,
              //   drilldown: ''
              }, {
                name: 'Estimate',
                y: parseInt(res.result.result.achieved.actual),
                drilldown: 'actual Estimate'
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
                    formatter: function() {
                      if (this.y > 0) {
                        return this.point.name + ' ' +this.point.y
                      }
                    },
                    // format: '<span style="font-weight:normal;color:black;fill:white;">{point.name} {point.y}</span>',
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
                    url: this.base_url+'records?bu='+bu+'&geo='+geo+'&currency='+currency+'&type=open&rank=A&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=sales_overview'
                  },
                  {
                    name: 'B',
                    y: parseInt(res.result.result.achieved.open.B),
                    url: this.base_url+'records?bu='+bu+'&geo='+geo+'&currency='+currency+'&type=open&rank=B&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=sales_overview'
                  },
                  {
                    name: 'C',
                    y: parseInt(res.result.result.achieved.open.C),
                    url: this.base_url+'records?bu='+bu+'&geo='+geo+'&currency='+currency+'&type=open&rank=C&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=sales_overview'
                  },
                  {
                    name: 'D',
                    y: parseInt(res.result.result.achieved.open.D),
                    url: this.base_url+'records?bu='+bu+'&geo='+geo+'&currency='+currency+'&type=open&rank=D&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=sales_overview'
                  },
                  {
                    name: 'E',
                    y: parseInt(res.result.result.achieved.open.E),
                    url: this.base_url+'records?bu='+bu+'&geo='+geo+'&currency='+currency+'&type=open&rank=E&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=sales_overview'
                  }
                  // {
                  //   name: 'F',
                  //   y: parseInt(res.result.result.achieved.open.F),
                  //   url: this.base_url+'records?bu='+bu+'&geo='+geo+'&currency='+currency+'&type=open&rank=F&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=sales_overview'
                  // }
                  ]
                }, {
                  name: 'Order Estimate',
                  type: 'pie',
                  id: 'togOrder Estimate',
                  dataLabels: {
                    enabled: true,
                    formatter: function() {
                      if (this.y > 0) {
                        return this.point.name + ' ' +this.point.y
                      }
                    },
                    // format: '<span style="font-weight:normal;color:black;fill:white;">{point.name} {point.y}</span>',
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
                      url: this.base_url+'records?bu='+bu+'&geo='+geo+'&currency='+currency+'&type=toGo&rank=A&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=sales_overview'
                    },
                    {
                      name: 'B',
                      y: parseInt(res.result.result.achieved.toGo.B),
                      url: this.base_url+'records?bu='+bu+'&geo='+geo+'&currency='+currency+'&type=toGo&rank=B&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=sales_overview'
                    },
                    {
                      name: 'C',
                      y: parseInt(res.result.result.achieved.toGo.C),
                      url: this.base_url+'records?bu='+bu+'&geo='+geo+'&currency='+currency+'&type=toGo&rank=C&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=sales_overview'
                    },
                    {
                      name: 'D',
                      y: parseInt(res.result.result.achieved.toGo.D),
                      url: this.base_url+'records?bu='+bu+'&geo='+geo+'&currency='+currency+'&type=toGo&rank=D&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=sales_overview'
                    },
                    {
                      name: 'E',
                      y: parseInt(res.result.result.achieved.toGo.E),
                      url: this.base_url+'records?bu='+bu+'&geo='+geo+'&currency='+currency+'&type=toGo&rank=E&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=sales_overview'
                    }
                    // {
                    //   name: 'F',
                    //   y: parseInt(res.result.result.achieved.toGo.F),
                    //   url: this.base_url+'records?bu='+bu+'&geo='+geo+'&currency='+currency+'&type=toGo&rank=F&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=sales_overview'
                    // }
                  ]
                },
                {
                  name: 'O-Pipepline',
                  type: 'pie',
                  id: 'Confirmed Pipeline',
                  dataLabels: {
                    enabled: true,
                    formatter: function() {
                      if (this.y > 0) {
                        return this.point.name + ' ' +this.point.y
                      }
                    },
                    // format: '<span style="font-weight:normal;color:black;fill:white;">{point.name} {point.y}</span>',
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
                    url: this.base_url+'records?bu='+bu+'&geo='+geo+'&currency='+currency+'&type=open&rank=act&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=sales_overview'
                  },
                  {
                    name: 'A',
                    y: parseInt(res.result.result.achieved.confirmed.A),
                    url: this.base_url+'records?bu='+bu+'&geo='+geo+'&currency='+currency+'&type=open&rank=A&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=sales_overview'
                  },
                  // {
                  //   name: 'B',
                  //   y: parseInt(res.result.result.achieved.confirmed.B),
                  //   url: this.base_url+'records?bu='+bu+'&geo='+geo+'&start_date='+start_date+'&end_date='+end_date+'&currency='+currency+'&type=open&rank=S&timeframe='+timeframe
                  // }
                  ]
                }, {
                  name: 'Order Estimate',
                  type: 'pie',
                  id: 'actual Estimate',
                  dataLabels: {
                    enabled: true,
                    formatter: function() {
                      if (this.y > 0) {
                        return this.point.name + ' ' +this.point.y
                      }
                    },
                    // format: '<span style="font-weight:normal;color:black;fill:white;">{point.name} {point.y}</span>',
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
                      y: parseInt(res.result.result.achieved.actual),
                      url: this.base_url+'records?bu='+bu+'&geo='+geo+'&currency='+currency+'&type=toGo&rank=Act&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&api_type=sales_overview'
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

  getLostOpportunities(bu, start_date, end_date, geo, currency, timeframe, fiscal_year): void {
    var data =  {
      "bu": this.filterBu,
      "start_date": this.filterStart_date,
      "end_date": this.filterEnd_date,
      "geo": this.filterGeo,
      "currency": this.filterCurrency,
      "fiscal_year": this.filterFiscal_year,
      "timeframe": this.filterTimeframe
    }
    bu = this.filterBu;
    start_date = this.filterStart_date;
    end_date = this.filterEnd_date;
    geo = this.filterGeo;
    currency = this.filterCurrency;
    fiscal_year = this.filterFiscal_year;
    timeframe = this.filterTimeframe;
    this.dataService.getLostOpportunities(data).subscribe(
      res => {
        var number_of_opp = [
          ['Price', parseInt(res.result.result['Price_sum'])],
          ['Lost to Competition', parseInt(res.result.result['Lost to Competitor_sum'])],
          ['No Budget/Lost Funding', parseInt(res.result.result['No Budget / Lost Funding_sum'])],
          ['No Decision/Non-Responsive', parseInt(res.result.result['No Decision / Non-Responsive_sum'])],
          ['Dropped by BU', parseInt(res.result.result['Dropped by BU_sum'])],
          ['Other', parseInt(res.result.result['Other_sum'])],
          
        ];
        var number_of_opp_number = [
          ['Price', parseInt(res.result.number['Price_sum'])],
          ['Lost to Competition', parseInt(res.result.number['Lost to Competitor_sum'])],
          ['No Budget/Lost Funding', parseInt(res.result.number['No Budget / Lost Funding_sum'])],
          ['No Decision/Non-Responsive', parseInt(res.result.number['No Decision / Non-Responsive_sum'])],
          ['Dropped by BU', parseInt(res.result.number['Dropped by BU_sum'])],
          ['Other', parseInt(res.result.number['Other_sum'])],
          
        ];
        this.chart_lost_opp = Highcharts.chart('chart-pie-lost-opp', {
          chart: {
              type: 'pie'
          },
          colors: ['rgb(70,121,167)','rgb(192, 201, 228)', 'rgb(162,197,238)', 'rgb(124,148,207)', 'rgb(48,137,202)'],
          title: {
              text: res.result.percentage+'%<br>'+res.result.Sum,
              align: 'center',
              verticalAlign: 'middle',
              x: -155
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
                      y: parseFloat(res.result.result['Price']),
                      url: this.base_url+'records?bu='+bu+'&lost_reason=Price&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&geo='+geo
                    },
                    {
                      name: 'Lost to Competition',
                      y: parseFloat(res.result.result['Lost to Competitor']),
                      url: this.base_url+'records?bu='+bu+'&lost_reason=Lost to Competition&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&geo='+geo
                    }, {
                      name: 'No Budget/Lost Funding',
                      y: parseFloat(res.result.result['No Budget / Lost Funding']),
                      url: this.base_url+'records?bu='+bu+'&lost_reason=No Budget / Lost Funding&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&geo='+geo
                    },
                    {
                      name: 'No Decision/Non-Responsive',
                      y: parseFloat(res.result.result['No Decision / Non-Responsive']),
                      url: this.base_url+'records?bu='+bu+'&lost_reason=No Decision / Non-Responsive&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&geo='+geo
                    }, {
                      name: 'Dropped by BU',
                      y: parseFloat(res.result.result['Dropped by BU']),
                      url: this.base_url+'records?bu='+bu+'&lost_reason=Dropped by BU&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&geo='+geo
                    }, {
                      name: 'Other',
                      y: parseFloat(res.result.result['Other']),
                      url: this.base_url+'records?bu='+bu+'&lost_reason=Other&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&geo='+geo
                    }
                  ]
              }
          ]
        } as any);
        this.chart_lost_opp_number = Highcharts.chart('chart-pie-lost-opp-number', {
          chart: {
              type: 'pie'
          },
          colors: ['rgb(70,121,167)','rgb(192, 201, 228)', 'rgb(162,197,238)', 'rgb(124,148,207)', 'rgb(48,137,202)'],
          title: {
              text: res.result.number.percentage+'%<br>'+res.result.number.Total,
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
                  number_of_opp_number.forEach(d => {
                  if(d[0] == point.point['name']){
                    no_of_opp = d[1]
                  }
                })
                return `${point.key} <br> <b>${point.series.name}: ${point.point.y}%</b> <br># of Opp: ${no_of_opp}Mn`
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
              number_of_opp_number.forEach(d => {
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
                      y: parseFloat(res.result.number['Price']),
                      url: this.base_url+'records?bu='+bu+'&lost_reason=Price&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&geo='+geo
                    },
                    {
                      name: 'Lost to Competition',
                      y: parseFloat(res.result.number['Lost to Competitor']),
                      url: this.base_url+'records?bu='+bu+'&lost_reason=Lost to Competition&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&geo='+geo
                    }, {
                      name: 'No Budget/Lost Funding',
                      y: parseFloat(res.result.number['No Budget / Lost Funding']),
                      url: this.base_url+'records?bu='+bu+'&lost_reason=No Budget / Lost Funding&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&geo='+geo
                    },
                    {
                      name: 'No Decision/Non-Responsive',
                      y: parseFloat(res.result.number['No Decision / Non-Responsive']),
                      url: this.base_url+'records?bu='+bu+'&lost_reason=No Decision / Non-Responsive&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&geo='+geo
                    }, {
                      name: 'Dropped by BU',
                      y: parseFloat(res.result.number['Dropped by BU']),
                      url: this.base_url+'records?bu='+bu+'&lost_reason=Dropped by BU&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&geo='+geo
                    }, {
                      name: 'Other',
                      y: parseFloat(res.result.number['Other']),
                      url: this.base_url+'records?bu='+bu+'&lost_reason=Other&timeframe='+timeframe+'&fiscal_year='+fiscal_year+'&geo='+geo
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
      "bu": this.filterBu,
      "start_date": this.filterStart_date,
      "end_date": this.filterEnd_date,
      "geo": this.filterGeo,
      "currency": this.filterCurrency,
      "fiscal_year": this.filterFiscal_year,
      "timeframe": this.filterTimeframe
    }
    bu = this.filterBu;
    start_date = this.filterStart_date;
    end_date = this.filterEnd_date;
    geo = this.filterGeo;
    currency = this.filterCurrency;
    fiscal_year = this.filterFiscal_year;
    timeframe = this.filterTimeframe;

      this.dataService.getOrderTrend(data).subscribe(
        res => {
          var month_data = res.result;
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
            colors: ['rgb(162,197,238)', 'rgb(119,135,186)', 'rgb(117,150,208)', 'rgb(57,93,157)', 'rgb(122,148,228)','rgb(127,127,127)'],      
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
                pointWidth: 70,
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
                  url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month='+month_data.month_1.month+'&fiscal_year='+fiscal_year
                },{
                  name: month_data.month_2.month,
                  y: parseInt(month_data.month_2.E),
                  url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month='+month_data.month_2.month+'&fiscal_year='+fiscal_year
                },{
                  name: month_data.month_3.month,
                  y: parseInt(month_data.month_3.E),
                  url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month='+month_data.month_3.month+'&fiscal_year='+fiscal_year
                },{
                  name: month_data.month_4.month,
                  y: parseInt(month_data.month_4.E),
                  url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month='+month_data.month_4.month+'&fiscal_year='+fiscal_year
                },{
                  name: month_data.month_5.month,
                  y: parseInt(month_data.month_5.E),
                  url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month='+month_data.month_5.month+'&fiscal_year='+fiscal_year
                },{
                  name: month_data.month_6.month,
                  y: parseInt(month_data.month_6.E),
                  url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month='+month_data.month_6.month+'&fiscal_year='+fiscal_year
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
                    url:  this.base_url+'records?bu='+bu+'&rank=D&timeframe='+timeframe+'&month='+month_data.month_1.month+'&fiscal_year='+fiscal_year
                  },{
                    name: month_data.month_2.month,
                    y: parseInt(month_data.month_2.D),
                    url:  this.base_url+'records?bu='+bu+'&rank=D&timeframe='+timeframe+'&month='+month_data.month_2.month+'&fiscal_year='+fiscal_year
                  },{
                    name: month_data.month_3.month,
                    y: parseInt(month_data.month_3.D),
                    url:  this.base_url+'records?bu='+bu+'&rank=D&timeframe='+timeframe+'&month='+month_data.month_3.month+'&fiscal_year='+fiscal_year
                  },{
                    name: month_data.month_4.month,
                    y: parseInt(month_data.month_4.D),
                    url:  this.base_url+'records?bu='+bu+'&rank=D&timeframe='+timeframe+'&month='+month_data.month_4.month+'&fiscal_year='+fiscal_year
                  },{
                    name: month_data.month_5.month,
                    y: parseInt(month_data.month_5.D),
                    url:  this.base_url+'records?bu='+bu+'&rank=D&timeframe='+timeframe+'&month='+month_data.month_5.month+'&fiscal_year='+fiscal_year
                  },{
                    name: month_data.month_6.month,
                    y: parseInt(month_data.month_6.D),
                    url:  this.base_url+'records?bu='+bu+'&rank=D&timeframe='+timeframe+'&month='+month_data.month_6.month+'&fiscal_year='+fiscal_year
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
                  url:  this.base_url+'records?bu='+bu+'&rank=C&timeframe='+timeframe+'&month='+month_data.month_1.month+'&fiscal_year='+fiscal_year
                },{
                  name: month_data.month_2.month,
                  y: parseInt(month_data.month_2.C),
                  url:  this.base_url+'records?bu='+bu+'&rank=C&timeframe='+timeframe+'&month='+month_data.month_2.month+'&fiscal_year='+fiscal_year
                },{
                  name: month_data.month_3.month,
                  y: parseInt(month_data.month_3.C),
                  url:  this.base_url+'records?bu='+bu+'&rank=C&timeframe='+timeframe+'&month='+month_data.month_3.month+'&fiscal_year='+fiscal_year
                },{
                  name: month_data.month_4.month,
                  y: parseInt(month_data.month_4.C),
                  url:  this.base_url+'records?bu='+bu+'&rank=C&timeframe='+timeframe+'&month='+month_data.month_4.month+'&fiscal_year='+fiscal_year
                },{
                  name: month_data.month_5.month,
                  y: parseInt(month_data.month_5.C),
                  url:  this.base_url+'records?bu='+bu+'&rank=C&timeframe='+timeframe+'&month='+month_data.month_5.month+'&fiscal_year='+fiscal_year
                },{
                  name: month_data.month_6.month,
                  y: parseInt(month_data.month_6.C),
                  url:  this.base_url+'records?bu='+bu+'&rank=C&timeframe='+timeframe+'&month='+month_data.month_6.month+'&fiscal_year='+fiscal_year
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
                url:  this.base_url+'records?bu='+bu+'&rank=B&timeframe='+timeframe+'&month='+month_data.month_1.month+'&fiscal_year='+fiscal_year
              },{
                name: month_data.month_2.month,
                y: parseInt(month_data.month_2.B),
                url:  this.base_url+'records?bu='+bu+'&rank=B&timeframe='+timeframe+'&month='+month_data.month_2.month+'&fiscal_year='+fiscal_year
              },{
                name: month_data.month_3.month,
                y: parseInt(month_data.month_3.B),
                url:  this.base_url+'records?bu='+bu+'&rank=B&timeframe='+timeframe+'&month='+month_data.month_3.month+'&fiscal_year='+fiscal_year
              },{
                name: month_data.month_4.month,
                y: parseInt(month_data.month_4.B),
                url:  this.base_url+'records?bu='+bu+'&rank=B&timeframe='+timeframe+'&month='+month_data.month_4.month+'&fiscal_year='+fiscal_year
              },{
                name: month_data.month_5.month,
                y: parseInt(month_data.month_5.B),
                url:  this.base_url+'records?bu='+bu+'&rank=B&timeframe='+timeframe+'&month='+month_data.month_5.month+'&fiscal_year='+fiscal_year
              },{
                name: month_data.month_6.month,
                y: parseInt(month_data.month_6.B),
                url:  this.base_url+'records?bu='+bu+'&rank=B&timeframe='+timeframe+'&month='+month_data.month_6.month+'&fiscal_year='+fiscal_year
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
              url:  this.base_url+'records?bu='+bu+'&rank=A&timeframe='+timeframe+'&month='+month_data.month_1.month+'&fiscal_year='+fiscal_year
            },{
              name: month_data.month_2.month,
              y: parseInt(month_data.month_2.A),
              url:  this.base_url+'records?bu='+bu+'&rank=A&timeframe='+timeframe+'&month='+month_data.month_2.month+'&fiscal_year='+fiscal_year
            },{
              name: month_data.month_3.month,
              y: parseInt(month_data.month_3.A),
              url:  this.base_url+'records?bu='+bu+'&rank=A&timeframe='+timeframe+'&month='+month_data.month_3.month+'&fiscal_year='+fiscal_year
            },{
              name: month_data.month_4.month,
              y: parseInt(month_data.month_4.A),
              url:  this.base_url+'records?bu='+bu+'&rank=A&timeframe='+timeframe+'&month='+month_data.month_4.month+'&fiscal_year='+fiscal_year
            },{
              name: month_data.month_5.month,
              y: parseInt(month_data.month_5.A),
              url:  this.base_url+'records?bu='+bu+'&rank=A&timeframe='+timeframe+'&month='+month_data.month_5.month+'&fiscal_year='+fiscal_year
            },{
              name: month_data.month_6.month,
              y: parseInt(month_data.month_6.A),
              url:  this.base_url+'records?bu='+bu+'&rank=A&timeframe='+timeframe+'&month='+month_data.month_6.month+'&fiscal_year='+fiscal_year
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
          url:  this.base_url+'records?bu='+bu+'&rank=Act&timeframe='+timeframe+'&month='+month_data.month_1.month+'&fiscal_year='+fiscal_year
        },{
          name: month_data.month_2.month,
          y: parseInt(month_data.month_2.Act),
          url:  this.base_url+'records?bu='+bu+'&rank=Act&timeframe='+timeframe+'&month='+month_data.month_2.month+'&fiscal_year='+fiscal_year
        },{
          name: month_data.month_3.month,
          y: parseInt(month_data.month_3.Act),
          url:  this.base_url+'records?bu='+bu+'&rank=Act&timeframe='+timeframe+'&month='+month_data.month_3.month+'&fiscal_year='+fiscal_year
        },{
          name: month_data.month_4.month,
          y: parseInt(month_data.month_4.Act),
          url:  this.base_url+'records?bu='+bu+'&rank=Act&timeframe='+timeframe+'&month='+month_data.month_4.month+'&fiscal_year='+fiscal_year
        },{
          name: month_data.month_5.month,
          y: parseInt(month_data.month_5.Act),
          url:  this.base_url+'records?bu='+bu+'&rank=Act&timeframe='+timeframe+'&month='+month_data.month_5.month+'&fiscal_year='+fiscal_year
        },{
          name: month_data.month_6.month,
          y: parseInt(month_data.month_6.Act),
          url:  this.base_url+'records?bu='+bu+'&rank=Act&timeframe='+timeframe+'&month='+month_data.month_6.month+'&fiscal_year='+fiscal_year
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
          this.chart_line = Highcharts.chart('order-trend-opp', {
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
                categories: [month_data.month_1.month, month_data.month_2.month, month_data.month_3.month, month_data.month_4.month, month_data.month_5.month]
            },
            legend: {
              enabled: false
            },
            colors: ['rgb(162,197,238)', 'rgb(119,135,186)', 'rgb(117,150,208)', 'rgb(57,93,157)', 'rgb(122,148,228)','rgb(127,127,127)'],      
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
                pointWidth: 70,
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
                  y: parseInt(month_data.month_1.E_opp),
                  url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month='+month_data.month_1.month+'&fiscal_year='+fiscal_year
                },{
                  name: month_data.month_2.month,
                  y: parseInt(month_data.month_2.E_opp),
                  url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month='+month_data.month_2.month+'&fiscal_year='+fiscal_year
                },{
                  name: month_data.month_3.month,
                  y: parseInt(month_data.month_3.E_opp),
                  url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month='+month_data.month_3.month+'&fiscal_year='+fiscal_year
                },{
                  name: month_data.month_4.month,
                  y: parseInt(month_data.month_4.E_opp),
                  url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month='+month_data.month_4.month+'&fiscal_year='+fiscal_year
                },{
                  name: month_data.month_5.month,
                  y: parseInt(month_data.month_5.E_opp),
                  url:  this.base_url+'records?bu='+bu+'&rank=E&timeframe='+timeframe+'&month='+month_data.month_5.month+'&fiscal_year='+fiscal_year
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
                    y: parseInt(month_data.month_1.D_opp),
                    url:  this.base_url+'records?bu='+bu+'&rank=D&timeframe='+timeframe+'&month='+month_data.month_1.month+'&fiscal_year='+fiscal_year
                  },{
                    name: month_data.month_2.month,
                    y: parseInt(month_data.month_2.D_opp),
                    url:  this.base_url+'records?bu='+bu+'&rank=D&timeframe='+timeframe+'&month='+month_data.month_2.month+'&fiscal_year='+fiscal_year
                  },{
                    name: month_data.month_3.month,
                    y: parseInt(month_data.month_3.D_opp),
                    url:  this.base_url+'records?bu='+bu+'&rank=D&timeframe='+timeframe+'&month='+month_data.month_3.month+'&fiscal_year='+fiscal_year
                  },{
                    name: month_data.month_4.month,
                    y: parseInt(month_data.month_4.D_opp),
                    url:  this.base_url+'records?bu='+bu+'&rank=D&timeframe='+timeframe+'&month='+month_data.month_4.month+'&fiscal_year='+fiscal_year
                  },{
                    name: month_data.month_5.month,
                    y: parseInt(month_data.month_5.D_opp),
                    url:  this.base_url+'records?bu='+bu+'&rank=D&timeframe='+timeframe+'&month='+month_data.month_5.month+'&fiscal_year='+fiscal_year
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
                  y: parseInt(month_data.month_1.C_opp),
                  url:  this.base_url+'records?bu='+bu+'&rank=C&timeframe='+timeframe+'&month='+month_data.month_1.month+'&fiscal_year='+fiscal_year
                },{
                  name: month_data.month_2.month,
                  y: parseInt(month_data.month_2.C_opp),
                  url:  this.base_url+'records?bu='+bu+'&rank=C&timeframe='+timeframe+'&month='+month_data.month_2.month+'&fiscal_year='+fiscal_year
                },{
                  name: month_data.month_3.month,
                  y: parseInt(month_data.month_3.C_opp),
                  url:  this.base_url+'records?bu='+bu+'&rank=C&timeframe='+timeframe+'&month='+month_data.month_3.month+'&fiscal_year='+fiscal_year
                },{
                  name: month_data.month_4.month,
                  y: parseInt(month_data.month_4.C_opp),
                  url:  this.base_url+'records?bu='+bu+'&rank=C&timeframe='+timeframe+'&month='+month_data.month_4.month+'&fiscal_year='+fiscal_year
                },{
                  name: month_data.month_5.month,
                  y: parseInt(month_data.month_5.C_opp),
                  url:  this.base_url+'records?bu='+bu+'&rank=C&timeframe='+timeframe+'&month='+month_data.month_5.month+'&fiscal_year='+fiscal_year
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
                y: parseInt(month_data.month_1.B_opp),
                url:  this.base_url+'records?bu='+bu+'&rank=B&timeframe='+timeframe+'&month='+month_data.month_1.month+'&fiscal_year='+fiscal_year
              },{
                name: month_data.month_2.month,
                y: parseInt(month_data.month_2.B_opp),
                url:  this.base_url+'records?bu='+bu+'&rank=B&timeframe='+timeframe+'&month='+month_data.month_2.month+'&fiscal_year='+fiscal_year
              },{
                name: month_data.month_3.month,
                y: parseInt(month_data.month_3.B_opp),
                url:  this.base_url+'records?bu='+bu+'&rank=B&timeframe='+timeframe+'&month='+month_data.month_3.month+'&fiscal_year='+fiscal_year
              },{
                name: month_data.month_4.month,
                y: parseInt(month_data.month_4.B_opp),
                url:  this.base_url+'records?bu='+bu+'&rank=B&timeframe='+timeframe+'&month='+month_data.month_4.month+'&fiscal_year='+fiscal_year
              },{
                name: month_data.month_5.month,
                y: parseInt(month_data.month_5.B_opp),
                url:  this.base_url+'records?bu='+bu+'&rank=B&timeframe='+timeframe+'&month='+month_data.month_5.month+'&fiscal_year='+fiscal_year
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
              y: parseInt(month_data.month_1.A_opp),
              url:  this.base_url+'records?bu='+bu+'&rank=A&timeframe='+timeframe+'&month='+month_data.month_1.month+'&fiscal_year='+fiscal_year
            },{
              name: month_data.month_2.month,
              y: parseInt(month_data.month_2.A_opp),
              url:  this.base_url+'records?bu='+bu+'&rank=A&timeframe='+timeframe+'&month='+month_data.month_2.month+'&fiscal_year='+fiscal_year
            },{
              name: month_data.month_3.month,
              y: parseInt(month_data.month_3.A_opp),
              url:  this.base_url+'records?bu='+bu+'&rank=A&timeframe='+timeframe+'&month='+month_data.month_3.month+'&fiscal_year='+fiscal_year
            },{
              name: month_data.month_4.month,
              y: parseInt(month_data.month_4.A_opp),
              url:  this.base_url+'records?bu='+bu+'&rank=A&timeframe='+timeframe+'&month='+month_data.month_4.month+'&fiscal_year='+fiscal_year
            },{
              name: month_data.month_5.month,
              y: parseInt(month_data.month_5.A_opp),
              url:  this.base_url+'records?bu='+bu+'&rank=A&timeframe='+timeframe+'&month='+month_data.month_5.month+'&fiscal_year='+fiscal_year
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
          y: parseInt(month_data.month_1.Act_opp),
          url:  this.base_url+'records?bu='+bu+'&rank=Act&timeframe='+timeframe+'&month='+month_data.month_1.month+'&fiscal_year='+fiscal_year
        },{
          name: month_data.month_2.month,
          y: parseInt(month_data.month_2.Act_opp),
          url:  this.base_url+'records?bu='+bu+'&rank=Act&timeframe='+timeframe+'&month='+month_data.month_2.month+'&fiscal_year='+fiscal_year
        },{
          name: month_data.month_3.month,
          y: parseInt(month_data.month_3.Act_opp),
          url:  this.base_url+'records?bu='+bu+'&rank=Act&timeframe='+timeframe+'&month='+month_data.month_3.month+'&fiscal_year='+fiscal_year
        },{
          name: month_data.month_4.month,
          y: parseInt(month_data.month_4.Act_opp),
          url:  this.base_url+'records?bu='+bu+'&rank=Act&timeframe='+timeframe+'&month='+month_data.month_4.month+'&fiscal_year='+fiscal_year
        },{
          name: month_data.month_5.month,
          y: parseInt(month_data.month_5.Act_opp),
          url:  this.base_url+'records?bu='+bu+'&rank=Act&timeframe='+timeframe+'&month='+month_data.month_5.month+'&fiscal_year='+fiscal_year
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
