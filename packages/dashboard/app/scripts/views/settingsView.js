/*global haDash, Backbone, JST*/

haDash.Views = haDash.Views || {};


(function () {
    'use strict';

    haDash.Views.SettingsView = Backbone.View.extend({

    id: 'settingsView',

        template: JST['app/scripts/templates/settings.ejs'],

    initialize: function() {
      this.render();
    },

    render: function() {
      this.$el.html(this.template());

      return this;
    },

    events: {
      'click #passwordForm button[type="submit"]': 'change',
      'click #deleteAccountForm button[type="submit"]': 'delete'
    },

    change: function(event) {
      event.preventDefault();
      $('.form-alert').hide();

      if ($('#password').val() == $('#password2').val()) {
        $(event.target).find('img').show();

        $.ajax({
          url: haDash.API + '/change-email',
          contentType: "application/json; charset=utf-8",
            dataType: "json",
          xhrFields: {
            withCredentials: true
          },
          method: 'post',
          data: JSON.stringify({
            password: $('#password').val()
          })
        })
        .done(function(whoami) {
          $('#passwordForm').hide();
          $('#passwordFormConfirm').show();
        })
        .fail(function() {
          $('#passwordFormError').show();
          $(event.target).find('img').hide();
        });

      } else {
        $('#passwordFormError').show();
      }
    },

    delete: function(event) {
      event.preventDefault();

      var r = confirm("Are you sure you want to delete your account?");
      if (r != true) {

        $('.form-alert').hide();

        if ($('#password').val() == $('#password2').val()) {
          $(event.target).find('img').show();

          $.ajax({
            url: haDash.API + '/delete-account',
            contentType: "application/json; charset=utf-8",
              dataType: "json",
            xhrFields: {
              withCredentials: true
            },
            method: 'post',
            data: JSON.stringify({
              password: $('#password-delete').val()
            })
          })
          .done(function(whoami) {
            $('#deleteAccountForm').hide();
            $('#deleteAccountFormConfirm').show();
          })
          .fail(function() {
            $('#deleteAccountFormError').show();
            $(event.target).find('img').hide();
          });

        } else {
          $('#passwordFormError').show();
        }
      }
    }    

  });

})();
