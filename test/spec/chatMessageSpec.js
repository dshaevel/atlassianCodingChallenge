describe("Chat Message", function() {
	// ========
	// Mentions
	// ========
	var mockMentionInput = '@chris you around?';

	var mockMentionOutputObject = {
		"mentions": [
			"chris"
		]
	};

	var mockMentionOutputString = JSON.stringify(mockMentionOutputObject, null, 2);

	// =========
	// Emoticons
	// =========
	var mockEmoticonInput = 'Good morning! (megusta) (coffee)';

	var mockEmoticonOutputObject =  {
		"emoticons": [
			"megusta",
			"coffee"
			]
	};

	var mockEmoticonOutputString = JSON.stringify(mockEmoticonOutputObject, null, 2);

	// =====
	// Links
	// =====
	var mockLinkInput = 'Olympics are starting soon; http://www.nbcolympics.com';

	var mockLinkOutputObject =  {
		"links": [
			{
				"url": "http://www.nbcolympics.com",
				"title": "NBC Olympics | Home of the 2016 Olympic Games in Rio"
			}
		]
	};

	var mockLinkOutputString = JSON.stringify(mockLinkOutputObject, null, 2);

	// ===========================================
	// Mentions, Emoticons, and Links (Everything)
	// ===========================================
	var mockEverythingInput = '@bob @john (success) such a cool feature; https://twitter.com/jdorfman/status/430511497475670016';

	var mockEverythingOutputObject = {
		"mentions": [
			"bob",
			"john"
		],
		"emoticons": [
			"success"
		],
		"links": [
			{
				"url": "https://twitter.com/jdorfman/status/430511497475670016",
				"title": "Justin Dorfman on Twitter: \"nice @littlebigdetail from @HipChat (shows hex colors when pasted in chat). http://t.co/7cI6Gjy5pq\""
			}
		]
	};

	var mockEverythingOutputString = JSON.stringify(mockEverythingOutputObject, null, 2);

	// ===========
	// Begin Tests
	// ===========
	it("should define a parseString() function.", function() {
		expect(ChatMessage.parseString).toBeDefined();
	});

	it("should define a getResult() function.", function() {
		expect(ChatMessage.getResult).toBeDefined();
	});

	it("should parse input text and identify Mentions.", function() {
		ChatMessage.parseString(mockMentionInput);
		var actualOutput = ChatMessage.getResult();
		expect(actualOutput).toEqual(mockMentionOutputString);
	});

	it("should parse input text and identify Emoticons.", function() {
		ChatMessage.parseString(mockEmoticonInput);
		var actualOutput = ChatMessage.getResult();
		expect(actualOutput).toEqual(mockEmoticonOutputString);
	});

	it("should parse input text and identify Links.", function() {
		var mockJsonpResult = {
			"query": {
				"count": 1,
				"created": "2014-12-05T21:35:36Z",
				"lang": "en-US",
				"results": {
					"result": "<title>NBC Olympics | Home of the 2016 Olympic Games in Rio</title>"
				}
			}
		};
		var d = $.Deferred();
		d.resolve(mockJsonpResult);
		spyOn($, 'ajax').and.returnValue(d.promise());

		ChatMessage.parseString(mockLinkInput);
		var actualOutput = ChatMessage.getResult();
		expect(actualOutput).toEqual(mockLinkOutputString);
	});

	it("should parse input text and identify Mentions, Emoticons, and Links.", function() {
		var mockJsonpResult = {
			"query": {
				"count": 1,
				"created": "2014-12-05T21:35:36Z",
				"lang": "en-US",
				"results": {
					"result": "<title>Justin Dorfman on Twitter: \"nice @littlebigdetail from @HipChat (shows hex colors when pasted in chat). http://t.co/7cI6Gjy5pq\"</title>"
				}
			}
		};
		var d = $.Deferred();
		d.resolve(mockJsonpResult);
		spyOn($, 'ajax').and.returnValue(d.promise());

		ChatMessage.parseString(mockEverythingInput);
		var actualOutput = ChatMessage.getResult();
		expect(actualOutput).toEqual(mockEverythingOutputString);
	});
});
