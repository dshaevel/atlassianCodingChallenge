var ChatMessage = (function() {
	// =======
	// Private
	// =======
	var _outputJsonObject;

	function _fetchPageTitle(url) {
		var deferred = $.Deferred();

		$.ajax({
			url: "https://query.yahooapis.com/v1/public/yql",
			dataType: "jsonp",
			jsonp: "callback",
			data: {
				q: "select * from html where url='" + url + "' and xpath='//title'",
				format: "json"
			},
			timeout: 3000
		}).done(function(data) {
			console.debug('_fetchPageTitle()::YQL results ==>');
			console.debug(JSON.stringify(data, null, 2));
			if (data.query) {
				if (data.query.results) {
					if (data.query.results.title) {
						var pageTitle = data.query.results.title;
						deferred.resolve(pageTitle);
					}
				}
			}
		}).fail(function(data) {
			console.debug(JSON.stringify(data, null, 2));
			deferred.reject(data);
		});

		return deferred.promise();
	}

	function _setLink(url, title) {
		console.debug('_setLink()::url ==>' + url + '<==');
		console.debug('_setLink()::title ==>' + title + '<==');

		if (!this.links) {
			this.links = [];
		}
		var idx = this.links.length;
		this.links[idx] = {
			"url": url,
			"title": title
		};
	}

	function _checkForMention(word, jsonObj) {
		console.debug('_checkForMention("' + word + '")::BEGIN');

		var mentionRegEx = /^@(\S)+$/;
		var isMention = mentionRegEx.test(word);

		if (isMention) {
			console.debug('_checkForMention()::The word ==>' + word + '<== is a Mention');
			if (!jsonObj.mentions) {
				jsonObj.mentions = [];
			}
			var idx = jsonObj.mentions.length;
			jsonObj.mentions[idx] = word.substring(1);
		}

		console.debug('_checkForMention("' + word + '")::END');

		return isMention;
	}

	function _checkForEmoticon(word, jsonObj) {
		console.debug('_checkForEmoticon("' + word + '")::BEGIN');

		var emoticonRegEx = /^\(([^)]{1,15})\)$/;
		var isEmoticon = emoticonRegEx.test(word);

		if (isEmoticon) {
			console.debug('_checkForEmoticon()::The word ==>' + word + '<== is an Emoticon');
			if (!jsonObj.emoticons) {
				jsonObj.emoticons = [];
			}
			var idx = jsonObj.emoticons.length;
			jsonObj.emoticons[idx] = word.substring(1, word.length-1);
		}

		console.debug('_checkForEmoticon("' + word + '")::END');

		return isEmoticon;
	}

	function _checkForLink(word) {
		console.debug('_checkForLink("' + word + '")::BEGIN');

		var linkRegEx = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
		var isLink = linkRegEx.test(word);

		if (isLink) {
			console.debug('_checkForLink()::The word ==>' + word + '<== is a Link');
		}

		console.debug('_checkForLink("' + word + '")::END');

		return isLink;
	}

	function _determineContentType(word) {
		var contentType;

		if (_checkForMention(word, this)) {
			contentType = 'mention';
		}
		else if (_checkForEmoticon(word, this)) {
			contentType = 'emoticon';
		}
		else if (_checkForLink(word)) {
			contentType = 'link';
		}
		else {
			console.debug('_determineContentType()::The word ==>' + word + '<== is just text');
			contentType = 'text';
		}

		return contentType;
	}

	// ======
	// Public
	// ======
	function parseString(chatMessageString) {
		var deferred = $.Deferred();

		_outputJsonObject = {};

		var _determineContentTypeBound = _determineContentType.bind(_outputJsonObject);
		var _setLinkBound = _setLink.bind(_outputJsonObject);

		var wordArray = chatMessageString.split(' ');

		var wordCount = wordArray.length;
		var linkCount = 0;
		var fetchedPageCount = 0;

		wordArray.forEach(function(word, index) {
			var contentType = _determineContentTypeBound(word);
			if (contentType === 'link') {
				linkCount++;
				$.when(_fetchPageTitle(word)).done(
					function(data) {
						_setLinkBound(word, data);
						//console.debug(JSON.stringify(_outputJsonObject, null, 2));
					}
				).then(
					function() {
						fetchedPageCount++;
						console.debug('parseString()::fetchedPageCount ==>' + fetchedPageCount);
						console.debug('parseString()::linkCount ==>' + linkCount);

						if (fetchedPageCount === linkCount) {
							deferred.resolve();
						}
					}
				);
			}
		});

		if (linkCount === 0) {
			deferred.resolve();
		}

		return deferred.promise();
	}

	function getResult() {
		return JSON.stringify(_outputJsonObject, null, 2);
	}

	return {
		parseString: parseString,
		getResult: getResult
	};
})();
