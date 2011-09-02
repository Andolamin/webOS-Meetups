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
	name: "AboutView",
	kind: "enyo.Control",
	className: "about solidBackground",
	events: {
		onClose: ""
	},
	components: [
		{kind: "enyo.VFlexBox", className: "enyo-fit solidBackground", width: "100%", components: [
			{name: "header", kind: "PageHeader", style: "max-height: 54px", components: [
				{kind: "Button", caption: "Back", style: "margin-top: -6px;", onclick: "handleBackButton"},
				{kind: "VFlexBox", flex: 1, align: "center", components: [
					{content: "About"}
				]}
			]},
			{name: "generalScroller", kind: "enyo.Scroller", autoHorizontal: false, horizontal: false, width: "100%", flex: 1, components: [
				{kind: "enyo.HFlexBox", components: [
					{width: "15%"},
					{kind: "enyo.VFlexBox", width: "70%", flex: 1, components: [
						{kind: "enyo.RowGroup", caption: $L("About this app"), components: [
							{content: 'This application was developed by Alan Stice of Associative Intelligence Software in coordination with Rich Dunbar of webOSroundup. The community is a very important part of what makes webOS great and we hope that you will make it to some of the events. Tell your friends about this application, too!', allowHTML: true}
						]},
						{kind: "enyo.RowGroup", caption: $L("About the developers"), components: [
							{content: 'Alan Stice develops under the name Associative Intelligence Software (or AIS). He has developed a study application for the Japanese Language in the TouchPad app catalog with many more applications on the way. You can find his study application <a href="http://developer.palm.com/appredirect/?packageid=com.astice.japanesestudytools">here</a>.<br/><br/>Rich is a community leader most known for his work on getting the Pre 2 running on Sprint and his contributions to webOSroundup. You can find his bio <a href="http://www.webosroundup.com/about/">here</a>.', allowHTML: true}
						]},
						{kind: "enyo.RowGroup", caption: $L("Need help?"), components: [
							{content: 'Find a bug? Have a suggestion? If you have any problems please email <a href="mailto:support@associativeintelligence.org?subject=Meetups Support">support@associativeintelligence.org</a>.', allowHTML: true}
						]},
						{kind: "Button", caption: $L("Done"), onclick: "handleBackButton"},
						{kind: "enyo.Control", style: "height: 15px;"}
					]},
					{width: "15%"}
				]}	
			]}	
		]}
	],
	handleBackButton: function(inSender, inEvent) {
		this.doClose();
		this.$.generalScroller.setScrollTop(0);
	}
});