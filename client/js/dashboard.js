Template.dashboard.welcomeMessage = function(){
  if (Invites.find({invitee: Meteor.userId(), accepted:false, declined:false}).count() > 0){
    return "<p>Your friend has invited you to a new bet. Hurry and click <a class='highlight' href='/friendsBets'>here</a>, before someone else takes it.</p>";
  } else if(Bets.find({placer: Meteor.userId()}).count() == 0){
    return "<p>To get started, you probably want to make a new Bet, right?</p><a class='button' href='/bet/new'>New Bet</a><a class='close-main-block' href='#'>Not right now</a>"
  } else if(Bets.find({placer: Meteor.userId(), winner: undefined}).count() > 0){
    return "<p>You have some bets to <a class='highlight' href='/myBets'>update</a></p>";
  }
};
Template.dashboard.surveyQuestions = function(){
  var oldFeedback = Feedback.find().fetch();
  var answeredNums = _.pluck(oldFeedback, 'question');
  // qs is the list of question strings, minus the questions he's already answered.
  var qs = _.reject(Meteor.shared.feedbackQuestions, function(e,i){
    return _.contains(answeredNums, i);
  });

  if(qs.length == 0)
    return "<p>You're amazing and have answered all of our questions already.</p>";
  return "<p id='feedbackQuestion' data-number='"+_.indexOf(Meteor.shared.feedbackQuestions, qs[0])+"'>"+
         qs[0]+"</p>"+
         "<input type='text' id='feedbackQuestionAnswer'/>"+
         "<button id='answerFeedbackQuestion'>Answer</button>"
         ;
};

/*

   OLD CODE

Template.dashboard.need_nothing = function(){
  return !(Template.dashboard.need_personal_info() 
         || Template.dashboard.need_bet_update());
};
Template.dashboard.fbPicURL = Meteor.shared.fbPicURL;
Template.dashboard.hasPendingInvites = function(){
  return Template.dashboard.amountOffered() > 0;
};
Template.dashboard.amountOffered = function(){
  return Invites.find({invitee: Meteor.userId(), declined:false, accepted: false}).count();
};
Template.dashboard.need_personal_info = function(){
  return Meteor.user().profile.details == undefined;
};
Template.dashboard.need_bet_update = function(){
  var bets = Bets.find({
    placer: Meteor.userId(),
    winner: undefined,
    $or: [
      { update: undefined},
      { "update.updatedAt": {$lt: (new Date().getTime()) - (1000*60*60*24)}}
    ]
  });
  return bets.count() > 0;
};
Template.dashboard.bet_to_update = function(){
  return Bets.findOne({
    placer: Meteor.userId(),
    winner: undefined,
    $or: [
      { update: undefined},
      { "update.updatedAt": {$lt: (new Date().getTime()) - (1000*60*60*24)}}
    ]
  });
};
Template.dashboard.days_left = Meteor.shared.days_left;
Template.dashboard.bet_name = Meteor.shared.bet_name;
Template.dashboard.bet_progress = function(bet){
  switch(bet.goal.type){
    case "calories":
      return "<p>How many calories have you eaten so far?</p>"+
             "<input type='text' class='dash-input'/>"; 
    case "workout":
      return "<p>How many workouts have you done so far?</p>"+
             "<input type='text' class='dash-input'/>"; 
    case "run":
      var now = new Date();
      var then = new Date(bet.createdAt);
      var days_passed = parseInt( (now - then)/1000/60/60/24);
      var inputHTML = "";
      for (var i = 0; i < days_passed; i++){
        now.setDate(then.getDate()+i);
        if( bet.update  && bet.update.done_each_day[i]){
          inputHTML += "<input title='"+now.toDateString()+"' type='text' class='dash-input' value='"+bet.update.done_each_day[i]+"'/>";
        } else{
          inputHTML += "<input title='"+now.toDateString()+"' type='text' class='dash-input'/>";
        }
      }
      return "<p>How many miles have you run each day?</p>"+
             "<div class='dash-goal-days'>"+
               inputHTML+
             "</div>";
    case "lbs":
    default:
      return "<p>How many pounds have you lost so far?</p>"+
             "<input type='text' class='dash-input'/>"; 
  }
};

Template.dashboard.rendered = function(){
  if (Template.dashboard.need_nothing()){
    $('.dash-update-hook').delay(1500).slideUp(function(){
      $('.dash-news-hook').animate({
        height: '75%'
      }, 1500);
    });
  }
};
Template.dashboard.events({
  'click #updatePersonalInfo': function(){
    var height = $('#heightInfo').val();
    var weight = $('#weightInfo').val();
    var age = $('#ageInfo').val();

    // do some validation.
    Meteor.users.update(Meteor.userId(), {
      $set: { "profile.details": {
        height: height,
        weight: weight,
        age: age
      } }
    });
  },
  'click #updateBetInfo': function(){
    var betId = $('.block-content').data('_id');
    var updates = [];
    $('.dash-input').each(function(i, e){
      updates.push($(this).val());
    });

    Bets.update(betId, {$set:{
      update: {
        updatedAt: new Date().getTime(),
        done_each_day: updates
      }
    }});
  }
});
*/

Template.dashboard.events({
  'click #answerFeedbackQuestion': function(){
    Feedback.insert({
      question: parseInt($('#feedbackQuestion').data('number')),
      response: $('#feedbackQuestionAnswer').val().trim(),
      responder: Meteor.userId()
    });
  }
});

Template.dashboard.created = function(){ Meteor.shared.logPageView("dashboard");};

