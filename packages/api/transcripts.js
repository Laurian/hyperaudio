var passport = require('passport');
var MediaObject = require('./models/mediaObject');
var Transcript = require('./models/transcript');
var fs = require('fs');
var path = require('path');
var url = require('url');

var fivebeans = require('fivebeans');
var client = new fivebeans.client('127.0.0.1', 11300);
client.connect(function(err) {
	if (err) throw err;

	client.use("transcribe", function(err, tubename) {
		if (err) throw err;
	});
});


module.exports = function(app, nconf) {

  app.get('/:user?/transcripts', function(req, res) {
    if (req.params.user) {
      var query = {
        owner: req.params.user
      };
      return Transcript.find(query, function(err, transcripts) {
        return res.send(transcripts);
      });
    }
    return Transcript.find(function(err, transcripts) {
      return res.send(transcripts);
    });
  });

  app.get('/:user?/transcripts/:id', function(req, res) {
    return Transcript.findById(req.params.id).populate('media').exec(
    /*return Transcript.findById(req.params.id,*/ function(err, transcript) {
      if (!err) {
        return res.send(transcript);
      }
      
      res.status(404);
      res.send({ error: 'Not found' });
      return;
    });
  });

  app.get('/:user?/transcripts/:id/text', function(req, res) {
    return Transcript.findById(req.params.id).populate('media').exec(
    /*return Transcript.findById(req.params.id,*/ function(err, transcript) {
      if (!err) {
		res.header("Content-Type", "text/plain");
		return res.send(transcript.content);
      }
      
      res.status(404);
      res.send({ error: 'Not found' });
      return;
    });
  });
  
  app.get('/:user?/transcripts/:id/html', function(req, res) {
    return Transcript.findById(req.params.id).populate('media').exec(
    /*return Transcript.findById(req.params.id,*/ function(err, transcript) {
      if (!err) {
		res.header("Content-Type", "text/html");
		return res.send(transcript.content);
      }
      
      res.status(404);
      res.send({ error: 'Not found' });
      return;
    });
  });
  
  app.put('/:user?/transcripts/:id', function(req, res) {
    return Transcript.findById(req.params.id, function(err, transcript) {

      transcript.label = req.body.label;
      transcript.desc = req.body.desc;
      transcript.type = req.body.type;
      // transcript.sort = req.body.sort;
      // transcript.owner = req.body.owner;
      transcript.meta = req.body.meta;
      transcript.media = req.body.media;
      
      if (req.params.media && req.params.media._id) {
        transcript.media = req.params.media._id;
      } else {
        transcript.media = req.body.media;
      }
      
      if (req.params.user) {
        transcript.owner = req.params.user;
      } else {
        transcript.owner = req.body.owner;
      }
      
      if (req.body.content) {
        transcript.content = req.body.content;
      }

      return transcript.save(function(err) {
        if (!err) {
          console.log("updated");
        }
        return res.send(transcript);
      });
    });
  });
  

  // FIXME better location? think web-calculus, also allow setting text now?
  // pass media url
  app.post('/:user?/transcripts/:id/align', function(req, res) {
    return Transcript.findById(req.params.id).populate('media').exec(function(err, transcript) {
      
      if (transcript.type == 'text' && transcript.media) {
	  	client.put(1, 0, 0, JSON.stringify(['align', {
	  		type: "transcript",
	  		payload: transcript
	  	}]), function(err, jobid) {
	  		if (err) throw err;
	  	});
      }
      
      return res.send(transcript);
    });
  });
  
  app.post('/:user?/transcripts', function(req, res) {

    var transcript;
    var owner;
    var content = null;
    
    if (req.params.user) {
      owner = req.params.user;
    } else {
      owner = req.body.owner;
    }


    if (req.body.content) {
      content = req.body.content;
    }
	    
    transcript = new Transcript({
      label: req.body.label,
      desc: req.body.desc,
      type: req.body.type,
      // sort: req.body.sort,
      owner: req.body.owner,
      meta: req.body.meta,
      content: content,
      media: req.body.media
    });

    // download if needed

    console.log(transcript);

    transcript.save(function(err) {
      if (!err) {
        console.log("created");
		
		// fix media
		console.log("looking for media " + req.body.media);
		MediaObject.findById(req.body.media).exec(function(err, mediaObject) {
  		  console.log(err);
		  console.log(mediaObject);
	      if (!err) {
			  for (var i = 0; i < mediaObject.transcripts.length; i++) {
				  if (mediaObject.transcripts[i] == transcript._id) {
					  return
				  }
			  }
			  
			  mediaObject.transcripts.push(transcript._id);
			  mediaObject.save(function(err) {
			  	console.log(err);
			  });
			  
			  console.log(mediaObject);
	      }      
		});
		// fix media
      }
    });
    return res.send(transcript);
  });

  app.delete('/:user?/transcripts/:id', function(req, res) {
    return Transcript.findById(req.params.id, function(err, transcript) {
      return transcript.remove(function(err) {
        if (!err) {
          console.log("removed");
          return res.send('')
        }
      });
    });
  });

};
