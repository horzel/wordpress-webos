enyo.kind({
  name:'wp.DraftList',
  kind:'wp.PostList',
  showBlogTitle:true,
  emptyMessage:$L('No Drafts'),
  create: function(){
	  this.inherited(arguments);
      this.$.list.pageSize = 1000;
	  this.hideNewButton();
  },
/*  acquirePosts:function(sender, page){
    if (page < 0) return;
    var that = this;
    var pageSize = this.$.list.pageSize;
    enyo.application.models.Post.all().filter('local_modifications', '=', 'true').count(function(postCount){
      enyo.application.models.Page.all().filter('local_modifications', '=', 'true').count(function(pageCount){
        enyo.application.models.Post.all().filter('local_modifications', '=', 'true')
          .prefetch('account')
          .limit(pageSize)
          .skip(page*pageSize)
          .order('date_created_gmt', false)
          .list(function(posts){
            if (posts.length == pageSize) { //Why we are considering only post here?
              that.setPage(page, posts);
              that.$.list.refresh();
            }else{
              //combine posts with pages query
              // reset the page number by how many pages worth of Posts there are
              var firstPageSize = pageSize - (postCount % pageSize);
              page = page - Math.floor(postCount/pageSize);
              var limit = pageSize - posts.length;
              if (page > 0) {
                var offset = (page - 1) * pageSize + firstPageSize;
              }else{
                var offset = page * pageSize;                
              }
              enyo.application.models.Page.all().filter('local_modifications', '=', 'true')
                .limit(limit)
                .skip(offset)
                .prefetch('account')
                .order('date_created_gmt', false)
                .list(function(pages){
                  console.log("Any pages? ", pages);
                  var items = posts.concat(pages);
                  if (items.length > 0) {
                    that.setPage(page, posts.concat(pages));
                    that.$.list.refresh();
                  };
                });
            }
          })
      })
    });
  },*/
  acquirePosts:function(){
		var page = 0;
	    var that = this;
	    var load_requests = this.load_requests;
	    var pageSize = this.$.list.pageSize;
	    enyo.application.models.Post.all().filter('local_modifications', '=', 'true')
	      .prefetch('account')
	      .order('date_created_gmt', false)
	     // .limit(pageSize)
	     // .skip(page*pageSize)
	      .list(function(posts){   
		    enyo.application.models.Page.all().filter('local_modifications', '=', 'true')
		      .prefetch('account')
		      .order('date_created_gmt', false)
		   //   .limit(pageSize)
		     // .skip(page*pageSize)
		      .list(function(pages){
		      //  that.log("Found something? ",  posts.concat(pages));
		        that.setPage(page, posts.concat(pages)); 
		        that.$.list.refresh();  
		      });
	      });
	  },
  refreshList:function(sender){
	 this.$.spinner.show();
	  //we don't have an account, so we should call the main window here
	  var wordpress = enyo.windows.fetchWindow('wordpress');
	  if (wordpress) {
		  enyo.windows.setWindowParams(wordpress, {'action':'refreshDrafts'});
	  };
  }
});