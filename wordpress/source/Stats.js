enyo.kind({
  name: 'wp.Stats',
  kind: 'VFlexBox',
  published: {
    account:null
  },
  components: [
    { name:'statsService', kind:'StatsService', onApiReady:'statsServiceReady'},
    { name:'statsChart', kind:'Pane', height:'210px', components:[
        { name:'statsChartSpinner', kind:'enyo.SpinnerLarge' },
        { name:'statsChartPlot', style:'width: 790px; height: 200px' }
    ]},
    { kind:'HFlexBox', flex:4, components:[
        { name:'statsReferrer', kind:'Pane', style: 'width: 50%', components:[
            { name:'statsReferrerSpinner', kind:'enyo.Spinner' },
            { name:'statsReferrerList', kind:'enyo.VirtualList', onSetupRow:'setupReferrerRow', style:'height: 100%', components:[
                { kind:'Item', components:[
                    { kind:'HFlexBox', components:[
                        { name:'refTitle', flex:1 },
                        { name:'refValue'}
                    ]}
                ]}
            ]}
        ]},
        { name:'statsPosts', kind:'Pane', style: 'width: 50%', components:[
            { name:'statsPostsSpinner', kind:'enyo.Spinner' },
            { name:'statsPostsList', kind:'enyo.VirtualList', onSetupRow:'setupPostsRow', style:'height: 100%', components:[
                { kind:'Item', components:[
                    { kind:'HFlexBox', components:[
                        { name:'postTitle', flex:1 },
                        { name:'postValue'}
                    ]}
                ]}
            ]}
        ]}
    ]},
    { kind:'HFlexBox', flex:4, components:[
        { name:'statsKeywords', kind:'Pane', style: 'width: 50%', components:[
            { name:'statsKeywordsSpinner', kind:'enyo.Spinner' },
            { name:'statsKeywordsList', kind:'enyo.VirtualList', onSetupRow:'setupKeywordsRow', style:'height: 100%', components:[
                { kind:'Item', components:[
                    { kind:'HFlexBox', components:[
                        { name:'keywordTitle', flex:1 },
                        { name:'keywordValue'}
                    ]}
                ]}
            ]}
        ]},
        { name:'statsClicks', kind:'Pane', style: 'width: 50%', components:[
            { name:'statsClicksSpinner', kind:'enyo.Spinner' },
            { name:'statsClicksList', kind:'enyo.VirtualList', onSetupRow:'setupClicksRow', style:'height: 100%', components:[
                { kind:'Item', components:[
                    { kind:'HFlexBox', components:[
                        { name:'clickTitle', flex:1 },
                        { name:'clickValue'}
                    ]}
                ]}
            ]}
        ]}
    ]}
  ],
  referrerData:[],
  create: function(){
    this.inherited(arguments);
    this.$.statsChartSpinner.show();
    this.$.statsReferrerSpinner.show();
    this.$.statsPostsSpinner.show();
    this.$.statsKeywordsSpinner.show();
    this.$.statsClicksSpinner.show();
  },
  accountChanged:function(){
    if (this.$.statsChartPlot.node) {
        this.$.statsChartPlot.node.innerHTML = "";
    }
    this.$.statsReferrerList.punt();
    this.$.statsPostsList.punt();
    this.$.statsKeywordsList.punt();
    this.$.statsClicksList.punt();

    this.$.statsChart.selectView(this.$.statsChartSpinner);
    this.$.statsReferrer.selectView(this.$.statsReferrerSpinner);
    this.$.statsPosts.selectView(this.$.statsPostsSpinner);
    this.$.statsKeywords.selectView(this.$.statsKeywordsSpinner);
    this.$.statsClicks.selectView(this.$.statsClicksSpinner);

    if (this.account == null) {
      return;
    };
    
    this.$.statsService.setAccount(this.account);
  },
  statsServiceReady:function() {
    console.log('Stats service ready, getting stats');
    this.$.statsService.callStats({table:'views', period:'days', days:30}, {onSuccess:'gotViews'});
    this.$.statsService.callStats({table:'referrers', summarize:'1'}, {onSuccess:'gotReferrers'});
    this.$.statsService.callStats({table:'postviews', summarize:'1'}, {onSuccess:'gotPosts'});
    this.$.statsService.callStats({table:'searchterms', summarize:'1'}, {onSuccess:'gotKeywords'});
    this.$.statsService.callStats({table:'clicks', summarize:'1'}, {onSuccess:'gotClicks'});
  },
  gotViews:function(sender, response, request) {
    this.$.statsChart.selectView(this.$.statsChartPlot);
    if (response == null) return false;
    var data = [];
    var labels = [];
    for (var i = response.length - 1; i >= 0; i--){
        data[i] = [i, response[i].views];
        labels[i] = response[i].date;
    };
    jQuery.plot(jQuery('#' + this.$.statsChartPlot.id), [{
        "label":"Views",
        "data":data
    }],{
        series: {
            stack: true,
            bars: {
                show: true,
                lineWidth: 0,
                fill: 1,
                align: "center",
                barWidth: 0.9,
                shadowSize: 0
            }
        },
        grid: {
            hoverable: true,
            backgroundColor: "#fff",
            borderWidth: 0,
            clickable: true,
        },
        xaxis: {
            tickLength: 0,
            tickDecimals: 0,
            min: 0.45,
            max: 26.55,
            tickFormatter: function(val, axis) {
                return labels[val];
            }
        },
        colors: ["#a3bcd3", "#14568a"]
    });        
  },
  gotReferrers: function(sender, response, request) {
      this.referrerData = response;
      this.$.statsReferrer.selectView(this.$.statsReferrerList);
      this.$.statsReferrerList.refresh();
  },
  gotPosts: function(sender, response, request) {
      this.postsData = response;
      this.$.statsPosts.selectView(this.$.statsPostsList);
      this.$.statsPostsList.refresh();
  },
  gotKeywords: function(sender, response, request) {
      this.keywordsData = response;
      this.$.statsKeywords.selectView(this.$.statsKeywordsList);
      this.$.statsKeywordsList.refresh();
  },
  gotClicks: function(sender, response, request) {
      this.clicksData = response;
      this.$.statsClicks.selectView(this.$.statsClicksList);
      this.$.statsClicksList.refresh();
  },
  setupReferrerRow: function(inSender, inIndex){
      if (this.referrerData == null) return false;
      var row = this.referrerData[inIndex];
      if (row) {
          this.$.refTitle.setContent(row.referrer);
          this.$.refValue.setContent(row.views);
          return true;          
      } else {
          return false;
      }
  },
  setupPostsRow: function(inSender, inIndex){
      if (this.postsData == null) return false;
      var row = this.postsData[inIndex];
      if (row) {
          console.log('row: ' + row);
          this.$.postTitle.setContent(row.post_title);
          this.$.postValue.setContent(row.views);
          return true;          
      } else {
          return false;
      }
  },
  setupKeywordsRow: function(inSender, inIndex){
      if (this.keywordsData == null) return false;
      var row = this.keywordsData[inIndex];
      if (row) {
          this.$.keywordTitle.setContent(row.searchterm);
          this.$.keywordValue.setContent(row.views);
          return true;          
      } else {
          return false;
      }
  },
  setupClicksRow: function(inSender, inIndex){
      if (this.clicksData == null) return false;
      var row = this.clicksData[inIndex];
      if (row) {
          this.$.clickTitle.setContent(row.click);
          this.$.clickValue.setContent(row.views);
          return true;          
      } else {
          return false;
      }
  }
});
