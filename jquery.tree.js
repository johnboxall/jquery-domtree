;(function($) {

function curry(fn) {
    var args = Array.prototype.slice.call(arguments, 1);
    return function() {
        return fn.apply(window, args.concat(Array.prototype.slice.call(arguments,0))); 
    };
}

function truncate(s, _maxLength, _suffix) {
    var maxLength = _maxLength || $.tree.settings.truncateLength,
        suffix = _suffix || $.tree.settings.truncateSuffix;
    return s.length > maxLength ? s.substring(0, maxLength) + suffix : s;
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

    // Allow filtering of children.
    var $elementChildren = $.tree.settings.getChildren ? $.tree.settings.getChildren($element) : $element.children();
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
                    result.push(" " + attribute.nodeName+"=\"<span class='Red'>"+truncate(attribute.nodeValue)+"</span>\"");
                }
            }

            $html = $("<span class='Content'><span class='DarkBlue'>&#60;<span class='Blue'>" + this.tagName.toLowerCase() + '</span>' + result.join(" ") + "&#62;</span>").appendTo($link);            
            $subContainer = $("<div class='SubContainer'></div>").appendTo($container);
                        
            if ($children.length) {
                $link.addClass("Parent");
                $link.click(curry($.tree.settings.onClick, $self, $subContainer));
            } else {
                $html.append(truncate($self.html()) + "<span class='DarkBlue'>&#60;/<span class='Blue'>" + this.tagName.toLowerCase() + "</span>&#62;</span>");
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
    // Where to round the text.
    truncateLength: 50,
    truncateSuffix: "...",
    // Passed $element can filter / add whatever to children.
    // getChildren: 
    // Function to call when an element is clicked.
    onClick: displayTree,
    // Removes elements matching the expression from the set of tree children.
    // exclude: "",
}

})(jQuery);