# Atlassian Coding Challenge - v1.0.0 - David Shaevel
### 12/8/2014

---

#Description

> Please write, in your preferred language, code that takes a chat message string and returns a JSON string containing information about its contents. Special content to look for includes:

> 1. **@mentions -** A way to mention a user. Always starts with an '@' and ends when hitting a non-word character. (http://help.hipchat.com/knowledgebase/articles/64429-how-do-mentions-work-)
2. **Emoticons -** For this exercise, you only need to consider 'custom' emoticons which are ASCII strings, no longer than 15 characters, contained in parenthesis. You can assume that anything matching this format is an emoticon. (http://hipchat-emoticons.nyh.name)
3. **Links -** Any URLs contained in the message, along with the page's title.

For example, calling your function with the following inputs should result in the corresponding return values.

**Input:** "@chris you around?"

**Return (string):**

    {
      "mentions": [
        "chris"
      ]
    }


**Input:** "Good morning! (megusta) (coffee)"

**Return (string):**

    {
      "emoticons": [
        "megusta",
        "coffee"
      ]
    }


**Input:** "Olympics are starting soon; http://www.nbcolympics.com"

**Return (string):**

    {
      "links": [
        {
          "url": "http://www.nbcolympics.com",
          "title": "NBC Olympics | Home of the 2016 Olympic Games in Rio"
        }
      ]
    }


**Input:** "@bob @john (success) such a cool feature; https://twitter.com/jdorfman/status/430511497475670016"

**Return (string):**

    {
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
          "title": "Justin Dorfman on Twitter: \"nice @littlebigdetail from ..."
        }
      ]
    }

---

#Solution 

###Step One:
* Get project infrastructure set up:
    * TDD with Jasmine
    * Test execution Grunt and Karma

###Step Two:
* Stub out the parseString() function in a ChatMessage module
* Create Jasmine test suite for ChatMessage module
    * Create mock message string data:
        * with just mentions
        * with just emoticons
        * with just links
        * with mentions, emoticons, and links
    * Create specs:
        * should parse mentions
        * should parse emoticons
        * should parse links
        * should parse everything

###Step Three:
* Implement the actual parseString() function logic:
    * Split message string into array of words
    * For each word, determine what is the content type:
        * Mention
        * Emoticon
        * Link
        * Default (Text)
    * When the content type is determined, add appropriate data to the JSON object
    * For Link content type, make JSONP call to YQL to fetch page title from URL
    * After all the words have been processed, return the JSON as a string
* Use Regular Expressions to determine the content type 
* Make sure the solution can easily add new content types

###Step Four:
* Add grunt tasks to create a minified version of the ChatMessage file
    * clean
    * uglify
* Create a test page that uses the minified version of the ChatMessage file
    * input text field
    * submit button
    * display results section
    * clear results button

---

#Usage

    var msg = '@DavidShaevel http://davidshaevel.com (website)';
    $.when(ChatMessage.parseString(msg)).done(
    	function() {
    		var result = ChatMessage.getResult();
    	}
    );

---

#Live Demo

[http://jsbin.com/yupuja/3](http://jsbin.com/yupuja/3)
