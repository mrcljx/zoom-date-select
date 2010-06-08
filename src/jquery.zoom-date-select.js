(function($){
  
  function ZoomDateGrid(select) {
    this.select = select;
    this.$grid = $('<table></table>').css({
      position: 'relative',
      zIndex: 10
    });
  }
  
  $.extend(ZoomDateGrid.prototype, {
    addRow: function(data) {
      var theGrid = this;
      var $row = $('<tr></tr>');
      for(i=0;i<7;i++) {
        var $cell = $('<td></td>').appendTo($row);
        var $link = $('<a></a>').attr({
          href: "#"
        }).text('a').click(function() {
          theGrid.select.switchTo(theGrid.select.generateGrid([], 3).getGrid());
          return false;
        }).appendTo($cell);
      }
      
      return $row.appendTo(this.$grid);
    },
    getGrid: function() {
      return this.$grid;
    }
  });
  
  function ZoomDateSelect(container) {
    this.$currentGrid = $();
    this.$nextGrid = $();
    this.$container = container;
    

    //this.switchTo(this.generateGrid([], 6).getGrid());
  }
  
  $.extend(ZoomDateSelect.prototype, {
    generateGrid: function(dataSource, height) {
      var grid = new ZoomDateGrid(this);
      var i;
      for(i=0;i<height;i++) {
        grid.addRow(dataSource[i])
      }
      return grid;
    },
    
    switchTo: function(newGrid) {
      var myself = this;
      this.$currentGrid.stop(true,true);
      var $wrapper = $('<div>').css({
        height: 0,
        overflow: 'display'
      }).appendTo(this.$container);
      this.$nextGrid = newGrid.appendTo($wrapper);
      
      this.$currentGrid.animate({
        scale: 0.01,
        opacity: 0 
      }, 500);
      
      this.$nextGrid.scale(10.0);
      
      var x = 4, y = 1;
      
      var rows = this.$nextGrid.find('tr');
      var cols = rows.slice(y,y+1).find('td');
      var targetCell = cols.slice(x,x+1);
      
      var w = 1.0 * cols.length;
      var h = 1.0 * rows.length;
      
      targetCell.css({
        opacity: 0
      }).animate({
        opacity: 1
      }, {
        easing: 'easeInExpo',
        duration: 500
      });
      
      var percentageX = Math.floor(((x + 0.5) * (1.0/w)) * 100);
      var percentageY = Math.floor(((y + 0.5) * (1.0/h)) * 100);
      var origin = ''+percentageX+'% '+percentageY+'%';

      this.$nextGrid.css({
        "-webkit-transform-origin": origin//,
        //opacity: 0
      }).animate({
        scale: 1,
        opacity: 1
      }, 500, function() {
        myself.afterSwitch(myself)
      });
    },
    
    afterSwitch: function(_this) {
      this.$currentGrid.remove();
      this.$currentGrid = this.$nextGrid;
      this.$nextGrid = $();
    }
    
  })
   
  $.fn.zoomDateSelect = function() {
    this.each(function() {
      var $this = $(this);
      var select = new ZoomDateSelect($this);
      select.switchTo(select.generateGrid([], 6).getGrid());
      $this.css({
        overflow: 'hidden',
        width: 300,
        height: 300,
        backgroundColor: '#eee'
      })
    });
  };
  
})(jQuery);