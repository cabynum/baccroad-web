/*
* Copyright (C) 2009 Joel Sutherland
* Licenced under the MIT license
* http://www.newmediacampaigns.com/page/jquery-flickr-plugin
*
* Available tags for templates:
* title, link, date_taken, description, published, author, author_id, tags, image*

* ********************************************************
* Further modifications by Rahisi Themes 2014.
  --------------------------------------------------------
  - Added data attributes support
  - Added grid output
  ********************************************************
*/
(function($) {
	$.fn.jflickrfeed = function(settings, callback) {
		settings = $.extend(true, {
			flickrbase: 'http://api.flickr.com/services/feeds/',
			feedapi: 'photos_public.gne',
			limit: 20,
			qstrings: {
				lang: 'en-us',
				format: 'json',
				jsoncallback: '?'
			},
			cleanDescription: true,
			useTemplate: true,
			itemTemplate: '',
			itemCallback: function(){}
		}, settings);

    /* Grab settings from data attributes if available
    -----------------------------------------------------*/
    var dataId = $(this).attr('data-userid');
    var dataLimit = $(this).attr('data-limit');
    var dataCols = $(this).attr('data-cols');
    var dataMargin = $(this).attr('data-margin');
    var el = this;
    var cell;
    
    if(!isNaN(dataLimit)) {
      settings.limit = parseInt(dataLimit);
    }
    
    if(dataId) {
      settings.qstrings.id = dataId;
    }

    if(!isNaN(dataCols)) {
    
      cols = parseInt(dataCols);
      var rowWidth;
      var pos;
      var unit="";
      cell = new Object();
      
      if (dataMargin.indexOf("%") != -1) {
      
        rowWidth = 100;
        pos = dataMargin.length - 1;
        unit="%";
        cell.margin = parseInt(dataMargin.substring(0, pos));
        cell.marginString = cell.margin + unit;
        cell.width = getColWidth(cols, cell.margin, rowWidth, unit);
        cell.widthString = cell.width + unit;

      }
      else if(dataMargin.indexOf("px") != -1) {
      
        rowWidth = $(this).parent().width();
        pos = dataMargin.length - 2;
        unit="px";
        cell.margin = parseInt(dataMargin.substring(0, pos));
        cell.marginString = cell.margin + unit;
        cell.width = getColWidth(cols, cell.margin, rowWidth, unit);
        cell.widthString = cell.width + unit;
      }
      else {

        rowWidth = 100;
        unit="%";
        cell.margin = parseInt(dataMargin);
        cell.marginString = cell.margin + unit;
        cell.width = getColWidth(cols, cell.margin, rowWidth, unit);
        cell.widthString = cell.width + unit;
      
      }

      var gridStyles = ".flickr-grid { display:block; list-style:none; padding:0; margin: 0;}"; 
      gridStyles += ".flickr-grid > li { display:block; float: left} ";
      gridStyles += ".flickr-grid > li img { width:100%; height:auto; line-height:1; display:block} ";
      $("<style>").prop("type", "text/css").html(gridStyles).appendTo("head");
      
      $(this).addClass('flickr-grid');
    
      cell.style = "width:" + cell.widthString + "; margin:0 " + cell.marginString + " " + cell.marginString + " 0; }";
      cell.lastStyle = "width:" + cell.widthString + "; margin:0 0 " + cell.marginString + " 0; }";
     
    }
    
		var url = settings.flickrbase + settings.feedapi + '?';
		var first = true;

		for(var key in settings.qstrings){
			if(!first)
				url += '&';
			url += key + '=' + settings.qstrings[key];
			first = false;
		}

		return $(this).each(function(){
			var $container = $(this);
			var container = this;
			$.getJSON(url, function(data){
				$.each(data.items, function(i,item){
					if(i < settings.limit){
					
						// Clean out the Flickr Description
						if(settings.cleanDescription){
							var regex = /<p>(.*?)<\/p>/g;
							var input = item.description;
							if(regex.test(input)) {
								item.description = input.match(regex)[2]
								if(item.description!=undefined)
									item.description = item.description.replace('<p>','').replace('</p>','');
							}
						}
						
						// Add Image Sizes
						// http://www.flickr.com/services/api/misc.urls.html
						item['image_s'] = item.media.m.replace('_m', '_s');
						item['image_t'] = item.media.m.replace('_m', '_t');
						item['image_m'] = item.media.m.replace('_m', '_m');
						item['image'] = item.media.m.replace('_m', '');
						item['image_b'] = item.media.m.replace('_m', '_b');
						delete item.media;
						
						// Use Template
						if(settings.useTemplate){
							var template = settings.itemTemplate;
							for(var key in item){
								var rgx = new RegExp('{{' + key + '}}', 'g');
								template = template.replace(rgx, item[key]);
                
							}
              
              if(cell) {
                if( (i + 1) % cols == 0) {
                  template = template.replace("item_style", cell.lastStyle);
                } else {
                  template = template.replace("item_style", cell.style);
                }
              }
							$container.append(template)
              
						}
						
						//itemCallback
						settings.itemCallback.call(container, item);
					}
				});
				if($.isFunction(callback)){
					callback.call(container, data);
				}
			});
		});
	}
})(jQuery);

function getColWidth(cols, margin, rowWidth, unit) {

  var cw = (rowWidth - (margin * (cols-1))) / cols;
  
  if(unit=="px") {
    return Math.floor(cw);
  }else {
    return +(Math.round(cw + "e+2")  + "e-2");
  }

}

