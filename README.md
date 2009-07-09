jQuery DOM Tree
===============

Draws a FireBug like DOM Tree explorer.

        // context - what to draw the tree from
        // container - where to draw the tree
        $.tree(context, container)
        
        var superOnClick = $.tree.settings.onClick;
        
        $.tree.settings = {
            // Filter children to be displayed whenever a node is opened.
            getChildren: function($el) {
                return $el.children()
            },
            
            // Function to call whenever an element is clicked.
            onClick = function($context, $container) {
                console.log("You've selected:", $context);
                // Must call original onClick to open the tree.
                superOnClick($context, $container)
            }
        }
        
        
        
        
[Example](http://johnboxall.github.com/jquery-domtree/index.html)