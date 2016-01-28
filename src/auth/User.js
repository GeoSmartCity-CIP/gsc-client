var gsc = gsc || {};

gsc.auth = gsc.auth || {};

gsc.auth.User = function(email, password) {

  this.Id = -1;

  this.Email = '';

  this.Password = '';

  if (email !== undefined) {
    this.Email = email;
  }

  if (email !== undefined) {
    this.Password = password;
  }

};
