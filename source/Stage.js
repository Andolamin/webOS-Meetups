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

enyo.kind({
	name: "Stage",
	kind: "enyo.Control",
	components: [
		{kind: "enyo.AppMenu", components: [
			{kind: "enyo.EditMenu"},
			{caption: "About", onclick: "aboutMenuClick"}
		]},
		{name: "stagePane", kind: "enyo.Pane", width: "100%", height: "100%", components: [
			{name: "Browser", kind: "BrowserPane", width: "100%", height: "100%", onBookmarksPress: "handleBookmarksPress", onAddBookmark: "handleAddBookmark"},
			{name: "About", kind: "AboutView", width: "100%", height: "100%", onClose: "handleAboutClose"}
		]},
		{name: "bookmarks", kind: "enyo.Toaster", flyInFrom: "right", width: "340px", height: "100%", layoutKind: "enyo.HFlexLayout", components: [
			{className: "enyo-sliding-view-shadow"},
			{flex: 1, layoutKind: "enyo.VFlexLayout", components: [
				{kind: "enyo.Toolbar", content: "Bookmarks", style: "color: white;"},
				{kind: "enyo.VFlexBox", flex: 1, className: "basic-back", components: [
					{name: "bookmarksList", kind: "enyo.VirtualList", className: "bookmarksList", flex: 1, onSetupRow: "setupRow", components: [
						{kind: "enyo.SwipeableItem", className: "resultsItem", onConfirm: "deleteBookmark", layoutKind: "enyo.VFlexLayout", onclick: "bookmarksItemClick", tapHighlight: true, components: [
							{name: "title", className: "title", kind: "enyo.Control"},
							{name: "url", className: "url", kind: "enyo.Control"}
						]}
					]}
				]},
				{kind: "enyo.Toolbar", layoutKind: "enyo.HFlexLayout", components: [
					{name: "grabber", kind: "enyo.GrabButton"},
					{flex: 1},
					{kind: "ToolButton", name: "addBookmark", className: "actionbar-tool-button", onclick: "handleAddBookmark", icon: "images/menu-icon-add.png"},
				]}
			]}
		]}
	],
	bookmarks: [],
	create: function() {
		this.bookmarks = (localStorage.getItem("com.webos.meetups.bookmarks") ? JSON.parse(localStorage.getItem("com.webos.meetups.bookmarks")) : []);
		this.inherited(arguments);
	},
	handleBookmarksPress: function(inSender, inEvent) {
		this.log();
		this.$.bookmarks.open();
	},
	openAppMenuHandler: function() {
		if (!this.modalVisible) {
			var menu = this.myAppMenu || this.$.appMenu;
			menu.open();
		}
	},
	aboutMenuClick: function(inSender, inEvent) {
		this.$.stagePane.selectViewByName("About");
	},
	handleAboutClose: function(inSender, inEvent) {
		this.$.stagePane.selectViewByName("Browser");
	},
	handleAddBookmark: function(inSender, inEvent) {
		this.log("Add bookmark for ", this.$.Browser.currentUrl, " and title ", this.$.Browser.currentTitle);
		this.bookmarks.push({title: this.$.Browser.currentTitle, url: this.$.Browser.currentUrl});
		this.$.bookmarksList.refresh();
		localStorage.setItem("com.webos.meetups.bookmarks", enyo.json.stringify(this.bookmarks));
	},
	setupRow: function(inSender, inIndex) {
		if (this.bookmarks[inIndex]) {
			this.$.title.setContent(this.bookmarks[inIndex].title);
			this.$.url.setContent(this.bookmarks[inIndex].url);
			return true;
		}
	},
	deleteBookmark: function(inSender, inIndex) {
	    this.bookmarks.splice(inIndex, 1);
	    this.$.bookmarksList.refresh();
	    localStorage.setItem("com.webos.meetups.bookmarks", enyo.json.stringify(this.bookmarks));
	},
	bookmarksItemClick: function(inSender, inEvent) {
		this.log("Selected bookmark ", inEvent.rowIndex, " with URL ", this.bookmarks[inEvent.rowIndex].url);
		this.$.Browser.updateUrl(this.bookmarks[inEvent.rowIndex].url);
	}
});