enyo.kind({
  name:'wp.DashboardView',
  kind: "enyo.Scroller",
  published: {
    account:null
  },
  events: { 
  },
  create:function(){
	 this.inherited(arguments);
  },
  components: [
    { name:'dashboardPasswordManager', kind:'wp.WordPressClient', onPasswordReady:'passwordReady', onPasswordInvalid:'passwordInvalid' },
    {name: 'realPreview', kind:'WebView',  style : ' position:absolute;top:0;right:0;left:0;bottom:0;', onLoadStopped:'loadStopped'}
  ],
  passwordReady:function(sender){
     console.log("We have the password now: " + sender.password);
     this.openPostURL(sender.password);
  },
  passwordInvalid:function(sender){
     console.log("The password was missing or the XML-RPC api received a 403 fault code");
  },
  openPostURL:function(password){
	  var loginURL = this.account.account.xmlrpc.replace("/xmlrpc.php", "/wp-login.php");
	  var redirectURL = this.account.account.xmlrpc.replace("/xmlrpc.php", "/wp-admin");
	  var htmlForm ='<form method="post" action="'+loginURL+'" id="loginform" name="loginform" style="visibility:visible">'
	  +'<input type="text" tabindex="10" size="20" value="'+this.account.account.username+'" class="input" id="user_login" name="log"></label>'
	  +'<input type="password" tabindex="20" size="20" value="'+password+'" class="input" id="user_pass" name="pwd"></label>'
	  +'<input type="submit" tabindex="100" value="Log In" class="button-primary" id="wp-submit" name="wp-submit">'
	  +'<input type="hidden" value="'+ redirectURL +'" name="redirect_to">'
	  +'</form>'
	  +'<script type="text/javascript">document.forms[0].submit()</script>';
	  console.log(htmlForm);
	  //this.$.postPreviewResponse.setContent(htmlForm);
	  this.$.realPreview.setHTML('file://iamnothere.html',htmlForm);
	  
  },
  windowParamsChangeHandler: function(inSender, inEvent) {
	  var p = inEvent.params;
	  console.log("View Parameters", p);
	  //load remote preview
	  this.account = enyo.windowParams.account;
	  this.$.dashboardPasswordManager.setAccount(this.account);
  },
  loadStopped:function() {
	console.log('URL: ' + this.$.realPreview.url);
  },
});