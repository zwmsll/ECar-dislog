// Dialog 实例

var Dialog = Class.create({
	
	initAttrs:function(_con){
		Attribute.initAttrs.call(this,_con);
	},
	
	attrs : {
		// 基本属性
		successFun:function(){},
		
		closeFun:function(){},
		
		//模板
		template: '<div class="{{classPrefix}}" style="visibility:hidden;" id="{{classPrefix}}-id"><a class="{{classPrefix}}-close" title="Close" href="javascript:;" data-role="close"></a><div class="{{classPrefix}}-content" data-role="content"></div></div>',
		
		// 统一样式前缀
		classPrefix: 'ui-dialog',

		// 指定内容元素，可以是 url 地址
		content: '',
		
		//触发事件
		trigger:null,

		// 是否有背景遮罩层
		hasMask: true,

		// 关闭按钮可以自定义
		closeTpl: '×',

		// 默认宽度
		width: 400,

		// 默认高度
		height: null,

		// 不用解释了吧
		zIndex: 999,

		// 默认定位左右居中，略微靠上
		align: {
			selfXY: ['50%', '50%'],
       		baseXY: ['50%', '42%'],
			baseElement: Position.VIEWPORT,
		}
	},
	
	initialize: function(config) {

		// 初始化 attrs
		//Dialog.superclass.initialize.call(this,  config);
		this.initAttrs(config);
		
		// 初始化 element
		this.parseElement();
		
		//初始化
		this.setup();
		
	},
	// 构建 this.element
	parseElement: function() {
	  
		var i,attrs,template,reg;
		
		attrs = this.attrs;
		template = attrs.template;
		
		//生成模板
		for(i in attrs){
			reg = new RegExp("{{"+i+"}}","g");
			template = template.replace(reg,attrs[i]);
		}
		
		$('body').append(template);
		this.element = $('#'+attrs.classPrefix+'-id');
		
		//添加样式
		for(i in attrs){
			this.element.css(i,this.attrs[i]);
		}
		this.element.find('[data-role=content]').css('height','100%');
		
  	},
	addContent:function(){
	  
		var attrs = this.attrs;
		this.element.find('[data-role=content]').html(attrs.content);
		this.element.find('[data-role=close]').html(attrs.closeTpl);
	  
  	},
  	setup:function(){
	  	
		//填充内容
		this.addContent();
		this.setupMask();
		this.setupPosition();
		this.eventFun();
		
	},
	setupMask:function(){
		var attrs = this.attrs;
		
		if(attrs.hasMask){
			this.mask = mask(attrs.classPrefix,attrs.zIndex);
		}
	},
	setupPosition:function(){
		
		var attrs = this.attrs,align=attrs.align;
		Position.pin(
			{ element: this.element, x: align.selfXY[0], y: align.selfXY[1] }, 
			{ element: Position.VIEWPORT, x: align.baseXY[0], y: align.baseXY[1] }
		);
		
	},
	show:function(){
		this.mask.show();
		this.element.css('visibility','visible');
		this.attrs.successFun.call();
	},
	hide:function(){
		this.mask.hide();
		this.element.css('visibility','hidden');
		this.attrs.closeFun.call();
	},
	events:{
		'click     [data-role=close]': function (e) {
		  e.preventDefault();
		  this.hide();
		}
	},
	eventFun:function(){
		var _this = this,eventAttr;
		if(this.attrs.trigger != null && $(this.attrs.trigger).length>0){
			$(this.attrs.trigger).on('click',function(){
										 _this.show();
										 });
		};
		
		//绑定事件
		for(var ev in this.events){
			(function(ev,events,_this){
				eventAttr = ev.split(/ +/);
				$(eventAttr[1]).on(eventAttr[0],function(e){
					events[ev].call(_this,e);
				});
			})(ev,this.events,this);
			
		}
		
	}
});
