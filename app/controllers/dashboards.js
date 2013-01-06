var Dashboards = function () {
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];
  // this.respondsWith = ['json'];

  this.main = function (req, resp, params) {
    var self = this;
    geddy.model.Post.all({isPublished: false}, function (err, drafts){
    geddy.model.Post.all({isPublished: true}, function (err, posts) {
      self.respond({params: params, posts: posts, drafts: drafts});
    });
    });
  };

  this.install = function (req, resp, params) {
    params.site = {};
    this.respond(params);
  };

  this.finish = function (req, resp, params) {
    params.id = params.id || geddy.string.uuid(10);

    var self = this
      , site = geddy.model.Site.create(params);

    site.save(function(err, data) {
      if (err) {
        params.errors = err;
        self.transfer('add');
      } else {
        geddy.installed = true;
        geddy.site = site;
        self.session.set('site', site);
        self.redirect('/dashboard');
      }
    });
  };

  this.analytics = function (req, resp, params) {
    // get all posts that have been published
    // get visits for each of them
    // get unique visitors
    // respond
    this.respond({params: params});
    // TODO: set up realtime counts for visits and unique visitors
  };

  this.login = function (req, resp, params) {
    this.respond({params: params});
  };

  this.authenticate = function (req, resp, params) {
    var self = this;
    geddy.model.Site.first({email: params.email, password: params.password}, function (err, site) {
      self.session.set('site', site);
      self.redirect('/dashboard');
    });
  };

};

exports.Dashboards = Dashboards;
