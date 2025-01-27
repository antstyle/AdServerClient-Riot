var checkComponentViewability = {
  init: function() {
    this.on('updated', function() { console.log('Updated!') })
  },
  checkViewability: function () { 
    console.log(this.parent)
    window.addEventListener("scroll",this.logViewability, false)
  },
  logViewability: function(evt){
    var viewability = this.getElementViewability(evt),
      viewable = (viewability.visibleArea / viewability.totalArea) >= 0.5;
    if(viewable)
      console.log(viewable, " : ",  viewability)
  },
  getElementViewability: function (evt) {
    var el = this.root;
    try {
      rect = el.getBoundingClientRect();
    } catch (e) {
      return { visible: false, totalArea: 0, visibleArea: 0 };
    }
    // protection for old browsers
    if (!rect.width)
      rect.width = el.offsetWidth;
    if (!rect.height)
      rect.height = el.offsetHeight
    var win = window,
      winHeight = win.innerHeight,
      winWidth = win.innerWidth,
      visibleHeight = 0,
      visibleWidth = 0;
    if (rect.top >= 0) {
      if (rect.bottom > winHeight)
        visibleHeight = rect.height - (rect.bottom - winHeight);
      else
        visibleHeight = rect.height;
    } else
      visibleHeight = rect.height + rect.top;
    if (rect.left >= 0) {
      if (rect.right > winWidth)
        visibleWidth = rect.width - (rect.right - winWidth);
      else
        visibleWidth = rect.width;
    } else {
      if (rect.right > winWidth)
        visibleWidth = rect.width - (rect.right - winWidth);
      visibleWidth += (rect.width + rect.left);
    }
    var visibleArea = 0;
    if (visibleWidth > 0 && visibleHeight > 0)
      visibleArea = visibleWidth * visibleHeight;
    var visible = visibleArea > 0 ||
      (((rect.top >= 0 && rect.top <= winHeight) || (rect.bottom >= 0 && rect.bottom <= winHeight))
        &&
        ((rect.left >= 0 && rect.left <= winWidth) || (rect.right >= 0 && rect.right <= winWidth))) ||
      ((typeof evt != "undefined" && typeof evt.target != "undefined" && typeof evt.target.scrollingElement != "undefined")
        &&
        (evt.target.scrollingElement.scrollTop + window.innerHeight >= rect.top
          && evt.target.scrollingElement.scrollTop + window.innerHeight <= rect.top + window.innerHeight
          && evt.target.scrollingElement.scrollTop - window.innerHeight < rect.top)
        &&
        (evt.target.scrollingElement.scrollLeft + window.innerWidth >= rect.left
          && evt.target.scrollingElement.scrollLeft + window.innerWidth <= rect.left + window.innerWidth
          && evt.target.scrollingElement.scrollLeft - window.innerWidth < rect.left)
        && el.offsetHeight == 0);
    return {
      visible: visible,
      totalArea: rect.width * rect.height,
      visibleArea: visibleArea
    };
  }
}
riot.tag2('sample', '<div class="{opts.wrapper}"> <h3>{message}</h3> {none} <ul> <li each="{techs}"> {name}</li> </ul> <viewability></viewability> <yield from="content"> {html} </yield> </div>', 'sample,[riot-tag="sample"],[data-is="sample"]{ font-size: 1em } sample h3,[riot-tag="sample"] h3,[data-is="sample"] h3{ background: blue !important; } sample h3.old,[riot-tag="sample"] h3.old,[data-is="sample"] h3.old{ background:red !important; }', '', function(opts) {
    this.none = this.content;
    if(opts.wrapperclass)
      this.wrapperClass = opts.wrapper
    else
      this.wrapperClass = "sidebar-top"
    if(opts.list)
      this.message = opts.message
    else
      this.message = 'Hello, Riot!'
    if(opts.list)
      this.techs = opts.list
    else
      this.techs = [
        { name: 'HTML' },
        { name: 'JavaScript' },
        { name: 'CSS' }
      ]
      this.on("load",function(){ alert() })
      var viewability = this.mixin(checkComponentViewability)
      viewability.checkViewability()
});