var isMobile,
    windowWidth = $(window).width(),
    windowHeight = $(window).height(),
    page = $('body').attr('page');


$(window).load(function(){
    footerH = $('footer').height();
    //console.log(footerH);
    $('.footerbg').css('height',footerH);    

    $('.loading').fadeOut(500,function(){
        $(this).remove();
    });
});

$(document).ready(function(){
    getSize();
    updateRWDImg();

    menu_list();

    $(window).on('resize', function() {
		getSize();
        updateRWDImg();

        setTimeout(function(){
            footerH = $('footer').height();
            //console.log(footerH);
            $('.footerbg').css('height',footerH);  
        },500);
    });

    $(window).scroll(function(){
        if($(window).scrollTop()>50){
            $('header').addClass('scroll');
            $('.gotop').fadeIn();
        }else{
            $('header').removeClass('scroll');
            $('.gotop').hide();
        }
    });

    //logo act
    $('header .logo').click(function(){
        window.open('https://quakernutrition.sfworldwide.com/','_blank');
    })

    //menu開關
    $('.ham').click(function(){
        if(!$(this).hasClass('active')){
            $(this).addClass('active');
            $('.ham img').attr('src','img/menu_close.png');
            $('.menu').slideDown(600);
        }else{
            $(this).removeClass('active');
            $('.ham img').attr('src','img/menu_ham.png');
            $('.menu').slideUp(600);
        }
    });

    //gotop
    $('.gotop').click(function(){
        $('body,html').animate({
            scrollTop: 0
        },1200,'swing')
    });

    
});


function menu_list(){
    var menu = [
        //name:選單名稱, data:html檔案名稱
        {name:'首頁', data:'index', sub=''},
        {name:'全面照護Tips', data:'tips', sub=''},
        {name:'維持健康MUST', data:'must', sub=''},
        {name:'產品介紹', data='product', sub:[
                                {name:'營養照護', data='nutrition'},
                                {name:'糖尿病照護', data='diabetes_suitable'}]},
        {name:'Q&A學堂', data='qa', sub=''}
    ],
    m_length = menu.length;
    
    for(i=0; i<m_length; i++){
        $('.menu').append('<li>'+menu[i].name+'</li>');//menu list
        if(page==menu[i].data){
            $('.menu li').eq(i).addClass('active');
        }
       //console.log(menu[i].data.length);

       //子選單
        if(menu[i].sub.length > 0){
            sub_length = menu[i].sub.length;
            $('.menu li').eq(i).append('<ul class="sub"></ul>');
            for(s=0; s<sub_length; s++){
                $('.menu li').eq(i).children('.sub').append('<li>'+menu[i].sub[s].name+'</li>');
            }
        }
    }

    $('.menu>li').click(function(){
        index = $(this).index();
        //console.log(index);
        if(menu[index].sub.length == 0){
            window.open(menu[index].data+'.html','_self') ;
        }
    });

    $('.sub li').click(function(){
        index = $(this).parents('li').index();
        sub_index = $(this).index();
        window.open(menu[index].sub[sub_index].data+'.html','_self')
    })

}

function updateRWDImg() { 
    
	$('img').each(function($index) {
		var arrImg=$(this).attr('src').replace('-dt.','.').split('.');
		if ($(this).attr('md')==1) {
			$(this).attr('src',arrImg[0]+'-dt.'+arrImg[1]);
			if (isMobile) {	//部份圖片在手機上須更換圖 (只要在 img 中加入 md="1")
				$(this).attr('src',arrImg[0]+'.'+arrImg[1]);
			} else {
                $(this).attr('src',arrImg[0]+'-dt.'+arrImg[1],function(){
                    
                });
                
                
			}
		}
		if ($(this).attr('md')==0) {
			if (isMobile) {	//部份圖片在手機上須hidden (只要在 img 中加入 md="0")
				$(this).hide();
			} else {
				$(this).show();
			}
		}
	});
}



function getSize() {
    windowWidth = $(window).width();
    windowHeight = $(window).height();
    isMobile = (windowWidth < 767) ? true : false;

    if(isMobile){
        $('.menu').hide();
        $('.ham').removeClass('active');
        $('.ham img').attr('src','img/menu_ham.png');
        $('.menu').slideUp(600);
    }else{
        $('.menu').show();
    }

}

function GEvent(action) {   
    var tmpStr = action ;
    console.log(tmpStr);
    gtag('event', 'event_name', {
       'event_label': action,
       'event_action': action
    });
}