/****************************************************************************************
*						Copyright © 2011 Alan Stice and Rich Dunbar						*
*																						*
* Permission is hereby granted, free of charge, to any person obtaining a copy of this 	*
* software and associated documentation files (the "Software"), to deal in the Software *
* without restriction, including without limitation the rights to use, copy, modify, 	*
* merge, publish, distribute, sublicense, and/or sell copies of the Software, and to 	*
* permit persons to whom the Software is furnished to do so, subject to the following 	*
* conditions:																			*
*																						*
* The above copyright notice and this permission notice shall be included in all copies *
* or substantial portions of the Software.												*
*																						*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 	*
* INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 		*
* PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT 	*
* HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF 	*
* CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE 	*
* OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.											*
*																						*
****************************************************************************************/

var baseUrl = "http://www.meetup.com/hpwebos/"; // Change URL here to change the base URL
var baseTitle = "HP webOS Meetups Everywhere - Meetup" // Change title here to the title of the base URL

enyo.kind({
	name: "BrowserPane",
	kind: "enyo.VFlexBox",
	events: {
		onBookmarksPress: "",
		onAddBookmark: ""
	},
	currentLocation: 0,
	history: [baseUrl], 
	uiMove: false,
	currentUrl: baseUrl, 
	currentTitle: baseTitle,
	components: [
		{name: "launchApplicationService", kind: enyo.PalmService, service: enyo.palmServices.application, method: "open"},
		{kind: "enyo.Toolbar", className: "actionbar", layoutKind: "enyo.HFlexLayout", components: [
			{kind: "ToolButton", name: "home", className: "actionbar-tool-button", onclick: "handleHomeButton", icon: "images/menu-icon-home.png"},
			{kind: "ToolButton", name: "back", className: "actionbar-tool-button", onclick: "handleBackButton", icon: "images/menu-icon-back.png", disabled: true},
			{kind: "ToolButton", name: "forward", className: "actionbar-tool-button", onclick: "handleForwardButton", icon: "images/menu-icon-forward.png", disabled: true},
			{flex: 1},
			{kind: "ToolButton", name: "share", className: "actionbar-tool-button", onclick: "handleShareMenuClick", icon: "images/menu-icon-share.png"},
			{kind: "ToolButton", name: "bookmarks", className: "actionbar-tool-button", onclick: "doBookmarksPress", icon: "images/toaster-icon-bookmarks.png"}
		]},
		{flex: 1, kind: "Pane", components: [
			{flex: 1, kind: "Scroller", components: [
				//Insert your components here
				{name: "htmlContent", kind: "WebView", minFontSize: 2, onPageTitleChanged: "pageTitleChanged", onLoadStarted: "findLoadStarted", onLoadProgress: "findLoadProgress", onLoadStopped: "findLoadStopped", onLoadComplete: "findLoadComplete", onNewPage: "viewNewPage"}
			]}
		]},
		{name: "findProgressBox", kind: "enyo.Control", layoutKind: "enyo.HFlexLayout", style: "z-index: -1; background-image: url('images/progress-bar.png'); background-repeat: repeat-x; position: absolute; top: 54px; left: 0px; right: 0px; height: 4px", components: [
			{name: "findProgress", kind: "enyo.Control", style: "width: 0%; height: 4px; background-image: url('images/progress-bar-inner.png'); background-repeat: repeat-x;"},
			{flex: 1}
		]},
		{name: "sharePopup", kind: "PopupList", onSelect: "sharePopupSelect", items: ["Add Bookmark", "Share Link"]},
		{name: "windowPopup", kind: "Popup", onClose: "handlePopupClosed", style: "width: 600px; height: 600px;", layoutKind: "enyo.VFlexLayout", lazy: false, components: [
			{name: "windowContents", flex: 1, components: [
				{name: "windowWebView", kind: "WebView", style: "position: absolute; left: 0px; right: 0px; top: 0px; bottom: 0px;", minFontSize: 2, onLoadStarted: "webViewLoadStarted", onLoadStopped: "webViewLoadStopped", onPageTitleChanged: "webViewTitleChanged", onDisconnected: "webViewDisconnected"}
			]},
			{kind: "ToolButton", name: "close", className: "actionbar-tool-button", style: "position: absolute; top: 0px; right: 0px;", onclick: "handlePopupClose", icon: "images/menu-icon-stop.png"},
			{kind: "enyo.SpinnerLarge", style: "position: absolute; left: 50%; top: 50%; margin-left: -64px; margin-top: -64px;"}
		]}
	],
	rendered: function() {
		this.inherited(arguments);
		this.$.htmlContent.setUrl(baseUrl);
	},
	handleHomeButton: function(inSender, inEvent) {
		// TODO: Add to history
		this.$.htmlContent.setUrl(baseUrl);
	},
	handleBackButton: function(inSender, inEvent) {
		this.log("Back...");
		this.log("CurrentLocation: ", this.currentLocation);
		this.log("History: ", enyo.json.stringify(this.history));
		if (this.currentLocation > 0) {
			this.currentLocation--;
			this.uiMove = this.history[this.currentLocation];
			this.$.htmlContent.setUrl(this.history[this.currentLocation]);
			this.$.forward.setDisabled(false);
		}
		this.$.back.setDisabled((this.currentLocation === 0));
	},
	handleForwardButton: function(inSender, inEvent) {
		this.log("Forward!");
		this.log("CurrentLocation: ", this.currentLocation);
		this.log("History: ", enyo.json.stringify(this.history));
		if (this.currentLocation < (this.history.length-1)) {
			this.currentLocation++;
			this.uiMove = this.history[this.currentLocation];
			this.$.htmlContent.setUrl(this.history[this.currentLocation]);
			this.$.back.setDisabled(false);
		}
		this.$.forward.setDisabled((this.currentLocation === (this.history.length-1)));
	},
	pageTitleChanged: function(inSender, inTitle, inUrl, inBack, inForward) {
		if (this.$.windowPopup.showing) {
			enyo.nextTick(this, function() { this.$.windowPopup.close(); });
			return;
		}
		this.log("Current location is ", this.currentLocation, " and history length is ", this.history.length, " and uiMove is ", this.uiMove);
		this.log("History: ", enyo.json.stringify(this.history));
		if (inUrl !== this.uiMove) {
			this.uiMove = false;
		}
		if (inUrl !== "" && inUrl !== this.currentUrl) {
			if (this.currentLocation < (this.history.length-1) && this.uiMove == false) {
				this.log("Resetting history");
				var temp = this.history;
				this.history = [];
				var i;
				for (i = 0; i <= this.currentLocation; i++) {
					this.history.push(temp[i]);
				}
				this.$.forward.setDisabled(true);
			}
			this.currentUrl = (function(url) { return function() { return url; } })(inUrl)();
			this.currentTitle = (function(title) { return function() { return title; } })(inTitle)();
			this.log("Setting content to ", this.currentUrl);
			if (this.uiMove == false) {
				this.currentLocation++;
				this.history.push(inUrl);
			}
			if (this.currentLocation > 0) {
				this.$.back.setDisabled(false);
			}
		}
	},
	findLoadStarted: function(inSender, inEvent) {
		// this.log("Load started: ", inEvent);
		this.$.findProgressBox.applyStyle('z-index', '2');
	},
	findLoadProgress: function(inSender, inEvent) {
		// this.log("Load progress: ", inEvent);
		if (inEvent != 0) {
			this.$.findProgress.applyStyle('width', inEvent+'%');
			this.$.findProgress.render();
		}
	},
	findLoadStopped: function(inSender, inEvent) {
		// this.log("Load stopped: ", inEvent);
		this.$.findProgressBox.applyStyle('z-index', '-1');
	},
	findLoadComplete: function(inSender, inEvent) {
		// this.log("Load complete: ", inEvent);
		this.$.findProgressBox.applyStyle('z-index', '-1');
		this.$.findProgress.applyStyle('width', '0%');
	},
	updateUrl: function(inUrl) {
		this.$.htmlContent.setUrl(inUrl);
	},
	handleShareMenuClick: function(inSender, inEvent) {
		this.$.sharePopup.openAt({top: -1000});
		var pop = this.$.sharePopup.getBounds(); 
		this.$.sharePopup.close();
		this.$.sharePopup.openAtControl(this.$.share, {left: -pop.width+10, top: 26});
	},
	sharePopupSelect: function(inSender, inSelected) {
		this.log("Selected popup value: ", this.$.sharePopup.items[inSelected]);
		switch(inSelected) {
			case 0: // Add Bookmark
				this.doAddBookmark();
				break;
			case 1: // Share Link
				var msg = $L("Come join me at a webOS community event: <a href=\"{$src}\">{$title}</a>");
				msg = enyo.macroize(msg, {src: this.currentUrl, title: this.currentTitle || this.currentUrl});
				var params = {
					summary: $L("Check out this event..."),
					text: msg
				};
				this.$.launchApplicationService.call({id: "com.palm.app.email", params: params});
				break;
			case 2: // Copy to clipboard
				break;
		}
	},
	// Functions for the facebook login
	viewNewPage: function(inSender, inIdentifier) {
		this.$.windowWebView.render();
		this.$.windowWebView.setIdentifier(inIdentifier);
		this.$.windowPopup.openAtCenter();
	},
	handlePopupClose: function(inSender, inEvent) {
		this.$.windowPopup.close();
	},
	handlePopupClosed: function(inSender, inEvent) {
		this.log("Popup closed");
		this.$.htmlContent.render();
		this.$.htmlContent.resized(); // For some reason this is required to get the page to finish loading
		this.$.windowWebView.setUrl("");
	},
	webViewLoadStarted: function(inSender, inEvent) {
		this.$.spinnerLarge.show();
	},
	webViewLoadStopped: function(inSender, inEvent) {
		this.$.spinnerLarge.hide();
	},
	webViewRedirected: function(inSender, inEvent) {
		this.log("Web View Redirected");
	},
	webViewDisconnected: function(inSender, inEvent) {
		this.log("Web View Disconnected");
	},
	webViewTitleChanged: function(inSender, inTitle, inUrl, inBack, inForward) {
		this.log("WebViewTitleChanged to url ", inUrl);
	}
});