$.fn.make2048 = function(option){
  var defaultOption = {
    width: 4,
    height: 4,
    style:{
      background_color:"rgb(184,175,158)",
      block_background_color:"rgb(204,192,178)",
      padding: 18,
      block_size: 40,
      block_style:{
        "font-family": "微软雅黑",
        "font-weight": "bold",
        "text-align": "center"
      }
    },
    blocks:[
      {level: 0, value: 2, style:{ "background-color": "rgb(238,228,218)", "color":"rgb(124,115,106)", "font-size": 48 }},
      {level: 1, value: 4, style:{ "background-color": "rgb(236,224,200)", "color":"rgb(124,115,106)", "font-size": 48 }},
      {level: 2, value: 8, style:{ "background-color": "rgb(242,177,121)", "color":"rgb(255,247,235)", "font-size": 48 }},
      {level: 3, value: 16, style:{ "background-color": "rgb(245,149,99)", "color":"rgb(255,250,235)", "font-size": 34 }},
      {level: 4, value: 32, style:{ "background-color": "rgb(244,123,94)", "color":"rgb(255,247,235)", "font-size": 34 }},
      {level: 5, value: 64, style:{ "background-color": "rgb(247,93,59)", "color":"rgb(255,247,235)", "font-size": 34 }},
      {level: 6, value: 128, style:{ "background-color": "rgb(236,205,112)", "color":"rgb(255,247,235)", "font-size": 16 }},
      {level: 7, value: 256, style:{ "background-color": "rgb(237,204,97)", "color":"rgb(255,247,235)", "font-size": 16 }},
      {level: 8, value: 512, style:{ "background-color": "rgb(236,200,80)", "color":"rgb(255,247,235)", "font-size": 16 }},
      {level: 9, value: 1024, style:{ "background-color": "rgb(237,197,63)", "color":"rgb(255,247,235)", "font-size": 10 }},
      {level: 10, value: 2048, style:{ "background-color": "rgb(238,194,46)", "color":"rgb(255,247,235)", "font-size": 10 }},
      {level: 11, value: 4096, style:{ "background-color": "rgb(61,58,51)", "color":"rgb(255,247,235)", "font-size": 10 }}
    ],
    animateSpeed: 200
  }  
  option = $.extend({}, defaultOption, option);
  console.log("游戏的配置为", option)

  if(this.length > 1) throw "一次只能开始一个游戏";
  if(this.length == 0) throw "未找到游戏容器";

  var $this = $(this[0]);
  $this.css({
    "background-color": option.style.background_color,
    "border-radius": option.style.padding,
    "position": "relative",
    "-webkit-user-select": "none",
    "margin":"0 auto"
  })

  var state = [];

  var getPosition = function(x, y){
    return {
      top: option.style.padding + y * (option.style.padding + option.style.block_size),
      left: option.style.padding + x * (option.style.padding + option.style.block_size)
    }
  }

  var getCoordinate = function(index){
    return {
      x: index % option.width,
      y: Math.floor(index / option.width)
    }
  }

  var getEmptyBlockIndexs = function(){
    var emptyBlockIndexs = []
    $(state).each(function(i, o){
      if(o == null) emptyBlockIndexs.push(i);
    })
    return emptyBlockIndexs;
  }

  var getIndex = function(x, y){
    return x + y * option.width;
  }

  var getBlock = function(x, y){
    return state[getIndex(x, y)];
  }

  var buildBackground = function(){
    var backgrounds = [];
    for(var x=0; x<option.width; x++){
      for(var y=0; y<option.height; y++){
        state.push(null);
        var bg_block = $('<div></div>');
        var position = getPosition(x, y);
        bg_block.css({
          "width": option.style.block_size,
          "height": option.style.block_size,
          "background-color": option.style.block_background_color,
          "position": "absolute",
          "top": position.top,
          "left": position.left
        })
        backgrounds.push(bg_block)
      }
    }
    $this.append(backgrounds);
    $this.width((option.style.block_size + option.style.padding) * option.width + option.style.padding);
    $this.height((option.style.block_size + option.style.padding) * option.height + option.style.padding);
  }

  var buildBlock = function(level, x, y){
    var emptyBlockIndexs = getEmptyBlockIndexs();
    console.log(emptyBlockIndexs);//获取正确
    if(emptyBlockIndexs.length == 0) return false;
    var putIndex;
    if(x != undefined && y != undefined){
      putIndex = getIndex(x, y)
    }else{
      putIndex = emptyBlockIndexs[Math.floor(Math.random() * emptyBlockIndexs.length)];
    }

    if(state[putIndex] != null) throw "已经有块存在"
    var block;
    if(level == undefined){
      block = Math.random() >= 0.5 ? option.blocks[0] : option.blocks[1];
    }else{
      block = $.extend({}, option.blocks[level]);
    }
    var coordinate = getCoordinate(putIndex);
    var position = getPosition(coordinate.x, coordinate.y);
    var blockDom = $('<div></div>');
    blockDom.addClass("block_" + coordinate.x + "_" + coordinate.y);




    console.log("block_" + coordinate.x + "_" + coordinate.y);//位置是对的
    blockDom.css($.extend(option.style.block_style,{
      "position": "absolute",
      "top": position.top + option.style.block_size / 2,
      "left": position.left + option.style.block_size / 2,
      "line-height": option.style.block_size + "px",
      "width": 0,
      "height": 0,
    }, block.style))
    
    $this.append(blockDom);
    state[putIndex] = block;

    blockDom.animate({
      "width": option.style.block_size,
      "height": option.style.block_size,
      "top": position.top,
      "left": position.left
    }, option.animateSpeed , (function(blockDom){
      return function(){
		  blockDom.html(block.value);
	  }
    })(blockDom))

    if(emptyBlockIndexs.length == 1){
      var canMove = false;
      for(var x=0; x<option.width-1 && !canMove; x++) {
        for(var y=0; y<option.height-1 && !canMove; y++){
          if(x > 0 && state[getIndex(x - 1, y)].value == state[getIndex(x, y)].value){
            canMove = true; 
          }
          if(x < option.width && state[getIndex(x + 1, y)].value == state[getIndex(x, y)].value){
            canMove = true;
          }
          if(y > 0 && state[getIndex(x, y - 1)].value == state[getIndex(x, y)].value){
            canMove = true;
          }
          if(y < option.height && state[getIndex(x, y + 1)].value == state[getIndex(x, y)].value){
            canMove = true;
          }
        }
      }
      if(!canMove){
        gameEnd();
        return false;
      }
    }

    return true;
  }

  var lastMovedTime = 0;
  var move = function(direction){
    if(new Date() - lastMovedTime < option.animateSpeed + 20) return;
    lastMovedTime = new Date();
    var startX,startY,endX, endY, modifyX,modifyY;
    var doActioned = false;
    switch(direction){
      case "up":
        startX = 0;
        endX = option.width - 1;
        startY = 1;
        endY = option.height - 1;
        modifyX = 0;
        modifyY = -1;
        break;
      case "down":
        startX = 0;
        endX = option.width - 1;
        startY = option.height - 2;
        endY = 0;
        modifyX = 0;
        modifyY = 1;
        break;
      case "left":
        startX = 1;
        endX = option.width - 1;
        startY = 0;
        endY = option.height - 1;
        modifyX = -1;
        modifyY = 0;
        break;
      case "right":
        startX = option.width - 2;
        endX = 0;
        startY = 0;
        endY = option.height - 1;
        modifyX = 1;
        modifyY = 0;
        break;
    }
    for(var x = startX; x <= Math.max(startX, endX) && x >= Math.min(startX, endX); endX > startX ? x++ : x--){
      for(var y = startY; y <= Math.max(startY,endY) && y >= Math.min(startY, endY); endY > startY ? y++ : y--){
        var block = getBlock(x, y);
        if(block == null) continue;
        var target_coordinate = {x:x, y:y};
        var target_block;
        var moved = 0;
        do{
          if(++moved > Math.max(option.width, option.height)) break;
          target_coordinate.x += modifyX;
          target_coordinate.y += modifyY;
          target_block = getBlock(target_coordinate.x, target_coordinate.y);
          if(direction == "up" || direction == "down"){
            if(target_coordinate.y == 0 || target_coordinate.y == option.height - 1) break;
          }
          if(direction == "left" || direction == "right"){
            if(target_coordinate.x == 0 || target_coordinate.x == option.width - 1) break;
          }
        }while(target_block == null)

        var blockDom = $(".block_" + x + "_" + y);
        
        if(target_block == null){
          var position = getPosition(target_coordinate.x, target_coordinate.y);
          state[getIndex(x, y)] = null;
          state[getIndex(target_coordinate.x, target_coordinate.y)] = block;
          blockDom.removeClass();
          blockDom.addClass("block_" + target_coordinate.x + "_" + target_coordinate.y)
          blockDom.animate({
            "top": position.top,
            "left": position.left
          }, option.animateSpeed)
        }else if(target_block.value == block.value && !target_block.justModified){
          var position = getPosition(target_coordinate.x, target_coordinate.y);
          var updatedBlock = $.extend({}, option.blocks[block.level + 1]);
          if(updatedBlock.level == option.blocks.length - 1){
            gameEnd();
          }
          updatedBlock.justModified = true;
          state[getIndex(x, y)] = null;
          state[getIndex(target_coordinate.x, target_coordinate.y)] = updatedBlock;
          var target_blockDom = $(".block_" + target_coordinate.x + "_" + target_coordinate.y);
          blockDom.animate({
            "top": position.top,
            "left": position.left
          }, option.animateSpeed, (function(blockDom, target_blockDom, target_coordinate, updatedBlock){
            return function(){
              blockDom.remove();
              target_blockDom.html(updatedBlock.value);
              target_blockDom.css(updatedBlock.style);
            };
          }(blockDom, target_blockDom, target_coordinate, updatedBlock)))
        }else if(target_block.value != block.value || moved > 1){
          target_coordinate.x = target_coordinate.x - modifyX;
          target_coordinate.y = target_coordinate.y - modifyY;
          if(target_coordinate.x == x && target_coordinate.y == y) continue;
          var position = getPosition(target_coordinate.x, target_coordinate.y);
          state[getIndex(x, y)] = null;
          state[getIndex(target_coordinate.x, target_coordinate.y)] = block;
          blockDom.removeClass();
          blockDom.addClass("block_" + target_coordinate.x + "_" + target_coordinate.y)
          blockDom.animate({
            "top": position.top,
            "left": position.left
          }, option.animateSpeed)
        }else{
          continue;
        }
        doActioned = true;
      }
    }
    for(var x=0; x<option.width; x++){
      for(var y=0; y<option.height; y++){
        var block = getBlock(x, y);
        if(block == null) continue;
        delete block.justModified;
      }
    }
    if(doActioned) {
      buildBlock();
    }
  }

  var keyHandler = function(evt){
    switch(evt.which){
      case 38:
        move("up");
        break;
      case 40:
        move("down");
        break;
      case 37:
        move("left");
        break;
      case 39:
        move("right");
        break;
    }
    
  }

  var mouseStartPoint = null;
  var hasTouch = 'ontouchstart' in window,
    startEvent = hasTouch ? 'touchstart' : 'mousedown',
    moveEvent = hasTouch ? 'touchmove' : 'mousemove',
    endEvent = hasTouch ? 'touchend' : 'mouseup',
    cancelEvent = hasTouch ? 'touchcancel' : 'mouseup';

  var mouseHandler = function(evt){
    if(evt.type == "mousedown" && mouseStartPoint == null){
      mouseStartPoint = {x: evt.pageX, y: evt.pageY};
    }else if(evt.type == "touchstart" && mouseStartPoint == null){
      mouseStartPoint = {x: evt.originalEvent.touches[0].pageX, y: evt.originalEvent.touches[0].pageY};
    }
    if(evt.type == "mouseup"){
      var xDistance = evt.pageX - mouseStartPoint.x;
      var yDistance = evt.pageY - mouseStartPoint.y;
      if(Math.abs(xDistance) + Math.abs(yDistance) > 20){
        if(Math.abs(xDistance) >= Math.abs(yDistance)){
          if(xDistance > 0){
            move("right");
          }else{
            move("left");
          }
        }else{
          if(yDistance > 0){
            move("down");
          }else{
            move("up");
          }
        }
      }
      mouseStartPoint = null;
    }else if(evt.type == "touchend"){
      console.log(evt.originalEvent.changedTouches[0].pageY)
      var xDistance = evt.originalEvent.changedTouches[0].pageX - mouseStartPoint.x;
      var yDistance = evt.originalEvent.changedTouches[0].pageY - mouseStartPoint.y;
      if(Math.abs(xDistance) + Math.abs(yDistance) > 20){
        if(Math.abs(xDistance) >= Math.abs(yDistance)){
          if(xDistance > 0){
            move("right");
          }else{
            move("left");
          }
        }else{
          if(yDistance > 0){
            move("down");
          }else{
            move("up");
          }
        }
      }
      mouseStartPoint = null;
    }
  }
  var gameStart = function(){
    $(document).on("keydown",keyHandler);
    $(document).on(startEvent,mouseHandler);
    $(document).on(endEvent,mouseHandler);

    $this.html('');
    state = [];

    buildBackground();
    buildBlock();
    buildBlock();
    console.log("游戏开始");
  }

  var gameEnd = function(){
    $(document).off("keydown",keyHandler);
    $(document).off(startEvent,mouseHandler);
    $(document).off(endEvent,mouseHandler); 
    var score = 0;
    for(var i=0; i<state.length; i++){
      if(state[i] == null) continue;
      score += Math.pow(2, state[i].level + 1);
    }
    console.log("游戏结束, 您的分数为:", score);
    var $endMask = $("<div></div>");
    var $mask = $("<div></div>")
    $mask.css({
      "background-color": option.style.background_color,
      "border-radius": option.style.padding,
      "position": "absolute",
      "-webkit-user-select": "none",
      "opacity": 0.5,
      "width": $this.width(),
      "height": $this.height()
    })
    var $title = $("<h1>游戏结束</h1>");
    var $result = $("<p>您的分数为:" + score + "</p>");
    var $again = $("<button>再玩一次</button>");
    $again.click(function(evt){
      evt.preventDefault();
      gameStart();
    })
    var $content = $("<div></div>");
    $content.css({
      "width": "200px",
      "text-align": "center",
      "margin": "0 auto",
      "position": "absolute",
      "top": "50%",
      "transform": "translate(-50%, -50%)",
      "left": "50%",
      "padding": 10,
      "background-color": option.style.block_background_color
    })
    $endMask.append($mask)
    $content.append($title);
    $content.append($result);
    $content.append($again);
    $endMask.append($content);
    $this.append($endMask);
  }
  // $(".begin").on("click",function(evt){
  //     evt.preventDefault();
  //     gameStart();
  //   })
  gameStart();

  

  // var actionList = ["up", "down", "left", "right"];
  // for(var i=0; i<actionList.length; i++){
  //   setTimeout((function(action){
  //     return function(){
  //       move(action);
  //     }
  //   })(actionList[i]), i * 1000);
  // }

}
