enyo.kind({
  name:'wp.PostList',
  kind:'VFlexBox',
  events:{
    onSelectPost:''
  },
  published: {
    account:null,
    methodName:'metaWeblog.getRecentPosts'
  },
  components: [
    { name:'xmlrpc_client', kind:'XMLRPCService', methodName:'metaWeblog.getRecentPosts', onSuccess:'gotPosts'},
    { kind:'wp.DataPage' },
    // setting lookAhead to 1 for XMLRPC api performance reasons, because we can't get paged results
    { name:'list', kind:'VirtualList', lookAhead:1, flex:1, onSetupRow:'getPost', onAcquirePage:'acquirePostPage', components:[
      { name:'item', kind:'Item', className:'enyo-item', components:[
        { name:'title', content:'Hi' }
      ] }
    ] },
    { kind:'enyo.nouveau.CommandMenu', components:[
      { name: "slidingDrag", slidingHandler: true, kind: "Control", className: "enyo-command-menu-draghandle"}
    ] }
  ],
  create:function(){
    this.inherited(arguments);
    this.methodNameChanged();
  },
  // Not optimal, this api is seriously going to kill the app,
  // are we going to set a max number of posts to donwload somehow?
  acquirePostPage:function(sender, page){
    if (this.account && this.$.dataPage.missingPage(page)) {
      this.$.xmlrpc_client.callMethod({methodParams:[this.account.blogid, this.account.username, this.account.password, ((page+1) * this.$.list.pageSize)]}, { page:page });
    };
  },
  getPost:function(sender, index){
    var post;
    if (post = this.$.dataPage.itemAtIndex(index)) {
      this.$.title.setContent(post.title);
      return true;
    };
  },
  gotPosts:function(sender, response, request){
    var trimmed = request.page*this.$.list.pageSize;
    var posts = response.slice(trimmed);
    this.$.dataPage.storePage(request.page, posts);
    this.$.list.refresh();
  },
  accountChanged:function(){
    this.$.list.punt();
    this.$.dataPage.clear();
    if (this.account == null) {
      return;
    };
    this.$.xmlrpc_client.setUrl(this.account.xmlrpc);
    this.$.list.reset();
    
  },
  methodNameChanged:function(){
    this.$.xmlrpc_client.setMethodName(this.methodName);
  }
});



