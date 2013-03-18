// https://autopagerize.jottit.com/how_to_write_siteinfo_%28ja%29
// http://web.archive.org/web/20100227073223/http://tokyoenvious.xrea.jp/b/javascript/xpath_finder.html

/*
     FILE ARCHIVED ON 16:18:36 四月 3, 2007 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 0:35:01 三月 18, 2013.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
// XPathFinder.js
//  by motormean <motormean@s58.xrea.com>
// ver 0.1

var XPathFinder = 
{
	findBar: null,
	finderInput: null,
	alwaysUseAsContext: null,

	lastXPathQuery: null,

	lastFoundNode: null,
	foundNodes: null,
	nodeIndex: 0,
	ignoredNodes: null,

	contextNode: null,

	init: function()
	{
		XPathFinder.findBar = document.createElement('div');
		with (XPathFinder.findBar)
		{
			setAttribute('id', 'XPathFinder-findBar');
			style.fontSize = 'smaller';
			style.backgroundColor = 'infobackground';
			style.position = 'fixed';
			style.top = '0';
			style.left = '0';
			style.margin = '0';
			style.width = '100%';
			style.borderBottom = '2px solid';
			style.padding = '2px';
			innerHTML = '<input type="text" id="XPathFinder-input" style="width: 40%;" onkeydown="XPathFinder.checkKey(event);"><button onclick="XPathFinder.findNext();">XPath Search</button> <input type="checkbox" id="XPathFinder-always"><label for="XPathFinder-always">always</label></input> <button onclick="XPathFinder.setContextNode();">use the found node as context node</button>';
			addEventListener(
				'click',
				function(aEvent)
				{
					if (aEvent.target.id == 'XPathFinder-findBar')
						XPathFinder.closeFindBar();
				},
				true
			);
		}
		document.body.appendChild(XPathFinder.findBar);
		XPathFinder.finderInput = document.getElementById('XPathFinder-input');
		XPathFinder.alwaysUseAsContext = document.getElementById('XPathFinder-always');
		XPathFinder.finderInput.focus();
	},

	startFind: function(aQuery)
	{
		try {
			XPathFinder.foundNodes = 
				document.evaluate(
					aQuery,
					XPathFinder.contextNode || document,
					null,
					XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
					null
				);
		}
		catch (e)
		{
			return false;
		}
		XPathFinder.nodeIndex = 0;
		XPathFinder.lastXPathQuery = aQuery;
		XPathFinder.ignoredNodes = new Object();
		return true;
	},

	findNext: function()
	{
		if (XPathFinder.lastFoundNode)
			XPathFinder.toggleHighlight(XPathFinder.lastFoundNode);
		if (XPathFinder.alwaysUseAsContext.checked)
			XPathFinder.setContextNode();
		if (!XPathFinder.foundNodes || XPathFinder.lastXPathQuery != XPathFinder.finderInput.value)
			if (!XPathFinder.startFind(XPathFinder.finderInput.value))
				return;

		var found = XPathFinder.foundNodes.snapshotItem(XPathFinder.nodeIndex);
		while (XPathFinder.checkComponent(XPathFinder.nodeIndex++))
		{
			if (XPathFinder.ignoredNodes.length == XPathFinder.foundNodes.snapshotLength)
				return;
			if (XPathFinder.nodeIndex > XPathFinder.foundNodes.snapshotLength - 1)
				XPathFinder.nodeIndex = 0;
			found = XPathFinder.foundNodes.snapshotItem(XPathFinder.nodeIndex);
		}

		XPathFinder.toggleHighlight(XPathFinder.lastFoundNode = found);
		XPathFinder.scrollTo(found);
		if (XPathFinder.nodeIndex > XPathFinder.foundNodes.snapshotLength - 1)
			XPathFinder.nodeIndex = 0;
	},

	setContextNode: function()
	{
		XPathFinder.contextNode = XPathFinder.lastFoundNode;
		XPathFinder.startFind(XPathFinder.finderInput.value);
	},

	scrollTo: function(aNode)
	{
		var left = 0;
		var top = 0;
		while (aNode)
		{
			left += aNode.offsetLeft;
			top += aNode.offsetTop;
			aNode = aNode.offsetParent;
		}
		window.scrollTo(left, top - XPathFinder.findBar.offsetHeight - 10);
	},

	checkKey: function(aEvent)
	{
		if (aEvent.keyCode == 13 || aEvent.keyCode == 114)
			XPathFinder.findNext();
		else if (aEvent.keyCode == 27)
			XPathFinder.closeFindBar();
	},

	closeFindBar: function(aEvent)
	{
		XPathFinder.toggleHighlight(XPathFinder.lastFoundNode);
		document.body.removeChild(XPathFinder.findBar);
	},

	toggleHighlight: function(aElement)
	{
		if (!aElement || !aElement.style)
			return;

		if (aElement.__XPathFinder_SavedBackgroundColor != undefined)
		{
			aElement.style.backgroundColor = aElement.__XPathFinder_SavedBackgroundColor;
			delete aElement.__XPathFinder_SavedBackgroundColor;
		}
		else
		{
			aElement.__XPathFinder_SavedBackgroundColor = aElement.style.backgroundColor;
			aElement.style.backgroundColor = 'yellow';
		}
	},

	checkComponent: function(aIndex)
	{
		if (XPathFinder.ignoredNodes[aIndex])
			return true;

		var aNode = XPathFinder.foundNodes.snapshotItem(aIndex);
		for (; aNode && aNode != document.body; aNode = aNode.parentNode)
		{
			if (aNode.id == 'XPathFinder-findBar')
			{
				XPathFinder.ignoredNodes[aIndex] = aNode;
				return true;
			}
		}
		return false;
	}
};

XPathFinder.init();
