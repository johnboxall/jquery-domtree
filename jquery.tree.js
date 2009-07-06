;(function($) {

function curry(fn) {
    var args = Array.prototype.slice.call(arguments, 1);
    return function() {
        return fn.apply(window, args.concat(Array.prototype.slice.call(arguments,0))); 
    };
}

function displayAttribute(attribute) {
    var value = attribute.nodeValue;
    if (value.length > $.tree.settings.maximumAttributeValueLength) {
        value = value.substring(0, $.tree.settings.maximumAttributeValueLength) + '...';
    }
    return attribute.nodeName+"=\"<span class='Red'>"+value+"</span>\"";
}

function displayTree(_element, _parent) {
    var $element = $(_element),
        element = $element.get(0),
        $parent = $(_parent),
        parent = $parent.get(0);

    $parent.html("");

    if (parent.opened) {
        parent.opened = false;
        $parent.prev().removeClass("Open");
        $parent.removeClass("OpenSubContainer")
        return;
    } else {
        parent.opened = true;
        $parent.prev().addClass("Open");
        $parent.addClass("OpenSubContainer")
    }

    if (element == $.tree.context[0]) {
        $parent.append("<a class='Block'><span class='DarkBlue'>&#60;<span class='Blue'>" + element.tagName.toLowerCase() + "</span>&#62;</a>"); 
    }

    var $elementChildren = $element.children();
    if ($elementChildren.length) {
        $elementChildren.each(function() {
            var $self = $(this),
                $children = $self.children(),
                $container = $("<div class='Block'></div>").appendTo($parent),
                $link = $("<a class='Link'></a>").appendTo($container),
                $spacer = $("<span class='Spacer'></span>").appendTo($link),
                result = [];
    
            for (var i = 0, len = this.attributes.length; i < len; i++) {            
                var attribute = this.attributes[i];
                if (attribute.nodeName && attribute.nodeValue) {
                    result.push(displayAttribute(attribute));
                }
            }
            
            $html = $("<span class='Content'><span class='DarkBlue'>&#60;<span class='Blue'>" + this.tagName.toLowerCase() + '</span> ' + result.join(" ") + "&#62;</span>").appendTo($link);
            $subContainer = $("<div class='SubContainer'></div>").appendTo($container);
                        
            if ($children.length) {
                $link.addClass("Parent");
                // @@@ Add ability to call custom functions.
                $link.click(curry(displayTree, $self, $subContainer));
            } else {
                $html.append($self.html() + "<span class='DarkBlue'>&#60;/<span class='Blue'>" + this.tagName.toLowerCase() + "</span>&#62;</span>");
            }
        });
        
    }
    
    $parent.append("<a class='Block'><span class='DarkBlue'>&#60;/<span class='Blue'>" + element.nodeName.toLowerCase() + "</span>&#62;</a>");
    return false;
}

$.tree = function(_context, _container) {
    $.tree.context = $(_context);
    $.tree.container = $(_container);
    displayTree($.tree.context, $.tree.container);

}

$.tree.settings = {
    maximumAttributeValueLength: 50,
    onClick: null, 
    // onClick:         // what to do when an element is clicked (opened!)
    // context: ;       // what DOM structure to draw
    // container: ;     // where to draw it
}



})(jQuery);