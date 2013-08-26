(function($) {  
    $.fn.cssSkeleton = function(html, options) {  
        var defaults = {  
            level: 'strict',
            includeParent: 'true'
        },  
        options = $.extend(defaults, options);  
        
        var $cssSkeleton = this;
        var $this = $(this);  
        var $results = [];
        
        var $ignoredTags = ['br'];
        
        if(html != undefined) {
            this.parse(html);
        }
        
        this.parse = function(myHTML) {
            html = myHTML.replace(/[\n\r\t]/g, '').replace(/^.*?<body[^>]*>(.*?)<\/body>.*?$/i,"$1");
            
            $results = [];
            parseTheDOM();
        };
        
        this.getResults = function() {
            var formatted_results = '';
            
            $.each($results, function(key, value) {
                formatted_results = formatted_results + value + ' {\n}\n\n';
            });
            return formatted_results;
        }

        function getThisElement(element) {
            //console.log(element.prop("nodeName").toLowerCase());
            var tagName = element.prop("nodeName").toLowerCase();
            if(element.attr('id') !== undefined) {
                var eleID = element.attr('id');
                if($.inArray(eleID, $results) == -1) {
                    $results.push('#' + eleID);
                } else {
                    console.log('dont use duplicate ids!');
                }
            } else {
                if($.inArray(tagName, $ignoredTags) == -1) {
                    if(element.attr('class') !== undefined) {
                        var classes = element.attr('class');
                        var classArr = classes.split(' ');
                        $.each(classArr, function() {
                            tagName = tagName + '.' + this;
                        });
                    }
                    var foundParentId = false;
                    var tempElement = element;
                    while(foundParentId === false) {
                        if(tempElement.parent().length > 0) {
                            var tempParent = tempElement.parent();
                            if(tempParent.attr('id') !== undefined) {
                                tagName = '#' + tempParent.attr('id') + ' ' + tagName;
                                foundParentId = true;
                            } else {
                                var parentTagName = tempParent.prop("nodeName").toLowerCase();
                                if(tempParent.attr('class') !== undefined) {
                                    var classes = tempParent.attr('class');
                                    var classArr = classes.split(' ');
                                    $.each(classArr, function() {
                                        parentTagName = parentTagName + '.' + this;
                                    });
                                }
                                tagName = parentTagName + ' ' + tagName;
                                tempElement = tempParent;
                            }
                        } else {
                            foundParentId = true;
                        }
                    }
                    if($.inArray(tagName, $results) == -1) {
                        $results.push(tagName);
                    }
                }
            }
        }
        
        function getChildren(element) {
            $(element).children().each(function() {
                //console.log($(this).prop("nodeName").toLowerCase());
                getThisElement($(this));
                getChildren($(this));
            });
        }
        
        //Private function
        function parseTheDOM() {
          html = "<div>" + html + "</div>";
          getChildren($(html));
        }

        return this;
    }  
})(jQuery);